import type { Annotation, ChatMsg, CourseDay, CourseDoc, Slide } from "./types";

export const COURSE_CODE = "COMP2010";

/** Tài liệu mở sẵn khi vào màn hình. */
export const DEFAULT_DOC_ID = "d6-main";
export const DEFAULT_PAGE = 2;
export const DEFAULT_ZOOM = 111;

export const COURSE_DAYS: CourseDay[] = [
  {
    id: "day-1",
    label: "Day 1",
    topic: "Tư duy sản phẩm AI · khai mạc",
    topicEn: "AI product mindset · kickoff",
    status: "ACTIVE",
    documents: [
      {
        id: "d1-main",
        name: "day01-ai-product-mindset.pdf",
        meta: "Lecture_material_kq81ba4_zn02vc",
        pages: 28,
      },
      {
        id: "d1-worksheet",
        name: "day01-warmup-worksheet.pdf",
        meta: "Worksheet_kq81ba4_pl77dd",
        pages: 6,
      },
    ],
  },
  {
    id: "day-2",
    label: "Day 2",
    topic: "JTBD & bằng chứng người dùng",
    topicEn: "JTBD & user evidence",
    status: "ACTIVE",
    documents: [
      {
        id: "d2-main",
        name: "day02-jtbd-and-user-evidence.pdf",
        meta: "Lecture_material_h3m9xt2_bw41qs",
        pages: 31,
      },
    ],
  },
  {
    id: "day-3",
    label: "Day 3",
    topic: "Viết AI Spec",
    topicEn: "Writing the AI Spec",
    status: "ACTIVE",
    documents: [
      {
        id: "d3-main",
        name: "day03-ai-spec-writing.pdf",
        meta: "Lecture_material_pv52kd8_te19gm",
        pages: 34,
      },
      {
        id: "d3-template",
        name: "day03-spec-template.pdf",
        meta: "Template_pv52kd8_rr06hn",
        pages: 9,
      },
    ],
  },
  {
    id: "day-4",
    label: "Day 4",
    topic: "Prompt, eval và golden set",
    topicEn: "Prompting, eval and golden sets",
    status: "ACTIVE",
    documents: [
      {
        id: "d4-main",
        name: "day04-prompt-and-eval-basics.pdf",
        meta: "Lecture_material_zc70we5_ad38jy",
        pages: 40,
      },
      {
        id: "d4-lab",
        name: "day04-golden-set-lab.pdf",
        meta: "Lab_zc70we5_qk22uf",
        pages: 12,
      },
      {
        id: "d4-cheatsheet",
        name: "day04-eval-cheatsheet.pdf",
        meta: "Handout_zc70we5_mv13ok",
        pages: 4,
      },
    ],
  },
  {
    id: "day-5",
    label: "Day 5",
    topic: "Prototype & kịch bản demo",
    topicEn: "Prototyping & demo scripts",
    status: "ACTIVE",
    documents: [
      {
        id: "d5-main",
        name: "day05-prototype-with-ai.pdf",
        meta: "Lecture_material_ng46sl1_ci85rx",
        pages: 36,
      },
      {
        id: "d5-demo",
        name: "day05-demo-structure.pdf",
        meta: "Handout_ng46sl1_jd94bp",
        pages: 14,
      },
      {
        id: "d5-risk",
        name: "day05-risk-scenarios.pdf",
        meta: "Worksheet_ng46sl1_ow57ez",
        pages: 11,
      },
    ],
  },
  {
    id: "day-6",
    label: "Day 6",
    topic: "Quản lý sản phẩm & dự án AI",
    topicEn: "AI product & project management",
    status: "ACTIVE",
    studying: true,
    documents: [
      {
        id: DEFAULT_DOC_ID,
        name: "day06-ai-product-project-management.pdf",
        meta: "Lecture_material_ms204yc9_gxpg9y",
        pages: 37,
      },
    ],
  },
];

export const ALL_DOCS: CourseDoc[] = COURSE_DAYS.flatMap((d) => d.documents);

export function findDoc(docId: string): CourseDoc {
  return ALL_DOCS.find((d) => d.id === docId) ?? COURSE_DAYS[5].documents[0];
}

export function findDayOfDoc(docId: string): CourseDay {
  return (
    COURSE_DAYS.find((d) => d.documents.some((doc) => doc.id === docId)) ??
    COURSE_DAYS[5]
  );
}

/* ------------------------------------------------------------------ */
/* Nội dung slide giả lập                                              */
/* ------------------------------------------------------------------ */

/** Slide được soạn tay cho các trang đầu — phần còn lại sinh từ FILLER. */
const AUTHORED: Omit<Slide, "page">[] = [
  {
    kind: "cover",
    title: "AI Product & Project Management",
    subtitle: "AICB-P1 · Ngày 6 · Quản lý sản phẩm AI như thế nào?",
    body: "Tên Giảng Viên",
    footnote: "VinUniversity · Phase 1 · Tuần 1 · 2026",
  },
  {
    kind: "think",
    eyebrow: "HÃY SUY NGHĨ...",
    title:
      "Team đã build 3 tuần. Nhưng stakeholder muốn đổi requirements. Làm sao xử lý?",
    footnote: "Giữ câu hỏi này trong đầu khi học bài hôm nay",
  },
  {
    kind: "section",
    eyebrow: "PHẦN 1",
    title: "Vì sao quản lý sản phẩm AI khác đi",
    subtitle: "Ba nguồn bất định mà dự án phần mềm thường không có",
  },
  {
    kind: "bullets",
    eyebrow: "BỐI CẢNH",
    title: "Ba điều khiến dự án AI khó ước lượng",
    bullets: [
      "Chất lượng đầu ra là phân phối xác suất, không phải trạng thái đúng/sai.",
      "Chi phí và độ trễ thay đổi theo prompt, model và lưu lượng thật.",
      "Người dùng đổi kỳ vọng ngay khi họ chạm vào bản chạy đầu tiên.",
    ],
    footnote: "Hệ quả: kế hoạch phải bám vào bằng chứng, không bám vào niềm tin.",
  },
  {
    kind: "compare",
    eyebrow: "SO SÁNH",
    title: "Phần mềm truyền thống vs sản phẩm AI",
    columns: [
      {
        heading: "Phần mềm truyền thống",
        items: [
          "Requirement rõ → test pass/fail",
          "Bug tái hiện được",
          "Ước lượng theo số màn hình",
          "Chốt scope là chốt kết quả",
        ],
      },
      {
        heading: "Sản phẩm AI",
        items: [
          "Requirement mờ → cần quality bar",
          "Lỗi mang tính xác suất",
          "Ước lượng theo số vòng eval",
          "Chốt scope chỉ chốt phạm vi thử",
        ],
      },
    ],
  },
  {
    kind: "bullets",
    eyebrow: "VÒNG ĐỜI",
    title: "Năm chặng của một sản phẩm AI",
    bullets: [
      "Khám phá — tìm bằng chứng cho job cần giải.",
      "Spec — chốt lát cắt, quality bar và cách đo.",
      "Prototype — chạy thật ít nhất một lời gọi AI.",
      "Eval — đo trên golden set, ghi nhận trung thực.",
      "Validation — đưa cho người dùng thật, sửa theo phản hồi.",
    ],
  },
  {
    kind: "section",
    eyebrow: "PHẦN 2",
    title: "Khi requirements thay đổi giữa chừng",
    subtitle: "Xử lý thay đổi mà không phá kế hoạch",
  },
  {
    kind: "bullets",
    eyebrow: "CHẨN ĐOÁN",
    title: "Scope creep thường vào cửa nào?",
    bullets: [
      "Stakeholder mới xuất hiện sau khi team đã bắt đầu build.",
      "Demo giữa kỳ khiến người xem nghĩ ra tính năng mới.",
      "Tiêu chí thành công chưa bao giờ được viết ra thành số.",
      "Một lỗi lẻ được nâng cấp thành yêu cầu lớn.",
    ],
  },
  {
    kind: "checklist",
    eyebrow: "QUY TRÌNH",
    title: "Bốn bước xử lý yêu cầu thay đổi",
    bullets: [
      "Làm rõ: thay đổi này giải quyết vấn đề gì cho ai?",
      "Định lượng: ảnh hưởng tới phạm vi, thời gian, nguồn lực bao nhiêu?",
      "Đưa lựa chọn: đổi ngay · làm sau · đánh đổi với hạng mục khác.",
      "Chốt bằng văn bản: cập nhật spec và thông báo lại cho cả nhóm.",
    ],
    footnote: "Không từ chối ngay, cũng không gật đầu ngay.",
  },
  {
    kind: "quote",
    eyebrow: "GHI NHỚ",
    title:
      "Nói không với một thay đổi là bảo vệ lời hứa bạn đã đưa ra cho thay đổi trước đó.",
    footnote: "Ưu tiên là một danh sách có thứ tự, không phải một cái túi.",
  },
  {
    kind: "section",
    eyebrow: "PHẦN 3",
    title: "Đo lường và chất lượng",
    subtitle: "Quality bar, golden set và cách đọc kết quả",
  },
  {
    kind: "bullets",
    eyebrow: "QUALITY BAR",
    title: "Chốt trước, giữ nguyên sau đó",
    bullets: [
      "Viết bằng con số: tỷ lệ đạt, độ trễ tối đa, chi phí mỗi lượt.",
      "Gắn với một lát cắt cụ thể, không phải toàn bộ sản phẩm.",
      "Ai cũng đọc được trong 30 giây — nếu không, viết lại.",
      "Thay đổi quality bar giữa chừng là thay đổi kết quả đo.",
    ],
  },
  {
    kind: "bullets",
    eyebrow: "GOLDEN SET",
    title: "Bộ ca kiểm thử tối thiểu",
    bullets: [
      "20–30 ca là đủ để thấy xu hướng ở giai đoạn prototype.",
      "Trộn ca dễ, ca khó và ca nên từ chối trả lời.",
      "Ghi rõ đầu vào, đầu ra mong đợi và lý do chấm đạt.",
      "Chạy lại nguyên bộ sau mỗi lần đổi prompt.",
    ],
  },
  {
    kind: "compare",
    eyebrow: "RỦI RO",
    title: "Rủi ro kỹ thuật vs rủi ro sản phẩm",
    columns: [
      {
        heading: "Kỹ thuật",
        items: [
          "Model trả lời sai tự tin",
          "Chi phí vượt ngân sách",
          "Độ trễ vượt ngưỡng chịu đựng",
          "Phụ thuộc một nhà cung cấp",
        ],
      },
      {
        heading: "Sản phẩm",
        items: [
          "Giải đúng bài toán không ai cần",
          "Người dùng không tin kết quả",
          "Không đo được giá trị mang lại",
          "Quy trình cũ vẫn nhanh hơn",
        ],
      },
    ],
  },
  {
    kind: "checklist",
    eyebrow: "TRƯỚC DEMO",
    title: "Checklist 6 mục cần chuẩn bị",
    bullets: [
      "Một câu nói rõ sản phẩm giải job gì cho ai.",
      "Bằng chứng dẫn tới quyết định thiết kế.",
      "Bản chạy được với ít nhất một lời gọi AI thật.",
      "Bảng kết quả eval kèm ca thất bại.",
      "Phản hồi từ vòng user test.",
      "Kịch bản dự phòng khi demo hỏng.",
    ],
  },
  {
    kind: "bullets",
    eyebrow: "TÓM LẠI",
    title: "Ba điều mang về từ hôm nay",
    bullets: [
      "Kế hoạch AI là kế hoạch học — mỗi vòng lặp phải trả lời một câu hỏi.",
      "Thay đổi yêu cầu là tín hiệu, không phải tai nạn — hãy định lượng nó.",
      "Không có phép đo trung thực thì không có tiến bộ để báo cáo.",
    ],
  },
];

/** Nội dung cho các trang còn lại — cố định, không random để tránh lệch hydrate. */
const FILLER: { eyebrow: string; title: string; bullets: string[] }[] = [
  {
    eyebrow: "VAI TRÒ",
    title: "Ai làm gì trong nhóm sản phẩm AI",
    bullets: [
      "Product owner giữ job và quality bar.",
      "Kỹ sư giữ vòng lặp eval chạy được hằng ngày.",
      "Người thiết kế giữ kịch bản khi AI trả lời sai.",
    ],
  },
  {
    eyebrow: "NHỊP LÀM VIỆC",
    title: "Một tuần trông như thế nào",
    bullets: [
      "Đầu tuần: chọn một giả thuyết để kiểm chứng.",
      "Giữa tuần: chạy eval và ghi lại số liệu thô.",
      "Cuối tuần: quyết định giữ, sửa hay bỏ.",
    ],
  },
  {
    eyebrow: "ƯU TIÊN",
    title: "Xếp hạng bằng ba câu hỏi",
    bullets: [
      "Nếu bỏ đi, người dùng có nhận ra không?",
      "Ta có cách đo kết quả trong tuần này không?",
      "Chi phí sai lầm là bao nhiêu?",
    ],
  },
  {
    eyebrow: "ƯỚC LƯỢNG",
    title: "Đếm vòng lặp, đừng đếm giờ",
    bullets: [
      "Một vòng = đổi prompt, chạy eval, đọc kết quả.",
      "Ghi lại số vòng thực tế đã tốn cho mỗi lát cắt.",
      "Dùng số đó cho lần ước lượng kế tiếp.",
    ],
  },
  {
    eyebrow: "GIAO TIẾP",
    title: "Báo cáo tiến độ cho stakeholder",
    bullets: [
      "Nói bằng kết quả đo, không bằng số commit.",
      "Nêu rõ điều đang chặn và cần ai gỡ.",
      "Luôn kèm một quyết định cần người khác chốt.",
    ],
  },
  {
    eyebrow: "TÀI LIỆU",
    title: "Spec sống cùng sản phẩm",
    bullets: [
      "Mỗi thay đổi lớn để lại một dòng lịch sử.",
      "Phần nào là mock thì ghi rõ là mock.",
      "Không ai nhớ được lý do — nên hãy viết lý do.",
    ],
  },
  {
    eyebrow: "CHI PHÍ",
    title: "Ba con số cần theo dõi",
    bullets: [
      "Chi phí trung bình mỗi lượt trả lời.",
      "Số token đầu vào bị lãng phí mỗi ngày.",
      "Tỷ lệ lượt phải chạy lại vì kết quả kém.",
    ],
  },
  {
    eyebrow: "AN TOÀN",
    title: "Chỗ AI được phép sai",
    bullets: [
      "Liệt kê nơi sai sót gây hậu quả thật.",
      "Ở những chỗ đó, để con người xác nhận cuối.",
      "Ghi lại mọi lần hệ thống từ chối trả lời.",
    ],
  },
  {
    eyebrow: "TRẢI NGHIỆM",
    title: "Thiết kế cho lúc AI trả lời sai",
    bullets: [
      "Hiển thị nguồn để người dùng tự kiểm chứng.",
      "Cho phép sửa và gửi lại trong một thao tác.",
      "Đừng giấu độ không chắc chắn.",
    ],
  },
  {
    eyebrow: "PHẢN HỒI",
    title: "Thu thập tín hiệu từ người dùng thật",
    bullets: [
      "Nút thích/không thích là tín hiệu rẻ nhất.",
      "Năm phút quan sát hơn năm trang khảo sát.",
      "Lưu lại câu hỏi mà hệ thống trả lời tệ nhất.",
    ],
  },
  {
    eyebrow: "DỮ LIỆU",
    title: "Ranh giới khi dùng dữ liệu thật",
    bullets: [
      "Chỉ đưa vào phần tối thiểu cần cho việc đang làm.",
      "Ẩn danh trước khi chia sẻ ra ngoài nhóm.",
      "Không commit khoá API vào repo.",
    ],
  },
  {
    eyebrow: "BÀN GIAO",
    title: "Bàn giao cho người tiếp theo",
    bullets: [
      "Người mới chạy được prototype trong 15 phút.",
      "Golden set và kết quả gần nhất nằm cùng repo.",
      "Danh sách việc chưa làm được ghi thành issue.",
    ],
  },
];

/**
 * Nội dung riêng cho từng buổi khác, để tìm kiếm ở phạm vi "Cả môn" trả về
 * kết quả thật sự khác nhau giữa các tài liệu thay vì lặp lại một bộ slide.
 */
const DAY_DECKS: Record<string, { eyebrow: string; title: string; bullets: string[] }[]> = {
  "day-1": [
    {
      eyebrow: "KHỞI ĐỘNG",
      title: "Sản phẩm AI khác phần mềm ở chỗ nào",
      bullets: [
        "Đầu ra không cố định — cùng đầu vào có thể ra hai kết quả.",
        "Giá trị nằm ở tỷ lệ đúng, không nằm ở việc chạy không lỗi.",
        "Người dùng đánh giá bằng cảm nhận trước khi đánh giá bằng số.",
      ],
    },
    {
      eyebrow: "TƯ DUY",
      title: "Bắt đầu từ job, không bắt đầu từ model",
      bullets: [
        "Hỏi người dùng đang cố hoàn thành việc gì.",
        "Tìm cách họ đang xoay xở khi chưa có sản phẩm của bạn.",
        "Chỉ chọn AI khi cách cũ thật sự chậm hoặc tốn.",
      ],
    },
    {
      eyebrow: "CẠM BẪY",
      title: "Ba cái bẫy của nhóm mới làm AI",
      bullets: [
        "Chạy theo tính năng nghe hay thay vì việc người dùng cần.",
        "Demo bằng ca đẹp nhất rồi tưởng sản phẩm đã xong.",
        "Không ai trong nhóm chịu trách nhiệm về chất lượng đầu ra.",
      ],
    },
    {
      eyebrow: "BÀI TẬP",
      title: "Viết một câu mô tả sản phẩm",
      bullets: [
        "Ai · đang gặp vấn đề gì · sản phẩm giúp họ làm được gì.",
        "Không dùng từ chuyên môn nào trong câu đó.",
        "Đọc cho một người ngoài nhóm nghe — họ hiểu là đạt.",
      ],
    },
  ],
  "day-2": [
    {
      eyebrow: "JTBD",
      title: "Jobs To Be Done — người dùng thuê sản phẩm làm gì",
      bullets: [
        "Job là kết quả người dùng muốn đạt, không phải tính năng.",
        "Mỗi job có hoàn cảnh kích hoạt và tiêu chí thành công riêng.",
        "Đối thủ thật sự của bạn có thể là một tờ giấy nháp.",
      ],
    },
    {
      eyebrow: "PHỎNG VẤN",
      title: "Hỏi về quá khứ, đừng hỏi về tương lai",
      bullets: [
        "“Lần gần nhất bạn làm việc đó là khi nào?” hơn “bạn có muốn...”.",
        "Đi theo dòng thời gian: trước, trong, sau khi gặp vấn đề.",
        "Ghi nguyên văn — đừng diễn giải trong lúc phỏng vấn.",
      ],
    },
    {
      eyebrow: "BẰNG CHỨNG",
      title: "Phân biệt bằng chứng với ý kiến",
      bullets: [
        "Bằng chứng: có thời điểm, có số, có người cụ thể.",
        "Ý kiến: “chắc là”, “em nghĩ”, “mọi người đều”.",
        "Một trích dẫn nguyên văn đáng giá hơn mười dòng tóm tắt.",
      ],
    },
    {
      eyebrow: "KHAI THÁC DỮ LIỆU",
      title: "Đào bằng chứng từ chatlog có sẵn",
      bullets: [
        "Phân loại câu hỏi trước, đếm sau.",
        "Tìm nhóm câu bị trả lời tệ nhất — đó là điểm đau.",
        "Ghi mã đoạn hội thoại để người khác kiểm chứng lại được.",
      ],
    },
  ],
  "day-3": [
    {
      eyebrow: "AI SPEC",
      title: "Spec là bản ghi chuỗi quyết định",
      bullets: [
        "Mỗi quyết định phải trỏ về một bằng chứng cụ thể.",
        "Viết cả phương án đã loại và lý do loại.",
        "Người đọc spec phải build lại được mà không cần hỏi bạn.",
      ],
    },
    {
      eyebrow: "LÁT CẮT",
      title: "Chọn lát cắt đủ nhỏ để đo trong một ngày",
      bullets: [
        "Một luồng từ đầu đến cuối, không phải một nửa của nhiều luồng.",
        "Có đầu vào thật, đầu ra thật, và cách chấm đạt.",
        "Nếu không đo được trong hôm nay thì lát cắt còn to.",
      ],
    },
    {
      eyebrow: "QUALITY BAR",
      title: "Viết ngưỡng chất lượng bằng con số",
      bullets: [
        "Tỷ lệ đạt tối thiểu trên golden set.",
        "Độ trễ tối đa người dùng còn chấp nhận.",
        "Chi phí trần cho mỗi lượt trả lời.",
      ],
    },
    {
      eyebrow: "CẤU TRÚC",
      title: "Bảy mục bắt buộc của spec",
      bullets: [
        "Bối cảnh · bằng chứng · người dùng · lát cắt.",
        "Chỗ khó · kịch bản rủi ro · cách kiểm thử.",
        "Mỗi mục một trang, không dài hơn.",
      ],
    },
  ],
  "day-4": [
    {
      eyebrow: "PROMPT",
      title: "Prompt là giao diện, không phải câu thần chú",
      bullets: [
        "Nói rõ vai trò, đầu vào, định dạng đầu ra và điều kiện từ chối.",
        "Đưa ví dụ mẫu thay vì mô tả dài dòng.",
        "Mỗi lần sửa prompt chỉ đổi một biến để biết cái gì có tác dụng.",
      ],
    },
    {
      eyebrow: "GOLDEN SET",
      title: "Dựng bộ ca kiểm thử trong 30 phút",
      bullets: [
        "Lấy 20–30 câu hỏi thật từ log, không tự bịa.",
        "Chia ba nhóm: dễ, khó, và nên từ chối.",
        "Ghi đầu ra mong đợi cùng lý do chấm đạt.",
      ],
    },
    {
      eyebrow: "CHẤM ĐIỂM",
      title: "Ba cách chấm và khi nào dùng cái nào",
      bullets: [
        "So khớp chính xác — cho câu có đáp án duy nhất.",
        "Người chấm theo rubric — cho câu mở, tốn thời gian nhất.",
        "LLM chấm theo rubric — nhanh, nhưng phải hiệu chuẩn với người.",
      ],
    },
    {
      eyebrow: "ĐỌC KẾT QUẢ",
      title: "Con số nào đáng tin",
      bullets: [
        "Chênh lệch dưới 5% trên 20 ca thường là nhiễu.",
        "Luôn nhìn ca thất bại trước khi nhìn tỷ lệ tổng.",
        "Ghi lại phiên bản prompt cùng với kết quả.",
      ],
    },
  ],
  "day-5": [
    {
      eyebrow: "PROTOTYPE",
      title: "Ba mức prototype và ranh giới của chúng",
      bullets: [
        "Sketch — hình vẽ, dùng để tranh luận về luồng.",
        "Mock — bấm được, dữ liệu giả, dùng để test phản ứng.",
        "Working — có lời gọi AI thật, dùng để đo chất lượng.",
      ],
    },
    {
      eyebrow: "GHI RÕ",
      title: "Nói thẳng phần nào là mock",
      bullets: [
        "Người xem demo phải biết đâu là thật, đâu là dựng.",
        "Giấu phần mock là cách nhanh nhất mất niềm tin.",
        "Ghi ngay trong README của repo.",
      ],
    },
    {
      eyebrow: "DEMO",
      title: "Cấu trúc demo sáu trang",
      bullets: [
        "Vấn đề · bằng chứng · lát cắt · bản chạy · số đo · bước tiếp theo.",
        "Bắt đầu bằng người dùng, không bắt đầu bằng kiến trúc.",
        "Chừa 30 giây cho ca thất bại — nó làm demo đáng tin hơn.",
      ],
    },
    {
      eyebrow: "DỰ PHÒNG",
      title: "Khi demo hỏng giữa chừng",
      bullets: [
        "Chuẩn bị bản ghi màn hình của luồng chính.",
        "Có sẵn kết quả đã chạy trước để trình bày.",
        "Đừng sửa code trên sân khấu.",
      ],
    },
  ],
};

export function getSlide(page: number, doc: CourseDoc): Slide {
  const total = doc.pages;
  const isMain = doc.id === DEFAULT_DOC_ID;

  if (page === total) {
    return {
      page,
      kind: "closing",
      eyebrow: "KẾT THÚC",
      title: isMain ? "Cảm ơn — và giờ tới lượt bạn" : "Cảm ơn",
      subtitle: isMain
        ? "Câu hỏi ở trang 2 giờ bạn trả lời thế nào?"
        : prettifyDocName(doc.name),
      footnote: `${doc.name} · trang ${page}/${total}`,
    };
  }

  if (!isMain) {
    // Tài liệu của buổi khác dùng bộ slide riêng của buổi đó.
    const day = findDayOfDoc(doc.id);
    if (page === 1) {
      return {
        page,
        kind: "cover",
        title: prettifyDocName(doc.name),
        subtitle: `${day.label} · ${day.topic}`,
        body: "Tên Giảng Viên",
        footnote: "VinUniversity · Phase 1 · Tuần 1 · 2026",
      };
    }
    const deck = DAY_DECKS[day.id] ?? FILLER;
    const entry = deck[(page - 2) % deck.length];
    return {
      page,
      kind: "bullets",
      eyebrow: entry.eyebrow,
      title: entry.title,
      bullets: entry.bullets,
      footnote: `${doc.name} · trang ${page}/${total}`,
    };
  }

  const authored = AUTHORED[page - 1];
  if (authored) return { page, ...authored };

  const filler = FILLER[(page - AUTHORED.length - 1) % FILLER.length];
  return {
    page,
    kind: "bullets",
    eyebrow: filler.eyebrow,
    title: filler.title,
    bullets: filler.bullets,
    footnote: `${doc.name} · trang ${page}/${total}`,
  };
}

function prettifyDocName(name: string): string {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/^day\d+-/i, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Trạng thái khởi tạo                                                 */
/* ------------------------------------------------------------------ */

/** Một vệt highlight có sẵn để toolbar hiển thị "Trang 2 · 1 note". */
export const SEED_ANNOTATIONS: Annotation[] = [
  {
    id: "seed-note-1",
    docId: DEFAULT_DOC_ID,
    page: DEFAULT_PAGE,
    tool: "highlight",
    color: "#facc15",
    size: 2,
    x: 26,
    y: 52,
  },
];

export const SEED_MESSAGES: ChatMsg[] = [
  {
    id: "seed-q",
    role: "user",
    seedKey: "sampleQuestion",
    time: "09:12",
  },
  {
    id: "seed-a",
    role: "assistant",
    seedKey: "sampleAnswer",
    sourcePage: 2,
    time: "09:12",
  },
];

export const PEN_COLORS = ["#e0212b", "#0d2a63", "#2557d9", "#16a34a", "#111827"];
export const HIGHLIGHT_COLORS = [
  "#facc15",
  "#86efac",
  "#93c5fd",
  "#fda4af",
  "#c4b5fd",
];
export const ZOOM_STEPS = [50, 67, 80, 90, 100, 111, 125, 150, 175, 200];
