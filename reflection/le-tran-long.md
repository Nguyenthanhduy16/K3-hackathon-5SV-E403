# Reflection cá nhân — Lê Trần Long

## 1. Vai trò trong nhóm (Role)
Trong dự án **VLearn Tutor — Trợ lý tóm tắt & truy xuất học liệu cấp buổi học**, tôi đảm nhận vai trò **Điều phối viên kiêm Chuyên viên Kiểm thử (Coordinator & Evaluator)**. 

Công việc chính của tôi bao gồm:
* Điều phối tiến độ, phân chia công việc cho các thành viên trong nhóm để bám sát các mốc Checkpoint (CP1 đến CP6).
* Trực tiếp thiết kế và thu thập dữ liệu Khảo sát Người dùng thật (chuẩn A) từ 41 học viên ngoài nhóm nhằm chứng minh điểm đau (pain point).
* Thiết lập quality bar, trực tiếp viết kịch bản kiểm thử và chạy đánh giá (evaluation) mô hình qua hai bộ test suite tại CP3 (`eval/phuc/` và `eval/manjhh/`).
* Quản lý mã nguồn, giải quyết conflict nhánh git, thực hiện merge và quản lý Pull Request để đồng bộ lên nhánh chính.

---

## 2. Phần việc tự thực hiện (Contributions)
* **Khảo sát & Evidence (Chuẩn A)**: Thu thập ý kiến từ 41 học viên. Kết quả chỉ ra 96,6% gặp khó khăn khi tự ôn tập do tài liệu quá dài, 79,3% không hài lòng với khả năng tóm tắt hiện tại của Tutor và 89,7% sẵn sàng dùng giải pháp tóm tắt cấp buổi học.
* **Xây dựng kịch bản & Chạy Evaluation**:
  * Viết script Python tự động (`run_eval.py`) sử dụng thư viện chuẩn `urllib` để gọi API OpenAI gpt-4o-mini thực hiện RAG trên slide Day 6 và chấm điểm tự động (LLM-as-a-judge) theo thang 0-2 (Accuracy, Relevance, Completeness, Hallucination rate).
  * Viết script đánh giá NLU (`run_p_summary_test.py`) để kiểm tra độ chính xác của bộ phân loại intent bằng regex.
  * Tích hợp thêm các câu hỏi thực tế chứa lỗi typo và cấu trúc khẩu ngữ tự nhiên lấy từ chatlog thực vào bộ kiểm thử để tăng độ phủ và độ khó.
* **Git & PR Management**: Thực hiện merge nhánh `main` mới nhất, giải quyết conflict đổi tên tệp kiểm thử `p_summarytest.json` trên nhánh `long`, và đẩy kết quả lên nhánh `main` an toàn.

---

## 3. Cách thức AI hỗ trợ (AI Assistance)
Trong suốt quá trình thực hiện dự án, tôi đã sử dụng AI trợ lý lập trình (Gemini/Antigravity) hiệu quả trong việc:
* **Tự động hóa viết script Eval**: AI giúp tôi chuyển đổi nhanh ý tưởng đánh giá từ mã giả sang mã Python hoạt động tốt, sử dụng kết nối HTTP thuần mà không cần cài thêm package bên ngoài (`urllib`).
* **Sửa lỗi hệ thống**: Khi chạy script trên môi trường Windows của tôi bị lỗi mã hóa tiếng Việt (`UnicodeEncodeError: 'charmap' codec can't encode...`), AI đã nhanh chóng hướng dẫn tôi cách tái cấu hình lại luồng output của Python (`sys.stdout.reconfigure(encoding='utf-8')`) để giải quyết triệt để lỗi này.
* **Tối ưu hóa các biểu thức Regex**: Giúp tôi phân tích các regex phức tạp dùng cho bộ đoán intent và gợi ý cách tinh chỉnh để bắt các lỗi typo như "sờ lai", "kiên thức".

---

## 4. Bài học kinh nghiệm từ ca thất bại (Failure Case Lesson)
Bài học lớn nhất của tôi đến từ hai thất bại cụ thể trong quá trình chạy kiểm thử:

1. **Thất bại của ca kiểm thử NLU (`p_summarytest.json`)**: Bộ đoán intent chỉ đạt **47,1% (8/17)** độ chính xác ở lượt chạy đầu tiên. Các câu hỏi chứa lỗi chính tả viết tay của học sinh (như *"Tóm tắt sờ lai này"* - typo *"sờ lai"*, hay *"tom tat slie 24"* - typo *"slie"*) đều bị nhận diện sai hoặc bị đẩy vào `OUT_OF_DOMAIN`.
   * **Bài học**: Quy tắc phân loại cứng bằng biểu thức chính quy (Regex) cực kỳ dễ vỡ khi đối mặt với ngôn ngữ tự nhiên nhiều biến thể và lỗi gõ phím của người dùng thực tế. Trong sản phẩm thực tế, chúng tôi bắt buộc phải chuyển sang giải pháp phân loại intent bằng LLM (qua cấu trúc Schema) hoặc dùng Text Embedding + Vector Search để đạt độ chính xác cần thiết ($\ge 80\%$).

2. **Thất bại của ca kiểm thử nội dung `D6-DATA-01`**: Câu hỏi về *"Ranh giới khi dùng data thật"* trả về kết quả *"Không tìm thấy"*.
   * **Bài học**: Lớp lọc context hoặc prompt của mô hình đang quá khắt khe, dẫn đến việc bỏ sót thông tin liên quan trong Slide 23. Cần tinh chỉnh lại System Prompt của Tutor để nới rộng khả năng suy luận khi thông tin không nằm tập trung ở một vị trí duy nhất.
