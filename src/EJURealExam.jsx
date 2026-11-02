import React, { useState, useEffect } from "react";
import { EJU_SUBJECTS, EJU_GROUPS, EJU_ANSWER_PDF } from "./ejuData";

const HISTORY_KEY = "sp_eju_history";

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

// Phiên thi đang làm dở (để thoát / F5 rồi vào lại vẫn tiếp tục, đồng hồ dừng lúc thoát)
const SESSION_KEY = "sp_eju_session";

const loadSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    const sub = s && EJU_SUBJECTS.find((x) => x.key === s.subKey && x.available);
    if (!sub || s.submitted || typeof s.secondsLeft !== "number" || s.secondsLeft <= 0) return null;
    return s;
  } catch {
    return null;
  }
};

const saveSession = (data) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    /* bỏ qua lỗi lưu */
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* bỏ qua */
  }
};

const formatTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

// ══════════════════════════════════════════════════════════════
// TRANG CHỦ EJU: chọn môn
// ══════════════════════════════════════════════════════════════
export default function EJURealExam() {
  const [subKey, setSubKey] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [session, setSession] = useState(loadSession);

  const sub = subKey ? EJU_SUBJECTS.find((s) => s.key === subKey) : null;

  if (sub) {
    return (
      <ExamRoom
        key={sub.key}
        sub={sub}
        onExit={() => {
          setSubKey(null);
          setHistory(loadHistory());
          setSession(loadSession());
        }}
      />
    );
  }

  const readyCount = EJU_SUBJECTS.filter((s) => s.available).length;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px" }}>
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)",
          borderRadius: 24,
          padding: "36px 24px",
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 32,
          boxShadow: "0 10px 30px rgba(30, 27, 75, 0.28)",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 10px", color: "#FFFFFF" }}>
          Luyện Thi Thử EJU Trực Tuyến
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.6 }}>
          Đề thi gốc do JASSO (Japan Student Services Organization) công bố, làm bài trên phiếu trả lời
          giống phiếu thi thật, bấm giờ và chấm điểm tự động theo đáp án chính thức.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            📄 Đề PDF gốc JASSO
          </span>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            ✅ Đáp án chính thức
          </span>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            ⏱ Bấm giờ theo môn
          </span>
        </div>
      </div>

      {session && (() => {
        const ss = EJU_SUBJECTS.find((x) => x.key === session.subKey);
        const done = Object.values(session.answers || {}).filter((v) => String(v || "").length > 0).length;
        return (
          <div
            style={{
              background: "#FEF3C7",
              border: "1px solid #F59E0B",
              borderRadius: 16,
              padding: "14px 18px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: "#92400E", fontSize: 15 }}>
                ⏸ Bài đang làm dở: {ss.icon} {ss.vn}
              </div>
              <div style={{ fontSize: 13, color: "#B45309", marginTop: 2 }}>
                Đồng hồ đang tạm dừng ở {formatTime(session.secondsLeft)} · đã trả lời {done} ô
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setSubKey(session.subKey)}
                style={{ background: "#D97706", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}
              >
                ▶ Tiếp tục thi
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Bỏ bài đang làm dở? Đáp án và thời gian sẽ bị xóa.")) {
                    clearSession();
                    setSession(null);
                  }
                }}
                style={{ background: "transparent", color: "#92400E", border: "1px solid #D97706", borderRadius: 10, padding: "9px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Bỏ bài
              </button>
            </div>
          </div>
        );
      })()}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1E293B", margin: "0 0 6px" }}>Chọn môn thi</h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
          Hiện có {readyCount} môn sẵn sàng. Môn Tiếng Nhật (日本語) đang được bổ sung.
        </p>
      </div>

      {EJU_GROUPS.map((g) => {
        const subs = EJU_SUBJECTS.filter((s) => s.group === g.id);
        if (!subs.length) return null;
        return (
          <div key={g.id} style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#334155", marginBottom: 12 }}>{g.label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {subs.map((s) => (
                <SubjectCard key={s.key} s={s} onStart={() => setSubKey(s.key)} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Lịch sử */}
      {history.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>🕘 Lịch sử làm bài</h3>
            <button
              onClick={() => {
                if (window.confirm("Xóa toàn bộ lịch sử làm bài EJU?")) {
                  localStorage.removeItem(HISTORY_KEY);
                  setHistory([]);
                }
              }}
              style={{ background: "transparent", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer" }}
            >
              Xóa lịch sử
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.slice(0, 8).map((h, i) => {
              const s = EJU_SUBJECTS.find((x) => x.key === h.subject);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    background: "#F8FAFC",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>
                    {s ? `${s.icon} ${s.vn}` : h.subject}
                  </span>
                  <span style={{ color: "#64748B" }}>
                    {h.correct}/{h.total} ({h.pct}%) · ~{h.score}/200
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: 12 }}>
                    {new Date(h.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SubjectCard({ s, onStart }) {
  const ok = s.available;
  const total = ok ? s.sections.reduce((a, sec) => a + sec.items.length, 0) : 0;
  const graded = ok && s.sections.every((sec) => sec.items.every((i) => i.answer != null));

  return (
    <div
      onClick={() => ok && onStart()}
      style={{
        background: ok ? "#FFFFFF" : "#F8FAFC",
        borderRadius: 18,
        border: ok ? `2px solid ${s.color}` : "1px solid #E2E8F0",
        padding: "22px 18px",
        cursor: ok ? "pointer" : "not-allowed",
        opacity: ok ? 1 : 0.65,
        position: "relative",
        transition: "all 0.2s",
        boxShadow: ok ? "0 8px 24px rgba(15, 23, 42, 0.08)" : "none",
      }}
      onMouseEnter={(e) => {
        if (ok) e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        if (ok) e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "absolute", top: 12, right: 12 }}>
        <span
          style={{
            background: !ok ? "#F1F5F9" : graded ? "#DCFCE7" : "#FEF3C7",
            color: !ok ? "#94A3B8" : graded ? "#16A34A" : "#B45309",
            fontSize: 11,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 12,
          }}
        >
          {!ok ? "🔒 Sắp có" : graded ? "● Có đáp án" : "● Chưa có đáp án"}
        </span>
      </div>
      <div style={{ fontSize: 34, marginBottom: 6 }}>{s.icon}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: ok ? s.color : "#94A3B8" }}>{s.jp}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginBottom: 8 }}>{s.vn}</div>
      <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.7 }}>
        {ok ? (
          <>
            📅 {s.session}
            <br />
            ⏱ {s.minutes} phút · 📝 {total} {s.type === "fill" ? "ô điền" : "hàng đáp án"}
          </>
        ) : (
          <>Đề thi đang được hoàn thiện.</>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHÒNG THI: PDF bên trái, phiếu trả lời bên phải
// ══════════════════════════════════════════════════════════════
function ExamRoom({ sub, onExit }) {
  // Nếu có phiên đang làm dở của đúng môn này thì khôi phục đáp án + thời gian còn lại
  const [saved] = useState(() => {
    const ss = loadSession();
    return ss && ss.subKey === sub.key ? ss : null;
  });
  const [answers, setAnswers] = useState(saved ? saved.answers || {} : {});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(saved ? saved.secondsLeft : sub.minutes * 60);
  const [pdfOk, setPdfOk] = useState(true);

  // Kiểm tra file PDF có thật không (tránh iframe nạp lại index.html của app)
  useEffect(() => {
    let cancelled = false;
    setPdfOk(true);
    fetch(sub.pdf, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") || "";
        if (!cancelled && (!r.ok || !type.includes("pdf"))) setPdfOk(false);
      })
      .catch(() => !cancelled && setPdfOk(false));
    return () => {
      cancelled = true;
    };
  }, [sub.pdf]);

  // Lưu liên tục: thoát hoặc F5 thì đồng hồ dừng ở giá trị đã lưu
  useEffect(() => {
    if (submitted) {
      clearSession();
    } else {
      saveSession({ subKey: sub.key, answers, secondsLeft, submitted: false });
    }
  }, [answers, secondsLeft, submitted, sub.key]);

  const items = sub.sections.flatMap((sec) => sec.items);
  const total = items.length;
  const graded = items.every((i) => i.answer != null);
  const answeredCount = items.filter((i) => (answers[i.id] || "").length > 0).length;

  const norm = (v) => String(v == null ? "" : v).trim();
  const isRight = (item) => graded && norm(answers[item.id]) === item.answer;
  const correct = graded ? items.filter(isRight).length : 0;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const estScore = total ? Math.round((correct / total) * 200) : 0;

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    if (graded) {
      try {
        const hist = loadHistory();
        hist.unshift({
          date: new Date().toISOString(),
          subject: sub.key,
          correct,
          total,
          score: estScore,
          pct,
        });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0, 50)));
      } catch {
        /* bỏ qua lỗi lưu lịch sử */
      }
    }
  };

  // Đếm ngược, hết giờ tự nộp bài
  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitted]);

  const setAnswer = (id, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const confirmSubmit = () => {
    const left = total - answeredCount;
    if (left > 0 && !window.confirm(`Bạn còn ${left} câu chưa trả lời. Vẫn nộp bài?`)) return;
    handleSubmit();
  };

  const restart = () => {
    clearSession();
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(sub.minutes * 60);
  };

  const timerColor =
    secondsLeft > sub.minutes * 30 ? "#34D399" : secondsLeft > sub.minutes * 12 ? "#FBBF24" : "#F87171";
  const paneHeight = "calc(100vh - 64px)";

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: "#0F172A",
          color: "#FFFFFF",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onExit}
            title="Tạm dừng và thoát, vào lại sẽ thi tiếp"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ← Thoát (tạm dừng)
          </button>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>
              {sub.icon} EJU {sub.jp} · {sub.vn}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{sub.session}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, color: "#CBD5E1" }}>
            {answeredCount}/{total} đã trả lời
          </span>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              border: `2px solid ${timerColor}66`,
              borderRadius: 20,
              padding: "6px 14px",
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: 16,
              color: timerColor,
            }}
          >
            ⏱ {formatTime(secondsLeft)}
          </div>
          {!submitted ? (
            <button
              onClick={confirmSubmit}
              style={{
                background: "linear-gradient(135deg,#DC2626,#B91C1C)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                padding: "9px 18px",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              📨 Nộp bài
            </button>
          ) : (
            <button
              onClick={restart}
              style={{
                background: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                padding: "9px 18px",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              🔄 Làm lại
            </button>
          )}
        </div>
      </header>

      {sub.key === "physics" || sub.key === "chemistry" || sub.key === "biology" ? (
        <div style={{ background: "#1E293B", color: "#CBD5E1", fontSize: 12, padding: "6px 20px" }}>
          ℹ️ Đề thật: chọn 2 trong 3 môn khoa học, làm trong 80 phút. Ở đây mỗi môn được bấm 40 phút để bạn luyện từng môn.
        </div>
      ) : null}

      {/* Vùng chính */}
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
        {/* PDF */}
        <div style={{ flex: "1 1 540px", background: "#1E293B", height: paneHeight, minHeight: 420 }}>
          {pdfOk ? (
            <iframe
              key={`${sub.key}-${sub.page}`}
              src={`${sub.pdf}#page=${sub.page}&toolbar=1&navpanes=0&scrollbar=1`}
              title={`Đề EJU ${sub.vn}`}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <div style={{ color: "#FFFFFF", padding: 24, textAlign: "center", lineHeight: 1.7 }}>
              ⚠️ Không tìm thấy file đề: <code>{sub.pdf}</code>
              <br />
              Hãy đặt file vào thư mục <code>public/eju/</code> đúng tên rồi tải lại trang.
            </div>
          )}
        </div>

        {/* Phiếu trả lời */}
        <div
          style={{
            flex: "0 0 400px",
            maxWidth: "100%",
            background: "#FFFFFF",
            borderLeft: "1px solid #CBD5E1",
            maxHeight: paneHeight,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #E2E8F0",
              background: "#F8FAFC",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
              Phiếu trả lời ({total} {sub.type === "fill" ? "ô điền" : "hàng"})
            </h4>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
              {sub.type === "fill"
                ? "Mỗi ô A, BC, DE… điền đúng số chữ số tương ứng (ví dụ ô CD = 04 điền 2 chữ số)."
                : "Chọn số trong hàng đáp án tương ứng với số hàng ghi trong đề."}
              {!graded && " Môn này chưa có đáp án chính thức nên chỉ ghi nhận bài làm, chưa chấm điểm."}
            </div>
          </div>

          {/* Kết quả */}
          {submitted && (
            <div style={{ margin: 16, borderRadius: 14, padding: 16, background: "linear-gradient(135deg,#1E1B4B,#4F46E5)", color: "#FFFFFF" }}>
              {graded ? (
                <>
                  <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 700 }}>KẾT QUẢ</div>
                  <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.2 }}>
                    {correct}/{total} <span style={{ fontSize: 16, fontWeight: 700 }}>({pct}%)</span>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                    Điểm quy đổi tham khảo: ~{estScore}/200
                  </div>
                  <div style={{ fontSize: 11, marginTop: 8, opacity: 0.75, lineHeight: 1.5 }}>
                    Mỗi {sub.type === "fill" ? "ô" : "hàng"} tính 1 điểm. Điểm EJU thật được quy đổi
                    (equating) theo độ khó từng kỳ thi nên con số này chỉ để tham khảo.
                  </div>
                  {sub.answerPage && (
                    <a
                      href={`${EJU_ANSWER_PDF}#page=${sub.answerPage}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "inline-block", marginTop: 10, color: "#BAE6FD", fontWeight: 700, fontSize: 13 }}
                    >
                      📄 Mở bảng đáp án chính thức (PDF)
                    </a>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 700 }}>ĐÃ NỘP BÀI</div>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>
                    Đã trả lời {answeredCount}/{total} hàng
                  </div>
                  <div style={{ fontSize: 12, marginTop: 6, opacity: 0.85, lineHeight: 1.5 }}>
                    Chưa có đáp án chính thức của đề này nên chưa chấm điểm. Khi có file đáp án, chỉ cần điền
                    vào <code>ejuData.js</code> là chấm được.
                  </div>
                </>
              )}
            </div>
          )}

          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {sub.sections.map((sec) => (
              <div key={sec.id} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 900, fontSize: 13, color: sub.color, marginBottom: 10 }}>{sec.title}</div>

                {sub.type === "choice" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {sec.items.map((item) => (
                      <ChoiceRow
                        key={item.id}
                        item={item}
                        options={sub.options}
                        selected={answers[item.id]}
                        submitted={submitted}
                        graded={graded}
                        onPick={(v) => setAnswer(item.id, v)}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))", gap: 8 }}>
                    {sec.items.map((item) => (
                      <FillCell
                        key={item.id}
                        item={item}
                        value={answers[item.id] || ""}
                        submitted={submitted}
                        onChange={(v) => setAnswer(item.id, v)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceRow({ item, options, selected, submitted, graded, onPick }) {
  const right = graded && selected === item.answer;
  const wrong = submitted && graded && selected && !right;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flexWrap: "wrap",
        padding: "6px 8px",
        borderRadius: 8,
        background: submitted && graded ? (right ? "rgba(16,185,129,0.12)" : wrong || !selected ? "rgba(239,68,68,0.08)" : "#FFFFFF") : "#FFFFFF",
        border: `1px solid ${submitted && graded ? (right ? "#10B981" : "#FCA5A5") : "#E2E8F0"}`,
      }}
    >
      <div style={{ minWidth: 86 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: "#334155" }}>{item.label}</div>
        {item.hint && <div style={{ fontSize: 10, color: "#94A3B8" }}>{item.hint}</div>}
        {submitted && graded && (
          <div style={{ fontSize: 11, fontWeight: 800, color: right ? "#059669" : "#DC2626" }}>
            {right ? "✓ Đúng" : `✗ Đáp án: ${item.answer}`}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const v = String(opt);
          const isSel = selected === v;
          let bg = isSel ? "#2563EB" : "#FFFFFF";
          let color = isSel ? "#FFFFFF" : "#334155";
          if (submitted && graded) {
            if (v === item.answer) {
              bg = "#10B981";
              color = "#FFFFFF";
            } else if (isSel) {
              bg = "#EF4444";
              color = "#FFFFFF";
            }
          }
          return (
            <button
              key={v}
              onClick={() => onPick(v)}
              disabled={submitted}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "1px solid #CBD5E1",
                background: bg,
                color,
                fontWeight: 800,
                fontSize: 12,
                cursor: submitted ? "default" : "pointer",
                padding: 0,
              }}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillCell({ item, value, submitted, onChange }) {
  const right = value.trim() === item.answer;
  return (
    <div
      style={{
        background: submitted ? (right ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.08)") : "#FFFFFF",
        border: `1px solid ${submitted ? (right ? "#10B981" : "#FCA5A5") : "#E2E8F0"}`,
        borderRadius: 8,
        padding: "6px 8px",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 12, color: "#334155", marginBottom: 4 }}>{item.label}</div>
      <input
        value={value}
        disabled={submitted}
        inputMode="numeric"
        maxLength={item.label.length}
        placeholder={"·".repeat(item.label.length)}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9-]/g, ""))}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "5px 6px",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          fontFamily: "monospace",
          textAlign: "center",
          borderRadius: 6,
          border: "1px solid #CBD5E1",
          background: "#FFFFFF",
          color: "#0F172A",
        }}
      />
      {submitted && !right && (
        <div style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", marginTop: 3 }}>✗ Đáp án: {item.answer}</div>
      )}
      {submitted && right && <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", marginTop: 3 }}>✓ Đúng</div>}
    </div>
  );
}