// ══════════════════════════════════════════════════════════════
// DỮ LIỆU ĐỀ THI JLPT N5 ĐÃ GỘP CHUNG LIỀN MẠCH
// ══════════════════════════════════════════════════════════════

export const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
export const LEVEL_COLOR = { N5: "#22c55e", N4: "#3b82f6", N3: "#f59e0b", N2: "#ef4444", N1: "#7c3aed" };
export const LEVEL_BG = { N5: "#f0fdf4", N4: "#eff6ff", N3: "#fffbeb", N2: "#fef2f2", N1: "#f5f3ff" };
export const LEVEL_DESC = {
  N5: "Đề thi mẫu chuẩn JLPT N5 chính thức đầy đủ trọn bộ các phần",
  N4: "Sơ – Trung cấp – Hiểu được hội thoại và văn bản đơn giản",
  N3: "Trung cấp – Hiểu được tiếng Nhật trong nhiều tình huống",
  N2: "Trung – Cao cấp – Hiểu được tiếng Nhật trong hầu hết tình huống",
  N1: "Cao cấp – Hiểu được tiếng Nhật rất rộng",
};

// Tổng cộng 43 trang đề thi theo đúng thứ tự bài thi chuẩn
export const EXAM_PAGES = [
  // 1. 文字・語彙 (10 trang: 1 - 10)
  ...Array.from({ length: 10 }, (_, i) => ({
    pageNum: i + 1,
    sectionId: "mojigoi",
    sectionTitle: "Phần 1: Từ vựng & Hán tự (文字・語彙)",
    image: `/dethimauN5/pages/mojigoi_p${i + 1}.jpg`,
    hasAudio: false
  })),

  // 2. 文法 (9 trang: 11 - 19)
  ...Array.from({ length: 9 }, (_, i) => ({
    pageNum: 10 + i + 1,
    sectionId: "bunpou",
    sectionTitle: "Phần 2: Ngữ pháp (文法)",
    image: `/dethimauN5/pages/bunpou_p${i + 1}.jpg`,
    hasAudio: false
  })),

  // 3. 読解 (8 trang: 20 - 27)
  ...Array.from({ length: 8 }, (_, i) => ({
    pageNum: 19 + i + 1,
    sectionId: "dokkai",
    sectionTitle: "Phần 3: Đọc hiểu (読解)",
    image: `/dethimauN5/pages/dokkai_p${i + 1}.jpg`,
    hasAudio: false
  })),

  // 4. 聴解 (16 trang: 28 - 43)
  ...Array.from({ length: 16 }, (_, i) => ({
    pageNum: 27 + i + 1,
    sectionId: "choukai",
    sectionTitle: "Phần 4: Nghe hiểu (聴解) 🎧",
    image: `/dethimauN5/pages/choukai_p${i + 1}.jpg`,
    hasAudio: true,
    // Gắn audio tự động theo từng mondai
    audioTrack: i + 1 <= 8 ? 0 : i + 1 <= 12 ? 1 : i + 1 <= 14 ? 2 : 3,
    audioLabel: i + 1 <= 8 ? "Audio 問題 1 (Trang 1 - 8)" : i + 1 <= 12 ? "Audio 問題 2 (Trang 9 - 12)" : i + 1 <= 14 ? "Audio 問題 3 (Trang 13 - 14)" : "Audio 問題 4 (Trang 15 - 16)"
  }))
];

export const AUDIO_TRACKS = [
  { id: 0, name: "Audio 問題 1 (課題理解)", file: "/dethimauN5/audio/N5Q1.mp3" },
  { id: 1, name: "Audio 問題 2 (ポイント理解)", file: "/dethimauN5/audio/N5Q2.mp3" },
  { id: 2, name: "Audio 問題 3 (発話表現)", file: "/dethimauN5/audio/N5Q3.mp3" },
  { id: 3, name: "Audio 問題 4 (即時応答)", file: "/dethimauN5/audio/N5Q4.mp3" }
];

// Cấu trúc danh sách câu hỏi & đáp án chuẩn
export const EXAM_SECTIONS = [
  {
    id: "mojigoi",
    title: "1. Từ vựng & Hán tự (文字・語彙)",
    mondais: [
      {
        mondai: 1,
        title: "問題１: Cách đọc chữ Hán gạch chân",
        startQ: 1,
        answers: [2, 4, 1, 2, 2, 3, 4, 2, 2, 3]
      },
      {
        mondai: 2,
        title: "問題２: Chọn chữ Hán / Katakana đúng",
        startQ: 11,
        answers: [1, 2, 3, 4, 4, 1, 3, 1]
      },
      {
        mondai: 3,
        title: "問題３: Chọn từ thích hợp điền vào",
        startQ: 19,
        answers: [4, 3, 1, 1, 3, 2, 1, 4, 2, 4]
      },
      {
        mondai: 4,
        title: "問題４: Câu có ý nghĩa tương đương",
        startQ: 29,
        answers: [3, 1, 2, 3, 4]
      }
    ]
  },
  {
    id: "bunpou",
    title: "2. Ngữ pháp (文法)",
    mondais: [
      {
        mondai: 1,
        title: "問題１: Điền từ vào chỗ trống (Ngữ pháp & Trợ từ)",
        startQ: 1,
        answers: [2, 3, 2, 4, 3, 2, 3, 1, 3, 3, 1, 1, 4, 2, 4, 1]
      },
      {
        mondai: 2,
        title: "問題２: Sắp xếp câu sao (*)",
        startQ: 17,
        answers: [4, 1, 4, 2, 2]
      },
      {
        mondai: 3,
        title: "問題３: Điền đoạn văn (Đục lỗ)",
        startQ: 22,
        answers: [4, 2, 4, 3, 1]
      }
    ]
  },
  {
    id: "dokkai",
    title: "3. Đọc hiểu (読解)",
    mondais: [
      {
        mondai: 4,
        title: "問題４: Đoản văn ngắn",
        startQ: 27,
        answers: [2, 3, 4]
      },
      {
        mondai: 5,
        title: "問題５: Trung văn",
        startQ: 30,
        answers: [4, 1]
      },
      {
        mondai: 6,
        title: "問題６: Tìm kiếm thông tin",
        startQ: 32,
        answers: [2]
      }
    ]
  },
  {
    id: "choukai",
    title: "4. Nghe hiểu (聴解)",
    mondais: [
      {
        mondai: 1,
        title: "問題１: 課題理解 (Có hình)",
        startQ: 1,
        answers: [2, 2, 3, 3, 1, 4, 4]
      },
      {
        mondai: 2,
        title: "問題２: ポイント理解 (Điểm mấu chốt)",
        startQ: 1,
        answers: [4, 3, 2, 4, 1, 3]
      },
      {
        mondai: 3,
        title: "問題３: 発話表現 (Tranh nhìn mũi tên)",
        startQ: 1,
        answers: [1, 3, 2, 3, 2]
      },
      {
        mondai: 4,
        title: "問題４: 即時応答 (Đối đáp ngắn)",
        startQ: 1,
        answers: [1, 1, 2, 3, 3, 1]
      }
    ]
  }
];
