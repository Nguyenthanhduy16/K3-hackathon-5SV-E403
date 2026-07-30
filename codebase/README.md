# VLearn Reader — mockup trang đọc học liệu + trợ lý AI

Prototype giao diện (mức **Mock**) cho trang đọc học liệu PDF của VLearn, kèm panel chatbot
"VLearn Tutor". Toàn bộ dữ liệu là **giả lập trong frontend** — không có backend, không gọi API.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
```

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
components/
  Header.tsx           thanh trên: quay lại · logo · tên file · AI · VI/EN · sáng-tối · tài khoản
  AIAssistantButton.tsx nút "Trợ lý AI" bo tròn, gradient xanh, hover nổi
  CourseSidebar.tsx    danh sách Day 1–6, đóng/mở từng ngày, chọn tài liệu, thu gọn panel
  DocumentToolbar.tsx  Đọc/Bút/Highlight · menu ba chấm · badge trang·note · zoom · hành động
  PDFViewer.tsx        khung giấy + slide dựng bằng CSS + lớp ghi chú của người dùng
  PageNavigation.tsx   chuyển trang trước/sau, nhập số trang để nhảy
  AIChatPanel.tsx      panel chat: header, dòng ngữ cảnh, luồng tin nhắn, ô nhập
  ChatMessage.tsx      bong bóng tin nhắn + nguồn tham khảo + thích/không thích/copy/tạo lại
  SuggestedQuestions.tsx  5 chip câu hỏi gợi ý
  Toasts.tsx           thông báo nổi
  Tooltip.tsx, IconButton.tsx  thành phần dùng chung
lib/
  types.ts             kiểu dữ liệu dùng chung
  mock-data.ts         6 Day · 12 tài liệu · thư viện slide · trạng thái khởi tạo
  i18n.ts              từ điển VI/EN cho toàn bộ chữ trên giao diện
  ai-mock.ts           bộ trả lời giả lập theo từ khoá, có ghép nội dung slide đang mở
```

## Trạng thái mặc định

Day 6 đang mở · tài liệu `day06-ai-product-project-management.pdf` (37 trang) · đang xem
**trang 2** · zoom 111% · trang 2 có sẵn 1 ghi chú · chatbot **đóng**.

## Những gì bấm được

**Header** — quay lại (toast) · VI/EN đổi toàn bộ chữ giao diện · sáng/tối · nút Trợ lý AI mở panel.

**Sidebar** — bấm Day để mở/thu gọn (animate bằng `grid-template-rows`) · bấm tài liệu để đổi
tài liệu đang đọc · tay cầm ở cạnh phải để thu gọn cả panel · trên tablet/mobile panel thành
drawer, mở bằng nút trong header.

**Toolbar** — Bút và Highlight có trạng thái active và mở bảng chọn **độ dày + màu**; khi đang
bật, bấm vào slide để đặt ghi chú. Zoom ±: 50→200%. Phóng to = ẩn sidebar và nới rộng khung đọc.
Tải xuống / Lưu / Undo / Xoá ghi chú đều đổi trạng thái thật và bắn toast. Menu ba chấm có 4 mục.

**Trang** — nút trước/sau, hoặc gõ số trang rồi Enter (1–37). Mỗi trang render một slide khác nhau.

**Chatbot** — 5 câu hỏi gợi ý · gõ và nhấn Enter để gửi (Shift+Enter xuống dòng) · hiện animation
đang nhập rồi trả lời sau 0,9–1,9 giây · mỗi câu trả lời kèm nguồn "Trang X" và nút thích /
không thích / sao chép / tạo lại · thu nhỏ thành cửa sổ góc dưới phải · xoá cuộc trò chuyện ·
dòng ngữ cảnh cập nhật theo trang PDF đang xem. Lịch sử chat lưu trong state, mất khi reload.

## Phần nào là mock

- **Không đọc PDF thật.** Mỗi trang là một slide dựng bằng CSS từ `lib/mock-data.ts`
  (trang 1–16 soạn tay, 17–36 lấy từ bộ nội dung xoay vòng, trang cuối là slide kết).
  Cỡ chữ trong slide dùng đơn vị container query (`cqw`) nên co giãn đúng theo mức zoom.
- **Không gọi AI thật.** `lib/ai-mock.ts` bắt từ khoá trong câu hỏi rồi ghép câu trả lời với
  nội dung slide đang mở, nên chatbot "biết" đang ở trang nào — nhưng đó là chuỗi dựng sẵn.
  Đây là chỗ cần thay bằng lời gọi API thật để đạt yêu cầu ≥1 lời gọi AI của đề bài.
- Tải xuống, lưu, đính kèm, in: chỉ hiện toast.

## Responsive

Desktop-first. Từ `lg` (1024px): sidebar 380px nằm trong luồng, panel chat 440px cũng nằm trong
luồng nên khung PDF tự thu hẹp khi mở chat. Dưới `lg`: sidebar và chat thành overlay trượt, không
che header; toolbar cuộn ngang; nhãn chữ trên các nút ẩn bớt.
