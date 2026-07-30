# Nhật ký kiểm thử người dùng (User Validation Log) — VLearn Tutor

Dưới đây là feedback thu nhận từ 5 người thử ngoài nhóm tại mốc CP5, bao gồm phản hồi thực tế từ học viên Nguyễn Văn Hưng khi trải nghiệm prototype qua tunnel ngrok.

## 1. Bảng Nhật ký Feedback (Feedback Log)

| Người thử | Vai trò / Nhóm | Task kiểm thử | Quan sát chi tiết của nhóm | Quote nguyên văn từ người dùng | Mức nghiêm trọng |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Nguyễn Văn Hưng** | Học viên B2 · K3 · E403 | Hỏi tóm tắt buổi học hôm nay | Lần đầu bấm Tutor báo không tìm thấy thông tin. Khi bấm nút "Tạo lại câu trả lời" thì hệ thống gọi lại API thành công và trả ra tóm tắt đầy đủ 4 mốc checkpoint của hackathon. | *"bấm tóm tắt lần đầu thì k đc, nma bấm 'tạo lại câu trả lời' thì lại đc"* | **Medium** ⚠️ |
| **Trương Thảo Nguyên** | Học viên ngoài nhóm | Hỏi tóm tắt nội dung ở phạm vi "Cả buổi" | Người dùng muốn hỏi về tất cả các trang, khi chọn nút phạm vi "Cả buổi" thủ công thì Tutor vẫn chỉ trả về kết quả tóm tắt cho đúng trang 35. Lỗi kẹt scope. | *"Ý là t muốn hỏi về tất cả các trang... Nhưng t ấn chọn cả buổi Thì kết quả vẫn là trang 35"* | **High** 🚨 |
| **Nguyễn Hồng Yến** | Học viên ngoài nhóm | Hỏi deadline nộp bài checkpoint | Tutor trả lời chính xác thông tin hạn cứng và vẽ bảng các mốc. Tuy nhiên giao diện bảng hiển thị trên mobile hơi bị tràn viền ngang. | *"Bảng deadline hiển thị rõ ràng, nhưng trên điện thoại của mình bị mất một phần cột bên phải."* | **Low** info |
| **Trần Hoàng Nam** | Học viên ngoài nhóm | Gõ câu hỏi sai chính tả "tóm tat slde day 2" | Intent classifier đoán sai thành OUT_OF_DOMAIN vì regex quá cứng nhắc với từ "slde" (typo của slide). | *"Sao gõ tóm tắt slide mà bot lại bảo không hỗ trợ nội dung này nhỉ?"* | **High** 🚨 |
| **Phạm Thùy Chi** | Học viên ngoài nhóm | Thử bẫy hỏi "Món ăn yêu thích của bot là gì?" | Bot từ chối trả lời lịch sự và tự động liệt kê các tác vụ nó có thể hỗ trợ (ops, quiz, outline). Lối thoát Graceful Failure tốt. | *"Bot biết từ chối và hướng dẫn mình hỏi đúng trọng tâm học tập."* | **Low** info |
| **Nguyễn Đăng Hưng** | Học viên ngoài nhóm | Hỏi ví dụ cụ thể khi đang đứng ở Trang 4 | Tutor phát hiện trang 4 không có ví dụ, đã tóm lược ý slide và gợi ý người dùng mở rộng phạm vi tìm kiếm. Xử lý từ chối thông tin thông minh, không bịa đặt. | *"Mình chưa tìm thấy ví dụ cụ thể về dự án AI khó ước lượng trong phạm vi trang 4 này... gợi ý bạn mở rộng..."* | **Low** info |

---

## 2. Các hành động khắc phục (Action Items)

Dựa trên feedback của người dùng ở trên, nhóm quyết định thực hiện các cập nhật sau:

1. **Khắc phục lỗi "lần đầu fail, lần hai được" của Nguyễn Văn Hưng**:
   * **Nguyên nhân**: Lần gọi API đầu tiên bị quá thời hạn (timeout) hoặc kết nối socket của Next.js Server-side tới OpenAI bị lag ở lượt đầu.
   * **Xử lý**: Tăng thời hạn timeout và thêm cơ chế tự động thử lại (retry logic) tối đa 2 lần ở phía API route trước khi trả lỗi cho người dùng.
2. **Khắc phục lỗi kẹt scope của Trương Thảo Nguyên**:
   * **Nguyên nhân**: Lỗi logic RAG khi nhận diện phạm vi được ép thủ công từ client-side chưa cập nhật đúng cấu trúc ngữ cảnh gửi lên LLM.
   * **Xử lý**: Sửa lại codebase tại component gửi câu hỏi để đồng bộ đúng trạng thái `choice` của dropdown phạm vi trực tiếp vào tham số truy xuất ngữ cảnh trước khi gọi OpenAI API.
3. **Khắc phục lỗi trượt khung của Nguyễn Hồng Yến**:
   * **Xử lý**: Cập nhật CSS của bảng trong Component `AnswerBlocks.tsx` thêm thuộc tính `overflow-x-auto` để tự động cuộn ngang trên màn hình di động nhỏ.
4. **Khắc phục lỗi đoán sai intent của Trần Hoàng Nam**:
   * **Xử lý**: Cập nhật biểu thức chính quy đoán intent tại `ai-mock.ts` để bao quát thêm các lỗi gõ nhanh thường gặp của sinh viên (như "slde", "slie", "tóm tat").

