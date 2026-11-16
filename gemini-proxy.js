// Dịch request kiểu Anthropic (App.jsx đang dùng) -> Gemini generateContent,
// rồi trả về đúng dạng { content: [{ type:"text", text }] } để App.jsx không phải sửa.
// Tự dò model còn dùng được (nếu tên model bị Google đổi/ngừng thì không bị 404 nữa).
const API = "https://generativelanguage.googleapis.com/v1beta";
const PREFERRED = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.1-flash-lite"];
let cachedModel = null;

export function toGemini(body, withThinking = true) {
  const contents = (body.messages || []).map((m) => {
    const blocks = typeof m.content === "string" ? [{ type: "text", text: m.content }] : m.content || [];
    const parts = blocks.map((b) => {
      if (b.type === "image" && b.source?.type === "base64")
        return { inlineData: { mimeType: b.source.media_type, data: b.source.data } };
      return { text: b.text ?? "" };
    });
    return { role: m.role === "assistant" ? "model" : "user", parts };
  });
  const req = {
    contents,
    generationConfig: { maxOutputTokens: Math.max(body.max_tokens || 500, 256) },
  };
  if (withThinking) req.generationConfig.thinkingConfig = { thinkingBudget: 0 };
  if (body.system) req.systemInstruction = { parts: [{ text: body.system }] };
  return req;
}

export function fromGemini(data) {
  const cand = data?.candidates?.[0];
  const text = (cand?.content?.parts || []).map((p) => p.text || "").join("");
  return { content: [{ type: "text", text }], stop_reason: cand?.finishReason };
}

async function listCandidates(apiKey) {
  const r = await fetch(`${API}/models?pageSize=200`, { headers: { "x-goog-api-key": apiKey } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d?.error?.message || `ListModels HTTP ${r.status}`);
  const ids = (d.models || [])
    .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
    .map((m) => m.name.replace("models/", ""))
    // chỉ lấy bản ổn định, dạng text: gemini-<số>-flash hoặc -flash-lite
    .filter((id) => /^gemini-\d+(\.\d+)?-flash(-lite)?$/.test(id));
  const ver = (id) => parseFloat(id.match(/gemini-(\d+(\.\d+)?)/)[1]);
  ids.sort((a, b) => ver(b) - ver(a));
  return [...PREFERRED.filter((p) => ids.includes(p)), ...ids.filter((i) => !PREFERRED.includes(i))];
}

async function callModel(model, body, apiKey) {
  const send = (withThinking) =>
    fetch(`${API}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(toGemini(body, withThinking)),
    });
  let r = await send(true);
  let data = await r.json().catch(() => ({}));
  // một số model không nhận thinkingBudget -> thử lại không có
  if (r.status === 400 && /thinking/i.test(data?.error?.message || "")) {
    r = await send(false);
    data = await r.json().catch(() => ({}));
  }
  return { r, data };
}

export async function handleClaudeProxy(body, apiKey) {
  if (!apiKey) return { status: 500, json: { error: { message: "Thiếu GEMINI_API_KEY trong .env" } } };
  try {
    const tried = [];
    let models = cachedModel ? [cachedModel] : PREFERRED;
    for (let round = 0; round < 2; round++) {
      for (const model of models.slice(0, 4)) {
        const { r, data } = await callModel(model, body, apiKey);
        if (r.ok) {
          const out = fromGemini(data);
          if (!out.content[0].text)
            return { status: 502, json: { error: { message: "Gemini trả về rỗng (có thể bị bộ lọc an toàn chặn)" } } };
          cachedModel = model;
          return { status: 200, json: out };
        }
        tried.push(`${model}: ${r.status} ${data?.error?.message || ""}`.slice(0, 200));
        if (r.status !== 404) // lỗi khác 404 (key sai, 429...) thì dừng và báo thật
          return { status: r.status, json: { error: { message: data?.error?.message || `Gemini HTTP ${r.status}` } } };
      }
      if (round === 0) { // tất cả 404 -> hỏi Google xem model nào đang có
        cachedModel = null;
        models = await listCandidates(apiKey);
        if (!models.length) break;
      }
    }
    return { status: 404, json: { error: { message: "Không tìm được model Gemini dùng được. Đã thử: " + tried.join(" | ") } } };
  } catch (e) {
    return { status: 502, json: { error: { message: String(e) } } };
  }
}