# Reflection cá nhân — Thạch Minh Quân

## 1. Vai trò trong nhóm (Role)
Trong dự án, tôi đảm nhận vai trò **Chuyên viên Phân tích Dữ liệu & Thiết kế Khung Đánh giá (Data Analyst & Eval Designer)**. 

Công việc chính của tôi gồm:
* Khai phá dữ liệu chatlog lớn (2.522 dòng) để phân loại lỗi, tìm bằng chứng định lượng (chuẩn B) cho đề tài.
* Định nghĩa khung đánh giá (Evaluation Framework) tổng thể của dự án.
* Phối hợp với Duy để thiết kế logic chọn phạm vi truy xuất tự động của prototype.

---

## 2. Phần việc tự thực hiện (Contributions)
* **Khai phá chatlog (Evidence B)**: Viết script phân tích, phát hiện ra tỉ lệ Tutor trả lời "không tìm thấy" là 29.1%, và đặc biệt nhóm câu hỏi tóm tắt buổi bị bí tới 62.6% (gấp 3 lần câu hỏi trang). Tìm và trích xuất ra 7 câu quote lỗi thật của học viên.
* **Xây dựng khung đánh giá**: Thiết kế các chỉ số đo lường, thang đo 0-2 cho các tiêu chí và phối hợp phân chia golden set thành 2 hướng kiểm thử (NLU và sinh câu trả lời).

---

## 3. Cách thức AI hỗ trợ (AI Assistance)
* **Viết script xử lý dữ liệu**: AI hỗ trợ viết nhanh các lệnh phân tích CSV bằng Python (Pandas) để lọc và đếm các turn chat theo keyword và regex nhanh chóng.
* **Chuẩn hóa cấu trúc Eval**: AI hỗ trợ định hình cấu trúc JSON cho các test case và đề xuất các thang đo thực tiễn bám sát đề bài.

---

## 4. Bài học kinh nghiệm từ ca thất bại (Failure Case Lesson)
* **Thất bại**: Ban đầu tôi cố gắng phân tích dữ liệu một cách thủ công bằng Excel, dẫn đến việc mất nhiều thời gian và dễ bỏ sót các mẫu câu do học sinh gõ sai chính tả.
* **Bài học**: Khi làm việc với dữ liệu người dùng thực tế, ngôn ngữ rất hỗn loạn. Cần xây dựng quy trình chuẩn hóa (như viết hàm bỏ dấu `deaccent` và chuyển sang chữ thường) trước khi phân tích. Các chỉ số đo lường (quality bar) cần được định nghĩa bằng số cụ thể ngay từ đầu, tránh mơ hồ hóa mục tiêu.
