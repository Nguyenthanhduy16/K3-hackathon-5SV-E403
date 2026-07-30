# NLU Ground Truth — Tóm tắt slide có trích dẫn

## 1. Mục đích

Thư mục này chứa bộ dữ liệu ground truth dùng để đánh giá lớp NLU của chatbot có chức năng tóm tắt slide bài giảng. File kiểm thử chính là [`p_summarytest.json`](./p_summarytest.json).

Bộ test tập trung vào hai chỉ số:

1. **Intent Accuracy**: hệ thống có nhận diện đúng người dùng muốn tóm tắt một slide, tóm tắt toàn bộ buổi học hay đang hỏi ngoài miền hay không.
2. **Entity Extraction F1-score**: hệ thống có trích xuất đúng và đủ các text span chỉ buổi học, số slide và chủ đề hay không.

Bộ test này chỉ đánh giá **NLU đầu vào**. Nó chưa đánh giá chất lượng bản tóm tắt, tính đúng sự thật, độ đầy đủ hay độ chính xác của trích dẫn trong câu trả lời. Các tiêu chí đó cần một answer-quality suite riêng.

## 2. Nguồn dữ liệu và phạm vi

Các topic trong test case được lấy từ hai tài liệu:

- `d1-slide-hackathon.pdf`: **AI & LLM Foundation — Day 1**.
- `d2-slide-hackathon.pdf`: **Xác định bài toán cho AI — DAY 02**.

Mỗi file PDF được gửi có 29 trang vật lý. Trong bộ test, `slide_number` là số trang vật lý tính từ 1 của chính file PDF, phù hợp với biến `page` mà giao diện hiện tại truyền vào chatbot. Một số footer của Day 02 vẫn hiển thị số thứ tự trong deck gốc 83 slide; các số footer này không được dùng làm `slide_number` trong bộ test.

Ba negative case cố ý không thuộc nội dung PDF để đo khả năng từ chối nhận nhầm intent tóm tắt.

## 3. Kết quả phân tích source code

Source hiện có hai intent tóm tắt:

| Intent | Ý nghĩa | Retrieval scope |
| --- | --- | --- |
| `page-summary` | Tóm tắt một trang hoặc slide cụ thể | `page` |
| `session-summary` | Tóm tắt toàn bộ buổi học hoặc bài giảng | `session` |

Các câu không khớp pattern hiện rơi vào intent `keyword`. Source chưa định nghĩa intent `OUT_OF_DOMAIN` và chưa có module entity extraction; `doc`, `page` và `scope` đang được giao diện truyền trực tiếp vào hàm dựng câu trả lời.

Vì ground truth cần đo false positive trên câu ngoài miền, bộ test dùng `OUT_OF_DOMAIN` làm **nhãn mục tiêu đề xuất**. Kết quả thấp ở nhóm này phản ánh một khoảng trống thực tế trong intent ontology hiện tại, không phải lỗi của dữ liệu test.

## 4. Entity schema

Source chưa có entity schema chính thức. Bộ test đề xuất ba nhãn gần nhất với dữ liệu ngữ cảnh hiện có:

| Entity | Ý nghĩa | Ví dụ span |
| --- | --- | --- |
| `day_label` | Nhãn buổi học xuất hiện trực tiếp trong utterance | `Day 1`, `DAY 02` |
| `slide_number` | Số trang/slide được người dùng nhắc đến | `10`, `17` |
| `topic_name` | Tên chủ đề hoặc khái niệm xuất hiện trên slide | `Token`, `Double Diamond` |

Không gán `lecturer_name` vì hai PDF không có metadata tác giả và không nêu tên giảng viên. Các tên như Fei-Fei Li hoặc Don Norman là nhân vật/tác giả nguồn được nhắc trong bài, không phải giảng viên.

## 5. Quy tắc gán nhãn entity span

- Mỗi entity value phải là một substring liên tục và xuất hiện nguyên văn trong `utterance`.
- So khớp chính thức là exact match, có phân biệt chữ hoa, chữ thường, dấu tiếng Việt và ký hiệu.
- Không tự sửa lỗi chính tả trong ground truth. Ví dụ utterance có `slie` nhưng entity đúng vẫn có thể là `slide_number: "24"` vì span `24` xuất hiện nguyên văn.
- Không suy diễn entity không được nói ra. Nếu người dùng chỉ nói “slide này”, `expected_entities` là `{}` vì số slide đến từ UI context, không phải từ utterance.
- Với case thiếu một phần thông tin, chỉ gán các entity thực sự xuất hiện. Ví dụ `Double Diamond` được gán `topic_name`, nhưng không tự thêm `day_label` hoặc `slide_number`.
- Không gán từ khóa điều khiển như “toàn bộ”, “slide này” hoặc “lẹ” thành entity; chúng là tín hiệu nhận diện intent/phạm vi.

Hiện JSON lưu entity dưới dạng `label: value`, không lưu `start`/`end` character offsets. Vì vậy evaluator phải đối chiếu cặp `(entity_label, exact_text_value)`. Nếu sau này cần strict span-offset F1 hoặc một utterance có nhiều entity cùng nhãn, schema nên được nâng cấp thành danh sách object chứa `label`, `value`, `start` và `end`.

## 6. Cấu trúc test case

```json
{
  "id": "tc_001",
  "utterance": "Vui lòng tóm tắt slide 10 về LLM là gì? trong Day 1.",
  "expected_intent": "page-summary",
  "expected_entities": {
    "day_label": "Day 1",
    "slide_number": "10",
    "topic_name": "LLM là gì?"
  },
  "test_type": "happy_path"
}
```

Ý nghĩa các trường:

| Trường | Mô tả |
| --- | --- |
| `id` | Mã duy nhất và ổn định của test case |
| `utterance` | Câu đầu vào nguyên bản gửi tới NLU |
| `expected_intent` | Intent ground truth |
| `expected_entities` | Các cặp entity label và exact text span mong đợi |
| `test_type` | Nhóm tình huống dùng để phân tích lỗi |

## 7. Phân bố bộ test

Bộ dữ liệu hiện có 15 test case:

| Test type | Số lượng | Mục tiêu |
| --- | ---: | --- |
| `happy_path` | 4 | Câu formal, rõ intent và entity |
| `colloquial` | 3 | Cách nói ngắn, thân mật hoặc slang sinh viên |
| `missing_entity` | 3 | Thiếu ngày, số slide hoặc chủ đề; hệ thống không được tự bịa entity |
| `typo_noise` | 2 | Sai dấu, sai chính tả và viết tắt |
| `negative_case` | 3 | Câu ngoài miền để đo false positive |

Phân bố intent:

| Expected intent | Số lượng |
| --- | ---: |
| `page-summary` | 8 |
| `session-summary` | 4 |
| `OUT_OF_DOMAIN` | 3 |

Toàn bộ suite chứa 25 entity span: 9 `day_label`, 6 `slide_number` và 10 `topic_name`.

## 8. Tiêu chí đánh giá

### 8.1 Intent Accuracy

Intent được tính đúng khi predicted intent exact-match với `expected_intent`.

```text
Intent Accuracy = số test case dự đoán đúng intent / tổng số test case
```

Cần báo cáo cả:

- Overall Intent Accuracy trên 15 case.
- Accuracy riêng cho `page-summary` và `session-summary`.
- OOD Recall: tỷ lệ negative case được nhận diện là `OUT_OF_DOMAIN`.
- Summary false-positive rate trên negative case.

```text
OOD Recall = OOD dự đoán đúng / tổng số OOD ground truth

Summary FPR trên OOD = số OOD bị dự đoán thành page-summary hoặc session-summary
                     / tổng số OOD ground truth
```

### 8.2 Entity Precision, Recall và F1-score

Mỗi entity được biểu diễn bằng một cặp `(label, exact_text_value)`.

- **True Positive (TP)**: predicted pair khớp hoàn toàn ground-truth pair.
- **False Positive (FP)**: model trả thêm pair không có trong ground truth hoặc đúng value nhưng sai label.
- **False Negative (FN)**: ground-truth pair không được model trả ra.

```text
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
F1        = 2 × Precision × Recall / (Precision + Recall)
```

Metric chính nên là **micro-F1** trên toàn bộ entity của 15 case. Đồng thời nên báo cáo F1 theo từng nhãn để thấy hệ thống yếu ở `day_label`, `slide_number` hay `topic_name`.

Khi cả prediction và ground truth đều rỗng cho một case, case đó không làm tăng TP; nó được theo dõi riêng bằng chỉ số **empty-entity exact match**. Model phải trả `{}` cho các case không có entity thay vì đoán từ kiến thức hoặc context ngoài utterance.

## 9. Quality bar đề xuất

Vì suite chỉ có 15 case, một case làm thay đổi overall accuracy khoảng 6,67%. Quality bar ban đầu nên diễn giải bằng cả tỷ lệ và số ca:

| Chỉ số | Ngưỡng đề xuất |
| --- | ---: |
| Overall Intent Accuracy | Ít nhất 14/15 = 93,33% |
| Summary intent accuracy | Ít nhất 11/12 = 91,67% |
| OOD Recall | 3/3 = 100% |
| Summary FPR trên OOD | 0/3 = 0% |
| Entity micro-F1 | Ít nhất 0,90 |
| Empty-entity exact match | 100% trên các case ground truth `{}` |

Đây là ngưỡng khởi đầu để phát hiện regression, chưa phải bằng chứng thống kê cho chất lượng production. Khi mở rộng suite, quality bar cần được xem lại dựa trên mức độ rủi ro và phân bố câu hỏi thật.

## 10. Yêu cầu đối với evaluator

Mỗi prediction nên được chuẩn hóa về cấu trúc sau trước khi chấm:

```json
{
  "id": "tc_001",
  "predicted_intent": "page-summary",
  "predicted_entities": {
    "day_label": "Day 1",
    "slide_number": "10",
    "topic_name": "LLM là gì?"
  }
}
```

Evaluator cần:

1. Kiểm tra đủ 15 ID và không có ID trùng.
2. Ghép prediction với ground truth bằng `id`, không dựa vào thứ tự mảng.
3. Chấm intent bằng exact match.
4. Chuyển entity object thành tập các cặp `(label, value)` để tính TP, FP và FN.
5. Báo cáo overall metric, metric theo intent, theo entity và theo `test_type`.
6. In danh sách case lỗi kèm expected/predicted để phục vụ error analysis.
7. Không âm thầm normalize dấu, casing hoặc typo trong metric chính. Nếu có thêm normalized F1, phải báo cáo như metric phụ riêng biệt.

## 11. Cách đọc các case thiếu entity

`missing_entity` kiểm tra hai việc khác nhau:

- NLU vẫn nhận đúng intent tóm tắt.
- Entity extractor không hallucinate thông tin không có trong utterance.

Việc chatbot có hỏi lại đúng câu hay không thuộc lớp dialogue policy, không được phản ánh đầy đủ bằng Intent Accuracy hoặc Entity F1. Nếu cần đo hành vi hỏi lại, nên bổ sung một suite riêng với các trường như `expected_action: "CLARIFY"` và `required_missing_entities`.

## 12. Quy trình sử dụng và bảo trì

1. Giữ nguyên ground truth khi chạy so sánh giữa các phiên bản model/prompt.
2. Lưu predicted output và báo cáo metric theo cùng mã phiên bản.
3. Đọc từng case thất bại trước khi sửa classifier hoặc prompt.
4. Chạy lại toàn bộ 15 case sau mỗi thay đổi.
5. Chỉ sửa nhãn ground truth khi chứng minh được nhãn cũ sai; ghi lại lý do trong changelog.
6. Thêm test case mới từ câu hỏi người dùng thật, đặc biệt là lỗi mới, thay vì tối ưu trực tiếp cho các câu hiện có.

## 13. Giới hạn và hướng mở rộng

- 15 case chỉ phù hợp làm smoke/regression suite ban đầu.
- Số typo/noise và slang còn ít; chưa đại diện đầy đủ cách nói của sinh viên.
- Chưa có case chứa nhiều topic hoặc nhiều slide trong một utterance vì schema object hiện chỉ giữ một value cho mỗi label.
- Chưa có code-switching Việt–Anh phức tạp, câu phủ định hoặc câu mơ hồ giữa “tóm tắt” và “giải thích”.
- Chưa đo chất lượng nội dung tóm tắt, citation coverage, citation correctness, faithfulness và khả năng không bịa thông tin.
- Source cần bổ sung entity extractor và intent/action OOD trước khi có thể đạt toàn bộ nhãn ground truth của suite.

Hướng mở rộng ưu tiên là tăng lên tối thiểu 30–50 câu từ log thật, chuyển entity sang schema có offsets, thêm multi-entity case và xây dựng answer-quality suite để chấm tóm tắt cùng trích dẫn nguồn.
