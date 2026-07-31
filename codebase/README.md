# VLearn Reader — trang đọc học liệu + trợ lý AI

Prototype trang đọc học liệu PDF của VLearn, kèm panel chatbot "VLearn Tutor".
Dữ liệu học liệu là **giả lập trong frontend**, nhưng phần **sinh câu trả lời gọi
OpenAI thật** qua route `/api/chat` (có đường lui về câu trả lời dựng sẵn khi chưa có key).

## Chạy

```bash
npm install
cp .env.example .env.local   # rồi điền OPENAI_API_KEY (lấy tại platform.openai.com/api-keys)
npm run dev                  # http://localhost:3000
```

Chưa điền key vẫn chạy được: chatbot tự lui về câu trả lời dựng sẵn và hiện toast nhắc cấu hình.

`npm run build` để build production, `npx eslint .` để lint, `npx tsc --noEmit` để typecheck.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react.
Không có state library — toàn bộ trạng thái nằm trong `app/page.tsx` và truyền xuống bằng props.

## Cấu trúc

```
app/
  layout.tsx           font Inter + JetBrains Mono, khung html/body
  page.tsx             component điều phối: giữ toàn bộ state, ghép các khối lại
  globals.css          theme Tailwind v4 (@theme), biến dark mode, animation, scrollbar
  api/chat/route.ts    route handler gọi OpenAI — key đọc từ .env.local, không lộ ra client
components/
  Header.tsx           thanh trên: quay lại · logo · tên file · AI · VI/EN · sáng-tối · tài khoản
  AIAssistantButton.tsx nút "Trợ lý AI" bo tròn, gradient xanh, hover nổi
  CourseSidebar.tsx    danh sách Day 1–6, đóng/mở từng ngày, chọn tài liệu, thu gọn panel
  DocumentToolbar.tsx  Đọc/Bút/Highlight · menu ba chấm · badge trang·note · zoom · hành động
  PDFViewer.tsx        khung giấy + slide dựng bằng CSS + lớp ghi chú của người dùng
  PageNavigation.tsx   chuyển trang trước/sau, nhập số trang để nhảy
  LessonCompletion.tsx CTA hoàn thành bài học, kích hoạt tóm tắt cuối buổi
  AIChatPanel.tsx      panel chat: header, thanh phạm vi, luồng tin nhắn, ô nhập
  ChatMessage.tsx      bong bóng tin nhắn + chip phạm vi + trích dẫn trang bấm được
  AnswerBlocks.tsx     render câu trả lời có cấu trúc: dàn ý, bảng, thuật ngữ, kết quả tìm
  SuggestedQuestions.tsx  chip câu hỏi gợi ý, mỗi chip gắn nhãn cấp độ
  Toasts.tsx           thông báo nổi
  Tooltip.tsx, IconButton.tsx  thành phần dùng chung
lib/
  types.ts             kiểu dữ liệu dùng chung
  mock-data.ts         6 Day · 12 tài liệu · bộ slide riêng cho từng buổi
  session-data.ts      dữ liệu CẤP BUỔI: dàn ý, takeaway, thuật ngữ, vận hành lớp, tìm kiếm
  i18n.ts              từ điển VI/EN cho toàn bộ chữ trên giao diện
  ai-mock.ts           đoán ý định → chọn phạm vi → dựng câu trả lời dự phòng có cấu trúc
  ai-context.ts        gom nội dung phạm vi thành context cho AI + parse text AI thành khối
```

## Trạng thái mặc định

Day 6 đang mở · tài liệu `day06-ai-product-project-management.pdf` (37 trang) · đang xem
**trang 2** · zoom 111% · trang 2 có sẵn 1 ghi chú · chatbot **đóng** · phạm vi tìm **Tự động**.

Đường demo ngắn nhất cho P1: mở Trợ lý AI → bấm chip **"Tóm tắt buổi học hôm nay"** → xem dòng
nới phạm vi và dàn ý 6 mục → bấm một khoảng trang để nhảy tới slide đó.

## Những gì bấm được

**Header** — quay lại (toast) · VI/EN đổi toàn bộ chữ giao diện · sáng/tối · nút Trợ lý AI mở panel.

**Sidebar** — bấm Day để mở/thu gọn (animate bằng `grid-template-rows`) · bấm tài liệu để đổi
tài liệu đang đọc · tay cầm ở cạnh phải để thu gọn cả panel · trên tablet/mobile panel thành
drawer, mở bằng nút trong header.

**Toolbar** — Bút và Highlight có trạng thái active và mở bảng chọn **độ dày + màu**; khi đang
bật, bấm vào slide để đặt ghi chú. Zoom ±: 50→200%. Phóng to = ẩn sidebar và nới rộng khung đọc.
Tải xuống / Lưu / Undo / Xoá ghi chú đều đổi trạng thái thật và bắn toast. Menu ba chấm có 4 mục.

**Trang** — nút trước/sau, hoặc gõ số trang rồi Enter (1–37). Mỗi trang render một slide khác nhau.

**Chatbot** — 8 câu hỏi gợi ý (mỗi chip ghi rõ cấp trang / buổi / môn) · gõ và nhấn Enter để gửi
(Shift+Enter xuống dòng) · hiện animation đang nhập rồi trả lời sau 0,9–1,9 giây · thích /
không thích / sao chép / tạo lại · thu nhỏ thành cửa sổ góc dưới phải · xoá cuộc trò chuyện.
Lịch sử chat lưu trong state, mất khi reload.

**Hoàn thành bài học** — nút ở cuối trình đọc đánh dấu riêng từng tài liệu đã học xong, tự mở VLearn Tutor,
chuyển phạm vi sang **Cả buổi** và gửi yêu cầu tóm tắt toàn bộ bài học. Nút khoá sau lần bấm đầu để tránh
tạo bản tóm tắt trùng lặp; khi chưa có API key vẫn dùng bản tóm tắt dự phòng có cấu trúc và trích dẫn trang.

## Xử lý P1 — retrieval neo theo trang, học viên hỏi theo buổi

Bằng chứng từ chatlog: 29,1% (367/1.261) lượt tutor trả lời "không tìm thấy", trong đó nhóm
**tóm tắt / tổng hợp buổi học bí tới 62,6%** (97/155) — cao gấp gần ba lần nhóm "giải thích đoạn
đang đọc" (22,9%). Nguyên nhân: mỗi lượt hỏi chỉ nhìn thấy đúng một trang.

Mockup xử lý bằng **thang phạm vi truy xuất** đặt ngay dưới header chatbot:

| Phạm vi | Đọc gì | Trả lời nhóm câu nào |
|---|---|---|
| Tự động *(mặc định)* | tự đoán theo câu hỏi | — |
| Trang này | slide đang mở | giải thích đoạn đang đọc, ôn tập, ví dụ |
| Cả buổi | toàn bộ 37 slide của Day 6 | tóm tắt buổi, dàn ý, thuật ngữ, so sánh, từ khoá |
| Cả môn | 12 tài liệu + dữ liệu vận hành lớp | lịch, checkpoint, cách nộp, cách chấm, thăm dò tutor |

Mỗi lượt hỏi đi qua hai bước trong `lib/ai-mock.ts`: đoán ý định (12 nhóm, phủ đủ 8 loại trong
bảng khảo sát) → chọn phạm vi. Khi hệ thống tự nới phạm vi, câu trả lời hiện dòng
*"Câu hỏi ở cấp buổi học — đã tự nới phạm vi từ trang 2 ra Cả buổi · Day 6"*, để người dùng thấy
được vì sao lần này trả lời được.

Câu trả lời cấp buổi **không phải văn xuôi** mà là khối có cấu trúc: dàn ý 6 mục kèm khoảng trang
bấm được (bấm là nhảy tới đúng slide), ba takeaway, danh sách thuật ngữ, và trích dẫn trang ở cuối.
Phạm vi "Cả môn" trả kết quả kèm nhãn buổi + tên file, bấm vào là đổi luôn tài liệu đang đọc.

Khi không tìm thấy, tutor nói rõ đã quét bao nhiêu slide và gợi ý nới phạm vi — thay vì
"rất tiếc, ngoài phạm vi".

## Phần nào là mock

- **Không render PDF thật, nhưng nội dung Day 1–2 là thật.** Mỗi trang là một slide dựng bằng
  CSS từ `lib/mock-data.ts`. Tài liệu chính của **Day 1 và Day 2 có deck soạn đầy đủ 29 trang**,
  tóm lược theo đúng từng trang PDF thật trong `data/vlearn-pack/slide/`; Day 6 có bộ 16 slide
  soạn tay + phần xoay vòng; Day 3–5 mỗi buổi có bộ slide riêng để tìm kiếm ở phạm vi "Cả môn"
  trả về kết quả khác nhau. Cỡ chữ dùng đơn vị container query (`cqw`) nên co giãn theo mức zoom.
- **Dữ liệu cấp buổi là hardcode** — dàn ý, takeaway và 7 thuật ngữ của Day 6 nằm trong
  `lib/session-data.ts`. Trong bản thật, đây là chỗ cần một job tóm tắt chạy sẵn sau mỗi buổi
  (offline summarisation) rồi lưu cạnh tài liệu, chứ không tóm tắt lại mỗi lần có người hỏi.
- **Tìm kiếm là thật, trong phạm vi mock.** `searchSession` / `searchCourse` quét thật nội dung
  slide, bỏ dấu tiếng Việt, chấm điểm theo tiêu đề và thân slide — không phải kết quả dựng sẵn.
- **Dữ liệu vận hành lớp là thật**, lấy từ `README.md` và `04-rubric.md` của repo này.
- **Gọi AI thật (OpenAI).** Mỗi lượt hỏi: `ai-mock.ts` chọn phạm vi + trích dẫn →
  `ai-context.ts` gom nội dung phạm vi đó thành grounding context → `app/api/chat/route.ts`
  gọi OpenAI (key server-side trong `.env.local`) → text trả về được `parseAiBlocks()` dựng
  lại thành khối hiển thị. Khi chưa có `OPENAI_API_KEY` hoặc gọi lỗi, dùng lại câu trả lời
  dựng sẵn trong `lib/ai-mock.ts` — demo không bao giờ chết vì mạng.
- Tải xuống, lưu, đính kèm, in: chỉ hiện toast.

## Responsive

Desktop-first. Từ `lg` (1024px): sidebar 380px nằm trong luồng, panel chat 440px cũng nằm trong
luồng nên khung PDF tự thu hẹp khi mở chat. Dưới `lg`: sidebar và chat thành overlay trượt, không
che header; toolbar cuộn ngang; nhãn chữ trên các nút ẩn bớt.
