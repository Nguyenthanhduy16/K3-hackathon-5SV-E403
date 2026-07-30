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
    topic: "Nền tảng AI & LLM",
    topicEn: "AI & LLM foundation",
    status: "ACTIVE",
    documents: [
      {
        id: "d1-main",
        name: "day01-ai-llm-foundation.pdf",
        meta: "Lecture_material_kq81ba4_zn02vc",
        pages: 29,
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
    topic: "Xác định bài toán cho AI",
    topicEn: "Framing the problem for AI",
    status: "ACTIVE",
    documents: [
      {
        id: "d2-main",
        name: "day02-ai-problem-framing.pdf",
        meta: "Lecture_material_h3m9xt2_bw41qs",
        pages: 29,
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
 * Deck soạn ĐẦY ĐỦ theo từng trang, tóm lược từ PDF thật trong
 * `data/vlearn-pack/slide/` (d1/d2-slide-hackathon.pdf, mỗi file 29 trang).
 * Tên giảng viên giữ nguyên dạng ẩn danh theo quy định bảo mật data pack.
 */
const DOC_DECKS: Record<string, Omit<Slide, "page">[]> = {
  "d1-main": [
    {
      kind: "cover",
      title: "AI & LLM Foundation",
      subtitle: "Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?",
      body: "Tên Giảng Viên",
      footnote: "AI IN ACTION · Hackathon · Day 1",
    },
    {
      kind: "bullets",
      eyebrow: "AGENDA",
      title: "Từ “nghe AI” đến “gọi AI” trong một ngày",
      bullets: [
        "Bức tranh AI: các tầng AI · ML · Deep Learning · GenAI · LLM.",
        "Lịch sử AI 70 năm — hai mùa đông và những bước ngoặt.",
        "Bên trong LLM: token, context, attention, cách model được luyện.",
        "Từ LLM đến AI Agent — bốn mức độ năng lực.",
        "Landscape hôm nay: chọn model theo tầng và chi phí token.",
        "Gọi API lần đầu · tổng kết những ý mang về.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "CÁC TẦNG AI",
      title: "AI, ML, Deep Learning, GenAI, LLM — từ rộng đến hẹp",
      bullets: [
        "AI — chiếc ô lớn nhất: mọi hệ thống có yếu tố “thông minh”, kể cả hệ luật tay.",
        "Machine learning — học từ dữ liệu thay vì viết luật tay: lọc spam, gợi ý phim.",
        "Deep learning — mạng nơ-ron nhiều tầng tự học đặc trưng: nhận diện ảnh, giọng nói.",
        "Generative AI — sinh nội dung mới: văn bản, ảnh, code.",
        "LLM — model nền chuyên ngôn ngữ (GPT, Claude, Kimi) — tim của làn sóng hiện nay.",
      ],
      footnote: "LLM không phải toàn bộ AI — nhưng là tầng nền của gần hết trải nghiệm AI bạn dùng hôm nay.",
    },
    {
      kind: "bullets",
      eyebrow: "BA NHÓM AI",
      title: "Phân loại · sinh nội dung · hành động",
      bullets: [
        "Discriminative AI — phân loại, dự đoán: lọc spam, phát hiện gian lận. Input → một nhãn.",
        "Generative AI — sinh ra thứ mới: ChatGPT, Claude, Midjourney. Prompt → nội dung mới.",
        "Agentic AI — nhận mục tiêu rồi tự làm nhiều bước: Goal → Plan → Action.",
        "LLM là engine chung của cả Generative lẫn Agentic AI.",
      ],
      footnote: "Hành trình khoá học: LLM Foundation → Agent → Multi-Agent → Deploy → Evaluate.",
    },
    {
      kind: "section",
      eyebrow: "LỊCH SỬ",
      title: "Lịch sử AI 70 năm",
      subtitle: "Khai sinh · hai mùa đông · từ model đơn lẻ sang hệ thống biết hành động như agent",
    },
    {
      kind: "bullets",
      eyebrow: "1980",
      title: "Hệ chuyên gia — AI đổi chiến lược",
      bullets: [
        "Thôi theo đuổi trí tuệ tổng quát, tập trung giải thật tốt một miền hẹp.",
        "Mã hoá tri thức chuyên gia thành luật.",
        "Đặt lại vấn đề: “nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?”",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "2009",
      title: "Fei-Fei Li và ImageNet — cuộc cách mạng của dữ liệu",
      bullets: [
        "Cả ngành chạy theo thuật toán khôn hơn; ImageNet chọn xây bộ dữ liệu lớn hơn.",
        "14 triệu ảnh gán nhãn tay, hơn 20.000 loại vật.",
        "Ba năm sau, chính bộ dữ liệu đó là sân khấu cho cú nổ AlexNet 2012.",
      ],
      footnote: "Bài học định hình kỷ nguyên: đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn.",
    },
    {
      kind: "bullets",
      eyebrow: "2017",
      title: "Transformer — bước ngoặt của hiểu ngôn ngữ",
      bullets: [
        "Mỗi từ có thể “nhìn sang” những từ quan trọng khác trong cả câu.",
        "Thay lối đọc tuần tự từng bước của các thế hệ trước.",
        "Trở thành nền móng kỹ thuật cho GPT, BERT và toàn bộ làn sóng LLM sau đó.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "2022",
      title: "ChatGPT — AI thành trải nghiệm đại chúng",
      bullets: [
        "Lần đầu người dùng phổ thông chạm trực tiếp vào một mô hình ngôn ngữ mạnh.",
        "Giao diện đơn giản đến mức ai cũng hiểu cách dùng.",
        "Mở màn làn sóng sản phẩm LLM đại chúng hiện nay.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "LLM LÀ GÌ",
      title: "Một bộ não nền, không phải một chatbot",
      bullets: [
        "Mô hình ngôn ngữ rất lớn trên kiến trúc Transformer, luyện trên hàng nghìn tỷ mảnh chữ.",
        "Học một việc duy nhất: đoán mảnh chữ tiếp theo trong ngữ cảnh.",
        "Luyện đủ rộng thì thành nền chung: cùng một model làm chatbot, tóm tắt, viết code, dịch.",
        "Chatbot chỉ là một dạng sản phẩm đóng gói quanh bộ não đó — lớp áo bên ngoài.",
      ],
      footnote: "Model hiện nay chủ yếu decoder-only, nhiều model dùng MoE; sau pre-training còn SFT, RLHF/DPO và luyện suy luận.",
    },
    {
      kind: "bullets",
      eyebrow: "CƠ CHẾ",
      title: "Đầu ra của Transformer luôn là một phân bố xác suất",
      bullets: [
        "Với mọi ngữ cảnh, model chấm điểm MỌI từ trong từ vựng.",
        "“land” 22%, “forest” 9%… — rồi chọn theo xác suất đó.",
        "Bên trong model không có khái niệm “đáp án duy nhất”.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "CƠ CHẾ",
      title: "Sinh văn bản = đoán → nối vào câu → đoán tiếp",
      bullets: [
        "Mỗi token mới được nối vào ngữ cảnh.",
        "Model chạy lại từ đầu với ngữ cảnh mới — vòng lặp predict → append → rerun.",
        "Câu dài được sinh từng mảnh một, không có dàn ý tổng viết sẵn.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "TOKEN",
      title: "Model không đọc “từ”, model đọc mảnh chữ",
      bullets: [
        "Văn bản bị cắt thành token: có từ một mảnh, có từ vỡ ba bốn mảnh, dấu câu cũng là mảnh.",
        "“Hello world” ≈ 2 token, nhưng “Xin chào” có thể tới 3–4 token.",
        "Tiếng Việt, code, JSON tốn token hơn tiếng Anh thường — vì dấu thanh và ký tự đặc biệt.",
      ],
      footnote: "Mọi thứ model làm đều quy ra token — và mỗi token đều có giá.",
    },
    {
      kind: "bullets",
      eyebrow: "CONTEXT",
      title: "Bàn làm việc có hạn của model",
      bullets: [
        "Mỗi lần trả lời, model chỉ nhìn được một lượng chữ có hạn — gọi là context.",
        "128K token ≈ một cuốn sách 300 trang; 1M token ≈ 45 cuốn trên bàn cùng lúc.",
        "Bàn đầy quá thì đồ ở giữa dễ bị bỏ sót — hiện tượng “lost in the middle”.",
      ],
      footnote: "Context càng dài càng tốn tiền và càng chậm — bàn rộng không có nghĩa là dùng tốt.",
    },
    {
      kind: "bullets",
      eyebrow: "ATTENTION",
      title: "Mỗi từ được “nhìn sang” những từ quan trọng khác",
      bullets: [
        "Mỗi token chủ động “quay đầu” nhìn lại các token trước đó trong câu.",
        "Chấm điểm mức độ liên quan của từng token với nghĩa của mình.",
        "Khoá nghĩa theo ngữ cảnh — “nó” là quyển sách hay cái túi, tuỳ nó chú ý vào từ nào.",
      ],
      footnote: "Đây chính là chữ T trong GPT — lý do model hiểu ngữ cảnh tốt hơn hẳn thế hệ trước.",
    },
    {
      kind: "checklist",
      eyebrow: "DÙNG CHO ĐÚNG",
      title: "Quản context = quản sự chú ý",
      bullets: [
        "Đặt điều quan trọng ở đầu hoặc cuối prompt — yêu cầu quan trọng đừng chôn giữa.",
        "Giữ bàn làm việc sạch: chat dài thì tóm tắt lại; vibe code thì đưa đúng file, đừng dán cả repo.",
        "Cho tra sổ thay vì bắt nhớ: lấy đoạn liên quan nhét vào context (RAG) thay vì nhét cả cuốn.",
      ],
      footnote: "Agent mạnh không phải vì context khổng lồ — mà vì có tools lấy đúng thứ lên bàn đúng lúc.",
    },
    {
      kind: "bullets",
      eyebrow: "THAM SỐ",
      title: "Tham số: những “khớp nối” model học được",
      bullets: [
        "Những gì model “biết” nằm trong các con số cố định — file weights.",
        "Không chỉnh được tham số khi dùng — chỉ chỉnh context và núm vặn lúc gọi.",
        "GPT-3 (2020): 175 tỷ tham số dense — mọi token đi qua toàn bộ khớp nối.",
        "Kimi K3 (2026): 2.800 tỷ tham số MoE — mỗi token chỉ gọi vài chuyên gia.",
      ],
      footnote: "Nhờ MoE, “bệnh viện” lớn gấp 16 lần mà chi phí mỗi ca khám gần như không đổi.",
    },
    {
      kind: "bullets",
      eyebrow: "HUẤN LUYỆN",
      title: "LLM được tạo ra như thế nào — bốn bước",
      bullets: [
        "① Pre-training — “đọc cả thư viện”: học tiếng nói và kiến thức từ hàng nghìn tỷ token.",
        "② SFT — “được chỉ cách trả lời”: học theo ví dụ mẫu để ra dáng trợ lý.",
        "③ RLHF/DPO — “được uốn nắn”: học theo phản hồi con người, an toàn và dễ chịu hơn.",
        "④ Luyện suy luận (từ 2025): giải đề tự chấm — model biết làm nháp trước khi trả lời.",
      ],
      footnote: "Đọc vạn cuốn sách chưa chắc biết trả lời phỏng vấn — đó là lý do cần bước ②③④.",
    },
    {
      kind: "bullets",
      eyebrow: "RLHF",
      title: "Ba bước uốn cỗ máy đoán token thành trợ lý",
      bullets: [
        "① Model viết nhiều câu trả lời cho cùng một câu hỏi.",
        "② Người chấm xếp hạng → luyện reward model chấm điểm thay người.",
        "③ Huấn luyện theo điểm: tăng xác suất câu ghi điểm cao — lặp hàng nghìn lần.",
      ],
      footnote: "Cỗ máy đoán token + điểm xếp hạng của con người → trợ lý helpful · harmless · honest.",
    },
    {
      kind: "bullets",
      eyebrow: "GIỚI HẠN",
      title: "Giới hạn bẩm sinh: học giả trong bong bóng",
      bullets: [
        "Bong bóng thời gian — model “đóng băng” tại ngày ngừng đọc (knowledge cutoff).",
        "Nói chắc như đúng rồi — tối ưu cho câu nghe hợp lý, không phải tra sự thật (hallucination).",
        "Bàn làm việc có hạn — context có trần; quá dài vừa tốn vừa dễ sót thông tin ở giữa.",
      ],
      footnote: "Đây là bản chất, không phải lỗi tạm thời — nên cần prompt tốt, context sạch, RAG, tools và luôn kiểm chứng.",
    },
    {
      kind: "bullets",
      eyebrow: "ĐƯỜNG TẮT",
      title: "Vì sao model vẫn sai: rất giỏi học vẹt đường tắt",
      bullets: [
        "Phân loại spam: model thực chất học “đếm số hyperlink trong email”.",
        "Chủ quan vs khách quan: học “câu có trích từ film review không”.",
        "Suy luận MNLI: học “câu có động từ phủ định” — đổi dữ liệu test là điểm tụt ngay.",
      ],
      footnote: "Benchmark cao ≠ model hiểu đúng thứ bạn tưởng — luôn test trên dữ liệu của chính mình.",
    },
    {
      kind: "compare",
      eyebrow: "CHAIN-OF-THOUGHT",
      title: "Chỉ thêm “giấy nháp”, từ sai thành đúng",
      columns: [
        {
          heading: "Không nháp — trả lời ngay",
          items: [
            "Đọc câu hỏi → bật ra đáp án",
            "“Đáp án là 27 quả” — SAI",
            "Suy luận bị nén vào một bước đoán",
          ],
        },
        {
          heading: "Có nháp — nghĩ từng bước",
          items: [
            "Bắt đầu có 5 quả",
            "2 hộp × 3 quả = 6 quả",
            "5 + 6 = 11 — ĐÚNG",
          ],
        },
      ],
      footnote: "Cùng model, cùng câu hỏi — đây là mầm của các reasoning model và test-time compute.",
    },
    {
      kind: "bullets",
      eyebrow: "AGENT",
      title: "Từ LLM đến agent: bốn mức độ",
      bullets: [
        "Level 0 — bộ não suy luận: LLM trần, không công cụ, không dữ liệu mới.",
        "Level 1 — có kết nối: + tools (search web, database, API) — vượt bong bóng thời gian.",
        "Level 2 — biết lập kế hoạch: tự chia mục tiêu thành bước, tự kiểm tra từng bước.",
        "Level 3 — đội agent phối hợp: nhiều agent chuyên biệt chia việc (multi-agent).",
      ],
      footnote: "Agent không phải “một loại model khác” — là LLM đặt vào vòng làm việc có mục tiêu và hành động.",
    },
    {
      kind: "bullets",
      eyebrow: "GIẢI PHẪU",
      title: "Một agent = 5 bộ phận chạy thành vòng lặp",
      bullets: [
        "Goal — mục tiêu cần đạt.",
        "Reasoning — bộ não LLM chia bước.",
        "Tools — search · API · database · code.",
        "Action — hành động ra đời thật; quan sát kết quả rồi lặp lại.",
        "Memory — sổ tay ghi nhớ các bước đã làm.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "CHI PHÍ",
      title: "Cùng mức năng lực, giá rơi khoảng 10 lần mỗi năm",
      bullets: [
        "Việc năm ngoái phải dùng model đắt nhất — năm nay model rẻ đã làm được.",
        "Đừng khoá kiến trúc vào một model: giá và năng lực đổi liên tục.",
        "Tổng hợp từ bảng giá các nhà cung cấp 2023–2026.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "CHỌN MODEL",
      title: "Chọn model theo TẦNG, không chọn theo tên",
      bullets: [
        "Tầng 1 — frontier đóng: đắt nhất, chỉ trả cho việc thật sự khó (suy luận nhiều bước, độ tin cậy cao).",
        "Tầng 2 — rẻ mà mạnh: giải đa số việc hằng ngày — MẶC ĐỊNH thử tầng này trước.",
        "Tầng 3 — self-host / siêu rẻ: khi cần kiểm soát dữ liệu hoặc chi phí ở quy mô lớn.",
        "Hai lỗi đối xứng: việc đơn giản gọi frontier → phí tiền; việc khó cố dùng rẻ → kết quả tệ.",
      ],
      footnote: "Bắt đầu từ model đủ tốt và đủ rẻ — chỉ nâng tầng khi kết quả thực sự chặn use case.",
    },
    {
      kind: "bullets",
      eyebrow: "TOKEN CÓ GIÁ",
      title: "Vé vào rẻ, vé ra đắt gấp 3–5 lần",
      bullets: [
        "Input — chữ BẠN gửi đi (prompt, system, context, lịch sử): rẻ, model chỉ cần đọc.",
        "Output — chữ MODEL viết ra từng mảnh một: đắt, vừa chậm vừa tốn.",
        "Hoá đơn ví dụ: input 1.150 tok × $3/1M + output 200 tok × $15/1M ≈ $0.0065 mỗi lần gọi.",
        "Đọc mục usage trong mỗi response — đó là hoá đơn chi tiết của bạn.",
      ],
      footnote: "Input + Output = chi phí mỗi lần gọi — kiểm soát output là núm vặn lớn nhất.",
    },
    {
      kind: "bullets",
      eyebrow: "PROMPT",
      title: "Giải phẫu một prompt: bốn lớp xếp chồng",
      bullets: [
        "Lớp 1 — System instruction: “lời dặn đầu ca” — model là ai, cư xử thế nào, không được làm gì.",
        "Lớp 2 — User input: câu hỏi / yêu cầu của người dùng trong lượt này.",
        "Lớp 3 — Context bổ sung: tài liệu, lịch sử chat, dữ liệu tra sổ — phần bày lên “bàn làm việc”.",
        "Lớp 4 — Output mong muốn: gạch đầu dòng? bảng? JSON? dài bao nhiêu?",
      ],
      footnote: "Viết rõ cả 4 lớp = đã làm tốt một nửa “prompt engineering” — phần còn lại là các ngày sau.",
    },
    {
      kind: "bullets",
      eyebrow: "NÚM VẶN",
      title: "Hai núm vặn chọn từ: temperature & top_p",
      bullets: [
        "Temperature 0 — luôn chọn từ chắc nhất: ổn định, lặp lại được, hợp code & phân tích.",
        "Temperature cao — phân bố phẳng ra: đa dạng, “phiêu”, dễ lạc đề.",
        "top_p — chỉ chọn trong nhóm cộng dồn ≥ p; đuôi xác suất thấp bị loại.",
        "Hai núm này không làm model thông minh hơn — chỉ đổi cách chọn từ, không thêm tri thức.",
      ],
      footnote: "Mặc định an toàn: temperature = 0 cho việc cần ổn định — thường chỉ vặn một trong hai núm.",
    },
  ],
  "d2-main": [
    {
      kind: "cover",
      title: "Xác định bài toán cho AI",
      subtitle: "Từ yêu cầu mơ hồ đến Problem Statement rõ ràng",
      body: "Tên Giảng Viên",
      footnote: "AI IN ACTION · Hackathon · Day 2",
    },
    {
      kind: "compare",
      eyebrow: "AGENDA",
      title: "Sáng lý thuyết · chiều thực hành",
      columns: [
        {
          heading: "Sáng — khung lý thuyết (4h)",
          items: [
            "Problem Discovery: Double Diamond, HCD",
            "Problem Statement & định lượng hoá",
            "PAIR ①②③: giá trị AI · Automate/Augment · reward function",
            "Khi AI sai & UX/HITL → Go / Not Yet / No-Go",
          ],
        },
        {
          heading: "Chiều — thực hành lab (4h)",
          items: [
            "Cá nhân: tìm 5 bài toán, điền 3 Problem Card",
            "Nhóm: phản biện chéo, chốt 1 bài toán",
            "Nhóm: xác thực dữ liệu, vẽ quy trình, chọn giải pháp",
            "Cá nhân: viết nhật ký phản tư (Reflection Log)",
          ],
        },
      ],
      footnote: "Bài nộp cuối buổi: nhật ký tìm bài toán · Problem Statement nhóm · nhật ký phản tư.",
    },
    {
      kind: "compare",
      eyebrow: "DOUBLE DIAMOND",
      title: "Tìm đúng vấn đề trước khi tìm giải pháp",
      columns: [
        {
          heading: "Diamond 1 — tìm đúng vấn đề",
          items: [
            "Discover: mở rộng — khảo sát vấn đề căn bản",
            "Define: thu hẹp — xác định đúng bài toán gốc",
          ],
        },
        {
          heading: "Diamond 2 — tìm đúng giải pháp",
          items: [
            "Develop: mở rộng — nhiều giải pháp tiềm năng",
            "Deliver: thu hẹp — chọn và triển khai",
          ],
        },
      ],
      footnote: "Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp — Don Norman / British Design Council.",
    },
    {
      kind: "compare",
      eyebrow: "DIAMOND 1",
      title: "Phân kỳ để thấu hiểu, hội tụ để lựa chọn",
      columns: [
        {
          heading: "Discover · phân kỳ",
          items: [
            "Quan sát thực tế · phỏng vấn người dùng",
            "Khảo sát · nhật ký hành vi",
            "Phân tích dữ liệu / log hệ thống",
            "Bản đồ các bên liên quan",
          ],
        },
        {
          heading: "Define · hội tụ",
          items: [
            "Affinity mapping · 5 Whys",
            "Ma trận Tác động – Nỗ lực",
            "Dot voting · How Might We",
            "Phát biểu bài toán (Problem Statement)",
          ],
        },
      ],
    },
    {
      kind: "bullets",
      eyebrow: "CASE STUDY",
      title: "Khởi nguồn từ bài toán, không bắt đầu từ AI",
      bullets: [
        "Cursor — “lệch năng lực cốt lõi”: bỏ AI cho CAD, dồn vào AI code editor nơi đội ngũ am hiểu sâu.",
        "Artifact — “sản phẩm tốt ≠ thị trường lớn”: app đọc tin AI xuất sắc nhưng thị trường quá hẹp (đóng cửa 1/2024).",
        "NotebookLM — “định vị đúng điểm đau”: hỏi đáp, tóm tắt trên tài liệu cá nhân, đối chiếu bằng trích dẫn.",
      ],
      footnote: "Lộ trình: Bài toán → Quy trình vận hành → Chỉ số đo lường → Giải pháp AI.",
    },
    {
      kind: "bullets",
      eyebrow: "4 LĂNG KÍNH",
      title: "Tìm bài toán AI ở đâu?",
      bullets: [
        "Repetitive — việc lặp lại thường xuyên: công đoạn nào cần chuẩn hoá để tự động hoá?",
        "Time-consuming — hao phí ở bước nào: tìm kiếm, đọc hiểu, chờ đợi, định dạng?",
        "AI advantage — tác vụ cần phân tích ngữ cảnh, ngôn ngữ tự nhiên, tổng hợp đa nguồn.",
        "User pain points — ai đang gặp khó, phàn nàn hoặc bị tắc nghẽn liên tục?",
      ],
      footnote: "Tập trung nhận diện vấn đề, chưa vội đề xuất giải pháp — sàng lọc để dành buổi chiều.",
    },
    {
      kind: "bullets",
      eyebrow: "ANTI-PATTERNS",
      title: "Bốn sai lầm thường gặp",
      bullets: [
        "Solution-first — xây chatbot/agent trước khi làm rõ quy trình và điểm nghẽn thực tế.",
        "No baseline — không lượng hoá tổn thất hiện tại, mất căn cứ đánh giá cải tiến.",
        "No evaluation — không có kịch bản kiểm thử, chỉ số đo lường hay phương án đối chứng.",
        "No boundary — không rõ phạm vi tự chủ của AI và thời điểm cần con người phê duyệt (HITL).",
      ],
      footnote: "Mắc phải sai lầm trên? Quay lại làm rõ Problem Statement trước khi chọn công nghệ.",
    },
    {
      kind: "quote",
      eyebrow: "PAIR · REFRAME",
      title: "Đừng hỏi “Can we use AI to…?” — hãy hỏi “How might we solve…?”, rồi mới hỏi “AI có giải được theo cách độc đáo không?”",
      footnote: "Hỏi về bài toán trước, về AI sau — câu hỏi đúng quyết định bài toán bạn giải và giải pháp bạn chọn. (Google PAIR · Ch.1)",
    },
    {
      kind: "bullets",
      eyebrow: "PROBLEM CARD",
      title: "Quick Problem Card — 6 trường định hình bài toán",
      bullets: [
        "Problem — vấn đề cụ thể cần giải quyết, không bao gồm giải pháp.",
        "Actor — cá nhân hoặc bộ phận chịu tác động trực tiếp.",
        "Workflow — quy trình hiện tại, gồm 3–7 bước.",
        "Bottleneck + Impact — khâu chậm trễ/sai sót/lặp lại và tổn thất cụ thể.",
        "Success metric — chỉ số định lượng chứng minh hiệu quả cải tiến.",
        "Direction — No AI / Rule / Workflow / Agent / chưa xác định.",
      ],
    },
    {
      kind: "checklist",
      eyebrow: "KHAI THÁC",
      title: "Sáu câu hỏi khai thác bài toán",
      bullets: [
        "Quy trình hiện tại như thế nào — công cụ, các bước, cơ chế bàn giao thông tin?",
        "Nút thắt nằm ở đâu — bước nào chậm, dễ sai sót, lặp lại?",
        "Hao phí hiện tại là bao nhiêu — thời gian, chi phí nhân sự, SLA, cơ hội bỏ lỡ?",
        "Tiêu chí thành công đo bằng gì — hiệu quả cải tiến định lượng cụ thể?",
        "Hậu quả khi sai sót — AI tự quyết tới đâu, điểm nào cần con người phê duyệt?",
        "Có giải pháp phi AI đơn giản hơn — quy tắc, checklist, quy trình, tài liệu hướng dẫn?",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "ĐỊNH LƯỢNG",
      title: "Baseline → Target → Measurement",
      bullets: [
        "Baseline — hiện trạng: mức hao phí hiện tại là bao nhiêu, bằng con số cụ thể.",
        "Target — mục tiêu: kỳ vọng cải thiện ở mức độ nào, ngưỡng cụ thể là gì.",
        "Measurement — chỉ số nào chứng minh hiệu quả, thu thập bằng cách nào.",
        "Ví dụ: thời gian hoàn thành 90 → dưới 30 phút · lỗi phân loại 20% → dưới 5% · giảm 40% câu hỏi trùng lặp TA phải xử lý.",
      ],
      footnote: "Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI.",
    },
    {
      kind: "compare",
      eyebrow: "METRICS",
      title: "Output metric & Input metrics",
      columns: [
        {
          heading: "Output — kết quả tối ưu",
          items: [
            "Thời lượng hoàn tất quy trình giảm bao nhiêu?",
            "Tỷ lệ sai sót / chất lượng đầu ra thay đổi thế nào?",
            "Giá trị thực tế người dùng nhận được rõ nét hơn?",
          ],
        },
        {
          heading: "Input — đòn bẩy tác động",
          items: [
            "Tỷ lệ câu hỏi được phân loại chính xác",
            "Tỷ lệ yêu cầu được chuyển tiếp kịp thời",
            "Thời gian TA hiệu chỉnh bản nháp phản hồi",
          ],
        },
      ],
      footnote: "“Nâng cao hiệu suất” không phải chỉ số — cần gắn với hiện trạng, mục tiêu và phương pháp đo.",
    },
    {
      kind: "bullets",
      eyebrow: "PAIR 3 BƯỚC",
      title: "Ba bước quyết định AI theo PAIR",
      bullets: [
        "① Giao điểm nhu cầu × thế mạnh AI — có thực sự cần AI?",
        "② Automate hay Augment — giải pháp ở cấp độ nào?",
        "③ Reward function & tiêu chí thành công — Problem Statement đã đủ rõ để đo?",
        "Tổng hợp ①②③ → ④ Go / Not Yet / No-Go.",
      ],
      footnote: "Google People + AI Guidebook · Ch.1 User Needs + Defining Success.",
    },
    {
      kind: "bullets",
      eyebrow: "AI CÓ LỢI THẾ",
      title: "Tám trường hợp “AI probably better” (PAIR)",
      bullets: [
        "Gợi ý theo từng người · dự đoán tương lai · cá nhân hoá trải nghiệm.",
        "Hiểu ngôn ngữ tự nhiên — câu hỏi viết tự do bằng lời nói hằng ngày.",
        "Nhận diện cả một lớp thực thể · phát hiện cái hiếm và biến đổi theo thời gian.",
        "Agent/bot cho một lĩnh vực chuyên biệt · nội dung động thay giao diện tĩnh.",
      ],
      footnote: "AI chỉ đáng làm khi bài toán nằm trong nhóm này.",
    },
    {
      kind: "bullets",
      eyebrow: "KHI NÀO KHÔNG",
      title: "Sáu trường hợp “AI probably NOT better” (PAIR)",
      bullets: [
        "Cần duy trì tính dự đoán được — nút Home/Cancel phải luôn ở chỗ quen thuộc.",
        "Thông tin tĩnh ít thay đổi · yêu cầu minh bạch tuyệt đối, truy vết từng bước.",
        "Lỗi quá tốn kém — chi phí một lần sai lớn hơn lợi ích nhiều lần đúng.",
        "Tối ưu tốc độ & chi phí thấp — AI chỉ thêm độ trễ và chi phí.",
        "Việc giá trị cao mà người dùng muốn tự làm.",
      ],
      footnote: "Rule/heuristic dễ build, dễ giải thích, dễ bảo trì — nếu giải quyết được, đó là lựa chọn tối ưu.",
    },
    {
      kind: "bullets",
      eyebrow: "HỆ THỐNG AI",
      title: "Hệ thống AI = Model + Context + Planning + Tools",
      bullets: [
        "Model — tư duy & sáng tạo: đọc hiểu, soạn thảo, tổng hợp, phân loại, gợi ý.",
        "Context — tri thức chuyên biệt: database, tài liệu nghiệp vụ, hồ sơ lịch sử.",
        "Planning — điều phối quy trình: tự phân rã tác vụ phức tạp, linh hoạt điều chỉnh.",
        "Tools — liên kết hệ thống: CRM, database, lịch làm việc, API bên thứ ba.",
      ],
      footnote: "Giải pháp AI là một HỆ THỐNG — model chỉ là một thành phần. (Anthropic · Chip Huyen)",
    },
    {
      kind: "compare",
      eyebrow: "PAIR BƯỚC ②",
      title: "Automate vs Augment — AI làm thay hay hỗ trợ?",
      columns: [
        {
          heading: "Automate — AI làm thay",
          items: [
            "Việc khó, nhàm chán, nguy hiểm hoặc cần scale",
            "Người dùng thiếu kiến thức / khả năng tự làm",
            "Có “đáp án đúng” mà mọi người đồng thuận",
            "Đo bằng: hiệu quả tăng · an toàn hơn · giảm việc tẻ nhạt",
          ],
        },
        {
          heading: "Augment — AI hỗ trợ con người",
          items: [
            "Người dùng thích tự làm việc đó",
            "Stakes cao: tiền bạc, pháp lý, sức khoẻ",
            "Kết quả cần trách nhiệm cá nhân / social capital",
            "Đo bằng: thích thú · cảm giác kiểm soát · sáng tạo tăng",
          ],
        },
      ],
      footnote: "Quyết định theo từng tác vụ. Việc đã automate vẫn gần như luôn cần human oversight — preview, edit, undo.",
    },
    {
      kind: "bullets",
      eyebrow: "BA CẤP GIẢI PHÁP",
      title: "Rule / Workflow / Agent — cấp độ kỹ thuật",
      bullets: [
        "Cấp 1 · Rule/Script — đầu vào ổn định, logic if/else, cần đúng 100%: tính thuế, auto-reply template.",
        "Cấp 2 · LLM Workflow — đầu vào đa dạng, đầu ra linh hoạt, có cách đo: tóm tắt email, chatbot FAQ.",
        "Cấp 3 · Agent — nhiều bước, nhiều công cụ, tình huống đổi liên tục: agent nghiên cứu, coding agent.",
        "Rule/Workflow/Agent là cấp KỸ THUẬT — Automate/Augment là cấp VAI TRÒ của con người.",
      ],
      footnote: "Thứ tự thực dụng: bắt đầu từ bên trái, chỉ sang phải khi giá trị tăng hơn độ phức tạp.",
    },
    {
      kind: "bullets",
      eyebrow: "MỘT CASE BA CẤP",
      title: "Cùng một tình huống lớp học, ba cấp giải pháp",
      bullets: [
        "Rule — trả lời tự động FAQ, gửi link thời khoá biểu, nhắc checklist nộp bài.",
        "Workflow — AI kiểm tra độ đầy đủ của Problem Card, yêu cầu bổ sung, chuyển Trợ giảng.",
        "Agent — theo dõi tiến độ nộp bài, phát hiện nhóm bị kẹt lâu, soạn sẵn câu trả lời chờ TA duyệt.",
      ],
      footnote: "Không bắt buộc nâng cấp tuần tự — dừng ở cấp tối giản nhất nếu đã đáp ứng mục tiêu.",
    },
    {
      kind: "bullets",
      eyebrow: "WORKFLOW PATTERNS",
      title: "Ba pattern đủ cho hầu hết bài toán (Anthropic)",
      bullets: [
        "Prompt chaining — chuỗi bước tuần tự có gate kiểm tra giữa chừng: đổi độ trễ lấy độ chính xác.",
        "Routing — phân loại input vào nhánh chuyên biệt: câu dễ đi model rẻ, câu khó đi model mạnh.",
        "Parallelization — chạy song song rồi tổng hợp hoặc vote: giảm rủi ro một đầu ra sai.",
      ],
      footnote: "Nguyên tắc Anthropic: luôn ưu tiên giải pháp đơn giản nhất — chỉ tăng độ phức tạp khi thực sự cần.",
    },
    {
      kind: "bullets",
      eyebrow: "DECISION TREE",
      title: "Cây quyết định: chọn cấp độ giải pháp",
      bullets: [
        "Đi từ bài toán cốt lõi xuống: Rule → Workflow → Agent.",
        "Mỗi nhánh “KHÔNG” là một lần tránh được độ phức tạp không cần thiết.",
        "Nguồn: Anthropic — Building effective agents · Google — Rules of ML.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "REWARD FUNCTION",
      title: "Hệ thống hiểu “đúng / sai” thế nào — bốn kết quả",
      bullets: [
        "TP — câu hỏi nghẽn thật, AI gợi ý đúng: học viên được giải toả, TA đỡ tải.",
        "TN — câu đã có tài liệu sẵn, AI không can thiệp: đúng, không cần gợi ý thêm.",
        "FP — AI gợi ý SAI (hallucination) và gửi thẳng: học viên đi sai hướng thực hành.",
        "FN — học viên kẹt thật nhưng AI bỏ sót: vẫn chờ lâu như cũ.",
      ],
      footnote: "Chi phí FP và FN KHÔNG đối xứng — báo cháy giả ≠ bỏ sót đám cháy. Thiết kế liên chức năng: UX × Product × Engineering.",
    },
    {
      kind: "compare",
      eyebrow: "ĐÁNH ĐỔI",
      title: "Precision ↔ Recall: đánh đổi không tránh khỏi",
      columns: [
        {
          heading: "Precision cao — TP/(TP+FP)",
          items: [
            "Ít gợi ý, nhưng gợi ý nào cũng chắc đúng",
            "Người dùng tin vào từng gợi ý nhận được",
            "Hệ quả: nhiều FN — bỏ sót người thực sự cần giúp",
          ],
        },
        {
          heading: "Recall cao — TP/(TP+FN)",
          items: [
            "Bao trọn mọi trường hợp cần giúp",
            "Không học viên nào bị bỏ lại phía sau",
            "Hệ quả: nhiều FP — TA phải lọc lại thủ công",
          ],
        },
      ],
      footnote: "Không có cấu hình đúng tuyệt đối — phải test điểm cân bằng với chính người dùng.",
    },
    {
      kind: "bullets",
      eyebrow: "SUCCESS CRITERIA",
      title: "Viết tiêu chí thành công mà hành động được",
      bullets: [
        "Template PAIR: If {chỉ số} for {tính năng AI} {drops below / goes above} {ngưỡng}, we will {hành động}.",
        "Ví dụ: nếu >30% câu AI gợi ý bị TA sửa trong 2 tuần → hạ mức tự động về pha 1 (chỉ gợi ý).",
        "Checklist: metric có ý nghĩa với MỌI người dùng? nhóm nào bị ảnh hưởng tiêu cực? ngày 1000 thì sao?",
      ],
      footnote: "Lên lịch review metric định kỳ — tiêu chí thành công cũng cần được bảo trì theo thời gian.",
    },
    {
      kind: "bullets",
      eyebrow: "DEMO → PRODUCTION",
      title: "Khoảng cách giữa demo và production",
      bullets: [
        "Baseline — đối chiếu hiệu quả với quy tắc tĩnh, nhân sự hay quy trình hiện tại.",
        "Evaluation — bộ dữ liệu kiểm thử, kịch bản biên (edge cases), tiêu chí nghiệm thu.",
        "Controls — logging, fallback, rollback và nhân sự chịu trách nhiệm.",
        "Operations — ai giám sát lỗi, cập nhật tri thức nền, tối ưu hệ thống liên tục.",
      ],
      footnote: "Mục tiêu Day 02 là xác định tính khả thi — chưa phải quyết định triển khai ngay.",
    },
    {
      kind: "bullets",
      eyebrow: "EVAL PLAN",
      title: "Từ Problem Statement đến Eval Plan",
      bullets: [
        "Input — Problem Statement 9 trường đã hoàn chỉnh.",
        "Test cases — dữ liệu thực tế và các trường hợp biên.",
        "Success — đạt (pass) / không đạt (fail) / chuyển kiểm duyệt thủ công (HITL).",
        "Đo ba tầng: tác vụ đơn lẻ · hiệu năng quy trình · rủi ro & sai số.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "9 TRƯỜNG",
      title: "Problem Statement cho hệ thống AI",
      bullets: [
        "6 yếu tố bài toán: Actor · Workflow · Bottleneck · Impact · Success metric · Boundary.",
        "3 yếu tố quyết định AI: điểm can thiệp · mức Rule/Workflow/Agent · rủi ro & HITL.",
        "Boundary: AI không được làm gì; khâu nào bắt buộc có con người.",
      ],
    },
    {
      kind: "bullets",
      eyebrow: "RA QUYẾT ĐỊNH",
      title: "Khung Go / Not Yet / No-Go",
      bullets: [
        "Go — bài toán rõ, chỉ số khả thi, điểm can thiệp AI phù hợp, kiểm soát được rủi ro.",
        "Not Yet — có triển vọng: cần bổ sung dữ liệu, chuẩn hoá quy trình, thiết lập chỉ số, xác định ranh giới.",
        "No-Go — AI không mang giá trị vượt trội, rủi ro quá cao, giải pháp không dùng AI tối ưu hơn.",
      ],
      footnote: "“Not Yet” thể hiện sự chín chắn trong tư duy sản phẩm, không phải thất bại.",
    },
    {
      kind: "checklist",
      eyebrow: "RECAP",
      title: "Sáu nguyên tắc cốt lõi sau Day 02",
      bullets: [
        "Brief mơ hồ không thay thế Problem Statement.",
        "Mô hình hoá workflow trước khi tích hợp AI.",
        "Pain point phải được lượng hoá bằng baseline và chỉ số cụ thể.",
        "Phức tạp không đồng nghĩa hiệu quả — Rule/Workflow/Agent là ba cấp độ khác nhau.",
        "Quyết định Go / Not Yet / No-Go dựa trên lập luận thực tế và số liệu kiểm thử.",
        "Đo reward function bằng trải nghiệm người dùng, không chỉ accuracy.",
      ],
      footnote: "Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI. (PAIR · Ch.1)",
    },
  ],
};

/**
 * Nội dung riêng cho từng buổi khác, để tìm kiếm ở phạm vi "Cả môn" trả về
 * kết quả thật sự khác nhau giữa các tài liệu thay vì lặp lại một bộ slide.
 */
const DAY_DECKS: Record<string, { eyebrow: string; title: string; bullets: string[] }[]> = {
  // Worksheet khởi động của Day 1 — bám chủ đề AI & LLM Foundation.
  "day-1": [
    {
      eyebrow: "KHỞI ĐỘNG",
      title: "Bạn đã “gặp” LLM ở đâu trong 24 giờ qua?",
      bullets: [
        "Liệt kê ba lần bạn dùng AI hôm qua — cái nào là LLM, cái nào chỉ là ML?",
        "Việc nào trong số đó một hệ luật tay cũng làm được?",
        "Chọn một việc bạn nghĩ AI làm tệ — vì bong bóng thời gian, hallucination hay context?",
      ],
    },
    {
      eyebrow: "TOKEN",
      title: "Đếm token thử trước khi tính tiền",
      bullets: [
        "Dán một đoạn tiếng Việt và bản dịch tiếng Anh vào tokenizer — bên nào tốn token hơn?",
        "Ước lượng chi phí nếu gửi đoạn đó 1.000 lần/ngày.",
        "Ghi lại: yếu tố nào làm tiếng Việt bị cắt nhỏ hơn?",
      ],
    },
    {
      eyebrow: "PROMPT",
      title: "Tách một prompt thành bốn lớp",
      bullets: [
        "Lấy prompt gần nhất bạn đã dùng, tách thành: system · user input · context · output mong muốn.",
        "Lớp nào đang thiếu? Thêm vào và so sánh câu trả lời.",
        "Thử hạ temperature về 0 — kết quả ổn định hơn hay nhàm hơn?",
      ],
    },
    {
      eyebrow: "CHỌN MODEL",
      title: "Chọn tầng model cho ba việc của chính bạn",
      bullets: [
        "Kể ba việc bạn định nhờ AI trong hackathon này.",
        "Xếp mỗi việc vào tầng: frontier · rẻ-mà-mạnh · self-host.",
        "Việc nào bắt đầu bằng tầng rẻ được? Ghi lý do.",
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

  // Tài liệu có deck soạn đầy đủ theo PDF thật: trả thẳng slide của trang đó,
  // kể cả trang cuối (trang cuối của deck thật là recap, không phải trang chào).
  const full = DOC_DECKS[doc.id];
  if (full) {
    const authored = full[Math.min(Math.max(page, 1), full.length) - 1];
    return { page, ...authored };
  }

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

const ACRONYMS = new Set(["ai", "jtbd", "ux", "api"]);

function prettifyDocName(name: string): string {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/^day\d+-/i, "")
    .split("-")
    .map((w) =>
      ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1),
    )
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
