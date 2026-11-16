const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta";
const MAX_AUDIO_BASE64_LENGTH = 3_300_000;
export const config = { maxDuration: 30 };
const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm", "audio/ogg", "audio/wav", "audio/mp4", "audio/mpeg",
  "audio/mp3", "audio/aac", "audio/flac", "audio/m4a",
]);

export async function analyzePronunciation(body, apiKey = process.env.GEMINI_API_KEY) {
  if (!apiKey) {
    return { status: 503, json: { error: "Chưa cấu hình dịch vụ AI cho kiểm tra phát âm." } };
  }

  const audioBase64 = typeof body?.audioBase64 === "string" ? body.audioBase64 : "";
  const mimeType = typeof body?.mimeType === "string" ? body.mimeType.split(";")[0].toLowerCase() : "";
  const expectedText = typeof body?.expectedText === "string" ? body.expectedText.trim() : "";

  if (!audioBase64 || audioBase64.length > MAX_AUDIO_BASE64_LENGTH) {
    return { status: 413, json: { error: "Bản ghi quá dài. Hãy thu lại câu ngắn hơn." } };
  }
  if (!ALLOWED_AUDIO_TYPES.has(mimeType)) {
    return { status: 415, json: { error: "Định dạng âm thanh trên trình duyệt này chưa được hỗ trợ." } };
  }
  if (!expectedText || expectedText.length > 300) {
    return { status: 400, json: { error: "Không tìm thấy câu mẫu để đối chiếu." } };
  }

  const prompt = `Bạn là giáo viên phát âm tiếng Nhật. Hãy đánh giá bản ghi âm của người học khi họ đọc câu mẫu sau:
${expectedText}

Hãy tự nghe bản ghi trước, tạo transcript tiếng Nhật theo đúng những gì bạn nghe được, rồi mới đối chiếu với câu mẫu. Trả về JSON thuần theo cấu trúc:
{"transcript":"...","score":0,"confidence":"low|medium|high","summary":"...","issues":[{"expected":"âm/mora chuẩn","heard":"âm nghe được","type":"âm dài/ngắn, âm đục, âm ngắt, trường âm hoặc nhịp đọc","feedback":"cách sửa ngắn gọn bằng tiếng Việt"}]}

Quy tắc:
- score là ước lượng độ rõ và độ chính xác phát âm từ 0 đến 100, không phải điểm chứng chỉ.
- Chỉ nêu lỗi có thể nghe thấy rõ trong âm thanh. Không suy đoán lỗi từ transcript hoặc câu mẫu.
- Nếu một đoạn không nghe đủ rõ, nói rõ trong summary và để confidence thấp; không bịa lỗi.
- Tối đa 4 issues. Nếu không nghe thấy lỗi rõ ràng, trả issues là [].
- Tập trung vào âm tiếng Nhật, mora, âm dài/ngắn, âm ngắt và phụ âm; không chấm ngữ điệu vùng miền.
- Không thêm markdown hay văn bản ngoài JSON.`;

  try {
    const models = [...new Set([
      process.env.GEMINI_PRONUNCIATION_MODEL,
      "gemini-3.8-flash",
      "gemini-2.5-flash",
    ].filter(Boolean))];
    let payload = {};
    let response = null;
    for (const model of models) {
      response = await fetch(`${GEMINI_API}/models/${model}:generateContent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: audioBase64 } },
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 700,
            responseMimeType: "application/json",
          },
        }),
      });
      payload = await response.json().catch(() => ({}));
      if (response.ok || (response.status !== 404 && !(response.status === 400 && /model|audio|unsupported/i.test(payload?.error?.message || "")))) break;
    }
    if (!response?.ok) {
      const message = payload?.error?.message || `Gemini HTTP ${response?.status || 502}`;
      return { status: response?.status || 502, json: { error: message.slice(0, 240) } };
    }

    const rawText = (payload?.candidates?.[0]?.content?.parts || []).map(part => part.text || "").join("");
    const parsed = JSON.parse(rawText.replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
    const confidence = ["low", "medium", "high"].includes(parsed.confidence) ? parsed.confidence : "low";
    const issues = Array.isArray(parsed.issues) ? parsed.issues.slice(0, 4).map(issue => ({
      expected: String(issue.expected || "").slice(0, 80),
      heard: String(issue.heard || "").slice(0, 80),
      type: String(issue.type || "Phát âm").slice(0, 80),
      feedback: String(issue.feedback || "").slice(0, 240),
    })) : [];
    return {
      status: 200,
      json: {
        transcript: String(parsed.transcript || "").slice(0, 300),
        score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
        confidence,
        summary: String(parsed.summary || "Chưa đủ dữ liệu để nhận xét.").slice(0, 400),
        issues,
      },
    };
  } catch (error) {
    console.error("Pronunciation assessment failed:", error);
    return { status: 502, json: { error: "Không phân tích được bản ghi. Hãy thử nói lại câu ngắn và rõ hơn." } };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { status, json } = await analyzePronunciation(req.body);
  return res.status(status).json(json);
}
