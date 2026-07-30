# Bộ Đánh Giá — Tóm Tắt Slide VLearn

Mục đích của bộ đánh giá này là kiểm tra xem prototype có tóm tắt và tổng hợp slide đúng với pain point đã chọn hay không. Bộ này có 20 case và bám vào hai nguồn:

- `codebase/lib/mock-data.ts` — deck Day 6 hiện tại trong prototype.
- `data/vlearn-pack/transcript/transcript-04-clean.md` và `transcript-05-clean.md` — transcript đã làm sạch, có mã trích dẫn.

## Bốn tiêu chí

### 1) Accuracy
Điểm cao khi câu trả lời khớp với nguồn, không thêm chi tiết sai, và chỉ dùng đúng phần kiến thức mà source hỗ trợ.

Thang gợi ý:
- `2` = đúng rõ ràng, không có lỗi fact.
- `1` = đúng ý chính nhưng còn thiếu hoặc có chút filler nhẹ.
- `0` = sai fact chính hoặc lệch khỏi source.

### 2) Relevance
Điểm cao khi câu trả lời bám đúng câu hỏi, không lan man sang chủ đề khác.

Thang gợi ý:
- `2` = bám đúng phạm vi hỏi.
- `1` = có hơi lan man nhưng vẫn giúp trả lời.
- `0` = lệch chủ đề.

### 3) Completeness
Điểm cao khi câu trả lời bao phủ đủ các ý bắt buộc trong đáp án mẫu.

Thang gợi ý:
- `2` = đủ tất cả ý bắt buộc.
- `1` = có ý chính nhưng thiếu một phần quan trọng.
- `0` = thiếu quá nhiều ý.

### 4) Hallucination rate
Tính theo công thức:

`số case có ít nhất 1 thông tin không được source nào ủng hộ / tổng số case`

Cách áp dụng:
- Case có `must_not_include` là case bẫy hallucination rõ ràng.
- Nếu mô hình thêm một fact không có trong `source` và fact đó mâu thuẫn với source, case đó được tính là hallucination.

## Cách dùng

1. Chạy prototype với từng câu hỏi trong `golden-set.json`.
2. So khớp output với `expected_answer`, `must_include`, và `must_not_include`.
3. Chấm 4 tiêu chí theo thang 0-2.
4. Báo cáo tổng hợp:
- Accuracy trung bình.
- Relevance trung bình.
- Completeness trung bình.
- Hallucination rate.

## Ngưỡng đạt gợi ý

Với giai đoạn prototype hiện tại, có thể dùng ngưỡng:
- Accuracy trung bình >= `1.5`
- Relevance trung bình >= `1.5`
- Completeness trung bình >= `1.4`
- Hallucination rate <= `10%`

Các ngưỡng này có thể điều chỉnh sau khi nhóm chạy thử 1-2 vòng và đọc lại các case fail.
