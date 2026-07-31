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
  CourseSidebar.tsx    danh sách deck thật trong repo, chọn tài liệu, thu gọn panel
  DocumentToolbar.tsx  Đọc/Bút/Highlight · menu ba chấm · badge trang·note · zoom · hành động
  PDFViewer.tsx        ảnh trang sinh từ PDF thật + lớp ghi chú của người dùng
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
  course-data.ts       catalog deck thật + ánh xạ trang tới asset WebP
  session-data.ts      dữ liệu CẤP BUỔI: dàn ý, takeaway, thuật ngữ, vận hành lớp, tìm kiếm
  i18n.ts              từ điển VI/EN cho toàn bộ chữ trên giao diện
  ai-mock.ts           đoán ý định → chọn phạm vi → dựng câu trả lời dự phòng có cấu trúc
  ai-context.ts        gom nội dung phạm vi thành context cho AI + parse text AI thành khối
```

`public/slides/day01-slide-blue-v0/` chứa 23 ảnh WebP và `manifest.json`, được sinh trực tiếp từ
`data/vlearn-pack/slide/day01-slide-blue-v0.pdf` trên nhánh `main`.

## Trạng thái mặc định

Day 1 đang mở · tài liệu thật `day01-slide-blue-v0.pdf` (23 trang) · đang xem
**trang 1** · zoom 100% · không chèn ghi chú giả · chatbot **đóng** · phạm vi tìm **Tự động**.

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

**Trang** — nút trước/sau, hoặc gõ số trang rồi Enter (1–23). Mỗi trang hiển thị đúng một trang của PDF nguồn.

**Chatbot** — 8 câu hỏi gợi ý (mỗi chip ghi rõ cấp trang / buổi / môn) · gõ và nhấn Enter để gửi
(Shift+Enter xuống dòng) · hiện animation đang nhập rồi trả lời sau 0,9–1,9 giây · thích /
không thích / sao chép / tạo lại · thu nhỏ thành cửa sổ góc dưới phải · xoá cuộc trò chuyện.
Lịch sử chat lưu trong state, mất khi reload.

**Citation bắt buộc** — mỗi câu thông tin do AI sinh phải kèm `(trang N)` hoặc `(nguồn: tên-tài-liệu)`.
Server loại câu trả lời nếu có bất kỳ mệnh đề thông tin nào thiếu citation và dùng phương án dự phòng có nguồn.
Danh sách tài liệu nguồn luôn mở dưới câu trả lời; nguồn slide bấm được để quay lại đúng trang, còn nguồn vận hành
hiển thị rõ `README.md` hoặc `04-rubric.md`.

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
| Cả buổi | toàn bộ 23 slide của Day 1 | tóm tắt buổi, dàn ý, thuật ngữ, so sánh, từ khoá |
| Cả môn | deck PDF thật hiện có + dữ liệu vận hành lớp | lịch, checkpoint, cách nộp, cách chấm, thăm dò tutor |

Mỗi lượt hỏi đi qua hai bước trong `lib/ai-mock.ts`: đoán ý định (12 nhóm, phủ đủ 8 loại trong
bảng khảo sát) → chọn phạm vi. Khi hệ thống tự nới phạm vi, câu trả lời hiện dòng
*"Câu hỏi ở cấp buổi học — đã tự nới phạm vi từ trang hiện tại ra Cả buổi · Day 1"*, để người dùng thấy
được vì sao lần này trả lời được.

Câu trả lời cấp buổi **không phải văn xuôi** mà là khối có cấu trúc: dàn ý kèm khoảng trang
bấm được (bấm là nhảy tới đúng slide), ba takeaway, danh sách thuật ngữ, và trích dẫn trang ở cuối.
Phạm vi "Cả môn" trả kết quả kèm nhãn buổi + tên file, bấm vào là đổi luôn tài liệu đang đọc.

Khi không tìm thấy, tutor nói rõ đã quét bao nhiêu slide và gợi ý nới phạm vi — thay vì
"rất tiếc, ngoài phạm vi".

## Phần nào là mock

- **Slide hiển thị là thật.** 23 ảnh trang được render ở đúng độ phân giải 1920×1080 từ file PDF
  `data/vlearn-pack/slide/day01-slide-blue-v0.pdf`; `manifest.json` lưu SHA-256 của file nguồn để kiểm tra.
  `PDFViewer.tsx` chỉ hiển thị ảnh trang và lớp annotation, không còn dựng nội dung slide bằng CSS.
- **Catalog không tạo tài liệu giả.** Sidebar chỉ hiện deck đang thực sự có trong repo. Khi bổ sung PDF mới,
  cần sinh bộ page asset + manifest tương ứng rồi thêm một entry vào `COURSE_DAYS`.
- **Tìm kiếm dùng text trích từ PDF thật.** `searchSession` / `searchCourse` quét nội dung trong manifest,
  bỏ dấu tiếng Việt và chấm điểm theo tiêu đề/thân slide.
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
