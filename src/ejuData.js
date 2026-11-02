// ══════════════════════════════════════════════════════════════
// DỮ LIỆU ĐỀ THI EJU CHÍNH THỨC (JASSO)
//  - Lý/Hóa/Sinh + Toán: đề & đáp án kỳ 1 năm 2021
//  - Nhật Bản và Thế giới: đề kỳ 2 năm 2015 (CHƯA có file đáp án)
// File PDF đặt trong thư mục:  public/eju/
// ══════════════════════════════════════════════════════════════

export const EJU_ANSWER_PDF = "/eju/eju2021_1_answers.pdf";

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Tạo item trắc nghiệm: [số hàng, đáp án, nhãn phụ]
const choiceItems = (rows) =>
  rows.map(([row, ans, hint]) => ({
    id: `r${row}`,
    label: `Hàng ${row}`,
    hint: hint || "",
    answer: ans == null ? null : String(ans),
  }));

// Tạo item điền số (math): [chữ cái ô, đáp án]
const fillItems = (prefix, rows) =>
  rows.map(([label, ans]) => ({
    id: `${prefix}-${label}`,
    label,
    answer: ans,
  }));

// ───────────── VẬT LÝ (Physics) – 19 hàng ─────────────
const PHYSICS = [
  { id: "I", title: "Ⅰ", items: choiceItems([[1,2,"問1"],[2,4,"問2"],[3,2,"問3"],[4,3,"問4"],[5,6,"問5"],[6,2,"問6"]]) },
  { id: "II", title: "Ⅱ", items: choiceItems([[7,2,"問1"],[8,1,"問2"],[9,1,"問3"]]) },
  { id: "III", title: "Ⅲ", items: choiceItems([[10,3,"問1"],[11,6,"問2"],[12,4,"問3"]]) },
  { id: "IV", title: "Ⅳ", items: choiceItems([[13,6,"問1"],[14,3,"問2"],[15,5,"問3"],[16,4,"問4"],[17,3,"問5"],[18,2,"問6"]]) },
  { id: "V", title: "Ⅴ", items: choiceItems([[19,3,"問1"]]) },
];

// ───────────── HÓA HỌC (Chemistry) – 20 hàng ─────────────
const CHEM_KEY = [3,5,4,6,3,1,2,2,3,3,1,5,5,1,5,4,2,4,4,2];
const CHEMISTRY = [
  { id: "all", title: "問1 – 問20", items: choiceItems(CHEM_KEY.map((a, i) => [i + 1, a, `問${i + 1}`])) },
];

// ───────────── SINH HỌC (Biology) – 18 hàng ─────────────
// Lưu ý: 問12 chiếm 2 hàng (12, 13)
const BIOLOGY = [
  {
    id: "all",
    title: "問1 – 問17",
    items: choiceItems([
      [1,4,"問1"],[2,4,"問2"],[3,6,"問3"],[4,3,"問4"],[5,4,"問5"],[6,2,"問6"],
      [7,7,"問7"],[8,1,"問8"],[9,2,"問9"],[10,4,"問10"],[11,6,"問11"],
      [12,1,"問12-1"],[13,6,"問12-2"],
      [14,6,"問13"],[15,3,"問14"],[16,4,"問15"],[17,3,"問16"],[18,4,"問17"],
    ]),
  },
];

// ───────────── TOÁN KHÓA 1 (Basic) ─────────────
const MATH1 = [
  { id: "I-1", title: "Ⅰ 問1", items: fillItems("m1-I1", [["A","6"],["BC","24"],["DE","33"],["FG","28"],["H","2"],["I","1"],["JK","27"]]) },
  { id: "I-2", title: "Ⅰ 問2", items: fillItems("m1-I2", [["LM","13"],["NO","19"],["PQR","427"],["STUV","1981"],["WX","31"]]) },
  { id: "II-1", title: "Ⅱ 問1", items: fillItems("m1-II1", [["A","5"],["B","7"],["CDEF","2166"],["G","3"],["HI","14"],["JKLM","2531"]]) },
  { id: "II-2", title: "Ⅱ 問2", items: fillItems("m1-II2", [["NO","38"],["PQ","38"],["RS","85"],["TUV","461"],["W","6"],["X","1"],["Y","8"],["Z","0"]]) },
  { id: "III", title: "Ⅲ", items: fillItems("m1-III", [["AB","14"],["CD","04"],["EF","14"],["GHI","255"],["JKL","819"],["MNO","620"],["PQR","441"],["STU","121"],["VWXY","1321"]]) },
  { id: "IV", title: "Ⅳ", items: fillItems("m1-IV", [["AB","63"],["C","2"],["DE","75"],["FG","13"],["HIJ","131"],["KL","90"],["MN","75"],["O","2"],["PQ","31"],["RST","123"]]) },
];

// ───────────── TOÁN KHÓA 2 (Advanced) ─────────────
const MATH2 = [
  { id: "I-1", title: "Ⅰ 問1", items: fillItems("m2-I1", [["A","6"],["BC","24"],["DE","33"],["FG","28"],["H","2"],["I","1"],["JK","27"]]) },
  { id: "I-2", title: "Ⅰ 問2", items: fillItems("m2-I2", [["LM","13"],["NO","19"],["PQR","427"],["STUV","1981"],["WX","31"]]) },
  { id: "II-1", title: "Ⅱ 問1", items: fillItems("m2-II1", [["AB","12"],["C","0"],["D","2"],["E","5"],["F","7"],["G","5"],["HI","12"],["JK","12"],["LM","56"]]) },
  { id: "II-2", title: "Ⅱ 問2", items: fillItems("m2-II2", [["N","2"],["OP","74"],["QR","74"],["S","2"],["T","1"],["UV","12"],["WXY","525"]]) },
  { id: "III", title: "Ⅲ", items: fillItems("m2-III", [["A","2"],["B","3"],["CDEF","1245"],["GHI","335"],["J","2"],["KL","50"],["M","3"],["NO","54"],["P","5"],["QR","50"],["ST","50"],["U","0"],["VWX","521"],["Y","1"]]) },
  { id: "IV", title: "Ⅳ", items: fillItems("m2-IV", [["AB","21"],["CDE","121"],["FG","12"],["HIJ","212"],["KLM","121"],["NOP","121"],["Q","4"],["R","4"]]) },
];

// ───────────── NHẬT BẢN & THẾ GIỚI (2015, chưa có đáp án) ─────────────
// Hàng 1-4 = Q1 (1)-(4); hàng 5-8 = Q2 (1)-(4); hàng 9-38 = Q3 … Q32 (hàng = Q + 6)
const JW = [
  { id: "Q1", title: "Q1 (1)–(4)", items: choiceItems(range(1, 4).map((r) => [r, null, `Q1 (${r})`])) },
  { id: "Q2", title: "Q2 (1)–(4)", items: choiceItems(range(5, 8).map((r) => [r, null, `Q2 (${r - 4})`])) },
  { id: "Q3-32", title: "Q3 – Q32", items: choiceItems(range(9, 38).map((r) => [r, null, `Q${r - 6}`])) },
];

// ───────────── DANH SÁCH MÔN ─────────────
// key giữ nguyên như bản cũ để lịch sử (sp_eju_history) không bị lỗi
export const EJU_SUBJECTS = [
  {
    key: "japanese", group: "japanese", jp: "日本語", vn: "Tiếng Nhật", icon: "🗾", color: "#DC2626",
    minutes: 125, available: false,
  },
  {
    key: "math1", group: "math", jp: "数学 コース1", vn: "Toán Khóa 1 (Cơ bản)", icon: "📐", color: "#2563EB",
    minutes: 80, available: true, type: "fill",
    session: "EJU 2021 – kỳ 1",
    pdf: "/eju/eju2021_1_math.pdf", page: 3, answerPage: 2,
    sections: MATH1,
  },
  {
    key: "math2", group: "math", jp: "数学 コース2", vn: "Toán Khóa 2 (Nâng cao)", icon: "∑", color: "#7C3AED",
    minutes: 80, available: true, type: "fill",
    session: "EJU 2021 – kỳ 1",
    pdf: "/eju/eju2021_1_math.pdf", page: 17, answerPage: 2,
    sections: MATH2,
  },
  {
    key: "physics", group: "science", jp: "物理", vn: "Vật lý", icon: "⚛️", color: "#0891B2",
    minutes: 40, available: true, type: "choice", options: range(1, 9),
    session: "EJU 2021 – kỳ 1",
    pdf: "/eju/eju2021_1_science.pdf", page: 3, answerPage: 1,
    sections: PHYSICS,
  },
  {
    key: "chemistry", group: "science", jp: "化学", vn: "Hóa học", icon: "🧪", color: "#059669",
    minutes: 40, available: true, type: "choice", options: range(1, 9),
    session: "EJU 2021 – kỳ 1",
    pdf: "/eju/eju2021_1_science.pdf", page: 25, answerPage: 1,
    sections: CHEMISTRY,
  },
  {
    key: "biology", group: "science", jp: "生物", vn: "Sinh học", icon: "🧬", color: "#16A34A",
    minutes: 40, available: true, type: "choice", options: range(1, 9),
    session: "EJU 2021 – kỳ 1",
    pdf: "/eju/eju2021_1_science.pdf", page: 41, answerPage: 1,
    sections: BIOLOGY,
  },
  {
    key: "japanworld", group: "jw", jp: "日本と世界", vn: "Nhật Bản & Thế giới", icon: "🌏", color: "#D97706",
    minutes: 80, available: true, type: "choice", options: range(1, 4),
    session: "EJU 2015 – kỳ 2",
    pdf: "/eju/eju2015_2_japan_world.pdf", page: 1, answerPage: null,
    sections: JW, // đáp án = null → chưa chấm điểm được
  },
];

export const EJU_GROUPS = [
  { id: "japanese", label: "🗾 Tiếng Nhật (日本語)" },
  { id: "math", label: "📐 Toán học (数学)" },
  { id: "science", label: "🔬 Khoa học tự nhiên (理科)" },
  { id: "jw", label: "🌏 Nhật Bản & Thế giới (総合科目)" },
];
