import React, { useState, useEffect, useRef } from "react";
import { AUDIO_TRACKS, EXAM_SECTIONS, LEVELS, LEVEL_COLOR } from "./jlptData";
import { calculateJLPTScaleScore } from "./jlptScoring";

// Màn hình hẹp (điện thoại / tablet dọc): bố cục 1 cột + tab
function useIsNarrow(bp = 860) {
  const [n, setN] = useState(() => typeof window !== "undefined" && window.innerWidth < bp);
  useEffect(() => {
    const h = () => setN(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return n;
}

const PDF_SECTIONS = [
  {
    id: "all",
    label: "📄 Toàn bộ đề thi (Trọn gói 4 phần)",
    file: "/dethimauN5/de_thi_n5_full.pdf",
    hasAudio: true
  },
  {
    id: "mojigoi",
    label: "1. Từ vựng & Hán tự (文字.pdf)",
    file: "/dethimauN5/文字.pdf",
    hasAudio: false
  },
  {
    id: "bunpou",
    label: "2. Ngữ pháp (文法.pdf)",
    file: "/dethimauN5/文法.pdf",
    hasAudio: false
  },
  {
    id: "dokkai",
    label: "3. Đọc hiểu (読解.pdf)",
    file: "/dethimauN5/読解.pdf",
    hasAudio: false
  },
  {
    id: "choukai",
    label: "4. Nghe hiểu 🎧 (聴解.pdf)",
    file: "/dethimauN5/聴解.pdf",
    hasAudio: true
  }
];

// Phiên thi đang làm dở (thoát / F5 rồi vào lại vẫn tiếp tục, đồng hồ dừng lúc thoát)
const SESSION_KEY = "sp_jlpt_session";
const TOTAL_SECONDS = 60 * 105;

const loadSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!s || s.submitted || typeof s.secondsLeft !== "number" || s.secondsLeft <= 0) return null;
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

const fmtTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export default function JLPTRealExam({ markLearned }) {
  const [selectedLevel, setSelectedLevel] = useState(null); // null: màn hình chờ
  const [session, setSession] = useState(loadSession);

  if (selectedLevel === "N5") {
    return (
      <ExamRoom
        markLearned={markLearned}
        onExit={() => {
          setSelectedLevel(null);
          setSession(loadSession());
        }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px" }}>
      {/* ── Banner Giới thiệu Luyện thi JLPT ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)",
          borderRadius: 24,
          padding: "36px 24px",
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 32,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.25)"
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 10 }}>🎌</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 10px", color: "#FFFFFF" }}>
          Luyện Thi Thử JLPT Trực Tuyến
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.6 }}>
          Mô phỏng thi năng lực Nhật ngữ chuẩn JLPT: Đề thi PDF gốc, file nghe MP3 thực tế, áp dụng <b>phương pháp tính điểm theo thang đo (尺度得点 - IRT)</b> chuẩn của Hiệp hội Hỗ trợ Giáo dục Quốc tế Nhật Bản (JEES).
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            📊 Điểm thang đo 尺度得点 (IRT)
          </span>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            ⚠️ Xét điểm liệt từng phần thi
          </span>
          <span style={{ background: "rgba(255,255,255,0.18)", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            ⏱ Bấm giờ thi 105 phút
          </span>
        </div>
      </div>

      {/* ── Bài đang làm dở ── */}
      {session && (
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
            flexWrap: "wrap"
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: "#92400E", fontSize: 15 }}>⏸ Bài thi JLPT N5 đang làm dở</div>
            <div style={{ fontSize: 13, color: "#B45309", marginTop: 2 }}>
              Đồng hồ đang tạm dừng ở {fmtTime(session.secondsLeft)} · đã chọn{" "}
              {Object.values(session.userAnswers || {}).filter((v) => v != null && v !== "").length} đáp án
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setSelectedLevel("N5")}
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
      )}

      {/* ── Tiêu đề chọn cấp độ ── */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1E293B", margin: "0 0 6px" }}>
          Chọn Cấp Độ Thi JLPT
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
          Hiện cấp độ N5 đã tích hợp trọn bộ đề thi mẫu gốc kèm file nghe MP3. Các cấp độ khác đang được hoàn thiện.
        </p>
      </div>

      {/* ── Lưới các cấp độ N5 -> N1 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16, marginBottom: 32 }}>
        {LEVELS.map((lv) => {
          const isN5 = lv === "N5";
          const color = LEVEL_COLOR[lv];

          return (
            <div
              key={lv}
              onClick={() => {
                if (isN5) {
                  setSelectedLevel("N5");
                }
              }}
              style={{
                background: isN5 ? "#FFFFFF" : "#F8FAFC",
                borderRadius: 18,
                border: isN5 ? `2px solid ${color}` : "1px solid #E2E8F0",
                padding: "24px 16px",
                textAlign: "center",
                cursor: isN5 ? "pointer" : "not-allowed",
                opacity: isN5 ? 1 : 0.65,
                position: "relative",
                transition: "all 0.2s",
                boxShadow: isN5 ? "0 8px 24px rgba(34, 197, 94, 0.16)" : "none"
              }}
              onMouseEnter={(e) => {
                if (isN5) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(34, 197, 94, 0.25)";
                }
              }}
              onMouseLeave={(e) => {
                if (isN5) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.16)";
                }
              }}
            >
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                {isN5 ? (
                  <span
                    style={{
                      background: "#DCFCE7",
                      color: "#16A34A",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 12
                    }}
                  >
                    ● Sẵn sàng
                  </span>
                ) : (
                  <span
                    style={{
                      background: "#F1F5F9",
                      color: "#94A3B8",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 12
                    }}
                  >
                    🔒 Sắp ra mắt
                  </span>
                )}
              </div>

              <div style={{ fontSize: 36, fontWeight: 900, color, marginBottom: 8, marginTop: 4 }}>
                {lv}
              </div>

              <div style={{ fontSize: 13, fontWeight: 800, color: isN5 ? "#1E293B" : "#64748B", marginBottom: 6 }}>
                {isN5 ? "Sơ cấp N5" : `Cấp độ ${lv}`}
              </div>

              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, minHeight: 36 }}>
                {isN5 ? "89 câu hỏi · 4 phần có Audio gốc" : "Đang cập nhật ngân hàng đề thi"}
              </div>

              <div style={{ marginTop: 16 }}>
                {isN5 ? (
                  <button
                    style={{
                      background: color,
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px 18px",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: `0 4px 12px ${color}40`
                    }}
                  >
                    Bắt đầu thi ➔
                  </button>
                ) : (
                  <div
                    style={{
                      background: "#E2E8F0",
                      color: "#64748B",
                      borderRadius: 10,
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    Để sau
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Giải thích phương pháp tính điểm IRT chuẩn JLPT ── */}
      <div
        style={{
          background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
          borderRadius: 20,
          border: "1px solid #CBD5E1",
          padding: "24px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span>📐</span> Cơ Chế Chấm Điểm Thang Đo JLPT (尺度得点 - Item Response Theory)
        </h3>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px" }}>
          Khác với thi truyền thống chỉ cộng tổng số câu đúng, JLPT dùng thuật toán <b>IRT</b> phân tích mẫu đáp án (Response Pattern) dựa trên độ khó và tính phân hóa của từng câu hỏi:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div style={{ background: "#FFFFFF", padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#2563EB", marginBottom: 4 }}>
              1. Kiến thức ngôn ngữ & Đọc hiểu
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Thang điểm: 0 - 120 điểm</div>
            <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 700, marginTop: 4 }}>
              * Điểm liệt: Dưới 38 điểm sẽ trượt
            </div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#2563EB", marginBottom: 4 }}>
              2. Nghe hiểu (聴解)
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Thang điểm: 0 - 60 điểm</div>
            <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 700, marginTop: 4 }}>
              * Điểm liệt: Dưới 19 điểm sẽ trượt
            </div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#2563EB", marginBottom: 4 }}>
              3. Điều kiện Đậu N5 (合格)
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>Tổng điểm: ≥ 80 / 180 điểm</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
              Và không có phần nào bị dính điểm liệt.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PHÒNG THI CHÍNH THỨC N5
// ══════════════════════════════════════════════════════════════
function ExamRoom({ onExit, markLearned }) {
  // Khôi phục phiên đang làm dở (nếu có)
  const [saved] = useState(loadSession);
  const [selectedSecId, setSelectedSecId] = useState(saved?.selectedSecId || "all");
  const [userAnswers, setUserAnswers] = useState(saved?.userAnswers || {});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(saved ? saved.secondsLeft : TOTAL_SECONDS);
  const [activeAudioIdx, setActiveAudioIdx] = useState(saved?.activeAudioIdx || 0);
  const [pdfOk, setPdfOk] = useState(true);
  const audioRef = useRef(null);
  const wantPlay = useRef(false);
  const submissionRecorded = useRef(false);
  const narrow = useIsNarrow();
  const [tab, setTab] = useState("exam"); // chỉ dùng khi narrow

  useEffect(() => {
    if (!isSubmitted) {
      submissionRecorded.current = false;
      return;
    }
    if (submissionRecorded.current) return;
    submissionRecorded.current = true;
    markLearned?.();
    try {
      const history = JSON.parse(localStorage.getItem("sp_jlpt_history") || "[]");
      history.unshift({ level:"N5", date:new Date().toISOString(), completed:true });
      localStorage.setItem("sp_jlpt_history", JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error("Không lưu được lịch sử JLPT:", e);
    }
  }, [isSubmitted, markLearned]);

  const curSec = PDF_SECTIONS.find((s) => s.id === selectedSecId) || PDF_SECTIONS[0];
  const isAudioVisible = curSec.hasAudio;

  // Đếm ngược thời gian
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Hết giờ thì tự nộp bài
  useEffect(() => {
    if (!isSubmitted && secondsLeft <= 0) setIsSubmitted(true);
  }, [secondsLeft, isSubmitted]);

  // Lưu liên tục: thoát hoặc F5 thì đồng hồ dừng ở giá trị đã lưu
  useEffect(() => {
    if (isSubmitted) {
      clearSession();
    } else {
      saveSession({ userAnswers, secondsLeft, selectedSecId, activeAudioIdx, submitted: false });
    }
  }, [userAnswers, secondsLeft, selectedSecId, activeAudioIdx, isSubmitted]);

  // Kiểm tra file PDF có thật không (tránh iframe nạp lại index.html của app)
  useEffect(() => {
    let cancelled = false;
    setPdfOk(true);
    fetch(curSec.file, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") || "";
        if (!cancelled && (!r.ok || !type.includes("pdf"))) setPdfOk(false);
      })
      .catch(() => !cancelled && setPdfOk(false));
    return () => {
      cancelled = true;
    };
  }, [curSec.file]);

  const handleSelectAnswer = (qKey, opt) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qKey]: opt
    }));
  };

  // Tính kết quả theo thang đo chuẩn JLPT IRT (尺度得点)
  const scoreResult = calculateJLPTScaleScore(EXAM_SECTIONS, userAnswers);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        height: narrow ? "100dvh" : undefined,
        overflow: narrow ? "hidden" : undefined,
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER GỌN CHO MOBILE ── */}
      {narrow && (
        <header
          style={{
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "8px 10px",
            paddingTop: "calc(8px + env(safe-area-inset-top, 0px))",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onExit}
            aria-label="Thoát (tạm dừng)"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 10, width: 40, height: 40, fontSize: 18, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
          >
            ←
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "#38BDF8", fontWeight: 800, letterSpacing: 0.5 }}>JLPT N5 · PDF GỐC</div>
            <div style={{ fontSize: 14, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Đề thi N5 · {curSec.label}
            </div>
          </div>
          {!isSubmitted && (
            <div style={{ background: "rgba(239,68,68,0.2)", color: "#FCA5A5", padding: "4px 10px", borderRadius: 12, fontWeight: 800, fontSize: 14, border: "1px solid rgba(239,68,68,0.4)", fontFamily: "monospace", flexShrink: 0 }}>
              {formatTime(secondsLeft)}
            </div>
          )}
          {!isSubmitted ? (
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn nộp bài thi để chấm điểm theo thang đo JLPT (尺度得点) không?")) {
                  setIsSubmitted(true);
                  setTab("answer");
                }
              }}
              style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, height: 40, padding: "0 12px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
            >
              Nộp
            </button>
          ) : (
            <button
              onClick={() => {
                clearSession();
                setUserAnswers({});
                setIsSubmitted(false);
                setSecondsLeft(TOTAL_SECONDS);
                setTab("exam");
              }}
              style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, height: 40, padding: "0 12px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
            >
              Làm lại
            </button>
          )}
        </header>
      )}

      {/* ── TOP HEADER ── */}
      {!narrow && (
      <header
        style={{
          background: "#0F172A",
          color: "#FFFFFF",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
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
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            ← Thoát (tạm dừng)
          </button>
          <div>
            <div style={{ fontSize: 11, color: "#38BDF8", fontWeight: 800, letterSpacing: 0.5 }}>
              JLPT N5 MOCK EXAM · FILE PDF GỐC
            </div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>
              Đề Thi Chuẩn JLPT N5 ({curSec.label})
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {!isSubmitted && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                color: "#FCA5A5",
                padding: "6px 14px",
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 14,
                border: "1px solid rgba(239, 68, 68, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              ⏱ {formatTime(secondsLeft)}
            </div>
          )}

          {!isSubmitted ? (
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn nộp bài thi để chấm điểm theo thang đo JLPT (尺度得点) không?")) {
                  setIsSubmitted(true);
                }
              }}
              style={{
                background: "#10B981",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}
            >
              Nộp bài thi
            </button>
          ) : (
            <button
              onClick={() => {
                clearSession();
                setUserAnswers({});
                setIsSubmitted(false);
                setSecondsLeft(TOTAL_SECONDS);
              }}
              style={{
                background: "#3B82F6",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Làm lại bài thi
            </button>
          )}
        </div>
      </header>
      )}

      {/* ── BẢNG KẾT QUẢ ĐIỂM SỐ THEO THANG ĐO (尺度得点) KHI ĐÃ NỘP ── */}
      {isSubmitted && (
        <div
          style={{
            background: scoreResult.isPassed
              ? "linear-gradient(135deg, #065F46 0%, #059669 100%)"
              : "linear-gradient(135deg, #991B1B 0%, #DC2626 100%)",
            color: "#FFFFFF",
            padding: narrow ? "12px 14px" : "20px 24px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            flexShrink: 0,
            maxHeight: narrow ? "40dvh" : undefined,
            overflowY: narrow ? "auto" : undefined
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 28 }}>{scoreResult.isPassed ? "🎉" : "⚠️"}</span>
                <h2 style={{ margin: 0, fontSize: narrow ? 17 : 24, fontWeight: 900 }}>
                  {scoreResult.isPassed ? "KẾT QUẢ: ĐẬU (合格 - PASSED)" : "KẾT QUẢ: KHÔNG ĐẠT (不合格 - FAILED)"}
                </h2>
              </div>
              <div style={{ fontSize: 13, opacity: 0.95, lineHeight: 1.5 }}>
                Điểm số được quy đổi bằng thuật toán <b>尺度得点 (IRT)</b> dựa trên mẫu đáp án và độ khó từng câu hỏi.
                <br />
                Đúng {scoreResult.totalCorrect}/{scoreResult.totalQuestions} câu hỏi.
              </div>
            </div>

            {/* Chi tiết từng phần thi theo thang đo */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {/* Phần 1 */}
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 16px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 700 }}>Kiến thức ngôn ngữ & Đọc</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>
                  {scoreResult.langScaleScore} <span style={{ fontSize: 13 }}>/ 120</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: scoreResult.passedLang ? "#86EFAC" : "#FCA5A5" }}>
                  {scoreResult.passedLang ? `✓ Đạt chuẩn (≥${scoreResult.langThreshold})` : `✗ Điểm liệt (<${scoreResult.langThreshold})`}
                </div>
              </div>

              {/* Phần 2 */}
              <div style={{ background: "rgba(0,0,0,0.25)", padding: "10px 16px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 700 }}>Nghe hiểu (聴解)</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>
                  {scoreResult.listenScaleScore} <span style={{ fontSize: 13 }}>/ 60</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: scoreResult.passedListen ? "#86EFAC" : "#FCA5A5" }}>
                  {scoreResult.passedListen ? `✓ Đạt chuẩn (≥${scoreResult.listenThreshold})` : `✗ Điểm liệt (<${scoreResult.listenThreshold})`}
                </div>
              </div>

              {/* Tổng điểm */}
              <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px 20px", borderRadius: 12, textAlign: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>TỔNG ĐIỂM THANG ĐO</div>
                <div style={{ fontSize: 26, fontWeight: 900 }}>
                  {scoreResult.totalScaleScore} <span style={{ fontSize: 14 }}>/ 180</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: scoreResult.passedTotal ? "#FEF08A" : "#FECACA" }}>
                  {scoreResult.passedTotal ? `Đạt điểm sàn (≥${scoreResult.totalThreshold})` : `Dưới điểm sàn (<${scoreResult.totalThreshold})`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB ĐỀ THI / PHIẾU TRẢ LỜI (MOBILE) ── */}
      {narrow && (
        <div role="tablist" style={{ display: "flex", gap: 6, background: "#1E293B", padding: 6, flexShrink: 0 }}>
          {[
            ["exam", "📄 Đề thi"],
            ["answer", `✍️ Phiếu trả lời · ${Object.values(userAnswers).filter(Boolean).length}/${scoreResult.totalQuestions}`],
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              style={{ flex: 1, height: 42, borderRadius: 10, border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer", background: tab === id ? "#2563EB" : "rgba(255,255,255,0.08)", color: tab === id ? "#FFFFFF" : "#CBD5E1" }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── THANH CHỌN FILE PDF ── */}
      <div
        style={{
          background: "#1E293B",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: narrow ? "6px 10px" : "8px 18px",
          display: narrow && tab !== "exam" ? "none" : "flex",
          flexShrink: 0,
          gap: 8,
          alignItems: "center",
          overflowX: "auto"
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 800, color: "#94A3B8", whiteSpace: "nowrap", display: narrow ? "none" : "inline" }}>
          CHỌN PHẦN THI (PDF):
        </span>
        {PDF_SECTIONS.map((sec) => {
          const isActive = selectedSecId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSecId(sec.id)}
              style={{
                background: isActive ? "#2563EB" : "rgba(255,255,255,0.08)",
                color: isActive ? "#FFFFFF" : "#E2E8F0",
                border: isActive ? "none" : "1px solid rgba(255,255,255,0.12)",
                padding: narrow ? "8px 12px" : "7px 16px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s"
              }}
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* ── TRÌNH PHÁT FILE NGHE (CHỈ XUẤT HIỆN KHI Ở PHẦN NGHE HIỂU HOẶC TOÀN BỘ ĐỀ) ── */}
      {isAudioVisible && narrow && (
        <div
          style={{
            background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
            color: "#FFFFFF",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 16 }}>🎧</span>
          <select
            value={activeAudioIdx}
            onChange={(e) => {
              wantPlay.current = true;
              setActiveAudioIdx(Number(e.target.value));
            }}
            aria-label="Chọn bài nghe"
            style={{ flex: "0 1 44%", minWidth: 0, height: 36, borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, background: "#FFFFFF", color: "#1E3A8A", padding: "0 6px" }}
          >
            {AUDIO_TRACKS.map((trk, i) => (
              <option key={i} value={i}>{trk.name}</option>
            ))}
          </select>
          <audio
            key={activeAudioIdx}
            ref={audioRef}
            controls
            preload="metadata"
            src={AUDIO_TRACKS[activeAudioIdx]?.file}
            onLoadedData={() => {
              if (wantPlay.current && audioRef.current) {
                wantPlay.current = false;
                audioRef.current.play().catch(() => {});
              }
            }}
            style={{ flex: 1, minWidth: 0, height: 36 }}
          />
        </div>
      )}
      {isAudioVisible && !narrow && (
        <div
          style={{
            background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
            color: "#FFFFFF",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            boxShadow: "0 6px 18px rgba(37,99,235,0.3)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 900, fontSize: 13, color: "#FDE047" }}>
              🎧 BÀI NGHE HIỂU (BẤM ĐỂ PHÁT):
            </span>
            {AUDIO_TRACKS.map((trk, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveAudioIdx(i);
                  if (audioRef.current) {
                    audioRef.current.load();
                    audioRef.current.play();
                  }
                }}
                style={{
                  background: activeAudioIdx === i ? "#FFFFFF" : "rgba(255,255,255,0.18)",
                  color: activeAudioIdx === i ? "#1E3A8A" : "#FFFFFF",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                {trk.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#BAE6FD", fontWeight: 700 }}>
              {AUDIO_TRACKS[activeAudioIdx]?.name}
            </span>
            <audio
              ref={audioRef}
              controls
              src={AUDIO_TRACKS[activeAudioIdx]?.file}
              style={{ height: 34, maxWidth: 300 }}
            />
          </div>
        </div>
      )}

      {/* ── VÙNG CHÍNH: CỘT TRÁI FILE PDF GỐC + CỘT PHẢI PHIẾU ĐÁP ÁN ── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden", flexDirection: narrow ? "column" : "row", flexWrap: narrow ? "nowrap" : "wrap" }}>
        {/* CỘT TRÁI: FILE PDF GỐC NHÚNG TRỰC TIẾP */}
        <div
          style={
            narrow
              ? { flex: 1, minHeight: 0, background: "#1E293B", display: tab === "exam" ? "flex" : "none", flexDirection: "column", position: "relative" }
              : { flex: "1 1 540px", background: "#1E293B", display: "flex", flexDirection: "column", height: isAudioVisible ? "calc(100dvh - 170px)" : "calc(100dvh - 110px)", position: "relative" }
          }
        >
          {narrow && pdfOk && (
            <a
              href={curSec.file}
              target="_blank"
              rel="noreferrer"
              style={{ flexShrink: 0, textAlign: "center", padding: "7px 10px", fontSize: 12, fontWeight: 700, color: "#BAE6FD", background: "#0F172A", textDecoration: "none" }}
            >
              ↗ Mở đề PDF ở tab mới (dễ phóng to / cuộn trên điện thoại)
            </a>
          )}
          {pdfOk ? (
            <iframe
              key={curSec.file}
              src={`${curSec.file}#toolbar=${narrow ? 0 : 1}&navpanes=${narrow ? 0 : 1}&scrollbar=1${narrow ? "&view=FitH" : ""}`}
              title="Đề thi JLPT N5 PDF"
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                minHeight: 0,
                border: "none"
              }}
            />
          ) : (
            <div style={{ color: "#FFFFFF", padding: 24, textAlign: "center", lineHeight: 1.7 }}>
              ⚠️ Không tìm thấy file đề: <code>{curSec.file}</code>
              <br />
              Hãy đặt file vào thư mục <code>public/dethimauN5/</code> đúng tên rồi tải lại trang.
            </div>
          )}
        </div>

        {/* CỘT PHẢI: PHIẾU TRẢ LỜI CỐ ĐỊNH DỄ ĐIỀN */}
        <div
          style={
            narrow
              ? { flex: 1, minHeight: 0, background: "#FFFFFF", display: tab === "answer" ? "flex" : "none", flexDirection: "column", overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: "env(safe-area-inset-bottom, 0px)" }
              : { flex: "0 0 380px", background: "#FFFFFF", borderLeft: "1px solid #CBD5E1", display: "flex", flexDirection: "column", maxHeight: isAudioVisible ? "calc(100dvh - 170px)" : "calc(100dvh - 110px)", overflowY: "auto" }
          }
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #E2E8F0",
              background: "#F8FAFC",
              position: "sticky",
              top: 0,
              zIndex: 10
            }}
          >
            <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
              Phiếu Trả Lời Trắc Nghiệm (Tổng 89 câu)
            </h4>
            <div style={{ fontSize: 12, color: "#64748B" }}>
              Điểm tính theo thang đo IRT (0 - 180 điểm).
            </div>
          </div>

          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 18 }}>
            {EXAM_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: "14px"
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 14, color: "#1E3A8A", marginBottom: 12 }}>
                  {sec.title}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {sec.mondais.map((mondaiItem) => (
                    <div key={mondaiItem.mondai} style={{ background: "#FFFFFF", borderRadius: 8, padding: "10px", border: "1px solid #E2E8F0" }}>
                      <div style={{ fontWeight: 800, fontSize: 12, color: "#2563EB", marginBottom: 8 }}>
                        {mondaiItem.title}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {mondaiItem.answers.map((correctAns, idx) => {
                          const qNum = mondaiItem.startQ + idx;
                          const qKey = `${sec.id}-${mondaiItem.mondai}-${qNum}`;
                          const selected = userAnswers[qKey];
                          const isRight = selected === correctAns;

                          return (
                            <div
                              key={qNum}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: narrow ? "6px 10px" : "4px 8px",
                                borderRadius: 6,
                                background: isSubmitted
                                  ? isRight
                                    ? "rgba(16, 185, 129, 0.12)"
                                    : selected
                                    ? "rgba(239, 68, 68, 0.12)"
                                    : "#F8FAFC"
                                  : "#F8FAFC",
                                border: isSubmitted
                                  ? isRight
                                    ? "1px solid #10B981"
                                    : selected
                                    ? "1px solid #EF4444"
                                    : "1px solid #E2E8F0"
                                  : "1px solid #E2E8F0"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontWeight: 800, fontSize: 12, color: "#334155", minWidth: 44 }}>
                                  Câu {qNum}:
                                </span>
                                {isSubmitted && (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 800,
                                      color: isRight ? "#059669" : "#DC2626"
                                    }}
                                  >
                                    {isRight ? "✓ Đúng" : `✗: ${correctAns}`}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: "flex", gap: narrow ? 8 : 5 }}>
                                {[1, 2, 3, 4].map((opt) => {
                                  const isThisSelected = selected === opt;
                                  let btnBg = isThisSelected ? "#2563EB" : "#FFFFFF";
                                  let btnColor = isThisSelected ? "#FFFFFF" : "#334155";

                                  if (isSubmitted) {
                                    if (opt === correctAns) {
                                      btnBg = "#10B981";
                                      btnColor = "#FFFFFF";
                                    } else if (isThisSelected && !isRight) {
                                      btnBg = "#EF4444";
                                      btnColor = "#FFFFFF";
                                    }
                                  }

                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => handleSelectAnswer(qKey, opt)}
                                      disabled={isSubmitted}
                                      style={{
                                        width: narrow ? 40 : 28,
                                        height: narrow ? 40 : 28,
                                        borderRadius: 6,
                                        border: "1px solid #CBD5E1",
                                        background: btnBg,
                                        color: btnColor,
                                        fontWeight: 800,
                                        fontSize: 12,
                                        cursor: isSubmitted ? "default" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
