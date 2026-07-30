# Reflection cá nhân — Phạm Đức Mạnh

## 1. Vai trò trong nhóm (Role)
Trong dự án, tôi đảm nhận vai trò **Chuyên viên Tạo Khảo sát & Đánh giá Chất lượng Nội dung (Form Creator & Quality Evaluator)**.

Công việc chính của tôi gồm:
* Tạo dựng công cụ khảo sát online để thu thập dữ liệu phản hồi từ học viên.
* Xây dựng bộ kiểm thử chất lượng nội dung câu trả lời (Answer Quality Golden Set) trong `eval/manjhh/golden-set.json` gồm 20 case bám sát học liệu.

---

## 2. Phần việc tự thực hiện (Contributions)
* **Tạo Form khảo sát**: Thiết kế form câu hỏi hợp lý để khai thác đúng điểm đau của học viên khi dùng Tutor cũ (neo trang, tóm tắt yếu).
* **Xây dựng Golden Set 20 case**: Soạn thảo 20 ca kiểm thử chi tiết bao gồm câu hỏi, nguồn thông tin đối chiếu (source slide/transcript), câu trả lời kỳ vọng (`expected_answer`), các từ bắt buộc có (`must_include`) và các thông tin cấm xuất hiện (`must_not_include`) để bẫy lỗi hallucination.

---

## 3. Cách thức AI hỗ trợ (AI Assistance)
* **Thiết kế Prompt chấm điểm**: AI hỗ trợ viết prompt cho LLM-as-a-judge để tự động hóa việc chấm điểm 4 tiêu chí (Accuracy, Relevance, Completeness, Hallucination rate) theo đúng rubric.
* **Sinh case kiểm thử**: AI giúp tôi rà soát các transcript bài giảng Day 1-2 để sinh nhanh các case kiểm thử bẫy (negative cases) nhằm kiểm tra xem Tutor có bịa thông tin khi ngoài phạm vi không.

---

## 4. Bài học kinh nghiệm từ ca thất bại (Failure Case Lesson)
* **Thất bại**: Trong đợt kiểm thử đầu tiên, hệ thống LLM-as-a-judge tự động đôi khi chấm điểm quá khắt khe hoặc quá lỏng lẻo đối với một số từ khóa trong mục `must_include` do so khớp chuỗi cứng nhắc.
* **Bài học**: Sử dụng LLM để tự động đánh giá (evaluation) rất nhanh nhưng luôn cần một bước **hiệu chuẩn thủ công (human calibration)** trên khoảng 5-10% số case để đảm bảo giám khảo AI hiểu đúng tiêu chí chấm điểm như người thật. Đồng thời, cấu trúc câu trả lời kỳ vọng phải rất rõ ràng và tránh mơ hồ.
