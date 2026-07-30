# Reflection cá nhân — Nguyễn Minh Phúc

## 1. Vai trò trong nhóm (Role)
Trong dự án, tôi đảm nhận vai trò **Chuyên viên Thu thập Dữ liệu & Đánh giá NLU (Data Collector & NLU Evaluator)**.

Công việc chính của tôi gồm:
* Thực hiện khảo sát trực tiếp học viên trong khóa để thu thập dữ liệu định lượng và định tính (chuẩn A).
* Xây dựng bộ kiểm thử NLU (`p_summarytest.json`) gồm 15-17 case để đánh giá độ chính xác của bộ đoán intent.

---

## 2. Phần việc tự thực hiện (Contributions)
* **Thu thập dữ liệu khảo sát**: Tiến hành phỏng vấn và khảo sát n=41 học viên ngoài nhóm, thu thập log câu hỏi thực tế ghi nhận vào file Excel dữ liệu nguồn A của nhóm.
* **Xây dựng bộ kiểm thử NLU**: Thiết kế 15 case ban đầu chia đều cho các loại happy path, colloquial, missing-entity, typo, và negative case để kiểm thử tính bền vững của Tutor khi đoán ý định của người dùng.

---

## 3. Cách thức AI hỗ trợ (AI Assistance)
* **Thiết kế kịch bản NLU**: AI gợi ý các dạng câu hỏi khẩu ngữ thực tế thường gặp và cấu trúc hóa tệp JSON kiểm thử sao cho dễ tích hợp với các script chạy tự động.
* **Tối ưu hóa bộ lọc thực thể (Entities)**: AI hỗ trợ phân tích cách định nghĩa thực thể để đưa vào expected output của bộ kiểm thử.

---

## 4. Bài học kinh nghiệm từ ca thất bại (Failure Case Lesson)
* **Thất bại**: Ca test `tc_016` (Tóm tắt sờ lai này) thất bại do bộ regex của Tutor không nhận diện được từ viết sai chính tả cố ý/khẩu ngữ *"sờ lai"*.
* **Bài học**: Người dùng thực tế gõ phím rất nhanh và thường dùng từ lóng hoặc sai chính tả. Việc chỉ dùng Regex khớp từ khóa là cực kỳ rủi ro và không thể phủ hết hành vi thực tế. Cần kết hợp thêm các từ điển từ đồng nghĩa (synonyms mapping) hoặc chuyển hẳn sang dùng LLM Classifier để tăng độ chịu lỗi (fault tolerance) cho hệ thống.
