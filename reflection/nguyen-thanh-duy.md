# Reflection cá nhân — Nguyễn Thành Duy

## 1. Vai trò trong nhóm (Role)
Trong dự án, tôi đảm nhận vai trò **Nhà phát triển AI & Giao diện (AI Developer & Prototyper)**. 

Công việc chính của tôi gồm:
* Trực tiếp phát triển giao diện người dùng và tích hợp AI cho VLearn Reader (Mockup và Working Prototype).
* Thiết kế route API `/api/chat` xử lý kết nối với OpenAI GPT-4o-mini ở phía server-side.
* Phối hợp phân tích dữ liệu nguồn A (khảo sát) và hoàn thiện tài liệu Canvas nộp tại mốc CP1.

---

## 2. Phần việc tự thực hiện (Contributions)
* **Xây dựng codebase**: Chuyển đổi mã nguồn mock tĩnh (`ai-mock.ts`) thành các luồng xử lý bất đồng bộ kết nối với API thực thông qua Next.js Route Handler.
* **Tối ưu hóa giao diện**: Cải thiện Panel Chatbot, tích hợp thanh phạm vi truy xuất (Trang này / Cả buổi / Cả môn) và tạo các chip trích dẫn trang slide có thể bấm để nhảy trang.
* **Viết Canvas CP1**: Tổng hợp bài toán, lát cắt một câu và phân công ban đầu của nhóm để nộp đúng hạn mốc CP1.

---

## 3. Cách thức AI hỗ trợ (AI Assistance)
* **Sinh code Next.js & React**: AI hỗ trợ viết nhanh các handler bắt sự kiện, quản lý UI state (typing indicators, scroll-to-bottom) và chuyển đổi các component UI sang dạng responsive.
* **Xử lý bất đồng bộ**: AI giúp cấu trúc mã xử lý bất đồng bộ khi gọi API OpenAI trên Next.js App Router, đảm bảo tối ưu hóa chi phí token và xử lý lỗi mạng mượt mà.

---

## 4. Bài học kinh nghiệm từ ca thất bại (Failure Case Lesson)
* **Thất bại**: Khi kết nối API thực tế, việc phản hồi từ LLM mất khoảng 1.5–3 giây gây ra sự đứng hình tạm thời trên UI nếu không có feedback trực quan cho người dùng. 
* **Bài học**: Thiết kế sản phẩm AI phải luôn đi kèm với việc quản lý kỳ vọng thời gian trễ của người dùng (bằng cách thêm typing animation, vô hiệu hóa nút gửi tạm thời). Việc chuyển từ hàm mock đồng bộ sang API bất đồng bộ cần được tính toán sớm trong kiến trúc flow của React để tránh lỗi render.
