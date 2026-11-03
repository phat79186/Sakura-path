import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from "react";
import JLPTRealExam from "./JLPTRealExam";
import EJURealExam from "./EJURealExam";
const MILESTONES = [
  {days:7,  msg:"Học rất đều đặn! 💪", emoji:"⭐"},
  {days:30, msg:"Chiến binh học tập! 🔥", emoji:"🏅"},
  {days:100,msg:"Siêu chăm chỉ! 👑",    emoji:"👑"},
];

// ═══════════════════════════════════════════════════════════
// NIHON APP — UNIFIED DESIGN PALETTE
// ═══════════════════════════════════════════════════════════
const C = {
  primary:    "#2563EB",
  primaryD:   "#1D4ED8",
  accent:     "#38BDF8",
  accentSoft: "#7DD3FC",
  light:      "#BAE6FD",
  bg:         "#EFF6FF",
  bgCard:     "#FFFFFF",
  bgMuted:    "#F1F5F9",
  text:       "#0F172A",
  textSub:    "#334155",
  muted:      "#64748B",
  success:    "#10B981",
  warning:    "#F59E0B",
  danger:     "#EF4444",
  purple:     "#8B5CF6",
  gradMain:   "linear-gradient(135deg,#1E3A8A 0%,#2563EB 55%,#0EA5E9 100%)",
  gradAccent: "linear-gradient(135deg,#38BDF8 0%,#2563EB 100%)",
  gradCard:   "linear-gradient(145deg,rgba(255,255,255,0.99),rgba(239,246,255,0.95))",
  gradDark:   "linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)",
  shadowCard: "0 4px 24px rgba(37,99,235,0.10),0 1px 4px rgba(0,0,0,0.05)",
  shadowGlow: "0 0 0 2px rgba(56,189,248,0.22),0 6px 28px rgba(37,99,235,0.20)",
  shadowBtn:  "0 4px 16px rgba(37,99,235,0.30)",
  glowGreen:  "0 0 0 2px rgba(16,185,129,0.3),0 0 24px rgba(16,185,129,0.35)",
  glowRed:    "0 0 0 2px rgba(239,68,68,0.3),0 0 20px rgba(239,68,68,0.3)",
};

// ── Dark Color Palette ─────────────────────────────────────
const CD = {
  text:       "#E2E8F0",
  textSub:    "#CBD5E1",
  muted:      "#94A3B8",
  bg:         "#0B1120",
  bgCard:     "#111827",
  bgMuted:    "#1E293B",
  border:     "rgba(56,189,248,0.18)",
  // Shared vivid accents
  primary:    C.primary,
  accent:     C.accent,
  success:    C.success,
  warning:    C.warning,
  danger:     C.danger,
  purple:     C.purple,
};

// Helper: returns right color set based on dark mode
// Usage: const {text,muted,bg,bgCard,border} = useColors();
function useColors() {
  const [dark] = useDarkMode();
  return dark ? {
    text:    CD.text,
    textSub: CD.textSub,
    muted:   CD.muted,
    bg:      CD.bg,
    bgCard:  CD.bgCard,
    bgMuted: CD.bgMuted,
    border:  CD.border,
    dark:    true,
  } : {
    text:    C.text,
    textSub: C.textSub,
    muted:   C.muted,
    bg:      C.bg,
    bgCard:  C.bgCard,
    bgMuted: C.bgMuted,
    border:  "rgba(37,99,235,0.14)",
    dark:    false,
  };
}

// ── Dark Mode Context ───────────────────────────────────────
// Exported so all components can read it
let _darkMode = false;
let _darkListeners = [];
function getDarkMode() { return _darkMode; }
function setDarkMode(val) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // Add transitioning class to trigger animation
  root.classList.add("theme-transitioning");
  // Switch dark mode at the midpoint of animation (~320ms = 45% of 600ms + max delay 25*12=300ms)
  setTimeout(() => {
    _darkMode = val;
    _darkListeners.forEach(fn => fn(val));
    root.classList.toggle("dark", val);
  }, 320);
  // Remove transitioning class after animation completes
  setTimeout(() => {
    root.classList.remove("theme-transitioning");
  }, 650 + 300); // 600ms anim + 300ms max delay + buffer
}
function useDarkMode() {
  const [dark, setDark] = useState(_darkMode);
  useEffect(() => {
    const fn = v => setDark(v);
    _darkListeners.push(fn);
    return () => { _darkListeners = _darkListeners.filter(f => f !== fn); };
  }, []);
  return [dark, setDarkMode];
}

// ── Language Context ─────────────────────────────────────────
let _lang = (() => { try { return localStorage.getItem("sp_lang") || "vi"; } catch { return "vi"; } })();
let _langListeners = [];
function setLang(val) {
  _lang = val;
  _langListeners.forEach(fn => fn(val));
  try { localStorage.setItem("sp_lang", val); } catch {}
}
function useLang() {
  const [lang, setL] = useState(_lang);
  useEffect(() => {
    _langListeners.push(setL);
    return () => { _langListeners = _langListeners.filter(f => f !== setL); };
  }, []);
  return [lang, setLang];
}
const T = {
  vi: {
    // settings
    settings:"Cài đặt", language:"Ngôn ngữ", dark:"Giao diện tối",
    profile:"Hồ sơ", signout:"Đăng xuất", close:"Đóng",
    langVi:"Tiếng Việt", langEn:"English",
    // nav groups
    navHome:"Trang chủ", navStreak:"Streak",
    navScript:"Chữ Nhật", navHiragana:"Hiragana", navKatakana:"Katakana", navKanji:"Kanji", navRadical:"Bộ thủ",
    navStudy:"Học tập", navFlashcard:"Flashcard", navGrammar:"Ngữ pháp", navJlpt:"JLPT", navEju:"EJU",
    navSkill:"Kỹ năng", navSpeaking:"Nói", navListening:"Nghe", navReading:"Đọc", navDictation:"Chính tả",
    navAI:"AI", navChat:"AI Chat", navAnalysis:"Phân tích",
    navOther:"Khác", navGame:"Ghép câu", navStory:"Truyện", navNews:"Tin tức", navCulture:"Văn hóa",
    navMap:"Tiến trình", navAchieve:"Thành tích", navHeatmap:"Heatmap", navMini:"1 phút",
    navGroup:"Nhóm học", navTimer:"Timer", navImport:"Import", navPractice:"Luyện tập", navExplore:"Khám phá", navProgress:"Tiến độ", navData:"Nhập / Xuất dữ liệu",
    // flashcard
    fcAuto:"Auto", fcRomaji:"Rōmaji", fcType:"Gõ",
    fcAgain:"Lại", fcHard:"Khó", fcGood:"Ổn", fcEasy:"Dễ",
    fcTap:"Nhấn để lật",
    // common buttons
    correct:"Chính xác", wrong:"Sai", next:"Câu tiếp →", back:"← Quay lại",
    loading:"Đang tải...", start:"Bắt đầu", restart:"Làm lại", submit:"Nộp bài",
    answer:"Trả lời", check:"Kiểm tra", skip:"Bỏ qua", hint:"Gợi ý",
    play:"Phát âm", show:"Hiện đáp án", hide:"Ẩn",
    // home page
    homeHero:"Học tiếng Nhật cùng Sakura Path",
    homeSubtitle:"Lộ trình từ N5 đến N1 — Bảng chữ cái · Flashcard · Ngữ pháp · Luyện thi JLPT",
    homeStart:"Bắt đầu học ngay",
    homeFeatures:"Tính năng nổi bật",
    // Hiragana/Katakana
    kanaTitle:"Bảng chữ cái", kanaQuiz:"Luyện tập", kanaAll:"Tất cả",
    kanaCorrect:"Đúng rồi!", kanaWrong:"Sai rồi!", kanaScore:"Điểm số",
    // Kanji
    kanjiTitle:"Luyện viết Kanji", kanjiNext:"Kanji tiếp", kanjiPrev:"Kanji trước",
    kanjiStroke:"Số nét", kanjiMeaning:"Nghĩa", kanjiHint:"Gợi ý",
    // Grammar
    grammarTitle:"Ngữ pháp", grammarPattern:"Cấu trúc", grammarExample:"Ví dụ",
    grammarExplain:"Giải thích",
    // JLPT
    jlptTitle:"Đề thi JLPT", jlptChooseLevel:"Chọn cấp độ",
    jlptGrammar:"Ngữ pháp", jlptReading:"Đọc hiểu", jlptListening:"Nghe hiểu",
    jlptScore:"Điểm", jlptResult:"Kết quả", jlptAnswered:"đã trả lời",
    jlptSubmit:"Nộp bài", jlptExplain:"Giải thích",
    // EJU
    ejuTitle:"Đề thi EJU", ejuStart:"Bắt đầu thi",
    ejuTimeLeft:"Thời gian còn lại", ejuFlag:"Đánh dấu",
    // Speaking
    speakTitle:"Luyện Nói", speakRecord:"Ghi âm", speakStop:"Dừng",
    speakResult:"Kết quả phát âm", speakTry:"Thử lại",
    // Listening
    listenTitle:"Luyện Nghe", listenPlay:"Phát", listenChoose:"Trắc nghiệm", listenFill:"Điền từ",
    // Reading
    readTitle:"Luyện Đọc", readShowVn:"Xem nghĩa", readHideVn:"Ẩn tiếng Việt",
    readPassage:"Đoạn văn", readQuiz:"Trả lời câu hỏi →",
    // Streak
    streakTitle:"Chuỗi học tập", streakDays:"ngày liên tiếp",
    streakBest:"Kỷ lục", streakKeep:"Tiếp tục chuỗi!",
    streakLearn:"Học bài hôm nay →",
    // Profile
    profileTitle:"Hồ sơ", profileNotLoggedIn:"Chưa đăng nhập",
    profileLogin:"Đăng nhập với Google",
    profileStats:"Thống kê", profileAchieve:"Thành tích gần đây",
    profileAccount:"Tài khoản",
    // AI Chat
    chatTitle:"AI Conversation", chatPlaceholder:"Nhập tin nhắn...", chatSend:"Gửi",
    chatThinking:"Đang suy nghĩ...",
    // Games
    gameTitle:"Ghép câu tiếng Nhật", gameCheck:"Kiểm tra",
    gameReset:"Làm lại", gameSuccess:"Chính xác!",
    // Achievements
    achieveTitle:"Thành tích", achieveUnlocked:"Đã mở khóa",
    achieveLocked:"Chưa mở khóa",
    // Timer
    timerTitle:"Timer học tập", timerStart:"Bắt đầu", timerPause:"Tạm dừng",
    timerReset:"Đặt lại",
    // Import/Export
    importTitle:"Import / Export", importDeck:"Nhập bộ thẻ", exportDeck:"Xuất bộ thẻ",
    // Progress map
    mapTitle:"Bản đồ tiến trình JLPT",
    // Heatmap
    heatmapTitle:"Lịch học tập",
    // Mini lesson
    miniTitle:"Bài học 1 phút",
    // Study group
    groupTitle:"Nhóm học",
    // Culture
    cultureTitle:"Văn hóa Nhật Bản",
    // News
    newsTitle:"Tin tức tiếng Nhật",
    // Story
    storyTitle:"Đọc truyện ngắn",
    // Dictation
    dictTitle:"Chính tả tiếng Nhật",
    // Analysis
    analysisTitle:"Phân tích AI",
  },
  en: {
    // settings
    settings:"Settings", language:"Language", dark:"Dark mode",
    profile:"Profile", signout:"Sign out", close:"Close",
    langVi:"Vietnamese", langEn:"English",
    // nav groups
    navHome:"Home", navStreak:"Streak",
    navScript:"Japanese Script", navHiragana:"Hiragana", navKatakana:"Katakana", navKanji:"Kanji", navRadical:"Radicals",
    navStudy:"Study", navFlashcard:"Flashcard", navGrammar:"Grammar", navJlpt:"JLPT", navEju:"EJU",
    navSkill:"Skills", navSpeaking:"Speaking", navListening:"Listening", navReading:"Reading", navDictation:"Dictation",
    navAI:"AI", navChat:"AI Chat", navAnalysis:"Analysis",
    navOther:"More", navGame:"Build Sentence", navStory:"Stories", navNews:"News", navCulture:"Culture",
    navMap:"Progress", navAchieve:"Achievements", navHeatmap:"Heatmap", navMini:"1 min",
    navGroup:"Study Group", navTimer:"Timer", navImport:"Import", navPractice:"Practice", navExplore:"Explore", navProgress:"Tracking", navData:"Import / Export data",
    // flashcard
    fcAuto:"Auto", fcRomaji:"Rōmaji", fcType:"Type",
    fcAgain:"Again", fcHard:"Hard", fcGood:"Good", fcEasy:"Easy",
    fcTap:"Tap to flip",
    // common buttons
    correct:"Correct!", wrong:"Wrong!", next:"Next →", back:"← Back",
    loading:"Loading...", start:"Start", restart:"Retry", submit:"Submit",
    answer:"Answer", check:"Check", skip:"Skip", hint:"Hint",
    play:"Play audio", show:"Show answer", hide:"Hide",
    // home page
    homeHero:"Learn Japanese with Sakura Path",
    homeSubtitle:"N5 to N1 roadmap — Kana · Flashcard · Grammar · JLPT Practice",
    homeStart:"Start learning now",
    homeFeatures:"Key features",
    // Hiragana/Katakana
    kanaTitle:"Character chart", kanaQuiz:"Practice", kanaAll:"All",
    kanaCorrect:"Correct!", kanaWrong:"Wrong!", kanaScore:"Score",
    // Kanji
    kanjiTitle:"Kanji Writing Practice", kanjiNext:"Next kanji", kanjiPrev:"Previous kanji",
    kanjiStroke:"Strokes", kanjiMeaning:"Meaning", kanjiHint:"Hint",
    // Grammar
    grammarTitle:"Grammar", grammarPattern:"Pattern", grammarExample:"Example",
    grammarExplain:"Explanation",
    // JLPT
    jlptTitle:"JLPT Exam", jlptChooseLevel:"Choose level",
    jlptGrammar:"Grammar", jlptReading:"Reading", jlptListening:"Listening",
    jlptScore:"Score", jlptResult:"Result", jlptAnswered:"answered",
    jlptSubmit:"Submit", jlptExplain:"Explanation",
    // EJU
    ejuTitle:"EJU Exam", ejuStart:"Start exam",
    ejuTimeLeft:"Time remaining", ejuFlag:"Flag",
    // Speaking
    speakTitle:"Speaking Practice", speakRecord:"Record", speakStop:"Stop",
    speakResult:"Pronunciation result", speakTry:"Try again",
    // Listening
    listenTitle:"Listening Practice", listenPlay:"Play", listenChoose:"Multiple choice", listenFill:"Fill in",
    // Reading
    readTitle:"Reading Practice", readShowVn:"Show translation", readHideVn:"Hide translation",
    readPassage:"Passage", readQuiz:"Answer questions →",
    // Streak
    streakTitle:"Study streak", streakDays:"days in a row",
    streakBest:"Best", streakKeep:"Keep it up!",
    streakLearn:"Study today →",
    // Profile
    profileTitle:"Profile", profileNotLoggedIn:"Not logged in",
    profileLogin:"Sign in with Google",
    profileStats:"Stats", profileAchieve:"Recent achievements",
    profileAccount:"Account",
    // AI Chat
    chatTitle:"AI Conversation", chatPlaceholder:"Type a message...", chatSend:"Send",
    chatThinking:"Thinking...",
    // Games
    gameTitle:"Japanese Sentence Builder", gameCheck:"Check",
    gameReset:"Reset", gameSuccess:"Correct!",
    // Achievements
    achieveTitle:"Achievements", achieveUnlocked:"Unlocked",
    achieveLocked:"Locked",
    // Timer
    timerTitle:"Study Timer", timerStart:"Start", timerPause:"Pause",
    timerReset:"Reset",
    // Import/Export
    importTitle:"Import / Export", importDeck:"Import deck", exportDeck:"Export deck",
    // Progress map
    mapTitle:"JLPT Progress Map",
    // Heatmap
    heatmapTitle:"Study calendar",
    // Mini lesson
    miniTitle:"1-minute lesson",
    // Study group
    groupTitle:"Study group",
    // Culture
    cultureTitle:"Japanese Culture",
    // News
    newsTitle:"Japanese News",
    // Story
    storyTitle:"Short Stories",
    // Dictation
    dictTitle:"Japanese Dictation",
    // Analysis
    analysisTitle:"AI Analysis",
  }
};
function useT() {
  const [lang] = useLang();
  return T[lang] || T.vi;
}

// ── Inject global Nihon App CSS (Unified Design System) ──────
if (typeof document !== "undefined") {
  const styleId = "ba-global-styles";
  if (!document.getElementById(styleId)) {
    const s = document.createElement("style");
    s.id = styleId;
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
      /* ── Body & Reset ────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      body {
        font-family: var(--font-sans, 'Nunito', system-ui, sans-serif) !important;
        background: var(--bg, #EFF6FF) !important;
        color: var(--text, #0F172A) !important;
        margin: 0; padding: 0;
        overflow-x: hidden;
        transition: background 0.35s cubic-bezier(.4,0,.2,1), color 0.25s ease;
      }
      html, body, #root { width: 100%; overflow-x: hidden; }
      /* ════ JAPANESE TEXT FIXES ════════════════════════════════ */
      .jp-text {
        font-family: 'Noto Sans JP', sans-serif;
        letter-spacing: normal !important;
        line-height: 1.6;
        text-align: center;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }
      .jp-main {
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 42px;
        font-weight: 800;
        letter-spacing: 0.02em;
        line-height: 1.4;
        text-align: center;
        text-shadow: 0 0 10px rgba(56,189,248,0.3);
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }
      .romaji {
        font-size: 12px;
        letter-spacing: 0.08em;
        color: #94A3B8;
        margin-top: 3px;
        margin-bottom: 0;
      }
      .pitch-container {
        display: flex;
        justify-content: center;
        gap: 4px;
        margin-top: 3px;
      }
      .pitch-bar {
        width: 8px;
        border-radius: 3px;
      }
      .pitch-bar.high { background: #38BDF8; height: 20px; }
      .pitch-bar.low  { background: #475569; height: 10px; }
      :root.dark .pitch-bar.high { background: #22D3EE; }
      :root.dark .pitch-bar.low  { background: #334155; }
      .card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .dropdown {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        position: absolute;
        z-index: 50;
        transition: opacity 0.18s ease, visibility 0.18s ease;
        transition-delay: 0.1s;
      }
      .dropdown::before {
        content: "";
        position: absolute;
        top: -15px;
        left: -10px;
        right: -10px;
        height: 15px;
        display: block;
      }
      .nav-item::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        height: 15px;
        display: block;
      }
      .nav-item:hover .dropdown,
      .dropdown:hover {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transition-delay: 0s;
      }
      .ba-card::before,
      .ba-card::after {
        pointer-events: none;
      }
      /* Fullscreen sơ đồ Kanji: nền đặc theo theme, không để lộ ::backdrop đen */
      .kj-viewport:fullscreen { background-color:#F5F9FF !important; border-radius:0 !important; border:none !important; }
      .kj-viewport:-webkit-full-screen { background-color:#F5F9FF !important; border-radius:0 !important; border:none !important; }
      :root.dark .kj-viewport:fullscreen { background-color:#0B1120 !important; }
      :root.dark .kj-viewport:-webkit-full-screen { background-color:#0B1120 !important; }
      /* ════ DARK MODE BASE ════════════════════════════════════ */
      :root.dark body { background: var(--bg, #0B1120) !important; color: var(--text, #E2E8F0) !important; }
      :root.dark { color-scheme: dark; }

      /* Dark mode – cards */
      :root.dark .ba-card {
        background: var(--grad-card, linear-gradient(145deg,rgba(17,24,39,0.98),rgba(30,58,100,0.30))) !important;
        border-color: var(--border, rgba(56,189,248,0.18)) !important;
        box-shadow: var(--shadow-card, 0 4px 32px rgba(0,0,0,0.35),0 0 0 1px rgba(56,189,248,0.10)) !important;
        color: var(--text, #E2E8F0);
      }
      :root.dark .ba-card::before {
        background: linear-gradient(90deg,#22D3EE,#3B82F6,#818CF8) !important;
      }
      @media (hover:hover) {
        :root.dark .ba-card:hover {
          box-shadow: 0 0 0 1.5px rgba(56,189,248,0.5), 0 8px 40px rgba(56,189,248,0.2) !important;
        }
      }

      /* Dark mode – page backgrounds */
      :root.dark .ba-page-bg {
        background: linear-gradient(180deg,#0F172A 0%,#1E293B 100%) !important;
      }
      :root.dark .ba-section-bg {
        background: rgba(15,23,42,0.8) !important;
      }

      /* Dark mode – inputs */
      :root.dark input, :root.dark textarea, :root.dark select {
        background: rgba(30,58,138,0.25) !important;
        border-color: rgba(56,189,248,0.3) !important;
        color: #E2E8F0 !important;
      }
      :root.dark input::placeholder { color: rgba(148,163,184,0.5) !important; }

      /* Dark mode – nav */
      :root.dark .ba-nav-dark {
        background: rgba(7,15,30,0.95) !important;
        border-bottom-color: rgba(56,189,248,0.2) !important;
      }

      /* Dark mode – text helpers */
      :root.dark .ba-text-main  { color: #F1F5F9 !important; }
      :root.dark .ba-text-muted { color: #94A3B8 !important; }
      :root.dark .ba-text-sub   { color: #CBD5E1 !important; }

      /* Dark mode – canvas */
      :root.dark .ba-canvas-box {
        background: rgba(15,23,42,0.95) !important;
        border-color: rgba(56,189,248,0.3) !important;
      }
      :root.dark .ba-canvas-box canvas {
        filter: invert(1) hue-rotate(180deg);
      }

      /* Dark mode – progress */
      :root.dark .ba-progress-track {
        background: rgba(30,58,138,0.4) !important;
        border-color: rgba(56,189,248,0.15) !important;
      }

      /* Dark mode – feedback boxes */
      :root.dark .ba-feedback-correct {
        background: linear-gradient(135deg,rgba(6,95,70,0.4),rgba(5,150,105,0.2)) !important;
        border-color: rgba(16,185,129,0.4) !important;
        color: #6EE7B7 !important;
      }
      :root.dark .ba-feedback-wrong {
        background: linear-gradient(135deg,rgba(127,29,29,0.4),rgba(239,68,68,0.15)) !important;
        border-color: rgba(239,68,68,0.4) !important;
        color: #FCA5A5 !important;
      }

      /* Dark mode – option buttons */
      :root.dark .ba-option-default {
        background: rgba(30,58,138,0.3) !important;
        border-color: rgba(56,189,248,0.2) !important;
        color: #CBD5E1 !important;
      }
      :root.dark .ba-option-default:hover {
        border-color: rgba(56,189,248,0.5) !important;
        background: rgba(37,99,235,0.25) !important;
      }

      /* Dark glow canvas correct/wrong */
      :root.dark .ba-canvas-correct {
        animation: baGlowCyanDark 0.7s ease forwards;
      }
      @keyframes baGlowCyanDark {
        0%   { box-shadow: 0 0 0 0 rgba(34,211,238,0); }
        40%  { box-shadow: 0 0 0 6px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.4); }
        100% { box-shadow: 0 0 0 2px rgba(34,211,238,0.2), 0 4px 28px rgba(34,211,238,0.1); }
      }
      :root.dark .ba-canvas-wrong {
        animation: baShakeNeonRed 0.55s ease forwards;
      }
      @keyframes baShakeNeonRed {
        0%,100% { transform:translateX(0); box-shadow:0 0 0 0 rgba(239,68,68,0); }
        15%     { transform:translateX(-9px); box-shadow:0 0 0 5px rgba(239,68,68,0.6), 0 0 30px rgba(239,68,68,0.4); }
        30%     { transform:translateX(9px); }
        45%     { transform:translateX(-6px); }
        60%     { transform:translateX(6px); }
        75%     { transform:translateX(-3px); }
      }

      /* Dark mode – dark mode toggle button glow */
      :root.dark .ba-dark-toggle {
        background: rgba(56,189,248,0.15) !important;
        border-color: rgba(56,189,248,0.4) !important;
        box-shadow: 0 0 16px rgba(56,189,248,0.3) !important;
        color: #38BDF8 !important;
      }

      /* Dark mode transition */
      * {
      transition:
      background-color 0.35s cubic-bezier(.4,0,.2,1),
      border-color 0.3s cubic-bezier(.4,0,.2,1),
      box-shadow 0.35s cubic-bezier(.4,0,.2,1),
      color 0.25s ease;
      }
      /* Exclude animation-heavy elements */
      .ba-btn, .ba-card { transition: transform 0.22s cubic-bezier(.34,1.4,.64,1),
        box-shadow 0.22s ease, background-color 0.3s ease, border-color 0.25s ease; }

      /* ════ LIGHT MODE BASE ═══════════════════════════════════ */
      .ba-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
}

.ba-btn:hover {
  transform: translateY(-2px) scale(1.04);
}

.ba-btn:active {
  transform: scale(0.92);
}

/* Ripple effect */
.ba-btn::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  transform: translate(-50%,-50%);
  top: var(--y,50%);
  left: var(--x,50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.ba-btn:active::before {
  width: 200px;
  height: 200px;
}

      .ba-card {
  background: linear-gradient(145deg,rgba(255,255,255,0.98),rgba(239,246,255,0.94));
  border-radius: 24px;
  border: 1.5px solid rgba(56,189,248,0.2);
  box-shadow:
    0 6px 32px rgba(37,99,235,0.12),
    0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

/* Glow border animation */
.ba-card::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 24px;
  background: linear-gradient(120deg,#38BDF8,#2563EB,#818CF8);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 0;
}

.ba-animated-bg {
  background: linear-gradient(270deg,#1E3A8A,#2563EB,#0EA5E9);
  background-size: 600% 600%;
  animation: gradientMove 8s ease infinite;
}
.ba-glass {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.12);
}
  .ba-hover-text {
  transition: all 0.2s ease;
}

.ba-hover-text:hover {
  color: #38BDF8;
  letter-spacing: 0.02em;
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@media (hover:hover) {
  .ba-card:hover {
    transform: translateY(-4px) scale(1.012);
    box-shadow:
      0 14px 44px rgba(37,99,235,0.18),
      0 0 0 1.5px rgba(56,189,248,0.35);
  }
  .ba-card:hover::after { opacity: 0.15; }
}
.ba-card:active {
  transform: translateY(-1px) scale(0.99);
  transition: transform 0.1s ease;
}
      html, body, #root {
      width: 100%;
      overflow-x: hidden;
      }
      .ba-page-enter {
  animation: baPageIn 0.5s cubic-bezier(.22,1,.36,1);
}

@keyframes baPageIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
      @keyframes baPageIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      .ba-unlock { animation: baUnlock 0.65s cubic-bezier(.34,1.56,.64,1) forwards; }
      @keyframes baUnlock {
        0%   { transform:scale(0.6); opacity:0; filter:blur(6px); }
        60%  { transform:scale(1.1); opacity:1; filter:blur(0); }
        100% { transform:scale(1); }
      }
      .ba-canvas-correct { animation: baGlowGreen 0.7s ease forwards; }
      @keyframes baGlowGreen {
        0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        40%  { box-shadow: 0 0 0 6px rgba(16,185,129,0.5), 0 0 36px rgba(16,185,129,0.4); }
        100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.2), 0 4px 28px rgba(37,99,235,0.10); }
      }
      .ba-canvas-wrong { animation: baShakeRed 0.55s ease forwards; }
      @keyframes baShakeRed {
        0%,100% { transform:translateX(0); box-shadow:0 0 0 0 rgba(239,68,68,0); }
        15%     { transform:translateX(-9px); box-shadow:0 0 0 5px rgba(239,68,68,0.45); }
        30%     { transform:translateX(9px); }
        45%     { transform:translateX(-6px); box-shadow:0 0 28px rgba(239,68,68,0.4); }
        60%     { transform:translateX(6px); }
        75%     { transform:translateX(-3px); }
      }
      .ba-progress-fill {
        transition: width 0.85s cubic-bezier(.4,0,.2,1);
        background: linear-gradient(90deg,#38BDF8,#2563EB);
        border-radius: 99px; height: 100%;
        position: relative; overflow: hidden;
      }
      .ba-progress-fill::after {
        content: ''; position: absolute; top:0; bottom:0; left:-100%; width:60%;
        background: linear-gradient(90deg,transparent,rgba(255,255,255,0.42),transparent);
        animation: baShimmer 2.4s infinite 0.9s;
      }
      @keyframes baShimmer { to { left: 200%; } }
      @keyframes spin { to { transform:rotate(360deg); } }
      @keyframes baStar {
        0%   { transform:scale(0) rotate(-20deg); opacity:0; }
        60%  { transform:scale(1.25) rotate(6deg); opacity:1; }
        100% { transform:scale(1) rotate(0); opacity:1; }
      }
      .ba-star { animation: baStar 0.42s cubic-bezier(.34,1.56,.64,1) forwards; }
      @keyframes baBounce {
        0%,100% { transform:translateY(0); }
        40%     { transform:translateY(-6px); }
        70%     { transform:translateY(-3px); }
      }
      @keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeSlideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
      .ba-bounce { animation: baBounce 0.5s ease; }

      /* Pitch accent diagram */
      .pitch-bar-high { background: linear-gradient(180deg,#38BDF8,#2563EB); border-radius: 4px 4px 0 0; }
      .pitch-bar-low  { background: linear-gradient(180deg,#64748B,#475569); border-radius: 4px 4px 0 0; }
      :root.dark .pitch-bar-high { background: linear-gradient(180deg,#22D3EE,#38BDF8); }
      :root.dark .pitch-bar-low  { background: linear-gradient(180deg,#475569,#334155); }

      ::-webkit-scrollbar { width:6px; height:6px; }
      ::-webkit-scrollbar-track { background:#EFF6FF; }
      ::-webkit-scrollbar-thumb { background:#93C5FD; border-radius:99px; }
      :root.dark ::-webkit-scrollbar-track { background:#0F172A; }
      :root.dark ::-webkit-scrollbar-thumb { background:#1D4ED8; }
      /* ════ MOBILE FIX 1: Prevent horizontal scroll ══════════════════════ */
      html {
        overflow-x: hidden;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      body {
        overflow-x: hidden;
        max-width: 100vw;
      }
      img { max-width: 100%; height: auto; }

      /* ════ MOBILE FIX 2: iOS input zoom prevention (font-size < 16px triggers zoom) */
      @media (max-width: 640px) {
        input, textarea, select {
          font-size: 16px !important;
          -webkit-appearance: none;
        }
      }
      input, textarea { box-sizing: border-box; }

      /* ════ MOBILE FIX 3: Safe area for notched iPhones (X/11/12/13/14/15) */
      .ba-nav-dark {
        padding-left: calc(16px + env(safe-area-inset-left));
        padding-right: calc(16px + env(safe-area-inset-right));
      }
      body { padding-bottom: env(safe-area-inset-bottom, 0px); }

      /* ════ MOBILE FIX 4: Touch interactions */
      button, a, [role="button"] {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      canvas {
        touch-action: none;
        max-width: 100%;
        display: block;
        -webkit-tap-highlight-color: transparent;
      }

      /* ════ MOBILE FIX 5: Sticky nav on iOS */
      nav {
        position: -webkit-sticky;
        position: sticky;
        -webkit-backdrop-filter: blur(16px);
      }

      /* ════ MOBILE FIX 6: Japanese text overflow */
      @media (max-width: 640px) {
        .ba-card { word-break: break-word; overflow-wrap: break-word; }
        .ba-card * { max-width: 100%; }
      }

      /* ════ MOBILE FIX 7: Hide scrollbars on mobile */
      @media (max-width: 640px) {
        ::-webkit-scrollbar { display: none; }
      }

      /* ════ MOBILE FIX 8: iOS momentum scrolling */
      [style*="overflow"] { -webkit-overflow-scrolling: touch; }

      /* ════ MOBILE FIX 9: Disable hover on touch devices */
      @media (hover: none) and (pointer: coarse) {
        .ba-card:hover { transform: none !important; }
        .ba-btn:hover:not(:active) { transform: none !important; box-shadow: none !important; }
      }

      /* ════ MOBILE FIX 10: Bottom sheet modals on mobile */
      @media (max-width: 640px) {
        .ba-modal-backdrop {
          align-items: flex-end !important;
          padding: 0 !important;
        }
        .ba-modal-inner {
          border-radius: 20px 20px 0 0 !important;
          width: 100% !important;
          max-width: 100vw !important;
          max-height: 90dvh !important;
          animation: slideUpModal 0.28s cubic-bezier(.4,0,.2,1) forwards !important;
        }
        @keyframes slideUpModal {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      }

      /* ════ MOBILE FIX 11: Pitch bars scroll container */
      .pitch-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .pitch-scroll::-webkit-scrollbar { display: none; }

      /* ════ MOBILE FIX 12: Heatmap scroll */
      .heatmap-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        cursor: grab;
      }
      .heatmap-scroll:active { cursor: grabbing; }
      .heatmap-scroll::-webkit-scrollbar { display: none; }

      /* ════ MOBILE FIX 13: Question navigator scroll */
      .question-nav {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
        gap: 6px;
        padding-bottom: 4px;
      }
      .question-nav::-webkit-scrollbar { display: none; }

      /* ════ MOBILE FIX 14: Range input touch target */
      input[type="range"] { height: 20px; padding: 4px 0; }

      /* ════ MOBILE FIX 15: Dynamic viewport height */
      @media (max-width: 640px) {
        .min-h-screen { min-height: 100dvh; }
      }

      /* ════ MOBILE FIX 16: Reduce motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* ════ MOBILE FIX 17: Fixed elements GPU compositing */
      [style*="position: fixed"], [style*="position:fixed"] {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }

      /* ════ MOBILE FIX 18: Kanji canvas max-width */
      @media (max-width: 640px) {
        .kanji-canvas { max-width: calc(100vw - 48px) !important; }
      }

      /* ════ MOBILE FIX 19: Sentence builder word tiles */
      @media (max-width: 640px) {
        .word-tile { font-size: 15px !important; padding: 7px 11px !important; min-width: 0; }
      }

      /* ════ MOBILE FIX 20: Tab scroll bars */
      .tab-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        white-space: nowrap;
      }
      .tab-scroll::-webkit-scrollbar { display: none; }


    `;
    document.head.appendChild(s);
  }

  // Inject theme-toggle styles separately — always refresh
  const themeStyleId = "ba-theme-styles";
  let ts = document.getElementById(themeStyleId);
  if (!ts) { ts = document.createElement("style"); ts.id = themeStyleId; document.head.appendChild(ts); }
  ts.textContent = `
      .sr-only {
        position: absolute; width: 1px; height: 1px;
        padding: 0; margin: -1px; overflow: hidden;
        clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
      }
      /* ── Theme Toggle Button ─────────────────────── */
      .theme-toggle {
        position: relative;
        width: 34px; height: 34px;
        padding: 7px;
        display: grid;
        place-items: center;
        cursor: pointer;
        border-radius: 50%;
        outline: 1.5px solid rgba(255,255,255,0.22);
        color: rgba(255,255,255,0.82);
        background: rgba(255,255,255,0.07);
        transition: outline-width 150ms ease, outline-color 200ms ease, background 200ms ease, color 200ms ease;
        flex-shrink: 0;
        user-select: none;
      }
      .theme-toggle:hover {
        outline-width: 5px;
        background: rgba(255,255,255,0.14);
      }
      .theme-toggle:active { transform: scale(0.92); }
      /* tooltip */
      .theme-toggle::after {
        content: attr(title);
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        translate: -50% 0;
        background: rgba(15,23,42,0.92);
        color: white;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        padding: 4px 10px;
        border-radius: 8px;
        border: 1px solid rgba(56,189,248,0.2);
        pointer-events: none;
        opacity: 0;
        transition: opacity 150ms ease;
        z-index: 999;
      }
      .theme-toggle:hover::after { opacity: 1; }
      /* SVG icons — stacked via grid */
      .theme-toggle > svg {
        grid-area: 1/1;
        width: 100%; height: 100%;
        transition: scale 350ms cubic-bezier(.34,1.56,.64,1), rotate 500ms ease, opacity 200ms ease;
        scale: var(--tt-moon-scale, 1);
        rotate: var(--tt-rotate, 0turn);
        opacity: var(--tt-moon-op, 1);
      }
      .theme-toggle > svg:first-child {
        scale: var(--tt-sun-scale, 0);
        opacity: var(--tt-sun-op, 0);
      }
      /* Dark mode state */
      :root.dark .theme-toggle {
        --tt-sun-scale: 1;  --tt-sun-op: 1;
        --tt-moon-scale: 0; --tt-moon-op: 0;
        --tt-rotate: 1turn;
        color: #38BDF8;
        outline-color: rgba(56,189,248,0.4);
        background: rgba(56,189,248,0.12);
      }
      :root.dark .theme-toggle:hover {
        outline-width: 5px;
        background: rgba(56,189,248,0.2);
      }
      /* ── Theme Mask (transition overlay) ─────────── */
      .theme-mask {
        position: fixed;
        display: grid;
        overflow: hidden;
        inset: 0;
        grid-template-columns: repeat(25, 1fr);
        pointer-events: none;
        z-index: 9998;
      }
      .theme-mask > div {
        background-color: #0F172A;
        scale: 0 1;
        transform-origin: top;
        pointer-events: none;
      }
      :root.dark .theme-mask > div { background-color: #EFF6FF; }
      .theme-transitioning .theme-mask > div {
        animation: themeMaskIn 600ms ease-in-out forwards;
        animation-delay: calc(var(--i, 0) * 12ms);
      }
      @keyframes themeMaskIn {
        0%   { scale: 0 1; }
        45%  { scale: 1 1; }
        55%  { scale: 1 1; }
        100% { scale: 0 1; transform-origin: bottom; }
      }
    `;
  document.head.appendChild(ts);
}


const todayStr = () => new Date().toISOString().slice(0,10);
const yestStr  = () => { const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10); };
const nDaysAgo = n => { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); };

function useStreak() {
  const [s, setS] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sp_streak_v2") || "null");
      if (saved) {
        const t = todayStr();
        return { ...saved, learnedToday: saved.lastLogin === t, bumped: false };
      }
    } catch {}
    return { streak:0, highest:0, lastLogin:null, learnedToday:false, activeDays:[], bumped:false };
  });
  


  // 👉 cập nhật khi học xong
  const markLearned = useCallback(() => {
    setS((prev) => {
      if (prev.learnedToday) return prev;

      const t = todayStr();
      const y = yestStr();

      let streak = prev.streak;
      let bumped = false;

      if (!prev.lastLogin || prev.lastLogin === y) {
        streak = prev.streak + 1;
        bumped = true;
      } else if (prev.lastLogin !== t) {
        streak = 1;
        bumped = true;
      }

      const highest = Math.max(streak, prev.highest);

      const ad = [...(prev.activeDays || [])];
      if (!ad.includes(t)) ad.push(t);
      if (ad.length > 365) ad.shift();

      const next = {
        streak,
        highest,
        lastLogin: t,
        learnedToday: true,
        activeDays: ad,
        bumped,
      };

      // 👉 lưu streak
      localStorage.setItem("sp_streak_v2", JSON.stringify(next));

      // 👉 heatmap
      try {
        const hmap = JSON.parse(localStorage.getItem("sp_heatmap") || "{}");
        hmap[t] = Math.min(4, (hmap[t] || 0) + 1);
        localStorage.setItem("sp_heatmap", JSON.stringify(hmap));
      } catch (e) {
        console.error("Heatmap lỗi:", e);
      }

      return next;
    });
  }, []);

  return { streak: s, markLearned };
}
function useWidth() {
  const [w,setW]=useState(typeof window!=='undefined'?window.innerWidth:800);
  useEffect(()=>{ const h=()=>setW(window.innerWidth); window.addEventListener('resize',h); return()=>window.removeEventListener('resize',h); },[]);
  return w;
}

function Badge({text,color=C.accent}){
  return <span style={{background:color,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,display:"inline-block"}}>{text}</span>;
}

// ════════════════════════════════════════
// SETTINGS DROPDOWN
// ════════════════════════════════════════
function SettingsDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [lang, setLangVal] = useLang();
  const [dark, toggleDark] = useDarkMode();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const t = T[lang] || T.vi;

  return (
    
    <div ref={ref} style={{ position:"relative" }}>


      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", right:0,
          background:"#0F172A", borderRadius:16, padding:16,
          minWidth:220, zIndex:9999,
          border:"1px solid rgba(56,189,248,0.2)",
          boxShadow:"0 12px 40px rgba(0,0,0,0.5)",
          animation:"fadeIn 0.15s ease"
        }}>
          {/* Header */}
          <div style={{ fontSize:12, fontWeight:800, color:"rgba(56,189,248,0.7)", letterSpacing:"0.1em", marginBottom:14 }}>
            ⚙️ {t.settings.toUpperCase()}
          </div>

          {/* Language section */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:"rgba(148,163,184,0.6)", fontWeight:700, marginBottom:8 }}>
              🌐 {t.language}
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {[{code:"vi", label:"🇻🇳 "+t.langVi}].map(l => (
                <button key={l.code} onClick={() => setLangVal(l.code)}
                  style={{
                    flex:1, padding:"8px 6px", borderRadius:10, cursor:"pointer",
                    fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif",
                    background: lang===l.code ? "linear-gradient(135deg,#2563EB,#0EA5E9)" : "rgba(255,255,255,0.06)",
                    border: lang===l.code ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: lang===l.code ? "white" : "rgba(148,163,184,0.8)",
                    boxShadow: lang===l.code ? "0 2px 10px rgba(37,99,235,0.4)" : "none",
                  }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", marginBottom:10 }}/>

          <button onClick={() => { setOpen(false); onNavigate && onNavigate("import"); }}
            style={{
              display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px",
              borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.06)",
              color:"rgba(226,232,240,0.9)", fontSize:12, fontWeight:700, cursor:"pointer",
              fontFamily:"'Nunito',sans-serif", textAlign:"left"
            }}>
            <span>📥</span>{t.navData}
          </button>

          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", margin:"12px 0" }}/>

          <div style={{ fontSize:11, color:"rgba(148,163,184,0.5)", textAlign:"center", fontStyle:"italic" }}>
            🌙 Nút chuyển giao diện ở thanh nav
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// NAV – Blue Archive style
// ════════════════════════════════════════
const links = [
  { name: "Trang chủ", href: "#" },
  { name: "Từ vựng", href: "#vocab" },
  { name: "Ngữ pháp", href: "#grammar" },
  { name: "Kanji", href: "#kanji" },
  { name: "JLPT", href: "#jlpt" },
  { name: "EJU", href: "#eju" },
];

// Nhóm menu theo luồng học: Chữ viết → Học → Luyện tập/thi → Khám phá → Tiến độ
function buildNavGroups(t) {
  return [
    {
      id: "home", label: t.navHome,
      items: [{ id: "home", icon: "🏠", label: t.navHome }]
    },
    {
      id: "script", label: t.navScript,
      items: [
        { id: "hiragana", icon: "あ",  label: t.navHiragana },
        { id: "katakana", icon: "ア",  label: t.navKatakana },
        { id: "kanji",    icon: "漢",  label: t.navKanji },
        { id: "radical",  icon: "⛩️", label: t.navRadical }
      ]
    },
    {
      id: "study", label: t.navStudy,
      items: [
        { id: "flashcard", icon: "🧠", label: t.navFlashcard },
        { id: "grammar",   icon: "📝", label: t.navGrammar },
        { id: "dictation", icon: "✍️", label: t.navDictation },
        { id: "mini",      icon: "⚡", label: t.navMini }
      ]
    },
    {
      id: "practice", label: t.navPractice,
      items: [
        { id: "jlpt", icon: "🎌", label: t.navJlpt },
        { id: "eju",  icon: "📋", label: t.navEju },
        { id: "chat", icon: "💬", label: t.navChat },
        { id: "game", icon: "🎮", label: t.navGame }
      ]
    },
    {
      id: "explore", label: t.navExplore,
      items: [
        { id: "story",   icon: "📚", label: t.navStory },
        { id: "news",    icon: "📰", label: t.navNews },
        { id: "culture", icon: "🏯", label: t.navCulture }
      ]
    },
    {
      id: "progress", label: t.navProgress,
      items: [
        { id: "map",      icon: "🗺️", label: t.navMap },
        { id: "achieve",  icon: "🏅", label: t.navAchieve },
        { id: "heatmap",  icon: "📅", label: t.navHeatmap },
        { id: "analysis", icon: "📊", label: t.navAnalysis },
        { id: "group",    icon: "👥", label: t.navGroup },
        { id: "timer",    icon: "⏱",  label: t.navTimer }
      ]
    }
  ];
}

function NavChevron({ up }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
      style={{ transition: "transform 0.2s ease", transform: up ? "rotate(180deg)" : "none", opacity: 0.7 }}>
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Nav({ page, setPage, streakCount, user }) {
  const w = useWidth();
  const isMob = w < 640;          // logo gọn, ẩn nút cài đặt
  const isDrawer = w < 1024;      // dưới 1024px dùng menu ngăn kéo thay vì thanh ngang
  const [open, setOpen] = useState(false);   // ngăn kéo mobile
  const [menu, setMenu] = useState(null);    // id nhóm đang mở dropdown
  const [dark, toggleDark] = useDarkMode();
  const t = useT();
  const navRef = useRef(null);
  const closeTimer = useRef(null);
  const groups = useMemo(() => buildNavGroups(t), [t]);

  const activeGroup = groups.find(g => g.items.some(it => it.id === page));
  const activeGroupId = activeGroup ? activeGroup.id : null;

  const go = (id, arg) => { setPage(id, arg); setOpen(false); setMenu(null); };

  // Hover chỉ áp dụng cho chuột; chạm/bàn phím dùng click
  const openMenu = id => { clearTimeout(closeTimer.current); setMenu(id); };
  const hoverIn = id => e => { if (e.pointerType === "mouse") openMenu(id); };
  const hoverOut = e => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  useEffect(() => {
    const onDown = e => { if (navRef.current && !navRef.current.contains(e.target)) setMenu(null); };
    const onKey = e => { if (e.key === "Escape") { setMenu(null); setOpen(false); } };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      clearTimeout(closeTimer.current);
    };
  }, []);

  // Rời chế độ ngăn kéo thì đóng ngăn kéo; mở ngăn kéo thì khóa cuộn nền
  useEffect(() => { if (!isDrawer) setOpen(false); }, [isDrawer]);
  useEffect(() => {
    if (!(isDrawer && open)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isDrawer, open]);

  return (
    <>
      <style>{`
        @keyframes spNavMenuIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .sp-nav-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px; border-radius: 10px; border: 1px solid transparent;
          background: transparent; color: rgba(255,255,255,0.72);
          font: 700 12.5px 'Nunito',sans-serif; white-space: nowrap; cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .sp-nav-trigger:hover, .sp-nav-trigger.is-open { background: rgba(255,255,255,0.08); color: #fff; }
        .sp-nav-trigger.is-active { background: rgba(37,99,235,0.25); color: #38BDF8; font-weight: 800; }
        .sp-nav-trigger:focus-visible, .sp-nav-item:focus-visible, .sp-tile:focus-visible, .sp-nav-streak:focus-visible {
          outline: 2px solid rgba(56,189,248,0.7); outline-offset: 2px;
        }
        .sp-nav-menu { animation: spNavMenuIn 0.14s ease-out; }
        .sp-nav-item {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 7px 10px; border: none; border-radius: 9px; background: transparent;
          color: rgba(226,232,240,0.88); font: 600 13px 'Nunito',sans-serif; text-align: left; cursor: pointer;
          transition: background 0.12s ease, color 0.12s ease;
        }
        .sp-nav-item:hover { background: rgba(56,189,248,0.1); color: #7DD3FC; }
        .sp-nav-item.is-active { background: rgba(56,189,248,0.16); color: #38BDF8; font-weight: 800; }
        .sp-nav-ico {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 14px; background: rgba(255,255,255,0.06);
        }
        .sp-nav-item.is-active .sp-nav-ico, .sp-tile.is-active .sp-nav-ico { background: rgba(56,189,248,0.2); }
        .sp-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: #38BDF8; flex-shrink: 0; }
        .sp-nav-streak {
          display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; cursor: pointer;
          background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.35);
          color: #FCD34D; font: 900 13px 'Nunito',sans-serif;
        }
        .sp-nav-streak.is-active { border-color: rgba(245,158,11,0.8); background: rgba(245,158,11,0.25); }
        .sp-tile {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px;
          border: 1px solid rgba(56,189,248,0.12); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.82); font: 700 13.5px 'Nunito',sans-serif; text-align: left; cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .sp-tile:active { background: rgba(56,189,248,0.12); }
        .sp-tile.is-active { background: rgba(37,99,235,0.28); border-color: rgba(56,189,248,0.5); color: #38BDF8; font-weight: 800; }
        @media (prefers-reduced-motion: reduce) { .sp-nav-menu { animation: none; } }
      `}</style>

      <nav ref={navRef} style={{
        background: "rgba(15,23,42,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "0 16px",
        position: "sticky", top: 0, zIndex: 1000,
        borderBottom: "1px solid rgba(56,189,248,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25),0 0 0 1px rgba(56,189,248,0.08)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, maxWidth: 1280, margin: "0 auto", gap: 12 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => go("home")}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#38BDF8,#2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 0 12px rgba(56,189,248,0.5)"
            }}>🌸</div>
            <div>
              <div style={{ color: "white", fontWeight: 900, fontSize: isMob ? 14 : 16, lineHeight: 1, fontFamily: "'Nunito',sans-serif", letterSpacing: "-0.02em" }}>Sakura Path</div>
              {!isMob && <div style={{ color: "rgba(56,189,248,0.7)", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em" }}>JAPANESE LEARNING</div>}
            </div>
          </div>

          {/* Desktop: thanh ngang */}
          {!isDrawer && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
              {groups.map(group => {
                const isActive = activeGroupId === group.id;

                if (group.items.length === 1) {
                  const l = group.items[0];
                  return (
                    <button key={group.id} onClick={() => go(l.id)}
                      className={"sp-nav-trigger" + (isActive ? " is-active" : "")}
                      aria-current={isActive ? "page" : undefined}>
                      {l.label}
                    </button>
                  );
                }

                const isOpen = menu === group.id;
                return (
                  <div key={group.id} style={{ position: "relative" }}
                    onPointerEnter={hoverIn(group.id)} onPointerLeave={hoverOut}>
                    <button
                      className={"sp-nav-trigger" + (isActive ? " is-active" : "") + (isOpen ? " is-open" : "")}
                      aria-haspopup="menu" aria-expanded={isOpen}
                      onClick={() => openMenu(group.id)}>
                      {group.label}<NavChevron up={isOpen} />
                    </button>

                    {isOpen && (
                      <div role="menu" className="sp-nav-menu"
                        style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, zIndex: 999 }}>
                        <div style={{
                          background: "#0F172A", border: "1px solid rgba(56,189,248,0.15)",
                          borderRadius: 14, padding: 6,
                          minWidth: group.id === "script" ? 340 : 190,
                          boxShadow: "0 12px 36px rgba(0,0,0,0.45)"
                        }}>
                          {/* Regular items */}
                          {group.items.map(item => {
                            const a = page === item.id;
                            return (
                              <button key={item.id} role="menuitem" onClick={() => go(item.id)}
                                className={"sp-nav-item" + (a ? " is-active" : "")}
                                aria-current={a ? "page" : undefined}>
                                <span className="sp-nav-ico">{item.icon}</span>
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {a && <span className="sp-nav-dot" />}
                              </button>
                            );
                          })}

                          {/* Extra section: Chuyên ngành — only for "script" group */}
                          {group.id === "script" && (() => {
                            const specItems = [
                              { value:"💻 IT",          icon:"💻",  label:"Công nghệ IT",          color:"#38BDF8" },
                              { value:"🍳 Đầu bếp",     icon:"🍳",  label:"Đầu bếp & Nhà hàng",   color:"#F59E0B" },
                              { value:"⚙️ Kỹ sư",       icon:"⚙️", label:"Kỹ sư & Cơ khí",       color:"#10B981" },
                              { value:"💼 Kinh doanh",  icon:"💼",  label:"Kinh doanh",            color:"#8B5CF6" },
                              { value:"🏥 Y tế",        icon:"🏥",  label:"Y tế & Điều dưỡng",    color:"#EC4899" },
                              { value:"🏗️ Xây dựng",    icon:"🏗️", label:"Xây dựng & Kiến trúc", color:"#F97316" },
                              { value:"🌾 Nông nghiệp", icon:"🌾",  label:"Nông nghiệp",           color:"#84CC16" },
                            ];
                            return (
                              <>
                                {/* Divider + header */}
                                <div style={{
                                  margin: "6px 4px 4px",
                                  borderTop: "1px solid rgba(56,189,248,0.12)",
                                  paddingTop: 8,
                                }}>
                                  <div style={{
                                    fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
                                    color: "rgba(249,115,22,0.8)", paddingLeft: 8, paddingBottom: 6,
                                    display: "flex", alignItems: "center", gap: 6
                                  }}>
                                    <span>💼</span>
                                    <span>TỪ VỰNG CHUYÊN NGÀNH</span>
                                    <div style={{flex:1, height:1, background:"rgba(249,115,22,0.2)"}}/>
                                  </div>

                                  {/* 2-column grid of specialty items */}
                                  <div style={{
                                    display: "grid", gridTemplateColumns: "1fr 1fr",
                                    gap: 4, padding: "0 2px"
                                  }}>
                                    {specItems.map((sp, si) => (
                                      <button key={si} role="menuitem"
                                        onClick={() => go("vocab", sp.value)}
                                        style={{
                                          display: "flex", alignItems: "center", gap: 7,
                                          padding: "6px 8px", border: `1px solid ${sp.color}25`,
                                          borderRadius: 9, background: `${sp.color}0D`,
                                          color: "rgba(226,232,240,0.88)",
                                          font: "600 11.5px 'Nunito',sans-serif",
                                          textAlign: "left", cursor: "pointer",
                                          transition: "background 0.12s ease",
                                        }}
                                        onMouseEnter={e => {
                                          e.currentTarget.style.background = `${sp.color}22`;
                                          e.currentTarget.style.color = sp.color;
                                        }}
                                        onMouseLeave={e => {
                                          e.currentTarget.style.background = `${sp.color}0D`;
                                          e.currentTarget.style.color = "rgba(226,232,240,0.88)";
                                        }}
                                      >
                                        <span style={{
                                          width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                                          fontSize: 13, background: `${sp.color}20`,
                                          border: `1px solid ${sp.color}30`
                                        }}>{sp.icon}</span>
                                        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sp.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bên phải: tiến độ | công cụ | tài khoản */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={() => go("streak")} title={t.navStreak} aria-label={t.navStreak}
              className={"sp-nav-streak" + (page === "streak" ? " is-active" : "")}>
              <span style={{ fontSize: 14 }}>🔥</span>{streakCount}
            </button>

            <span aria-hidden="true" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

            <label htmlFor="ba-theme-toggle" className="theme-toggle" title={dark ? "Chuyển sang sáng" : "Chuyển sang tối"}>
              <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
              </svg>
              <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
              </svg>
            </label>
            <input id="ba-theme-toggle" type="checkbox" className="sr-only" checked={dark} onChange={e => toggleDark(e.target.checked)} />

            {!isMob && <SettingsDropdown onNavigate={go} />}

            <button onClick={() => go("profile")} className="ba-btn"
              style={{
                background: page === "profile" ? "rgba(56,189,248,0.22)" : "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.25)",
                borderRadius: "50%", width: 34, height: 34, padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", cursor: "pointer"
              }} title={user ? t.profileTitle : "Đăng nhập"} aria-label={user ? t.profileTitle : "Đăng nhập"}>
              {user?.picture
                ? <img src={user.picture} alt="" style={{ width: 34, height: 34, objectFit: "cover" }} />
                : <span style={{ fontSize: user ? 18 : 16 }}>{user ? user.name?.[0] : "👤"}</span>}
            </button>

            {isDrawer && (
              <button onClick={() => setOpen(o => !o)} className="ba-btn"
                aria-label="Menu" aria-expanded={open}
                style={{
                  background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)",
                  color: "white", fontSize: 18, padding: "6px 10px", borderRadius: 10
                }}>
                {open ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Ngăn kéo (mobile / tablet): ô lưới 2 cột theo nhóm */}
      {isDrawer && open && (
        <div
          style={{
            position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
            animation: "fadeIn 0.2s ease"
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "linear-gradient(180deg,#0F172A 0%,#1E3A5F 100%)",
              borderBottom: "1px solid rgba(56,189,248,0.2)",
              maxHeight: "calc(100dvh - 56px - env(safe-area-inset-bottom,0px))",
              overflowY: "auto", WebkitOverflowScrolling: "touch",
              padding: "12px 14px calc(14px + env(safe-area-inset-bottom,0px))",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: "slideDown 0.25s cubic-bezier(.4,0,.2,1)"
            }}
            onClick={e => e.stopPropagation()}
          >
            {groups.map(group => {
              const isActive = activeGroupId === group.id;

              if (group.items.length === 1) {
                const l = group.items[0];
                return (
                  <button key={group.id} onClick={() => go(l.id)}
                    className={"sp-tile" + (page === l.id ? " is-active" : "")}
                    style={{ width: "100%" }}>
                    <span className="sp-nav-ico">{l.icon}</span>{l.label}
                  </button>
                );
              }

              return (
                <div key={group.id}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, margin: "16px 2px 8px",
                    fontSize: 12, fontWeight: 800,
                    color: isActive ? "#38BDF8" : "rgba(148,163,184,0.85)"
                  }}>
                    {group.label}
                    <span style={{ flex: 1, height: 1, background: "rgba(56,189,248,0.12)" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {group.items.map((l, idx) => (
                      <button key={l.id} onClick={() => go(l.id)}
                        className={"sp-tile" + (page === l.id ? " is-active" : "")}
                        style={group.items.length % 2 === 1 && idx === group.items.length - 1 ? { gridColumn: "1 / -1" } : undefined}>
                        <span className="sp-nav-ico">{l.icon}</span>{l.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ margin: "16px 2px 8px", height: 1, background: "rgba(56,189,248,0.12)" }} />
            <button onClick={() => go("import")}
              className={"sp-tile" + (page === "import" ? " is-active" : "")}
              style={{ width: "100%" }}>
              <span className="sp-nav-ico">📥</span>{t.navData}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════
// FLASHCARD
// ════════════════════════════════════════
// ════════════════════════════════════════
// SM-2+ ADVANCED SRS ALGORITHM
// ════════════════════════════════════════

// sm2Plus: tracks response time + consecutive correct streak + forgetting curve
function sm2Plus(card, quality, responseTimeMs) {
  const q = quality === 0 ? 1 : quality === 1 ? 2 : quality === 2 ? 4 : 5;
  let ef        = card.ef        || 2.5;
  let interval  = card.interval  || 1;
  let rep       = card.rep       || 0;
  let streak    = card.streak    || 0;    // consecutive correct answers
  let totalReps = card.totalReps || 0;
  let avgTime   = card.avgTime   || 4000; // avg response time in ms

  // Update response time rolling average
  avgTime = totalReps === 0 ? responseTimeMs : Math.round((avgTime * 0.7 + responseTimeMs * 0.3));
  totalReps += 1;

  // "Just forgot" detection: wrong after >= 3 days
  const daysSinceDue = card.due ? (Date.now() - card.due + interval*86400000) / 86400000 : 0;
  const justForgot = quality === 0 && daysSinceDue >= 3;

  // "Engraved in memory" detection: 5+ correct, avg response < 3s
  const engraved = streak >= 4 && quality >= 2 && avgTime < 3000;

  if (quality === 0) {
    rep = 0; interval = 1; streak = 0;
    if (justForgot) interval = 0; // show again in same session (<5min)
  } else {
    streak += 1;
    if (rep === 0) interval = 1;
    else if (rep === 1) interval = 6;
    else interval = Math.round(interval * ef);
    rep += 1;
    // Fast correct answers boost interval slightly
    if (quality === 3 && avgTime < 2500) interval = Math.round(interval * 1.15);
    // Engraved: push out 3-6 months
    if (engraved) interval = Math.max(interval, 90 + Math.round(Math.random() * 90));
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  // Memory Stability Score (0-100)
  const stabilityRaw = Math.min(100, Math.round(
    (rep * 12) + (streak * 8) + (ef - 1.3) * 20 - (avgTime > 4000 ? 10 : 0)
  ));
  const stability = Math.max(0, stabilityRaw);

  const due = interval === 0
    ? Date.now() + 5 * 60000           // "just forgot" → 5 minutes
    : Date.now() + interval * 86400000;

  return { ...card, ef, interval, rep, due, lastQuality: quality,
           streak, totalReps, avgTime, stability, justForgot, engraved };
}

function getDueCards(deck) {
  const now = Date.now();
  const due = deck.filter(c => !c.due || c.due <= now);
  return due.length ? due : deck.slice(0, Math.min(8, deck.length));
}

// Chunk data for vocab (2-3 natural collocations per word)
const CHUNKS = {
  "食べる": ["ご飯を食べる", "朝ごはんを食べる", "一緒に食べる"],
  "飲む":   ["水を飲む", "お茶を飲む", "薬を飲む"],
  "行く":   ["学校に行く", "どこへ行く", "一緒に行く"],
  "来る":   ["家に来る", "電車で来る", "また来る"],
  "見る":   ["テレビを見る", "映画を見る", "夢を見る"],
  "する":   ["勉強する", "仕事をする", "電話する"],
  "言う":   ["何と言う", "そう言う", "一言言う"],
  "聞く":   ["音楽を聞く", "話を聞く", "道を聞く"],
  "読む":   ["本を読む", "新聞を読む", "声に出して読む"],
  "書く":   ["手紙を書く", "日記を書く", "漢字を書く"],
  "話す":   ["日本語で話す", "友達と話す", "電話で話す"],
  "思う":   ["そう思う", "大切だと思う", "どう思う"],
};
function getChunks(jp) {
  return CHUNKS[jp] || null;
}

// Keigo levels for common verbs
const KEIGO = {
  "食べる":  { casual:"食べる",humble:"いただく",honorific:"召し上がる",note:"Nói về sếp/khách → dùng 召し上がる" },
  "飲む":    { casual:"飲む",humble:"いただく",honorific:"召し上がる",note:"Cùng quy tắc như 食べる" },
  "行く":    { casual:"行く",humble:"参る（まいる）",honorific:"いらっしゃる",note:"Nói về bản thân khiêm tốn → 参る" },
  "来る":    { casual:"来る",humble:"参る（まいる）",honorific:"いらっしゃる",note:"Hỏi sếp → いらっしゃいますか？" },
  "する":    { casual:"する",humble:"いたす",honorific:"なさる",note:"Xin phép → させていただく" },
  "いる":    { casual:"いる",humble:"おる",honorific:"いらっしゃる",note:"Hỏi vị trí sếp → いらっしゃいますか？" },
  "言う":    { casual:"言う",humble:"申す（もうす）",honorific:"おっしゃる",note:"Trích dẫn lời sếp → おっしゃった" },
  "もらう":  { casual:"もらう",humble:"いただく",honorific:"くださる",note:"Nhận từ cấp trên → いただく" },
};
function getKeigo(jp) { return KEIGO[jp] || null; }

// ════════════════════════════════════════
// COLLOCATION PANEL (shared component)
// ════════════════════════════════════════
function CollocationPanel({ word, rom, vn, dark, onClose }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState("collocations"); // collocations | keigo | links

  const keigo = getKeigo(word);
  const localChunks = getChunks(word);

  useEffect(() => {
    let cancelled = false;
    const fetch2 = async () => {
      try {
        const res = await fetch("/api/claude", {
          method: "POST", headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 700,
            system: `Chuyên gia tiếng Nhật. Trả lời JSON thuần không markdown:
{"collocations":[{"jp":"cụm","rom":"romaji","vn":"nghĩa","freq":"Rất phổ biến|Phổ biến|Thỉnh thoảng","context":"Anime|Đời sống|Học đường|Công sở"}],"examples":[{"jp":"câu","vn":"nghĩa","nuance":"Thân mật|Trang trọng|Trung tính"}]}`,
            messages: [{role:"user",content:`Từ: ${word} (${rom}) = ${vn}. Tạo 5 collocations phổ biến và 3 câu ví dụ ngắn với sắc thái khác nhau.`}]
          })
        });
        const d = await res.json();
        if (!cancelled) {
          const raw = d.content?.[0]?.text || "{}";
          setData(JSON.parse(raw.replace(/```json|```/g,"").trim()));
        }
      } catch(e) {
        if (!cancelled) setData({ error: true });
      }
      if (!cancelled) setLoading(false);
    };
    fetch2();
    return () => { cancelled = true; };
  }, [word]);

  const bg = dark ? "rgba(15,23,42,0.97)" : "white";
  const border = "1.5px solid rgba(56,189,248,0.3)";
  const freqColor = f => f==="Rất phổ biến"?"#10B981":f==="Phổ biến"?"#38BDF8":"#94A3B8";
  const nuanceColor = n => n==="Trang trọng"?"#2563EB":n==="Thân mật"?"#D97706":"#64748B";

  const ytQuery = (word) => `https://www.youtube.com/results?search_query=${encodeURIComponent(word + " 日常会話")}`;
  const maziiLink = `https://mazii.net/search/word?lang=vi&query=${encodeURIComponent(word)}`;
  const jishoLink = `https://jisho.org/search/${encodeURIComponent(word)}`;

  const TABS = [
    { id:"collocations", label:"🔗 Collocations" },
    { id:"keigo",        label:"🎩 Keigo"         },
    { id:"links",        label:"🔎 Tra thêm"      },
  ];

  return (
    <div className="ba-modal-backdrop" style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div className="ba-modal-inner" style={{background:bg,borderRadius:24,border,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",width:"100%",maxWidth:480,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1E3A8A,#2563EB,#0EA5E9)",padding:"20px 20px 16px",color:"white",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:36,fontWeight:900,lineHeight:1,marginBottom:4}}>{word}</div>
              <div style={{fontSize:14,opacity:0.75}}>{rom} · {vn}</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",width:32,height:32,borderRadius:50,cursor:"pointer",fontSize:16,fontWeight:700}}>✕</button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${dark?"rgba(56,189,248,0.15)":"#eee"}`,flexShrink:0,background:dark?"rgba(15,23,42,0.5)":"rgba(239,246,255,0.5)"}}>
          {TABS.map(tb=>(
            <button key={tb.id} onClick={()=>setTab(tb.id)}
              style={{flex:1,background:"none",border:"none",padding:"10px 4px",fontSize:12,fontWeight:tab===t.id?800:500,color:tab===t.id?"#38BDF8":dark?"rgba(255,255,255,0.5)":"#64748B",borderBottom:tab===t.id?"3px solid #38BDF8":"3px solid transparent",cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{overflowY:"auto",flex:1,padding:20}}>
          {tab === "collocations" && (
            <>
              {loading && <div style={{textAlign:"center",padding:24,color:dark?"#93C5FD":C.muted}}><span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:24}}>⏳</span><div style={{marginTop:8,fontSize:13}}>AI đang tìm collocations…</div></div>}
              {!loading && data && !data.error && (
                <>
                  {/* Local chunks first */}
                  {localChunks && (
                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#7C3AED",marginBottom:8,letterSpacing:1}}>⚡ CỤM ĐI KÈM PHỔ BIẾN</div>
                      {localChunks.map((c,i)=>(
                        <div key={i} style={{background:dark?"rgba(124,58,237,0.1)":"rgba(124,58,237,0.05)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,padding:"8px 12px",marginBottom:6,fontSize:14,fontWeight:700,color:dark?"#DDD6FE":"#4C1D95"}}>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* AI Collocations */}
                  {data.collocations?.length > 0 && (
                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#2563EB",marginBottom:8,letterSpacing:1}}>🔗 COLLOCATIONS (AI)</div>
                      {data.collocations.map((col,i)=>(
                        <div key={i} style={{background:dark?"rgba(15,23,42,0.7)":"#F8FAFF",border:"1px solid rgba(56,189,248,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:8}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                            <div>
                              <span style={{fontSize:17,fontWeight:900,color:dark?"white":C.text}}>{col.jp}</span>
                              <span style={{fontSize:12,color:C.muted,marginLeft:8}}>{col.rom}</span>
                            </div>
                            <div style={{display:"flex",gap:4}}>
                              <span style={{fontSize:9,fontWeight:700,color:freqColor(col.freq),background:`${freqColor(col.freq)}15`,padding:"2px 7px",borderRadius:20,border:`1px solid ${freqColor(col.freq)}30`}}>{col.freq}</span>
                            </div>
                          </div>
                          <div style={{fontSize:13,color:dark?"#93C5FD":"#334155",marginBottom:4}}>{col.vn}</div>
                          <span style={{fontSize:9,color:"#7C3AED",background:"rgba(124,58,237,0.1)",padding:"2px 7px",borderRadius:20}}>{col.context}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Examples */}
                  {data.examples?.length > 0 && (
                    <div>
                      <div style={{fontSize:11,fontWeight:800,color:"#059669",marginBottom:8,letterSpacing:1}}>🗣 VÍ DỤ CÂU</div>
                      {data.examples.map((ex,i)=>(
                        <div key={i} style={{background:dark?"rgba(5,150,105,0.08)":"rgba(5,150,105,0.04)",border:`1px solid rgba(5,150,105,0.2)`,borderLeft:`3px solid ${nuanceColor(ex.nuance)}`,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                          <div style={{fontSize:16,fontWeight:800,color:dark?"white":C.text,marginBottom:3}}>{ex.jp}</div>
                          <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{ex.vn}</div>
                          <span style={{fontSize:10,color:nuanceColor(ex.nuance),fontWeight:700}}>{ex.nuance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {!loading && data?.error && <div style={{color:"#EF4444",textAlign:"center",padding:20}}>Không tải được. Kiểm tra kết nối.</div>}
            </>
          )}

          {tab === "keigo" && (
            <div>
              {keigo ? (
                <>
                  <div style={{background:dark?"rgba(30,58,138,0.3)":"rgba(239,246,255,0.8)",borderRadius:16,padding:16,marginBottom:12,border:"1.5px solid rgba(56,189,248,0.25)"}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#38BDF8",marginBottom:12,letterSpacing:1}}>🎭 CẤP ĐỘ LỊCH SỰ</div>
                    {[
                      {label:"👥 Thông thường (với bạn bè)", jp:keigo.casual, color:"#10B981"},
                      {label:"🙏 Khiêm nhường (nói về mình)", jp:keigo.humble, color:"#38BDF8"},
                      {label:"👑 Tôn kính (nói về sếp/khách)", jp:keigo.honorific, color:"#7C3AED"},
                    ].map((k,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${dark?"rgba(255,255,255,0.07)":"#e5e7eb"}`:"none"}}>
                        <span style={{fontSize:12,color:dark?"rgba(255,255,255,0.55)":C.muted}}>{k.label}</span>
                        <span style={{fontSize:18,fontWeight:900,color:k.color}}>{k.jp}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{background:dark?"rgba(245,158,11,0.1)":"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:12,padding:"12px 14px",fontSize:13,color:dark?"#FCD34D":"#92400E"}}>
                    ⚠️ {keigo.note}
                  </div>
                </>
              ) : (
                <div style={{textAlign:"center",padding:32,color:C.muted}}>
                  <div style={{fontSize:40,marginBottom:8}}>🎩</div>
                  <div style={{fontSize:14}}>Từ này không có dạng kính ngữ đặc biệt.</div>
                  <div style={{fontSize:12,marginTop:6,opacity:0.7}}>Thêm 丁寧語 (ます・です) là đủ lịch sự.</div>
                </div>
              )}

              {/* Politeness warning */}
              <div style={{marginTop:16,background:dark?"rgba(239,68,68,0.08)":"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:800,color:"#EF4444",marginBottom:6}}>🚨 CẢNH BÁO NGỮ CẢNH</div>
                <div style={{fontSize:12,color:dark?"#FCA5A5":C.text,lineHeight:1.6}}>
                  Dùng dạng từ thông thường với cấp trên/khách trong môi trường chính thức có thể bị coi là <strong>mất lịch sự</strong>. Nhật Bản rất coi trọng keigo trong giao tiếp công sở.
                </div>
              </div>
            </div>
          )}

          {tab === "links" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:11,fontWeight:800,color:C.muted,marginBottom:4,letterSpacing:1}}>📖 TRA CỨU NGOÀI HỆ THỐNG</div>
              {[
                {icon:"🔍",name:"Mazii",sub:"Từ điển Nhật–Việt chi tiết",url:maziiLink,color:"#E53E3E"},
                {icon:"📚",name:"Jisho",sub:"Từ điển Nhật–Anh toàn diện",url:jishoLink,color:"#2563EB"},
              ].map((l,i)=>(
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",gap:14,background:dark?"rgba(30,58,138,0.3)":"rgba(239,246,255,0.8)",border:`1px solid ${l.color}25`,borderRadius:16,padding:"14px 16px",textDecoration:"none",cursor:"pointer",transition:"all 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform=""}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${l.color}15`,border:`1.5px solid ${l.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                    {l.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:15,color:l.color,marginBottom:2}}>{l.name}</div>
                    <div style={{fontSize:12,color:C.muted}}>{l.sub}</div>
                  </div>
                  <span style={{color:C.muted,fontSize:16}}>→</span>
                </a>
              ))}

              <div style={{fontSize:11,fontWeight:800,color:C.muted,marginTop:8,marginBottom:4,letterSpacing:1}}>🎥 NGHE THẬT TRÊN YOUTUBE</div>
              {[
                {label:`「${word}」日常会話`,url:ytQuery(word + " 日常会話"),note:"Hội thoại hàng ngày"},
                {label:`「${word}」vlog日本語`,url:ytQuery(word + " vlog"),note:"Vlog tự nhiên"},
                {label:`「${word}」勉強`,url:ytQuery(word + " 勉強"),note:"Video học tiếng Nhật"},
              ].map((y,i)=>(
                <a key={i} href={y.url} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",gap:12,background:dark?"rgba(220,38,38,0.08)":"rgba(254,226,226,0.5)",border:"1px solid rgba(220,38,38,0.2)",borderRadius:14,padding:"11px 14px",textDecoration:"none",cursor:"pointer",transition:"all 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(220,38,38,0.15)":"rgba(254,226,226,0.8)"}
                  onMouseLeave={e=>e.currentTarget.style.background=dark?"rgba(220,38,38,0.08)":"rgba(254,226,226,0.5)"}>
                  <span style={{fontSize:20,flexShrink:0}}>▶️</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:dark?"#FCA5A5":"#B91C1C"}}>{y.label}</div>
                    <div style={{fontSize:11,color:C.muted}}>{y.note}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// REAL INPUT POPUP (after every 10 cards)
// ════════════════════════════════════════
function RealInputPopup({ recentWords, onClose, dark }) {
  if (!recentWords?.length) return null;
  const word = recentWords[Math.floor(Math.random() * recentWords.length)];
  const ytBase = `https://www.youtube.com/results?search_query=${encodeURIComponent(word.jp)}`;

  return (
    <div className="ba-modal-backdrop" style={{position:"fixed",inset:0,zIndex:9998,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div className="ba-modal-inner" style={{background:dark?"linear-gradient(145deg,#0F172A,#1E3A5F)":"white",borderRadius:28,border:"2px solid rgba(56,189,248,0.4)",boxShadow:"0 0 60px rgba(56,189,248,0.2), 0 20px 60px rgba(0,0,0,0.5)",width:"100%",maxWidth:400,padding:28,textAlign:"center",animation:"baUnlock 0.5s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:48,marginBottom:8}}>🎉</div>
        <div style={{fontSize:22,fontWeight:900,color:dark?"white":C.text,marginBottom:6}}>+10 Thẻ Hoàn Thành!</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:20,lineHeight:1.6}}>
          Bạn đã sẵn sàng nghe người Nhật thật dùng từ này chưa?
        </div>
        <div style={{background:dark?"rgba(56,189,248,0.1)":"rgba(239,246,255,0.8)",borderRadius:16,padding:"12px 16px",marginBottom:20,border:"1px solid rgba(56,189,248,0.25)"}}>
          <div style={{fontSize:28,fontWeight:900,color:"#38BDF8",marginBottom:2}}>{word.jp}</div>
          <div style={{fontSize:13,color:C.muted}}>{word.vn}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {emoji:"🗣",label:"Hội thoại thực tế",q:word.jp+" 日常会話"},
            {emoji:"📹",label:"Vlog Nhật tự nhiên",q:word.jp+" vlog日本語"},
            {emoji:"📺",label:"Anime có dùng từ này",q:word.jp+" アニメ"},
          ].map((y,i)=>(
            <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(y.q)}`} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:12,background:dark?"rgba(220,38,38,0.12)":"rgba(254,226,226,0.6)",border:"1.5px solid rgba(220,38,38,0.25)",borderRadius:14,padding:"11px 16px",textDecoration:"none",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}>
              <span style={{fontSize:20}}>{y.emoji}</span>
              <span style={{fontWeight:700,fontSize:13,color:dark?"#FCA5A5":"#B91C1C",flex:1,textAlign:"left"}}>{y.label}</span>
              <span style={{fontSize:12,color:C.muted}}>YouTube →</span>
            </a>
          ))}
        </div>
        <button onClick={onClose} className="ba-btn" style={{width:"100%",marginTop:16,background:"linear-gradient(135deg,#38BDF8,#2563EB)",color:"white",padding:"12px",fontSize:14,boxShadow:"0 4px 20px rgba(37,99,235,0.3)"}}>
          ✨ Tiếp tục học
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// CHUNK TRAINING COMPONENT
// ════════════════════════════════════════
function ChunkTrainer({ word, rom, vn, dark, onClose }) {
  const localChunks = getChunks(word);
  const t = useT();
  const [phase, setPhase]       = useState("intro"); // intro|particle|order|done
  const [score, setScore]       = useState(0);
  const [aiChunks, setAiChunks] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers]   = useState({});
  const [result, setResult]     = useState(null);

  // Particle fill quiz: simple blanks using local chunks
  const particles = ["を","に","で","が","は","も","と","へ"];

  const generateQ = useCallback(async () => {
    if (localChunks && localChunks.length >= 2) {
      setAiChunks(localChunks.map(c=>({chunk:c, particle: c.includes("を")?"を":c.includes("に")?"に":c.includes("で")?"で":"が"})));
      setPhase("particle");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:400,
          system:`JSON thuần:{"chunks":[{"chunk":"cụm đầy đủ","blank":"cụm với ___ thay cho trợ từ","particle":"trợ từ đúng","decoys":["trợ từ sai 1","trợ từ sai 2"]}]}`,
          messages:[{role:"user",content:`Tạo 3 bài tập điền trợ từ cho từ "${word}" (${vn}). Mỗi bài có 3 lựa chọn trợ từ.`}]
        })
      });
      const d = await res.json();
      const raw = d.content?.[0]?.text||"{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setAiChunks(parsed.chunks || []);
    } catch(e) { setAiChunks([]); }
    setLoading(false);
    setPhase("particle");
  }, [word, vn, localChunks]);

  const checkAnswer = (q, ans) => {
    const correct = aiChunks[q]?.particle;
    const ok = ans === correct;
    setAnswers(a=>({...a,[q]:ans}));
    setResult(ok);
    if (ok) setScore(s=>s+1);
    setTimeout(()=>{
      setResult(null);
      if (currentQ+1 >= (aiChunks?.length||0)) setPhase("done");
      else setCurrentQ(i=>i+1);
    }, 800);
  };

  const bg = dark ? "rgba(15,23,42,0.97)" : "white";

  return (
    <div className="ba-modal-backdrop" style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div className="ba-modal-inner" style={{background:bg,borderRadius:24,border:"1.5px solid rgba(124,58,237,0.35)",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",width:"100%",maxWidth:440,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#4C1D95,#7C3AED,#A78BFA)",padding:"18px 20px",color:"white",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:900,fontSize:18}}>⚡ Chunk Training</div>
            <div style={{fontSize:12,opacity:0.75}}>{word} · {vn}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",width:30,height:30,borderRadius:50,cursor:"pointer",fontSize:14}}>✕</button>
        </div>

        <div style={{padding:20}}>
          {phase === "intro" && (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:12}}>⚡</div>
              <div style={{fontSize:18,fontWeight:900,color:dark?"white":C.text,marginBottom:8}}>Luyện theo CỤM</div>
              <div style={{fontSize:14,color:C.muted,marginBottom:20,lineHeight:1.7}}>
                Thay vì học từ đơn lẻ, hãy luyện từ trong cụm thật — điền trợ từ đúng!
              </div>
              <button onClick={generateQ} className="ba-btn" style={{background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"white",padding:"12px 28px",fontSize:15,boxShadow:"0 4px 20px rgba(124,58,237,0.4)"}}>
                {loading ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span> : "🚀 Bắt đầu"}
              </button>
            </div>
          )}

          {phase === "particle" && aiChunks && currentQ < aiChunks.length && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:12,color:C.muted}}>Câu {currentQ+1}/{aiChunks.length}</span>
                <span style={{fontSize:13,fontWeight:800,color:"#7C3AED"}}>✅ {score}</span>
              </div>
              <div style={{background:dark?"rgba(124,58,237,0.1)":"rgba(124,58,237,0.05)",borderRadius:16,padding:"16px",marginBottom:16,textAlign:"center",border:"1.5px solid rgba(124,58,237,0.2)"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:700}}>ĐIỀN TRỢ TỪ ĐÚNG VÀO CHỖ TRỐNG</div>
                <div style={{fontSize:22,fontWeight:900,color:dark?"white":C.text,lineHeight:1.5}}>
                  {aiChunks[currentQ]?.blank?.replace("___","[___]") || aiChunks[currentQ]?.chunk}
                </div>
              </div>
              {result !== null && (
                <div style={{textAlign:"center",fontSize:24,marginBottom:12,animation:"baStar 0.4s ease"}}>
                  {result ? "✅" : "❌"}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {(aiChunks[currentQ]?.decoys
                  ? [aiChunks[currentQ].particle, ...aiChunks[currentQ].decoys].sort(()=>Math.random()-0.5)
                  : particles.slice(0,3)
                ).map((p,i)=>{
                  const chosen = answers[currentQ];
                  const isCorrect = aiChunks[currentQ]?.particle === p;
                  const bg2 = chosen ? (isCorrect?"rgba(16,185,129,0.2)":p===chosen?"rgba(239,68,68,0.2)":"rgba(148,163,184,0.06)") : "rgba(148,163,184,0.06)";
                  return (
                    <button key={i} onClick={()=>!answers[currentQ] && checkAnswer(currentQ, p)}
                      style={{background:bg2,border:`1.5px solid ${chosen?(isCorrect?"rgba(16,185,129,0.5)":p===chosen?"rgba(239,68,68,0.5)":"rgba(148,163,184,0.15)"):"rgba(124,58,237,0.25)"}`,borderRadius:12,padding:"12px",fontSize:20,fontWeight:900,cursor:answers[currentQ]?"default":"pointer",color:dark?"white":C.text,fontFamily:"'Nunito',sans-serif"}}>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "done" && (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:8}}>{score >= 2?"🏆":"📚"}</div>
              <div style={{fontSize:24,fontWeight:900,color:"#7C3AED",marginBottom:4}}>{score}/{aiChunks?.length||0}</div>
              <div style={{fontSize:14,color:C.muted,marginBottom:20}}>{score >= 2?"Bạn đã nắm được cụm từ!":"Thử lại để nhớ chắc hơn!"}</div>
              <button onClick={onClose} className="ba-btn" style={{background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"white",padding:"12px 28px",fontSize:14,boxShadow:"0 4px 20px rgba(124,58,237,0.3)"}}>
                Hoàn thành ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// FLASHCARD PAGE – SM-2+ SRS FULL
// ════════════════════════════════════════
// ════════════════════════════════════════
// DECK FILTER DROPDOWN – custom styled (replaces native <select>)
// ════════════════════════════════════════
const DECK_FILTER_GROUPS = [
  {
    label: "🌐 TẤT CẢ",
    items: [
      { value:"all", label:"Tất cả bài học", sub:"All Flashcards", color:"#7DD3FC", icon:"🌐" },
    ]
  },
  {
    label: "📊 TRÌNH ĐỘ JLPT",
    items: [
      { value:"N5", label:"N5 · Sơ cấp",      color:"#22C55E", icon:"🟢" },
      { value:"N4", label:"N4 · Sơ trung cấp",color:"#3B82F6", icon:"🔵" },
      { value:"N3", label:"N3 · Trung cấp",   color:"#F59E0B", icon:"🟡" },
      { value:"N2", label:"N2 · Cao cấp",     color:"#EF4444", icon:"🔴" },
      { value:"N1", label:"N1 · Thượng cấp",  color:"#A855F7", icon:"🟣" },
    ]
  },
  {
    label: "💼 TỪ VỰNG CHUYÊN NGÀNH",
    items: [
      { value:"💻 IT",         label:"Công nghệ IT & Software",       color:"#38BDF8", icon:"💻" },
      { value:"🍳 Đầu bếp",    label:"Đầu bếp, Nhà hàng & Khách sạn", color:"#F59E0B", icon:"🍳" },
      { value:"⚙️ Kỹ sư",      label:"Kỹ sư, Cơ khí & Xây dựng",      color:"#10B981", icon:"⚙️" },
      { value:"💼 Kinh doanh", label:"Kinh doanh & Thương mại",       color:"#8B5CF6", icon:"💼" },
      { value:"🏥 Y tế",       label:"Y tế & Điều dưỡng (Kaigo)",     color:"#EC4899", icon:"🏥" },
    { value:"🏗️ Xây dựng",   label:"Xây dựng & Kiến trúc",            color:"#F97316", icon:"🏗️" },
    { value:"🌾 Nông nghiệp", label:"Nông nghiệp & Chế biến thực phẩm", color:"#84CC16", icon:"🌾" },
    ]
  },
];

function DeckFilterDropdown({ value, onChange }){
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = DECK_FILTER_GROUPS.flatMap(g=>g.items).find(i=>i.value===value) || DECK_FILTER_GROUPS[0].items[0];

  return (
    <div ref={ref} style={{width:"100%",maxWidth:500,padding:"10px 16px 0",position:"relative"}}>
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{
          width:"100%",display:"flex",alignItems:"center",gap:8,
          background: open ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.75)",
          border: `1.5px solid ${open ? "rgba(56,189,248,0.6)" : "rgba(56,189,248,0.35)"}`,
          borderRadius:16,padding:"9px 14px",
          boxShadow:"0 4px 16px rgba(0,0,0,0.25)",
          cursor:"pointer",fontFamily:"'Nunito',sans-serif",
          transition:"all 0.15s ease"
        }}>
        <span style={{fontSize:15}}>📚</span>
        <span style={{fontSize:12,fontWeight:700,color:"#7DD3FC",whiteSpace:"nowrap"}}>Bộ từ:</span>
        <span style={{fontSize:13,fontWeight:800,color:current.color,flex:1,textAlign:"left",display:"flex",alignItems:"center",gap:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          <span>{current.icon}</span>{current.label}
        </span>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▼</span>
      </button>

      {open && (
        <div style={{
          position:"absolute",top:"calc(100% + 6px)",left:16,right:16,
          background:"#0F172A",border:"1.5px solid rgba(56,189,248,0.3)",
          borderRadius:16,padding:8,zIndex:500,
          boxShadow:"0 16px 48px rgba(0,0,0,0.5)",
          maxHeight:"60vh",overflowY:"auto",
          animation:"fadeSlideIn 0.18s ease"
        }}>
          {DECK_FILTER_GROUPS.map((group,gi)=>(
            <div key={gi} style={{marginBottom:gi<DECK_FILTER_GROUPS.length-1?6:0}}>
              <div style={{
                fontSize:10,fontWeight:800,color:"#7DD3FC",letterSpacing:"0.06em",
                padding:"8px 10px 6px",borderTop:gi>0?"1px solid rgba(56,189,248,0.1)":"none",
                marginTop:gi>0?4:0
              }}>{group.label}</div>
              {group.items.map(item=>{
                const active = value===item.value;
                return(
                  <div key={item.value} onClick={()=>{onChange(item.value);setOpen(false);}}
                    style={{
                      display:"flex",alignItems:"center",gap:10,
                      padding:"9px 12px",borderRadius:10,cursor:"pointer",
                      background:active?`${item.color}18`:"transparent",
                      border:active?`1px solid ${item.color}40`:"1px solid transparent",
                    }}
                    onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(56,189,248,0.06)";}}
                    onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}
                  >
                    <span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:active?800:600,color:active?item.color:"rgba(226,232,240,0.9)"}}>{item.label}</div>
                      {item.sub && <div style={{fontSize:10,color:"rgba(148,163,184,0.6)"}}>{item.sub}</div>}
                    </div>
                    {active && <span style={{color:item.color,fontSize:14}}>✓</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FlashcardPage({markLearned}){
  const w=useWidth(); const isMob=w<640;
  const [dark] = useDarkMode();
  // Màu thích ứng sáng/tối: W = trắng(tối) ↔ xanh đen(sáng); FG = màu chữ chính
  const W  = a => dark ? `rgba(255,255,255,${a})` : `rgba(15,23,42,${a})`;
  const FG = dark ? "white" : "#0F172A";
  const AC = dark ? "#38BDF8" : "#0369A1";   // chữ nhấn xanh
  const SL = a => dark ? `rgba(148,163,184,${a})` : `rgba(71,85,105,${Math.min(1,+a+0.3)})`; // chữ xám phụ
  const PC = c => dark ? c : ({"#6EE7B7":"#047857","#C4B5FD":"#6D28D9","#FCA5A5":"#DC2626","#FCD34D":"#B45309","#FDE68A":"#92400E"}[c]||c);
  const t = useT();

  // ── deck + SRS ────────────────────────────────────────────────────────────
  // Load custom decks from localStorage
  const initDeck = useCallback(()=>{
    // Combine all JLPT & Specialized vocab without duplicates
    const v5Cards = VOCAB_N5.map(v => ({...v, lesson:"n5", topic:"JLPT N5", level_tag:"N5"}));
    const v4Cards = VOCAB_N4.map(v => ({...v, lesson:"n4", topic:"JLPT N4", level_tag:"N4"}));
    const v3Cards = VOCAB_N3.map(v => ({...v, lesson:"n3", topic:"JLPT N3", level_tag:"N3"}));
    const v2Cards = VOCAB_N2.map(v => ({...v, lesson:"n2", topic:"JLPT N2", level_tag:"N2"}));
    const v1Cards = VOCAB_N1.map(v => ({...v, lesson:"n1", topic:"JLPT N1", level_tag:"N1"}));
    const itCards = VOCAB_IT.map(v => ({...v, lesson:"it", topic:"Công nghệ IT", level_tag:"💻 IT"}));
    const resCards = VOCAB_RESTAURANT.map(v => ({...v, lesson:"restaurant", topic:"Đầu bếp & Nhà hàng", level_tag:"🍳 Đầu bếp"}));
    const engCards = VOCAB_ENGINEERING.map(v => ({...v, lesson:"eng", topic:"Kỹ sư & Cơ khí", level_tag:"⚙️ Kỹ sư"}));
    const busCards = VOCAB_BUSINESS.map(v => ({...v, lesson:"bus", topic:"Kinh doanh", level_tag:"💼 Kinh doanh"}));
    const medCards = VOCAB_MEDICAL.map(v => ({...v, lesson:"med", topic:"Y tế & Điều dưỡng", level_tag:"🏥 Y tế"}));
        const conCards = VOCAB_CONSTRUCTION.map(v => ({...v, lesson:"con", topic:"Xây dựng & Kiến trúc",           level_tag:"🏗️ Xây dựng"}));
        const agrCards = VOCAB_AGRICULTURE.map(v  => ({...v, lesson:"agr", topic:"Nông nghiệp & Thực phẩm",        level_tag:"🌾 Nông nghiệp"}));
    
    // Deduplicate by jp character
    const seenJp = new Set();
    const baseVocab = [];
    [...v5Cards, ...v4Cards, ...v3Cards, ...v2Cards, ...v1Cards, ...itCards, ...resCards, ...engCards, ...busCards, ...medCards, ...conCards, ...agrCards].forEach(c => {
      if (!seenJp.has(c.jp)) {
        seenJp.add(c.jp);
        baseVocab.push(c);
      }
    });
    let customCards = [];
    try {
      const decks = JSON.parse(localStorage.getItem("sp_custom_decks") || "[]");
      customCards = decks.flatMap(d => d.cards.map(c => ({
        ...c, lesson:"custom", topic:d.name, level_tag:"Custom",
        ef:c.ef??2.5, interval:c.interval??1, rep:c.rep??0, due:c.due??0,
        streak:c.streak??0, totalReps:c.totalReps??0, avgTime:c.avgTime??4000, stability:c.stability??0
      })));
    } catch {}
    return [...baseVocab, ...customCards].map(c=>({...c,
      ef:c.ef??2.5, interval:c.interval??1, rep:c.rep??0, due:c.due??0,
      streak:c.streak??0, totalReps:c.totalReps??0, avgTime:c.avgTime??4000, stability:c.stability??0
    }));
  },[]);
  const [deckFilter, setDeckFilter] = useState("all");
  const [deck,    setDeck]    = useState(initDeck);
  const [qIdx,    setQIdx]    = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating,setAnimating] = useState(false);
  const [drag,    setDrag]    = useState({active:false,x:0,y:0,startX:0,startY:0});
  const [hint,    setHint]    = useState(null);
  const [sessionStats,setSessionStats] = useState({again:0,hard:0,good:0,easy:0});
  const [done,    setDone]    = useState(false);

  const [queue,   setQueue]   = useState(()=>getDueCards(initDeck()));

  // Re-filter queue when deckFilter changes
  useEffect(() => {
    const fullDeck = initDeck();
    const filtered = fullDeck.filter(c => {
      if (deckFilter === "all") return true;
      if (c.level_tag === deckFilter) return true;
      return false;
    });
    setQueue(filtered.length ? filtered : fullDeck);
    setQIdx(0);
    setFlipped(false);
  }, [deckFilter, initDeck]);

  // ── UI options ────────────────────────────────────────────────────────────
  const [showContext,  setShowContext]   = useState(false);
  const [showRomaji,   setShowRomaji]   = useState(true);
  const [ttsRate,      setTtsRate]      = useState(1.0);  // 0.75 | 1.0 | 1.25
  const [autoPlay,     setAutoPlay]     = useState(false);
  const [ttsPlaying,   setTtsPlaying]   = useState(false);
  const [shadowing,    setShadowing]    = useState(false);
  const [typingMode,   setTypingMode]   = useState(false); // Typing Mode
  const [typedAnswer,  setTypedAnswer]  = useState('');
  const [typeResult,   setTypeResult]   = useState(null);  // null | {ok,diff}
  const [illusionWarn, setIllusionWarn] = useState(false); // 假ảo giác警告

  // ── mnemonics (localStorage persisted per word) ──────────────────────────
  const [mnemonics,    setMnemonics]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_mnemonics') || '{}'); } catch { return {}; }
  });
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemDraft,    setMnemDraft]    = useState('');
  const [mnemPinned,   setMnemPinned]   = useState({});

  const saveMnemonic = (jp, text) => {
    const updated = { ...mnemonics, [jp]: { text, pinned: mnemPinned[jp] || false } };
    setMnemonics(updated);
    try { localStorage.setItem('sp_mnemonics', JSON.stringify(updated)); } catch {}
  };
  const togglePin = (jp) => {
    const updated = { ...mnemonics, [jp]: { ...(mnemonics[jp]||{}), pinned: !(mnemonics[jp]?.pinned) } };
    setMnemonics(updated);
    try { localStorage.setItem('sp_mnemonics', JSON.stringify(updated)); } catch {}
  };
  const deleteMnemonic = (jp) => {
    const updated = { ...mnemonics };
    delete updated[jp];
    setMnemonics(updated);
    try { localStorage.setItem('sp_mnemonics', JSON.stringify(updated)); } catch {}
  };

  // ── panels ────────────────────────────────────────────────────────────────
  const [colPanel,       setColPanel]       = useState(false);
  const [chunkMode,      setChunkMode]      = useState(false);
  const [realInputPopup, setRealInputPopup] = useState(false);
  const [recentWords,    setRecentWords]    = useState([]);
  const [outputWarning,  setOutputWarning]  = useState(false);

  const isDragRef    = useRef(false);
  const markedRef    = useRef(false);
  const startTimeRef = useRef(Date.now());
  const totalAnswered = useRef(0);
  const mcOnlyCount   = useRef(0);
  const noTypingCount = useRef(0); // how many "Easy/Good" without typing
  const typeInputRef  = useRef(null);

  const card = queue[qIdx];
  const dx = drag.x - drag.startX;
  const dy = drag.y - drag.startY;
  const dist = Math.sqrt(dx*dx + dy*dy);

  let cTrans = flipped ? "rotateY(180deg)" : "rotateY(0deg)";
  if (drag.active) cTrans = `translate(${dx}px,${dy}px) rotate(${dx*0.08}deg)`;

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTtsPlaying(false);
    setShowMnemonic(false);
    if (card) setMnemDraft(mnemonics[card.jp]?.text || '');
  }, [qIdx, card?.jp]);

  // ── TTS (female default + speed) ─────────────────────────────────────────
  const playTTS = useCallback((text, rate) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ja-JP";
    utt.rate = rate ?? ttsRate;
    const voices = window.speechSynthesis.getVoices();
    const jpVoices = voices.filter(v => v.lang.startsWith("ja"));
    if (jpVoices.length) {
      // Prefer female voice
      const fem = jpVoices.find(v => /female|woman|kyoko|haruka|mizuki|sakura/i.test(v.name));
      utt.voice = fem || jpVoices[0];
    }
    utt.onstart = () => setTtsPlaying(true);
    utt.onend   = () => { setTtsPlaying(false); if (shadowing) setShadowing(true); };
    window.speechSynthesis.speak(utt);
  }, [ttsRate, shadowing]);

  // Auto-play on flip to back
  useEffect(() => {
    if (flipped && autoPlay && card) {
      setTimeout(() => playTTS(card.jp), 200);
    }
  }, [flipped, autoPlay, card, playTTS]);

  // ── Typing Mode helpers ────────────────────────────────────────────────────
  const checkTyping = () => {
    if (!card || !typedAnswer.trim()) return;
    const target = card.jp;
    const input  = typedAnswer.trim();
    // Char-by-char diff
    const diff = target.split('').map((ch, i) => ({
      ch, ok: input[i] === ch, missing: input[i] === undefined
    }));
    const allOk = diff.every(d => d.ok);
    setTypeResult({ ok: allOk, diff, input });
    if (allOk) {
      // Reset illusion counter
      noTypingCount.current = 0;
    }
  };

  // ── SM-2+ answer ──────────────────────────────────────────────────────────
  const doAnswer = useCallback((quality) => {
    if (animating || done || !card) return;
    const responseMs = Date.now() - startTimeRef.current;
    setAnimating(true); setHint(null); setShowContext(false);
    setTypedAnswer(''); setTypeResult(null); setShadowing(false);
    const label = ['again','hard','good','easy'][quality];
    setSessionStats(s => ({...s, [label]: s[label]+1}));
    const updated = sm2Plus(card, quality, responseMs);
    setDeck(d => {
      const nd = [...d];
      const ci = nd.findIndex(c => c.jp === card.jp);
      if (ci >= 0) nd[ci] = updated;
      return nd;
    });
    if (!markedRef.current) { markLearned(); markedRef.current=true; }

    totalAnswered.current += 1;
    mcOnlyCount.current += 1;
    // Track daily stats
    try {
      const today = new Date().toDateString();
      const stats = JSON.parse(localStorage.getItem("sp_today_stats") || "{}");
      const cur   = (stats.date === today) ? stats : { date: today, wordsLearned: 0, minutesStudied: 0, reviewed: 0 };
      cur.reviewed = (cur.reviewed || 0) + 1;
      if (quality >= 2) cur.wordsLearned = (cur.wordsLearned || 0) + 1;
      localStorage.setItem("sp_today_stats", JSON.stringify(cur));
    } catch {}

    // Illusion detection: >= 70% Easy/Good without typing mode
    if (quality >= 2) {
      noTypingCount.current += 1;
      if (totalAnswered.current >= 10 &&
          noTypingCount.current / totalAnswered.current >= 0.7 &&
          !typingMode) {
        setIllusionWarn(true);
      }
    }

    setRecentWords(rw => [...rw.slice(-19), card]);
    if (totalAnswered.current % 10 === 0) {
      setTimeout(() => setRealInputPopup(true), 400);
    }
    if (totalAnswered.current > 15 && mcOnlyCount.current / totalAnswered.current > 0.85) {
      setOutputWarning(true);
    }

    setTimeout(() => {
      const ni = qIdx+1;
      if (ni >= queue.length) setDone(true);
      else { setQIdx(ni); setFlipped(false); }
      setAnimating(false);
      setDrag({active:false,x:0,y:0,startX:0,startY:0});
    }, 300);
  }, [animating, done, qIdx, queue, card, markLearned, typingMode]);

  // ── Drag/touch ────────────────────────────────────────────────────────────
  const onDown = e => {
    if (animating||done||typingMode) return;
    // Prevent card flip/drag when clicking buttons, inputs or interactive elements
    if (e.target.closest && e.target.closest('button, input, textarea, a, select')) return;
    isDragRef.current = false;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    setDrag({active:true,x:cx,y:cy,startX:cx,startY:cy});
  };
  const onMove = e => {
    if (!drag.active||animating) return;
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    const ddx=cx-drag.startX, ddy=cy-drag.startY;
    if (Math.abs(ddx)>6||Math.abs(ddy)>6) isDragRef.current=true;
    setDrag(d=>({...d,x:cx,y:cy}));
    const thr=50;
    if (ddx>thr&&Math.abs(ddy)<Math.abs(ddx)) setHint('easy');
    else if (ddx<-thr&&Math.abs(ddy)<Math.abs(ddx)) setHint('again');
    else if (ddy>thr) setHint('hard');
    else setHint(null);
  };
  const onUp = () => {
    if (!drag.active) return;
    if (!isDragRef.current) {
      setFlipped(f=>!f);
      setDrag(d=>({...d,active:false}));
      setHint(null);
      return;
    }
    const thr = 80;
    if (dx>thr && Math.abs(dy)<Math.abs(dx)*1.5) doAnswer(3);
    else if (dx<-thr && Math.abs(dy)<Math.abs(dx)*1.5) doAnswer(0);
    else if (dy>thr) doAnswer(1);
    else { setDrag({active:false,x:0,y:0,startX:0,startY:0}); setHint(null); }
  };

  const restart = () => {
    const fresh = initDeck();
    setDeck(fresh); setQueue(getDueCards(fresh)); setQIdx(0);
    setFlipped(false); setSessionStats({again:0,hard:0,good:0,easy:0});
    setDone(false); setAnimating(false); markedRef.current=false;
    setShowContext(false); setTypedAnswer(''); setTypeResult(null);
    totalAnswered.current=0; mcOnlyCount.current=0; noTypingCount.current=0;
    setOutputWarning(false); setIllusionWarn(false);
  };

  const total    = queue.length;
  const progress = total ? Math.round(qIdx/total*100) : 0;
  const cardH    = isMob ? (typingMode ? 200 : 230) : (typingMode ? 240 : 270);

  // ── Done screen ────────────────────────────────────────────────────────────
  if (done) {
    const total2   = sessionStats.again+sessionStats.hard+sessionStats.good+sessionStats.easy;
    const retained = sessionStats.good+sessionStats.easy;
    const pct      = total2 ? Math.round(retained/total2*100) : 0;
    const avgStab  = Math.round(deck.reduce((a,c)=>a+(c.stability||0),0)/deck.length);
    return (
      <div style={{minHeight:"calc(100vh - 56px)",background:dark?"linear-gradient(180deg,#0F172A,#0D1B2E)":"linear-gradient(180deg,#EFF6FF,#DBEAFE)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:FG,padding:24}}>
        <div className="ba-card" style={{maxWidth:440,width:"100%",padding:28,textAlign:"center",background:W(0.04),border:"1.5px solid rgba(56,189,248,0.3)"}}>
          <div style={{fontSize:52,marginBottom:10}}>{pct>=80?"🏆":pct>=60?"⭐":"📚"}</div>
          <div style={{fontSize:26,fontWeight:900,color:AC,marginBottom:4}}>{retained}/{total2} Ghi nhớ</div>
          <div style={{fontSize:14,color:W(0.55),marginBottom:8}}>{pct>=80?"Xuất sắc!":pct>=60?"Tốt lắm!":"Luyện thêm nhé!"}</div>
          <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:AC}}>{avgStab}/100</div>
              <div style={{fontSize:10,color:W(0.4)}}>🧠 Stability</div>
            </div>
          </div>
          <div style={{height:8,background:W(0.1),borderRadius:99,marginBottom:16,overflow:"hidden"}}>
            <div className="ba-progress-fill" style={{width:`${pct}%`}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
            {[{label:"Again",n:sessionStats.again,c:"#EF4444",icon:"🔴"},{label:"Hard",n:sessionStats.hard,c:"#F59E0B",icon:"🟡"},{label:"Good",n:sessionStats.good,c:"#38BDF8",icon:"🔵"},{label:"Easy",n:sessionStats.easy,c:"#10B981",icon:"🟢"}].map((s,i)=>(
              <div key={i} style={{background:W(0.06),borderRadius:12,padding:"8px 4px",border:`1px solid ${s.c}30`,textAlign:"center"}}>
                <div style={{fontSize:14}}>{s.icon}</div>
                <div style={{fontSize:18,fontWeight:900,color:s.c}}>{s.n}</div>
                <div style={{fontSize:9,color:W(0.35)}}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={restart} className="ba-btn" style={{width:"100%",background:"linear-gradient(135deg,#38BDF8,#2563EB)",color:"white",padding:"13px",fontSize:15,boxShadow:"0 4px 20px rgba(56,189,248,0.4)"}}>
            🔄 Học tiếp
          </button>
          {/* Pinned mnemonics summary */}
          {Object.entries(mnemonics).filter(([,v])=>v.pinned).length > 0 && (
            <div style={{marginTop:20,textAlign:"left"}}>
              <div style={{fontSize:11,fontWeight:800,color:PC("#FCD34D"),marginBottom:8,letterSpacing:1}}>📌 GHI CHÚ ĐÃ GHIM</div>
              {Object.entries(mnemonics).filter(([,v])=>v.pinned).map(([jp,v])=>(
                <div key={jp} style={{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:10,padding:"8px 12px",marginBottom:6,display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,fontWeight:900,color:PC("#FCD34D"),flexShrink:0}}>{jp}</span>
                  <span style={{fontSize:11,color:"rgba(253,230,138,0.8)",fontStyle:"italic",lineHeight:1.5}}>{v.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!card) return null;

  const hintColors   = {easy:"rgba(16,185,129,0.18)",again:"rgba(239,68,68,0.18)",hard:"rgba(245,158,11,0.18)"};
  const cardOpacity  = drag.active ? Math.max(0.4, 1-dist/280) : 1;
  const stability    = card.stability > 70 ? "🟢 Vững" : card.stability > 35 ? "🟡 Học" : "🔴 Mới";

  // Pitch bars helper
  const PitchBars = ({rom}) => {
    const raw = (rom||"").toLowerCase().replace(/\s+/g,'');
    const moraRe = /(?:ch|sh|ts|ky|gy|ny|hy|by|py|my|ry|[kgsztdnhbpmrywf])?[aeiou]+|n(?![aeiou])/gi;
    const moras = (raw.match(moraRe)||[]).slice(0,7);
    if (!moras.length) return null;
    return (
      <div style={{display:"flex",flexDirection:"row",gap:4,alignItems:"flex-end",marginTop:3,justifyContent:"center"}}>
        {moras.map((m,i)=>{
          const high = moras.length===1?false:i>0;
          return (
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
              <div style={{width:8,height:high?20:10,borderRadius:3,background:high?"#38BDF8":"#475569"}}/>
              <span style={{fontSize:8,color:W(0.4)}}>{m}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Context sentence example (from vocab data)
  const exSentence = card ? {
    jp: `${card.jp}は大切です。`,
    vn: `${card.vn} rất quan trọng.`,
    formal: `${card.jp}をよく使います。`,
    casual: `${card.jp}、すごいね！`,
  } : null;

  return (
    <div style={{minHeight:"calc(100vh - 56px)",background:dark?"linear-gradient(180deg,#0F172A,#1E3A5F)":"linear-gradient(180deg,#EFF6FF,#DBEAFE)",display:"flex",flexDirection:"column",alignItems:"center",color:FG,userSelect:"none",paddingBottom:24}}>

      {/* ── Industry & Level Category Dropdown ─────────────────────────────── */}
      <DeckFilterDropdown value={deckFilter} onChange={(v)=>{setDeckFilter(v);setQIdx(0);setFlipped(false);}}/>

      {/* ── Top settings bar ─────────────────────────────────────── */}
      <div style={{width:"100%",maxWidth:500,padding:"10px 16px 0",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        {/* Speed selector */}
        <div style={{display:"flex",gap:3,background:W(0.07),borderRadius:20,padding:"3px",flexShrink:0}}>
          {[{r:0.75,l:"0.75x"},{r:1.0,l:"1x"},{r:1.25,l:"1.25x"}].map(s=>(
            <button key={s.r} onClick={()=>setTtsRate(s.r)}
              style={{background:ttsRate===s.r?"linear-gradient(135deg,#38BDF8,#2563EB)":"transparent",
                border:"none",color:ttsRate===s.r?"white":FG,borderRadius:16,padding:"3px 9px",fontSize:10,fontWeight:700,cursor:"pointer",
                boxShadow:ttsRate===s.r?"0 2px 8px rgba(37,99,235,0.5)":"none"}}>
              {s.l}
            </button>
          ))}
        </div>
        {/* Toggle buttons */}
        {[
          {key:"autoPlay",  label:"⚡ "+t.fcAuto,  val:autoPlay,   set:setAutoPlay,  tip:"Tự phát âm khi lật"},
          {key:"romaji",    label:t.fcRomaji,       val:showRomaji, set:setShowRomaji,tip:"Hiện/tắt romaji"},
          {key:"typing",    label:"⌨ "+t.fcType,    val:typingMode, set:setTypingMode,tip:"Typing Mode"},
        ].map(btn=>(
          <button key={btn.key} onClick={()=>btn.set(v=>!v)} title={btn.tip}
            style={{background:btn.val?"linear-gradient(135deg,#38BDF8,#2563EB)":W(0.08),
              border:btn.val?"none":`1px solid ${W(0.15)}`,
              color:btn.val?"white":FG,borderRadius:20,padding:"4px 10px",fontSize:10,fontWeight:700,cursor:"pointer",
              boxShadow:btn.val?"0 2px 8px rgba(37,99,235,0.4)":"none"}}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* ── Warnings ──────────────────────────────────────────────── */}
      {outputWarning && (
        <div style={{width:"100%",maxWidth:500,marginTop:6,padding:"0 16px"}}>
          <div style={{background:"linear-gradient(90deg,rgba(245,158,11,0.85),rgba(234,88,12,0.85))",borderRadius:12,padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <span style={{fontSize:11,fontWeight:700}}>⚠️ Mạnh Input, yếu Output — thử luyện Nói!</span>
            <button onClick={()=>{setOutputWarning(false);mcOnlyCount.current=0;}} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:20,padding:"2px 9px",fontSize:10,cursor:"pointer",fontWeight:700}}>OK</button>
          </div>
        </div>
      )}
      {illusionWarn && (
        <div style={{width:"100%",maxWidth:500,marginTop:6,padding:"0 16px"}}>
          <div style={{background:"linear-gradient(90deg,rgba(124,58,237,0.85),rgba(79,70,229,0.85))",borderRadius:12,padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <span style={{fontSize:11,fontWeight:700}}>🧠 Bạn đang dựa vào nhận diện — hãy bật ⌨ Gõ để kiểm tra trí nhớ thật!</span>
            <button onClick={()=>{setIllusionWarn(false);setTypingMode(true);}} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:20,padding:"2px 9px",fontSize:10,cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>Bật Gõ</button>
          </div>
        </div>
      )}

      {/* ── Progress header ──────────────────────────────────────── */}
      <div style={{padding:"8px 16px 0",width:"100%",maxWidth:500}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,color:W(0.4)}}>{qIdx+1}/{total}</span>
            <span style={{fontSize:10,color:SL(0.6)}}>{stability}</span>
            {card.engraved && <span style={{fontSize:10,background:"rgba(16,185,129,0.2)",color:PC("#6EE7B7"),padding:"1px 7px",borderRadius:20}}>✨ Khắc cốt</span>}
          </div>
          <span style={{fontSize:10,color:"rgba(56,189,248,0.7)",fontWeight:700}}>
            EF {(card.ef||2.5).toFixed(1)} · {(card.avgTime/1000).toFixed(1)}s
          </span>
        </div>
        <div style={{height:4,background:W(0.07),borderRadius:99,overflow:"hidden",marginBottom:8}}>
          <div className="ba-progress-fill" style={{width:`${progress}%`}}/>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:6}}>
          {[{l:"🔴",n:sessionStats.again},{l:"🟡",n:sessionStats.hard},{l:"🔵",n:sessionStats.good},{l:"🟢",n:sessionStats.easy}].map((s,i)=>(
            <div key={i} style={{flex:1,background:W(0.05),borderRadius:7,padding:"3px 2px",textAlign:"center",fontSize:10}}>{s.l} {s.n}</div>
          ))}
        </div>
      </div>

      {/* ── CARD AREA ────────────────────────────────────────────── */}
      <div style={{perspective:1200,WebkitPerspective:1200,width:"100%",maxWidth:500,padding:"0 16px",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>

        {/* Swipe hint overlay */}
        {hint && (
          <div style={{position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",zIndex:10,pointerEvents:"none"}}>
            <div style={{background:hint==="easy"?"rgba(16,185,129,0.92)":hint==="again"?"rgba(239,68,68,0.92)":"rgba(245,158,11,0.92)",color:"white",padding:"8px 20px",borderRadius:50,fontWeight:900,fontSize:15,boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
              {hint==="easy"?"✅ EASY":hint==="again"?"🔄 AGAIN":"😓 HARD"}
            </div>
          </div>
        )}

        <div
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          style={{width:"100%",height:cardH,position:"relative",cursor:typingMode?"default":"pointer",
            background:hint?hintColors[hint]:"transparent",borderRadius:24,transition:"background 0.2s"}}>
          <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",WebkitTransformStyle:"preserve-3d",
            transform:cTrans,WebkitTransform:cTrans,transition:drag.active?"none":"transform 0.5s cubic-bezier(.4,0,.2,1)",opacity:cardOpacity}}>

            {/* ── FRONT ─────────────────────────────────────────── */}
            <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",
              background:dark?`linear-gradient(145deg,${W(0.07)},${W(0.02)})`:"linear-gradient(145deg,#FFFFFF,#EFF6FF)",
              backdropFilter:dark?"blur(12px)":"none",borderRadius:24,
              border:dark?"1.5px solid rgba(56,189,248,0.28)":"1.5px solid rgba(37,99,235,0.22)",
              boxShadow:dark?"0 8px 32px rgba(0,0,0,0.35)":"0 8px 28px rgba(37,99,235,0.16)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>

              <div style={{fontSize:10,color:dark?"rgba(56,189,248,0.55)":"rgba(3,105,161,0.75)",marginBottom:8,letterSpacing:2,fontWeight:700}}>
                {card.topic} · Bài {card.lesson}
              </div>

              <div className="card-content">
                {/* Big word */}
                <div style={{fontSize:isMob?48:60,fontWeight:900,color:FG,textShadow:"0 0 24px rgba(56,189,248,0.4)",lineHeight:1,fontFamily:"'Noto Sans JP',sans-serif",marginBottom:4}}>
                  {card.jp}
                </div>

                {/* Romaji (toggleable) */}
                {showRomaji && (
                  <div style={{fontSize:13,color:SL(0.6),letterSpacing:"0.08em",marginTop:3,marginBottom:0,textAlign:"center",width:"100%"}}>
                    {card.rom}
                  </div>
                )}

                {/* Pitch bars */}
                <PitchBars rom={card.rom}/>
              </div>

              {/* TTS button — floating top-right */}
              <button onClick={e=>{e.stopPropagation();playTTS(card.jp);}}
                style={{
                  position:"absolute",top:14,right:14,
                  width:38,height:38,borderRadius:50,
                  background:ttsPlaying?"linear-gradient(135deg,#10B981,#059669)":"rgba(56,189,248,0.18)",
                  border:`1.5px solid ${ttsPlaying?"rgba(16,185,129,0.6)":"rgba(56,189,248,0.4)"}`,
                  color:FG,fontSize:16,cursor:"pointer",
                  boxShadow:ttsPlaying?"0 0 16px rgba(16,185,129,0.5)":"0 2px 8px rgba(0,0,0,0.3)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  animation:ttsPlaying?"baBounce 0.8s infinite":"none",
                  transition:"all 0.2s"
                }}>
                {ttsPlaying ? "🔊" : "▶"}
              </button>

              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
                <span style={{fontSize:11,color:SL(0.45)}}>{t.fcTap}</span>
                {mnemonics[card.jp]?.text && (
                  <span style={{fontSize:9,background:mnemonics[card.jp]?.pinned?"rgba(245,158,11,0.3)":"rgba(245,158,11,0.15)",color:PC("#FCD34D"),padding:"1px 7px",borderRadius:20,border:"1px solid rgba(245,158,11,0.3)",fontWeight:700}}>
                    {mnemonics[card.jp]?.pinned?"📌":"📝"} Có ghi chú
                  </span>
                )}
              </div>
            </div>

            {/* ── BACK ──────────────────────────────────────────── */}
            <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",WebkitTransform:"rotateY(180deg)",
              background:dark?"linear-gradient(145deg,rgba(30,58,138,0.65),rgba(15,23,42,0.92))":"linear-gradient(145deg,#F0F9FF,#DBEAFE)",
              backdropFilter:dark?"blur(12px)":"none",borderRadius:24,
              border:dark?"1.5px solid rgba(56,189,248,0.38)":"1.5px solid rgba(37,99,235,0.3)",
              boxShadow:dark?"0 8px 32px rgba(0,0,0,0.35)":"0 8px 28px rgba(37,99,235,0.16)",
              display:"flex",flexDirection:"column",padding:"16px 18px 12px",overflow:"hidden"}}>

              {/* Core meaning */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{fontSize:24,fontWeight:900,color:AC,lineHeight:1,marginBottom:2}}>{card.vn}</div>
                  {showRomaji && <div style={{fontSize:12,color:SL(0.6)}}>{card.rom}</div>}
                  <div style={{fontSize:30,fontWeight:900,color:FG,marginTop:2}}>{card.jp}</div>
                </div>
                {/* TTS on back */}
                <button onClick={e=>{e.stopPropagation();playTTS(card.jp);}}
                  style={{width:38,height:38,borderRadius:50,flexShrink:0,
                    background:ttsPlaying?"linear-gradient(135deg,#10B981,#059669)":"rgba(56,189,248,0.15)",
                    border:`1.5px solid ${ttsPlaying?"rgba(16,185,129,0.5)":"rgba(56,189,248,0.35)"}`,
                    color:FG,fontSize:16,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    animation:ttsPlaying?"baBounce 0.8s infinite":"none"}}>
                  {ttsPlaying?"🔊":"▶"}
                </button>
              </div>

              {/* Context sentence */}
              {exSentence && (
                <div style={{background:"rgba(56,189,248,0.07)",border:"1px solid rgba(56,189,248,0.18)",borderRadius:10,padding:"7px 10px",marginBottom:8}}>
                  <div style={{fontSize:10,color:dark?"rgba(56,189,248,0.55)":"rgba(3,105,161,0.75)",fontWeight:700,marginBottom:3}}>📝 VÍ DỤ</div>
                  <div style={{fontSize:13,fontWeight:700,color:FG,marginBottom:1}}>
                    {exSentence.jp.split(card.jp).map((part,i,arr)=>(
                      <span key={i}>{part}{i<arr.length-1&&<span style={{color:AC,textDecoration:"underline"}}>{card.jp}</span>}</span>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:SL(0.7)}}>{exSentence.vn}</div>
                </div>
              )}

              {/* Shadowing prompt */}
              {shadowing && (
                <div style={{background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.35)",borderRadius:10,padding:"6px 10px",marginBottom:6,textAlign:"center",animation:"baBounce 0.6s ease"}}>
                  <div style={{fontSize:11,color:PC("#6EE7B7"),fontWeight:800}}>🗣 Nhại lại ngay bây giờ!</div>
                  <div style={{fontSize:10,color:W(0.5),marginTop:1}}>{card.jp} · {card.rom}</div>
                </div>
              )}


              {/* Extended context */}
              {showContext && exSentence && (
                <div style={{display:"flex",flexDirection:"column",gap:3,marginTop:7}}>
                  {[{label:"😊 Thân mật",jp:exSentence.casual,c:"#D97706"},{label:"🎩 Trang trọng",jp:exSentence.formal,c:"#2563EB"}].map((cx,i)=>(
                    <div key={i} style={{background:W(0.04),borderRadius:8,padding:"5px 9px",fontSize:11,border:`1px solid ${cx.c}20`}}>
                      <span style={{color:cx.c,fontWeight:700,fontSize:10}}>{cx.label}:</span>
                      <span style={{color:W(0.6),marginLeft:6}}>{cx.jp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── MNEMONIC PANEL ─────────────────────────────── */}
              {showMnemonic && (
                <div onClick={e=>e.stopPropagation()} style={{marginTop:8,background:"rgba(245,158,11,0.08)",border:"1.5px solid rgba(245,158,11,0.3)",borderRadius:12,padding:"10px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:10,fontWeight:800,color:PC("#FCD34D"),letterSpacing:1}}>🧠 MẸO NHỚ CÁ NHÂN</span>
                    {mnemonics[card.jp]?.text && (
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>togglePin(card.jp)}
                          style={{background:mnemonics[card.jp]?.pinned?"rgba(245,158,11,0.3)":W(0.08),border:"1px solid rgba(245,158,11,0.3)",color:PC("#FCD34D"),borderRadius:20,padding:"2px 8px",fontSize:10,cursor:"pointer"}}>
                          {mnemonics[card.jp]?.pinned?"📌 Đã ghim":"📌 Ghim"}
                        </button>
                        <button onClick={()=>{deleteMnemonic(card.jp);setMnemDraft('');}}
                          style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",color:PC("#FCA5A5"),borderRadius:20,padding:"2px 8px",fontSize:10,cursor:"pointer"}}>
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Show existing note */}
                  {mnemonics[card.jp]?.text && (
                    <div style={{background:"rgba(245,158,11,0.1)",borderRadius:8,padding:"7px 10px",marginBottom:8,fontSize:12,color:PC("#FDE68A"),lineHeight:1.6,fontStyle:"italic",borderLeft:"3px solid rgba(245,158,11,0.5)"}}>
                      "{mnemonics[card.jp].text}"
                    </div>
                  )}
                  {/* Input */}
                  <textarea
                    value={mnemDraft}
                    onChange={e=>setMnemDraft(e.target.value)}
                    placeholder={`VD: "${card.jp}" giống âm "${card.rom}" → liên tưởng…`}
                    rows={2}
                    style={{width:"100%",background:dark?"rgba(15,23,42,0.6)":"rgba(255,255,255,0.9)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,padding:"7px 9px",fontSize:11,color:FG,outline:"none",resize:"none",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box",lineHeight:1.5}}
                  />
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <button onClick={()=>{if(mnemDraft.trim())saveMnemonic(card.jp,mnemDraft.trim());}}
                      style={{flex:1,background:mnemDraft.trim()?"linear-gradient(135deg,#F59E0B,#D97706)":W(0.08),border:"none",color:mnemDraft.trim()?"white":FG,borderRadius:10,padding:"6px",fontSize:11,fontWeight:700,cursor:mnemDraft.trim()?"pointer":"default"}}>
                      💾 Lưu mẹo nhớ
                    </button>
                    <button onClick={async()=>{
                      setMnemDraft('⏳ AI đang gợi ý...');
                      try {
                        const res = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,system:"Tạo 1 mẹo nhớ sáng tạo tiếng Việt cho từ tiếng Nhật. Ngắn gọn, hài hước, dễ hình dung. Chỉ trả lời mẹo nhớ, không giải thích.",messages:[{role:"user",content:`Từ: ${card.jp} (${card.rom}) = ${card.vn}`}]})});
                        const d = await res.json();
                        setMnemDraft(d.content?.[0]?.text?.trim()||'');
                      } catch { setMnemDraft(''); }
                    }}
                      style={{background:"rgba(124,58,237,0.2)",border:"1px solid rgba(124,58,237,0.35)",color:PC("#C4B5FD"),borderRadius:10,padding:"6px 10px",fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                      ✨ AI gợi ý
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── TYPING MODE input ─────────────────────────────────── */}
        {typingMode && (
          <div style={{marginTop:12,padding:"0 2px"}}>
            {!flipped ? (
              <div style={{background:W(0.05),borderRadius:16,padding:"12px 14px",border:"1.5px solid rgba(56,189,248,0.2)"}}>
                <div style={{fontSize:11,color:"rgba(56,189,248,0.7)",fontWeight:700,marginBottom:8}}>
                  ⌨ GÕ LẠI TIẾNG NHẬT: <span style={{color:W(0.6)}}>{card.vn}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input ref={typeInputRef}
                    value={typedAnswer}
                    onChange={e=>{setTypedAnswer(e.target.value);setTypeResult(null);}}
                    onKeyDown={e=>{if(e.key==="Enter")checkTyping();}}
                    placeholder="Gõ tiếng Nhật..."
                    style={{flex:1,background:dark?"rgba(15,23,42,0.7)":"rgba(255,255,255,0.9)",border:`1.5px solid ${typeResult?typeResult.ok?"rgba(16,185,129,0.6)":"rgba(239,68,68,0.5)":"rgba(56,189,248,0.3)"}`,borderRadius:12,padding:"9px 12px",fontSize:16,color:FG,outline:"none",fontFamily:"'Nunito',sans-serif"}}
                  />
                  <button onClick={checkTyping}
                    className="ba-btn"
                    style={{background:"linear-gradient(135deg,#38BDF8,#2563EB)",color:"white",padding:"9px 14px",fontSize:13,flexShrink:0}}>
                    ✓
                  </button>
                </div>
                {/* Char-by-char diff result */}
                {typeResult && (
                  <div style={{marginTop:10}}>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>
                      {typeResult.diff.map((d,i)=>(
                        <span key={i} style={{
                          fontSize:20,fontWeight:900,
                          color:d.ok?"#38BDF8":d.missing?SL(0.3):"#EF4444",
                          background:d.ok?"transparent":d.missing?"transparent":"rgba(239,68,68,0.15)",
                          borderRadius:6,padding:"0 3px",
                          textDecoration:d.ok?"none":"underline",
                          textDecorationColor:"#EF4444"
                        }}>{d.ch}</span>
                      ))}
                    </div>
                    {typeResult.ok
                      ? <div style={{fontSize:12,color:PC("#6EE7B7"),fontWeight:700}}>✅ Chính xác! Lật thẻ để tiếp tục.</div>
                      : <div style={{fontSize:12,color:PC("#FCA5A5")}}>❌ Bạn gõ: <strong>{typeResult.input}</strong> — Đúng: <strong>{card.jp}</strong></div>
                    }
                  </div>
                )}
              </div>
            ) : (
              /* SM-2 buttons when flipped + typing */
              <div style={{display:"flex",gap:8}}>
                {[
                  {q:0,label:t.fcAgain,sub:"<1d", color:"#EF4444",icon:"🔄"},
                  {q:1,label:t.fcHard, sub:"1-3d",color:"#F59E0B",icon:"😓"},
                  {q:2,label:t.fcGood, sub:`${Math.max(1,card.interval||1)}d`,color:AC,icon:"👍"},
                  {q:3,label:t.fcEasy, sub:`${Math.max(4,(card.interval||1)*2)}d`,color:"#10B981",icon:"✨"},
                ].map(btn=>(
                  <button key={btn.q} onClick={()=>doAnswer(btn.q)}
                    style={{flex:1,background:`${btn.color}18`,border:`1.5px solid ${btn.color}40`,color:FG,borderRadius:14,padding:isMob?"7px 4px":"9px 4px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${btn.color}30`;e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${btn.color}18`;e.currentTarget.style.transform="";}}>
                    <div style={{fontSize:14}}>{btn.icon}</div>
                    <div style={{fontSize:isMob?10:11,fontWeight:800,color:btn.color}}>{btn.label}</div>
                    <div style={{fontSize:9,color:W(0.3),marginTop:1}}>{btn.sub}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Normal SM-2 buttons (non-typing) ──────────────────── */}
        {!typingMode && flipped && (
          <div style={{display:"flex",gap:8,marginTop:12,padding:"0 2px"}}>
            {[
              {q:0,label:t.fcAgain,sub:"<1 ngày",color:"#EF4444",icon:"🔄"},
              {q:1,label:t.fcHard, sub:"1-3 ngày",color:"#F59E0B",icon:"😓"},
              {q:2,label:t.fcGood, sub:`${Math.max(1,card.interval||1)}d`,color:AC,icon:"👍"},
              {q:3,label:t.fcEasy, sub:`${Math.max(4,(card.interval||1)*2)}d`,color:"#10B981",icon:"✨"},
            ].map(btn=>(
              <button key={btn.q} onClick={()=>doAnswer(btn.q)}
                style={{flex:1,background:`${btn.color}18`,border:`1.5px solid ${btn.color}40`,color:FG,borderRadius:14,padding:isMob?"8px 4px":"10px 4px",cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${btn.color}30`;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${btn.color}18`;e.currentTarget.style.transform="";}}>
                <div style={{fontSize:15}}>{btn.icon}</div>
                <div style={{fontSize:isMob?11:12,fontWeight:800,color:btn.color}}>{btn.label}</div>
                <div style={{fontSize:9,color:W(0.35),marginTop:1}}>{btn.sub}</div>
              </button>
            ))}
          </div>
        )}

        {!flipped && !typingMode && (
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 4px 0",opacity:0.38}}>
            <span style={{fontSize:10,color:"#EF4444"}}>← Again</span>
            <span style={{fontSize:10,color:W(0.4)}}>↓ Hard</span>
            <span style={{fontSize:10,color:"#10B981"}}>Easy →</span>
          </div>
        )}
      </div>

      {/* ── Panels ───────────────────────────────────────────────── */}
      {colPanel    && card && <CollocationPanel word={card.jp} rom={card.rom} vn={card.vn} dark={dark} onClose={()=>setColPanel(false)}/>}
      {chunkMode   && card && <ChunkTrainer     word={card.jp} rom={card.rom} vn={card.vn} dark={dark} onClose={()=>setChunkMode(false)}/>}
      {realInputPopup        && <RealInputPopup recentWords={recentWords} onClose={()=>setRealInputPopup(false)} dark={dark}/>}
    </div>
  );
}


// ════════════════════════════════════════
// KANA DATA – đầy đủ toàn bộ
// ════════════════════════════════════════

// Hàng cơ bản Hiragana
const HIRAGANA_BASIC = [
  // a-row
  {char:"あ",rom:"a"},{char:"い",rom:"i"},{char:"う",rom:"u"},{char:"え",rom:"e"},{char:"お",rom:"o"},
  // ka-row
  {char:"か",rom:"ka"},{char:"き",rom:"ki"},{char:"く",rom:"ku"},{char:"け",rom:"ke"},{char:"こ",rom:"ko"},
  // sa-row
  {char:"さ",rom:"sa"},{char:"し",rom:"shi"},{char:"す",rom:"su"},{char:"せ",rom:"se"},{char:"そ",rom:"so"},
  // ta-row
  {char:"た",rom:"ta"},{char:"ち",rom:"chi"},{char:"つ",rom:"tsu"},{char:"て",rom:"te"},{char:"と",rom:"to"},
  // na-row
  {char:"な",rom:"na"},{char:"に",rom:"ni"},{char:"ぬ",rom:"nu"},{char:"ね",rom:"ne"},{char:"の",rom:"no"},
  // ha-row
  {char:"は",rom:"ha"},{char:"ひ",rom:"hi"},{char:"ふ",rom:"fu"},{char:"へ",rom:"he"},{char:"ほ",rom:"ho"},
  // ma-row
  {char:"ま",rom:"ma"},{char:"み",rom:"mi"},{char:"む",rom:"mu"},{char:"め",rom:"me"},{char:"も",rom:"mo"},
  // ya-row
  {char:"や",rom:"ya"},{char:"",rom:""},{char:"ゆ",rom:"yu"},{char:"",rom:""},{char:"よ",rom:"yo"},
  // ra-row
  {char:"ら",rom:"ra"},{char:"り",rom:"ri"},{char:"る",rom:"ru"},{char:"れ",rom:"re"},{char:"ろ",rom:"ro"},
  // wa-row
  {char:"わ",rom:"wa"},{char:"",rom:""},{char:"",rom:""},{char:"",rom:""},{char:"を",rom:"wo"},
  // n
  {char:"ん",rom:"n"},{char:"",rom:""},{char:"",rom:""},{char:"",rom:""},{char:"",rom:""},
];

// Dakuten が行 (voiced)
const HIRAGANA_DAKUTEN = [
  {char:"が",rom:"ga"},{char:"ぎ",rom:"gi"},{char:"ぐ",rom:"gu"},{char:"げ",rom:"ge"},{char:"ご",rom:"go"},
  {char:"ざ",rom:"za"},{char:"じ",rom:"ji"},{char:"ず",rom:"zu"},{char:"ぜ",rom:"ze"},{char:"ぞ",rom:"zo"},
  {char:"だ",rom:"da"},{char:"ぢ",rom:"di"},{char:"づ",rom:"du"},{char:"で",rom:"de"},{char:"ど",rom:"do"},
  {char:"ば",rom:"ba"},{char:"び",rom:"bi"},{char:"ぶ",rom:"bu"},{char:"べ",rom:"be"},{char:"ぼ",rom:"bo"},
];

// Handakuten ぱ行
const HIRAGANA_HANDAKUTEN = [
  {char:"ぱ",rom:"pa"},{char:"ぴ",rom:"pi"},{char:"ぷ",rom:"pu"},{char:"ぺ",rom:"pe"},{char:"ぽ",rom:"po"},
];

// Âm ghép き→きゃ きゅ きょ
const HIRAGANA_COMPOUND = [
  {char:"きゃ",rom:"kya"},{char:"きゅ",rom:"kyu"},{char:"きょ",rom:"kyo"},
  {char:"しゃ",rom:"sha"},{char:"しゅ",rom:"shu"},{char:"しょ",rom:"sho"},
  {char:"ちゃ",rom:"cha"},{char:"ちゅ",rom:"chu"},{char:"ちょ",rom:"cho"},
  {char:"にゃ",rom:"nya"},{char:"にゅ",rom:"nyu"},{char:"にょ",rom:"nyo"},
  {char:"ひゃ",rom:"hya"},{char:"ひゅ",rom:"hyu"},{char:"ひょ",rom:"hyo"},
  {char:"みゃ",rom:"mya"},{char:"みゅ",rom:"myu"},{char:"みょ",rom:"myo"},
  {char:"りゃ",rom:"rya"},{char:"りゅ",rom:"ryu"},{char:"りょ",rom:"ryo"},
  {char:"ぎゃ",rom:"gya"},{char:"ぎゅ",rom:"gyu"},{char:"ぎょ",rom:"gyo"},
  {char:"じゃ",rom:"ja"},{char:"じゅ",rom:"ju"},{char:"じょ",rom:"jo"},
  {char:"びゃ",rom:"bya"},{char:"びゅ",rom:"byu"},{char:"びょ",rom:"byo"},
  {char:"ぴゃ",rom:"pya"},{char:"ぴゅ",rom:"pyu"},{char:"ぴょ",rom:"pyo"},
];

// Katakana basic
const KATAKANA_BASIC = [
  {char:"ア",rom:"a"},{char:"イ",rom:"i"},{char:"ウ",rom:"u"},{char:"エ",rom:"e"},{char:"オ",rom:"o"},
  {char:"カ",rom:"ka"},{char:"キ",rom:"ki"},{char:"ク",rom:"ku"},{char:"ケ",rom:"ke"},{char:"コ",rom:"ko"},
  {char:"サ",rom:"sa"},{char:"シ",rom:"shi"},{char:"ス",rom:"su"},{char:"セ",rom:"se"},{char:"ソ",rom:"so"},
  {char:"タ",rom:"ta"},{char:"チ",rom:"chi"},{char:"ツ",rom:"tsu"},{char:"テ",rom:"te"},{char:"ト",rom:"to"},
  {char:"ナ",rom:"na"},{char:"ニ",rom:"ni"},{char:"ヌ",rom:"nu"},{char:"ネ",rom:"ne"},{char:"ノ",rom:"no"},
  {char:"ハ",rom:"ha"},{char:"ヒ",rom:"hi"},{char:"フ",rom:"fu"},{char:"ヘ",rom:"he"},{char:"ホ",rom:"ho"},
  {char:"マ",rom:"ma"},{char:"ミ",rom:"mi"},{char:"ム",rom:"mu"},{char:"メ",rom:"me"},{char:"モ",rom:"mo"},
  {char:"ヤ",rom:"ya"},{char:"",rom:""},{char:"ユ",rom:"yu"},{char:"",rom:""},{char:"ヨ",rom:"yo"},
  {char:"ラ",rom:"ra"},{char:"リ",rom:"ri"},{char:"ル",rom:"ru"},{char:"レ",rom:"re"},{char:"ロ",rom:"ro"},
  {char:"ワ",rom:"wa"},{char:"",rom:""},{char:"",rom:""},{char:"",rom:""},{char:"ヲ",rom:"wo"},
  {char:"ン",rom:"n"},{char:"",rom:""},{char:"",rom:""},{char:"",rom:""},{char:"",rom:""},
];

const KATAKANA_DAKUTEN = [
  {char:"ガ",rom:"ga"},{char:"ギ",rom:"gi"},{char:"グ",rom:"gu"},{char:"ゲ",rom:"ge"},{char:"ゴ",rom:"go"},
  {char:"ザ",rom:"za"},{char:"ジ",rom:"ji"},{char:"ズ",rom:"zu"},{char:"ゼ",rom:"ze"},{char:"ゾ",rom:"zo"},
  {char:"ダ",rom:"da"},{char:"ヂ",rom:"di"},{char:"ヅ",rom:"du"},{char:"デ",rom:"de"},{char:"ド",rom:"do"},
  {char:"バ",rom:"ba"},{char:"ビ",rom:"bi"},{char:"ブ",rom:"bu"},{char:"ベ",rom:"be"},{char:"ボ",rom:"bo"},
];

const KATAKANA_HANDAKUTEN = [
  {char:"パ",rom:"pa"},{char:"ピ",rom:"pi"},{char:"プ",rom:"pu"},{char:"ペ",rom:"pe"},{char:"ポ",rom:"po"},
];

const KATAKANA_COMPOUND = [
  {char:"キャ",rom:"kya"},{char:"キュ",rom:"kyu"},{char:"キョ",rom:"kyo"},
  {char:"シャ",rom:"sha"},{char:"シュ",rom:"shu"},{char:"ショ",rom:"sho"},
  {char:"チャ",rom:"cha"},{char:"チュ",rom:"chu"},{char:"チョ",rom:"cho"},
  {char:"ニャ",rom:"nya"},{char:"ニュ",rom:"nyu"},{char:"ニョ",rom:"nyo"},
  {char:"ヒャ",rom:"hya"},{char:"ヒュ",rom:"hyu"},{char:"ヒョ",rom:"hyo"},
  {char:"ミャ",rom:"mya"},{char:"ミュ",rom:"myu"},{char:"ミョ",rom:"myo"},
  {char:"リャ",rom:"rya"},{char:"リュ",rom:"ryu"},{char:"リョ",rom:"ryo"},
  {char:"ギャ",rom:"gya"},{char:"ギュ",rom:"gyu"},{char:"ギョ",rom:"gyo"},
  {char:"ジャ",rom:"ja"},{char:"ジュ",rom:"ju"},{char:"ジョ",rom:"jo"},
  {char:"ビャ",rom:"bya"},{char:"ビュ",rom:"byu"},{char:"ビョ",rom:"byo"},
  {char:"ピャ",rom:"pya"},{char:"ピュ",rom:"pyu"},{char:"ピョ",rom:"pyo"},
  // Katakana đặc biệt cho ngoại lai
  {char:"ファ",rom:"fa"},{char:"フィ",rom:"fi"},{char:"フェ",rom:"fe"},{char:"フォ",rom:"fo"},{char:"",rom:""},
  {char:"ウィ",rom:"wi"},{char:"ウェ",rom:"we"},{char:"ウォ",rom:"wo"},{char:"",rom:""},{char:"",rom:""},
  {char:"ティ",rom:"ti"},{char:"ディ",rom:"di"},{char:"トゥ",rom:"tu"},{char:"ドゥ",rom:"du"},{char:"",rom:""},
];

// ════════════════════════════════════════
// KANA PAGE COMPONENT (dùng chung cho Hiragana và Katakana)
// ════════════════════════════════════════
function KanaPage({ type = "hiragana" }) {
    const t = useT();
const w = useWidth(); const isMob = w < 640;
  const isHira = type === "hiragana";
  const CC = useColors();
  const [dark] = useDarkMode();

  const BASIC     = isHira ? HIRAGANA_BASIC     : KATAKANA_BASIC;
  const DAKUTEN   = isHira ? HIRAGANA_DAKUTEN   : KATAKANA_DAKUTEN;
  const HANDAKUTEN= isHira ? HIRAGANA_HANDAKUTEN: KATAKANA_HANDAKUTEN;
  const COMPOUND  = isHira ? HIRAGANA_COMPOUND  : KATAKANA_COMPOUND;

  const accentColor = isHira ? C.primary : "#7C3AED";

  // ── TTS for kana cells ──────────────────────────────────────
  const [playingChar, setPlayingChar] = useState(null);
  const longPressTimer = useRef(null);

  const playKana = (char, rate = 1.0) => {
    if (!window.speechSynthesis || !char) return;
    window.speechSynthesis.cancel();
    setPlayingChar(char);
    const utt = new SpeechSynthesisUtterance(char);
    utt.lang = "ja-JP"; utt.rate = rate; utt.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => /kyoko|haruka|mizuki|sakura|female|woman/i.test(v.name) && v.lang.startsWith("ja"))
                 || voices.find(v => v.lang.startsWith("ja"));
    if (jaVoice) utt.voice = jaVoice;
    utt.onend = () => setPlayingChar(null);
    utt.onerror = () => setPlayingChar(null);
    window.speechSynthesis.speak(utt);
  };

  const handleKanaClick = (char, e) => {
    // double-click → natural speed 1.0 (default)
    // single click → normal 0.9
    playKana(char, 0.9);
  };
  const handleKanaMouseDown = (char) => {
    longPressTimer.current = setTimeout(() => { playKana(char, 0.5); }, 500);
  };
  const handleKanaMouseUp = () => {
    clearTimeout(longPressTimer.current);
  };
  const accentLight = isHira ? "#fff0f0" : "#f3f0ff";
  const accentBorder= isHira ? "#ffccd5" : "#ddd6fe";

  const ALL_QUIZ = [
    ...BASIC.filter(k=>k.char),
    ...DAKUTEN,
    ...HANDAKUTEN,
    ...COMPOUND,
  ].filter(k => k.char);

  // ── Per-session scores for unlock gate ──
  const [scores, setScores] = useState({ recognize:null }); // {correct,total}
  const [tab, setTab] = useState("table");

  // Unlock write tab: recognition ≥ 70%
  const pct = s => s && s.total > 0 ? Math.round(s.correct / s.total * 100) : 0;
  const recPct  = pct(scores.recognize);
  const writeUnlocked = recPct >= 70 && lisPct >= 70;

  // ── Shared quiz generator ──
  const makeQ = (pool) => {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const opts = [item.rom];
    while (opts.length < 4) {
      const r = pool[Math.floor(Math.random() * pool.length)].rom;
      if (!opts.includes(r)) opts.push(r);
    }
    return { ...item, opts: opts.sort(() => Math.random() - 0.5) };
  };

  // ── Render kana reference grid (interactive TTS) ──
  const renderGrid = (items, cols=5, isCompound=false) => (
    <div style={{ display:"grid", gridTemplateColumns: isCompound?`repeat(${isMob?3:6},1fr)`:`repeat(${cols},1fr)`, gap: isMob?6:8 }}>
      {items.map((k,i) => {
        const isPlaying = playingChar === k.char;
        return !k.char
          ? <div key={i} style={{ borderRadius:10, background:CC.dark?"rgba(255,255,255,0.04)":"#f8f9fa", aspectRatio:"1", border:`1px dashed ${CC.dark?"rgba(255,255,255,0.1)":"#e0e0e0"}` }}/>
          : <div key={i}
              onClick={()=>handleKanaClick(k.char)}
              onMouseDown={()=>handleKanaMouseDown(k.char)}
              onMouseUp={handleKanaMouseUp}
              onMouseLeave={handleKanaMouseUp}
              onTouchStart={()=>handleKanaMouseDown(k.char)}
              onTouchEnd={handleKanaMouseUp}
              onDoubleClick={()=>playKana(k.char, 1.2)}
              title={`Nhấn: nghe thường • Giữ: chậm • 2×: nhanh`}
              style={{
                background: isPlaying
                  ? `linear-gradient(135deg,${accentColor}30,${accentColor}15)`
                  : CC.bgCard,
                borderRadius:10,
                padding:isMob?"8px 4px":"12px 6px",
                textAlign:"center",
                cursor:"pointer",
                border: isPlaying
                  ? `2px solid ${accentColor}`
                  : `1px solid ${CC.dark?"rgba(255,255,255,0.08)":"#eee"}`,
                boxShadow: isPlaying
                  ? `0 0 16px ${accentColor}50`
                  : "0 2px 8px rgba(0,0,0,0.06)",
                transform: isPlaying ? "scale(1.08)" : "scale(1)",
                transition:"all 0.15s",
                userSelect:"none",
                position:"relative",
              }}>
              {isPlaying && (
                <div style={{ position:"absolute", top:2, right:3, fontSize:8, color:accentColor, animation:"baBounce 0.5s infinite" }}>🔊</div>
              )}
              <div style={{ fontSize:isCompound?(isMob?15:18):(isMob?18:24), fontWeight:700, lineHeight:1, color: isPlaying ? accentColor : accentColor }}>{k.char}</div>
              <div style={{ fontSize:isMob?9:11, marginTop:3, color:CC.muted, fontWeight:600 }}>{k.rom}</div>
            </div>
      })}
    </div>
  );

  // ── Tab hint text ──
  const ttsHint = (
    <div style={{
      display:"flex", alignItems:"center", gap:6,
      background:CC.dark?"rgba(56,189,248,0.08)":"rgba(37,99,235,0.06)",
      border:`1px solid ${CC.dark?"rgba(56,189,248,0.2)":"rgba(37,99,235,0.12)"}`,
      borderRadius:10, padding:"7px 12px", marginBottom:12,
      fontSize:11, color:CC.muted, flexWrap:"wrap"
    }}>
      <span style={{fontSize:14}}>💡</span>
      <span><strong style={{color:accentColor}}>Nhấn</strong> → nghe thường &nbsp;·&nbsp; <strong style={{color:accentColor}}>Giữ 0.5s</strong> → nghe chậm &nbsp;·&nbsp; <strong style={{color:accentColor}}>Nhấn 2×</strong> → nghe nhanh</span>
    </div>
  );

  // ── Tab definitions ──
  const TABS = [
    { id:"table",     icon:"📋", label:"Bảng chữ" },
    { id:"recognize", icon:"🔍", label:"Nhận diện" },
    
    { id:"write",     icon:"✍️",  label:"Viết",    locked: !writeUnlocked },
  ];

  // ────────────────────────────────────────
  // SUB: Recognition Quiz (hiện ký tự → chọn romaji)
  // ────────────────────────────────────────
  function RecognizeQuiz() {
    const TOTAL = 10;
    const CC = useColors();
    const [q, setQ] = useState(() => makeQ(ALL_QUIZ));
    const [ans, setAns] = useState(null);
    const [done, setDone] = useState(false);
    const [sc, setSc] = useState({correct:0,total:0});

    useEffect(() => {
      if (sc.total >= TOTAL) {
        setScores(s => ({ ...s, recognize: { correct: sc.correct, total: sc.total } }));
      }
    }, [sc]);

    const next = () => {
      if (sc.total >= TOTAL) { setDone(true); return; }
      setQ(makeQ(ALL_QUIZ));
      setAns(null);
    };
    const handleAns = (o) => {
      if (ans) return;
      const ok = o === q.rom;
      setAns(o);
      setSc(s => ({ correct: s.correct+(ok?1:0), total: s.total+1 }));
    };
    const restart = () => { setQ(makeQ(ALL_QUIZ)); setAns(null); setDone(false); setSc({correct:0,total:0}); setScores(s=>({...s,recognize:null})); };
    if (done) {
      const p = Math.round(sc.correct/sc.total*100);
      return (
        <div className="ba-card" style={{ textAlign:"center", padding:24 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>{p>=70?"🎉":"📚"}</div>
          <div style={{ fontSize:28, fontWeight:900, color:accentColor }}>{sc.correct}/{sc.total}</div>
          <div style={{ fontSize:14, fontWeight:700, color:CC.text, margin:"4px 0 8px" }}>{p>=70?"Đạt yêu cầu! ✓":"Chưa đủ 70% – thử lại nhé!"}</div>
          <div style={{ height:7, background:dark?"rgba(255,255,255,0.1)":"#e5e7eb", borderRadius:99, marginBottom:16, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${p}%`, background:p>=70?"#22c55e":accentColor, borderRadius:99, transition:"width 1s" }}/>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            <button onClick={restart} style={{ background:"#f5f5f5", border:"1px solid #ddd", padding:"10px 20px", borderRadius:12, cursor:"pointer", fontWeight:700, fontSize:13, color:CC.muted }}>🔄 Làm lại</button>
            
          </div>
        </div>
      );
    }
    return (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:13, color:CC.muted }}>Câu {sc.total+1}/{TOTAL}</span>
          <span style={{ fontSize:13, fontWeight:700, color:accentColor }}>{sc.correct} đúng</span>
        </div>
        <div style={{ background:isHira?`linear-gradient(135deg,${C.text},${C.accent})`:`linear-gradient(135deg,#3730a3,#6d28d9)`, borderRadius:18, padding:isMob?"20px":"28px", textAlign:"center", marginBottom:14 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>Đây là ký tự gì?</div>
          <div style={{ fontSize:isMob?72:96, fontWeight:900, color:"white", lineHeight:1, textShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>{q.char}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {q.opts.map((o,i) => {
            let bg="white", border="1.5px solid #e0e0e0", col=C.text;
            if (ans) {
              if (o===q.rom) { bg="#f0fdf4"; border="2px solid #22c55e"; col="#166534"; }
              else if (o===ans) { bg="#fef2f2"; border="2px solid #ef4444"; col="#991b1b"; }
              else { col="#9ca3af"; }
            }
            return <button key={i} onClick={()=>handleAns(o)} disabled={!!ans}
              style={{ background:bg, border, color:col, borderRadius:12, padding:"14px", fontSize:18, fontWeight:700, cursor:ans?"default":"pointer", transition:"all 0.15s" }}>{o}</button>;
          })}
        </div>
        {ans && (
          <div style={{ marginTop:10 }}>
            <div style={{ background:ans===q.rom?"#f0fdf4":"#fef2f2", borderRadius:10, padding:"10px 14px", fontSize:13, color:ans===q.rom?"#166534":"#991b1b", fontWeight:600, marginBottom:8 }}>
              {ans===q.rom ? `✅ Chính xác! "${q.char}" = ${q.rom}` : `❌ Sai! "${q.char}" = ${q.rom}`}
            </div>
            <button onClick={next} className="ba-btn" style={{ width:"100%", background:"linear-gradient(135deg,#38BDF8,#2563EB)", color:"white", padding:"13px", fontSize:14, boxShadow:"0 4px 20px rgba(37,99,235,0.3)" }}>
              {sc.total >= TOTAL ? "Xem kết quả →" : t.next}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────
  // CANVAS DRAWING COMPONENT
  // ────────────────────────────────────────
  function DrawCanvas({ strokeWidth, onHasStrokes }) {
    const canvasRef = useRef(null);
    const drawing   = useRef(false);
    const lastPt    = useRef(null);
    const paths     = useRef([]); // array of point arrays for smooth rendering
    const currentPath = useRef([]);

    // Initialise canvas background
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      // Retina scaling
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      // grid guidelines
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(rect.width/2,0); ctx.lineTo(rect.width/2,rect.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,rect.height/2); ctx.lineTo(rect.width,rect.height/2); ctx.stroke();
      ctx.setLineDash([]);
    }, []);

    const getPos = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      if (e.touches) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const redrawAll = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // background
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      // guidelines
      ctx.strokeStyle = "#f0f0f0"; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(rect.width/2,0); ctx.lineTo(rect.width/2,rect.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,rect.height/2); ctx.lineTo(rect.width,rect.height/2); ctx.stroke();
      ctx.setLineDash([]);
      // all paths
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = strokeWidth; ctx.lineCap = "round"; ctx.lineJoin = "round";
      paths.current.forEach(path => {
        if (path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          const mid = { x:(path[i-1].x+path[i].x)/2, y:(path[i-1].y+path[i].y)/2 };
          ctx.quadraticCurveTo(path[i-1].x, path[i-1].y, mid.x, mid.y);
        }
        ctx.lineTo(path[path.length-1].x, path[path.length-1].y);
        ctx.stroke();
      });
    };

    const startDraw = (e) => {
      e.preventDefault();
      drawing.current = true;
      const pt = getPos(e);
      currentPath.current = [pt];
      lastPt.current = pt;
    };

    const moveDraw = (e) => {
      e.preventDefault();
      if (!drawing.current) return;
      const pt = getPos(e);
      currentPath.current.push(pt);
      // draw incrementally (smooth quadratic)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const arr = currentPath.current;
      if (arr.length >= 2) {
        const prev = arr[arr.length-2];
        const mid  = { x:(prev.x+pt.x)/2, y:(prev.y+pt.y)/2 };
        ctx.strokeStyle = "#1e293b"; ctx.lineWidth = strokeWidth; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(lastPt.current.x, lastPt.current.y);
        ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
        ctx.stroke();
        lastPt.current = mid;
      }
    };

    const endDraw = (e) => {
      if (!drawing.current) return;
      e.preventDefault();
      drawing.current = false;
      if (currentPath.current.length > 0) {
        paths.current.push([...currentPath.current]);
        currentPath.current = [];
        onHasStrokes(true);
      }
    };

    // Expose clear via imperative ref
    DrawCanvas.clear = () => {
      paths.current = [];
      currentPath.current = [];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.strokeStyle = "#f0f0f0"; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(rect.width/2,0); ctx.lineTo(rect.width/2,rect.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,rect.height/2); ctx.lineTo(rect.width,rect.height/2); ctx.stroke();
      ctx.setLineDash([]);
      onHasStrokes(false);
    };

    DrawCanvas.getImageData = () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL("image/png") : null;
    };

    DrawCanvas.getStrokePaths = () => paths.current;

    return (
      <canvas ref={canvasRef}
        className="kanji-canvas" style={{ width:"100%", height:"100%", display:"block", touchAction:"none", cursor:"crosshair", borderRadius:12, maxWidth:"100%" }}
        onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
      />
    );
  }

  // ────────────────────────────────────────
  // SUB: Writing Quiz  (Romaji → vẽ trên canvas → AI chấm)
  // Sau 3 lần sai mới hiện ký tự đúng
  // ────────────────────────────────────────
  function WriteQuiz() {
    const TOTAL = 10;
    const CC = useColors();
    const [q, setQ]             = useState(() => ALL_QUIZ[Math.floor(Math.random()*ALL_QUIZ.length)]);
    const [wrongCount, setWrongCount] = useState(0);
    const [result, setResult]   = useState(null); // "correct"|"wrong"|null
    const [showAnswer, setShowAnswer] = useState(false);
    const [sc, setSc]           = useState({correct:0,total:0});
    const [done, setDone]       = useState(false);
    const [history, setHistory] = useState([]);
    const [hasStrokes, setHasStrokes] = useState(false);
    const [checking, setChecking]    = useState(false);
    const [strokeWidth, setStrokeWidth] = useState(isMob ? 14 : 10);
    const canvasKey = useRef(0); // force remount canvas between questions
    const [cKey, setCKey] = useState(0);

    const clearCanvas = () => { DrawCanvas.clear?.(); setHasStrokes(false); setResult(null); };

    const nextQ = () => {
      canvasKey.current += 1;
      setCKey(canvasKey.current);
      setQ(ALL_QUIZ[Math.floor(Math.random()*ALL_QUIZ.length)]);
      setWrongCount(0); setResult(null); setShowAnswer(false); setHasStrokes(false);
    };

    // AI-powered stroke scoring using canvas image
    const checkDrawing = async () => {
      if (!hasStrokes || checking || result) return;
      setChecking(true);
      try {
        const imgData = DrawCanvas.getImageData?.();
        const strokePaths = DrawCanvas.getStrokePaths?.() || [];
        const strokeCount = strokePaths.length;

        // Build a simple visual similarity score locally first
        // then optionally call AI for detailed feedback
        const res = await fetch("/api/claude", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model:"claude-sonnet-4-20250514",
            max_tokens:200,
            system:`Bạn là giáo viên tiếng Nhật đánh giá nét vẽ chữ kana. Chỉ trả lời JSON thuần (không markdown):
{"score":0-100,"correct":true/false,"feedback":"nhận xét ngắn 1 câu tiếng Việt"}
correct=true nếu score>=60.`,
            messages:[{role:"user", content:[
              {type:"image", source:{type:"base64", media_type:"image/png", data: imgData?.split(",")[1] || ""}},
              {type:"text", text:`Học viên được yêu cầu vẽ ký tự "${q.char}" (romaji: ${q.rom}, ${isHira?"hiragana":"katakana"}). Số nét vẽ: ${strokeCount}. Đánh giá xem hình vẽ có giống ký tự đó không. Nếu canvas trống hoặc không nhận ra, score=0.`}
            ]}]
          })
        });
        const data = await res.json();
        const raw = data.content?.[0]?.text || "{}";
        const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
        const isCorrect = parsed.correct === true || (parsed.score >= 60);

        setResult(isCorrect ? "correct" : "wrong");
        const newWrong = isCorrect ? wrongCount : wrongCount + 1;
        if (!isCorrect) {
          setWrongCount(newWrong);
          if (newWrong >= 3) setShowAnswer(true);
        }
        const ns = { correct: sc.correct + (isCorrect?1:0), total: sc.total + 1 };
        setSc(ns);
        setHistory(h => [...h, { q, ok:isCorrect, feedback: parsed.feedback || "" }]);
        if (ns.total >= TOTAL) setTimeout(()=>setDone(true), 800);
        // store feedback for display
        setResult(isCorrect ? "correct" : "wrong");
        // attach feedback to result state via a ref trick
        feedbackRef.current = parsed.feedback || (isCorrect ? "Chính xác!" : "Chưa giống lắm, thử lại!");
      } catch(e) {
        feedbackRef.current = "Không kết nối được AI. Hãy thử lại.";
        setResult("wrong");
      }
      setChecking(false);
    };
    const feedbackRef = useRef("");

    const restart = () => {
      canvasKey.current += 1; setCKey(canvasKey.current);
      setQ(ALL_QUIZ[Math.floor(Math.random()*ALL_QUIZ.length)]);
      setWrongCount(0); setResult(null); setShowAnswer(false);
      setSc({correct:0,total:0}); setDone(false); setHistory([]); setHasStrokes(false);
    };

    if (done) {
      const p = Math.round(sc.correct/sc.total*100);
      return (
        <div className="ba-card" style={{ textAlign:"center", padding:24 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>{p>=80?"🏆":p>=60?"👍":"📚"}</div>
          <div style={{ fontSize:28, fontWeight:900, color:accentColor }}>{sc.correct}/{sc.total}</div>
          <div style={{ fontSize:14, fontWeight:700, color:CC.text, margin:"4px 0 16px" }}>{p>=80?"Xuất sắc!":p>=60?"Tốt lắm!":"Luyện thêm nhé!"}</div>
          <div style={{ height:8, background:"rgba(219,234,254,0.7)", borderRadius:99, marginBottom:16, overflow:"hidden" }}>
            <div className="ba-progress-fill" style={{ width:`${p}%` }}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16, textAlign:"left" }}>
            {history.map((h,i)=>(
              <div key={i} style={{ background:h.ok?"#f0fdf4":"#fef2f2", borderRadius:8, padding:"10px 14px", fontSize:12, color:h.ok?"#166534":"#991b1b" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:2 }}>
                  <span style={{ fontSize:22 }}>{h.q.char}</span>
                  <span style={{ fontWeight:700 }}>{h.q.rom}</span>
                  <span>{h.ok?"✅":"❌"}</span>
                </div>
                {h.feedback && <div style={{ opacity:0.75 }}>{h.feedback}</div>}
              </div>
            ))}
          </div>
          <button onClick={restart} className="ba-btn" style={{ background:"linear-gradient(135deg,#38BDF8,#2563EB)", color:"white", padding:"12px 28px", boxShadow:"0 4px 20px rgba(37,99,235,0.35)" }}>🔄 Luyện lại</button>
        </div>
      );
    }

    const canvasSize = isMob ? Math.min(w - 48, 300) : 320;

    return (
      <div>
        {/* Progress */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:13, color:CC.muted }}>Câu {sc.total+1}/{TOTAL} · Sai {wrongCount}/3</span>
          <span style={{ fontSize:13, fontWeight:700, color:accentColor }}>{sc.correct} đúng</span>
        </div>

        {/* Prompt card */}
        <div style={{ background:`linear-gradient(135deg,${accentColor},${accentColor}99)`, borderRadius:18, padding:"20px 24px", textAlign:"center", marginBottom:16, color:"white" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginBottom:6, letterSpacing:1 }}>HÃY VẼ KÝ TỰ TƯƠNG ỨNG VỚI:</div>
          <div style={{ fontSize:isMob?56:72, fontWeight:900, letterSpacing:6, lineHeight:1, fontFamily:"'Courier New',monospace" }}>
            {q.rom}
          </div>
          <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:12 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:10, height:10, borderRadius:"50%", background: i<wrongCount?"#fca5a5":"rgba(255,255,255,0.3)", border: i<wrongCount?"2px solid #ef4444":"2px solid rgba(255,255,255,0.4)", transition:"all 0.3s" }}/>
            ))}
          </div>
          {wrongCount>0 && wrongCount<3 && (
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:6 }}>Còn {3-wrongCount} lần sai nữa mới hiện đáp án</div>
          )}
        </div>

        {/* Answer hint after 3 wrong */}
        {showAnswer && (
          <div style={{ background:"#fefce8", border:"2px solid #fbbf24", borderRadius:14, padding:"14px 18px", marginBottom:14, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#92400e", marginBottom:4, fontWeight:600 }}>💡 Đây là ký tự đúng – hãy nhìn rồi vẽ lại:</div>
            <div style={{ fontSize:76, fontWeight:900, color:accentColor, lineHeight:1 }}>{q.char}</div>
          </div>
        )}

        {/* Canvas area */}
        <div className={result==="correct"?"ba-canvas-correct":result==="wrong"?"ba-canvas-wrong":""} style={{ background:CC.bgCard, borderRadius:20, border:`2px solid ${result==="correct"?"#10B981":result==="wrong"?"#EF4444":"rgba(56,189,248,0.25)"}`, overflow:"hidden", marginBottom:14, boxShadow:result?"none":"0 4px 20px rgba(37,99,235,0.1),0 0 0 1px rgba(56,189,248,0.08)" }}>
          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderBottom:"1px solid rgba(56,189,248,0.12)", background:"rgba(239,246,255,0.5)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:11, color:CC.muted, fontWeight:600 }}>Nét:</span>
              {[6,10,16].map(sz=>(
                <button key={sz} onClick={()=>setStrokeWidth(sz)}
                  style={{ width:sz+14, height:sz+14, borderRadius:"50%", background: strokeWidth===sz?"#1e293b":"#e5e7eb", border: strokeWidth===sz?"2px solid #1e293b":"2px solid #d1d5db", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
                  <div style={{ width:sz-2, height:sz-2, borderRadius:"50%", background: strokeWidth===sz?"white":"#64748b" }}/>
                </button>
              ))}
            </div>
            <button onClick={clearCanvas}
              style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#991b1b", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              🗑 Xóa
            </button>
          </div>
          {/* Canvas */}
          <div style={{ width:"100%", height:canvasSize, position:"relative" }}>
            {/* Placeholder text */}
            {!hasStrokes && !result && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", userSelect:"none" }}>
                <span style={{ fontSize:13, color:"#d1d5db", fontStyle:"italic" }}>✏️ Vẽ ký tự ở đây…</span>
              </div>
            )}
            <DrawCanvas key={cKey} strokeWidth={strokeWidth} onHasStrokes={setHasStrokes}/>
          </div>
        </div>

        {/* Action buttons */}
        {!result ? (
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={clearCanvas}
              style={{ flex:1, background:"#f5f5f5", border:"1px solid #ddd", color:CC.muted, borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              🗑 Xóa lại
            </button>
            <button onClick={checkDrawing} disabled={!hasStrokes || checking}
              style={{ flex:2, background:hasStrokes&&!checking?accentColor:"#d1d5db", color:"white", border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:hasStrokes&&!checking?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.2s" }}>
              {checking ? <><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⏳</span> AI đang chấm…</> : "🤖 Check ✓"}
            </button>
          </div>
        ) : (
          <div>
            {/* Feedback */}
            <div style={{ background:result==="correct"?"#f0fdf4":"#fef2f2", border:`1.5px solid ${result==="correct"?"#86efac":"#fca5a5"}`, borderRadius:12, padding:"14px 16px", marginBottom:10, textAlign:"center" }}>
              <div style={{ fontSize:16, fontWeight:800, color:result==="correct"?"#166534":"#991b1b", marginBottom:4 }}>
                {result==="correct" ? "✅ Chính xác!" : "❌ Chưa đúng"}
              </div>
              <div style={{ fontSize:13, color:result==="correct"?"#15803d":"#b91c1c" }}>{feedbackRef.current}</div>
              {result==="correct" && (
                <div style={{ fontSize:28, marginTop:6 }}>{q.char} <span style={{ fontSize:13, color:"#6b7280" }}>= {q.rom}</span></div>
              )}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {result==="wrong" && wrongCount<3 && (
                <button onClick={clearCanvas}
                  style={{ flex:1, background:"#fef2f2", border:"1px solid #fecaca", color:"#991b1b", borderRadius:12, padding:"12px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  ✏️ Vẽ lại
                </button>
              )}
              <button onClick={nextQ}
                style={{ flex:2, background:accentColor, color:"white", border:"none", borderRadius:12, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                {sc.total>=TOTAL?"🏁 Xem kết quả":t.next}
              </button>
            </div>
          </div>
        )}

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Progress overview ──
  const ProgressBar = ({label,score,threshold=70}) => {
    const p = pct(score);
    const ok = p >= threshold;
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <span style={{ fontSize:12, color:CC.muted, width:70, flexShrink:0 }}>{label}</span>
        <div style={{ flex:1, height:7, background:"rgba(219,234,254,0.6)", borderRadius:99, overflow:"hidden", border:"1px solid rgba(56,189,248,0.1)" }}>
          <div className="ba-progress-fill" style={{ width:score?`${p}%`:"0%", background:ok?"linear-gradient(90deg,#10B981,#059669)":"linear-gradient(90deg,#38BDF8,#2563EB)" }}/>
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:ok?"#22c55e":C.muted, width:38, textAlign:"right" }}>
          {score?`${p}%`:"—"}
        </span>
        {ok && <span style={{ fontSize:14 }}>✅</span>}
      </div>
    );
  };

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding: isMob ? "16px 12px" : "32px 24px" }}>
      {/* Header */}
      <div style={{
        background: isHira ? `linear-gradient(135deg,#1E3A8A,#2563EB,#0EA5E9)` : `linear-gradient(135deg,#4C1D95,#7C3AED,#A78BFA)`,
        borderRadius:16, padding: isMob ? "18px" : "24px", color:"white", marginBottom:20
      }}>
        <div style={{ fontSize: isMob?28:36, fontWeight:900, marginBottom:4 }}>
          {isHira ? "ひらがな Hiragana" : "カタカナ Katakana"}
        </div>
        <div style={{ fontSize:isMob?12:14, opacity:0.85, marginBottom:14 }}>
          Học theo 3 bước: Bảng chữ → Nhận diện → Viết
        </div>
        {/* Unlock progress */}
        <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:12, padding:"12px 14px" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginBottom:8, fontWeight:700 }}>
            🔓 Điều kiện mở khóa phần Viết (≥ 70% mỗi phần):
          </div>
          <ProgressBar label="🔍 Nhận diện" score={scores.recognize}/>
          
          {writeUnlocked && <div style={{ fontSize:12, color:"#86efac", fontWeight:700, marginTop:6 }}>✍️ Phần Viết đã mở khóa!</div>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, marginBottom:20, background:"#f0f0f0", borderRadius:14, padding:4 }}>
        {TABS.map(t => {
          const isActive = tab===t.id;
          const isLocked = t.locked;
          return (
            <button key={t.id}
              onClick={()=>{ if(!isLocked) setTab(t.id); }}
              style={{ flex:1, border:"none", borderRadius:11,
                padding:isMob?"9px 4px":"11px 6px",
                background:isActive?CC.bgCard:"transparent",
                color:isLocked?CC.muted:isActive?CC.text:CC.muted,
                fontWeight:isActive?700:500,
                fontSize:isMob?11:13,
                cursor:isLocked?"not-allowed":"pointer",
                boxShadow:isActive?"0 2px 8px rgba(0,0,0,0.1)":"none",
                transition:"all 0.2s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:isMob?3:5,
                position:"relative"
              }}>
              <span>{isLocked?"🔒":t.icon}</span>
              <span style={{ display:isMob?"none":"inline" }}>{t.label}</span>
              <span style={{ display:isMob?"inline":"none" }}>{t.label.split(" ")[0]}</span>
              {t.id==="recognize" && scores.recognize && (
                <span style={{ fontSize:9, background:recPct>=70?"#22c55e":accentColor, color:"white", borderRadius:10, padding:"1px 5px", marginLeft:2 }}>{recPct}%</span>
              )}

            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab==="table" && (
        <div>
          {ttsHint}
          <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:4, marginBottom:14, borderBottom:"2px solid #eee" }}>
            {[{id:"basic",label:"Cơ bản"},{id:"dakuten",label:"Dakuten ゛"},{id:"handakuten",label:"Handakuten ゜"},{id:"compound",label:"Âm ghép"}].map(st=>(
              <button key={st.id} id={`subtab_${st.id}`} onClick={e=>{
                document.querySelectorAll("[id^=subtab_]").forEach(b=>{b.style.color=C.muted;b.style.borderBottom="3px solid transparent";b.style.fontWeight="400";});
                e.target.style.color=accentColor; e.target.style.borderBottom=`3px solid ${accentColor}`; e.target.style.fontWeight="700";
              }} style={{ background:"none",border:"none",padding:"8px 12px",cursor:"pointer",fontSize:isMob?11:13,color:CC.muted,borderBottom:"3px solid transparent",marginBottom:-2,whiteSpace:"nowrap",flexShrink:0,fontWeight:400 }}>
                {st.label}
              </button>
            ))}
          </div>
          {/* Always show basic by default; subtab buttons filter via JS hack – for simplicity show all */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:700, color:accentColor, marginBottom:8 }}>清音 – Âm cơ bản (46)</div>
            {renderGrid(BASIC)}
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:700, color:accentColor, marginBottom:8 }}>゛Dakuten – Âm đục ({DAKUTEN.length})</div>
            {renderGrid(DAKUTEN)}
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:700, color:accentColor, marginBottom:8 }}>゜Handakuten – Âm /p/ ({HANDAKUTEN.length})</div>
            {renderGrid(HANDAKUTEN)}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:accentColor, marginBottom:8 }}>拗音 – Âm ghép ({COMPOUND.length})</div>
            {renderGrid(COMPOUND,3,true)}
          </div>
          <div style={{ marginTop:20, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 16px", fontSize:12, color:"#92400e" }}>
            💡 Học xong bảng chữ? Nhấn tab <strong>🔍 Nhận diện</strong> để bắt đầu luyện tập!
          </div>
        </div>
      )}

      {tab==="recognize" && <RecognizeQuiz key="rq"/>}
      
      {tab==="write"     && writeUnlocked && <WriteQuiz key="wq"/>}
      {tab==="write"     && !writeUnlocked && (
        <div className="ba-card ba-unlock" style={{ textAlign:"center", padding:32 }}>
          <div className="ba-star" style={{ fontSize:56, marginBottom:12 }}>🔒</div>
          <div style={{ fontSize:18, fontWeight:800, color:CC.text, marginBottom:8 }}>Phần Viết chưa mở khóa</div>
          <div style={{ fontSize:13, color:CC.muted, marginBottom:20, lineHeight:1.6 }}>
            Hoàn thành phần <strong>Nhận diện</strong> với tối thiểu <strong>70%</strong> để mở khóa.
          </div>
          <ProgressBar label="🔍 Nhận diện" score={scores.recognize}/>
          <div style={{ display:"flex", gap:8, marginTop:16, justifyContent:"center" }}>
            {!scores.recognize && <button onClick={()=>setTab("recognize")} style={{ background:accentColor, color:"white", border:"none", padding:"11px 20px", borderRadius:12, fontWeight:700, cursor:"pointer", fontSize:13 }}>🔍 Làm Nhận diện</button>}
            
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// GRAMMAR
// ════════════════════════════════════════
function GrammarPage(){
    const t = useT();
const w=useWidth();const isMob=w<640;
  const [dark] = useDarkMode();
  const CC=useColors();
  const [grammarTab, setGrammarTab] = useState("N5");
  const [sel,setSel]=useState(0);
  const [kanji,setKanji]=useState(null);
  const [kanjiLoading,setKanjiLoading]=useState(false);
  const [contextEx,setContextEx]=useState(null);
  const [ctxLoading,setCtxLoading]=useState(false);
  const ALL_GRAMMAR = useMemo(() => ({
    N5: [...GRAMMAR_N5],
    N4: GRAMMAR_N4,
    N3: GRAMMAR_N3,
    N2: GRAMMAR_N2,
    N1: GRAMMAR_N1,
  }), []);
  const activeGrammar = ALL_GRAMMAR[grammarTab] || ALL_GRAMMAR.N5;
  const g = activeGrammar[sel];

  const cardBg = dark
    ? "linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,58,138,0.3))"
    : "white";

  const fetchKanji = async (pattern) => {
    setKanjiLoading(true); setKanji(null); setContextEx(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:600,
          system:`Bạn là chuyên gia Hán tự Nhật. Trả lời JSON thuần không markdown:
{"kanji_parts":[{"char":"ký tự","meaning":"nghĩa","on":"âm on","kun":"âm kun"}],"logic":"giải thích logic ghép chữ","memory_tip":"mẹo nhớ sáng tạo","level":"N5/N4/N3","contexts":["ví dụ manga","ví dụ đời thực","ví dụ học đường"]}`,
          messages:[{role:"user",content:`Phân tích cấu trúc Kanji trong mẫu ngữ pháp: "${pattern}"`}]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text||"{}";
      setKanji(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) { setKanji({error:"Không tải được phân tích Kanji."}); }
    setKanjiLoading(false);
  };

  const fetchContext = async (pattern, meaning) => {
    setCtxLoading(true); setContextEx(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:500,
          system:`Trả lời JSON thuần không markdown:
{"examples":[{"context":"Manga/Anime/Học đường/Đời sống/Du học","nuance":"Vui vẻ|Trang trọng|Thân mật|Lịch sự","jp":"câu ví dụ","vn":"nghĩa tiếng Việt","note":"ghi chú sắc thái"}]}`,
          messages:[{role:"user",content:`Tạo 4 ví dụ thực tế cho mẫu "${pattern}" (${meaning}) từ các bối cảnh khác nhau: manga, anime, học đường, du học.`}]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text||"{}";
      setContextEx(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) { setContextEx({error:"Không tải được ví dụ."}); }
    setCtxLoading(false);
  };

  const nuanceColor = n => n==="Trang trọng"?"#2563EB":n==="Thân mật"?"#D97706":n==="Vui vẻ"?"#10B981":n==="Lịch sự"?"#7C3AED":"#64748B";

  const DetailPanel = () => (
    <div style={{background:cardBg,borderRadius:20,padding:isMob?"18px":"24px",border:`1px solid ${dark?"rgba(56,189,248,0.2)":"#eee"}`,boxShadow:dark?"0 4px 24px rgba(0,0,0,0.4)":"0 4px 16px rgba(37,99,235,0.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <span style={{fontSize:20,fontWeight:900,color:grammarTab==="N4"?"#4338CA":C.primary}}>{g.pattern}</span>
        {<Badge text={`JLPT ${grammarTab}`} color={grammarTab==="N5"?"#22c55e":grammarTab==="N4"?"#3b82f6":grammarTab==="N3"?"#f59e0b":grammarTab==="N2"?"#ef4444":"#7c3aed"}/>
        }
      </div>

      {/* Basic info */}
      {[
        {bg:dark?"rgba(37,99,235,0.15)":"#f0f7ff",label:"📌 Ý nghĩa",val:g.meaning,bold:false},
        grammarTab==="N4"&&g.use?{bg:dark?"rgba(67,56,202,0.12)":"#eef2ff",label:"📐 Cách dùng",val:g.use,bold:false}:null,
        {bg:dark?"rgba(15,23,42,0.6)":"#f8f9fa",label:"✏️ Ví dụ",val:g.example,bold:true,color:grammarTab==="N4"?"#4338CA":C.primary},
        {bg:dark?"rgba(5,150,105,0.1)":"#f0fdf4",label:"🇻🇳 Tiếng Việt",val:(grammarTab==="N4"?g.exVn:g.vn),bold:false},
        grammarTab==="N4"&&g.note?{bg:dark?"rgba(245,158,11,0.1)":"#fffbeb",label:"⚠️ Lưu ý",val:g.note,bold:false,color:dark?"#FCD34D":"#92400E"}:null,
      ].filter(Boolean).map((b,i)=>(
        <div key={i} style={{background:b.bg,borderRadius:12,padding:"12px 14px",marginBottom:10,border:`1px solid ${dark?"rgba(255,255,255,0.05)":"transparent"}`}}>
          <div style={{fontSize:11,color:CC.muted,marginBottom:4,fontWeight:700}}>{b.label}</div>
          <div style={{fontSize:b.bold?17:14,fontWeight:b.bold?800:500,color:b.color||(dark?"#E2E8F0":C.text)}}>{b.val}</div>
        </div>
      ))}

      {/* Action buttons */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <button onClick={()=>fetchKanji(g.pattern)} className="ba-btn" disabled={kanjiLoading}
          style={{background:"linear-gradient(135deg,#7C3AED,#4C1D95)",color:"white",padding:"8px 14px",fontSize:12,opacity:kanjiLoading?0.7:1}}>
          {kanjiLoading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span>:"🔍"} Kanji Breakdown
        </button>
        <button onClick={()=>fetchContext(g.pattern,g.meaning)} className="ba-btn" disabled={ctxLoading}
          style={{background:"linear-gradient(135deg,#059669,#065f46)",color:"white",padding:"8px 14px",fontSize:12,opacity:ctxLoading?0.7:1}}>
          {ctxLoading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span>:"🌟"} Ví dụ Thực Tế
        </button>
      </div>

      {/* Kanji Breakdown Panel */}
      {kanji && !kanji.error && (
        <div style={{background:dark?"rgba(124,58,237,0.08)":"rgba(124,58,237,0.04)",border:"1.5px solid rgba(124,58,237,0.25)",borderRadius:16,padding:"16px",marginBottom:14}}>
          <div style={{fontWeight:800,fontSize:13,color:"#7C3AED",marginBottom:12}}>🔍 KANJI BREAKDOWN</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {kanji.kanji_parts?.map((kp,i)=>(
              <div key={i} style={{background:dark?"rgba(124,58,237,0.15)":"rgba(124,58,237,0.08)",border:"1.5px solid rgba(124,58,237,0.3)",borderRadius:14,padding:"10px 14px",minWidth:80,textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#7C3AED",marginBottom:4}}>{kp.char}</div>
                <div style={{fontSize:11,color:dark?"#C4B5FD":"#6D28D9",fontWeight:700}}>{kp.meaning}</div>
                <div style={{fontSize:9,color:CC.muted,marginTop:2}}>
                  <span style={{color:"#DC2626"}}>音: {kp.on}</span> / <span style={{color:"#059669"}}>訓: {kp.kun}</span>
                </div>
              </div>
            ))}
          </div>
          {kanji.logic && <div style={{fontSize:13,color:dark?"#DDD6FE":"#4C1D95",marginBottom:8,lineHeight:1.6}}>💡 <strong>Logic:</strong> {kanji.logic}</div>}
          {kanji.memory_tip && (
            <div style={{background:dark?"rgba(245,158,11,0.1)":"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:10,padding:"8px 12px",fontSize:12,color:dark?"#FCD34D":"#92400E"}}>
              🧠 <strong>Mẹo nhớ:</strong> {kanji.memory_tip}
            </div>
          )}
        </div>
      )}

      {/* Context Examples Panel */}
      {contextEx && !contextEx.error && (
        <div style={{border:"1.5px solid rgba(16,185,129,0.25)",borderRadius:16,padding:"16px",marginBottom:14,background:dark?"rgba(5,150,105,0.06)":"rgba(5,150,105,0.03)"}}>
          <div style={{fontWeight:800,fontSize:13,color:"#059669",marginBottom:12}}>🌟 VÍ DỤ THỰC TẾ</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {contextEx.examples?.map((ex,i)=>(
              <div key={i} style={{background:dark?"rgba(15,23,42,0.5)":"white",border:`1px solid ${nuanceColor(ex.nuance)}25`,borderRadius:12,padding:"12px 14px",borderLeft:`3px solid ${nuanceColor(ex.nuance)}`}}>
                <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,background:`${nuanceColor(ex.nuance)}15`,color:nuanceColor(ex.nuance),fontWeight:700,padding:"2px 8px",borderRadius:20}}>{ex.context}</span>
                  <span style={{fontSize:10,background:"rgba(148,163,184,0.12)",color:CC.muted,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{ex.nuance}</span>
                </div>
                <div style={{fontSize:isMob?15:17,fontWeight:800,color:dark?"white":C.text,marginBottom:4}}>{ex.jp}</div>
                <div style={{fontSize:13,color:CC.muted,marginBottom:ex.note?4:0}}>{ex.vn}</div>
                {ex.note && <div style={{fontSize:11,color:nuanceColor(ex.nuance),fontStyle:"italic"}}>💬 {ex.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(kanji?.error || contextEx?.error) && (
        <div style={{color:"#EF4444",fontSize:12,marginBottom:8}}>{kanji?.error || contextEx?.error}</div>
      )}
    </div>
  );

  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:isMob?"20px 12px":"32px 24px",fontFamily:"'Nunito',sans-serif"}}>
      <h2 style={{fontWeight:900,fontSize:isMob?20:26,color:dark?"white":C.text,marginBottom:4}}>📝 Ngữ Pháp JLPT</h2>
      <p style={{color:CC.muted,marginBottom:12,fontSize:isMob?13:14}}>{activeGrammar.length} mẫu ngữ pháp · Kanji Breakdown · Ví dụ thực tế</p>
      <div style={{display:"flex",gap:8,marginBottom:20,background:dark?"rgba(30,41,59,0.6)":"rgba(241,245,249,0.9)",borderRadius:16,padding:4,width:"fit-content"}}>
        {[
          {id:"N5",label:"N5 Sơ cấp",count:ALL_GRAMMAR.N5.length},
          {id:"N4",label:"N4 Sơ trung",count:GRAMMAR_N4.length},
          {id:"N3",label:"N3 Trung cấp",count:GRAMMAR_N3.length},
          {id:"N2",label:"N2 Cao cấp",count:GRAMMAR_N2.length},
          {id:"N1",label:"N1 Thượng cấp",count:GRAMMAR_N1.length}
        ].map(tab=>(
          <button key={tab.id} onClick={()=>{setGrammarTab(tab.id);setSel(0);setKanji(null);setContextEx(null);}}
            style={{padding:isMob?"8px 14px":"9px 20px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:isMob?12:13,fontWeight:800,transition:"all 0.2s",
              background:grammarTab===tab.id?"linear-gradient(135deg,#2563EB,#0EA5E9)":"transparent",
              color:grammarTab===tab.id?"white":CC.muted,
              boxShadow:grammarTab===tab.id?"0 4px 12px rgba(37,99,235,0.35)":"none"}}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {isMob?(
        <>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:16,WebkitOverflowScrolling:"touch"}}>
            {activeGrammar.map((gm,i)=>(
              <button key={i} onClick={()=>{setSel(i);setKanji(null);setContextEx(null);}} className="ba-btn"
                style={{background:sel===i?"linear-gradient(135deg,#38BDF8,#2563EB)":dark?"rgba(30,58,138,0.3)":"white",
                  color:sel===i?"white":dark?"#93C5FD":C.text,
                  border:`1px solid ${sel===i?"transparent":dark?"rgba(56,189,248,0.2)":"#ddd"}`,
                  padding:"8px 12px",borderRadius:20,fontSize:12,whiteSpace:"nowrap",
                  boxShadow:sel===i?"0 4px 16px rgba(37,99,235,0.3)":"none"}}>
                {grammarTab==="N4"?`${i+1}. ${(gm.pattern||"").slice(0,10)}`:`Bài ${gm.lesson}`}
              </button>
            ))}
          </div>
          <DetailPanel/>
        </>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:"75vh",overflowY:"auto",paddingRight:4}}>
            {activeGrammar.map((gm,i)=>(
              <div key={i} onClick={()=>{setSel(i);setKanji(null);setContextEx(null);}}
                style={{
                  background:sel===i?dark?"rgba(37,99,235,0.25)":"rgba(37,99,235,0.08)":"transparent",
                  padding:"10px 14px",borderRadius:12,cursor:"pointer",
                  border:`1.5px solid ${sel===i?"rgba(56,189,248,0.4)":"transparent"}`,
                  transition:"all 0.15s"
                }}>
                <div style={{fontWeight:700,color:sel===i?"#38BDF8":dark?"#93C5FD":C.text,fontSize:13}}>{gm.pattern}</div>
                <div style={{fontSize:10,color:CC.muted}}>{grammarTab==="N4"?`N4 · Mẫu ${i+1}/${GRAMMAR_N4.length}`:`Bài ${gm.lesson} – ${gm.topic}`}</div>
              </div>
            ))}
          </div>
          <DetailPanel/>
        </div>
      )}
    </div>
  );
}



// ════════════════════════════════════════════════════════════════
// IMPORT / EXPORT PAGE
// ════════════════════════════════════════════════════════════════
function ImportExportPage() {
    const t = useT();
const w = useWidth(); const isMob = w < 640;
  const [dark] = useDarkMode();
  const [tab, setTab]           = useState("import"); // import | export
  const [dragOver, setDragOver] = useState(false);
  const [parsing,  setParsing]  = useState(false);
  const [preview,  setPreview]  = useState(null);  // [{jp,vn,rom?,example?,note?}]
  const [parseErr, setParseErr] = useState("");
  const [savedDecks, setSavedDecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_custom_decks") || "[]"); } catch { return []; }
  });
  const [activeDeck, setActiveDeck] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // ── Export helpers ──────────────────────────────────────────────
  const getMnemonics = () => {
    try { return JSON.parse(localStorage.getItem("sp_mnemonics") || "{}"); } catch { return {}; }
  };
  const getDeckData = () => {
    // Custom decks
    const decks = JSON.parse(localStorage.getItem("sp_custom_decks") || "[]");
    return { custom: decks };
  };

  const downloadCSV = (rows, filename) => {
    const header = Object.keys(rows[0]).join(",");
    const body   = rows.map(r => Object.values(r).map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob   = new Blob(["\uFEFF" + header + "\n" + body], { type: "text/csv;charset=utf-8" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportCustomDecks = () => {
    const decks = JSON.parse(localStorage.getItem("sp_custom_decks") || "[]");
    if (!decks.length) return;
    const rows = decks.flatMap(d => d.cards.map(c => ({ "Bộ thẻ": d.name, "Japanese": c.jp, "Nghĩa": c.vn, "Romaji": c.rom||"", "Ví dụ": c.example||"", "Ghi chú": c.note||"" })));
    downloadCSV(rows, "sakura-path-custom-decks.csv");
  };

  const exportLeachList = () => {
    // Cards answered "again" most often
    const stats = JSON.parse(localStorage.getItem("sp_card_stats") || "{}");
    const rows = Object.entries(stats)
      .sort((a,b) => (b[1].again||0) - (a[1].again||0))
      .slice(0, 50)
      .map(([jp, s]) => {
        const v = [...VOCAB_N5,...VOCAB_N4,...VOCAB_N3,...VOCAB_N2,...VOCAB_N1].find(x=>x.jp===jp)||{};
        return { "Japanese": jp, "Romaji": v.rom||"", "Nghĩa": v.vn||"", "Số lần sai": s.again||0, "Tổng lần học": (s.again||0)+(s.hard||0)+(s.good||0)+(s.easy||0) };
      });
    if (!rows.length) { alert("Chưa có đủ dữ liệu học tập."); return; }
    downloadCSV(rows, "sakura-path-leach-list.csv");
  };

  // ── Parse CSV/XLSX ──────────────────────────────────────────────
  const parseCSVText = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error("File cần ít nhất 2 dòng (header + dữ liệu)");
    const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g,"").trim().toLowerCase());
    const jpIdx  = headers.findIndex(h => /japanese|jp|tiếng nhật|kanji|日本語/.test(h));
    const vnIdx  = headers.findIndex(h => /meaning|vn|nghĩa|vietnamese|việt/.test(h));
    const romIdx = headers.findIndex(h => /romaji|rom|reading|phiên âm/.test(h));
    const exIdx  = headers.findIndex(h => /example|ví dụ|câu|ex/.test(h));
    const noteIdx= headers.findIndex(h => /note|ghi chú|memo/.test(h));
    if (jpIdx < 0) throw new Error(`Không tìm thấy cột "Japanese". Headers hiện tại: ${headers.join(", ")}`);
    if (vnIdx < 0) throw new Error(`Không tìm thấy cột "Meaning". Headers hiện tại: ${headers.join(", ")}`);
    return lines.slice(1).filter(l=>l.trim()).map(line => {
      const cols = line.match(/("(?:[^"]|"")*"|[^,]*)/g).map(c=>c.replace(/^"|"$/g,"").replace(/""/g,'"').trim());
      return {
        jp:      cols[jpIdx]  || "",
        vn:      cols[vnIdx]  || "",
        rom:     romIdx>=0 ? (cols[romIdx]||"") : "",
        example: exIdx>=0  ? (cols[exIdx]||"")  : "",
        note:    noteIdx>=0? (cols[noteIdx]||"") : "",
      };
    }).filter(r => r.jp && r.vn);
  };

  const handleFile = async (file) => {
    setParsing(true); setParseErr(""); setPreview(null); setImportSuccess(false);
    try {
      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const rows = parseCSVText(text);
        setPreview(rows);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Use SheetJS
        const buf = await file.arrayBuffer();
        const { read, utils } = await import("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.mjs");
        const wb  = read(buf, { type:"array" });
        const ws  = wb.Sheets[wb.SheetNames[0]];
        const json= utils.sheet_to_json(ws, { defval:"" });
        if (!json.length) throw new Error("File Excel trống.");
        // Normalize keys
        const rows = json.map(row => {
          const keys = Object.keys(row).map(k=>k.toLowerCase());
          const get  = (patterns) => {
            const k = Object.keys(row).find(k=>patterns.some(p=>k.toLowerCase().includes(p)));
            return k ? String(row[k]||"") : "";
          };
          return {
            jp:      get(["japanese","jp","tiếng nhật","kanji","日本語"]),
            vn:      get(["meaning","vn","nghĩa","vietnamese","việt"]),
            rom:     get(["romaji","rom","reading","phiên âm"]),
            example: get(["example","ví dụ","câu","ex"]),
            note:    get(["note","ghi chú","memo"]),
          };
        }).filter(r=>r.jp && r.vn);
        if (!rows.length) throw new Error("Không tìm thấy cột Japanese và Meaning. Hãy kiểm tra tên cột.");
        setPreview(rows);
      } else {
        throw new Error("Chỉ hỗ trợ .csv và .xlsx");
      }
    } catch(e) {
      setParseErr(e.message);
    }
    setParsing(false);
  };

  const [deckName, setDeckName] = useState("");
  const saveDeck = () => {
    if (!preview?.length) return;
    const name   = deckName.trim() || `Bộ thẻ ${new Date().toLocaleDateString("vi")}`;
    const deck   = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
      cards: preview.map(c => ({ ...c, ef:2.5, interval:1, rep:0, due:0, stability:0, streak:0, totalReps:0, avgTime:4000 }))
    };
    const updated = [...savedDecks, deck];
    setSavedDecks(updated);
    localStorage.setItem("sp_custom_decks", JSON.stringify(updated));
    setPreview(null); setDeckName(""); setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
  };

  const deleteDeck = (id) => {
    const updated = savedDecks.filter(d=>d.id!==id);
    setSavedDecks(updated);
    localStorage.setItem("sp_custom_decks", JSON.stringify(updated));
  };

  const C2 = {
    bg:    dark?"rgba(15,23,42,0.95)":"white",
    card:  dark?"rgba(30,58,138,0.2)":"#F8FAFF",
    border:dark?"rgba(56,189,248,0.2)":"rgba(37,99,235,0.15)",
    text:  dark?"#E2E8F0":C.text,
    muted: C.muted,
  };

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:isMob?"16px 12px":"32px 24px"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1E3A8A,#2563EB,#0EA5E9)",borderRadius:24,padding:isMob?"20px":"28px",color:"white",marginBottom:24,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.06}}>📥</div>
        <div style={{fontSize:28,fontWeight:900,marginBottom:4}}>📥 {t.importTitle}</div>
        <div style={{fontSize:13,opacity:0.7}}>Tải lên bộ từ riêng · Xuất tiến độ học tập</div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20,background:dark?"rgba(30,58,138,0.15)":"rgba(239,246,255,0.8)",borderRadius:16,padding:5,border:`1px solid ${C2.border}`}}>
        {[{id:"import",icon:"📥",label:"Nhập bộ từ"},{id:"export",icon:"📤",label:"Xuất dữ liệu"}].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)}
            style={{flex:1,background:tab===t.id?"linear-gradient(135deg,#38BDF8,#2563EB)":"transparent",
              border:"none",color:tab===t.id?"white":C2.muted,
              borderRadius:12,padding:"10px",fontSize:isMob?13:14,fontWeight:700,cursor:"pointer",
              boxShadow:tab===t.id?"0 4px 16px rgba(37,99,235,0.4)":"none",fontFamily:"'Nunito',sans-serif"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── IMPORT TAB ──────────────────────────────────────────────── */}
      {tab==="import" && (
        <div>
          {/* Format guide */}
          <div style={{background:dark?"rgba(30,58,138,0.2)":"rgba(239,246,255,0.7)",borderRadius:16,padding:"14px 16px",marginBottom:16,border:`1px solid ${C2.border}`}}>
            <div style={{fontSize:12,fontWeight:800,color:dark?"#93C5FD":C.primary,marginBottom:8}}>📋 ĐỊNH DẠNG FILE</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{background:dark?"rgba(37,99,235,0.3)":"rgba(37,99,235,0.1)"}}>
                    {["Japanese *","Meaning *","Romaji","Example","Note"].map((h,i)=>(
                      <th key={i} style={{padding:"6px 10px",textAlign:"left",color:dark?"#93C5FD":C.primary,fontWeight:800,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[["食べる","Ăn","taberu","ご飯を食べる","Động từ nhóm 2"],["行く","Đi","iku","学校に行く",""]].map((row,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${C2.border}`}}>
                      {row.map((c,j)=>(
                        <td key={j} style={{padding:"6px 10px",color:j===0?dark?"#F0ABFC":C.primary:C2.muted,fontWeight:j===0?700:400}}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{fontSize:10,color:C.muted,marginTop:6}}>* Bắt buộc · Tên cột không phân biệt chữ hoa/thường · Hỗ trợ .csv và .xlsx</div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
            onClick={()=>fileInputRef.current?.click()}
            style={{
              border:`2px dashed ${dragOver?"#38BDF8":C2.border}`,
              borderRadius:20,padding:isMob?"28px 16px":"40px 24px",
              textAlign:"center",cursor:"pointer",
              background:dragOver?dark?"rgba(56,189,248,0.1)":"rgba(239,246,255,0.8)":C2.card,
              transition:"all 0.2s",marginBottom:16
            }}>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);e.target.value="";}}/>
            {parsing ? (
              <div style={{color:"#38BDF8",fontSize:14,fontWeight:700}}>
                <div style={{fontSize:32,animation:"spin 1s linear infinite",display:"inline-block",marginBottom:8}}>⏳</div>
                <div>Đang phân tích file…</div>
              </div>
            ) : (
              <>
                <div style={{fontSize:40,marginBottom:8}}>{dragOver?"📂":"📁"}</div>
                <div style={{fontSize:15,fontWeight:800,color:C2.text,marginBottom:4}}>
                  Kéo thả hoặc nhấn để chọn file
                </div>
                <div style={{fontSize:12,color:C.muted}}>Hỗ trợ .CSV và .XLSX (Excel)</div>
              </>
            )}
          </div>

          {/* Error */}
          {parseErr && (
            <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,padding:"12px 16px",marginBottom:16,color:"#FCA5A5",fontSize:13}}>
              ❌ {parseErr}
            </div>
          )}

          {/* Success flash */}
          {importSuccess && (
            <div style={{background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.35)",borderRadius:12,padding:"12px 16px",marginBottom:16,color:"#6EE7B7",fontSize:13,fontWeight:700,textAlign:"center",animation:"baUnlock 0.5s ease"}}>
              ✅ Đã lưu bộ thẻ thành công!
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div style={{background:C2.card,borderRadius:20,padding:"16px",border:`1px solid ${C2.border}`,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:C2.text}}>✅ Đọc được {preview.length} thẻ</div>
                  <div style={{fontSize:11,color:C.muted}}>Kiểm tra trước khi lưu</div>
                </div>
                <button onClick={()=>setPreview(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>✕</button>
              </div>
              {/* Preview table */}
              <div style={{maxHeight:200,overflowY:"auto",marginBottom:12}}>
                {preview.slice(0,5).map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${C2.border}`,alignItems:"flex-start"}}>
                    <span style={{fontSize:18,fontWeight:900,color:dark?"#F0ABFC":C.primary,flexShrink:0,minWidth:60}}>{r.jp}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:C2.text}}>{r.vn}</div>
                      {r.rom && <div style={{fontSize:11,color:C.muted}}>{r.rom}</div>}
                      {r.example && <div style={{fontSize:11,color:"rgba(56,189,248,0.7)",marginTop:1}}>💬 {r.example}</div>}
                    </div>
                  </div>
                ))}
                {preview.length > 5 && <div style={{textAlign:"center",fontSize:11,color:C.muted,padding:"8px"}}>…và {preview.length-5} thẻ nữa</div>}
              </div>
              {/* Deck name */}
              <input value={deckName} onChange={e=>setDeckName(e.target.value)}
                placeholder="Tên bộ thẻ (VD: Từ vựng N4, Manga Naruto...)"
                style={{width:"100%",background:dark?"rgba(15,23,42,0.6)":"white",border:`1px solid ${C2.border}`,borderRadius:12,padding:"10px 14px",fontSize:13,color:C2.text,outline:"none",fontFamily:"'Nunito',sans-serif",boxSizing:"border-box",marginBottom:10}}
              />
              <button onClick={saveDeck} className="ba-btn"
                style={{width:"100%",background:"linear-gradient(135deg,#38BDF8,#2563EB)",color:"white",padding:"12px",fontSize:14,boxShadow:"0 4px 20px rgba(37,99,235,0.4)"}}>
                💾 Lưu bộ thẻ ({preview.length} từ)
              </button>
            </div>
          )}

          {/* Saved custom decks */}
          {savedDecks.length > 0 && (
            <div>
              <div style={{fontSize:12,fontWeight:800,color:C.muted,marginBottom:10,letterSpacing:1}}>📚 BỘ THẺ CÁ NHÂN ĐÃ LƯU</div>
              {savedDecks.map(deck=>(
                <div key={deck.id} style={{background:C2.card,border:`1px solid ${C2.border}`,borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:800,color:C2.text}}>{deck.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{deck.cards.length} thẻ · {new Date(deck.createdAt).toLocaleDateString("vi")}</div>
                  </div>
                  <button onClick={()=>setActiveDeck(activeDeck===deck.id?null:deck.id)}
                    style={{background:dark?"rgba(37,99,235,0.2)":"rgba(239,246,255,0.8)",border:`1px solid ${C2.border}`,color:dark?"#93C5FD":C.primary,borderRadius:12,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    {activeDeck===deck.id?"▲ Ẩn":"▼ Xem"}
                  </button>
                  <button onClick={()=>deleteDeck(deck.id)}
                    style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#FCA5A5",borderRadius:12,padding:"7px 10px",fontSize:12,cursor:"pointer"}}>
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── EXPORT TAB ──────────────────────────────────────────────── */}
      {tab==="export" && (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {icon:"📘",title:"Bộ thẻ cá nhân",sub:"Tất cả bộ thẻ đã import",color:"#2563EB",fn:exportCustomDecks},
            {icon:"🔴",title:"Leach List (từ hay sai)",sub:"Top 50 từ sai nhiều nhất",color:"#DC2626",fn:exportLeachList},
          ].map((item,i)=>(
            <button key={i} onClick={item.fn}
              style={{background:C2.card,border:`1.5px solid ${item.color}25`,borderRadius:20,padding:"18px 20px",
                display:"flex",alignItems:"center",gap:16,cursor:"pointer",textAlign:"left",
                transition:"all 0.15s",fontFamily:"'Nunito',sans-serif"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${item.color}20`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <div style={{width:50,height:50,borderRadius:14,background:`${item.color}15`,border:`1.5px solid ${item.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{item.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:800,color:C2.text,marginBottom:2}}>{item.title}</div>
                <div style={{fontSize:12,color:C.muted}}>{item.sub}</div>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:item.color,background:`${item.color}12`,padding:"6px 12px",borderRadius:20,flexShrink:0}}>⬇ CSV</div>
            </button>
          ))}
          <div style={{background:dark?"rgba(30,58,138,0.2)":"rgba(239,246,255,0.6)",borderRadius:14,padding:"12px 16px",border:`1px solid ${C2.border}`,fontSize:12,color:C.muted,lineHeight:1.6}}>
            💡 File CSV có thể mở bằng Excel, Google Sheets, Anki (sau khi chuyển đổi), hoặc import lại vào Sakura Path.
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// DAILY DASHBOARD BANNER + GOAL SYSTEM
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// GUIDE SECTION – Hướng dẫn sử dụng
// ════════════════════════════════════════════════════════════════
function GuideSection() {
  const w = useWidth(); const isMob = w < 640;
  const [dark] = useDarkMode();
  const CC = useColors();
  const t = useT();
  const [lang] = useLang();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon:"🎯", color:"#38BDF8", title:"Bước 1 · Thiết lập mục tiêu", short:"Chọn cấp độ & đặt mục tiêu hằng ngày",
      points:[
        {icon:"🎌",text:"Chọn cấp độ JLPT phù hợp (N5→N1) tại trang JLPT"},
        {icon:"📊",text:"Mở Dashboard để xem tổng từ vựng cần chinh phục"},
        {icon:"🎯",text:"Nhấn nút \"Mục tiêu\" trên banner để đặt số từ/phút học mỗi ngày"},
        {icon:"🔔",text:"Bật thông báo trình duyệt để nhắc học đúng giờ"},
      ]},
    { icon:"🔄", color:"#10B981", title:"Bước 2 · Chu trình học chủ động", short:"Nhìn → Nghe → Gõ → Đánh giá",
      points:[
        {icon:"👁",text:"Nhìn thẻ Kanji → tự hỏi \"Đọc thế nào? Nghĩa là gì?\" trước khi lật"},
        {icon:"🔊",text:"Nhấn nút loa ▶ để nghe phát âm chuẩn bản ngữ (0.75x cho người mới)"},
        {icon:"⌨",text:"Bật \"⌨ Gõ\" để tự gõ lại tiếng Nhật — xóa ảo giác \"tưởng thuộc\""},
        {icon:"🗣",text:"Nhấn 🗣 Shadowing → nhại lại ngay để luyện phản xạ nói"},
      ]},
    { icon:"⭐", color:"#F59E0B", title:"Bước 3 · Đánh giá & SRS thông minh", short:"4 mức độ → hệ thống tự lên lịch ôn",
      points:[
        {icon:"🔴",text:"Again — Chưa nhớ: thẻ xuất hiện lại sau vài phút"},
        {icon:"🟡",text:"Hard — Khó nhớ: ôn lại sau 1–3 ngày"},
        {icon:"🔵",text:"Good — Đã nhớ: hệ thống SRS tự tính khoảng cách tối ưu"},
        {icon:"🟢",text:"Easy — Thuộc chắc: ẩn lâu hơn, ưu tiên từ mới"},
      ]},
    { icon:"🧠", color:"#7C3AED", title:"Bước 4 · Kỹ thuật ghi nhớ sâu", short:"Mẹo nhớ cá nhân + ngữ cảnh thực tế",
      points:[
        {icon:"📝",text:"Nhấn \"Mẹo nhớ\" → viết liên tưởng riêng hoặc nhờ AI gợi ý"},
        {icon:"🌟",text:"Xem Context → câu ví dụ thực tế, cách dùng thân mật & trang trọng"},
        {icon:"🔎",text:"Colloc → cụm từ tự nhiên hay đi kèm (collocations)"},
        {icon:"⚡",text:"Chunk → quiz điền trợ từ để nắm cấu trúc câu"},
      ]},
    { icon:"📥", color:"#0891B2", title:"Bước 5 · Mở rộng không giới hạn", short:"Import từ vựng riêng · Xuất tiến độ",
      points:[
        {icon:"📁",text:"Import → tải file CSV/Excel với từ vựng lớp học, manga, JLPT mục tiêu"},
        {icon:"🗃",text:"Bộ thẻ custom tự động ghép vào Flashcard SRS"},
        {icon:"📤",text:"Export → xuất Leach List (từ hay sai nhất) để ôn tập riêng"},
        {icon:"📌",text:"Ghim mẹo nhớ quan trọng → xem lại ở màn hình kết thúc phiên"},
      ]},
  ];

  const stepColors = ["#38BDF8","#10B981","#F59E0B","#7C3AED","#0891B2"];

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:isMob?"0 12px 4px":"0 24px 8px"}}>
      {/* Collapsed toggle bar */}
      <button onClick={()=>setOpen(v=>!v)}
        style={{
          width:"100%",background:dark?"linear-gradient(135deg,rgba(30,58,138,0.5),rgba(15,23,42,0.7))":"linear-gradient(135deg,rgba(239,246,255,0.9),rgba(219,234,254,0.7))",
          border:`1.5px solid ${dark?"rgba(56,189,248,0.25)":"rgba(37,99,235,0.2)"}`,
          borderRadius:open?`${isMob?16:20}px ${isMob?16:20}px 0 0`:`${isMob?16:20}px`,
          padding:isMob?"13px 16px":"14px 24px",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          cursor:"pointer",fontFamily:"'Nunito',sans-serif",
          transition:"all 0.2s",
          boxShadow:open?"none":dark?"0 2px 16px rgba(0,0,0,0.3)":"0 2px 16px rgba(37,99,235,0.08)"
        }}>
        <div style={{display:"flex",alignItems:"center",gap:isMob?8:12}}>
          <span style={{fontSize:isMob?18:22}}>📖</span>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:isMob?13:15,fontWeight:800,color:dark?"#93C5FD":"#1E40AF"}}>
              {"Hướng dẫn sử dụng"}
            </div>
            <div style={{fontSize:isMob?10:11,color:dark?"rgba(148,163,184,0.7)":C.muted,marginTop:1}}>
              {"Chinh phục tiếng Nhật trong tầm tay · 5 bước"}
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {!open && (
            <div style={{display:"flex",gap:4}}>
              {stepColors.map((c,i)=>(
                <div key={i} style={{width:8,height:8,borderRadius:"50%",background:c,opacity:0.7}}/>
              ))}
            </div>
          )}
          <span style={{fontSize:14,color:dark?"rgba(148,163,184,0.7)":C.muted,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
        </div>
      </button>

      {/* Expanded panel */}
      {open && (
        <div style={{
          background:dark?"linear-gradient(180deg,rgba(15,23,42,0.95),rgba(15,23,42,0.9))":"white",
          border:`1.5px solid ${dark?"rgba(56,189,248,0.2)":"rgba(37,99,235,0.15)"}`,
          borderTop:"none",
          borderRadius:`0 0 ${isMob?16:20}px ${isMob?16:20}px`,
          boxShadow:dark?"0 8px 32px rgba(0,0,0,0.4)":"0 8px 32px rgba(37,99,235,0.1)",
          overflow:"hidden"
        }}>
          {/* Step tabs */}
          <div style={{display:"flex",overflowX:"auto",padding:"14px 16px 0",gap:6,scrollbarWidth:"none"}}>
            {steps.map((s,i)=>(
              <button key={i} onClick={()=>setActiveStep(i)}
                style={{
                  flexShrink:0,
                  background:activeStep===i?`${s.color}20`:"transparent",
                  border:`1.5px solid ${activeStep===i?s.color:"transparent"}`,
                  borderRadius:12,padding:isMob?"7px 10px":"8px 14px",
                  cursor:"pointer",fontFamily:"'Nunito',sans-serif",
                  transition:"all 0.15s",
                }}>
                <span style={{fontSize:isMob?16:18}}>{s.icon}</span>
                {!isMob && (
                  <div style={{fontSize:10,fontWeight:700,color:activeStep===i?s.color:dark?"rgba(148,163,184,0.6)":C.muted,marginTop:2,whiteSpace:"nowrap"}}>
                    {`Bước ${i+1}`}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Active step content */}
          {(() => {
            const s = steps[activeStep];
            return (
              <div style={{padding:isMob?"16px":"20px 24px 24px"}}>
                {/* Step header */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}`}}>
                  <div style={{width:44,height:44,borderRadius:14,background:`${s.color}18`,border:`1.5px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{fontSize:isMob?15:17,fontWeight:900,color:s.color}}>{s.title}</div>
                    <div style={{fontSize:isMob?11:12,color:dark?"rgba(148,163,184,0.7)":C.muted}}>{s.short}</div>
                  </div>
                </div>

                {/* Points */}
                <div style={{display:"flex",flexDirection:"column",gap:isMob?10:12}}>
                  {s.points.map((p,i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",
                      background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)",
                      borderRadius:12,padding:isMob?"10px 12px":"11px 16px",
                      border:`1px solid ${dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)"}`}}>
                      <span style={{fontSize:20,flexShrink:0,lineHeight:1.3}}>{p.icon}</span>
                      <span style={{fontSize:isMob?12:13,color:dark?"rgba(226,232,240,0.85)":C.text,lineHeight:1.6}}>{p.text}</span>
                    </div>
                  ))}
                </div>

                {/* Step navigation */}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:16,gap:8}}>
                  <button onClick={()=>setActiveStep(v=>Math.max(0,v-1))} disabled={activeStep===0}
                    style={{background:activeStep===0?"transparent":dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)",border:`1px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.08)"}`,borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:activeStep===0?"default":"pointer",color:activeStep===0?dark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)":dark?"#E2E8F0":C.text,fontFamily:"'Nunito',sans-serif"}}>
                    {"← Bước trước"}
                  </button>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    {steps.map((_,i)=>(
                      <div key={i} onClick={()=>setActiveStep(i)}
                        style={{width:i===activeStep?20:6,height:6,borderRadius:99,background:i===activeStep?s.color:dark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.15)",cursor:"pointer",transition:"all 0.2s"}}/>
                    ))}
                  </div>
                  {activeStep < steps.length-1 ? (
                    <button onClick={()=>setActiveStep(v=>Math.min(steps.length-1,v+1))}
                      style={{background:`linear-gradient(135deg,${s.color},${s.color}cc)`,border:"none",borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer",color:"white",fontFamily:"'Nunito',sans-serif",boxShadow:`0 2px 12px ${s.color}40`}}>
                      {"Bước tiếp →"}
                    </button>
                  ) : (
                    <button onClick={()=>setOpen(false)}
                      style={{background:"linear-gradient(135deg,#10B981,#059669)",border:"none",borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer",color:"white",fontFamily:"'Nunito',sans-serif",boxShadow:"0 2px 12px rgba(16,185,129,0.4)"}}>
                      {"✓ Bắt đầu học!"}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function DailyBanner({ streak, setPage }) {
  const [dark]    = useDarkMode();
  const t = useT();
  const [lang] = useLang();
  const [goals,   setGoals]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_goals") || '{"wordsPerDay":10,"minutesPerDay":15,"reviewPerDay":5}'); } catch { return {wordsPerDay:10,minutesPerDay:15,reviewPerDay:5}; }
  });
  const [todayStats, setTodayStats] = useState(() => {
    const today = new Date().toDateString();
    try {
      const s = JSON.parse(localStorage.getItem("sp_today_stats") || "{}");
      if (s.date === today) return s;
      return { date: today, wordsLearned: 0, minutesStudied: 0, reviewed: 0 };
    } catch { return { date: new Date().toDateString(), wordsLearned: 0, minutesStudied: 0, reviewed: 0 }; }
  });
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [goalDraft,      setGoalDraft]      = useState(goals);
  const [dismissed,      setDismissed]      = useState(false);
  const [notifGranted,   setNotifGranted]   = useState(false);

  // Due cards from SM-2 deck
  const dueCount = (() => {
    try {
      const deck = JSON.parse(localStorage.getItem("sp_deck") || "[]");
      const now  = Date.now();
      return deck.filter(c => !c.due || c.due <= now).length;
    } catch { return 0; }
  })();

  const days = streak?.streak || 0;
  const pctWords = Math.min(100, Math.round((todayStats.wordsLearned / goals.wordsPerDay) * 100));
  const pctMins  = Math.min(100, Math.round((todayStats.minutesStudied / goals.minutesPerDay) * 100));

  // Smart motivational message
  const getMessage = () => {
    if (days === 0)  return { msg: "Bắt đầu hành trình học tiếng Nhật hôm nay nhé! 🌸", color: "#38BDF8" };
    if (days >= 7)   return { msg: `🔥 Chuỗi ${days} ngày đang ổn định. Đừng phá vỡ đà tiến!`, color: "#F59E0B" };
    if (days >= 2)   return { msg: `💪 Duy trì chuỗi ${days} ngày tuyệt vời! Tiếp tục nhé.`, color: "#10B981" };
    const lastDate = streak?.lastLearnDate;
    if (lastDate) {
      const diffDays = Math.floor((Date.now() - new Date(lastDate)) / 86400000);
      if (diffDays >= 2) return { msg: "Bạn đang để bộ nhớ nguội dần. Học lại 5 phút thôi nhé? 🧊", color: "#EF4444" };
    }
    return { msg: "Hôm nay học thêm vài từ nhé! 📚", color: "#38BDF8" };
  };

  const { msg, color } = getMessage();
  if (dismissed) return null;

  const requestNotif = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotifGranted(true);
        new Notification("🌸 Sakura Path", { body: "Đừng quên học tiếng Nhật hôm nay nhé!", icon: "🌸" });
      }
    }
  };

  return (
    <div style={{maxWidth:900,margin:"0 auto 0",padding:"16px 16px 0"}}>
      {/* Main banner */}
      <div style={{background:dark?"linear-gradient(135deg,rgba(30,58,138,0.6),rgba(15,23,42,0.9))":"linear-gradient(135deg,rgba(239,246,255,0.95),rgba(219,234,254,0.9))",
        borderRadius:20,padding:"16px 20px",border:`1.5px solid ${dark?"rgba(56,189,248,0.2)":"rgba(37,99,235,0.15)"}`,
        boxShadow:dark?"0 4px 24px rgba(0,0,0,0.3)":"0 4px 24px rgba(37,99,235,0.08)"}}>

        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:14}}>
          <div style={{flex:1}}>
            {/* Motivational message */}
            <div style={{fontSize:13,fontWeight:700,color,marginBottom:4,lineHeight:1.4}}>{msg}</div>
            {/* Due cards alert */}
            {dueCount > 0 && (
              <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setPage("flashcard")}>
                <span style={{fontSize:12,color:"#F59E0B",fontWeight:700}}>⚡ {dueCount} thẻ cần ôn tập hôm nay</span>
                <span style={{fontSize:11,color:C.muted}}>→ Ôn ngay</span>
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button onClick={()=>setShowGoalEditor(v=>!v)}
              style={{background:dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)",border:`1px solid ${dark?"rgba(56,189,248,0.25)":"rgba(37,99,235,0.2)"}`,color:dark?"#93C5FD":C.primary,borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
              🎯 Mục tiêu
            </button>
            <button onClick={requestNotif} title="Bật thông báo"
              style={{background:"none",border:"none",color:notifGranted?"#F59E0B":C.muted,cursor:"pointer",fontSize:16,padding:"4px"}}>
              🔔
            </button>
            <button onClick={()=>setDismissed(true)}
              style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,padding:"4px"}}>✕</button>
          </div>
        </div>

        {/* Progress bars */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {[
            {label:"📚 Từ mới",cur:todayStats.wordsLearned,target:goals.wordsPerDay,pct:pctWords,color:"#38BDF8",unit:"từ",page:"flashcard"},
            {label:"⏱ Học tập", cur:todayStats.minutesStudied,target:goals.minutesPerDay,pct:pctMins,color:"#10B981",unit:"phút",page:"streak"},
          ].map((g,i)=>(
            <div key={i} style={{flex:1,minWidth:140}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,fontWeight:700,color:dark?"rgba(255,255,255,0.6)":C.muted}}>{g.label}</span>
                <span style={{fontSize:11,fontWeight:800,color:g.pct>=100?g.color:dark?"rgba(255,255,255,0.5)":C.muted}}>{g.cur}/{g.target} {g.unit}</span>
              </div>
              <div style={{height:6,background:dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${g.pct}%`,background:g.pct>=100?`linear-gradient(90deg,${g.color},#10B981)`:`linear-gradient(90deg,${g.color},${g.color}aa)`,borderRadius:99,transition:"width 0.5s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal editor panel */}
      {showGoalEditor && (
        <div style={{background:dark?"rgba(15,23,42,0.95)":"white",borderRadius:16,padding:"16px 20px",marginTop:8,border:`1.5px solid ${dark?"rgba(56,189,248,0.2)":"rgba(37,99,235,0.15)"}`,boxShadow:"0 8px 32px rgba(0,0,0,0.15)"}}>
          <div style={{fontSize:13,fontWeight:800,color:dark?"#93C5FD":C.primary,marginBottom:12}}>🎯 ĐẶT MỤC TIÊU HẰNG NGÀY</div>
          {[
            {key:"wordsPerDay",label:"Số từ mới / ngày",min:1,max:50,unit:"từ"},
            {key:"minutesPerDay",label:"Số phút học / ngày",min:5,max:120,unit:"phút"},
            {key:"reviewPerDay",label:"Số thẻ ôn lại / ngày",min:1,max:100,unit:"thẻ"},
          ].map(g=>(
            <div key={g.key} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:dark?"rgba(255,255,255,0.7)":C.text,fontWeight:600}}>{g.label}</span>
                <span style={{fontSize:13,fontWeight:800,color:dark?"#93C5FD":C.primary}}>{goalDraft[g.key]} {g.unit}</span>
              </div>
              <input type="range" min={g.min} max={g.max} value={goalDraft[g.key]}
                onChange={e=>setGoalDraft(d=>({...d,[g.key]:+e.target.value}))}
                style={{width:"100%",accentColor:"#38BDF8"}}/>
            </div>
          ))}
          <button onClick={()=>{setGoals(goalDraft);localStorage.setItem("sp_goals",JSON.stringify(goalDraft));setShowGoalEditor(false);}}
            className="ba-btn" style={{width:"100%",background:"linear-gradient(135deg,#38BDF8,#2563EB)",color:"white",padding:"10px",fontSize:13,marginTop:4}}>
            💾 Lưu mục tiêu
          </button>
        </div>
      )}
    </div>
  );
}


function StreakPage({streak}){
    const t = useT();
const w=useWidth();const isMob=w<640;
  const CC=useColors();
  const dark=CC.dark;
  const W  = a => dark ? `rgba(255,255,255,${a})` : `rgba(15,23,42,${a})`;
  const FG = dark ? "white" : "#0F172A";
  const {streak:s,highest,learnedToday,activeDays,bumped}=streak;
  const [glowing,setGlowing]=useState(false);
  useEffect(()=>{if(bumped){setGlowing(true);setTimeout(()=>setGlowing(false),2000);}},[bumped]);
  const nextMile=MILESTONES.find(m=>m.days>s)||MILESTONES[MILESTONES.length-1];
  const prevDays=(()=>{const p=MILESTONES.filter(m=>m.days<=s);return p.length?p[p.length-1].days:0;})();
  const pct=nextMile.days===prevDays?100:Math.min(100,Math.round((s-prevDays)/(nextMile.days-prevDays)*100));
  const hitMile=MILESTONES.find(m=>m.days===s);
  return(<div style={{minHeight:"calc(100vh - 52px)",background:dark?"linear-gradient(135deg,#0f1923,#1a2a3a)":"linear-gradient(135deg,#EFF6FF,#DBEAFE)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:isMob?"16px":"32px"}}>
    <div style={{width:"100%",maxWidth:isMob?"100%":460,background:dark?W(0.06):"rgba(255,255,255,0.85)",backdropFilter:"blur(16px)",border:`1px solid ${glowing?"rgba(255,150,0,0.5)":W(0.1)}`,borderRadius:isMob?20:28,padding:isMob?"20px":"36px 40px",boxShadow:glowing?"0 16px 48px rgba(0,0,0,0.4),0 0 32px rgba(255,150,0,0.25)":"0 16px 48px rgba(0,0,0,0.4)",color:FG}}>
      {s===0&&!learnedToday&&(<div style={{display:"flex",gap:10,background:"rgba(168,218,220,0.12)",border:"1px solid rgba(168,218,220,0.3)",borderRadius:12,padding:"12px 14px",marginBottom:18,alignItems:"center"}}><span style={{fontSize:20}}>👋</span><div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>Chào mừng đến Sakura Path!</div><div style={{fontSize:11,color:W(0.6)}}>Học bài đầu tiên để bắt đầu chuỗi ngày 🔥</div></div></div>)}
      {s>0&&!learnedToday&&(<div style={{display:"flex",gap:10,background:"rgba(255,149,0,0.15)",border:"1px solid rgba(255,149,0,0.4)",borderRadius:12,padding:"12px 14px",marginBottom:18,alignItems:"center"}}><span style={{fontSize:20}}>⚠️</span><div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>Hôm nay chưa học bài nào!</div><div style={{fontSize:11,color:W(0.6)}}>Làm ít nhất 1 bài để duy trì chuỗi 🔥</div></div></div>)}
      {learnedToday&&!hitMile&&(<div style={{display:"flex",gap:10,background:"rgba(45,198,83,0.12)",border:"1px solid rgba(45,198,83,0.35)",borderRadius:12,padding:"12px 14px",marginBottom:18,alignItems:"center"}}><span style={{fontSize:20}}>✅</span><div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>Tuyệt! Bạn đã học hôm nay rồi.</div><div style={{fontSize:11,color:W(0.6)}}>Chuỗi {s} ngày được bảo vệ 🔥</div></div></div>)}
      {hitMile&&learnedToday&&(<div style={{display:"flex",gap:10,background:"rgba(45,198,83,0.15)",border:"1px solid rgba(45,198,83,0.4)",borderRadius:12,padding:"12px 14px",marginBottom:18,alignItems:"center"}}><span style={{fontSize:20}}>{hitMile.emoji}</span><div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>Chúc mừng mốc {hitMile.days} ngày!</div><div style={{fontSize:11,color:W(0.6)}}>{hitMile.msg}</div></div></div>)}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <span style={{fontSize:isMob?56:68,lineHeight:1,filter:"drop-shadow(0 0 16px rgba(255,120,0,0.6))",opacity:s===0?0.3:1}}>🔥</span>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,color:W(0.5),textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Chuỗi hiện tại</div>
          <div style={{fontSize:isMob?52:60,fontWeight:900,lineHeight:1,color:s===0?W(0.2):"transparent",background:s===0?"none":"linear-gradient(135deg,#ff6b35,#ffb703)",WebkitBackgroundClip:s===0?"unset":"text",WebkitTextFillColor:s===0?W(0.2):"transparent"}}>{s}</div>
          <div style={{fontSize:14,color:W(0.5),fontWeight:600}}>ngày liên tiếp</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,background:W(0.05),border:`1px solid ${W(0.1)}`,borderRadius:12,padding:"11px 16px",marginBottom:18}}>
        <span style={{fontSize:18}}>🏆</span><span style={{fontSize:13,color:W(0.6)}}>Kỷ lục cao nhất</span><span style={{fontSize:15,fontWeight:800,color:dark?"#FFD700":"#B45309",marginLeft:"auto"}}>{highest} ngày</span>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:W(0.5),marginBottom:7}}>
          <span>{s===0?"Học bài đầu tiên để bắt đầu!":s>=100?"Đạt mốc cao nhất!":`Còn ${nextMile.days-s} ngày đến mốc tiếp`}</span>
          <span style={{color:dark?C.light:C.primary,fontWeight:700}}>{nextMile.days}d</span>
        </div>
        <div style={{height:8,background:W(0.1),borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",borderRadius:99,background:"linear-gradient(90deg,#ff6b35,#ffb703,#2DC653)",transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
        {MILESTONES.map(m=>(<div key={m.days} style={{background:s>=m.days?"rgba(45,198,83,0.12)":W(0.04),border:`1px solid ${s>=m.days?"rgba(45,198,83,0.4)":W(0.08)}`,borderRadius:12,padding:"12px 6px",textAlign:"center"}}><div style={{fontSize:20,marginBottom:3,filter:s<m.days?"grayscale(1) opacity(0.4)":"none"}}>{m.emoji}</div><div style={{fontSize:13,fontWeight:800,color:dark?C.light:C.primary}}>{m.days} ngày</div><div style={{fontSize:10,color:W(0.4),marginTop:2}}>{m.msg.split("!")[0]}</div></div>))}
      </div>
      <div style={{fontSize:10,color:W(0.4),textTransform:"uppercase",letterSpacing:0.5,marginBottom:7}}>14 ngày gần nhất</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:14}}>
        {Array.from({length:14}).map((_,i)=>{const d=nDaysAgo(13-i);const active=activeDays.includes(d);const isToday=d===todayStr()&&!learnedToday;return(<div key={i} style={{aspectRatio:"1",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,background:active?"linear-gradient(135deg,#ff6b35,#ffb703)":W(0.05),border:`1px solid ${isToday?"#FF9500":active?"transparent":W(0.07)}`,color:active?"white":isToday?"#FF9500":W(0.35)}}>{new Date(d).getDate()}</div>);})}
      </div>
      <p style={{fontSize:11,color:W(0.4),textAlign:"center",margin:0}}>Hoàn thành bài học mỗi ngày để tăng chuỗi 🔥</p>
    </div>
  </div>);
}

// ════════════════════════════════════════
// HOME
// ════════════════════════════════════════
function HomePage({setPage, streak}){
  const t = useT();
  const w=useWidth(); const isMob=w<640; const isTab=w>=640&&w<1024;
  const CC=useColors();
  const [dark]=useDarkMode();
  const cols=isMob?1:isTab?2:3;

  // ── Quick-access pinned features ──────────────────────
  const pinned=[
    {icon:"🧠",label:"Flashcard SRS",page:"flashcard",color:"#8B5CF6"},
    {icon:"🎌",label:"Luyện thi JLPT",page:"jlpt",color:"#EF4444"},
    {icon:"✍️",label:"Viết Kanji",page:"kanji",color:"#3B82F6"},
    {icon:"🤖",label:"AI Chatbot",page:"chat",color:"#0EA5E9"},
    {icon:"📝",label:"Ngữ pháp",page:"grammar",color:"#10B981"},
    {icon:"🎮",label:"Game ghép từ",page:"game",color:"#F59E0B"},
    {icon:"📋",label:"Đề thi EJU",page:"eju",color:"#6366F1"},
    {icon:"🗺️",label:"Lộ trình",page:"map",color:"#14B8A6"},
  ];

  const sections=[
    {
      id:"foundation",
      badge:"🏗️",label:"Nền Tảng",sub:"Kana · Từ vựng · Ngữ pháp",
      accent:"#2563EB",
      items:[
        {icon:"🧠",title:"Flashcard SRS",tag:"N5+N4",desc:"800+ từ · SRS thông minh · lật thẻ",page:"flashcard",color:"#7C3AED"},
        {icon:"あ",title:"Hiragana",tag:"N5",desc:"46 ký tự · quiz nhận diện · vẽ tay",page:"hiragana",color:"#DB2777"},
        {icon:"ア",title:"Katakana",tag:"N5",desc:"Âm ngoại lai · quiz viết · mở khóa",page:"katakana",color:"#9333EA"},
        {icon:"📝",title:"Ngữ Pháp N5+N4",tag:"N5→N4",desc:"42 mẫu câu · ví dụ thực tế · quiz",page:"grammar",color:"#059669"},
        {icon:"📥",title:"Import / Export",tag:"Tùy chỉnh",desc:"Excel/CSV · bộ từ riêng · xuất tiến độ",page:"import",color:"#0891B2"},
      ]
    },
    {
      id:"skills",
      badge:"🎯",label:"4 Kỹ Năng",sub:"Nghe · Nói · Đọc · Viết",
      accent:"#8B5CF6",
      items:[
        {icon:"✍️",title:"Chính Tả",tag:"N5→N3",desc:"Nghe → gõ lại · highlight lỗi từng ký tự",page:"dictation",color:"#EC4899"},
        {icon:"📚",title:"Đọc Truyện",tag:"N5+",desc:"3-5 câu · furigana · bấm từ xem nghĩa",page:"story",color:"#BE185D"},
        {icon:"💬",title:"AI Hội Thoại",tag:"AI",desc:"Chat tiếng Nhật · AI sửa lỗi real-time",page:"chat",color:"#0EA5E9"},
      ]
    },
    {
      id:"kanji",
      badge:"漢",label:"Kanji",sub:"Viết tay · Trace · Radical",
      accent:"#4338CA",
      items:[
        {icon:"✍️",title:"Luyện Viết Kanji",tag:"Canvas",desc:"Vẽ tay · Trace Mode · AI chấm nét · SRS",page:"kanji",color:"#4338CA"},
        {icon:"⛩️",title:"Kanji Bộ Thủ",tag:"Radical",desc:"Học qua radicals · ghép bộ thủ · visual story",page:"radical",color:"#B45309"},
      ]
    },
    {
      id:"exam",
      badge:"🎌",label:"Thi Cử",sub:"JLPT · EJU · Tiến trình",
      accent:"#DC2626",
      items:[
        {icon:"🎌",title:"JLPT N5→N1",tag:"Thi",desc:"Ngữ pháp · Đọc hiểu · Nghe hiểu đầy đủ",page:"jlpt",color:"#DC2626"},
        {icon:"📋",title:"EJU 模擬試験",tag:"6 môn",desc:"Đề gốc JASSO · Phiếu đáp án · Bấm giờ",page:"eju",color:"#312E81"},
        {icon:"🗺️",title:t.mapTitle,tag:"N5→N1",desc:"Bản đồ JLPT · theo dõi vocab/kanji từng cấp",page:"map",color:"#10B981"},
      ]
    },
    {
      id:"gamify",
      badge:"🎮",label:"Gamification & AI",sub:"Game · Thành tích · Phân tích",
      accent:"#F59E0B",
      items:[
        {icon:"🎮",title:"Game Ghép Câu",tag:"N5→N2",desc:"Kéo thả từ · giải thích ngữ pháp sau mỗi câu",page:"game",color:"#4F46E5"},
        {icon:"🏅",title:"Thành Tích & XP",tag:"Level",desc:"Huy hiệu · tích XP · lên cấp Lv.1→Lv.30",page:"achieve",color:"#D97706"},
        {icon:"📊",title:t.analysisTitle,tag:"AI",desc:"Radar 5 kỹ năng · phân tích điểm yếu · gợi ý",page:"analysis",color:"#6D28D9"},
        {icon:"🔥",title:t.streakTitle,tag:"Daily",desc:"Chuỗi học · mốc huy hiệu · lịch học tập",page:"streak",color:"#EA580C"},
      ]
    },
    {
      id:"world",
      badge:"🌏",label:"Thực Tế & Thói Quen",sub:"Tin tức · Văn hóa · Heatmap",
      accent:"#10B981",
      items:[
        {icon:"📰",title:"Tin Tức Nhật",tag:"N5→N3",desc:"Furigana · bấm từ xem nghĩa · quiz đọc hiểu",page:"news",color:"#0EA5E9"},
        {icon:"🏯",title:"Văn Hóa Nhật",tag:"Audio",desc:"Ojigi · phép ăn · học đường · câu thực dụng",page:"culture",color:"#B45309"},
        {icon:"📅",title:"Study Heatmap",tag:"52 tuần",desc:"Cường độ học · streak · màu theo ngày",page:"heatmap",color:"#16A34A"},
        {icon:"⚡",title:"Bài Học 1 Phút",tag:"Daily",desc:"15 mini-lesson · Kanji · Từ vựng · quiz nhanh",page:"mini",color:"#DC2626"},
        {icon:"👥",title:"Nhóm Học",tag:"Cộng đồng",desc:"Bảng xếp hạng · thi đấu từ vựng",page:"group",color:"#059669"},
        {icon:"⏱",title:"Pomodoro Timer",tag:"25/5p",desc:"Tập trung học · gợi ý bài · thống kê phiên",page:"timer",color:"#4338CA"},
      ]
    },
  ];

  const divider = dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)";

  return(
    <div className="ba-page-enter" style={{fontFamily:"'Nunito',sans-serif"}}>

      {/* ══════════ HERO ══════════ */}
      <div style={{
        background:"linear-gradient(135deg,#0A0F1E 0%,#0F2057 40%,#0C3B72 70%,#093F7A 100%)",
        padding:isMob?"34px 16px 26px":"48px 24px 38px",
        textAlign:"center",position:"relative",overflow:"hidden"
      }}>
        {/* Subtle grid pattern */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(56,189,248,0.08) 1px,transparent 1px)",backgroundSize:"24px 24px",pointerEvents:"none"}}/>
        {/* Ambient radial glows */}
        <div style={{position:"absolute",top:"-20%",left:"25%",width:460,height:460,background:"radial-gradient(circle,rgba(56,189,248,0.18) 0%,transparent 65%)",pointerEvents:"none",filter:"blur(24px)"}}/>
        <div style={{position:"absolute",bottom:"-15%",right:"15%",width:400,height:400,background:"radial-gradient(circle,rgba(37,99,235,0.22) 0%,transparent 65%)",pointerEvents:"none",filter:"blur(24px)"}}/>
        
        {/* Floating kana */}
        {!isMob&&["あ","い","う","え","お","か","き","く","け","こ","さ","し"].map((c,i)=>(
          <span key={i} style={{
            position:"absolute",
            left:`${[6,16,26,38,50,64,74,84,94,12,78,88][i]}%`,
            top:`${[18,72,28,82,14,66,24,76,34,46,14,58][i]}%`,
            fontSize:isMob?16:22,color:"rgba(56,189,248,0.08)",fontWeight:900,pointerEvents:"none",
            transform:`rotate(${[-12,8,-6,10,-8,6,-10,8,-6,12,-8,6][i]}deg)`
          }}>{c}</span>
        ))}

        <div style={{position:"relative",maxWidth:760,margin:"0 auto"}}>
          {/* Top badge */}
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:"rgba(56,189,248,0.12)",
            border:"1px solid rgba(56,189,248,0.32)",
            borderRadius:50,padding:"6px 16px",marginBottom:16,
            boxShadow:"0 2px 12px rgba(56,189,248,0.15)"
          }}>
            <span style={{fontSize:13}}>🌸</span>
            <span style={{color:"#7DD3FC",fontSize:11.5,fontWeight:800,letterSpacing:"0.08em"}}>NỀN TẢNG HỌC TIẾNG NHẬT TOÀN DIỆN</span>
          </div>

          <h1 style={{
            color:"white",fontSize:isMob?28:44,fontWeight:900,
            margin:"0 0 14px",lineHeight:1.18,letterSpacing:"-0.025em",
            textShadow:"0 4px 28px rgba(0,0,0,0.4)"
          }}>
            Con Đường Đến{" "}
            <span className="hero-gradient-text">Nhật Bản</span>{" "}Của Bạn
          </h1>

          <p style={{
            color:"rgba(224,242,254,0.85)",fontSize:isMob?13.5:16,
            lineHeight:1.6,maxWidth:580,margin:"0 auto 24px",fontWeight:500
          }}>
            Lộ trình thông minh từ <strong>N5 đến N1</strong> · Flashcard SRS · Nghe Nói Đọc Viết · AI &amp; Luyện thi JLPT
          </p>

          {/* CTA buttons */}
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>setPage("hiragana")} className="ba-btn" style={{
              background:"linear-gradient(135deg,#38BDF8 0%,#2563EB 100%)",
              color:"white",padding:isMob?"12px 24px":"14px 34px",
              fontSize:isMob?13.5:15,fontWeight:800,borderRadius:14,
              boxShadow:"0 8px 24px rgba(37,99,235,0.45), 0 0 0 1px rgba(56,189,248,0.35)",
              border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8
            }}>🚀 Bắt Đầu Học Ngay</button>
            <button onClick={()=>setPage("flashcard")} className="ba-btn" style={{
              background:"rgba(255,255,255,0.08)",
              backdropFilter:"blur(8px)",
              color:"rgba(255,255,255,0.95)",padding:isMob?"12px 22px":"14px 28px",
              fontSize:isMob?13.5:15,fontWeight:700,borderRadius:14,
              border:"1.5px solid rgba(255,255,255,0.2)",cursor:"pointer",
              display:"inline-flex",alignItems:"center",gap:8
            }}>🧠 Flashcard SRS</button>
            <button onClick={()=>setPage("jlpt")} className="ba-btn" style={{
              background:"rgba(239,68,68,0.15)",
              color:"#FCA5A5",padding:isMob?"12px 20px":"14px 24px",
              fontSize:isMob?13.5:15,fontWeight:700,borderRadius:14,
              border:"1.5px solid rgba(239,68,68,0.35)",cursor:"pointer",
              display:"inline-flex",alignItems:"center",gap:6
            }}>🎌 Thi Thử JLPT</button>
          </div>

          {/* Trust indicators */}
          <div style={{display:"flex",gap:isMob?10:20,justifyContent:"center",marginTop:22,flexWrap:"wrap"}}>
            {[
              {badge:"23+ Tính năng",sub:"Học tập toàn diện"},
              {badge:"N5 → N1",sub:"Chuẩn đề JLPT"},
              {badge:"EJU 7 Môn",sub:"Du học Nhật Bản"},
              {badge:"Miễn phí 100%",sub:"Mở khóa trọn đời"},
            ].map((item,i)=>(
              <div key={i} style={{
                display:"inline-flex",alignItems:"center",gap:6,
                background:"rgba(255,255,255,0.06)",padding:"4px 12px",borderRadius:20,
                border:"1px solid rgba(255,255,255,0.1)"
              }}>
                <span style={{color:"#38BDF8",fontWeight:800,fontSize:12}}>{item.badge}</span>
                <span style={{color:"rgba(186,230,253,0.6)",fontSize:11}}>• {item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ FLOATING STATS BAR ══════════ */}
      <div style={{
        maxWidth:1080,
        margin:isMob?"12px 16px 18px":"-24px auto 24px",
        position:"relative",zIndex:10,padding:"0 12px"
      }}>
        <div style={{
          background:dark
            ?"linear-gradient(135deg,rgba(15,23,42,0.88),rgba(30,41,59,0.88))"
            :"linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))",
          backdropFilter:"blur(14px)",
          WebkitBackdropFilter:"blur(14px)",
          borderRadius:20,
          border:dark?"1px solid rgba(56,189,248,0.2)":"1px solid rgba(37,99,235,0.12)",
          boxShadow:dark
            ?"0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.1)"
            :"0 12px 32px rgba(37,99,235,0.1), 0 2px 8px rgba(0,0,0,0.04)",
          padding:isMob?"12px 14px":"16px 24px",
          display:"grid",
          gridTemplateColumns:isMob?"repeat(3, 1fr)":"repeat(6, 1fr)",
          gap:isMob?"10px 8px":"12px",
          alignItems:"center"
        }}>
          {[
            {n:VOCAB_N5.length+VOCAB_N4.length+VOCAB_N3.length+VOCAB_N2.length+VOCAB_N1.length, l:"Từ vựng", ic:"📚"},
            {n:GRAMMAR_N5.length+GRAMMAR_N4.length, l:"Ngữ pháp", ic:"📝"},
            {n:KANJI_N5.length+KANJI_N4.length+KANJI_N3.length+KANJI_N2.length+KANJI_N1.length, l:"Kanji", ic:"漢"},
            {n:"5", l:"Cấp JLPT", ic:"🎌"},
            {n:"23", l:"Tính năng", ic:"⚡"},
            {n:"7", l:"Môn EJU", ic:"📋"},
          ].map((s,i)=>(
            <div key={i} style={{
              textAlign:"center",
              padding:"4px 8px",
              borderRight:(!isMob && i < 5)?(dark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.06)"):"none"
            }}>
              <div style={{
                color:dark?"#F8FAFC":"#0F172A",
                fontSize:isMob?17:22,
                fontWeight:900,lineHeight:1.1,
                fontFamily:"'Nunito',sans-serif",
                display:"flex",alignItems:"center",justifyContent:"center",gap:4
              }}>
                <span>{s.n}</span>
              </div>
              <div style={{
                color:dark?"#94A3B8":"#64748B",
                fontSize:11,fontWeight:700,marginTop:3,
                display:"flex",alignItems:"center",justifyContent:"center",gap:4
              }}>
                <span style={{fontSize:12}}>{s.ic}</span>
                <span>{s.l}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ QUICK ACCESS BAR ══════════ */}
      <div style={{
        maxWidth:1080,
        margin:"0 auto 16px",
        padding:isMob?"0 16px":"0 24px"
      }}>
        <div style={{
          background:dark?"rgba(15,23,42,0.6)":"rgba(255,255,255,0.8)",
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          borderRadius:18,
          border:dark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(37,99,235,0.12)",
          boxShadow:dark?"0 4px 16px rgba(0,0,0,0.2)":"0 4px 16px rgba(37,99,235,0.05)",
          padding:isMob?"10px 12px":"12px 18px",
          display:"flex",
          alignItems:"center",
          gap:12
        }}>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:6,
            padding:"6px 12px",
            background:dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)",
            borderRadius:12,flexShrink:0
          }}>
            <span style={{fontSize:13}}>⚡</span>
            <span style={{fontSize:11.5,fontWeight:900,color:dark?"#7DD3FC":C.primary,letterSpacing:"0.04em",whiteSpace:"nowrap"}}>
              LỐI TẮT NHANH
            </span>
          </div>

          <div style={{
            display:"flex",alignItems:"center",gap:8,
            overflowX:"auto",scrollbarWidth:"none",flex:1,padding:"2px 0"
          }}>
            {pinned.map((p,i)=>(
              <button key={i} onClick={()=>setPage(p.page)} className="ba-btn"
                style={{
                  display:"inline-flex",alignItems:"center",gap:7,
                  padding:"7px 14px",
                  background:dark?`${p.color}18`:`${p.color}10`,
                  color:dark?"#F1F5F9":CC.text,
                  border:`1.5px solid ${p.color}35`,
                  borderRadius:12,fontSize:12.5,fontWeight:700,
                  whiteSpace:"nowrap",flexShrink:0,cursor:"pointer",
                  transition:"all 0.15s ease",
                  boxShadow:`0 2px 6px ${p.color}15`
                }}>
                <span style={{
                  width:22,height:22,borderRadius:6,
                  background:`${p.color}25`,
                  display:"inline-flex",alignItems:"center",justifyContent:"center",
                  fontSize:13
                }}>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ DAILY BANNER ══════════ */}
      <DailyBanner streak={streak} setPage={setPage}/>

      {/* ══════════ GUIDE ══════════ */}
      <GuideSection/>

      {/* ══════════ FEATURE SECTIONS ══════════ */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:isMob?"16px":"24px 24px 40px"}}>
        {sections.map((sec,si)=>(
          <div key={sec.id} style={{marginBottom:isMob?32:48}}>

            {/* Section header */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{
                width:36,height:36,borderRadius:10,flexShrink:0,
                background:`linear-gradient(135deg,${sec.accent}22,${sec.accent}44)`,
                border:`1.5px solid ${sec.accent}30`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,boxShadow:`0 2px 10px ${sec.accent}20`
              }}>{sec.badge}</div>
              <div>
                <div style={{fontWeight:900,fontSize:isMob?15:17,color:CC.text,lineHeight:1}}>{sec.label}</div>
                <div style={{fontSize:11,color:CC.muted,marginTop:2}}>{sec.sub}</div>
              </div>
              <div style={{flex:1,height:1,background:dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)",marginLeft:4}}/>
              <button onClick={()=>setPage(sec.items[0].page)} className="ba-btn"
                style={{
                  fontSize:11,fontWeight:700,color:sec.accent,flexShrink:0,
                  background:`${sec.accent}12`,border:`1px solid ${sec.accent}25`,
                  padding:"5px 12px",borderRadius:20
                }}>Xem tất cả →</button>
            </div>

            {/* Cards */}
            <div style={{
              display:"grid",
              gridTemplateColumns:sec.items.length===2
                ?isMob?"1fr":"1fr 1fr"
                :`repeat(${Math.min(cols,3)},1fr)`,
              gap:isMob?10:14
            }}>
              {sec.items.map((f,i)=>(
                <div key={i} onClick={()=>setPage(f.page)} className="ba-card"
                  style={{
                    padding:isMob?"14px":"18px 20px",
                    cursor:"pointer",overflow:"hidden",
                    border:dark?`1.5px solid rgba(255,255,255,0.07)`:`1.5px solid rgba(0,0,0,0.05)`,
                    background:dark
                      ?"linear-gradient(145deg,rgba(17,24,39,0.95),rgba(15,23,42,0.90))"
                      :"linear-gradient(145deg,#ffffff,#f8faff)"
                  }}>
                  {/* Top accent line */}
                  <div style={{
                    position:"absolute",top:0,left:0,right:0,height:2,
                    background:`linear-gradient(90deg,${f.color},transparent)`,
                    borderRadius:"24px 24px 0 0"
                  }}/>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    {/* Icon */}
                    <div style={{
                      width:40,height:40,borderRadius:11,flexShrink:0,
                      background:`${f.color}15`,border:`1.5px solid ${f.color}25`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:20
                    }}>{f.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:800,fontSize:isMob?12:13,color:CC.text}}>{f.title}</span>
                        <span style={{
                          fontSize:9,fontWeight:700,color:f.color,
                          background:`${f.color}14`,border:`1px solid ${f.color}22`,
                          borderRadius:20,padding:"1px 7px"
                        }}>{f.tag}</span>
                      </div>
                      <div style={{color:CC.muted,fontSize:isMob?10:11,lineHeight:1.5}}>{f.desc}</div>
                    </div>
                  </div>
                  <div style={{marginTop:10,display:"flex",alignItems:"center",gap:4,color:f.color,fontSize:10,fontWeight:800,letterSpacing:"0.02em"}}>
                    <span>Bắt đầu</span><span style={{fontSize:12}}>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════ CHUYÊN NGÀNH BOX ══════════ */}
      {(() => {
        const specializedDecks = [
          { value:"💻 IT",         label:"Công nghệ IT",          desc:`${VOCAB_IT.length} từ · Lập trình, DevOps, QA`,           icon:"💻", color:"#38BDF8" },
          { value:"🍳 Đầu bếp",    label:"Đầu bếp & Nhà hàng",   desc:`${VOCAB_RESTAURANT.length} từ · Bếp, phục vụ, khách sạn`, icon:"🍳", color:"#F59E0B" },
          { value:"⚙️ Kỹ sư",      label:"Kỹ sư & Cơ khí",       desc:`${VOCAB_ENGINEERING.length} từ · Cơ khí, điện, chế tạo`,  icon:"⚙️", color:"#10B981" },
          { value:"💼 Kinh doanh", label:"Kinh doanh",            desc:`${VOCAB_BUSINESS.length} từ · Thương mại, văn phòng`,     icon:"💼", color:"#8B5CF6" },
          { value:"🏥 Y tế",       label:"Y tế & Điều dưỡng",    desc:`${VOCAB_MEDICAL.length} từ · Bệnh viện, kaigo`,           icon:"🏥", color:"#EC4899" },
          { value:"🏗️ Xây dựng",   label:"Xây dựng & Kiến trúc", desc:`${VOCAB_CONSTRUCTION.length} từ · Công trình, vật liệu`,  icon:"🏗️", color:"#F97316" },
          { value:"🌾 Nông nghiệp", label:"Nông nghiệp",          desc:`${VOCAB_AGRICULTURE.length} từ · Trồng trọt, chế biến`,  icon:"🌾", color:"#84CC16" },
        ];
        return (
          <div style={{maxWidth:1100,margin:"0 auto 40px",padding:isMob?"0 16px":"0 24px"}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{
                width:36,height:36,borderRadius:10,flexShrink:0,
                background:"linear-gradient(135deg,#F9731622,#F9731644)",
                border:"1.5px solid #F9731630",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,boxShadow:"0 2px 10px #F9731620"
              }}>💼</div>
              <div>
                <div style={{fontWeight:900,fontSize:isMob?15:17,color:CC.text,lineHeight:1}}>Từ Vựng Chuyên Ngành</div>
                <div style={{fontSize:11,color:CC.muted,marginTop:2}}>7 ngành nghề · Nhật ngữ đi làm thực tế</div>
              </div>
              <div style={{flex:1,height:1,background:dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)",marginLeft:4}}/>
              <button onClick={()=>setPage("vocab")} className="ba-btn"
                style={{
                  fontSize:11,fontWeight:700,color:"#F97316",flexShrink:0,
                  background:"#F9731612",border:"1px solid #F9731625",
                  padding:"5px 12px",borderRadius:20
                }}>Xem tất cả →</button>
            </div>

            {/* Rectangle box */}
            <div style={{
              background:dark
                ?"linear-gradient(145deg,rgba(15,23,42,0.95),rgba(30,41,59,0.92))"
                :"linear-gradient(145deg,#ffffff,#f8faff)",
              border:dark?"1.5px solid rgba(249,115,22,0.22)":"1.5px solid rgba(249,115,22,0.18)",
              borderRadius:20,
              boxShadow:dark
                ?"0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(249,115,22,0.1)"
                :"0 8px 32px rgba(249,115,22,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              overflow:"hidden",
              position:"relative"
            }}>
              {/* Top accent bar */}
              <div style={{
                height:3,
                background:"linear-gradient(90deg,#F97316,#F59E0B,#84CC16,#10B981,#38BDF8,#8B5CF6,#EC4899)",
              }}/>

              {/* Inner label */}
              <div style={{
                padding:isMob?"14px 16px 4px":"16px 20px 4px",
                display:"flex",alignItems:"center",gap:8
              }}>
                <span style={{fontSize:10,fontWeight:800,color:dark?"rgba(249,115,22,0.8)":"#F97316",letterSpacing:"0.1em"}}>
                  💼 TỪ VỰNG NGHỀ NGHIỆP — NHẬT NGỮ ĐI LÀM
                </span>
                <div style={{flex:1,height:1,background:dark?"rgba(249,115,22,0.15)":"rgba(249,115,22,0.12)"}}/>
                <span style={{fontSize:10,color:CC.muted,fontWeight:600}}>
                  {VOCAB_IT.length+VOCAB_RESTAURANT.length+VOCAB_ENGINEERING.length+VOCAB_BUSINESS.length+VOCAB_MEDICAL.length+VOCAB_CONSTRUCTION.length+VOCAB_AGRICULTURE.length} từ
                </span>
              </div>

              {/* Grid of specialty cards */}
              <div style={{
                display:"grid",
                gridTemplateColumns:isMob?"1fr 1fr":isTab?"repeat(3,1fr)":"repeat(4,1fr)",
                gap:isMob?10:12,
                padding:isMob?"12px 16px 16px":"14px 20px 20px"
              }}>
                {specializedDecks.map((deck,i)=>(
                  <div key={i}
                    onClick={()=>setPage("vocab",deck.value)}
                    className="ba-btn"
                    style={{
                      display:"flex",flexDirection:"column",gap:6,
                      padding:isMob?"12px 12px":"14px 16px",
                      background:dark?`${deck.color}10`:`${deck.color}08`,
                      border:`1.5px solid ${deck.color}30`,
                      borderRadius:14,cursor:"pointer",
                      transition:"all 0.18s ease",
                      position:"relative",overflow:"hidden"
                    }}
                    onMouseEnter={e=>{
                      e.currentTarget.style.background=dark?`${deck.color}20`:`${deck.color}15`;
                      e.currentTarget.style.borderColor=`${deck.color}60`;
                      e.currentTarget.style.transform="translateY(-2px)";
                      e.currentTarget.style.boxShadow=`0 6px 20px ${deck.color}25`;
                    }}
                    onMouseLeave={e=>{
                      e.currentTarget.style.background=dark?`${deck.color}10`:`${deck.color}08`;
                      e.currentTarget.style.borderColor=`${deck.color}30`;
                      e.currentTarget.style.transform="translateY(0)";
                      e.currentTarget.style.boxShadow="none";
                    }}
                  >
                    {/* Left accent stripe */}
                    <div style={{position:"absolute",left:0,top:8,bottom:8,width:3,borderRadius:99,background:deck.color}}/>
                    <div style={{display:"flex",alignItems:"center",gap:8,paddingLeft:8}}>
                      <span style={{
                        width:32,height:32,borderRadius:9,flexShrink:0,
                        background:`${deck.color}20`,border:`1.5px solid ${deck.color}35`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:16
                      }}>{deck.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{
                          fontSize:isMob?11:12,fontWeight:800,
                          color:dark?"#F1F5F9":CC.text,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                        }}>{deck.label}</div>
                        <div style={{
                          fontSize:isMob?9:10,color:CC.muted,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                          marginTop:1
                        }}>{deck.desc}</div>
                      </div>
                    </div>
                    <div style={{
                      paddingLeft:8,
                      display:"flex",alignItems:"center",gap:4,
                      color:deck.color,fontSize:9,fontWeight:800,letterSpacing:"0.03em"
                    }}>
                      <span>Học ngay</span><span style={{fontSize:11}}>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════ CTA FINAL ══════════ */}
      <div style={{
        background:"linear-gradient(135deg,#0A0F1E,#0F2057,#0C3B72)",
        padding:isMob?"48px 20px":"72px 32px",
        textAlign:"center",position:"relative",overflow:"hidden"
      }}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:350,background:"radial-gradient(ellipse,rgba(37,99,235,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:isMob?40:52,marginBottom:12,lineHeight:1}}>🎌</div>
          <h2 style={{
            color:"white",fontSize:isMob?22:32,fontWeight:900,
            marginBottom:12,letterSpacing:"-0.02em"
          }}>
            Bắt đầu hành trình của bạn
          </h2>
          <p style={{
            color:"rgba(186,230,253,0.65)",marginBottom:32,
            fontSize:isMob?13:16,maxWidth:480,margin:"0 auto 32px",lineHeight:1.75
          }}>
            Từ N5 đến N1 — mỗi ngày một bước nhỏ sẽ tạo nên con đường lớn.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setPage("hiragana")} className="ba-btn" style={{
              background:"linear-gradient(135deg,#38BDF8,#2563EB)",
              color:"white",padding:isMob?"13px 28px":"14px 40px",
              fontSize:isMob?14:16,fontWeight:800,borderRadius:16,border:"none",
              boxShadow:"0 8px 32px rgba(37,99,235,0.5),0 0 60px rgba(56,189,248,0.15)"
            }}>🚀 Bắt Đầu Học Ngay</button>
            <button onClick={()=>setPage("flashcard")} className="ba-btn" style={{
              background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.85)",
              padding:isMob?"13px 24px":"14px 32px",fontSize:isMob?14:16,fontWeight:700,
              borderRadius:16,border:"1.5px solid rgba(255,255,255,0.15)"
            }}>🧠 Flashcard SRS</button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ════════════════════════════════════════
// ════════════════════════════════════════
// JLPT EXAM SYSTEM – injected from JLPTExam.jsx
// ════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// JLPT EXAM SYSTEM  –  N5 → N1
// Mỗi cấp: Nghe (listening) · Đọc (reading) · Ngữ pháp (grammar)
// ══════════════════════════════════════════════════════════════

const LEVELS = ["N5","N4","N3","N2","N1"];
const LEVEL_COLOR = { N5:"#22c55e", N4:"#3b82f6", N3:"#f59e0b", N2:"#ef4444", N1:"#7c3aed" };
const LEVEL_BG    = { N5:"#f0fdf4", N4:"#eff6ff", N3:"#fffbeb", N2:"#fef2f2", N1:"#f5f3ff" };
const LEVEL_DESC  = {
  N5:"Sơ cấp – Hiểu được các cụm từ cơ bản thường dùng hằng ngày",
  N4:"Sơ – Trung cấp – Hiểu được hội thoại và văn bản đơn giản",
  N3:"Trung cấp – Hiểu được tiếng Nhật trong nhiều tình huống",
  N2:"Trung – Cao cấp – Hiểu được tiếng Nhật trong hầu hết tình huống",
  N1:"Cao cấp – Hiểu được tiếng Nhật rất rộng, bao gồm cả văn phong phức tạp",
};

// ══════════════════════════════════════════════════════════════
// QUESTION BANK  (mỗi cấp: 5 ngữ pháp + 4 đọc + 4 nghe)
// ══════════════════════════════════════════════════════════════

const QUESTION_BANK = {

// ─────────────────────────── N5 ───────────────────────────────
N5: {
  grammar: [
    { id:"n5g1", q:"「わたしは がくせい（　）。」に入る助詞は？", opts:["が","は","を","です"], a:"です", exp:"〜は〜です：AはBです は「AはB」を断定するパターン。/ AはBです: mẫu khẳng định cơ bản." },
    { id:"n5g2", q:"「これは（　）ですか。」正しいのは？", opts:["なん","だれ","どこ","いつ"], a:"なん", exp:"これは何ですか → Cái này là gì? (なん = cái gì, vật thể)" },
    { id:"n5g3", q:"「まいにち がっこう（　）いきます。」", opts:["に","で","を","から"], a:"に", exp:"〜に行きます = đi đến ~. に chỉ hướng đến." },
    { id:"n5g4", q:"「りんごを みっつ（　）ください。」", opts:["×","は","も","が"], a:"×", exp:"みっつください → cho tôi 3 cái. Câu đúng: りんごを みっつください." },
    { id:"n5g5", q:"「きのう、えいがを （　）ました。」正しい動詞は？", opts:["みます","みて","み","みました"], a:"みました", exp:"きのう (hôm qua) → thì quá khứ → 〜ました." },
    { id:"n5g6", q:"「あした（　）がっこうに いきません。」時間を表す助詞は？", opts:["を","に","は","で"], a:"は", exp:"あしたは〜 → は dùng để nhấn mạnh thời gian hoặc chủ đề." },
    { id:"n5g7", q:"「これは だれ（　）ほんですか。」所有を表す助詞は？", opts:["が","の","を","に"], a:"の", exp:"〜の本 = sách của ~. の là trợ từ sở hữu." },
    { id:"n5g8", q:"「わたしは コーヒー（　）すきです。」", opts:["が","を","は","で"], a:"が", exp:"〜が好きです = thích ~. が dùng với 好き・嫌い・上手." },
  ],
  reading: [
    {
      id:"n5r1",
      passage:"わたしは やまだ たろう です。にほんじん です。まいにち がっこうに いきます。がっこうで にほんごを べんきょうします。にほんごは たのしいです。",
      passageVn:"Tôi là Yamada Taro. Tôi là người Nhật. Mỗi ngày tôi đến trường. Ở trường tôi học tiếng Nhật. Tiếng Nhật rất thú vị.",
      questions:[
        { q:"やまだたろうは まいにち どこへ いきますか？", opts:["うち","がっこう","としょかん","えき"], a:"がっこう", exp:"まいにち がっこうに いきます → hàng ngày đến trường." },
        { q:"がっこうで なにを べんきょうしますか？", opts:["えいご","ちゅうごくご","にほんご","すうがく"], a:"にほんご", exp:"がっこうで にほんごを べんきょうします." },
        { q:"にほんごは どうですか？", opts:["むずかしい","たのしい","つまらない","やさしい"], a:"たのしい", exp:"にほんごは たのしいです." },
      ]
    },
    {
      id:"n5r2",
      passage:"きょうは どようびです。はれです。わたしは ともだちと こうえんで あそびます。こうえんに はなが たくさん あります。きれいです。",
      passageVn:"Hôm nay là thứ Bảy. Trời nắng. Tôi chơi cùng bạn bè ở công viên. Trong công viên có rất nhiều hoa. Đẹp lắm.",
      questions:[
        { q:"きょうは なんようびですか？", opts:["にちようび","どようび","きんようび","もくようび"], a:"どようび", exp:"きょうは どようびです." },
        { q:"てんきは どうですか？", opts:["あめ","くもり","はれ","ゆき"], a:"はれ", exp:"はれです = trời nắng." },
        { q:"こうえんに なにが たくさん ありますか？", opts:["き","はな","みず","とり"], a:"はな", exp:"こうえんに はなが たくさん あります." },
      ]
    },
  ],
  listening: [
    { id:"n5l1", text:"もしもし、たなかさんですか。はい、そうです。いまどこですか。えきのまえにいます。", ttsText:"もしもし、たなかさんですか。はい、そうです。いまどこですか。えきのまえにいます。", question:"たなかさんはいまどこにいますか？", opts:["えきのなか","えきのまえ","うち","がっこう"], a:"えきのまえ", exp:"えきのまえにいます = đứng trước ga." },
    { id:"n5l2", text:"すみません、トイレはどこですか。あそこです。みぎに まがって、ひだりです。", ttsText:"すみません、トイレはどこですか。あそこです。みぎに まがって、ひだりです。", question:"トイレはどこですか？", opts:["まっすぐ","みぎ","ひだり","うしろ"], a:"ひだり", exp:"みぎに まがって、ひだりです → rẽ phải rồi bên trái." },
    { id:"n5l3", text:"なにをたべますか。すしをたべます。のみものはなんにしますか。みずをください。", ttsText:"なにをたべますか。すしをたべます。のみものはなんにしますか。みずをください。", question:"のみものはなにをたのみましたか？", opts:["おちゃ","コーヒー","みず","ジュース"], a:"みず", exp:"みずをください = cho tôi nước." },
    { id:"n5l4", text:"あしたのてんきはどうですか。あめがふるでしょう。そうですか。かさをもっていきます。", ttsText:"あしたのてんきはどうですか。あめがふるでしょう。そうですか。かさをもっていきます。", question:"あしたのてんきはどうですか？", opts:["はれ","くもり","あめ","ゆき"], a:"あめ", exp:"あめがふるでしょう = trời có thể mưa." },
  ],
},

// ─────────────────────────── N4 ───────────────────────────────
N4: {
  grammar: [
    { id:"n4g1", q:"「もっと早く（　）よかったのに。」", opts:["来れば","来たら","来て","来ると"], a:"来れば", exp:"〜ば良かった = giá mà ~ (hối tiếc)." },
    { id:"n4g2", q:"「この映画は子供（　）見られません。」", opts:["しか","だけ","には","でも"], a:"には", exp:"子供には見られない = trẻ em không được xem." },
    { id:"n4g3", q:"「雨が（　）、試合は中止になります。」", opts:["降れば","降ったら","降ると","降って"], a:"降ったら", exp:"〜たら: điều kiện giả định; nếu trời mưa thì hủy trận đấu." },
    { id:"n4g4", q:"「先生に作文を（　）もらいました。」", opts:["なおして","なおす","なおした","なおし"], a:"なおして", exp:"〜てもらう = nhờ ai đó làm gì cho mình." },
    { id:"n4g5", q:"「この問題は難し（　）、わかりません。」", opts:["すぎて","すぎ","すぎる","すぎた"], a:"すぎて", exp:"〜すぎて = quá ~ (đến mức). Nối câu bằng て形." },
    { id:"n4g6", q:"「日本語が話せる（　）になりました。」", opts:["こと","よう","もの","ため"], a:"よう", exp:"〜ようになる = (dần dần) trở nên có thể ~." },
    { id:"n4g7", q:"「田中さんは今、東京（　）そうです。」", opts:["らしい","だ","に住んで","に住んでいる"], a:"に住んでいる", exp:"〜そうです (伝聞) = nghe nói rằng ~." },
    { id:"n4g8", q:"「部屋を（　）から、出かけましょう。」", opts:["そうじして","そうじする","そうじした","そうじすれば"], a:"そうじして", exp:"〜てから = sau khi ~ thì. て形 + から." },
  ],
  reading: [
    {
      id:"n4r1",
      passage:"先週、家族と山に登りました。天気がよくて、頂上からの景色はとてもきれいでした。帰り道は足が痛かったですが、また行きたいと思います。山登りは体にもいいですし、気持ちもすっきりします。",
      passageVn:"Tuần trước tôi leo núi cùng gia đình. Thời tiết đẹp và cảnh từ đỉnh núi rất tuyệt. Trên đường về chân đau nhưng tôi muốn đi lại. Leo núi tốt cho sức khỏe và cũng giúp tinh thần sảng khoái.",
      questions:[
        { q:"先週、何をしましたか？", opts:["海に行った","山に登った","映画を見た","買い物をした"], a:"山に登った", exp:"先週、家族と山に登りました." },
        { q:"帰り道はどうでしたか？", opts:["楽しかった","天気が悪かった","足が痛かった","迷子になった"], a:"足が痛かった", exp:"帰り道は足が痛かった." },
        { q:"山登りの効果として書かれていないものは？", opts:["体にいい","気持ちがすっきりする","お金がかからない","景色がきれい"], a:"お金がかからない", exp:"本文にはお金についての言及がない." },
      ]
    },
    {
      id:"n4r2",
      passage:"お知らせ：来月から図書館の開館時間が変わります。平日は午前9時から午後8時まで、土日は午前10時から午後5時までです。月曜日は休館日です。ご利用の際はご注意ください。",
      passageVn:"Thông báo: Từ tháng tới giờ mở cửa thư viện thay đổi. Ngày thường từ 9:00 đến 20:00, thứ Bảy và Chủ nhật từ 10:00 đến 17:00. Thứ Hai là ngày nghỉ. Xin lưu ý khi sử dụng.",
      questions:[
        { q:"平日の開館時間は何時から何時までですか？", opts:["8時〜5時","9時〜8時","10時〜5時","9時〜5時"], a:"9時〜8時", exp:"平日は午前9時から午後8時まで." },
        { q:"図書館が休みの日はいつですか？", opts:["土曜日","日曜日","月曜日","火曜日"], a:"月曜日", exp:"月曜日は休館日です." },
        { q:"土日の閉館時間は何時ですか？", opts:["午後4時","午後5時","午後6時","午後8時"], a:"午後5時", exp:"土日は午後5時まで." },
      ]
    },
  ],
  listening: [
    { id:"n4l1", text:"山田さん、明日の会議は何時から始まりますか。午後2時からです。場所はどこですか。3階の会議室です。わかりました、ありがとうございます。", ttsText:"山田さん、明日の会議は何時から始まりますか。午後2時からです。場所はどこですか。3階の会議室です。", question:"会議はどこで行われますか？", opts:["1階","2階","3階","4階"], a:"3階", exp:"3階の会議室です." },
    { id:"n4l2", text:"すみません、この電車は新宿に止まりますか。いいえ、この電車は急行ですので、新宿には止まりません。次の各駅停車に乗ってください。", ttsText:"すみません、この電車は新宿に止まりますか。いいえ、急行ですので新宿には止まりません。次の各駅停車に乗ってください。", question:"新宿に行くにはどうすればいいですか？", opts:["この電車に乗る","次の急行に乗る","次の各駅停車に乗る","バスに乗る"], a:"次の各駅停車に乗る", exp:"次の各駅停車に乗ってください." },
    { id:"n4l3", text:"田中さん、風邪はよくなりましたか。おかげさまで、だいぶよくなりました。でも、まだ少し咳が出ます。それは大変でしたね。早くよくなるといいですね。", ttsText:"田中さん、風邪はよくなりましたか。おかげさまでだいぶよくなりましたが、まだ少し咳が出ます。", question:"田中さんの体の状態はどうですか？", opts:["完全に回復した","まだ全然よくない","だいぶよくなったが咳がある","入院している"], a:"だいぶよくなったが咳がある", exp:"だいぶよくなりましたが、まだ少し咳が出ます." },
    { id:"n4l4", text:"レストランの予約をしたいのですが。何名様でしょうか。4名です。何日のご予約ですか。土曜日の夜7時をお願いします。かしこまりました。", ttsText:"レストランの予約をしたいのですが。何名様でしょうか。4名です。土曜日の夜7時をお願いします。かしこまりました。", question:"何人で予約しましたか？", opts:["2名","3名","4名","5名"], a:"4名", exp:"4名です." },
  ],
},

// ─────────────────────────── N3 ───────────────────────────────
N3: {
  grammar: [
    { id:"n3g1", q:"「試験に合格する（　）、毎日勉強しています。」", opts:["ために","ように","から","ので"], a:"ために", exp:"〜ために = để (mục đích). Chủ ngữ câu chính và phụ giống nhau." },
    { id:"n3g2", q:"「彼女は歌手（　）有名です。」", opts:["として","にとって","において","に対して"], a:"として", exp:"〜として = với tư cách là, trong vai trò là." },
    { id:"n3g3", q:"「この映画は見れば見る（　）おもしろい。」", opts:["ほど","だけ","ほうが","くらい"], a:"ほど", exp:"〜ば〜ほど = càng ~ càng ~." },
    { id:"n3g4", q:"「彼は病気（　）、学校に来た。」", opts:["にもかかわらず","なので","だから","ために"], a:"にもかかわらず", exp:"〜にもかかわらず = mặc dù ~, bất chấp ~." },
    { id:"n3g5", q:"「知らない（　）、聞いてみましょう。」", opts:["ながら","ままで","わけには","としても"], a:"としても", exp:"〜としても = dù (cho) là ~." },
    { id:"n3g6", q:"「彼女は泣き（　）話してくれた。」", opts:["ながら","つつ","ながらも","たまま"], a:"ながら", exp:"〜ながら = vừa ~ vừa ~ (cùng lúc 2 hành động)." },
    { id:"n3g7", q:"「この問題は難し（　）解けない。」", opts:["すぎて","あまり","くて","ほど"], a:"すぎて", exp:"〜すぎて〜ない = quá ~ đến mức không thể ~." },
    { id:"n3g8", q:"「先生に（　）、やっとわかりました。」", opts:["説明してもらって","説明されて","説明してあげて","説明させて"], a:"説明してもらって", exp:"〜てもらう = được (ai đó) làm cho mình." },
  ],
  reading: [
    {
      id:"n3r1",
      passage:"近年、日本では「ワーケーション」という働き方が注目されています。これは「ワーク（仕事）」と「バケーション（休暇）」を合わせた言葉で、旅行先や別荘などでリモートワークをしながら休暇を楽しむスタイルです。コロナ禍でリモートワークが普及したことで、場所を選ばずに仕事ができる環境が整い、このような新しい働き方が可能になりました。",
      passageVn:"Gần đây tại Nhật, phong cách làm việc gọi là 'Workation' đang được chú ý. Đây là từ ghép từ 'Work (công việc)' và 'Vacation (kỳ nghỉ)', là phong cách vừa làm việc từ xa tại nơi du lịch hoặc nhà nghỉ vừa tận hưởng kỳ nghỉ. Do làm việc từ xa phổ biến thời COVID, môi trường làm việc không phụ thuộc vào địa điểm đã được thiết lập, khiến phong cách làm việc mới này trở nên khả thi.",
      questions:[
        { q:"「ワーケーション」とはどんな働き方ですか？", opts:["会社でする残業","旅行先でリモートワーク","週4日勤務","フリーランス"], a:"旅行先でリモートワーク", exp:"旅行先などでリモートワークをしながら休暇を楽しむスタイル." },
        { q:"ワーケーションが普及した背景として正しいのは？", opts:["給料が上がった","交通が便利になった","リモートワークが普及した","観光業が発展した"], a:"リモートワークが普及した", exp:"コロナ禍でリモートワークが普及したことで." },
        { q:"「ワーケーション」は何と何を合わせた言葉ですか？", opts:["ワークとウォーキング","ワークとバケーション","ワークとビジネス","ワークとアクション"], a:"ワークとバケーション", exp:"「ワーク（仕事）」と「バケーション（休暇）」を合わせた言葉." },
      ]
    },
    {
      id:"n3r2",
      passage:"メールを書くときに注意すべきことがあります。まず、件名は具体的でわかりやすくすることが大切です。本文は結論から書き、理由や詳細はその後に続けると読みやすくなります。また、敬語を適切に使い、丁寧な言葉遣いを心がけましょう。送信前には必ず宛先や内容を確認する習慣をつけることが重要です。",
      passageVn:"Khi viết email có những điều cần chú ý. Trước tiên, tiêu đề cần cụ thể và dễ hiểu. Nội dung nên viết kết luận trước, rồi mới viết lý do và chi tiết để dễ đọc. Ngoài ra, hãy sử dụng kính ngữ thích hợp và chú ý dùng từ lịch sự. Quan trọng là tập thói quen kiểm tra địa chỉ và nội dung trước khi gửi.",
      questions:[
        { q:"件名はどのように書くべきですか？", opts:["長く詳しく","簡単に短く","具体的でわかりやすく","必要ない"], a:"具体的でわかりやすく", exp:"件名は具体的でわかりやすくすることが大切." },
        { q:"本文を書くとき、最初に書くべき内容は？", opts:["挨拶","理由","結論","詳細"], a:"結論", exp:"本文は結論から書き…." },
        { q:"メール送信前に必ずすることは？", opts:["印刷する","宛先や内容を確認する","上司に報告する","コピーを保存する"], a:"宛先や内容を確認する", exp:"送信前には必ず宛先や内容を確認する習慣をつける." },
      ]
    },
  ],
  listening: [
    { id:"n3l1", text:"会社の会議で部長が言いました。「来月から新しいプロジェクトを始めます。担当者は山田さんと鈴木さんにお願いします。予算については来週の会議で話し合います。」", ttsText:"来月から新しいプロジェクトを始めます。担当者は山田さんと鈴木さんにお願いします。予算については来週の会議で話し合います。", question:"新しいプロジェクトの担当者は誰ですか？", opts:["部長と山田さん","山田さんと鈴木さん","鈴木さんだけ","全員"], a:"山田さんと鈴木さん", exp:"担当者は山田さんと鈴木さんにお願いします." },
    { id:"n3l2", text:"「最近、健康のために何か始めましたか。」「ええ、毎朝30分ジョギングするようにしました。最初はきつかったですが、慣れてきたら気持ちよくなりました。体重も少し減りましたよ。」", ttsText:"最近、健康のために何か始めましたか。毎朝30分ジョギングするようにしました。最初はきつかったですが、慣れてきたら気持ちよくなりました。体重も少し減りました。", question:"この人が始めたことは何ですか？", opts:["水泳","ジョギング","ヨガ","筋トレ"], a:"ジョギング", exp:"毎朝30分ジョギングするようにしました." },
    { id:"n3l3", text:"「旅行の計画を立てているんですが、京都か大阪、どちらがおすすめですか。」「歴史や文化に興味があるなら京都、食べ物や買い物なら大阪がいいですよ。両方行けるといいですね。」", ttsText:"京都か大阪どちらがおすすめですか。歴史や文化に興味があるなら京都、食べ物や買い物なら大阪がいいですよ。", question:"食べ物や買い物が目的なら、どこがおすすめですか？", opts:["京都","大阪","東京","奈良"], a:"大阪", exp:"食べ物や買い物なら大阪がいいですよ." },
    { id:"n3l4", text:"「すみません、この電車は渋谷に止まりますか。」「はい、次の次の駅です。ただ、朝のラッシュ時は大変込んでいますので、一本後の電車にされた方がいいかもしれません。」", ttsText:"この電車は渋谷に止まりますか。次の次の駅です。朝のラッシュ時は大変込んでいますので、一本後の電車にされた方がいいかもしれません。", question:"渋谷は何番目の駅ですか？", opts:["次の駅","次の次の駅","3つ先の駅","終点"], a:"次の次の駅", exp:"次の次の駅です." },
  ],
},

// ─────────────────────────── N2 ───────────────────────────────
N2: {
  grammar: [
    { id:"n2g1", q:"「計画通りに進まなかった（　）、結果はよかった。」", opts:["にしても","ものの","からには","わりに"], a:"ものの", exp:"〜ものの = mặc dù ~, tuy nhiên ~ (tương phản)." },
    { id:"n2g2", q:"「彼女の演技は（　）涙が出るほど感動的だった。」", opts:["見るたびに","見るにつれ","見るや否や","見るとは"], a:"見るたびに", exp:"〜たびに = mỗi khi ~." },
    { id:"n2g3", q:"「その噂は（　）事実ではない。」", opts:["必ずしも","絶対に","きっと","たしかに"], a:"必ずしも", exp:"必ずしも〜ない = không nhất thiết là ~." },
    { id:"n2g4", q:"「彼は体調が悪い（　）、無理をしている。」", opts:["にもかかわらず","ものだから","せいで","ために"], a:"にもかかわらず", exp:"〜にもかかわらず = mặc dù ~, bất chấp ~." },
    { id:"n2g5", q:"「詳しいことは担当者に（　）ください。」", opts:["お問い合わせ","問い合わせて","問い合わせ","お問い合わせして"], a:"お問い合わせ", exp:"お問い合わせください = kính mời liên hệ. Mẫu lịch sự." },
    { id:"n2g6", q:"「こんな難しい問題が解けた（　）、さすがだ。」", opts:["とは","だけあって","ものの","どころか"], a:"とは", exp:"〜とは = thật là ~! (cảm thán, ngạc nhiên)." },
    { id:"n2g7", q:"「時間が経つ（　）、悲しみも薄れてきた。」", opts:["につれて","にかけて","において","に対して"], a:"につれて", exp:"〜につれて = theo đà ~, khi ~ (thay đổi đồng thời)." },
    { id:"n2g8", q:"「彼が来ない（　）、会議を始めましょう。」", opts:["以上","ものなら","からには","限り"], a:"以上", exp:"〜以上（は）= đã ~, thì phải ~. (vì đã quyết định, nên...)" },
  ],
  reading: [
    {
      id:"n2r1",
      passage:"人工知能（AI）の発展により、私たちの生活は大きく変わりつつあります。医療分野では、AIが病気の診断を補助し、早期発見に貢献しています。教育では個別最適化された学習体験が提供され、各自のペースで学べるようになりました。一方で、AIの普及により、多くの職業が自動化されるリスクも指摘されています。人間とAIの共存について、社会全体で考えていく必要があります。",
      passageVn:"Nhờ sự phát triển của trí tuệ nhân tạo (AI), cuộc sống chúng ta đang thay đổi lớn. Trong y tế, AI hỗ trợ chẩn đoán bệnh, đóng góp vào việc phát hiện sớm. Trong giáo dục, trải nghiệm học tập được tối ưu hóa cá nhân được cung cấp, cho phép học theo nhịp độ của mỗi người. Mặt khác, cũng có ý kiến chỉ ra rủi ro nhiều nghề nghiệp sẽ bị tự động hóa do AI phổ biến. Cần suy nghĩ toàn xã hội về sự chung sống giữa con người và AI.",
      questions:[
        { q:"医療分野でのAIの役割は何ですか？", opts:["手術を行う","診断の補助と早期発見","薬を調合する","患者の相談に乗る"], a:"診断の補助と早期発見", exp:"AIが病気の診断を補助し、早期発見に貢献." },
        { q:"教育分野のAI活用として書かれていることは？", opts:["教師の代わりをする","宿題を自動採点する","個別最適化された学習","試験問題を作る"], a:"個別最適化された学習", exp:"個別最適化された学習体験が提供." },
        { q:"AIの普及に関するリスクとして挙げられているのは？", opts:["個人情報漏洩","電力消費の増加","職業の自動化","プライバシーの侵害"], a:"職業の自動化", exp:"多くの職業が自動化されるリスク." },
      ]
    },
    {
      id:"n2r2",
      passage:"「持続可能な開発目標（SDGs）」は、2015年に国連で採択された17の目標からなる国際的な取り組みです。貧困撲滅、気候変動対策、ジェンダー平等など、地球規模の問題に対処するために設定されました。2030年までの達成を目指しており、各国政府だけでなく、企業や個人にも積極的な参加が求められています。日本でも多くの企業がSDGsへの取り組みを事業戦略に組み込んでいます。",
      passageVn:"'Mục tiêu Phát triển Bền vững (SDGs)' là nỗ lực quốc tế gồm 17 mục tiêu được thông qua tại Liên Hợp Quốc năm 2015. Được đặt ra để giải quyết các vấn đề toàn cầu như xóa đói giảm nghèo, ứng phó biến đổi khí hậu, bình đẳng giới. Hướng tới đạt được vào năm 2030, không chỉ chính phủ các nước mà cả doanh nghiệp và cá nhân cũng được yêu cầu tham gia tích cực.",
      questions:[
        { q:"SDGsはいつ採択されましたか？", opts:["2010年","2015年","2020年","2025年"], a:"2015年", exp:"2015年に国連で採択されました." },
        { q:"SDGsの目標数はいくつですか？", opts:["10","15","17","20"], a:"17", exp:"17の目標からなる." },
        { q:"SDGsの達成目標年は？", opts:["2025年","2030年","2035年","2040年"], a:"2030年", exp:"2030年までの達成を目指しており." },
      ]
    },
  ],
  listening: [
    { id:"n2l1", text:"「会社の売上が前年比20%増加したことを受けて、来年度は新規事業への投資を拡大する方針です。具体的には、海外市場への展開と、デジタル化の推進を重点課題とします。」", ttsText:"会社の売上が前年比20%増加したことを受けて、来年度は新規事業への投資を拡大します。海外市場への展開とデジタル化の推進を重点課題とします。", question:"来年度の重点課題として挙げられていないものは？", opts:["海外市場への展開","デジタル化の推進","人材の確保","新規事業への投資"], a:"人材の確保", exp:"本文に人材確保の言及はない." },
    { id:"n2l2", text:"「環境問題への取り組みとして、当社では今年からペーパーレス化を推進しています。また、社員の通勤に電動自転車の利用を奨励し、補助金制度も設けました。これらの取り組みにより、昨年比でCO2排出量を15%削減することができました。」", ttsText:"当社では今年からペーパーレス化を推進し、電動自転車の利用を奨励、補助金制度も設けました。昨年比でCO2排出量を15%削減することができました。", question:"CO2排出量はどれだけ削減されましたか？", opts:["10%","15%","20%","25%"], a:"15%", exp:"昨年比でCO2排出量を15%削減." },
    { id:"n2l3", text:"「最新の調査によると、日本の若者の読書時間が年々減少しているそうです。スマートフォンやSNSの普及が主な原因とされており、特に20代では1ヶ月に1冊も本を読まない人が半数を超えているとのことです。」", ttsText:"日本の若者の読書時間が年々減少しているそうです。スマートフォンやSNSの普及が主な原因で、20代では1ヶ月に1冊も本を読まない人が半数を超えています。", question:"読書時間が減少している主な原因は何ですか？", opts:["本が高い","図書館が減った","スマートフォンやSNSの普及","仕事が忙しい"], a:"スマートフォンやSNSの普及", exp:"スマートフォンやSNSの普及が主な原因." },
    { id:"n2l4", text:"「先日、気候変動に関する国際会議が開催されました。各国の代表が2050年までにアーボンニュートラルを達成するという目標を再確認し、再生可能エネルギーへの転換を加速させることで合意しました。」", ttsText:"気候変動に関する国際会議で、各国の代表が2050年までにアーボンニュートラルを達成するという目標を再確認し、再生可能エネルギーへの転換を加速させることで合意しました。", question:"国際会議で合意された内容は何ですか？", opts:["核エネルギーの廃止","再生可能エネルギーへの転換加速","石炭の全面禁止","各国の排出量上限設定"], a:"再生可能エネルギーへの転換加速", exp:"再生可能エネルギーへの転換を加速させることで合意." },
  ],
},

// ─────────────────────────── N1 ───────────────────────────────
N1: {
  grammar: [
    { id:"n1g1", q:"「その映画は見る（　）、感動せずにはいられない。」", opts:["たびに","につけ","にあたり","からには"], a:"につけ", exp:"〜につけ = mỗi khi ~, không thể không ~ (cảm xúc tự nhiên nảy sinh)." },
    { id:"n1g2", q:"「難しい問題（　）、専門家でも解けないことがある。」", opts:["とあって","とあれば","ともなると","とはいえ"], a:"ともなると", exp:"〜ともなると = khi đạt đến mức ~, đã là ~ thì." },
    { id:"n1g3", q:"「彼女の努力（　）、今の成功がある。」", opts:["ゆえに","あってこそ","にして","をもって"], a:"あってこそ", exp:"〜あってこそ = chính nhờ có ~ mà. Nhấn mạnh điều kiện thiết yếu." },
    { id:"n1g4", q:"「彼は自分の非を認め（　）、謝罪した。」", opts:["た上で","つつ","ながら","うえに"], a:"つつ", exp:"〜つつ = vừa ~, trong khi ~ (hành động song song, hoặc mâu thuẫn nội tâm)." },
    { id:"n1g5", q:"「一度始めた（　）、途中でやめるわけにはいかない。」", opts:["以上","からには","上は","ものの"], a:"上は", exp:"〜上は = đã ~ rồi, thì phải ~. Nhấn mạnh quyết tâm hơn からには." },
    { id:"n1g6", q:"「その発言は誤解を招き（　）だった。」", opts:["かねない","がちな","やすい","そうな"], a:"かねない", exp:"〜かねない = có thể dẫn đến ~, không loại trừ khả năng ~ (tiêu cực)." },
    { id:"n1g7", q:"「長年の研究の（　）、新薬が開発された。」", opts:["すえに","あげく","あまり","ところに"], a:"すえに", exp:"〜すえに = sau khi trải qua ~, cuối cùng ~ (kết quả sau quá trình dài)." },
    { id:"n1g8", q:"「その国では宗教（　）、食べ物のタブーがある。」", opts:["いかんで","にかかわらず","をめぐって","によっては"], a:"によっては", exp:"〜によっては = tùy theo ~, trường hợp thì ~." },
  ],
  reading: [
    {
      id:"n1r1",
      passage:"哲学者のハンナ・アーレントは、「考えることのできない悪」について論じた。彼女はナチスの官僚アイヒマンを観察し、彼が特別な悪意を持った怪物ではなく、ただ「思考しない」ことによって大量虐殺に加担した普通の人間であると結論づけた。これを「悪の陳腐さ」と呼んだ。この概念は、組織の命令に従うだけで自ら考えることをやめた時、人はどれほど恐ろしい行為に加担しうるかを警告している。",
      passageVn:"Triết gia Hannah Arendt đã luận về 'cái ác không thể suy nghĩ'. Bà quan sát quan chức Nazi Eichmann và kết luận rằng ông ta không phải là quái vật với ác ý đặc biệt, mà là người bình thường đã tham gia vào cuộc thảm sát đơn giản vì 'không suy nghĩ'. Bà gọi điều này là 'sự tầm thường của cái ác'. Khái niệm này cảnh báo rằng khi con người chỉ tuân theo lệnh của tổ chức mà ngừng tự suy nghĩ, họ có thể tham gia vào những hành động đáng sợ đến mức nào.",
      questions:[
        { q:"アーレントがアイヒマンについて下した結論は何ですか？", opts:["生まれつきの悪人","普通の人間が思考しないことで悪に加担した","精神的な病気を持っていた","組織に強制された"], a:"普通の人間が思考しないことで悪に加担した", exp:"ただ「思考しない」ことによって大量虐殺に加担した普通の人間." },
        { q:"「悪の陳腐さ」という概念が警告していることは何ですか？", opts:["組織への服従の重要性","思考放棄が恐ろしい行為への加担につながること","悪の人間は見分けられること","政治体制の危険性"], a:"思考放棄が恐ろしい行為への加担につながること", exp:"自ら考えることをやめた時、人はどれほど恐ろしい行為に加担しうるかを警告." },
        { q:"本文のテーマとして最も適切なものは？", opts:["ナチスの歴史","官僚制度の問題","思考することの倫理的重要性","アーレントの生涯"], a:"思考することの倫理的重要性", exp:"思考しないことが悪に加担する，という哲学的テーマ." },
      ]
    },
    {
      id:"n1r2",
      passage:"言語相対性仮説（サピア＝ウォーフ仮説）は、人々が使用する言語がその思考や世界観に影響を与えるという理論です。強い形では「言語が思考を決定する」とされますが、現在ではより穏健な「言語が思考に影響を与える」という見解が主流です。例えば、色彩語彙の多い言語話者はより細かい色の区別が得意であることが実験で示されています。この理論は多言語学習の重要性を改めて示唆しているとも言えます。",
      passageVn:"Giả thuyết tương đối ngôn ngữ (giả thuyết Sapir-Whorf) là lý thuyết cho rằng ngôn ngữ mà mọi người sử dụng ảnh hưởng đến tư duy và thế giới quan của họ. Dạng mạnh là 'ngôn ngữ quyết định tư duy', nhưng hiện nay quan điểm ôn hòa hơn 'ngôn ngữ ảnh hưởng đến tư duy' là dòng chính. Ví dụ, các thí nghiệm cho thấy người nói ngôn ngữ có từ vựng màu sắc phong phú giỏi phân biệt màu sắc tinh tế hơn.",
      questions:[
        { q:"現在主流とされているサピア＝ウォーフ仮説の見解は？", opts:["言語が思考を完全に決定する","言語は思考に全く関係ない","言語が思考に影響を与える","文化が思考を決定する"], a:"言語が思考に影響を与える", exp:"「言語が思考に影響を与える」という見解が主流." },
        { q:"色彩語彙に関する実験で示されたことは？", opts:["色盲の人が多い","色を多く知っていると色の区別が得意","全ての言語で色の認識は同じ","色の認識は文化に依存しない"], a:"色を多く知っていると色の区別が得意", exp:"色彩語彙の多い言語話者はより細かい色の区別が得意." },
        { q:"この理論が示唆することとして本文に書かれているのは？", opts:["母国語の重要性","翻訳の限界","多言語学習の重要性","単一言語政策の利点"], a:"多言語学習の重要性", exp:"この理論は多言語学習の重要性を改めて示唆." },
      ]
    },
  ],
  listening: [
    { id:"n1l1", text:"「グローバル化が進む現代において、異文化コミュニケーション能力の重要性はますます高まっています。単に語学力があるだけでなく、相手の文化的背景や価値観を理解し、敬意を持って接することが求められます。また、自文化中心主義的な視点を克服し、多様な価値観を受け入れる柔軟性も必要です。」", ttsText:"グローバル化が進む現代において、異文化コミュニケーション能力の重要性はますます高まっています。語学力だけでなく、相手の文化的背景を理解し敬意を持って接すること、また多様な価値観を受け入れる柔軟性も必要です。", question:"異文化コミュニケーションに必要なこととして述べられていないのは？", opts:["相手の文化的背景の理解","語学力","経済的知識","多様な価値観への柔軟性"], a:"経済的知識", exp:"本文に経済的知識への言及はない." },
    { id:"n1l2", text:"「量子コンピュータの実用化が現実味を帯びてきました。従来のコンピュータが0か1かという二進法で計算するのに対し、量子コンピュータは量子の重ね合わせを利用することで、従来では不可能だった並列計算を実現します。これにより、創薬や気候変動のシミュレーションなど、複雑な問題を劇的に短い時間で解くことができます。」", ttsText:"量子コンピュータの実用化が現実味を帯びてきました。従来のコンピュータが0か1で計算するのに対し、量子コンピュータは量子の重ね合わせを利用した並列計算を実現します。これにより創薬や気候変動のシミュレーションなどを劇的に短い時間で解くことができます。", question:"量子コンピュータの利点として述べられていないものは？", opts:["並列計算の実現","創薬への応用","気候変動のシミュレーション","省エネルギー化"], a:"省エネルギー化", exp:"本文に省エネへの言及はない." },
    { id:"n1l3", text:"「少子高齢化が急速に進む日本では、労働力不足を補うために、外国人労働者の受け入れを拡大する政策が進められています。しかし、単に労働力として捉えるのではなく、多文化共生社会の実現に向けて、外国人が日本社会に溶け込めるような支援体制の整備も同時に求められています。」", ttsText:"少子高齢化が急速に進む日本では、外国人労働者の受け入れを拡大する政策が進められています。しかし単に労働力として捉えるのではなく、多文化共生社会に向けた外国人への支援体制の整備も求められています。", question:"本文が主に訴えていることは何ですか？", opts:["外国人労働者の制限","少子化対策の必要性","労働力確保と多文化共生の両立","移民政策の廃止"], a:"労働力確保と多文化共生の両立", exp:"労働力の確保と支援体制の整備（多文化共生）の両方が必要と述べている." },
    { id:"n1l4", text:"「人生100年時代と言われる現代では、リアレント教育の重要性が増しています。かつては学校を卒業したら学びが終わりという考え方が主流でしたが、技術革新が速い現代では、社会人になってからも継続的に学び直すことが不可欠です。企業も社員のリスキリングに投資するようになってきています。」", ttsText:"人生100年時代と言われる現代では、リアレント教育の重要性が増しています。学校を卒業しても継続的に学び直すことが不可欠で、企業も社員のリスキリングに投資するようになってきています。", question:"「リアレント教育」とはどのような教育ですか？", opts:["幼児期からの教育","海外留学","社会人になってからの学び直し","オンライン教育"], a:"社会人になってからの学び直し", exp:"社会人になってからも継続的に学び直すこと." },
  ],
},

// ─────────────────────────── N4 ───────────────────────────────
N4: {
  grammar: [
    { id:"n4g1", q:"「もっと早く来れば（　）のに。」", opts:["よかった","よい","よくなる","いい"], a:"よかった", exp:"〜ばよかった：過去への後悔。「来ればよかった」= should have come. N4頻出。" },
    { id:"n4g2", q:"「この映画は子供（　）見られません。」", opts:["しか","だけ","には","でも"], a:"には", exp:"〜には〜できない：〜にとっては不可能という意味。「子供には見られない」= children can't watch." },
    { id:"n4g3", q:"「雨が（　）、試合は中止になります。」", opts:["降れば","降ったら","降ると","降って"], a:"降ったら", exp:"〜たら：仮定条件。「降ったら中止」= if it rains, it will be cancelled. 結果が確実な場合。" },
    { id:"n4g4", q:"「先生に（　）、この問題が解けました。」形式として正しいものは？", opts:["教えてもらって","教えてくれて","教えてあげて","教えていただいて"], a:"教えていただいて", exp:"〜ていただく：目上の人から恩恵を受ける敬語表現。先生→生徒に使うのが適切。" },
    { id:"n4g5", q:"「彼は病気（　）、学校を休んだ。」", opts:["だから","なのに","でも","なので"], a:"なので", exp:"〜なので：理由・原因を表す。「病気なので休んだ」名詞・な形容詞+なので。" },
    { id:"n4g6", q:"「もし宝くじが当たったら、何（　）したいですか。」", opts:["が","を","に","で"], a:"が", exp:"「何がしたいか」の「が」= subject marker with たい-form expressing desire." },
    { id:"n4g7", q:"「彼女は歌が上手（　）、ピアノも弾けます。」", opts:["なのに","なうえに","なのか","なため"], a:"なうえに", exp:"〜うえに：さらに加えて。「上手なうえにピアノも弾ける」= in addition to being good at singing, she can also play piano." },
    { id:"n4g8", q:"「この薬を飲めば、すぐ（　）はずです。」", opts:["よくなる","よかった","よくて","よい"], a:"よくなる", exp:"〜はずだ：当然・予定の推測。「よくなるはず」= should get better. 根拠ある推測に使う。" },
    { id:"n4g9", q:"「試験に合格（　）ために、毎日勉強しています。」", opts:["した","する","して","すれば"], a:"する", exp:"〜するために：目的を表す。辞書形+ために = in order to do ~." },
    { id:"n4g10", q:"「彼は日本語が話せる（　）、通訳もできます。」", opts:["ので","ため","だけでなく","しかし"], a:"だけでなく", exp:"〜だけでなく〜も：AだけでなくBも = not only A but also B. 追加情報を表す。" },
    { id:"n4g11", q:"「もう少し（　）くれれば、間に合ったのに。」", opts:["急いで","急いだ","急ぐ","急げば"], a:"急いで", exp:"〜てくれれば：相手が〜してくれたら、という後悔・仮定。「急いでくれれば」= if you had hurried." },
    { id:"n4g12", q:"「電車が遅れた（　）、会議に遅刻してしまいました。」", opts:["ために","ように","ことで","ものの"], a:"ために", exp:"〜ために：原因・理由(悪い結果)。動詞た形/名詞の+ために。「遅れたために遅刻した」。" },
  ],
  reading: [
    {
      id:"n4r1",
      passage:"山田さんは毎朝ジョギングをしています。健康のためだと言っていますが、実はストレス解消のためでもあるそうです。最近は友達も一緒に走るようになり、とても楽しくなってきたと話していました。運動は体だけでなく、心の健康にも大切なのですね。",
      passageVn:"Anh Yamada mỗi sáng đều chạy bộ. Anh nói là vì sức khỏe, nhưng nghe nói thực ra cũng là để giải tỏa stress. Gần đây bạn bè cũng bắt đầu cùng chạy, anh nói đã trở nên rất vui. Vận động không chỉ quan trọng cho cơ thể mà còn cho sức khỏe tinh thần.",
      questions:[
        { q:"山田さんが毎朝ジョギングをする理由は何ですか？", opts:["体の健康のためだけ","友達と会うため","健康とストレス解消のため","競技のため"], a:"健康とストレス解消のため", exp:"「健康のため」と「ストレス解消のため」の両方が書かれています。" },
        { q:"最近の変化として正しいものはどれですか？", opts:["一人で走るようになった","友達も一緒に走るようになった","朝から夜に変えた","ジョギングをやめた"], a:"友達も一緒に走るようになった", exp:"「最近は友達も一緒に走るようになり」と書かれています。" },
      ]
    },
    {
      id:"n4r2",
      passage:"日本では、春になると桜の木の下で花見をする習慣があります。家族や友達、会社の同僚などと一緒に、お弁当やお酒を持って公園に集まります。桜は一週間ほどしか咲かないため、その短い時間を大切にしようという気持ちが強いのかもしれません。「もののあわれ」という日本の美意識を感じることができます。",
      passageVn:"Ở Nhật Bản, vào mùa xuân có phong tục ngắm hoa anh đào dưới gốc cây. Mọi người cùng gia đình, bạn bè, đồng nghiệp mang cơm hộp và rượu đến tập trung ở công viên. Vì hoa anh đào chỉ nở khoảng một tuần nên có lẽ người ta muốn trân trọng khoảng thời gian ngắn ngủi đó. Bạn có thể cảm nhận được 'mono no aware' — thẩm mỹ quan của người Nhật.",
      questions:[
        { q:"花見とはどのような習慣ですか？", opts:["一人で桜を見ること","桜の下でみんなで集まること","桜の木を植えること","桜の写真を撮ること"], a:"桜の下でみんなで集まること", exp:"「桜の木の下で…公園に集まります」と書かれています。" },
        { q:"桜の花が特別な理由は何ですか？", opts:["一年中咲いているから","色がきれいだから","一週間ほどしか咲かないから","大きな木だから"], a:"一週間ほどしか咲かないから", exp:"「一週間ほどしか咲かない」その短い時間を大切にしようとしています。" },
      ]
    },
  ],
  listening: [
    { id:"n4l1", text:"「アナウンス：本日の山手線は、信号トラブルのため、渋谷駅と新宿駅の間で運転を見合わせています。復旧の見込みは午後2時ごろの予定です。お急ぎのお客様は、中央線または地下鉄をご利用ください。ご迷惑をおかけして、大変申し訳ございません。」", ttsText:"本日の山手線は、信号トラブルのため、渋谷駅と新宿駅の間で運転を見合わせています。復旧の見込みは午後2時ごろです。お急ぎのお客様は、中央線または地下鉄をご利用ください。", question:"山手線は今どのような状況ですか？", opts:["全線正常運転","渋谷〜新宿間で運転停止","全線運転停止","遅延あり"], a:"渋谷〜新宿間で運転停止", exp:"「渋谷駅と新宿駅の間で運転を見合わせています」より運転停止中。" },
    { id:"n4l2", text:"「会話：A『来週の旅行、どこに行くか決めた？』B『箱根はどうかな。温泉もあるし、富士山も見えるし。』A『いいね！でも、予算が少し心配だな。』B『大丈夫、学割があるから安く行けるよ。』A『じゃあ、箱根に決まりだね！』」", ttsText:"A：来週の旅行どこに行く？B：箱根はどうかな。温泉もあるし富士山も見えるし。A：いいね。でも予算が心配。B：学割があるから安く行けるよ。A：じゃあ箱根に決まり！", question:"2人は来週どこに行くことにしましたか？", opts:["富士山","箱根","温泉地","まだ決まっていない"], a:"箱根", exp:"「箱根に決まりだね」という最後の言葉から箱根に決定。" },
    { id:"n4l3", text:"「会話：A『田中さん、最近元気ないね。どうしたの？』B『実は、来月転勤することになったんだ。』A『えっ、本当に？どこに？』B『大阪なんだけど、家族と離れるのが一番つらくて。』A『そうか。でも、新しい経験になるよ！頑張って！』」", ttsText:"A：田中さん最近元気ないね。B：来月転勤することになった。A：どこに？B：大阪。家族と離れるのが一番つらい。A：新しい経験になるよ、頑張って！", question:"田中さんが元気がない理由は何ですか？", opts:["体の具合が悪い","仕事がうまくいかない","転勤で家族と離れることになった","友達と喧嘩した"], a:"転勤で家族と離れることになった", exp:"「家族と離れるのが一番つらくて」が理由として述べられています。" },
    { id:"n4l4", text:"「ラジオ：明日の天気予報です。関東地方は朝から雨で、午後には強い風も予想されます。気温は今日より5度ほど低くなりますので、暖かい服装でお出かけください。傘だけでなく、風に強いレインコートをお勧めします。」", ttsText:"明日の関東は朝から雨で午後は強い風も予想されます。気温は今日より5度ほど低くなります。暖かい服装で、傘だけでなく風に強いレインコートをお勧めします。", question:"明日の天気として正しいものはどれですか？", opts:["晴れ後曇り","一日中晴れ","朝から雨、午後は強風","雪が降る"], a:"朝から雨、午後は強風", exp:"「朝から雨で、午後には強い風も予想されます」と放送されています。" },
  ],
},
}; // end QUESTION_BANK

// useTTS hook (useWidth already defined above)
function useTTS() {
  const [playing, setPlaying] = useState(false);
  const speak = useCallback((text, lang="ja-JP") => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang; utt.rate = 0.82; utt.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith("ja"));
    if (jaVoice) utt.voice = jaVoice;
    utt.onstart = () => setPlaying(true);
    utt.onend = utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  }, []);
  const stop = useCallback(() => { window.speechSynthesis?.cancel(); setPlaying(false); }, []);
  return { playing, speak, stop };
}

// ══════════════════════════════════════════════════════════════
// SCORE BADGE
// ══════════════════════════════════════════════════════════════
function ScoreBadge({ correct, total, color }) {
  const pct = total ? Math.round(correct / total * 100) : 0;
  const CC  = useColors();
  const [dark] = useDarkMode();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, background:CC.dark?"rgba(30,41,59,0.8)":CC.bgCard, borderRadius:12, padding:"8px 14px", border:`1px solid ${CC.dark?"rgba(255,255,255,0.1)":"#eee"}` }}>
      <span style={{ fontWeight:900, fontSize:18, color }}>{correct}</span>
      <span style={{ color:CC.muted, fontSize:13 }}>/ {total}</span>
      <div style={{ flex:1, height:7, background:"rgba(219,234,254,0.8)", borderRadius:99, overflow:"hidden", minWidth:60, border:"1px solid rgba(56,189,248,0.1)" }}>
        <div className="ba-progress-fill" style={{ width:`${pct}%` }}/>
      </div>
      <span style={{ fontSize:12, fontWeight:700, color }}>{pct}%</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// OPTION BUTTON (shared)
// ══════════════════════════════════════════════════════════════
function OptionBtn({ text, answered, isCorrect, isSelected, onClick, color }) {
  const CC = useColors();
  const [dark] = useDarkMode();
  // Light: nền xanh đậm, chữ trắng — Dark: nền navy nhạt, chữ sáng
  let bg     = CC.dark ? "rgba(51,82,138,0.75)"  : "linear-gradient(135deg,#2563EB,#1D4ED8)";
  let border = CC.dark ? "1.5px solid rgba(140,170,240,0.7)" : "none";
  let textCol= CC.dark ? "#FFFFFF" : "#FFFFFF";
  let icon   = null;
  let shadow = CC.dark
    ? "0 2px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)"
    : "0 3px 12px rgba(37,99,235,0.35)";

  if (answered) {
    if (isCorrect) {
      bg = "linear-gradient(135deg,#ecfdf5,#d1fae5)";
      border = "2px solid #10B981"; textCol = "#065f46"; icon = "✅"; shadow = "none";
    } else if (isSelected) {
      bg = "linear-gradient(135deg,#fef2f2,#fee2e2)";
      border = "2px solid #EF4444"; textCol = "#991b1b"; icon = "❌"; shadow = "none";
    } else {
      bg     = CC.dark ? "rgba(30,41,59,0.4)"  : "rgba(37,99,235,0.08)";
      border = CC.dark ? "1.5px solid rgba(255,255,255,0.06)" : "1.5px solid rgba(37,99,235,0.2)";
      textCol= CC.muted; shadow = "none";
    }
  }
  return (
    <button onClick={onClick} disabled={answered}
      style={{ background:bg, border, color:textCol, borderRadius:16, padding:"13px 16px",
        fontSize:14, fontWeight:600, cursor:answered?"default":"pointer",
        textAlign:"left", display:"flex", alignItems:"center", gap:8, width:"100%",
        transition:"all 0.15s", boxShadow:shadow, fontFamily:"'Nunito',sans-serif" }}
      onMouseEnter={e=>{ if(!answered) e.currentTarget.style.background = CC.dark?"rgba(66,103,172,0.7)":"linear-gradient(135deg,#1D4ED8,#1E40AF)"; }}
      onMouseLeave={e=>{ if(!answered) e.currentTarget.style.background = bg; }}>
      {icon && <span style={{ fontSize:15, flexShrink:0 }}>{icon}</span>}
      <span>{text}</span>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION: GRAMMAR
// ══════════════════════════════════════════════════════════════
function GrammarSection({ level, color, onScore }) {
  const qs = QUESTION_BANK[level].grammar;
  const CC = useColors();
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const w = useWidth(); const isMob = w < 640;
  const q = qs[qIdx];

  const handleAns = (opt) => {
    if (ans) return;
    const ok = opt === q.a;
    setAns(opt);
    const r = [...results, { ok, chosen: opt, correct: q.a, exp: q.exp }];
    setResults(r);
    if (qIdx + 1 >= qs.length) {
      const sc = r.filter(x=>x.ok).length;
      onScore(sc, qs.length);
      setTimeout(() => setDone(true), 800);
    }
  };

  const next = () => { setQIdx(i => i+1); setAns(null); };
  const restart = () => { setQIdx(0); setAns(null); setResults([]); setDone(false); };

  if (done) return (
    <ResultCard results={results} total={qs.length} color={color} onRestart={restart} label="Ngữ pháp"/>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontSize:13, color:"#6b7280" }}>Câu {qIdx+1}/{qs.length}</span>
        <ProgressDots total={qs.length} current={qIdx} results={results} color={color}/>
      </div>
      <div className="ba-card" style={{ padding:isMob?"16px":"22px", marginBottom:12, background:CC.bgCard }}>
        <div style={{ fontSize:isMob?15:17, fontWeight:700, color:CC.text, marginBottom:18, lineHeight:1.6 }}>{q.q}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {q.opts.map((opt,i) => (
            <OptionBtn key={i} text={opt} answered={!!ans} isCorrect={opt===q.a} isSelected={opt===ans} onClick={()=>handleAns(opt)} color={color}/>
          ))}
        </div>
      </div>
      {ans && (
        <div>
          <div style={{ background:"linear-gradient(135deg,rgba(219,234,254,0.6),rgba(186,230,253,0.4))", border:"1px solid rgba(56,189,248,0.3)", borderRadius:16, padding:"12px 16px", fontSize:13, color:"#1e40af", marginBottom:10, lineHeight:1.6, backdropFilter:"blur(4px)" }}>
            💡 {q.exp}
          </div>
          {qIdx + 1 < qs.length && (
            <button onClick={next} style={{ width:"100%", background:color, color:"white", border:"none", padding:"12px", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Câu tiếp →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION: READING
// ══════════════════════════════════════════════════════════════
function ReadingSection({ level, color, onScore }) {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const passages = QUESTION_BANK[level].reading;
  const [pIdx, setPIdx] = useState(0);
  const [phase, setPhase] = useState("read"); // read | quiz
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [showVn, setShowVn] = useState(false);
  const w = useWidth(); const isMob = w < 640;

  const totalQ = passages.reduce((a,p)=>a+p.questions.length,0);
  const p = passages[pIdx];
  const q = p.questions[qIdx];

  const handleAns = (opt) => {
    if (ans) return;
    const ok = opt === q.a;
    setAns(opt);
    const r = [...results, { ok, chosen:opt, correct:q.a, exp:q.exp }];
    setResults(r);
    // check if all done
    const isLastQ = qIdx+1 >= p.questions.length;
    const isLastP = pIdx+1 >= passages.length;
    if (isLastQ && isLastP) {
      const sc = r.filter(x=>x.ok).length;
      onScore(sc, totalQ);
      setTimeout(()=>setDone(true), 800);
    }
  };

  const next = () => {
    if (qIdx+1 < p.questions.length) { setQIdx(i=>i+1); setAns(null); }
    else if (pIdx+1 < passages.length) { setPIdx(i=>i+1); setQIdx(0); setAns(null); setPhase("read"); setShowVn(false); }
  };

  const restart = () => { setPIdx(0); setQIdx(0); setAns(null); setResults([]); setDone(false); setPhase("read"); setShowVn(false); };

  if (done) return <ResultCard results={results} total={totalQ} color={color} onRestart={restart} label={t.jlptReading}/>;

  if (phase === "read") return (
    <div>
      <div className="ba-card" style={{ padding:isMob?"16px":"22px", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <span style={{ background:color, color:"white", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 }}>Đoạn {pIdx+1}/{passages.length}</span>
          <span style={{ fontSize:12, color:CC.muted }}>{p.questions.length} câu hỏi</span>
        </div>
        <div style={{ fontSize:isMob?14:16, lineHeight:1.9, color:CC.text, marginBottom:14, whiteSpace:"pre-wrap" }}>{p.passage}</div>
        <button onClick={()=>setShowVn(v=>!v)}
          style={{ background:CC.dark?"rgba(255,255,255,0.07)":"#f8f9fa", border:`1px solid ${CC.dark?"rgba(255,255,255,0.1)":"#e0e0e0"}`, borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", color:CC.muted, fontWeight:600 }}>
          {showVn ? "🙈 "+(t.readHideVn||"Ẩn tiếng Việt") : "🇻🇳 "+(t.readShowVn||"Xem nghĩa")}
        </button>
        {showVn && (
          <div style={{ marginTop:10, background:CC.dark?"rgba(251,191,36,0.1)":"#fffbeb", border:`1px solid ${CC.dark?"rgba(251,191,36,0.25)":"#fde68a"}`, borderRadius:10, padding:"12px 14px", fontSize:isMob?12:13, color:CC.dark?"#FDE68A":"#92400e", lineHeight:1.8 }}>
            {p.passageVn}
          </div>
        )}
      </div>
      <button onClick={()=>setPhase("quiz")}
        style={{ width:"100%", background:color, color:"white", border:"none", padding:"13px", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" }}>
        {"📝 Trả lời câu hỏi →"}
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:13, color:"#6b7280" }}>Đoạn {pIdx+1} · Câu {qIdx+1}/{p.questions.length}</span>
        <ProgressDots total={totalQ} current={results.length} results={results} color={color}/>
      </div>
      <div style={{ background:dark?"rgba(255,255,255,0.05)":"#f8f9fa", borderRadius:12, padding:"10px 14px", marginBottom:12, fontSize:12, color:dark?"#CBD5E1":"#374151", lineHeight:1.7, border:dark?"1px solid rgba(255,255,255,0.1)":"1px solid #e5e7eb" }}>
        📄 {p.passage.slice(0, 80)}…
      </div>
      <div className="ba-card" style={{ padding:isMob?"16px":"22px", marginBottom:12 }}>
        <div style={{ fontSize:isMob?14:16, fontWeight:700, color:CC.text, marginBottom:14, lineHeight:1.6 }}>{q.q}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {q.opts.map((opt,i) => (
            <OptionBtn key={i} text={opt} answered={!!ans} isCorrect={opt===q.a} isSelected={opt===ans} onClick={()=>handleAns(opt)} color={color}/>
          ))}
        </div>
      </div>
      {ans && (
        <div>
          <div style={{ background:dark?"rgba(56,189,248,0.1)":"#f0f9ff", border:dark?"1px solid rgba(56,189,248,0.3)":"1px solid #bae6fd", borderRadius:12, padding:"12px 16px", fontSize:13, color:dark?"#7DD3FC":"#0369a1", marginBottom:10 }}>
            💡 {q.exp}
          </div>
          <button onClick={next}
            style={{ width:"100%", background:color, color:"white", border:"none", padding:"12px", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer" }}>
            {qIdx+1<p.questions.length || pIdx+1<passages.length ? "Tiếp →" : "Xem kết quả"}
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SECTION: LISTENING
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// PROGRESS DOTS
// ══════════════════════════════════════════════════════════════
function ProgressDots({ total, current, results, color }) {
  return (
    <div style={{ display:"flex", gap:4, flexWrap:"wrap", justifyContent:"flex-end" }}>
      {Array.from({ length: total }).map((_,i) => {
        const r = results[i];
        return (
          <div key={i} style={{ width:10, height:10, borderRadius:"50%",
            background: r ? (r.ok ? "#22c55e" : "#ef4444") : i===current ? color : "#e5e7eb",
            transition:"background 0.3s" }}/>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RESULT CARD
// ══════════════════════════════════════════════════════════════
function ResultCard({ results, total, color, onRestart, label }) {
  const CC = useColors();
  const [dark] = useDarkMode();
  const correct = results.filter(r=>r.ok).length;
  const pct = Math.round(correct/total*100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : pct >= 40 ? "📚" : "💪";
  const msg = pct >= 80 ? "Xuất sắc!" : pct >= 60 ? "Tốt lắm!" : pct >= 40 ? "Cần ôn thêm" : "Hãy cố lên!";
  return (
    <div style={{ background:CC.bgCard, borderRadius:20, padding:24, border:`1px solid ${CC.dark?"rgba(255,255,255,0.08)":"#eee"}`, boxShadow:"0 4px 20px rgba(0,0,0,0.08)", textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:8 }}>{emoji}</div>
      <div style={{ fontSize:28, fontWeight:900, color, marginBottom:4 }}>{correct}/{total}</div>
      <div style={{ fontSize:15, fontWeight:700, color:"#374151", marginBottom:4 }}>{msg}</div>
      <div style={{ fontSize:12, color:"#9ca3af", marginBottom:16 }}>{label} · {pct}% chính xác</div>
      {/* Score bar */}
      <div style={{ height:8, background:"rgba(219,234,254,0.7)", borderRadius:99, marginBottom:16, overflow:"hidden", border:"1px solid rgba(56,189,248,0.1)" }}>
        <div className="ba-progress-fill" style={{ width:`${pct}%` }}/>
      </div>
      {/* Review */}
      <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16, textAlign:"left" }}>
        {results.map((r,i)=>(
          <div key={i} style={{ background:r.ok?"#f0fdf4":"#fef2f2", borderRadius:10, padding:"10px 14px", border:`1px solid ${r.ok?"#bbf7d0":"#fecaca"}`, fontSize:12 }}>
            <span style={{ fontWeight:700, color:r.ok?"#166534":"#991b1b" }}>{r.ok?"✅":"❌"} Câu {i+1}</span>
            {!r.ok && <span style={{ color:CC.muted }}> · Đáp án: <strong>{r.correct}</strong></span>}
            <div style={{ color:CC.muted, marginTop:2, fontSize:11 }}>💡 {r.exp}</div>
          </div>
        ))}
      </div>
      <button onClick={onRestart} style={{ background:color, color:"white", border:"none", padding:"12px 28px", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer" }}>
        {"🔄 Làm lại"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LEVEL PAGE  (1 cấp, 3 tab: ngữ pháp / đọc / nghe)
// ══════════════════════════════════════════════════════════════
function LevelPage({ level, onBack }) {
  const t = useT();
  const color = LEVEL_COLOR[level];
  const bg    = LEVEL_BG[level];
  const CC    = useColors();
  const [dark] = useDarkMode();
  const [tab, setTab] = useState("grammar");
  const [scores, setScores] = useState({ grammar:null, reading:null, listening:null });
  const [keys, setKeys] = useState({ grammar:0, reading:0, listening:0 }); // remount key
  const w = useWidth(); const isMob = w < 640;

  const updateScore = (section, correct, total) => {
    setScores(s => ({ ...s, [section]: { correct, total } }));
  };

  const TABS = [
    { id:"grammar",   icon:"📝", label:"Ngữ pháp" },
    { id:"reading",   icon:"📖", label:t.jlptReading },
  ];

  const resetTab = (id) => {
    setKeys(k => ({ ...k, [id]: k[id]+1 }));
    setScores(s => ({ ...s, [id]: null }));
  };

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"16px 12px":"32px 24px" }}>
      {/* Back */}
      <button onClick={onBack}
        style={{ background:"rgba(37,99,235,0.08)", border:"1px solid rgba(56,189,248,0.2)", color:C.primary, cursor:"pointer", fontSize:13, fontWeight:700, marginBottom:16, padding:"6px 14px", borderRadius:50, display:"flex", alignItems:"center", gap:6 }}>
        ← Chọn cấp độ
      </button>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${color} 0%,${color}dd 60%,${color}88 100%)`, borderRadius:18, padding:isMob?"18px":"24px", color:"#FFFFFF", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <div style={{ background:"rgba(255,255,255,0.25)", borderRadius:12, padding:"6px 16px", fontSize:20, fontWeight:900, color:"#FFFFFF" }}>{level}</div>
          <div>
            <div style={{ fontSize:isMob?16:20, fontWeight:800, color:"#FFFFFF"}}>Đề thi JLPT {level}</div>
            <div style={{ fontSize:isMob?11:13, color:"rgba(255,255,255,0.9)", marginTop:2 }}>{LEVEL_DESC[level]}</div>
          </div>
        </div>
        {/* Mini scoreboard */}
        <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
          {TABS.map(t => {
            const sc = scores[t.id];
            return (
              <div key={t.id} style={{ background:"rgba(255,255,255,0.18)", borderRadius:10, padding:"5px 12px", fontSize:11, fontWeight:700 }}>
                {t.icon} {t.label}: {sc ? `${sc.correct}/${sc.total}` : "—"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:CC.dark?"rgba(30,41,59,0.8)":"#f0f0f0", borderRadius:14, padding:4, marginBottom:20, gap:4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ flex:1, border:"none", borderRadius:11, padding:isMob?"10px 6px":"11px 8px",
              background:tab===t.id?CC.bgCard:"transparent",
              color:tab===t.id?CC.text:CC.muted,
              fontWeight:tab===t.id?700:500, fontSize:isMob?12:14,
              cursor:"pointer", boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,0.1)":"none",
              transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
            <span>{t.icon}</span>
            {!isMob && t.label}
            {isMob && t.label.split(" ")[0]}
            {scores[t.id] && (
              <span style={{ fontSize:10, background:color, color:"white", borderRadius:10, padding:"1px 6px", marginLeft:2 }}>
                {scores[t.id].correct}/{scores[t.id].total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Section content */}
      {tab === "grammar" && (
        <div>
          {scores.grammar && (
            <div style={{ marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <ScoreBadge correct={scores.grammar.correct} total={scores.grammar.total} color={color}/>
              <button onClick={()=>resetTab("grammar")} style={{ background:CC.dark?"rgba(255,255,255,0.07)":"#f5f5f5", border:`1px solid ${CC.dark?"rgba(255,255,255,0.1)":"#ddd"}`, borderRadius:10, padding:"6px 12px", fontSize:12, cursor:"pointer", color:CC.muted, fontWeight:600 }}>🔄 Làm lại</button>
            </div>
          )}
          <GrammarSection key={keys.grammar} level={level} color={color} onScore={(c,t)=>updateScore("grammar",c,t)}/>
        </div>
      )}
      {tab === "reading" && (
        <div>
          {scores.reading && (
            <div style={{ marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <ScoreBadge correct={scores.reading.correct} total={scores.reading.total} color={color}/>
              <button onClick={()=>resetTab("reading")} style={{ background:CC.dark?"rgba(255,255,255,0.07)":"#f5f5f5", border:`1px solid ${CC.dark?"rgba(255,255,255,0.1)":"#ddd"}`, borderRadius:10, padding:"6px 12px", fontSize:12, cursor:"pointer", color:CC.muted, fontWeight:600 }}>🔄 Làm lại</button>
            </div>
          )}
          <ReadingSection key={keys.reading} level={level} color={color} onScore={(c,t)=>updateScore("reading",c,t)}/>
        </div>
      )}

    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN: JLPT HOME  –  chọn cấp độ
// ══════════════════════════════════════════════════════════════
function JLPTExamPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [allScores, setAllScores] = useState({}); // { N5: { grammar, reading, listening } }
  const w = useWidth(); const isMob = w < 640;

  if (selectedLevel) return <LevelPage level={selectedLevel} onBack={()=>setSelectedLevel(null)}/>;

  const totalQ = (lv) => {
    const b = QUESTION_BANK[lv];
    return b.grammar.length + b.reading.reduce((a,p)=>a+p.questions.length,0) + b.listening.length;
  };

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:isMob?"16px 12px":"32px 24px" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0F172A 0%,#1E3A8A 50%,#1D4ED8 100%)", borderRadius:20, padding:isMob?"20px":"32px", color:"#FFFFFF", marginBottom:28, textAlign:"center" }}>
        <div style={{ fontSize:isMob?36:52, marginBottom:8 }}>🎌</div>
        <h1 style={{ fontSize:isMob?22:32, fontWeight:900, margin:"0 0 8px", color:"#FFFFFF" }}>{t.jlptTitle}</h1>
        <p style={{ fontSize:isMob?13:15, color:"rgba(255,255,255,0.9)", margin:"0 0 16px" }}>
          {"Luyện thi JLPT N5 · Ngân hàng đề N4 mở rộng"}<br/>{"3 phần: Ngữ pháp · Đọc hiểu · Nghe hiểu"}
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:isMob?8:16, flexWrap:"wrap" }}>
          {LEVELS.map(lv => (
            <div key={lv} style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"6px 16px", fontSize:13, fontWeight:700, color:"#FFFFFF" }}>
              {lv}: {totalQ(lv)} câu
            </div>
          ))}
        </div>
      </div>

      {/* Level cards */}
      <h2 style={{ fontWeight:800, fontSize:isMob?17:22, color:CC.text, marginBottom:16 }}>{t.jlptChooseLevel}</h2>
      <div style={{ display:"grid", gridTemplateColumns:isMob?"1fr 1fr":"repeat(5,1fr)", gap:12, marginBottom:32 }}>
        {LEVELS.map(lv => {
          const color = LEVEL_COLOR[lv];
          const bg    = LEVEL_BG[lv];
          const b     = QUESTION_BANK[lv];
          const gLen  = b.grammar.length;
          const rLen  = b.reading.reduce((a,p)=>a+p.questions.length,0);
          const lLen  = b.listening.length;
          return (
            <div key={lv} onClick={()=>setSelectedLevel(lv)} className="ba-card"
              style={{ padding:isMob?"14px 10px":"20px 14px", cursor:"pointer", textAlign:"center" }}>
              <div style={{ fontSize:isMob?28:38, fontWeight:900, color, marginBottom:6 }}>{lv}</div>
              <div style={{ fontSize:isMob?10:12, color:CC.muted, lineHeight:1.7 }}>
                📝 {gLen} ngữ pháp<br/>
                📖 {rLen} đọc<br/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Difficulty guide */}
      <div style={{ background:CC.bgCard, borderRadius:16, padding:isMob?"16px":"22px", border:`1px solid ${CC.dark?"rgba(255,255,255,0.08)":"#eee"}`, boxShadow:CC.dark?"0 2px 10px rgba(0,0,0,0.3)":"0 2px 10px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontWeight:800, fontSize:16, color:CC.text, marginBottom:14 }}>{"📊 Thang độ khó JLPT"}</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {LEVELS.map(lv => (
            <div key={lv} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ background:LEVEL_COLOR[lv], color:"white", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:800, minWidth:40, textAlign:"center" }}>{lv}</div>
              <div style={{ fontSize:13, color:CC.muted, flex:1 }}>{LEVEL_DESC[lv]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// KANJI WRITING PAGE
// ════════════════════════════════════════

// ════════════════════════════════════════
// N4 DATA: KANJI + VOCAB + GRAMMAR
// ════════════════════════════════════════
const KANJI_N4 = [
  {
    "k": "事",
    "on": "ジ・ズ",
    "kun": "こと",
    "vn": "Sự việc, Việc",
    "strokes": 8,
    "rad": "亅",
    "ex": [
      {
        "jp": "しごと",
        "vn": "công việc"
      },
      {
        "jp": "だいじ",
        "vn": "quan trọng"
      }
    ],
    "hint": "Người cầm cờ — việc cần làm"
  },
  {
    "k": "思",
    "on": "シ",
    "kun": "おも",
    "vn": "Suy nghĩ",
    "strokes": 9,
    "rad": "心",
    "ex": [
      {
        "jp": "おもう",
        "vn": "nghĩ"
      },
      {
        "jp": "おもいで",
        "vn": "kỷ niệm"
      }
    ],
    "hint": "Ruộng 田 + tim 心 — tim suy nghĩ về đồng ruộng"
  },
  {
    "k": "持",
    "on": "ジ",
    "kun": "も",
    "vn": "Cầm, Giữ",
    "strokes": 9,
    "rad": "扌",
    "ex": [
      {
        "jp": "もつ",
        "vn": "cầm"
      },
      {
        "jp": "きもち",
        "vn": "cảm xúc"
      }
    ],
    "hint": "Tay + chùa 寺 — cầm giữ như giữ chùa"
  },
  {
    "k": "知",
    "on": "チ",
    "kun": "し",
    "vn": "Biết",
    "strokes": 8,
    "rad": "矢",
    "ex": [
      {
        "jp": "しる",
        "vn": "biết"
      },
      {
        "jp": "ちしき",
        "vn": "kiến thức"
      }
    ],
    "hint": "Mũi tên 矢 + miệng 口 — nói ra điều biết"
  },
  {
    "k": "所",
    "on": "ショ",
    "kun": "ところ",
    "vn": "Nơi, Chỗ",
    "strokes": 8,
    "rad": "戸",
    "ex": [
      {
        "jp": "ところ",
        "vn": "nơi"
      },
      {
        "jp": "じむしょ",
        "vn": "văn phòng"
      }
    ],
    "hint": "Cửa 戸 + rìu 斤 — nơi có cửa và công cụ"
  },
  {
    "k": "体",
    "on": "タイ・テイ",
    "kun": "からだ",
    "vn": "Thân thể",
    "strokes": 7,
    "rad": "亻",
    "ex": [
      {
        "jp": "からだ",
        "vn": "cơ thể"
      },
      {
        "jp": "たいいく",
        "vn": "thể dục"
      }
    ],
    "hint": "Người + gốc cây 本 — thân cây như thân người"
  },
  {
    "k": "使",
    "on": "シ",
    "kun": "つか",
    "vn": "Sử dụng",
    "strokes": 8,
    "rad": "亻",
    "ex": [
      {
        "jp": "つかう",
        "vn": "sử dụng"
      },
      {
        "jp": "たいし",
        "vn": "đại sứ"
      }
    ],
    "hint": "Người + quan lại 吏 — quan lại phục vụ"
  },
  {
    "k": "度",
    "on": "ド・ト",
    "kun": "たび",
    "vn": "Lần, Độ",
    "strokes": 9,
    "rad": "广",
    "ex": [
      {
        "jp": "いちど",
        "vn": "một lần"
      },
      {
        "jp": "おんど",
        "vn": "nhiệt độ"
      }
    ],
    "hint": "Dưới mái nhà + tay đo — đo đạc dưới mái nhà"
  },
  {
    "k": "同",
    "on": "ドウ",
    "kun": "おな",
    "vn": "Giống nhau, Cùng",
    "strokes": 6,
    "rad": "口",
    "ex": [
      {
        "jp": "おなじ",
        "vn": "giống nhau"
      },
      {
        "jp": "どうじ",
        "vn": "đồng thời"
      }
    ],
    "hint": "Miệng trong vòng tròn — cùng một miệng nói"
  },
  {
    "k": "家",
    "on": "カ・ケ",
    "kun": "いえ",
    "vn": "Nhà, Gia đình",
    "strokes": 10,
    "rad": "宀",
    "ex": [
      {
        "jp": "いえ",
        "vn": "ngôi nhà"
      },
      {
        "jp": "かぞく",
        "vn": "gia đình"
      }
    ],
    "hint": "Mái nhà + lợn 豕 — nhà có nuôi lợn = nhà ở"
  },
  {
    "k": "開",
    "on": "カイ",
    "kun": "あ・ひら",
    "vn": "Mở, Khai",
    "strokes": 12,
    "rad": "門",
    "ex": [
      {
        "jp": "あける",
        "vn": "mở"
      },
      {
        "jp": "かいし",
        "vn": "bắt đầu"
      }
    ],
    "hint": "Cửa 門 + hai tay — mở cánh cửa"
  },
  {
    "k": "近",
    "on": "キン",
    "kun": "ちか",
    "vn": "Gần",
    "strokes": 7,
    "rad": "辶",
    "ex": [
      {
        "jp": "ちかい",
        "vn": "gần"
      },
      {
        "jp": "きんじょ",
        "vn": "hàng xóm"
      }
    ],
    "hint": "Đường + rìu 斤 — đường ngắn gần"
  },
  {
    "k": "明",
    "on": "メイ・ミョウ",
    "kun": "あか・あ",
    "vn": "Sáng, Ngày mai",
    "strokes": 8,
    "rad": "日",
    "ex": [
      {
        "jp": "あかるい",
        "vn": "sáng"
      },
      {
        "jp": "あした",
        "vn": "ngày mai"
      }
    ],
    "hint": "Mặt trời 日 + mặt trăng 月 — cả hai đều sáng"
  },
  {
    "k": "活",
    "on": "カツ",
    "kun": "い",
    "vn": "Hoạt động, Sống",
    "strokes": 9,
    "rad": "氵",
    "ex": [
      {
        "jp": "せいかつ",
        "vn": "cuộc sống"
      },
      {
        "jp": "かつどう",
        "vn": "hoạt động"
      }
    ],
    "hint": "Nước + lưỡi 舌 — nước chảy sinh động"
  },
  {
    "k": "点",
    "on": "テン",
    "kun": "",
    "vn": "Điểm, Chấm",
    "strokes": 9,
    "rad": "灬",
    "ex": [
      {
        "jp": "てんすう",
        "vn": "điểm số"
      },
      {
        "jp": "ちてん",
        "vn": "địa điểm"
      }
    ],
    "hint": "Dư thừa 占 + lửa 灬 — điểm lửa bốc"
  },
  {
    "k": "仕",
    "on": "シ・ジ",
    "kun": "つか",
    "vn": "Phục vụ, Làm việc",
    "strokes": 5,
    "rad": "亻",
    "ex": [
      {
        "jp": "しごと",
        "vn": "công việc"
      },
      {
        "jp": "つかえる",
        "vn": "phục vụ"
      }
    ],
    "hint": "Người + đất 士 — người lính hầu hạ"
  },
  {
    "k": "問",
    "on": "モン",
    "kun": "と",
    "vn": "Hỏi, Vấn đề",
    "strokes": 11,
    "rad": "口",
    "ex": [
      {
        "jp": "もんだい",
        "vn": "vấn đề"
      },
      {
        "jp": "しつもん",
        "vn": "câu hỏi"
      }
    ],
    "hint": "Cửa 門 + miệng 口 — hỏi qua cửa"
  },
  {
    "k": "意",
    "on": "イ",
    "kun": "",
    "vn": "Ý nghĩa, Ý muốn",
    "strokes": 13,
    "rad": "心",
    "ex": [
      {
        "jp": "いみ",
        "vn": "ý nghĩa"
      },
      {
        "jp": "いけん",
        "vn": "ý kiến"
      }
    ],
    "hint": "Âm thanh + tim 心 — âm thanh của trái tim"
  },
  {
    "k": "感",
    "on": "カン",
    "kun": "",
    "vn": "Cảm giác",
    "strokes": 13,
    "rad": "心",
    "ex": [
      {
        "jp": "かんじる",
        "vn": "cảm thấy"
      },
      {
        "jp": "かんどう",
        "vn": "xúc động"
      }
    ],
    "hint": "Tất cả + tim 心 — tất cả chạm đến trái tim"
  },
  {
    "k": "次",
    "on": "ジ・シ",
    "kun": "つぎ",
    "vn": "Tiếp theo",
    "strokes": 6,
    "rad": "欠",
    "ex": [
      {
        "jp": "つぎ",
        "vn": "tiếp theo"
      },
      {
        "jp": "じかい",
        "vn": "lần sau"
      }
    ],
    "hint": "Băng 冫 + há miệng 欠 — lần tiếp theo"
  },
  {
    "k": "表",
    "on": "ヒョウ",
    "kun": "おもて・あらわ",
    "vn": "Bề mặt, Biểu hiện",
    "strokes": 8,
    "rad": "衣",
    "ex": [
      {
        "jp": "おもて",
        "vn": "mặt trước"
      },
      {
        "jp": "ひょうげん",
        "vn": "biểu hiện"
      }
    ],
    "hint": "Lông 毛 + áo 衣 — bề mặt của áo lông"
  },
  {
    "k": "起",
    "on": "キ",
    "kun": "お",
    "vn": "Dậy, Xảy ra",
    "strokes": 10,
    "rad": "走",
    "ex": [
      {
        "jp": "おきる",
        "vn": "thức dậy"
      },
      {
        "jp": "じしん",
        "vn": "động đất"
      }
    ],
    "hint": "Chạy 走 + bản thân 己 — tự mình đứng dậy"
  },
  {
    "k": "運",
    "on": "ウン",
    "kun": "はこ",
    "vn": "Vận chuyển, Vận may",
    "strokes": 12,
    "rad": "辶",
    "ex": [
      {
        "jp": "うんどう",
        "vn": "vận động"
      },
      {
        "jp": "はこぶ",
        "vn": "vận chuyển"
      }
    ],
    "hint": "Đường + quân đội 軍 — quân đội di chuyển"
  },
  {
    "k": "会",
    "on": "カイ・エ",
    "kun": "あ",
    "vn": "Gặp gỡ, Hội",
    "strokes": 6,
    "rad": "人",
    "ex": [
      {
        "jp": "かいしゃ",
        "vn": "công ty"
      },
      {
        "jp": "あう",
        "vn": "gặp"
      }
    ],
    "hint": "Người tập hợp dưới mái — tụ họp lại"
  },
  {
    "k": "医",
    "on": "イ",
    "kun": "",
    "vn": "Y tế, Bác sĩ",
    "strokes": 7,
    "rad": "匚",
    "ex": [
      {
        "jp": "いしゃ",
        "vn": "bác sĩ"
      },
      {
        "jp": "いがく",
        "vn": "y học"
      }
    ],
    "hint": "Hộp + mũi tên — tủ thuốc chữa bệnh"
  },
  {
    "k": "映",
    "on": "エイ",
    "kun": "うつ",
    "vn": "Chiếu, Phản chiếu",
    "strokes": 9,
    "rad": "日",
    "ex": [
      {
        "jp": "えいが",
        "vn": "phim"
      },
      {
        "jp": "はんえい",
        "vn": "phản chiếu"
      }
    ],
    "hint": "Mặt trời + trung tâm — ánh sáng phát ra"
  },
  {
    "k": "音",
    "on": "オン・イン",
    "kun": "おと・ね",
    "vn": "Âm thanh",
    "strokes": 9,
    "rad": "音",
    "ex": [
      {
        "jp": "おと",
        "vn": "âm thanh"
      },
      {
        "jp": "はつおん",
        "vn": "phát âm"
      }
    ],
    "hint": "Mặt trời + ngày — tiếng chuông vang trong ngày"
  },
  {
    "k": "温",
    "on": "オン",
    "kun": "あたた",
    "vn": "Ấm, Nhiệt độ",
    "strokes": 12,
    "rad": "氵",
    "ex": [
      {
        "jp": "あたたかい",
        "vn": "ấm áp"
      },
      {
        "jp": "おんど",
        "vn": "nhiệt độ"
      }
    ],
    "hint": "Nước + bình ấm — nước ấm trong bình"
  },
  {
    "k": "化",
    "on": "カ・ケ",
    "kun": "ば・か",
    "vn": "Biến đổi, Hóa",
    "strokes": 4,
    "rad": "亻",
    "ex": [
      {
        "jp": "ぶんか",
        "vn": "văn hóa"
      },
      {
        "jp": "へんか",
        "vn": "biến đổi"
      }
    ],
    "hint": "Người đứng + người lộn đầu — sự thay đổi"
  },
  {
    "k": "界",
    "on": "カイ",
    "kun": "",
    "vn": "Thế giới, Giới",
    "strokes": 9,
    "rad": "田",
    "ex": [
      {
        "jp": "せかい",
        "vn": "thế giới"
      },
      {
        "jp": "げかい",
        "vn": "thế giới hạ giới"
      }
    ],
    "hint": "Ruộng 田 + phân chia 介 — phân chia lãnh thổ"
  },
  {
    "k": "帰",
    "on": "キ",
    "kun": "かえ",
    "vn": "Trở về",
    "strokes": 10,
    "rad": "巾",
    "ex": [
      {
        "jp": "かえる",
        "vn": "về nhà"
      },
      {
        "jp": "きこく",
        "vn": "về nước"
      }
    ],
    "hint": "Người đi đường dài trở về — hành trình về"
  },
  {
    "k": "急",
    "on": "キュウ",
    "kun": "いそ",
    "vn": "Gấp, Vội",
    "strokes": 9,
    "rad": "心",
    "ex": [
      {
        "jp": "いそぐ",
        "vn": "vội vàng"
      },
      {
        "jp": "きゅうきゅう",
        "vn": "cấp cứu"
      }
    ],
    "hint": "Nắm chặt + tim — tim đập nhanh khi vội"
  },
  {
    "k": "究",
    "on": "キュウ",
    "kun": "きわ",
    "vn": "Nghiên cứu, Tận cùng",
    "strokes": 7,
    "rad": "穴",
    "ex": [
      {
        "jp": "けんきゅう",
        "vn": "nghiên cứu"
      },
      {
        "jp": "つきつめる",
        "vn": "truy cứu tận cùng"
      }
    ],
    "hint": "Hang + cong — đào sâu vào hang nghiên cứu"
  },
  {
    "k": "強",
    "on": "キョウ・ゴウ",
    "kun": "つよ",
    "vn": "Mạnh, Ép buộc",
    "strokes": 11,
    "rad": "弓",
    "ex": [
      {
        "jp": "つよい",
        "vn": "mạnh"
      },
      {
        "jp": "べんきょう",
        "vn": "học tập"
      }
    ],
    "hint": "Cung + sâu — sức mạnh bắn cung"
  },
  {
    "k": "教",
    "on": "キョウ",
    "kun": "おし・おそ",
    "vn": "Dạy, Giáo dục",
    "strokes": 11,
    "rad": "攴",
    "ex": [
      {
        "jp": "おしえる",
        "vn": "dạy"
      },
      {
        "jp": "きょうしつ",
        "vn": "phòng học"
      }
    ],
    "hint": "Hiếu + tay cầm roi — thầy cầm roi dạy học"
  },
  {
    "k": "業",
    "on": "ギョウ・ゴウ",
    "kun": "わざ",
    "vn": "Nghề nghiệp, Việc",
    "strokes": 13,
    "rad": "木",
    "ex": [
      {
        "jp": "しごとがら",
        "vn": "nghề nghiệp"
      },
      {
        "jp": "そつぎょう",
        "vn": "tốt nghiệp"
      }
    ],
    "hint": "Cây nhạc cụ — công việc tinh tế như âm nhạc"
  },
  {
    "k": "苦",
    "on": "ク",
    "kun": "くる・にが",
    "vn": "Khổ, Đắng",
    "strokes": 8,
    "rad": "艹",
    "ex": [
      {
        "jp": "くるしい",
        "vn": "khổ sở"
      },
      {
        "jp": "にがい",
        "vn": "đắng"
      }
    ],
    "hint": "Cỏ + cổ xưa — cỏ đắng từ thời cổ"
  },
  {
    "k": "計",
    "on": "ケイ",
    "kun": "はか",
    "vn": "Tính toán, Kế hoạch",
    "strokes": 9,
    "rad": "言",
    "ex": [
      {
        "jp": "けいかく",
        "vn": "kế hoạch"
      },
      {
        "jp": "とけい",
        "vn": "đồng hồ"
      }
    ],
    "hint": "Lời + mười — đếm từng lời mười lần"
  },
  {
    "k": "元",
    "on": "ゲン・ガン",
    "kun": "もと",
    "vn": "Gốc, Ban đầu",
    "strokes": 4,
    "rad": "儿",
    "ex": [
      {
        "jp": "もとから",
        "vn": "từ đầu"
      },
      {
        "jp": "げんき",
        "vn": "khỏe mạnh"
      }
    ],
    "hint": "Hai + người — người đứng vững từ đầu"
  },
  {
    "k": "研",
    "on": "ケン",
    "kun": "と",
    "vn": "Mài, Nghiên cứu",
    "strokes": 9,
    "rad": "石",
    "ex": [
      {
        "jp": "けんきゅう",
        "vn": "nghiên cứu"
      },
      {
        "jp": "とぐ",
        "vn": "mài giũa"
      }
    ],
    "hint": "Đá + khai khẩn — mài đá khai khẩn tìm hiểu"
  },
  {
    "k": "光",
    "on": "コウ",
    "kun": "ひか",
    "vn": "Ánh sáng",
    "strokes": 6,
    "rad": "儿",
    "ex": [
      {
        "jp": "ひかり",
        "vn": "ánh sáng"
      },
      {
        "jp": "かんこう",
        "vn": "du lịch"
      }
    ],
    "hint": "Lửa trên đầu người — đuốc phát sáng"
  },
  {
    "k": "考",
    "on": "コウ",
    "kun": "かんが",
    "vn": "Suy nghĩ, Xem xét",
    "strokes": 6,
    "rad": "老",
    "ex": [
      {
        "jp": "かんがえる",
        "vn": "suy nghĩ"
      },
      {
        "jp": "さんこう",
        "vn": "tham khảo"
      }
    ],
    "hint": "Người già 老 + uốn cong — cúi đầu suy tư"
  },
  {
    "k": "合",
    "on": "ゴウ・ガッ",
    "kun": "あ",
    "vn": "Kết hợp, Vừa vặn",
    "strokes": 6,
    "rad": "口",
    "ex": [
      {
        "jp": "あう",
        "vn": "vừa vặn"
      },
      {
        "jp": "ごうかく",
        "vn": "đậu thi"
      }
    ],
    "hint": "Nắp đậy vào hộp — khớp vừa vặn"
  },
  {
    "k": "交",
    "on": "コウ",
    "kun": "まじ・ま",
    "vn": "Giao, Trao đổi",
    "strokes": 6,
    "rad": "亠",
    "ex": [
      {
        "jp": "こうつう",
        "vn": "giao thông"
      },
      {
        "jp": "こうかん",
        "vn": "trao đổi"
      }
    ],
    "hint": "Người + chân bắt chéo — giao nhau"
  },
  {
    "k": "困",
    "on": "コン",
    "kun": "こま",
    "vn": "Khó khăn, Khốn đốn",
    "strokes": 7,
    "rad": "囗",
    "ex": [
      {
        "jp": "こまる",
        "vn": "khó khăn"
      },
      {
        "jp": "こんなん",
        "vn": "khó khăn"
      }
    ],
    "hint": "Cây trong hộp — cây bị nhốt không lớn được"
  },
  {
    "k": "最",
    "on": "サイ",
    "kun": "もっと",
    "vn": "Nhất, Tối",
    "strokes": 12,
    "rad": "曰",
    "ex": [
      {
        "jp": "もっとも",
        "vn": "nhất"
      },
      {
        "jp": "さいこう",
        "vn": "tốt nhất"
      }
    ],
    "hint": "Mặt trời + lấy — lấy từ đỉnh cao nhất"
  },
  {
    "k": "作",
    "on": "サク・サ",
    "kun": "つく",
    "vn": "Làm, Sáng tác",
    "strokes": 7,
    "rad": "亻",
    "ex": [
      {
        "jp": "つくる",
        "vn": "làm/tạo"
      },
      {
        "jp": "さくひん",
        "vn": "tác phẩm"
      }
    ],
    "hint": "Người + đục 乍 — người dùng công cụ làm đồ"
  },
  {
    "k": "市",
    "on": "シ",
    "kun": "いち",
    "vn": "Thành phố, Chợ",
    "strokes": 5,
    "rad": "巾",
    "ex": [
      {
        "jp": "まち",
        "vn": "phố"
      },
      {
        "jp": "しじょう",
        "vn": "thị trường"
      }
    ],
    "hint": "Khăn vải + ký hiệu — chợ trải vải bán hàng"
  },
  {
    "k": "始",
    "on": "シ",
    "kun": "はじ",
    "vn": "Bắt đầu",
    "strokes": 8,
    "rad": "女",
    "ex": [
      {
        "jp": "はじまる",
        "vn": "bắt đầu"
      },
      {
        "jp": "かいし",
        "vn": "khai thị"
      }
    ],
    "hint": "Phụ nữ + thai 胎 — bắt đầu từ sự sinh thành"
  },
  {
    "k": "止",
    "on": "シ",
    "kun": "と・や",
    "vn": "Dừng lại",
    "strokes": 4,
    "rad": "止",
    "ex": [
      {
        "jp": "とまる",
        "vn": "dừng"
      },
      {
        "jp": "ちゅうし",
        "vn": "dừng lại"
      }
    ],
    "hint": "Bàn chân đứng yên — bước chân dừng lại"
  },
  {
    "k": "私",
    "on": "シ",
    "kun": "わたし",
    "vn": "Tôi, Tư nhân",
    "strokes": 7,
    "rad": "禾",
    "ex": [
      {
        "jp": "わたし",
        "vn": "tôi"
      },
      {
        "jp": "してき",
        "vn": "riêng tư"
      }
    ],
    "hint": "Lúa + cánh tay cầm — lúa của riêng tôi"
  },
  {
    "k": "質",
    "on": "シツ・チ",
    "kun": "たち",
    "vn": "Chất lượng, Tính chất",
    "strokes": 15,
    "rad": "貝",
    "ex": [
      {
        "jp": "しつもん",
        "vn": "câu hỏi"
      },
      {
        "jp": "ひんしつ",
        "vn": "chất lượng"
      }
    ],
    "hint": "Hai cái rìu + tiền 貝 — đổi chác trao đổi"
  },
  {
    "k": "社",
    "on": "シャ",
    "kun": "やしろ",
    "vn": "Công ty, Xã hội",
    "strokes": 7,
    "rad": "示",
    "ex": [
      {
        "jp": "かいしゃ",
        "vn": "công ty"
      },
      {
        "jp": "じんじゃ",
        "vn": "đền thờ"
      }
    ],
    "hint": "Thần 示 + đất 土 — đất của thần linh"
  },
  {
    "k": "者",
    "on": "シャ",
    "kun": "もの",
    "vn": "Người (làm...)",
    "strokes": 8,
    "rad": "老",
    "ex": [
      {
        "jp": "がくしゃ",
        "vn": "học giả"
      },
      {
        "jp": "いしゃ",
        "vn": "bác sĩ"
      }
    ],
    "hint": "Người già 老 + ngọn lửa — người già dạy lửa"
  },
  {
    "k": "守",
    "on": "シュ",
    "kun": "まも",
    "vn": "Bảo vệ, Giữ",
    "strokes": 6,
    "rad": "宀",
    "ex": [
      {
        "jp": "まもる",
        "vn": "bảo vệ"
      },
      {
        "jp": "じゅしょ",
        "vn": "địa chỉ"
      }
    ],
    "hint": "Mái nhà + tay — tay bảo vệ mái nhà"
  },
  {
    "k": "習",
    "on": "シュウ",
    "kun": "なら",
    "vn": "Học, Luyện tập",
    "strokes": 11,
    "rad": "羽",
    "ex": [
      {
        "jp": "れんしゅう",
        "vn": "luyện tập"
      },
      {
        "jp": "がくしゅう",
        "vn": "học tập"
      }
    ],
    "hint": "Cánh chim + bản thân — chim tự mình học bay"
  },
  {
    "k": "集",
    "on": "シュウ",
    "kun": "あつ",
    "vn": "Tập hợp, Thu thập",
    "strokes": 12,
    "rad": "隹",
    "ex": [
      {
        "jp": "あつまる",
        "vn": "tập hợp"
      },
      {
        "jp": "しゅうちゅう",
        "vn": "tập trung"
      }
    ],
    "hint": "Chim + cây — nhiều chim đậu trên cây"
  },
  {
    "k": "住",
    "on": "ジュウ",
    "kun": "す",
    "vn": "Ở, Sinh sống",
    "strokes": 7,
    "rad": "亻",
    "ex": [
      {
        "jp": "すむ",
        "vn": "sinh sống"
      },
      {
        "jp": "じゅうしょ",
        "vn": "địa chỉ"
      }
    ],
    "hint": "Người + đứng thẳng 主 — người đứng tại nhà"
  },
  {
    "k": "重",
    "on": "ジュウ・チョウ",
    "kun": "おも・かさ",
    "vn": "Nặng, Quan trọng",
    "strokes": 9,
    "rad": "里",
    "ex": [
      {
        "jp": "おもい",
        "vn": "nặng"
      },
      {
        "jp": "じゅうよう",
        "vn": "quan trọng"
      }
    ],
    "hint": "Nghìn dặm nặng nề — người đi ngàn dặm mang đồ nặng"
  },
  {
    "k": "場",
    "on": "ジョウ",
    "kun": "ば",
    "vn": "Nơi, Chỗ, Sân",
    "strokes": 12,
    "rad": "土",
    "ex": [
      {
        "jp": "ば",
        "vn": "nơi"
      },
      {
        "jp": "こうじょう",
        "vn": "nhà máy"
      }
    ],
    "hint": "Đất + mặt trời mọc 昜 — nơi đất rộng phơi nắng"
  },
  {
    "k": "乗",
    "on": "ジョウ",
    "kun": "の",
    "vn": "Cưỡi, Lên (xe)",
    "strokes": 9,
    "rad": "丿",
    "ex": [
      {
        "jp": "のる",
        "vn": "lên xe"
      },
      {
        "jp": "じょうしゃ",
        "vn": "lên xe"
      }
    ],
    "hint": "Người trên cây — leo lên ngồi trên cây"
  },
  {
    "k": "切",
    "on": "セツ・サイ",
    "kun": "き",
    "vn": "Cắt, Quan trọng",
    "strokes": 4,
    "rad": "刀",
    "ex": [
      {
        "jp": "きる",
        "vn": "cắt"
      },
      {
        "jp": "たいせつ",
        "vn": "quan trọng"
      }
    ],
    "hint": "Bảy 七 + dao 刀 — dao cắt bảy lần"
  },
  {
    "k": "世",
    "on": "セイ・セ",
    "kun": "よ",
    "vn": "Thế giới, Đời",
    "strokes": 5,
    "rad": "一",
    "ex": [
      {
        "jp": "せかい",
        "vn": "thế giới"
      },
      {
        "jp": "よのなか",
        "vn": "xã hội"
      }
    ],
    "hint": "Ba mười = ba thế hệ = một đời người"
  },
  {
    "k": "送",
    "on": "ソウ",
    "kun": "おく",
    "vn": "Gửi, Tiễn",
    "strokes": 9,
    "rad": "辶",
    "ex": [
      {
        "jp": "おくる",
        "vn": "gửi/tiễn"
      },
      {
        "jp": "でんそう",
        "vn": "truyền gửi"
      }
    ],
    "hint": "Đường + tay đưa — đưa tiễn trên đường"
  },
  {
    "k": "族",
    "on": "ゾク",
    "kun": "",
    "vn": "Họ hàng, Tộc",
    "strokes": 11,
    "rad": "方",
    "ex": [
      {
        "jp": "かぞく",
        "vn": "gia đình"
      },
      {
        "jp": "みんぞく",
        "vn": "dân tộc"
      }
    ],
    "hint": "Cờ + mũi tên — bộ tộc mang cờ và vũ khí"
  },
  {
    "k": "待",
    "on": "タイ",
    "kun": "ま",
    "vn": "Chờ đợi",
    "strokes": 9,
    "rad": "彳",
    "ex": [
      {
        "jp": "まつ",
        "vn": "chờ"
      },
      {
        "jp": "たいき",
        "vn": "chờ đợi"
      }
    ],
    "hint": "Bước nhỏ + chùa 寺 — đứng chờ trước chùa"
  },
  {
    "k": "対",
    "on": "タイ・ツイ",
    "kun": "むか",
    "vn": "Đối diện, Chống lại",
    "strokes": 7,
    "rad": "寸",
    "ex": [
      {
        "jp": "たいする",
        "vn": "đối với"
      },
      {
        "jp": "はんたい",
        "vn": "phản đối"
      }
    ],
    "hint": "Cây rừng + tay — chặt cây đối mặt"
  },
  {
    "k": "地",
    "on": "チ・ジ",
    "kun": "つち",
    "vn": "Đất, Địa",
    "strokes": 6,
    "rad": "土",
    "ex": [
      {
        "jp": "じめん",
        "vn": "mặt đất"
      },
      {
        "jp": "ちず",
        "vn": "bản đồ"
      }
    ],
    "hint": "Đất 土 + rắn 也 — rắn bò trên đất"
  },
  {
    "k": "注",
    "on": "チュウ",
    "kun": "そそ",
    "vn": "Rót, Chú ý",
    "strokes": 8,
    "rad": "氵",
    "ex": [
      {
        "jp": "ちゅうもく",
        "vn": "chú ý"
      },
      {
        "jp": "そそぐ",
        "vn": "rót"
      }
    ],
    "hint": "Nước + chủ 主 — rót nước vào chỗ chính"
  },
  {
    "k": "昼",
    "on": "チュウ",
    "kun": "ひる",
    "vn": "Buổi trưa",
    "strokes": 9,
    "rad": "日",
    "ex": [
      {
        "jp": "ひる",
        "vn": "buổi trưa"
      },
      {
        "jp": "ひるごはん",
        "vn": "cơm trưa"
      }
    ],
    "hint": "Mặt trời ở đỉnh — trưa mặt trời lên cao nhất"
  },
  {
    "k": "特",
    "on": "トク",
    "kun": "",
    "vn": "Đặc biệt",
    "strokes": 10,
    "rad": "牛",
    "ex": [
      {
        "jp": "とくべつ",
        "vn": "đặc biệt"
      },
      {
        "jp": "とっきゅう",
        "vn": "tốc hành"
      }
    ],
    "hint": "Trâu bò + chùa — trâu đặc biệt để tế lễ"
  },
  {
    "k": "動",
    "on": "ドウ",
    "kun": "うご",
    "vn": "Chuyển động",
    "strokes": 11,
    "rad": "力",
    "ex": [
      {
        "jp": "うごく",
        "vn": "di chuyển"
      },
      {
        "jp": "うんどう",
        "vn": "vận động"
      }
    ],
    "hint": "Nặng 重 + sức 力 — sức lực để di chuyển đồ nặng"
  },
  {
    "k": "働",
    "on": "ドウ",
    "kun": "はたら",
    "vn": "Làm việc",
    "strokes": 13,
    "rad": "亻",
    "ex": [
      {
        "jp": "はたらく",
        "vn": "làm việc"
      },
      {
        "jp": "ろうどう",
        "vn": "lao động"
      }
    ],
    "hint": "Người + chuyển động 動 — người đang làm việc"
  },
  {
    "k": "転",
    "on": "テン",
    "kun": "ころ",
    "vn": "Lăn, Chuyển",
    "strokes": 11,
    "rad": "車",
    "ex": [
      {
        "jp": "ころぶ",
        "vn": "ngã"
      },
      {
        "jp": "じてんしゃ",
        "vn": "xe đạp"
      }
    ],
    "hint": "Xe + chuyên = bánh xe lăn chuyên nghiệp"
  },
  {
    "k": "旅",
    "on": "リョ",
    "kun": "たび",
    "vn": "Du lịch, Hành trình",
    "strokes": 10,
    "rad": "方",
    "ex": [
      {
        "jp": "りょこう",
        "vn": "du lịch"
      },
      {
        "jp": "たびびと",
        "vn": "lữ khách"
      }
    ],
    "hint": "Cờ + người + chân — người lữ hành mang cờ"
  },
  {
    "k": "両",
    "on": "リョウ",
    "kun": "",
    "vn": "Cả hai",
    "strokes": 6,
    "rad": "一",
    "ex": [
      {
        "jp": "りょうほう",
        "vn": "cả hai"
      },
      {
        "jp": "りょうしん",
        "vn": "cha mẹ"
      }
    ],
    "hint": "Một + hai giá treo — cả hai phía cân bằng"
  },
  {
    "k": "料",
    "on": "リョウ",
    "kun": "",
    "vn": "Nguyên liệu, Phí",
    "strokes": 10,
    "rad": "米",
    "ex": [
      {
        "jp": "りょうきん",
        "vn": "lệ phí"
      },
      {
        "jp": "りょうり",
        "vn": "nấu ăn"
      }
    ],
    "hint": "Gạo 米 + đấu — đong gạo tính giá"
  },
  {
    "k": "若",
    "on": "ジャク",
    "kun": "わか",
    "vn": "Trẻ, Nếu",
    "strokes": 8,
    "rad": "艹",
    "ex": [
      {
        "jp": "わかい",
        "vn": "trẻ tuổi"
      },
      {
        "jp": "もしくは",
        "vn": "hoặc"
      }
    ],
    "hint": "Cỏ + tay phải — cỏ non mới mọc = trẻ"
  },
  {
    "k": "別",
    "on": "ベツ",
    "kun": "わか",
    "vn": "Khác, Chia tay",
    "strokes": 7,
    "rad": "刀",
    "ex": [
      {
        "jp": "べつに",
        "vn": "riêng biệt"
      },
      {
        "jp": "わかれる",
        "vn": "chia tay"
      }
    ],
    "hint": "Xương + dao — dao cắt đứt chia ra"
  },
  {
    "k": "変",
    "on": "ヘン",
    "kun": "か",
    "vn": "Thay đổi, Kỳ lạ",
    "strokes": 9,
    "rad": "攴",
    "ex": [
      {
        "jp": "かわる",
        "vn": "thay đổi"
      },
      {
        "jp": "へんか",
        "vn": "biến đổi"
      }
    ],
    "hint": "Dây quấn + đánh — đánh tháo ra = thay đổi"
  },
  {
    "k": "勉",
    "on": "ベン",
    "kun": "",
    "vn": "Cố gắng",
    "strokes": 10,
    "rad": "力",
    "ex": [
      {
        "jp": "べんきょう",
        "vn": "học tập"
      },
      {
        "jp": "べんきょうする",
        "vn": "học bài"
      }
    ],
    "hint": "Miễn cưỡng + sức — cố gắng dù miễn cưỡng"
  },
  {
    "k": "味",
    "on": "ミ",
    "kun": "あじ",
    "vn": "Vị, Hương vị",
    "strokes": 8,
    "rad": "口",
    "ex": [
      {
        "jp": "あじ",
        "vn": "mùi vị"
      },
      {
        "jp": "きょうみ",
        "vn": "sở thích"
      }
    ],
    "hint": "Miệng + chưa 未 — chưa biết vị gì"
  },
  {
    "k": "有",
    "on": "ユウ・ウ",
    "kun": "あ",
    "vn": "Có, Tồn tại",
    "strokes": 6,
    "rad": "月",
    "ex": [
      {
        "jp": "ある",
        "vn": "có"
      },
      {
        "jp": "ゆうめい",
        "vn": "nổi tiếng"
      }
    ],
    "hint": "Tay cầm thịt — người có thức ăn = có của cải"
  },
  {
    "k": "様",
    "on": "ヨウ",
    "kun": "さま",
    "vn": "Dáng, Cách thức, Ông/Bà",
    "strokes": 14,
    "rad": "木",
    "ex": [
      {
        "jp": "おきゃくさま",
        "vn": "quý khách"
      },
      {
        "jp": "どのよう",
        "vn": "như thế nào"
      }
    ],
    "hint": "Cây + dê + nước — cây lớn như vương giả"
  },
  {
    "k": "用",
    "on": "ヨウ",
    "kun": "もち",
    "vn": "Dùng, Công dụng",
    "strokes": 5,
    "rad": "用",
    "ex": [
      {
        "jp": "りよう",
        "vn": "sử dụng"
      },
      {
        "jp": "ひよう",
        "vn": "chi phí"
      }
    ],
    "hint": "Hàng rào + lưới — dùng hàng rào bắt cá"
  },
  {
    "k": "予",
    "on": "ヨ",
    "kun": "",
    "vn": "Trước, Dự",
    "strokes": 4,
    "rad": "亅",
    "ex": [
      {
        "jp": "よてい",
        "vn": "kế hoạch"
      },
      {
        "jp": "よしゅう",
        "vn": "chuẩn bị trước"
      }
    ],
    "hint": "Tạo ra trước — dự phòng trước"
  },
  {
    "k": "曜",
    "on": "ヨウ",
    "kun": "",
    "vn": "Ngày trong tuần",
    "strokes": 18,
    "rad": "日",
    "ex": [
      {
        "jp": "げつようび",
        "vn": "thứ Hai"
      },
      {
        "jp": "すいようび",
        "vn": "thứ Tư"
      }
    ],
    "hint": "Mặt trời + chim bay cao — ánh mặt trời chói sáng"
  },
  {
    "k": "利",
    "on": "リ",
    "kun": "き",
    "vn": "Lợi ích, Thuận tiện",
    "strokes": 7,
    "rad": "刀",
    "ex": [
      {
        "jp": "べんり",
        "vn": "tiện lợi"
      },
      {
        "jp": "りよう",
        "vn": "lợi dụng"
      }
    ],
    "hint": "Lúa chín + dao — thu hoạch lúa chín = có lợi"
  }
];
const KANJI_N3 = [
  {
    "k": "愛",
    "on": "アイ",
    "kun": "",
    "vn": "Tình yêu",
    "strokes": 13,
    "rad": "心",
    "ex": [
      {
        "jp": "あいじょう",
        "vn": "tình yêu"
      },
      {
        "jp": "あいする",
        "vn": "yêu"
      }
    ],
    "hint": "Chân + tim + đi — tim đi cùng nhau = tình yêu"
  },
  {
    "k": "悪",
    "on": "アク・オ",
    "kun": "わる",
    "vn": "Xấu, Ác",
    "strokes": 11,
    "rad": "心",
    "ex": [
      {
        "jp": "わるい",
        "vn": "xấu/tệ"
      },
      {
        "jp": "あくまで",
        "vn": "đến cùng"
      }
    ],
    "hint": "Á + tim — tâm địa xấu xa"
  },
  {
    "k": "以",
    "on": "イ",
    "kun": "",
    "vn": "Dĩ, Bằng cách",
    "strokes": 5,
    "rad": "人",
    "ex": [
      {
        "jp": "いじょう",
        "vn": "trên, hơn"
      },
      {
        "jp": "いか",
        "vn": "dưới, kém"
      }
    ],
    "hint": "Người + cày — bằng sức người cày ruộng"
  },
  {
    "k": "員",
    "on": "イン",
    "kun": "",
    "vn": "Thành viên, Nhân viên",
    "strokes": 10,
    "rad": "貝",
    "ex": [
      {
        "jp": "かいいん",
        "vn": "hội viên"
      },
      {
        "jp": "てんいん",
        "vn": "nhân viên cửa hàng"
      }
    ],
    "hint": "Miệng + tiền — người nhận tiền làm việc"
  },
  {
    "k": "院",
    "on": "イン",
    "kun": "",
    "vn": "Viện, Tòa nhà lớn",
    "strokes": 10,
    "rad": "阝",
    "ex": [
      {
        "jp": "びょういん",
        "vn": "bệnh viện"
      },
      {
        "jp": "だいがくいん",
        "vn": "cao học"
      }
    ],
    "hint": "Gò đất + mái nhà hoàn chỉnh — tòa nhà lớn"
  },
  {
    "k": "引",
    "on": "イン",
    "kun": "ひ",
    "vn": "Kéo, Thu hút",
    "strokes": 4,
    "rad": "弓",
    "ex": [
      {
        "jp": "ひく",
        "vn": "kéo"
      },
      {
        "jp": "あしをひっぱる",
        "vn": "kéo chân"
      }
    ],
    "hint": "Cung + mũi tên — kéo dây cung bắn"
  },
  {
    "k": "歌",
    "on": "カ",
    "kun": "うた",
    "vn": "Bài hát, Ca",
    "strokes": 14,
    "rad": "欠",
    "ex": [
      {
        "jp": "うた",
        "vn": "bài hát"
      },
      {
        "jp": "うたう",
        "vn": "ca hát"
      }
    ],
    "hint": "Ca + ngáp 欠 — há miệng to hát"
  },
  {
    "k": "改",
    "on": "カイ",
    "kun": "あらた",
    "vn": "Cải cách, Sửa đổi",
    "strokes": 7,
    "rad": "攴",
    "ex": [
      {
        "jp": "かいせい",
        "vn": "cải cách"
      },
      {
        "jp": "あらためる",
        "vn": "sửa đổi"
      }
    ],
    "hint": "Bản thân 己 + đánh — đánh giá lại để sửa"
  },
  {
    "k": "格",
    "on": "カク・コウ",
    "kun": "",
    "vn": "Tiêu chuẩn, Tư cách",
    "strokes": 10,
    "rad": "木",
    "ex": [
      {
        "jp": "ごうかく",
        "vn": "đậu"
      },
      {
        "jp": "せいかく",
        "vn": "tính cách"
      }
    ],
    "hint": "Cây + mỗi — cây theo từng tiêu chuẩn"
  },
  {
    "k": "確",
    "on": "カク",
    "kun": "たし",
    "vn": "Chắc chắn",
    "strokes": 15,
    "rad": "石",
    "ex": [
      {
        "jp": "たしか",
        "vn": "chắc chắn"
      },
      {
        "jp": "かくにん",
        "vn": "xác nhận"
      }
    ],
    "hint": "Đá + chim — đá chắc chắn như chim có tổ"
  },
  {
    "k": "観",
    "on": "カン",
    "kun": "み",
    "vn": "Quan sát, Cảnh quan",
    "strokes": 18,
    "rad": "見",
    "ex": [
      {
        "jp": "かんこう",
        "vn": "du lịch"
      },
      {
        "jp": "かんがえ",
        "vn": "quan điểm"
      }
    ],
    "hint": "Chim stork + nhìn — nhìn như chim quan sát"
  },
  {
    "k": "関",
    "on": "カン",
    "kun": "かか・せき",
    "vn": "Quan hệ, Có liên quan",
    "strokes": 14,
    "rad": "門",
    "ex": [
      {
        "jp": "かんけい",
        "vn": "quan hệ"
      },
      {
        "jp": "かんしん",
        "vn": "quan tâm"
      }
    ],
    "hint": "Cổng + dây cung — khóa cổng = có liên quan"
  },
  {
    "k": "岸",
    "on": "ガン",
    "kun": "きし",
    "vn": "Bờ, Bờ biển",
    "strokes": 8,
    "rad": "山",
    "ex": [
      {
        "jp": "かいがん",
        "vn": "bờ biển"
      },
      {
        "jp": "きし",
        "vn": "bờ"
      }
    ],
    "hint": "Núi + đất bằng + cây — đất cao bên bờ nước"
  },
  {
    "k": "機",
    "on": "キ",
    "kun": "はた",
    "vn": "Máy móc, Cơ hội",
    "strokes": 16,
    "rad": "木",
    "ex": [
      {
        "jp": "きかい",
        "vn": "máy móc"
      },
      {
        "jp": "きかい",
        "vn": "cơ hội"
      }
    ],
    "hint": "Cây + tơ + cơ cấu — máy dệt tơ bằng gỗ"
  },
  {
    "k": "記",
    "on": "キ",
    "kun": "しる",
    "vn": "Ghi chép, Ký ức",
    "strokes": 10,
    "rad": "言",
    "ex": [
      {
        "jp": "にっき",
        "vn": "nhật ký"
      },
      {
        "jp": "きおく",
        "vn": "ký ức"
      }
    ],
    "hint": "Lời + bản thân — ghi lại lời của mình"
  },
  {
    "k": "議",
    "on": "ギ",
    "kun": "",
    "vn": "Thảo luận, Nghị",
    "strokes": 20,
    "rad": "言",
    "ex": [
      {
        "jp": "かいぎ",
        "vn": "cuộc họp"
      },
      {
        "jp": "ぎかい",
        "vn": "nghị viện"
      }
    ],
    "hint": "Lời + tốt đẹp + ta — tranh luận tốt đẹp"
  },
  {
    "k": "泣",
    "on": "キュウ",
    "kun": "な",
    "vn": "Khóc",
    "strokes": 8,
    "rad": "氵",
    "ex": [
      {
        "jp": "なく",
        "vn": "khóc"
      },
      {
        "jp": "ないている",
        "vn": "đang khóc"
      }
    ],
    "hint": "Nước + đứng — nước mắt chảy đứng"
  },
  {
    "k": "球",
    "on": "キュウ",
    "kun": "たま",
    "vn": "Quả cầu, Bóng",
    "strokes": 11,
    "rad": "王",
    "ex": [
      {
        "jp": "やきゅう",
        "vn": "bóng chày"
      },
      {
        "jp": "ちきゅう",
        "vn": "trái đất"
      }
    ],
    "hint": "Ngọc 王 + cầu — viên ngọc tròn"
  },
  {
    "k": "競",
    "on": "キョウ・ケイ",
    "kun": "きそ",
    "vn": "Cạnh tranh, Thi đua",
    "strokes": 20,
    "rad": "立",
    "ex": [
      {
        "jp": "きょうそう",
        "vn": "cạnh tranh"
      },
      {
        "jp": "けいば",
        "vn": "đua ngựa"
      }
    ],
    "hint": "Hai người đứng tranh nhau — cạnh tranh"
  },
  {
    "k": "局",
    "on": "キョク",
    "kun": "つぼね",
    "vn": "Cục, Bộ phận",
    "strokes": 7,
    "rad": "尸",
    "ex": [
      {
        "jp": "ゆうびんきょく",
        "vn": "bưu điện"
      },
      {
        "jp": "ほうそうきょく",
        "vn": "đài phát thanh"
      }
    ],
    "hint": "Mái nhà + miệng + cong — nơi làm việc riêng"
  },
  {
    "k": "具",
    "on": "グ",
    "kun": "",
    "vn": "Công cụ, Đồ dùng",
    "strokes": 8,
    "rad": "八",
    "ex": [
      {
        "jp": "どうぐ",
        "vn": "dụng cụ"
      },
      {
        "jp": "がっき",
        "vn": "nhạc cụ"
      }
    ],
    "hint": "Mắt + hai tay — cầm đồ vật bằng hai tay"
  },
  {
    "k": "君",
    "on": "クン",
    "kun": "きみ",
    "vn": "Bạn (nam), Quân",
    "strokes": 7,
    "rad": "口",
    "ex": [
      {
        "jp": "きみ",
        "vn": "cậu (thân mật)"
      },
      {
        "jp": "くんしゅ",
        "vn": "quân chủ"
      }
    ],
    "hint": "Tay cầm bút + miệng — người chỉ huy phát lệnh"
  },
  {
    "k": "群",
    "on": "グン",
    "kun": "むれ",
    "vn": "Đàn, Đám đông",
    "strokes": 13,
    "rad": "羊",
    "ex": [
      {
        "jp": "むれ",
        "vn": "đàn"
      },
      {
        "jp": "ぐんしゅう",
        "vn": "đám đông"
      }
    ],
    "hint": "Dê 羊 + quân — đàn dê như đội quân"
  },
  {
    "k": "経",
    "on": "ケイ・キョウ",
    "kun": "へ・た",
    "vn": "Kinh, Quản lý, Trải qua",
    "strokes": 11,
    "rad": "糸",
    "ex": [
      {
        "jp": "けいざい",
        "vn": "kinh tế"
      },
      {
        "jp": "けいけん",
        "vn": "kinh nghiệm"
      }
    ],
    "hint": "Sợi chỉ + công trình — sợi chỉ quản lý kinh tế"
  },
  {
    "k": "現",
    "on": "ゲン",
    "kun": "あらわ",
    "vn": "Hiện tại, Hiện ra",
    "strokes": 11,
    "rad": "王",
    "ex": [
      {
        "jp": "げんざい",
        "vn": "hiện tại"
      },
      {
        "jp": "あらわれる",
        "vn": "xuất hiện"
      }
    ],
    "hint": "Ngọc + nhìn — ngọc quý xuất hiện"
  },
  {
    "k": "減",
    "on": "ゲン",
    "kun": "へ",
    "vn": "Giảm, Giảm thiểu",
    "strokes": 12,
    "rad": "氵",
    "ex": [
      {
        "jp": "へる",
        "vn": "giảm"
      },
      {
        "jp": "さくげん",
        "vn": "cắt giảm"
      }
    ],
    "hint": "Nước + miệng nói + dao — cắt bớt nước"
  },
  {
    "k": "効",
    "on": "コウ",
    "kun": "き",
    "vn": "Hiệu quả",
    "strokes": 8,
    "rad": "力",
    "ex": [
      {
        "jp": "こうか",
        "vn": "hiệu quả"
      },
      {
        "jp": "ゆうこう",
        "vn": "có hiệu lực"
      }
    ],
    "hint": "Giao + sức — phối hợp sức mạnh tạo hiệu quả"
  },
  {
    "k": "向",
    "on": "コウ",
    "kun": "む",
    "vn": "Hướng tới, Quay về",
    "strokes": 6,
    "rad": "口",
    "ex": [
      {
        "jp": "むかう",
        "vn": "hướng tới"
      },
      {
        "jp": "ほうこう",
        "vn": "phương hướng"
      }
    ],
    "hint": "Cửa sổ trên mái — mở cửa sổ hướng ra ngoài"
  },
  {
    "k": "候",
    "on": "コウ",
    "kun": "ま",
    "vn": "Thời tiết, Chờ đợi",
    "strokes": 10,
    "rad": "亻",
    "ex": [
      {
        "jp": "きこう",
        "vn": "khí hậu"
      },
      {
        "jp": "こうほ",
        "vn": "ứng cử viên"
      }
    ],
    "hint": "Người + hầu cận — hầu hạ chờ đợi"
  },
  {
    "k": "講",
    "on": "コウ",
    "kun": "",
    "vn": "Giảng dạy, Bài giảng",
    "strokes": 17,
    "rad": "言",
    "ex": [
      {
        "jp": "こうぎ",
        "vn": "bài giảng"
      },
      {
        "jp": "こうえん",
        "vn": "diễn thuyết"
      }
    ],
    "hint": "Lời + cấu trúc — xây dựng lời giảng"
  },
  {
    "k": "差",
    "on": "サ",
    "kun": "さ",
    "vn": "Sự khác biệt, Chênh lệch",
    "strokes": 10,
    "rad": "工",
    "ex": [
      {
        "jp": "さいてい",
        "vn": "tệ nhất"
      },
      {
        "jp": "さべつ",
        "vn": "phân biệt"
      }
    ],
    "hint": "Dê + công trình — chênh lệch trong công trình"
  },
  {
    "k": "再",
    "on": "サイ",
    "kun": "ふたた",
    "vn": "Lại, Tái",
    "strokes": 6,
    "rad": "冂",
    "ex": [
      {
        "jp": "さいかい",
        "vn": "gặp lại"
      },
      {
        "jp": "ふたたび",
        "vn": "một lần nữa"
      }
    ],
    "hint": "Hai lần — lặp lại lần thứ hai"
  },
  {
    "k": "材",
    "on": "ザイ",
    "kun": "",
    "vn": "Nguyên liệu, Tài năng",
    "strokes": 7,
    "rad": "木",
    "ex": [
      {
        "jp": "ざいりょう",
        "vn": "nguyên liệu"
      },
      {
        "jp": "じんざい",
        "vn": "nhân tài"
      }
    ],
    "hint": "Cây + tài — gỗ tốt có tài"
  },
  {
    "k": "参",
    "on": "サン",
    "kun": "まい",
    "vn": "Tham gia, Đến",
    "strokes": 8,
    "rad": "厶",
    "ex": [
      {
        "jp": "さんか",
        "vn": "tham gia"
      },
      {
        "jp": "まいる",
        "vn": "đến/thất bại"
      }
    ],
    "hint": "Ba lần sáng chói — ba ngôi sao sáng"
  },
  {
    "k": "産",
    "on": "サン",
    "kun": "う",
    "vn": "Sản xuất, Sinh ra",
    "strokes": 11,
    "rad": "生",
    "ex": [
      {
        "jp": "うまれる",
        "vn": "ra đời"
      },
      {
        "jp": "せいさん",
        "vn": "sản xuất"
      }
    ],
    "hint": "Đứng + sinh — người đứng sinh con"
  },
  {
    "k": "支",
    "on": "シ",
    "kun": "ささ",
    "vn": "Nhánh, Hỗ trợ",
    "strokes": 4,
    "rad": "支",
    "ex": [
      {
        "jp": "しえん",
        "vn": "hỗ trợ"
      },
      {
        "jp": "ぶんし",
        "vn": "chi nhánh"
      }
    ],
    "hint": "Cây nhỏ + bàn tay — tay đỡ nhánh cây"
  },
  {
    "k": "識",
    "on": "シキ",
    "kun": "し",
    "vn": "Nhận biết, Kiến thức",
    "strokes": 19,
    "rad": "言",
    "ex": [
      {
        "jp": "ちしき",
        "vn": "kiến thức"
      },
      {
        "jp": "にんしき",
        "vn": "nhận thức"
      }
    ],
    "hint": "Lời + âm thanh + dao — phân biệt nhận ra"
  },
  {
    "k": "実",
    "on": "ジツ",
    "kun": "み・じつ",
    "vn": "Thật, Quả",
    "strokes": 8,
    "rad": "宀",
    "ex": [
      {
        "jp": "じつは",
        "vn": "thật ra"
      },
      {
        "jp": "くだもの",
        "vn": "trái cây"
      }
    ],
    "hint": "Mái nhà + tiền — của cải thật sự trong nhà"
  },
  {
    "k": "収",
    "on": "シュウ",
    "kun": "おさ",
    "vn": "Thu, Cất giữ",
    "strokes": 4,
    "rad": "又",
    "ex": [
      {
        "jp": "しゅうにゅう",
        "vn": "thu nhập"
      },
      {
        "jp": "かいしゅう",
        "vn": "thu hồi"
      }
    ],
    "hint": "Cong + tay — tay cong thu vén"
  },
  {
    "k": "術",
    "on": "ジュツ",
    "kun": "",
    "vn": "Nghệ thuật, Thuật",
    "strokes": 11,
    "rad": "行",
    "ex": [
      {
        "jp": "げいじゅつ",
        "vn": "nghệ thuật"
      },
      {
        "jp": "じゅつ",
        "vn": "phép thuật"
      }
    ],
    "hint": "Đi + dọc đường trồng — kỹ thuật đi qua"
  },
  {
    "k": "勝",
    "on": "ショウ",
    "kun": "か",
    "vn": "Thắng, Chiến thắng",
    "strokes": 12,
    "rad": "力",
    "ex": [
      {
        "jp": "かつ",
        "vn": "thắng"
      },
      {
        "jp": "ゆうしょう",
        "vn": "vô địch"
      }
    ],
    "hint": "Chịu đựng + sức — sức chịu đựng thắng cuộc"
  },
  {
    "k": "商",
    "on": "ショウ",
    "kun": "あきな",
    "vn": "Thương mại, Buôn bán",
    "strokes": 11,
    "rad": "口",
    "ex": [
      {
        "jp": "しょうばい",
        "vn": "kinh doanh"
      },
      {
        "jp": "しょうひん",
        "vn": "hàng hóa"
      }
    ],
    "hint": "Nói + thờ cúng — nói nhiều để buôn bán"
  },
  {
    "k": "将",
    "on": "ショウ",
    "kun": "まさ",
    "vn": "Tướng, Sắp",
    "strokes": 10,
    "rad": "寸",
    "ex": [
      {
        "jp": "しょうらい",
        "vn": "tương lai"
      },
      {
        "jp": "たいしょう",
        "vn": "tướng quân"
      }
    ],
    "hint": "Miếng thịt + tay + đơn vị — chia thịt cho lính"
  },
  {
    "k": "情",
    "on": "ジョウ・セイ",
    "kun": "なさ",
    "vn": "Tình cảm, Hoàn cảnh",
    "strokes": 11,
    "rad": "心",
    "ex": [
      {
        "jp": "きもち",
        "vn": "cảm xúc"
      },
      {
        "jp": "じょうほう",
        "vn": "thông tin"
      }
    ],
    "hint": "Tim + xanh tươi — tình cảm xanh tươi trong sáng"
  },
  {
    "k": "申",
    "on": "シン",
    "kun": "もう",
    "vn": "Thưa, Trình bày",
    "strokes": 5,
    "rad": "田",
    "ex": [
      {
        "jp": "もうしこむ",
        "vn": "nộp đơn"
      },
      {
        "jp": "もうしわけ",
        "vn": "lý do xin lỗi"
      }
    ],
    "hint": "Ruộng + tia sét — thần linh trình bày ý kiến"
  },
  {
    "k": "速",
    "on": "ソク",
    "kun": "はや",
    "vn": "Nhanh",
    "strokes": 10,
    "rad": "辶",
    "ex": [
      {
        "jp": "はやい",
        "vn": "nhanh"
      },
      {
        "jp": "こうそく",
        "vn": "cao tốc"
      }
    ],
    "hint": "Đường + cọc buộc — đường thẳng tắp nhanh"
  },
  {
    "k": "続",
    "on": "ゾク",
    "kun": "つづ",
    "vn": "Tiếp tục",
    "strokes": 13,
    "rad": "糸",
    "ex": [
      {
        "jp": "つづける",
        "vn": "tiếp tục"
      },
      {
        "jp": "れんぞく",
        "vn": "liên tục"
      }
    ],
    "hint": "Sợi chỉ + bán — sợi chỉ tiếp tục không đứt"
  },
  {
    "k": "存",
    "on": "ソン・ゾン",
    "kun": "",
    "vn": "Tồn tại",
    "strokes": 6,
    "rad": "子",
    "ex": [
      {
        "jp": "そんざい",
        "vn": "tồn tại"
      },
      {
        "jp": "しんぞん",
        "vn": "còn sống"
      }
    ],
    "hint": "Cây trồng + trẻ em — cây và trẻ cùng tồn tại"
  },
  {
    "k": "波",
    "on": "ハ",
    "kun": "なみ",
    "vn": "Sóng",
    "strokes": 8,
    "rad": "氵",
    "ex": [
      {
        "jp": "なみ",
        "vn": "sóng biển"
      },
      {
        "jp": "てんぱ",
        "vn": "sóng điện波"
      }
    ],
    "hint": "Thủy 氵 + bì 皮 — nước dâng lên thành lớp như da"
  },
  {
    "k": "油",
    "on": "ユ",
    "kun": "あぶら",
    "vn": "Dầu",
    "strokes": 8,
    "rad": "氵",
    "ex": [
      {
        "jp": "あぶら",
        "vn": "dầu ăn"
      },
      {
        "jp": "しょうゆ",
        "vn": "xì dầu"
      }
    ],
    "hint": "Thủy 氵 + do 由 — chất chất lỏng chảy ra từ nguyên do"
  },
  {
    "k": "政",
    "on": "セイ・ショウ",
    "kun": "まつりごと",
    "vn": "Chính trị",
    "strokes": 9,
    "rad": "攵",
    "ex": [
      {
        "jp": "せいじ",
        "vn": "chính trị"
      },
      {
        "jp": "せいふ",
        "vn": "chính phủ"
      }
    ],
    "hint": "Chính 正 + đánh 攵 — chấn chỉnh cho đúng đắn"
  },
  {
    "k": "負",
    "on": "フ",
    "kun": "ま・お",
    "vn": "Thua, Gánh vác",
    "strokes": 9,
    "rad": "貝",
    "ex": [
      {
        "jp": "まける",
        "vn": "thua"
      },
      {
        "jp": "しょうぶ",
        "vn": "thắng bại"
      }
    ],
    "hint": "Bảo 貝 trên người — gánh nặng tài sản"
  }
];
 
// ════════════════════════════════════════════════════════════════
// KANJI N2 — 80 chữ nâng cao
// ════════════════════════════════════════════════════════════════
const KANJI_N2 = [
  {
    "k": "握",
    "on": "アク",
    "kun": "にぎ",
    "vn": "Nắm, Cầm",
    "strokes": 12,
    "rad": "扌",
    "ex": [
      {
        "jp": "にぎる",
        "vn": "nắm"
      },
      {
        "jp": "あくしゅ",
        "vn": "bắt tay"
      }
    ],
    "hint": "Tay + ốc — nắm chặt như vỏ ốc"
  },
  {
    "k": "扱",
    "on": "キュウ",
    "kun": "あつか",
    "vn": "Xử lý, Đối xử",
    "strokes": 6,
    "rad": "扌",
    "ex": [
      {
        "jp": "あつかう",
        "vn": "xử lý"
      },
      {
        "jp": "とりあつかい",
        "vn": "cách xử lý"
      }
    ],
    "hint": "Tay + kéo vào — tay kéo vào xử lý"
  },
  {
    "k": "依",
    "on": "イ",
    "kun": "よ",
    "vn": "Nương tựa, Phụ thuộc",
    "strokes": 8,
    "rad": "亻",
    "ex": [
      {
        "jp": "いらい",
        "vn": "nhờ vả"
      },
      {
        "jp": "いぞん",
        "vn": "phụ thuộc"
      }
    ],
    "hint": "Người + y phục — người phụ thuộc vào quần áo"
  },
  {
    "k": "宇",
    "on": "ウ",
    "kun": "",
    "vn": "Vũ trụ, Mái nhà",
    "strokes": 6,
    "rad": "宀",
    "ex": [
      {
        "jp": "うちゅう",
        "vn": "vũ trụ"
      },
      {
        "jp": "うちゅうひこうし",
        "vn": "phi hành gia"
      }
    ],
    "hint": "Mái nhà + cong — mái nhà vũ trụ bao phủ"
  },
  {
    "k": "宴",
    "on": "エン",
    "kun": "うたげ",
    "vn": "Tiệc, Yến tiệc",
    "strokes": 10,
    "rad": "宀",
    "ex": [
      {
        "jp": "えんかい",
        "vn": "tiệc"
      },
      {
        "jp": "うたげ",
        "vn": "yến tiệc"
      }
    ],
    "hint": "Mái nhà + phụ nữ + ngày — tiệc trong nhà"
  },
  {
    "k": "演",
    "on": "エン",
    "kun": "",
    "vn": "Biểu diễn, Thực hành",
    "strokes": 14,
    "rad": "氵",
    "ex": [
      {
        "jp": "えんじる",
        "vn": "biểu diễn"
      },
      {
        "jp": "こうえん",
        "vn": "diễn xuất"
      }
    ],
    "hint": "Nước + sâu — nước sâu như diễn sâu"
  },
  {
    "k": "応",
    "on": "オウ",
    "kun": "こた",
    "vn": "Ứng, Phản ứng",
    "strokes": 7,
    "rad": "心",
    "ex": [
      {
        "jp": "おうじる",
        "vn": "phản ứng"
      },
      {
        "jp": "はんのう",
        "vn": "phản ứng"
      }
    ],
    "hint": "Quảng + tim — tim rộng phản ứng"
  },
  {
    "k": "奥",
    "on": "オウ",
    "kun": "おく",
    "vn": "Sâu, Trong cùng",
    "strokes": 12,
    "rad": "大",
    "ex": [
      {
        "jp": "おくさん",
        "vn": "vợ (kính ngữ)"
      },
      {
        "jp": "おくゆき",
        "vn": "chiều sâu"
      }
    ],
    "hint": "Gạo trong nhà + lớn — kho gạo trong cùng nhà"
  },
  {
    "k": "恩",
    "on": "オン",
    "kun": ", ",
    "vn": "Ơn nghĩa",
    "strokes": 10,
    "rad": "心",
    "ex": [
      {
        "jp": "おんじん",
        "vn": "ân nhân"
      },
      {
        "jp": "おんがえし",
        "vn": "đền ơn"
      }
    ],
    "hint": "Nguyên nhân + tim — tim nhớ ơn nguyên do"
  },
  {
    "k": "仮",
    "on": "カ・ケ",
    "kun": "かり",
    "vn": "Tạm thời, Giả định",
    "strokes": 6,
    "rad": "亻",
    "ex": [
      {
        "jp": "かりに",
        "vn": "tạm thời"
      },
      {
        "jp": "かそう",
        "vn": "cải trang"
      }
    ],
    "hint": "Người + lấy 又 + ta — tạm mượn của người"
  },
  {
    "k": "掛",
    "on": "カイ",
    "kun": "か",
    "vn": "Treo, Khoác",
    "strokes": 11,
    "rad": "扌",
    "ex": [
      {
        "jp": "かける",
        "vn": "treo/khoác"
      },
      {
        "jp": "こしかけ",
        "vn": "ghế dài"
      }
    ],
    "hint": "Tay + đất + bói — tay treo dự báo"
  },
  {
    "k": "慣",
    "on": "カン",
    "kun": "な",
    "vn": "Thói quen",
    "strokes": 14,
    "rad": "心",
    "ex": [
      {
        "jp": "なれる",
        "vn": "quen"
      },
      {
        "jp": "しゅうかん",
        "vn": "thói quen"
      }
    ],
    "hint": "Tim + xuyên suốt — tim đã quen theo thói quen"
  },
  {
    "k": "既",
    "on": "キ",
    "kun": "すで",
    "vn": "Đã, Rồi",
    "strokes": 10,
    "rad": "无",
    "ex": [
      {
        "jp": "すでに",
        "vn": "đã, rồi"
      },
      {
        "jp": "きそく",
        "vn": "đã có sẵn"
      }
    ],
    "hint": "Gạo + người no — đã ăn no rồi"
  },
  {
    "k": "奇",
    "on": "キ",
    "kun": "く",
    "vn": "Kỳ lạ, Lẻ",
    "strokes": 8,
    "rad": "大",
    "ex": [
      {
        "jp": "きみょう",
        "vn": "kỳ lạ"
      },
      {
        "jp": "きすう",
        "vn": "số lẻ"
      }
    ],
    "hint": "Có thể + lớn — điều kỳ lạ có thể xảy ra"
  },
  {
    "k": "規",
    "on": "キ",
    "kun": "",
    "vn": "Quy tắc, Tiêu chuẩn",
    "strokes": 11,
    "rad": "見",
    "ex": [
      {
        "jp": "きそく",
        "vn": "quy tắc"
      },
      {
        "jp": "きかく",
        "vn": "quy hoạch"
      }
    ],
    "hint": "Thước + nhìn — nhìn thước đo tiêu chuẩn"
  },
  {
    "k": "危",
    "on": "キ",
    "kun": "あぶ・あや",
    "vn": "Nguy hiểm",
    "strokes": 6,
    "rad": "卩",
    "ex": [
      {
        "jp": "あぶない",
        "vn": "nguy hiểm"
      },
      {
        "jp": "きき",
        "vn": "khủng hoảng"
      }
    ],
    "hint": "Vách đá + người quỳ — đứng ở vách nguy hiểm"
  },
  {
    "k": "喜",
    "on": "キ",
    "kun": "よろこ",
    "vn": "Vui mừng",
    "strokes": 12,
    "rad": "口",
    "ex": [
      {
        "jp": "よろこぶ",
        "vn": "vui mừng"
      },
      {
        "jp": "きしょう",
        "vn": "vui thích"
      }
    ],
    "hint": "Trống + miệng — miệng hát vui như trống"
  },
  {
    "k": "犠",
    "on": "ギ",
    "kun": "",
    "vn": "Hy sinh",
    "strokes": 17,
    "rad": "牛",
    "ex": [
      {
        "jp": "ぎせい",
        "vn": "hy sinh"
      },
      {
        "jp": "ぎせいしゃ",
        "vn": "nạn nhân"
      }
    ],
    "hint": "Trâu bò + nghĩa — con vật hy sinh vì nghĩa"
  },
  {
    "k": "拒",
    "on": "キョ",
    "kun": "こば",
    "vn": "Từ chối",
    "strokes": 8,
    "rad": "扌",
    "ex": [
      {
        "jp": "こばむ",
        "vn": "từ chối"
      },
      {
        "jp": "きょひ",
        "vn": "từ chối"
      }
    ],
    "hint": "Tay + lớn lao — tay đẩy ra từ chối"
  },
  {
    "k": "享",
    "on": "キョウ",
    "kun": "う",
    "vn": "Hưởng thụ",
    "strokes": 8,
    "rad": "亠",
    "ex": [
      {
        "jp": "きょうじゅ",
        "vn": "hưởng thụ"
      },
      {
        "jp": "きょうらく",
        "vn": "hưởng lạc"
      }
    ],
    "hint": "Mái nhà con + trẻ em — mái nhà đủ đầy hưởng thụ"
  },
  {
    "k": "拠",
    "on": "キョ・コ",
    "kun": "よ",
    "vn": "Căn cứ, Dựa vào",
    "strokes": 8,
    "rad": "扌",
    "ex": [
      {
        "jp": "きょてん",
        "vn": "căn cứ địa"
      },
      {
        "jp": "こきょ",
        "vn": "quê hương"
      }
    ],
    "hint": "Tay + cư trú — tay dựa vào nơi cư trú"
  },
  {
    "k": "距",
    "on": "キョ",
    "kun": "へだ",
    "vn": "Khoảng cách",
    "strokes": 12,
    "rad": "足",
    "ex": [
      {
        "jp": "きょり",
        "vn": "khoảng cách"
      },
      {
        "jp": "どきょ",
        "vn": "can đảm"
      }
    ],
    "hint": "Chân + lớn lao — bước chân khoảng cách lớn"
  },
  {
    "k": "均",
    "on": "キン",
    "kun": "なら",
    "vn": "Đều, Bình quân",
    "strokes": 7,
    "rad": "土",
    "ex": [
      {
        "jp": "へいきん",
        "vn": "trung bình"
      },
      {
        "jp": "きんとう",
        "vn": "đồng đều"
      }
    ],
    "hint": "Đất + cân bằng — đất được san phẳng đều nhau"
  },
  {
    "k": "緊",
    "on": "キン",
    "kun": "",
    "vn": "Căng thẳng, Khẩn",
    "strokes": 15,
    "rad": "糸",
    "ex": [
      {
        "jp": "きんちょう",
        "vn": "căng thẳng"
      },
      {
        "jp": "きんきゅう",
        "vn": "khẩn cấp"
      }
    ],
    "hint": "Thần 臣 + sợi chỉ — sợi chỉ kéo căng"
  },
  {
    "k": "掘",
    "on": "クツ",
    "kun": "ほ",
    "vn": "Đào, Khai quật",
    "strokes": 11,
    "rad": "扌",
    "ex": [
      {
        "jp": "ほる",
        "vn": "đào"
      },
      {
        "jp": "はっくつ",
        "vn": "khai quật"
      }
    ],
    "hint": "Tay + khuất phục — tay đào sâu khuất phục đất"
  },
  {
    "k": "傾",
    "on": "ケイ",
    "kun": "かたむ",
    "vn": "Nghiêng, Xu hướng",
    "strokes": 13,
    "rad": "亻",
    "ex": [
      {
        "jp": "かたむく",
        "vn": "nghiêng"
      },
      {
        "jp": "けいこう",
        "vn": "xu hướng"
      }
    ],
    "hint": "Người + bộ phận + đầu — người nghiêng đầu"
  },
  {
    "k": "契",
    "on": "ケイ",
    "kun": "ちぎ",
    "vn": "Hợp đồng, Khế ước",
    "strokes": 9,
    "rad": "大",
    "ex": [
      {
        "jp": "けいやく",
        "vn": "hợp đồng"
      },
      {
        "jp": "ちぎる",
        "vn": "hứa hẹn"
      }
    ],
    "hint": "Khắc + dao + lớn — khắc lên hợp đồng"
  },
  {
    "k": "欠",
    "on": "ケツ",
    "kun": "か",
    "vn": "Thiếu, Khiếm khuyết",
    "strokes": 4,
    "rad": "欠",
    "ex": [
      {
        "jp": "かける",
        "vn": "thiếu"
      },
      {
        "jp": "けってん",
        "vn": "khuyết điểm"
      }
    ],
    "hint": "Người há miệng ngáp — thiếu ngủ mệt mỏi"
  },
  {
    "k": "検",
    "on": "ケン",
    "kun": "",
    "vn": "Kiểm tra, Kiểm soát",
    "strokes": 12,
    "rad": "木",
    "ex": [
      {
        "jp": "けんさ",
        "vn": "kiểm tra"
      },
      {
        "jp": "けんさく",
        "vn": "tìm kiếm"
      }
    ],
    "hint": "Cây + tất cả cùng nhau — kiểm tra từng cái"
  },
  {
    "k": "幻",
    "on": "ゲン",
    "kun": "まぼろし",
    "vn": "Ảo, Huyễn ảo",
    "strokes": 4,
    "rad": "幺",
    "ex": [
      {
        "jp": "まぼろし",
        "vn": "ảo tưởng"
      },
      {
        "jp": "げんそう",
        "vn": "ảo tưởng"
      }
    ],
    "hint": "Sợi nhỏ xoắn — sợi mảnh dễ ảo"
  },
  {
    "k": "誇",
    "on": "コ",
    "kun": "ほこ",
    "vn": "Tự hào, Khoe",
    "strokes": 13,
    "rad": "言",
    "ex": [
      {
        "jp": "ほこる",
        "vn": "tự hào"
      },
      {
        "jp": "こだい",
        "vn": "phóng đại"
      }
    ],
    "hint": "Lời + lớn + sức — lời lẽ tự hào phô trương"
  },
  {
    "k": "巧",
    "on": "コウ",
    "kun": "たく",
    "vn": "Khéo léo",
    "strokes": 5,
    "rad": "工",
    "ex": [
      {
        "jp": "きみょう",
        "vn": "tài khéo"
      },
      {
        "jp": "こうみょう",
        "vn": "khéo léo"
      }
    ],
    "hint": "Công trình + cong — kỹ thuật tinh xảo uốn cong"
  },
  {
    "k": "控",
    "on": "コウ",
    "kun": "ひか",
    "vn": "Kiềm chế, Ghi chép",
    "strokes": 11,
    "rad": "扌",
    "ex": [
      {
        "jp": "ひかえる",
        "vn": "kiềm chế"
      },
      {
        "jp": "こうじょ",
        "vn": "khấu trừ"
      }
    ],
    "hint": "Tay + không 空 — tay giữ khoảng không trống"
  },
  {
    "k": "貢",
    "on": "コウ・ク",
    "kun": "みつ",
    "vn": "Cống nạp, Đóng góp",
    "strokes": 10,
    "rad": "貝",
    "ex": [
      {
        "jp": "こうけん",
        "vn": "đóng góp"
      },
      {
        "jp": "こうきん",
        "vn": "cống nạp"
      }
    ],
    "hint": "Công + tiền 貝 — đóng góp tiền bạc"
  },
  {
    "k": "購",
    "on": "コウ",
    "kun": "",
    "vn": "Mua (lớn)",
    "strokes": 17,
    "rad": "貝",
    "ex": [
      {
        "jp": "こうにゅう",
        "vn": "mua sắm"
      },
      {
        "jp": "こうどく",
        "vn": "đặt mua"
      }
    ],
    "hint": "Tiền 貝 + cấu trúc — cấu trúc mua bán"
  },
  {
    "k": "刻",
    "on": "コク",
    "kun": "きざ",
    "vn": "Khắc, Khắc sâu",
    "strokes": 8,
    "rad": "刀",
    "ex": [
      {
        "jp": "じかん",
        "vn": "thời gian"
      },
      {
        "jp": "きざむ",
        "vn": "khắc"
      }
    ],
    "hint": "Lợn + dao — khắc hình lợn bằng dao"
  },
  {
    "k": "込",
    "on": "コム",
    "kun": "こ",
    "vn": "Nhét vào, Đông đúc",
    "strokes": 5,
    "rad": "辶",
    "ex": [
      {
        "jp": "こむ",
        "vn": "đông đúc"
      },
      {
        "jp": "はこむ",
        "vn": "nhét vào"
      }
    ],
    "hint": "Đi vào 入 + đường — đi vào trong"
  },
  {
    "k": "採",
    "on": "サイ",
    "kun": "と",
    "vn": "Lấy, Thu thập",
    "strokes": 11,
    "rad": "扌",
    "ex": [
      {
        "jp": "さいよう",
        "vn": "tuyển dụng"
      },
      {
        "jp": "とる",
        "vn": "lấy"
      }
    ],
    "hint": "Tay + cây — tay hái từ cây"
  },
  {
    "k": "載",
    "on": "サイ",
    "kun": "の",
    "vn": "Chở, Đăng tải",
    "strokes": 13,
    "rad": "車",
    "ex": [
      {
        "jp": "きさい",
        "vn": "đăng tải"
      },
      {
        "jp": "どうさい",
        "vn": "cùng đăng"
      }
    ],
    "hint": "Xe + đất + dao — xe chở đồ"
  },
  {
    "k": "察",
    "on": "サツ",
    "kun": "",
    "vn": "Quan sát, Đoán",
    "strokes": 14,
    "rad": "宀",
    "ex": [
      {
        "jp": "けいさつ",
        "vn": "cảnh sát"
      },
      {
        "jp": "かんさつ",
        "vn": "quan sát"
      }
    ],
    "hint": "Mái nhà + lễ + dao — quan sát từ trên nhà"
  },
  {
    "k": "測",
    "on": "ソク",
    "kun": "はか",
    "vn": "Đo lường, Đo",
    "strokes": 12,
    "rad": "氵",
    "ex": [
      {
        "jp": "そくてい",
        "vn": "đo lường"
      },
      {
        "jp": "そくりょう",
        "vn": "trắc địa"
      }
    ],
    "hint": "Thủy 氵 + quy tắc 則 — dùng nước làm chuẩn đo"
  }
];
 
// ════════════════════════════════════════════════════════════════
// KANJI N1 — 80 chữ cấp cao nhất
// ════════════════════════════════════════════════════════════════
const KANJI_N1 = [
  {
    "k": "阿",
    "on": "ア・アク",
    "kun": "おもね",
    "vn": "A (tiền tố), Nịnh hót",
    "strokes": 8,
    "rad": "阝",
    "ex": [
      {
        "jp": "あびる",
        "vn": "tắm (xưa)"
      },
      {
        "jp": "あだち",
        "vn": "địa danh Adachi"
      }
    ],
    "hint": "Gò đất + có thể — gò đất thuận tiện"
  },
  {
    "k": "哀",
    "on": "アイ",
    "kun": "あわ",
    "vn": "Buồn thương",
    "strokes": 9,
    "rad": "口",
    "ex": [
      {
        "jp": "かなしい",
        "vn": "buồn"
      },
      {
        "jp": "あいしゅう",
        "vn": "nỗi buồn thương"
      }
    ],
    "hint": "Miệng trong áo — tiếng khóc bị áo che lại"
  },
  {
    "k": "暗",
    "on": "アン",
    "kun": "くら",
    "vn": "Tối, Bí mật",
    "strokes": 13,
    "rad": "日",
    "ex": [
      {
        "jp": "くらい",
        "vn": "tối tăm"
      },
      {
        "jp": "あんき",
        "vn": "học thuộc lòng"
      }
    ],
    "hint": "Mặt trời + âm thanh — mặt trời bị âm thanh che = tối"
  },
  {
    "k": "維",
    "on": "イ",
    "kun": "",
    "vn": "Duy trì, Sợi",
    "strokes": 14,
    "rad": "糸",
    "ex": [
      {
        "jp": "いじする",
        "vn": "duy trì"
      },
      {
        "jp": "せんい",
        "vn": "sợi vải"
      }
    ],
    "hint": "Sợi chỉ + chim — sợi chỉ giữ chim lại"
  },
  {
    "k": "偉",
    "on": "イ",
    "kun": "えら",
    "vn": "Vĩ đại, Xuất chúng",
    "strokes": 12,
    "rad": "亻",
    "ex": [
      {
        "jp": "えらい",
        "vn": "vĩ đại"
      },
      {
        "jp": "いじん",
        "vn": "vĩ nhân"
      }
    ],
    "hint": "Người + to lớn uốn — người vĩ đại uốn cong lịch sử"
  },
  {
    "k": "萎",
    "on": "イ",
    "kun": "しお・な",
    "vn": "Héo úa, Suy yếu",
    "strokes": 11,
    "rad": "艹",
    "ex": [
      {
        "jp": "なえる",
        "vn": "héo"
      },
      {
        "jp": "いしゅく",
        "vn": "teo nhỏ lại"
      }
    ],
    "hint": "Cỏ + ủy mị — cỏ héo úa ủy mị"
  },
  {
    "k": "壱",
    "on": "イチ",
    "kun": "",
    "vn": "Một (dạng cổ để viết hợp đồng)",
    "strokes": 7,
    "rad": "士",
    "ex": [
      {
        "jp": "いちまんえん",
        "vn": "10,000 yên"
      },
      {
        "jp": "だいいち",
        "vn": "thứ nhất"
      }
    ],
    "hint": "Chữ Nhất phức tạp hóa để tránh giả mạo"
  },
  {
    "k": "逸",
    "on": "イツ",
    "kun": "そ",
    "vn": "Xuất sắc, Lạc mất",
    "strokes": 11,
    "rad": "辶",
    "ex": [
      {
        "jp": "いつわ",
        "vn": "giai thoại"
      },
      {
        "jp": "いっぴん",
        "vn": "tuyệt phẩm"
      }
    ],
    "hint": "Thỏ + đường — thỏ chạy thoát mất"
  },
  {
    "k": "芋",
    "on": "ウ",
    "kun": "いも",
    "vn": "Khoai",
    "strokes": 6,
    "rad": "艹",
    "ex": [
      {
        "jp": "さつまいも",
        "vn": "khoai lang"
      },
      {
        "jp": "いもほり",
        "vn": "đào khoai"
      }
    ],
    "hint": "Cỏ + vu vơ — củ mọc trong đất"
  },
  {
    "k": "渦",
    "on": "カ",
    "kun": "うず",
    "vn": "Xoáy nước, Vũng xoáy",
    "strokes": 12,
    "rad": "氵",
    "ex": [
      {
        "jp": "うずまき",
        "vn": "xoáy nước"
      },
      {
        "jp": "うずしお",
        "vn": "thủy triều xoáy"
      }
    ],
    "hint": "Nước + trong vòng — nước xoáy vòng"
  },
  {
    "k": "嘉",
    "on": "カ",
    "kun": "よ",
    "vn": "Tốt lành, Hạnh phúc",
    "strokes": 14,
    "rad": "口",
    "ex": [
      {
        "jp": "しゅくが",
        "vn": "chúc mừng"
      },
      {
        "jp": "かのう",
        "vn": "Kanō (họ)"
      }
    ],
    "hint": "Thêm vào + miệng + trống — ca ngợi điều tốt lành"
  },
  {
    "k": "架",
    "on": "カ",
    "kun": "か",
    "vn": "Giá đỡ, Bắc (cầu)",
    "strokes": 9,
    "rad": "木",
    "ex": [
      {
        "jp": "かせつ",
        "vn": "thiết lập tạm"
      },
      {
        "jp": "こうか",
        "vn": "đường trên cao"
      }
    ],
    "hint": "Thêm vào + cây — gỗ thêm vào bắc qua"
  },
  {
    "k": "禍",
    "on": "カ",
    "kun": "わざわ",
    "vn": "Tai họa, Thảm họa",
    "strokes": 13,
    "rad": "示",
    "ex": [
      {
        "jp": "わざわい",
        "vn": "tai họa"
      },
      {
        "jp": "かもつ",
        "vn": "hàng hóa bị vạ"
      }
    ],
    "hint": "Thần + xoáy — thần gieo tai họa như xoáy nước"
  },
  {
    "k": "稼",
    "on": "カ",
    "kun": "かせ",
    "vn": "Kiếm sống, Lao động",
    "strokes": 15,
    "rad": "禾",
    "ex": [
      {
        "jp": "かせぐ",
        "vn": "kiếm tiền"
      },
      {
        "jp": "しゅうにゅう",
        "vn": "thu nhập"
      }
    ],
    "hint": "Lúa + nhà có lợn — trồng lúa kiếm sống"
  },
  {
    "k": "寡",
    "on": "カ",
    "kun": "やもめ",
    "vn": "Ít, Góa",
    "strokes": 14,
    "rad": "宀",
    "ex": [
      {
        "jp": "かふ",
        "vn": "góa phụ"
      },
      {
        "jp": "かもく",
        "vn": "ít nói"
      }
    ],
    "hint": "Mái nhà + đầu lâu + chia — ít người trong nhà"
  },
  {
    "k": "棄",
    "on": "キ",
    "kun": "す",
    "vn": "Từ bỏ, Vứt bỏ",
    "strokes": 13,
    "rad": "木",
    "ex": [
      {
        "jp": "きけん",
        "vn": "từ bỏ quyền"
      },
      {
        "jp": "はきする",
        "vn": "bác bỏ"
      }
    ],
    "hint": "Sinh + lông + cây — bỏ cây con non yếu"
  },
  {
    "k": "忌",
    "on": "キ",
    "kun": "い",
    "vn": "Kiêng kỵ, Ghét",
    "strokes": 7,
    "rad": "心",
    "ex": [
      {
        "jp": "きにち",
        "vn": "ngày kỵ"
      },
      {
        "jp": "いまわしい",
        "vn": "đáng ghét"
      }
    ],
    "hint": "Bản thân 己 + tim — tim ghét chính mình"
  },
  {
    "k": "詭",
    "on": "キ",
    "kun": "あざむ",
    "vn": "Lừa dối, Kỳ quặc",
    "strokes": 13,
    "rad": "言",
    "ex": [
      {
        "jp": "きべん",
        "vn": "ngụy biện"
      },
      {
        "jp": "きへい",
        "vn": "quân kỳ binh"
      }
    ],
    "hint": "Lời + quỷ — lời lẽ quỷ quyệt lừa dối"
  },
  {
    "k": "虐",
    "on": "ギャク",
    "kun": "しいた",
    "vn": "Tàn ác, Bạo hành",
    "strokes": 9,
    "rad": "虍",
    "ex": [
      {
        "jp": "ぎゃくたい",
        "vn": "bạo hành"
      },
      {
        "jp": "ざんぎゃく",
        "vn": "tàn bạo"
      }
    ],
    "hint": "Hổ + trái + cào — hổ cào cấu tàn ác"
  },
  {
    "k": "凶",
    "on": "キョウ",
    "kun": "",
    "vn": "Hung dữ, Xui xẻo",
    "strokes": 4,
    "rad": "凵",
    "ex": [
      {
        "jp": "きょうあく",
        "vn": "hung ác"
      },
      {
        "jp": "きょうじん",
        "vn": "tên hung thần"
      }
    ],
    "hint": "Hố + dấu thập — dấu X trong hố = xui"
  },
  {
    "k": "暁",
    "on": "ギョウ",
    "kun": "あかつき",
    "vn": "Bình minh, Biết rõ",
    "strokes": 12,
    "rad": "日",
    "ex": [
      {
        "jp": "あかつき",
        "vn": "bình minh"
      },
      {
        "jp": "かいぎょう",
        "vn": "nhận thức rõ"
      }
    ],
    "hint": "Mặt trời + nâu sắc — ánh sáng đỏ bình minh"
  },
  {
    "k": "僅",
    "on": "キン",
    "kun": "わず",
    "vn": "Chỉ, Vừa vặn",
    "strokes": 13,
    "rad": "亻",
    "ex": [
      {
        "jp": "わずか",
        "vn": "chỉ một chút"
      },
      {
        "jp": "きんさ",
        "vn": "chênh lệch ít"
      }
    ],
    "hint": "Người + khẩn cấp + vải — người chỉ có tí vải"
  },
  {
    "k": "薫",
    "on": "クン",
    "kun": "かお",
    "vn": "Hương thơm, Xông hương",
    "strokes": 16,
    "rad": "艹",
    "ex": [
      {
        "jp": "かおる",
        "vn": "tỏa hương"
      },
      {
        "jp": "くんしゅう",
        "vn": "xông hương"
      }
    ],
    "hint": "Cỏ + lửa — hun khói thơm từ cỏ"
  },
  {
    "k": "繰",
    "on": "ソウ",
    "kun": "く",
    "vn": "Cuộn, Kéo sợi",
    "strokes": 19,
    "rad": "糸",
    "ex": [
      {
        "jp": "くりかえす",
        "vn": "lặp lại"
      },
      {
        "jp": "くりだす",
        "vn": "kéo ra"
      }
    ],
    "hint": "Sợi chỉ + táo — cuộn sợi chỉ từ kén tằm"
  },
  {
    "k": "傑",
    "on": "ケツ",
    "kun": "",
    "vn": "Kiệt xuất, Anh hùng",
    "strokes": 13,
    "rad": "亻",
    "ex": [
      {
        "jp": "えいけつ",
        "vn": "anh hùng"
      },
      {
        "jp": "けっさく",
        "vn": "tuyệt tác"
      }
    ],
    "hint": "Người + khéo léo + cây — người xuất chúng như cây cao"
  },
  {
    "k": "謙",
    "on": "ケン",
    "kun": "へりくだ",
    "vn": "Khiêm tốn",
    "strokes": 17,
    "rad": "言",
    "ex": [
      {
        "jp": "けんきょ",
        "vn": "khiêm tốn"
      },
      {
        "jp": "けんそん",
        "vn": "nhún nhường"
      }
    ],
    "hint": "Lời + cầm + đất — lời nói khiêm tốn như đất"
  },
  {
    "k": "顕",
    "on": "ケン",
    "kun": "あらわ",
    "vn": "Hiển rõ, Nổi bật",
    "strokes": 18,
    "rad": "頁",
    "ex": [
      {
        "jp": "けんちょ",
        "vn": "nổi bật"
      },
      {
        "jp": "けんびきょう",
        "vn": "kính hiển vi"
      }
    ],
    "hint": "Hiển thị + đầu — đầu nổi bật hiển rõ"
  },
  {
    "k": "懸",
    "on": "ケン・カイ",
    "kun": "か",
    "vn": "Treo lơ lửng, Lo lắng",
    "strokes": 20,
    "rad": "心",
    "ex": [
      {
        "jp": "けねん",
        "vn": "lo lắng"
      },
      {
        "jp": "けんめい",
        "vn": "cố hết sức"
      }
    ],
    "hint": "Huyện + tim — tim lơ lửng lo lắng"
  },
  {
    "k": "乾",
    "on": "カン・ケン",
    "kun": "かわ",
    "vn": "Khô, Cạn",
    "strokes": 11,
    "rad": "乙",
    "ex": [
      {
        "jp": "かわく",
        "vn": "khô"
      },
      {
        "jp": "かんそう",
        "vn": "khô ráo"
      }
    ],
    "hint": "Cây non + mặt trời — cây non khô dưới nắng"
  },
  {
    "k": "孤",
    "on": "コ",
    "kun": "",
    "vn": "Cô đơn, Mồ côi",
    "strokes": 9,
    "rad": "子",
    "ex": [
      {
        "jp": "こどく",
        "vn": "cô đơn"
      },
      {
        "jp": "こじ",
        "vn": "mồ côi"
      }
    ],
    "hint": "Con + bầu — đứa con bơ vơ như bầu trơ trọi"
  },
  {
    "k": "弧",
    "on": "コ",
    "kun": "",
    "vn": "Cung (hình học)",
    "strokes": 9,
    "rad": "弓",
    "ex": [
      {
        "jp": "こど",
        "vn": "cung độ"
      },
      {
        "jp": "えんこ",
        "vn": "cung tròn"
      }
    ],
    "hint": "Cung + bầu — hình cong như bầu"
  },
  {
    "k": "袴",
    "on": "コ",
    "kun": "はかま",
    "vn": "Hakama (quần truyền thống)",
    "strokes": 11,
    "rad": "衣",
    "ex": [
      {
        "jp": "はかま",
        "vn": "hakama"
      },
      {
        "jp": "うまのり",
        "vn": "mặc khi cưỡi ngựa"
      }
    ],
    "hint": "Áo + hổ — áo quần mặc khi chiến đấu"
  },
  {
    "k": "碁",
    "on": "ゴ",
    "kun": "",
    "vn": "Cờ vây (game)",
    "strokes": 13,
    "rad": "石",
    "ex": [
      {
        "jp": "いご",
        "vn": "cờ vây"
      },
      {
        "jp": "ごばん",
        "vn": "bàn cờ vây"
      }
    ],
    "hint": "Đá + đứng vững — viên đá đứng vững trên bàn cờ"
  },
  {
    "k": "拷",
    "on": "ゴウ",
    "kun": "",
    "vn": "Tra tấn",
    "strokes": 9,
    "rad": "扌",
    "ex": [
      {
        "jp": "ごうもん",
        "vn": "tra tấn"
      },
      {
        "jp": "ごうかん",
        "vn": "hỏi cung"
      }
    ],
    "hint": "Tay + giao kết — tra tấn bằng tay bắt buộc khai"
  },
  {
    "k": "傲",
    "on": "ゴウ",
    "kun": "おご",
    "vn": "Kiêu ngạo",
    "strokes": 13,
    "rad": "亻",
    "ex": [
      {
        "jp": "ごうまん",
        "vn": "kiêu ngạo"
      },
      {
        "jp": "おごる",
        "vn": "kiêu căng"
      }
    ],
    "hint": "Người + đất + mỗi + sức — người kiêu ngạo tự phụ"
  },
  {
    "k": "酷",
    "on": "コク",
    "kun": "ひど",
    "vn": "Tàn nhẫn, Khắc nghiệt",
    "strokes": 14,
    "rad": "酉",
    "ex": [
      {
        "jp": "ひどい",
        "vn": "tàn nhẫn"
      },
      {
        "jp": "さんこく",
        "vn": "tàn khốc"
      }
    ],
    "hint": "Rượu + nhận xét — rượu mạnh nhận xét khắc nghiệt"
  },
  {
    "k": "惨",
    "on": "サン・ザン",
    "kun": "みじ",
    "vn": "Thảm, Khốn khổ",
    "strokes": 11,
    "rad": "心",
    "ex": [
      {
        "jp": "さんか",
        "vn": "thảm họa"
      },
      {
        "jp": "みじめ",
        "vn": "khốn khổ"
      }
    ],
    "hint": "Tim + ba người — tim đau khi ba người cùng khổ"
  },
  {
    "k": "詐",
    "on": "サ",
    "kun": "いつわ",
    "vn": "Gian lận, Lừa đảo",
    "strokes": 12,
    "rad": "言",
    "ex": [
      {
        "jp": "さぎ",
        "vn": "lừa đảo"
      },
      {
        "jp": "さしょう",
        "vn": "giả mạo"
      }
    ],
    "hint": "Lời + tác thành — tạo lời giả"
  },
  {
    "k": "挫",
    "on": "ザ",
    "kun": "くじ",
    "vn": "Thất bại, Trật khớp",
    "strokes": 10,
    "rad": "扌",
    "ex": [
      {
        "jp": "ざせつ",
        "vn": "thất bại"
      },
      {
        "jp": "くじける",
        "vn": "nản lòng"
      }
    ],
    "hint": "Tay + ngồi — tay ngồi bịt = bị chặn"
  }
];

// ═════════════════════════════════════════════════════════════════════════════
// SPECIALIZED VOCABULARY DATASETS (TỪ VỰNG CHUYÊN NGÀNH)
// ═════════════════════════════════════════════════════════════════════════════
const VOCAB_IT = [
  {
    "jp": "仕様書",
    "rom": "shiyousho",
    "vn": "Tài liệu đặc tả (Spec)",
    "ex": "仕様書をしっかり確認してから実装に入ります。",
    "exVn": "Xác nhận kỹ tài liệu đặc tả trước khi bắt đầu triển khai."
  },
  {
    "jp": "構築",
    "rom": "kouchiku",
    "vn": "Xây dựng hệ thống (Infrastructure/System)",
    "ex": "クラウド環境でサーバーを構築する。",
    "exVn": "Xây dựng máy chủ trên môi trường điện toán đám mây."
  },
  {
    "jp": "障害",
    "rom": "shougai",
    "vn": "Sự cố hệ thống, Lỗi nghiêm trọng (Incident/Bug)",
    "ex": "サーバー障害が発生し、緊急対応中だ。",
    "exVn": "Xảy ra sự cố máy chủ và đang xử lý khẩn cấp."
  },
  {
    "jp": "本番環境",
    "rom": "hombankankyou",
    "vn": "Môi trường Production (Live environment)",
    "ex": "本番環境へリリースを行います。",
    "exVn": "Tiến hành phát hành lên môi trường thật (Production)."
  },
  {
    "jp": "検証環境",
    "rom": "kenshoukankyou",
    "vn": "Môi trường Staging / Testing",
    "ex": "検証環境でバグの修正を確認した。",
    "exVn": "Đã xác nhận sửa lỗi trên môi trường kiểm thử."
  },
  {
    "jp": "暗号化",
    "rom": "angouka",
    "vn": "Mã hóa dữ liệu (Encryption)",
    "ex": "個人情報を暗号化して保存する。",
    "exVn": "Mã hóa thông tin cá nhân trước khi lưu trữ."
  },
  {
    "jp": "復号",
    "rom": "fukugou",
    "vn": "Giải mã (Decryption)",
    "ex": "鍵を使ってデータを復号する。",
    "exVn": "Dùng khóa để giải mã dữ liệu."
  },
  {
    "jp": "統合テスト",
    "rom": "tougoutesuto",
    "vn": "Kiểm thử tích hợp hệ thống",
    "ex": "来週から統合テストフェーズを開始します。",
    "exVn": "Bắt đầu giai đoạn kiểm thử tích hợp từ tuần tới."
  },
  {
    "jp": "要件定義",
    "rom": "youkenteigi",
    "vn": "Định nghĩa yêu cầu khách hàng (Requirement)",
    "ex": "要件定義書をお客様とすり合わせる。",
    "exVn": "Thống nhất tài liệu định nghĩa yêu cầu với khách hàng."
  },
  {
    "jp": "保守",
    "rom": "hoshu",
    "vn": "Bảo trì và vận hành hệ thống",
    "ex": "システムの保守運用を担当しています。",
    "exVn": "Tôi phụ trách việc vận hành và bảo trì hệ thống."
  },
  {
    "jp": "変数",
    "rom": "hensuu",
    "vn": "Biến số (Variable)",
    "ex": "変数の名前はわかりやすく命名してください。",
    "exVn": "Hãy đặt tên biến một cách dễ hiểu."
  },
  {
    "jp": "関数",
    "rom": "kansuu",
    "vn": "Hàm, hàm số (Function)",
    "ex": "共通の処理を関数に切り出します。",
    "exVn": "Tách các xử lý dùng chung thành một hàm."
  },
  {
    "jp": "例外処理",
    "rom": "reigaishori",
    "vn": "Xử lý ngoại lệ (Exception handling)",
    "ex": "想定外のエラーに対する例外処理を追加する。",
    "exVn": "Bổ sung xử lý ngoại lệ cho các lỗi ngoài dự kiến."
  },
  {
    "jp": "引数",
    "rom": "hikisuu",
    "vn": "Tham số truyền vào (Argument / Parameter)",
    "ex": "関数に必要な引数を渡します。",
    "exVn": "Truyền các tham số cần thiết vào hàm."
  },
  {
    "jp": "返り値",
    "rom": "kaerichi",
    "vn": "Giá trị trả về (Return value)",
    "ex": "処理が成功した場合、trueを返り値とする。",
    "exVn": "Nếu xử lý thành công, trả về giá trị là true."
  },
  {
    "jp": "反復",
    "rom": "hampuku",
    "vn": "Vòng lặp, lặp lại (Loop / Iteration)",
    "ex": "配列の要素を反復処理で走査する。",
    "exVn": "Duyệt qua các phần tử của mảng bằng xử lý vòng lặp."
  },
  {
    "jp": "脆弱性",
    "rom": "zeijakusei",
    "vn": "Lỗ hổng bảo mật (Vulnerability)",
    "ex": "定期的に脆弱性の診断を実施しています。",
    "exVn": "Định kỳ thực hiện rà soát lỗ hổng bảo mật."
  },
  {
    "jp": "分散処理",
    "rom": "bunsanshori",
    "vn": "Xử lý phân tán (Distributed computing)",
    "ex": "大量のアクセスを分散処理でさばく。",
    "exVn": "Giải quyết lượng truy cập lớn bằng xử lý phân tán."
  },
  {
    "jp": "認証",
    "rom": "ninshou",
    "vn": "Xác thực danh tính (Authentication)",
    "ex": "二要素認証を導入してセキュリティを高める。",
    "exVn": "Áp dụng xác thực hai yếu tố để nâng cao bảo mật."
  },
  {
    "jp": "認可",
    "rom": "ninka",
    "vn": "Cấp quyền truy cập (Authorization)",
    "ex": "管理者のみに操作の認可を与える。",
    "exVn": "Chỉ cấp quyền thao tác cho người quản trị."
  },
  {
    "jp": "同期",
    "rom": "douki",
    "vn": "Đồng bộ (Synchronous)",
    "ex": "クライアントとサーバーのデータを同期する。",
    "exVn": "Đồng bộ hóa dữ liệu giữa máy khách và máy chủ."
  },
  {
    "jp": "非同期",
    "rom": "hidouki",
    "vn": "Bất đồng bộ (Asynchronous)",
    "ex": "非同期通信で画面をリロードせずに更新する。",
    "exVn": "Cập nhật không cần tải lại trang bằng truyền thông bất đồng bộ."
  },
  {
    "jp": "静的解析",
    "rom": "seitekikaiseki",
    "vn": "Phân tích mã tĩnh (Static analysis)",
    "ex": "コードコミット時に静的解析ツールを実行する。",
    "exVn": "Chạy công cụ phân tích tĩnh khi commit mã nguồn."
  },
  {
    "jp": "負荷分散",
    "rom": "fukabunsan",
    "vn": "Cân bằng tải (Load balancing)",
    "ex": "ロードバランサーで負荷分散を行う。",
    "exVn": "Thực hiện cân bằng tải bằng Load Balancer."
  },
  {
    "jp": "冗長化",
    "rom": "jouchouka",
    "vn": "Dự phòng / Dự phòng kép (Redundancy)",
    "ex": "データベースを冗長化して耐障害性を向上させる。",
    "exVn": "Dự phòng cơ sở dữ liệu để nâng cao khả năng chịu lỗi."
  },
  {
    "jp": "設計書",
    "rom": "sekkeisho",
    "vn": "Tài liệu thiết kế kiến trúc hệ thống",
    "ex": "基本設計書と詳細設計書を作成します。",
    "exVn": "Tạo tài liệu thiết kế cơ bản và thiết kế chi tiết."
  },
  {
    "jp": "デプロイ",
    "rom": "depuroi",
    "vn": "Triển khai phần mềm (Deploy)",
    "ex": "金曜日の夕方はデプロイを避けてください。",
    "exVn": "Hãy tránh deploy vào chiều thứ Sáu."
  },
  {
    "jp": "データベース",
    "rom": "de-tabe-su",
    "vn": "Cơ sở dữ liệu (Database / DB)",
    "ex": "データベースのインデックスを再構築する。",
    "exVn": "Tái tạo chỉ mục (index) của cơ sở dữ liệu."
  },
  {
    "jp": "移行",
    "rom": "ikou",
    "vn": "Di chuyển dữ liệu/hệ thống (Migration)",
    "ex": "旧システムから新環境へのデータ移行が完了した。",
    "exVn": "Đã hoàn thành chuyển đổi dữ liệu từ hệ thống cũ sang môi trường mới."
  },
  {
    "jp": "リファクタリング",
    "rom": "rifakutaringu",
    "vn": "Tối ưu hóa mã nguồn (Refactoring)",
    "ex": "動作を変えずに可読性を上げるためリファクタリングする。",
    "exVn": "Tái cấu trúc để tăng tính dễ đọc mà không đổi chức năng."
  },
  {
    "jp": "単体テスト",
    "rom": "tantaitesuto",
    "vn": "Kiểm thử đơn vị (Unit Test)",
    "ex": "単体テストのカバレッジを80%以上に保つ。",
    "exVn": "Duy trì tỷ lệ bao phủ của kiểm thử đơn vị trên 80%."
  },
  {
    "jp": "結合テスト",
    "rom": "ketsugoutesuto",
    "vn": "Kiểm thử tích hợp (Integration Test)",
    "ex": "APIとの連携部分を結合テストで検証します。",
    "exVn": "Kiểm tra phần liên kết với API bằng bài test tích hợp."
  },
  {
    "jp": "受入テスト",
    "rom": "ukeiretesuto",
    "vn": "Kiểm thử nghiệm thu khách hàng (UAT)",
    "ex": "お客様による受入テストが無事に合格しました。",
    "exVn": "Bài kiểm thử nghiệm thu của khách hàng đã đạt yêu cầu suôn sẻ."
  },
  {
    "jp": "工数",
    "rom": "kousuu",
    "vn": "Khối lượng công việc / Man-month / Man-day",
    "ex": "この機能の開発には約3人月の工数を見積もっています。",
    "exVn": "Ước tính tính năng này cần khoảng 3 người/tháng công sức."
  },
  {
    "jp": "納期",
    "rom": "nouki",
    "vn": "Thời hạn bàn giao (Deadline / Delivery date)",
    "ex": "納期に間に合わせるため優先度を再調整する。",
    "exVn": "Tái điều chỉnh độ ưu tiên để kịp thời hạn bàn giao."
  },
  {
    "jp": "成果物",
    "rom": "seikabutsu",
    "vn": "Thành phẩm / Sản phẩm bàn giao (Deliverables)",
    "ex": "納品期日までにすべての成果物を提出します。",
    "exVn": "Nộp toàn bộ các sản phẩm bàn giao trước ngày giao hàng."
  },
  {
    "jp": "進捗",
    "rom": "shinchoku",
    "vn": "Tiến độ công việc (Progress)",
    "ex": "毎朝10分間の朝会で進捗状況を共有する。",
    "exVn": "Chia sẻ tình hình tiến độ trong cuộc họp ngắn 10 phút mỗi sáng."
  },
  {
    "jp": "不具合",
    "rom": "fuguai",
    "vn": "Lỗi phần mềm, khiếm khuyết (Bug / Defect)",
    "ex": "本番環境で致命的な不具合が見つかりました。",
    "exVn": "Phát hiện một lỗi nghiêm trọng trên môi trường Production."
  },
  {
    "jp": "改修",
    "rom": "kaishuu",
    "vn": "Sửa đổi, nâng cấp chức năng (Fix / Enhancement)",
    "ex": "ユーザーの要望に基づき画面デザインを改修する。",
    "exVn": "Sửa đổi giao diện màn hình dựa theo nguyện vọng của người dùng."
  },
  {
    "jp": "権限",
    "rom": "kengen",
    "vn": "Quyền hạn tài khoản (Permission / Role)",
    "ex": "一般ユーザーには閲覧権限のみを付与する。",
    "exVn": "Chỉ cấp quyền xem đối với người dùng thông thường."
  },
  {
    "jp": "仮想化",
    "rom": "kasouka",
    "vn": "Ảo hóa máy chủ / phần mềm (Virtualization)",
    "ex": "サーバーを仮想化して運用コストを削減する。",
    "exVn": "Ảo hóa máy chủ để cắt giảm chi phí vận hành."
  },
  {
    "jp": "コンテナ",
    "rom": "kontena",
    "vn": "Vùng chứa ứng dụng (Container / Docker)",
    "ex": "Dockerコンテナを用いて環境差異をなくす。",
    "exVn": "Dùng Docker container để loại bỏ sự khác biệt môi trường."
  },
  {
    "jp": "通信速度",
    "rom": "tsuushinsokudo",
    "vn": "Tốc độ truyền mạng (Network speed)",
    "ex": "通信速度が低下している原因を調査しています。",
    "exVn": "Đang điều tra nguyên nhân khiến tốc độ mạng bị chậm."
  },
  {
    "jp": "帯域幅",
    "rom": "taiikihaba",
    "vn": "Băng thông mạng (Bandwidth)",
    "ex": "トラフィックの急増に備えて帯域幅を拡張する。",
    "exVn": "Mở rộng băng thông để chuẩn bị cho lưu lượng truy cập tăng vọt."
  },
  {
    "jp": "ログ解析",
    "rom": "rogukaiseki",
    "vn": "Phân tích nhật ký hệ thống (Log analysis)",
    "ex": "エラーログを解析して障害の発生箇所を特定した。",
    "exVn": "Phân tích log lỗi để xác định chính xác vị trí xảy ra sự cố."
  },
  {
    "jp": "復旧",
    "rom": "fukkyuu",
    "vn": "Khôi phục hệ thống (Recovery / Restore)",
    "ex": "バックアップデータから迅速にシステムを復旧させた。",
    "exVn": "Đã nhanh chóng khôi phục hệ thống từ dữ liệu sao lưu dự phòng."
  },
  {
    "jp": "互換性",
    "rom": "gokansei",
    "vn": "Tính tương thích (Compatibility)",
    "ex": "新バージョンでも旧ブラウザとの互換性を維持する。",
    "exVn": "Duy trì khả năng tương thích với trình duyệt cũ ở phiên bản mới."
  },
  {
    "jp": "多言語対応",
    "rom": "tagengotaiou",
    "vn": "Hỗ trợ đa ngôn ngữ (Localization / i18n)",
    "ex": "アプリを日本語と英語の多言語対応にする。",
    "exVn": "Hỗ trợ ứng dụng đa ngôn ngữ tiếng Nhật và tiếng Anh."
  },
  {
    "jp": "拡張機能",
    "rom": "kakuchoukinou",
    "vn": "Tiện ích mở rộng, phần bổ trợ (Plugin / Extension)",
    "ex": "エディタに便利な拡張機能をインストールした。",
    "exVn": "Đã cài đặt tiện ích mở rộng tiện lợi vào trình soạn thảo code."
  },
  {
    "jp": "直列処理",
    "rom": "chokuretsushori",
    "vn": "Xử lý tuần tự / nối tiếp (Serial processing)",
    "ex": "依存関係のあるタスクは直列処理で行います。",
    "exVn": "Các tác vụ có quan hệ phụ thuộc sẽ được xử lý tuần tự."
  },
  {
    "jp": "並列処理",
    "rom": "heiretsushori",
    "vn": "Xử lý song song (Parallel processing)",
    "ex": "マルチスレッドで並列処理を実行して高速化を図る。",
    "exVn": "Tăng tốc bằng cách thực hiện xử lý song song đa luồng."
  }
];

const VOCAB_RESTAURANT = [
  {
    "jp": "厨房",
    "rom": "chuubou",
    "vn": "Nhà bếp, gian bếp nấu",
    "ex": "厨房内は常に清潔に保たなければなりません。",
    "exVn": "Bên trong gian bếp lúc nào cũng phải giữ gìn sạch sẽ."
  },
  {
    "jp": "仕込み",
    "rom": "shikomi",
    "vn": "Sơ chế nguyên liệu trước giờ mở cửa",
    "ex": "毎朝開店の2時間前から仕込みを始めます。",
    "exVn": "Mỗi sáng bắt đầu sơ chế nguyên liệu trước giờ mở cửa 2 tiếng."
  },
  {
    "jp": "調理",
    "rom": "chouri",
    "vn": "Nấu nướng, chế biến món ăn",
    "ex": "正しい手順で安全に調理を行う。",
    "exVn": "Thực hiện nấu nướng an toàn theo đúng quy trình."
  },
  {
    "jp": "炒める",
    "rom": "itameru",
    "vn": "Xào nhanh trên lửa lớn",
    "ex": "強火で野菜を手早く炒めます。",
    "exVn": "Xào rau nhanh tay trên ngọn lửa lớn."
  },
  {
    "jp": "煮る",
    "rom": "niru",
    "vn": "Kho, nấu, hầm kỹ",
    "ex": "弱火で味が染み込むまでじっくり煮る。",
    "exVn": "Kho nhỏ lửa cho đến khi gia vị ngấm đều."
  },
  {
    "jp": "蒸す",
    "rom": "musu",
    "vn": "Hấp cách thủy bằng hơi nước",
    "ex": "蒸し器で15分ほどふっくらと蒸します。",
    "exVn": "Hấp trong nồi hấp khoảng 15 phút cho chín mềm xốp."
  },
  {
    "jp": "揚げる",
    "rom": "ageru",
    "vn": "Chiên ngập dầu (Rán giòn)",
    "ex": "180度の油でカラッと揚げてください。",
    "exVn": "Hãy chiên ngập dầu ở nhiệt độ 180 độ C cho giòn rụm."
  },
  {
    "jp": "調味料",
    "rom": "choumiryou",
    "vn": "Gia vị nêm nếm",
    "ex": "料理の基本は調味料のバランスです。",
    "exVn": "Nền tảng của nấu ăn là sự cân bằng giữa các loại gia vị."
  },
  {
    "jp": "盛り付け",
    "rom": "moritsuke",
    "vn": "Bày trí món ăn lên đĩa",
    "ex": "彩りよくきれいに盛り付けてください。",
    "exVn": "Hãy bày trí món ăn lên đĩa thật đẹp mắt và hài hòa màu sắc."
  },
  {
    "jp": "衛生管理",
    "rom": "eiseikanri",
    "vn": "Quản lý vệ sinh an toàn thực phẩm",
    "ex": "飲食店において徹底した衛生管理は最も重要だ。",
    "exVn": "Trong ngành ẩm thực, quản lý vệ sinh nghiêm ngặt là điều quan trọng nhất."
  },
  {
    "jp": "まな板",
    "rom": "manaita",
    "vn": "Cái thớt thái đồ",
    "ex": "肉用と野菜用でまな板を使い分ける。",
    "exVn": "Dùng riêng thớt thái thịt và thớt thái rau củ."
  },
  {
    "jp": "包丁",
    "rom": "houchou",
    "vn": "Con dao làm bếp",
    "ex": "仕事終わりに包丁を丁寧に研ぎます。",
    "exVn": "Cuối giờ làm việc, mài dao làm bếp một cách cẩn thận."
  },
  {
    "jp": "接客",
    "rom": "sekkyaku",
    "vn": "Tiếp đón và phục vụ khách hàng",
    "ex": "笑顔と明るい挨拶で接客を心がけましょう。",
    "exVn": "Hãy luôn phục vụ khách hàng với nụ cười và lời chào tươi vui."
  },
  {
    "jp": "会計",
    "rom": "kaikei",
    "vn": "Thanh toán tính tiền",
    "ex": "レジでお客様のお会計をお願いします。",
    "exVn": "Nhờ bạn thanh toán tính tiền cho khách tại quầy thu ngân."
  },
  {
    "jp": "下ごしらえ",
    "rom": "shitagoshirae",
    "vn": "Công đoạn chuẩn bị trước khi nấu",
    "ex": "肉の下ごしらえに下味をつけておく。",
    "exVn": "Tẩm ướp gia vị sơ bộ trong khâu chuẩn bị thịt."
  },
  {
    "jp": "湯通し",
    "rom": "yudooshi",
    "vn": "Chần sơ qua nước sôi",
    "ex": "野菜の青みを残すためサッと湯通しする。",
    "exVn": "Chần nhanh qua nước sôi để giữ màu xanh tươi của rau."
  },
  {
    "jp": "あく抜き",
    "rom": "akunuki",
    "vn": "Khử chất đắng / Vớt bọt nước dùng",
    "ex": "ごぼうを切ったら水にさらしてあく抜きをする。",
    "exVn": "Cắt ngưu bàng xong thì ngâm nước để khử vị đắng chát."
  },
  {
    "jp": "隠し味",
    "rom": "kakushiaji",
    "vn": "Gia vị bí mật tạo chiều sâu hương vị",
    "ex": "カレーの隠し味にチョコレートを少量加える。",
    "exVn": "Cho thêm một ít sô-cô-la làm vị bí mật cho món cà ri."
  },
  {
    "jp": "賞味期限",
    "rom": "shoumikigen",
    "vn": "Hạn sử dụng tốt nhất (Best before)",
    "ex": "賞味期限が切れる前に使い切ってください。",
    "exVn": "Hãy dùng hết nguyên liệu trước khi hết hạn ngon nhất."
  },
  {
    "jp": "消費期限",
    "rom": "shouhikigen",
    "vn": "Hạn dùng an toàn tuyệt đối (Use by)",
    "ex": "生鮮食品は消費期限を厳守する必要があります。",
    "exVn": "Thực phẩm tươi sống bắt buộc phải tuân thủ nghiêm hạn dùng."
  },
  {
    "jp": "賄い",
    "rom": "makanai",
    "vn": "Bữa cơm nhân viên nhà bếp",
    "ex": "今日の賄いは特製チャーハンです。",
    "exVn": "Cơm nhân viên hôm nay là món cơm chiên đặc biệt."
  },
  {
    "jp": "品切れ",
    "rom": "shinagire",
    "vn": "Hết món ăn / Hết hàng bán",
    "ex": "本日のおすすめ魚料理は品切れとなりました。",
    "exVn": "Món cá gợi ý hôm nay đã hết suất phục vụ."
  },
  {
    "jp": "飲み放題",
    "rom": "nomihoudai",
    "vn": "Gói uống thỏa thích không giới hạn",
    "ex": "2時間制の飲み放題コースをご用意しております。",
    "exVn": "Chúng tôi có gói uống thỏa thích trong thời gian 2 tiếng."
  },
  {
    "jp": "食べ放題",
    "rom": "tabehoudai",
    "vn": "Gói ăn buffet thỏa thích",
    "ex": "週末は焼肉の食べ放題プランが大人気です。",
    "exVn": "Cuối tuần thì gói buffet thịt nướng ăn thỏa thích rất đông khách."
  },
  {
    "jp": "貸し切り",
    "rom": "kashikiri",
    "vn": "Bao trọn quán / Thuê phòng riêng tiệc",
    "ex": "今夜は会社の宴会で店内貸し切りとなっております。",
    "exVn": "Tối nay quán được bao trọn để tổ chức tiệc liên hoan công ty."
  },
  {
    "jp": "火加減",
    "rom": "hikagen",
    "vn": "Điều chỉnh mức lửa to/nhỏ",
    "ex": "肉を柔らかく焼くには火加減の調節が肝心です。",
    "exVn": "Để nướng thịt mềm ngon thì việc điều chỉnh mức lửa là cốt lõi."
  },
  {
    "jp": "湯煎",
    "rom": "yusen",
    "vn": "Nấu hoặc hâm cách thủy",
    "ex": "チョコレートを湯煎でゆっくり溶かします。",
    "exVn": "Làm tan chảy sô-cô-la từ từ bằng phương pháp đun cách thủy."
  },
  {
    "jp": "殺菌消毒",
    "rom": "sakkinshoudoku",
    "vn": "Tiệt trùng và sát khuẩn dụng cụ",
    "ex": "調理台や包丁はアルコールで殺菌消毒する。",
    "exVn": "Khử trùng sát khuẩn bàn bếp và dao bằng cồn y tế."
  },
  {
    "jp": "食中毒",
    "rom": "shokuchuudoku",
    "vn": "Ngộ độc thực phẩm",
    "ex": "夏場は食中毒予防に細心の注意を払う。",
    "exVn": "Mùa hè cần hết sức chú ý đề phòng ngộ độc thực phẩm."
  },
  {
    "jp": "アレルギー表示",
    "rom": "arerugi-hyouji",
    "vn": "Ghi chú thành phần gây dị ứng",
    "ex": "メニューに特定原材料のアレルギー表示を記載する。",
    "exVn": "Ghi chú thành phần dị ứng cụ thể trên thực đơn món ăn."
  },
  {
    "jp": "お冷",
    "rom": "ohiya",
    "vn": "Nước lọc đá mời khách",
    "ex": "お客様が席に着いたらすぐにお冷を出す。",
    "exVn": "Khi khách vừa ngồi vào bàn, mang ngay nước đá ra mời."
  },
  {
    "jp": "お絞り",
    "rom": "oshibori",
    "vn": "Khăn ướt lau tay đưa cho khách",
    "ex": "温かいお絞りを両手でお渡ししてください。",
    "exVn": "Hãy đưa khăn ướt ấm cho khách hàng bằng cả hai tay."
  },
  {
    "jp": "伝票",
    "rom": "dempyou",
    "vn": "Phiếu gọi món / Phiếu thanh toán",
    "ex": "料理を出したら伝票をテーブルの端に置く。",
    "exVn": "Sau khi bưng món ra, đặt phiếu tính tiền ở góc bàn."
  },
  {
    "jp": "お通し",
    "rom": "otooshi",
    "vn": "Món khai vị tính phí ở quán nhậu",
    "ex": "居酒屋では席料としてお通しが出されます。",
    "exVn": "Tại quán nhậu, món khai vị otooshi được phục vụ kèm tiền phụ thu chỗ."
  },
  {
    "jp": "領収書",
    "rom": "ryoushousho",
    "vn": "Hóa đơn đỏ / Biên lai tài chính",
    "ex": "会社名での領収書の発行をお願いします。",
    "exVn": "Làm ơn xuất hóa đơn tài chính theo tên công ty giúp tôi."
  },
  {
    "jp": "解凍",
    "rom": "kaitou",
    "vn": "Rã đông thực phẩm",
    "ex": "冷凍肉を冷蔵庫に移してゆっくり解凍させる。",
    "exVn": "Chuyển thịt đông lạnh sang ngăn mát để rã đông từ từ."
  },
  {
    "jp": "廃棄処分",
    "rom": "haikishobun",
    "vn": "Tiêu hủy bỏ thực phẩm hỏng/thừa",
    "ex": "期限切れの食材は速やかに廃棄処分にする。",
    "exVn": "Nguyên liệu hết hạn sử dụng cần tiêu hủy bỏ ngay lập tức."
  },
  {
    "jp": "満席",
    "rom": "manseki",
    "vn": "Hết bàn, kín chỗ",
    "ex": "申し訳ございません、ただいま満席となっております。",
    "exVn": "Thành thật xin lỗi quý khách, hiện tại nhà hàng đã kín hết bàn."
  },
  {
    "jp": "相席",
    "rom": "aiseki",
    "vn": "Ngồi ghép bàn chung với khách khác",
    "ex": "混雑時は相席をお願いする場合がございます。",
    "exVn": "Lúc đông khách, chúng tôi có thể xin phép xếp ngồi chung bàn."
  },
  {
    "jp": "お持ち帰り",
    "rom": "omochikaeri",
    "vn": "Mua đồ ăn mang về (Take-out)",
    "ex": "この料理はお持ち帰りも可能です。",
    "exVn": "Món ăn này có thể đóng gói mang về được."
  },
  {
    "jp": "客単価",
    "rom": "kyakutanka",
    "vn": "Mức chi tiêu bình quân mỗi khách",
    "ex": "ディナータイムの客単価を上げる工夫をする。",
    "exVn": "Tìm giải pháp nâng cao mức chi tiêu bình quân mỗi khách vào buổi tối."
  },
  {
    "jp": "回転率",
    "rom": "kaitenritsu",
    "vn": "Tốc độ xoay vòng bàn khách",
    "ex": "ランチタイムは回転率を高めることが鍵だ。",
    "exVn": "Vào giờ ăn trưa, tăng tốc độ quay vòng bàn là mấu chốt doanh thu."
  }
];

const VOCAB_ENGINEERING = [
  {
    "jp": "設計図",
    "rom": "sekkeizu",
    "vn": "Bản vẽ thiết kế kỹ thuật",
    "ex": "設計図の寸法通りに部品を加工する。",
    "exVn": "Gia công linh kiện theo đúng kích thước trên bản vẽ thiết kế."
  },
  {
    "jp": "作業現場",
    "rom": "sagyougemba",
    "vn": "Hiện trường gia công / Nơi làm việc",
    "ex": "作業現場の整理整頓を徹底しましょう。",
    "exVn": "Hãy thực hiện triệt để việc sắp xếp ngăn nắp tại nơi làm việc."
  },
  {
    "jp": "定期点検",
    "rom": "teikitenken",
    "vn": "Bảo dưỡng kiểm tra máy định kỳ",
    "ex": "製造ラインの定期点検を毎月行っています。",
    "exVn": "Hàng tháng đều thực hiện kiểm tra định kỳ dây chuyền sản xuất."
  },
  {
    "jp": "整備",
    "rom": "seibi",
    "vn": "Bảo trì, chỉnh đốn máy móc",
    "ex": "機械の整備を怠ると大事故につながります。",
    "exVn": "Nếu lơ là việc bảo trì máy móc sẽ dẫn đến tai nạn nghiêm trọng."
  },
  {
    "jp": "精密測定",
    "rom": "seimitsusokutei",
    "vn": "Đo lường cơ khí chính xác",
    "ex": "ノギスやマイクロメーターで精密測定を行う。",
    "exVn": "Thực hiện đo lường chính xác bằng thước cặp hoặc thước panme."
  },
  {
    "jp": "組み立て",
    "rom": "kumitate",
    "vn": "Lắp ráp linh kiện thành phẩm",
    "ex": "マニュアルに従って順序良く組み立てる。",
    "exVn": "Lắp ráp đúng trình tự theo sách hướng dẫn kỹ thuật."
  },
  {
    "jp": "安全帽",
    "rom": "anzenbou",
    "vn": "Mũ bảo hộ lao động",
    "ex": "工場内では必ず安全帽を着用してください。",
    "exVn": "Trong nhà xưởng bắt buộc phải đội mũ bảo hộ lao động."
  },
  {
    "jp": "許容誤差",
    "rom": "kyoyougosa",
    "vn": "Dung sai cho phép",
    "ex": "部品の仕上がりは許容誤差の範囲内です。",
    "exVn": "Độ hoàn thiện của linh kiện nằm trong phạm vi dung sai cho phép."
  },
  {
    "jp": "溶接",
    "rom": "yousetsu",
    "vn": "Hàn kim loại",
    "ex": "鉄骨を溶接して頑丈なフレームを作る。",
    "exVn": "Hàn các thanh thép lại để tạo thành bộ khung vững chắc."
  },
  {
    "jp": "試運転",
    "rom": "shiunten",
    "vn": "Chạy thử nghiệm máy móc",
    "ex": "新規導入した機械の試運転を開始する。",
    "exVn": "Bắt đầu chạy thử nghiệm cỗ máy mới được nhập về xưởng."
  },
  {
    "jp": "電子回路",
    "rom": "denshikairo",
    "vn": "Mạch điện tử",
    "ex": "電子回路基板のはんだ付け作業を行う。",
    "exVn": "Thực hiện công việc hàn chân linh kiện trên bo mạch điện tử."
  },
  {
    "jp": "摩耗",
    "rom": "mamou",
    "vn": "Hao mòn, mài mòn cơ học",
    "ex": "ブレーキパッドの摩耗状態を点検する。",
    "exVn": "Kiểm tra tình trạng mài mòn của má phanh."
  },
  {
    "jp": "構造物",
    "rom": "kouzoubutsu",
    "vn": "Kết cấu công trình, bộ phận chịu lực",
    "ex": "金属構造物の強度をコンピューターで解析する。",
    "exVn": "Phân tích độ bền kết cấu kim loại bằng máy tính."
  },
  {
    "jp": "配管",
    "rom": "haikan",
    "vn": "Đường ống dẫn khí / nước",
    "ex": "配管からのガス漏れがないか確認する。",
    "exVn": "Kiểm tra xem có bị rò rỉ khí gas từ đường ống hay không."
  },
  {
    "jp": "配線",
    "rom": "haisen",
    "vn": "Đường dây điện, nối dây mạch",
    "ex": "制御盤内の配線を図面通りに結線する。",
    "exVn": "Đấu nối dây điện trong tủ điều khiển theo đúng sơ đồ bản vẽ."
  },
  {
    "jp": "金型",
    "rom": "kanagata",
    "vn": "Khuôn đúc kim loại / Khuôn ép nhựa",
    "ex": "プレス機に金型を正確にセットする。",
    "exVn": "Lắp đặt khuôn đúc vào máy dập một cách chuẩn xác."
  },
  {
    "jp": "切削加工",
    "rom": "sessakukakou",
    "vn": "Gia công cắt gọt kim loại",
    "ex": "旋盤を用いて金属棒の切削加工を行う。",
    "exVn": "Dùng máy tiện để thực hiện gia công cắt gọt thanh kim loại."
  },
  {
    "jp": "研磨",
    "rom": "kemma",
    "vn": "Mài nhẵn, đánh bóng bề mặt",
    "ex": "金属の表面を平滑に研磨して仕上げる。",
    "exVn": "Mài nhẵn bóng bề mặt kim loại để hoàn thiện sản phẩm."
  },
  {
    "jp": "熱処理",
    "rom": "netsushori",
    "vn": "Nhiệt luyện kim loại (Tôi thép)",
    "ex": "熱処理を施して金属の硬度を高める。",
    "exVn": "Nhiệt luyện tôi thép để nâng cao độ cứng của kim loại."
  },
  {
    "jp": "安全第一",
    "rom": "anzendaiichi",
    "vn": "An toàn là trên hết (Khẩu hiệu xưởng)",
    "ex": "当工場では安全第一をスローガンに掲げています。",
    "exVn": "Nhà xưởng chúng tôi luôn đặt tiêu chí An toàn là trên hết làm khẩu hiệu."
  },
  {
    "jp": "非常停止",
    "rom": "hijouteishi",
    "vn": "Dừng máy khẩn cấp (Emergency stop)",
    "ex": "異常を感じたら直ちに非常停止ボタンを押すこと。",
    "exVn": "Khi thấy điều bất thường, hãy ấn ngay nút dừng khẩn cấp."
  },
  {
    "jp": "保護具",
    "rom": "hogogu",
    "vn": "Đồ trang bị bảo hộ lao động",
    "ex": "作業に応じた保護眼鏡や手袋を着用する。",
    "exVn": "Đeo kính bảo hộ và găng tay phù hợp với từng công việc."
  },
  {
    "jp": "寸法",
    "rom": "sumpou",
    "vn": "Kích thước đo đạc",
    "ex": "製品の寸法が規格に適合しているか検査する。",
    "exVn": "Kiểm tra xem kích thước sản phẩm có phù hợp quy chuẩn không."
  },
  {
    "jp": "歪み",
    "rom": "yugami",
    "vn": "Bị cong vênh, biến dạng cơ học",
    "ex": "溶接の熱で金属板に歪みが生じる。",
    "exVn": "Nhiệt độ của mối hàn làm cho tấm kim loại bị cong vênh biến dạng."
  },
  {
    "jp": "潤滑油",
    "rom": "junkatsuyu",
    "vn": "Dầu nhờn bôi trơn máy móc",
    "ex": "回転軸に潤滑油を定期的に補給してください。",
    "exVn": "Hãy định kỳ châm thêm dầu nhờn bôi trơn vào trục quay."
  },
  {
    "jp": "旋盤",
    "rom": "semban",
    "vn": "Máy tiện kim loại",
    "ex": "NC旋盤のプログラムを入力して自動加工を行う。",
    "exVn": "Nhập chương trình vào máy tiện NC để gia công tự động."
  },
  {
    "jp": "フライス盤",
    "rom": "furaisuban",
    "vn": "Máy phay cơ khí",
    "ex": "フライス盤で金属ブロックの平面を削り出す。",
    "exVn": "Dùng máy phay để bào phẳng bề mặt khối kim loại."
  },
  {
    "jp": "バリ取り",
    "rom": "baritori",
    "vn": "Gọt bavia, mài via nhẵn cạnh",
    "ex": "切削後の部品のエッジをバリ取りする。",
    "exVn": "Mài sạch via ở các cạnh góc linh kiện sau khi cắt gọt."
  },
  {
    "jp": "治具",
    "rom": "jigu",
    "vn": "Đồ gá gia công (Jig)",
    "ex": "専用の治具にワークを固定して作業効率を上げる。",
    "exVn": "Cố định phôi gia công vào đồ gá chuyên dụng để tăng năng suất."
  },
  {
    "jp": "ノギス",
    "rom": "nogisu",
    "vn": "Thước cặp đo cơ khí chính xác",
    "ex": "ノギスで外径と内径をミリ単位で測定する。",
    "exVn": "Dùng thước cặp đo đường kính ngoài và trong chính xác từng milimét."
  },
  {
    "jp": "公差",
    "rom": "kousa",
    "vn": "Dung sai kỹ thuật",
    "ex": "図面に指定された幾何公差を厳守する。",
    "exVn": "Tuân thủ nghiêm ngặt dung sai hình học được chỉ định trên bản vẽ."
  },
  {
    "jp": "メッキ",
    "rom": "mekki",
    "vn": "Mạ xi kim loại chống gỉ",
    "ex": "防錆のために亜鉛メッキ処理を施す。",
    "exVn": "Tiến hành mạ kẽm để chống gỉ sét cho vật liệu."
  },
  {
    "jp": "異音",
    "rom": "ion",
    "vn": "Âm thanh lạ, tiếng kêu máy bất thường",
    "ex": "モーターから異音がするので直ちに点検してください。",
    "exVn": "Động cơ phát ra tiếng kêu lạ, hãy kiểm tra ngay lập tức."
  },
  {
    "jp": "始業点検",
    "rom": "shigyoutenken",
    "vn": "Kiểm tra máy trước khi bắt đầu ca làm",
    "ex": "毎朝作業前に5分間の始業点検を実施する。",
    "exVn": "Mỗi sáng trước khi vào việc đều thực hiện kiểm tra máy 5 phút."
  },
  {
    "jp": "短絡",
    "rom": "tanraku",
    "vn": "Chập điện, ngắn mạch (Đoản mạch)",
    "ex": "配線の接触不良による短絡事故を防ぐ。",
    "exVn": "Đề phòng sự cố chập điện do tiếp xúc dây nối kém."
  },
  {
    "jp": "不良品",
    "rom": "furyouhin",
    "vn": "Sản phẩm lỗi, hàng phế phẩm",
    "ex": "不良品が発生した原因を特定して再発防止に努める。",
    "exVn": "Xác định nguyên nhân gây ra hàng lỗi để ngăn ngừa tái diễn."
  },
  {
    "jp": "歩留まり",
    "rom": "budomari",
    "vn": "Tỷ lệ sản phẩm đạt chuẩn (Yield rate)",
    "ex": "工程改善により歩留まりが95%に向上した。",
    "exVn": "Nhờ cải tiến quy trình mà tỷ lệ thành phẩm đạt chuẩn tăng lên 95%."
  }
];

const VOCAB_BUSINESS = [
  {
    "jp": "契約書",
    "rom": "keiyakusho",
    "vn": "Hợp đồng kinh tế",
    "ex": "契約書の内容を弁護士と精査する。",
    "exVn": "Rà soát kỹ nội dung bản hợp đồng cùng luật sư."
  },
  {
    "jp": "商談",
    "rom": "shoudan",
    "vn": "Đàm phán thương mại, giao dịch kinh doanh",
    "ex": "大手クライアントとの商談が成立した。",
    "exVn": "Cuộc đàm phán giao dịch với khách hàng lớn đã thành công."
  },
  {
    "jp": "議事録",
    "rom": "gijiroku",
    "vn": "Biên bản cuộc họp",
    "ex": "会議終了後、その日のうちに議事録を共有する。",
    "exVn": "Sau khi cuộc họp kết thúc, chia sẻ biên bản ngay trong ngày."
  },
  {
    "jp": "見積書",
    "rom": "mitsumorisho",
    "vn": "Bảng báo giá dự toán",
    "ex": "プロジェクトの概算見積書を作成して送付した。",
    "exVn": "Đã lập và gửi bản báo giá ước tính cho dự án."
  },
  {
    "jp": "請求書",
    "rom": "seikyuusho",
    "vn": "Hóa đơn đòi tiền (Invoice)",
    "ex": "月末締めで請求書を発行してください。",
    "exVn": "Hãy xuất hóa đơn đòi tiền chốt vào cuối tháng."
  },
  {
    "jp": "納品",
    "rom": "nouhin",
    "vn": "Giao hàng, bàn giao sản phẩm",
    "ex": "予定通りに来週の金曜日に商品を納品します。",
    "exVn": "Sẽ giao hàng đúng tiến độ vào thứ Sáu tuần tới."
  },
  {
    "jp": "取引先",
    "rom": "torihikisaki",
    "vn": "Đối tác làm ăn, bạn hàng",
    "ex": "長年お付き合いのある信頼できる取引先です。",
    "exVn": "Đây là đối tác làm ăn đáng tin cậy đã hợp tác nhiều năm."
  },
  {
    "jp": "競合他社",
    "rom": "kyougoutasha",
    "vn": "Công ty đối thủ cạnh tranh",
    "ex": "競合他社の新製品の動向をリサーチする。",
    "exVn": "Nghiên cứu xu hướng sản phẩm mới của các công ty đối thủ."
  },
  {
    "jp": "損益分岐点",
    "rom": "sonekibunkiten",
    "vn": "Điểm hòa vốn trong kinh doanh",
    "ex": "今年度中に損益分岐点を超える見込みです。",
    "exVn": "Dự kiến trong năm tài chính này sẽ vượt qua điểm hòa vốn."
  },
  {
    "jp": "資金繰り",
    "rom": "shikinguri",
    "vn": "Quản lý dòng tiền, xoay vòng vốn",
    "ex": "無理のない資金繰り計画を立てることが重要だ。",
    "exVn": "Lập kế hoạch xoay vòng dòng tiền hợp lý là điều then chốt."
  },
  {
    "jp": "部署",
    "rom": "busho",
    "vn": "Phòng ban trong công ty",
    "ex": "来月から営業第一部署へ異動となります。",
    "exVn": "Từ tháng sau tôi sẽ chuyển công tác sang phòng kinh doanh số 1."
  },
  {
    "jp": "役職",
    "rom": "yakushoku",
    "vn": "Chức vụ, vị trí lãnh đạo",
    "ex": "課長や部長などの管理役職に就く。",
    "exVn": "Đảm nhận các chức vụ quản lý như trưởng nhóm hay trưởng phòng."
  },
  {
    "jp": "出張",
    "rom": "shucchou",
    "vn": "Đi công tác xa",
    "ex": "来週大阪支社へ2泊3日の出張に行きます。",
    "exVn": "Tuần sau tôi đi công tác chi nhánh Osaka 3 ngày 2 đêm."
  },
  {
    "jp": "組織図",
    "rom": "soshikizu",
    "vn": "Sơ đồ cơ cấu tổ chức công ty",
    "ex": "会社の組織図で各部門の役割を確認する。",
    "exVn": "Xem sơ đồ tổ chức công ty để hiểu rõ vai trò của từng bộ phận."
  },
  {
    "jp": "名刺交換",
    "rom": "meishikoukan",
    "vn": "Trao đổi danh thiếp (Văn hóa Nhật)",
    "ex": "初対面の相手とは両手で丁寧に名刺交換を行う。",
    "exVn": "Lần đầu gặp gỡ đối tác, trao đổi danh thiếp lịch sự bằng cả hai tay."
  },
  {
    "jp": "稟議書",
    "rom": "ringisho",
    "vn": "Đơn xin phê duyệt kinh phí nội bộ",
    "ex": "高額な機器の購入には稟議書の決裁が必要です。",
    "exVn": "Mua sắm thiết bị giá trị cao cần được phê duyệt đơn xin kinh phí."
  },
  {
    "jp": "稟議",
    "rom": "ringi",
    "vn": "Quy trình xin ý kiến phê duyệt nội bộ",
    "ex": "社内稟議を通して予算を確保しました。",
    "exVn": "Đã thông qua quy trình phê duyệt nội bộ để chốt ngân sách."
  },
  {
    "jp": "就業規則",
    "rom": "shuugyoukisoku",
    "vn": "Nội quy lao động của công ty",
    "ex": "入社時に就業規則の確認と同意が求められます。",
    "exVn": "Khi vào công ty, nhân viên được yêu cầu đọc và đồng ý nội quy lao động."
  },
  {
    "jp": "残業手当",
    "rom": "zangyouteate",
    "vn": "Tiền phụ cấp làm thêm ngoài giờ",
    "ex": "所定労働時間を超えた分は残業手当が支給される。",
    "exVn": "Khoảng thời gian vượt quá giờ làm quy định sẽ được chi trả trợ cấp tăng ca."
  },
  {
    "jp": "有給休暇",
    "rom": "yuukyuukyuuka",
    "vn": "Ngày nghỉ phép có lương",
    "ex": "有給休暇を取得して家族旅行に出かける。",
    "exVn": "Xin nghỉ phép có lương để cùng gia đình đi du lịch."
  },
  {
    "jp": "直行直帰",
    "rom": "chokkouchokki",
    "vn": "Đi thẳng tới nơi đối tác và về thẳng nhà",
    "ex": "午後は取引先へ直行直帰の予定です。",
    "exVn": "Buổi chiều tôi dự định đi thẳng tới đối tác và về thẳng nhà sau đó."
  },
  {
    "jp": "引き継ぎ",
    "rom": "hikitsugi",
    "vn": "Bàn giao công việc cho người kế nhiệm",
    "ex": "退職前に後任者へ業務の引き継ぎを完了させる。",
    "exVn": "Hoàn tất việc bàn giao công việc cho người kế nhiệm trước khi nghỉ việc."
  },
  {
    "jp": "人脈",
    "rom": "jimmaku",
    "vn": "Mối quan hệ ngoại giao / Mạng lưới quan hệ",
    "ex": "交流会に参加して業界の人脈を広げる。",
    "exVn": "Tham gia các buổi giao lưu để mở rộng mạng lưới quan hệ trong ngành."
  },
  {
    "jp": "業績",
    "rom": "gyouseki",
    "vn": "Kết quả kinh doanh, thành tích công ty",
    "ex": "円安の影響で今期の業績が大幅に改善した。",
    "exVn": "Nhờ tác động của đồng Yên giảm giá, kết quả kinh doanh kỳ này cải thiện lớn."
  },
  {
    "jp": "資本金",
    "rom": "shihonkin",
    "vn": "Vốn điều lệ của công ty",
    "ex": "資本金1000万円で新規法人を設立しました。",
    "exVn": "Thành lập pháp nhân mới với số vốn điều lệ là 10 triệu Yên."
  },
  {
    "jp": "相見積もり",
    "rom": "aimitsumori",
    "vn": "So sánh báo giá từ nhiều bên",
    "ex": "コスト削減のため3社から相見積もりを取る。",
    "exVn": "Lấy báo giá từ 3 công ty để so sánh nhằm cắt giảm chi phí."
  },
  {
    "jp": "受注",
    "rom": "juchuu",
    "vn": "Nhận đơn đặt hàng từ khách",
    "ex": "大型システムの開発案件を受注しました。",
    "exVn": "Chúng tôi đã nhận được hợp đồng dự án phát triển hệ thống quy mô lớn."
  },
  {
    "jp": "発注",
    "rom": "hacchuu",
    "vn": "Đặt hàng đối tác / Đặt mua linh kiện",
    "ex": "部品の在庫が少なくなったので追加発注する。",
    "exVn": "Lượng linh kiện tồn kho đã giảm nên tiến hành đặt hàng thêm."
  },
  {
    "jp": "売上高",
    "rom": "uriagedaka",
    "vn": "Tổng doanh thu bán hàng",
    "ex": "今年度の年間売上高は目標の10億円を突破した。",
    "exVn": "Tổng doanh thu năm nay đã vượt mục tiêu 1 tỷ Yên."
  },
  {
    "jp": "純利益",
    "rom": "junrieki",
    "vn": "Lợi nhuận ròng sau thuế",
    "ex": "売上だけでなく純利益率にも着目する。",
    "exVn": "Không chỉ nhìn vào doanh số mà còn phải chú trọng tỷ suất lợi nhuận ròng."
  },
  {
    "jp": "報連相",
    "rom": "hourensou",
    "vn": "Quy tắc Báo cáo - Liên lạc - Thảo luận",
    "ex": "トラブルを防ぐため毎日の報連相を徹底する。",
    "exVn": "Thực hiện triệt để nguyên tắc Horenso mỗi ngày để phòng tránh sự cố."
  },
  {
    "jp": "根回し",
    "rom": "nemawashi",
    "vn": "Vận động hành lang thống nhất trước cuộc họp",
    "ex": "提案を通すために役員へ事前の根回しを行う。",
    "exVn": "Thực hiện vận động hành lang trước với ban giám đốc để đề xuất được thông qua."
  },
  {
    "jp": "定例会",
    "rom": "teireikai",
    "vn": "Cuộc họp định kỳ hàng tuần/tháng",
    "ex": "毎週月曜日の朝に部署の定例会を開きます。",
    "exVn": "Mỗi sáng thứ Hai đều tổ chức cuộc họp định kỳ của phòng ban."
  }
];

const VOCAB_MEDICAL = [
  {
    "jp": "診察",
    "rom": "shinsatsu",
    "vn": "Thăm khám bệnh của bác sĩ",
    "ex": "医師による診察を受けて薬を処方してもらう。",
    "exVn": "Bác sĩ thăm khám bệnh và kê đơn thuốc."
  },
  {
    "jp": "処方箋",
    "rom": "shohousen",
    "vn": "Đơn thuốc do bác sĩ kê",
    "ex": "処方箋を持って調剤薬局へ行きます。",
    "exVn": "Cầm đơn thuốc tới hiệu thuốc bốc thuốc."
  },
  {
    "jp": "自覚症状",
    "rom": "jikakushoujou",
    "vn": "Triệu chứng bệnh mà người bệnh tự cảm nhận",
    "ex": "熱や倦怠感などの自覚症状はありますか？",
    "exVn": "Bác có cảm nhận thấy triệu chứng gì như sốt hay mệt mỏi không?"
  },
  {
    "jp": "患者",
    "rom": "kanja",
    "vn": "Bệnh nhân",
    "ex": "患者様のプライバシーに十分配慮してください。",
    "exVn": "Hãy hết sức tôn trọng quyền riêng tư của bệnh nhân."
  },
  {
    "jp": "バイタルサイン",
    "rom": "baitarusain",
    "vn": "Dấu hiệu sinh tồn (Mạch, huyết áp, nhiệt độ)",
    "ex": "毎朝バイタルサインを測定して記録する。",
    "exVn": "Đo và ghi chép lại các chỉ số sinh tồn vào mỗi buổi sáng."
  },
  {
    "jp": "体温測定",
    "rom": "taionsokutei",
    "vn": "Đo thân nhiệt",
    "ex": "非接触型の体温計で体温測定を行う。",
    "exVn": "Đo thân nhiệt bằng nhiệt kế điện tử không tiếp xúc."
  },
  {
    "jp": "血圧計",
    "rom": "ketsuatsukei",
    "vn": "Máy đo huyết áp",
    "ex": "腕に血圧計のカフを巻いて測定します。",
    "exVn": "Quấn bao đo của máy huyết áp vào bắp tay để bắt đầu đo."
  },
  {
    "jp": "介護福祉士",
    "rom": "kaigofukushishi",
    "vn": "Nhân viên điều dưỡng / Hộ lý chăm sóc chứng chỉ quốc gia",
    "ex": "国家資格である介護福祉士の試験に合格した。",
    "exVn": "Đã thi đỗ chứng chỉ quốc gia nhân viên chăm sóc hộ lý Kaigo."
  },
  {
    "jp": "消毒液",
    "rom": "shoudokueki",
    "vn": "Dung dịch khử trùng sát khuẩn",
    "ex": "入室前に手指を消毒液でしっかり消毒する。",
    "exVn": "Sát khuẩn tay kỹ lưỡng bằng dung dịch sát trùng trước khi vào phòng."
  },
  {
    "jp": "応急手当",
    "rom": "oukyuuteate",
    "vn": "Sơ cứu ban đầu khẩn cấp",
    "ex": "怪我人に対して速やかに応急手当を施す。",
    "exVn": "Nhanh chóng thực hiện sơ cứu ban đầu cho người bị thương."
  },
  {
    "jp": "カルテ",
    "rom": "karute",
    "vn": "Bệnh án điện tử / Hồ sơ y bạ",
    "ex": "電子カルテに患者の経過を詳細に記入する。",
    "exVn": "Ghi chép chi tiết diễn biến của bệnh nhân vào hồ sơ bệnh án điện tử."
  },
  {
    "jp": "点滴",
    "rom": "tenteki",
    "vn": "Truyền dịch tĩnh mạch (Truyền nước)",
    "ex": "脱水症状を防ぐために点滴を投与する。",
    "exVn": "Truyền dịch tĩnh mạch để phòng ngừa tình trạng mất nước."
  },
  {
    "jp": "予防接種",
    "rom": "yobousesshu",
    "vn": "Tiêm chủng vắc-xin phòng bệnh",
    "ex": "インフルエンザの予防接種を受ける。",
    "exVn": "Tiêm vắc-xin phòng ngừa bệnh cúm mùa."
  },
  {
    "jp": "副作用",
    "rom": "fukusayou",
    "vn": "Tác dụng phụ của thuốc",
    "ex": "この薬には眠気の副作用が出る場合があります。",
    "exVn": "Loại thuốc này có thể gây ra tác dụng phụ là buồn ngủ."
  },
  {
    "jp": "問診票",
    "rom": "monshimpyou",
    "vn": "Phiếu khai tình trạng bệnh lý khi đến khám",
    "ex": "初診の受付で問診票に記入をお願いします。",
    "exVn": "Xin vui lòng điền vào phiếu khai bệnh tại quầy tiếp đón lần đầu."
  },
  {
    "jp": "面会時間",
    "rom": "meinkaijikan",
    "vn": "Giờ thăm nuôi người bệnh",
    "ex": "病棟の面会時間は午後2時から午後8時までです。",
    "exVn": "Giờ thăm nuôi bệnh nhân tại khoa là từ 2 giờ chiều đến 8 giờ tối."
  },
  {
    "jp": "車椅子",
    "rom": "kurumaisu",
    "vn": "Xe lăn cho người bệnh / cụ già",
    "ex": "段差がある場所では車椅子を後ろ向きに下ろす。",
    "exVn": "Ở những nơi có bậc thềm, lùi xe lăn ra sau để hạ xuống an toàn."
  },
  {
    "jp": "褥瘡",
    "rom": "jokusou",
    "vn": "Vết loét tì đè do nằm liệt giường lâu ngày",
    "ex": "褥瘡を防ぐため2時間おきに体位変換を行う。",
    "exVn": "Cứ 2 tiếng lăn trở người bệnh một lần để phòng chống loét tì đè."
  },
  {
    "jp": "服薬指導",
    "rom": "fukuyakushidou",
    "vn": "Hướng dẫn uống thuốc đúng liều lượng",
    "ex": "薬剤師から食後の服薬指導を受ける。",
    "exVn": "Được dược sĩ hướng dẫn cách uống thuốc đúng liều lượng sau bữa ăn."
  },
  {
    "jp": "リハビリ",
    "rom": "rihabiri",
    "vn": "Vật lý trị liệu phục hồi chức năng",
    "ex": "歩行訓練のリハビリを毎日根気よく続ける。",
    "exVn": "Kiên trì tập bài tập phục hồi chức năng đi lại mỗi ngày."
  },
  {
    "jp": "移乗",
    "rom": "ijou",
    "vn": "Hỗ trợ di chuyển (Từ giường sang xe lăn)",
    "ex": "ベッドから車椅子への安全な移乗介助を行う。",
    "exVn": "Hỗ trợ di chuyển an toàn cho cụ từ giường sang xe lăn."
  },
  {
    "jp": "排泄介助",
    "rom": "haisetsukaijo",
    "vn": "Hỗ trợ bài tiết / đi vệ sinh",
    "ex": "利用者の尊厳を守りながら排泄介助を行う。",
    "exVn": "Hỗ trợ đi vệ sinh đồng thời giữ gìn lòng tự trọng của người già."
  },
  {
    "jp": "入浴介助",
    "rom": "nyuuyokukaijo",
    "vn": "Hỗ trợ tắm rửa an toàn cho người già",
    "ex": "お湯の温度を確認してから入浴介助を始める。",
    "exVn": "Kiểm tra nhiệt độ nước ấm trước khi bắt đầu hỗ trợ cụ tắm."
  },
  {
    "jp": "食事介助",
    "rom": "shokujikaijo",
    "vn": "Hỗ trợ bón cơm, ăn uống",
    "ex": "誤嚥を防ぐため姿勢を正して食事介助をする。",
    "exVn": "Chỉnh tư thế ngồi thẳng trước khi bón cơm để tránh bị sặc."
  },
  {
    "jp": "口腔ケア",
    "rom": "koukuukya",
    "vn": "Vệ sinh răng miệng cho người bệnh",
    "ex": "毎食後に口腔ケアを行い肺炎を予防する。",
    "exVn": "Vệ sinh khoang miệng sau mỗi bữa ăn để phòng ngừa viêm phổi."
  },
  {
    "jp": "体位変換",
    "rom": "taiihenkan",
    "vn": "Lăn trở mình, đổi tư thế nằm",
    "ex": "夜間も定期的に体位変換を実施してください。",
    "exVn": "Ban đêm cũng cần định kỳ lăn trở mình đổi tư thế cho bệnh nhân."
  },
  {
    "jp": "見守り",
    "rom": "mimamori",
    "vn": "Theo dõi, để mắt trông nom an toàn",
    "ex": "歩行が不安定な利用者を見守り介助する。",
    "exVn": "Đi bên cạnh để mắt trông chừng người cao tuổi đi lại chưa vững."
  },
  {
    "jp": "転倒防止",
    "rom": "tentouboushi",
    "vn": "Phòng chống trượt ngã, té cầu thang",
    "ex": "床の段差をなくし転倒防止に努める。",
    "exVn": "San phẳng các gờ thềm trên sàn để nỗ lực chống té ngã."
  },
  {
    "jp": "認知症",
    "rom": "ninchishou",
    "vn": "Hội chứng sa sút trí tuệ (Alzheimer)",
    "ex": "認知症の方の気持ちに寄り添った対応を心がける。",
    "exVn": "Luôn thấu hiểu và lắng nghe tâm tư của người bị sa sút trí tuệ."
  },
  {
    "jp": "誤嚥",
    "rom": "goen",
    "vn": "Nuốt sặc thức ăn vào đường thở",
    "ex": "誤嚥を防ぐためスープにとろみをつける。",
    "exVn": "Pha bột làm sánh súp để chống sặc vào đường thở cho cụ."
  },
  {
    "jp": "とろみ",
    "rom": "toromi",
    "vn": "Độ sánh đặc chống sặc trong đồ ăn",
    "ex": "お茶にとろみ剤を加えて飲みやすくする。",
    "exVn": "Cho chất làm đặc vào trà để cụ dễ uống mà không bị sặc."
  },
  {
    "jp": "ナースコール",
    "rom": "na-suko-ru",
    "vn": "Nút bấm chuông gọi y tá đầu giường",
    "ex": "何かあったら遠慮なくナースコールを押してください。",
    "exVn": "Nếu có vấn đề gì, bác cứ tự nhiên bấm chuông gọi y tá đầu giường."
  }
];

const VOCAB_CONSTRUCTION = [
  {
    "jp": "足場",
    "rom": "ashiba",
    "vn": "Giàn giáo thi công công trình",
    "ex": "強風の日は足場の上での作業に注意が必要だ。",
    "exVn": "Vào ngày gió lớn cần đặc biệt chú ý khi thao tác trên giàn giáo."
  },
  {
    "jp": "躯体",
    "rom": "kutai",
    "vn": "Khung kết cấu chịu lực (Cột, dầm, sàn)",
    "ex": "建物の躯体工事が順調に進んでいます。",
    "exVn": "Công tác thi công kết cấu khung chịu lực đang tiến triển thuận lợi."
  },
  {
    "jp": "鉄筋",
    "rom": "tekkin",
    "vn": "Thép cốt bê tông (Cốt thép)",
    "ex": "コンクリートを流し込む前に鉄筋を配筋する。",
    "exVn": "Bố trí đan buộc cốt thép trước khi đổ bê tông vào khuôn."
  },
  {
    "jp": "型枠",
    "rom": "katawaku",
    "vn": "Cốp pha, ván khuôn đổ bê tông",
    "ex": "型枠大工が正確にベニヤ板を組み立てる。",
    "exVn": "Thợ cốp pha lắp ráp các tấm ván khuôn một cách chuẩn xác."
  },
  {
    "jp": "生コン",
    "rom": "namakon",
    "vn": "Bê tông tươi (Ready-mixed concrete)",
    "ex": "生コン車が現場に到着したら速やかに打設する。",
    "exVn": "Khi xe bồn chở bê tông tươi đến hiện trường thì đổ ngay lập tức."
  },
  {
    "jp": "打設",
    "rom": "dasetsu",
    "vn": "Đổ bê tông vào khuôn",
    "ex": "バイブレーターで空気を抜きながらコンクリートを打設する。",
    "exVn": "Đổ bê tông kết hợp dùng máy đầm dùi rung để đẩy bọt khí ra."
  },
  {
    "jp": "養生",
    "rom": "youjou",
    "vn": "Bảo dưỡng bê tông / Che chắn bảo vệ vật liệu",
    "ex": "コンクリート打設後は十分な散水養生を行う。",
    "exVn": "Sau khi đổ bê tông cần tưới nước dưỡng hộ đầy đủ."
  },
  {
    "jp": "基礎",
    "rom": "kiso",
    "vn": "Nền móng công trình",
    "ex": "建物の安定性は強固な基礎工事にかかっている。",
    "exVn": "Sự kiên cố của tòa nhà phụ thuộc hoàn toàn vào phần móng vững chắc."
  },
  {
    "jp": "測量",
    "rom": "sokuryou",
    "vn": "Trắc địa, đo đạc địa hình",
    "ex": "トータルステーションを用いて現場の測量を行う。",
    "exVn": "Dùng máy toàn đạc điện tử để đo đạc trắc địa công trường."
  },
  {
    "jp": "墨出し",
    "rom": "sumidashi",
    "vn": "Bật mực định vị ranh giới xây dựng",
    "ex": "床面に基準線を引くため正確に墨出しをする。",
    "exVn": "Bật mực chuẩn xác để kẻ các đường tim mốc chuẩn trên mặt sàn."
  },
  {
    "jp": "施工管理",
    "rom": "sekoukanri",
    "vn": "Quản lý giám sát thi công",
    "ex": "施工管理者は工程・品質・安全を統括する。",
    "exVn": "Kỹ sư giám sát thi công bao quát toàn bộ tiến độ, chất lượng và an toàn."
  },
  {
    "jp": "工期",
    "rom": "kouki",
    "vn": "Thời hạn thi công toàn bộ dự án",
    "ex": "天候不良が続いたため工期の延長を申請した。",
    "exVn": "Do thời tiết xấu kéo dài nên đã làm đơn xin gia hạn thời gian thi công."
  },
  {
    "jp": "安全帯",
    "rom": "anzentai",
    "vn": "Dây an toàn bảo hộ trên cao (Harness)",
    "ex": "高所作業ではフルハーネス型安全帯を必ず着用する。",
    "exVn": "Làm việc trên cao bắt buộc phải đeo dây an toàn toàn thân."
  },
  {
    "jp": "親綱",
    "rom": "oyazuna",
    "vn": "Dây cứu sinh neo móc an toàn",
    "ex": "足場のない場所では親綱にフックを掛けて移動する。",
    "exVn": "Ở những vị trí không có giàn giáo thì móc chốt vào dây cứu sinh khi di chuyển."
  },
  {
    "jp": "開口部",
    "rom": "kaikoubu",
    "vn": "Lỗ mở sàn, lỗ thông tầng nguy hiểm",
    "ex": "床の開口部には必ず防護柵と注意標識を設置する。",
    "exVn": "Tại các lỗ mở trên sàn bắt buộc phải dựng lan can chắn và biển cảnh báo."
  },
  {
    "jp": "墜落防止",
    "rom": "tsuirakuboushi",
    "vn": "Phòng chống ngã từ trên cao",
    "ex": "墜落防止のためにネットを張る。",
    "exVn": "Giăng lưới an toàn để phòng ngừa người lao động rơi ngã từ trên cao."
  },
  {
    "jp": "朝礼",
    "rom": "chourei",
    "vn": "Họp giao ban đầu giờ sáng trên công trường",
    "ex": "毎朝8時の朝礼でその日の危険作業を確認する。",
    "exVn": "Họp giao ban 8 giờ sáng mỗi ngày để phổ biến các công việc nguy hiểm trong ngày."
  },
  {
    "jp": "危険予知",
    "rom": "kikenyochi",
    "vn": "Dự đoán rủi ro nguy hiểm (KYT)",
    "ex": "作業前にKY活動（危険予知）シートを記入する。",
    "exVn": "Ghi chép phiếu hoạt động KY (dự đoán mối nguy) trước khi bắt đầu làm việc."
  },
  {
    "jp": "労災",
    "rom": "rousai",
    "vn": "Tai nạn lao động",
    "ex": "今年度は無事故無災害（労災ゼロ）を達成した。",
    "exVn": "Năm nay công trường đã đạt mục tiêu không tai nạn lao động (Zero tai nạn)."
  },
  {
    "jp": "元請け",
    "rom": "motouke",
    "vn": "Tổng thầu thi công chính",
    "ex": "元請けゼネコンの指示に従って作業を進める。",
    "exVn": "Tiến hành công việc theo chỉ thị của tổng thầu chính."
  },
  {
    "jp": "下請け",
    "rom": "shitauke",
    "vn": "Nhà thầu phụ thi công",
    "ex": "一次下請け会社が専門工事を担当します。",
    "exVn": "Công ty thầu phụ cấp một phụ trách hạng mục chuyên môn."
  },
  {
    "jp": "是正",
    "rom": "zesei",
    "vn": "Khắc phục, sửa chữa lỗi thi công",
    "ex": "検査で指摘された箇所を直ちに是正工事する。",
    "exVn": "Khắc phục sửa chữa ngay các vị trí bị chỉ trích trong đợt kiểm tra."
  }
];

const VOCAB_AGRICULTURE = [
  {
    "jp": "播種",
    "rom": "hashu",
    "vn": "Gieo hạt giống cây trồng",
    "ex": "春の播種に向けて畑の土作りを行う。",
    "exVn": "Làm đất tơi xốp cho ruộng để chuẩn bị gieo hạt vụ xuân."
  },
  {
    "jp": "苗",
    "rom": "nae",
    "vn": "Cây giống, mạ non",
    "ex": "丈夫な苗を育てることが豊作への第一歩だ。",
    "exVn": "Chăm sóc cây giống khỏe mạnh là bước đầu tiên để đạt mùa màng bội thu."
  },
  {
    "jp": "定植",
    "rom": "teishoku",
    "vn": "Trồng cây con vào luống đất chính",
    "ex": "本葉が出たら畑に苗を定植する。",
    "exVn": "Khi cây ra lá thật thì đem trồng cố định vào luống ruộng."
  },
  {
    "jp": "収穫",
    "rom": "shuukaku",
    "vn": "Thu hoạch nông sản",
    "ex": "秋にはたわわに実ったリンゴを収穫する。",
    "exVn": "Vào mùa thu tiến hành thu hoạch những trái táo chín mọng trĩu cành."
  },
  {
    "jp": "追肥",
    "rom": "tsuihi",
    "vn": "Bón phân bổ sung định kỳ",
    "ex": "野菜の生育に合わせて適切な追肥を行う。",
    "exVn": "Bón phân bổ sung đúng liều lượng phù hợp với sự phát triển của rau."
  },
  {
    "jp": "摘芽",
    "rom": "tekiga",
    "vn": "Tỉa chồi, ngắt búp non",
    "ex": "実を大きくするために余分な脇芽を摘芽する。",
    "exVn": "Tỉa bớt các chồi nách dư thừa để quả tập trung phát triển to tròn."
  },
  {
    "jp": "灌水",
    "rom": "kansui",
    "vn": "Tưới nước cho ruộng vườn",
    "ex": "自動灌水システムで毎朝適切な水分を供給する。",
    "exVn": "Cung cấp độ ẩm đầy đủ mỗi sáng bằng hệ thống tưới tự động."
  },
  {
    "jp": "害虫駆除",
    "rom": "gaichuukujo",
    "vn": "Diệt trừ sâu bệnh hại mùa màng",
    "ex": "無農薬栽培のため天敵を利用した害虫駆除を試みる。",
    "exVn": "Thử nghiệm diệt trừ sâu bọ bằng thiên địch trong canh tác hữu cơ."
  },
  {
    "jp": "ビニールハウス",
    "rom": "bini-ruhausu",
    "vn": "Nhà kính bọc nilon trồng rau quả",
    "ex": "ビニールハウス内の温度と湿度を管理する。",
    "exVn": "Quản lý nhiệt độ và độ ẩm bên trong nhà kính trồng cây."
  },
  {
    "jp": "選果",
    "rom": "senka",
    "vn": "Phân loại kích cỡ và chất lượng trái cây",
    "ex": "傷やサイズによって果物を選果機で選別する。",
    "exVn": "Phân loại trái cây theo kích thước và vết xước bằng máy chọn quả."
  },
  {
    "jp": "箱詰め",
    "rom": "hakozume",
    "vn": "Đóng hộp nông sản vận chuyển",
    "ex": "丁寧にクッション材を敷いてトマトを箱詰めする。",
    "exVn": "Lót lớp xốp cẩn thận rồi đóng cà chua vào thùng carton."
  },
  {
    "jp": "出荷",
    "rom": "shukka",
    "vn": "Xuất hàng ra chợ đầu mối / siêu thị",
    "ex": "朝採れたての新鮮な野菜を市場へ出荷する。",
    "exVn": "Xuất các loại rau tươi vừa mới hái buổi sáng ra chợ đầu mối."
  },
  {
    "jp": "鮮度",
    "rom": "sendo",
    "vn": "Độ tươi ngon của nông sản",
    "ex": "低温輸送で野菜の鮮度を長持ちさせる。",
    "exVn": "Vận chuyển nhiệt độ thấp để giữ được độ tươi ngon lâu dài cho rau."
  },
  {
    "jp": "検品",
    "rom": "kempin",
    "vn": "Kiểm tra chất lượng thành phẩm thực phẩm",
    "ex": "出荷前の最終検品で包装の密封性を確かめる。",
    "exVn": "Kiểm tra độ kín của bao bì trong khâu kiểm hàng cuối cùng trước khi xuất xưởng."
  },
  {
    "jp": "異物混入",
    "rom": "ibutsu konnyuu",
    "vn": "Lẫn dị vật lạ vào thực phẩm (Rất nguy hiểm)",
    "ex": "金属探知機を使って異物混入を徹底的に防ぐ。",
    "exVn": "Dùng máy dò kim loại để ngăn chặn triệt để nguy cơ lẫn dị vật vào thức ăn."
  },
  {
    "jp": "衛生服",
    "rom": "eiseifuku",
    "vn": "Áo quần phòng sạch vô trùng công xưởng",
    "ex": "食品加工ラインに入る前に衛生服と帽子を正しく着用する。",
    "exVn": "Mặc đồ phòng sạch và đội mũ đúng quy chuẩn trước khi vào dây chuyền chế biến."
  }
];

const VOCAB_N5 = [
  {
    "jp": "私",
    "rom": "watashi",
    "vn": "Tôi",
    "ex": "私は学生です。",
    "exVn": "Tôi là học sinh."
  },
  {
    "jp": "あなた",
    "rom": "anata",
    "vn": "Bạn, Anh/Chị",
    "ex": "あなたの名前は？",
    "exVn": "Tên bạn là gì?"
  },
  {
    "jp": "彼",
    "rom": "kare",
    "vn": "Anh ấy, Bạn trai",
    "ex": "彼は先生です。",
    "exVn": "Anh ấy là giáo viên."
  },
  {
    "jp": "彼女",
    "rom": "kanojo",
    "vn": "Cô ấy, Bạn gái",
    "ex": "彼女は医者です。",
    "exVn": "Cô ấy là bác sĩ."
  },
  {
    "jp": "これ",
    "rom": "kore",
    "vn": "Cái này",
    "ex": "これは何ですか？",
    "exVn": "Cái này là gì?"
  },
  {
    "jp": "それ",
    "rom": "sore",
    "vn": "Cái đó",
    "ex": "それは本です。",
    "exVn": "Cái đó là sách."
  },
  {
    "jp": "あれ",
    "rom": "are",
    "vn": "Cái kia",
    "ex": "あれは車です。",
    "exVn": "Cái kia là xe hơi."
  },
  {
    "jp": "ここ",
    "rom": "koko",
    "vn": "Ở đây",
    "ex": "ここは学校です。",
    "exVn": "Đây là trường học."
  },
  {
    "jp": "そこ",
    "rom": "soko",
    "vn": "Ở đó",
    "ex": "そこに座ってください。",
    "exVn": "Hãy ngồi ở đó."
  },
  {
    "jp": "あそこ",
    "rom": "asoko",
    "vn": "Ở kia",
    "ex": "あそこがトイレです。",
    "exVn": "Nhà vệ sinh ở kia."
  },
  {
    "jp": "今日",
    "rom": "kyou",
    "vn": "Hôm nay",
    "ex": "今日は月曜日です。",
    "exVn": "Hôm nay là thứ Hai."
  },
  {
    "jp": "明日",
    "rom": "ashita",
    "vn": "Ngày mai",
    "ex": "明日は休みです。",
    "exVn": "Ngày mai nghỉ."
  },
  {
    "jp": "昨日",
    "rom": "kinou",
    "vn": "Hôm qua",
    "ex": "昨日は雨でした。",
    "exVn": "Hôm qua trời mưa."
  },
  {
    "jp": "今",
    "rom": "ima",
    "vn": "Bây giờ",
    "ex": "今何時ですか？",
    "exVn": "Bây giờ mấy giờ?"
  },
  {
    "jp": "毎日",
    "rom": "mainichi",
    "vn": "Mỗi ngày",
    "ex": "毎日勉強します。",
    "exVn": "Tôi học mỗi ngày."
  },
  {
    "jp": "いつも",
    "rom": "itsumo",
    "vn": "Luôn luôn",
    "ex": "いつも早起きします。",
    "exVn": "Tôi luôn dậy sớm."
  },
  {
    "jp": "時々",
    "rom": "tokidoki",
    "vn": "Thỉnh thoảng",
    "ex": "時々映画を見ます。",
    "exVn": "Thỉnh thoảng tôi xem phim."
  },
  {
    "jp": "もう",
    "rom": "mou",
    "vn": "Rồi, Đã",
    "ex": "もう食べました。",
    "exVn": "Đã ăn rồi."
  },
  {
    "jp": "まだ",
    "rom": "mada",
    "vn": "Vẫn còn, Chưa",
    "ex": "まだ起きていません。",
    "exVn": "Vẫn chưa dậy."
  },
  {
    "jp": "早い",
    "rom": "hayai",
    "vn": "Sớm, Nhanh",
    "ex": "もう早い時間です。",
    "exVn": "Đã sớm rồi."
  },
  {
    "jp": "遅い",
    "rom": "osoi",
    "vn": "Muộn, Chậm",
    "ex": "バスが遅いです。",
    "exVn": "Xe buýt đến muộn."
  },
  {
    "jp": "大きい",
    "rom": "ookii",
    "vn": "To, Lớn",
    "ex": "大きい犬がいます。",
    "exVn": "Có một con chó to."
  },
  {
    "jp": "小さい",
    "rom": "chiisai",
    "vn": "Nhỏ, Bé",
    "ex": "小さい猫が好きです。",
    "exVn": "Tôi thích mèo nhỏ."
  },
  {
    "jp": "高い",
    "rom": "takai",
    "vn": "Cao, Đắt",
    "ex": "このビルは高いです。",
    "exVn": "Tòa nhà này cao."
  },
  {
    "jp": "安い",
    "rom": "yasui",
    "vn": "Rẻ, Bình yên",
    "ex": "このレストランは安いです。",
    "exVn": "Nhà hàng này rẻ."
  },
  {
    "jp": "新しい",
    "rom": "atarashii",
    "vn": "Mới",
    "ex": "新しい本を買いました。",
    "exVn": "Tôi đã mua sách mới."
  },
  {
    "jp": "古い",
    "rom": "furui",
    "vn": "Cũ",
    "ex": "この家は古いです。",
    "exVn": "Ngôi nhà này cũ."
  },
  {
    "jp": "暑い",
    "rom": "atsui",
    "vn": "Nóng (thời tiết)",
    "ex": "夏は暑いです。",
    "exVn": "Mùa hè nóng."
  },
  {
    "jp": "寒い",
    "rom": "samui",
    "vn": "Lạnh",
    "ex": "冬は寒いです。",
    "exVn": "Mùa đông lạnh."
  },
  {
    "jp": "難しい",
    "rom": "muzukashii",
    "vn": "Khó",
    "ex": "日本語は難しいです。",
    "exVn": "Tiếng Nhật khó."
  },
  {
    "jp": "易しい",
    "rom": "yasashii",
    "vn": "Dễ",
    "ex": "この問題は易しいです。",
    "exVn": "Bài này dễ."
  },
  {
    "jp": "楽しい",
    "rom": "tanoshii",
    "vn": "Vui, Thú vị",
    "ex": "パーティーは楽しかったです。",
    "exVn": "Bữa tiệc rất vui."
  },
  {
    "jp": "忙しい",
    "rom": "isogashii",
    "vn": "Bận rộn",
    "ex": "毎日忙しいです。",
    "exVn": "Ngày nào cũng bận."
  },
  {
    "jp": "好き",
    "rom": "suki",
    "vn": "Thích",
    "ex": "音楽が好きです。",
    "exVn": "Tôi thích âm nhạc."
  },
  {
    "jp": "嫌い",
    "rom": "kirai",
    "vn": "Ghét",
    "ex": "魚が嫌いです。",
    "exVn": "Tôi ghét cá."
  },
  {
    "jp": "上手",
    "rom": "jouzu",
    "vn": "Giỏi, Khéo",
    "ex": "料理が上手です。",
    "exVn": "Nấu ăn giỏi."
  },
  {
    "jp": "下手",
    "rom": "heta",
    "vn": "Kém, Vụng",
    "ex": "歌が下手です。",
    "exVn": "Hát kém."
  },
  {
    "jp": "元気",
    "rom": "genki",
    "vn": "Khỏe mạnh",
    "ex": "お元気ですか？",
    "exVn": "Bạn có khỏe không?"
  },
  {
    "jp": "大丈夫",
    "rom": "daijoubu",
    "vn": "Không sao, Ổn",
    "ex": "大丈夫ですか？",
    "exVn": "Bạn ổn không?"
  },
  {
    "jp": "食べる",
    "rom": "taberu",
    "vn": "Ăn",
    "ex": "ご飯を食べます。",
    "exVn": "Tôi ăn cơm."
  },
  {
    "jp": "飲む",
    "rom": "nomu",
    "vn": "Uống",
    "ex": "水を飲みます。",
    "exVn": "Tôi uống nước."
  },
  {
    "jp": "行く",
    "rom": "iku",
    "vn": "Đi",
    "ex": "学校に行きます。",
    "exVn": "Tôi đi học."
  },
  {
    "jp": "来る",
    "rom": "kuru",
    "vn": "Đến",
    "ex": "友達が来ました。",
    "exVn": "Bạn đến rồi."
  },
  {
    "jp": "帰る",
    "rom": "kaeru",
    "vn": "Về (nhà)",
    "ex": "家に帰ります。",
    "exVn": "Về nhà."
  },
  {
    "jp": "見る",
    "rom": "miru",
    "vn": "Nhìn, Xem",
    "ex": "テレビを見ます。",
    "exVn": "Xem TV."
  },
  {
    "jp": "聞く",
    "rom": "kiku",
    "vn": "Nghe, Hỏi",
    "ex": "音楽を聞きます。",
    "exVn": "Nghe nhạc."
  },
  {
    "jp": "話す",
    "rom": "hanasu",
    "vn": "Nói chuyện",
    "ex": "日本語で話します。",
    "exVn": "Nói chuyện bằng tiếng Nhật."
  },
  {
    "jp": "読む",
    "rom": "yomu",
    "vn": "Đọc",
    "ex": "本を読みます。",
    "exVn": "Đọc sách."
  },
  {
    "jp": "書く",
    "rom": "kaku",
    "vn": "Viết",
    "ex": "手紙を書きます。",
    "exVn": "Viết thư."
  },
  {
    "jp": "買う",
    "rom": "kau",
    "vn": "Mua",
    "ex": "果物を買います。",
    "exVn": "Mua hoa quả."
  },
  {
    "jp": "売る",
    "rom": "uru",
    "vn": "Bán",
    "ex": "お土産を売っています。",
    "exVn": "Bán quà lưu niệm."
  },
  {
    "jp": "使う",
    "rom": "tsukau",
    "vn": "Sử dụng",
    "ex": "辞書を使います。",
    "exVn": "Sử dụng từ điển."
  },
  {
    "jp": "わかる",
    "rom": "wakaru",
    "vn": "Hiểu",
    "ex": "日本語がわかります。",
    "exVn": "Tôi hiểu tiếng Nhật."
  },
  {
    "jp": "知る",
    "rom": "shiru",
    "vn": "Biết",
    "ex": "彼の名前を知っています。",
    "exVn": "Tôi biết tên anh ấy."
  },
  {
    "jp": "思う",
    "rom": "omou",
    "vn": "Nghĩ, Cảm thấy",
    "ex": "そう思います。",
    "exVn": "Tôi nghĩ vậy."
  },
  {
    "jp": "始める",
    "rom": "hajimeru",
    "vn": "Bắt đầu",
    "ex": "授業を始めます。",
    "exVn": "Bắt đầu buổi học."
  },
  {
    "jp": "終わる",
    "rom": "owaru",
    "vn": "Kết thúc",
    "ex": "仕事が終わりました。",
    "exVn": "Công việc đã xong."
  },
  {
    "jp": "起きる",
    "rom": "okiru",
    "vn": "Thức dậy",
    "ex": "七時に起きます。",
    "exVn": "Dậy lúc 7 giờ."
  },
  {
    "jp": "寝る",
    "rom": "neru",
    "vn": "Ngủ",
    "ex": "十一時に寝ます。",
    "exVn": "Ngủ lúc 11 giờ."
  },
  {
    "jp": "待つ",
    "rom": "matsu",
    "vn": "Chờ đợi",
    "ex": "バスを待っています。",
    "exVn": "Đang chờ xe buýt."
  },
  {
    "jp": "会う",
    "rom": "au",
    "vn": "Gặp gỡ",
    "ex": "友達に会います。",
    "exVn": "Gặp bạn bè."
  },
  {
    "jp": "入る",
    "rom": "hairu",
    "vn": "Vào, Bước vào",
    "ex": "部屋に入ります。",
    "exVn": "Vào phòng."
  },
  {
    "jp": "出る",
    "rom": "deru",
    "vn": "Ra, Xuất hiện",
    "ex": "外に出ます。",
    "exVn": "Ra ngoài."
  },
  {
    "jp": "乗る",
    "rom": "noru",
    "vn": "Lên (xe, tàu)",
    "ex": "電車に乗ります。",
    "exVn": "Lên tàu điện."
  },
  {
    "jp": "降りる",
    "rom": "oriru",
    "vn": "Xuống (xe)",
    "ex": "次の駅で降ります。",
    "exVn": "Xuống ga tiếp theo."
  },
  {
    "jp": "かける",
    "rom": "kakeru",
    "vn": "Gọi (điện)",
    "ex": "電話をかけます。",
    "exVn": "Gọi điện."
  },
  {
    "jp": "開ける",
    "rom": "akeru",
    "vn": "Mở",
    "ex": "窓を開けます。",
    "exVn": "Mở cửa sổ."
  },
  {
    "jp": "閉める",
    "rom": "shimeru",
    "vn": "Đóng",
    "ex": "ドアを閉めます。",
    "exVn": "Đóng cửa."
  },
  {
    "jp": "つける",
    "rom": "tsukeru",
    "vn": "Bật",
    "ex": "電気をつけます。",
    "exVn": "Bật đèn."
  },
  {
    "jp": "消す",
    "rom": "kesu",
    "vn": "Tắt, Xóa",
    "ex": "電気を消します。",
    "exVn": "Tắt đèn."
  },
  {
    "jp": "洗う",
    "rom": "arau",
    "vn": "Rửa",
    "ex": "手を洗います。",
    "exVn": "Rửa tay."
  },
  {
    "jp": "掃除する",
    "rom": "souji suru",
    "vn": "Dọn dẹp",
    "ex": "部屋を掃除します。",
    "exVn": "Dọn dẹp phòng."
  },
  {
    "jp": "勉強する",
    "rom": "benkyou suru",
    "vn": "Học",
    "ex": "日本語を勉強します。",
    "exVn": "Học tiếng Nhật."
  },
  {
    "jp": "練習する",
    "rom": "renshuu suru",
    "vn": "Luyện tập",
    "ex": "毎日練習します。",
    "exVn": "Luyện tập mỗi ngày."
  },
  {
    "jp": "ご飯",
    "rom": "gohan",
    "vn": "Cơm, Bữa ăn",
    "ex": "ご飯を食べましょう。",
    "exVn": "Hãy cùng ăn cơm."
  },
  {
    "jp": "パン",
    "rom": "pan",
    "vn": "Bánh mì",
    "ex": "朝パンを食べます。",
    "exVn": "Buổi sáng ăn bánh mì."
  },
  {
    "jp": "お水",
    "rom": "omizu",
    "vn": "Nước",
    "ex": "お水をください。",
    "exVn": "Cho tôi nước."
  },
  {
    "jp": "お茶",
    "rom": "ocha",
    "vn": "Trà",
    "ex": "お茶を飲みませんか。",
    "exVn": "Uống trà nhé?"
  },
  {
    "jp": "コーヒー",
    "rom": "koohii",
    "vn": "Cà phê",
    "ex": "コーヒーが好きです。",
    "exVn": "Tôi thích cà phê."
  },
  {
    "jp": "りんご",
    "rom": "ringo",
    "vn": "Táo",
    "ex": "りんごを一つください。",
    "exVn": "Cho tôi một quả táo."
  },
  {
    "jp": "スーパー",
    "rom": "suupaa",
    "vn": "Siêu thị",
    "ex": "スーパーで買い物します。",
    "exVn": "Mua sắm ở siêu thị."
  },
  {
    "jp": "駅",
    "rom": "eki",
    "vn": "Ga tàu",
    "ex": "駅はどこですか？",
    "exVn": "Ga tàu ở đâu?"
  },
  {
    "jp": "電車",
    "rom": "densha",
    "vn": "Tàu điện",
    "ex": "電車で行きます。",
    "exVn": "Đi bằng tàu điện."
  },
  {
    "jp": "バス",
    "rom": "basu",
    "vn": "Xe buýt",
    "ex": "バスに乗ります。",
    "exVn": "Đi xe buýt."
  },
  {
    "jp": "タクシー",
    "rom": "takushii",
    "vn": "Taxi",
    "ex": "タクシーを呼びます。",
    "exVn": "Gọi taxi."
  },
  {
    "jp": "学校",
    "rom": "gakkou",
    "vn": "Trường học",
    "ex": "学校に行きます。",
    "exVn": "Đến trường."
  },
  {
    "jp": "会社",
    "rom": "kaisha",
    "vn": "Công ty",
    "ex": "会社で働いています。",
    "exVn": "Làm việc ở công ty."
  },
  {
    "jp": "病院",
    "rom": "byouin",
    "vn": "Bệnh viện",
    "ex": "病院に行きます。",
    "exVn": "Đến bệnh viện."
  },
  {
    "jp": "銀行",
    "rom": "ginkou",
    "vn": "Ngân hàng",
    "ex": "銀行でお金を下ろします。",
    "exVn": "Rút tiền ở ngân hàng."
  },
  {
    "jp": "郵便局",
    "rom": "yuubinkyoku",
    "vn": "Bưu điện",
    "ex": "郵便局で手紙を出します。",
    "exVn": "Gửi thư ở bưu điện."
  },
  {
    "jp": "レストラン",
    "rom": "resutoran",
    "vn": "Nhà hàng",
    "ex": "レストランで食べます。",
    "exVn": "Ăn ở nhà hàng."
  },
  {
    "jp": "ホテル",
    "rom": "hoteru",
    "vn": "Khách sạn",
    "ex": "ホテルに泊まります。",
    "exVn": "Nghỉ ở khách sạn."
  },
  {
    "jp": "家",
    "rom": "ie/uchi",
    "vn": "Nhà",
    "ex": "家に帰ります。",
    "exVn": "Về nhà."
  },
  {
    "jp": "部屋",
    "rom": "heya",
    "vn": "Phòng",
    "ex": "部屋を掃除します。",
    "exVn": "Dọn phòng."
  },
  {
    "jp": "トイレ",
    "rom": "toire",
    "vn": "Nhà vệ sinh",
    "ex": "トイレはどこですか？",
    "exVn": "Nhà vệ sinh ở đâu?"
  },
  {
    "jp": "電話",
    "rom": "denwa",
    "vn": "Điện thoại",
    "ex": "電話をかけます。",
    "exVn": "Gọi điện thoại."
  },
  {
    "jp": "テレビ",
    "rom": "terebi",
    "vn": "TV",
    "ex": "テレビを見ます。",
    "exVn": "Xem TV."
  },
  {
    "jp": "ラジオ",
    "rom": "rajio",
    "vn": "Đài radio",
    "ex": "ラジオを聞きます。",
    "exVn": "Nghe đài."
  },
  {
    "jp": "新聞",
    "rom": "shinbun",
    "vn": "Báo",
    "ex": "毎朝新聞を読みます。",
    "exVn": "Đọc báo mỗi sáng."
  },
  {
    "jp": "本",
    "rom": "hon",
    "vn": "Sách",
    "ex": "本を読むのが好きです。",
    "exVn": "Tôi thích đọc sách."
  },
  {
    "jp": "辞書",
    "rom": "jisho",
    "vn": "Từ điển",
    "ex": "辞書を引きます。",
    "exVn": "Tra từ điển."
  },
  {
    "jp": "ペン",
    "rom": "pen",
    "vn": "Bút",
    "ex": "ペンを貸してください。",
    "exVn": "Cho tôi mượn bút."
  },
  {
    "jp": "紙",
    "rom": "kami",
    "vn": "Giấy",
    "ex": "紙に書きます。",
    "exVn": "Viết lên giấy."
  },
  {
    "jp": "お金",
    "rom": "okane",
    "vn": "Tiền",
    "ex": "お金がありません。",
    "exVn": "Tôi không có tiền."
  },
  {
    "jp": "円",
    "rom": "en",
    "vn": "Đồng yên",
    "ex": "千円です。",
    "exVn": "Một nghìn yên."
  },
  {
    "jp": "いくら",
    "rom": "ikura",
    "vn": "Bao nhiêu tiền",
    "ex": "これはいくらですか？",
    "exVn": "Cái này bao nhiêu tiền?"
  },
  {
    "jp": "あまり",
    "rom": "amari",
    "vn": "Không lắm, Quá",
    "ex": "あまり好きではないです。",
    "exVn": "Không thích lắm."
  },
  {
    "jp": "とても",
    "rom": "totemo",
    "vn": "Rất",
    "ex": "とても嬉しいです。",
    "exVn": "Vui lắm."
  },
  {
    "jp": "少し",
    "rom": "sukoshi",
    "vn": "Một chút",
    "ex": "少し待ってください。",
    "exVn": "Chờ một chút."
  },
  {
    "jp": "たくさん",
    "rom": "takusan",
    "vn": "Nhiều",
    "ex": "たくさん食べました。",
    "exVn": "Ăn nhiều rồi."
  },
  {
    "jp": "全部",
    "rom": "zenbu",
    "vn": "Tất cả",
    "ex": "全部食べました。",
    "exVn": "Ăn hết rồi."
  },
  {
    "jp": "一緒に",
    "rom": "issho ni",
    "vn": "Cùng nhau",
    "ex": "一緒に行きましょう。",
    "exVn": "Cùng nhau đi nhé."
  },
  {
    "jp": "一人で",
    "rom": "hitori de",
    "vn": "Một mình",
    "ex": "一人で旅行します。",
    "exVn": "Đi du lịch một mình."
  },
  {
    "jp": "ちょっと",
    "rom": "chotto",
    "vn": "Một chút, Hơi",
    "ex": "ちょっと待ってください。",
    "exVn": "Chờ một chút."
  },
  {
    "jp": "だいたい",
    "rom": "daitai",
    "vn": "Đại khái, Khoảng",
    "ex": "だいたい一時間かかります。",
    "exVn": "Mất khoảng một tiếng."
  },
  {
    "jp": "ゆっくり",
    "rom": "yukkuri",
    "vn": "Từ từ",
    "ex": "ゆっくり話してください。",
    "exVn": "Nói chậm lại."
  },
  {
    "jp": "はっきり",
    "rom": "hakkiri",
    "vn": "Rõ ràng",
    "ex": "はっきり言ってください。",
    "exVn": "Nói rõ ràng."
  },
  {
    "jp": "もちろん",
    "rom": "mochiron",
    "vn": "Tất nhiên",
    "ex": "もちろんです。",
    "exVn": "Tất nhiên rồi."
  },
  {
    "jp": "大学",
    "rom": "daigaku",
    "vn": "Đại học",
    "ex": "大学で勉強します。",
    "exVn": "Học ở đại học."
  },
  {
    "jp": "先生",
    "rom": "sensei",
    "vn": "Giáo viên, Bác sĩ",
    "ex": "先生は優しいです。",
    "exVn": "Thầy giáo tốt bụng."
  },
  {
    "jp": "学生",
    "rom": "gakusei",
    "vn": "Học sinh, Sinh viên",
    "ex": "私は学生です。",
    "exVn": "Tôi là học sinh."
  },
  {
    "jp": "友達",
    "rom": "tomodachi",
    "vn": "Bạn bè",
    "ex": "友達と遊びます。",
    "exVn": "Chơi với bạn bè."
  },
  {
    "jp": "家族",
    "rom": "kazoku",
    "vn": "Gia đình",
    "ex": "家族と旅行します。",
    "exVn": "Du lịch với gia đình."
  },
  {
    "jp": "子供",
    "rom": "kodomo",
    "vn": "Trẻ em",
    "ex": "子供が好きです。",
    "exVn": "Tôi thích trẻ em."
  },
  {
    "jp": "お父さん",
    "rom": "otousan",
    "vn": "Bố",
    "ex": "お父さんは会社員です。",
    "exVn": "Bố là nhân viên văn phòng."
  },
  {
    "jp": "お母さん",
    "rom": "okaasan",
    "vn": "Mẹ",
    "ex": "お母さんの料理が好きです。",
    "exVn": "Tôi thích món ăn của mẹ."
  },
  {
    "jp": "名前",
    "rom": "namae",
    "vn": "Tên",
    "ex": "お名前は何ですか？",
    "exVn": "Tên bạn là gì?"
  },
  {
    "jp": "天気",
    "rom": "tenki",
    "vn": "Thời tiết",
    "ex": "今日の天気は？",
    "exVn": "Thời tiết hôm nay thế nào?"
  },
  {
    "jp": "春",
    "rom": "haru",
    "vn": "Mùa xuân",
    "ex": "春は桜がきれいです。",
    "exVn": "Mùa xuân hoa anh đào đẹp."
  },
  {
    "jp": "夏",
    "rom": "natsu",
    "vn": "Mùa hè",
    "ex": "夏は暑いです。",
    "exVn": "Mùa hè nóng."
  },
  {
    "jp": "秋",
    "rom": "aki",
    "vn": "Mùa thu",
    "ex": "秋は涼しいです。",
    "exVn": "Mùa thu mát mẻ."
  },
  {
    "jp": "冬",
    "rom": "fuyu",
    "vn": "Mùa đông",
    "ex": "冬は寒いです。",
    "exVn": "Mùa đông lạnh."
  },
  {
    "jp": "朝",
    "rom": "asa",
    "vn": "Buổi sáng",
    "ex": "朝ご飯を食べます。",
    "exVn": "Ăn sáng."
  },
  {
    "jp": "昼",
    "rom": "hiru",
    "vn": "Buổi trưa",
    "ex": "昼ご飯を食べます。",
    "exVn": "Ăn trưa."
  },
  {
    "jp": "夜",
    "rom": "yoru",
    "vn": "Buổi tối",
    "ex": "夜は早く寝ます。",
    "exVn": "Tối ngủ sớm."
  },
  {
    "jp": "午前",
    "rom": "gozen",
    "vn": "Buổi sáng (AM)",
    "ex": "午前十時です。",
    "exVn": "Mười giờ sáng."
  },
  {
    "jp": "午後",
    "rom": "gogo",
    "vn": "Buổi chiều (PM)",
    "ex": "午後三時に会いましょう。",
    "exVn": "Gặp nhau lúc 3 giờ chiều."
  },
  {
    "jp": "今週",
    "rom": "konshuu",
    "vn": "Tuần này",
    "ex": "今週は忙しいです。",
    "exVn": "Tuần này bận."
  },
  {
    "jp": "来週",
    "rom": "raishuu",
    "vn": "Tuần sau",
    "ex": "来週また会いましょう。",
    "exVn": "Tuần sau gặp lại."
  },
  {
    "jp": "先週",
    "rom": "senshuu",
    "vn": "Tuần trước",
    "ex": "先週旅行しました。",
    "exVn": "Tuần trước đi du lịch."
  }
];
// ─── N4 Vocabulary (200 từ cốt lõi) ─────────────────────────
const VOCAB_N4 = [
  {
    "jp": "意味",
    "rom": "imi",
    "vn": "Ý nghĩa",
    "ex": "この言葉の意味は？",
    "exVn": "Ý nghĩa của từ này là gì?"
  },
  {
    "jp": "意見",
    "rom": "iken",
    "vn": "Ý kiến",
    "ex": "あなたの意見を聞かせてください。",
    "exVn": "Cho tôi nghe ý kiến của bạn."
  },
  {
    "jp": "会議",
    "rom": "kaigi",
    "vn": "Cuộc họp",
    "ex": "今日は会議があります。",
    "exVn": "Hôm nay có cuộc họp."
  },
  {
    "jp": "関係",
    "rom": "kankei",
    "vn": "Quan hệ",
    "ex": "二人の関係はよくない。",
    "exVn": "Quan hệ của hai người không tốt."
  },
  {
    "jp": "機会",
    "rom": "kikai",
    "vn": "Cơ hội",
    "ex": "この機会を利用してください。",
    "exVn": "Hãy tận dụng cơ hội này."
  },
  {
    "jp": "気持ち",
    "rom": "kimochi",
    "vn": "Cảm xúc, Cảm giác",
    "ex": "あなたの気持ちがわかります。",
    "exVn": "Tôi hiểu cảm xúc của bạn."
  },
  {
    "jp": "記念",
    "rom": "kinen",
    "vn": "Kỷ niệm",
    "ex": "記念写真を撮りましょう。",
    "exVn": "Hãy chụp ảnh kỷ niệm."
  },
  {
    "jp": "規則",
    "rom": "kisoku",
    "vn": "Quy tắc",
    "ex": "規則を守ってください。",
    "exVn": "Hãy tuân theo quy tắc."
  },
  {
    "jp": "教育",
    "rom": "kyōiku",
    "vn": "Giáo dục",
    "ex": "子供の教育は大切です。",
    "exVn": "Giáo dục trẻ em rất quan trọng."
  },
  {
    "jp": "競争",
    "rom": "kyōsō",
    "vn": "Cạnh tranh",
    "ex": "激しい競争があります。",
    "exVn": "Có sự cạnh tranh khốc liệt."
  },
  {
    "jp": "計画",
    "rom": "keikaku",
    "vn": "Kế hoạch",
    "ex": "旅行の計画を立てた。",
    "exVn": "Tôi đã lên kế hoạch du lịch."
  },
  {
    "jp": "経験",
    "rom": "keiken",
    "vn": "Kinh nghiệm",
    "ex": "いい経験になりました。",
    "exVn": "Đó là kinh nghiệm tốt."
  },
  {
    "jp": "研究",
    "rom": "kenkyū",
    "vn": "Nghiên cứu",
    "ex": "大学で研究しています。",
    "exVn": "Tôi đang nghiên cứu ở đại học."
  },
  {
    "jp": "原因",
    "rom": "gen'in",
    "vn": "Nguyên nhân",
    "ex": "事故の原因を調べる。",
    "exVn": "Điều tra nguyên nhân vụ tai nạn."
  },
  {
    "jp": "公園",
    "rom": "kōen",
    "vn": "Công viên",
    "ex": "公園で遊びました。",
    "exVn": "Tôi đã chơi ở công viên."
  },
  {
    "jp": "交通",
    "rom": "kōtsū",
    "vn": "Giao thông",
    "ex": "交通が不便です。",
    "exVn": "Giao thông bất tiện."
  },
  {
    "jp": "合格",
    "rom": "gōkaku",
    "vn": "Đậu (thi), Đạt",
    "ex": "試験に合格しました！",
    "exVn": "Tôi đã đậu kỳ thi!"
  },
  {
    "jp": "困る",
    "rom": "komaru",
    "vn": "Khó khăn, Bối rối",
    "ex": "どうしたらいいか困っています。",
    "exVn": "Tôi đang bối rối không biết làm gì."
  },
  {
    "jp": "最近",
    "rom": "saikin",
    "vn": "Gần đây",
    "ex": "最近忙しいです。",
    "exVn": "Gần đây tôi bận."
  },
  {
    "jp": "残念",
    "rom": "zannen",
    "vn": "Tiếc, Đáng tiếc",
    "ex": "残念ながら行けません。",
    "exVn": "Tiếc là tôi không thể đi."
  },
  {
    "jp": "自信",
    "rom": "jishin",
    "vn": "Tự tin",
    "ex": "自信を持ってください。",
    "exVn": "Hãy tự tin vào bản thân."
  },
  {
    "jp": "事故",
    "rom": "jiko",
    "vn": "Tai nạn",
    "ex": "事故に気をつけてください。",
    "exVn": "Hãy cẩn thận tai nạn."
  },
  {
    "jp": "自由",
    "rom": "jiyū",
    "vn": "Tự do",
    "ex": "自由な時間が好きです。",
    "exVn": "Tôi thích thời gian tự do."
  },
  {
    "jp": "社会",
    "rom": "shakai",
    "vn": "Xã hội",
    "ex": "社会に貢献したい。",
    "exVn": "Tôi muốn đóng góp cho xã hội."
  },
  {
    "jp": "習慣",
    "rom": "shūkan",
    "vn": "Thói quen",
    "ex": "毎朝運動する習慣があります。",
    "exVn": "Tôi có thói quen tập thể dục mỗi sáng."
  },
  {
    "jp": "準備",
    "rom": "junbi",
    "vn": "Chuẩn bị",
    "ex": "旅行の準備をしています。",
    "exVn": "Tôi đang chuẩn bị cho chuyến đi."
  },
  {
    "jp": "紹介",
    "rom": "shōkai",
    "vn": "Giới thiệu",
    "ex": "友達を紹介します。",
    "exVn": "Tôi giới thiệu bạn tôi."
  },
  {
    "jp": "将来",
    "rom": "shōrai",
    "vn": "Tương lai",
    "ex": "将来の夢は何ですか？",
    "exVn": "Ước mơ tương lai của bạn là gì?"
  },
  {
    "jp": "生活",
    "rom": "seikatsu",
    "vn": "Cuộc sống",
    "ex": "日本での生活は楽しい。",
    "exVn": "Cuộc sống ở Nhật thú vị."
  },
  {
    "jp": "成功",
    "rom": "seikō",
    "vn": "Thành công",
    "ex": "プロジェクトが成功した。",
    "exVn": "Dự án thành công."
  },
  {
    "jp": "説明",
    "rom": "setsumei",
    "vn": "Giải thích",
    "ex": "詳しく説明してください。",
    "exVn": "Hãy giải thích chi tiết."
  },
  {
    "jp": "相談",
    "rom": "sōdan",
    "vn": "Tư vấn, Thảo luận",
    "ex": "先生に相談しました。",
    "exVn": "Tôi đã tư vấn với giáo viên."
  },
  {
    "jp": "続く",
    "rom": "tsuzuku",
    "vn": "Tiếp tục",
    "ex": "雨が続いています。",
    "exVn": "Mưa vẫn tiếp tục."
  },
  {
    "jp": "大切",
    "rom": "taisetsu",
    "vn": "Quan trọng, Quý trọng",
    "ex": "健康が大切です。",
    "exVn": "Sức khỏe rất quan trọng."
  },
  {
    "jp": "体験",
    "rom": "taiken",
    "vn": "Trải nghiệm",
    "ex": "いい体験ができた。",
    "exVn": "Tôi đã có trải nghiệm tốt."
  },
  {
    "jp": "注意",
    "rom": "chūi",
    "vn": "Chú ý, Cảnh báo",
    "ex": "足元に注意してください。",
    "exVn": "Hãy chú ý chân."
  },
  {
    "jp": "努力",
    "rom": "doryoku",
    "vn": "Nỗ lực",
    "ex": "努力すれば夢が叶う。",
    "exVn": "Nếu nỗ lực thì ước mơ sẽ thành sự thật."
  },
  {
    "jp": "特別",
    "rom": "tokubetsu",
    "vn": "Đặc biệt",
    "ex": "今日は特別な日です。",
    "exVn": "Hôm nay là ngày đặc biệt."
  },
  {
    "jp": "人気",
    "rom": "ninki",
    "vn": "Nổi tiếng, Phổ biến",
    "ex": "このお店は人気があります。",
    "exVn": "Quán này nổi tiếng."
  },
  {
    "jp": "必要",
    "rom": "hitsuyō",
    "vn": "Cần thiết",
    "ex": "パスポートが必要です。",
    "exVn": "Cần có hộ chiếu."
  },
  {
    "jp": "文化",
    "rom": "bunka",
    "vn": "Văn hóa",
    "ex": "日本の文化に興味がある。",
    "exVn": "Tôi quan tâm đến văn hóa Nhật."
  },
  {
    "jp": "方法",
    "rom": "hōhō",
    "vn": "Phương pháp",
    "ex": "いい方法を教えてください。",
    "exVn": "Hãy dạy tôi phương pháp tốt."
  },
  {
    "jp": "間違い",
    "rom": "machigai",
    "vn": "Sai lầm, Lỗi",
    "ex": "間違いがあったら直してください。",
    "exVn": "Nếu có sai thì hãy sửa."
  },
  {
    "jp": "問題",
    "rom": "mondai",
    "vn": "Vấn đề",
    "ex": "何か問題がありますか？",
    "exVn": "Có vấn đề gì không?"
  },
  {
    "jp": "理由",
    "rom": "riyū",
    "vn": "Lý do",
    "ex": "遅刻した理由を教えて。",
    "exVn": "Nói lý do đến muộn đi."
  },
  {
    "jp": "利用",
    "rom": "riyō",
    "vn": "Sử dụng, Tận dụng",
    "ex": "公共交通を利用しています。",
    "exVn": "Tôi sử dụng giao thông công cộng."
  },
  {
    "jp": "留学",
    "rom": "ryūgaku",
    "vn": "Du học",
    "ex": "日本に留学したいです。",
    "exVn": "Tôi muốn du học ở Nhật."
  },
  {
    "jp": "連絡",
    "rom": "renraku",
    "vn": "Liên lạc",
    "ex": "後で連絡します。",
    "exVn": "Tôi sẽ liên lạc sau."
  },
  {
    "jp": "忘れる",
    "rom": "wasureru",
    "vn": "Quên",
    "ex": "名前を忘れてしまいました。",
    "exVn": "Tôi đã quên mất tên rồi."
  },
  {
    "jp": "集まる",
    "rom": "atsumaru",
    "vn": "Tập hợp, Tụ họp",
    "ex": "みんなが広場に集まった。",
    "exVn": "Mọi người tập hợp ở quảng trường."
  },
  {
    "jp": "上がる",
    "rom": "agaru",
    "vn": "Tăng lên, Leo lên",
    "ex": "物価が上がっています。",
    "exVn": "Giá cả đang tăng."
  },
  {
    "jp": "落ちる",
    "rom": "ochiru",
    "vn": "Rơi, Trượt",
    "ex": "試験に落ちてしまった。",
    "exVn": "Tôi đã trượt kỳ thi."
  },
  {
    "jp": "変わる",
    "rom": "kawaru",
    "vn": "Thay đổi",
    "ex": "考えが変わりました。",
    "exVn": "Suy nghĩ của tôi đã thay đổi."
  },
  {
    "jp": "決める",
    "rom": "kimeru",
    "vn": "Quyết định",
    "ex": "行き先を決めましょう。",
    "exVn": "Hãy quyết định điểm đến."
  },
  {
    "jp": "比べる",
    "rom": "kuraberu",
    "vn": "So sánh",
    "ex": "二つを比べてみる。",
    "exVn": "Thử so sánh hai cái."
  },
  {
    "jp": "生まれる",
    "rom": "umareru",
    "vn": "Sinh ra",
    "ex": "東京で生まれました。",
    "exVn": "Tôi sinh ra ở Tokyo."
  },
  {
    "jp": "育てる",
    "rom": "sodateru",
    "vn": "Nuôi dưỡng, Trồng",
    "ex": "子供を大切に育てる。",
    "exVn": "Nuôi dưỡng trẻ em cẩn thận."
  },
  {
    "jp": "調べる",
    "rom": "shiraberu",
    "vn": "Điều tra, Tra cứu",
    "ex": "インターネットで調べた。",
    "exVn": "Tôi đã tra cứu trên internet."
  },
  {
    "jp": "伝える",
    "rom": "tsutaeru",
    "vn": "Truyền đạt, Thông báo",
    "ex": "気持ちを伝えたい。",
    "exVn": "Tôi muốn truyền đạt cảm xúc."
  },
  {
    "jp": "直す",
    "rom": "naosu",
    "vn": "Sửa chữa",
    "ex": "間違いを直してください。",
    "exVn": "Hãy sửa lỗi."
  },
  {
    "jp": "直る",
    "rom": "naoru",
    "vn": "Được sửa, Khỏi bệnh",
    "ex": "風邪が直りました。",
    "exVn": "Tôi đã khỏi cảm."
  },
  {
    "jp": "習う",
    "rom": "narau",
    "vn": "Học (theo thầy)",
    "ex": "ピアノを習っています。",
    "exVn": "Tôi đang học piano."
  },
  {
    "jp": "慣れる",
    "rom": "nareru",
    "vn": "Quen với",
    "ex": "日本の生活に慣れた。",
    "exVn": "Tôi đã quen với cuộc sống Nhật."
  },
  {
    "jp": "似る",
    "rom": "niru",
    "vn": "Giống, Tương tự",
    "ex": "兄弟がよく似ています。",
    "exVn": "Anh chị em giống nhau."
  },
  {
    "jp": "脱ぐ",
    "rom": "nugu",
    "vn": "Cởi (quần áo), Tháo (giày)",
    "ex": "靴を脱いで入ってください。",
    "exVn": "Hãy tháo giày vào."
  },
  {
    "jp": "喜ぶ",
    "rom": "yorokobu",
    "vn": "Vui mừng",
    "ex": "プレゼントをもらって喜んだ。",
    "exVn": "Nhận quà nên vui mừng."
  },
  {
    "jp": "笑う",
    "rom": "warau",
    "vn": "Cười",
    "ex": "みんながたくさん笑った。",
    "exVn": "Mọi người cười nhiều."
  },
  {
    "jp": "泣く",
    "rom": "naku",
    "vn": "Khóc",
    "ex": "悲しくて泣きました。",
    "exVn": "Buồn nên đã khóc."
  },
  {
    "jp": "怒る",
    "rom": "okoru",
    "vn": "Tức giận",
    "ex": "彼は怒っています。",
    "exVn": "Anh ấy đang tức giận."
  },
  {
    "jp": "驚く",
    "rom": "odoroku",
    "vn": "Ngạc nhiên",
    "ex": "結果に驚きました。",
    "exVn": "Tôi ngạc nhiên với kết quả."
  },
  {
    "jp": "安心",
    "rom": "anshin",
    "vn": "Yên tâm",
    "ex": "連絡があって安心しました。",
    "exVn": "Nhận được liên lạc nên yên tâm."
  },
  {
    "jp": "心配",
    "rom": "shinpai",
    "vn": "Lo lắng",
    "ex": "彼のことが心配です。",
    "exVn": "Tôi lo lắng cho anh ấy."
  },
  {
    "jp": "緊張",
    "rom": "kinchō",
    "vn": "Hồi hộp, Căng thẳng",
    "ex": "試験前に緊張します。",
    "exVn": "Tôi hồi hộp trước kỳ thi."
  },
  {
    "jp": "楽しみ",
    "rom": "tanoshimi",
    "vn": "Niềm vui, Mong đợi",
    "ex": "旅行が楽しみです。",
    "exVn": "Tôi mong chờ chuyến đi."
  },
  {
    "jp": "幸せ",
    "rom": "shiawase",
    "vn": "Hạnh phúc",
    "ex": "幸せな家族です。",
    "exVn": "Đó là gia đình hạnh phúc."
  },
  {
    "jp": "大変",
    "rom": "taihen",
    "vn": "Khó khăn, Vất vả, Rất",
    "ex": "大変な仕事ですね。",
    "exVn": "Công việc vất vả nhỉ."
  },
  {
    "jp": "丁寧",
    "rom": "teinei",
    "vn": "Lịch sự, Cẩn thận",
    "ex": "丁寧に説明してくれた。",
    "exVn": "Giải thích cho tôi rất cẩn thận."
  },
  {
    "jp": "親切",
    "rom": "shinsetsu",
    "vn": "Tốt bụng, Thân thiện",
    "ex": "親切な人に会った。",
    "exVn": "Gặp người tốt bụng."
  },
  {
    "jp": "複雑",
    "rom": "fukuzatsu",
    "vn": "Phức tạp",
    "ex": "複雑な問題です。",
    "exVn": "Đó là vấn đề phức tạp."
  },
  {
    "jp": "簡単",
    "rom": "kantan",
    "vn": "Đơn giản, Dễ",
    "ex": "この問題は簡単です。",
    "exVn": "Vấn đề này đơn giản."
  },
  {
    "jp": "詳しい",
    "rom": "kuwashii",
    "vn": "Chi tiết, Rõ ràng",
    "ex": "詳しく教えてください。",
    "exVn": "Hãy chỉ cho tôi chi tiết."
  },
  {
    "jp": "珍しい",
    "rom": "mezurashii",
    "vn": "Hiếm, Lạ",
    "ex": "珍しい食べ物を食べた。",
    "exVn": "Tôi ăn đồ ăn hiếm."
  },
  {
    "jp": "正しい",
    "rom": "tadashii",
    "vn": "Đúng, Chính xác",
    "ex": "正しい答えは何ですか？",
    "exVn": "Đáp án đúng là gì?"
  },
  {
    "jp": "嬉しい",
    "rom": "ureshii",
    "vn": "Vui mừng, Hạnh phúc",
    "ex": "合格して嬉しいです！",
    "exVn": "Tôi vui vì đậu!"
  },
  {
    "jp": "悲しい",
    "rom": "kanashii",
    "vn": "Buồn",
    "ex": "別れが悲しいです。",
    "exVn": "Chia tay thật buồn."
  },
  {
    "jp": "恥ずかしい",
    "rom": "hazukashii",
    "vn": "Xấu hổ",
    "ex": "人前で失敗して恥ずかしかった。",
    "exVn": "Thất bại trước mọi người nên xấu hổ."
  },
  {
    "jp": "寂しい",
    "rom": "sabishii",
    "vn": "Cô đơn",
    "ex": "一人でいると寂しい。",
    "exVn": "Ở một mình thì cô đơn."
  },
  {
    "jp": "怖い",
    "rom": "kowai",
    "vn": "Đáng sợ, Sợ hãi",
    "ex": "お化けが怖いです。",
    "exVn": "Tôi sợ ma."
  },
  {
    "jp": "痛い",
    "rom": "itai",
    "vn": "Đau",
    "ex": "頭が痛いです。",
    "exVn": "Tôi đau đầu."
  },
  {
    "jp": "冷たい",
    "rom": "tsumetai",
    "vn": "Lạnh (xúc giác), Lạnh lùng",
    "ex": "水が冷たいです。",
    "exVn": "Nước lạnh."
  },
  {
    "jp": "温かい",
    "rom": "atatakai",
    "vn": "Ấm áp",
    "ex": "温かいスープが好きです。",
    "exVn": "Tôi thích canh ấm."
  },
  {
    "jp": "柔らかい",
    "rom": "yawarakai",
    "vn": "Mềm mại",
    "ex": "柔らかいパンが好きです。",
    "exVn": "Tôi thích bánh mì mềm."
  },
  {
    "jp": "硬い",
    "rom": "katai",
    "vn": "Cứng",
    "ex": "このステーキは硬いです。",
    "exVn": "Miếng bít tết này cứng."
  },
  {
    "jp": "重い",
    "rom": "omoi",
    "vn": "Nặng",
    "ex": "このアバンは重いです。",
    "exVn": "Cái túi này nặng."
  },
  {
    "jp": "軽い",
    "rom": "karui",
    "vn": "Nhẹ",
    "ex": "軽いものを選びました。",
    "exVn": "Tôi chọn thứ nhẹ."
  },
  {
    "jp": "太い",
    "rom": "futoi",
    "vn": "To, Béo, Dày",
    "ex": "太い木があります。",
    "exVn": "Có cây to."
  },
  {
    "jp": "細い",
    "rom": "hosoi",
    "vn": "Mỏng, Nhỏ, Thon",
    "ex": "細い道を歩きました。",
    "exVn": "Tôi đi trên con đường hẹp."
  },
  {
    "jp": "深い",
    "rom": "fukai",
    "vn": "Sâu",
    "ex": "この川は深いです。",
    "exVn": "Con sông này sâu."
  },
  {
    "jp": "浅い",
    "rom": "asai",
    "vn": "Nông",
    "ex": "この池は浅いです。",
    "exVn": "Cái hồ này nông."
  },
  {
    "jp": "遠い",
    "rom": "tōi",
    "vn": "Xa",
    "ex": "駅が遠いです。",
    "exVn": "Ga tàu ở xa."
  },
  {
    "jp": "近い",
    "rom": "chikai",
    "vn": "Gần",
    "ex": "学校が近いです。",
    "exVn": "Trường học ở gần."
  },
  {
    "jp": "速い",
    "rom": "hayai",
    "vn": "Nhanh (tốc độ)",
    "ex": "この電車は速いです。",
    "exVn": "Con tàu này nhanh."
  },
  {
    "jp": "広い",
    "rom": "hiroi",
    "vn": "Rộng",
    "ex": "部屋が広いです。",
    "exVn": "Phòng rộng."
  },
  {
    "jp": "狭い",
    "rom": "semai",
    "vn": "Hẹp, Chật",
    "ex": "道が狭いです。",
    "exVn": "Đường hẹp."
  },
  {
    "jp": "若い",
    "rom": "wakai",
    "vn": "Trẻ tuổi",
    "ex": "若い先生が来た。",
    "exVn": "Giáo viên trẻ đến."
  },
  {
    "jp": "暖かい",
    "rom": "atatakai",
    "vn": "Ấm (thời tiết)",
    "ex": "春は暖かいです。",
    "exVn": "Mùa xuân ấm áp."
  },
  {
    "jp": "涼しい",
    "rom": "suzushii",
    "vn": "Mát mẻ",
    "ex": "今日は涼しいですね。",
    "exVn": "Hôm nay mát nhỉ."
  },
  {
    "jp": "晴れ",
    "rom": "hare",
    "vn": "Nắng, Trời đẹp",
    "ex": "明日は晴れるでしょう。",
    "exVn": "Ngày mai trời nắng."
  },
  {
    "jp": "曇り",
    "rom": "kumori",
    "vn": "Có mây",
    "ex": "今日は曇りです。",
    "exVn": "Hôm nay có mây."
  },
  {
    "jp": "台風",
    "rom": "taifū",
    "vn": "Bão",
    "ex": "台風が来ます。",
    "exVn": "Bão đang đến."
  },
  {
    "jp": "地震",
    "rom": "jishin",
    "vn": "Động đất",
    "ex": "地震に注意してください。",
    "exVn": "Hãy chú ý động đất."
  },
  {
    "jp": "空港",
    "rom": "kūkō",
    "vn": "Sân bay",
    "ex": "空港まで迎えに行きます。",
    "exVn": "Tôi ra sân bay đón."
  },
  {
    "jp": "新幹線",
    "rom": "shinkansen",
    "vn": "Tàu siêu tốc",
    "ex": "新幹線で東京へ行った。",
    "exVn": "Tôi đi Shinkansen lên Tokyo."
  },
  {
    "jp": "自転車",
    "rom": "jitensha",
    "vn": "Xe đạp",
    "ex": "自転車で学校へ行きます。",
    "exVn": "Tôi đến trường bằng xe đạp."
  },
  {
    "jp": "信号",
    "rom": "shingō",
    "vn": "Đèn giao thông",
    "ex": "信号を守ってください。",
    "exVn": "Hãy tuân thủ đèn giao thông."
  },
  {
    "jp": "道路",
    "rom": "dōro",
    "vn": "Đường bộ",
    "ex": "道路が混んでいます。",
    "exVn": "Đường đang tắc."
  },
  {
    "jp": "地図",
    "rom": "chizu",
    "vn": "Bản đồ",
    "ex": "地図を見ながら歩きました。",
    "exVn": "Tôi vừa đi vừa xem bản đồ."
  },
  {
    "jp": "住所",
    "rom": "jūsho",
    "vn": "Địa chỉ",
    "ex": "住所を教えてください。",
    "exVn": "Cho tôi địa chỉ."
  },
  {
    "jp": "薬局",
    "rom": "yakkyoku",
    "vn": "Nhà thuốc",
    "ex": "薬局で薬を買いました。",
    "exVn": "Tôi mua thuốc ở nhà thuốc."
  },
  {
    "jp": "図書館",
    "rom": "toshokan",
    "vn": "Thư viện",
    "ex": "図書館で勉強します。",
    "exVn": "Tôi học ở thư viện."
  },
  {
    "jp": "美術館",
    "rom": "bijutsukan",
    "vn": "Bảo tàng mỹ thuật",
    "ex": "美術館へ行きたいです。",
    "exVn": "Tôi muốn đến bảo tàng."
  },
  {
    "jp": "博物館",
    "rom": "hakubutsukan",
    "vn": "Bảo tàng",
    "ex": "博物館で歴史を学んだ。",
    "exVn": "Tôi học lịch sử ở bảo tàng."
  },
  {
    "jp": "温泉",
    "rom": "onsen",
    "vn": "Suối nước nóng, Onsen",
    "ex": "温泉に入りたいです。",
    "exVn": "Tôi muốn tắm onsen."
  },
  {
    "jp": "神社",
    "rom": "jinja",
    "vn": "Đền Thần đạo",
    "ex": "神社でお参りをしました。",
    "exVn": "Tôi cầu nguyện ở đền."
  },
  {
    "jp": "お寺",
    "rom": "otera",
    "vn": "Chùa Phật giáo",
    "ex": "お寺の近くに住んでいます。",
    "exVn": "Tôi sống gần chùa."
  },
  {
    "jp": "祭り",
    "rom": "matsuri",
    "vn": "Lễ hội",
    "ex": "夏祭りに行きましょう。",
    "exVn": "Hãy đi lễ hội mùa hè."
  },
  {
    "jp": "文字",
    "rom": "moji",
    "vn": "Chữ, Ký tự",
    "ex": "漢字の文字は難しい。",
    "exVn": "Chữ Kanji khó."
  },
  {
    "jp": "言葉",
    "rom": "kotoba",
    "vn": "Ngôn ngữ, Lời nói, Từ",
    "ex": "難しい言葉を覚えた。",
    "exVn": "Tôi đã học từ khó."
  },
  {
    "jp": "発音",
    "rom": "hatsuon",
    "vn": "Phát âm",
    "ex": "発音を練習しています。",
    "exVn": "Tôi đang luyện tập phát âm."
  },
  {
    "jp": "文法",
    "rom": "bunpō",
    "vn": "Ngữ pháp",
    "ex": "文法を勉強しています。",
    "exVn": "Tôi đang học ngữ pháp."
  },
  {
    "jp": "翻訳",
    "rom": "honyaku",
    "vn": "Dịch thuật",
    "ex": "この文を翻訳してください。",
    "exVn": "Hãy dịch câu này."
  },
  {
    "jp": "試験",
    "rom": "shiken",
    "vn": "Kỳ thi",
    "ex": "明日試験があります。",
    "exVn": "Ngày mai có kỳ thi."
  },
  {
    "jp": "成績",
    "rom": "seiseki",
    "vn": "Thành tích, Điểm số",
    "ex": "成績が上がりました。",
    "exVn": "Thành tích của tôi tăng."
  },
  {
    "jp": "授業",
    "rom": "jugyō",
    "vn": "Bài học, Giờ học",
    "ex": "授業に遅刻した。",
    "exVn": "Tôi đến trễ giờ học."
  },
  {
    "jp": "宿題",
    "rom": "shukudai",
    "vn": "Bài tập về nhà",
    "ex": "宿題を忘れました。",
    "exVn": "Tôi quên bài tập về nhà."
  },
  {
    "jp": "卒業",
    "rom": "sotsugyō",
    "vn": "Tốt nghiệp",
    "ex": "今年大学を卒業します。",
    "exVn": "Năm nay tôi tốt nghiệp đại học."
  },
  {
    "jp": "入学",
    "rom": "nyūgaku",
    "vn": "Nhập học",
    "ex": "4月に大学に入学した。",
    "exVn": "Tôi nhập học đại học tháng 4."
  },
  {
    "jp": "出身",
    "rom": "shusshin",
    "vn": "Quê quán, Xuất thân",
    "ex": "どこの出身ですか？",
    "exVn": "Bạn quê ở đâu?"
  },
  {
    "jp": "国籍",
    "rom": "kokuseki",
    "vn": "Quốc tịch",
    "ex": "国籍はベトナムです。",
    "exVn": "Quốc tịch của tôi là Việt Nam."
  },
  {
    "jp": "伝統",
    "rom": "dentō",
    "vn": "Truyền thống",
    "ex": "伝統的な文化を守りたい。",
    "exVn": "Tôi muốn bảo tồn văn hóa truyền thống."
  },
  {
    "jp": "政治",
    "rom": "seiji",
    "vn": "Chính trị",
    "ex": "政治に興味があります。",
    "exVn": "Tôi quan tâm đến chính trị."
  },
  {
    "jp": "経済",
    "rom": "keizai",
    "vn": "Kinh tế",
    "ex": "経済が悪化しています。",
    "exVn": "Kinh tế đang xấu đi."
  },
  {
    "jp": "環境",
    "rom": "kankyō",
    "vn": "Môi trường",
    "ex": "環境問題を考えています。",
    "exVn": "Tôi đang suy nghĩ về vấn đề môi trường."
  },
  {
    "jp": "技術",
    "rom": "gijutsu",
    "vn": "Kỹ thuật, Công nghệ",
    "ex": "技術が進んでいます。",
    "exVn": "Công nghệ đang tiến bộ."
  },
  {
    "jp": "科学",
    "rom": "kagaku",
    "vn": "Khoa học",
    "ex": "科学が好きです。",
    "exVn": "Tôi thích khoa học."
  },
  {
    "jp": "医学",
    "rom": "igaku",
    "vn": "Y học",
    "ex": "医学を勉強しています。",
    "exVn": "Tôi đang học y học."
  },
  {
    "jp": "薬",
    "rom": "kusuri",
    "vn": "Thuốc",
    "ex": "薬を飲みました。",
    "exVn": "Tôi đã uống thuốc."
  },
  {
    "jp": "健康",
    "rom": "kenkō",
    "vn": "Sức khỏe",
    "ex": "健康が一番大切です。",
    "exVn": "Sức khỏe là quan trọng nhất."
  },
  {
    "jp": "運動",
    "rom": "undō",
    "vn": "Vận động, Thể dục",
    "ex": "毎日運動しています。",
    "exVn": "Tôi vận động mỗi ngày."
  },
  {
    "jp": "食事",
    "rom": "shokuji",
    "vn": "Bữa ăn",
    "ex": "食事をしましょう。",
    "exVn": "Hãy ăn."
  },
  {
    "jp": "料理",
    "rom": "ryōri",
    "vn": "Nấu ăn, Món ăn",
    "ex": "日本料理が好きです。",
    "exVn": "Tôi thích món ăn Nhật."
  },
  {
    "jp": "材料",
    "rom": "zairyō",
    "vn": "Nguyên liệu",
    "ex": "料理の材料を買いました。",
    "exVn": "Tôi đã mua nguyên liệu nấu ăn."
  },
  {
    "jp": "味",
    "rom": "aji",
    "vn": "Vị, Mùi vị",
    "ex": "この料理は甘い味がします。",
    "exVn": "Món ăn này có vị ngọt."
  },
  {
    "jp": "栄養",
    "rom": "eiyō",
    "vn": "Dinh dưỡng",
    "ex": "栄養のある食事が大切です。",
    "exVn": "Bữa ăn có dinh dưỡng rất quan trọng."
  },
  {
    "jp": "体重",
    "rom": "taijū",
    "vn": "Cân nặng",
    "ex": "体重が増えました。",
    "exVn": "Cân nặng của tôi tăng."
  },
  {
    "jp": "身長",
    "rom": "shinchō",
    "vn": "Chiều cao",
    "ex": "身長は170cmです。",
    "exVn": "Chiều cao của tôi là 170cm."
  },
  {
    "jp": "外見",
    "rom": "gaiken",
    "vn": "Ngoại hình",
    "ex": "外見より内面が大切です。",
    "exVn": "Nội tâm quan trọng hơn ngoại hình."
  },
  {
    "jp": "性格",
    "rom": "seikaku",
    "vn": "Tính cách",
    "ex": "明るい性格の人が好きです。",
    "exVn": "Tôi thích người có tính cách vui vẻ."
  },
  {
    "jp": "趣味",
    "rom": "shumi",
    "vn": "Sở thích",
    "ex": "趣味は何ですか？",
    "exVn": "Sở thích của bạn là gì?"
  },
  {
    "jp": "才能",
    "rom": "sainō",
    "vn": "Tài năng",
    "ex": "音楽の才能があります。",
    "exVn": "Có tài năng về âm nhạc."
  },
  {
    "jp": "夢",
    "rom": "yume",
    "vn": "Giấc mơ, Ước mơ",
    "ex": "医者になる夢があります。",
    "exVn": "Tôi có ước mơ trở thành bác sĩ."
  },
  {
    "jp": "目標",
    "rom": "mokuhyō",
    "vn": "Mục tiêu",
    "ex": "今年の目標を決めました。",
    "exVn": "Tôi đã đặt mục tiêu năm nay."
  }
];
const VOCAB_N3 = [
  {
    "jp": "あいまい",
    "rom": "aimai",
    "vn": "Mơ hồ, Không rõ ràng",
    "ex": "あいまいな答えは困ります。",
    "exVn": "Câu trả lời mơ hồ thật phiền."
  },
  {
    "jp": "あきらめる",
    "rom": "akirameru",
    "vn": "Bỏ cuộc, Từ bỏ",
    "ex": "諦めないでください。",
    "exVn": "Đừng bỏ cuộc."
  },
  {
    "jp": "あたりまえ",
    "rom": "atarimae",
    "vn": "Điều hiển nhiên",
    "ex": "そんなのあたりまえだよ。",
    "exVn": "Điều đó là hiển nhiên mà."
  },
  {
    "jp": "あわてる",
    "rom": "awateru",
    "vn": "Vội vàng, Hoảng loạn",
    "ex": "あわてないでください。",
    "exVn": "Đừng vội vàng."
  },
  {
    "jp": "以来",
    "rom": "irai",
    "vn": "Từ khi, Kể từ đó",
    "ex": "卒業以来会っていない。",
    "exVn": "Không gặp nhau kể từ khi tốt nghiệp."
  },
  {
    "jp": "一般",
    "rom": "ippan",
    "vn": "Chung, Thông thường",
    "ex": "一般的な質問です。",
    "exVn": "Đây là câu hỏi thông thường."
  },
  {
    "jp": "印象",
    "rom": "inshou",
    "vn": "Ấn tượng",
    "ex": "いい印象を与えたい。",
    "exVn": "Muốn tạo ấn tượng tốt."
  },
  {
    "jp": "影響",
    "rom": "eikyou",
    "vn": "Ảnh hưởng",
    "ex": "環境に影響します。",
    "exVn": "Ảnh hưởng đến môi trường."
  },
  {
    "jp": "援助",
    "rom": "enjo",
    "vn": "Giúp đỡ, Hỗ trợ",
    "ex": "援助が必要です。",
    "exVn": "Cần sự hỗ trợ."
  },
  {
    "jp": "応用",
    "rom": "ouyou",
    "vn": "Ứng dụng",
    "ex": "知識を応用します。",
    "exVn": "Ứng dụng kiến thức."
  },
  {
    "jp": "か所",
    "rom": "kasho",
    "vn": "Nơi, Chỗ (đếm)",
    "ex": "三か所を訪問しました。",
    "exVn": "Đã thăm ba nơi."
  },
  {
    "jp": "解決",
    "rom": "kaiketsu",
    "vn": "Giải quyết",
    "ex": "問題を解決しました。",
    "exVn": "Đã giải quyết vấn đề."
  },
  {
    "jp": "確認",
    "rom": "kakunin",
    "vn": "Xác nhận",
    "ex": "もう一度確認します。",
    "exVn": "Xác nhận lại một lần nữa."
  },
  {
    "jp": "活用",
    "rom": "katsuyou",
    "vn": "Tận dụng, Sử dụng hiệu quả",
    "ex": "時間を活用します。",
    "exVn": "Tận dụng thời gian."
  },
  {
    "jp": "観察",
    "rom": "kansatsu",
    "vn": "Quan sát",
    "ex": "自然を観察します。",
    "exVn": "Quan sát thiên nhiên."
  },
  {
    "jp": "基本",
    "rom": "kihon",
    "vn": "Cơ bản",
    "ex": "基本が大切です。",
    "exVn": "Cơ bản rất quan trọng."
  },
  {
    "jp": "議論",
    "rom": "giron",
    "vn": "Tranh luận",
    "ex": "活発な議論をしました。",
    "exVn": "Đã có cuộc tranh luận sôi nổi."
  },
  {
    "jp": "逆",
    "rom": "gyaku",
    "vn": "Ngược lại",
    "ex": "逆の考え方もあります。",
    "exVn": "Cũng có cách nghĩ ngược lại."
  },
  {
    "jp": "競技",
    "rom": "kyougi",
    "vn": "Thi đấu, Thể thao",
    "ex": "競技に参加しました。",
    "exVn": "Đã tham gia thi đấu."
  },
  {
    "jp": "協力",
    "rom": "kyouryoku",
    "vn": "Hợp tác",
    "ex": "協力ありがとうございます。",
    "exVn": "Cảm ơn sự hợp tác."
  },
  {
    "jp": "区別",
    "rom": "kubetsu",
    "vn": "Phân biệt",
    "ex": "二つを区別します。",
    "exVn": "Phân biệt hai thứ."
  },
  {
    "jp": "苦労",
    "rom": "kurou",
    "vn": "Vất vả, Khó nhọc",
    "ex": "苦労しました。",
    "exVn": "Đã vất vả rồi."
  },
  {
    "jp": "結果",
    "rom": "kekka",
    "vn": "Kết quả",
    "ex": "結果はどうでしたか？",
    "exVn": "Kết quả thế nào?"
  },
  {
    "jp": "現状",
    "rom": "genjou",
    "vn": "Tình trạng hiện tại",
    "ex": "現状を把握します。",
    "exVn": "Nắm bắt tình hình hiện tại."
  },
  {
    "jp": "行動",
    "rom": "koudou",
    "vn": "Hành động",
    "ex": "すぐに行動します。",
    "exVn": "Hành động ngay."
  },
  {
    "jp": "効果",
    "rom": "kouka",
    "vn": "Hiệu quả",
    "ex": "薬の効果があります。",
    "exVn": "Thuốc có hiệu quả."
  },
  {
    "jp": "工夫",
    "rom": "kufuu",
    "vn": "Sáng tạo, Suy nghĩ",
    "ex": "工夫が必要です。",
    "exVn": "Cần sáng tạo."
  },
  {
    "jp": "公平",
    "rom": "kouhei",
    "vn": "Công bằng",
    "ex": "公平に評価します。",
    "exVn": "Đánh giá công bằng."
  },
  {
    "jp": "向上",
    "rom": "koujou",
    "vn": "Cải thiện, Tiến bộ",
    "ex": "能力向上のために勉強します。",
    "exVn": "Học để nâng cao năng lực."
  },
  {
    "jp": "コミュニケーション",
    "rom": "komyunikeeshon",
    "vn": "Giao tiếp",
    "ex": "コミュニケーションが大切です。",
    "exVn": "Giao tiếp rất quan trọng."
  },
  {
    "jp": "根拠",
    "rom": "konkyo",
    "vn": "Căn cứ, Cơ sở",
    "ex": "根拠がありません。",
    "exVn": "Không có căn cứ."
  },
  {
    "jp": "再生",
    "rom": "saisei",
    "vn": "Tái tạo, Phát lại",
    "ex": "エネルギーを再生します。",
    "exVn": "Tái tạo năng lượng."
  },
  {
    "jp": "刺激",
    "rom": "shigeki",
    "vn": "Kích thích, Cảm hứng",
    "ex": "刺激を受けました。",
    "exVn": "Đã được truyền cảm hứng."
  },
  {
    "jp": "指導",
    "rom": "shidou",
    "vn": "Hướng dẫn",
    "ex": "先生に指導してもらいました。",
    "exVn": "Được thầy hướng dẫn."
  },
  {
    "jp": "実現",
    "rom": "jitsugen",
    "vn": "Thực hiện, Thực hóa",
    "ex": "夢を実現しました。",
    "exVn": "Đã thực hiện ước mơ."
  },
  {
    "jp": "実験",
    "rom": "jikken",
    "vn": "Thí nghiệm",
    "ex": "実験を行います。",
    "exVn": "Tiến hành thí nghiệm."
  },
  {
    "jp": "就職",
    "rom": "shuushoku",
    "vn": "Xin việc, Tìm được việc",
    "ex": "就職活動中です。",
    "exVn": "Đang tìm việc."
  },
  {
    "jp": "主張",
    "rom": "shuchou",
    "vn": "Chủ trương, Khẳng định",
    "ex": "自分の意見を主張します。",
    "exVn": "Khẳng định ý kiến của mình."
  },
  {
    "jp": "状況",
    "rom": "joukyou",
    "vn": "Tình huống",
    "ex": "状況を確認します。",
    "exVn": "Xác nhận tình huống."
  },
  {
    "jp": "信頼",
    "rom": "shinrai",
    "vn": "Tin tưởng",
    "ex": "信頼できる人です。",
    "exVn": "Là người đáng tin cậy."
  },
  {
    "jp": "成長",
    "rom": "seichou",
    "vn": "Trưởng thành, Phát triển",
    "ex": "子供の成長を見守ります。",
    "exVn": "Theo dõi sự trưởng thành của con."
  },
  {
    "jp": "積極的",
    "rom": "sekkyokuteki",
    "vn": "Tích cực, Chủ động",
    "ex": "積極的に参加します。",
    "exVn": "Tham gia tích cực."
  },
  {
    "jp": "対応",
    "rom": "taiou",
    "vn": "Đối phó, Ứng xử",
    "ex": "問題に対応します。",
    "exVn": "Ứng phó với vấn đề."
  },
  {
    "jp": "達成感",
    "rom": "tassseikan",
    "vn": "Cảm giác đạt được",
    "ex": "達成感があります。",
    "exVn": "Có cảm giác hoàn thành."
  },
  {
    "jp": "担当",
    "rom": "tantou",
    "vn": "Phụ trách",
    "ex": "私が担当します。",
    "exVn": "Tôi phụ trách."
  },
  {
    "jp": "知識",
    "rom": "chishiki",
    "vn": "Kiến thức",
    "ex": "知識を広げたいです。",
    "exVn": "Muốn mở rộng kiến thức."
  },
  {
    "jp": "調査",
    "rom": "chousa",
    "vn": "Điều tra, Khảo sát",
    "ex": "アンケート調査をします。",
    "exVn": "Tiến hành khảo sát."
  },
  {
    "jp": "直接",
    "rom": "chokusetsu",
    "vn": "Trực tiếp",
    "ex": "直接話しましょう。",
    "exVn": "Hãy nói chuyện trực tiếp."
  },
  {
    "jp": "挑戦",
    "rom": "chousen",
    "vn": "Thử thách",
    "ex": "新しいことに挑戦します。",
    "exVn": "Thử thách với điều mới."
  },
  {
    "jp": "提供",
    "rom": "teikyou",
    "vn": "Cung cấp",
    "ex": "サービスを提供します。",
    "exVn": "Cung cấp dịch vụ."
  },
  {
    "jp": "特徴",
    "rom": "tokucho",
    "vn": "Đặc trưng, Đặc điểm",
    "ex": "この製品の特徴は何ですか？",
    "exVn": "Đặc điểm của sản phẩm này là gì?"
  },
  {
    "jp": "独自",
    "rom": "dokuji",
    "vn": "Độc đáo, Riêng",
    "ex": "独自の方法を使います。",
    "exVn": "Sử dụng phương pháp độc đáo riêng."
  },
  {
    "jp": "何とか",
    "rom": "nantoka",
    "vn": "Bằng cách nào đó",
    "ex": "何とかなります。",
    "exVn": "Bằng cách nào đó sẽ ổn."
  },
  {
    "jp": "認める",
    "rom": "mitomeru",
    "vn": "Thừa nhận, Chấp nhận",
    "ex": "自分の失敗を認めます。",
    "exVn": "Thừa nhận thất bại của mình."
  },
  {
    "jp": "能力",
    "rom": "nouryoku",
    "vn": "Năng lực",
    "ex": "能力を伸ばしたいです。",
    "exVn": "Muốn phát triển năng lực."
  },
  {
    "jp": "配慮",
    "rom": "hairyo",
    "vn": "Quan tâm, Xem xét",
    "ex": "周りへの配慮が大切です。",
    "exVn": "Quan tâm đến xung quanh là quan trọng."
  },
  {
    "jp": "発表",
    "rom": "happyou",
    "vn": "Thuyết trình, Công bố",
    "ex": "明日発表があります。",
    "exVn": "Ngày mai có buổi thuyết trình."
  },
  {
    "jp": "評価",
    "rom": "hyouka",
    "vn": "Đánh giá",
    "ex": "客観的に評価します。",
    "exVn": "Đánh giá khách quan."
  },
  {
    "jp": "不安",
    "rom": "fuan",
    "vn": "Lo lắng, Bất an",
    "ex": "将来が不安です。",
    "exVn": "Lo lắng về tương lai."
  },
  {
    "jp": "不満",
    "rom": "fuman",
    "vn": "Bất mãn",
    "ex": "不満を言います。",
    "exVn": "Nói lên sự bất mãn."
  },
  {
    "jp": "変化",
    "rom": "henka",
    "vn": "Thay đổi, Biến đổi",
    "ex": "大きな変化がありました。",
    "exVn": "Đã có sự thay đổi lớn."
  },
  {
    "jp": "目指す",
    "rom": "mezasu",
    "vn": "Hướng đến, Nhắm tới",
    "ex": "夢を目指します。",
    "exVn": "Hướng đến ước mơ."
  },
  {
    "jp": "役割",
    "rom": "yakuwari",
    "vn": "Vai trò",
    "ex": "自分の役割を果たします。",
    "exVn": "Hoàn thành vai trò của mình."
  },
  {
    "jp": "予防",
    "rom": "yobou",
    "vn": "Phòng ngừa",
    "ex": "病気の予防が大切です。",
    "exVn": "Phòng bệnh là quan trọng."
  },
  {
    "jp": "様々",
    "rom": "samazama",
    "vn": "Nhiều loại, Đa dạng",
    "ex": "様々な意見があります。",
    "exVn": "Có nhiều loại ý kiến."
  },
  {
    "jp": "理解",
    "rom": "rikai",
    "vn": "Hiểu, Lý giải",
    "ex": "理解できますか？",
    "exVn": "Bạn có hiểu không?"
  },
  {
    "jp": "意識",
    "rom": "ishiki",
    "vn": "Ý thức, Nhận thức",
    "ex": "環境に対する意識を高める。",
    "exVn": "Nâng cao ý thức về môi trường."
  },
  {
    "jp": "意欲",
    "rom": "iyoku",
    "vn": "Ý muốn, Động lực",
    "ex": "学習意欲が高い学生です。",
    "exVn": "Là học sinh có động lực học tập cao."
  },
  {
    "jp": "延期",
    "rom": "enki",
    "vn": "Hoãn lại, Trì hoãn",
    "ex": "雨で試合が延期になった。",
    "exVn": "Trận đấu bị hoãn do trời mưa."
  },
  {
    "jp": "応援",
    "rom": "ouen",
    "vn": "Cổ vũ, Động viên",
    "ex": "地元のチームを応援する。",
    "exVn": "Cổ vũ đội bóng địa phương."
  },
  {
    "jp": "回答",
    "rom": "kaitou",
    "vn": "Trả lời, Trả lời câu hỏi",
    "ex": "アンケートに回答する。",
    "exVn": "Trả lời phiếu khảo sát."
  },
  {
    "jp": "獲得",
    "rom": "kakutoku",
    "vn": "Thu được, Giành được",
    "ex": "優勝カップを獲得した。",
    "exVn": "Giành được cúp vô địch."
  },
  {
    "jp": "感謝",
    "rom": "kansha",
    "vn": "Cảm ơn, Biết ơn",
    "ex": "皆様の協力に感謝します。",
    "exVn": "Xin cảm ơn sự hợp tác của mọi người."
  },
  {
    "jp": "管理",
    "rom": "kanri",
    "vn": "Quản lý, Phân công",
    "ex": "時間をしっかり管理する。",
    "exVn": "Quản lý thời gian chặt chẽ."
  },
  {
    "jp": "関連",
    "rom": "kanren",
    "vn": "Liên quan",
    "ex": "この事件に関連するニュース。",
    "exVn": "Tin tức liên quan đến vụ án này."
  },
  {
    "jp": "期待",
    "rom": "kitai",
    "vn": "Kỳ vọng, Mong đợi",
    "ex": "新人の活躍に期待する。",
    "exVn": "Kỳ vọng vào sự thể hiện của người mới."
  },
  {
    "jp": "規模",
    "rom": "kibo",
    "vn": "Quy mô",
    "ex": "大規模な工事が行われる。",
    "exVn": "Công trình quy mô lớn đang được tiến hành."
  },
  {
    "jp": "共同",
    "rom": "kyoudou",
    "vn": "Cộng đồng, Cùng nhau",
    "ex": "二つの会社が共同で開発する。",
    "exVn": "Hai công ty cùng phát triển."
  },
  {
    "jp": "訓練",
    "rom": "kunren",
    "vn": "Huấn luyện, Luyện tập",
    "ex": "防災訓練に参加する。",
    "exVn": "Tham gia huấn luyện phòng chống thiên tai."
  },
  {
    "jp": "継続",
    "rom": "keizoku",
    "vn": "Tiếp tục, Duy trì liên tục",
    "ex": "研究を継続して行います。",
    "exVn": "Tiếp tục tiến hành nghiên cứu."
  },
  {
    "jp": "欠席",
    "rom": "kesseki",
    "vn": "Vắng mặt, Nghỉ",
    "ex": "体調不良で授業を欠席する。",
    "exVn": "Vắng mặt buổi học do sức khỏe không tốt."
  }
];
 
// ════════════════════════════════════════════════════════════════
// VOCAB N2 — 100 từ
// ════════════════════════════════════════════════════════════════
const VOCAB_N2 = [
  {
    "jp": "あいにく",
    "rom": "ainiku",
    "vn": "Tiếc là, Không may",
    "ex": "あいにく雨が降っています。",
    "exVn": "Tiếc là trời đang mưa."
  },
  {
    "jp": "あえて",
    "rom": "aete",
    "vn": "Cố ý, Dám",
    "ex": "あえて難しい道を選んだ。",
    "exVn": "Cố ý chọn con đường khó."
  },
  {
    "jp": "明らか",
    "rom": "akiraka",
    "vn": "Rõ ràng",
    "ex": "原因は明らかです。",
    "exVn": "Nguyên nhân rõ ràng."
  },
  {
    "jp": "一般的",
    "rom": "ippanteki",
    "vn": "Nói chung, Phổ biến",
    "ex": "一般的な意見を聞きます。",
    "exVn": "Nghe ý kiến chung."
  },
  {
    "jp": "印象的",
    "rom": "inshouteki",
    "vn": "Ấn tượng",
    "ex": "印象的なスピーチでした。",
    "exVn": "Bài diễn thuyết ấn tượng."
  },
  {
    "jp": "遠慮",
    "rom": "enryo",
    "vn": "Khách sáo, Ngại",
    "ex": "遠慮しないでください。",
    "exVn": "Đừng khách sáo."
  },
  {
    "jp": "大げさ",
    "rom": "oogesa",
    "vn": "Phóng đại, Quá mức",
    "ex": "大げさに言わないでください。",
    "exVn": "Đừng phóng đại."
  },
  {
    "jp": "お互い",
    "rom": "otagai",
    "vn": "Lẫn nhau, Qua lại",
    "ex": "お互い助け合いましょう。",
    "exVn": "Hãy giúp đỡ lẫn nhau."
  },
  {
    "jp": "改善",
    "rom": "kaizen",
    "vn": "Cải thiện",
    "ex": "システムを改善します。",
    "exVn": "Cải thiện hệ thống."
  },
  {
    "jp": "介入",
    "rom": "kainyuu",
    "vn": "Can thiệp",
    "ex": "政府が介入しました。",
    "exVn": "Chính phủ đã can thiệp."
  },
  {
    "jp": "概念",
    "rom": "gainen",
    "vn": "Khái niệm",
    "ex": "新しい概念を学びます。",
    "exVn": "Học khái niệm mới."
  },
  {
    "jp": "学術",
    "rom": "gakujutsu",
    "vn": "Học thuật",
    "ex": "学術的な研究をします。",
    "exVn": "Nghiên cứu học thuật."
  },
  {
    "jp": "強制",
    "rom": "kyousei",
    "vn": "Cưỡng bức, Bắt buộc",
    "ex": "強制してはいけません。",
    "exVn": "Không được bắt buộc."
  },
  {
    "jp": "共存",
    "rom": "kyouzon",
    "vn": "Cùng tồn tại",
    "ex": "自然と共存します。",
    "exVn": "Cùng tồn tại với thiên nhiên."
  },
  {
    "jp": "偶然",
    "rom": "guuzen",
    "vn": "Tình cờ, Ngẫu nhiên",
    "ex": "偶然会いました。",
    "exVn": "Tình cờ gặp nhau."
  },
  {
    "jp": "傾向",
    "rom": "keikou",
    "vn": "Xu hướng",
    "ex": "最近の傾向を分析します。",
    "exVn": "Phân tích xu hướng gần đây."
  },
  {
    "jp": "契約",
    "rom": "keiyaku",
    "vn": "Hợp đồng",
    "ex": "契約を結びました。",
    "exVn": "Đã ký kết hợp đồng."
  },
  {
    "jp": "欠如",
    "rom": "ketsujo",
    "vn": "Thiếu hụt",
    "ex": "コミュニケーションが欠如しています。",
    "exVn": "Thiếu hụt giao tiếp."
  },
  {
    "jp": "権利",
    "rom": "kenri",
    "vn": "Quyền lợi",
    "ex": "権利を主張します。",
    "exVn": "Khẳng định quyền lợi."
  },
  {
    "jp": "限界",
    "rom": "genkai",
    "vn": "Giới hạn",
    "ex": "限界を超えました。",
    "exVn": "Đã vượt qua giới hạn."
  },
  {
    "jp": "光栄",
    "rom": "kouei",
    "vn": "Vinh dự",
    "ex": "光栄に思います。",
    "exVn": "Cảm thấy vinh dự."
  },
  {
    "jp": "貢献",
    "rom": "kouken",
    "vn": "Đóng góp",
    "ex": "社会に貢献します。",
    "exVn": "Đóng góp cho xã hội."
  },
  {
    "jp": "考慮",
    "rom": "kouryo",
    "vn": "Cân nhắc, Xem xét",
    "ex": "様々な要素を考慮します。",
    "exVn": "Cân nhắc các yếu tố đa dạng."
  },
  {
    "jp": "困難",
    "rom": "konnan",
    "vn": "Khó khăn",
    "ex": "困難を乗り越えます。",
    "exVn": "Vượt qua khó khăn."
  },
  {
    "jp": "左右",
    "rom": "sayuu",
    "vn": "Ảnh hưởng, Trái phải",
    "ex": "決断を左右する要素があります。",
    "exVn": "Có yếu tố ảnh hưởng đến quyết định."
  },
  {
    "jp": "妥協",
    "rom": "dakyou",
    "vn": "Thỏa hiệp",
    "ex": "妥協点を見つけます。",
    "exVn": "Tìm điểm thỏa hiệp."
  },
  {
    "jp": "団体",
    "rom": "dantai",
    "vn": "Đoàn thể, Tổ chức",
    "ex": "団体に加入します。",
    "exVn": "Tham gia đoàn thể."
  },
  {
    "jp": "抽象",
    "rom": "chuushou",
    "vn": "Trừu tượng",
    "ex": "抽象的な概念です。",
    "exVn": "Đây là khái niệm trừu tượng."
  },
  {
    "jp": "徴収",
    "rom": "choushu",
    "vn": "Thu (thuế, phí)",
    "ex": "税金を徴収します。",
    "exVn": "Thu thuế."
  },
  {
    "jp": "展開",
    "rom": "tenkai",
    "vn": "Triển khai, Phát triển",
    "ex": "計画を展開します。",
    "exVn": "Triển khai kế hoạch."
  },
  {
    "jp": "独立",
    "rom": "dokuritsu",
    "vn": "Độc lập",
    "ex": "独立して生活します。",
    "exVn": "Sống độc lập."
  },
  {
    "jp": "把握",
    "rom": "haaku",
    "vn": "Nắm bắt, Hiểu rõ",
    "ex": "状況を把握します。",
    "exVn": "Nắm bắt tình hình."
  },
  {
    "jp": "背景",
    "rom": "haikei",
    "vn": "Bối cảnh",
    "ex": "問題の背景を理解します。",
    "exVn": "Hiểu bối cảnh của vấn đề."
  },
  {
    "jp": "発揮",
    "rom": "hakki",
    "vn": "Phát huy, Thể hiện",
    "ex": "能力を発揮します。",
    "exVn": "Phát huy năng lực."
  },
  {
    "jp": "反映",
    "rom": "hanei",
    "vn": "Phản ánh",
    "ex": "意見を反映します。",
    "exVn": "Phản ánh ý kiến."
  },
  {
    "jp": "否定",
    "rom": "hitei",
    "vn": "Phủ nhận, Bác bỏ",
    "ex": "事実を否定しません。",
    "exVn": "Không phủ nhận sự thật."
  },
  {
    "jp": "費用",
    "rom": "hiyou",
    "vn": "Chi phí",
    "ex": "費用を計算します。",
    "exVn": "Tính toán chi phí."
  },
  {
    "jp": "附随",
    "rom": "fuzui",
    "vn": "Kèm theo, Liên quan",
    "ex": "附随する問題があります。",
    "exVn": "Có vấn đề kèm theo."
  },
  {
    "jp": "分析",
    "rom": "bunseki",
    "vn": "Phân tích",
    "ex": "データを分析します。",
    "exVn": "Phân tích dữ liệu."
  },
  {
    "jp": "平等",
    "rom": "byoudou",
    "vn": "Bình đẳng",
    "ex": "平等に扱います。",
    "exVn": "Đối xử bình đẳng."
  },
  {
    "jp": "矛盾",
    "rom": "mujun",
    "vn": "Mâu thuẫn",
    "ex": "矛盾があります。",
    "exVn": "Có mâu thuẫn."
  },
  {
    "jp": "明確",
    "rom": "meikaku",
    "vn": "Rõ ràng, Minh bạch",
    "ex": "明確な答えをください。",
    "exVn": "Hãy cho câu trả lời rõ ràng."
  },
  {
    "jp": "目的",
    "rom": "mokuteki",
    "vn": "Mục đích",
    "ex": "目的を明確にします。",
    "exVn": "Làm rõ mục đích."
  },
  {
    "jp": "優先",
    "rom": "yuusen",
    "vn": "Ưu tiên",
    "ex": "安全を優先します。",
    "exVn": "Ưu tiên sự an toàn."
  },
  {
    "jp": "要因",
    "rom": "youin",
    "vn": "Yếu tố, Nguyên nhân",
    "ex": "成功の要因を分析します。",
    "exVn": "Phân tích yếu tố thành công."
  },
  {
    "jp": "論理",
    "rom": "ronri",
    "vn": "Lôgic, Lý luận",
    "ex": "論理的に考えます。",
    "exVn": "Suy nghĩ có logic."
  },
  {
    "jp": "わずか",
    "rom": "wazuka",
    "vn": "Chỉ một chút, Chưa bao nhiêu",
    "ex": "わずかな差で負けました。",
    "exVn": "Thua với một chút ít."
  },
  {
    "jp": "圧力",
    "rom": "atsuryoku",
    "vn": "Áp lực",
    "ex": "プレッシャーを感じます。",
    "exVn": "Cảm thấy áp lực."
  },
  {
    "jp": "安定",
    "rom": "antei",
    "vn": "Ổn định",
    "ex": "安定した生活をしたい。",
    "exVn": "Muốn sống cuộc sống ổn định."
  },
  {
    "jp": "維持",
    "rom": "iji",
    "vn": "Duy trì",
    "ex": "現状を維持します。",
    "exVn": "Duy trì hiện trạng."
  },
  {
    "jp": "圧倒",
    "rom": "attou",
    "vn": "Áp đảo, Vượt trội",
    "ex": "相手を圧倒する強さです。",
    "exVn": "Sức mạnh áp đảo đối thủ."
  },
  {
    "jp": "隠蔽",
    "rom": "impei",
    "vn": "Che giấu, Che đậy",
    "ex": "事実を隠蔽しようとする。",
    "exVn": "Đang cố che giấu sự thật."
  },
  {
    "jp": "画期",
    "rom": "kakki",
    "vn": "Mang tính bước ngoặt",
    "ex": "画期的な発明です。",
    "exVn": "Phát minh mang tính bước ngoặt."
  },
  {
    "jp": "削減",
    "rom": "sakugen",
    "vn": "Cắt giảm, Giảm bớt",
    "ex": "コストを大幅に削減する。",
    "exVn": "Cắt giảm chi phí một cách đáng kể."
  },
  {
    "jp": "促進",
    "rom": "sokushin",
    "vn": "Thúc đẩy, Xúc tiến",
    "ex": "販売を促進するためのキャンペーン。",
    "exVn": "Chiến dịch nhằm thúc đẩy bán hàng."
  },
  {
    "jp": "提携",
    "rom": "teikei",
    "vn": "Hợp tác, Liên kết",
    "ex": "海外の企業と提携する。",
    "exVn": "Hợp tác liên kết với doanh nghiệp nước ngoài."
  },
  {
    "jp": "提示",
    "rom": "teiji",
    "vn": "Xuất trình, Trình bày",
    "ex": "身分証明書を提示する。",
    "exVn": "Xuất trình giấy tờ tùy thân."
  }
];
 
// ════════════════════════════════════════════════════════════════
// VOCAB N1 — 80 từ
// ════════════════════════════════════════════════════════════════
const VOCAB_N1 = [
  {
    "jp": "あからさま",
    "rom": "akarasama",
    "vn": "Lộ liễu, Công khai",
    "ex": "あからさまな嘘です。",
    "exVn": "Đó là lời nói dối lộ liễu."
  },
  {
    "jp": "あぐらをかく",
    "rom": "agura wo kaku",
    "vn": "Ngồi thiền, Ỷ lại",
    "ex": "過去の成功にあぐらをかいてはいけない。",
    "exVn": "Không được ỷ lại vào thành công quá khứ."
  },
  {
    "jp": "悪循環",
    "rom": "akujunkan",
    "vn": "Vòng luẩn quẩn xấu",
    "ex": "悪循環を断ち切ります。",
    "exVn": "Phá vỡ vòng luẩn quẩn xấu."
  },
  {
    "jp": "暗示",
    "rom": "anji",
    "vn": "Ám thị, Gợi ý ngầm",
    "ex": "暗示をかけます。",
    "exVn": "Thực hiện ám thị."
  },
  {
    "jp": "一概に",
    "rom": "ichigaini",
    "vn": "Nhất loạt, Một cách đơn giản",
    "ex": "一概には言えません。",
    "exVn": "Không thể nói một cách đơn giản."
  },
  {
    "jp": "一途",
    "rom": "ichizu",
    "vn": "Một lòng, Chuyên tâm",
    "ex": "一途に努力します。",
    "exVn": "Một lòng nỗ lực."
  },
  {
    "jp": "意図",
    "rom": "ito",
    "vn": "Ý định",
    "ex": "あなたの意図がわかりません。",
    "exVn": "Tôi không hiểu ý định của bạn."
  },
  {
    "jp": "稲妻",
    "rom": "inazuma",
    "vn": "Tia chớp, Sét",
    "ex": "稲妻が光りました。",
    "exVn": "Tia chớp đã lóe sáng."
  },
  {
    "jp": "因果",
    "rom": "inga",
    "vn": "Nhân quả",
    "ex": "因果関係があります。",
    "exVn": "Có mối quan hệ nhân quả."
  },
  {
    "jp": "迂回",
    "rom": "ukai",
    "vn": "Đi vòng, Vòng vo",
    "ex": "工事中のため迂回しました。",
    "exVn": "Đi vòng vì đang xây dựng."
  },
  {
    "jp": "うかがう",
    "rom": "ukagau",
    "vn": "Thưa hỏi, Ghé thăm (khiêm tốn)",
    "ex": "明日お宅にうかがいます。",
    "exVn": "Ngày mai tôi xin phép ghé thăm nhà bạn."
  },
  {
    "jp": "打ち明ける",
    "rom": "uchiakeru",
    "vn": "Thú nhận, Tâm sự",
    "ex": "秘密を打ち明けました。",
    "exVn": "Đã thú nhận bí mật."
  },
  {
    "jp": "裏腹",
    "rom": "urahara",
    "vn": "Ngược lại, Mâu thuẫn",
    "ex": "言葉と行動が裏腹です。",
    "exVn": "Lời nói và hành động mâu thuẫn."
  },
  {
    "jp": "追い詰める",
    "rom": "oiitsumeru",
    "vn": "Dồn vào góc, Truy đuổi",
    "ex": "犯人を追い詰めました。",
    "exVn": "Đã dồn tên tội phạm vào góc."
  },
  {
    "jp": "おもむろに",
    "rom": "omomuroni",
    "vn": "Từ từ, Chậm rãi",
    "ex": "おもむろに立ち上がりました。",
    "exVn": "Từ từ đứng dậy."
  },
  {
    "jp": "陥る",
    "rom": "ochiiru",
    "vn": "Rơi vào, Lâm vào",
    "ex": "危機に陥りました。",
    "exVn": "Đã lâm vào khủng hoảng."
  },
  {
    "jp": "仮説",
    "rom": "kasetsu",
    "vn": "Giả thuyết",
    "ex": "仮説を立てます。",
    "exVn": "Đặt ra giả thuyết."
  },
  {
    "jp": "慣例",
    "rom": "kanrei",
    "vn": "Lệ, Thông lệ",
    "ex": "慣例に従います。",
    "exVn": "Theo thông lệ."
  },
  {
    "jp": "感化",
    "rom": "kanka",
    "vn": "Cảm hóa, Ảnh hưởng",
    "ex": "良い人に感化されました。",
    "exVn": "Đã được cảm hóa bởi người tốt."
  },
  {
    "jp": "観点",
    "rom": "kanten",
    "vn": "Quan điểm",
    "ex": "異なる観点から考えます。",
    "exVn": "Suy nghĩ từ quan điểm khác."
  },
  {
    "jp": "企てる",
    "rom": "kuwadateru",
    "vn": "Mưu tính, Lên kế hoạch (ngầm)",
    "ex": "計画を企てます。",
    "exVn": "Lên kế hoạch ngầm."
  },
  {
    "jp": "規範",
    "rom": "kihan",
    "vn": "Chuẩn mực",
    "ex": "社会の規範を守ります。",
    "exVn": "Tuân theo chuẩn mực xã hội."
  },
  {
    "jp": "既成概念",
    "rom": "kisei gainen",
    "vn": "Khái niệm đã có sẵn, Định kiến",
    "ex": "既成概念を壊します。",
    "exVn": "Phá vỡ định kiến."
  },
  {
    "jp": "究明",
    "rom": "kyuumei",
    "vn": "Làm sáng tỏ, Điều tra",
    "ex": "真相を究明します。",
    "exVn": "Làm sáng tỏ sự thật."
  },
  {
    "jp": "境地",
    "rom": "kyouchi",
    "vn": "Cảnh giới, Trạng thái tâm lý",
    "ex": "新しい境地を開きます。",
    "exVn": "Mở ra cảnh giới mới."
  },
  {
    "jp": "虚偽",
    "rom": "kyogi",
    "vn": "Gian dối, Giả dối",
    "ex": "虚偽の申告をしてはいけない。",
    "exVn": "Không được khai báo gian dối."
  },
  {
    "jp": "均衡",
    "rom": "kinkou",
    "vn": "Cân bằng",
    "ex": "均衡を保ちます。",
    "exVn": "Giữ sự cân bằng."
  },
  {
    "jp": "空洞化",
    "rom": "kuudouka",
    "vn": "Rỗng hóa, Trống rỗng",
    "ex": "産業が空洞化しています。",
    "exVn": "Ngành công nghiệp đang rỗng hóa."
  },
  {
    "jp": "経緯",
    "rom": "ikisatsu",
    "vn": "Quá trình, Duyên cớ",
    "ex": "事件の経緯を説明します。",
    "exVn": "Giải thích quá trình sự việc."
  },
  {
    "jp": "決断力",
    "rom": "ketsudan ryoku",
    "vn": "Khả năng quyết đoán",
    "ex": "決断力が必要です。",
    "exVn": "Cần khả năng quyết đoán."
  },
  {
    "jp": "見解",
    "rom": "kenkai",
    "vn": "Quan điểm, Kiến giải",
    "ex": "専門家の見解を聞きます。",
    "exVn": "Nghe quan điểm của chuyên gia."
  },
  {
    "jp": "懸念",
    "rom": "kenen",
    "vn": "Lo ngại",
    "ex": "懸念を示します。",
    "exVn": "Bày tỏ lo ngại."
  },
  {
    "jp": "顕著",
    "rom": "kencho",
    "vn": "Nổi bật, Rõ ràng",
    "ex": "顕著な変化が見られます。",
    "exVn": "Thấy sự thay đổi nổi bật."
  },
  {
    "jp": "誇張",
    "rom": "kochou",
    "vn": "Phóng đại",
    "ex": "誇張して言わないでください。",
    "exVn": "Đừng phóng đại."
  },
  {
    "jp": "克服",
    "rom": "kokufuku",
    "vn": "Khắc phục, Vượt qua",
    "ex": "困難を克服しました。",
    "exVn": "Đã khắc phục khó khăn."
  },
  {
    "jp": "混沌",
    "rom": "konton",
    "vn": "Hỗn loạn",
    "ex": "社会が混沌としています。",
    "exVn": "Xã hội đang hỗn loạn."
  },
  {
    "jp": "根底",
    "rom": "kontei",
    "vn": "Căn bản, Nền tảng",
    "ex": "問題の根底にあるものを探ります。",
    "exVn": "Tìm kiếm điều nằm ở nền tảng của vấn đề."
  },
  {
    "jp": "最前線",
    "rom": "saizensen",
    "vn": "Tuyến đầu",
    "ex": "最前線で働きます。",
    "exVn": "Làm việc ở tuyến đầu."
  },
  {
    "jp": "錯覚",
    "rom": "sakkaku",
    "vn": "Ảo giác, Lầm tưởng",
    "ex": "錯覚を起こしました。",
    "exVn": "Đã bị ảo giác."
  },
  {
    "jp": "差別",
    "rom": "sabetsu",
    "vn": "Phân biệt đối xử",
    "ex": "差別してはいけません。",
    "exVn": "Không được phân biệt đối xử."
  },
  {
    "jp": "暫定",
    "rom": "zantei",
    "vn": "Tạm thời, Lâm thời",
    "ex": "暫定措置を取ります。",
    "exVn": "Áp dụng biện pháp tạm thời."
  },
  {
    "jp": "自覚",
    "rom": "jikaku",
    "vn": "Ý thức bản thân",
    "ex": "責任を自覚します。",
    "exVn": "Ý thức về trách nhiệm."
  },
  {
    "jp": "自己矛盾",
    "rom": "jiko mujun",
    "vn": "Tự mâu thuẫn",
    "ex": "自己矛盾を感じます。",
    "exVn": "Cảm thấy tự mâu thuẫn."
  },
  {
    "jp": "実態",
    "rom": "jittai",
    "vn": "Thực trạng",
    "ex": "現場の実態を調べます。",
    "exVn": "Điều tra thực trạng hiện trường."
  },
  {
    "jp": "示唆",
    "rom": "shisa",
    "vn": "Gợi ý, Hàm ý",
    "ex": "示唆に富む発言です。",
    "exVn": "Đây là phát biểu giàu hàm ý."
  },
  {
    "jp": "縦横",
    "rom": "juuou",
    "vn": "Dọc ngang, Tự do",
    "ex": "縦横に活躍します。",
    "exVn": "Hoạt động tự do dọc ngang."
  },
  {
    "jp": "純粋",
    "rom": "junsui",
    "vn": "Thuần túy, Trong sáng",
    "ex": "純粋な動機です。",
    "exVn": "Động cơ thuần túy."
  },
  {
    "jp": "序列",
    "rom": "joretsu",
    "vn": "Trật tự, Thứ bậc",
    "ex": "序列を決めます。",
    "exVn": "Quyết định thứ bậc."
  },
  {
    "jp": "進化",
    "rom": "shinka",
    "vn": "Tiến hóa",
    "ex": "技術が進化しています。",
    "exVn": "Công nghệ đang tiến hóa."
  },
  {
    "jp": "真髄",
    "rom": "shinzui",
    "vn": "Tinh hoa, Bản chất",
    "ex": "芸術の真髄を学びます。",
    "exVn": "Học tinh hoa của nghệ thuật."
  },
  {
    "jp": "相次ぐ",
    "rom": "aitsugu",
    "vn": "Xảy ra liên tiếp",
    "ex": "事故が相次いで発生した。",
    "exVn": "Các tai nạn xảy ra liên tiếp."
  },
  {
    "jp": "幾多",
    "rom": "ikuta",
    "vn": "Nhiều, Mấy",
    "ex": "幾多の困難を乗り越える。",
    "exVn": "Vượt qua vô số khó khăn."
  },
  {
    "jp": "隠密",
    "rom": "ommitsu",
    "vn": "Bí mật, Kín đáo",
    "ex": "隠密に調査を進める。",
    "exVn": "Tiến hành điều tra kín đáo."
  },
  {
    "jp": "乖離",
    "rom": "kairi",
    "vn": "Xa rời, Tách biệt",
    "ex": "理想と現実が乖離している。",
    "exVn": "Lý tưởng và thực tế đang xa rời nhau."
  },
  {
    "jp": "簡潔",
    "rom": "kanketsu",
    "vn": "Súc tích, Ngắn gọn",
    "ex": "簡潔に要点を説明する。",
    "exVn": "Giải thích trọng điểm một cách ngắn gọn."
  },
  {
    "jp": "希薄",
    "rom": "kihaku",
    "vn": "Hời hợt, Loãng",
    "ex": "人間関係が希薄になる。",
    "exVn": "Mối quan hệ con người trở nên hời hợt."
  },
  {
    "jp": "糾弾",
    "rom": "kyuudan",
    "vn": "Kên án, Phê phán gay gắt",
    "ex": "不正行為を強く糾弾する。",
    "exVn": "Lên án gay gắt hành vi bất chính."
  },
  {
    "jp": "巧妙",
    "rom": "koumyou",
    "vn": "Tinh vi, Khéo léo",
    "ex": "巧妙な手口に騙される。",
    "exVn": "Bị lừa bởi thủ đoạn tinh vi."
  },
  {
    "jp": "刷新",
    "rom": "sasshin",
    "vn": "Đổi mới, Canh tân",
    "ex": "組織の体制を刷新する。",
    "exVn": "Đổi mới thể chế của tổ chức."
  }
];
// ─── N4 Grammar patterns ─────────────────────────────────────
const GRAMMAR_N5 = [
  { pattern:"〜は〜です", meaning:"A là B (Khẳng định cơ bản)", use:"Danh từ + は + Danh từ + です", example:"わたしは学生です。", exVn:"Tôi là học sinh.", note:"Cấu trúc câu khẳng định danh từ cơ bản nhất." },
  { pattern:"〜ではありません / 〜じゃないです", meaning:"A không phải là B (Phủ định)", use:"Danh từ + ではありません / じゃないです", example:"かれは先生ではありません。", exVn:"Anh ấy không phải là giáo viên.", note:"Phủ định của 〜です. じゃないです dùng trong văn nói." },
  { pattern:"〜ですか", meaning:"Có phải ~ không? (Hỏi)", use:"Câu + か", example:"これは本ですか。", exVn:"Cái này là sách phải không?", note:"Thêm か ở cuối câu để nghi vấn." },
  { pattern:"〜の", meaning:"Của ~ (Trợ từ sở hữu)", use:"Danh từ 1 + の + Danh từ 2", example:"これはわたしの傘です。", exVn:"Cái này là ô của tôi.", note:"Chỉ sự sở hữu hoặc thuộc về." },
  { pattern:"〜も", meaning:"Cũng ~", use:"Danh từ + も", example:"わたしもベトナム人です。", exVn:"Tôi cũng là người Việt Nam.", note:"Thay thế cho は khi đồng nhất." },
  { pattern:"〜へ / 〜に いきます・きます・かえります", meaning:"Đi / Đến / Về đâu (Phương hướng)", use:"Danh từ địa điểm + へ/に + 行きます/来ます/帰ります", example:"明日京都へ行きます。", exVn:"Ngày mai tôi sẽ đi Kyoto.", note:"へ chỉ hướng di chuyển, に chỉ điểm đến." },
  { pattern:"〜を たべます・みます...", meaning:"Tác động tân ngữ", use:"Danh từ + を + Ngoại động từ", example:"毎朝パンを食べます。", exVn:"Mỗi sáng tôi ăn bánh mì.", note:"を đi với đối tượng tác động." },
  { pattern:"〜で (phương tiện / địa điểm)", meaning:"Bằng / Tại ~", use:"Danh từ + で", example:"電車で学校へ行きます。/ レストランで食べます。", exVn:"Đi học bằng tàu điện / Ăn ở nhà hàng.", note:"Chỉ công cụ phương tiện hoặc địa điểm diễn ra hành động." },
  { pattern:"〜と", meaning:"Và / Cùng với ~", use:"Danh từ + と + Danh từ", example:"友達と映画を見ます。", exVn:"Tôi xem phim cùng với bạn.", note:"Nối danh từ hoặc đối tượng cùng thực hiện." },
  { pattern:"〜から〜まで", meaning:"Từ ~ đến ~", use:"Thời gian/Địa điểm + から + まで", example:"9時から5時まで働きます。", exVn:"Tôi làm việc từ 9 giờ đến 5 giờ.", note:"Phạm vi thời gian hoặc không gian." },
  { pattern:"〜があります / 〜います", meaning:"Có ~ (Vật / Người & Con vật)", use:"Danh từ + があります (vật) / がいます (người/động vật)", example:"部屋にテレビがあります。/ 庭に犬がいます。", exVn:"Trong phòng có TV. / Trong sân có con chó.", note:"があります cho vật vô sinh, がいます cho động vật/người." },
  { pattern:"〜たいです", meaning:"Muốn làm ~", use:"Động từ V-masu (bỏ masu) + たいです", example:"日本へ行きたいです。", exVn:"Tôi muốn đi Nhật Bản.", note:"Nguyện vọng cá nhân." },
  { pattern:"〜てください", meaning:"Xin hãy làm ~", use:"Động từ て形 + ください", example:"ここに名前を書いてください。", exVn:"Xin hãy viết tên vào đây.", note:"Yêu cầu lịch sự." },
  { pattern:"〜てもいいです", meaning:"Được phép làm ~", use:"Động từ て形 + もいいです", example:"写真を撮ってもいいです。", exVn:"Bạn có thể chụp ảnh.", note:"Cho phép hoặc xin phép." },
  { pattern:"〜てはいけません", meaning:"Không được phép làm ~ (Cấm)", use:"Động từ て形 + はいけません", example:"ここで入ってはいけません。", exVn:"Không được vào đây.", note:"Cấm đoán hành động." },
  { pattern:"〜ています", meaning:"Đang làm ~ / Trạng thái duy trì", use:"Động từ て形 + います", example:"今日本語を勉強しています。", exVn:"Bây giờ tôi đang học tiếng Nhật.", note:"Hành động tiếp diễn hoặc trạng thái kéo dài." },
  { pattern:"〜にいきます", meaning:"Đi để làm ~ (Mục đích)", use:"V-masu (bỏ masu) / Danh từ + に行きます", example:"スーパーへ買い物に行きます。", exVn:"Tôi đi siêu thị để mua sắm.", note:"Mục đích của việc di chuyển." },
  { pattern:"〜ましょう / 〜ましょうか", meaning:"Cùng làm ~ nhé! / Đề nghị giúp", use:"V-masu (bỏ masu) + ましょう / ましょうか", example:"一緒にお茶を飲みましょう。", exVn:"Cùng uống trà nhé!", note:"Lời rủ rê hoặc đề nghị." },
  { pattern:"〜ないでください", meaning:"Xin đừng làm ~", use:"Động từ ない形 + でください", example:"心配しないでください。", exVn:"Xin đừng lo lắng.", note:"Yêu cầu không làm việc gì." },
  { pattern:"〜のがすきです / じょうずです", meaning:"Thích / Giỏi làm ~", use:"V-ru + のが + 好きです / 上手です", example:"料理を作るのが好きです。", exVn:"Tôi thích nấu ăn.", note:"Danh từ hóa hành động." },
  { pattern:"〜より〜ほうが〜です", meaning:"A so với B thì ~ hơn", use:"N1 + より + N2 + のほうが + Adj", example:"電車より新幹線のほうが速いです。", exVn:"So với tàu điện thì shinkansen nhanh hơn.", note:"Mẫu câu so sánh hơn." },
  { pattern:"〜の中で〜が一番〜です", meaning:"Trong số ~ thì ~ là nhất", use:"N の中で + đối tượng + が一番 + Adj", example:"一年の中で春が一番好きです。", exVn:"Trong một năm tôi thích mùa xuân nhất.", note:"So sánh nhất trong tập hợp." },
  { pattern:"〜つもりです", meaning:"Dự định làm ~", use:"V-ru / V-nai + つもりです", example:"来年日本へ行くつもりです。", exVn:"Tôi dự định sang Nhật vào năm sau.", note:"Dự định đã chuẩn bị trước." },
  { pattern:"〜たことがあります", meaning:"Đã từng ~ (Kinh nghiệm)", use:"V-ta + ことがあります", example:"富士山に登ったことがあります。", exVn:"Tôi đã từng leo núi Phú Sĩ.", note:"Trải nghiệm trong quá khứ." },
  { pattern:"〜たり〜たりします", meaning:"Lúc thì ~, lúc thì ~", use:"V-ta + り + V-ta + りします", example:"休みの日は本を読んだり音楽を聴いたりします。", exVn:"Ngày nghỉ tôi lúc thì đọc sách, lúc thì nghe nhạc.", note:"Liệt kê hành động tiêu biểu." },
  { pattern:"〜くなります / になります", meaning:"Trở nên ~", use:"Adj-i (bỏ i) + くなります / Adj-na & N + になります", example:"寒くなります。/ 医者になります。", exVn:"Trời trở nên lạnh. / Trở thành bác sĩ.", note:"Sự biến đổi trạng thái." },
  { pattern:"〜まえに", meaning:"Trước khi ~", use:"V-ru / N の + 前に", example:"寝る前に薬を飲みます。", exVn:"Trước khi đi ngủ tôi uống thuốc.", note:"Trình tự thời gian trước." },
  { pattern:"〜あとで", meaning:"Sau khi ~", use:"V-ta / N の + 後で", example:"ご飯を食べた後で散歩します。", exVn:"Sau khi ăn cơm tôi đi dạo.", note:"Trình tự thời gian sau." },
  { pattern:"〜からです", meaning:"Vì ~ (Nguyên nhân)", use:"Câu + からです", example:"時間がなかったからです。", exVn:"Vì không có thời gian.", note:"Giải thích nguyên nhân." },
  { pattern:"〜でしょう", meaning:"Có lẽ ~ phải không?", use:"Thể thông thường + でしょう", example:"明日は晴れるでしょう。", exVn:"Có lẽ ngày mai trời sẽ nắng.", note:"Phỏng đoán hoặc hỏi lịch sự." },
  { pattern:"〜すぎます", meaning:"Quá ~ (Vượt mức)", use:"V-masu (bỏ masu) / Adj + すぎます", example:"この服は大きすぎます。", exVn:"Bộ quần áo này quá to.", note:"Vượt quá giới hạn cần thiết." },
  { pattern:"〜やすいです / にくいです", meaning:"Dễ ~ / Khó ~", use:"V-masu (bỏ masu) + やすいです / にくいです", example:"このペンは書きやすいです。", exVn:"Cây bút này dễ viết.", note:"Đánh giá độ dễ/khó của hành động." }
];

const GRAMMAR_N4 = [
  { pattern:"〜てから", meaning:"Sau khi làm ~", use:"Động từ て形 + から", example:"ご飯を食べてから勉強します。", exVn:"Sau khi ăn cơm tôi học bài.", note:"Nhấn mạnh trình tự A xong mới B." },
  { pattern:"〜なければならない", meaning:"Phải làm ~, Bắt buộc", use:"V-nai (bỏ い) + なければならない", example:"明日早く起きなければなりません。", exVn:"Ngày mai tôi phải dậy sớm.", note:"Nghĩa vụ bắt buộc." },
  { pattern:"〜ことができる", meaning:"Có thể làm ~ (khả năng)", use:"V-ru + ことができる", example:"日本語を話すことができます。", exVn:"Tôi có thể nói tiếng Nhật.", note:"Dạng khả năng trang trọng." },
  { pattern:"〜ようになる", meaning:"Trở nên có thể ~, Dần thay đổi", use:"V-ru / V-nai + ようになる", example:"日本語が話せるようになりました。", exVn:"Tôi đã có thể nói tiếng Nhật.", note:"Sự thay đổi năng lực/thói quen." },
  { pattern:"〜ようにする", meaning:"Cố gắng ~ (tạo thói quen)", use:"V-ru / V-nai + ようにする", example:"毎日運動するようにしています。", exVn:"Tôi cố gắng tập thể dục mỗi ngày.", note:"Nỗ lực duy trì thói quen." },
  { pattern:"〜ために", meaning:"Để ~, Vì mục đích ~", use:"V-ru / N の + ために", example:"日本語を勉強するために、日本に来ました。", exVn:"Tôi đến Nhật để học tiếng Nhật.", note:"Mục đích rõ ràng." },
  { pattern:"〜ので", meaning:"Vì ~, Do ~ (lịch sự)", use:"Thể thông thường + ので", example:"雨が降っているので、傘を持ってください。", exVn:"Vì trời đang mưa nên hãy mang ô.", note:"Nguyên nhân lịch sự khách quan." },
  { pattern:"〜のに", meaning:"Mặc dù ~ (nhưng)", use:"Thể thông thường + のに", example:"一生懸命勉強したのに、試験に落ちた。", exVn:"Mặc dù học chăm chỉ nhưng vẫn trượt.", note:"Bất ngờ, thất vọng." },
  { pattern:"〜ばよかった", meaning:"Ước gì đã ~ (hối tiếc)", use:"Động từ ば形 + よかった", example:"もっと早く来ればよかった。", exVn:"Ước gì đã đến sớm hơn.", note:"Hối tiếc về quá khứ." },
  { pattern:"〜てあげる/くれる/もらう", meaning:"Hành động trao nhận ân huệ", use:"V-te + あげる/くれる/もらう", example:"友達に宿題を教えてあげた。", exVn:"Tôi dạy bạn làm bài tập về nhà.", note:"Cho/nhận sự giúp đỡ." },
  { pattern:"〜ている間に", meaning:"Trong khi ~ (hai việc song song)", use:"V-teiru + 間に", example:"テレビを見ている間に眠ってしまった。", exVn:"Trong khi xem TV thì ngủ quên.", note:"Hành động B diễn ra trong khi A kéo dài." },
  { pattern:"〜らしい", meaning:"Nghe nói ~, Có vẻ ~", use:"Thể thông thường + らしい", example:"彼は来ないらしいです。", exVn:"Nghe nói anh ấy không đến.", note:"Thông tin gián tiếp có căn cứ." },
  { pattern:"〜そうだ (様態)", meaning:"Trông có vẻ ~ (quan sát)", use:"V-masu語幹 / Adj + そうだ", example:"雨が降りそうです。", exVn:"Trông có vẻ sắp mưa.", note:"Quan sát trực tiếp." },
  { pattern:"〜そうだ (伝聞)", meaning:"Nghe nói là ~", use:"Thể thông thường + そうだ", example:"天気予報によると明日は雨だそうだ。", exVn:"Theo dự báo thời tiết nghe nói mai mưa.", note:"Trích dẫn nguồn tin." },
  { pattern:"〜ても", meaning:"Dù ~ cũng", use:"V-te / Adj-te + も", example:"雨が降っても行きます。", exVn:"Dù trời mưa tôi cũng đi.", note:"Giả định nghịch cảnh." },
  { pattern:"〜なら", meaning:"Nếu ~ thì (dựa vào thông tin tiếp nhận)", use:"Thể thông thường + なら", example:"日本語を勉強するなら、毎日練習してください。", exVn:"Nếu bạn học tiếng Nhật thì hãy luyện tập mỗi ngày.", note:"Đưa ra lời khuyên theo gợi ý." },
  { pattern:"〜し", meaning:"Vừa ~, Ngoài ra còn ~", use:"Thể thông thường + し", example:"安いし、おいしいし、このお店が好きです。", exVn:"Vừa rẻ, vừa ngon nên tôi thích quán này.", note:"Liệt kê nhiều lý do." },
  { pattern:"〜はずだ", meaning:"Chắc chắn là ~", use:"Thể thông thường + はずだ", example:"彼女は来るはずです。", exVn:"Chắc chắn cô ấy sẽ đến.", note:"Phỏng đoán logic mạnh." },
  { pattern:"〜かもしれない", meaning:"Có thể ~, Có lẽ ~", use:"Thể thông thường + かもしれない", example:"明日雨かもしれません。", exVn:"Có thể ngày mai mưa.", note:"Khả năng khoảng 50%." },
  { pattern:"〜てみる", meaning:"Thử làm ~", use:"V-te + みる", example:"この料理を食べてみてください。", exVn:"Hãy thử ăn món này.", note:"Thử trải nghiệm." },
  { pattern:"〜てしまう", meaning:"Lỡ ~, Hoàn thành ngoài ý muốn", use:"V-te + しまう", example:"宿題を忘れてしまいました。", exVn:"Tôi đã quên mất bài tập về nhà rồi.", note:"Lỡ xảy ra việc tiếc nuối." },
  { pattern:"〜ておく", meaning:"Làm trước để chuẩn bị", use:"V-te + おく", example:"パーティーの前に料理を作っておきます。", exVn:"Tôi sẽ nấu ăn trước bữa tiệc.", note:"Chuẩn bị sẵn sàng." },
  { pattern:"〜ていく / 〜てくる", meaning:"Dần biến đổi hướng đi / lại", use:"V-te + いく/くる", example:"気温がだんだん上がっていきます。", exVn:"Nhiệt độ dần dần tăng lên.", note:"Xu hướng thời gian." },
  { pattern:"〜ながら", meaning:"Vừa ~ vừa ~", use:"V-masu語幹 + ながら", example:"音楽を聴きながら勉強します。", exVn:"Tôi vừa nghe nhạc vừa học bài.", note:"Đồng thời hai việc." },
  { pattern:"〜ばかり", meaning:"Toàn là ~, Chỉ ~", use:"N / V-te + ばかり", example:"甘いものばかり食べています。", exVn:"Tôi ăn toàn đồ ngọt.", note:"Chỉ một thứ (phê bình)." },
  { pattern:"〜まま", meaning:"Giữ nguyên trạng thái ~", use:"V-ta / V-nai / Nの + まま", example:"電気をつけたまま寝てしまった。", exVn:"Tôi ngủ quên với đèn bật.", note:"Giữ nguyên không đổi." },
  { pattern:"〜がる", meaning:"Tỏ ra ~ / Muốn ~ (ngôi thứ 3)", use:"Adj-i (bỏ i) / V-tai (bỏ i) + がる", example:"子供が欲しがっています。", exVn:"Đứa trẻ đang tỏ ra rất muốn.", note:"Diễn tả cảm xúc người thứ 3." },
  { pattern:"〜とおりに", meaning:"Theo đúng như ~", use:"V-ru / V-ta / Nの + とおりに", example:"言ったとおりにやってみてください。", exVn:"Hãy làm theo đúng như những gì tôi nói.", note:"Làm chính xác theo mẫu." },
  { pattern:"〜たほうがいい", meaning:"Nên làm ~ (Lời khuyên)", use:"V-ta / V-nai + ほうがいい", example:"早く寝たほうがいいですよ。", exVn:"Bạn nên đi ngủ sớm đi.", note:"Khuyên nhủ nên làm gì." }
];

const GRAMMAR_N3 = [
  { pattern:"〜うちに", meaning:"Trong lúc còn ~ / Nhân lúc ~", use:"Adj / V-ru / V-teiru / V-nai + うちに", example:"若いうちに、いろいろな経験をしたい。", exVn:"Nhân lúc còn trẻ, tôi muốn trải nghiệm nhiều thứ.", note:"Làm trước khi trạng thái thay đổi." },
  { pattern:"〜さいちゅうに (最中に)", meaning:"Đúng lúc đang ~ thì có việc xen vào", use:"V-teiru / N の + 最中に", example:"会議の最中に携帯電話が鳴った。", exVn:"Đúng lúc đang họp thì điện thoại reo.", note:"Bị can thiệp giữa chừng." },
  { pattern:"〜たびに", meaning:"Mỗi lần ~ thì lại ~", use:"V-ru / N の + たびに", example:"この写真を見るたびに、故郷を思い出す。", exVn:"Mỗi lần nhìn bức ảnh này tôi lại nhớ quê nhà.", note:"Lặp lại lặp lại cùng kết quả." },
  { pattern:"〜ついでに", meaning:"Nhân tiện ~, Tiện thể ~", use:"V-ru / V-ta / N の + ついでに", example:"散歩のついでに郵便局へ行った。", exVn:"Nhân tiện đi dạo tôi đã ghé bưu điện.", note:"Việc phụ ké theo việc chính." },
  { pattern:"〜とたん (途端に)", meaning:"Vừa mới ~ thì ngay lập tức ~", use:"V-ta + とたん", example:"窓を開けたとたん、強い風が入ってきた。", exVn:"Vừa mới mở cửa sổ ra thì gió mạnh thổi vào ngay.", note:"Sự việc B bất ngờ xảy ra sau A." },
  { pattern:"〜から〜にかけて", meaning:"Từ ~ đến ~ (phạm vi chừng)", use:"N1 + から + N2 + にかけて", example:"昨夜から今朝にかけて雨が降った。", exVn:"Trời đã mưa từ đêm qua đến sáng nay.", note:"Phạm vi không ranh giới cứng." },
  { pattern:"〜をはじめ (をはじめとする)", meaning:"Trước tiên phải kể đến ~", use:"N + をはじめ", example:"日本には富士山をはじめ、美しい山が多い。", exVn:"Ở Nhật có nhiều núi đẹp, trước tiên phải kể đến núi Phú Sĩ.", note:"Ví dụ tiêu biểu nhất." },
  { pattern:"〜を中心として / を中心に", meaning:"Lấy ~ làm trung tâm", use:"N + を中心にして", example:"この国は観光業を中心として発展している。", exVn:"Quốc gia này phát triển lấy ngành du lịch làm trung tâm.", note:"Đặt đối tượng làm trọng tâm." },
  { pattern:"〜について / 〜に関して", meaning:"Về ~ / Liên quan đến ~", use:"N + について / に関して", example:"日本の文化に関して討論を行った。", exVn:"Chúng tôi đã thảo luận liên quan đến văn hóa Nhật.", note:"Chủ đề nghiên cứu/thảo luận." },
  { pattern:"〜に比べて", meaning:"So với ~", use:"N + に比べて", example:"今年は去年に比べて暖かい。", exVn:"Năm nay so với năm ngoái thì ấm hơn.", note:"So sánh giữa 2 đối tượng." },
  { pattern:"〜に対して", meaning:"Đối với ~ / Trái ngược với ~", use:"N + に対して", example:"お客様に対して失礼な態度をとってはいけない。", exVn:"Không được có thái độ thất lễ đối với khách hàng.", note:"Hướng tới đối tượng hoặc sự đối lập." },
  { pattern:"〜によって", meaning:"Do ~ / Bởi ~ / Tùy vào ~", use:"N + によって", example:"台風によって家が壊れた。/ 人によって考え方が違う。", exVn:"Nhà bị hỏng do bão. / Tùy mỗi người mà suy nghĩ khác nhau.", note:"Nguyên nhân, tác giả, sự đa dạng." },
  { pattern:"〜によると / 〜によれば", meaning:"Theo như ~ (Nguồn thông tin)", use:"N + によると", example:"天気予報によると明日雨だそうだ。", exVn:"Theo như dự báo thời tiết nghe nói mai mưa.", note:"Nêu nguồn trích dẫn." },
  { pattern:"〜に基づいて / 〜をもとに", meaning:"Dựa trên ~ / Căn cứ vào ~", use:"N + に基づいて", example:"事実に基づいて報告書を書く。", exVn:"Viết báo cáo dựa trên sự thật.", note:"Căn cứ nền tảng." },
  { pattern:"〜気味 (ぎみ)", meaning:"Có cảm giác hơi ~ (hướng tiêu cực)", use:"N / V-masu (bỏ masu) + 気味", example:"最近風邪気味で体調が悪い。", exVn:"Dạo này có cảm giác hơi cảm nên mệt mỏi.", note:"Tình trạng xấu nhẹ." },
  { pattern:"〜がち", meaning:"Thường hay ~ (xu hướng xấu)", use:"N / V-masu (bỏ masu) + がち", example:"一人暮らしは栄養が偏りがちだ。", exVn:"Sống một mình thì dinh dưỡng hay bị lệch.", note:"Xu hướng lặp đi lặp lại không tốt." },
  { pattern:"〜っぽい", meaning:"Có vẻ ~ / Như là ~", use:"N / Adj / V-masu + っぽい", example:"彼は大人なのに子供っぽい。", exVn:"Anh ấy tuy là người lớn nhưng hay có tính trẻ con.", note:"Tính chất tương tự." },
  { pattern:"〜だらけ", meaning:"Toàn là ~ (đầy vết bẩn/tiêu cực)", use:"N + だらけ", example:"この部屋はゴミだらけだ。", exVn:"Căn phòng này toàn là rác.", note:"Phủ đầy bởi thứ không thích." },
  { pattern:"〜恐れがある (おそれがある)", meaning:"E rằng ~, Có nguy cơ ~", use:"V-ru / Nの + 恐れがある", example:"大雨で川が溢れる恐れがある。", exVn:"Do mưa lớn e rằng sông sẽ tràn bờ.", note:"Cảnh báo nguy cơ xấu." },
  { pattern:"〜に違いない", meaning:"Chắc chắn là ~", use:"Thể thông thường + に違いない", example:"犯人は彼に違いない。", exVn:"Thủ phạm chắc chắn là anh ta.", note:"Khẳng định chắc chắn." },
  { pattern:"〜わけがない", meaning:"Làm sao có chuyện ~", use:"Thể thông thường + わけがない", example:"そんな難しい問題が僕にできるわけがない。", exVn:"Vấn đề khó như thế làm sao tôi làm được.", note:"Phủ định tuyệt đối logic." },
  { pattern:"〜わけではない", meaning:"Không phải là ~ / Không hẳn là ~", use:"Thể thông thường + わけではない", example:"高い料理が必ずしもおいしいわけではない。", exVn:"Món ăn đắt tiền không hẳn lúc nào cũng ngon.", note:"Phủ định một phần." },
  { pattern:"〜のかわりに (代わりに)", meaning:"Thay vì ~ / Thay cho ~", use:"V-ru / Nの + 代わりに", example:"コーヒーの代わりに紅茶を飲んだ。", exVn:"Thay vì cà phê tôi đã uống trà hồng.", note:"Thay thế hành động/đối tượng." },
  { pattern:"〜とともに", meaning:"Cùng với ~ / Đồng thời với ~", use:"N / V-ru + とともに", example:"技術の進歩とともに生活が便利になった。", exVn:"Cùng với sự tiến bộ của công nghệ, cuộc sống đã trở nên tiện lợi.", note:"Sự việc song song biến đổi." },
  { pattern:"〜に伴って (にともなって)", meaning:"Cùng với ~ / Kéo theo ~", use:"N / V-ru + に伴って", example:"人口減少に伴って空き家が増えている。", exVn:"Cùng với sự giảm dân số, nhà hoang tăng lên.", note:"Biến đổi kéo theo sự việc khác." },
  { pattern:"〜につれて", meaning:"Càng ~ thì càng ~", use:"V-ru / N + につれて", example:"日本語が上手になるにつれて勉強が楽しくなる。", exVn:"Càng giỏi tiếng Nhật thì việc học lại càng vui.", note:"Sự thay đổi tỉ lệ thuận." },
  { pattern:"〜にしたがって", meaning:"Theo như ~ / Càng ~ thì càng ~", use:"V-ru / N + にしたがって", example:"予定に従って進めてください。", exVn:"Hãy tiến hành theo như kế hoạch.", note:"Tuân theo chỉ dẫn hoặc thay đổi tỉ lệ." },
  { pattern:"〜を通して / を通じて", meaning:"Thông qua ~ / Trong suốt ~", use:"N + を通して", example:"友人を通して彼と知り合った。", exVn:"Tôi quen biết anh ấy thông qua người bạn.", note:"Phương tiện trung gian." }
];

const GRAMMAR_N2 = [
  { pattern:"〜に先立って (にさきだって)", meaning:"Trước khi ~ (sự kiện lớn)", use:"N / V-ru + に先立って", example:"新商品の発売に先立って説明会が開かれた。", exVn:"Trước khi mở bán sản phẩm mới, một buổi giải thích đã được tổ chức.", note:"Chuẩn bị sự kiện quan trọng." },
  { pattern:"〜を契機に (をけいきに) / を機に", meaning:"Nhân cơ hội ~ / Từ mốc ~", use:"N + を契機に", example:"結婚を契機にタバコをやめた。", exVn:"Nhân cơ hội kết hôn tôi đã bỏ thuốc lá.", note:"Bước ngoặt thay đổi." },
  { pattern:"〜のもとで / のもとに", meaning:"Dưới sự ~ (dẫn dắt/chỉ đạo)", use:"N + のもとで", example:"有名な教授のもとで研究を行う。", exVn:"Nghiên cứu được tiến hành dưới sự hướng dẫn của giáo sư nổi tiếng.", note:"Dưới quyền hạn/ảnh hưởng." },
  { pattern:"〜をめぐって", meaning:"Xoay quanh vấn đề ~ (tranh cãi)", use:"N + をめぐって", example:"遺産相続をめぐって親族が対立している。", exVn:"Dòng họ đối lập xoay quanh việc thừa kế tài sản.", note:"Tranh luận nhiều bên." },
  { pattern:"〜にあたって / に際して", meaning:"Khi bắt đầu ~ / Nhân dịp ~", use:"N / V-ru + にあたって", example:"開校にあたり、一言ご挨拶申し上げます。", exVn:"Nhân dịp mở trường, tôi xin có đôi lời phát biểu.", note:"Bắt đầu sự kiện trang trọng." },
  { pattern:"〜にかかわらず / に関わりなく", meaning:"Bất kể ~ / Không liên quan đến ~", use:"N / Adj / V + にかかわらず", example:"参加不参加にかかわらず、連絡してください。", exVn:"Bất kể tham gia hay không hãy liên lạc cho tôi.", note:"Điều kiện không ảnh hưởng kết quả." },
  { pattern:"〜を問わず (をとわず)", meaning:"Không phân biệt ~ / Bất kể ~", use:"N + を問わず", example:"年齢性別を問わず、誰でも応募できます。", exVn:"Không phân biệt tuổi tác giới tính, ai cũng có thể ứng tuyển.", note:"Không đặt giới hạn điều kiện." },
  { pattern:"〜にもかかわらず", meaning:"Mặc dù ~ nhưng", use:"Thể thông thường / N + にもかかわらず", example:"悪天候にもかかわらず多くの人が集まった。", exVn:"Mặc dù thời tiết xấu nhưng nhiều người vẫn tập trung.", note:"Trái ngược dự đoán." },
  { pattern:"〜を込めて (をこめて)", meaning:"Gửi gắm hết (tình cảm)", use:"N (tình cảm) + を込めて", example:"感謝の気持ちを込めて手紙を書いた。", exVn:"Tôi đã viết thư gửi gắm tất cả lòng biết ơn.", note:"Chứa đựng cảm xúc." },
  { pattern:"〜を通じて / をとおして", meaning:"Trong suốt khoảng thời gian ~", use:"N + を通じて", example:"この地域は年間を通じて暖かい。", exVn:"Khu vực này ấm áp trong suốt cả năm.", note:"Kéo dài liên tục suốt thời gian." },
  { pattern:"〜にわたって", meaning:"Kéo dài suốt / Trên diện rộng ~", use:"N (thời gian/không gian) + にわたって", example:"会議は3時間にわたって行われた。", exVn:"Cuộc họp đã diễn ra kéo dài suốt 3 tiếng.", note:"Phạm vi quy mô rộng." },
  { pattern:"〜にすぎない", meaning:"Chỉ là ~ / Không gì hơn ngoài ~", use:"Thể thông thường + にすぎない", example:"それは単なる噂にすぎない。", exVn:"Đó chỉ đơn thuần là tin đồn mà thôi.", note:"Đánh giá mức độ nhỏ bé." },
  { pattern:"〜にほかならない", meaning:"Chính là ~ / Không gì khác ngoài ~", use:"N / Thể thông thường + にほかならない", example:"合格したのは彼の努力の結晶にほかならない。", exVn:"Đỗ kỳ thi chính là kết quả sự nỗ lực của anh ấy.", note:"Khẳng định lý do duy nhất." },
  { pattern:"〜に越したことはない", meaning:"~ là tốt nhất", use:"Thể thông thường + に越したことはない", example:"用心に越したことはない。", exVn:"Cẩn thận là tốt nhất.", note:"Lời khuyên an toàn." },
  { pattern:"〜ざるを得ない (ざるをえない)", meaning:"Đành phải ~ (dù không muốn)", use:"V-nai (bỏ nai) + ざるを得ない", example:"理由を説明せざるを得ない。", exVn:"Tôi đành phải giải thích lý do.", note:"Hoàn cảnh ép buộc." },
  { pattern:"〜かねない", meaning:"Có thể sẽ ~ (dự báo xấu)", use:"V-masu (bỏ masu) + かねない", example:"このままでは事故が起きかねない。", exVn:"Cứ thế này thì có thể sẽ xảy ra tai nạn.", note:"Cảnh báo rủi ro xấu." },
  { pattern:"〜かねる", meaning:"Khó mà ~ (từ chối lịch sự)", use:"V-masu (bỏ masu) + かねる", example:"ご要望には応じかねます。", exVn:"Rất tiếc chúng tôi khó mà đáp ứng yêu cầu của quý khách.", note:"Từ chối lịch sự trong kinh doanh." },
  { pattern:"〜どころではない", meaning:"Không phải lúc ~ / Không thể ~", use:"N / V-ru + どころではない", example:"忙しくて旅行どころではない。", exVn:"Bận rộn thế này thì không phải lúc đi du lịch.", note:"Tình thế không cho phép." },
  { pattern:"〜まい / 〜まいか", meaning:"Chắc chắn không ~ / Quyết không ~", use:"V-ru + まい", example:"二度とあのような過ちは繰り返すまい。", exVn:"Quyết không lặp lại sai lầm như thế lần thứ hai.", note:"Ý chí phủ định mạnh." },
  { pattern:"〜を余儀なくされる (をよぎなくされる)", meaning:"Buộc phải ~", use:"N + を余儀なくされる", example:"台風で計画の変更を余儀なくされた。", exVn:"Do bão nên buộc phải thay đổi kế hoạch.", note:"Tình thế ép buộc." },
  { pattern:"〜に至る (にいたる) / 至るまで", meaning:"Dẫn đến ~ / Cho tới tận ~", use:"N / V-ru + に至る", example:"問題は解決に至らなかった。", exVn:"Vấn đề vẫn chưa dẫn đến giải pháp.", note:"Đạt tới giai đoạn." },
  { pattern:"〜を限りに (をかぎりに)", meaning:"Hạn chót là ~", use:"N + を限りに", example:"今日を限りにこの店を閉店します。", exVn:"Hạn chót là hôm nay cửa hàng này sẽ đóng cửa.", note:"Tuyên bố chấm dứt thời hạn." },
  { pattern:"〜にとどまらず", meaning:"Không chỉ dừng lại ở ~", use:"N / V-ru + にとどまらず", example:"被害は国内にとどまらず海外にも広がった。", exVn:"Thiệt hại không chỉ dừng lại ở trong nước mà còn lan ra nước ngoài.", note:"Vượt qua giới hạn." },
  { pattern:"〜ともなると / ともなれば", meaning:"Một khi đã là ~ (đương nhiên)", use:"N + ともなると", example:"社会人ともなると責任が重くなる。", exVn:"Một khi đã đi làm thì trách nhiệm sẽ trở nên nặng nề.", note:"Vị thế/độ tuổi cao hơn." },
  { pattern:"〜っこない", meaning:"Tuyệt đối không thể ~", use:"V-masu (bỏ masu) + っこない", example:"そんな大金、一日で稼げっこない。", exVn:"Số tiền lớn như thế tuyệt đối không thể kiếm trong 1 ngày.", note:"Phủ định khả năng." }
];

const GRAMMAR_N1 = [
  { pattern:"〜なり", meaning:"Vừa mới ~ thì đã lập tức ~", use:"V-ru + なり", example:"彼は部屋に入るなり、倒れてしまった。", exVn:"Anh ấy vừa mới vào phòng thì đã ngã gục ngay.", note:"Hành động đột ngột xảy ra liên tiếp." },
  { pattern:"〜や否や (やいなや)", meaning:"Vừa mới ~ xong là ngay lập tức ~", use:"V-ru + や否や", example:"チャイムが鳴るや否や、生徒たちは飛び出した。", exVn:"Chuông vừa reo xong là học sinh lập tức lao ra ngoài.", note:"Gần như đồng thời." },
  { pattern:"〜が早いか (がはやいか)", meaning:"Vừa mới ~ thì đã ~", use:"V-ru / V-ta + が早いか", example:"彼は交番を見るが早いか、逃げ出した。", exVn:"Anh ta vừa nhìn thấy bốt cảnh sát là đã bỏ chạy ngay.", note:"Tính khẩn trương liên tiếp." },
  { pattern:"〜そばから", meaning:"Vừa ~ xong thì lại (lặp đi lặp lại)", use:"V-ru / V-ta + そばから", example:"掃除をするそばから子供が散らかす。", exVn:"Vừa mới dọn dẹp xong thì bọn trẻ lại làm bẩn.", note:"Hành động lặp đi lặp lại uổng công." },
  { pattern:"〜を皮切りに (をかわきりに)", meaning:"Khởi đầu bằng ~", use:"N + を皮切りに", example:"東京公演を皮切りに全国ツアーが始まる。", exVn:"Khởi đầu bằng đêm diễn ở Tokyo, tour diễn toàn quốc sẽ bắt đầu.", note:"Mở màn chuỗi sự kiện." },
  { pattern:"〜に至るまで (にいたるまで)", meaning:"Cho đến tận ~ / Ngay cả ~", use:"N + に至るまで", example:"服装から髪型に至るまで厳しく指導される。", exVn:"Từ trang phục cho đến tận kiểu tóc đều bị góp ý gay gắt.", note:"Chi tiết nhỏ nhất." },
  { pattern:"〜をもって", meaning:"Bằng ~ / Tính đến thời điểm ~", use:"N + を通して", example:"本日をもって閉店いたします。", exVn:"Tính đến hôm nay chúng tôi xin đóng cửa.", note:"Trang trọng trong tuyên bố." },
  { pattern:"〜をばねに", meaning:"Lấy ~ làm động lực", use:"N + をばねに", example:"失敗をばねにして成功を掴んだ。", exVn:"Lấy thất bại làm động lực để nắm lấy thành công.", note:"Vượt khó bật lên." },
  { pattern:"〜をよそに", meaning:"Mặc kệ ~ / Bất chấp ~", use:"N + をよそに", example:"親の心配をよそに、彼は好き勝手に生きている。", exVn:"Mặc kệ sự lo lắng của cha mẹ, anh ấy sống theo ý mình.", note:"Không màng dư luận." },
  { pattern:"〜んがため (に)", meaning:"Với mục đích quyết tâm để ~", use:"V-nai (bỏ nai) + んがため", example:"夢を叶えんがために上京した。", exVn:"Với quyết tâm thực hiện ước mơ tôi đã lên Tokyo.", note:"Quyết tâm cao độ." },
  { pattern:"〜まじき", meaning:"Không thể chấp nhận / Không được phép ~", use:"V-ru + まじき", example:"プロとしてあるまじき行為だ。", exVn:"Đó là hành vi không thể chấp nhận được đối với một chuyên gia.", note:"Phê phán phẩm chất." },
  { pattern:"〜たるもの", meaning:"Đã là ~ (thì phải có tư cách)", use:"N + たるもの", example:"指導者たるものは常に忍耐強くなければならない。", exVn:"Đã là người lãnh đạo thì phải luôn kiên nhẫn.", note:"Yêu cầu phẩm chất." },
  { pattern:"〜にあって", meaning:"Chính vì ở trong hoàn cảnh ~", use:"N + にあって", example:"逆境にあっても希望を捨てない。", exVn:"Dù ở trong nghịch cảnh vẫn không từ bỏ hy vọng.", note:"Tình thế đặc biệt." },
  { pattern:"〜だに", meaning:"Chỉ cần ~ thôi cũng đã", use:"V-ru / N + だに", example:"想像するだに恐ろしい。", exVn:"Chỉ cần tưởng tượng thôi cũng đã thấy đáng sợ.", note:"Dùng với tưởng tượng/nghe thấy." },
  { pattern:"〜たりとも", meaning:"Dù chỉ ~ (cũng không được lãng phí)", use:"Lượng từ 1 + たりとも", example:"一秒たりとも無駄にできない。", exVn:"Dù chỉ một giây cũng không thể lãng phí.", note:"Nhấn mạnh mức 1 tối thiểu." },
  { pattern:"〜極まる / 極まりない (きわまる)", meaning:"Cực kỳ ~ (tiêu cực)", use:"Adj-na (bỏ na) + 極まる", example:"彼の態度は失礼極まりない。", exVn:"Thái độ của anh ta hết sức thất lễ.", note:"Mức độ cực đoan." },
  { pattern:"〜の極み (のきわみ)", meaning:"Đỉnh cao của ~", use:"N + の極み", example:"痛恨の極みだ。", exVn:"Đó là niềm đau đớn đến đỉnh điểm.", note:"Tột cùng cảm xúc." },
  { pattern:"〜至り (のいたり)", meaning:"Vô cùng ~", use:"N + の至り", example:"光栄の至りでございます。", exVn:"Thật là vô cùng vinh hạnh cho tôi.", note:"Cảm xúc tột cùng trang trọng." },
  { pattern:"〜てやまない", meaning:"Khôn nguôi ~ / Luôn cầu chúc ~", use:"V-te + やまない", example:"皆様のご成功を祈ってやみません。", exVn:"Tôi luôn cầu chúc sự thành công cho tất cả quý vị.", note:"Cảm xúc kéo dài." },
  { pattern:"〜にたえない", meaning:"Không thể chịu nổi / Rất ~", use:"N / V-ru + にたえない", example:"聞くにたえない暴言だ。", exVn:"Đó là những lời bạo lực ngôn từ không thể chịu nổi.", note:"Chịu đựng không nổi." },
  { pattern:"〜を禁じ得ない (をきんじえない)", meaning:"Không thể kìm nản được ~", use:"N (cảm xúc) + を禁じ得ない", example:"その ニュース を聞いて涙を禁じ得なかった。", exVn:"Nghe tin đó tôi không thể kìm được nước mắt.", note:"Cảm xúc bùng phát tự nhiên." },
  { pattern:"〜を踏まえて (をふまえて)", meaning:"Dựa trên / Căn cứ vào ~", use:"N + を踏まえて", example:"前回の反省を踏まえて計画を立てる。", exVn:"Căn cứ vào sự rút kinh nghiệm lần trước để lập kế hoạch.", note:"Trang trọng trong công việc." }
];

const KANJI_N5 = [
  {
    "k": "日",
    "on": "ニチ・ジツ",
    "kun": "ひ・か",
    "vn": "Mặt trời, Ngày",
    "strokes": 4,
    "rad": "日",
    "ex": [
      {
        "jp": "まいにち",
        "vn": "mỗi ngày"
      },
      {
        "jp": "にちようび",
        "vn": "Chủ nhật"
      }
    ],
    "hint": "Hình vuông có vạch ngang — cửa sổ nhìn mặt trời"
  },
  {
    "k": "月",
    "on": "ゲツ・ガツ",
    "kun": "つき",
    "vn": "Mặt trăng, Tháng",
    "strokes": 4,
    "rad": "月",
    "ex": [
      {
        "jp": "まいつき",
        "vn": "mỗi tháng"
      },
      {
        "jp": "げつようび",
        "vn": "Thứ Hai"
      }
    ],
    "hint": "Hình lưỡi liềm — trăng khuyết"
  },
  {
    "k": "火",
    "on": "カ",
    "kun": "ひ",
    "vn": "Lửa",
    "strokes": 4,
    "rad": "火",
    "ex": [
      {
        "jp": "かようび",
        "vn": "Thứ Ba"
      },
      {
        "jp": "かじ",
        "vn": "đám cháy"
      }
    ],
    "hint": "Người dang tay — ngọn lửa bùng lên"
  },
  {
    "k": "水",
    "on": "スイ",
    "kun": "みず",
    "vn": "Nước",
    "strokes": 4,
    "rad": "水",
    "ex": [
      {
        "jp": "すいようび",
        "vn": "Thứ Tư"
      },
      {
        "jp": "みず",
        "vn": "nước"
      }
    ],
    "hint": "Dòng nước chảy — nét giữa và hai nhánh"
  },
  {
    "k": "木",
    "on": "モク・ボク",
    "kun": "き",
    "vn": "Cây gỗ",
    "strokes": 4,
    "rad": "木",
    "ex": [
      {
        "jp": "もくようび",
        "vn": "Thứ Năm"
      },
      {
        "jp": "き",
        "vn": "cây"
      }
    ],
    "hint": "Cây có thân, cành trên và rễ dưới"
  },
  {
    "k": "金",
    "on": "キン・コン",
    "kun": "かね",
    "vn": "Vàng, Tiền",
    "strokes": 8,
    "rad": "金",
    "ex": [
      {
        "jp": "きんようび",
        "vn": "Thứ Sáu"
      },
      {
        "jp": "おかね",
        "vn": "tiền"
      }
    ],
    "hint": "Mái nhà + hai điểm — kho vàng trong đất"
  },
  {
    "k": "土",
    "on": "ド・ト",
    "kun": "つち",
    "vn": "Đất",
    "strokes": 3,
    "rad": "土",
    "ex": [
      {
        "jp": "どようび",
        "vn": "Thứ Bảy"
      },
      {
        "jp": "つち",
        "vn": "đất"
      }
    ],
    "hint": "Chữ thập có gạch ngang ở chân — đất bên dưới"
  },
  {
    "k": "山",
    "on": "サン",
    "kun": "やま",
    "vn": "Núi",
    "strokes": 3,
    "rad": "山",
    "ex": [
      {
        "jp": "ふじさん",
        "vn": "núi Phú Sĩ"
      },
      {
        "jp": "やま",
        "vn": "núi"
      }
    ],
    "hint": "Ba đỉnh nhọn — hình núi nhìn từ xa"
  },
  {
    "k": "川",
    "on": "セン",
    "kun": "かわ",
    "vn": "Sông",
    "strokes": 3,
    "rad": "川",
    "ex": [
      {
        "jp": "かわ",
        "vn": "sông"
      },
      {
        "jp": "おがわ",
        "vn": "suối nhỏ"
      }
    ],
    "hint": "Ba đường thẳng đứng — dòng sông chảy xuống"
  },
  {
    "k": "田",
    "on": "デン",
    "kun": "た",
    "vn": "Ruộng lúa",
    "strokes": 5,
    "rad": "田",
    "ex": [
      {
        "jp": "た",
        "vn": "ruộng"
      },
      {
        "jp": "たなか",
        "vn": "Tanaka"
      }
    ],
    "hint": "Hình vuông chia 4 ô — ruộng lúa nhìn từ trên"
  },
  {
    "k": "人",
    "on": "ジン・ニン",
    "kun": "ひと",
    "vn": "Người",
    "strokes": 2,
    "rad": "人",
    "ex": [
      {
        "jp": "にほんじん",
        "vn": "người Nhật"
      },
      {
        "jp": "ひとり",
        "vn": "một mình"
      }
    ],
    "hint": "Hai nét — hai chân người đứng"
  },
  {
    "k": "口",
    "on": "コウ・ク",
    "kun": "くち",
    "vn": "Miệng, Cửa",
    "strokes": 3,
    "rad": "口",
    "ex": [
      {
        "jp": "くち",
        "vn": "miệng"
      },
      {
        "jp": "いりぐち",
        "vn": "lối vào"
      }
    ],
    "hint": "Hình vuông đơn giản — miệng há ra"
  },
  {
    "k": "手",
    "on": "シュ",
    "kun": "て",
    "vn": "Tay",
    "strokes": 4,
    "rad": "手",
    "ex": [
      {
        "jp": "て",
        "vn": "bàn tay"
      },
      {
        "jp": "てがみ",
        "vn": "thư tay"
      }
    ],
    "hint": "Ba nét ngang và nét dọc — ngón tay và cổ tay"
  },
  {
    "k": "目",
    "on": "モク・ボク",
    "kun": "め",
    "vn": "Mắt",
    "strokes": 5,
    "rad": "目",
    "ex": [
      {
        "jp": "め",
        "vn": "mắt"
      },
      {
        "jp": "もくひょう",
        "vn": "mục tiêu"
      }
    ],
    "hint": "Hình mắt nhìn ngang — ô vuông dài với 2 vạch ngang"
  },
  {
    "k": "耳",
    "on": "ジ",
    "kun": "みみ",
    "vn": "Tai",
    "strokes": 6,
    "rad": "耳",
    "ex": [
      {
        "jp": "みみ",
        "vn": "tai"
      },
      {
        "jp": "みみがいたい",
        "vn": "đau tai"
      }
    ],
    "hint": "Hình dạng lỗ tai — hộp trên, phần dưới mở"
  },
  {
    "k": "足",
    "on": "ソク",
    "kun": "あし",
    "vn": "Chân",
    "strokes": 7,
    "rad": "足",
    "ex": [
      {
        "jp": "あし",
        "vn": "chân"
      },
      {
        "jp": "くつした",
        "vn": "vớ"
      }
    ],
    "hint": "口 phía trên, bước đi phía dưới"
  },
  {
    "k": "力",
    "on": "リョク・リキ",
    "kun": "ちから",
    "vn": "Sức mạnh",
    "strokes": 2,
    "rad": "力",
    "ex": [
      {
        "jp": "ちから",
        "vn": "sức mạnh"
      },
      {
        "jp": "きょうりょく",
        "vn": "hợp tác"
      }
    ],
    "hint": "Cánh tay gồng cơ — nét cong và nét móc"
  },
  {
    "k": "大",
    "on": "ダイ・タイ",
    "kun": "おお",
    "vn": "To, Lớn",
    "strokes": 3,
    "rad": "大",
    "ex": [
      {
        "jp": "おおきい",
        "vn": "to lớn"
      },
      {
        "jp": "だいがく",
        "vn": "đại học"
      }
    ],
    "hint": "Người dang tay rộng — to như người dang tay"
  },
  {
    "k": "小",
    "on": "ショウ",
    "kun": "ちい・こ・お",
    "vn": "Nhỏ, Bé",
    "strokes": 3,
    "rad": "小",
    "ex": [
      {
        "jp": "ちいさい",
        "vn": "nhỏ bé"
      },
      {
        "jp": "しょうがく",
        "vn": "tiểu học"
      }
    ],
    "hint": "Nét dọc ở giữa, hai chấm hai bên — nhỏ như hạt bụi"
  },
  {
    "k": "中",
    "on": "チュウ",
    "kun": "なか",
    "vn": "Trong, Giữa",
    "strokes": 4,
    "rad": "中",
    "ex": [
      {
        "jp": "なか",
        "vn": "bên trong"
      },
      {
        "jp": "ちゅうがく",
        "vn": "THCS"
      }
    ],
    "hint": "Mũi tên xuyên ô vuông — ngay chính giữa"
  },
  {
    "k": "上",
    "on": "ジョウ",
    "kun": "うえ・あ",
    "vn": "Trên, Lên",
    "strokes": 3,
    "rad": "二",
    "ex": [
      {
        "jp": "うえ",
        "vn": "phía trên"
      },
      {
        "jp": "あがる",
        "vn": "đi lên"
      }
    ],
    "hint": "Gạch ngắn ở phía trên vạch dài — phía trên"
  },
  {
    "k": "下",
    "on": "カ・ゲ",
    "kun": "した・さ・くだ",
    "vn": "Dưới, Xuống",
    "strokes": 3,
    "rad": "一",
    "ex": [
      {
        "jp": "した",
        "vn": "phía dưới"
      },
      {
        "jp": "さがる",
        "vn": "đi xuống"
      }
    ],
    "hint": "Điểm ở phía dưới vạch dài — chỉ xuống dưới"
  },
  {
    "k": "左",
    "on": "サ",
    "kun": "ひだり",
    "vn": "Trái",
    "strokes": 5,
    "rad": "工",
    "ex": [
      {
        "jp": "ひだり",
        "vn": "bên trái"
      },
      {
        "jp": "ひだりて",
        "vn": "tay trái"
      }
    ],
    "hint": "Tay cầm thước — bên trái hay cầm công cụ"
  },
  {
    "k": "右",
    "on": "ウ・ユウ",
    "kun": "みぎ",
    "vn": "Phải",
    "strokes": 5,
    "rad": "口",
    "ex": [
      {
        "jp": "みぎ",
        "vn": "bên phải"
      },
      {
        "jp": "みぎて",
        "vn": "tay phải"
      }
    ],
    "hint": "Tay + miệng — tay phải cầm đũa ăn cơm"
  },
  {
    "k": "本",
    "on": "ホン",
    "kun": "もと",
    "vn": "Gốc, Sách, Chính",
    "strokes": 5,
    "rad": "木",
    "ex": [
      {
        "jp": "ほん",
        "vn": "cuốn sách"
      },
      {
        "jp": "にほん",
        "vn": "Nhật Bản"
      }
    ],
    "hint": "Cây + gạch dưới — gốc rễ của cây"
  },
  {
    "k": "年",
    "on": "ネン",
    "kun": "とし",
    "vn": "Năm",
    "strokes": 6,
    "rad": "干",
    "ex": [
      {
        "jp": "ことし",
        "vn": "năm nay"
      },
      {
        "jp": "らいねん",
        "vn": "năm sau"
      }
    ],
    "hint": "Lúa chín thu hoạch mỗi năm — hình bông lúa"
  },
  {
    "k": "円",
    "on": "エン",
    "kun": "まる",
    "vn": "Yên (tiền), Tròn",
    "strokes": 4,
    "rad": "冂",
    "ex": [
      {
        "jp": "えん",
        "vn": "đồng yên"
      },
      {
        "jp": "まるい",
        "vn": "tròn"
      }
    ],
    "hint": "Khung tròn — đồng xu tròn"
  },
  {
    "k": "百",
    "on": "ヒャク",
    "kun": "",
    "vn": "Trăm",
    "strokes": 6,
    "rad": "白",
    "ex": [
      {
        "jp": "ひゃく",
        "vn": "một trăm"
      },
      {
        "jp": "さんびゃく",
        "vn": "ba trăm"
      }
    ],
    "hint": "Một 一 trên trắng 白 — một trăm"
  },
  {
    "k": "千",
    "on": "セン",
    "kun": "ち",
    "vn": "Nghìn",
    "strokes": 3,
    "rad": "十",
    "ex": [
      {
        "jp": "せん",
        "vn": "một nghìn"
      },
      {
        "jp": "にせん",
        "vn": "hai nghìn"
      }
    ],
    "hint": "Người đứng trên vạch — một nghìn người"
  },
  {
    "k": "万",
    "on": "マン・バン",
    "kun": "",
    "vn": "Mười nghìn, Vạn",
    "strokes": 3,
    "rad": "一",
    "ex": [
      {
        "jp": "いちまん",
        "vn": "mười nghìn"
      },
      {
        "jp": "まんが",
        "vn": "truyện tranh"
      }
    ],
    "hint": "Bọ cạp — số lượng vô cùng nhiều"
  },
  {
    "k": "学",
    "on": "ガク",
    "kun": "まな",
    "vn": "Học",
    "strokes": 8,
    "rad": "子",
    "ex": [
      {
        "jp": "がっこう",
        "vn": "trường học"
      },
      {
        "jp": "がくせい",
        "vn": "học sinh"
      }
    ],
    "hint": "Tay dạy + trẻ con 子 — dạy trẻ học"
  },
  {
    "k": "校",
    "on": "コウ",
    "kun": "",
    "vn": "Trường học",
    "strokes": 10,
    "rad": "木",
    "ex": [
      {
        "jp": "がっこう",
        "vn": "trường học"
      },
      {
        "jp": "こうちょう",
        "vn": "hiệu trưởng"
      }
    ],
    "hint": "Cây + giao chéo — cây đan chéo như rào trường"
  },
  {
    "k": "先",
    "on": "セン",
    "kun": "さき",
    "vn": "Trước, Đầu tiên",
    "strokes": 6,
    "rad": "儿",
    "ex": [
      {
        "jp": "せんせい",
        "vn": "giáo viên"
      },
      {
        "jp": "さき",
        "vn": "phía trước"
      }
    ],
    "hint": "Người đi trước — chân dài bước đi đầu tiên"
  },
  {
    "k": "生",
    "on": "セイ・ショウ",
    "kun": "い・う・は・なま",
    "vn": "Sống, Sinh ra",
    "strokes": 5,
    "rad": "生",
    "ex": [
      {
        "jp": "がくせい",
        "vn": "học sinh"
      },
      {
        "jp": "たんじょうび",
        "vn": "sinh nhật"
      }
    ],
    "hint": "Mầm cây mọc lên từ đất — sự sống"
  },
  {
    "k": "白",
    "on": "ハク・ビャク",
    "kun": "しろ",
    "vn": "Trắng",
    "strokes": 5,
    "rad": "白",
    "ex": [
      {
        "jp": "しろい",
        "vn": "màu trắng"
      },
      {
        "jp": "はくし",
        "vn": "tiến sĩ"
      }
    ],
    "hint": "Mặt trời 日 mọc — ánh sáng trắng ban mai"
  },
  {
    "k": "赤",
    "on": "セキ・シャク",
    "kun": "あか",
    "vn": "Đỏ",
    "strokes": 7,
    "rad": "赤",
    "ex": [
      {
        "jp": "あかい",
        "vn": "màu đỏ"
      },
      {
        "jp": "あかちゃん",
        "vn": "em bé"
      }
    ],
    "hint": "Đất + lửa — màu lửa và đất nung đỏ"
  },
  {
    "k": "青",
    "on": "セイ・ショウ",
    "kun": "あお",
    "vn": "Xanh lam/lục",
    "strokes": 8,
    "rad": "青",
    "ex": [
      {
        "jp": "あおい",
        "vn": "màu xanh"
      },
      {
        "jp": "せいねん",
        "vn": "thanh niên"
      }
    ],
    "hint": "Mọc lên + mặt trăng — cây xanh trong ánh trăng"
  },
  {
    "k": "女",
    "on": "ジョ・ニョ・ニョウ",
    "kun": "おんな",
    "vn": "Phụ nữ, Nữ",
    "strokes": 3,
    "rad": "女",
    "ex": [
      {
        "jp": "おんな",
        "vn": "phụ nữ"
      },
      {
        "jp": "じょせい",
        "vn": "nữ giới"
      }
    ],
    "hint": "Người phụ nữ ngồi khoanh tay — dáng ngồi nữ tính"
  },
  {
    "k": "男",
    "on": "ダン・ナン",
    "kun": "おとこ",
    "vn": "Đàn ông, Nam",
    "strokes": 7,
    "rad": "男",
    "ex": [
      {
        "jp": "おとこ",
        "vn": "đàn ông"
      },
      {
        "jp": "だんせい",
        "vn": "nam giới"
      }
    ],
    "hint": "Ruộng 田 + sức mạnh 力 — người đàn ông cày ruộng"
  },
  {
    "k": "子",
    "on": "シ・ス",
    "kun": "こ",
    "vn": "Con, Trẻ em",
    "strokes": 3,
    "rad": "子",
    "ex": [
      {
        "jp": "こども",
        "vn": "trẻ em"
      },
      {
        "jp": "おとこのこ",
        "vn": "bé trai"
      }
    ],
    "hint": "Đứa bé với đầu to và hai tay vẫy — em bé"
  },
  {
    "k": "父",
    "on": "フ",
    "kun": "ちち",
    "vn": "Cha, Bố",
    "strokes": 4,
    "rad": "父",
    "ex": [
      {
        "jp": "ちち",
        "vn": "cha"
      },
      {
        "jp": "おとうさん",
        "vn": "bố"
      }
    ],
    "hint": "Tay cầm gậy — người đàn ông (cha) cầm roi"
  },
  {
    "k": "母",
    "on": "ボ",
    "kun": "はは",
    "vn": "Mẹ",
    "strokes": 5,
    "rad": "母",
    "ex": [
      {
        "jp": "はは",
        "vn": "mẹ"
      },
      {
        "jp": "おかあさん",
        "vn": "mẹ (lịch sự)"
      }
    ],
    "hint": "Người phụ nữ với hai chấm — hai vú mẹ"
  },
  {
    "k": "友",
    "on": "ユウ",
    "kun": "とも",
    "vn": "Bạn bè",
    "strokes": 4,
    "rad": "又",
    "ex": [
      {
        "jp": "ともだち",
        "vn": "bạn bè"
      },
      {
        "jp": "しんゆう",
        "vn": "bạn thân"
      }
    ],
    "hint": "Tay + bàn tay — hai bàn tay bắt nhau"
  },
  {
    "k": "何",
    "on": "カ",
    "kun": "なに・なん",
    "vn": "Gì, Bao nhiêu",
    "strokes": 7,
    "rad": "亻",
    "ex": [
      {
        "jp": "なに",
        "vn": "cái gì"
      },
      {
        "jp": "なんにん",
        "vn": "bao nhiêu người"
      }
    ],
    "hint": "Người + mang vật nặng — người đó mang gì vậy?"
  },
  {
    "k": "今",
    "on": "コン・キン",
    "kun": "いま",
    "vn": "Bây giờ, Hiện tại",
    "strokes": 4,
    "rad": "人",
    "ex": [
      {
        "jp": "いま",
        "vn": "bây giờ"
      },
      {
        "jp": "こんにちは",
        "vn": "xin chào"
      }
    ],
    "hint": "Mái nhà + gì đó bên dưới — người đang ở đây ngay lúc này"
  },
  {
    "k": "来",
    "on": "ライ",
    "kun": "く・き",
    "vn": "Đến, Lại",
    "strokes": 7,
    "rad": "木",
    "ex": [
      {
        "jp": "くる",
        "vn": "đến"
      },
      {
        "jp": "らいねん",
        "vn": "năm sau"
      }
    ],
    "hint": "Cây lúa chín — người trở về mùa gặt"
  },
  {
    "k": "行",
    "on": "コウ・ギョウ",
    "kun": "い・ゆ・おこな",
    "vn": "Đi, Thực hiện",
    "strokes": 6,
    "rad": "行",
    "ex": [
      {
        "jp": "いく",
        "vn": "đi"
      },
      {
        "jp": "りょこう",
        "vn": "du lịch"
      }
    ],
    "hint": "Ngã tư đường — bước đi ra ngã tư"
  },
  {
    "k": "見",
    "on": "ケン",
    "kun": "み",
    "vn": "Nhìn, Thấy",
    "strokes": 7,
    "rad": "見",
    "ex": [
      {
        "jp": "みる",
        "vn": "nhìn"
      },
      {
        "jp": "けんがく",
        "vn": "tham quan"
      }
    ],
    "hint": "Mắt 目 + chân người — đứng nhìn"
  },
  {
    "k": "聞",
    "on": "ブン・モン",
    "kun": "き",
    "vn": "Nghe, Hỏi",
    "strokes": 14,
    "rad": "耳",
    "ex": [
      {
        "jp": "きく",
        "vn": "nghe/hỏi"
      },
      {
        "jp": "しんぶん",
        "vn": "báo"
      }
    ],
    "hint": "Tai 耳 trong cổng 門 — nghe qua cánh cửa"
  },
  {
    "k": "言",
    "on": "ゲン・ゴン",
    "kun": "い・こと",
    "vn": "Nói, Lời nói",
    "strokes": 7,
    "rad": "言",
    "ex": [
      {
        "jp": "いう",
        "vn": "nói"
      },
      {
        "jp": "ことば",
        "vn": "ngôn ngữ"
      }
    ],
    "hint": "Ba vạch âm thanh + miệng — miệng phát ra âm thanh"
  },
  {
    "k": "食",
    "on": "ショク",
    "kun": "た・く",
    "vn": "Ăn, Thức ăn",
    "strokes": 9,
    "rad": "食",
    "ex": [
      {
        "jp": "たべる",
        "vn": "ăn"
      },
      {
        "jp": "しょくじ",
        "vn": "bữa ăn"
      }
    ],
    "hint": "Mái nhà + người ăn — người ngồi trong nhà ăn cơm"
  },
  {
    "k": "飲",
    "on": "イン",
    "kun": "の",
    "vn": "Uống",
    "strokes": 12,
    "rad": "食",
    "ex": [
      {
        "jp": "のむ",
        "vn": "uống"
      },
      {
        "jp": "いんりょう",
        "vn": "đồ uống"
      }
    ],
    "hint": "Thức ăn + há miệng — mở miệng uống"
  },
  {
    "k": "書",
    "on": "ショ",
    "kun": "か",
    "vn": "Viết",
    "strokes": 10,
    "rad": "日",
    "ex": [
      {
        "jp": "かく",
        "vn": "viết"
      },
      {
        "jp": "としょかん",
        "vn": "thư viện"
      }
    ],
    "hint": "Bút lông đang viết — nét bút trên giấy"
  },
  {
    "k": "読",
    "on": "ドク・トク",
    "kun": "よ",
    "vn": "Đọc",
    "strokes": 14,
    "rad": "言",
    "ex": [
      {
        "jp": "よむ",
        "vn": "đọc"
      },
      {
        "jp": "どくしょ",
        "vn": "đọc sách"
      }
    ],
    "hint": "Lời nói + bán — mua lời để đọc"
  },
  {
    "k": "話",
    "on": "ワ",
    "kun": "はな",
    "vn": "Nói chuyện, Câu chuyện",
    "strokes": 13,
    "rad": "言",
    "ex": [
      {
        "jp": "はなす",
        "vn": "nói chuyện"
      },
      {
        "jp": "でんわ",
        "vn": "điện thoại"
      }
    ],
    "hint": "Lời + lưỡi — lưỡi tạo ra lời nói"
  },
  {
    "k": "買",
    "on": "バイ",
    "kun": "か",
    "vn": "Mua",
    "strokes": 12,
    "rad": "貝",
    "ex": [
      {
        "jp": "かう",
        "vn": "mua"
      },
      {
        "jp": "こうばい",
        "vn": "mua sắm"
      }
    ],
    "hint": "Lưới + tiền 貝 — dùng tiền mua đồ"
  },
  {
    "k": "売",
    "on": "バイ",
    "kun": "う",
    "vn": "Bán",
    "strokes": 7,
    "rad": "士",
    "ex": [
      {
        "jp": "うる",
        "vn": "bán"
      },
      {
        "jp": "はんばい",
        "vn": "bán hàng"
      }
    ],
    "hint": "Sĩ + mua (rút gọn) — người bán hàng"
  },
  {
    "k": "出",
    "on": "シュツ・スイ",
    "kun": "だ・で",
    "vn": "Ra, Xuất",
    "strokes": 5,
    "rad": "凵",
    "ex": [
      {
        "jp": "でる",
        "vn": "ra ngoài"
      },
      {
        "jp": "しゅっぱつ",
        "vn": "khởi hành"
      }
    ],
    "hint": "Núi mọc lên từ lòng đất — đi ra ngoài"
  },
  {
    "k": "入",
    "on": "ニュウ",
    "kun": "はい・い",
    "vn": "Vào, Nhập",
    "strokes": 2,
    "rad": "入",
    "ex": [
      {
        "jp": "はいる",
        "vn": "vào"
      },
      {
        "jp": "にゅうがく",
        "vn": "nhập học"
      }
    ],
    "hint": "Hình chữ V ngược — bước vào bên trong"
  },
  {
    "k": "国",
    "on": "コク",
    "kun": "くに",
    "vn": "Quốc gia, Nước",
    "strokes": 8,
    "rad": "囗",
    "ex": [
      {
        "jp": "くに",
        "vn": "đất nước"
      },
      {
        "jp": "がいこく",
        "vn": "nước ngoài"
      }
    ],
    "hint": "Viên ngọc quý trong biên giới — lãnh thổ quốc gia"
  },
  {
    "k": "高",
    "on": "コウ",
    "kun": "たか",
    "vn": "Cao, Đắt",
    "strokes": 10,
    "rad": "高",
    "ex": [
      {
        "jp": "たかい",
        "vn": "cao/đắt"
      },
      {
        "jp": "こうこう",
        "vn": "trường THPT"
      }
    ],
    "hint": "Tòa nhà cao tầng — hình nhà nhiều tầng"
  },
  {
    "k": "安",
    "on": "アン",
    "kun": "やす",
    "vn": "Bình yên, Rẻ",
    "strokes": 6,
    "rad": "宀",
    "ex": [
      {
        "jp": "やすい",
        "vn": "rẻ/an toàn"
      },
      {
        "jp": "あんしん",
        "vn": "yên tâm"
      }
    ],
    "hint": "Mái nhà + phụ nữ — phụ nữ trong nhà = bình an"
  },
  {
    "k": "長",
    "on": "チョウ",
    "kun": "なが",
    "vn": "Dài, Lâu, Trưởng",
    "strokes": 8,
    "rad": "長",
    "ex": [
      {
        "jp": "ながい",
        "vn": "dài"
      },
      {
        "jp": "ちょうじかん",
        "vn": "thời gian dài"
      }
    ],
    "hint": "Người lớn tuổi với mái tóc dài — trưởng lão"
  },
  {
    "k": "新",
    "on": "シン",
    "kun": "あたら・にい",
    "vn": "Mới",
    "strokes": 13,
    "rad": "斤",
    "ex": [
      {
        "jp": "あたらしい",
        "vn": "mới"
      },
      {
        "jp": "しんかんせん",
        "vn": "tàu cao tốc"
      }
    ],
    "hint": "Cây + rìu + màu tươi — gỗ mới chặt còn tươi"
  },
  {
    "k": "古",
    "on": "コ",
    "kun": "ふる",
    "vn": "Cũ, Cổ",
    "strokes": 5,
    "rad": "口",
    "ex": [
      {
        "jp": "ふるい",
        "vn": "cũ"
      },
      {
        "jp": "こだい",
        "vn": "cổ đại"
      }
    ],
    "hint": "Mười 十 + miệng 口 — mười miệng truyền qua nhiều đời"
  },
  {
    "k": "花",
    "on": "カ・ケ",
    "kun": "はな",
    "vn": "Hoa",
    "strokes": 7,
    "rad": "艹",
    "ex": [
      {
        "jp": "はな",
        "vn": "hoa"
      },
      {
        "jp": "はなや",
        "vn": "tiệm hoa"
      }
    ],
    "hint": "Cỏ 艹 + biến hóa 化 — thứ cỏ biến hóa thành hoa"
  },
  {
    "k": "雨",
    "on": "ウ",
    "kun": "あめ",
    "vn": "Mưa",
    "strokes": 8,
    "rad": "雨",
    "ex": [
      {
        "jp": "あめ",
        "vn": "mưa"
      },
      {
        "jp": "あした",
        "vn": "ngày mai"
      }
    ],
    "hint": "Mái nhà + 4 giọt nước — mưa rơi từ mây"
  },
  {
    "k": "天",
    "on": "テン",
    "kun": "あめ・あま",
    "vn": "Trời, Thiên",
    "strokes": 4,
    "rad": "大",
    "ex": [
      {
        "jp": "てんき",
        "vn": "thời tiết"
      },
      {
        "jp": "てんごく",
        "vn": "thiên đường"
      }
    ],
    "hint": "Người dang tay + gạch trên đầu — bầu trời trên đầu người"
  },
  {
    "k": "気",
    "on": "キ・ケ",
    "kun": "",
    "vn": "Khí, Tâm trạng, Hơi",
    "strokes": 6,
    "rad": "气",
    "ex": [
      {
        "jp": "てんき",
        "vn": "thời tiết"
      },
      {
        "jp": "げんき",
        "vn": "khỏe mạnh"
      }
    ],
    "hint": "Hơi nước bay lên — khí lực, năng lượng"
  },
  {
    "k": "電",
    "on": "デン",
    "kun": "",
    "vn": "Điện",
    "strokes": 13,
    "rad": "雨",
    "ex": [
      {
        "jp": "でんしゃ",
        "vn": "tàu điện"
      },
      {
        "jp": "でんわ",
        "vn": "điện thoại"
      }
    ],
    "hint": "Mưa + tia sét — sét điện từ cơn mưa"
  },
  {
    "k": "車",
    "on": "シャ",
    "kun": "くるま",
    "vn": "Xe, Bánh xe",
    "strokes": 7,
    "rad": "車",
    "ex": [
      {
        "jp": "くるま",
        "vn": "xe hơi"
      },
      {
        "jp": "でんしゃ",
        "vn": "tàu điện"
      }
    ],
    "hint": "Bánh xe nhìn từ trên — trục và hai bánh"
  },
  {
    "k": "道",
    "on": "ドウ・トウ",
    "kun": "みち",
    "vn": "Đường, Đạo",
    "strokes": 12,
    "rad": "辶",
    "ex": [
      {
        "jp": "みち",
        "vn": "con đường"
      },
      {
        "jp": "どうろ",
        "vn": "đường giao thông"
      }
    ],
    "hint": "Đi 辶 + đầu 首 — đầu dẫn đường đi"
  },
  {
    "k": "半",
    "on": "ハン",
    "kun": "なか",
    "vn": "Nửa",
    "strokes": 5,
    "rad": "十",
    "ex": [
      {
        "jp": "はんぶん",
        "vn": "một nửa"
      },
      {
        "jp": "さんじはん",
        "vn": "3 giờ rưỡi"
      }
    ],
    "hint": "Bò bị chia đôi bằng dao — nửa"
  },
  {
    "k": "毎",
    "on": "マイ",
    "kun": "",
    "vn": "Mỗi",
    "strokes": 6,
    "rad": "毋",
    "ex": [
      {
        "jp": "まいにち",
        "vn": "mỗi ngày"
      },
      {
        "jp": "まいあさ",
        "vn": "mỗi buổi sáng"
      }
    ],
    "hint": "Mẹ 母 + nét thêm — mẹ cần chăm sóc mỗi ngày"
  },
  {
    "k": "週",
    "on": "シュウ",
    "kun": "",
    "vn": "Tuần",
    "strokes": 11,
    "rad": "辶",
    "ex": [
      {
        "jp": "こんしゅう",
        "vn": "tuần này"
      },
      {
        "jp": "らいしゅう",
        "vn": "tuần sau"
      }
    ],
    "hint": "Vòng quanh 周 + đi 辶 — đi vòng quanh một tuần"
  },
  {
    "k": "時",
    "on": "ジ",
    "kun": "とき",
    "vn": "Giờ, Thời gian",
    "strokes": 10,
    "rad": "日",
    "ex": [
      {
        "jp": "いまなんじ",
        "vn": "bây giờ mấy giờ"
      },
      {
        "jp": "じかん",
        "vn": "thời gian"
      }
    ],
    "hint": "Mặt trời 日 + chùa 寺 — chuông chùa báo giờ"
  },
  {
    "k": "間",
    "on": "カン・ケン",
    "kun": "あいだ・ま",
    "vn": "Khoảng, Giữa, Thời gian",
    "strokes": 12,
    "rad": "門",
    "ex": [
      {
        "jp": "じかん",
        "vn": "thời gian"
      },
      {
        "jp": "あいだ",
        "vn": "khoảng giữa"
      }
    ],
    "hint": "Cổng 門 + mặt trời 日 — ánh sáng lọt qua khe cửa"
  },
  {
    "k": "前",
    "on": "ゼン",
    "kun": "まえ",
    "vn": "Trước, Phía trước",
    "strokes": 9,
    "rad": "刀",
    "ex": [
      {
        "jp": "まえ",
        "vn": "phía trước"
      },
      {
        "jp": "ごぜん",
        "vn": "buổi sáng"
      }
    ],
    "hint": "Thuyền tiến về phía trước + dao — cắt tiến lên phía trước"
  },
  {
    "k": "後",
    "on": "ゴ・コウ",
    "kun": "あと・うしろ",
    "vn": "Sau, Phía sau",
    "strokes": 9,
    "rad": "彳",
    "ex": [
      {
        "jp": "あとで",
        "vn": "sau đó"
      },
      {
        "jp": "ごご",
        "vn": "buổi chiều"
      }
    ],
    "hint": "Bước nhỏ + đi chậm — đi phía sau chậm hơn"
  },
  {
    "k": "多",
    "on": "タ",
    "kun": "おお",
    "vn": "Nhiều",
    "strokes": 6,
    "rad": "夕",
    "ex": [
      {
        "jp": "おおい",
        "vn": "nhiều"
      },
      {
        "jp": "たすう",
        "vn": "đa số"
      }
    ],
    "hint": "Hai mặt trăng buổi chiều — nhiều đêm đã qua"
  },
  {
    "k": "少",
    "on": "ショウ",
    "kun": "すこ・すく",
    "vn": "Ít, Một chút",
    "strokes": 4,
    "rad": "小",
    "ex": [
      {
        "jp": "すこし",
        "vn": "một chút"
      },
      {
        "jp": "しょうねん",
        "vn": "thiếu niên"
      }
    ],
    "hint": "Nhỏ 小 + một nét — nhỏ hơn cả nhỏ = ít"
  },
  {
    "k": "好",
    "on": "コウ",
    "kun": "す・この",
    "vn": "Thích, Tốt",
    "strokes": 6,
    "rad": "女",
    "ex": [
      {
        "jp": "すき",
        "vn": "thích"
      },
      {
        "jp": "こうい",
        "vn": "thiện chí"
      }
    ],
    "hint": "Phụ nữ 女 + con cái 子 — mẹ yêu con = yêu thích"
  },
  {
    "k": "語",
    "on": "ゴ",
    "kun": "かた",
    "vn": "Ngôn ngữ, Tiếng",
    "strokes": 14,
    "rad": "言",
    "ex": [
      {
        "jp": "にほんご",
        "vn": "tiếng Nhật"
      },
      {
        "jp": "えいご",
        "vn": "tiếng Anh"
      }
    ],
    "hint": "Lời nói + ngộ 吾 — ngộ ra ngôn ngữ"
  },
  {
    "k": "名",
    "on": "メイ・ミョウ",
    "kun": "な",
    "vn": "Tên, Danh tiếng",
    "strokes": 6,
    "rad": "口",
    "ex": [
      {
        "jp": "なまえ",
        "vn": "tên"
      },
      {
        "jp": "めいじん",
        "vn": "danh nhân"
      }
    ],
    "hint": "Buổi tối + miệng — tối tăm gọi tên nhau"
  },
  {
    "k": "東",
    "on": "トウ",
    "kun": "ひがし",
    "vn": "Đông (hướng)",
    "strokes": 8,
    "rad": "木",
    "ex": [
      {
        "jp": "ひがし",
        "vn": "phía đông"
      },
      {
        "jp": "とうきょう",
        "vn": "Tokyo"
      }
    ],
    "hint": "Mặt trời mọc sau cây — hướng đông"
  },
  {
    "k": "西",
    "on": "セイ・サイ",
    "kun": "にし",
    "vn": "Tây (hướng)",
    "strokes": 6,
    "rad": "西",
    "ex": [
      {
        "jp": "にし",
        "vn": "phía tây"
      },
      {
        "jp": "かんさい",
        "vn": "vùng Kansai"
      }
    ],
    "hint": "Tổ chim trên cây — chim bay về tây lúc chiều"
  }
];
 

function KanjiWritingPage({ markLearned }) {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  // Mode: "browse" | "practice" | "dictation"
  const [mode, setMode]           = useState("browse");
  const [filter, setFilter]       = useState("all"); // "all" | "wrong" | "new"
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Practice state
  const [showHint, setShowHint]   = useState(false);
  const [showStroke, setShowStroke] = useState(false);
  const [strokeStep, setStrokeStep] = useState(0);
  const [strokeAnim, setStrokeAnim] = useState(false);
  const [result, setResult]       = useState(null); // null | {score,label,color,feedback}
  const [checking, setChecking]   = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // ── Trace Mode states ──────────────────
  const [traceMode, setTraceMode]         = useState(true);  // guide char visible
  const [traceOpacity, setTraceOpacity]   = useState(0.18);  // 0.05–0.35
  const [traceCorrectCount, setTraceCorrectCount] = useState(0); // how many correct traces done
  const TRACE_GRADUATE = 2; // after 2 correct → auto fade out guide
  // Single canvas approach: guide char drawn directly onto main canvas

  // Dictation mode
  const [dictIdx, setDictIdx]     = useState(0);
  const [dictMode, setDictMode]   = useState(false);

  // Canvas
  const canvasRef  = useRef(null);
  const isDrawing  = useRef(false);
  const lastPos    = useRef(null);
  const strokesRef = useRef([]); // array of stroke paths for comparison
  const currentStroke = useRef([]);

  // SRS tracking
  const [kanjiStats, setKanjiStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_kanji_stats") || "{}"); } catch { return {}; }
  });

  const saveStats = (s) => {
    setKanjiStats(s);
    localStorage.setItem("sp_kanji_stats", JSON.stringify(s));
  };

  // Filter kanji list
  const [kanjiLevel, setKanjiLevel] = useState("N5");
  const ALL_KANJI = { N5: KANJI_N5, N4: KANJI_N4, N3: KANJI_N3, N2: KANJI_N2, N1: KANJI_N1 };
  const activeList = ALL_KANJI[kanjiLevel] || KANJI_N5;

  const filteredKanji = useMemo(() => {
    if (filter === "wrong") return activeList.filter(k => (kanjiStats[k.k]?.wrong||0) > 0);
    if (filter === "new")   return activeList.filter(k => !kanjiStats[k.k]);
    return activeList;
  }, [filter, kanjiStats, kanjiLevel, activeList]);

  const kanji = filteredKanji[selectedIdx] || KANJI_N5[0];

  // ─── Single redrawCanvas: bg + guide char + grid lines + user strokes ───
  const redrawCanvas = (overrideTrace, overrideOp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width; const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 1. Background
    ctx.fillStyle = dark ? "rgba(15,23,42,0.95)" : "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    // 2. Guide character (trace layer) — drawn FIRST so strokes appear on top
    const showGuide = overrideTrace !== undefined ? overrideTrace : traceMode;
    const opacity   = overrideOp   !== undefined ? overrideOp   : traceOpacity;
    if (showGuide && kanji?.k) {
      ctx.save();
      ctx.font = `bold ${Math.floor(W * 0.80)}px 'Noto Sans JP', serif`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle    = `rgba(67,99,235,${opacity})`;
      ctx.fillText(kanji.k, W / 2, H / 2);
      ctx.restore();
    }

    // 3. Grid lines on top of guide char
    drawGrid(ctx, W, H);

    // 4. User strokes on top of everything
    ctx.strokeStyle = dark ? "#93C5FD" : "#1E3A8A";
    ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    strokesRef.current.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  };

  // Re-render canvas whenever kanji / traceMode / opacity / dark / mode changes
  // This is the SINGLE source of truth for what appears on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Hard clear pixel buffer first — prevents ghost pixels from prev kanji
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawCanvas();
  }, [dark, mode, selectedIdx, kanji, traceMode, traceOpacity]);

  const drawGrid = (ctx, w, h) => {
    ctx.strokeStyle = dark ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.12)";
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, w-4, h-4);
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
    ctx.strokeStyle = dark ? "rgba(96,165,250,0.07)" : "rgba(37,99,235,0.06)";
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(w,h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w,0); ctx.lineTo(0,h); ctx.stroke();
    ctx.setLineDash([]);
  };

  // Guide char drawn directly in redrawCanvas() below — no separate function needed

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const scaleX = canvas.width / r.width;
    const scaleY = canvas.height / r.height;
    if (e.touches) {
      return { x:(e.touches[0].clientX-r.left)*scaleX, y:(e.touches[0].clientY-r.top)*scaleY };
    }
    return { x:(e.clientX-r.left)*scaleX, y:(e.clientY-r.top)*scaleY };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e, canvasRef.current);
    lastPos.current = pos;
    currentStroke.current = [pos];
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pos = getPos(e, canvasRef.current);
    currentStroke.current.push(pos);
    lastPos.current = pos;
    // Draw incremental segment directly (fast, no full redraw on every mousemove)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const arr = currentStroke.current;
    if (arr.length >= 2) {
      const prev = arr[arr.length - 2];
      ctx.beginPath();
      ctx.strokeStyle = dark ? "#93C5FD" : "#1E3A8A";
      ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const endDraw = (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.length > 2) {
      strokesRef.current.push([...currentStroke.current]);
    }
    currentStroke.current = [];
  };

  const clearCanvas = (resetTrace=false) => {
    strokesRef.current = [];       // clear strokes immediately (sync)
    currentStroke.current = [];
    setResult(null);
    setShowAnswer(false);
    if (resetTrace) {
      setTraceCorrectCount(0);
      setTraceOpacity(0.18);
    }
    // useEffect [kanji, selectedIdx, traceMode, traceOpacity] will redraw automatically
    // — do NOT call redrawCanvas() here, it would use stale kanji from closure
  };

  const undoLast = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    redrawCanvas();
  };

  // Stroke order animation
  const animateStrokes = () => {
    setStrokeAnim(true);
    setShowAnswer(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setStrokeStep(step);
      if (step >= kanji.strokes) { clearInterval(interval); setStrokeAnim(false); }
    }, 600);
  };

  // After scoring, handle trace graduation
  const handleTraceGraduation = (score) => {
    if (!traceMode) return;
    if (score >= 60) {
      const newCount = traceCorrectCount + 1;
      setTraceCorrectCount(newCount);
      const newOp = newCount >= TRACE_GRADUATE ? 0.04 : Math.max(0.08, traceOpacity - 0.04);
      setTraceOpacity(newOp);
      // Immediately redraw with new opacity — don't wait for React re-render
      setTimeout(() => redrawCanvas(true, newOp), 0);
    }
  };

  // AI Evaluation
  const checkWriting = async () => {
    if (strokesRef.current.length === 0) return;
    setChecking(true); setResult(null);

    // Convert canvas to base64 for AI
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png").split(",")[1];
    const strokeCount = strokesRef.current.length;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/png", data: imageData }
              },
              {
                type: "text",
                text: `Đây là ảnh học viên viết tay Kanji "${kanji.k}" (${kanji.vn}).
Kanji chuẩn: ${kanji.k} | Số nét chuẩn: ${kanji.strokes} | Học viên dùng ${strokeCount} nét.

Hãy chấm điểm ngắn gọn. Trả lời JSON duy nhất:
{"score":85,"label":"Khá tốt","feedback":"Nét chính xác, tỷ lệ cần cân đối hơn","addToReview":false}
score: 0-100. label: "Xuất sắc"(≥90)/"Tốt"(≥75)/"Khá"(≥60)/"Cần luyện"(<60). addToReview: true nếu score<70.`
              }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const colors = { "Xuất sắc":"#10B981", "Tốt":"#38BDF8", "Khá":"#F59E0B", "Cần luyện":"#EF4444" };
      parsed.color = colors[parsed.label] || "#94A3B8";
      setResult(parsed);
      handleTraceGraduation(parsed.score);

      // Update SRS stats
      const newStats = { ...kanjiStats };
      if (!newStats[kanji.k]) newStats[kanji.k] = { correct:0, wrong:0, lastSeen: Date.now() };
      if (parsed.score >= 70) newStats[kanji.k].correct++;
      else newStats[kanji.k].wrong++;
      newStats[kanji.k].lastSeen = Date.now();
      newStats[kanji.k].lastScore = parsed.score;
      saveStats(newStats);
    } catch(err) {
      // Fallback local scoring
      const diff = Math.abs(strokeCount - kanji.strokes);
      const score = Math.max(0, 100 - diff * 15 - (strokeCount === 0 ? 50 : 0));
      const label = score>=90?"Xuất sắc":score>=75?"Tốt":score>=60?"Khá":"Cần luyện";
      const colors = {"Xuất sắc":"#10B981","Tốt":"#38BDF8","Khá":"#F59E0B","Cần luyện":"#EF4444"};
      const fallbackResult = { score, label, feedback: `Số nét: bạn dùng ${strokeCount}/${kanji.strokes} nét chuẩn.`, color: colors[label], addToReview: score<70 };
      setResult(fallbackResult);
      handleTraceGraduation(score);
    }
    setChecking(false);
  };

  const resetPracticeState = () => {
    strokesRef.current = [];       // sync clear — before React re-render
    currentStroke.current = [];
    setResult(null);
    setShowHint(false);
    setShowStroke(false);
    setStrokeStep(0);
    setShowAnswer(false);
    setTraceOpacity(0.18);
    setTraceCorrectCount(0);
    // useEffect fires after setSelectedIdx updates kanji → redraws clean canvas
  };
  const nextKanji = () => { resetPracticeState(); setSelectedIdx(i => (i+1) % filteredKanji.length); };
  const prevKanji = () => { resetPracticeState(); setSelectedIdx(i => (i-1+filteredKanji.length) % filteredKanji.length); };

  // TTS pronunciation
  const playKanjiTTS = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP"; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  const cardBg = dark ? "linear-gradient(145deg,rgba(15,23,42,0.97),rgba(30,58,138,0.25))" : "#FFFFFF";
  const headerBg = "linear-gradient(135deg,#1E1B4B,#312E81,#4338CA)";

  const mastered = Object.values(kanjiStats).filter(s=>s.correct>=3).length;
  const needReview = Object.values(kanjiStats).filter(s=>(s.wrong||0)>0).length;

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding: isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>

      {/* Header */}
      <div style={{ background: headerBg, borderRadius:24, padding: isMob?"20px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, fontSize:120, opacity:0.06 }}>書</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:6 }}>KANJI WRITING</div>
        <div style={{ fontSize: isMob?22:28, fontWeight:900, marginBottom:8 }}>✍️ Luyện Viết Kanji</div>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:16 }}>Viết đúng nét, đúng thứ tự — ghi nhớ sâu hơn</div>
        {/* Stats row */}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {[
            { n: KANJI_N5.length + KANJI_N4.length+ KANJI_N3.length+ KANJI_N2.length+ KANJI_N1.length, l:"Tổng Kanji", c:"rgba(167,139,250,0.9)" },
            { n: mastered, l:"Đã thành thạo", c:"rgba(52,211,153,0.9)" },
            { n: needReview, l:"Cần luyện lại", c:"rgba(251,191,36,0.9)" },
          ].map((s,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.n}</div>
              <div style={{ fontSize:11, opacity:0.8 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[
          { id:"browse", icon:"📚", label:"Duyệt & Học" },
          { id:"practice", icon:"✍️", label:"Luyện viết" },
          { id:"dictation", icon:"🎯", label:"Đọc → Viết" },
        ].map(m => (
          <button key={m.id} onClick={()=>{ strokesRef.current=[]; currentStroke.current=[]; setResult(null); setShowHint(false); setShowStroke(false); setStrokeStep(0); setShowAnswer(false); setTraceOpacity(0.18); setTraceCorrectCount(0); setMode(m.id); setSelectedIdx(0); }}
            style={{ flex:1, padding:"10px 8px", borderRadius:14, border:"none", cursor:"pointer", fontWeight:700, fontSize: isMob?12:13, fontFamily:"'Nunito',sans-serif", transition:"all 0.2s",
              background: mode===m.id ? "linear-gradient(135deg,#4338CA,#6366F1)" : dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)",
              color: mode===m.id ? "white" : CC.muted,
              boxShadow: mode===m.id ? "0 4px 16px rgba(99,102,241,0.35)" : "none" }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Level selector */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {["N5","N4","N3","N2","N1"].map(lv => (
          <button key={lv} onClick={()=>{strokesRef.current=[];currentStroke.current=[];setResult(null);setShowAnswer(false);setTraceOpacity(0.18);setTraceCorrectCount(0);setKanjiLevel(lv);setSelectedIdx(0);setFilter("all");}}
            style={{ padding:"8px 20px", borderRadius:20, border:`2px solid ${kanjiLevel===lv?"#6366F1":dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.3)"}`,
              background: kanjiLevel===lv?"linear-gradient(135deg,#4338CA,#6366F1)":"transparent",
              color: kanjiLevel===lv?"white":CC.muted, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {lv} <span style={{fontSize:11,opacity:0.8}}>({(ALL_KANJI[lv]||[]).length} kanji)</span>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[{id:"all",l:`Tất cả (${activeList.length})`},{id:"new",l:`Chưa học (${activeList.filter(k=>!kanjiStats[k.k]).length})`},{id:"wrong",l:`Luyện lại (${needReview})`}].map(f=>(
          <button key={f.id} onClick={()=>{strokesRef.current=[];currentStroke.current=[];setResult(null);setShowAnswer(false);setFilter(f.id);setSelectedIdx(0);}}
            style={{ padding:"6px 14px", borderRadius:20, border:`2px solid ${filter===f.id?"#6366F1":dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.3)"}`,
              background: filter===f.id ? "rgba(99,102,241,0.15)" : "transparent",
              color: filter===f.id ? "#818CF8" : CC.muted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {f.l}
          </button>
        ))}
      </div>

      {filteredKanji.length === 0 ? (
        <div style={{ textAlign:"center", padding:60, color:CC.muted }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
          <div style={{ fontSize:18, fontWeight:700, color:CC.text }}>Không có Kanji nào trong nhóm này!</div>
        </div>
      ) : (

      <div style={{ display: isMob?"block":"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Left: Kanji info card */}
        <div style={{ background:cardBg, borderRadius:20, padding:isMob?"18px":"24px", border:`1px solid ${dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.1)"}`, marginBottom: isMob?16:0 }}>

          {/* Nav arrows */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <button onClick={prevKanji} style={{ background:dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.08)", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16, color:CC.text }}>‹</button>
            <span style={{ fontSize:12, color:CC.muted, fontWeight:700 }}>{selectedIdx+1} / {filteredKanji.length}</span>
            <button onClick={nextKanji} style={{ background:dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.08)", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16, color:CC.text }}>›</button>
          </div>

          {/* Big Kanji display */}
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div onClick={()=>playKanjiTTS(kanji.k)} style={{ fontSize:isMob?90:110, lineHeight:1, cursor:"pointer", userSelect:"none",
              background: "linear-gradient(135deg,#4338CA,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              filter: "drop-shadow(0 4px 12px rgba(99,102,241,0.3))", transition:"transform 0.15s" }}
              title="Nhấn để nghe phát âm">
              {mode==="dictation" && !showAnswer ? "?" : kanji.k}
            </div>
            <div style={{ fontSize:11, color:CC.muted, marginTop:4 }}>👆 Nhấn để nghe phát âm</div>
          </div>

          {/* Info */}
          {(mode!=="dictation" || showAnswer) && (
            <>
              <div style={{ textAlign:"center", marginBottom:16 }}>
                <div style={{ fontSize:20, fontWeight:900, color:CC.text, marginBottom:4 }}>{kanji.vn}</div>
                <div style={{ fontSize:13, color:"#7C3AED", fontWeight:700, marginBottom:2 }}>音：{kanji.on}</div>
                <div style={{ fontSize:13, color:"#0369A1", fontWeight:700 }}>訓：{kanji.kun || "—"}</div>
              </div>

              {/* Stroke count + radical */}
              <div style={{ display:"flex", gap:8, marginBottom:14, justifyContent:"center" }}>
                <span style={{ background:dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.1)", color:"#818CF8", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>
                  {kanji.strokes} nét
                </span>
                <span style={{ background:dark?"rgba(124,58,237,0.2)":"rgba(124,58,237,0.1)", color:"#A855F7", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>
                  Bộ: {kanji.rad}
                </span>
              </div>

              {/* Examples */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:CC.muted, fontWeight:700, marginBottom:6 }}>VÍ DỤ</div>
                {kanji.ex.map((ex,i)=>(
                  <div key={i} onClick={()=>playKanjiTTS(ex.jp)}
                    style={{ display:"flex", justifyContent:"space-between", padding:"6px 10px", borderRadius:10, marginBottom:4, cursor:"pointer",
                      background:dark?"rgba(99,102,241,0.1)":"rgba(99,102,241,0.06)", border:`1px solid ${dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)"}` }}>
                    <span style={{ fontSize:15, fontWeight:700, color:CC.text }}>{ex.jp}</span>
                    <span style={{ fontSize:12, color:CC.muted }}>{ex.vn}</span>
                  </div>
                ))}
              </div>

              {/* Mnemonic hint */}
              <button onClick={()=>setShowHint(v=>!v)} style={{ background:"none", border:`1px dashed ${dark?"rgba(251,191,36,0.4)":"rgba(251,191,36,0.5)"}`, borderRadius:10, padding:"8px 12px", cursor:"pointer", width:"100%", color:"#F59E0B", fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>
                💡 {showHint ? "Ẩn" : "Xem"} gợi nhớ
              </button>
              {showHint && (
                <div style={{ marginTop:8, padding:"10px 12px", background:dark?"rgba(251,191,36,0.08)":"rgba(255,251,235,0.9)", borderRadius:10, border:`1px solid rgba(251,191,36,0.25)`, fontSize:13, color:dark?"#FCD34D":"#92400E", lineHeight:1.6 }}>
                  {kanji.hint}
                </div>
              )}
            </>
          )}

          {mode==="dictation" && !showAnswer && (
            <div style={{ textAlign:"center", marginTop:8 }}>
              <div style={{ fontSize:24, fontWeight:900, color:CC.text, marginBottom:8 }}>{kanji.vn}</div>
              <div style={{ fontSize:14, color:CC.muted, marginBottom:16 }}>Viết Kanji có nghĩa này</div>
              <button onClick={()=>setShowAnswer(true)} style={{ background:"none", border:`1px solid ${dark?"rgba(99,102,241,0.3)":"rgba(99,102,241,0.3)"}`, borderRadius:10, padding:"8px 16px", cursor:"pointer", color:"#818CF8", fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>
                👁 Xem đáp án
              </button>
            </div>
          )}
        </div>

        {/* Right: Canvas */}
        <div>
          <div style={{ background:cardBg, borderRadius:20, padding:isMob?"16px":"20px", border:`1px solid ${dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.1)"}`, marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:CC.muted, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>✍️ BẢNG VIẾT</span>
              <span style={{ fontSize:11, color:dark?"rgba(96,165,250,0.6)":"rgba(37,99,235,0.5)" }}>Vẽ bằng chuột hoặc ngón tay</span>
            </div>

            {/* Trace Mode Toggle bar */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", borderRadius:12,
              background: traceMode
                ? dark?"rgba(99,102,241,0.15)":"rgba(238,242,255,0.9)"
                : dark?"rgba(30,41,59,0.5)":"rgba(248,250,252,0.9)",
              border:`1px solid ${traceMode?dark?"rgba(99,102,241,0.35)":"rgba(99,102,241,0.25)":dark?"rgba(56,189,248,0.1)":"rgba(148,163,184,0.2)"}`,
              transition:"all 0.3s" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color: traceMode?"#818CF8":CC.muted }}>
                  {traceMode ? "👁 Chữ mẫu đang bật" : "✏️ Tự viết (không có mẫu)"}
                </div>
                <div style={{ fontSize:10, color:CC.muted, marginTop:1 }}>
                  {traceMode
                    ? traceCorrectCount >= TRACE_GRADUATE
                      ? "🎓 Đã tốt nghiệp trace! Viết thêm để thành thạo."
                      : `${traceCorrectCount}/${TRACE_GRADUATE} lần đúng → chữ mẫu tự mờ dần`
                    : "Bật để hiện chữ mờ làm hướng dẫn"}
                </div>
              </div>
              {/* Toggle switch */}
              <div onClick={()=>{ const next=!traceMode; setTraceMode(next); setTimeout(()=>redrawCanvas(next, traceOpacity),0); }} title={traceMode?"Tắt chữ mẫu":"Bật chữ mẫu"}
                style={{ width:44, height:24, borderRadius:12,
                  background: traceMode ? "linear-gradient(135deg,#6366F1,#4338CA)" : dark?"rgba(30,41,59,0.8)":"rgba(209,213,219,0.9)",
                  cursor:"pointer", position:"relative", transition:"all 0.3s", flexShrink:0,
                  boxShadow: traceMode?"0 2px 8px rgba(99,102,241,0.5)":"none" }}>
                <div style={{ position:"absolute", top:3, left: traceMode?23:3, width:18, height:18, borderRadius:"50%",
                  background:"white", transition:"left 0.25s cubic-bezier(.4,0,.2,1)",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.25)" }}/>
              </div>
            </div>

            {/* Opacity slider (only when trace is on) */}
            {traceMode && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:11, color:CC.muted, flexShrink:0 }}>🌫 Độ mờ</span>
                <input type="range" min={5} max={35} step={1} value={Math.round(traceOpacity*100)}
                  onChange={e => { const op=Number(e.target.value)/100; setTraceOpacity(op); setTimeout(()=>redrawCanvas(true,op),0); }}
                  style={{ flex:1, accentColor:"#6366F1", cursor:"pointer" }}/>
                <span style={{ fontSize:11, color:"#818CF8", fontWeight:700, minWidth:28 }}>{Math.round(traceOpacity*100)}%</span>
              </div>
            )}

            {/* Canvas stack: trace layer (absolute) + drawing layer (on top) */}
            <div style={{ position:"relative", marginBottom:10,
              background: dark?"rgba(15,23,42,0.85)":"rgba(248,250,252,0.95)",
              borderRadius:16 }}>
              {/* Single canvas: guide char + grid + user strokes all drawn together */}
              /* MOBILE FIX: responsive canvas size */
          <canvas ref={canvasRef} width={isMob ? Math.min(typeof window !== "undefined" ? window.innerWidth - 64 : 280, 280) : 280} height={isMob ? Math.min(typeof window !== "undefined" ? window.innerWidth - 64 : 280, 280) : 280}
                style={{ width:"100%", aspectRatio:"1", borderRadius:16, display:"block", touchAction:"none",
                  cursor:"crosshair", position:"relative", zIndex:2,
                  border:`3px solid ${result?.score>=70?"#10B981":result?.score>0?"#EF4444":dark?"rgba(99,102,241,0.3)":"rgba(99,102,241,0.2)"}`,
                  boxShadow: result?.score>=70
                    ? "0 0 0 4px rgba(16,185,129,0.2), 0 4px 24px rgba(16,185,129,0.3)"
                    : result?.score>0
                      ? "0 0 0 4px rgba(239,68,68,0.15), 0 4px 20px rgba(239,68,68,0.2)"
                      : dark?"0 4px 20px rgba(0,0,0,0.3)":"0 4px 20px rgba(99,102,241,0.1)",
                  transition:"border 0.3s ease, box-shadow 0.3s ease" }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
              />
              {/* Graduation badge */}
              {traceMode && traceCorrectCount >= TRACE_GRADUATE && (
                <div style={{ position:"absolute", top:8, left:8, zIndex:10,
                  background:"linear-gradient(135deg,#10B981,#059669)", borderRadius:20,
                  padding:"3px 10px", fontSize:11, fontWeight:800, color:"white",
                  boxShadow:"0 2px 8px rgba(16,185,129,0.4)" }}>
                  🎓 Tốt nghiệp trace!
                </div>
              )}
              {/* Reference overlay toggle */}
              {showAnswer && (
                <div style={{ position:"absolute", top:8, right:8, zIndex:10,
                  background:dark?"rgba(99,102,241,0.9)":"rgba(99,102,241,0.85)",
                  borderRadius:8, padding:"4px 8px", fontSize:24, userSelect:"none" }}>
                  {kanji.k}
                </div>
              )}
            </div>

            {/* Canvas controls */}
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <button onClick={undoLast} style={{ flex:1, padding:"8px", borderRadius:10, border:`1px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.3)"}`, background:"transparent", color:CC.muted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                ↩ Hoàn tác
              </button>
              <button onClick={clearCanvas} style={{ flex:1, padding:"8px", borderRadius:10, border:`1px solid rgba(239,68,68,0.3)`, background:"transparent", color:"#EF4444", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                🗑 Xoá
              </button>
              <button onClick={()=>setShowAnswer(v=>!v)} style={{ flex:1, padding:"8px", borderRadius:10, border:`1px solid rgba(99,102,241,0.3)`, background:"transparent", color:"#818CF8", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                {showAnswer?"🙈 Ẩn":"👁 Mẫu"}
              </button>
            </div>

            {/* Stroke order button */}
            <button onClick={animateStrokes}
              style={{ width:"100%", padding:"10px", borderRadius:12, border:"none", marginBottom:10,
                background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(99,102,241,0.15))",
                color:"#A855F7", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif",
                border:`1px solid rgba(124,58,237,0.25)` }}>
              {strokeAnim ? `▶ Nét ${strokeStep}/${kanji.strokes}...` : "📐 Xem thứ tự nét (animation)"}
            </button>

            {/* Stroke order visual dots */}
            {(showStroke || strokeAnim) && (
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10, justifyContent:"center" }}>
                {Array.from({length:kanji.strokes},(_,i)=>(
                  <div key={i} style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800,
                    background: i<strokeStep ? "linear-gradient(135deg,#7C3AED,#6366F1)" : dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)",
                    color: i<strokeStep ? "white" : CC.muted,
                    transition:"all 0.3s", border:`2px solid ${i<strokeStep?"transparent":dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.15)"}`,
                    boxShadow: i<strokeStep?"0 2px 8px rgba(124,58,237,0.4)":"none" }}>
                    {i+1}
                  </div>
                ))}
              </div>
            )}

            {/* Check button */}
            <button onClick={checkWriting} disabled={checking}
              style={{ width:"100%", padding:"14px", borderRadius:14, border:"none",
                background: checking ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#4338CA,#7C3AED)",
                color:"white", fontSize:15, fontWeight:800, cursor: checking?"not-allowed":"pointer",
                fontFamily:"'Nunito',sans-serif", boxShadow:"0 4px 20px rgba(99,102,241,0.35)" }}>
              {checking ? "⏳ Đang chấm điểm..." : "🤖 AI Chấm điểm"}
            </button>
          </div>

          {/* Result card */}
          {result && (
            <div style={{ background:cardBg, borderRadius:20, padding:"20px", border:`2px solid ${result.color}30`,
              boxShadow:`0 4px 20px ${result.color}20`, animation:"baFadeIn 0.4s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ fontSize:40, fontWeight:900, color:result.color }}>{result.score}</div>
                <div>
                  <div style={{ fontSize:18, fontWeight:900, color:result.color }}>{result.label}</div>
                  <div style={{ fontSize:12, color:CC.muted }}>điểm / 100</div>
                </div>
                {/* Score arc */}
                <div style={{ marginLeft:"auto" }}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke={dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)"} strokeWidth="6"/>
                    <circle cx="28" cy="28" r="22" fill="none" stroke={result.color} strokeWidth="6"
                      strokeDasharray={`${2*Math.PI*22*result.score/100} ${2*Math.PI*22}`}
                      strokeLinecap="round" transform="rotate(-90 28 28)" style={{transition:"stroke-dasharray 1s ease"}}/>
                    <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="900" fill={result.color}>{result.score}</text>
                  </svg>
                </div>
              </div>
              <div style={{ fontSize:14, color:CC.text, lineHeight:1.6, marginBottom:14, padding:"10px 12px", background:dark?"rgba(99,102,241,0.08)":"rgba(99,102,241,0.05)", borderRadius:10 }}>
                {result.feedback}
              </div>
              {result.addToReview && (
                <div style={{ fontSize:12, color:"#FCD34D", background:"rgba(251,191,36,0.1)", borderRadius:10, padding:"8px 12px", marginBottom:12, border:"1px solid rgba(251,191,36,0.2)" }}>
                  🔁 Kanji này đã được thêm vào danh sách luyện lại
                </div>
              )}
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={clearCanvas} style={{ flex:1, padding:"10px", borderRadius:12, border:`1px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.3)"}`, background:"transparent", color:CC.muted, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  ↩ Viết lại
                </button>
                <button onClick={nextKanji} style={{ flex:1, padding:"10px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#4338CA,#7C3AED)", color:"white", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  Tiếp theo ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Kanji grid for browse mode */}
      {mode === "browse" && (
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:CC.muted, marginBottom:12 }}>TẤT CẢ KANJI {kanjiLevel}</div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?6:9}, 1fr)`, gap:8 }}>
            {activeList.map((kj, i) => {
              const stat = kanjiStats[kj.k];
              const isMastered = stat && stat.correct >= 3;
              const hasWrong = stat && stat.wrong > 0;
              const isCurrent = filteredKanji[selectedIdx]?.k === kj.k;
              return (
                <div key={i} onClick={()=>{
                    const fi = filteredKanji.findIndex(f=>f.k===kj.k);
                    if (fi>=0) { strokesRef.current=[]; currentStroke.current=[]; setResult(null); setShowAnswer(false); setTraceOpacity(0.18); setTraceCorrectCount(0); setSelectedIdx(fi); }
                  }}
                  style={{ aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:12, cursor:"pointer",
                    fontSize: isMob?22:26, fontWeight:700, transition:"all 0.2s",
                    background: isCurrent ? "linear-gradient(135deg,#4338CA,#7C3AED)" : isMastered ? dark?"rgba(16,185,129,0.15)":"rgba(16,185,129,0.1)" : hasWrong ? dark?"rgba(245,158,11,0.15)":"rgba(245,158,11,0.1)" : dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)",
                    color: isCurrent ? "white" : isMastered ? "#10B981" : hasWrong ? "#F59E0B" : CC.text,
                    border: `2px solid ${isCurrent?"transparent":isMastered?"rgba(16,185,129,0.3)":hasWrong?"rgba(245,158,11,0.25)":dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)"}`,
                    boxShadow: isCurrent ? "0 4px 16px rgba(99,102,241,0.35)" : "none" }}>
                  {kj.k}
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
            {[["#10B981","Đã thành thạo (≥3 đúng)"],["#F59E0B","Cần luyện lại"],["linear-gradient(135deg,#4338CA,#7C3AED)","Đang chọn"]].map(([c,l],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:CC.muted }}>
                <div style={{ width:12, height:12, borderRadius:4, background:c }}/>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// EJU EXAM SYSTEM
// ════════════════════════════════════════

// ── EJU Question Banks ──────────────────
const EJU_JAPANESE = [
  // Reading Comprehension
  { id:"jr1", section:"reading", passage:`田中さんは毎朝六時に起きます。朝ごはんを食べてから、電車で会社に行きます。会社は駅から歩いて十分のところにあります。仕事は九時から始まります。田中さんは毎日一生懸命働いています。`, passageVn:"Anh Tanaka thức dậy lúc 6 giờ sáng mỗi ngày. Sau khi ăn sáng, anh đi tàu điện đến công ty. Công ty nằm cách ga 10 phút đi bộ. Công việc bắt đầu lúc 9 giờ. Anh Tanaka làm việc chăm chỉ mỗi ngày.",
    q:"田中さんは何時に会社の仕事を始めますか。", opts:["六時","七時","八時","九時"], a:"九時", exp:"「仕事は九時から始まります」より、答えは九時です。" },
  { id:"jr2", section:"reading", passage:`日本の四季はとても美しいです。春は桜が咲き、夏は海で泳げます。秋は紅葉が美しく、冬は雪が降ります。外国人観光客は特に春の桜と秋の紅葉を楽しみにしています。`, passageVn:"Bốn mùa của Nhật Bản rất đẹp. Mùa xuân hoa anh đào nở, mùa hè có thể bơi ở biển. Mùa thu lá đỏ đẹp, mùa đông tuyết rơi. Khách du lịch nước ngoài đặc biệt mong chờ hoa anh đào mùa xuân và lá đỏ mùa thu.",
    q:"外国人観光客が特に楽しみにしているのはいつですか。", opts:["春と夏","夏と冬","春と秋","秋と冬"], a:"春と秋", exp:"「特に春の桜と秋の紅葉を楽しみにしています」より、春と秋。" },
  { id:"jr3", section:"reading", passage:`環境問題は現代社会の重要な課題です。地球温暖化、海洋汚染、森林破壊などの問題が深刻化しています。各国政府はこれらの問題に対処するため、様々な政策を実施しています。市民一人一人の努力も不可欠です。`, passageVn:"Vấn đề môi trường là thách thức quan trọng của xã hội hiện đại. Các vấn đề như nóng lên toàn cầu, ô nhiễm đại dương, phá rừng đang trở nên nghiêm trọng hơn. Chính phủ các nước đang thực hiện nhiều chính sách để giải quyết các vấn đề này. Nỗ lực của từng công dân cũng không thể thiếu.",
    q:"この文章によると、環境問題を解決するためには何が必要ですか。", opts:["政府の政策だけ","市民の努力だけ","政府の政策と市民の努力の両方","科学技術の発展だけ"], a:"政府の政策と市民の努力の両方", exp:"「各国政府は…政策を実施」し「市民一人一人の努力も不可欠」とあるため両方が必要。" },
  { id:"jr4", section:"reading", passage:`インターネットの普及により、人々の生活は大きく変わりました。ショッピング、情報収集、コミュニケーションなど、多くのことがオンラインで行えるようになりました。しかし、プライバシーの侵害やネット詐欺などの問題も増加しています。技術の進歩には常にリスクが伴います。`, passageVn:"Nhờ sự phổ biến của internet, cuộc sống của con người đã thay đổi rất nhiều. Mua sắm, tìm kiếm thông tin, giao tiếp - nhiều thứ đã có thể được thực hiện trực tuyến. Tuy nhiên, các vấn đề như xâm phạm quyền riêng tư và lừa đảo trực tuyến cũng đang tăng lên. Sự tiến bộ công nghệ luôn đi kèm với rủi ro.",
    q:"インターネット普及の問題点として挙げられているのは何ですか。", opts:["情報収集が難しくなった","プライバシーの侵害やネット詐欺","ショッピングができなくなった","コミュニケーションが減少した"], a:"プライバシーの侵害やネット詐欺", exp:"「プライバシーの侵害やネット詐欺などの問題も増加」と明記されています。" },
  { id:"jr5", section:"reading", passage:`日本の教育制度は六・三・三制を採用しています。小学校六年、中学校三年、高等学校三年です。その後、大学は通常四年制です。近年、グローバル化に対応するため、英語教育の強化や国際バアロレア資格の導入など、教育改革が進んでいます。`, passageVn:"Hệ thống giáo dục Nhật Bản áp dụng chế độ 6-3-3. Tiểu học 6 năm, trung học cơ sở 3 năm, trung học phổ thông 3 năm. Sau đó, đại học thường là 4 năm. Gần đây, để đáp ứng với toàn cầu hóa, các cải cách giáo dục đang được thực hiện như tăng cường giáo dục tiếng Anh và giới thiệu bằng cấp International Baccalaureate.",
    q:"日本の小学校・中学校・高校の合計年数は何年ですか。", opts:["9年","10年","12年","15年"], a:"12年", exp:"6+3+3=12年です。" },
  // Grammar section
  { id:"jg1", section:"grammar", q:"彼女は医者（　）なりたいと思っています。", opts:["が","に","で","を"], a:"に", exp:"「〜になりたい」：〜に+なりたい は「〜になること」を望む表現。職業・状態に使う。" },
  { id:"jg2", section:"grammar", q:"もし時間が（　）、映画を見に行きましょう。", opts:["あれば","あって","あっても","あるなら"], a:"あれば", exp:"「もし〜ば」：条件を表す。「もし時間があれば」= if there is time。" },
  { id:"jg3", section:"grammar", q:"この映画は子供（　）見られないほど怖い。", opts:["しか","だけ","には","でも"], a:"には", exp:"「〜には〜ない」：～にとっては不可能・困難という意味。「子供には見られない」= children can't watch it。" },
  { id:"jg4", section:"grammar", q:"電車が遅れた（　）、会議に遅刻してしまった。", opts:["ために","ように","ことで","ものの"], a:"ために", exp:"「〜ために」：原因・理由を表す。「電車が遅れたために遅刻した」= because the train was late。" },
  { id:"jg5", section:"grammar", q:"先生に（　）、この問題が解けました。", opts:["教えてもらって","教えてあげて","教えてくれて","教えてやって"], a:"教えていただいて", exp:"先生（目上）から恩恵を受ける→「〜ていただく」が適切。選択肢から最も近い敬語表現。" },
  { id:"jg6", section:"grammar", q:"彼は病気（　）、学校を休んだ。", opts:["だから","なのに","でも","なので"], a:"なので", exp:"「〜なので」：理由・原因。「病気なので休んだ」= because of illness, stayed home。" },
  { id:"jg7", section:"grammar", q:"この仕事は私（　）できません。難しすぎます。", opts:["しか","だけに","には","こそ"], a:"には", exp:"「私には〜できない」：能力・可能性の限界を示す表現。" },
  { id:"jg8", section:"grammar", q:"もっと早く来れば（　）のに。", opts:["よかった","いい","よくなる","いかった"], a:"よかった", exp:"「〜ばよかった」：過去への後悔を表す。" },
  // Listening (simulated with text-based scenario)
  { id:"jl1", section:"listening", audioText:"会話：A「すみません、東京駅はどこですか。」B「この道をまっすぐ行って、信号を左に曲がってください。歩いて五分ぐらいです。」A「ありがとうございます。」", audioTextVn:"Hội thoại: A: 'Xin lỗi, ga Tokyo ở đâu?' B: 'Đi thẳng đường này, rồi rẽ trái ở đèn giao thông. Khoảng 5 phút đi bộ.' A: 'Cảm ơn.'",
    q:"東京駅に行くために、どの方向に曲がりますか。", opts:["右","左","まっすぐ","戻る"], a:"左", exp:"「信号を左に曲がってください」と言っています。" },
  { id:"jl2", section:"listening", audioText:"天気予報：「明日の天気は曇りのち雨でしょう。気温は最高15度、最低8度の予想です。傘を持ってお出かけください。」", audioTextVn:"Dự báo thời tiết: 'Thời tiết ngày mai sẽ có mây rồi có mưa. Nhiệt độ dự kiến cao nhất 15 độ, thấp nhất 8 độ. Hãy mang ô khi ra ngoài.'",
    q:"明日の最高気温は何度ですか。", opts:["8度","10度","12度","15度"], a:"15度", exp:"「最高15度」と放送されています。" },
];

const EJU_MATH1 = [
  { id:"m1_1", q:"2次方程式 x² - 5x + 6 = 0 の解は？", opts:["x=1, x=6","x=2, x=3","x=-2, x=-3","x=1, x=5"], a:"x=2, x=3", exp:"因数分解：(x-2)(x-3)=0 → x=2 または x=3。積が6、和が5になる組み合わせ。" },
  { id:"m1_2", q:"関数 f(x) = x² + 2x - 3 の最小値は？", opts:["-4","-3","-2","-1"], a:"-4", exp:"頂点のy座標：f(-1) = 1 - 2 - 3 = -4。頂点は (-1, -4)。" },
  { id:"m1_3", q:"確率：サイコロを2回投げ、合計が7になる確率は？", opts:["1/6","5/36","6/36","1/4"], a:"6/36", exp:"合計7の組み合わせ：(1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6通り / 36 = 1/6。" },
  { id:"m1_4", q:"等差数列 3, 7, 11, 15, ... の第10項は？", opts:["39","40","41","43"], a:"39", exp:"初項a₁=3、公差d=4。第n項：aₙ=3+(n-1)×4=4n-1。a₁₀=40-1=39。" },
  { id:"m1_5", q:"log₂8 の値は？", opts:["2","3","4","8"], a:"3", exp:"log₂8 = log₂(2³) = 3。対数の定義：2³=8。" },
  { id:"m1_6", q:"sin30° + cos60° の値は？", opts:["0","1","√3","2"], a:"1", exp:"sin30°=1/2、cos60°=1/2 → 1/2+1/2=1。" },
  { id:"m1_7", q:"5C2（5から2つ選ぶ組合せ）の値は？", opts:["10","15","20","25"], a:"10", exp:"₅C₂ = 5!/(2!×3!) = (5×4)/(2×1) = 10。" },
  { id:"m1_8", q:"不等式 2x - 3 > 7 を解け。", opts:["x > 2","x > 3","x > 5","x > 7"], a:"x > 5", exp:"2x > 10 → x > 5。" },
];

const EJU_MATH2 = [
  { id:"m2_1", q:"∫(2x + 3)dx を計算せよ。", opts:["x² + 3x + C","2x² + 3x + C","x² + 3 + C","2x + C"], a:"x² + 3x + C", exp:"∫2x dx = x²、∫3 dx = 3x → x² + 3x + C。" },
  { id:"m2_2", q:"行列 A = [[1,2],[3,4]] の行列式 |A| は？", opts:["-2","2","-8","10"], a:"-2", exp:"|A| = 1×4 - 2×3 = 4 - 6 = -2。2×2行列の行列式公式。" },
  { id:"m2_3", q:"ベクトル a = (3,4) の大きさ |a| は？", opts:["3","4","5","7"], a:"5", exp:"|a| = √(3²+4²) = √(9+16) = √25 = 5。ピタゴラスの定理。" },
  { id:"m2_4", q:"lim(x→0) (sin x)/x の値は？", opts:["0","1","∞","undefined"], a:"1", exp:"標準極限：lim(x→0)(sinx/x)=1。重要な極限公式。" },
  { id:"m2_5", q:"dy/dx を求めよ（y = x³ - 2x² + x）", opts:["3x² - 2x + 1","3x² - 4x + 1","x³ - 2x","3x - 4"], a:"3x² - 4x + 1", exp:"d/dx(x³)=3x²、d/dx(-2x²)=-4x、d/dx(x)=1 → 3x²-4x+1。" },
  { id:"m2_6", q:"行列 [[2,1],[1,2]] の固有値は？", opts:["1と3","2と3","1と2","3と4"], a:"1と3", exp:"特性方程式：(2-λ)²-1=0 → λ²-4λ+3=0 → (λ-1)(λ-3)=0 → λ=1,3。" },
  { id:"m2_7", q:"∫₀¹ x² dx の値は？", opts:["1/4","1/3","1/2","1"], a:"1/3", exp:"[x³/3]₀¹ = 1/3 - 0 = 1/3。定積分の計算。" },
  { id:"m2_8", q:"2つのベクトル a=(1,0,0), b=(0,1,0) の外積 a×b は？", opts:["(0,0,0)","(1,1,0)","(0,0,1)","(0,0,-1)"], a:"(0,0,1)", exp:"標準基底ベクトル i×j = k = (0,0,1)。右手則。" },
];

const EJU_SCIENCE_PHYS = [
  { id:"sp1", q:"質量2kgの物体に10Nの力を加えたときの加速度は？", opts:["2 m/s²","4 m/s²","5 m/s²","20 m/s²"], a:"5 m/s²", exp:"F=ma → a=F/m=10/2=5 m/s²。ニュートンの第2法則。" },
  { id:"sp2", q:"波の速度v、波長λ、周波数fの関係式は？", opts:["v=λ/f","v=f/λ","v=λf","v=λ+f"], a:"v=λf", exp:"波の基本式：v=fλ。速度=周波数×波長。" },
  { id:"sp3", q:"抵抗R₁=4Ω、R₂=6Ωを直列接続したときの合成抵抗は？", opts:["2.4Ω","10Ω","12Ω","24Ω"], a:"10Ω", exp:"直列接続：R=R₁+R₂=4+6=10Ω。" },
  { id:"sp4", q:"電荷Q=2Cの点電荷が電場E=5N/Cの中に置かれた時の力は？", opts:["0.4N","2.5N","7N","10N"], a:"10N", exp:"F=QE=2×5=10N。クーロン力の計算。" },
  { id:"sp5", q:"自由落下で、5秒後の速度は？(g=10m/s²)", opts:["10m/s","25m/s","50m/s","100m/s"], a:"50m/s", exp:"v=gt=10×5=50m/s。初速度0の自由落下。" },
  { id:"sp6", q:"熱量Q=mcΔT。質量1kg、比熱4200J/(kg·K)の水を1°C上げるのに必要な熱量は？", opts:["420J","4200J","42000J","420000J"], a:"4200J", exp:"Q=1×4200×1=4200J。水の比熱の計算。" },
];

const EJU_SCIENCE_CHEM = [
  { id:"sc1", q:"NaCl（塩化ナトリウム）の式量は？(Na=23, Cl=35.5)", opts:["48.5","58.5","68.5","78.5"], a:"58.5", exp:"23+35.5=58.5。式量=各元素の原子量の和。" },
  { id:"sc2", q:"H₂O 18gは何molか？(H₂Oのモル質量=18g/mol)", opts:["0.5mol","1mol","2mol","18mol"], a:"1mol", exp:"mol=質量/モル質量=18/18=1mol。" },
  { id:"sc3", q:"pH=3の溶液の水素イオン濃度[H⁺]は？", opts:["10⁻³ mol/L","10⁻⁷ mol/L","3 mol/L","0.3 mol/L"], a:"10⁻³ mol/L", exp:"pH=-log[H⁺] → [H⁺]=10^(-pH)=10⁻³ mol/L。" },
  { id:"sc4", q:"アボガドロ定数は約何個/molか？", opts:["6.02×10²¹","6.02×10²²","6.02×10²³","6.02×10²⁴"], a:"6.02×10²³", exp:"アボガドロ定数 Nₐ = 6.02×10²³ /mol。基本定数。" },
  { id:"sc5", q:"酸化還元：Fe → Fe²⁺ + 2e⁻ はどちらの反応？", opts:["酸化","還元","中和","分解"], a:"酸化", exp:"電子を失う反応が酸化。Fe→Fe²⁺で2e⁻を放出＝酸化。" },
  { id:"sc6", q:"理想気体の状態方程式は？", opts:["PV=nRT","PV=mRT","P=nRT","PV=nR/T"], a:"PV=nRT", exp:"理想気体の状態方程式：P(圧力)V(体積)=n(物質量)R(気体定数)T(温度)。" },
];

const EJU_SCIENCE_BIO = [
  { id:"sb1", q:"細胞の遺伝情報の流れ（セントラルドグマ）の順序は？", opts:["RNA→DNA→タンパク質","DNA→RNA→タンパク質","タンパク質→RNA→DNA","DNA→タンパク質→RNA"], a:"DNA→RNA→タンパク質", exp:"セントラルドグマ：DNA→(転写)→mRNA→(翻訳)→タンパク質。" },
  { id:"sb2", q:"光合成の化学式：6CO₂ + 6H₂O → ? + 6O₂", opts:["C₆H₁₂O₆","C₁₂H₂₂O₁₁","C₃H₆O₃","C₂H₅OH"], a:"C₆H₁₂O₆", exp:"光合成：6CO₂+6H₂O+光エネルギー→C₆H₁₂O₆(グルコース)+6O₂。" },
  { id:"sb3", q:"ヒトの体細胞の染色体数は？", opts:["23本","44本","46本","48本"], a:"46本", exp:"ヒトの体細胞は46本（23対）の染色体を持つ。生殖細胞は半分の23本。" },
  { id:"sb4", q:"ABO式血液型において、O型の遺伝子型は？", opts:["AA","AO","BB","OO"], a:"OO", exp:"O型はOO。A型はAAまたはAO、B型はBBまたはBO、AB型はAB。" },
  { id:"sb5", q:"ミトコンドリアの主な機能は？", opts:["光合成","タンパク質合成","細胞呼吸（ATP産生）","DNA複製"], a:"細胞呼吸（ATP産生）", exp:"ミトコンドリアは細胞呼吸の場所。酸素を使ってグルコースからATPを産生。" },
  { id:"sb6", q:"神経インパルスの伝達に関わるイオンは？", opts:["Ca²⁺とMg²⁺","Na⁺とK⁺","Cl⁻とPO₄³⁻","H⁺とOH⁻"], a:"Na⁺とK⁺", exp:"活動電位：Na⁺の流入（脱分極）→K⁺の流出（再分極）。ナトリウム・アリウムポンプ。" },
];

const EJU_JAPAN_WORLD = [
  { id:"jw1", section:"economy", q:"GDPとは何を意味しますか？", opts:["国内の総人口","一定期間内に国内で生産された財・サービスの付加価値の総額","国の外貨準備高","政府の年間予算"], a:"一定期間内に国内で生産された財・サービスの付加価値の総額", exp:"GDP（国内総生産）= Gross Domestic Product。国の経済規模を示す指標。" },
  { id:"jw2", section:"politics", q:"国際連合（UN）の主な機関として正しいものは？", opts:["安全保障理事会、総会、事務局","首脳会議、閣僚会議、立法議会","世界銀行、IMF、WTO","G7、G20、APEC"], a:"安全保障理事会、総会、事務局", exp:"国連の主要機関：総会、安保理、経済社会理事会、国際司法裁判所、事務局など。" },
  { id:"jw3", section:"geography", q:"日本の面積は約何km²ですか？", opts:["17万km²","27万km²","38万km²","50万km²"], a:"38万km²", exp:"日本の面積は約37.8万km²（約38万km²）。世界第62位。" },
  { id:"jw4", section:"economy", q:"2008年に起きたリーマンショックは何が原因でしたか？", opts:["石油価格の高騰","アメリアのサブプライムローン問題","日本の財政破綻","ユーロ危機"], a:"アメリアのサブプライムローン問題", exp:"リーマンショック：米国の住宅バブル崩壊・サブプライムローン焦げ付きが引き金。" },
  { id:"jw5", section:"society", q:"少子高齢化が進む日本の社会問題として正しくないものは？", opts:["労働力不足","社会保障費の増大","人口の増加","経済成長の鈍化"], a:"人口の増加", exp:"少子高齢化では人口は減少する。労働力不足・社会保障費増大・経済鈍化は正しい問題点。" },
  { id:"jw6", section:"geography", q:"ASEAN（東南アジア諸国連合）の本部はどこにありますか？", opts:["バンコク","シンガポール","ジャアルタ","クアラルンプール"], a:"ジャアルタ", exp:"ASEANの本部（事務局）はインドネシアのジャアルタにある。" },
  { id:"jw7", section:"politics", q:"日本国憲法が公布されたのはいつですか？", opts:["1945年","1946年","1947年","1952年"], a:"1946年", exp:"日本国憲法は1946年11月3日公布、1947年5月3日施行。" },
  { id:"jw8", section:"economy", q:"為替レートが「円高」になると、日本の輸出企業にとってどうなりますか？", opts:["有利になる","不利になる","影響なし","利益が増える"], a:"不利になる", exp:"円高→外貨建て輸出品の価格が上がる→競争力低下→輸出企業に不利。" },
];

const EJU_SUBJECTS = {
  japanese: { name:"日本語", nameVn:"Tiếng Nhật", time:125, icon:"🗾", color:"#DC2626", questions: EJU_JAPANESE },
  math1:    { name:"数学コース1", nameVn:"Toán Khóa 1", time:80, icon:"📐", color:"#2563EB", questions: EJU_MATH1 },
  math2:    { name:"数学コース2", nameVn:"Toán Khóa 2", time:80, icon:"∑", color:"#7C3AED", questions: EJU_MATH2 },
  physics:  { name:"物理", nameVn:"Vật lý", time:80, icon:"⚛️", color:"#0891B2", questions: EJU_SCIENCE_PHYS },
  chemistry:{ name:"化学", nameVn:"Hóa học", time:80, icon:"🧪", color:"#059669", questions: EJU_SCIENCE_CHEM },
  biology:  { name:"生物", nameVn:"Sinh học", time:80, icon:"🧬", color:"#16A34A", questions: EJU_SCIENCE_BIO },
  japanworld:{ name:"日本と世界", nameVn:"Nhật Bản & Thế giới", time:80, icon:"🌏", color:"#D97706", questions: EJU_JAPAN_WORLD },
};

const UNI_BENCHMARKS = [
  { name:"東京大学", nameVn:"ĐH Tokyo", scores:{ japanese:360, math:180, science:160 }, tier:"S" },
  { name:"京都大学", nameVn:"ĐH Kyoto", scores:{ japanese:340, math:175, science:155 }, tier:"S" },
  { name:"大阪大学", nameVn:"ĐH Osaka", scores:{ japanese:310, math:160, science:145 }, tier:"A" },
  { name:"東北大学", nameVn:"ĐH Tohoku", scores:{ japanese:295, math:155, science:140 }, tier:"A" },
  { name:"横浜国立大学", nameVn:"ĐH Quốc gia Yokohama", scores:{ japanese:270, math:140, science:125 }, tier:"B" },
  { name:"千葉大学", nameVn:"ĐH Chiba", scores:{ japanese:255, math:130, science:120 }, tier:"B" },
  { name:"立命館大学", nameVn:"ĐH Ritsumeikan", scores:{ japanese:230, math:115, science:105 }, tier:"C" },
  { name:"近畿大学", nameVn:"ĐH Kinki", scores:{ japanese:200, math:100, science:90 }, tier:"C" },
];

// ── EJU Timer Hook ───────────────────────
function useEJUTimer(totalSeconds, onTimeUp) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning]   = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(intervalRef.current); setRunning(false); onTimeUp?.(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start  = () => setRunning(true);
  const pause  = () => setRunning(false);
  const reset  = (s) => { setRunning(false); setRemaining(s ?? totalSeconds); };
  const pct    = remaining / totalSeconds;
  const mm     = String(Math.floor(remaining / 60)).padStart(2,"0");
  const ss     = String(remaining % 60).padStart(2,"0");
  return { remaining, running, start, pause, reset, pct, display:`${mm}:${ss}` };
}

// ── EJU Exam Session ─────────────────────
function EJUExamSession({ subject, subjectKey, onFinish, strict }) {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const questions = useMemo(() => {
    const qs = [...subject.questions];
    return strict ? qs.sort(() => Math.random() - 0.5) : qs;
  }, [subject]);

  const [current,  setCurrent]  = useState(0);
  const [answers,  setAnswers]  = useState({}); // {qId: selectedOpt}
  const [flagged,  setFlagged]  = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showAudio, setShowAudio] = useState({});

  const timeUp = () => { if (!submitted) submit(); };
  const timer  = useEJUTimer(subject.time * 60, timeUp);

  useEffect(() => { timer.start(); }, []);

  const q = questions[current];
  const answered = !!answers[q?.id];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  const selectAnswer = (opt) => {
    if (submitted) return;
    if (strict && answers[q.id]) return; // no change in strict mode
    setAnswers(a => ({ ...a, [q.id]: opt }));
  };

  const submit = () => {
    timer.pause();
    setSubmitted(true);
    // Calculate score
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.a) correct++; });
    const pct = Math.round(correct / totalQ * 100);
    const raw = Math.round(correct / totalQ * 200); // EJU scale ~200 per subject

    // Save to history
    const hist = JSON.parse(localStorage.getItem("sp_eju_history") || "[]");
    hist.unshift({ date: new Date().toISOString(), subject: subjectKey, correct, total: totalQ, score: raw, pct });
    localStorage.setItem("sp_eju_history", JSON.stringify(hist.slice(0, 50)));

    onFinish({ correct, total: totalQ, score: raw, pct, questions, answers });
  };

  const timerColor = timer.pct > 0.5 ? "#10B981" : timer.pct > 0.2 ? "#F59E0B" : "#EF4444";

  if (!q) return null;

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", fontFamily:"'Nunito',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: dark?"rgba(15,23,42,0.98)":"white", borderBottom:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.12)"}`, padding:"10px 20px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ fontWeight:900, fontSize:15, color:CC.text }}>{subject.icon} {subject.nameVn}</div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:12, color:CC.muted }}>{answeredCount}/{totalQ} {t.jlptAnswered}</span>
          {/* Timer */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:dark?"rgba(30,41,59,0.9)":"rgba(241,245,249,0.9)", borderRadius:20, padding:"6px 14px", border:`2px solid ${timerColor}40` }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:timerColor, animation: timer.remaining < 300 ? "baBounce 0.8s infinite" : "none" }}/>
            <span style={{ fontWeight:900, fontSize:16, color:timerColor, fontFamily:"monospace" }}>⏱ {timer.display}</span>
          </div>
          {!submitted && (
            <button onClick={submit} style={{ background:"linear-gradient(135deg,#DC2626,#B91C1C)", color:"white", border:"none", borderRadius:12, padding:"8px 18px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              📨 {t.submit}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: isMob ? "block" : "flex", minHeight:"calc(100vh - 60px)" }}>
        {/* Left: Question navigator */}
        <div style={{ width: isMob?"100%":180, background: dark?"rgba(15,23,42,0.6)":"rgba(248,250,252,0.9)", borderRight: isMob?"none":`1px solid ${dark?"rgba(56,189,248,0.1)":"rgba(37,99,235,0.1)"}`, padding:isMob?"12px":"16px", flexShrink:0 }}>
          <div style={{ fontSize:11, fontWeight:700, color:CC.muted, marginBottom:10 }}>DANH SÁCH CÂU HỎI</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {questions.map((qq, i) => {
              const isAnswered = !!answers[qq.id];
              const isCurrent = i === current;
              const isFlagged = flagged.has(qq.id);
              const isCorrect = submitted && answers[qq.id] === qq.a;
              const isWrong   = submitted && answers[qq.id] && answers[qq.id] !== qq.a;
              return (
                <button key={qq.id} onClick={() => { if (!strict || submitted) setCurrent(i); }}
                  style={{ width:36, height:36, borderRadius:8, border:"none", fontSize:13, fontWeight:700, cursor: strict && !submitted ? "default" : "pointer",
                    background: isCorrect ? "#10B981" : isWrong ? "#EF4444" : isCurrent ? subject.color : isAnswered ? dark?"rgba(37,99,235,0.5)":"rgba(219,234,254,0.9)" : dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)",
                    color: isCorrect||isWrong||isCurrent ? "white" : CC.text,
                    outline: isCurrent ? `2px solid ${subject.color}` : "none", outlineOffset:2,
                    position:"relative" }}>
                  {i+1}
                  {isFlagged && <span style={{ position:"absolute", top:-3, right:-3, fontSize:8 }}>🚩</span>}
                </button>
              );
            })}
          </div>
          {!isMob && (
            <div style={{ marginTop:16, fontSize:11, color:CC.muted }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:subject.color }}/> Đang làm
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:"rgba(37,99,235,0.5)" }}/> Đã trả lời
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:3, background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", border:`1px solid ${CC.muted}40` }}/> Chưa làm
              </div>
            </div>
          )}
        </div>

        {/* Center: Question */}
        <div style={{ flex:1, padding: isMob?"16px":"32px", overflowY:"auto" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            {/* Question number + flag */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ background:`${subject.color}20`, color:subject.color, borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:800 }}>
                Câu {current+1} / {totalQ}
                {q.section && <span style={{ marginLeft:8, opacity:0.7, fontSize:11 }}>
                  {q.section==="reading"?"📖 Đọc hiểu":q.section==="grammar"?t.grammarTitle ? "📝 "+t.grammarTitle : "📝 Ngữ pháp":q.section==="listening"?"🎧 Nghe hiểu":""}
                </span>}
              </span>
              <button onClick={()=> setFlagged(f => { const n=new Set(f); n.has(q.id)?n.delete(q.id):n.add(q.id); return n; })}
                style={{ background:"none", border:`1px solid ${flagged.has(q.id)?"#F59E0B":dark?"rgba(148,163,184,0.3)":"rgba(148,163,184,0.4)"}`, borderRadius:8, padding:"4px 10px", cursor:"pointer", fontSize:12, color:flagged.has(q.id)?"#F59E0B":CC.muted, fontFamily:"'Nunito',sans-serif" }}>
                🚩 {flagged.has(q.id)?"Đã đánh dấu":"Đánh dấu"}
              </button>
            </div>

            {/* Passage (reading) */}
            {q.passage && (
              <div style={{ background:dark?"rgba(30,41,59,0.7)":"rgba(248,250,252,0.9)", borderRadius:16, padding:"20px", marginBottom:20, border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.12)"}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:CC.muted, marginBottom:8 }}>📄 VĂN BẢN</div>
                <div style={{ fontSize:15, lineHeight:1.9, color:CC.text, fontFamily:"'Noto Sans JP', sans-serif", marginBottom:10 }}>{q.passage}</div>
                <div style={{ fontSize:12, color:CC.muted, borderTop:`1px solid ${dark?"rgba(56,189,248,0.1)":"rgba(37,99,235,0.08)"}`, paddingTop:8, lineHeight:1.7 }}>🇻🇳 {q.passageVn}</div>
              </div>
            )}

            {/* Audio scenario (listening) */}
            {q.audioText && (
              <div style={{ background:dark?"rgba(30,58,138,0.25)":"rgba(239,246,255,0.9)", borderRadius:16, padding:"16px 20px", marginBottom:20, border:`1px solid rgba(37,99,235,0.2)` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:showAudio[q.id]?10:0 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#3B82F6" }}>🎧 ĐOẠN NGHE</span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => {
                      if (!window.speechSynthesis) return;
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(q.audioText);
                      u.lang="ja-JP"; u.rate=0.85;
                      window.speechSynthesis.speak(u);
                    }} style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)", color:"white", border:"none", borderRadius:10, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                      ▶ Phát âm thanh
                    </button>
                    <button onClick={() => setShowAudio(s=>({...s,[q.id]:!s[q.id]}))} style={{ background:"none", border:`1px solid rgba(37,99,235,0.3)`, color:"#3B82F6", borderRadius:10, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                      {showAudio[q.id]?"🙈 Ẩn script":"📄 Xem script"}
                    </button>
                  </div>
                </div>
                {showAudio[q.id] && (
                  <div>
                    <div style={{ fontSize:13, color:CC.text, lineHeight:1.8, marginBottom:6 }}>{q.audioText}</div>
                    <div style={{ fontSize:11, color:CC.muted }}>{q.audioTextVn}</div>
                  </div>
                )}
              </div>
            )}

            {/* Question text */}
            <div style={{ fontSize:isMob?17:19, fontWeight:700, color:CC.text, lineHeight:1.7, marginBottom:24, fontFamily:"'Noto Sans JP','Nunito',sans-serif" }}>
              {q.q}
            </div>

            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
              {q.opts.map((opt, oi) => {
                const isSelected = answers[q.id] === opt;
                const isCorrectOpt = submitted && opt === q.a;
                const isWrongSelected = submitted && isSelected && opt !== q.a;
                return (
                  <button key={oi} onClick={() => selectAnswer(opt)}
                    style={{ padding:"14px 18px", borderRadius:14, border:`2px solid ${
                      isCorrectOpt ? "#10B981" : isWrongSelected ? "#EF4444" : isSelected ? subject.color : dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.15)"
                    }`, background: isCorrectOpt ? "rgba(16,185,129,0.15)" : isWrongSelected ? "rgba(239,68,68,0.15)" : isSelected ? `${subject.color}20` : dark?"rgba(15,23,42,0.4)":"rgba(248,250,252,0.9)",
                      color:CC.text, textAlign:"left", cursor: submitted?"default":"pointer", fontSize:15, fontWeight:isSelected?700:500,
                      fontFamily:"'Noto Sans JP','Nunito',sans-serif", transition:"all 0.15s", lineHeight:1.6 }}>
                    <span style={{ color: isCorrectOpt?"#10B981":isWrongSelected?"#EF4444":isSelected?subject.color:CC.muted, fontWeight:800, marginRight:10 }}>
                      {isCorrectOpt?"✓":isWrongSelected?"✗":String.fromCharCode(65+oi)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation (after submit) */}
            {submitted && (
              <div style={{ background:dark?"rgba(30,41,59,0.7)":"rgba(248,250,252,0.9)", borderRadius:14, padding:"16px 20px", border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.12)"}`, marginBottom:24 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#3B82F6", marginBottom:6 }}>💡 GIẢI THÍCH</div>
                <div style={{ fontSize:14, color:CC.text, lineHeight:1.7 }}>{q.exp}</div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display:"flex", gap:12, justifyContent:"space-between" }}>
              <button onClick={() => setCurrent(i => Math.max(0,i-1))} disabled={current===0||(strict&&!submitted)}
                style={{ padding:"12px 20px", borderRadius:12, border:`1px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.3)"}`, background:"transparent", color:CC.muted, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", opacity:current===0||(strict&&!submitted)?0.4:1 }}>
                ‹ Câu trước
              </button>
              {current < totalQ-1 ? (
                <button onClick={() => setCurrent(i => Math.min(totalQ-1,i+1))}
                  style={{ padding:"12px 20px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${subject.color},${subject.color}cc)`, color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  Câu sau ›
                </button>
              ) : !submitted ? (
                <button onClick={submit}
                  style={{ padding:"12px 20px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#DC2626,#B91C1C)", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  📨 {t.submit}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EJU Result Screen ────────────────────
function EJUResult({ result, subject, subjectKey, onRetry, onBack, onAIAnalysis }) {
  const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI]   = useState(false);

  const { correct, total, score, pct, questions, answers } = result;
  const wrongQs = questions.filter(q => answers[q.id] && answers[q.id] !== q.a);
  const unanswered = questions.filter(q => !answers[q.id]).length;

  const getAIAnalysis = async () => {
    setLoadingAI(true);
    const wrongList = wrongQs.slice(0,5).map(q=>`Q: ${q.q} | Học viên chọn: ${answers[q.id]} | Đáp án: ${q.a}`).join("\n");
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:600,
          messages:[{ role:"user", content:
            `Học viên làm bài thi EJU môn ${subject.nameVn}. Kết quả: ${correct}/${total} câu đúng (${pct}%). Điểm ước tính: ${score}/200.
Câu sai (mẫu):\n${wrongList || "Không có câu sai!"}
Hãy phân tích ngắn gọn bằng tiếng Việt:
1. Điểm mạnh
2. Điểm yếu & lý do
3. Gợi ý cải thiện cụ thể (3 bước)
4. Dự báo nếu thi thật (honest assessment)
Trả lời trong 4 đoạn, mỗi đoạn 2-3 câu. Giọng thân thiện, khích lệ.`
          }]
        })
      });
      const data = await res.json();
      setAiAnalysis(data.content?.[0]?.text || "Không thể phân tích.");
    } catch { setAiAnalysis("⚠️ Không thể kết nối AI. Vui lòng thử lại."); }
    setLoadingAI(false);
  };

  const scoreColor = score >= 160?"#10B981":score>=120?"#38BDF8":score>=80?"#F59E0B":"#EF4444";
  const tierColors = { S:"#EF4444", A:"#F59E0B", B:"#38BDF8", C:"#94A3B8" };

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"16px 12px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Score hero */}
      <div style={{ background:`linear-gradient(135deg,#0F172A,#1E3A8A,${subject.color}66)`, borderRadius:24, padding:isMob?"24px":"36px", color:"white", textAlign:"center", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-40,right:-30,fontSize:150,opacity:0.04 }}>結果</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:8 }}>EJU 模擬試験 結果</div>
        <div style={{ fontSize:80, fontWeight:900, lineHeight:1, color:scoreColor, marginBottom:4,
          filter:`drop-shadow(0 0 20px ${scoreColor}60)` }}>{score}</div>
        <div style={{ fontSize:15, opacity:0.8, marginBottom:16 }}>/ 200点　（EJU換算スコア）</div>
        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap" }}>
          {[
            { l:"正解率", v:`${pct}%` },
            { l:"正解数", v:`${correct}/${total}` },
            { l:"未回答", v:`${unanswered}問` },
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900 }}>{s.v}</div>
              <div style={{ fontSize:11, opacity:0.7 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* University comparison */}
      <div style={{ background:dark?"rgba(15,23,42,0.8)":"white", borderRadius:20, padding:isMob?"18px":"24px", marginBottom:20, border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)"}` }}>
        <div style={{ fontSize:14, fontWeight:800, color:CC.text, marginBottom:16 }}>🏫 So sánh với điểm chuẩn đại học</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {UNI_BENCHMARKS.map((uni,i) => {
            const benchmark = uni.scores.japanese || uni.scores.math || 120;
            const pass = score >= benchmark * 0.9;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:12,
                background: pass ? dark?"rgba(16,185,129,0.1)":"rgba(240,253,244,0.9)" : dark?"rgba(30,41,59,0.6)":"rgba(248,250,252,0.8)",
                border:`1px solid ${pass?"rgba(16,185,129,0.25)":dark?"rgba(56,189,248,0.1)":"rgba(37,99,235,0.08)"}` }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:tierColors[uni.tier]+"20", border:`2px solid ${tierColors[uni.tier]}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:tierColors[uni.tier], flexShrink:0 }}>{uni.tier}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:CC.text }}>{uni.name}</div>
                  <div style={{ fontSize:11, color:CC.muted }}>{uni.nameVn}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:13, fontWeight:800, color: pass?"#10B981":"#EF4444" }}>{pass?"✓ Đạt":"✗ Chưa đạt"}</div>
                  <div style={{ fontSize:11, color:CC.muted }}>Chuẩn ~{Math.round(benchmark*0.9)}</div>
                </div>
                {/* Progress bar */}
                <div style={{ width:80, height:6, borderRadius:3, background:dark?"rgba(30,41,59,0.8)":"rgba(226,232,240,0.9)", overflow:"hidden", flexShrink:0 }}>
                  <div style={{ height:"100%", borderRadius:3, width:`${Math.min(100, score/(benchmark*0.9)*100)}%`, background: pass?"#10B981":"#EF4444", transition:"width 1s ease" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong questions review */}
      {wrongQs.length > 0 && (
        <div style={{ background:dark?"rgba(15,23,42,0.8)":"white", borderRadius:20, padding:isMob?"18px":"24px", marginBottom:20, border:`1px solid rgba(239,68,68,0.2)` }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#EF4444", marginBottom:16 }}>❌ Câu trả lời sai ({wrongQs.length} câu)</div>
          {wrongQs.slice(0,4).map((q,i)=>(
            <div key={i} style={{ padding:"12px 14px", borderRadius:12, background:dark?"rgba(239,68,68,0.08)":"rgba(254,242,242,0.9)", border:"1px solid rgba(239,68,68,0.15)", marginBottom:8 }}>
              <div style={{ fontSize:13, fontWeight:700, color:CC.text, marginBottom:4, lineHeight:1.6 }}>{q.q}</div>
              <div style={{ fontSize:12, display:"flex", gap:16, flexWrap:"wrap" }}>
                <span style={{ color:"#EF4444" }}>✗ Bạn chọn: {answers[q.id]}</span>
                <span style={{ color:"#10B981" }}>✓ Đáp án: {q.a}</span>
              </div>
              <div style={{ fontSize:12, color:CC.muted, marginTop:4, lineHeight:1.5 }}>💡 {q.exp}</div>
            </div>
          ))}
          {wrongQs.length > 4 && <div style={{ fontSize:12, color:CC.muted, textAlign:"center" }}>...và {wrongQs.length-4} câu sai khác</div>}
        </div>
      )}

      {/* AI Analysis */}
      <div style={{ background:dark?"rgba(15,23,42,0.8)":"white", borderRadius:20, padding:isMob?"18px":"24px", marginBottom:20, border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)"}` }}>
        <div style={{ fontSize:14, fontWeight:800, color:CC.text, marginBottom:12 }}>🤖 Phân tích AI</div>
        {aiAnalysis ? (
          <div style={{ fontSize:14, color:CC.text, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{aiAnalysis}</div>
        ) : (
          <button onClick={getAIAnalysis} disabled={loadingAI}
            style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#4338CA,#7C3AED)", color:"white", fontSize:15, fontWeight:800, cursor:loadingAI?"not-allowed":"pointer", fontFamily:"'Nunito',sans-serif", opacity:loadingAI?0.7:1 }}>
            {loadingAI ? "⏳ AI đang phân tích..." : "🤖 Nhận phân tích từ AI"}
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <button onClick={onRetry} style={{ flex:1, padding:"14px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${subject.color},${subject.color}cc)`, color:"white", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
          🔄 Thi lại
        </button>
        <button onClick={onBack} style={{ flex:1, padding:"14px", borderRadius:14, border:`1px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.3)"}`, background:"transparent", color:CC.text, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
          ← Về trang EJU
        </button>
      </div>
    </div>
  );
}

// ── EJU Main Page ────────────────────────
function EJUPage({ setPage }) {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [screen, setScreen]     = useState("home"); // home | config | exam | result
  const [selectedSub, setSelectedSub] = useState(null);
  const [strict, setStrict]     = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [history, setHistory]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_eju_history") || "[]"); } catch { return []; }
  });

  const startExam = (subKey) => {
    setSelectedSub(subKey);
    setScreen("exam");
    setExamResult(null);
  };

  const handleFinish = (result) => {
    setExamResult(result);
    setScreen("result");
    setHistory(JSON.parse(localStorage.getItem("sp_eju_history") || "[]"));
  };

  if (screen === "exam" && selectedSub) {
    return <EJUExamSession subject={EJU_SUBJECTS[selectedSub]} subjectKey={selectedSub} strict={strict}
      onFinish={handleFinish} />;
  }

  if (screen === "result" && examResult && selectedSub) {
    return <EJUResult result={examResult} subject={EJU_SUBJECTS[selectedSub]} subjectKey={selectedSub}
      onRetry={() => startExam(selectedSub)} onBack={() => setScreen("home")} />;
  }

  // Group subjects
  const subjectGroups = [
    { label:"🗾 Tiếng Nhật (Japanese)", keys:["japanese"] },
    { label:"📐 Toán học (Mathematics)", keys:["math1","math2"] },
    { label:"🔬 Khoa học (Science)", keys:["physics","chemistry","biology"] },
    { label:"🌏 Nhật Bản & Thế giới", keys:["japanworld"] },
  ];

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0F172A 0%,#1E1B4B 40%,#312E81 100%)", borderRadius:24, padding:isMob?"22px":"36px", color:"white", marginBottom:28, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-20,right:-20,fontSize:200,opacity:0.04,fontFamily:"serif" }}>試</div>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, opacity:0.6, marginBottom:6 }}>EXAMINATION FOR JAPANESE UNIVERSITY ADMISSION</div>
        <div style={{ fontSize:isMob?26:38, fontWeight:900, marginBottom:8 }}>📋 EJU 模擬試験</div>
        <div style={{ fontSize:isMob?13:15, opacity:0.8, marginBottom:20 }}>Luyện thi EJU — Kỳ thi vào đại học Nhật Bản dành cho du học sinh</div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[
            { l:"Môn thi", v:"7 môn" },
            { l:"Thời gian thật", v:"80–125 phút" },
            { l:"Câu hỏi", v:`${Object.values(EJU_SUBJECTS).reduce((a,s)=>a+s.questions.length,0)}+` },
            { l:"Đại học so sánh", v:`${UNI_BENCHMARKS.length} trường` },
          ].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:900 }}>{s.v}</div>
              <div style={{ fontSize:11, opacity:0.7 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Strict mode toggle */}
      <div style={{ background:dark?"rgba(15,23,42,0.7)":"white", borderRadius:16, padding:"14px 20px", marginBottom:20, border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:CC.text }}>🎯 Chế độ thi nghiêm ngặt</div>
          <div style={{ fontSize:12, color:CC.muted }}>Không được xem lại câu trước, không đổi đáp án — giống thi thật</div>
        </div>
        <div onClick={() => setStrict(v=>!v)} style={{ width:48, height:26, borderRadius:13, background:strict?"#4338CA":"rgba(148,163,184,0.3)", cursor:"pointer", position:"relative", transition:"all 0.3s", flexShrink:0 }}>
          <div style={{ position:"absolute", top:3, left:strict?26:3, width:20, height:20, borderRadius:"50%", background:"white", transition:"all 0.3s", boxShadow:"0 2px 4px rgba(0,0,0,0.2)" }}/>
        </div>
      </div>

      {/* Subject groups */}
      {subjectGroups.map((group, gi) => (
        <div key={gi} style={{ marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:800, color:CC.muted, marginBottom:12 }}>{group.label}</div>
          <div style={{ display:"grid", gridTemplateColumns:isMob?"1fr":`repeat(${group.keys.length===1?"1":group.keys.length>2?"3":"2"}, 1fr)`, gap:12 }}>
            {group.keys.map(key => {
              const sub = EJU_SUBJECTS[key];
              const hist = history.filter(h=>h.subject===key);
              const best = hist.length ? Math.max(...hist.map(h=>h.score)) : null;
              return (
                <div key={key} style={{ background:dark?"rgba(15,23,42,0.8)":"white", borderRadius:18, padding:"20px", border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)"}`, cursor:"pointer", transition:"all 0.2s", boxShadow:"none" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${sub.color}25`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:28, marginBottom:6 }}>{sub.icon}</div>
                      <div style={{ fontSize:16, fontWeight:900, color:CC.text }}>{sub.nameVn}</div>
                      <div style={{ fontSize:12, color:CC.muted }}>{sub.name}</div>
                    </div>
                    {best !== null && (
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:22, fontWeight:900, color:sub.color }}>{best}</div>
                        <div style={{ fontSize:10, color:CC.muted }}>Điểm tốt nhất</div>
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                    <span style={{ background:`${sub.color}15`, color:sub.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>⏱ {sub.time} phút</span>
                    <span style={{ background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", color:CC.muted, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{sub.questions.length} câu</span>
                    {hist.length>0 && <span style={{ background:dark?"rgba(16,185,129,0.15)":"rgba(240,253,244,0.9)", color:"#10B981", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>✓ {hist.length} lần thi</span>}
                  </div>
                  <button onClick={() => startExam(key)} style={{ width:"100%", padding:"11px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${sub.color},${sub.color}cc)`, color:"white", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                    Bắt đầu thi →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* History */}
      {history.length > 0 && (
        <div style={{ background:dark?"rgba(15,23,42,0.8)":"white", borderRadius:20, padding:isMob?"18px":"24px", border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(37,99,235,0.1)"}` }}>
          <div style={{ fontSize:14, fontWeight:800, color:CC.text, marginBottom:16 }}>📊 Lịch sử thi gần đây</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {history.slice(0,8).map((h,i)=>{
              const sub = EJU_SUBJECTS[h.subject];
              if (!sub) return null;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:12, background:dark?"rgba(30,41,59,0.5)":"rgba(248,250,252,0.9)", border:`1px solid ${dark?"rgba(56,189,248,0.08)":"rgba(37,99,235,0.06)"}` }}>
                  <span style={{ fontSize:18 }}>{sub.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:CC.text }}>{sub.nameVn}</div>
                    <div style={{ fontSize:11, color:CC.muted }}>{new Date(h.date).toLocaleDateString("vi-VN")}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:16, fontWeight:900, color:h.score>=160?"#10B981":h.score>=120?"#38BDF8":h.score>=80?"#F59E0B":"#EF4444" }}>{h.score}/200</div>
                    <div style={{ fontSize:11, color:CC.muted }}>{h.correct}/{h.total} đúng</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SENTENCE BUILDER — Game ghép câu
// ════════════════════════════════════════════════════════════════
const SB_SENTENCES = [
  // N5
  { id:"sb1", level:"N5", words:["私","は","学生","です"], answer:["私","は","学生","です"], vn:"Tôi là học sinh.", grammar:"〜は〜です：khẳng định đơn giản. は là trợ từ chủ đề.", tags:["は","です"] },
  { id:"sb2", level:"N5", words:["毎日","学校","に","行きます","私","は"], answer:["私","は","毎日","学校","に","行きます"], vn:"Tôi đi học mỗi ngày.", grammar:"〜に行きます：đi đến ~. に chỉ hướng đến.", tags:["に","行く"] },
  { id:"sb3", level:"N5", words:["ですか","これ","は","何"], answer:["これ","は","何","ですか"], vn:"Cái này là gì?", grammar:"これは何ですか：hỏi về vật thể.", tags:["これ","何"] },
  { id:"sb4", level:"N5", words:["食べました","昨日","寿司","を","私","は"], answer:["私","は","昨日","寿司","を","食べました"], vn:"Hôm qua tôi đã ăn sushi.", grammar:"〜を食べました：ăn ~. を là trợ từ tân ngữ.", tags:["を","た形"] },
  { id:"sb5", level:"N5", words:["いません","猫","部屋","に","は"], answer:["部屋","に","は","猫","が","いません"], vn:"Trong phòng không có mèo.", grammar:"〜にいます/います：vị trí của sinh vật.", tags:["に","いる"] },
  { id:"sb6", level:"N5", words:["大きい","です","東京","は","都市"], answer:["東京","は","大きい","都市","です"], vn:"Tokyo là thành phố lớn.", grammar:"い形容詞 + 名詞：tính từ đứng trước danh từ.", tags:["い形容詞"] },
  { id:"sb7", level:"N5", words:["ください","水","を","少し"], answer:["水","を","少し","ください"], vn:"Cho tôi một chút nước.", grammar:"〜をください：xin cho tôi ~.", tags:["ください"] },
  { id:"sb8", level:"N5", words:["好きです","音楽","が","私","は"], answer:["私","は","音楽","が","好きです"], vn:"Tôi thích âm nhạc.", grammar:"〜が好きです：thích ~. が dùng với 好き.", tags:["が","好き"] },
  // N4
  { id:"sb9", level:"N4", words:["しまいました","財布","忘れて","を","家","に"], answer:["家","に","財布","を","忘れて","しまいました"], vn:"Tôi đã quên ví ở nhà mất rồi.", grammar:"〜てしまいました：lỡ làm ~, hoàn thành ngoài ý muốn.", tags:["てしまう"] },
  { id:"sb10", level:"N4", words:["なりました","日本語","話せる","が","ように"], answer:["日本語","が","話せる","ように","なりました"], vn:"Tôi đã có thể nói tiếng Nhật.", grammar:"〜ようになりました：trở nên có thể ~.", tags:["ようになる"] },
  { id:"sb11", level:"N4", words:["ために","合格する","試験","に","勉強","しています"], answer:["試験","に","合格する","ために","勉強","しています"], vn:"Tôi đang học để đậu kỳ thi.", grammar:"〜ために：để ~, mục đích.", tags:["ために"] },
  { id:"sb12", level:"N4", words:["そうです","雨","降り","が"], answer:["雨","が","降り","そうです"], vn:"Trông có vẻ sắp mưa.", grammar:"〜そうです（様態）：trông có vẻ ~, quan sát trực tiếp.", tags:["そうだ"] },
  { id:"sb13", level:"N4", words:["くれました","教えて","先生","漢字","が","を"], answer:["先生","が","漢字","を","教えて","くれました"], vn:"Thầy giáo đã dạy tôi Kanji.", grammar:"〜てくれました：người khác làm ơn cho tôi.", tags:["てくれる"] },
  { id:"sb14", level:"N4", words:["はずです","来る","彼女","は"], answer:["彼女","は","来る","はずです"], vn:"Chắc chắn cô ấy sẽ đến.", grammar:"〜はずです：chắc chắn ~, phỏng đoán có căn cứ.", tags:["はずだ"] },
  // N3-N2
  { id:"sb15", level:"N3", words:["わけ","いかない","には","休む","試験","が","ある","の","に","は"], answer:["試験","が","ある","の","に","休む","わけ","には","いかない"], vn:"Vì có kỳ thi nên không thể nghỉ được.", grammar:"〜わけにはいかない：không thể ~ (vì lý do xã hội/đạo đức).", tags:["わけにはいかない"] },
  { id:"sb16", level:"N3", words:["つもり","で","のに","勉強","一生懸命","した","落ちた","試験","に"], answer:["一生懸命","勉強","した","のに","試験","に","落ちた"], vn:"Mặc dù học chăm chỉ nhưng vẫn trượt thi.", grammar:"〜のに：mặc dù ~ (nghịch cảnh, tiếc nuối).", tags:["のに"] },
  { id:"sb17", level:"N2", words:["おかげ","で","合格","先生","の","できた","に","試験","が"], answer:["先生","の","おかげ","で","試験","に","合格","できた"], vn:"Nhờ thầy giáo mà tôi đậu được kỳ thi.", grammar:"〜おかげで：nhờ ~, nhân tố tích cực.", tags:["おかげで"] },
  { id:"sb18", level:"N2", words:["ことなく","諦める","最後","まで","頑張った"], answer:["諦める","ことなく","最後","まで","頑張った"], vn:"Cố gắng đến cùng mà không bỏ cuộc.", grammar:"〜ことなく：không làm ~, không ~.", tags:["ことなく"] },
];


// ════════════════════════════════════════════════════════════════
// REBUILT SENTENCE BUILDER PAGE — Drag & Drop + Audio + Animations
// ════════════════════════════════════════════════════════════════
function SentenceBuilderPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [levelFilter, setLevelFilter] = useState("N5");
  const [qIdx, setQIdx]         = useState(0);
  const [arranged, setArranged] = useState([]);
  const [bank, setBank]         = useState([]);
  const [checked, setChecked]   = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore]       = useState({correct:0, total:0});
  const [showExplain, setShowExplain] = useState(false);
  const [playing, setPlaying]   = useState(false);
  const [shake, setShake]       = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [dragOver, setDragOver] = useState(null); // "slot"|"bank"
  const [dragItem, setDragItem] = useState(null); // {area, idx, word}
  const [hint, setHint]         = useState(false);

  const filtered = SB_SENTENCES.filter(s => s.level === levelFilter);
  const q = filtered[qIdx % filtered.length];

  const resetQ = (newQ) => {
    const shuffled = [...newQ.words].sort(() => Math.random() - 0.5);
    // Make sure it's actually shuffled (not same as answer)
    let tries = 0;
    let sh = shuffled;
    while (sh.join("") === newQ.answer.join("") && tries < 10) {
      sh = [...newQ.words].sort(() => Math.random() - 0.5);
      tries++;
    }
    setBank(sh);
    setArranged([]);
    setChecked(false);
    setIsCorrect(false);
    setShowExplain(false);
    setHint(false);
    setShake(false);
    setCelebrate(false);
  };

  useEffect(() => { if(q) resetQ(q); }, [qIdx, levelFilter]);

  const checkAnswer = () => {
    if (arranged.length === 0) return;
    const correct = arranged.join("") === q.answer.join("");
    setIsCorrect(correct);
    setChecked(true);
    setScore(s => ({ correct: s.correct + (correct?1:0), total: s.total+1 }));
    if (correct) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1800);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    // Update stats
    try {
      const stats = JSON.parse(localStorage.getItem("sp_user_stats") || "{}");
      stats.sentenceGames = (stats.sentenceGames || 0) + 1;
      localStorage.setItem("sp_user_stats", JSON.stringify(stats));
    } catch {}
  };

  const playSentence = (text) => {
    if (!window.speechSynthesis || playing) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text || q.answer.join(""));
    u.lang = "ja-JP"; u.rate = 0.8;
    u.onstart = () => setPlaying(true);
    u.onend   = () => setPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const nextQ = () => setQIdx(i => (i + 1) % filtered.length);
  const clearSlots = () => {
    if (checked) return;
    setBank(b => [...b, ...arranged].sort(() => Math.random()-0.5));
    setArranged([]);
  };

  // Click interactions
  const pickFromBank = (idx) => {
    if (checked) return;
    const word = bank[idx];
    setArranged(a => [...a, word]);
    setBank(b => b.filter((_,i) => i !== idx));
  };
  const returnToBank = (idx) => {
    if (checked) return;
    const word = arranged[idx];
    setBank(b => [...b, word]);
    setArranged(a => a.filter((_,i) => i !== idx));
  };

  // Drag handlers — desktop
  const onDragStart = (area, idx, word) => { setDragItem({area, idx, word}); };
  const onDragEnd   = () => { setDragItem(null); setDragOver(null); };
  const onDrop = (targetArea, targetIdx) => {
    if (!dragItem || checked) return;
    if (dragItem.area === "bank" && targetArea === "slot") {
      const word = bank[dragItem.idx];
      setBank(b => b.filter((_,i) => i !== dragItem.idx));
      setArranged(a => {
        const na = [...a];
        na.splice(targetIdx >= 0 ? targetIdx : na.length, 0, word);
        return na;
      });
    } else if (dragItem.area === "slot" && targetArea === "bank") {
      const word = arranged[dragItem.idx];
      setArranged(a => a.filter((_,i) => i !== dragItem.idx));
      setBank(b => [...b, word]);
    } else if (dragItem.area === "slot" && targetArea === "slot") {
      setArranged(a => {
        const na = [...a];
        const [moved] = na.splice(dragItem.idx, 1);
        na.splice(targetIdx, 0, moved);
        return na;
      });
    }
    setDragItem(null); setDragOver(null);
  };

  const bgCard = dark ? "rgba(30,41,59,0.95)" : "#FFFFFF";
  const ACC = "#4338CA";

  // Hint: show first correct word
  const hintWord = q?.answer[arranged.length] || null;

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:isMob?"12px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif", userSelect:"none" }}>
      {/* Celebration particles */}
      {celebrate && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:999 }}>
          {Array.from({length:16}).map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              left: `${10+i*5.5}%`, top:"30%",
              fontSize: 20+Math.random()*16,
              animation:`baFall ${0.8+Math.random()*0.8}s ease-out forwards`,
              animationDelay:`${i*0.05}s`,
              opacity:1,
            }}>
              {["🎉","⭐","✨","🌟","💫","🎊"][i%6]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1E1B4B,#3730A3,#4338CA)", borderRadius:24, padding:isMob?"18px":"24px 32px", color:"white", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:100, opacity:0.07 }}>🎮</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>GAME · SENTENCE BUILDER</div>
        <div style={{ fontSize:isMob?20:24, fontWeight:900, marginBottom:10 }}>{"🎮 Xây Câu Tiếng Nhật"}</div>
        {/* Score row */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[{v:`${score.correct}/${score.total}`, l:"Điểm", ic:"✅"},{v:`${score.total>0?Math.round(score.correct/score.total*100):0}%`, l:"Tỷ lệ", ic:"📊"},{v:filtered.length, l:"Câu/cấp", ic:"📋"}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700 }}>{s.ic} {s.v} <span style={{ opacity:0.7 }}>{s.l}</span></div>
          ))}
        </div>
      </div>

      {/* Level tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {["N5","N4","N3","N2"].map(lv => (
          <button key={lv} onClick={()=>{ setLevelFilter(lv); setQIdx(0); }}
            style={{ padding:"8px 18px", borderRadius:20, border:`2px solid ${levelFilter===lv?LEVEL_COLOR[lv]:"transparent"}`,
              background:levelFilter===lv?LEVEL_COLOR[lv]+"22":(dark?"rgba(30,41,59,0.7)":"rgba(241,245,249,0.9)"),
              color:levelFilter===lv?LEVEL_COLOR[lv]:CC.muted, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {lv} <span style={{ opacity:0.65, fontSize:11 }}>({SB_SENTENCES.filter(s=>s.level===lv).length})</span>
          </button>
        ))}
      </div>

      {/* Question card */}
      <div style={{ background:bgCard, borderRadius:22, border:`1.5px solid ${dark?"rgba(99,102,241,0.25)":"rgba(99,102,241,0.15)"}`, overflow:"hidden",
        boxShadow:dark?"0 8px 32px rgba(0,0,0,0.4)":"0 8px 32px rgba(99,102,241,0.1)", marginBottom:14 }}>

        {/* Progress bar */}
        <div style={{ height:4, background:dark?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#4338CA,#6366F1)", width:`${((qIdx%filtered.length)+1)/filtered.length*100}%`, transition:"width 0.4s" }}/>
        </div>

        <div style={{ padding:isMob?"16px":"24px" }}>
          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:CC.muted, fontWeight:700 }}>Câu {(qIdx%filtered.length)+1}/{filtered.length}</span>
              <span style={{ fontSize:11, background:LEVEL_BG[levelFilter], color:LEVEL_COLOR[levelFilter], padding:"3px 10px", borderRadius:20, fontWeight:800 }}>{levelFilter}</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {!checked && (
                <button onClick={()=>setHint(v=>!v)} title="Gợi ý"
                  style={{ width:34, height:34, borderRadius:10, border:`1px solid rgba(245,158,11,0.4)`, background:hint?"rgba(245,158,11,0.15)":"transparent",
                    color:"#D97706", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>💡</button>
              )}
              <button onClick={()=>playSentence(checked?q.answer.join(""):arranged.join(""))} disabled={playing}
                style={{ width:34, height:34, borderRadius:10, border:`1px solid rgba(99,102,241,0.35)`, background:playing?"rgba(99,102,241,0.15)":"transparent",
                  color:ACC, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {playing?"🔊":"▶"}
              </button>
            </div>
          </div>

          {/* Hint banner */}
          {hint && hintWord && !checked && (
            <div style={{ background:"rgba(245,158,11,0.1)", border:"1.5px solid rgba(245,158,11,0.3)", borderRadius:12, padding:"8px 14px", marginBottom:14, fontSize:13, color:"#D97706", fontWeight:700 }}>
              💡 Từ tiếp theo: <span style={{ fontSize:17, fontFamily:"'Noto Sans JP',sans-serif" }}>{hintWord}</span>
            </div>
          )}

          {/* Answer slots (drop zone) */}
          <div style={{ fontSize:11, color:CC.muted, fontWeight:700, marginBottom:8 }}>📥 KHU VỰC SẮP XẾP — bấm từ hoặc kéo thả:</div>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver("slot");}}
            onDrop={e=>{e.preventDefault();onDrop("slot", arranged.length);}}
            style={{ minHeight:70, border:`2px ${checked?(isCorrect?"solid #10B981":"solid #EF4444"):"dashed rgba(99,102,241,0.45)"}`,
              borderRadius:16, padding:"12px 14px", marginBottom:16, display:"flex", flexWrap:"wrap", gap:8, alignItems:"center",
              background:checked?(isCorrect?dark?"rgba(16,185,129,0.08)":"rgba(240,253,244,0.95)":dark?"rgba(239,68,68,0.08)":"rgba(254,242,242,0.95)"):
                dragOver==="slot"?dark?"rgba(99,102,241,0.12)":"rgba(238,242,255,0.95)":dark?"rgba(15,23,42,0.4)":"rgba(248,250,252,0.9)",
              transition:"all 0.25s",
              animation:shake?"sbShake 0.5s ease-in-out":celebrate?"sbPop 0.4s ease-out":"none",
            }}>
            {arranged.length === 0 && (
              <span style={{ color:CC.muted, fontSize:13, opacity:0.5, pointerEvents:"none" }}>
                {isMob?"← Bấm từ bên dưới để xếp":"← Kéo thả hoặc bấm từ bên dưới"}
              </span>
            )}
            {arranged.map((word, i) => (
              <button key={i}
                draggable={!checked}
                onDragStart={()=>onDragStart("slot",i,word)}
                onDragEnd={onDragEnd}
                onDragOver={e=>{e.preventDefault();setDragOver(`slot-${i}`);}}
                onDrop={e=>{e.preventDefault();onDrop("slot",i);}}
                onClick={()=>returnToBank(i)}
                style={{ padding:"9px 16px", borderRadius:12,
                  border:`2px solid ${checked?(isCorrect?"rgba(16,185,129,0.5)":"rgba(239,68,68,0.45)"):dragOver===`slot-${i}`?"rgba(99,102,241,0.8)":"rgba(99,102,241,0.4)"}`,
                  background:checked?(isCorrect?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.12)"):
                    dragItem?.area==="slot"&&dragItem?.idx===i?"rgba(99,102,241,0.05)":"linear-gradient(135deg,rgba(99,102,241,0.14),rgba(67,56,202,0.08))",
                  color:dark?"#C7D2FE":CC.text, fontSize:isMob?16:18, fontWeight:900, cursor:checked?"default":"grab",
                  fontFamily:"'Noto Sans JP',sans-serif", transition:"all 0.15s",
                  boxShadow:checked?"none":`0 2px 10px rgba(99,102,241,0.18)`,
                  transform:dragItem?.area==="slot"&&dragItem?.idx===i?"scale(0.96)":"scale(1)" }}>
                {word}
              </button>
            ))}
          </div>

          {/* Word bank */}
          <div style={{ fontSize:11, color:CC.muted, fontWeight:700, marginBottom:8 }}>🃏 TỪ NGÂN HÀNG:</div>
          <div
            onDragOver={e=>{e.preventDefault();setDragOver("bank");}}
            onDrop={e=>{e.preventDefault();onDrop("bank",-1);}}
            style={{ minHeight:54, display:"flex", flexWrap:"wrap", gap:8, padding:"10px", borderRadius:14,
              background:dragOver==="bank"?dark?"rgba(148,163,184,0.12)":"rgba(241,245,249,0.8)":dark?"rgba(15,23,42,0.25)":"rgba(248,250,252,0.8)",
              border:`1.5px dashed ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.3)"}`,
              marginBottom:16, transition:"background 0.2s" }}>
            {bank.length===0 && !checked && (
              <span style={{ color:CC.muted, fontSize:12, opacity:0.5 }}>Tất cả từ đã được đặt ✓</span>
            )}
            {bank.map((word, i) => (
              <button key={i}
                draggable={!checked}
                onDragStart={()=>onDragStart("bank",i,word)}
                onDragEnd={onDragEnd}
                onClick={()=>pickFromBank(i)}
                style={{ padding:"9px 16px", borderRadius:12,
                  border:`1.5px solid ${dark?"rgba(148,163,184,0.3)":"rgba(100,116,139,0.25)"}`,
                  background:dark?"rgba(30,41,59,0.95)":"rgba(255,255,255,0.95)",
                  color:dark?"#E2E8F0":CC.text, fontSize:isMob?16:18, fontWeight:800, cursor:"grab",
                  fontFamily:"'Noto Sans JP',sans-serif", transition:"all 0.15s",
                  boxShadow:dark?"0 2px 8px rgba(0,0,0,0.3)":"0 2px 8px rgba(0,0,0,0.06)",
                  opacity: dragItem?.area==="bank"&&dragItem?.idx===i?0.4:1 }}>
                {word}
              </button>
            ))}
          </div>

          {/* Actions */}
          {!checked ? (
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={clearSlots}
                style={{ width:44, height:44, borderRadius:12, border:`1px solid rgba(239,68,68,0.3)`,
                  background:"transparent", color:"#EF4444", cursor:"pointer", fontSize:18,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>🗑</button>
              <button onClick={checkAnswer} disabled={arranged.length===0}
                style={{ flex:1, padding:"12px", borderRadius:14, border:"none",
                  cursor:arranged.length===0?"not-allowed":"pointer",
                  background:arranged.length===0?"rgba(148,163,184,0.2)":"linear-gradient(135deg,#4338CA,#6366F1)",
                  color:arranged.length===0?CC.muted:"white", fontSize:14, fontWeight:800,
                  fontFamily:"'Nunito',sans-serif", boxShadow:arranged.length>0?"0 4px 16px rgba(99,102,241,0.4)":"none",
                  transition:"all 0.2s" }}>
                ✅ Kiểm tra câu
              </button>
            </div>
          ) : (
            <div>
              {/* Result */}
              <div style={{ borderRadius:16, padding:"16px", marginBottom:14,
                background:isCorrect?"linear-gradient(135deg,rgba(16,185,129,0.14),rgba(5,150,105,0.08))":"linear-gradient(135deg,rgba(239,68,68,0.12),rgba(220,38,38,0.06))",
                border:`2px solid ${isCorrect?"rgba(16,185,129,0.45)":"rgba(239,68,68,0.35)"}` }}>
                <div style={{ fontSize:18, fontWeight:900, color:isCorrect?"#10B981":"#EF4444", marginBottom:10 }}>
                  {isCorrect ? "🎉 Chính xác!" : "❌ Chưa đúng — xem đáp án"}
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                  <div style={{ fontSize:16, fontWeight:900, color:isCorrect?"#10B981":"#EF4444", fontFamily:"'Noto Sans JP',sans-serif" }}>
                    {q.answer.join(" ")}
                  </div>
                  <button onClick={()=>playSentence(q.answer.join(""))} disabled={playing}
                    style={{ width:30, height:30, borderRadius:8, border:`1px solid ${isCorrect?"rgba(16,185,129,0.4)":"rgba(239,68,68,0.3)"}`,
                      background:"transparent", color:isCorrect?"#10B981":"#EF4444",
                      cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {playing?"🔊":"▶"}
                  </button>
                </div>
                <div style={{ fontSize:13, color:CC.muted }}>🇻🇳 {q.vn}</div>
              </div>

              {/* Grammar toggle */}
              <button onClick={()=>setShowExplain(v=>!v)}
                style={{ width:"100%", padding:"9px", borderRadius:12, border:"1.5px solid rgba(124,58,237,0.3)",
                  background:showExplain?"rgba(124,58,237,0.1)":"transparent",
                  color:"#A855F7", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", marginBottom:10 }}>
                {showExplain?"🙈 Ẩn giải thích":"📖 Xem giải thích ngữ pháp"}
              </button>
              {showExplain && (
                <div style={{ background:dark?"rgba(124,58,237,0.08)":"rgba(245,243,255,0.9)", border:"1.5px solid rgba(124,58,237,0.25)", borderRadius:12, padding:"14px", marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:"#A855F7", marginBottom:6 }}>📖 GIẢI THÍCH NGỮ PHÁP</div>
                  <div style={{ fontSize:13, color:dark?"#DDD6FE":"#4C1D95", lineHeight:1.75 }}>{q.grammar}</div>
                  {q.tags?.length > 0 && (
                    <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
                      {q.tags.map(t=><span key={t} style={{ fontSize:11, background:"rgba(124,58,237,0.14)", color:"#A855F7", padding:"3px 10px", borderRadius:20, fontWeight:700 }}>#{t}</span>)}
                    </div>
                  )}
                </div>
              )}
              <button onClick={nextQ}
                style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
                  background:"linear-gradient(135deg,#4338CA,#6366F1)", color:"white", fontSize:14, fontWeight:800,
                  fontFamily:"'Nunito',sans-serif", boxShadow:"0 4px 20px rgba(99,102,241,0.4)" }}>
                Câu tiếp → ({((qIdx+1)%filtered.length)+1}/{filtered.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS keyframes for animations */}
      <style>{`
        @keyframes sbShake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
        }
        @keyframes sbPop {
          0%{transform:scale(1)} 50%{transform:scale(1.02)} 100%{transform:scale(1)}
        }
        @keyframes baFall {
          0%{transform:translateY(0) rotate(0deg);opacity:1}
          100%{transform:translateY(60vh) rotate(360deg);opacity:0}
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STUDY GROUP PAGE — Shared leaderboard + Quiz battles
// ════════════════════════════════════════════════════════════════
function StudyGroupPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [tab, setTab]           = useState("board"); // "board"|"quiz"|"create"
  const [nickname, setNickname] = useState(() => localStorage.getItem("sp_nickname") || "");
  const [nicknameInput, setNicknameInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [quizQ, setQuizQ]       = useState(null);
  const [quizAns, setQuizAns]   = useState(null);
  const [quizScore, setQuizScore] = useState({correct:0,total:0});
  const [battleMsg, setBattleMsg] = useState("");

  // Local stats to submit
  const myStats = (() => {
    try {
      const streak = JSON.parse(localStorage.getItem("sp_streak_v2") || "null");
      const kanji  = Object.keys(JSON.parse(localStorage.getItem("sp_kanji_stats") || "{}")).length;
      const vocab  = Object.keys(JSON.parse(localStorage.getItem("sp_card_stats") || "{}")).length;
      const us     = JSON.parse(localStorage.getItem("sp_user_stats") || "{}");
      return {
        streak: streak?.streak || 0,
        kanji,
        vocab,
        lessons: us.sentenceGames || 0,
        score: (streak?.streak||0)*10 + kanji*3 + vocab*2 + (us.sentenceGames||0)*5
      };
    } catch { return {streak:0,kanji:0,vocab:0,lessons:0,score:0}; }
  })();

  // Load leaderboard from shared storage (Anthropic persistent storage)
  const loadBoard = async () => {
    setLoading(true);
    try {
      const res = await window.storage.list("sg_player_", true);
      const keys = res?.keys || [];
      const entries = await Promise.all(keys.slice(-30).map(async k => {
        try {
          const r = await window.storage.get(k, true);
          return r ? JSON.parse(r.value) : null;
        } catch { return null; }
      }));
      const valid = entries.filter(Boolean).sort((a,b)=>b.score-a.score);
      setLeaderboard(valid);
    } catch { setLeaderboard([]); }
    setLoading(false);
  };

  useEffect(() => { loadBoard(); }, []);

  const submitScore = async () => {
    const name = nicknameInput.trim();
    if (!name) return;
    setSubmitting(true);
    try {
      const key = `sg_player_${name.replace(/\s+/g,"_").slice(0,20)}`;
      const entry = { name, ...myStats, updatedAt: new Date().toISOString() };
      await window.storage.set(key, JSON.stringify(entry), true);
      localStorage.setItem("sp_nickname", name);
      setNickname(name);
      setNicknameInput("");
      await loadBoard();
    } catch {}
    setSubmitting(false);
  };

  // Quick vocab battle quiz
  const BATTLE_QUESTIONS = [
    {jp:"努力",opts:["Nỗ lực","Nghỉ ngơi","Thành công","Thất bại"],ans:0},
    {jp:"素晴らしい",opts:["Buồn","Tuyệt vời","Bình thường","Khó khăn"],ans:1},
    {jp:"感謝",opts:["Tức giận","Thất vọng","Biết ơn","Ngạc nhiên"],ans:2},
    {jp:"挑戦",opts:["Từ bỏ","Thách thức","Nghỉ ngơi","Lo lắng"],ans:1},
    {jp:"自信",opts:["Xấu hổ","Sợ hãi","Tự tin","Buồn bã"],ans:2},
    {jp:"丁寧",opts:["Cẩn thận/Lịch sự","Tức giận","Nhanh nhẹn","Cẩu thả"],ans:0},
    {jp:"可能",opts:["Không thể","Có thể","Khó khăn","Không rõ"],ans:1},
    {jp:"必要",opts:["Không quan trọng","Cần thiết","Có thể","Nguy hiểm"],ans:1},
    {jp:"経験",opts:["Kinh nghiệm","Tương lai","Lý thuyết","Kế hoạch"],ans:0},
    {jp:"目標",opts:["Kết quả","Mục tiêu","Phương pháp","Tiến trình"],ans:1},
  ];
  const startBattle = () => {
    setTab("quiz");
    setQuizQ(BATTLE_QUESTIONS[Math.floor(Math.random()*BATTLE_QUESTIONS.length)]);
    setQuizAns(null);
    setBattleMsg("");
  };
  const answerBattle = (idx) => {
    if (quizAns !== null) return;
    setQuizAns(idx);
    const correct = idx === quizQ.ans;
    setQuizScore(s=>({correct:s.correct+(correct?1:0), total:s.total+1}));
    setBattleMsg(correct?"🎉 Chính xác! +10 điểm":"❌ Sai rồi, cố lên!");
    setTimeout(() => {
      const next = BATTLE_QUESTIONS[Math.floor(Math.random()*BATTLE_QUESTIONS.length)];
      setQuizQ(next); setQuizAns(null); setBattleMsg("");
    }, 1200);
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const RANK_ICONS = ["🥇","🥈","🥉"];

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#064E3B,#065F46,#059669)", borderRadius:24, padding:isMob?"18px":"24px 32px", color:"white", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>👥</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>STUDY GROUP · NHÓM HỌC</div>
        <div style={{ fontSize:isMob?20:24, fontWeight:900, marginBottom:6 }}>{"👥 Bảng Xếp Hạng Cộng Đồng"}</div>
        <div style={{ fontSize:13, opacity:0.85 }}>Chia sẻ điểm số · Thi đua từ vựng · Cộng đồng học tiếng Nhật</div>
        <div style={{ fontSize:11, opacity:0.65, marginTop:6 }}>⚠️ Điểm số và tên của bạn sẽ hiển thị công khai với tất cả người dùng.</div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[{id:"board",l:"🏆 Bảng xếp hạng"},{id:"quiz",l:"⚔️ Thi đấu từ vựng"},{id:"create",l:"📤 Cập nhật điểm"}].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)}
            style={{ padding:"9px 16px", borderRadius:20, border:"none",
              background:tab===t.id?"linear-gradient(135deg,#059669,#10B981)":"transparent",
              color:tab===t.id?"white":CC.muted, fontSize:isMob?12:13, fontWeight:800, cursor:"pointer",
              fontFamily:"'Nunito',sans-serif", boxShadow:tab===t.id?"0 3px 12px rgba(5,150,105,0.4)":"none" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* LEADERBOARD TAB */}
      {tab==="board" && (
        <div>
          {/* My stats card */}
          <div style={{ background:"linear-gradient(135deg,rgba(5,150,105,0.12),rgba(16,185,129,0.08))", border:"2px solid rgba(5,150,105,0.25)", borderRadius:18, padding:"16px 20px", marginBottom:18 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#059669", marginBottom:10 }}>📊 ĐIỂM CỦA BẠN</div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?3:5},1fr)`, gap:10 }}>
              {[{v:myStats.streak,l:"Streak",ic:"🔥"},{v:myStats.kanji,l:"Kanji",ic:"🈶"},{v:myStats.vocab,l:"Từ vựng",ic:"📚"},{v:myStats.lessons,l:"Bài học",ic:"✅"},{v:myStats.score,l:"Tổng điểm",ic:"⭐"}].map((s,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, color:CC.muted }}>{s.ic} {s.l}</div>
                  <div style={{ fontSize:18, fontWeight:900, color:"#059669" }}>{s.v}</div>
                </div>
              ))}
            </div>
            {nickname && <div style={{ fontSize:12, color:"#059669", fontWeight:700, marginTop:8 }}>👤 Tên: {nickname}</div>}
          </div>

          {/* Leaderboard */}
          <div style={{ background:bgCard, borderRadius:20, border:`1px solid ${dark?"rgba(5,150,105,0.2)":"rgba(5,150,105,0.12)"}`, overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${dark?"rgba(5,150,105,0.15)":"rgba(5,150,105,0.1)"}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#059669" }}>🏆 TOP NGƯỜI HỌC</div>
              <button onClick={loadBoard} style={{ background:"none", border:"none", color:CC.muted, cursor:"pointer", fontSize:13 }}>🔄 Tải lại</button>
            </div>
            {loading ? (
              <div style={{ padding:"32px", textAlign:"center", color:CC.muted }}>⏳ {t.loading}</div>
            ) : leaderboard.length === 0 ? (
              <div style={{ padding:"32px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>👥</div>
                <div style={{ fontSize:14, color:CC.muted }}>Chưa có ai đăng ký — hãy là người đầu tiên!</div>
              </div>
            ) : leaderboard.map((p,i)=>(
              <div key={i} style={{ padding:"14px 20px", borderBottom:i<leaderboard.length-1?`1px solid ${dark?"rgba(148,163,184,0.1)":"rgba(148,163,184,0.1)"}`:""  ,
                background:p.name===nickname?(dark?"rgba(5,150,105,0.12)":"rgba(240,253,250,0.9)"):"transparent",
                display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, textAlign:"center", fontSize:20, fontWeight:900 }}>
                  {i<3?RANK_ICONS[i]:`${i+1}`}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:14, color:dark?"#E2E8F0":CC.text }}>
                    {p.name} {p.name===nickname&&<span style={{fontSize:11,color:"#059669"}}>(bạn)</span>}
                  </div>
                  <div style={{ fontSize:11, color:CC.muted }}>🔥{p.streak} streak · 🈶{p.kanji} kanji · 📚{p.vocab} từ</div>
                </div>
                <div style={{ fontWeight:900, fontSize:18, color:i===0?"#D97706":i===1?"#64748B":i===2?"#B45309":"#059669" }}>
                  {p.score}<span style={{fontSize:10,fontWeight:600,opacity:0.7}}>pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUIZ BATTLE TAB */}
      {tab==="quiz" && (
        <div style={{ maxWidth:540, margin:"0 auto" }}>
          <div style={{ background:bgCard, borderRadius:22, padding:"24px", border:`1px solid ${dark?"rgba(5,150,105,0.2)":"rgba(5,150,105,0.12)"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#059669" }}>⚔️ Thi đấu từ vựng</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#059669" }}>✅ {quizScore.correct}/{quizScore.total}</div>
            </div>
            {!quizQ ? (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>⚔️</div>
                <div style={{ fontSize:15, color:CC.muted, marginBottom:20 }}>Trả lời nhanh 10 câu từ vựng để tranh tài!</div>
                <button onClick={startBattle}
                  style={{ padding:"13px 36px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#059669,#10B981)",
                    color:"white", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif",
                    boxShadow:"0 4px 20px rgba(5,150,105,0.4)" }}>
                  🚀 Bắt đầu thi đấu
                </button>
              </div>
            ) : (
              <div>
                <div style={{ textAlign:"center", marginBottom:20 }}>
                  <div style={{ fontSize:36, fontWeight:900, fontFamily:"'Noto Sans JP',sans-serif", color:"#059669", marginBottom:6 }}>{quizQ.jp}</div>
                  <div style={{ fontSize:13, color:CC.muted }}>Chọn nghĩa đúng:</div>
                </div>
                {battleMsg && (
                  <div style={{ textAlign:"center", fontSize:16, fontWeight:800,
                    color:battleMsg.startsWith("🎉")?"#10B981":"#EF4444", marginBottom:14 }}>
                    {battleMsg}
                  </div>
                )}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {quizQ.opts.map((opt,j)=>{
                    const chosen=quizAns===j, correct=j===quizQ.ans, show=quizAns!==null;
                    return (
                      <button key={j} onClick={()=>answerBattle(j)}
                        style={{ padding:"13px 16px", borderRadius:14, cursor:quizAns!==null?"default":"pointer",
                          border:`2px solid ${show&&correct?"#10B981":show&&chosen?"#EF4444":"rgba(5,150,105,0.25)"}`,
                          background:show&&correct?"rgba(16,185,129,0.12)":show&&chosen?"rgba(239,68,68,0.08)":"transparent",
                          color:dark?"#E2E8F0":CC.text, fontSize:14, fontWeight:600, fontFamily:"'Nunito',sans-serif",
                          textAlign:"left", transition:"all 0.15s" }}>
                        {show&&correct?"✅ ":show&&chosen?"❌ ":""}{opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBMIT SCORE TAB */}
      {tab==="create" && (
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          <div style={{ background:bgCard, borderRadius:22, padding:"24px", border:`1px solid ${dark?"rgba(5,150,105,0.2)":"rgba(5,150,105,0.12)"}` }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#059669", marginBottom:16 }}>📤 Đăng điểm lên bảng xếp hạng</div>
            <div style={{ background:dark?"rgba(5,150,105,0.1)":"rgba(240,253,250,0.9)", borderRadius:14, padding:"14px", marginBottom:18 }}>
              {[{l:"🔥 "+t.navStreak,v:myStats.streak},{l:"🈶 Kanji học được",v:myStats.kanji},{l:"📚 Từ vựng",v:myStats.vocab},{l:"⭐ Tổng điểm",v:myStats.score}].map((s,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:13 }}>
                  <span style={{ color:CC.muted }}>{s.l}</span>
                  <span style={{ fontWeight:800, color:"#059669" }}>{s.v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, color:CC.muted, marginBottom:6 }}>Biệt danh của bạn (hiển thị công khai):</div>
            <input value={nicknameInput} onChange={e=>setNicknameInput(e.target.value)}
              placeholder={nickname||"Nhập tên..."}
              style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1.5px solid ${dark?"rgba(5,150,105,0.3)":"rgba(5,150,105,0.25)"}`,
                background:dark?"rgba(15,23,42,0.5)":"rgba(248,250,252,0.9)",
                color:dark?"#E2E8F0":CC.text, fontSize:14, fontFamily:"'Nunito',sans-serif",
                outline:"none", boxSizing:"border-box", marginBottom:14 }}/>
            <button onClick={submitScore} disabled={!nicknameInput.trim()||submitting}
              style={{ width:"100%", padding:"13px", borderRadius:14, border:"none",
                background:nicknameInput.trim()?"linear-gradient(135deg,#059669,#10B981)":"rgba(148,163,184,0.2)",
                color:nicknameInput.trim()?"white":CC.muted, fontSize:14, fontWeight:800,
                cursor:nicknameInput.trim()?"pointer":"not-allowed", fontFamily:"'Nunito',sans-serif",
                boxShadow:nicknameInput.trim()?"0 4px 20px rgba(5,150,105,0.4)":"none" }}>
              {submitting?"⏳ Đang gửi...":"📤 Đăng lên bảng xếp hạng"}
            </button>
            {nickname && <div style={{ textAlign:"center", marginTop:12, fontSize:12, color:"#059669" }}>Tên hiện tại: <strong>{nickname}</strong></div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// STUDY TIMER PAGE — Pomodoro 25/5 + ghi heatmap
// ════════════════════════════════════════════════════════════════
function StudyTimerPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const WORK_MIN = 25, BREAK_MIN = 5;

  const [mode, setMode]         = useState("work"); // "work"|"break"
  const [seconds, setSeconds]   = useState(WORK_MIN * 60);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(() => {
    try { const s=JSON.parse(localStorage.getItem("sp_timer_today")||"{}"); return s.date===new Date().toDateString()?s.sessions:0; } catch { return 0; }
  });
  const [totalMins, setTotalMins] = useState(() => {
    try { const s=JSON.parse(localStorage.getItem("sp_timer_today")||"{}"); return s.date===new Date().toDateString()?s.totalMins:0; } catch { return 0; }
  });
  const [completed, setCompleted] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const SUGGESTIONS = [
    {icon:"🧠",text:"Ôn 10 flashcard SRS hôm nay",page:"flashcard",color:"#7C3AED"},
    {icon:"✍️",text:"Luyện viết 3 Kanji mới",page:"kanji",color:"#4338CA"},
    {icon:"📝",text:"Học 3 mẫu ngữ pháp N4",page:"grammar",color:"#059669"},
    {icon:"⚡",text:"Làm 3 mini-lesson 1 phút",page:"mini",color:"#DC2626"},
    {icon:"📰",text:"Đọc 1 bài tin tức tiếng Nhật",page:"news",color:"#0EA5E9"},
    {icon:"💬",text:"Chat AI 1 tình huống thực tế",page:"chat",color:"#0EA5E9"},
    {icon:"🎮",text:"Chơi 5 câu game ghép từ",page:"game",color:"#4F46E5"},
  ];

  const intervalRef = React.useRef(null);

  const tick = React.useCallback(() => {
    setSeconds(s => {
      if (s <= 1) {
        // Session complete
        if (mode === "work") {
          // Ring bell
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 880; osc.type = "sine";
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc.start(); osc.stop(ctx.currentTime + 1.5);
          } catch {}
          const newSessions = sessions + 1;
          const newMins = totalMins + WORK_MIN;
          setSessions(newSessions);
          setTotalMins(newMins);
          localStorage.setItem("sp_timer_today", JSON.stringify({date:new Date().toDateString(), sessions:newSessions, totalMins:newMins}));
          // Write to heatmap
          try {
            const hmap = JSON.parse(localStorage.getItem("sp_heatmap") || "{}");
            const today = new Date().toISOString().slice(0,10);
            hmap[today] = Math.min(4, (hmap[today]||0)+1);
            localStorage.setItem("sp_heatmap", JSON.stringify(hmap));
          } catch {}
          setMode("break");
          setCompleted(true);
          setSuggestion(SUGGESTIONS[Math.floor(Math.random()*SUGGESTIONS.length)]);
          setRunning(false);
          return BREAK_MIN * 60;
        } else {
          setMode("work");
          setCompleted(false);
          setRunning(false);
          return WORK_MIN * 60;
        }
      }
      return s - 1;
    });
  }, [mode, sessions, totalMins]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const toggle = () => setRunning(r => !r);
  const reset = () => {
    setRunning(false);
    setSeconds(mode === "work" ? WORK_MIN*60 : BREAK_MIN*60);
    setCompleted(false);
  };
  const switchMode = (m) => {
    setRunning(false);
    setMode(m);
    setSeconds(m==="work" ? WORK_MIN*60 : BREAK_MIN*60);
    setCompleted(false);
  };

  const mins = Math.floor(seconds/60);
  const secs = seconds % 60;
  const pct = mode==="work" ? 1 - seconds/(WORK_MIN*60) : 1 - seconds/(BREAK_MIN*60);
  const radius = isMob ? 100 : 120;
  const circ = 2 * Math.PI * radius;
  const WORK_COLOR = "#4338CA";
  const BREAK_COLOR = "#10B981";
  const cc = mode==="work" ? WORK_COLOR : BREAK_COLOR;

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";

  return (
    <div style={{ maxWidth:660, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b,#3730a3,#4338ca)", borderRadius:24, padding:isMob?"18px":"24px 32px", color:"white", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-15, right:-10, fontSize:120, opacity:0.07 }}>⏱</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>STUDY TIMER · POMODORO</div>
        <div style={{ fontSize:isMob?20:24, fontWeight:900, marginBottom:8 }}>{"⏱ Timer Học Tập"}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[{v:sessions,l:"Phiên hôm nay",ic:"🍅"},{v:`${totalMins}p`,l:"Tổng học",ic:"⏱"},{v:`${Math.round(totalMins/60*10)/10}h`,l:"Giờ học",ic:"📊"}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700 }}>
              {s.ic} {s.v} <span style={{ opacity:0.7 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mode switcher */}
      <div style={{ display:"flex", gap:8, marginBottom:20, justifyContent:"center" }}>
        {[{id:"work",l:"🍅 Học (25p)"},{id:"break",l:"☕ Nghỉ (5p)"}].map(m=>(
          <button key={m.id} onClick={()=>switchMode(m.id)}
            style={{ padding:"10px 24px", borderRadius:20, border:"none",
              background:mode===m.id?cc:"transparent",
              color:mode===m.id?"white":CC.muted, fontSize:14, fontWeight:800,
              cursor:"pointer", fontFamily:"'Nunito',sans-serif",
              boxShadow:mode===m.id?`0 4px 16px ${cc}55`:"none",
              border:mode!==m.id?`2px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.2)"}`:undefined }}>
            {m.l}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ position:"relative", display:"inline-block" }}>
          <svg width={isMob?240:280} height={isMob?240:280} style={{ transform:"rotate(-90deg)" }}>
            {/* Background ring */}
            <circle cx={isMob?120:140} cy={isMob?120:140} r={radius} fill="none"
              stroke={dark?"rgba(99,102,241,0.12)":"rgba(99,102,241,0.08)"} strokeWidth={isMob?14:16}/>
            {/* Progress ring */}
            <circle cx={isMob?120:140} cy={isMob?120:140} r={radius} fill="none"
              stroke={cc} strokeWidth={isMob?14:16}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1-pct)}
              strokeLinecap="round"
              style={{ transition:"stroke-dashoffset 1s linear, stroke 0.4s" }}/>
          </svg>
          {/* Center text */}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
            <div style={{ fontSize:isMob?46:54, fontWeight:900, color:cc, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
              {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
            </div>
            <div style={{ fontSize:13, color:CC.muted, fontWeight:700, marginTop:4 }}>
              {mode==="work"?"🍅 Tập trung học":"☕ Nghỉ ngơi"}
            </div>
            {running && (
              <div style={{ fontSize:11, color:cc, marginTop:4, animation:"timerPulse 1.5s infinite" }}>● đang chạy</div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:20 }}>
        <button onClick={reset}
          style={{ width:50, height:50, borderRadius:16, border:`1.5px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.25)"}`,
            background:"transparent", color:CC.muted, cursor:"pointer", fontSize:20,
            display:"flex", alignItems:"center", justifyContent:"center" }}>⏮</button>
        <button onClick={toggle}
          style={{ width:isMob?120:140, height:56, borderRadius:18, border:"none",
            background:`linear-gradient(135deg,${cc},${cc}cc)`, color:"white",
            cursor:"pointer", fontSize:isMob?15:16, fontWeight:900, fontFamily:"'Nunito',sans-serif",
            boxShadow:`0 6px 24px ${cc}55`, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {running ? <><span style={{fontSize:20}}>⏸</span> Dừng</> : <><span style={{fontSize:20}}>▶</span> {seconds===(mode==="work"?WORK_MIN:BREAK_MIN)*60?t.start:"Tiếp tục"}</>}
        </button>
        <button onClick={()=>switchMode(mode==="work"?"break":"work")}
          style={{ width:50, height:50, borderRadius:16, border:`1.5px solid ${dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.25)"}`,
            background:"transparent", color:CC.muted, cursor:"pointer", fontSize:20,
            display:"flex", alignItems:"center", justifyContent:"center" }}>⏭</button>
      </div>

      {/* Completed banner */}
      {completed && (
        <div style={{ background:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.1))",
          border:"2px solid rgba(16,185,129,0.4)", borderRadius:18, padding:"18px 20px", marginBottom:16, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#10B981", marginBottom:4 }}>
            {`Hoàn thành phiên học #${sessions}!`}
          </div>
          <div style={{ fontSize:13, color:CC.muted }}>Hãy nghỉ 5 phút rồi tiếp tục nhé 💪</div>
        </div>
      )}

      {/* Suggestions */}
      <div style={{ background:bgCard, borderRadius:20, padding:"18px 20px", border:`1px solid ${dark?"rgba(99,102,241,0.2)":"rgba(99,102,241,0.12)"}` }}>
        <div style={{ fontSize:12, fontWeight:800, color:"#4338CA", marginBottom:14 }}>
          💡 GỢI Ý CHO PHIÊN HỌC NÀY
        </div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?1:2},1fr)`, gap:8 }}>
          {SUGGESTIONS.slice(0,isMob?4:6).map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              background:dark?"rgba(15,23,42,0.4)":"rgba(248,250,252,0.9)", borderRadius:12,
              border:`1px solid ${dark?s.color+"18":s.color+"14"}`,
              cursor:"pointer" }}
              onClick={()=>{ /* navigation not available here, user clicks nav */ }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <div style={{ fontSize:12, color:dark?"#E2E8F0":CC.text, fontWeight:600, lineHeight:1.4 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pomodoro info */}
      <div style={{ marginTop:16, background:dark?"rgba(99,102,241,0.08)":"rgba(238,242,255,0.8)", borderRadius:14, padding:"12px 16px", fontSize:12, color:CC.muted, lineHeight:1.7 }}>
        🍅 <strong>Pomodoro:</strong> Học tập trung 25 phút → nghỉ 5 phút → lặp lại. Sau 4 phiên, nghỉ dài 15-30 phút.
      </div>

      <style>{`
        @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}



// ════════════════════════════════════════════════════════════════
// ACHIEVEMENTS — Hệ thống thành tích + XP + Level
// ════════════════════════════════════════════════════════════════
const ACHIEVEMENTS_DEF = [
  { id:"first_step",    icon:"👣", title:"Bước Đầu Tiên",   desc:"Hoàn thành bài học đầu tiên",                 xp:50,   condition: s => s.totalLessons >= 1 },
  { id:"kana_hiragana", icon:"あ",  title:"Hiragana Master",  desc:"Học xong toàn bộ 46 Hiragana",               xp:100,  condition: s => (s.hiraganaScore||0) >= 80 },
  { id:"kana_katakana", icon:"ア",  title:"Katakana Master",  desc:"Học xong toàn bộ 46 Katakana",               xp:100,  condition: s => (s.katakanaScore||0) >= 80 },
  { id:"kanji_10",      icon:"🈚",  title:"Kanji Beginner",   desc:"Học 10 Kanji đầu tiên",                      xp:80,   condition: s => (s.kanjiLearned||0) >= 10 },
  { id:"kanji_50",      icon:"🈶",  title:"Kanji Explorer",   desc:"Học 50 Kanji",                               xp:200,  condition: s => (s.kanjiLearned||0) >= 50 },
  { id:"kanji_100",     icon:"🏯",  title:"Kanji Hunter",     desc:"Học 100 Kanji",                              xp:500,  condition: s => (s.kanjiLearned||0) >= 100 },
  { id:"vocab_50",      icon:"📖",  title:"Word Collector",   desc:"Học 50 từ vựng",                             xp:150,  condition: s => (s.vocabLearned||0) >= 50 },
  { id:"vocab_200",     icon:"📚",  title:"Vocabulary Master",desc:"Học 200 từ vựng",                            xp:400,  condition: s => (s.vocabLearned||0) >= 200 },
  { id:"streak_3",      icon:"🔥",  title:"On Fire!",         desc:"Học liên tiếp 3 ngày",                       xp:100,  condition: s => (s.streak||0) >= 3 },
  { id:"streak_7",      icon:"🌟",  title:"7 Day Streak",     desc:"Học liên tiếp 7 ngày",                       xp:300,  condition: s => (s.streak||0) >= 7 },
  { id:"streak_30",     icon:"💎",  title:"Monthly Master",   desc:"Học liên tiếp 30 ngày",                      xp:1000, condition: s => (s.streak||0) >= 30 },
  { id:"jlpt_n5",       icon:"🎌",  title:"JLPT N5 Warrior",  desc:"Hoàn thành kỳ thi thử JLPT N5",             xp:300,  condition: s => (s.jlptN5Done||0) >= 1 },
  { id:"jlpt_n4",       icon:"⛩️",  title:"JLPT N4 Warrior",  desc:"Hoàn thành kỳ thi thử JLPT N4",             xp:400,  condition: s => (s.jlptN4Done||0) >= 1 },
  { id:"listening_10",  icon:"🎧",  title:"Listening Starter",desc:"Hoàn thành 10 bài nghe",                    xp:120,  condition: s => (s.listeningDone||0) >= 10 },
  { id:"listening_50",  icon:"🎵",  title:"Listening Hero",   desc:"Hoàn thành 50 bài luyện nghe",              xp:400,  condition: s => (s.listeningDone||0) >= 50 },
  { id:"grammar_master",icon:"📝",  title:"Grammar Ace",      desc:"Trả lời đúng 30 câu ngữ pháp",              xp:250,  condition: s => (s.grammarCorrect||0) >= 30 },
  { id:"sentence_10",   icon:"🎮",  title:"Word Juggler",     desc:"Hoàn thành 10 game ghép câu",               xp:150,  condition: s => (s.sentenceGames||0) >= 10 },
  { id:"sentence_50",   icon:"🏆",  title:"Sentence Master",  desc:"Hoàn thành 50 game ghép câu",               xp:500,  condition: s => (s.sentenceGames||0) >= 50 },
  { id:"ai_chat_5",     icon:"💬",  title:"Conversation Starter",desc:"Hoàn thành 5 hội thoại AI",             xp:200,  condition: s => (s.aiChats||0) >= 5 },
  { id:"ai_chat_20",    icon:"🗣️",  title:"Fluent Speaker",   desc:"Hoàn thành 20 hội thoại AI",               xp:600,  condition: s => (s.aiChats||0) >= 20 },
];

const XP_LEVELS = [
  {lv:1,  xp:0,     title:"Beginner",         icon:"🌱"},
  {lv:2,  xp:100,   title:"Starter",          icon:"🌿"},
  {lv:3,  xp:250,   title:"Explorer",         icon:"⚡"},
  {lv:4,  xp:500,   title:"N5 Candidate",     icon:"🔰"},
  {lv:5,  xp:900,   title:"N5 Passer",        icon:"✅"},
  {lv:6,  xp:1400,  title:"N4 Seeker",        icon:"🎯"},
  {lv:7,  xp:2000,  title:"N4 Candidate",     icon:"📚"},
  {lv:8,  xp:2800,  title:"N4 Passer",        icon:"🎌"},
  {lv:9,  xp:3800,  title:"N3 Seeker",        icon:"⛩️"},
  {lv:10, xp:5000,  title:"JLPT Explorer",    icon:"🗺️"},
  {lv:15, xp:9000,  title:"Kanji Enthusiast", icon:"🈶"},
  {lv:20, xp:15000, title:"Grammar Master",   icon:"📖"},
  {lv:25, xp:23000, title:"N2 Candidate",     icon:"💡"},
  {lv:30, xp:35000, title:"Kanji Master",     icon:"🏯"},
];

function getLevel(xp) {
  let cur = XP_LEVELS[0];
  for (const l of XP_LEVELS) { if (xp >= l.xp) cur = l; else break; }
  const nextLv = XP_LEVELS.find(l => l.xp > xp);
  const progress = nextLv ? Math.round((xp - cur.xp) / (nextLv.xp - cur.xp) * 100) : 100;
  return { ...cur, nextXP: nextLv?.xp ?? cur.xp, progress };
}

function AchievementsPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [userStats, setUserStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_user_stats") || "{}"); } catch { return {}; }
  });
  const [unlocked, setUnlocked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_achievements") || "[]"); } catch { return []; }
  });
  const [tab, setTab] = useState("badges"); // "badges"|"level"
  const [newBadge, setNewBadge] = useState(null);

  // Compute XP from unlocked achievements
  const totalXP = unlocked.reduce((sum, id) => {
    const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
    return sum + (def?.xp || 0);
  }, 0);
  const levelInfo = getLevel(totalXP);

  // Check for new achievements
  useEffect(() => {
    const newlyUnlocked = ACHIEVEMENTS_DEF.filter(a =>
      !unlocked.includes(a.id) && a.condition(userStats)
    );
    if (newlyUnlocked.length > 0) {
      const newIds = newlyUnlocked.map(a => a.id);
      const updated = [...unlocked, ...newIds];
      setUnlocked(updated);
      localStorage.setItem("sp_achievements", JSON.stringify(updated));
      setNewBadge(newlyUnlocked[0]); // show first new badge
      setTimeout(() => setNewBadge(null), 4000);
    }
  }, [userStats]);

  const bgCard = dark ? "rgba(30,41,59,0.95)" : "#FFFFFF";
  const earned = ACHIEVEMENTS_DEF.filter(a => unlocked.includes(a.id));
  const locked  = ACHIEVEMENTS_DEF.filter(a => !unlocked.includes(a.id));

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* New badge notification */}
      {newBadge && (
        <div style={{ position:"fixed", top:80, right:20, zIndex:999,
          background:"linear-gradient(135deg,#F59E0B,#D97706)", borderRadius:20, padding:"14px 20px",
          boxShadow:"0 8px 32px rgba(245,158,11,0.5)", color:"white", maxWidth:280,
          animation:"slideIn 0.4s ease" }}>
          <div style={{ fontSize:12, fontWeight:700, opacity:0.9, marginBottom:2 }}>🎉 THÀNH TÍCH MỚI!</div>
          <div style={{ fontSize:24 }}>{newBadge.icon}</div>
          <div style={{ fontSize:14, fontWeight:800 }}>{newBadge.title}</div>
          <div style={{ fontSize:12, opacity:0.9 }}>+{newBadge.xp} XP</div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#78350F,#D97706,#F59E0B)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>🏆</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>GAMIFICATION</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>{"🏅 Thành Tích & Cấp Độ"}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:10 }}>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:12, padding:"8px 16px" }}>
            <div style={{ fontSize:11, opacity:0.8 }}>Cấp độ</div>
            <div style={{ fontSize:18, fontWeight:900 }}>{levelInfo.icon} {levelInfo.lv} · {levelInfo.title}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:12, padding:"8px 16px" }}>
            <div style={{ fontSize:11, opacity:0.8 }}>Tổng XP</div>
            <div style={{ fontSize:18, fontWeight:900 }}>⚡ {totalXP.toLocaleString()}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:12, padding:"8px 16px" }}>
            <div style={{ fontSize:11, opacity:0.8 }}>Huy hiệu</div>
            <div style={{ fontSize:18, fontWeight:900 }}>🏅 {earned.length}/{ACHIEVEMENTS_DEF.length}</div>
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div style={{ background:bgCard, borderRadius:20, padding:"18px 20px", marginBottom:20, border:`1px solid ${dark?"rgba(245,158,11,0.2)":"rgba(245,158,11,0.15)"}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:800, color:"#F59E0B" }}>{levelInfo.icon} Lv.{levelInfo.lv} {levelInfo.title}</span>
          <span style={{ fontSize:12, color:CC.muted }}>{totalXP} / {levelInfo.nextXP} XP</span>
        </div>
        <div style={{ background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", borderRadius:99, height:14, overflow:"hidden" }}>
          <div style={{ width:`${levelInfo.progress}%`, height:"100%", borderRadius:99, transition:"width 0.6s ease",
            background:"linear-gradient(90deg,#F59E0B,#D97706)" }}/>
        </div>
        <div style={{ fontSize:11, color:CC.muted, marginTop:4, textAlign:"center" }}>
          {levelInfo.nextXP - totalXP} {"XP để lên Lv."}{levelInfo.lv+1}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[{id:"badges",label:"🏅 Huy hiệu"},{id:"level",label:"📊 Bảng XP"}].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)}
            style={{ padding:"9px 20px", borderRadius:14, border:"none", cursor:"pointer",
              background: tab===t.id?"linear-gradient(135deg,#F59E0B,#D97706)":"transparent",
              color: tab===t.id?"white":CC.muted, fontWeight:800, fontSize:13, fontFamily:"'Nunito',sans-serif" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "badges" && (
        <div>
          {earned.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:13, fontWeight:800, color:"#F59E0B", marginBottom:12 }}>✅ ĐÃ ĐẠT ĐƯỢC ({earned.length})</div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?2:3}, 1fr)`, gap:12 }}>
                {earned.map(a => (
                  <div key={a.id} style={{ background:bgCard, borderRadius:16, padding:"16px 14px", textAlign:"center",
                    border:"2px solid rgba(245,158,11,0.35)", boxShadow:"0 4px 16px rgba(245,158,11,0.1)" }}>
                    <div style={{ fontSize:34, marginBottom:6 }}>{a.icon}</div>
                    <div style={{ fontSize:12, fontWeight:800, color:dark?"#FCD34D":"#92400E", marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:10, color:CC.muted, marginBottom:6, lineHeight:1.4 }}>{a.desc}</div>
                    <div style={{ fontSize:11, background:"rgba(245,158,11,0.15)", color:"#F59E0B", padding:"2px 10px", borderRadius:20, fontWeight:700, display:"inline-block" }}>+{a.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:CC.muted, marginBottom:12 }}>🔒 CHƯA MỞ KHÓA ({locked.length})</div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?2:3}, 1fr)`, gap:12 }}>
              {locked.map(a => (
                <div key={a.id} style={{ background:dark?"rgba(30,41,59,0.6)":"rgba(248,250,252,0.9)", borderRadius:16, padding:"16px 14px", textAlign:"center",
                  border:`1px solid ${dark?"rgba(148,163,184,0.1)":"rgba(148,163,184,0.15)"}`, opacity:0.65 }}>
                  <div style={{ fontSize:34, marginBottom:6, filter:"grayscale(1)" }}>{a.icon}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:CC.muted, marginBottom:4 }}>{a.title}</div>
                  <div style={{ fontSize:10, color:CC.muted, lineHeight:1.4 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "level" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {XP_LEVELS.map((lv,i) => {
            const isCurrentLv = lv.lv === levelInfo.lv;
            const isPassed = totalXP >= lv.xp;
            return (
              <div key={lv.lv} style={{ background:bgCard, borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:12,
                border:`2px solid ${isCurrentLv?"#F59E0B":dark?"rgba(148,163,184,0.1)":"rgba(148,163,184,0.15)"}`,
                boxShadow: isCurrentLv?"0 4px 16px rgba(245,158,11,0.3)":"none",
                opacity: isPassed?1:0.55 }}>
                <div style={{ fontSize:24, minWidth:32 }}>{lv.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:800, color: isCurrentLv?"#F59E0B":dark?"#E2E8F0":CC.text }}>
                    Lv.{lv.lv} · {lv.title}
                    {isCurrentLv && <span style={{ marginLeft:8, fontSize:11, background:"#F59E0B", color:"white", padding:"1px 8px", borderRadius:20 }}>BẠN ĐÂY</span>}
                  </div>
                  <div style={{ fontSize:11, color:CC.muted }}>≥ {lv.xp.toLocaleString()} XP</div>
                </div>
                {isPassed && <div style={{ fontSize:18 }}>✅</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// JLPT PROGRESS MAP — Bản đồ tiến trình
// ════════════════════════════════════════════════════════════════
function JLPTProgressPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  // Read real stats from localStorage
  const kanjiStats = (() => { try { return JSON.parse(localStorage.getItem("sp_kanji_stats")||"{}"); } catch { return {}; } })();
  const cardStats  = (() => { try { return JSON.parse(localStorage.getItem("sp_card_stats")||"{}"); } catch { return {}; } })();
  const jlptHistory = (() => { try { return JSON.parse(localStorage.getItem("sp_jlpt_history")||"[]"); } catch { return []; } })();
  const ejuHistory  = (() => { try { return JSON.parse(localStorage.getItem("sp_eju_history")||"[]"); } catch { return []; } })();
  const streak     = (() => { try { return JSON.parse(localStorage.getItem("sp_streak")||"0"); } catch { return 0; } })();

  const kanjiLearned = Object.keys(kanjiStats).filter(k => (kanjiStats[k]?.correct||0)>=1).length;
  const vocabLearned = Object.keys(cardStats).length;
  const jlptTestsDone = jlptHistory.length + ejuHistory.length;

  // Per-level progress estimation
  const levels = [
    { id:"N5", color:"#22c55e", bg:dark?"rgba(34,197,94,0.1)":"#f0fdf4",
      vocab:{ done: Math.min(vocabLearned, 800),  total:800  },
      kanji:{ done: Math.min(kanjiLearned, 100),  total:100  },
      grammar:{ done: Math.min(jlptHistory.filter(h=>h.level==="N5").length*3,50), total:50 },
      tests:{ done: jlptHistory.filter(h=>h.level==="N5").length, total:3 },
    },
    { id:"N4", color:"#3b82f6", bg:dark?"rgba(59,130,246,0.1)":"#eff6ff",
      vocab:{ done: Math.max(0,Math.min(vocabLearned-800,600)), total:600 },
      kanji:{ done: Math.max(0,Math.min(kanjiLearned-100,170)), total:170 },
      grammar:{ done: Math.min(jlptHistory.filter(h=>h.level==="N4").length*3,50), total:50 },
      tests:{ done: jlptHistory.filter(h=>h.level==="N4").length, total:3 },
    },
    { id:"N3", color:"#f59e0b", bg:dark?"rgba(245,158,11,0.1)":"#fffbeb",
      vocab:{ done:0, total:1500 }, kanji:{ done:0, total:370 }, grammar:{ done:0, total:80 }, tests:{ done:0, total:3 },
    },
    { id:"N2", color:"#ef4444", bg:dark?"rgba(239,68,68,0.1)":"#fef2f2",
      vocab:{ done:0, total:3000 }, kanji:{ done:0, total:620 }, grammar:{ done:0, total:100 }, tests:{ done:0, total:3 },
    },
    { id:"N1", color:"#7c3aed", bg:dark?"rgba(124,58,237,0.1)":"#f5f3ff",
      vocab:{ done:0, total:6000 }, kanji:{ done:0, total:2000 }, grammar:{ done:0, total:120 }, tests:{ done:0, total:3 },
    },
  ];

  const getPct = (lv) => {
    const total = lv.vocab.total + lv.kanji.total + lv.grammar.total;
    const done  = lv.vocab.done  + lv.kanji.done  + lv.grammar.done;
    return Math.min(100, Math.round(done / total * 100));
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0F172A,#1E3A8A,#2563EB)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>🗺️</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>JLPT · ROADMAP</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>{"🗺️ Bản Đồ Tiến Trình JLPT"}</div>
        <div style={{ fontSize:13, opacity:0.8 }}>Hành trình từ N5 → N1 · Theo dõi tiến độ thực tế</div>
        <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
          {[{n:kanjiLearned,l:"Kanji"},{n:vocabLearned,l:"Từ vựng"},{n:streak,l:"Ngày streak"},{n:jlptTestsDone,l:"Bài thi"}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", textAlign:"center" }}>
              <div style={{ fontSize:17, fontWeight:900 }}>{s.n}</div>
              <div style={{ fontSize:10, opacity:0.8 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Level progress cards */}
      {levels.map((lv, i) => {
        const pct = getPct(lv);
        const isActive = pct > 0 && pct < 100;
        const isDone   = pct >= 100;
        return (
          <div key={lv.id} style={{ background:bgCard, borderRadius:20, padding:"20px", marginBottom:16,
            border:`2px solid ${isDone?lv.color:isActive?lv.color+"60":dark?"rgba(148,163,184,0.1)":"rgba(148,163,184,0.15)"}`,
            boxShadow: isDone||isActive?`0 4px 20px ${lv.color}20`:"none" }}>

            {/* Level header */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:lv.color+"20", border:`2px solid ${lv.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:lv.color }}>
                {lv.id}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:dark?"#E2E8F0":CC.text }}>
                  JLPT {lv.id}
                  {isDone && <span style={{ marginLeft:8, fontSize:12, background:lv.color, color:"white", padding:"2px 10px", borderRadius:20 }}>✅ Hoàn thành</span>}
                  {isActive && <span style={{ marginLeft:8, fontSize:12, background:lv.color+"20", color:lv.color, padding:"2px 10px", borderRadius:20 }}>🔥 Đang học</span>}
                </div>
                <div style={{ fontSize:11, color:CC.muted }}>{pct}% hoàn thành</div>
              </div>
              <div style={{ fontSize:24, fontWeight:900, color:lv.color }}>{pct}%</div>
            </div>

            {/* Master progress bar */}
            <div style={{ background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", borderRadius:99, height:10, marginBottom:14, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background:`linear-gradient(90deg,${lv.color},${lv.color}cc)`, transition:"width 0.8s ease" }}/>
            </div>

            {/* Sub-stats */}
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?2:4},1fr)`, gap:8 }}>
              {[
                {label:"📚 Từ vựng", done:lv.vocab.done,  total:lv.vocab.total},
                {label:"🈶 Kanji",   done:lv.kanji.done,  total:lv.kanji.total},
                {label:t.grammarTitle ? "📝 "+t.grammarTitle : "📝 Ngữ pháp",done:lv.grammar.done,total:lv.grammar.total},
                {label:"🎌 Bài thi", done:lv.tests.done,  total:lv.tests.total},
              ].map((sub,j) => {
                const sp = sub.total>0?Math.min(100,Math.round(sub.done/sub.total*100)):0;
                return (
                  <div key={j} style={{ background:dark?`${lv.fg}22`:lv.bg, borderRadius:12, padding:"10px 12px" }}>
                    <div style={{ fontSize:11, color:CC.muted, marginBottom:4 }}>{sub.label}</div>
                    <div style={{ fontSize:12, fontWeight:800, color:lv.color, marginBottom:4 }}>{sub.done}<span style={{ fontWeight:400, color:CC.muted }}>/{sub.total}</span></div>
                    <div style={{ background:dark?"rgba(0,0,0,0.2)":"rgba(255,255,255,0.6)", borderRadius:99, height:5, overflow:"hidden" }}>
                      <div style={{ width:`${sp}%`, height:"100%", background:lv.color, borderRadius:99 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// AI CONVERSATION — Hội thoại AI tiếng Nhật
// ════════════════════════════════════════════════════════════════
const CONV_SCENARIOS = [
  { id:"friend",   icon:"👫", title:"Bạn học người Nhật",   level:"N5", prompt:"Bạn là một học sinh người Nhật tên Yuki. Nói chuyện thân mật với học viên Việt Nam đang học tiếng Nhật N5. Câu hỏi ngắn, từ vựng đơn giản N5. Bắt đầu bằng: 'ねえ、今日は学校どうだった？'" },
  { id:"teacher",  icon:"👨‍🏫", title:"Giáo viên tiếng Nhật", level:"N4", prompt:"Bạn là giáo viên tiếng Nhật tên Tanaka-sensei. Nói chuyện lịch sự, sửa lỗi nhẹ nhàng, cấp độ N4. Bắt đầu bằng: '今日は何を練習したいですか？'" },
  { id:"shop",     icon:"🏪", title:"Nhân viên cửa hàng",   level:"N5", prompt:"Bạn là nhân viên cửa hàng tiện lợi ở Nhật. Tình huống mua sắm hàng ngày, từ ngữ đơn giản. Bắt đầu bằng: 'いらっしゃいませ！何をお探しですか？'" },
  { id:"interview",icon:"🏫", title:"Phỏng vấn đại học",    level:"N3", prompt:"Bạn là cán bộ tuyển sinh đại học Nhật Bản. Phỏng vấn bằng tiếng Nhật N3, câu hỏi về lý do du học, dự định tương lai. Bắt đầu bằng: '本日はお越しいただきありがとうございます。まず自己紹介をお願いします。'" },
  { id:"casual",   icon:"☕", title:"Hội thoại đời sống",    level:"N4", prompt:"Bạn là người Nhật 25 tuổi, đang nói chuyện casual về cuộc sống hàng ngày, sở thích, văn hóa Nhật. Cấp N4. Bắt đầu bằng: '最近、日本の文化で興味があることはある？'" },
  { id:"travel",   icon:"✈️", title:"Du lịch Nhật Bản",      level:"N5", prompt:"Bạn là nhân viên hướng dẫn du lịch ở Tokyo. Giúp học viên về địa điểm, giao thông, ẩm thực. Từ vựng N5. Bắt đầu bằng: '東京へようこそ！どこに行きたいですか？'" },
];

// ── Helpers cho AI Hội thoại (gọi API an toàn, chống lỗi "không hiểu") ──
const CONV_MODEL = "claude-sonnet-4-20250514";

async function convCallClaude({ system, messages, max_tokens = 500, retries = 1 }) {
  let lastErr;
  for (let a = 0; a <= retries; a++) {
    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: CONV_MODEL, max_tokens, system, messages })
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || d?.error) throw new Error(d?.error?.message || `HTTP ${res.status}`);
      const text = (d?.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      if (!text) throw new Error("empty response");
      return text;
    } catch (e) {
      lastErr = e;
      if (a < retries) await new Promise(r => setTimeout(r, 700));
    }
  }
  throw lastErr;
}

// Lấy JSON đầu tiên trong chuỗi (chịu được ```json, lời dẫn, text thừa)
function convParseJSON(raw) {
  const m = (raw || "").match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

// Lịch sử gửi API: bỏ tin lỗi, bắt đầu bằng "user", gộp tin liên tiếp cùng role, giới hạn độ dài
function convBuildHistory(msgs) {
  const clean = msgs.filter(m => !m.error && m.content && m.content.trim())
                    .map(m => ({ role: m.role, content: m.content }));
  const merged = [];
  for (const m of clean) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += "\n" + m.content;
    else merged.push({ ...m });
  }
  let trimmed = merged.slice(-20);
  // API yêu cầu tin đầu tiên là "user" → mồi lại nếu lịch sử bắt đầu bằng lời AI
  if (!trimmed.length || trimmed[0].role === "assistant") {
    trimmed = [{ role: "user", content: "(Bắt đầu hội thoại)" }, ...trimmed];
  }
  return trimmed;
}

const convSystemPrompt = (sc) => sc.prompt + `

QUY TẮC HỘI THOẠI (bắt buộc):
- Đóng vai nhân vật ở trên, chỉ nói tiếng Nhật, câu ngắn, đúng cấp ${sc.level}. Câu "Bắt đầu bằng..." CHỈ dùng cho tin nhắn đầu tiên; các lượt sau tiếp tục tự nhiên, không lặp lại lời chào.
- Luôn phản hồi đúng nội dung học viên vừa nói. TUYỆT ĐỐI không nói "không hiểu" / "もう一度言ってください" chỉ vì câu sai ngữ pháp, sai chính tả, thiếu dấu, thiếu trợ từ, viết bằng romaji, hoặc viết bằng tiếng Việt/Anh. Hãy đoán ý hợp lý nhất theo ngữ cảnh rồi trả lời tiếp.
- Nếu học viên viết tiếng Việt/Anh/romaji: hiểu ý, đáp bằng tiếng Nhật đơn giản, kèm gợi ý ngắn cách nói câu đó bằng tiếng Nhật, rồi hỏi tiếp.
- Chỉ khi thật sự không thể đoán ý mới hỏi lại (bằng tiếng Nhật), và nêu 1-2 khả năng bạn nghĩ học viên muốn nói.
- Kết thúc mỗi lượt bằng một câu hỏi ngắn để hội thoại tiếp tục.`;

const convAnalysisPrompt = `Bạn là giáo viên tiếng Nhật. Phân tích câu của học viên Việt Nam. Chỉ trả về MỘT đối tượng JSON, không markdown, không lời dẫn:
{"grammar":85,"vocab":80,"natural":75,"correction":null,"suggestion":"câu tự nhiên hơn nếu có","error":"giải thích lỗi ngắn bằng tiếng Việt nếu có","praise":"lời khen ngắn tiếng Việt"}
grammar/vocab/natural: số 0-100. correction: câu đúng nếu có lỗi (null nếu đúng).
Nếu học viên viết tiếng Việt/Anh/romaji thay vì tiếng Nhật: correction = câu tiếng Nhật tương ứng, error = "Hãy thử viết bằng tiếng Nhật nhé", điểm vẫn chấm theo ý họ muốn nói. Giữ mỗi trường dưới 120 ký tự.`;

function AIConversationPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]); // [{role, content, analysis}]
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [totalScore, setTotalScore]   = useState({grammar:0,vocab:0,natural:0,count:0});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const startScenario = async (sc) => {
    setScenario(sc);
    setMessages([]);
    setSessionDone(false);
    setTotalScore({grammar:0,vocab:0,natural:0,count:0});
    setLoading(true);
    // Câu mở đầu dự phòng: lấy đúng câu "Bắt đầu bằng: '...'" của tình huống
    const fallbackOpen = (sc.prompt.match(/Bắt đầu bằng: '([^']+)'/) || [])[1] || "こんにちは！";
    try {
      const aiMsg = await convCallClaude({
        system: convSystemPrompt(sc),
        messages: [{role:"user", content:"(Bắt đầu hội thoại)"}],
        max_tokens: 300
      });
      setMessages([{role:"assistant", content:aiMsg}]);
    } catch { setMessages([{role:"assistant", content:fallbackOpen}]); }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const doSend = async (text, baseMsgs) => {
    const userMsg = (text || "").trim();
    if (!userMsg || loading) return;
    const newMsgs = [...baseMsgs, {role:"user", content:userMsg}];
    setMessages(newMsgs);
    setLoading(true);

    const history = convBuildHistory(newMsgs);

    // Hai việc độc lập: lỗi một bên KHÔNG làm mất bên kia
    const [convR, anaR] = await Promise.allSettled([
      convCallClaude({ system: convSystemPrompt(scenario), messages: history, max_tokens: 400 }),
      convCallClaude({
        system: convAnalysisPrompt,
        messages: [{role:"user", content:`Học viên viết: "${userMsg}"\nCảnh: ${scenario.title} cấp ${scenario.level}`}],
        max_tokens: 600, retries: 0
      }),
    ]);

    const analysis = anaR.status === "fulfilled" ? convParseJSON(anaR.value) : null;
    if (analysis) {
      setTotalScore(s => ({
        grammar:  s.grammar  + (Number(analysis.grammar) || 80),
        vocab:    s.vocab    + (Number(analysis.vocab)   || 80),
        natural:  s.natural  + (Number(analysis.natural) || 80),
        count:    s.count    + 1,
      }));
    }

    const userEntry = analysis ? {role:"user", content:userMsg, analysis} : {role:"user", content:userMsg};
    const replyEntry = convR.status === "fulfilled"
      ? {role:"assistant", content:convR.value}
      : {role:"assistant", error:true, retryText:userMsg,
         content:"⚠️ Không kết nối được với AI (không phải do câu của bạn). Bấm “Thử lại” nhé."};

    setMessages([...baseMsgs, userEntry, replyEntry]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    doSend(text, messages.filter(m => !m.error));
  };

  const retryAt = (idx) => {
    const m = messages[idx];
    if (!m?.retryText || loading) return;
    // bỏ tin lỗi + tin user bị lỗi rồi gửi lại
    doSend(m.retryText, messages.slice(0, idx - 1).filter(x => !x.error));
  };

  const endSession = () => {
    setSessionDone(true);
    // Save stats
    const stats = (() => { try { return JSON.parse(localStorage.getItem("sp_user_stats")||"{}"); } catch { return {}; } })();
    stats.aiChats = (stats.aiChats||0) + 1;
    localStorage.setItem("sp_user_stats", JSON.stringify(stats));
  };

  const avgScore = totalScore.count > 0 ? {
    grammar:  Math.round(totalScore.grammar  / totalScore.count),
    vocab:    Math.round(totalScore.vocab    / totalScore.count),
    natural:  Math.round(totalScore.natural  / totalScore.count),
  } : null;

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const msgBg  = (role) => role==="assistant"
    ? dark?"rgba(37,99,235,0.15)":"rgba(239,246,255,0.95)"
    : dark?"rgba(30,41,59,0.9)":"rgba(241,245,249,0.95)";

  // Scenario selector
  if (!scenario) return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#0F172A,#1E3A8A,#38BDF8)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>💬</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>AI · CONVERSATION</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>{"💬 AI Hội Thoại Tiếng Nhật"}</div>
        <div style={{ fontSize:13, opacity:0.8 }}>Luyện phản xạ giao tiếp · AI sửa lỗi ngữ pháp · Chấm điểm tự nhiên</div>
      </div>
      <div style={{ fontSize:14, fontWeight:800, color:CC.muted, marginBottom:16 }}>🎭 CHỌN TÌNH HUỐNG:</div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?1:2},1fr)`, gap:14 }}>
        {CONV_SCENARIOS.map(sc => (
          <button key={sc.id} onClick={()=>startScenario(sc)}
            style={{ background:bgCard, borderRadius:20, padding:"20px", textAlign:"left", border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(56,189,248,0.2)"}`,
              cursor:"pointer", transition:"all 0.2s", fontFamily:"'Nunito',sans-serif",
              boxShadow:dark?"0 4px 16px rgba(0,0,0,0.3)":"0 4px 16px rgba(37,99,235,0.06)" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>{sc.icon}</div>
            <div style={{ fontSize:14, fontWeight:800, color:dark?"#E2E8F0":CC.text, marginBottom:4 }}>{sc.title}</div>
            <div style={{ fontSize:11, color:CC.muted, marginBottom:8 }}>Luyện giao tiếp tình huống thực tế</div>
            <span style={{ fontSize:11, background:LEVEL_BG[sc.level]||"#f0f9ff", color:LEVEL_COLOR[sc.level]||"#0369a1", padding:"3px 10px", borderRadius:20, fontWeight:800 }}>{sc.level}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Chat header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, background:bgCard, borderRadius:20, padding:"14px 18px", marginBottom:16, border:`1px solid ${dark?"rgba(56,189,248,0.15)":"rgba(56,189,248,0.2)"}` }}>
        <div style={{ fontSize:28 }}>{scenario.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:dark?"#E2E8F0":CC.text }}>{scenario.title}</div>
          <div style={{ fontSize:11, color:CC.muted }}>Cấp {scenario.level} · {messages.filter(m=>m.role==="user").length} lượt</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={endSession} style={{ padding:"7px 14px", borderRadius:10, border:`1px solid rgba(245,158,11,0.4)`, background:"transparent", color:"#F59E0B", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>📊 Kết thúc</button>
          <button onClick={()=>setScenario(null)} style={{ padding:"7px 14px", borderRadius:10, border:`1px solid rgba(239,68,68,0.3)`, background:"transparent", color:"#EF4444", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>✕ Thoát</button>
        </div>
      </div>

      {/* Session result overlay */}
      {sessionDone && avgScore && (
        <div style={{ background:bgCard, borderRadius:20, padding:"24px", marginBottom:16, border:"2px solid rgba(16,185,129,0.4)", boxShadow:"0 4px 24px rgba(16,185,129,0.15)" }}>
          <div style={{ fontSize:18, fontWeight:900, color:"#10B981", marginBottom:16 }}>🎉 Kết quả hội thoại</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
            {[{l:"Ngữ pháp",v:avgScore.grammar,icon:"📝"},{l:"Từ vựng",v:avgScore.vocab,icon:"📚"},{l:"Tự nhiên",v:avgScore.natural,icon:"✨"}].map((s,i)=>(
              <div key={i} style={{ textAlign:"center", background:dark?"rgba(16,185,129,0.1)":"rgba(240,253,244,0.9)", borderRadius:14, padding:"12px" }}>
                <div style={{ fontSize:22 }}>{s.icon}</div>
                <div style={{ fontSize:26, fontWeight:900, color:"#10B981" }}>{s.v}</div>
                <div style={{ fontSize:11, color:CC.muted }}>{s.l}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>{setScenario(null);setSessionDone(false);}} style={{ width:"100%", padding:"12px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#10B981,#059669)", color:"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            ← Chọn tình huống mới
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={{ background:bgCard, borderRadius:20, padding:isMob?"12px":"16px", marginBottom:14,
        border:`1px solid ${dark?"rgba(56,189,248,0.12)":"rgba(56,189,248,0.15)"}`,
        maxHeight:"50vh", overflowY:"auto" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent: msg.role==="assistant"?"flex-start":"flex-end", marginBottom:4 }}>
              <div style={{ maxWidth:"80%", background:msgBg(msg.role), borderRadius:16, padding:"10px 14px",
                borderBottomLeftRadius:msg.role==="assistant"?4:16, borderBottomRightRadius:msg.role==="user"?4:16,
                border:`1px solid ${msg.role==="assistant"?dark?"rgba(37,99,235,0.3)":"rgba(37,99,235,0.15)":dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.15)"}` }}>
                <div style={{ fontSize:isMob?14:15, fontFamily:"'Noto Sans JP', sans-serif", color:msg.error?"#EF4444":dark?"#E2E8F0":CC.text, lineHeight:1.6 }}>
                  {msg.content}
                </div>
                {msg.error && (
                  <button onClick={()=>retryAt(i)} disabled={loading}
                    style={{ marginTop:8, padding:"6px 14px", borderRadius:10, border:"1px solid rgba(239,68,68,0.4)", background:"transparent", color:"#EF4444", fontSize:12, fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"'Nunito',sans-serif" }}>
                    🔄 Thử lại
                  </button>
                )}
              </div>
            </div>
            {/* Analysis feedback for user messages */}
            {msg.role==="user" && msg.analysis && (
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                <div style={{ maxWidth:"85%", background:dark?"rgba(15,23,42,0.7)":"rgba(248,250,252,0.95)", borderRadius:12, padding:"8px 12px",
                  border:`1px solid ${dark?"rgba(148,163,184,0.15)":"rgba(148,163,184,0.2)"}`, fontSize:12 }}>
                  {msg.analysis.correction && (
                    <div style={{ color:"#EF4444", marginBottom:4 }}>
                      ✏️ <strong>Sửa:</strong> <span style={{ fontFamily:"'Noto Sans JP', sans-serif" }}>{msg.analysis.correction}</span>
                    </div>
                  )}
                  {msg.analysis.suggestion && (
                    <div style={{ color:"#38BDF8", marginBottom:4 }}>
                      💡 <strong>Tự nhiên hơn:</strong> <span style={{ fontFamily:"'Noto Sans JP', sans-serif" }}>{msg.analysis.suggestion}</span>
                    </div>
                  )}
                  {msg.analysis.error && <div style={{ color:CC.muted, marginBottom:4 }}>📌 {msg.analysis.error}</div>}
                  {msg.analysis.praise && <div style={{ color:"#10B981" }}>⭐ {msg.analysis.praise}</div>}
                  <div style={{ display:"flex", gap:8, marginTop:6 }}>
                    {[{l:"📝",v:msg.analysis.grammar},{l:"📚",v:msg.analysis.vocab},{l:"✨",v:msg.analysis.natural}].map((s,j)=>(
                      <span key={j} style={{ fontSize:11, background:dark?"rgba(30,41,59,0.8)":"white", padding:"2px 8px", borderRadius:20, color:s.v>=80?"#10B981":s.v>=60?"#F59E0B":"#EF4444", fontWeight:700 }}>
                        {s.l}{s.v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:6, padding:"10px 14px", alignItems:"center" }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#38BDF8",
                animation:"bounce 0.8s ease infinite", animationDelay:`${i*0.15}s` }}/>
            ))}
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      {!sessionDone && (
        <div style={{ display:"flex", gap:10 }}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing&&e.keyCode!==229){e.preventDefault();sendMessage();} }}
            placeholder="日本語で入力してください... (Nhập tiếng Nhật)"
            style={{ flex:1, padding:"12px 16px", borderRadius:14, border:`1.5px solid ${dark?"rgba(56,189,248,0.25)":"rgba(56,189,248,0.3)"}`,
              background:dark?"rgba(15,23,42,0.8)":"white", color:dark?"#E2E8F0":CC.text,
              fontSize:15, fontFamily:"'Noto Sans JP', 'Nunito', sans-serif", outline:"none" }}
          />
          <button onClick={sendMessage} disabled={loading||!input.trim()}
            style={{ padding:"12px 20px", borderRadius:14, border:"none", cursor:loading||!input.trim()?"not-allowed":"pointer",
              background:loading||!input.trim()?"rgba(148,163,184,0.3)":"linear-gradient(135deg,#2563EB,#38BDF8)",
              color:loading||!input.trim()?CC.muted:"white", fontWeight:800, fontSize:13,
              fontFamily:"'Nunito',sans-serif", boxShadow:!loading&&input.trim()?"0 4px 16px rgba(37,99,235,0.35)":"none" }}>
            送信
          </button>
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// DICTATION PAGE — Nghe và viết lại
// ════════════════════════════════════════════════════════════════
const DICTATION_SENTENCES = [
  { id:"d1",  level:"N5", jp:"今日はいい天気ですね。",        vn:"Hôm nay thời tiết đẹp nhỉ." },
  { id:"d2",  level:"N5", jp:"私は学生です。",               vn:"Tôi là học sinh." },
  { id:"d3",  level:"N5", jp:"毎朝七時に起きます。",          vn:"Tôi thức dậy lúc 7 giờ mỗi buổi sáng." },
  { id:"d4",  level:"N5", jp:"水をください。",                vn:"Cho tôi một chút nước." },
  { id:"d5",  level:"N5", jp:"駅はどこですか？",              vn:"Nhà ga ở đâu?" },
  { id:"d6",  level:"N5", jp:"日本語が少し話せます。",         vn:"Tôi có thể nói một chút tiếng Nhật." },
  { id:"d7",  level:"N4", jp:"昨日の試験はとても難しかったです。", vn:"Kỳ thi hôm qua rất khó." },
  { id:"d8",  level:"N4", jp:"電車が遅れているようです。",     vn:"Có vẻ tàu điện đang bị trễ." },
  { id:"d9",  level:"N4", jp:"この映画を見たことがありますか？", vn:"Bạn đã xem bộ phim này chưa?" },
  { id:"d10", level:"N4", jp:"雨が降りそうなので傘を持ってきました。", vn:"Vì trông có vẻ sắp mưa nên tôi mang ô." },
  { id:"d11", level:"N4", jp:"もう少し速く話していただけますか？", vn:"Bạn có thể nói chậm lại một chút không?" },
  { id:"d12", level:"N3", jp:"最近仕事が忙しくて全然休めていません。", vn:"Dạo này công việc bận rộn nên không được nghỉ ngơi chút nào." },
  { id:"d13", level:"N3", jp:"彼女が来るかどうかまだわかりません。",  vn:"Tôi vẫn chưa biết liệu cô ấy có đến không." },
  { id:"d14", level:"N3", jp:"この問題を解くのに三時間かかりました。", vn:"Mất ba tiếng để giải bài toán này." },
  { id:"d15", level:"N2", jp:"経済的な理由から進学を断念せざるを得なかった。", vn:"Vì lý do kinh tế tôi buộc phải từ bỏ việc tiếp tục học lên." },
];

function DictationPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [levelFilter, setLevelFilter] = useState("N5");
  const [qIdx, setQIdx]     = useState(0);
  const [input, setInput]   = useState("");
  const [checked, setChecked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [score, setScore]   = useState({ correct:0, total:0 });
  const [playCount, setPlayCount] = useState(0);
  const [showText, setShowText]  = useState(false);
  const inputRef = useRef(null);

  const filtered = DICTATION_SENTENCES.filter(s => s.level === levelFilter);
  const q = filtered[qIdx % filtered.length];

  const play = () => {
    if (!window.speechSynthesis || playing) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(q.jp);
    u.lang = "ja-JP"; u.rate = 0.8;
    u.onstart = () => setPlaying(true);
    u.onend   = () => { setPlaying(false); setPlayCount(c=>c+1); };
    window.speechSynthesis.speak(u);
    inputRef.current?.focus();
  };

  const checkAnswer = () => {
    if (!input.trim()) return;
    setChecked(true);
    const correct = input.trim() === q.jp;
    setScore(s => ({ correct: s.correct+(correct?1:0), total: s.total+1 }));
    setShowText(true);
  };

  const nextQ = () => {
    setInput(""); setChecked(false); setShowText(false); setPlayCount(0);
    window.speechSynthesis?.cancel();
    setQIdx(i => (i+1) % filtered.length);
    setTimeout(()=>inputRef.current?.focus(), 100);
  };

  useEffect(() => { setInput(""); setChecked(false); setShowText(false); setPlayCount(0); }, [qIdx, levelFilter]);

  // Diff highlight: compare input chars to answer
  const diffChars = () => {
    const ans = q.jp.split("");
    const inp = input.split("");
    return ans.map((ch, i) => ({
      char: ch,
      status: inp[i] === ch ? "ok" : inp[i] === undefined ? "missing" : "wrong",
      typed: inp[i] || ""
    }));
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const accuracy = score.total > 0 ? Math.round(score.correct/score.total*100) : 0;

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#2E1065,#5B21B6,#7C3AED)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>🎙️</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>DICTATION · NGHE VIẾT</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>🎙️ Dictation Mode</div>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:14 }}>Nghe câu tiếng Nhật → Gõ lại chính xác → Highlight lỗi</div>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700 }}>✅ {score.correct}/{score.total}</div>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700 }}>🎯 {accuracy}%</div>
        </div>
      </div>

      {/* Level filter */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["N5","N4","N3","N2"].map(lv=>(
          <button key={lv} onClick={()=>{setLevelFilter(lv);setQIdx(0);}}
            style={{ padding:"8px 18px", borderRadius:20, border:`2px solid ${levelFilter===lv?LEVEL_COLOR[lv]:"transparent"}`,
              background:levelFilter===lv?LEVEL_COLOR[lv]+"22":dark?"rgba(30,41,59,0.6)":"rgba(241,245,249,0.9)",
              color:levelFilter===lv?LEVEL_COLOR[lv]:CC.muted, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {lv}
          </button>
        ))}
      </div>

      <div style={{ background:bgCard, borderRadius:20, padding:isMob?"18px":"28px", border:`1px solid ${dark?"rgba(124,58,237,0.2)":"rgba(124,58,237,0.1)"}`, boxShadow:dark?"0 4px 20px rgba(0,0,0,0.3)":"0 4px 20px rgba(124,58,237,0.08)" }}>
        {/* Progress */}
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
          <span style={{ fontSize:12, color:CC.muted, fontWeight:700 }}>{(qIdx%filtered.length)+1}/{filtered.length}</span>
          <span style={{ fontSize:11, background:LEVEL_BG[levelFilter], color:LEVEL_COLOR[levelFilter], padding:"3px 10px", borderRadius:20, fontWeight:800 }}>{levelFilter}</span>
        </div>

        {/* Play button */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <button onClick={play} disabled={playing}
            style={{ width:88, height:88, borderRadius:"50%", border:"none", cursor:playing?"not-allowed":"pointer",
              background:playing?"rgba(124,58,237,0.3)":"linear-gradient(135deg,#7C3AED,#4C1D95)",
              color:"white", fontSize:32, transition:"all 0.2s",
              boxShadow:playing?"none":"0 8px 32px rgba(124,58,237,0.45)" }}>
            {playing ? "🔊" : "▶"}
          </button>
          <div style={{ fontSize:12, color:CC.muted, marginTop:8 }}>
            {playCount === 0 ? "Bấm để nghe câu" : `Đã nghe ${playCount} lần`}
            {playCount >= 2 && !checked && <span style={{ color:"#F59E0B", fontWeight:700 }}> · Thử gõ lại nhé!</span>}
          </div>
        </div>

        {/* Input */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:CC.muted, fontWeight:700, marginBottom:8 }}>GÕ LẠI CÂU VỪA NGHE:</div>
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            disabled={checked}
            placeholder="日本語で入力してください..."
            rows={2}
            style={{ width:"100%", padding:"12px 14px", borderRadius:12,
              border:`1.5px solid ${checked?(input===q.jp?"rgba(16,185,129,0.5)":"rgba(239,68,68,0.4)"):"rgba(124,58,237,0.3)"}`,
              background:dark?"rgba(15,23,42,0.8)":"rgba(248,250,252,0.9)",
              color:dark?"#E2E8F0":CC.text, fontSize:16, fontFamily:"'Noto Sans JP', sans-serif",
              resize:"none", outline:"none", boxSizing:"border-box",
              transition:"border 0.3s" }}
          />
        </div>

        {/* Diff highlight (after check) */}
        {checked && showText && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:CC.muted, fontWeight:700, marginBottom:8 }}>PHÂN TÍCH LỖI:</div>
            <div style={{ background:dark?"rgba(15,23,42,0.6)":"rgba(248,250,252,0.95)", borderRadius:12, padding:"12px 14px", fontSize:isMob?16:18, fontFamily:"'Noto Sans JP', sans-serif", lineHeight:2 }}>
              {diffChars().map((d,i) => (
                <span key={i} style={{
                  background: d.status==="ok" ? "transparent" : d.status==="missing" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)",
                  color: d.status==="ok" ? (dark?"#E2E8F0":CC.text) : d.status==="missing" ? "#F59E0B" : "#EF4444",
                  borderRadius:4, padding:"0 1px",
                  textDecoration: d.status!=="ok" ? "underline" : "none",
                  position:"relative"
                }}>
                  {d.char}
                </span>
              ))}
            </div>
            <div style={{ marginTop:8, fontSize:13, color:CC.muted }}>🇻🇳 {q.vn}</div>
            {input !== q.jp && (
              <div style={{ marginTop:6, fontSize:13 }}>
                <span style={{ color:CC.muted }}>✅ Đáp án đúng: </span>
                <span style={{ fontFamily:"'Noto Sans JP',sans-serif", color:"#10B981", fontWeight:700 }}>{q.jp}</span>
              </div>
            )}
          </div>
        )}

        {!checked ? (
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={play} disabled={playing}
              style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid rgba(124,58,237,0.3)`, background:"transparent", color:"#A855F7", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              🔁 Nghe lại
            </button>
            <button onClick={checkAnswer} disabled={!input.trim()}
              style={{ flex:2, padding:"11px", borderRadius:12, border:"none",
                background:!input.trim()?"rgba(148,163,184,0.2)":"linear-gradient(135deg,#7C3AED,#4C1D95)",
                color:!input.trim()?CC.muted:"white", fontSize:13, fontWeight:800, cursor:!input.trim()?"not-allowed":"pointer",
                fontFamily:"'Nunito',sans-serif", boxShadow:input.trim()?"0 4px 16px rgba(124,58,237,0.35)":"none" }}>
              ✅ Kiểm tra
            </button>
          </div>
        ) : (
          <button onClick={nextQ}
            style={{ width:"100%", padding:"12px", borderRadius:14, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#7C3AED,#4C1D95)", color:"white", fontSize:14, fontWeight:800,
              fontFamily:"'Nunito',sans-serif", boxShadow:"0 4px 20px rgba(124,58,237,0.4)" }}>
            Câu tiếp theo →
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SHORT STORY PAGE — Đọc truyện ngắn
// ════════════════════════════════════════════════════════════════
const SHORT_STORIES = [
  {
    id:"s1", level:"N5", title:"小さな猫", titleVn:"Chú Mèo Nhỏ",
    sentences:[
      { jp:"昔々、あるところに小さな猫がいました。", furigana:"むかしむかし、あるところにちいさなねこがいました。", vn:"Ngày xửa ngày xưa, ở một nơi nọ có một chú mèo nhỏ." },
      { jp:"その猫はとても元気でした。", furigana:"そのねこはとてもげんきでした。", vn:"Chú mèo đó rất khỏe mạnh và hoạt bát." },
      { jp:"毎日、公園で走りました。", furigana:"まいにち、こうえんではしりました。", vn:"Mỗi ngày, chú chạy trong công viên." },
      { jp:"ある日、友達の犬に会いました。", furigana:"あるひ、ともだちのいぬにあいました。", vn:"Một ngày nọ, chú gặp người bạn chó." },
      { jp:"二人はとても仲良しになりました。", furigana:"ふたりはとてもなかよしになりました。", vn:"Hai người trở thành đôi bạn thân." },
    ],
    vocab:[{jp:"猫",rom:"neko",vn:"mèo"},{jp:"元気",rom:"genki",vn:"khỏe mạnh"},{jp:"公園",rom:"kouen",vn:"công viên"},{jp:"友達",rom:"tomodachi",vn:"bạn bè"}],
    quiz:[
      { q:"猫はどこで走りましたか？", opts:["学校","公園","家","駅"], ans:1 },
      { q:"猫は誰に会いましたか？", opts:["猫","魚","犬","鳥"], ans:2 },
    ]
  },
  {
    id:"s2", level:"N5", title:"雨の日", titleVn:"Ngày Mưa",
    sentences:[
      { jp:"今日は雨が降っています。", furigana:"きょうはあめがふっています。", vn:"Hôm nay trời đang mưa." },
      { jp:"私は家の中で本を読んでいます。", furigana:"わたしはいえのなかでほんをよんでいます。", vn:"Tôi đang đọc sách trong nhà." },
      { jp:"外はとても寒いです。", furigana:"そとはとてもさむいです。", vn:"Bên ngoài rất lạnh." },
      { jp:"お母さんが温かいお茶を持ってきてくれました。", furigana:"おかあさんがあたたかいおちゃをもってきてくれました。", vn:"Mẹ mang cho tôi một tách trà nóng." },
      { jp:"雨の日も悪くないと思いました。", furigana:"あめのひもわるくないとおもいました。", vn:"Tôi nghĩ rằng ngày mưa cũng không đến nỗi tệ." },
    ],
    vocab:[{jp:"雨",rom:"ame",vn:"mưa"},{jp:"本",rom:"hon",vn:"sách"},{jp:"寒い",rom:"samui",vn:"lạnh"},{jp:"お茶",rom:"ocha",vn:"trà"}],
    quiz:[
      { q:"今日の天気はどうですか？", opts:["晴れ","雪","雨","風"], ans:2 },
      { q:"お母さんは何を持ってきましたか？", opts:["本","お茶","傘","お菓子"], ans:1 },
    ]
  },
  {
    id:"s3", level:"N4", title:"初めての電車", titleVn:"Chuyến Tàu Đầu Tiên",
    sentences:[
      { jp:"田中さんは東京に引っ越してきたばかりです。", furigana:"たなかさんはとうきょうにひっこしてきたばかりです。", vn:"Anh Tanaka vừa mới chuyển đến Tokyo." },
      { jp:"初めて一人で電車に乗ることになりました。", furigana:"はじめてひとりでかなりにのることになりました。", vn:"Lần đầu tiên anh sẽ một mình đi tàu điện." },
      { jp:"どの電車に乗ればいいかわからなくて困りました。", furigana:"どのでんしゃにのればいいかわからなくてこまりました。", vn:"Anh không biết nên đi tàu nào nên rất bối rối." },
      { jp:"親切な駅員さんが乗り換え方を教えてくれました。", furigana:"しんせつなえきいんさんがのりかえかたをおしえてくれました。", vn:"Một nhân viên ga tốt bụng đã chỉ cho anh cách đổi tàu." },
      { jp:"おかげで無事に目的地に着くことができました。", furigana:"おかげでぶじにもくてきちにつくことができました。", vn:"Nhờ đó anh đã đến nơi an toàn." },
    ],
    vocab:[{jp:"引っ越す",rom:"hikkosu",vn:"chuyển nhà"},{jp:"乗り換え",rom:"norikae",vn:"đổi tàu"},{jp:"駅員",rom:"ekiin",vn:"nhân viên ga"},{jp:"目的地",rom:"mokutekichi",vn:"điểm đến"}],
    quiz:[
      { q:"田中さんはどこに引っ越しましたか？", opts:["大阪","名古屋","東京","京都"], ans:2 },
      { q:"誰が電車の乗り方を教えましたか？", opts:["友達","駅員","先生","お母さん"], ans:1 },
    ]
  },
  {
    id:"s4", level:"N4", title:"夢のケーキ", titleVn:"Chiếc Bánh Trong Mơ",
    sentences:[
      { jp:"さくらさんはお菓子作りが大好きです。", furigana:"さくらさんはおかしづくりがだいすきです。", vn:"Bạn Sakura rất thích làm bánh kẹo." },
      { jp:"毎週末、新しいレシピに挑戦しています。", furigana:"まいしゅうまつ、あたらしいれしぴにちょうせんしています。", vn:"Mỗi cuối tuần, bạn thử một công thức mới." },
      { jp:"今週はチョコレートケーキを作ることにしました。", furigana:"こんしゅうはちょこれーとけーきをつくることにしました。", vn:"Tuần này bạn quyết định làm bánh chocolate." },
      { jp:"三時間かけて丁寧に作りました。", furigana:"さんじかんかけてていねいにつくりました。", vn:"Bạn dành ba tiếng để làm cẩn thận." },
      { jp:"家族みんなが「おいしい！」と言って喜んでくれました。", furigana:"かぞくみんなが「おいしい！」といってよろこんでくれました。", vn:"Cả gia đình đều vui mừng khen ngon." },
    ],
    vocab:[{jp:"お菓子",rom:"okashi",vn:"bánh kẹo"},{jp:"挑戦",rom:"chosen",vn:"thử thách"},{jp:"丁寧",rom:"teinei",vn:"cẩn thận"},{jp:"喜ぶ",rom:"yorokobu",vn:"vui mừng"}],
    quiz:[
      { q:"さくらさんは今週何を作りましたか？", opts:["クッキー","パン","チョコレートケーキ","アイスクリーム"], ans:2 },
      { q:"ケーキを作るのに何時間かかりましたか？", opts:["一時間","二時間","三時間","四時間"], ans:2 },
    ]
  },
  {
    id:"s5", level:"N3", title:"故郷の味", titleVn:"Hương Vị Quê Nhà",
    sentences:[
      { jp:"都会に出てきてもう三年が経ちました。", furigana:"とかいにでてきてもうさんねんがたちました。", vn:"Đã ba năm kể từ khi tôi ra thành phố." },
      { jp:"久しぶりに母の手料理が食べたくなりました。", furigana:"ひさしぶりにははのてりょうりがたべたくなりました。", vn:"Tôi bỗng thèm món ăn do mẹ nấu sau bao lâu." },
      { jp:"電話すると母はすぐに帰ってきなさいと言いました。", furigana:"でんわするとはははすぐにかえってきなさいといいました。", vn:"Khi gọi điện, mẹ liền nói hãy về ngay đi." },
      { jp:"新幹線で二時間、実家に着いたとき母が笑顔で迎えてくれました。", furigana:"しんかんせんでにじかん、じっかについたときははがえがおでむかえてくれました。", vn:"Sau hai tiếng trên tàu Shinkansen, khi về đến nhà mẹ đã đón tôi với nụ cười." },
      { jp:"やっぱり故郷の味は最高だと思いました。", furigana:"やっぱりこきょうのあじはさいこうだとおもいました。", vn:"Tôi nghĩ, hương vị quê nhà vẫn là tuyệt nhất." },
    ],
    vocab:[{jp:"故郷",rom:"kokyou",vn:"quê hương"},{jp:"手料理",rom:"teryouri",vn:"đồ ăn tự nấu"},{jp:"新幹線",rom:"shinkansen",vn:"tàu cao tốc"},{jp:"笑顔",rom:"egao",vn:"nụ cười"}],
    quiz:[
      { q:"都会に来てどのくらい経ちましたか？", opts:["一年","二年","三年","五年"], ans:2 },
      { q:"新幹線でどのくらいかかりましたか？", opts:["一時間","二時間","三時間","四時間"], ans:1 },
    ]
  },
];

function ShortStoryPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [storyIdx, setStoryIdx] = useState(0);
  const [phase, setPhase]       = useState("read"); // "read" | "quiz"
  const [showFuri, setShowFuri] = useState(true);
  const [clickedWord, setClickedWord] = useState(null);
  const [quizAns, setQuizAns]   = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [levelFilter, setLevelFilter] = useState("all");
  const [playing, setPlaying]   = useState(false);

  const stories = levelFilter === "all" ? SHORT_STORIES : SHORT_STORIES.filter(s=>s.level===levelFilter);
  const story = stories[storyIdx % Math.max(stories.length,1)];

  const playStory = () => {
    if (!window.speechSynthesis || playing || !story) return;
    window.speechSynthesis.cancel();
    const fullText = story.sentences.map(s=>s.jp).join("　");
    const u = new SpeechSynthesisUtterance(fullText);
    u.lang = "ja-JP"; u.rate = 0.75;
    u.onstart = () => setPlaying(true);
    u.onend   = () => setPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const quizScore = story ? story.quiz.filter((q,i)=>quizAns[i]===q.ans).length : 0;

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#500724,#9D174D,#BE185D)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>📚</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>SHORT STORY · ĐỌC HIỂU</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>{"📚 Đọc Truyện Ngắn"}</div>
        <div style={{ fontSize:13, opacity:0.8 }}>Truyện 3-5 câu · Furigana · Bấm từ xem nghĩa · Quiz hiểu bài</div>
      </div>

      {/* Level filter + controls */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        {[{id:"all",label:"Tất cả"},  {id:"N5",label:"N5"}, {id:"N4",label:"N4"}, {id:"N3",label:"N3"}].map(f=>(
          <button key={f.id} onClick={()=>{setLevelFilter(f.id);setStoryIdx(0);setPhase("read");setQuizAns({});setQuizDone(false);}}
            style={{ padding:"7px 16px", borderRadius:20, border:`2px solid ${levelFilter===f.id?"#BE185D":"transparent"}`,
              background:levelFilter===f.id?"rgba(190,24,93,0.15)":dark?"rgba(30,41,59,0.6)":"rgba(241,245,249,0.9)",
              color:levelFilter===f.id?"#BE185D":CC.muted, fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {f.label}
          </button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <button onClick={()=>setShowFuri(v=>!v)}
            style={{ padding:"7px 14px", borderRadius:12, border:`1px solid ${showFuri?"rgba(190,24,93,0.4)":"rgba(148,163,184,0.3)"}`,
              background:"transparent", color:showFuri?"#BE185D":CC.muted, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {showFuri?"あ Ẩn furigana":"あ Hiện furigana"}
          </button>
          <button onClick={playStory} disabled={playing}
            style={{ padding:"7px 14px", borderRadius:12, border:`1px solid rgba(190,24,93,0.4)`,
              background:playing?"rgba(190,24,93,0.2)":"transparent", color:"#BE185D", fontSize:12, fontWeight:700, cursor:playing?"default":"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {playing?"🔊 Đang đọc...":"▶ Phát audio"}
          </button>
        </div>
      </div>

      {/* Story navigation */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <button onClick={()=>{setStoryIdx(i=>Math.max(0,(i-1+stories.length)%stories.length));setPhase("read");setQuizAns({});setQuizDone(false);}}
          style={{ width:36, height:36, borderRadius:10, border:`1px solid ${dark?"rgba(190,24,93,0.3)":"rgba(190,24,93,0.2)"}`, background:"transparent", color:"#BE185D", cursor:"pointer", fontSize:16 }}>‹</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <span style={{ fontSize:13, fontWeight:700, color:dark?"#E2E8F0":CC.text }}>{story?.title}</span>
          <span style={{ fontSize:12, color:CC.muted }}> · {story?.titleVn}</span>
          <span style={{ fontSize:11, color:"#BE185D", marginLeft:8 }}>{(storyIdx%stories.length)+1}/{stories.length}</span>
        </div>
        <button onClick={()=>{setStoryIdx(i=>(i+1)%stories.length);setPhase("read");setQuizAns({});setQuizDone(false);}}
          style={{ width:36, height:36, borderRadius:10, border:`1px solid ${dark?"rgba(190,24,93,0.3)":"rgba(190,24,93,0.2)"}`, background:"transparent", color:"#BE185D", cursor:"pointer", fontSize:16 }}>›</button>
      </div>

      {/* Story text */}
      {phase === "read" && story && (
        <div>
          <div style={{ background:bgCard, borderRadius:20, padding:isMob?"18px":"28px", marginBottom:16, border:`1px solid ${dark?"rgba(190,24,93,0.15)":"rgba(190,24,93,0.1)"}` }}>
            {story.sentences.map((s,i)=>(
              <div key={i} style={{ marginBottom:18 }}>
                {showFuri && (
                  <div style={{ fontSize:11, color:CC.muted, fontFamily:"'Noto Sans JP',sans-serif", marginBottom:2 }}>{s.furigana}</div>
                )}
                <div style={{ fontSize:isMob?17:19, fontFamily:"'Noto Sans JP',sans-serif", color:dark?"#E2E8F0":CC.text, lineHeight:1.8, marginBottom:4 }}>
                  {s.jp.split("").map((ch,j)=>(
                    <span key={j} onClick={()=>setClickedWord({char:ch,sent:i})}
                      style={{ cursor:"pointer", borderRadius:4, transition:"background 0.15s",
                        background:clickedWord?.char===ch&&clickedWord?.sent===i?"rgba(190,24,93,0.2)":"transparent" }}>
                      {ch}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize:12, color:CC.muted }}>{s.vn}</div>
              </div>
            ))}
          </div>

          {/* Vocab list */}
          <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:16, border:`1px solid ${dark?"rgba(190,24,93,0.12)":"rgba(190,24,93,0.08)"}` }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#BE185D", marginBottom:10 }}>📖 TỪ VỰNG CHÍNH</div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?2:4},1fr)`, gap:8 }}>
              {story.vocab.map((v,i)=>(
                <div key={i} style={{ background:dark?"rgba(190,24,93,0.1)":"rgba(253,242,248,0.9)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, fontFamily:"'Noto Sans JP',sans-serif", color:"#BE185D" }}>{v.jp}</div>
                  <div style={{ fontSize:11, color:CC.muted }}>{v.rom}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginTop:2 }}>{v.vn}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={()=>setPhase("quiz")}
            style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#BE185D,#9D174D)", color:"white", fontSize:14, fontWeight:800,
              fontFamily:"'Nunito',sans-serif", boxShadow:"0 4px 20px rgba(190,24,93,0.4)" }}>
            📝 Làm quiz hiểu bài →
          </button>
        </div>
      )}

      {/* Quiz phase */}
      {phase === "quiz" && story && (
        <div>
          {story.quiz.map((q,i)=>(
            <div key={i} style={{ background:bgCard, borderRadius:16, padding:"18px", marginBottom:12, border:`1px solid ${dark?"rgba(190,24,93,0.15)":"rgba(190,24,93,0.1)"}` }}>
              <div style={{ fontSize:14, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginBottom:12, fontFamily:"'Noto Sans JP',sans-serif" }}>
                Q{i+1}. {q.q}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {q.opts.map((opt,j)=>{
                  const chosen = quizAns[i]===j;
                  const isCorrect = j===q.ans;
                  const showResult = quizDone;
                  return (
                    <button key={j} onClick={()=>{ if(!quizDone) setQuizAns(a=>({...a,[i]:j})); }}
                      style={{ padding:"10px 14px", borderRadius:10, border:`1.5px solid ${showResult&&isCorrect?"#10B981":showResult&&chosen&&!isCorrect?"#EF4444":chosen?"rgba(190,24,93,0.5)":dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.15)"}`,
                        background:showResult&&isCorrect?"rgba(16,185,129,0.1)":showResult&&chosen&&!isCorrect?"rgba(239,68,68,0.1)":chosen?"rgba(190,24,93,0.1)":"transparent",
                        color:dark?"#E2E8F0":CC.text, textAlign:"left", cursor:quizDone?"default":"pointer",
                        fontSize:13, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:chosen?700:400 }}>
                      {showResult&&isCorrect?"✅ ":showResult&&chosen&&!isCorrect?"❌ ":""}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!quizDone ? (
            <button onClick={()=>setQuizDone(true)} disabled={Object.keys(quizAns).length<story.quiz.length}
              style={{ width:"100%", padding:"12px", borderRadius:14, border:"none",
                background:Object.keys(quizAns).length<story.quiz.length?"rgba(148,163,184,0.2)":"linear-gradient(135deg,#BE185D,#9D174D)",
                color:Object.keys(quizAns).length<story.quiz.length?CC.muted:"white", fontSize:14, fontWeight:800,
                cursor:Object.keys(quizAns).length<story.quiz.length?"not-allowed":"pointer", fontFamily:"'Nunito',sans-serif" }}>
              ✅ Nộp bài
            </button>
          ) : (
            <div>
              <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:12, textAlign:"center",
                border:`2px solid ${quizScore===story.quiz.length?"rgba(16,185,129,0.4)":"rgba(245,158,11,0.4)"}` }}>
                <div style={{ fontSize:28 }}>{quizScore===story.quiz.length?"🎉":"👍"}</div>
                <div style={{ fontSize:18, fontWeight:900, color:quizScore===story.quiz.length?"#10B981":"#F59E0B" }}>
                  {quizScore}/{story.quiz.length} câu đúng
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{setPhase("read");setQuizAns({});setQuizDone(false);}}
                  style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid rgba(190,24,93,0.3)`, background:"transparent", color:"#BE185D", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  ← Đọc lại
                </button>
                <button onClick={()=>{setStoryIdx(i=>(i+1)%stories.length);setPhase("read");setQuizAns({});setQuizDone(false);}}
                  style={{ flex:2, padding:"11px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#BE185D,#9D174D)", color:"white", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  Truyện tiếp →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// KANJI DIAGRAM — Sơ đồ ghép Kanji từ các thành phần cơ bản
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// KANJI MIND MAP — Sơ đồ tư duy cây phả hệ Kanji (bộ thủ → chữ ghép)
// ════════════════════════════════════════════════════════════════
const KJ_LV = {
  N5: { fg:"#059669", bg:"#ECFDF5", bd:"#A7F3D0" },
  N4: { fg:"#2563EB", bg:"#EFF6FF", bd:"#BFDBFE" },
  N3: { fg:"#0891B2", bg:"#ECFEFF", bd:"#A5F3FC" },
  N2: { fg:"#C026D3", bg:"#FDF4FF", bd:"#F0ABFC" },
  N1: { fg:"#D97706", bg:"#FFFBEB", bd:"#FDE68A" },
};

// Mỗi node: kanji, level JLPT, hv (Hán Việt), vn (nghĩa), on, kun, mnemonic (cách nhớ), ex (ví dụ), children[]
const KANJI_TREE_ROOTS = [
  // ── 1. 十 (THẬP) ────────────────────────────────────────────────────────────
  {
    kanji:"十", level:"N5", hv:"THẬP", vn:"Mười, số 10", on:"ジュウ", kun:"とお・と",
    mnemonic:"Hình chữ thập: 1 nét ngang bị cắt bởi 1 nét dọc — đếm đủ 10 ngón tay chéo nhau.",
    ex:[{jp:"十",vn:"mười"},{jp:"十分",vn:"đủ, mười phần"}],
    children:[
      { kanji:"士", level:"N1", hv:"SĨ", vn:"Kẻ sĩ, chiến sĩ", on:"シ", kun:"—",
        mnemonic:"Chữ Thập (十 — học từ 1 đến 10) đứng vững trên một nét ngang (一 — nền tảng vững chắc) → người có HỌC THỨC, kẻ sĩ.",
        ex:[{jp:"兵士",vn:"binh sĩ"},{jp:"博士",vn:"tiến sĩ"}],
        children:[
          { kanji:"売", level:"N4", hv:"MẠI", vn:"Bán", on:"バイ", kun:"う(る)",
            mnemonic:"Người có học (士) đứng ra chào mời khách qua lại (儿, dáng người đi) → BÁN hàng.",
            ex:[{jp:"売る",vn:"bán"},{jp:"販売",vn:"kinh doanh bán hàng"}],
            children:[
              { kanji:"読", level:"N5", hv:"ĐỘC", vn:"Đọc", on:"ドク・トク", kun:"よ(む)",
                mnemonic:"Dùng lời nói (言) để rao Bán (売) từng câu chữ trong sách → ĐỌC to lên.",
                ex:[{jp:"読む",vn:"đọc"},{jp:"読書",vn:"đọc sách"}] },
              { kanji:"続", level:"N4", hv:"TỤC", vn:"Tiếp tục, liên tục", on:"ゾク", kun:"つづ(く)・つづ(ける)",
                mnemonic:"Sợi chỉ (糸) kết nối các quầy Bán hàng (売) kéo dài không ngắt quãng → TIẾP TỤC, LIÊN TỤC.",
                ex:[{jp:"続ける",vn:"tiếp tục"},{jp:"連続",vn:"liên tục"}] },
            ]},
        ]},
      { kanji:"土", level:"N5", hv:"THỔ", vn:"Đất, thổ", on:"ド・ト", kun:"つち",
        mnemonic:"Một nét ngang (一 — mặt đất) nằm bên dưới chữ Thập (十, cắm sâu xuống) → lớp ĐẤT dày.",
        ex:[{jp:"土地",vn:"đất đai"},{jp:"土曜日",vn:"thứ Bảy"}],
        children:[
          { kanji:"王", level:"N3", hv:"VƯƠNG", vn:"Vua, vương", on:"オウ", kun:"—",
            mnemonic:"Ba nét ngang (trời – người – đất) nối bằng một nét dọc ở giữa → người đứng đầu thông suốt cả ba = VUA.",
            ex:[{jp:"王様",vn:"nhà vua"},{jp:"国王",vn:"quốc vương"}],
            children:[
              { kanji:"玉", level:"N2", hv:"NGỌC", vn:"Ngọc, viên bi", on:"ギョク", kun:"たま",
                mnemonic:"Giống chữ Vương (王) nhưng có thêm 1 chấm nhỏ — như viên NGỌC quý được vua đeo bên mình.",
                ex:[{jp:"玉",vn:"viên ngọc/bi"},{jp:"目玉",vn:"con ngươi mắt"}],
                children:[
                  { kanji:"国", level:"N5", hv:"QUỐC", vn:"Đất nước, quốc gia", on:"コク", kun:"くに",
                    mnemonic:"Viên Ngọc quý (玉) được bao bọc, bảo vệ trong một đường biên giới (囗) → lãnh thổ QUỐC GIA.",
                    ex:[{jp:"国",vn:"nước"},{jp:"外国",vn:"nước ngoài"}] },
                  { kanji:"宝", level:"N3", hv:"BẢO", vn:"Bảo vật, của báu", on:"ホウ", kun:"たから",
                    mnemonic:"Viên Ngọc quý (玉) được cất giữ kỹ càng dưới mái nhà (宀) → BẢO VẬT, BÁU VẬT.",
                    ex:[{jp:"宝物",vn:"bảo vật"},{jp:"国宝",vn:"quốc bảo"}] },
                ]},
              { kanji:"皇", level:"N2", hv:"HOÀNG", vn:"Hoàng đế", on:"コウ・オウ", kun:"—",
                mnemonic:"Vị Vua (王) khoác tấm áo choàng màu Trắng (白) cao quý nhất → HOÀNG ĐẾ, THIÊN HOÀNG.",
                ex:[{jp:"天皇",vn:"Thiên hoàng"},{jp:"皇帝",vn:"hoàng đế"}] },
            ]},
          { kanji:"地", level:"N4", hv:"ĐỊA", vn:"Đất đai, địa cầu", on:"チ・ジ", kun:"—",
            mnemonic:"Đất đai (土) trải dài uốn lượn như con bò cạp (也) đến tận chân trời → ĐỊA ĐIỂM, ĐẤT ĐAI.",
            ex:[{jp:"地下鉄",vn:"tàu điện ngầm"},{jp:"地震",vn:"động đất"}] },
          { kanji:"場", level:"N4", hv:"TRƯỜNG", vn:"Nơi chốn, quảng trường", on:"ジョウ", kun:"ば",
            mnemonic:"Khu đất (土) ngập tràn ánh nắng mặt trời chiếu rọi (昜) nơi tụ tập đông đúc → QUẢNG TRƯỜNG, NƠI CHỐN.",
            ex:[{jp:"場所",vn:"địa điểm"},{jp:"会場",vn:"hội trường"}] },
          { kanji:"寺", level:"N4", hv:"TỰ", vn:"Ngôi chùa", on:"ジ", kun:"てら",
            mnemonic:"Ngôi nhà xây trên Đất (土) có quy tắc pháp độ nghiêm minh (寸) → NGÔI CHÙA tĩnh lặng.",
            ex:[{jp:"お寺",vn:"ngôi chùa"},{jp:"寺院",vn:"tu viện, chùa chiền"}] },
        ]},
      { kanji:"古", level:"N5", hv:"CỔ", vn:"Cổ xưa", on:"コ", kun:"ふる(い)",
        mnemonic:"Mười (十) cái Miệng (口) truyền tai nhau kể lại chuyện → chuyện đã CŨ, CỔ XƯA.",
        ex:[{jp:"古い",vn:"cũ"},{jp:"古代",vn:"thời cổ đại"}],
        children:[
          { kanji:"故", level:"N3", hv:"CỐ", vn:"Cố nhân, sự cố, lý do", on:"コ", kun:"ゆえ",
            mnemonic:"Chuyện Cổ xưa (古) bị tác động bởi đòn roi/hành động (攵) dẫn đến biến cố → SỰ CỐ, CỐ Ý.",
            ex:[{jp:"事故",vn:"tai nạn, sự cố"},{jp:"故郷",vn:"cố hương, quê nhà"}] },
          { kanji:"苦", level:"N3", hv:"KHỔ", vn:"Khổ cực, đắng", on:"ク", kun:"くる(しい)・にが(い)",
            mnemonic:"Loại thảo mộc (艹) lâu đời Cổ xưa (古) khi nếm có vị chát ngắt → ĐẮNG CAY, KHỔ CỰC.",
            ex:[{jp:"苦しい",vn:"khổ sở"},{jp:"苦手",vn:"kém, không giỏi"}] },
        ]},
      { kanji:"干", level:"N2", hv:"CAN", vn:"Khô, can thiệp", on:"カン", kun:"ほ(す)・ひ(る)",
        mnemonic:"Hình cái chạc phơi đồ — treo quần áo lên phơi cho KHÔ RÁO dưới nắng.",
        ex:[{jp:"干す",vn:"phơi khô"},{jp:"干渉",vn:"can thiệp"}],
        children:[
          { kanji:"午", level:"N5", hv:"NGỌ", vn:"Giờ Ngọ, buổi trưa", on:"ゴ", kun:"—",
            mnemonic:"Giống chữ Can (干) nhưng nét trên cong lại như kim đồng hồ chỉ đúng 12 giờ TRƯA.",
            ex:[{jp:"午後",vn:"buổi chiều"},{jp:"正午",vn:"chính ngọ"}] },
          { kanji:"舌", level:"N1", hv:"THIỆT", vn:"Cái lưỡi", on:"ゼツ", kun:"した",
            mnemonic:"Vật (干, biến thể) thò ra khỏi Miệng (口) khi nói hoặc nếm → CÁI LƯỠI.",
            ex:[{jp:"舌",vn:"lưỡi"},{jp:"舌打ち",vn:"chép miệng"}],
            children:[
              { kanji:"話", level:"N5", hv:"THOẠI", vn:"Nói, câu chuyện", on:"ワ", kun:"はな(す)・はなし",
                mnemonic:"Lời nói (言, biến thể) phát ra từ cái Lưỡi (舌) → NÓI CHUYỆN.",
                ex:[{jp:"電話",vn:"điện thoại"},{jp:"話す",vn:"nói"}] },
            ]},
        ]},
      { kanji:"南", level:"N5", hv:"NAM", vn:"Phương Nam", on:"ナン", kun:"みなみ",
        mnemonic:"Giống một cây thập (十) treo giữa hai cột như cổng chào — hướng về phía có nắng ấm quanh năm → PHƯƠNG NAM.",
        ex:[{jp:"南",vn:"phía Nam"},{jp:"南極",vn:"Nam Cực"}] },
      { kanji:"牛", level:"N4", hv:"NGƯU", vn:"Con bò, trâu", on:"ギュウ", kun:"うし",
        mnemonic:"Hình đầu con bò với hai cái sừng cong lên trên, thân dưới thẳng → CON BÒ.",
        ex:[{jp:"牛肉",vn:"thịt bò"},{jp:"牛乳",vn:"sữa bò"}],
        children:[
          { kanji:"生", level:"N5", hv:"SINH", vn:"Sinh ra, sự sống", on:"セイ・ショウ", kun:"い(きる)・う(まれる)・なま",
            mnemonic:"Con bò (牛) đang mọc lên một mầm cây non (thêm nét dưới) → sự SINH SÔI, SỐNG.",
            ex:[{jp:"先生",vn:"giáo viên"},{jp:"生まれる",vn:"sinh ra"}],
            children:[
              { kanji:"産", level:"N4", hv:"SẢN", vn:"Sinh sản, sản xuất", on:"サン", kun:"う(む)・う(まれる)",
                mnemonic:"Đứng trên vách đá (广/产) đón nhận sự sống mới Sinh sôi (生) → SINH NỞ, SẢN PHẨM.",
                ex:[{jp:"生産",vn:"sản xuất"},{jp:"産業",vn:"ngành công nghiệp"}] },
              { kanji:"星", level:"N4", hv:"TINH", vn:"Ngôi sao", on:"セイ・ショウ", kun:"ほし",
                mnemonic:"Mặt trời (日) ban tặng Sinh khí (生) lấp lánh trong đêm tối → NGÔI SAO.",
                ex:[{jp:"星",vn:"ngôi sao"},{jp:"火星",vn:"sao Hỏa"}] },
            ]},
          { kanji:"物", level:"N4", hv:"VẬT", vn:"Đồ vật, động vật", on:"ブツ・モツ", kun:"もの",
            mnemonic:"Con Bò (牛) và con chim biến ảo (勿) là những tạo VẬT sống động của tự nhiên → ĐỒ VẬT, SINH VẬT.",
            ex:[{jp:"食べ物",vn:"thức ăn"},{jp:"動物",vn:"động vật"}] },
          { kanji:"特", level:"N4", hv:"ĐẶC", vn:"Đặc biệt", on:"トク", kun:"—",
            mnemonic:"Con Bò (牛) quý được dâng cúng trong ngôi Chùa (寺) linh thiêng → vô cùng ĐẶC BIỆT.",
            ex:[{jp:"特別",vn:"đặc biệt"},{jp:"特に",vn:"đặc biệt là"}] },
        ]},
      { kanji:"米", level:"N3", hv:"MỄ", vn:"Gạo", on:"ベイ・マイ", kun:"こめ",
        mnemonic:"Hình những hạt gạo (4 chấm) rải quanh cây lúa Thập (十) ở giữa → hạt GẠO.",
        ex:[{jp:"米",vn:"gạo"},{jp:"お米",vn:"cơm gạo"}],
        children:[
          { kanji:"来", level:"N5", hv:"LAI", vn:"Đến, tới", on:"ライ", kun:"く(る)・きた(る)",
            mnemonic:"Giống bông lúa (米, biến thể) đang trổ bông báo hiệu mùa vụ mới ĐẾN.",
            ex:[{jp:"来る",vn:"đến"},{jp:"未来",vn:"tương lai"}] },
          { kanji:"料", level:"N4", hv:"LIỆU", vn:"Nguyên liệu, phí tổn", on:"リョウ", kun:"—",
            mnemonic:"Dùng cái gáo đong (斗) đong từng thúng Gạo (米) làm phí ăn uống → NGUYÊN LIỆU, TIỀN PHÍ.",
            ex:[{jp:"料理",vn:"nấu ăn, món ăn"},{jp:"料金",vn:"tiền phí"}] },
          { kanji:"数", level:"N3", hv:"SỐ", vn:"Con số, đếm", on:"スウ", kun:"かず・かぞ(える)",
            mnemonic:"Người phụ nữ (女) gõ nhẹ (攵) đong đếm từng hạt Gạo (米) → CON SỐ, ĐẾM.",
            ex:[{jp:"数字",vn:"chữ số"},{jp:"数える",vn:"đếm"}] },
        ]},
      { kanji:"木", level:"N5", hv:"MỘC", vn:"Cây, gỗ", on:"モク・ボク", kun:"き",
        mnemonic:"Hình cái cây: có gốc rễ dưới, thân giữa và cành lá xòe ra hai bên.",
        ex:[{jp:"木",vn:"cây"},{jp:"木曜日",vn:"thứ Năm"}],
        children:[
          { kanji:"東", level:"N5", hv:"ĐÔNG", vn:"Phương Đông", on:"トウ", kun:"ひがし",
            mnemonic:"Mặt trời (日) mọc lên sau lũy tre (木) mỗi sáng → hướng mặt trời mọc = phương ĐÔNG.",
            ex:[{jp:"東",vn:"phía Đông"},{jp:"東京",vn:"Tokyo"}] },
          { kanji:"休", level:"N5", hv:"HƯU", vn:"Nghỉ ngơi", on:"キュウ", kun:"やす(む)",
            mnemonic:"Người (人) đứng tựa vào gốc cây (木) để NGHỈ NGƠI dưới bóng mát.",
            ex:[{jp:"休む",vn:"nghỉ"},{jp:"休日",vn:"ngày nghỉ"}] },
          { kanji:"本", level:"N5", hv:"BẢN", vn:"Gốc rễ, sách, bản chất", on:"ホン", kun:"もと",
            mnemonic:"Cái cây (木) có thêm một nét gạch ngang ở dưới đánh dấu phần GỐC RỄ, CỐT LÕI → SÁCH, NỀN TẢNG.",
            ex:[{jp:"本",vn:"sách"},{jp:"日本",vn:"Nhật Bản"}],
            children:[
              { kanji:"体", level:"N5", hv:"THỂ", vn:"Cơ thể, thân thể", on:"タイ", kun:"からだ",
                mnemonic:"Người (亻) dựa vào Gốc rễ/Bản chất (本) đo đạc tầm vóc → THÂN THỂ, CƠ THỂ.",
                ex:[{jp:"体",vn:"cơ thể"},{jp:"体力",vn:"thể lực"}] },
            ]},
          { kanji:"校", level:"N5", hv:"HIỆU", vn:"Trường học", on:"コウ", kun:"—",
            mnemonic:"Ngôi trường dựng bằng Gỗ (木) nơi mọi người tụ họp (交 - giao lưu) trao đổi tri thức → TRƯỜNG HỌC.",
            ex:[{jp:"学校",vn:"trường học"},{jp:"高校",vn:"trường cấp 3"}] },
          { kanji:"村", level:"N4", hv:"THÔN", vn:"Thôn làng, bản làng", on:"ソン", kun:"むら",
            mnemonic:"Nơi có nhiều Cây cối (木) trong vòng một tấc gang (寸) bình yên → THÔN XÓM, LÀNG MẠC.",
            ex:[{jp:"村",vn:"ngôi làng"},{jp:"農村",vn:"nông thôn"}] },
          { kanji:"林", level:"N5", hv:"LÂM", vn:"Rừng nhỏ", on:"リン", kun:"はやし",
            mnemonic:"Hai cây (木×2) đứng cạnh nhau → một RỪNG NHỎ, bụi cây thưa.",
            ex:[{jp:"林檎",vn:"quả táo"},{jp:"森林",vn:"rừng cây"}],
            children:[
              { kanji:"森", level:"N5", hv:"SÂM", vn:"Rừng rậm", on:"シン", kun:"もり",
                mnemonic:"Rừng nhỏ (林) mọc thêm một cây nữa (木) → RỪNG RẬM um tùm, nhiều tầng cây.",
                ex:[{jp:"森林",vn:"rừng cây"},{jp:"森",vn:"khu rừng"}] },
            ]},
        ]},
    ]
  },

  // ── 2. 一 (NHẤT) ────────────────────────────────────────────────────────────
  { kanji:"一", level:"N5", hv:"NHẤT", vn:"Một, số 1", on:"イチ・イツ", kun:"ひと(つ)",
    mnemonic:"Một nét ngang đơn giản nhất — tượng trưng cho số 1, hoặc mặt đất/đường chân trời.",
    ex:[{jp:"一",vn:"một"},{jp:"一番",vn:"số một"}],
    children:[
      { kanji:"二", level:"N5", hv:"NHỊ", vn:"Hai, số 2", on:"ニ", kun:"ふた(つ)",
        mnemonic:"Hai nét ngang song song trên dưới — số 2.",
        ex:[{jp:"二つ",vn:"hai cái"},{jp:"二月",vn:"tháng Hai"}],
        children:[
          { kanji:"三", level:"N5", hv:"TAM", vn:"Ba, số 3", on:"サン", kun:"みっ(つ)",
            mnemonic:"Ba nét ngang song song — đại diện cho số 3 (Thiên - Địa - Nhân).",
            ex:[{jp:"三つ",vn:"ba cái"},{jp:"三日",vn:"ngày mồng 3"}] },
        ]},
      { kanji:"上", level:"N5", hv:"THƯỢNG", vn:"Ở trên, lên trên", on:"ジョウ・ショウ", kun:"うえ・あ(がる)・のぼ(る)",
        mnemonic:"Một nét đứng chỉ phương hướng nằm TRÊN một đường ngang nền tảng → PHÍA TRÊN, LÊN TRÊN.",
        ex:[{jp:"上",vn:"trên"},{jp:"上手",vn:"giỏi giang"}],
        children:[
          { kanji:"卡", level:"N1", hv:"TẠP", vn:"Thẻ, trạm kiểm soát", on:"カ", kun:"—",
            mnemonic:"Ở giữa lưng chừng Trên (上) và Dưới (下) bị kẹt lại → TRẠM KIỂM SOÁT, THẺ CARD.",
            ex:[{jp:"カード",vn:"thẻ"},{jp:"関卡",vn:"trạm gác"}] },
        ]},
      { kanji:"下", level:"N5", hv:"HẠ", vn:"Ở dưới, xuống dưới", on:"カ・ゲ", kun:"した・さ(がる)・くだ(る)",
        mnemonic:"Một nét rủ xuống chỉ phương hướng nằm DƯỚI đường ngang nền tảng → PHÍA DƯỚI, HẠ XUỐNG.",
        ex:[{jp:"下",vn:"dưới"},{jp:"下手",vn:"kém, vụng về"}] },
      { kanji:"百", level:"N5", hv:"BÁCH", vn:"Một trăm, số 100", on:"ヒャク", kun:"—",
        mnemonic:"Một nét ngang (一) kết hợp chữ Bạch (白 - sáng tỏ) → đếm đủ 100 sáng rõ.",
        ex:[{jp:"百",vn:"một trăm"},{jp:"八百屋",vn:"cửa hàng rau củ"}] },
      { kanji:"千", level:"N5", hv:"THIÊN", vn:"Một nghìn, số 1000", on:"セン", kun:"ち",
        mnemonic:"Người (亻) vác cây thập (十) tiến bước ngàn dặm → con số MỘT NGHÌN (1000).",
        ex:[{jp:"千",vn:"một nghìn"},{jp:"千葉",vn:"tỉnh Chiba"}] },
      { kanji:"万", level:"N5", hv:"VẠN", vn:"Mười nghìn, số 10.000", on:"マン・バン", kun:"—",
        mnemonic:"Một đường ngang (一) bao bọc bước chân uốn lượn (勹) vô tận → con số MƯỜI NGHÌN (10.000).",
        ex:[{jp:"一万",vn:"mười nghìn"},{jp:"万一",vn:"vạn nhất, lỡ như"}] },
    ]
  },

  // ── 3. 大 (ĐẠI) ────────────────────────────────────────────────────────────
  { kanji:"大", level:"N5", hv:"ĐẠI", vn:"To lớn", on:"ダイ・タイ", kun:"おお(きい)",
    mnemonic:"Hình người dang rộng hai tay hai chân — biểu thị sự to lớn.",
    ex:[{jp:"大きい",vn:"to lớn"},{jp:"大学",vn:"đại học"}],
    children:[
      { kanji:"天", level:"N5", hv:"THIÊN", vn:"Bầu trời", on:"テン", kun:"あま・てん",
        mnemonic:"Người To Lớn (大) đội thêm một nét ngang (一) lên đầu → thứ bao trùm cao nhất = BẦU TRỜI.",
        ex:[{jp:"天気",vn:"thời tiết"},{jp:"天才",vn:"thiên tài"}] },
      { kanji:"太", level:"N4", hv:"THÁI", vn:"Béo mập, thái quá", on:"タイ・タ", kun:"ふと(い)・ふと(る)",
        mnemonic:"Người to lớn (大) có thêm một cục mỡ (chấm dưới) → BÉO TRÒN, MẬP MẠP.",
        ex:[{jp:"太い",vn:"béo, to, đậm"},{jp:"太陽",vn:"mặt trời (thái dương)"}] },
      { kanji:"犬", level:"N5", hv:"KHUYỂN", vn:"Con chó", on:"ケン", kun:"いぬ",
        mnemonic:"Người to lớn (大) có thêm một đốm chấm nhỏ trên vai như con chó trung thành chạy theo → CON CHÓ.",
        ex:[{jp:"犬",vn:"con chó"},{jp:"子犬",vn:"chó con"}] },
      { kanji:"夫", level:"N4", hv:"PHU", vn:"Chồng, trượng phu", on:"フ・フウ", kun:"おっと",
        mnemonic:"Người đàn ông to lớn (大) cài chiếc trâm ngang (一) lên tóc khi thành gia thất → NGƯỜI CHỒNG.",
        ex:[{jp:"夫",vn:"chồng"},{jp:"夫婦",vn:"vợ chồng"}] },
      { kanji:"央", level:"N3", hv:"ƯƠNG", vn:"Trung ương, ở giữa", on:"オウ", kun:"—",
        mnemonic:"Người to lớn (大) bị mang cái gông vuông ngay chính giữa thân mình → TRUNG ƯƠNG, CHÍNH GIỮA.",
        ex:[{jp:"中央",vn:"trung ương"},{jp:"中央口",vn:"cổng trung tâm"}],
        children:[
          { kanji:"英", level:"N5", hv:"ANH", vn:"Anh hùng, tiếng Anh", on:"エイ", kun:"—",
            mnemonic:"Hoa cỏ tươi đẹp (艹) nở rộ ngay trung tâm (央) tinh túy → TÀI NĂNG, ANH HÙNG (nước Anh).",
            ex:[{jp:"英語",vn:"tiếng Anh"},{jp:"英国",vn:"nước Anh"}] },
        ]},
    ]
  },

  // ── 4. 人 (NHÂN) ────────────────────────────────────────────────────────────
  { kanji:"人", level:"N5", hv:"NHÂN", vn:"Người", on:"ジン・ニン", kun:"ひと",
    mnemonic:"Hình dáng hai chân người đang bước đi hoặc đứng nghiêng dựa vào nhau.",
    ex:[{jp:"人",vn:"người"},{jp:"日本人",vn:"người Nhật"}],
    children:[
      { kanji:"今", level:"N5", hv:"KIM", vn:"Bây giờ, hiện tại", on:"コン・キン", kun:"いま",
        mnemonic:"Người (人) tụ lại trong một tích tắc đồng hồ (㇇) điểm đúng lúc này → BÂY GIỜ, HIỆN TẠI.",
        ex:[{jp:"今",vn:"bây giờ"},{jp:"今日",vn:"hôm nay"}],
        children:[
          { kanji:"会", level:"N5", hv:"HỘI", vn:"Gặp gỡ, hội họp", on:"カイ・エ", kun:"あ(う)",
            mnemonic:"Nhiều Người (人) cùng tụ họp tại một địa điểm mây gió (云) hội tụ → GẶP GỠ, HỘI HỌP.",
            ex:[{jp:"会う",vn:"gặp gỡ"},{jp:"会社",vn:"công ty"}] },
        ]},
      { kanji:"仕", level:"N4", hv:"SĨ", vn:"Phục vụ, làm việc", on:"シ・ジ", kun:"つか(える)",
        mnemonic:"Người (亻) mang phẩm chất của kẻ Sĩ (士) tận tụy cống hiến → PHỤC VỤ, LÀM VIỆC.",
        ex:[{jp:"仕事",vn:"công việc"},{jp:"仕方",vn:"cách làm"}] },
      { kanji:"作", level:"N5", hv:"TÁC", vn:"Chế tác, làm ra", on:"サク・サ", kun:"つく(る)",
        mnemonic:"Người (亻) cầm dao gọt đẽo nhanh chóng (乍) tạo nên sản phẩm → CHẾ TÁC, LÀM RA.",
        ex:[{jp:"作る",vn:"làm, chế tạo"},{jp:"作文",vn:"bài tập làm văn"}] },
      { kanji:"使", level:"N4", hv:"SỬ", vn:"Sử dụng, sai khiến", on:"シ", kun:"つか(う)",
        mnemonic:"Người (亻) cử vị quan văn (吏) đi làm sứ giả thực thi nhiệm vụ → SỬ DỤNG, SAI PHÁI.",
        ex:[{jp:"使う",vn:"dùng, sử dụng"},{jp:"大使館",vn:"đại sứ quán"}] },
      { kanji:"住", level:"N4", hv:"TRÚ", vn:"Sinh sống, cư trú", on:"ジュウ", kun:"す(む)・す(まう)",
        mnemonic:"Người (亻) làm Chủ (主) một mái nhà vững chắc ấm êm → CƯ TRÚ, SINH SỐNG.",
        ex:[{jp:"住む",vn:"sinh sống"},{jp:"住所",vn:"địa chỉ"}] },
      { kanji:"信", level:"N4", hv:"TÍN", vn:"Tin tưởng, uy tín", on:"シン", kun:"—",
        mnemonic:"Người (亻) nói ra Lời nói (言) chân thật không dối trá → ĐÁNG TIN CẬY, UY TÍN.",
        ex:[{jp:"信じる",vn:"tin tưởng"},{jp:"自信",vn:"tự tin"}] },
      { kanji:"何", level:"N5", hv:"HÀ", vn:"Cái gì, mấy", on:"カ", kun:"なに・なん",
        mnemonic:"Người (亻) vác trên vai vật có thể mang (可) và cất tiếng hỏi 'cái gì thế?' → CÁI GÌ.",
        ex:[{jp:"何",vn:"cái gì"},{jp:"何時",vn:"mấy giờ"}] },
      { kanji:"便", level:"N4", hv:"TIỆN", vn:"Thuận tiện, bưu kiện", on:"ベン・ビン", kun:"たよ(り)",
        mnemonic:"Người (亻) làm việc đổi thay canh tân (更) để cuộc sống dễ dàng hơn → THUẬN TIỆN, BƯU ĐIỆN.",
        ex:[{jp:"便利",vn:"tiện lợi"},{jp:"郵便局",vn:"bưu điện"}] },
      { kanji:"働", level:"N4", hv:"ĐỘNG", vn:"Lao động, làm việc", on:"ドウ", kun:"はたら(く)",
        mnemonic:"Con người (亻) dốc toàn bộ sức lực chuyển Động (動) chân tay → LAO ĐỘNG, LÀM VIỆC.",
        ex:[{jp:"働く",vn:"làm việc"},{jp:"労働",vn:"lao động"}] },
    ]
  },

  // ── 5. 日 (NHẬT) ────────────────────────────────────────────────────────────
  { kanji:"日", level:"N5", hv:"NHẬT", vn:"Mặt trời, ngày", on:"ニチ・ジツ", kun:"ひ・か",
    mnemonic:"Hình mặt trời tròn được vuông hóa, với một nét ngang ở giữa tượng trưng ánh sáng.",
    ex:[{jp:"日曜日",vn:"chủ Nhật"},{jp:"毎日",vn:"hàng ngày"}],
    children:[
      { kanji:"明", level:"N5", hv:"MINH", vn:"Sáng, rõ ràng", on:"メイ・ミョウ", kun:"あか(るい)",
        mnemonic:"Mặt trời (日) và Mặt trăng (月) cùng tỏa sáng bên nhau → SÁNG RÕ, rực rỡ.",
        ex:[{jp:"明るい",vn:"sáng sủa"},{jp:"説明",vn:"giải thích"}] },
      { kanji:"早", level:"N5", hv:"TẢO", vn:"Sớm, nhanh", on:"ソウ・サッ", kun:"はや(い)",
        mnemonic:"Mặt trời (日) vừa ló rạng trên ngọn cây Thập (十) lúc bình minh → SỚM MAI, NHANH CHÓNG.",
        ex:[{jp:"早い",vn:"sớm, nhanh"},{jp:"早朝",vn:"sáng sớm"}],
        children:[
          { kanji:"草", level:"N4", hv:"THẢO", vn:"Cỏ, thảo mộc", on:"ソウ", kun:"くさ",
            mnemonic:"Ngọn Cỏ (艹) vươn mầm đón ánh nắng sớm (早) mai → CỎ DẠI, CÂY CỎ.",
            ex:[{jp:"草",vn:"cỏ"},{jp:"草原",vn:"thảo nguyên"}] },
        ]},
      { kanji:"時", level:"N5", hv:"THỜI", vn:"Thời gian, giờ", on:"ジ", kun:"とき",
        mnemonic:"Mặt trời (日) chiếu bóng xuống thềm Ngôi chùa (寺) để đo khắc giờ → THỜI GIAN, GIỜ GIẤC.",
        ex:[{jp:"時間",vn:"thời gian"},{jp:"一時",vn:"một giờ"}] },
      { kanji:"春", level:"N5", hv:"XUÂN", vn:"Mùa xuân", on:"シュン", kun:"はる",
        mnemonic:"Ba người (三 + 人) cùng hân hoan đón ánh nắng Mặt trời (日) ấm áp trở lại → MÙA XUÂN.",
        ex:[{jp:"春",vn:"mùa xuân"},{jp:"青春",vn:"thanh xuân"}] },
      { kanji:"間", level:"N5", hv:"GIAN", vn:"Khoảng thời gian, ở giữa", on:"カン・ケン", kun:"あいだ・ま",
        mnemonic:"Ánh nắng Mặt trời (日) lọt qua khe hé của Cánh cổng (門) → KHOẢNG TRỐNG, Ở GIỮA.",
        ex:[{jp:"間",vn:"ở giữa"},{jp:"人間",vn:"con người"}] },
      { kanji:"晴", level:"N4", hv:"TÌNH", vn:"Nắng ráo, tạnh mưa", on:"セイ", kun:"は(れる)・は(れ)",
        mnemonic:"Mặt trời (日) tỏa sáng rực rỡ làm bầu trời trở lại màu Xanh biếc (青) → TRỜI NẮNG ĐẸP.",
        ex:[{jp:"晴れ",vn:"trời nắng"},{jp:"晴天",vn:"ngày nắng đẹp"}] },
      { kanji:"暗", level:"N4", hv:"ÁM", vn:"Tối tăm, u ám", on:"アン", kun:"くら(い)",
        mnemonic:"Mặt trời (日) lặn mất tăm, chỉ còn nghe thấy Âm thanh (音) trong màn đêm → TỐI TĂM, U ÁM.",
        ex:[{jp:"暗い",vn:"tối tăm"},{jp:"暗記",vn:"học thuộc lòng"}] },
      { kanji:"曜", level:"N5", hv:"DIỆU", vn:"Ngày trong tuần", on:"ヨウ", kun:"—",
        mnemonic:"Mặt trời (日) chiếu sáng đàn chim lông vũ sặc sỡ (翟) tượng trưng cho các tinh tú → THỨ TRONG TUẦN.",
        ex:[{jp:"曜日",vn:"thứ trong tuần"},{jp:"火曜日",vn:"thứ Ba"}] },
    ]
  },

  // ── 6. 月 (NGUYỆT) ────────────────────────────────────────────────────────────
  { kanji:"月", level:"N5", hv:"NGUYỆT", vn:"Mặt trăng, tháng", on:"ゲツ・ガツ", kun:"つき",
    mnemonic:"Hình lưỡi liềm cong của mặt trăng khuyết chiếu sáng ban đêm.",
    ex:[{jp:"月",vn:"mặt trăng"},{jp:"来月",vn:"tháng sau"}],
    children:[
      { kanji:"朝", level:"N5", hv:"TRIÊU", vn:"Buổi sáng", on:"チョウ", kun:"あさ",
        mnemonic:"Mặt trời mọc giữa các bụi cỏ (十日十) lúc bình minh và Mặt trăng (月) còn mờ mờ ở phía tây → BUỔI SÁNG.",
        ex:[{jp:"朝",vn:"buổi sáng"},{jp:"朝食",vn:"bữa sáng"}] },
      { kanji:"有", level:"N4", hv:"HỮU", vn:"Có, tồn tại", on:"ユウ・ウ", kun:"あ(る)",
        mnemonic:"Bàn tay (𠂇) nắm giữ miếng thịt hình mặt trăng (月) → NẮM CÓ, TỒN TẠI.",
        ex:[{jp:"有名",vn:"nổi tiếng"},{jp:"有料",vn:"có tính phí"}],
        children:[
          { kanji:"服", level:"N4", hv:"PHỤC", vn:"Quần áo, phục tùng", on:"フク", kun:"—",
            mnemonic:"Người có thân hình (月) quỳ phục (卩/又) mặc trang phục chỉnh tề → QUẦN ÁO, PHỤC VỤ.",
            ex:[{jp:"服",vn:"quần áo"},{jp:"洋服",vn:"âu phục"}] },
        ]},
      { kanji:"期", level:"N3", hv:"KỲ", vn:"Kỳ hạn, thời kỳ", on:"キ・ゴ", kun:"—",
        mnemonic:"Mặt trăng (月) tròn khuyết đều đặn theo cái sàng thời gian (其) → KỲ HẠN, GIAI ĐOẠN.",
        ex:[{jp:"期間",vn:"giai đoạn, kỳ hạn"},{jp:"期待",vn:"kỳ vọng"}] },
    ]
  },

  // ── 7. 女 (NỮ) ────────────────────────────────────────────────────────────
  { kanji:"女", level:"N5", hv:"NỮ", vn:"Nữ, phụ nữ", on:"ジョ・ニョ", kun:"おんな",
    mnemonic:"Hình dáng người phụ nữ đang quỳ, khoanh tay dịu dàng, duyên dáng.",
    ex:[{jp:"女",vn:"phụ nữ"},{jp:"女性",vn:"nữ giới"}],
    children:[
      { kanji:"好", level:"N5", hv:"HẢO", vn:"Yêu thích, tốt đẹp", on:"コウ", kun:"す(き)・この(む)",
        mnemonic:"Người mẹ (女) bên cạnh đứa con thơ (子) → tình cảm YÊU THÍCH, gắn bó tự nhiên.",
        ex:[{jp:"好き",vn:"thích"},{jp:"好物",vn:"món khoái khẩu"}] },
      { kanji:"安", level:"N5", hv:"AN", vn:"An toàn, bình an, rẻ", on:"アン", kun:"やす(い)",
        mnemonic:"Người phụ nữ (女) ở yên dưới Mái nhà (宀) che chở ấm êm → AN TOÀN, RẺ (yên tâm).",
        ex:[{jp:"安い",vn:"rẻ"},{jp:"安心",vn:"an tâm"}],
        children:[
          { kanji:"案", level:"N3", hv:"ÁN", vn:"Đề án, phương án", on:"アン", kun:"—",
            mnemonic:"Ý kiến an toàn (安) được ghi chép trên thẻ Gỗ (木) → ĐỀ ÁN, KẾ HOẠCH.",
            ex:[{jp:"案内",vn:"hướng dẫn"},{jp:"提案",vn:"đề xuất"}] },
        ]},
      { kanji:"妹", level:"N5", hv:"MUỘI", vn:"Em gái", on:"マイ", kun:"いもうと",
        mnemonic:"Người con gái (女) còn non nớt chưa trưởng thành (未 - vị thành niên) → EM GÁI.",
        ex:[{jp:"妹",vn:"em gái"},{jp:"姉妹",vn:"chị em gái"}] },
      { kanji:"姉", level:"N5", hv:"TỶ", vn:"Chị gái", on:"シ", kun:"あね",
        mnemonic:"Người con gái (女) làm gương và quản xuyến việc chợ búa thành thị (市) → CHỊ GÁI.",
        ex:[{jp:"姉",vn:"chị gái"},{jp:"お姉さん",vn:"chị gái (kính ngữ)"}] },
      { kanji:"始", level:"N4", hv:"THỦY", vn:"Bắt đầu, khởi đầu", on:"シ", kun:"はじ(める)・はじ(まる)",
        mnemonic:"Người phụ nữ (女) bước lên bục đài (台) cất tiếng hát khai mạc → BẮT ĐẦU.",
        ex:[{jp:"始める",vn:"bắt đầu"},{jp:"開始",vn:"khởi đầu, bắt đầu"}] },
      { kanji:"妻", level:"N3", hv:"THÊ", vn:"Người vợ", on:"サイ", kun:"つま",
        mnemonic:"Người phụ nữ (女) xắn tay áo cầm chổi quét dọn việc nhà → NGƯỜI VỢ.",
        ex:[{jp:"妻",vn:"vợ (mình)"},{jp:"夫妻",vn:"vợ chồng"}] },
    ]
  },

  // ── 8. 子 (TỬ) ────────────────────────────────────────────────────────────
  { kanji:"子", level:"N5", hv:"TỬ", vn:"Con, trẻ em", on:"シ・ス", kun:"こ",
    mnemonic:"Hình đứa trẻ sơ sinh quấn trong tã, đầu to hơn thân dang hai tay.",
    ex:[{jp:"子供",vn:"trẻ con"},{jp:"息子",vn:"con trai"}],
    children:[
      { kanji:"学", level:"N5", hv:"HỌC", vn:"Học hành, học sinh", on:"ガク", kun:"まな(ぶ)",
        mnemonic:"Đứa trẻ (子) ngồi dưới mái trường rèn luyện đôi bàn tay tri thức (⺍ + 冖) → HỌC HỎI.",
        ex:[{jp:"学生",vn:"học sinh"},{jp:"大学",vn:"đại học"}] },
      { kanji:"字", level:"N5", hv:"TỰ", vn:"Chữ viết, văn tự", on:"ジ", kun:"あざ",
        mnemonic:"Đứa trẻ (子) ngồi dưới Mái nhà (宀) nắn nót tập viết từng nét chữ → CHỮ VIẾT, HÁN TỰ.",
        ex:[{jp:"漢字",vn:"chữ Hán"},{jp:"文字",vn:"chữ cái, văn tự"}] },
      { kanji:"季", level:"N3", hv:"QUÝ", vn:"Mùa, mùa vụ", on:"キ", kun:"—",
        mnemonic:"Lúa non (禾) được gieo trồng như chăm sóc con trẻ (子) theo từng mùa vụ → MÙA TRONG NĂM.",
        ex:[{jp:"季節",vn:"mùa, tiết trời"},{jp:"四季",vn:"bốn mùa"}] },
    ]
  },

  // ── 9. 田 (ĐIỀN) ────────────────────────────────────────────────────────────
  { kanji:"田", level:"N5", hv:"ĐIỀN", vn:"Ruộng đồng", on:"デン", kun:"た",
    mnemonic:"Hình cánh đồng ruộng được chia thành 4 ô vuông ngăn nắp có mương dẫn nước.",
    ex:[{jp:"田んぼ",vn:"ruộng lúa"},{jp:"水田",vn:"ruộng nước"}],
    children:[
      { kanji:"男", level:"N5", hv:"NAM", vn:"Đàn ông, con trai", on:"ダン・ナン", kun:"おとこ",
        mnemonic:"Người dùng Sức mạnh (力) để cày Ruộng (田) → hình ảnh người ĐÀN ÔNG.",
        ex:[{jp:"男性",vn:"nam giới"},{jp:"男の子",vn:"bé trai"}] },
      { kanji:"町", level:"N5", hv:"ĐINH", vn:"Thị trấn, khu phố", on:"チョウ", kun:"まち",
        mnemonic:"Cánh đồng (田) có cọc đinh (丁) cắm chỉ đường dẫn vào phố xá → THỊ TRẤN, KHU PHỐ.",
        ex:[{jp:"町",vn:"thị trấn, phố"},{jp:"下町",vn:"khu phố cổ"}] },
      { kanji:"界", level:"N4", hv:"GIỚI", vn:"Ranh giới, thế giới", on:"カイ", kun:"—",
        mnemonic:"Người đứng chia tách (介) ranh giới giữa các thửa Ruộng (田) → THẾ GIỚI, PHÂN GIỚI.",
        ex:[{jp:"世界",vn:"thế giới"},{jp:"限界",vn:"giới hạn"}] },
      { kanji:"画", level:"N4", hv:"HỌA", vn:"Bức tranh, kế hoạch", on:"ガ・カク", kun:"えが(く)",
        mnemonic:"Cây bút vẽ (聿) phân chia các ô ranh giới trên thửa Ruộng (田) → BỨC TRANH, KẾ HOẠCH.",
        ex:[{jp:"映画",vn:"phim ảnh"},{jp:"計画",vn:"kế hoạch"}] },
      { kanji:"留", level:"N4", hv:"LƯU", vn:"Lưu lại, giữ lại", on:"リュウ・ル", kun:"と(める)・と(まる)",
        mnemonic:"Móc cài (卯) giữ chân người ở lại trên cánh Đồng (田) làm việc → Ở LẠI, LƯU HỌC.",
        ex:[{jp:"留学生",vn:"du học sinh"},{jp:"留守",vn:"vắng nhà"}] },
    ]
  },

  // ── 10. 力 (LỰC) ────────────────────────────────────────────────────────────
  { kanji:"力", level:"N5", hv:"LỰC", vn:"Sức mạnh, năng lực", on:"リョク・リキ", kun:"ちから",
    mnemonic:"Hình bắp tay gồng lên cuồn cuộn, thể hiện sức mạnh cơ bắp.",
    ex:[{jp:"力",vn:"sức lực"},{jp:"努力",vn:"nỗ lực"}],
    children:[
      { kanji:"動", level:"N4", hv:"ĐỘNG", vn:"Chuyển động, cử động", on:"ドウ", kun:"うご(く)・うご(かす)",
        mnemonic:"Dùng Sức lực (力) đẩy cả khối hàng Nặng nề (重) lăn bánh → DI CHUYỂN, HOẠT ĐỘNG.",
        ex:[{jp:"動く",vn:"chuyển động"},{jp:"運動",vn:"vận động, thể thao"}] },
      { kanji:"助", level:"N3", hv:"TRỢ", vn:"Giúp đỡ, viện trợ", on:"ジョ", kun:"たす(ける)・たす(かる)",
        mnemonic:"Dốc Sức lực (力) giúp đỡ khi người khác dựng đồ xếp chồng (且) → CỨU GIÚP, VIỆN TRỢ.",
        ex:[{jp:"助ける",vn:"giúp đỡ, cứu"},{jp:"救助",vn:"cứu hộ"}] },
      { kanji:"勉", level:"N5", hv:"MIỄN", vn:"Cố gắng, chăm chỉ", on:"ベン", kun:"つと(める)",
        mnemonic:"Người trốn thoát sinh nở (免) vẫn dốc hết Sức lực (力) vươn lên → CỐ GẮNG, HỌC HỎI.",
        ex:[{jp:"勉強",vn:"học tập"},{jp:"勉学",vn:"chăm chỉ học hành"}] },
    ]
  },

  // ── 11. 口 (KHẨU) ────────────────────────────────────────────────────────────
  { kanji:"口", level:"N5", hv:"KHẨU", vn:"Miệng, cửa vào", on:"コウ・ク", kun:"くち",
    mnemonic:"Hình cái miệng đang mở ra thành hình chữ nhật.",
    ex:[{jp:"口",vn:"miệng"},{jp:"入口",vn:"lối vào"}],
    children:[
      { kanji:"右", level:"N5", hv:"HỮU", vn:"Bên phải", on:"ウ・ユウ", kun:"みぎ",
        mnemonic:"Bàn tay (𠂇) cầm đũa đưa thức ăn vào Miệng (口) → BÊN PHẢI, TAY PHẢI.",
        ex:[{jp:"右",vn:"bên phải"},{jp:"右手",vn:"tay phải"}] },
      { kanji:"名", level:"N5", hv:"DANH", vn:"Tên, danh tiếng", on:"メイ・ミョU", kun:"な",
        mnemonic:"Trong đêm Tối (夕), phải dùng Miệng (口) gọi to tên nhau để nhận ra → TÊN GỌI, DANH TÍNH.",
        ex:[{jp:"名前",vn:"tên"},{jp:"有名",vn:"nổi tiếng"}] },
      { kanji:"品", level:"N4", hv:"PHẨM", vn:"Sản phẩm, vật phẩm", on:"ヒン", kun:"しな",
        mnemonic:"Ba cái Miệng (口×3) tượng trưng ba chiếc hộp hàng hóa xếp chồng thẩm định → SẢN PHẨM, HÀNG HÓA.",
        ex:[{jp:"商品",vn:"hàng hóa"},{jp:"作品",vn:"tác phẩm"}] },
      { kanji:"同", level:"N4", hv:"ĐỒNG", vn:"Giống nhau, cùng nhau", on:"ドウ", kun:"おな(じ)",
        mnemonic:"Nhiều người ở chung dưới một Mái hiên (冂) cất chung một Tiếng nói (口) → GIỐNG NHAU, ĐỒNG NHẤT.",
        ex:[{jp:"同じ",vn:"giống nhau"},{jp:"同時",vn:"đồng thời"}] },
      { kanji:"味", level:"N4", hv:"VỊ", vn:"Mùi vị, hương vị", on:"ミ", kun:"あじ・あじ(わう)",
        mnemonic:"Dùng Miệng (口) nếm thử trái cây non Chưa chín (未) xem ngọt bùi thế nào → HƯƠNG VỊ, VỊ GIÁC.",
        ex:[{jp:"意味",vn:"ý nghĩa"},{jp:"趣味",vn:"sở thích"}] },
      { kanji:"員", level:"N4", hv:"VIÊN", vn:"Thành viên, nhân viên", on:"イン", kun:"—",
        mnemonic:"Cái Miệng (口) đếm tiền Vỏ sò (貝) phân chia lương thưởng trong tổ chức → THÀNH VIÊN, NHÂN VIÊN.",
        ex:[{jp:"店員",vn:"nhân viên quán"},{jp:"全員",vn:"toàn thể thành viên"}] },
      { kanji:"問", level:"N4", hv:"VẤN", vn:"Hỏi, câu hỏi", on:"モン", kun:"と(う)・と(い)",
        mnemonic:"Đứng trước Cổng nhà (門) mở Miệng (口) cất tiếng hỏi thăm đường → CÂU HỎI, THẮC MẮC.",
        ex:[{jp:"問題",vn:"vấn đề, câu hỏi"},{jp:"質問",vn:"chất vấn, câu hỏi"}] },
    ]
  },

  // ── 12. 水 (THỦY) ────────────────────────────────────────────────────────────
  { kanji:"水", level:"N5", hv:"THỦY", vn:"Nước", on:"スイ", kun:"みず",
    mnemonic:"Dòng nước chảy cuồn cuộn với nét dọc ở giữa và các bọt nước bắn sang hai bên.",
    ex:[{jp:"水",vn:"nước"},{jp:"水曜日",vn:"thứ Tư"}],
    children:[
      { kanji:"海", level:"N5", hv:"HẢI", vn:"Biển, đại dương", on:"カイ", kun:"うみ",
        mnemonic:"Dòng Nước (氵) bao la ôm trọn muôn sông như lòng người Mẹ (母) Hàng ngày (毎) đón nhận → BIỂN CẢ.",
        ex:[{jp:"海",vn:"biển"},{jp:"海外",vn:"hải ngoại, nước ngoài"}] },
      { kanji:"池", level:"N4", hv:"TRÌ", vn:"Cái ao, hồ nước", on:"チ", kun:"いけ",
        mnemonic:"Vũng Nước (氵) nhỏ uốn lượn như con bò cạp (也) → CÁI AO, ĐẦM NƯỚC.",
        ex:[{jp:"池",vn:"cái ao"},{jp:"電池",vn:"pin, ắc quy"}] },
      { kanji:"洗", level:"N4", hv:"TẨY", vn:"Rửa, giặt giũ", on:"セン", kun:"ara(u)",
        mnemonic:"Dùng Nước (氵) rửa sạch bàn chân trước Tiên (先) khi bước vào phòng chiếu → RỬA TAY, TẨY RỬA.",
        ex:[{jp:"洗う",vn:"rửa, giặt"},{jp:"洗濯",vn:"giặt giũ"}] },
      { kanji:"洋", level:"N4", hv:"DƯƠNG", vn:"Đại dương, phương Tây", on:"ヨウ", kun:"—",
        mnemonic:"Dòng Nước (氵) mênh mông bạt ngàn như bầy Cừu (羊) chạy dài tới tận chân trời → ĐẠI DƯƠNG, TÂY HỌC.",
        ex:[{jp:"西洋",vn:"phương Tây"},{jp:"太平洋",vn:"Thái Bình Dương"}] },
      { kanji:"注", level:"N4", hv:"CHÚ", vn:"Rót nước, chú ý", on:"チュウ", kun:"そそ(ぐ)",
        mnemonic:"Dòng Nước (氵) được người Chủ (主) rót tập trung vào bình hoa → RÓT NƯỚC, CHÚ TÂM.",
        ex:[{jp:"注意",vn:"chú ý"},{jp:"注文",vn:"đặt món, đặt hàng"}] },
      { kanji:"漢", level:"N4", hv:"HÁN", vn:"Hán tự, sông Hán", on:"カン", kun:"—",
        mnemonic:"Dòng Nước (氵) nơi các dũng sĩ (𦰩) kiên cường lập nên đất nước bên sông Hán → HÁN TỰ, ĐÀN ÔNG.",
        ex:[{jp:"漢字",vn:"chữ Hán"},{jp:"漢方",vn:"thuốc Bắc, đông y"}] },
      { kanji:"泳", level:"N4", hv:"VỊNH", vn:"Bơi lội", on:"エイ", kun:"およ(ぐ)",
        mnemonic:"Ở dưới Nước (氵) vung sải tay bơi lội dài Mãi mãi (永) không mỏi → BƠI LỘI.",
        ex:[{jp:"泳ぐ",vn:"bơi"},{jp:"水泳",vn:"môn bơi lội"}] },
      { kanji:"酒", level:"N4", hv:"TỬU", vn:"Rượu", on:"シュ", kun:"さけ・さか",
        mnemonic:"Chất Nước (氵) được lên men ủ chín trong vò Rượu (酉) thơm nồng → RƯỢU SAKE.",
        ex:[{jp:"お酒",vn:"rượu"},{jp:"居酒屋",vn:"quán nhậu izakaya"}] },
      { kanji:"油", level:"N4", hv:"DU", vn:"Dầu ăn, dầu mỏ", on:"ユ", kun:"あぶら",
        mnemonic:"Chất Lỏng (氵) trích xuất tự do (由) từ các loại hạt ép ra → DẦU ĂN, DẦU MỎ.",
        ex:[{jp:"油",vn:"dầu ăn"},{jp:"石油",vn:"dầu mỏ"}] },
      { kanji:"港", level:"N3", hv:"CẢNG", vn:"Bến cảng", on:"コウ", kun:"みなと",
        mnemonic:"Vùng Nước (氵) nơi các tàu bè cùng nhau Cùng (共) tụ hội về hẻm ngõ (巷) → BẾN CẢNG.",
        ex:[{jp:"港",vn:"bến cảng"},{jp:"空港",vn:"sân bay"}] },
      { kanji:"温", level:"N3", hv:"ÔN", vn:"Ấm áp, nhiệt độ", on:"オン", kun:"あたた(かい)",
        mnemonic:"Nước (氵) được đun ấm dưới ánh Nắng (日) trong chiếc Đĩa (皿) ấm nồng → ẤM ÁP, ÔN HÒA.",
        ex:[{jp:"温泉",vn:"suối nước nóng"},{jp:"温度",vn:"nhiệt độ"}] },
    ]
  },

  // ── 13. 火 (HỎA) ────────────────────────────────────────────────────────────
  { kanji:"火", level:"N5", hv:"HỎA", vn:"Lửa", on:"カ", kun:"ひ・ほ",
    mnemonic:"Ngọn lửa bùng cháy bốc lên hai bên tia lửa xòe ra ánh sáng ấm áp.",
    ex:[{jp:"火",vn:"ngọn lửa"},{jp:"火曜日",vn:"thứ Ba"}],
    children:[
      { kanji:"炎", level:"N2", hv:"VIÊM", vn:"Rực cháy, viêm sưng", on:"エン", kun:"ほのお",
        mnemonic:"Hai ngọn Lửa (火×2) chồng lên nhau cháy bừng bực → RỰC LỬA, VIÊM NHIỄM.",
        ex:[{jp:"炎",vn:"ngọn lửa bốc cao"},{jp:"肺炎",vn:"viêm phổi"}] },
      { kanji:"秋", level:"N5", hv:"THU", vn:"Mùa thu", on:"シュウ", kun:"あき",
        mnemonic:"Bông Lúa (禾) ngả màu vàng rực như ngọn Lửa (火) báo hiệu mùa gặt → MÙA THU.",
        ex:[{jp:"秋",vn:"mùa thu"},{jp:"秋分",vn:"thu phân"}] },
      { kanji:"黒", level:"N4", hv:"HẮC", vn:"Màu đen", on:"コク", kun:"くろ(い)",
        mnemonic:"Đất ruộng (里) bị ngọn Lửa (灬) thiêu rụi biến thành muội than → MÀU ĐEN.",
        ex:[{jp:"黒い",vn:"đen"},{jp:"黒板",vn:"bảng đen"}] },
      { kanji:"点", level:"N4", hv:"ĐIỂM", vn:"Điểm số, chấm điểm", on:"テン", kun:"—",
        mnemonic:"Dùng ngọn Lửa (灬) bói toán soi rõ lá quẻ Chiêm bói (占) chấm từng nét → ĐIỂM SỐ, CHẤM ĐIỂM.",
        ex:[{jp:"百点",vn:"100 điểm"},{jp:"交差点",vn:"ngã tư đường"}] },
      { kanji:"然", level:"N4", hv:"NHIÊN", vn:"Tự nhiên, quả nhiên", on:"ゼン・ネン", kun:"—",
        mnemonic:"Thịt thú săn (月/肉 + 犬) được nướng trên ngọn Lửa (灬) thơm chín tự nhiên → TỰ NHIÊN, TẤT NHIÊN.",
        ex:[{jp:"自然",vn:"tự nhiên"},{jp:"全然",vn:"hoàn toàn (không)"}] },
      { kanji:"焼", level:"N3", hv:"THIÊU", vn:"Thiêu đốt, nướng", on:"ショウ", kun:"や(く)・や(ける)",
        mnemonic:"Ngọn Lửa (火) đốt cháy đống rơm rạ trên mô đất cao (尭) → NƯỚNG, THIÊU ĐỐT.",
        ex:[{jp:"焼く",vn:"nướng, đốt"},{jp:"焼き肉",vn:"thịt nướng yakiniku"}] },
      { kanji:"煙", level:"N3", hv:"YÊN", vn:"Khói", on:"エン", kun:"けむり・けむ(い)",
        mnemonic:"Ngọn Lửa (火) âm ỉ trong gian bếp hướng tây (覀) tỏa lên lớp đất (土) mịt mù → KHÓI.",
        ex:[{jp:"煙",vn:"khói"},{jp:"禁煙",vn:"cấm hút thuốc"}] },
    ]
  },

  // ── 14. 金 (KIM) ────────────────────────────────────────────────────────────
  { kanji:"金", level:"N5", hv:"KIM", vn:"Vàng, kim loại, tiền", on:"キン・コン", kun:"かね・かな",
    mnemonic:"Dưới Mái nhà (𠆢) cất giấu Vua (王) cùng hai thỏi vàng (八) lấp lánh → VÀNG, TIỀN TÀI.",
    ex:[{jp:"お金",vn:"tiền"},{jp:"金曜日",vn:"thứ Sáu"}],
    children:[
      { kanji:"銀", level:"N5", hv:"NGÂN", vn:"Bạc, ngân hàng", on:"ギン", kun:"—",
        mnemonic:"Kim loại (金) quý đứng sau vàng mà mắt phải ngoái Nhìn (艮) lấp lánh → KIM LOẠI BẠC, NGÂN HÀNG.",
        ex:[{jp:"銀行",vn:"ngân hàng"},{jp:"銀色",vn:"màu bạc"}] },
      { kanji:"鉄", level:"N4", hv:"THIẾT", vn:"Sắt, đường sắt", on:"テツ", kun:"くろがね",
        mnemonic:"Thứ Kim loại (金) làm Mất (失) bao công sức rèn đúc chế tạo vũ khí → SẮT THÉP, KIM LOẠI ĐEN.",
        ex:[{jp:"地下鉄",vn:"tàu điện ngầm"},{jp:"鉄道",vn:"đường sắt"}] },
      { kanji:"針", level:"N3", hv:"CHÂM", vn:"Cây kim, phương châm", on:"シン", kun:"はり",
        mnemonic:"Kim loại (金) được mài chuốt thẳng tắp như số Mười (十) để khâu vá → CÂY KIM, MŨI TIÊM.",
        ex:[{jp:"針",vn:"cây kim"},{jp:"方針",vn:"phương châm"}] },
      { kanji:"鏡", level:"N3", hv:"KÍNH", vn:"Gương soi", on:"キョウ", kun:"かがみ",
        mnemonic:"Tấm Kim loại (金) mài sáng bóng nơi người ta Đứng soi (竟) dung nhan → CHIẾC GƯƠNG.",
        ex:[{jp:"鏡",vn:"gương soi"},{jp:"眼鏡",vn:"kính mắt (megane)"}] },
    ]
  },

  // ── 15. 山 (SƠN) ────────────────────────────────────────────────────────────
  { kanji:"山", level:"N5", hv:"SƠN", vn:"Núi, ngọn núi", on:"サン・セン", kun:"やま",
    mnemonic:"Hình ba đỉnh núi cao vút nhấp nhô giữa trời mây.",
    ex:[{jp:"山",vn:"núi"},{jp:"富士山",vn:"núi Phú Sĩ"}],
    children:[
      { kanji:"岩", level:"N3", hv:"NHAM", vn:"Đá tảng, nham thạch", on:"ガン", kun:"いわ",
        mnemonic:"Khối Đá (石) sừng sững tọa lạc trên đỉnh Núi cao (山) → ĐÁ TẢNG, NHAM THẠCH.",
        ex:[{jp:"岩",vn:"tảng đá lớn"},{jp:"岩石",vn:"nham thạch"}] },
      { kanji:"島", level:"N3", hv:"ĐẢO", vn:"Hòn đảo", on:"トウ", kun:"しま",
        mnemonic:"Ngọn Núi (山) nổi lên giữa biển khơi nơi loài Chim biển (鳥) bay về đậu → HÒN ĐẢO.",
        ex:[{jp:"島",vn:"hòn đảo"},{jp:"半島",vn:"bán đảo"}] },
      { kanji:"岸", level:"N3", hv:"NGẠN", vn:"Bờ sông, bờ biển", on:"ガン", kun:"きし",
        mnemonic:"Vách Núi đá (山) che chở cho bờ dốc phơi đồ Khô ráo (干) bên bờ nước → BỜ SÔNG, BỜ BIỂN.",
        ex:[{jp:"海岸",vn:"bờ biển"},{jp:"岸",vn:"bờ sông"}] },
      { kanji:"炭", level:"N3", hv:"THAN", vn:"Than đá, than củi", on:"タン", kun:"すみ",
        mnemonic:"Củi cây dưới sườn Núi (山 + 厂) được ủ ngún thành Lửa (火) đen kịt → THAN ĐÁ, THAN CỦI.",
        ex:[{jp:"石炭",vn:"than đá"},{jp:"炭酸",vn:"ga, axit cacbonic"}] },
    ]
  },

  // ── 16. 川 (XUYÊN) ────────────────────────────────────────────────────────────
  { kanji:"川", level:"N5", hv:"XUYÊN", vn:"Dòng sông", on:"セン", kun:"かわ",
    mnemonic:"Hình ba dòng nước sông uốn lượn êm đềm chảy xuôi.",
    ex:[{jp:"川",vn:"con sông"},{jp:"小川",vn:"con suối nhỏ"}],
    children:[
      { kanji:"州", level:"N3", hv:"CHÂU", vn:"Châu lục, tiểu bang", on:"シュウ", kun:"す",
        mnemonic:"Ba cồn cát nhô lên giữa dòng Sông (川) chia ranh giới đất đai → TIỂU BANG, CHÂU LỤC.",
        ex:[{jp:"九州",vn:"đảo Kyushu"},{jp:"本州",vn:"đảo Honshu"}] },
      { kanji:"順", level:"N3", hv:"THUẬN", vn:"Thuận lợi, trật tự", on:"ジュン", kun:"—",
        mnemonic:"Dòng Sông (川) chảy xuôi và Đầu người (頁) cúi chào theo lẽ tự nhiên → THUẬN LỢI, TRẬT TỰ.",
        ex:[{jp:"順番",vn:"thứ tự, lượt"},{jp:"順調",vn:"thuận lợi"}] },
    ]
  },

  // ── 17. 言 (NGÔN) ────────────────────────────────────────────────────────────
  { kanji:"言", level:"N5", hv:"NGÔN", vn:"Nói, lời nói", on:"ゲン・ゴン", kun:"い(う)・こと",
    mnemonic:"Âm thanh phát ra từ Miệng (口) qua 4 nét ngang thể hiện từng lời nói rõ ràng.",
    ex:[{jp:"言う",vn:"nói"},{jp:"言葉",vn:"từ vựng, lời nói"}],
    children:[
      { kanji:"語", level:"N5", hv:"NGỮ", vn:"Ngôn ngữ, từ ngữ", on:"ゴ", kun:"かた(る)",
        mnemonic:"Lời nói (言) của Năm (五) cái Miệng (口) cùng chia sẻ tiếng nói chung → NGÔN NGỮ, TIẾNG.",
        ex:[{jp:"日本語",vn:"tiếng Nhật"},{jp:"単語",vn:"từ vựng"}] },
      { kanji:"計", level:"N4", hv:"KẾ", vn:"Kế hoạch, đo lường", on:"ケイ", kun:"はか(る)",
        mnemonic:"Lời nói (言) tính toán rành mạch từ 1 đến Mười (十) → KẾ HOẠCH, ĐO ĐẠC.",
        ex:[{jp:"時計",vn:"đồng hồ"},{jp:"計画",vn:"kế hoạch"}] },
      { kanji:"記", level:"N4", hv:"KÝ", vn:"Ghi chép, ký ức", on:"キ", kun:"しる(す)",
        mnemonic:"Dùng Lời nói (言) ghi chép lại những điều của Bản thân mình (己) → GHI CHÉP, KÝ ỨC.",
        ex:[{jp:"日記",vn:"nhật ký"},{jp:"記事",vn:"bài báo, phóng sự"}] },
      { kanji:"試", level:"N4", hv:"THÍ", vn:"Thi cử, thử nghiệm", on:"シ", kun:"こころ(みる)・ため(す)",
        mnemonic:"Lời nói (言) được đưa vào quy phạm Thể thức (式) để khảo sát → THI CỬ, THỬ NGHIỆM.",
        ex:[{jp:"試験",vn:"kỳ thi"},{jp:"試合",vn:"trận đấu"}] },
      { kanji:"説", level:"N3", hv:"THUYẾT", vn:"Giải thích, thuyết trình", on:"セツ・ゼツ", kun:"と(く)",
        mnemonic:"Dùng Lời nói (言) truyền đạt làm người nghe Vui vẻ (兌) tâm phục khẩu phục → GIẢI THÍCH, THUYẾT PHỤC.",
        ex:[{jp:"説明",vn:"giải thích"},{jp:"小説",vn:"tiểu thuyết"}] },
      { kanji:"調", level:"N3", hv:"ĐIỀU", vn:"Điều tra, giai điệu", on:"チョウ", kun:"しら(べる)・ととの(う)",
        mnemonic:"Lời nói (言) được sắp xếp Chu toàn (周) hòa nhịp → ĐIỀU TRA, GIAI ĐIỆU.",
        ex:[{jp:"調べる",vn:"tra cứu, điều tra"},{jp:"調子",vn:"tình trạng, giai điệu"}] },
      { kanji:"認", level:"N3", hv:"NHẬN", vn:"Thừa nhận, xác nhận", on:"ニン", kun:"みと(める)",
        mnemonic:"Lời nói (言) chấp nhận sự thật dù có đao kề (刃) ngang lòng → CÔNG NHẬN, XÁC NHẬN.",
        ex:[{jp:"認める",vn:"thừa nhận"},{jp:"確認",vn:"xác nhận"}] },
    ]
  },

  // ── 18. 心 (TÂM) ────────────────────────────────────────────────────────────
  { kanji:"心", level:"N4", hv:"TÂM", vn:"Trái tim, tấm lòng", on:"シン", kun:"こころ",
    mnemonic:"Hình trái tim với 4 ngăn đập thình thịch và các mạch máu tỏa ra.",
    ex:[{jp:"心",vn:"trái tim, tấm lòng"},{jp:"安心",vn:"an tâm"}],
    children:[
      { kanji:"思", level:"N5", hv:"TƯ", vn:"Suy nghĩ, tư tưởng", on:"シ", kun:"おも(う)",
        mnemonic:"Tâm trí lo toan ruộng đồng (田) xuất phát từ tận đáy Trái tim (心) → NGHĨ SUY, TƯ TƯỞNG.",
        ex:[{jp:"思う",vn:"nghĩ rằng"},{jp:"思い出",vn:"kỷ niệm"}] },
      { kanji:"忘", level:"N4", hv:"VONG", vn:"Quên lãng", on:"ボウ", kun:"わす(れる)",
        mnemonic:"Trái tim (心) để cảm xúc Chết lịm (亡) đi mất → QUÊN LÃNG, LÃNG QUÊN.",
        ex:[{jp:"忘れる",vn:"quên"},{jp:"忘れ物",vn:"đồ để quên"}] },
      { kanji:"忙", level:"N4", hv:"MANG", vn:"Bận rộn", on:"ボウ", kun:"いそが(しい)",
        mnemonic:"Trái tim (忄) bận rộn đến mức sắp Chết (亡) gục vì công việc → BẬN RỘN.",
        ex:[{jp:"忙しい",vn:"bận rộn"},{jp:"多忙",vn:"rất bận"}] },
      { kanji:"急", level:"N4", hv:"CẤP", vn:"Khẩn cấp, vội vã", on:"キュウ", kun:"いそ(ぐ)",
        mnemonic:"Bàn tay chộp lấy (⺈) đồ đạc khiến Trái tim (心) đập dồn dập → KHẨN CẤP, VỘI VÃ.",
        ex:[{jp:"急ぐ",vn:"vội vã"},{jp:"急行",vn:"tàu tốc hành"}] },
      { kanji:"悪", level:"N4", hv:"ÁC", vn:"Xấu xa, ác độc", on:"アク・オ", kun:"わる(い)",
        mnemonic:"Trái tim (心) chứa đầy những toan tính Kém cỏi (亜) hạ đẳng → XẤU XA, ĐỘC ÁC.",
        ex:[{jp:"悪い",vn:"xấu, tồi"},{jp:"悪口",vn:"nói xấu"}] },
      { kanji:"意", level:"N4", hv:"Ý", vn:"Ý chí, ý nghĩa", on:"イ", kun:"—",
        mnemonic:"Âm thanh (音) phát ra từ nơi sâu thẳm của Trái tim (心) → Ý ĐỒ, Ý NGHĨA.",
        ex:[{jp:"意味",vn:"ý nghĩa"},{jp:"意見",vn:"ý kiến"}],
        children:[
          { kanji:"億", level:"N4", hv:"ỨC", vn:"Một trăm triệu (100.000.000)", on:"オク", kun:"—",
            mnemonic:"Người (亻) ôm ấp Ý chí (意) làm giàu đạt khối tài sản 100 TRIỆU → CON SỐ TRĂM TRIỆU.",
            ex:[{jp:"一億",vn:"một trăm triệu"},{jp:"億万長者",vn:"tỷ phú"}] },
        ]},
      { kanji:"情", level:"N3", hv:"TÌNH", vn:"Tình cảm, thông tin", on:"ジョウ・セイ", kun:"なさ(け)",
        mnemonic:"Trái tim (忄) chân thành trong trẻo như màu Xanh biếc (青) → TÌNH CẢM, THÔNG TIN.",
        ex:[{jp:"情報",vn:"thông tin"},{jp:"感情",vn:"tình cảm, cảm xúc"}] },
      { kanji:"性", level:"N3", hv:"TÍNH", vn:"Tính cách, giới tính", on:"セイ・ショウ", kun:"—",
        mnemonic:"Tấm lòng (忄) vốn có từ lúc Sinh ra (生) bẩm sinh → TÍNH NẾT, GIỚI TÍNH.",
        ex:[{jp:"男性",vn:"nam giới"},{jp:"性格",vn:"tính cách"}] },
    ]
  },

  // ── 19. 手 (THỦ) ────────────────────────────────────────────────────────────
  { kanji:"手", level:"N5", hv:"THỦ", vn:"Tay, bàn tay", on:"シュ", kun:"て・た",
    mnemonic:"Hình bàn tay xòe 5 ngón với các đường chỉ tay rõ nét.",
    ex:[{jp:"手",vn:"bàn tay"},{jp:"上手",vn:"giỏi giang"}],
    children:[
      { kanji:"持", level:"N4", hv:"TRÌ", vn:"Cầm, duy trì", on:"ジ", kun:"も(つ)",
        mnemonic:"Bàn tay (扌) nâng niu pho tượng trong ngôi Chùa (寺) tôn kính → CẦM NẮM, DUY TRÌ.",
        ex:[{jp:"持つ",vn:"cầm, nắm"},{jp:"気持ち",vn:"tâm trạng, cảm xúc"}] },
      { kanji:"打", level:"N4", hv:"ĐẢ", vn:"Đánh, đập, gõ", on:"ダ", kun:"う(つ)",
        mnemonic:"Bàn tay (扌) cầm búa đập mạnh vào cây Đinh (丁) → ĐÁNH ĐẬP, GÕ PHÍM.",
        ex:[{jp:"打つ",vn:"đánh, gõ"},{jp:"打ち合わせ",vn:"cuộc họp bàn"}] },
      { kanji:"押", level:"N4", hv:"ÁP", vn:"Ấn, nhấn, đè", on:"オウ", kun:"お(す)・お(さえる)",
        mnemonic:"Bàn tay (扌) đè mạnh lên tấm Giáp (甲) che chắn → ẤN NÚT, ĐÈ XUỐNG.",
        ex:[{jp:"押す",vn:"ấn, đẩy"},{jp:"押入れ",vn:"tủ âm tường oshiire"}] },
      { kanji:"払", level:"N4", hv:"PHẤT", vn:"Chi trả, quét sạch", on:"ヒツ・フツ", kun:"はら(う)",
        mnemonic:"Bàn tay (扌) phất nhẹ góc áo (厶) móc ví trả tiền sòng phẳng → CHI TRẢ, PHỦI BỤI.",
        ex:[{jp:"払う",vn:"trả tiền"},{jp:"支払い",vn:"thanh toán"}] },
      { kanji:"拾", level:"N3", hv:"THẬP", vn:"Nhặt lên, thu thập", on:"シュウ・ジュウ", kun:"ひろ(う)",
        mnemonic:"Bàn tay (扌) nhặt gom đủ mười thứ Hợp lại (合) vào bao → NHẶT LÊN, THU THẬP.",
        ex:[{jp:"拾う",vn:"nhặt lên"},{jp:"収拾",vn:"thu dọn, giải quyết"}] },
      { kanji:"指", level:"N3", hv:"CHỈ", vn:"Ngón tay, chỉ đạo", on:"シ", kun:"ゆび・さ(す)",
        mnemonic:"Bàn tay (扌) đưa ra chỉ về phương hướng Ngon lành/Ý chỉ (旨) → NGÓN TAY, CHỈ ĐẠO.",
        ex:[{jp:"指",vn:"ngón tay"},{jp:"指定席",vn:"ghế đặt trước"}] },
    ]
  },

  // ── 20. 目 (MỤC) ────────────────────────────────────────────────────────────
  { kanji:"目", level:"N5", hv:"MỤC", vn:"Mắt, mục lục", on:"モク・ボク", kun:"め・ま",
    mnemonic:"Hình con mắt với con ngươi ở giữa, được vẽ dựng dọc theo phong cách Hán tự.",
    ex:[{jp:"目",vn:"con mắt"},{jp:"目的",vn:"mục đích"}],
    children:[
      { kanji:"見", level:"N5", hv:"KIẾN", vn:"Nhìn, xem", on:"ケン", kun:"み(る)・み(える)・み(せる)",
        mnemonic:"Con mắt to (目) gắn trên đôi chân Người (儿) rảo bước ngắm nhìn cảnh vật → NHÌN, XEM.",
        ex:[{jp:"見る",vn:"nhìn, xem"},{jp:"意見",vn:"ý kiến"}],
        children:[
          { kanji:"親", level:"N4", hv:"THÂN", vn:"Bố mẹ, thân thiết", on:"シン", kun:"おや・した(しい)",
            mnemonic:"Cha mẹ Đứng (立) trên ngọn Cây (木) dõi Mắt (見) trông theo bước chân con → BỐ MẸ, THÂN THIẾT.",
            ex:[{jp:"両親",vn:"bố mẹ"},{jp:"親切",vn:"tốt bụng, tử tế"}] },
          { kanji:"覚", level:"N3", hv:"GIÁC", vn:"Cảm giác, nhớ ra", on:"カク", kun:"おぼ(える)・さ(める)",
            mnemonic:"Đội mũ học thức (⺍ + 冖) mở to Mắt (見) tỉnh ngộ nhận ra tri thức → NHỚ RA, CẢM GIÁC.",
            ex:[{jp:"覚える",vn:"ghi nhớ, học thuộc"},{jp:"感覚",vn:"cảm giác"}] },
        ]},
      { kanji:"相", level:"N4", hv:"TƯƠNG", vn:"Tương trợ, tướng mạo", on:"ソウ・ショウ", kun:"あい",
        mnemonic:"Đôi Mắt (目) quan sát kỹ lưỡng cây Gỗ (木) để dựng nhà tương trợ nhau → TƯƠNG HỖ, TƯỚNG TAY.",
        ex:[{jp:"相手",vn:"đối phương"},{jp:"相談",vn:"thảo luận, trao đổi"}],
        children:[
          { kanji:"想", level:"N4", hv:"TƯỞNG", vn:"Tư tưởng, tưởng tượng", on:"ソウ・ソ", kun:"—",
            mnemonic:"Trái tim (心) hướng về hình ảnh Tương trợ (相) đã khắc sâu → TƯ TƯỞNG, TƯỞNG TƯỢNG.",
            ex:[{jp:"感想",vn:"cảm tưởng"},{jp:"理想",vn:"lý tưởng"}] },
        ]},
      { kanji:"着", level:"N4", hv:"TRƯỚC", vn:"Mặc áo, đến nơi", on:"チャク・ジャク", kun:"き(る)・つ(く)",
        mnemonic:"Lông Cừu (羊, biến thể) khoác rủ xuống che Mắt (目) ấm áp → MẶC ÁO, CẬP BẾN.",
        ex:[{jp:"着る",vn:"mặc"},{jp:"着く",vn:"đến nơi"}] },
      { kanji:"真", level:"N4", hv:"CHÂN", vn:"Chân thật, đúng đắn", on:"シン", kun:"ま・まこと",
        mnemonic:"Mười con Mắt (目) nhìn thẳng vào đồ lễ trên kiềng chân không chút dối lừa → CHÂN THỰC, ĐÚNG ĐẮN.",
        ex:[{jp:"写真",vn:"bức ảnh"},{jp:"真ん中",vn:"chính giữa"}] },
    ]
  },

  // ── 21. 門 (MÔN) ────────────────────────────────────────────────────────────
  { kanji:"門", level:"N5", hv:"MÔN", vn:"Cổng, cửa lớn", on:"モン", kun:"かど",
    mnemonic:"Hình hai cánh cổng lớn đối xứng mở ra hai bên lối vào nhà.",
    ex:[{jp:"門",vn:"cánh cổng"},{jp:"専門",vn:"chuyên môn"}],
    children:[
      { kanji:"開", level:"N5", hv:"KHAI", vn:"Mở ra, khai mạc", on:"カイ", kun:"あ(ける)・あ(く)・ひら(く)",
        mnemonic:"Hai cánh Cổng (門) được đôi tay (廾) nhấc thanh chốt mở toang ra → MỞ CỬA, KHAI TRƯƠNG.",
        ex:[{jp:"開ける",vn:"mở ra"},{jp:"開始",vn:"khởi đầu, bắt đầu"}] },
      { kanji:"閉", level:"N4", hv:"BẾ", vn:"Đóng lại, bế mạc", on:"ヘイ", kun:"し(める)・し(まる)・と(じる)",
        mnemonic:"Cánh Cổng (門) được cài chốt then Tài năng (才) đóng kín mít lại → ĐÓNG CỬA, BẾ MẠC.",
        ex:[{jp:"閉める",vn:"đóng cửa"},{jp:"閉店",vn:"đóng cửa tiệm"}] },
      { kanji:"聞", level:"N5", hv:"VĂN", vn:"Nghe, nghe thấy", on:"ブン・モン", kun:"き(く)・き(こえる)",
        mnemonic:"Ghé sát Tai (耳) vào khe Cổng (門) chăm chú lắng nghe ngóng tin tức → LẮNG NGHE, NGHE THẤY.",
        ex:[{jp:"聞く",vn:"nghe, hỏi"},{jp:"新聞",vn:"báo chí"}] },
      { kanji:"関", level:"N3", hv:"QUAN", vn:"Liên quan, cửa ải", on:"カン", kun:"せき・かか(わる)",
        mnemonic:"Cánh Cổng (門) được cài then chốt đan chéo (关) kiểm soát cửa ải → CỬA ẢI, LIÊN QUAN.",
        ex:[{jp:"関係",vn:"quan hệ, liên quan"},{jp:"玄関",vn:"lối vào nhà genkan"}] },
    ]
  },

  // ── 22. 車 (XA) ────────────────────────────────────────────────────────────
  { kanji:"車", level:"N5", hv:"XA", vn:"Xe, bánh xe", on:"シャ", kun:"くるま",
    mnemonic:"Hình cỗ xe nhìn từ trên cao với trục xe giữa và hai bánh xe hai bên.",
    ex:[{jp:"車",vn:"xe ô tô"},{jp:"電車",vn:"tàu điện"}],
    children:[
      { kanji:"転", level:"N4", hv:"CHUYỂN", vn:"Chuyển động, lăn, ngã", on:"テン", kun:"ころ(ぶ)・ころ(がる)",
        mnemonic:"Chiếc Xe (車) lăn tròn xoay vần như đám Mây cuộn (云) trên đường → LĂN TRÒN, CHUYỂN ĐỔI, TÉ NGÃ.",
        ex:[{jp:"自転車",vn:"xe đạp"},{jp:"運転",vn:"lái xe"}] },
      { kanji:"運", level:"N4", hv:"VẬN", vn:"Vận chuyển, vận may", on:"ウン", kun:"はこ(ぶ)",
        mnemonic:"Đoàn xe Quân đội (軍) di chuyển trên con Đường (辶) dài → VẬN CHUYỂN, VẬN MỆNH.",
        ex:[{jp:"運ぶ",vn:"vận chuyển, chở"},{jp:"運転",vn:"lái xe"}] },
      { kanji:"輸", level:"N3", hv:"THÂU", vn:"Xuất nhập khẩu, vận tải", on:"ユ・シュ", kun:"—",
        mnemonic:"Đoàn Xe (車) chở hàng hóa tập hợp theo dòng thuyền (兪) giao thương → XUẤT NHẬP KHẨU.",
        ex:[{jp:"輸入",vn:"nhập khẩu"},{jp:"輸出",vn:"xuất khẩu"}] },
    ]
  },

  // ── 23. 食 (THỰC) ────────────────────────────────────────────────────────────
  { kanji:"食", level:"N5", hv:"THỰC", vn:"Ăn, thực phẩm", on:"ショク・ジキ", kun:"た(べる)・く(う)",
    mnemonic:"Dưới Mái nhà (𠆢) mọi người tụ họp bên chiếc đĩa Lương thực (良) thưởng thức bữa ăn → ĂN UỐNG, MÓN ĂN.",
    ex:[{jp:"食べる",vn:"ăn"},{jp:"食事",vn:"bữa ăn"}],
    children:[
      { kanji:"飲", level:"N5", hv:"ẨM", vn:"Uống", on:"イン", kun:"の(む)",
        mnemonic:"Người đói sau khi Ăn (飠) há hốc miệng Thở (欠) để uống cạn ngụm nước mát → UỐNG NƯỚC.",
        ex:[{jp:"飲む",vn:"uống"},{jp:"飲み物",vn:"đồ uống"}] },
      { kanji:"飯", level:"N4", hv:"PHẠN", vn:"Cơm, bữa ăn", on:"ハン", kun:"めし",
        mnemonic:"Thức Ăn (飠) được bới bằng cái vá Ngược (反) thành từng bát cơm trắng → CƠM, BỮA ĂN.",
        ex:[{jp:"ご飯",vn:"cơm, bữa cơm"},{jp:"晩ご飯",vn:"bữa tối"}] },
      { kanji:"館", level:"N4", hv:"QUÁN", vn:"Tòa nhà, hội quán", on:"カン", kun:"やかた",
        mnemonic:"Nơi phục vụ đồ Ăn (飠) nghỉ ngơi trang trọng của các vị Quan lại (官) triều đình → TÒA NHÀ, BẢO TÀNG.",
        ex:[{jp:"図書館",vn:"thư viện"},{jp:"映画館",vn:"rạp chiếu phim"}] },
    ]
  },

  // ── 24. 道 (ĐẠO / BỘ XƯỚC 辶) ────────────────────────────────────────────────
  { kanji:"道", level:"N5", hv:"ĐẠO", vn:"Con đường, đạo lý", on:"ドウ・トウ", kun:"みち",
    mnemonic:"Dẫn Đầu (首) bước đi trên con Đường (辶) quang minh chính đại → CON ĐƯỜNG, ĐẠO LÝ.",
    ex:[{jp:"道",vn:"con đường"},{jp:"北海道",vn:"đảo Hokkaido"}],
    children:[
      { kanji:"通", level:"N4", hv:"THÔNG", vn:"Đi qua, thông suốt", on:"ツウ", kun:"とお(る)・かよ(う)",
        mnemonic:"Bước đi trên Đường (辶) qua những hàng cột Dũng cảm (甬) thông thoáng không tắc nghẽn → ĐI QUA, THÔNG SUỐT.",
        ex:[{jp:"通う",vn:"đi lại (học/làm)"},{jp:"通り",vn:"con phố, đường phố"}] },
      { kanji:"近", level:"N5", hv:"CẬN", vn:"Gần, lân cận", on:"キン", kun:"ちか(い)",
        mnemonic:"Đi trên Đường (辶) trong tầm cây Rìu (斤) ném tới → GẦN GŨI, LÂN CẬN.",
        ex:[{jp:"近い",vn:"gần"},{jp:"近所",vn:"hàng xóm láng giềng"}] },
      { kanji:"遠", level:"N4", hv:"VIỄN", vn:"Xa, viễn xứ", on:"エン・オン", kun:"とお(い)",
        mnemonic:"Đi trên Đường (辶) xa xôi đến nỗi chiếc Áo choàng dài (袁) phủ đầy bụi mờ → XA XÔI, VIỄN XỨ.",
        ex:[{jp:"遠い",vn:"xa"},{jp:"遠慮",vn:"ngại ngùng, khách khí"}] },
      { kanji:"進", level:"N4", hv:"TIẾN", vn:"Tiến lên, tiến bộ", on:"シン", kun:"すす(む)・すす(める)",
        mnemonic:"Con Chim nhỏ (隹) bước đi trên Đường (辶) chỉ biết bay tiến tới không thể lùi → TIẾN LÊN, TIẾN BỘ.",
        ex:[{jp:"進む",vn:"tiến lên"},{jp:"進歩",vn:"tiến bộ"}] },
      { kanji:"返", level:"N4", hv:"PHẢN", vn:"Trả lại, quay lại", on:"ヘン", kun:"かえ(す)・かえ(る)",
        mnemonic:"Đi trên Đường (辶) rồi Quay ngược trở lại (反) điểm ban đầu trao trả đồ → TRẢ LẠI, QUAY VỀ.",
        ex:[{jp:"返す",vn:"trả lại"},{jp:"返事",vn:"hồi đáp, trả lời"}] },
      { kanji:"送", level:"N4", hv:"TỐNG", vn:"Gửi đi, tiễn đưa", on:"ソウ", kun:"おく(る)",
        mnemonic:"Hai tay nâng Lễ vật (关) tiễn bước người thân bước lên Đường (辶) → GỬI ĐI, TIỄN BIỆT.",
        ex:[{jp:"送る",vn:"gửi, tiễn"},{jp:"見送る",vn:"tiễn đưa"}] },
      { kanji:"連", level:"N3", hv:"LIÊN", vn:"Liên tục, dắt theo", on:"レン", kun:"つ(れる)・つら(なる)",
        mnemonic:"Những chiếc Xe (車) nối đuôi nhau di chuyển trên Đường (辶) → LIÊN TIẾP, DẮT THEO.",
        ex:[{jp:"連絡",vn:"liên lạc"},{jp:"連れて行く",vn:"dắt theo cùng đi"}] },
    ]
  },

  // ── 25. 糸 (MỊCH) ────────────────────────────────────────────────────────────
  { kanji:"糸", level:"N4", hv:"MỊCH", vn:"Sợi tơ, sợi chỉ", on:"シ", kun:"いと",
    mnemonic:"Hình con tằm nhả cuộn tơ nhỏ với những sợi chỉ thòng xuống mềm mại.",
    ex:[{jp:"糸",vn:"sợi chỉ"},{jp:"毛糸",vn:"len, sợi len"}],
    children:[
      { kanji:"線", level:"N4", hv:"TUYẾN", vn:"Đường tuyến, dây điện", on:"セン", kun:"—",
        mnemonic:"Sợi chỉ (糸) kéo dài từ Dòng suối trong vắt (泉) chảy thẳng tắp → ĐƯỜNG DÂY, TUYẾN ĐƯỜNG.",
        ex:[{jp:"新幹線",vn:"tàu cao tốc Shinkansen"},{jp:"線路",vn:"đường ray"}] },
      { kanji:"終", level:"N4", hv:"CHUNG", vn:"Kết thúc, cuối cùng", on:"シュウ", kun:"お(わる)・お(える)",
        mnemonic:"Sợi chỉ (糸) được Mùa đông (冬) khép lại đóng băng tròn vẹn → KẾT THÚC, CHUNG KẾT.",
        ex:[{jp:"終わる",vn:"kết thúc"},{jp:"最終",vn:"cuối cùng"}] },
      { kanji:"紙", level:"N4", hv:"CHỈ", vn:"Tờ giấy", on:"シ", kun:"かみ",
        mnemonic:"Sợi Tơ mịn (糸) được ép mỏng theo phương pháp của Dòng họ (氏) làm giấy viết → TRANG GIẤY.",
        ex:[{jp:"手紙",vn:"bức thư"},{jp:"新聞紙",vn:"giấy báo"}] },
      { kanji:"結", level:"N3", hv:"KẾT", vn:"Kết nối, kết quả", on:"ケツ・ケッ", kun:"むす(ぶ)・ゆ(う)",
        mnemonic:"Sợi dây Chỉ (糸) được thắt nút thành hình Cát tường may mắn (吉) → KẾT NỐI, KẾT QUẢ.",
        ex:[{jp:"結果",vn:"kết quả"},{jp:"結婚",vn:"kết hôn"}],
        children:[
          { kanji:"婚", level:"N3", hv:"HÔN", vn:"Kết hôn, hôn nhân", on:"コン", kun:"—",
            mnemonic:"Người Phụ nữ (女) được đón rước vào buổi Hoàng hôn (昏) ấm áp se duyên → KẾT HÔN.",
            ex:[{jp:"結婚",vn:"kết hôn"},{jp:"離婚",vn:"ly hôn"}] },
        ]},
      { kanji:"約", level:"N3", hv:"ƯỚC", vn:"Lời hẹn, ước lượng", on:"ヤク", kun:"—",
        mnemonic:"Dùng sợi Chỉ (糸) buộc chiếc Muỗng múc nước (勺) cam kết không thay đổi → LỜI HẸN, ƯỚC ĐỊNH.",
        ex:[{jp:"約束",vn:"lời hứa, cái hẹn"},{jp:"予約",vn:"đặt chỗ trước"}] },
    ]
  },

  // ── 26. 雨 (VŨ) ────────────────────────────────────────────────────────────
  { kanji:"雨", level:"N5", hv:"VŨ", vn:"Mưa", on:"ウ", kun:"あめ・あま",
    mnemonic:"Bầu trời có mây che phủ và 4 giọt nước mưa rơi tí tách xuống.",
    ex:[{jp:"雨",vn:"cơn mưa"},{jp:"大雨",vn:"mưa lớn"}],
    children:[
      { kanji:"電", level:"N5", hv:"ĐIỆN", vn:"Điện lực, tàu điện", on:"デン", kun:"—",
        mnemonic:"Cơn Mưa dông (雨) rạch trời xẹt qua tia sét ngoằn ngoèo uốn lượn (申/电) → ĐIỆN NĂNG, TÀU ĐIỆN.",
        ex:[{jp:"電車",vn:"tàu điện"},{jp:"電気",vn:"điện, bóng đèn"}] },
      { kanji:"雪", level:"N5", hv:"TUYẾT", vn:"Tuyết", on:"セツ", kun:"ゆき",
        mnemonic:"Cơn Mưa đông (雨) rơi thành hạt tuyết trắng được cây Chổi (彐) quét sạch → BĂNG TUYẾT.",
        ex:[{jp:"雪",vn:"tuyết"},{jp:"大雪",vn:"tuyết rơi dày"}] },
      { kanji:"雲", level:"N3", hv:"VÂN", vn:"Đám mây", on:"ウン", kun:"くも",
        mnemonic:"Hơi Mưa ẩm (雨) ngưng tụ từ những luồng khí bốc lên (云) thành tầng mây → ĐÁM MÂY.",
        ex:[{jp:"雲",vn:"đám mây"},{jp:"雨雲",vn:"mây đen mưa"}] },
      { kanji:"雷", level:"N2", hv:"LÔI", vn:"Sấm sét", on:"ライ", kun:"かみなり",
        mnemonic:"Cơn Mưa bão (雨) giáng sấm sét ầm ầm vang dội trên cánh Đồng (田) → SẤM SÉT.",
        ex:[{jp:"雷",vn:"sấm sét"},{jp:"雷雨",vn:"mưa dông sấm sét"}] },
    ]
  },

  // ── 27. 貝 (BỐI) ────────────────────────────────────────────────────────────
  { kanji:"貝", level:"N4", hv:"BỐI", vn:"Vỏ sò, tiền tệ cổ", on:"バイ", kun:"かい",
    mnemonic:"Hình con sò mở nắp với hai râu thò ra — thời xưa vỏ sò quý được dùng làm tiền tệ.",
    ex:[{jp:"貝",vn:"con sò, ốc"},{jp:"貝殻",vn:"vỏ sò"}],
    children:[
      { kanji:"買", level:"N5", hv:"MÃI", vn:"Mua hàng", on:"バイ", kun:"か(う)",
        mnemonic:"Dùng lưới mắt (罒) giăng gom Vỏ sò (貝) đổi lấy hàng hóa mang về → MUA HÀNG.",
        ex:[{jp:"買う",vn:"mua"},{jp:"買い物",vn:"mua sắm"}] },
      { kanji:"貸", level:"N4", hv:"THẢI", vn:"Cho mượn, cho vay", on:"タイ", kun:"か(す)",
        mnemonic:"Đem Tiền bạc vỏ sò (貝) cho người khác Thay thế (代) sử dụng tạm thời → CHO VAY, CHO MƯỢN.",
        ex:[{jp:"貸す",vn:"cho mượn"},{jp:"賃貸",vn:"cho thuê mướn"}] },
      { kanji:"賃", level:"N3", hv:"NHÂM", vn:"Tiền thuê, tiền công", on:"チン", kun:"—",
        mnemonic:"Tiền bạc vỏ sò (貝) trả công xứng đáng cho người gánh vác Trách nhiệm vụ (任) → TIỀN CÔNG, TIỀN THUÊ.",
        ex:[{jp:"家賃",vn:"tiền thuê nhà"},{jp:"運賃",vn:"cước phí vận chuyển"}] },
      { kanji:"費", level:"N3", hv:"PHÍ", vn:"Chi phí, tiêu hao", on:"ヒ", kun:"つい(やす)",
        mnemonic:"Tiền bạc vỏ sò (貝) bay biến cuốn theo chiều gió không còn (弗) → CHI PHÍ, TIÊU PHÍ.",
        ex:[{jp:"費用",vn:"chi phí"},{jp:"学費",vn:"học phí"}] },
      { kanji:"財", level:"N3", hv:"TÀI", vn:"Tài sản, tài chính", on:"ザイ・サイ", kun:"—",
        mnemonic:"Tiền bạc vỏ sò (貝) được gây dựng từ Tài năng (才) kinh doanh cần mẫn → TÀI SẢN, TÀI CHÍNH.",
        ex:[{jp:"財布",vn:"ví tiền"},{jp:"財産",vn:"tài sản"}] },
    ]
  },

  // ── 28. 鳥 (ĐIỂU) ────────────────────────────────────────────────────────────
  { kanji:"鳥", level:"N4", hv:"ĐIỂU", vn:"Con chim", on:"チョウ", kun:"とり",
    mnemonic:"Hình con chim có mỏ nhọn trên đầu, mắt sáng và 4 chấm đuôi lông vũ bên dưới.",
    ex:[{jp:"鳥",vn:"con chim"},{jp:"小鳥",vn:"chim non"}],
    children:[
      { kanji:"鳴", level:"N3", hv:"MINH", vn:"Hót, kêu, reo chuông", on:"メイ", kun:"な(く)・な(る)・な(らす)",
        mnemonic:"Con Chim (鳥) mở Miệng (口) cất tiếng hót líu lo chào bình minh → HÓT, REO CHUÔNG.",
        ex:[{jp:"鳴く",vn:"kêu, hót (động vật)"},{jp:"鳴る",vn:"reo (chuông)"}] },
    ]
  },

  // ── 29. 魚 (NGƯ) ────────────────────────────────────────────────────────────
  { kanji:"魚", level:"N5", hv:"NGƯ", vn:"Con cá", on:"ギョ", kun:"さかな・うお",
    mnemonic:"Hình con cá với đầu nhọn, vảy cá đan chéo thân giữa và vây đuôi (灬) vẫy dưới nước.",
    ex:[{jp:"魚",vn:"con cá"},{jp:"金魚",vn:"cá vàng"}],
    children:[
      { kanji:"鮮", level:"N3", hv:"TIÊN", vn:"Tươi ngon, rực rỡ", on:"セン", kun:"あざ(やか)",
        mnemonic:"Món ăn kết hợp từ thịt Cá tươi (魚) và thịt Cừu non (羊) đạt đến độ ngon tuyệt hảo → TƯƠI SỐNG, RỰC RỠ.",
        ex:[{jp:"新鮮",vn:"tươi mới"},{jp:"鮮やか",vn:"rực rỡ, sống động"}] },
    ]
  },

  // ── 30. 足 (TÚC) ────────────────────────────────────────────────────────────
  { kanji:"足", level:"N5", hv:"TÚC", vn:"Chân, đầy đủ", on:"ソク", kun:"あし・た(りる)・た(す)",
    mnemonic:"Hình cái đầu gối (口) nối liền cẳng chân và bàn chân vững chãi bước đi → ĐÔI CHÂN, ĐẦY ĐỦ.",
    ex:[{jp:"足",vn:"chân"},{jp:"足りる",vn:"đủ"}],
    children:[
      { kanji:"走", level:"N5", hv:"TẨU", vn:"Chạy", on:"ソウ", kun:"はし(る)",
        mnemonic:"Đôi Chân (𧾷) quăng đạp Đất cát (土) tung tóe lao nhanh về phía trước → CHẠY BỘ.",
        ex:[{jp:"走る",vn:"chạy"},{jp:"ご馳走",vn:"chiêu đãi, tiệc ngon (gochisou)"}] },
      { kanji:"路", level:"N3", hv:"LỘ", vn:"Con đường, tuyến lộ", on:"ロ", kun:"じ・みち",
        mnemonic:"Bàn chân (𧾷) đi qua Từng ngõ ngách (各) phân nhánh trên lối mòn → CON ĐƯỜNG, TUYẾN LỘ.",
        ex:[{jp:"道路",vn:"đường xá"},{jp:"線路",vn:"đường ray"}] },
    ]
  }
];;

function kjFlatten(roots){
  const out=[];
  const walk=(n)=>{ out.push(n); (n.children||[]).forEach(walk); };
  roots.forEach(walk);
  return out;
}
const KJ_ALL_NODES = kjFlatten(KANJI_TREE_ROOTS);
const KJ_TOTAL = KJ_ALL_NODES.length;
const KJ_ROOT_COUNT = KANJI_TREE_ROOTS.length;
const KJ_LEVEL_COUNTS = KJ_ALL_NODES.reduce((m,n)=>{ m[n.level]=(m[n.level]||0)+1; return m; },{});
const KJ_BC_COUNT = KJ_ALL_NODES.filter(n=>n.children?.length>0).length;

// Layout: horizontal tree, single parent, y = leaf-index based
function kjLayoutTree(roots, collapsed, colWidth, rowH){
  let leafY = 0;
  const nodes = {}; // kanji -> {node,x,y,depth,hasChildren,isCollapsed}
  const edges = []; // {from,to}
  function visit(node, depth, parentKanji){
    const hasChildren = !!(node.children && node.children.length);
    const isCollapsed = collapsed.has(node.kanji);
    const expand = hasChildren && !isCollapsed;
    let y;
    if(!expand){
      y = leafY*rowH; leafY++;
    } else {
      const ys = node.children.map(c=>visit(c, depth+1, node.kanji));
      y = (Math.min(...ys)+Math.max(...ys))/2;
    }
    nodes[node.kanji] = { node, x:depth*colWidth, y, depth, hasChildren, isCollapsed };
    if(parentKanji) edges.push({ from:parentKanji, to:node.kanji });
    return y;
  }
  roots.forEach(r=>visit(r,0,null));
  return { nodes, edges, totalLeaves: Math.max(leafY,1) };
}
function kjBezier(x1,y1,x2,y2){
  const dx = Math.max(30,(x2-x1)*0.55);
  return `M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`;
}

// ── Detail panel (floating) ──────────────────────────────────────
function KanjiDiagramDetail({ node, onClose }) {
  const CC = useColors();
  const [dark] = useDarkMode();
  const lv = KJ_LV[node.level] || KJ_LV.N5;
  const isResult = !!(node.children && node.children.length);

  return (
    <div className="ba-card" style={{ padding:0, overflow:"hidden", width:"100%" }}>
      <div style={{
        background: `linear-gradient(135deg,${lv.fg},${lv.fg}CC)`,
        padding:"14px 16px 12px", textAlign:"center", position:"relative", overflow:"hidden"
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:10, right:10, width:26, height:26, borderRadius:"50%",
          background:"rgba(255,255,255,0.2)", border:"none", color:"white", cursor:"pointer",
          fontSize:13, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center"
        }}>✕</button>
        <div style={{ position:"absolute", top:-16, right:-8, fontSize:80, opacity:0.12, fontFamily:"'Noto Sans JP',sans-serif" }}>{node.kanji}</div>
        <div style={{ fontSize:44, fontWeight:900, color:"white", fontFamily:"'Noto Sans JP',sans-serif", lineHeight:1, marginBottom:8, position:"relative" }}>{node.kanji}</div>
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:8, position:"relative" }}>
          <span style={{ fontSize:11, fontWeight:800, background:"rgba(255,255,255,0.25)", color:"white", borderRadius:20, padding:"2px 10px" }}>{node.level}</span>
          {node.hv && <span style={{ fontSize:11, fontWeight:800, letterSpacing:1, background:"rgba(255,255,255,0.15)", color:"white", borderRadius:20, padding:"2px 10px" }}>Hán Việt: {node.hv}</span>}
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.95)", position:"relative" }}>{node.vn}</div>
      </div>

      <div style={{ padding:12 }}>
        {(node.on || node.kun) && (
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            {node.on && (
              <div style={{ flex:1, background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.02)", borderRadius:12, padding:"8px 12px" }}>
                <div style={{ fontSize:9, fontWeight:700, color:CC.muted, letterSpacing:1, marginBottom:2 }}>音読み ON</div>
                <div style={{ fontSize:14, fontWeight:700, color:CC.text, fontFamily:"'Noto Sans JP',sans-serif" }}>{node.on}</div>
              </div>
            )}
            {node.kun && (
              <div style={{ flex:1, background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.02)", borderRadius:12, padding:"8px 12px" }}>
                <div style={{ fontSize:9, fontWeight:700, color:CC.muted, letterSpacing:1, marginBottom:2 }}>訓読み KUN</div>
                <div style={{ fontSize:14, fontWeight:700, color:CC.text, fontFamily:"'Noto Sans JP',sans-serif" }}>{node.kun}</div>
              </div>
            )}
          </div>
        )}

        <div style={{
          background: dark?`${lv.fg}22`:lv.bg, border:`1px solid ${lv.bd}`,
          borderRadius:14, padding:"12px 14px", marginBottom: node.ex?.length?14:0
        }}>
          <div style={{ fontSize:10, fontWeight:800, color:lv.fg, letterSpacing:1, marginBottom:6 }}>💡 CÁCH NHỚ</div>
          <div style={{ fontSize:13, lineHeight:1.75, color:CC.text }}>{node.mnemonic}</div>
        </div>

        {node.ex?.length>0 && (
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:CC.muted, letterSpacing:1, marginBottom:8 }}>✏️ VÍ DỤ</div>
            {node.ex.map((e,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"baseline", gap:8, padding:"6px 0", borderBottom: i<node.ex.length-1?`1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)"}`:"none" }}>
                <span style={{ fontFamily:"'Noto Sans JP',sans-serif", fontWeight:700, fontSize:14, color:CC.text }}>{e.jp}</span>
                <span style={{ fontSize:12, color:CC.muted }}>— {e.vn}</span>
              </div>
            ))}
          </div>
        )}

        {isResult && (
          <div style={{ marginTop:14, fontSize:11, color:CC.muted, display:"flex", alignItems:"center", gap:6 }}>
            🌱 Là gốc của {node.children.length} chữ ghép khác
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main mind-map component ──────────────────────────────────────
function KanjiDiagramView() {
  const CC = useColors();
  const [dark, toggleDark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640; const isTab = w < 1024;

  const [collapsed, setCollapsed] = useState(() => new Set());
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [showHV, setShowHV] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(!isTab);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [scale, setScale] = useState(0.85);
  const [pan, setPan] = useState({ x:40, y:40 });
  const viewportRef = useRef(null);
  const dragState = useRef(null);

  const radius   = isMob ? 0 : 0; // unused (pill nodes now)
  const colWidth = isMob ? 168 : 210;
  const rowH     = isMob ? 58  : 66;

  const { nodes, edges, totalLeaves } = useMemo(
    () => kjLayoutTree(KANJI_TREE_ROOTS, collapsed, colWidth, rowH),
    [collapsed, colWidth, rowH]
  );
  const totalW = (Math.max(...Object.values(nodes).map(n=>n.depth)) + 1) * colWidth + 220;
  const totalH = totalLeaves * rowH + 80;

  const toggleCollapse = (kanji, e) => {
    e.stopPropagation();
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(kanji) ? next.delete(kanji) : next.add(kanji);
      return next;
    });
  };

  const pick = (node) => setSelected(node);

  // ── Pan handlers ──
  const onPointerDown = (e) => {
    if (e.target.closest(".kj-node") || e.target.closest(".kj-arrow")) return;
    const point = e.touches ? e.touches[0] : e;
    dragState.current = { startX:point.clientX, startY:point.clientY, panX:pan.x, panY:pan.y };
  };
  const onPointerMove = (e) => {
    if (!dragState.current) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - dragState.current.startX;
    const dy = point.clientY - dragState.current.startY;
    setPan({ x: dragState.current.panX+dx, y: dragState.current.panY+dy });
  };
  const onPointerUp = () => { dragState.current = null; };

  useEffect(() => {
    const move = (e) => onPointerMove(e);
    const up = () => onPointerUp();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive:true });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [pan]);

  const onWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0012;
    setScale(s => Math.min(2.2, Math.max(0.3, +(s+delta).toFixed(3))));
  };

  const zoomIn  = () => setScale(s => Math.min(2.2, +(s+0.15).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.3, +(s-0.15).toFixed(2)));
  const doFit   = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    const availW = vp.clientWidth - 40, availH = vp.clientHeight - 40;
    const s = Math.min(availW/totalW, availH/totalH, 1.4);
    setScale(Math.max(0.3, +s.toFixed(2)));
    setPan({ x:20, y:20 });
  };
  const doReset = () => { setScale(0.85); setPan({x:40,y:40}); setCollapsed(new Set()); setSelected(null); };
  const doFull  = () => {
    const el = viewportRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const expandAncestorsAndFocus = (kanji) => {
    // find path from root to kanji
    let path = null;
    const dfs = (node, trail) => {
      if (node.kanji === kanji) { path = trail; return true; }
      for (const c of (node.children||[])) if (dfs(c, [...trail, node.kanji])) return true;
      return false;
    };
    for (const r of KANJI_TREE_ROOTS) if (dfs(r, [])) break;
    if (!path) return;
    setCollapsed(prev => { const next=new Set(prev); path.forEach(k=>next.delete(k)); return next; });
    setTimeout(() => {
      const pos = kjLayoutTree(KANJI_TREE_ROOTS, new Set(), colWidth, rowH).nodes[kanji];
      if (pos && viewportRef.current) {
        const vp = viewportRef.current;
        setPan({ x: vp.clientWidth/2 - pos.x*scale - 40, y: vp.clientHeight/2 - pos.y*scale - 40 });
      }
      const found = KJ_ALL_NODES.find(n=>n.kanji===kanji);
      if (found) setSelected(found);
    }, 60);
  };

  const handleSearch = (e) => {
    if (e.key !== "Enter") return;
    const term = search.trim();
    if (!term) return;
    const found = KJ_ALL_NODES.find(n=>n.kanji===term || n.hv?.toLowerCase()===term.toLowerCase() || n.vn?.toLowerCase().includes(term.toLowerCase()));
    if (found) expandAncestorsAndFocus(found.kanji);
  };

  useEffect(() => { const t = setTimeout(doFit, 60); return () => clearTimeout(t); }, []);
  const Sidebar = (
    <div className="ba-card" style={{ padding:12, width: isTab?"100%":230, flexShrink:0, overflowY:"auto", scrollbarWidth:"none", boxSizing:"border-box" }}>
      <div style={{ fontWeight:900, fontSize:14, color:CC.text, marginBottom:10 }}>🔍 Tìm kiếm</div>
      <div style={{ position:"relative", marginBottom:18 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={handleSearch}
          placeholder="Nhập Kanji rồi Enter..."
          style={{
            width:"100%", padding:"9px 32px 9px 12px", borderRadius:10, fontSize:14,
            border:dark?"1.5px solid rgba(255,255,255,0.12)":"1.5px solid rgba(0,0,0,0.1)",
            background:dark?"rgba(255,255,255,0.04)":"white", color:CC.text, fontFamily:"'Noto Sans JP',sans-serif"
          }}/>
        {search && <span onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:9, cursor:"pointer", color:CC.muted, fontSize:14 }}>✕</span>}
      </div>

      <div style={{ fontWeight:900, fontSize:14, color:CC.text, marginBottom:10 }}>🎚️ Bộ lọc</div>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:CC.muted, marginBottom:5, fontWeight:700 }}>Lọc theo cấp độ</div>
        <select value={levelFilter} onChange={e=>setLevelFilter(e.target.value)}
          style={{
            width:"100%", padding:"8px 10px", borderRadius:10, fontSize:13, fontWeight:700,
            border:dark?"1.5px solid rgba(255,255,255,0.12)":"1.5px solid rgba(0,0,0,0.1)",
            background:dark?"rgba(255,255,255,0.04)":"white", color:CC.text
          }}>
          <option value="all">Tất cả</option>
          {["N5","N4","N3","N2","N1"].map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div style={{ fontWeight:900, fontSize:14, color:CC.text, marginBottom:10 }}>📊 Thống kê tổng</div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        <div style={{ flex:1, background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.02)", borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:CC.muted, fontWeight:700 }}>Nhánh gốc</div>
          <div style={{ fontSize:20, fontWeight:900, color:CC.text }}>{KJ_ROOT_COUNT}</div>
        </div>
        <div style={{ flex:1, background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.02)", borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:CC.muted, fontWeight:700 }}>Tổng số</div>
          <div style={{ fontSize:20, fontWeight:900, color:CC.text }}>{KJ_TOTAL}</div>
        </div>
      </div>

      <div style={{ fontWeight:900, fontSize:14, color:CC.text, marginBottom:10 }}>📈 Thống kê chi tiết</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:18 }}>
        {["N5","N4","N3","N2","N1"].map(l=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:10, fontWeight:800, background:KJ_LV[l].bg, color:KJ_LV[l].fg, border:`1px solid ${KJ_LV[l].bd}`, borderRadius:20, padding:"1px 8px", width:28, textAlign:"center" }}>{l}</span>
            <span style={{ fontSize:12, color:CC.muted }}>Cấp độ {l}:</span>
            <span style={{ fontSize:12, fontWeight:800, color:CC.text, marginLeft:"auto" }}>{KJ_LEVEL_COUNTS[l]||0}</span>
          </div>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:9, fontWeight:800, background:dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)", color:CC.muted, borderRadius:20, padding:"1px 8px", width:28, textAlign:"center" }}>BC</span>
          <span style={{ fontSize:12, color:CC.muted }}>Vừa bộ vừa chữ:</span>
          <span style={{ fontSize:12, fontWeight:800, color:CC.text, marginLeft:"auto" }}>{KJ_BC_COUNT}</span>
        </div>
      </div>

      <button onClick={()=>setTipsOpen(o=>!o)} style={{ width:"100%", padding:"6px", marginBottom: tipsOpen?8:0, background:"transparent", border:`1px solid ${CC.border}`, borderRadius:10, fontSize:11, fontWeight:700, color:CC.muted, cursor:"pointer" }}>{tipsOpen ? "▲ Ẩn hướng dẫn" : "▼ Hướng dẫn sử dụng"}</button>
      {tipsOpen && (
        <div style={{ fontSize:11, color:CC.muted, lineHeight:1.9, borderTop:dark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.06)", paddingTop:12 }}>
          1. Kéo thả để di chuyển sơ đồ<br/>
          2. Cuộn chuột / nút +/− để phóng to, thu nhỏ<br/>
          3. Trên điện thoại: 1 ngón để kéo, dùng nút +/− để zoom<br/>
          4. Nhập Kanji vào ô tìm kiếm rồi nhấn Enter<br/>
          5. Click vào Kanji để xem giải thích chi tiết<br/>
          6. Click vào mũi tên ▼ đỏ để đóng/mở nhánh con
        </div>
      )}
    </div>
  );

  const activeParent = selected ? edges.find(e=>e.to===selected.kanji)?.from : null;
  const activeChildren = selected ? edges.filter(e=>e.from===selected.kanji).map(e=>e.to) : [];
  const highlightSet = selected ? new Set([selected.kanji, activeParent, ...activeChildren].filter(Boolean)) : null;

  return (
    <div style={{ display:"flex", gap:12, alignItems:"stretch", flexDirection: isTab ? "column" : "row", flex:1, minHeight:0 }}>
      {/* Sidebar toggle (mobile/tablet) */}
      {isTab && (
        <button className="ba-btn" onClick={()=>setSidebarOpen(o=>!o)}
          style={{ width:"100%", padding:"10px", background:"rgba(180,83,9,0.1)", color:"#B45309", border:"1px solid rgba(180,83,9,0.25)", borderRadius:12, fontSize:13, fontWeight:700 }}>
          {sidebarOpen ? "▲ Ẩn bộ lọc & thống kê" : "▼ Hiện bộ lọc & thống kê"}
        </button>
      )}
      {(!isTab || sidebarOpen) && Sidebar}

      {/* Canvas */}
      <div style={{ flex:1, minWidth:0, width:"100%", position:"relative", display:"flex", flexDirection:"column", minHeight:0 }}>
        <div
          ref={viewportRef}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          onWheel={onWheel}
          className="ba-card kj-viewport"
          style={{
            padding:0, overflow:"hidden", position:"relative",
            flex: isMob ? "none" : 1, height: isMob ? 460 : undefined, minHeight: 300,
            cursor: dragState.current ? "grabbing" : "grab",
            backgroundColor: dark ? "#0B1120" : "#F5F9FF",
            backgroundImage: dark
              ? "radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)"
              : "radial-gradient(rgba(0,0,0,0.06) 1px,transparent 1px)",
            backgroundSize:"20px 20px"
          }}>

          <div style={{ position:"absolute", top:0, left:0, transform:`translate(${pan.x}px,${pan.y}px) scale(${scale})`, transformOrigin:"0 0" }}>
            <svg width={totalW} height={totalH} style={{ position:"absolute", top:0, left:0, pointerEvents:"none", overflow:"visible" }}>
              {edges.map((e,i)=>{
                const a = nodes[e.from], b = nodes[e.to];
                if (!a || !b) return null;
                const aRight = a.x + 52, bLeft = b.x;
                const isHi = highlightSet && highlightSet.has(e.from) && highlightSet.has(e.to);
                return (
                  <path key={i} d={kjBezier(aRight, a.y+22, bLeft, b.y+22)} fill="none"
                    stroke={isHi ? "#B45309" : (dark?"rgba(148,163,184,0.35)":"rgba(100,116,139,0.35)")}
                    strokeWidth={isHi?2.5:1.5}/>
                );
              })}
            </svg>

            {Object.entries(nodes).map(([kanji, info]) => {
              const node = info.node;
              const lv = KJ_LV[node.level] || KJ_LV.N5;
              const isSel = selected?.kanji === kanji;
              const dimmed = levelFilter!=="all" && node.level!==levelFilter;
              const isHi = highlightSet?.has(kanji);
              return (
                <div key={kanji} className="kj-node"
                  onClick={()=>pick(node)}
                  style={{
                    position:"absolute", left:info.x, top:info.y,
                    display:"flex", alignItems:"center", gap:6,
                    background: isSel ? `linear-gradient(135deg,${lv.fg},${lv.fg}CC)` : (info.hasChildren ? (dark?`${lv.fg}22`:lv.bg) : (dark?"rgba(30,41,59,0.9)":"white")),
                    border: isSel ? "none" : `1.5px solid ${isHi?"#B45309":(info.hasChildren?lv.bd:(dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"))}`,
                    borderRadius:30, padding: isMob?"6px 12px 6px 6px":"7px 16px 7px 7px",
                    boxShadow: isSel ? "0 6px 20px rgba(0,0,0,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
                    cursor:"pointer", whiteSpace:"nowrap", opacity: dimmed?0.28:1,
                    transition:"opacity 0.2s, box-shadow 0.15s"
                  }}>
                  {info.hasChildren && (
                    <span className="kj-arrow" onClick={(e)=>toggleCollapse(kanji,e)}
                      style={{
                        fontSize:10, color: isSel?"white":"#DC2626", cursor:"pointer", flexShrink:0,
                        transform: info.isCollapsed ? "rotate(-90deg)" : "none", transition:"transform 0.15s",
                        width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center"
                      }}>▼</span>
                  )}
                  <span style={{
                    fontFamily:"'Noto Sans JP',sans-serif", fontWeight:800,
                    fontSize:isMob?18:22, color: isSel?"white":CC.text, lineHeight:1
                  }}>{kanji}</span>
                  <span style={{
                    fontSize:10, fontWeight:800, borderRadius:20, padding:"2px 8px",
                    background: isSel?"rgba(255,255,255,0.25)":(dark?`${lv.fg}22`:lv.bg),
                    color: isSel?"white":lv.fg,
                    border: isSel?"none":`1px solid ${lv.bd}`
                  }}>{node.level}</span>
                  {info.hasChildren && (
                    <span style={{
                      fontSize:9, fontWeight:800, borderRadius:20, padding:"2px 7px",
                      background: isSel?"rgba(255,255,255,0.18)":(dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"),
                      color: isSel?"rgba(255,255,255,0.85)":CC.muted
                    }}>BC</span>
                  )}
                  {showHV && node.hv && (
                    <span style={{ fontSize:9, fontWeight:700, color: isSel?"rgba(255,255,255,0.75)":CC.muted, letterSpacing:0.5 }}>{node.hv}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating toolbar */}
          <div style={{ position:"absolute", top:10, right:10, display:"flex", flexDirection:"column", gap:6, zIndex:20 }}>
            {[
              { label:"+", act:zoomIn, bg:"white", fg:"#111827" },
              { label:"−", act:zoomOut, bg:"white", fg:"#111827" },
              { label:"Fit", act:doFit, bg:"white", fg:"#111827" },
              { label:"👁", act:()=>setShowHV(v=>!v), bg: showHV?"#EC4899":"white", fg: showHV?"white":"#111827" },
              { label:"Full", act:doFull, bg:"#2563EB", fg:"white" },
              { label:"Esc", act:()=>setSelected(null), bg:"#F59E0B", fg:"white" },
              { label:"Dark", act:()=>toggleDark(!dark), bg:"#111827", fg:"white" },
              { label:"Reset", act:doReset, bg:"#DC2626", fg:"white" },
            ].map((b,i)=>(
              <button key={i} onClick={b.act} className="ba-btn"
                style={{
                  width:isMob?36:44, height:isMob?30:32, borderRadius:10, border:"none",
                  background:b.bg, color:b.fg, fontSize:isMob?11:12, fontWeight:800,
                  boxShadow:"0 2px 10px rgba(0,0,0,0.18)", cursor:"pointer"
                }}>{b.label}</button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ position:"absolute", bottom:10, left:10, display:"flex", gap:10, flexWrap:"wrap", fontSize:10, color:CC.muted, background:dark?"rgba(15,23,42,0.85)":"rgba(255,255,255,0.9)", borderRadius:10, padding:"6px 10px", maxWidth:"70%" }}>
            <span>🖱️ Kéo để di chuyển</span><span>🖱️ Cuộn để zoom</span>
          </div>
        </div>

      </div>

      {/* Detail panel (right column) */}
      <div style={{ width: isTab ? "100%" : 270, flexShrink:0, minHeight:0, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {selected ? (
          <KanjiDiagramDetail node={selected} onClose={()=>setSelected(null)}/>
        ) : (
          <div className="ba-card" style={{ padding:"24px 20px", textAlign:"center" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>👆</div>
            <div style={{ fontSize:13, color:CC.muted, lineHeight:1.6 }}>Nhấn vào một chữ Kanji trong sơ đồ để xem giải thích nghĩa và cách nhớ</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// KANJI BUILDER — Học Kanji qua bộ thủ (Radicals)
// ════════════════════════════════════════════════════════════════
const RADICAL_KANJI = [
  { kanji:"明", radicals:["日","月"], story:"Mặt trời (日) + Mặt trăng (月) → Ánh sáng chói lọi → SÁNG", on:"メイ・ミョウ", kun:"あか・あき", vn:"Sáng, Rõ ràng", ex:[{jp:"明るい",vn:"sáng sủa"},{jp:"説明",vn:"giải thích"}] },
  { kanji:"休", radicals:["人","木"], story:"Người (人) dựa vào cây (木) → Nghỉ ngơi dưới bóng cây → NGHỈ", on:"キュウ", kun:"やす", vn:"Nghỉ ngơi", ex:[{jp:"休む",vn:"nghỉ"},{jp:"休日",vn:"ngày nghỉ"}] },
  { kanji:"森", radicals:["木","木","木"], story:"Ba cây (木×3) = Rừng rậm nhiều cây → RỪNG", on:"シン", kun:"もり", vn:"Rừng", ex:[{jp:"森林",vn:"rừng cây"},{jp:"森",vn:"khu rừng"}] },
  { kanji:"林", radicals:["木","木"], story:"Hai cây (木×2) = Đám cây, rừng nhỏ → RỪNG NHỎ", on:"リン", kun:"はやし", vn:"Rừng nhỏ", ex:[{jp:"森林",vn:"rừng"},{jp:"林",vn:"rừng nhỏ"}] },
  { kanji:"男", radicals:["田","力"], story:"Ruộng (田) + Sức mạnh (力) → Người làm ruộng bằng sức → ĐÀN ÔNG", on:"ダン・ナン", kun:"おとこ", vn:"Đàn ông, Nam", ex:[{jp:"男性",vn:"nam giới"},{jp:"男の子",vn:"bé trai"}] },
  { kanji:"安", radicals:["宀","女"], story:"Người phụ nữ (女) dưới mái nhà (宀) → An toàn, bình yên → YÊN BÌNH", on:"アン", kun:"やす", vn:"Rẻ, Bình an", ex:[{jp:"安い",vn:"rẻ"},{jp:"安心",vn:"yên tâm"}] },
  { kanji:"好", radicals:["女","子"], story:"Người mẹ (女) bên đứa con (子) → Tình yêu thương → YÊU THÍCH", on:"コウ", kun:"す・この", vn:"Yêu thích", ex:[{jp:"好き",vn:"thích"},{jp:"好物",vn:"món ưa thích"}] },
  { kanji:"岩", radicals:["山","石"], story:"Núi (山) + Đá (石) → Tảng đá lớn trên núi → ĐÁ TẢNG", on:"ガン", kun:"いわ", vn:"Tảng đá, Đá núi", ex:[{jp:"岩石",vn:"đá tảng"},{jp:"岩山",vn:"núi đá"}] },
  { kanji:"岸", radicals:["山","干"], story:"Núi (山) + Khô (干) → Bờ núi khô ráo → BỜ", on:"ガン", kun:"きし", vn:"Bờ biển, Bờ sông", ex:[{jp:"海岸",vn:"bờ biển"},{jp:"岸",vn:"bờ"}] },
  { kanji:"語", radicals:["言","吾"], story:"Lời nói (言) + Ta (吾) → Ngôn ngữ của tôi → NGÔN NGỮ", on:"ゴ", kun:"かた", vn:"Ngôn ngữ, Nói", ex:[{jp:"日本語",vn:"tiếng Nhật"},{jp:"語る",vn:"kể chuyện"}] },
  { kanji:"話", radicals:["言","舌"], story:"Lời nói (言) + Lưỡi (舌) → Dùng lưỡi để nói → NÓI CHUYỆN", on:"ワ", kun:"はな", vn:"Nói, Câu chuyện", ex:[{jp:"話す",vn:"nói chuyện"},{jp:"電話",vn:"điện thoại"}] },
  { kanji:"聞", radicals:["門","耳"], story:"Áp tai (耳) vào cánh cửa (門) → Nghe ngóng → NGHE", on:"ブン・モン", kun:"き", vn:"Nghe, Hỏi", ex:[{jp:"聞く",vn:"nghe, hỏi"},{jp:"新聞",vn:"báo chí"}] },
];
function KanjiBuilderPage() {
  
  const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [view, setView] = useState("diagram"); // "diagram" | "quiz"
  const [idx, setIdx]         = useState(0);
  const [phase, setPhase]     = useState("learn"); // "learn" | "quiz"
  const [quizSlots, setQuizSlots] = useState([]); // placed radicals
  const [quizBank, setQuizBank]   = useState([]); // shuffled choices
  const [checked, setChecked] = useState(false);
  const [score, setScore]     = useState({correct:0, total:0});

  const k = RADICAL_KANJI[idx];
  
  const startQuiz = () => {
    // Build bank: correct radicals + 4 distractors
    const distractors = ["人","木","日","月","口","手","目","耳","山","田","力","火","水","土","石","言","心","女","子","門"].filter(r=>!k.radicals.includes(r)).sort(()=>Math.random()-0.5).slice(0,4);
    const bank = [...k.radicals, ...distractors].sort(()=>Math.random()-0.5);
    setQuizBank(bank);
    setQuizSlots([]);
    setChecked(false);
    setPhase("quiz");
  };

  const pickRadical = (r, fromBank) => {
    if (checked) return;
    if (fromBank) {
      if (quizSlots.length < k.radicals.length) {
        setQuizSlots(s=>[...s,r]);
        setQuizBank(b=>{ const i=b.indexOf(r); return [...b.slice(0,i),...b.slice(i+1)]; });
      }
    } else {
      const i = quizSlots.indexOf(r);
      setQuizSlots(s=>s.filter((_,j)=>j!==i));
      setQuizBank(b=>[...b,r]);
    }
  };

  const checkQuiz = () => {
    const correct = quizSlots.join("")===k.radicals.join("") || quizSlots.sort().join("")===k.radicals.slice().sort().join("");
    setChecked(true);
    setScore(s=>({correct:s.correct+(correct?1:0),total:s.total+1}));
  };

  const next = () => {
    setIdx(i=>(i+1)%RADICAL_KANJI.length);
    setPhase("learn");
    setChecked(false);
  };
 
  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const isCorrect = checked && (quizSlots.join("")===k.radicals.join("") || quizSlots.sort().join("")===k.radicals.slice().sort().join(""));

  return (
    <div style={{ maxWidth: view==="diagram" ? 1360 : 720, margin:"0 auto", padding:isMob?"12px 10px":"14px 24px", fontFamily:"'Nunito',sans-serif", transition:"max-width 0.2s", flex:1, minHeight:0, width:"100%", boxSizing:"border-box", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#451A03,#92400E,#B45309)", borderRadius:24, padding:isMob?"14px 18px":"14px 28px", color:"white", marginBottom:12, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>⛩️</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>KANJI BUILDER · BỘ THỦ</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>{"⛩️ Kanji Bộ Thủ (Radicals)"}</div>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:14 }}>Hiểu Kanji qua bộ thủ cấu thành · Ghép radical thành chữ</div>
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700, display:"inline-block" }}>
          ✅ {score.correct}/{score.total} · {idx+1}/{RADICAL_KANJI.length} Kanji
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:8, marginBottom:20, background:dark?"rgba(30,41,59,0.5)":"rgba(241,245,249,0.8)", padding:5, borderRadius:14 }}>
        {[
          { id:"diagram", icon:"🌳", label:"Sơ Đồ Kanji" },
          { id:"quiz",    icon:"🧩", label:"Ghép Kanji" },
        ].map(tb=>(
          <button key={tb.id} onClick={()=>setView(tb.id)} className="ba-btn"
            style={{
              flex:1, padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer",
              fontSize:13, fontWeight:800, fontFamily:"'Nunito',sans-serif",
              background: view===tb.id ? "linear-gradient(135deg,#B45309,#92400E)" : "transparent",
              color: view===tb.id ? "white" : CC.muted,
              boxShadow: view===tb.id ? "0 3px 12px rgba(180,83,9,0.3)" : "none",
              transition:"all 0.15s ease"
            }}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {view === "diagram" && <KanjiDiagramView/>}

      {view === "quiz" && (<>
      {/* Navigation */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={()=>{setIdx(i=>(i-1+RADICAL_KANJI.length)%RADICAL_KANJI.length);setPhase("learn");}}
          style={{ width:36, height:36, borderRadius:10, border:`1px solid rgba(180,83,9,0.3)`, background:"transparent", color:"#B45309", cursor:"pointer", fontSize:16 }}>‹</button>
        <div style={{ flex:1 }}>
          <div style={{ background:dark?"rgba(30,41,59,0.7)":"rgba(241,245,249,0.9)", borderRadius:99, height:6, overflow:"hidden" }}>
            <div style={{ width:`${(idx+1)/RADICAL_KANJI.length*100}%`, height:"100%", background:"linear-gradient(90deg,#B45309,#D97706)", transition:"width 0.4s" }}/>
          </div>
        </div>
        <button onClick={()=>{setIdx(i=>(i+1)%RADICAL_KANJI.length);setPhase("learn");}}
          style={{ width:36, height:36, borderRadius:10, border:`1px solid rgba(180,83,9,0.3)`, background:"transparent", color:"#B45309", cursor:"pointer", fontSize:16 }}>›</button>
      </div>

      {/* Learn phase */}
      {phase === "learn" && (
        <div>
          {/* Main kanji display */}
          <div style={{ background:bgCard, borderRadius:20, padding:isMob?"20px":"32px", marginBottom:16, textAlign:"center", border:`1px solid rgba(180,83,9,0.2)` }}>
            <div style={{ fontSize:isMob?80:100, fontFamily:"'Noto Sans JP',serif", fontWeight:900, color:"#B45309", marginBottom:16, lineHeight:1 }}>{k.kanji}</div>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {k.radicals.map((r,i)=>(
                <React.Fragment key={i}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:40, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:700, color:"#D97706",
                      background:dark?"rgba(180,83,9,0.15)":"rgba(253,230,138,0.4)", borderRadius:14, padding:"10px 18px",
                      border:"2px solid rgba(180,83,9,0.3)" }}>{r}</div>
                  </div>
                  {i < k.radicals.length-1 && <div style={{ fontSize:20, color:CC.muted, fontWeight:700 }}>+</div>}
                </React.Fragment>
              ))}
              <div style={{ fontSize:20, color:CC.muted, fontWeight:700 }}>→</div>
              <div style={{ fontSize:40, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:900, color:"#B45309",
                background:dark?"rgba(180,83,9,0.2)":"rgba(253,230,138,0.6)", borderRadius:14, padding:"10px 18px",
                border:"2px solid rgba(180,83,9,0.5)" }}>{k.kanji}</div>
            </div>
            <div style={{ background:dark?"rgba(180,83,9,0.1)":"rgba(255,251,235,0.9)", border:"1.5px solid rgba(180,83,9,0.25)", borderRadius:14, padding:"12px 16px", marginBottom:16, fontSize:14, color:dark?"#FCD34D":"#92400E", lineHeight:1.7, fontStyle:"italic" }}>
              💡 {k.story}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:16 }}>
              {[{l:"音読み",v:k.on},{l:"訓読み",v:k.kun},{l:"Nghĩa",v:k.vn},{l:"Bộ thủ",v:k.radicals.join(" + ")}].map((info,i)=>(
                <div key={i} style={{ background:dark?"rgba(15,23,42,0.5)":"rgba(248,250,252,0.9)", borderRadius:10, padding:"8px 12px" }}>
                  <div style={{ fontSize:10, color:"#B45309", fontWeight:700 }}>{info.l}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:dark?"#FCD34D":CC.text, fontFamily:"'Noto Sans JP',sans-serif" }}>{info.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
              {k.ex.map((e,i)=>(
                <div key={i} style={{ background:dark?"rgba(180,83,9,0.1)":"rgba(255,237,213,0.8)", borderRadius:10, padding:"6px 14px", fontSize:13, color:dark?"#FCD34D":"#92400E", fontFamily:"'Noto Sans JP',sans-serif" }}>
                  <span style={{ fontWeight:800 }}>{e.jp}</span> <span style={{ opacity:0.8 }}>· {e.vn}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={startQuiz}
            style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#B45309,#92400E)", color:"white", fontSize:14, fontWeight:800,
              fontFamily:"'Nunito',sans-serif", boxShadow:"0 4px 20px rgba(180,83,9,0.4)" }}>
            🎮 Thử ghép bộ thủ →
          </button>
        </div>
      )}

      {/* Quiz phase */}
      {phase === "quiz" && (
        <div>
          <div style={{ background:bgCard, borderRadius:20, padding:isMob?"18px":"24px", marginBottom:16, border:`1px solid rgba(180,83,9,0.2)` }}>
            <div style={{ fontSize:14, fontWeight:700, color:CC.muted, marginBottom:12 }}>Ghép bộ thủ để tạo thành chữ: <span style={{ fontSize:28, fontFamily:"'Noto Sans JP',serif", color:"#B45309" }}>{k.kanji}</span></div>
            {/* Slots */}
            <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:16, minHeight:70 }}>
              {Array.from({length:k.radicals.length}).map((_,i)=>(
                <div key={i} onClick={()=>quizSlots[i]&&pickRadical(quizSlots[i],false)}
                  style={{ width:64, height:64, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center",
                    border:`2px dashed ${quizSlots[i]?checked?(isCorrect?"#10B981":"#EF4444"):"rgba(180,83,9,0.5)":"rgba(180,83,9,0.25)"}`,
                    background:quizSlots[i]?dark?"rgba(180,83,9,0.15)":"rgba(255,237,213,0.6)":dark?"rgba(15,23,42,0.4)":"rgba(248,250,252,0.9)",
                    fontSize:28, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:700, color:"#B45309",
                    cursor:quizSlots[i]?"pointer":"default" }}>
                  {quizSlots[i] || ""}
                </div>
              ))}
            </div>
            {/* Bank */}
            <div style={{ fontSize:12, color:CC.muted, fontWeight:700, marginBottom:8 }}>BẤM ĐỂ GHÉP:</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {quizBank.map((r,i)=>(
                <button key={i} onClick={()=>pickRadical(r,true)} disabled={checked}
                  style={{ width:52, height:52, borderRadius:12, border:`1.5px solid rgba(180,83,9,0.3)`,
                    background:dark?"rgba(30,41,59,0.8)":"rgba(255,251,235,0.9)", color:"#B45309",
                    fontSize:24, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:700, cursor:"pointer" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {checked && (
            <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:12,
              border:`2px solid ${isCorrect?"rgba(16,185,129,0.4)":"rgba(239,68,68,0.4)"}` }}>
              <div style={{ fontSize:16, fontWeight:900, color:isCorrect?"#10B981":"#EF4444", marginBottom:6 }}>
                {isCorrect?"🎉 Chính xác!":"❌ Chưa đúng"}
              </div>
              <div style={{ fontSize:13, color:CC.muted }}>Đáp án: <span style={{ fontFamily:"'Noto Sans JP',sans-serif", color:"#B45309", fontWeight:800 }}>{k.radicals.join(" + ")} → {k.kanji}</span></div>
            </div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            {!checked ? (
              <>
                <button onClick={()=>setPhase("learn")}
                  style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid rgba(180,83,9,0.3)`, background:"transparent", color:"#B45309", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  ← Xem lại
                </button>
                <button onClick={checkQuiz} disabled={quizSlots.length<k.radicals.length}
                  style={{ flex:2, padding:"11px", borderRadius:12, border:"none",
                    background:quizSlots.length<k.radicals.length?"rgba(148,163,184,0.2)":"linear-gradient(135deg,#B45309,#92400E)",
                    color:quizSlots.length<k.radicals.length?CC.muted:"white", fontSize:13, fontWeight:800, cursor:quizSlots.length<k.radicals.length?"not-allowed":"pointer", fontFamily:"'Nunito',sans-serif" }}>
                  ✅ Kiểm tra
                </button>
              </>
            ) : (
              <button onClick={next}
                style={{ flex:1, padding:"12px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#B45309,#92400E)", color:"white", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif", boxShadow:"0 4px 16px rgba(180,83,9,0.4)" }}>
                {"Kanji tiếp →"}
              </button>
            )}
          </div>
        </div>
      )}
      </>)}
    </div>
  );
  
}

// ════════════════════════════════════════════════════════════════
// AI ANALYSIS PAGE — Phân tích học tập bằng AI
// ════════════════════════════════════════════════════════════════
function AIAnalysisPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Gather all stats from localStorage
  const gatherStats = () => {
    const kanjiStats  = (() => { try { return JSON.parse(localStorage.getItem("sp_kanji_stats")||"{}"); } catch { return {}; } })();
    const cardStats   = (() => { try { return JSON.parse(localStorage.getItem("sp_card_stats")||"{}"); } catch { return {}; } })();
    const jlptHistory = (() => { try { return JSON.parse(localStorage.getItem("sp_jlpt_history")||"[]"); } catch { return []; } })();
    const userStats   = (() => { try { return JSON.parse(localStorage.getItem("sp_user_stats")||"{}"); } catch { return {}; } })();
    const streak      = (() => { try { return JSON.parse(localStorage.getItem("sp_streak")||"0"); } catch { return 0; } })();

    const kanjiTotal  = Object.keys(kanjiStats).length;
    const kanjiCorrect = Object.values(kanjiStats).filter(s=>(s.correct||0)>=(s.wrong||0)).length;
    const kanjiWrong  = Object.values(kanjiStats).filter(s=>(s.wrong||0)>(s.correct||0)).length;

    const vocabTotal  = Object.keys(cardStats).length;
    const vocabEasy   = Object.values(cardStats).filter(s=>s.interval>3).length;

    const jlptN5Scores = jlptHistory.filter(h=>h.level==="N5").map(h=>h.score||0);
    const jlptN4Scores = jlptHistory.filter(h=>h.level==="N4").map(h=>h.score||0);
    const avgN5 = jlptN5Scores.length ? Math.round(jlptN5Scores.reduce((a,b)=>a+b,0)/jlptN5Scores.length) : null;
    const avgN4 = jlptN4Scores.length ? Math.round(jlptN4Scores.reduce((a,b)=>a+b,0)/jlptN4Scores.length) : null;

    return {
      kanji: { total:kanjiTotal, correct:kanjiCorrect, wrong:kanjiWrong },
      vocab: { total:vocabTotal, easy:vocabEasy },
      jlpt:  { n5Tests:jlptN5Scores.length, avgN5, n4Tests:jlptN4Scores.length, avgN4 },
      streak,
      aiChats:     userStats.aiChats||0,
      sentenceGames: userStats.sentenceGames||0,
      listeningDone: userStats.listeningDone||0,
    };
  };

  const runAnalysis = async () => {
    setLoading(true);
    const stats = gatherStats();

    try {
      const res = await fetch("/api/claude",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:800,
          system:`Bạn là AI phân tích học tập tiếng Nhật. Phân tích dữ liệu học viên và trả về JSON thuần không markdown:
{
  "skills":{"reading":70,"listening":45,"grammar":60,"vocabulary":75,"kanji":55},
  "weakest":"listening",
  "strongest":"vocabulary",
  "insights":["nhận xét 1","nhận xét 2","nhận xét 3"],
  "suggestions":["gợi ý cụ thể 1","gợi ý cụ thể 2","gợi ý cụ thể 3"],
  "encouragement":"lời động viên ngắn bằng tiếng Việt",
  "jlptReady":"N5"
}
Skills: 0-100. Insights và suggestions bằng tiếng Việt, cụ thể và thực tế.`,
          messages:[{role:"user", content:`Phân tích dữ liệu học viên: ${JSON.stringify(stats)}`}]
        })
      });
      const d = await res.json();
      const raw = d.content?.[0]?.text||"{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setAnalysis(parsed);
      setLastUpdated(new Date().toLocaleTimeString("vi-VN"));
    } catch {
      // Fallback analysis based on stats
      const stats2 = gatherStats();
      const kanjiScore = stats2.kanji.total>0 ? Math.min(100, Math.round(stats2.kanji.correct/Math.max(stats2.kanji.total,1)*100)) : 20;
      const vocabScore = Math.min(100, Math.round(stats2.vocab.total/5));
      const listeningScore = Math.min(100, stats2.listeningDone*8);
      const grammarScore  = Math.min(100, stats2.jlpt.n5Tests*20);
      setAnalysis({
        skills:{ reading:50, listening:listeningScore||30, grammar:grammarScore||40, vocabulary:vocabScore||35, kanji:kanjiScore||25 },
        weakest:"kanji", strongest:"vocabulary",
        insights:["Dữ liệu học tập của bạn đang được thu thập","Hãy luyện tập thêm để nhận phân tích chính xác hơn","Mỗi bài học đều giúp AI hiểu bạn hơn"],
        suggestions:["Luyện viết Kanji 10 phút mỗi ngày","Nghe TTS 3 câu mỗi buổi sáng","Làm 5 game ghép câu mỗi ngày"],
        encouragement:"Bạn đang đi đúng hướng! Tiếp tục cố gắng nhé 💪",
        jlptReady:"N5"
      });
      setLastUpdated(new Date().toLocaleTimeString("vi-VN"));
    }
    setLoading(false);
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const skillColors = { reading:"#2563EB", listening:"#7C3AED", grammar:"#059669", vocabulary:"#D97706", kanji:"#DC2626" };
  const skillLabels = { reading:"📖 Đọc", listening:"🎧 Nghe", grammar:t.grammarTitle ? "📝 "+t.grammarTitle : "📝 Ngữ pháp", vocabulary:"📚 Từ vựng", kanji:"🈶 Kanji" };

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1E0A3C,#4C1D95,#6D28D9)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>📊</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>AI · LEARNING ANALYSIS</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>📊 Phân Tích Học Tập AI</div>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:16 }}>AI đọc toàn bộ dữ liệu học tập · Radar chart 5 kỹ năng · Gợi ý cá nhân hoá</div>
        <button onClick={runAnalysis} disabled={loading}
          style={{ background:loading?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.95)", color:loading?"white":"#4C1D95",
            border:"none", borderRadius:14, padding:"10px 24px", fontSize:13, fontWeight:800, cursor:loading?"wait":"pointer",
            fontFamily:"'Nunito',sans-serif", boxShadow:loading?"none":"0 4px 16px rgba(0,0,0,0.2)" }}>
          {loading ? "⏳ AI đang phân tích..." : "🔍 Phân tích ngay"}
        </button>
        {lastUpdated && <div style={{ fontSize:11, opacity:0.7, marginTop:6 }}>Cập nhật lúc {lastUpdated}</div>}
      </div>

      {!analysis && !loading && (
        <div style={{ background:bgCard, borderRadius:20, padding:"32px", textAlign:"center", border:`1px solid ${dark?"rgba(109,40,217,0.2)":"rgba(109,40,217,0.1)"}` }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🤖</div>
          <div style={{ fontSize:16, fontWeight:800, color:dark?"#E2E8F0":CC.text, marginBottom:8 }}>AI sẵn sàng phân tích</div>
          <div style={{ fontSize:13, color:CC.muted, marginBottom:20, lineHeight:1.6 }}>
            Bấm "Phân tích ngay" để AI đọc toàn bộ dữ liệu học tập của bạn và đưa ra nhận xét cá nhân hoá.
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
            {["Kanji đã học","Từ vựng SRS","Kết quả JLPT","Số ngày streak","AI chats","Game ghép câu"].map(t=>(
              <span key={t} style={{ fontSize:11, background:dark?"rgba(109,40,217,0.15)":"rgba(237,233,254,0.9)", color:"#7C3AED", padding:"4px 12px", borderRadius:20, fontWeight:700 }}>✓ {t}</span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ background:bgCard, borderRadius:20, padding:"48px 32px", textAlign:"center", border:`1px solid ${dark?"rgba(109,40,217,0.2)":"rgba(109,40,217,0.1)"}` }}>
          <div style={{ fontSize:48, marginBottom:16, animation:"spin 1.5s linear infinite", display:"inline-block" }}>🧠</div>
          <div style={{ fontSize:15, fontWeight:700, color:dark?"#E2E8F0":CC.text }}>AI đang phân tích dữ liệu học tập...</div>
          <div style={{ fontSize:13, color:CC.muted, marginTop:6 }}>Kiểm tra Kanji · Từ vựng · JLPT · Streak</div>
        </div>
      )}

      {analysis && (
        <div>
          {/* Skill radar bars */}
          <div style={{ background:bgCard, borderRadius:20, padding:"20px", marginBottom:16, border:`1px solid ${dark?"rgba(109,40,217,0.2)":"rgba(109,40,217,0.1)"}` }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#7C3AED", marginBottom:16 }}>📊 ĐIỂM 5 KỸ NĂNG</div>
            {Object.entries(analysis.skills||{}).map(([skill,val])=>(
              <div key={skill} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:dark?"#E2E8F0":CC.text }}>{skillLabels[skill]||skill}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:skillColors[skill]||"#7C3AED" }}>{val}/100</span>
                </div>
                <div style={{ background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", borderRadius:99, height:12, overflow:"hidden" }}>
                  <div style={{ width:`${val}%`, height:"100%", borderRadius:99, transition:"width 0.8s ease",
                    background:`linear-gradient(90deg,${skillColors[skill]||"#7C3AED"},${skillColors[skill]||"#7C3AED"}99)` }}/>
                </div>
                {skill===analysis.weakest&&<div style={{ fontSize:10, color:"#EF4444", marginTop:2 }}>⚠️ Điểm yếu nhất — cần chú ý</div>}
                {skill===analysis.strongest&&<div style={{ fontSize:10, color:"#10B981", marginTop:2 }}>⭐ Điểm mạnh nhất</div>}
              </div>
            ))}
          </div>

          {/* JLPT readiness */}
          <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:16, border:`2px solid ${LEVEL_COLOR[analysis.jlptReady]||"#22c55e"}30` }}>
            <div style={{ fontSize:12, color:CC.muted, fontWeight:700, marginBottom:6 }}>🎌 MỨC ĐỘ SẴN SÀNG JLPT</div>
            <div style={{ fontSize:18, fontWeight:900, color:LEVEL_COLOR[analysis.jlptReady]||"#22c55e" }}>
              {analysis.jlptReady} — Sẵn sàng luyện thi
            </div>
          </div>

          {/* Insights */}
          {analysis.insights?.length>0 && (
            <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:16, border:`1px solid ${dark?"rgba(109,40,217,0.15)":"rgba(109,40,217,0.1)"}` }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#7C3AED", marginBottom:10 }}>🔍 NHẬN XÉT</div>
              {analysis.insights.map((ins,i)=>(
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <span style={{ color:"#7C3AED", fontWeight:700, flexShrink:0 }}>•</span>
                  <span style={{ fontSize:13, color:dark?"#E2E8F0":CC.text, lineHeight:1.6 }}>{ins}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions?.length>0 && (
            <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:16, border:`1px solid rgba(16,185,129,0.2)` }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#10B981", marginBottom:10 }}>💡 GỢI Ý CẢI THIỆN</div>
              {analysis.suggestions.map((sug,i)=>(
                <div key={i} style={{ display:"flex", gap:8, marginBottom:8, padding:"8px 10px", background:dark?"rgba(16,185,129,0.06)":"rgba(240,253,244,0.8)", borderRadius:10 }}>
                  <span style={{ color:"#10B981", fontWeight:700, flexShrink:0 }}>{i+1}.</span>
                  <span style={{ fontSize:13, color:dark?"#A7F3D0":"#065F46", fontWeight:600 }}>{sug}</span>
                </div>
              ))}
            </div>
          )}

          {/* Encouragement */}
          {analysis.encouragement && (
            <div style={{ background:"linear-gradient(135deg,rgba(109,40,217,0.1),rgba(124,58,237,0.08))", border:"1.5px solid rgba(109,40,217,0.25)", borderRadius:16, padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:24, marginBottom:8 }}>🌸</div>
              <div style={{ fontSize:14, fontWeight:700, color:dark?"#DDD6FE":"#4C1D95", lineHeight:1.7 }}>{analysis.encouragement}</div>
            </div>
          )}

          <button onClick={runAnalysis} disabled={loading} style={{ width:"100%", marginTop:16, padding:"12px", borderRadius:14, border:"none", cursor:"pointer",
            background:"linear-gradient(135deg,#4C1D95,#6D28D9)", color:"white", fontSize:13, fontWeight:800,
            fontFamily:"'Nunito',sans-serif" }}>
            🔄 Phân tích lại
          </button>
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// DATA: NEWS ARTICLES
// ════════════════════════════════════════════════════════════════
const NEWS_ARTICLES = [
  {
    id:"n1", level:"N5", category:"生活", categoryVn:"Đời sống", emoji:"🌸",
    title:"春が来ました",
    titleVn:"Mùa xuân đến rồi",
    body:[
      { jp:"今日から三月です。", furi:"きょうからさんがつです。", vn:"Hôm nay bắt đầu tháng Ba." },
      { jp:"日本では、三月に桜の花が咲きます。", furi:"にほんでは、さんがつにさくらのはながさきます。", vn:"Ở Nhật Bản, hoa anh đào nở vào tháng Ba." },
      { jp:"人々は公園に行って、花見をします。", furi:"ひとびとはこうえんにいって、はなみをします。", vn:"Mọi người đến công viên để ngắm hoa." },
      { jp:"桜の木の下でお弁当を食べるのが楽しいです。", furi:"さくらのきのしたでおべんとうをたべるのがたのしいです。", vn:"Ăn cơm hộp dưới gốc cây anh đào rất vui." },
    ],
    words:[{w:"春",r:"はる",vn:"mùa xuân"},{w:"桜",r:"さくら",vn:"hoa anh đào"},{w:"花見",r:"はなみ",vn:"ngắm hoa"},{w:"公園",r:"こうえん",vn:"công viên"},{w:"お弁当",r:"おべんとう",vn:"cơm hộp"}],
    quiz:[
      {q:"桜はいつ咲きますか？",opts:["一月","二月","三月","四月"],ans:2},
      {q:"人々は公園で何をしますか？",opts:["スポーツ","花見","仕事","勉強"],ans:1},
    ],
    grammarNote:{pattern:"〜のが楽しいです",meaning:"Việc ~ thật vui",example:"花見をするのが楽しいです。"}
  },
  {
    id:"n2", level:"N5", category:"食文化", categoryVn:"Ẩm thực", emoji:"🍣",
    title:"寿司の歴史",
    titleVn:"Lịch Sử Sushi",
    body:[
      { jp:"寿司は日本の有名な食べ物です。", furi:"すしはにほんのゆうめいなたべものです。", vn:"Sushi là món ăn nổi tiếng của Nhật Bản." },
      { jp:"昔、寿司は魚を保存するための食べ物でした。", furi:"むかし、すしはさかなをほぞんするためのたべものでした。", vn:"Ngày xưa, sushi là món ăn dùng để bảo quản cá." },
      { jp:"今は世界中で食べられています。", furi:"いまはせかいじゅうでたべられています。", vn:"Ngày nay sushi được ăn trên khắp thế giới." },
      { jp:"日本に来たら、ぜひ食べてみてください。", furi:"にほんにきたら、ぜひたべてみてください。", vn:"Nếu đến Nhật, hãy nhất định thử ăn nhé." },
    ],
    words:[{w:"寿司",r:"すし",vn:"sushi"},{w:"有名",r:"ゆうめい",vn:"nổi tiếng"},{w:"保存",r:"ほぞん",vn:"bảo quản"},{w:"世界中",r:"せかいじゅう",vn:"khắp thế giới"}],
    quiz:[
      {q:"昔、寿司は何のための食べ物でしたか？",opts:["お祭り","魚の保存","お祝い","贈り物"],ans:1},
      {q:"今、寿司はどこで食べられますか？",opts:["日本だけ","アジアだけ","世界中","ヨーロッパだけ"],ans:2},
    ],
    grammarNote:{pattern:"〜てみてください",meaning:"Hãy thử ~",example:"食べてみてください。"}
  },
  {
    id:"n3", level:"N4", category:"科学", categoryVn:"Khoa học", emoji:"🌊",
    title:"海洋プラスチック問題",
    titleVn:"Vấn Đề Rác Thải Nhựa Đại Dương",
    body:[
      { jp:"毎年、何百万トンものプラスチックごみが海に捨てられています。", furi:"まいとし、なんひゃくまんとんものぷらすちっくごみがうみにすてられています。", vn:"Hàng năm, hàng triệu tấn rác nhựa bị thải xuống biển." },
      { jp:"このごみは海の生き物に大きな被害を与えています。", furi:"このごみはうみのいきものにおおきなひがいをあたえています。", vn:"Rác này gây thiệt hại lớn cho các sinh vật biển." },
      { jp:"日本でも、海岸のごみを拾うボランティア活動が増えています。", furi:"にほんでも、かいがんのごみをひろうぼらんてぃあかつどうがふえています。", vn:"Ở Nhật, hoạt động tình nguyện nhặt rác bờ biển cũng ngày càng tăng." },
      { jp:"一人一人が環境を守るために行動することが大切です。", furi:"ひとりひとりがかんきょうをまもるためにこうどうすることがたいせつです。", vn:"Điều quan trọng là mỗi người cần hành động để bảo vệ môi trường." },
    ],
    words:[{w:"海洋",r:"かいよう",vn:"đại dương"},{w:"プラスチック",r:"ぷらすちっく",vn:"nhựa"},{w:"被害",r:"ひがい",vn:"thiệt hại"},{w:"ボランティア",r:"ぼらんてぃあ",vn:"tình nguyện"},{w:"環境",r:"かんきょう",vn:"môi trường"}],
    quiz:[
      {q:"海のごみは何に被害を与えますか？",opts:["人間","海の生き物","船","空気"],ans:1},
      {q:"日本では何が増えていますか？",opts:["プラスチック工場","海水浴客","ボランティア活動","魚の数"],ans:2},
    ],
    grammarNote:{pattern:"〜ために行動する",meaning:"Hành động để ~",example:"環境を守るために行動する。"}
  },
  {
    id:"n4", level:"N4", category:"文化", categoryVn:"Văn hóa", emoji:"🎋",
    title:"七夕まつり",
    titleVn:"Lễ Hội Tanabata",
    body:[
      { jp:"七夕は七月七日に行われる日本の伝統的なお祭りです。", furi:"たなばたはしちがつなのかにおこなわれるにほんのでんとうてきなおまつりです。", vn:"Tanabata là lễ hội truyền thống của Nhật Bản được tổ chức vào ngày 7 tháng 7." },
      { jp:"この日、人々は短冊に願い事を書きます。", furi:"このひ、ひとびとはたんざくにねがいごとをかきます。", vn:"Ngày này, mọi người viết điều ước lên tờ giấy tanzaku." },
      { jp:"短冊は竹の枝に飾られます。", furi:"たんざくはたけのえだにかざられます。", vn:"Tanzaku được treo lên cành tre." },
      { jp:"七夕は織姫と彦星の伝説から生まれたお祭りです。", furi:"たなばたはおりひめとひこぼしのでんせつからうまれたおまつりです。", vn:"Tanabata là lễ hội ra đời từ truyền thuyết về nàng Orihime và chàng Hikoboshi." },
    ],
    words:[{w:"七夕",r:"たなばた",vn:"lễ Tanabata"},{w:"短冊",r:"たんざく",vn:"tờ giấy ước"},{w:"願い事",r:"ねがいごと",vn:"điều ước"},{w:"竹",r:"たけ",vn:"tre"},{w:"伝説",r:"でんせつ",vn:"truyền thuyết"}],
    quiz:[
      {q:"七夕はいつですか？",opts:["五月五日","六月六日","七月七日","八月八日"],ans:2},
      {q:"短冊には何を書きますか？",opts:["名前","住所","願い事","日記"],ans:2},
    ],
    grammarNote:{pattern:"〜から生まれた",meaning:"Ra đời từ ~",example:"伝説から生まれたお祭りです。"}
  },
  {
    id:"n5", level:"N3", category:"社会", categoryVn:"Xã hội", emoji:"👴",
    title:"日本の高齢化社会",
    titleVn:"Xã Hội Già Hóa Của Nhật Bản",
    body:[
      { jp:"現在、日本は世界で最も高齢化が進んでいる国の一つです。", furi:"げんざい、にほんはせかいでもっともこうれいかがすすんでいるくにのひとつです。", vn:"Hiện nay, Nhật Bản là một trong những quốc gia có tốc độ già hóa nhanh nhất thế giới." },
      { jp:"65歳以上の人口が全体の約29%を占めています。", furi:"ろくじゅうごさいいじょうのじんこうがぜんたいのやくにじゅうきゅうぱーせんとをしめています。", vn:"Người từ 65 tuổi trở lên chiếm khoảng 29% tổng dân số." },
      { jp:"この問題を解決するため、政府はさまざまな政策を実施しています。", furi:"このもんだいをかいけつするため、せいふはさまざまなせいさくをじっしています。", vn:"Để giải quyết vấn đề này, chính phủ đang thực hiện nhiều chính sách khác nhau." },
      { jp:"また、介護ロボットやAI技術の活用も注目されています。", furi:"また、かいごろぼっとやえーあいぎじゅつのかつようもちゅうもくされています。", vn:"Ngoài ra, việc ứng dụng robot chăm sóc và công nghệ AI cũng đang được chú ý." },
    ],
    words:[{w:"高齢化",r:"こうれいか",vn:"già hóa"},{w:"人口",r:"じんこう",vn:"dân số"},{w:"政策",r:"せいさく",vn:"chính sách"},{w:"介護",r:"かいご",vn:"chăm sóc người cao tuổi"},{w:"技術",r:"ぎじゅつ",vn:"công nghệ"}],
    quiz:[
      {q:"日本の65歳以上の人口は何%ですか？",opts:["約15%","約19%","約29%","約39%"],ans:2},
      {q:"注目されている新技術は何ですか？",opts:["農業ロボット","介護ロボット","工場ロボット","掃除ロボット"],ans:1},
    ],
    grammarNote:{pattern:"〜を占めている",meaning:"Chiếm ~",example:"29%を占めています。"}
  },
  {
    id:"n6", level:"N3", category:"科学", categoryVn:"Khoa học", emoji:"🚄",
    title:"新幹線の技術",
    titleVn:"Công Nghệ Tàu Shinkansen",
    body:[
      { jp:"新幹線は1964年の東京オリンピックに合わせて開業しました。", furi:"しんかんせんはせんきゅうひゃくろくじゅうよねんのとうきょうおりんぴっくにあわせてかいぎょうしました。", vn:"Shinkansen được khai trương trùng với Thế vận hội Tokyo năm 1964." },
      { jp:"現在、最速の新幹線は時速320キロメートルで走ります。", furi:"げんざい、さいそくのしんかんせんはじそくさんびゃくにじゅうきろめーとるではしります。", vn:"Hiện nay, tàu Shinkansen nhanh nhất chạy với tốc độ 320 km/h." },
      { jp:"50年以上の歴史の中で、乗客が死亡する事故はゼロです。", furi:"ごじゅうねんいじょうのれきしのなかで、じょうきゃくがしぼうするじこはぜろです。", vn:"Trong hơn 50 năm lịch sử, số tai nạn gây tử vong cho hành khách là bằng không." },
      { jp:"この安全性の高さは世界中から注目されています。", furi:"このあんぜんせいのたかさはせかいじゅうからちゅうもくされています。", vn:"Mức độ an toàn cao này được cả thế giới chú ý." },
    ],
    words:[{w:"新幹線",r:"しんかんせん",vn:"tàu cao tốc"},{w:"開業",r:"かいぎょう",vn:"khai trương"},{w:"時速",r:"じそく",vn:"tốc độ theo giờ"},{w:"安全性",r:"あんぜんせい",vn:"tính an toàn"},{w:"歴史",r:"れきし",vn:"lịch sử"}],
    quiz:[
      {q:"新幹線が開業したのはいつですか？",opts:["1954年","1964年","1974年","1984年"],ans:1},
      {q:"最速の新幹線の速度は？",opts:["200km/h","260km/h","300km/h","320km/h"],ans:3},
    ],
    grammarNote:{pattern:"〜に合わせて",meaning:"Kết hợp với ~, nhân dịp ~",example:"オリンピックに合わせて開業しました。"}
  },
];

// ════════════════════════════════════════════════════════════════
// DATA: JAPANESE CULTURE
// ════════════════════════════════════════════════════════════════
const CULTURE_LESSONS = [
  {
    id:"c1", category:"挨拶", categoryVn:"Chào hỏi", emoji:"🙇",
    title:"お辞儀 (Ojigi)",
    titleVn:"Nghệ Thuật Cúi Chào",
    intro:"お辞儀は日本の伝統的な挨拶です。角度によって意味が変わります。",
    introVn:"Ojigi là cách chào truyền thống của Nhật Bản. Ý nghĩa thay đổi tùy theo góc cúi.",
    sections:[
      { title:"15度 — 軽い挨拶", titleVn:"15 độ — Chào nhẹ", icon:"🙂",
        body:"友達や同僚への軽い挨拶。「こんにちは」などの日常的な場面で使います。",
        bodyVn:"Chào nhẹ với bạn bè hoặc đồng nghiệp. Dùng trong các tình huống hàng ngày như 'xin chào'.",
        example:"廊下ですれ違うとき" },
      { title:"30度 — 一般的なお辞儀", titleVn:"30 độ — Cúi chào thông thường", icon:"🙇",
        body:"目上の人への挨拶、お礼、謝罪など。ビジネスでよく使われます。",
        bodyVn:"Chào người trên, cảm ơn, xin lỗi. Hay dùng trong môi trường công sở.",
        example:"上司に会ったとき、お客様を迎えるとき" },
      { title:"45度 — 深いお辞儀", titleVn:"45 độ — Cúi chào sâu", icon:"🙇‍♂️",
        body:"深い感謝や謝罪を表します。重要なお客様や深刻な謝罪の場面で使います。",
        bodyVn:"Thể hiện sự cảm ơn hoặc xin lỗi sâu sắc. Dùng với khách VIP hoặc khi xin lỗi nghiêm túc.",
        example:"大切なお客様、深刻なお詫び" },
    ],
    vocab:[{jp:"お辞儀",r:"おじぎ",vn:"cúi chào"},{jp:"角度",r:"かくど",vn:"góc độ"},{jp:"目上",r:"めうえ",vn:"người trên"},{jp:"謝罪",r:"しゃざい",vn:"xin lỗi"}],
    quiz:[
      {q:"ビジネスでよく使うお辞儀は何度ですか？",opts:["15度","30度","45度","90度"],ans:1},
      {q:"深い感謝や謝罪には何度のお辞儀を使いますか？",opts:["15度","20度","30度","45度"],ans:3},
    ],
    phrases:[{jp:"よろしくお願いします。",r:"よろしくおねがいします。",vn:"Rất mong được giúp đỡ."},{jp:"ありがとうございます。",r:"ありがとうございます。",vn:"Xin cảm ơn rất nhiều."}]
  },
  {
    id:"c2", category:"食事", categoryVn:"Ăn uống", emoji:"🍜",
    title:"食事のマナー",
    titleVn:"Phép Tắc Ăn Uống Nhật Bản",
    intro:"日本の食事には独特のマナーがあります。知っておくと日本人に好印象を与えます。",
    introVn:"Bữa ăn Nhật Bản có những quy tắc riêng. Biết những điều này sẽ tạo ấn tượng tốt với người Nhật.",
    sections:[
      { title:"食事の前後", titleVn:"Trước và sau bữa ăn", icon:"🙏",
        body:"食事の前に「いただきます」、食事の後に「ごちそうさまでした」と言います。これは感謝を表す大切な言葉です。",
        bodyVn:"Trước khi ăn nói 'Itadakimasu', sau khi ăn nói 'Gochisousama deshita'. Đây là những từ quan trọng thể hiện lòng biết ơn.",
        example:"毎回の食事で使います" },
      { title:"お箸のマナー", titleVn:"Quy tắc dùng đũa", icon:"🥢",
        body:"お箸を立てて刺すのはNGです。また、お箸からお箸に食べ物を渡すのも禁止です。これは葬儀を連想させます。",
        bodyVn:"Không được cắm đũa thẳng đứng vào bát cơm. Không được chuyền thức ăn từ đũa sang đũa. Những hành động này liên tưởng đến đám tang.",
        example:"ご飯にお箸を立てない" },
      { title:"食べ物の音", titleVn:"Tiếng ăn uống", icon:"🍝",
        body:"ラーメンやそばを食べるとき、音を立てて食べても失礼ではありません。むしろ「おいしい」というサインです。",
        bodyVn:"Khi ăn mì ramen hoặc soba, húp thành tiếng không bị coi là thô lỗ. Ngược lại đó là dấu hiệu cho thấy đồ ăn ngon.",
        example:"麺類を食べるとき" },
    ],
    vocab:[{jp:"マナー",r:"まなー",vn:"phép tắc"},{jp:"いただきます",r:"いただきます",vn:"xin phép dùng bữa"},{jp:"ごちそうさま",r:"ごちそうさま",vn:"cảm ơn bữa ăn"},{jp:"お箸",r:"おはし",vn:"đũa"}],
    quiz:[
      {q:"食事の前に何と言いますか？",opts:["ごちそうさま","いただきます","おはよう","ありがとう"],ans:1},
      {q:"お箸でやってはいけないことは？",opts:["ご飯を食べる","魚を食べる","ご飯に立てる","汁を飲む"],ans:2},
    ],
    phrases:[{jp:"いただきます。",r:"いただきます。",vn:"Xin phép dùng bữa."},{jp:"ごちそうさまでした。",r:"ごちそうさまでした。",vn:"Cảm ơn bữa ăn ngon."}]
  },
  {
    id:"c3", category:"学校", categoryVn:"Học đường", emoji:"🏫",
    title:"日本の学校文化",
    titleVn:"Văn Hóa Học Đường Nhật Bản",
    intro:"日本の学校には独特の文化や習慣があります。留学前に知っておきましょう。",
    introVn:"Trường học Nhật Bản có những văn hóa và tập quán riêng. Hãy tìm hiểu trước khi du học.",
    sections:[
      { title:"掃除の時間", titleVn:"Giờ dọn dẹp", icon:"🧹",
        body:"日本の学校では、生徒自身が教室や廊下を掃除します。これは責任感や協力精神を育てるためです。",
        bodyVn:"Ở trường học Nhật Bản, chính học sinh tự dọn dẹp lớp học và hành lang. Điều này nhằm rèn tinh thần trách nhiệm và hợp tác.",
        example:"放課後の掃除時間" },
      { title:"給食", titleVn:"Bữa ăn trưa tại trường", icon:"🍱",
        body:"小中学校では給食があります。当番の生徒が配膳し、みんなで同じものを食べます。栄養バランスが考えられています。",
        bodyVn:"Trường tiểu học và trung học cơ sở có bữa ăn trưa tại trường. Học sinh trực nhật phục vụ và mọi người ăn cùng một thực đơn. Chú trọng cân bằng dinh dưỡng.",
        example:"毎日の昼食時間" },
      { title:"部活動", titleVn:"Câu lạc bộ", icon:"⚽",
        body:"放課後、多くの生徒はクラブ活動に参加します。スポーツ、音楽、文化活動など様々な部活があります。",
        bodyVn:"Sau giờ học, nhiều học sinh tham gia câu lạc bộ. Có nhiều loại CLB như thể thao, âm nhạc, hoạt động văn hóa.",
        example:"野球部、吹奏楽部、茶道部など" },
    ],
    vocab:[{jp:"掃除",r:"そうじ",vn:"dọn dẹp"},{jp:"給食",r:"きゅうしょく",vn:"bữa ăn trường"},{jp:"部活",r:"ぶかつ",vn:"câu lạc bộ"},{jp:"当番",r:"とうばん",vn:"trực nhật"},{jp:"放課後",r:"ほうかご",vn:"sau giờ học"}],
    quiz:[
      {q:"日本の学校で生徒は何をしますか？",opts:["掃除しない","先生が掃除","生徒が掃除","業者が掃除"],ans:2},
      {q:"給食で何が大切ですか？",opts:["量","味","栄養バランス","値段"],ans:2},
    ],
    phrases:[{jp:"よろしくお願いします。",r:"よろしくおねがいします。",vn:"Rất mong được chỉ bảo."},{jp:"お先に失礼します。",r:"おさきにしつれいします。",vn:"Tôi xin phép về trước."}]
  },
  {
    id:"c4", category:"仕事", categoryVn:"Công sở", emoji:"💼",
    title:"日本のビジネス文化",
    titleVn:"Văn Hóa Công Sở Nhật Bản",
    intro:"日本のビジネス文化は独特です。名刺交換から敬語まで、知っておきたいマナーを学びましょう。",
    introVn:"Văn hóa công sở Nhật Bản rất độc đáo. Hãy học những phép tắc cần biết từ trao đổi danh thiếp đến kính ngữ.",
    sections:[
      { title:"名刺交換", titleVn:"Trao đổi danh thiếp", icon:"📇",
        body:"名刺は両手で渡し、相手の名刺も両手で受け取ります。受け取った名刺はすぐにしまわず、会議中は机の上に置きます。",
        bodyVn:"Danh thiếp được đưa bằng hai tay và nhận cũng bằng hai tay. Danh thiếp nhận được không được cất ngay, trong họp đặt lên bàn.",
        example:"初対面のビジネスシーン" },
      { title:"報告・連絡・相談", titleVn:"Báo cáo - Liên lạc - Tham vấn", icon:"📊",
        body:"日本の職場では「ほうれんそう（報告・連絡・相談）」が重要とされています。仕事の進捗を上司に定期的に報告することが大切です。",
        bodyVn:"Trong môi trường làm việc Nhật Bản, 'Hourenso (Báo cáo - Liên lạc - Tham vấn)' rất quan trọng. Cần thường xuyên báo cáo tiến độ công việc lên cấp trên.",
        example:"毎朝の朝礼、定期報告" },
    ],
    vocab:[{jp:"名刺",r:"めいし",vn:"danh thiếp"},{jp:"報告",r:"ほうこく",vn:"báo cáo"},{jp:"連絡",r:"れんらく",vn:"liên lạc"},{jp:"相談",r:"そうだん",vn:"tham vấn"},{jp:"上司",r:"じょうし",vn:"cấp trên"}],
    quiz:[
      {q:"名刺はどうやって渡しますか？",opts:["片手","両手","机の上","ポケットから"],ans:1},
      {q:"ほうれんそうとは何ですか？",opts:["野菜","報告・連絡・相談","朝のルーティン","会議の方法"],ans:1},
    ],
    phrases:[{jp:"お世話になっております。",r:"おせわになっております。",vn:"Cảm ơn sự quan tâm của bạn."},{jp:"ご確認をお願いします。",r:"ごかくにんをおねがいします。",vn:"Xin vui lòng xác nhận."}]
  },
];

// ════════════════════════════════════════════════════════════════
// DATA: MINI LESSONS
// ════════════════════════════════════════════════════════════════
const MINI_LESSONS = [
  { id:"m1",  type:"kanji",   kanji:"努力",  kana:"どりょく",  vn:"Nỗ lực",       ex:"努力すれば成功できます。", exVn:"Nếu cố gắng thì có thể thành công.", radical:"力=sức mạnh", jlpt:"N3" },
  { id:"m2",  type:"vocab",   jp:"素晴らしい", kana:"すばらしい", vn:"Tuyệt vời",   ex:"今日の発表は素晴らしかった。", exVn:"Bài thuyết trình hôm nay thật tuyệt vời.", jlpt:"N3" },
  { id:"m3",  type:"grammar", pattern:"〜ことにする", vn:"Quyết định sẽ ~", ex:"毎朝走ることにしました。", exVn:"Tôi đã quyết định sẽ chạy bộ mỗi buổi sáng.", hint:"Thể hiện quyết định của bản thân", jlpt:"N4" },
  { id:"m4",  type:"kanji",   kanji:"挑戦",  kana:"ちょうせん",  vn:"Thử thách, thách thức", ex:"新しいことに挑戦してみよう。", exVn:"Hãy thử thách với điều mới mẻ.", radical:"戈=vũ khí → chiến đấu", jlpt:"N3" },
  { id:"m5",  type:"vocab",   jp:"懐かしい", kana:"なつかしい",  vn:"Bồi hồi nhớ lại", ex:"この曲を聞くと懐かしい気持ちになる。", exVn:"Nghe bài nhạc này lại thấy bồi hồi.", jlpt:"N3" },
  { id:"m6",  type:"grammar", pattern:"〜ようになる", vn:"Trở nên ~ (thay đổi dần)", ex:"日本語が話せるようになりました。", exVn:"Tôi đã có thể nói tiếng Nhật được rồi.", hint:"Thể hiện sự thay đổi trạng thái theo thời gian", jlpt:"N4" },
  { id:"m7",  type:"kanji",   kanji:"感謝",  kana:"かんしゃ",   vn:"Biết ơn, cảm ơn", ex:"いつも感謝しています。", exVn:"Tôi luôn biết ơn bạn.", radical:"心=trái tim → cảm xúc", jlpt:"N3" },
  { id:"m8",  type:"vocab",   jp:"丁寧",    kana:"ていねい",   vn:"Cẩn thận, lịch sự", ex:"丁寧な言葉を使いましょう。", exVn:"Hãy dùng từ ngữ lịch sự.", jlpt:"N3" },
  { id:"m9",  type:"grammar", pattern:"〜わけではない", vn:"Không phải là ~ (phủ định một phần)", ex:"嫌いなわけではない。", exVn:"Không phải là tôi ghét đâu.", hint:"Phủ định một suy nghĩ có thể có của người nghe", jlpt:"N2" },
  { id:"m10", type:"kanji",   kanji:"自信",  kana:"じしん",    vn:"Tự tin",          ex:"自信を持って話してください。", exVn:"Hãy nói một cách tự tin.", radical:"自=bản thân, 信=tin tưởng", jlpt:"N3" },
  { id:"m11", type:"vocab",   jp:"思いやり", kana:"おもいやり", vn:"Sự quan tâm, thấu hiểu", ex:"思いやりのある人が好きです。", exVn:"Tôi thích người có tấm lòng quan tâm.", jlpt:"N2" },
  { id:"m12", type:"grammar", pattern:"〜にもかかわらず", vn:"Mặc dù ~, bất chấp ~", ex:"雨にもかかわらず試合が行われた。", exVn:"Mặc dù trời mưa nhưng trận đấu vẫn diễn ra.", hint:"Dùng trong văn viết trang trọng", jlpt:"N2" },
  { id:"m13", type:"kanji",   kanji:"可能",  kana:"かのう",    vn:"Có thể, khả năng", ex:"それは可能ですか？", exVn:"Điều đó có thể không?", radical:"可=chấp thuận", jlpt:"N3" },
  { id:"m14", type:"vocab",   jp:"お疲れ様", kana:"おつかれさま", vn:"Cảm ơn vì đã vất vả", ex:"お疲れ様でした。今日もよく頑張りました。", exVn:"Cảm ơn vì đã vất vả. Hôm nay cũng cố gắng tốt lắm.", jlpt:"N4" },
  { id:"m15", type:"grammar", pattern:"〜てしまう", vn:"Lỡ ~, đã ~ mất (xong xuôi, hối tiếc)", ex:"財布を忘れてしまいました。", exVn:"Tôi đã lỡ quên ví mất rồi.", hint:"Thể hiện hành động hoàn thành, thường có sắc thái tiếc nuối", jlpt:"N4" },
];

// ════════════════════════════════════════════════════════════════
// NEWS PAGE
// ════════════════════════════════════════════════════════════════
function NewsPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [selId, setSelId]       = useState(null);
  const [phase, setPhase]       = useState("read"); // "read"|"vocab"|"quiz"
  const [showFuri, setShowFuri] = useState(false);
  const [showVn, setShowVn]     = useState(true);
  const [popup, setPopup]       = useState(null); // {word, x, y}
  const [quizAns, setQuizAns]   = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [vocabFlipped, setVocabFlipped] = useState({});
  const [playing, setPlaying]   = useState(false);
  const [levelFilter, setLevelFilter] = useState("all");
  const [savedWords, setSavedWords]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_saved_news_words")||"[]"); } catch { return []; }
  });

  const articles = levelFilter==="all" ? NEWS_ARTICLES : NEWS_ARTICLES.filter(a=>a.level===levelFilter);
  const article  = NEWS_ARTICLES.find(a=>a.id===selId);

  const playArticle = () => {
    if (!window.speechSynthesis||playing||!article) return;
    window.speechSynthesis.cancel();
    const txt = article.body.map(s=>s.jp).join("。");
    const u = new SpeechSynthesisUtterance(txt);
    u.lang="ja-JP"; u.rate=0.78;
    u.onstart=()=>setPlaying(true);
    u.onend=()=>setPlaying(false);
    window.speechSynthesis.speak(u);
  };
  const playSentence = (jp) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(jp);
    u.lang="ja-JP"; u.rate=0.78;
    window.speechSynthesis.speak(u);
  };

  const saveWord = (w) => {
    const updated = savedWords.includes(w) ? savedWords.filter(x=>x!==w) : [...savedWords, w];
    setSavedWords(updated);
    localStorage.setItem("sp_saved_news_words", JSON.stringify(updated));
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const CCOLORS = {生活:"#2563EB",食文化:"#D97706",科学:"#059669",文化:"#7C3AED",社会:"#DC2626"};

  // Article list view
  if (!article) return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#0C4A6E,#0369A1,#0EA5E9)", borderRadius:24, padding:isMob?"20px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>📰</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>NEWS · TIN TỨC</div>
        <div style={{ fontSize:isMob?22:28, fontWeight:900, marginBottom:6 }}>{"📰 Học Qua Tin Tức"}</div>
        <div style={{ fontSize:13, opacity:0.85 }}>Tin tức tiếng Nhật · Furigana · Bấm từ xem nghĩa · Quiz đọc hiểu</div>
      </div>

      {/* Level filter */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["all","N5","N4","N3"].map(lv=>(
          <button key={lv} onClick={()=>setLevelFilter(lv)}
            style={{ padding:"8px 18px", borderRadius:20,
              border:`2px solid ${levelFilter===lv?(lv==="all"?"#0EA5E9":LEVEL_COLOR[lv]):"transparent"}`,
              background:levelFilter===lv?(lv==="all"?"rgba(14,165,233,0.15)":LEVEL_COLOR[lv]+"18"):(dark?"rgba(30,41,59,0.6)":"rgba(241,245,249,0.9)"),
              color:levelFilter===lv?(lv==="all"?"#0EA5E9":LEVEL_COLOR[lv]):CC.muted,
              fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {lv==="all"?"Tất cả":lv}
          </button>
        ))}
      </div>

      {/* Article grid */}
      <div style={{ display:"grid", gridTemplateColumns:isMob?"1fr":w<900?"repeat(2,1fr)":"repeat(3,1fr)", gap:16 }}>
        {articles.map(a => {
          const cc = CCOLORS[a.category]||"#0EA5E9";
          return (
            <div key={a.id} onClick={()=>{setSelId(a.id);setPhase("read");setQuizAns({});setQuizDone({});setVocabFlipped({});}}
              style={{ background:bgCard, borderRadius:20, padding:"20px", cursor:"pointer",
                border:`1px solid ${dark?"rgba(14,165,233,0.15)":"rgba(14,165,233,0.12)"}`,
                boxShadow:dark?"0 4px 16px rgba(0,0,0,0.25)":"0 4px 16px rgba(14,165,233,0.07)",
                transition:"transform 0.18s, box-shadow 0.18s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=dark?"0 8px 28px rgba(0,0,0,0.4)":"0 8px 28px rgba(14,165,233,0.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <span style={{ fontSize:28 }}>{a.emoji}</span>
                <div style={{ display:"flex", gap:6 }}>
                  <span style={{ fontSize:10, background:cc+"18", color:cc, padding:"3px 9px", borderRadius:20, fontWeight:800 }}>{a.categoryVn}</span>
                  <span style={{ fontSize:10, background:LEVEL_COLOR[a.level]+"18", color:LEVEL_COLOR[a.level], padding:"3px 9px", borderRadius:20, fontWeight:800 }}>{a.level}</span>
                </div>
              </div>
              <div style={{ fontSize:16, fontWeight:900, color:dark?"#E2E8F0":CC.text, fontFamily:"'Noto Sans JP',sans-serif", marginBottom:4 }}>{a.title}</div>
              <div style={{ fontSize:12, color:CC.muted, marginBottom:10 }}>{a.titleVn}</div>
              <div style={{ fontSize:12, color:CC.muted, lineHeight:1.6 }}>
                {a.body[0].vn.slice(0,60)}...
              </div>
              <div style={{ marginTop:12, display:"flex", gap:6 }}>
                <span style={{ fontSize:10, background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", color:CC.muted, padding:"3px 9px", borderRadius:20 }}>📖 {a.body.length} câu</span>
                <span style={{ fontSize:10, background:dark?"rgba(30,41,59,0.8)":"rgba(241,245,249,0.9)", color:CC.muted, padding:"3px 9px", borderRadius:20 }}>📝 {a.quiz.length} quiz</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Article detail view
  const cc = CCOLORS[article.category]||"#0EA5E9";
  const quizScore = article.quiz.filter((q,i)=>quizAns[i]===q.ans).length;

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}
      onClick={()=>popup&&setPopup(null)}>
      {/* Back + phase tabs */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <button onClick={()=>setSelId(null)}
          style={{ background:"none",border:"none",color:cc,cursor:"pointer",fontSize:13,fontWeight:700,padding:0,display:"flex",alignItems:"center",gap:4 }}>
          {"← Tin tức"}
        </button>
        <div style={{ flex:1 }}/>
        {[{id:"read",l:"📖 Đọc"},{id:"vocab",l:"📚 Từ vựng"},{id:"quiz",l:"📝 Quiz"}].map(tb=>(
          <button key={tb.id} onClick={()=>setPhase(tb.id)}
            style={{ padding:"7px 16px", borderRadius:20, border:"none",
              background:phase===t.id?cc:"transparent",
              color:phase===t.id?"white":CC.muted,
              fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif",
              boxShadow:phase===t.id?`0 3px 12px ${cc}44`:"none" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Article header */}
      <div style={{ background:`linear-gradient(135deg,${cc}cc,${cc}99)`, borderRadius:20, padding:isMob?"18px":"22px 28px", color:"white", marginBottom:20 }}>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <span style={{ fontSize:10, background:"rgba(255,255,255,0.22)", padding:"3px 10px", borderRadius:20, fontWeight:800 }}>{article.categoryVn}</span>
          <span style={{ fontSize:10, background:"rgba(255,255,255,0.22)", padding:"3px 10px", borderRadius:20, fontWeight:800 }}>{article.level}</span>
        </div>
        <div style={{ fontSize:isMob?18:22, fontWeight:900, fontFamily:"'Noto Sans JP',sans-serif", marginBottom:4 }}>{article.title}</div>
        <div style={{ fontSize:13, opacity:0.9 }}>{article.titleVn}</div>
      </div>

      {/* READ PHASE */}
      {phase==="read" && (
        <div>
          {/* Controls */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            <button onClick={()=>setShowFuri(v=>!v)}
              style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${showFuri?cc:"rgba(148,163,184,0.3)"}`,
                background:showFuri?cc+"14":"transparent", color:showFuri?cc:CC.muted,
                fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              {`あ ${showFuri?"Ẩn":"Hiện"} furigana`}
            </button>
            <button onClick={()=>setShowVn(v=>!v)}
              style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${showVn?cc:"rgba(148,163,184,0.3)"}`,
                background:showVn?cc+"14":"transparent", color:showVn?cc:CC.muted,
                fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              {`🇻🇳 ${showVn?"Ẩn":"Hiện"} dịch`}
            </button>
            <button onClick={playArticle} disabled={playing}
              style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${cc}55`,
                background:playing?cc+"20":"transparent", color:cc,
                fontSize:12, fontWeight:700, cursor:playing?"default":"pointer", fontFamily:"'Nunito',sans-serif",
                marginLeft:"auto" }}>
              {playing?"🔊 Đang đọc...":"▶ Phát toàn bộ"}
            </button>
          </div>

          {/* Article body */}
          <div style={{ background:bgCard, borderRadius:20, padding:isMob?"18px":"26px", marginBottom:16,
            border:`1px solid ${dark?cc+"22":cc+"14"}`, position:"relative" }}>
            {article.body.map((s,si)=>(
              <div key={si} style={{ marginBottom:22, paddingBottom:22, borderBottom:si<article.body.length-1?`1px solid ${dark?"rgba(148,163,184,0.1)":"rgba(148,163,184,0.12)"}`:""  }}>
                {/* Furigana row */}
                {showFuri && (
                  <div style={{ fontSize:11, color:CC.muted, fontFamily:"'Noto Sans JP',sans-serif", marginBottom:3, lineHeight:1.8 }}>
                    {s.furi}
                  </div>
                )}
                {/* Japanese text + per-word popup */}
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <div style={{ fontSize:isMob?17:19, fontFamily:"'Noto Sans JP',sans-serif", color:dark?"#E2E8F0":CC.text, lineHeight:1.9, flex:1 }}>
                    {s.words ? s.words.reduce((acc, wObj, wi) => {
                      // Split text around known words and highlight them
                      const parts = [];
                      let remaining = s.jp;
                      s.words.forEach((wo,wii) => {
                        const idx = remaining.indexOf(wo.w);
                        if (idx>=0) {
                          if (idx>0) parts.push({type:"text",t:remaining.slice(0,idx)});
                          parts.push({type:"word",t:wo.w,wobj:wo});
                          remaining = remaining.slice(idx+wo.w.length);
                        }
                      });
                      if (remaining) parts.push({type:"text",t:remaining});
                      return parts;
                    }, []).map((p,pi)=>
                      p.type==="word" ? (
                        <span key={pi}
                          onClick={e=>{e.stopPropagation();setPopup(p=>p?.t===p.t?null:{t:p.t,wobj:p.wobj,si});}}
                          style={{ cursor:"pointer", borderBottom:`2px solid ${cc}88`, color:cc, fontWeight:700, position:"relative",
                            background: popup?.t===p.t&&popup?.si===si?cc+"18":"transparent",
                            borderRadius:4, padding:"0 2px" }}>
                          {p.t}
                        </span>
                      ) : (
                        <span key={pi}>{p.t}</span>
                      )
                    ) : s.jp}
                  </div>
                  {/* Per-sentence audio */}
                  <button onClick={e=>{e.stopPropagation();playSentence(s.jp);}}
                    style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", border:`1px solid ${cc}44`,
                      background:"transparent", color:cc, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    ▶
                  </button>
                </div>
                {showVn && <div style={{ fontSize:12, color:CC.muted, marginTop:4 }}>{s.vn}</div>}
              </div>
            ))}

            {/* Word popup */}
            {popup && (
              <div onClick={e=>e.stopPropagation()}
                style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)",
                  background:dark?"rgba(15,23,42,0.97)":"white",
                  border:`2px solid ${cc}`,
                  borderRadius:16, padding:"14px 20px", zIndex:999, minWidth:200, maxWidth:300,
                  boxShadow:`0 8px 32px ${cc}44` }}>
                <div style={{ fontSize:24, fontWeight:900, color:cc, fontFamily:"'Noto Sans JP',sans-serif", marginBottom:4 }}>{popup.wobj?.w||popup.t}</div>
                {popup.wobj?.r && <div style={{ fontSize:13, color:CC.muted, marginBottom:4 }}>{popup.wobj.r}</div>}
                {popup.wobj?.vn && <div style={{ fontSize:14, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginBottom:10 }}>{popup.wobj.vn}</div>}
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>{saveWord(popup.wobj?.w||popup.t);}}
                    style={{ flex:1, padding:"7px", borderRadius:10, border:`1px solid ${cc}44`,
                      background:savedWords.includes(popup.wobj?.w||popup.t)?cc:"transparent",
                      color:savedWords.includes(popup.wobj?.w||popup.t)?"white":cc,
                      fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                    {savedWords.includes(popup.wobj?.w||popup.t)?"✓ Đã lưu":"+ Lưu từ"}
                  </button>
                  <button onClick={()=>setPopup(null)}
                    style={{ width:34, height:34, borderRadius:10, border:`1px solid rgba(148,163,184,0.3)`,
                      background:"transparent", color:CC.muted, cursor:"pointer", fontSize:16 }}>×</button>
                </div>
              </div>
            )}
          </div>

          {/* Grammar note */}
          {article.grammarNote && (
            <div style={{ background:dark?"rgba(124,58,237,0.1)":"rgba(245,243,255,0.9)", border:"1.5px solid rgba(124,58,237,0.25)", borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#7C3AED", marginBottom:6 }}>📝 ĐIỂM NGỮ PHÁP</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#7C3AED", fontFamily:"'Noto Sans JP',sans-serif", marginBottom:4 }}>{article.grammarNote.pattern}</div>
              <div style={{ fontSize:13, color:dark?"#DDD6FE":"#4C1D95", marginBottom:6 }}>{article.grammarNote.meaning}</div>
              <div style={{ fontSize:13, color:CC.muted, fontFamily:"'Noto Sans JP',sans-serif", fontStyle:"italic" }}>例：{article.grammarNote.example}</div>
            </div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setPhase("vocab")}
              style={{ flex:1, padding:"12px", borderRadius:14, border:`1.5px solid ${cc}44`,
                background:"transparent", color:cc, fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              📚 Luyện từ vựng →
            </button>
            <button onClick={()=>setPhase("quiz")}
              style={{ flex:1, padding:"12px", borderRadius:14, border:"none",
                background:`linear-gradient(135deg,${cc},${cc}cc)`, color:"white",
                fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif",
                boxShadow:`0 4px 16px ${cc}44` }}>
              📝 Làm quiz →
            </button>
          </div>
        </div>
      )}

      {/* VOCAB PHASE */}
      {phase==="vocab" && (
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:CC.muted, marginBottom:14 }}>
            BẤM CARD ĐỂ LẬT — Kiểm tra từ vựng bài đọc
          </div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?1:2},1fr)`, gap:12, marginBottom:20 }}>
            {article.words.map((v,i)=>{
              const fl = vocabFlipped[i];
              return (
                <div key={i} onClick={()=>setVocabFlipped(s=>({...s,[i]:!s[i]}))}
                  style={{ background:fl?(dark?`rgba(14,165,233,0.15)`:"rgba(240,249,255,0.95)"):bgCard,
                    borderRadius:16, padding:"20px", cursor:"pointer", textAlign:"center", minHeight:90,
                    border:`2px solid ${fl?cc:dark?"rgba(148,163,184,0.15)":"rgba(148,163,184,0.2)"}`,
                    transition:"all 0.25s", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    boxShadow:fl?`0 4px 16px ${cc}22`:"none" }}>
                  {!fl ? (
                    <div style={{ fontSize:26, fontWeight:900, fontFamily:"'Noto Sans JP',sans-serif", color:cc }}>{v.jp}</div>
                  ) : (
                    <>
                      <div style={{ fontSize:13, color:CC.muted, marginBottom:3 }}>{v.r}</div>
                      <div style={{ fontSize:16, fontWeight:800, color:dark?"#E2E8F0":CC.text }}>{v.vn}</div>
                      <button onClick={e=>{e.stopPropagation();saveWord(v.jp);}}
                        style={{ marginTop:8, padding:"4px 14px", borderRadius:20, border:`1px solid ${cc}44`,
                          background:savedWords.includes(v.jp)?cc:"transparent",
                          color:savedWords.includes(v.jp)?"white":cc, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
                        {savedWords.includes(v.jp)?"✓ Đã lưu":"+ Lưu Flashcard"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={()=>setPhase("quiz")}
            style={{ width:"100%", padding:"13px", borderRadius:14, border:"none",
              background:`linear-gradient(135deg,${cc},${cc}bb)`, color:"white",
              fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif",
              boxShadow:`0 4px 20px ${cc}44` }}>
            📝 Làm quiz hiểu bài →
          </button>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase==="quiz" && (
        <div>
          {article.quiz.map((q,i)=>(
            <div key={i} style={{ background:bgCard, borderRadius:16, padding:"18px", marginBottom:12,
              border:`1px solid ${dark?cc+"22":cc+"14"}` }}>
              <div style={{ fontSize:14, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginBottom:12,
                fontFamily:"'Noto Sans JP',sans-serif" }}>Q{i+1}. {q.q}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {q.opts.map((opt,j)=>{
                  const chosen=quizAns[i]===j, correct=j===q.ans, show=quizDone[i]!=null;
                  return (
                    <button key={j} onClick={()=>{ if(!quizDone[i]) { setQuizAns(a=>({...a,[i]:j})); setQuizDone(d=>({...d,[i]:true})); } }}
                      style={{ padding:"10px 14px", borderRadius:10, textAlign:"left", cursor:quizDone[i]?"default":"pointer",
                        fontFamily:"'Noto Sans JP',sans-serif", fontSize:13, fontWeight:chosen?700:400,
                        border:`1.5px solid ${show&&correct?"#10B981":show&&chosen&&!correct?"#EF4444":chosen?cc+"66":dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.15)"}`,
                        background:show&&correct?"rgba(16,185,129,0.1)":show&&chosen&&!correct?"rgba(239,68,68,0.08)":chosen?cc+"0f":"transparent",
                        color:dark?"#E2E8F0":CC.text }}>
                      {show&&correct?"✅ ":show&&chosen&&!correct?"❌ ":""}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(quizDone).length>=article.quiz.length && (
            <div style={{ background:bgCard, borderRadius:16, padding:"16px", textAlign:"center",
              border:`2px solid ${quizScore===article.quiz.length?"rgba(16,185,129,0.4)":"rgba(245,158,11,0.4)"}`,
              marginBottom:12 }}>
              <div style={{ fontSize:24 }}>{quizScore===article.quiz.length?"🎉":"👍"}</div>
              <div style={{ fontSize:18, fontWeight:900, color:quizScore===article.quiz.length?"#10B981":"#F59E0B" }}>
                {quizScore}/{article.quiz.length} câu đúng
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{setPhase("read");setQuizAns({});setQuizDone({});}}
              style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid ${cc}44`, background:"transparent", color:cc, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              ← Đọc lại
            </button>
            <button onClick={()=>setSelId(null)}
              style={{ flex:1, padding:"11px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${cc},${cc}bb)`, color:"white", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              {"Bài tiếp →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// CULTURE PAGE
// ════════════════════════════════════════════════════════════════
function CulturePage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;
  const [selId, setSelId]   = useState(null);
  const [phase, setPhase]   = useState("learn"); // "learn"|"quiz"
  const [quizAns, setQuizAns] = useState({});
  const [quizDone, setQuizDone] = useState({});
  const [playing, setPlaying]  = useState(null);

  const lesson = CULTURE_LESSONS.find(c=>c.id===selId);
  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";

  const playPhrase = (jp) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(jp);
    u.lang="ja-JP"; u.rate=0.78;
    u.onstart=()=>setPlaying(jp);
    u.onend=()=>setPlaying(null);
    window.speechSynthesis.speak(u);
  };

  const CAT_COLORS = {挨拶:"#DC2626",食事:"#D97706",学校:"#2563EB",仕事:"#7C3AED"};

  if (!lesson) return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#1C1917,#78350F,#B45309)", borderRadius:24, padding:isMob?"20px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>🏯</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>CULTURE · VĂN HÓA</div>
        <div style={{ fontSize:isMob?22:28, fontWeight:900, marginBottom:6 }}>{"🏯 Văn Hóa Nhật Bản"}</div>
        <div style={{ fontSize:13, opacity:0.85 }}>Chào hỏi · Ăn uống · Học đường · Công sở · Quiz sau bài học</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMob?"1fr":"repeat(2,1fr)", gap:16 }}>
        {CULTURE_LESSONS.map(cl=>{
          const cc = CAT_COLORS[cl.category]||"#B45309";
          return (
            <div key={cl.id} onClick={()=>{setSelId(cl.id);setPhase("learn");setQuizAns({});setQuizDone({});}}
              style={{ background:bgCard, borderRadius:20, padding:"22px", cursor:"pointer",
                border:`1px solid ${dark?cc+"22":cc+"14"}`,
                boxShadow:dark?"0 4px 16px rgba(0,0,0,0.25)":"0 4px 16px rgba(0,0,0,0.06)",
                transition:"transform 0.18s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}>
              <div style={{ fontSize:36, marginBottom:10 }}>{cl.emoji}</div>
              <div style={{ fontSize:11, background:cc+"18", color:cc, padding:"3px 10px", borderRadius:20, fontWeight:800, display:"inline-block", marginBottom:8 }}>{cl.categoryVn}</div>
              <div style={{ fontSize:17, fontWeight:900, color:dark?"#E2E8F0":CC.text, fontFamily:"'Noto Sans JP',sans-serif", marginBottom:4 }}>{cl.title}</div>
              <div style={{ fontSize:13, color:CC.muted, marginBottom:10 }}>{cl.titleVn}</div>
              <div style={{ fontSize:12, color:CC.muted, lineHeight:1.6 }}>{cl.introVn}</div>
              <div style={{ marginTop:12, fontSize:11, color:cc }}>📖 {cl.sections.length} phần · 📝 {cl.quiz.length} câu quiz</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const cc = CAT_COLORS[lesson.category]||"#B45309";
  const quizScore = lesson.quiz.filter((q,i)=>quizAns[i]===q.ans).length;

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
        <button onClick={()=>setSelId(null)}
          style={{ background:"none",border:"none",color:cc,cursor:"pointer",fontSize:13,fontWeight:700,padding:0 }}>
          {"← Văn hóa"}
        </button>
        <div style={{ flex:1 }}/>
        {[{id:"learn",l:"📖 Học"},{id:"quiz",l:"📝 Quiz"}].map(tb=>(
          <button key={tb.id} onClick={()=>setPhase(tb.id)}
            style={{ padding:"7px 16px", borderRadius:20, border:"none",
              background:phase===t.id?cc:"transparent",
              color:phase===t.id?"white":CC.muted,
              fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${cc}dd,${cc}99)`, borderRadius:20, padding:isMob?"18px":"24px 28px", color:"white", marginBottom:20 }}>
        <div style={{ fontSize:36, marginBottom:8 }}>{lesson.emoji}</div>
        <div style={{ fontSize:isMob?18:22, fontWeight:900, marginBottom:4 }}>{lesson.title}</div>
        <div style={{ fontSize:13, opacity:0.9, marginBottom:8 }}>{lesson.titleVn}</div>
        <div style={{ fontSize:12, opacity:0.85, lineHeight:1.6 }}>{lesson.introVn}</div>
      </div>

      {phase==="learn" && (
        <div>
          {lesson.sections.map((sec,i)=>(
            <div key={i} style={{ background:bgCard, borderRadius:18, padding:"20px", marginBottom:14,
              border:`1px solid ${dark?cc+"22":cc+"12"}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:28 }}>{sec.icon}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:cc }}>{sec.title}</div>
                  <div style={{ fontSize:12, color:CC.muted }}>{sec.titleVn}</div>
                </div>
              </div>
              <div style={{ fontSize:13, color:dark?"#E2E8F0":CC.text, lineHeight:1.8, marginBottom:8 }}>{sec.body}</div>
              <div style={{ fontSize:13, color:CC.muted, lineHeight:1.7, marginBottom:8, fontStyle:"italic" }}>{sec.bodyVn}</div>
              <div style={{ fontSize:11, background:cc+"14", color:cc, padding:"4px 12px", borderRadius:20, display:"inline-block", fontWeight:700 }}>
                💡 {sec.example}
              </div>
            </div>
          ))}

          {/* Key phrases */}
          <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:16,
            border:`1px solid ${dark?cc+"22":cc+"12"}` }}>
            <div style={{ fontSize:12, fontWeight:800, color:cc, marginBottom:12 }}>🗣️ CÁC CÂU THƯỜNG DÙNG</div>
            {lesson.phrases.map((p,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:i<lesson.phrases.length-1?10:0,
                padding:"10px 12px", background:dark?"rgba(15,23,42,0.4)":"rgba(248,250,252,0.9)", borderRadius:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:cc, fontFamily:"'Noto Sans JP',sans-serif" }}>{p.jp}</div>
                  <div style={{ fontSize:11, color:CC.muted }}>{p.r}</div>
                  <div style={{ fontSize:12, color:dark?"#E2E8F0":CC.text }}>{p.vn}</div>
                </div>
                <button onClick={()=>playPhrase(p.jp)}
                  style={{ width:34, height:34, borderRadius:"50%", border:`1px solid ${cc}44`,
                    background:playing===p.jp?cc:"transparent", color:playing===p.jp?"white":cc,
                    cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ▶
                </button>
              </div>
            ))}
          </div>

          {/* Vocab */}
          <div style={{ background:bgCard, borderRadius:16, padding:"16px", marginBottom:16,
            border:`1px solid ${dark?cc+"22":cc+"12"}` }}>
            <div style={{ fontSize:12, fontWeight:800, color:cc, marginBottom:10 }}>📖 TỪ VỰNG</div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?2:3},1fr)`, gap:8 }}>
              {lesson.vocab.map((v,i)=>(
                <div key={i} style={{ background:dark?cc+"10":cc+"09", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:17, fontWeight:900, color:cc, fontFamily:"'Noto Sans JP',sans-serif" }}>{v.jp}</div>
                  <div style={{ fontSize:10, color:CC.muted }}>{v.r}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginTop:2 }}>{v.vn}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={()=>setPhase("quiz")}
            style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
              background:`linear-gradient(135deg,${cc},${cc}bb)`, color:"white",
              fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif",
              boxShadow:`0 4px 20px ${cc}44` }}>
            📝 Làm quiz →
          </button>
        </div>
      )}

      {phase==="quiz" && (
        <div>
          {lesson.quiz.map((q,i)=>(
            <div key={i} style={{ background:bgCard, borderRadius:16, padding:"18px", marginBottom:12,
              border:`1px solid ${dark?cc+"22":cc+"14"}` }}>
              <div style={{ fontSize:14, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginBottom:12,
                fontFamily:"'Noto Sans JP',sans-serif" }}>Q{i+1}. {q.q}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {q.opts.map((opt,j)=>{
                  const chosen=quizAns[i]===j, correct=j===q.ans, show=quizDone[i]!=null;
                  return (
                    <button key={j} onClick={()=>{ if(!quizDone[i]){setQuizAns(a=>({...a,[i]:j}));setQuizDone(d=>({...d,[i]:true}));}}}
                      style={{ padding:"10px 14px", borderRadius:10, textAlign:"left", cursor:quizDone[i]?"default":"pointer",
                        fontFamily:"'Noto Sans JP',sans-serif", fontSize:13, fontWeight:chosen?700:400,
                        border:`1.5px solid ${show&&correct?"#10B981":show&&chosen&&!correct?"#EF4444":chosen?cc+"66":dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.15)"}`,
                        background:show&&correct?"rgba(16,185,129,0.1)":show&&chosen&&!correct?"rgba(239,68,68,0.08)":chosen?cc+"0f":"transparent",
                        color:dark?"#E2E8F0":CC.text }}>
                      {show&&correct?"✅ ":show&&chosen&&!correct?"❌ ":""}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(quizDone).length>=lesson.quiz.length && (
            <div style={{ background:bgCard, borderRadius:16, padding:"16px", textAlign:"center", marginBottom:12,
              border:`2px solid ${quizScore===lesson.quiz.length?"rgba(16,185,129,0.4)":"rgba(245,158,11,0.4)"}` }}>
              <div style={{ fontSize:24 }}>{quizScore===lesson.quiz.length?"🎉":"👍"}</div>
              <div style={{ fontSize:18, fontWeight:900, color:quizScore===lesson.quiz.length?"#10B981":"#F59E0B" }}>
                {quizScore}/{lesson.quiz.length} câu đúng
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{setPhase("learn");setQuizAns({});setQuizDone({});}}
              style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid ${cc}44`, background:"transparent", color:cc, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              ← Xem lại
            </button>
            <button onClick={()=>setSelId(null)}
              style={{ flex:1, padding:"11px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${cc},${cc}bb)`, color:"white", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}>
              {"Bài tiếp →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// HEATMAP PAGE
// ════════════════════════════════════════════════════════════════
function HeatmapPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  // Read streak data (persisted by useStreak hook)
  const streakData = (() => {
    try { return JSON.parse(localStorage.getItem("sp_streak_v2") || "null"); } catch { return null; }
  })();
  const currentStreak = streakData?.streak || 0;
  const highestStreak = streakData?.highest || 0;
  const activeDays    = streakData?.activeDays || [];

  // Merge sp_heatmap + activeDays from streak (activeDays = days user learned anything)
  const heatData = (() => {
    try {
      const raw = JSON.parse(localStorage.getItem("sp_heatmap") || "{}");
      // Mark all activeDays with at least 1 if not already set
      activeDays.forEach(d => { if (!raw[d]) raw[d] = 1; });
      return raw;
    } catch { return {}; }
  })();

  const kanjiStats = (() => { try { return JSON.parse(localStorage.getItem("sp_kanji_stats")||"{}"); } catch { return {}; } })();
  const vocabCount = (() => { try { return Object.keys(JSON.parse(localStorage.getItem("sp_card_stats")||"{}")).length; } catch { return 0; } })();

  // Build 52-week grid
  const today = new Date();
  const weeks = [];
  const DAY_LABELS = ["Mon","","Wed","","Fri","","Sun"];
  const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Start from ~52 weeks ago, on a Monday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 363);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - (dayOfWeek===0?6:dayOfWeek-1));

  let cur = new Date(startDate);
  let currentWeek = [];
  const monthPositions = [];
  let weekIdx = 0;

  while (cur <= today) {
    const key = cur.toISOString().slice(0,10);
    const val = heatData[key] || 0;
    if (cur.getDate()<=7 && currentWeek.length===0) {
      monthPositions.push({weekIdx, month: cur.getMonth()});
    }
    currentWeek.push({date:key, val, day:cur.getDay()});
    if (currentWeek.length===7) { weeks.push(currentWeek); currentWeek=[]; weekIdx++; }
    cur.setDate(cur.getDate()+1);
  }
  if (currentWeek.length>0) weeks.push(currentWeek);

  const getColor = (val) => {
    if (val===0) return dark?"rgba(30,41,59,0.8)":"rgba(235,237,240,0.9)";
    if (val===1) return dark?"rgba(34,197,94,0.25)":"rgba(187,247,208,0.9)";
    if (val===2) return dark?"rgba(34,197,94,0.5)":"rgba(134,239,172,0.95)";
    if (val===3) return dark?"rgba(34,197,94,0.75)":"rgba(74,222,128,1)";
    return dark?"#16A34A":"#15803D";
  };

  const totalDays  = Object.values(heatData).filter(v=>v>0).length;
  const totalSess  = Object.values(heatData).reduce((a,b)=>a+b,0);
  const kanjiLearned = Object.keys(kanjiStats).length;

  const CELL = isMob ? 11 : 14;
  const GAP  = isMob ? 2  : 3;

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#052e16,#166534,#16a34a)", borderRadius:24, padding:isMob?"18px":"28px 36px", color:"white", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-10, fontSize:120, opacity:0.07 }}>📅</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>STUDY HEATMAP</div>
        <div style={{ fontSize:isMob?20:26, fontWeight:900, marginBottom:6 }}>{"📅 Bản Đồ Học Tập"}</div>
        <div style={{ fontSize:13, opacity:0.85, marginBottom:16 }}>Lịch sử học tập 52 tuần · Theo dõi streak · Thống kê tổng hợp</div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[{n:currentStreak,l:"Streak hiện tại",icon:"🔥"},{n:highestStreak,l:"Streak cao nhất",icon:"🏆"},{n:totalDays,l:"Ngày đã học",icon:"📅"},{n:kanjiLearned,l:"Kanji",icon:"🈶"}].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:900 }}>{s.icon} {s.n}</div>
              <div style={{ fontSize:10, opacity:0.8 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div style={{ background:dark?"rgba(30,41,59,0.95)":"#FFFFFF", borderRadius:20, padding:isMob?"16px 12px":"24px 28px",
        border:`1px solid ${dark?"rgba(22,163,74,0.2)":"rgba(22,163,74,0.12)"}`,
        marginBottom:20, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"thin" }}>
        <div style={{ fontSize:13, fontWeight:800, color:"#16A34A", marginBottom:14 }}>Hoạt động 12 tháng qua</div>

        {/* Month labels */}
        <div style={{ display:"flex", gap:GAP, marginBottom:4, marginLeft:isMob?18:22 }}>
          {weeks.map((wk,wi)=>{
            const mp = monthPositions.find(m=>m.weekIdx===wi);
            return (
              <div key={wi} style={{ width:CELL, fontSize:9, color:CC.muted, flexShrink:0 }}>
                {mp ? MONTH_LABELS[mp.month] : ""}
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:4 }}>
          {/* Day labels */}
          <div style={{ display:"flex", flexDirection:"column", gap:GAP, marginRight:2 }}>
            {DAY_LABELS.map((d,i)=>(
              <div key={i} style={{ height:CELL, fontSize:9, color:CC.muted, display:"flex", alignItems:"center", lineHeight:1 }}>{d}</div>
            ))}
          </div>
          {/* Week columns */}
          <div style={{ display:"flex", gap:GAP }}>
            {weeks.map((wk,wi)=>(
              <div key={wi} style={{ display:"flex", flexDirection:"column", gap:GAP }}>
                {wk.map((day,di)=>(
                  <div key={di}
                    title={`${day.date}: ${day.val===0?"Không học":day.val===1?"Ít":day.val===2?"Trung bình":day.val===3?"Nhiều":"Rất nhiều"}`}
                    style={{ width:CELL, height:CELL, borderRadius:isMob?2:3,
                      background:getColor(day.val),
                      border:day.date===today.toISOString().slice(0,10)?`2px solid #16A34A`:(activeDays.includes(day.date)?`1px solid rgba(22,163,74,0.4)`:"none"),
                      transition:"transform 0.1s",cursor:"default" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12, justifyContent:"flex-end" }}>
          <span style={{ fontSize:10, color:CC.muted }}>Ít</span>
          {[0,1,2,3,4].map(v=>(
            <div key={v} style={{ width:CELL, height:CELL, borderRadius:3, background:getColor(v) }}/>
          ))}
          <span style={{ fontSize:10, color:CC.muted }}>Nhiều</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMob?2:4},1fr)`, gap:12 }}>
        {[
          {icon:"🔥",val:currentStreak,label:"Streak hiện tại",sub:"ngày liên tiếp",color:"#EA580C"},
          {icon:"📅",val:totalDays,label:"Tổng ngày học",sub:"trong năm qua",color:"#16A34A"},
          {icon:"⚡",val:totalSess,label:"Tổng buổi học",sub:"sessions",color:"#D97706"},
          {icon:"🏆",val:highestStreak,label:"Streak cao nhất",sub:"kỷ lục cá nhân",color:"#D97706"},
          {icon:"🈶",val:kanjiLearned,label:"Kanji đã học",sub:"ký tự",color:"#7C3AED"},
          {icon:"📚",val:vocabCount,label:"Từ vựng",sub:"đã học",color:"#2563EB"},
          {icon:"📊",val:Math.round(totalDays/Math.max(Object.keys(heatData).length,1)*100)+"%",label:"Tỷ lệ học",sub:"ngày có học / tổng",color:"#0891B2"},
          {icon:"🌟",val:Object.values(heatData).filter(v=>v>=3).length,label:"Ngày học nhiều",sub:"≥ 3 sessions",color:"#BE185D"},
          {icon:"🎯",val:Object.values(heatData).filter(v=>v>=4).length,label:"Ngày xuất sắc",sub:"4+ sessions",color:"#059669"},
        ].map((s,i)=>(
          <div key={i} style={{ background:dark?"rgba(30,41,59,0.95)":"#FFFFFF", borderRadius:16, padding:"16px 14px", textAlign:"center",
            border:`1px solid ${dark?s.color+"22":s.color+"14"}` }}>
            <div style={{ fontSize:24 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:900, color:s.color, margin:"4px 0" }}>{s.val}</div>
            <div style={{ fontSize:11, fontWeight:700, color:dark?"#E2E8F0":CC.text }}>{s.label}</div>
            <div style={{ fontSize:10, color:CC.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MINI LESSON PAGE
// ════════════════════════════════════════════════════════════════
function MiniLessonPage() {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  const [idx, setIdx]           = useState(() => Math.floor(Math.random()*MINI_LESSONS.length));
  const [phase, setPhase]       = useState("learn"); // "learn"|"quiz"|"done"
  const [quizAns, setQuizAns]   = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [streak, setStreak]     = useState(() => { try { return JSON.parse(localStorage.getItem("sp_mini_streak")||"0"); } catch { return 0; } });
  const [todayDone, setTodayDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("sp_mini_today")||"{}");
      return s.date===new Date().toDateString() ? s.count : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying]   = useState(false);

  const lesson = MINI_LESSONS[idx % MINI_LESSONS.length];

  const TYPE_CONFIG = {
    kanji:   {color:"#DC2626", bg:"#FEF2F2", label:"漢字 KANJI",   icon:"🈶"},
    vocab:   {color:"#2563EB", bg:"#EFF6FF", label:"語彙 TỪ VỰNG", icon:"📚"},
    grammar: {color:"#7C3AED", bg:"#F5F3FF", label:"文法 NGỮ PHÁP",icon:"📝"},
  };
  const tc = TYPE_CONFIG[lesson.type];

  const playLesson = () => {
    if (!window.speechSynthesis||playing) return;
    window.speechSynthesis.cancel();
    const txt = lesson.type==="grammar" ? lesson.ex : (lesson.kanji||lesson.jp) + "。" + lesson.ex;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang="ja-JP"; u.rate=0.78;
    u.onstart=()=>setPlaying(true);
    u.onend=()=>setPlaying(false);
    window.speechSynthesis.speak(u);
  };

  // Quiz: simple MC with 1 correct + 3 wrong meanings from pool
  const quizOptions = (() => {
    const correct = lesson.type==="grammar" ? lesson.vn : (lesson.vn);
    const pool = MINI_LESSONS.filter(m=>m.id!==lesson.id&&m.type===lesson.type).map(m=>m.vn).slice(0,3);
    while (pool.length<3) pool.push(["Không đúng","Sai rồi",t.speakTry][pool.length]);
    const opts = [...pool.slice(0,3), correct].sort(()=>Math.random()-0.5);
    return {opts, ansIdx: opts.indexOf(correct)};
  })();

  const markDone = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("sp_mini_streak", JSON.stringify(newStreak));
    const newCount = todayDone + 1;
    setTodayDone(newCount);
    localStorage.setItem("sp_mini_today", JSON.stringify({date:new Date().toDateString(), count:newCount}));
    // Update heatmap
    const hmap = (() => { try { return JSON.parse(localStorage.getItem("sp_heatmap")||"{}"); } catch { return {}; } })();
    const today = new Date().toISOString().slice(0,10);
    hmap[today] = Math.min(4,(hmap[today]||0)+1);
    localStorage.setItem("sp_heatmap", JSON.stringify(hmap));
    setPhase("done");
  };

  const nextLesson = () => {
    setIdx(i => (i + 1 + Math.floor(Math.random()*3)) % MINI_LESSONS.length);
    setPhase("learn"); setQuizAns(null); setQuizChecked(false);
  };

  const bgCard = dark?"rgba(30,41,59,0.95)":"#FFFFFF";
  const bgType = dark?tc.color+"18":tc.bg;

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:isMob?"14px 10px":"32px 24px", fontFamily:"'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B,#334155)", borderRadius:24, padding:isMob?"18px":"24px 32px", color:"white", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-10, right:-10, fontSize:100, opacity:0.07 }}>⚡</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:2, opacity:0.7, marginBottom:4 }}>MINI LESSON · 1 PHÚT</div>
        <div style={{ fontSize:isMob?18:22, fontWeight:900, marginBottom:8 }}>{"⚡ Bài Học 1 Phút"}</div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700 }}>
            🔥 {t.navStreak}: {streak}
          </div>
          <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"6px 14px", fontSize:12, fontWeight:700 }}>
            {`✅ Hôm nay: ${todayDone}`}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width:i===0?"24px":"8px", height:8, borderRadius:99,
            background:i===0?tc.color:dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.3)",
            transition:"all 0.3s" }}/>
        ))}
      </div>

      {/* LEARN PHASE */}
      {phase==="learn" && (
        <div>
          {/* Type badge */}
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <span style={{ fontSize:11, background:bgType, color:tc.color, padding:"5px 16px", borderRadius:20, fontWeight:900, letterSpacing:1 }}>
              {tc.icon} {tc.label}
            </span>
          </div>

          {/* Main card */}
          <div style={{ background:bgCard, borderRadius:24, padding:isMob?"24px":"32px", marginBottom:16,
            border:`2px solid ${tc.color}22`,
            boxShadow:dark?`0 8px 32px rgba(0,0,0,0.4)`:`0 8px 32px ${tc.color}12`,
            textAlign:"center" }}>

            {lesson.type==="kanji" && (
              <>
                <div style={{ fontSize:isMob?64:80, fontFamily:"'Noto Sans JP',serif", fontWeight:900, color:tc.color, lineHeight:1, marginBottom:8 }}>
                  {lesson.kanji}
                </div>
                <div style={{ fontSize:18, color:CC.muted, marginBottom:6, fontFamily:"'Noto Sans JP',sans-serif" }}>{lesson.kana}</div>
                <div style={{ fontSize:22, fontWeight:800, color:dark?"#E2E8F0":CC.text, marginBottom:16 }}>{lesson.vn}</div>
                {lesson.radical && (
                  <div style={{ fontSize:12, background:bgType, color:tc.color, padding:"4px 14px", borderRadius:20, display:"inline-block", marginBottom:16, fontWeight:700 }}>
                    🧩 {lesson.radical}
                  </div>
                )}
              </>
            )}
            {lesson.type==="vocab" && (
              <>
                <div style={{ fontSize:isMob?40:50, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:900, color:tc.color, marginBottom:6 }}>
                  {lesson.jp}
                </div>
                <div style={{ fontSize:16, color:CC.muted, marginBottom:6, fontFamily:"'Noto Sans JP',sans-serif" }}>{lesson.kana}</div>
                <div style={{ fontSize:22, fontWeight:800, color:dark?"#E2E8F0":CC.text, marginBottom:16 }}>{lesson.vn}</div>
              </>
            )}
            {lesson.type==="grammar" && (
              <>
                <div style={{ fontSize:isMob?24:30, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:900, color:tc.color, marginBottom:8, lineHeight:1.4 }}>
                  {lesson.pattern}
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:dark?"#E2E8F0":CC.text, marginBottom:8 }}>{lesson.vn}</div>
                {lesson.hint && (
                  <div style={{ fontSize:12, background:bgType, color:tc.color, padding:"4px 14px", borderRadius:20, display:"inline-block", marginBottom:16, fontWeight:700 }}>
                    💡 {lesson.hint}
                  </div>
                )}
              </>
            )}

            {/* Example sentence */}
            <div style={{ background:bgType, borderRadius:14, padding:"14px 16px", textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:800, color:tc.color, marginBottom:6 }}>VÍ DỤ:</div>
              <div style={{ fontSize:isMob?15:17, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:700, color:tc.color, marginBottom:4 }}>
                {lesson.ex}
              </div>
              <div style={{ fontSize:13, color:dark?"#E2E8F0":CC.text }}>{lesson.exVn}</div>
            </div>

            {/* JLPT badge */}
            <div style={{ marginTop:14 }}>
              <span style={{ fontSize:11, background:LEVEL_COLOR[lesson.jlpt]+"18", color:LEVEL_COLOR[lesson.jlpt], padding:"3px 12px", borderRadius:20, fontWeight:800 }}>
                {lesson.jlpt}
              </span>
            </div>
          </div>

          {/* Audio + action */}
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={playLesson} disabled={playing}
              style={{ width:48, height:48, borderRadius:14, border:`1.5px solid ${tc.color}44`,
                background:playing?tc.color+"20":"transparent", color:tc.color, cursor:"pointer",
                fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {playing?"🔊":"▶"}
            </button>
            <button onClick={()=>setPhase("quiz")}
              style={{ flex:1, padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
                background:`linear-gradient(135deg,${tc.color},${tc.color}cc)`, color:"white",
                fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif",
                boxShadow:`0 4px 16px ${tc.color}44` }}>
              📝 Kiểm tra nhanh →
            </button>
          </div>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase==="quiz" && (
        <div>
          <div style={{ background:bgCard, borderRadius:20, padding:"24px", marginBottom:16,
            border:`2px solid ${tc.color}22` }}>
            <div style={{ fontSize:13, fontWeight:700, color:CC.muted, marginBottom:16, textAlign:"center" }}>Nghĩa của từ/mẫu này là gì?</div>
            <div style={{ fontSize:isMob?24:30, fontFamily:"'Noto Sans JP',sans-serif", fontWeight:900, color:tc.color, textAlign:"center", marginBottom:20 }}>
              {lesson.type==="grammar" ? lesson.pattern : (lesson.kanji||lesson.jp)}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {quizOptions.opts.map((opt,j)=>{
                const chosen=quizAns===j, correct=j===quizOptions.ansIdx, show=quizChecked;
                return (
                  <button key={j}
                    onClick={()=>{ if(!quizChecked){setQuizAns(j);setQuizChecked(true);} }}
                    style={{ padding:"13px 16px", borderRadius:12, textAlign:"left", cursor:quizChecked?"default":"pointer",
                      fontSize:14, fontWeight:chosen?700:500, fontFamily:"'Nunito',sans-serif",
                      border:`2px solid ${show&&correct?"#10B981":show&&chosen&&!correct?"#EF4444":chosen?tc.color+"66":dark?"rgba(148,163,184,0.2)":"rgba(148,163,184,0.2)"}`,
                      background:show&&correct?"rgba(16,185,129,0.12)":show&&chosen&&!correct?"rgba(239,68,68,0.08)":chosen?tc.color+"10":"transparent",
                      color:dark?"#E2E8F0":CC.text,
                      transform:chosen&&!quizChecked?"scale(1.01)":"scale(1)", transition:"all 0.15s" }}>
                    {show&&correct?"✅ ":show&&chosen&&!correct?"❌ ":""}{opt}
                  </button>
                );
              })}
            </div>
          </div>
          {quizChecked && (
            <button onClick={markDone}
              style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
                background:`linear-gradient(135deg,${tc.color},${tc.color}cc)`, color:"white",
                fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif",
                boxShadow:`0 4px 16px ${tc.color}44` }}>
              ✅ Xong → Bài tiếp theo
            </button>
          )}
        </div>
      )}

      {/* DONE PHASE */}
      {phase==="done" && (
        <div style={{ textAlign:"center" }}>
          <div style={{ background:bgCard, borderRadius:24, padding:"36px 28px", marginBottom:16,
            border:`2px solid rgba(16,185,129,0.4)`,
            boxShadow:"0 8px 32px rgba(16,185,129,0.15)" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#10B981", marginBottom:6 }}>{"Hoàn thành!"}</div>
            <div style={{ fontSize:14, color:CC.muted, marginBottom:20 }}>
              {`Hôm nay đã học ${todayDone} bài · Streak ${streak} ngày`}
            </div>
            <div style={{ background:"rgba(16,185,129,0.1)", borderRadius:14, padding:"12px 20px", marginBottom:20 }}>
              <div style={{ fontSize:24, fontWeight:900, color:"#10B981" }}>🔥 {streak}</div>
              <div style={{ fontSize:12, color:CC.muted }}>Streak hiện tại</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={nextLesson}
              style={{ flex:1, padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
                background:"linear-gradient(135deg,#10B981,#059669)", color:"white",
                fontSize:14, fontWeight:800, fontFamily:"'Nunito',sans-serif",
                boxShadow:"0 4px 16px rgba(16,185,129,0.4)" }}>
              ⚡ Bài tiếp theo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



// ════════════════════════════════════════════════════════════════
// GOOGLE AUTH HOOK — Quản lý đăng nhập Google
// ════════════════════════════════════════════════════════════════
const GOOGLE_CLIENT_ID = "684657649217-o35pr0sps5sgv31tbp6l2jaj4hlkfi1e.apps.googleusercontent.com"; // User replaces this

function useGoogleAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_google_user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (document.getElementById("gsi-script")) { setGsiReady(true); return; }
    const s = document.createElement("script");
    s.id = "gsi-script";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    s.onload = () => setGsiReady(true);
    document.head.appendChild(s);
  }, []);

  const signIn = () => {
    if (!gsiReady || !window.google) return;
    setLoading(true);
    window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (res) => {
        if (res.access_token) {
          try {
            const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${res.access_token}` }
            });
            const info = await r.json();
            const u = {
              name: info.name,
              email: info.email,
              picture: info.picture,
              sub: info.sub,
              signedInAt: new Date().toISOString()
            };
            setUser(u);
            localStorage.setItem("sp_google_user", JSON.stringify(u));
          } catch {}
        }
        setLoading(false);
      }
    }).requestAccessToken();
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("sp_google_user");
    if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
  };

  return { user, loading, gsiReady, signIn, signOut };
}

// ════════════════════════════════════════════════════════════════
// LOGIN MODAL — Popup đăng nhập Google
// ════════════════════════════════════════════════════════════════
function LoginModal({ onClose, onSignIn, loading, gsiReady }) {
  const CC = useColors();
  const [dark] = useDarkMode();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: dark ? "linear-gradient(135deg,#0F172A,#1E293B)" : "white",
        borderRadius: 28, padding: "40px 36px", maxWidth: 420, width: "100%",
        border: `1px solid ${dark ? "rgba(56,189,248,0.2)" : "rgba(37,99,235,0.15)"}`,
        boxShadow: dark ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(56,189,248,0.1)" : "0 32px 80px rgba(37,99,235,0.15)",
        textAlign: "center", position: "relative"
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", color: CC.muted,
          cursor: "pointer", fontSize: 20, lineHeight: 1
        }}>×</button>

        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: "0 auto 20px",
          background: "linear-gradient(135deg,#38BDF8,#2563EB)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, boxShadow: "0 8px 32px rgba(56,189,248,0.4)"
        }}>🌸</div>

        <div style={{ fontSize: 22, fontWeight: 900, color: dark ? "#E2E8F0" : "#0F172A", marginBottom: 6, fontFamily: "'Nunito',sans-serif" }}>
          Sakura Path
        </div>
        <div style={{ fontSize: 13, color: CC.muted, marginBottom: 32, lineHeight: 1.6 }}>
          Đăng nhập để lưu tiến trình học tập,<br/>đồng bộ dữ liệu và tham gia bảng xếp hạng.
        </div>

        {/* Benefits */}
        <div style={{
          background: dark ? "rgba(56,189,248,0.06)" : "rgba(239,246,255,0.9)",
          border: `1px solid ${dark ? "rgba(56,189,248,0.15)" : "rgba(37,99,235,0.12)"}`,
          borderRadius: 16, padding: "16px 20px", marginBottom: 28, textAlign: "left"
        }}>
          {[
            { ic: "🔥", t: "Streak & heatmap học tập đồng bộ" },
            { ic: "🏆", t: "Tham gia bảng xếp hạng cộng đồng" },
            { ic: "📊", t: "Lưu tiến trình Kanji & từ vựng" },
            { ic: "☁️", t: "Dữ liệu an toàn trên cloud" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <span style={{ fontSize: 16 }}>{b.ic}</span>
              <span style={{ fontSize: 13, color: dark ? "#CBD5E1" : "#334155", fontWeight: 600 }}>{b.t}</span>
            </div>
          ))}
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={onSignIn}
          disabled={loading || !gsiReady}
          style={{
            width: "100%", padding: "14px 20px", borderRadius: 16,
            border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
            background: loading ? "rgba(148,163,184,0.1)" : (dark ? "rgba(255,255,255,0.06)" : "white"),
            color: dark ? "#E2E8F0" : "#3C4043",
            fontSize: 15, fontWeight: 700, cursor: loading || !gsiReady ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            fontFamily: "'Nunito',sans-serif",
            boxShadow: loading ? "none" : (dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.12)"),
            transition: "all 0.2s"
          }}>
          {loading ? (
            <><span style={{ fontSize: 18 }}>⏳</span> Đang đăng nhập...</>
          ) : !gsiReady ? (
            <><span style={{ fontSize: 18 }}>⏳</span> {t.loading}</>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng nhập với Google
            </>
          )}
        </button>

        <div style={{ marginTop: 16, fontSize: 11, color: CC.muted, lineHeight: 1.6 }}>
          Bằng cách đăng nhập, bạn đồng ý cho phép Sakura Path<br/>
          lưu thông tin tên và ảnh đại diện của bạn.
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PROFILE PAGE — Trang cá nhân đầy đủ
// ════════════════════════════════════════════════════════════════
function ProfilePage({ user, onSignIn, onSignOut, setPage, loading, gsiReady }) {
    const t = useT();
const CC = useColors();
  const [dark] = useDarkMode();
  const w = useWidth(); const isMob = w < 640;

  // Gather stats
  const streakData  = (() => { try { return JSON.parse(localStorage.getItem("sp_streak_v2") || "null"); } catch { return null; } })();
  const kanjiStats  = (() => { try { return JSON.parse(localStorage.getItem("sp_kanji_stats") || "{}"); } catch { return {}; } })();
  const cardStats   = (() => { try { return JSON.parse(localStorage.getItem("sp_card_stats") || "{}"); } catch { return {}; } })();
  const userStats   = (() => { try { return JSON.parse(localStorage.getItem("sp_user_stats") || "{}"); } catch { return {}; } })();
  const jlptHistory = (() => { try { return JSON.parse(localStorage.getItem("sp_jlpt_history") || "[]"); } catch { return []; } })();
  const achievements = (() => { try { return JSON.parse(localStorage.getItem("sp_achievements") || "[]"); } catch { return []; } })();
  const heatData    = (() => { try { return JSON.parse(localStorage.getItem("sp_heatmap") || "{}"); } catch { return {}; } })();
  const timerData   = (() => { try { return JSON.parse(localStorage.getItem("sp_timer_today") || "{}"); } catch { return {}; } })();
  const nickname    = localStorage.getItem("sp_nickname") || "";

  const currentStreak  = streakData?.streak || 0;
  const highestStreak  = streakData?.highest || 0;
  const activeDays     = streakData?.activeDays || [];
  const kanjiLearned   = Object.keys(kanjiStats).length;
  const vocabLearned   = Object.keys(cardStats).length;
  const totalStudyDays = Object.values(heatData).filter(v => v > 0).length;
  const totalSessions  = Object.values(heatData).reduce((a, b) => a + b, 0);
  const jlptBest       = jlptHistory.length ? Math.max(...jlptHistory.map(h => h.score || 0)) : 0;
  const achieveCount   = achievements.length;

  const STAT_CARDS = [
    { ic: "🔥", val: currentStreak, label: "Streak hiện tại", sub: "ngày liên tiếp", color: "#EA580C" },
    { ic: "🏆", val: highestStreak, label: "Streak kỷ lục", sub: "cao nhất", color: "#D97706" },
    { ic: "📅", val: totalStudyDays, label: "Ngày đã học", sub: "tổng cộng", color: "#16A34A" },
    { ic: "🈶", val: kanjiLearned, label: "Kanji", sub: "đã luyện", color: "#7C3AED" },
    { ic: "📚", val: vocabLearned, label: "Từ vựng", sub: "đã học", color: "#2563EB" },
    { ic: "🏅", val: achieveCount, label: t.achieveTitle, sub: "đã mở khóa", color: "#BE185D" },
    { ic: "⚡", val: totalSessions, label: "Tổng buổi học", sub: "sessions", color: "#0891B2" },
    { ic: "🎌", val: jlptBest ? `${jlptBest}%` : "—", label: "Điểm JLPT cao nhất", sub: "", color: "#DC2626" },
  ];

  // Mini heatmap (last 10 weeks)
  const today = new Date();
  const miniWeeks = [];
  for (let w = 9; w >= 0; w--) {
    const week = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - w * 7 - d);
      const key = date.toISOString().slice(0, 10);
      const isActive = activeDays.includes(key);
      week.push({ key, val: heatData[key] || (isActive ? 1 : 0) });
    }
    miniWeeks.push(week);
  }
  const heatColor = (v) => {
    if (v === 0) return dark ? "rgba(30,41,59,0.8)" : "rgba(229,231,235,0.9)";
    if (v === 1) return dark ? "rgba(34,197,94,0.3)" : "#BBF7D0";
    if (v === 2) return dark ? "rgba(34,197,94,0.55)" : "#86EFAC";
    if (v === 3) return dark ? "rgba(34,197,94,0.8)" : "#4ADE80";
    return dark ? "#16A34A" : "#15803D";
  };

  const bgCard = dark ? "rgba(30,41,59,0.95)" : "#FFFFFF";

  if (!user) {
    // Guest profile
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: isMob ? "14px 10px" : "32px 24px", fontFamily: "'Nunito',sans-serif" }}>
        {/* Guest header */}
        <div style={{
          background: "linear-gradient(135deg,#0F172A,#1E3A8A,#0369A1)",
          borderRadius: 24, padding: isMob ? "28px 20px" : "40px 40px",
          color: "white", marginBottom: 24, textAlign: "center", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 200, background: "radial-gradient(ellipse,rgba(56,189,248,0.15) 0%,transparent 70%)" }} />
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%", margin: "0 auto 16px",
              background: "rgba(255,255,255,0.08)", border: "3px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44
            }}>👤</div>
            <div style={{ fontSize: isMob ? 20 : 24, fontWeight: 900, marginBottom: 8 }}>Khách</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 24 }}>
              Đăng nhập với Google để lưu tiến trình học tập
            </div>
            <button onClick={onSignIn} disabled={loading || !gsiReady}
              style={{
                padding: "13px 32px", borderRadius: 16, border: "none",
                background: loading ? "rgba(148,163,184,0.3)" : "white",
                color: loading ? "#94A3B8" : "#1E3A8A",
                fontSize: 15, fontWeight: 800, cursor: loading || !gsiReady ? "not-allowed" : "pointer",
                fontFamily: "'Nunito',sans-serif",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
              }}>
              {loading ? "⏳ "+(t.loading||"Đang tải...") : <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Đăng nhập với Google
              </>}
            </button>
          </div>
        </div>

        {/* Local stats (even for guest) */}
        <div style={{ fontSize: 14, fontWeight: 800, color: CC.muted, marginBottom: 12 }}>📊 Tiến trình học tập của bạn (lưu cục bộ)</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMob ? 2 : 4},1fr)`, gap: 10 }}>
          {STAT_CARDS.slice(0, 8).map((s, i) => (
            <div key={i} style={{ background: bgCard, borderRadius: 16, padding: "14px 12px", textAlign: "center", border: `1px solid ${dark ? s.color + "22" : s.color + "14"}` }}>
              <div style={{ fontSize: 22 }}>{s.ic}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: CC.muted, fontWeight: 700, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Logged-in profile
  const joinedDate = user.signedInAt ? new Date(user.signedInAt).toLocaleDateString("vi-VN") : "";

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: isMob ? "14px 10px" : "32px 24px", fontFamily: "'Nunito',sans-serif" }}>

      {/* Profile hero */}
      <div style={{
        background: "linear-gradient(135deg,#0F172A 0%,#1E3A8A 50%,#0369A1 100%)",
        borderRadius: 24, padding: isMob ? "24px 20px" : "32px 36px",
        color: "white", marginBottom: 20, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 160, opacity: 0.04 }}>🌸</div>
        <div style={{ display: "flex", gap: isMob ? 16 : 24, alignItems: "flex-start", flexWrap: isMob ? "wrap" : "nowrap" }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {user.picture ? (
              <img src={user.picture} alt={user.name}
                style={{ width: isMob ? 72 : 96, height: isMob ? 72 : 96, borderRadius: "50%", border: "3px solid rgba(56,189,248,0.6)", objectFit: "cover", boxShadow: "0 0 24px rgba(56,189,248,0.3)" }} />
            ) : (
              <div style={{ width: isMob ? 72 : 96, height: isMob ? 72 : 96, borderRadius: "50%", background: "linear-gradient(135deg,#38BDF8,#2563EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMob ? 32 : 42, border: "3px solid rgba(56,189,248,0.6)" }}>
                {user.name?.[0] || "?"}
              </div>
            )}
            {/* Online dot */}
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#10B981", border: "2px solid #0F172A" }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isMob ? 20 : 26, fontWeight: 900, marginBottom: 4, letterSpacing: "-0.02em" }}>{user.name}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>{user.email}</div>
            {nickname && <div style={{ fontSize: 12, background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 20, padding: "3px 12px", display: "inline-block", marginBottom: 10, fontWeight: 700 }}>👥 {nickname}</div>}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                🔥 <span>{currentStreak} ngày streak</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                📅 <span>{totalStudyDays} ngày đã học</span>
              </div>
              {joinedDate && <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>
                🗓 Tham gia {joinedDate}
              </div>}
            </div>
          </div>

          {/* Sign out */}
          <button onClick={onSignOut} style={{
            flexShrink: 0, padding: "8px 16px", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito',sans-serif",
            display: "flex", alignItems: "center", gap: 6
          }}>
          
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ fontSize: 13, fontWeight: 800, color: CC.muted, marginBottom: 12 }}>📊 THỐNG KÊ HỌC TẬP</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMob ? 2 : 4},1fr)`, gap: 10, marginBottom: 20 }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{
            background: bgCard, borderRadius: 16, padding: "16px 12px", textAlign: "center",
            border: `1px solid ${dark ? s.color + "22" : s.color + "14"}`,
            boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.2)" : `0 4px 16px ${s.color}08`
          }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{s.ic}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: dark ? "#E2E8F0" : CC.text, marginTop: 4 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 9, color: CC.muted }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Mini heatmap */}
      <div style={{ background: bgCard, borderRadius: 20, padding: "18px 20px", marginBottom: 20, border: `1px solid ${dark ? "rgba(22,163,74,0.2)" : "rgba(22,163,74,0.12)"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#16A34A" }}>📅 Hoạt động 10 tuần gần nhất</div>
          <button onClick={() => setPage("heatmap")} style={{ background: "none", border: "none", color: "#16A34A", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Xem đầy đủ →</button>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {miniWeeks.map((wk, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {wk.map((day, di) => (
                <div key={di} style={{ width: isMob ? 10 : 14, height: isMob ? 10 : 14, borderRadius: 2, background: heatColor(day.val), border: day.key === today.toISOString().slice(0, 10) ? "1.5px solid #16A34A" : "none" }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10, color: CC.muted }}>Ít</span>
          {[0, 1, 2, 3, 4].map(v => <div key={v} style={{ width: 12, height: 12, borderRadius: 2, background: heatColor(v) }} />)}
          <span style={{ fontSize: 10, color: CC.muted }}>Nhiều</span>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ fontSize: 13, fontWeight: 800, color: CC.muted, marginBottom: 12 }}>🔗 TRUY CẬP NHANH</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMob ? 2 : 3},1fr)`, gap: 10, marginBottom: 20 }}>
        {[
          { ic: "🔥", l: "Streak", p: "streak", color: "#EA580C" },
          { ic: "🏅", l: t.achieveTitle, p: "achieve", color: "#D97706" },
          { ic: "📅", l: "Heatmap", p: "heatmap", color: "#16A34A" },
          { ic: "👥", l: "Bảng xếp hạng", p: "group", color: "#059669" },
          { ic: "📊", l: "Phân tích AI", p: "analysis", color: "#7C3AED" },
          { ic: "🗺️", l: "Tiến trình JLPT", p: "map", color: "#2563EB" },
        ].map((l, i) => (
          <button key={i} onClick={() => setPage(l.p)} style={{
            padding: "12px 14px", borderRadius: 14,
            border: `1px solid ${dark ? l.color + "25" : l.color + "18"}`,
            background: dark ? l.color + "10" : l.color + "08",
            color: l.color, fontWeight: 800, fontSize: 13,
            cursor: "pointer", fontFamily: "'Nunito',sans-serif",
            display: "flex", alignItems: "center", gap: 8, textAlign: "left"
          }}>
            <span style={{ fontSize: 18 }}>{l.ic}</span>{l.l}
          </button>
        ))}
      </div>

      {/* Recent achievements */}
      {achievements.length > 0 && (
        <div style={{ background: bgCard, borderRadius: 20, padding: "16px 20px", marginBottom: 20, border: `1px solid ${dark ? "rgba(212,163,61,0.2)" : "rgba(212,163,61,0.15)"}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#D97706", marginBottom: 12 }}>🏅 THÀNH TÍCH GẦN ĐÂY</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {achievements.slice(-6).map((id, i) => {
              const def = (typeof ACHIEVEMENTS_DEF !== "undefined" ? ACHIEVEMENTS_DEF : []).find(a => a.id === id);
              if (!def) return null;
              return (
                <div key={i} style={{ background: dark ? "rgba(245,158,11,0.1)" : "rgba(255,251,235,0.9)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{def.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#D97706" }}>{def.title}</div>
                    <div style={{ fontSize: 9, color: CC.muted }}>{def.xp} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Account info */}
      <div style={{ background: bgCard, borderRadius: 20, padding: "16px 20px", border: `1px solid ${dark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.2)"}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: CC.muted, marginBottom: 12 }}>⚙️ TÀI KHOẢN</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { l: "Email", v: user.email },
            { l: "Tên hiển thị", v: user.name },
            { l: "Biệt danh xếp hạng", v: nickname || "(Chưa đặt)" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${dark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.12)"}` : "" }}>
              <span style={{ fontSize: 13, color: CC.muted, fontWeight: 600 }}>{row.l}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: dark ? "#E2E8F0" : CC.text }}>{row.v}</span>
            </div>
          ))}
        </div>
        <button onClick={onSignOut} style={{
          marginTop: 16, width: "100%", padding: "11px", borderRadius: 12,
          border: "1.5px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)",
          color: "#EF4444", fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Nunito',sans-serif"
        }}>
          {"↩ Đăng xuất khỏi tài khoản Google"}
        </button>
      </div>
    </div>
  );
}


function Footer({setPage}){
  const w=useWidth();const isMob=w<640;
  const t = useT();
  const links=[
    ["home","🏠 "+t.navHome],["flashcard","🧠 "+t.navFlashcard],
    ["hiragana","あ "+t.navHiragana],["katakana","ア "+t.navKatakana],["grammar","📝 "+t.navGrammar],
    ["jlpt","🎌 "+t.navJlpt],["streak","🔥 "+t.navStreak]
  ];
  return(
    <footer style={{
      background:"linear-gradient(180deg,#0F172A 0%,#020617 100%)",
      padding:isMob?"28px 16px":"36px 32px",
      textAlign:"center",
      borderTop:"1px solid rgba(56,189,248,0.1)"
    }}>
      <div style={{
        width:40,height:40,borderRadius:12,
        background:"linear-gradient(135deg,#38BDF8,#2563EB)",
        display:"inline-flex",alignItems:"center",justifyContent:"center",
        fontSize:20,marginBottom:10,
        boxShadow:"0 0 16px rgba(56,189,248,0.4)"
      }}>🌸</div>
      <div style={{color:"white",fontWeight:900,fontSize:15,marginBottom:3,fontFamily:"'Nunito',sans-serif"}}>Sakura Path</div>
      <div style={{color:"rgba(148,163,184,0.6)",fontSize:11,marginBottom:16}}>Học tiếng Nhật · © 2026</div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",maxWidth:640,margin:"0 auto"}}>
        {links.map(([id,l])=>(
          <span key={id} onClick={()=>setPage(id)} style={{
            color:"rgba(148,163,184,0.55)",fontSize:11,cursor:"pointer",
            fontWeight:600,transition:"color 0.15s",
            padding:"3px 6px",borderRadius:6
          }}
          onMouseEnter={e=>e.target.style.color="#38BDF8"}
          onMouseLeave={e=>e.target.style.color="rgba(148,163,184,0.55)"}
          >{l}</span>
        ))}
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════
// TỪ VỰNG CHUYÊN NGÀNH — trang danh sách (không phải flashcard)
// ═══════════════════════════════════════════════════════════
const SPECIALIZED_VOCAB = [
  { value:"💻 IT",          label:"Công nghệ IT",          icon:"💻",  color:"#38BDF8", data:()=>VOCAB_IT },
  { value:"🍳 Đầu bếp",     label:"Đầu bếp & Nhà hàng",    icon:"🍳",  color:"#F59E0B", data:()=>VOCAB_RESTAURANT },
  { value:"⚙️ Kỹ sư",       label:"Kỹ sư & Cơ khí",        icon:"⚙️", color:"#10B981", data:()=>VOCAB_ENGINEERING },
  { value:"💼 Kinh doanh",  label:"Kinh doanh",             icon:"💼",  color:"#8B5CF6", data:()=>VOCAB_BUSINESS },
  { value:"🏥 Y tế",        label:"Y tế & Điều dưỡng",     icon:"🏥",  color:"#EC4899", data:()=>VOCAB_MEDICAL },
  { value:"🏗️ Xây dựng",    label:"Xây dựng & Kiến trúc",  icon:"🏗️", color:"#F97316", data:()=>VOCAB_CONSTRUCTION },
  { value:"🌾 Nông nghiệp", label:"Nông nghiệp",            icon:"🌾",  color:"#84CC16", data:()=>VOCAB_AGRICULTURE },
];

function SpecializedVocabPage({ initialIndustry = "all" }) {
  const [dark] = useDarkMode();
  const [industry, setIndustry] = useState(initialIndustry);
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState(null);

  const groups = SPECIALIZED_VOCAB.map(g => ({ ...g, words: g.data() }));
  const shown = industry === "all" ? groups : groups.filter(g => g.value === industry);
  const q = query.trim().toLowerCase();
  const match = w => !q || [w.jp, w.rom, w.vn, w.ex, w.exVn]
    .some(s => (s || "").toLowerCase().includes(q));
  const total = groups.reduce((n, g) => n + g.words.length, 0);
  const anyResult = shown.some(g => g.words.some(match));

  const FG = dark ? "#E2E8F0" : "#0F172A";
  const SUB = dark ? "#94A3B8" : "#64748B";
  const CARD = dark ? "#111827" : "#FFFFFF";
  const BORDER = dark ? "rgba(148,163,184,0.18)" : "rgba(37,99,235,0.12)";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 40px", fontFamily: "'Nunito',sans-serif", color: FG }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>💼 Từ vựng chuyên ngành</h1>
      <div style={{ fontSize: 13, color: SUB, marginBottom: 16 }}>
        {total} từ · {groups.length} ngành · Nhật ngữ đi làm thực tế
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {[{ value: "all", label: "Tất cả", icon: "📚", color: "#2563EB" }, ...groups].map(g => {
          const active = industry === g.value;
          return (
            <button key={g.value} onClick={() => setIndustry(g.value)} style={{
              padding: "6px 12px", borderRadius: 20, cursor: "pointer",
              fontWeight: 700, fontSize: 12, fontFamily: "inherit",
              border: `1.5px solid ${g.color}`,
              background: active ? g.color : "transparent",
              color: active ? "#fff" : g.color,
            }}>
              {g.icon} {g.label}
            </button>
          );
        })}
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Tìm theo tiếng Nhật, romaji hoặc nghĩa..."
        style={{
          width: "100%", boxSizing: "border-box", padding: "10px 14px", marginBottom: 20,
          borderRadius: 12, border: `1.5px solid ${BORDER}`, background: CARD, color: FG,
          fontSize: 14, fontFamily: "inherit", outline: "none",
        }}
      />

      {shown.map(g => {
        const words = g.words.filter(match);
        if (!words.length) return null;
        return (
          <section key={g.value} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: g.color, margin: "0 0 10px" }}>
              {g.icon} {g.label}{" "}
              <span style={{ fontSize: 11, color: SUB, fontWeight: 600 }}>({words.length} từ)</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
              {words.map((w, i) => {
                const key = g.value + w.jp + i;
                const open = openKey === key;
                return (
                  <div key={key} onClick={() => setOpenKey(open ? null : key)} style={{
                    background: CARD, border: `1px solid ${BORDER}`,
                    borderLeft: `3px solid ${g.color}`, borderRadius: 12, padding: "12px 14px",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 20, fontWeight: 900 }}>{w.jp}</span>
                      <span style={{ fontSize: 12, color: SUB }}>{w.rom}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{w.vn}</div>
                    {open && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${BORDER}` }}>
                        {w.ex && <div style={{ fontSize: 13, marginBottom: 4 }}>{w.ex}</div>}
                        {w.exVn && <div style={{ fontSize: 12, color: SUB }}>{w.exVn}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {!anyResult && (
        <div style={{ textAlign: "center", color: SUB, padding: 30, fontSize: 14 }}>
          Không tìm thấy từ nào phù hợp.
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [page,setPage]=useState("home");
  const {streak,markLearned}=useStreak();
  const [animKey,setAnimKey]=useState(0);
  const [dark] = useDarkMode();
  const { user, loading: authLoading, gsiReady, signIn, signOut } = useGoogleAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [vocabIndustry,setVocabIndustry]=useState("all");
  const navigate=(id,arg)=>{
    if(id==="vocab") setVocabIndustry(typeof arg==="string"?arg:"all");
    setPage(id);
    setAnimKey(k=>k+1);
    if(typeof window!=="undefined") window.scrollTo({top:0,behavior:"smooth"});
  };

  const isFixedPage = page === "radical" && typeof window !== "undefined" && window.innerWidth >= 900;
  const render=()=>{
    switch(page){
      case "profile":   return <ProfilePage user={user} onSignIn={()=>setShowLogin(true)} onSignOut={signOut} setPage={navigate} loading={authLoading} gsiReady={gsiReady}/>;
      case "home":      return <HomePage setPage={navigate} streak={streak}/>;
      case "streak":    return <StreakPage streak={streak}/>;
      case "flashcard": return <FlashcardPage markLearned={markLearned}/>;
      case "vocab":     return <SpecializedVocabPage initialIndustry={vocabIndustry}/>;
      case "hiragana":  return <KanaPage type="hiragana"/>;
      case "katakana":  return <KanaPage type="katakana"/>;
      case "grammar":   return <GrammarPage/>;
      case "jlpt":      return <JLPTRealExam/>;
      case "import":    return <ImportExportPage/>;
      case "kanji":     return <KanjiWritingPage markLearned={markLearned}/>;
      case "eju":       return <EJURealExam/>;
      case "game":      return <SentenceBuilderPage/>;
      case "chat":      return <AIConversationPage/>;
      case "map":       return <JLPTProgressPage/>;
      case "achieve":   return <AchievementsPage/>;
      case "dictation": return <DictationPage/>;
      case "story":     return <ShortStoryPage/>;
      case "radical":   return <KanjiBuilderPage/>;
      case "analysis":  return <AIAnalysisPage/>;
      case "news":      return <NewsPage/>;
      case "culture":   return <CulturePage/>;
      case "heatmap":   return <HeatmapPage/>;
      case "mini":      return <MiniLessonPage/>;
      case "group":     return <StudyGroupPage/>;
      case "timer":     return <StudyTimerPage/>;
      default:          return <HomePage setPage={navigate}/>;
    }
  };

  return(
    <div style={{
      fontFamily:"'Nunito','Nunito Sans',system-ui,sans-serif",
      background: dark
        ? "linear-gradient(180deg,#0F172A 0%,#0D1B2E 100%)"
        : "linear-gradient(180deg,#EFF6FF 0%,#DBEAFE 100%)",
      minHeight:"100vh",
      height: isFixedPage ? "100vh" : "auto",
      overflow: isFixedPage ? "hidden" : "visible",
      color: dark ? "#E2E8F0" : "#0F172A",
    }}>
      <Nav page={page} setPage={navigate} streakCount={streak.streak} user={user} onLoginClick={()=>setShowLogin(true)}/>
      {/* Theme transition mask */}
      <div className="theme-mask">
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,11,10,9,8,7,6,5,4,3,2,1,0].map((v,i)=>(
          <div key={i} style={{"--i":v}}/>
        ))}
      </div>
      <div key={animKey} className="ba-page-enter" style={{minHeight: isFixedPage ? 0 : "calc(100vh - 56px)", height: isFixedPage ? "calc(100vh - 56px)" : "auto", overflow: isFixedPage ? "hidden" : "visible"}}>
        {render()}
      </div>
      {!isFixedPage && <Footer setPage={navigate}/>}
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} onSignIn={()=>{signIn();setShowLogin(false);}} loading={authLoading} gsiReady={gsiReady}/>}
    </div>
  );
}