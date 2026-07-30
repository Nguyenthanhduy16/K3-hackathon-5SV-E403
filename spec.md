# AI SPEC — Trả lời cấp buổi có trích dẫn (thang phạm vi truy xuất cho VLearn Tutor) · Nhóm [XX] · Zone [X]
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

## §1. User & Job

- **Job executor + workflow**: Học viên khoá AI Thực Chiến (~1.000 người) đang đọc slide trong trang học VLearn, trong giờ hoặc ngay sau buổi. Workflow hiện tại khi cần ôn: mở tài liệu → lật từng trang (29–37 slide/buổi) → bôi đen đoạn + hỏi tutor → tutor chỉ nhìn thấy đúng trang đang mở. *(Sơ đồ workflow: đính kèm worksheet JTBD — [ĐIỀN: link ảnh])*
- **Core JTBD** *(không tên sản phẩm/AI)*: "Khi vừa học xong một buổi nhiều slide, tôi muốn nắm lại toàn bộ nội dung buổi và biết phần nào nằm ở trang nào, để ôn đúng trọng tâm mà không phải lật lại từng trang."
- **Problem statement** *(KHÔNG chữ AI)*: Học viên hỏi những câu ở cấp **buổi học** (tóm tắt buổi, dàn ý, thuật ngữ, "hôm nay học gì") ngay trong trang đọc, nhưng công cụ hỏi-đáp của trang chỉ đọc được **đúng một trang đang mở**, nên phần lớn câu hỏi cấp buổi bị trả lời "không tìm thấy" — học viên mất niềm tin vào công cụ và quay lại tự lật slide.
- **Evidence — có CẢ HAI chuẩn A và B**:

  **(A) Khảo sát người dùng thật** — Google Form "Vấn đề của bạn với VLearn Tutor", **n = 41 người ngoài nhóm** (29 đã dùng tutor, 12 chưa dùng); log đầy đủ từng câu hỏi + từng câu trả lời trong `data/vlearn-pack/Form khảo sát vấn đề của bạn với VLearn Tutor (Câu trả lời).xlsx` *(form ẩn danh — không thu tên/email)*:
  - Pain ôn tập được xác nhận **28/29 (96,6%)** người đã dùng: *"mất quá nhiều thời gian tự đọc lại và ghi chép/tóm tắt"* 21/29 (72,4%) · *"quá nhiều thông tin, không biết đâu là trọng tâm"* 19/29 (65,5%) · chỉ 1/29 "không gặp khó khăn gì".
  - Đánh giá khả năng "tổng hợp & tóm tắt" của tutor hiện tại: **23/29 (79,3%) chê** — 17 *"bình thường, chỉ trả lời tốt câu lẻ tẻ, khó tóm tắt bức tranh toàn cảnh"* + 6 *"yếu, trả lời lan man"*; chỉ 3/29 nói "tốt".
  - Vấn đề gặp phải khi dùng (multi-select): *"không có khả năng tổng hợp, tóm tắt thông tin"* **15/29 (51,7%)** — đứng đầu; *"không đúng trọng tâm"* 14/29; *"không diễn giải được ngoài phạm vi slide"* 14/29 — khớp chính xác với nguyên nhân gốc "retrieval neo theo trang".
  - Mức độ đón nhận giải pháp: **35/39 (89,7%)** sẵn sàng dùng/dùng thử tính năng "tóm tắt buổi học" (28/29 nhóm đã dùng · 7/10 nhóm chưa dùng).
  - Quote nguyên văn từ khảo sát (cột "Kỳ vọng"): *"Tự động tóm tắt buổi học"* · *"khi mà ôn tập kiến thức tôi có thể dùng 1 prompt hoặc là Vlearn tutor sẽ tó tắt tốt nhất kiến thức của buổi học thật đầy đủ cho tôi"* · *"Tóm tắt đúng trọng tâm vào keyword vào bài học"* · *"Tôi hi vọng v learn sẽ có tính năng tím tắt cả các nội dung silde như thế sẽ dễ để ghi nhớ và học hơn"* · *"Có thể trả lời câu hỏi về nội dung ngoài slide"*.

  **(B) Mining `data/vlearn-pack/chatlog/`** (2.522 dòng = 1.261 lượt hỏi-đáp, 369 user, 22–29/07/2026):
  - **Số liệu mining** (phương pháp: ghép cặp student–tutor theo `turn_id`, phân loại câu hỏi theo bộ pattern intent, đếm lượt trả lời của tutor chứa mẫu từ chối "không tìm thấy / ngoài phạm vi / không có thông tin"; script đếm kiểm lại được):
    - 29,1% (367/1.261) lượt tutor trả lời dạng "không tìm thấy" *(bộ pattern mở rộng — phân tích gốc trong `codebase/README.md`)*. Kiểm chứng độc lập bằng bộ pattern hẹp hơn: 190/1.261 = 15,1% (cận dưới) — hiện tượng đứng vững với cả hai cách đếm.
    - Nhóm câu **tóm tắt / tổng hợp buổi học** bí **62,6%** (97/155) — gấp gần 3 lần nhóm "giải thích đoạn đang đọc" (22,9%).
    - Nhóm câu vận hành lớp (deadline, nộp bài, chấm điểm) bí 42,3%.
    - 46,2% câu trả lời của tutor có `citations` **rỗng** — trả lời không neo vào tài liệu (nguồn: `DATA_DICTIONARY.md`).
  - **≥5 quote nguyên văn** *(trích ngắn kèm mã ẩn danh, tra lại được trong chatlog)*:
    1. `[T0952/M2015]` HV: *"Tóm tắt kiến thức trọng tâm của ngày hôm nay"* → Tutor: *"Rất tiếc, tôi không tìm thấy trang slide cụ thể nào liệt kê…"*
    2. `[T0411/M1965]` HV: *"tóm tắt nội dung cần học trong ngày hôm nay cho toio"* → Tutor: *"Xin lỗi, tôi không thể tìm thấy thông tin cụ thể về nội dung bài học ngày hôm nay…"*
    3. `[T0776/M2388]` HV: *"giải thích và tóm tắt nội dung học hôm này"* → Tutor: *"Xin lỗi bạn, tôi không tìm thấy phần tóm tắt tổng quát…"*
    4. `[T1118/M0469]` HV: *"tóm tắt bài giảng ngày hôm nay"* (đang ở trang 1) → Tutor: *"Rất tiếc, hiện tại tôi không tìm thấy tài liệu tóm tắt cụ thể…"*
    5. `[T1139/M0900]` HV: *"tóm tat bai hoc day 3"* → Tutor: *"…hệ thống hiện không tìm thấy tóm tắt tổng quát cho bài học ngày 3…"*
    6. `[T0607/M2204]` HV: *"tóm tắt bài học cho tô"* → Tutor: *"Rất xin lỗi bạn, mình hiện không tìm thấy nội dung tóm tắt tổng quát…"*
    7. `[T0280/M0998]` HV: *"tóm tắt toàn bộ slide"* (đang ở trang 4) → Tutor: *"…hệ thống không tìm thấy dữ liệu slide tương ứng…"*

## §2. Impact & quyết định chọn

- **Bảng impact ≥3 ứng viên**:

  | Ứng viên | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi trong 1,5 ngày |
  |---|---|---|---|---|
  | ① Câu hỏi cấp buổi (tóm tắt/dàn ý/thuật ngữ) bị "không tìm thấy" | ~1.000 HV, 155/1.261 lượt trong 1 tuần log; 51,7% người dùng khảo sát nêu đúng vấn đề này | Cao nhất sau mỗi buổi học (6 buổi/khoá) | Bí 62,6% → tự lật 29–37 slide; khảo sát: 72,4% "mất quá nhiều thời gian tự đọc lại", nhóm chưa dùng tutor có người mất >30 phút/buổi | Cao — dữ liệu buổi có sẵn, chỉ cần nới phạm vi truy xuất |
  | ② Câu vận hành lớp (deadline, nộp bài, rubric) bí 42,3% | Cả lớp, dồn quanh checkpoint | Theo đợt (trước mỗi CP) | Hỏi lại TA / nộp muộn = 0 điểm mốc đó | Trung bình — nguồn sự thật nằm ngoài học liệu (README/rubric), rủi ro sai deadline cao |
  | ③ Giải thích đoạn đang đọc dễ hiểu hơn | Nhóm câu đông nhất trong log | Rải đều mọi buổi | Bí chỉ 22,9% — đa số đã được trả lời | Cao nhưng cải thiện biên nhỏ |

- **Ứng viên ĐÃ LOẠI + vì sao**:
  - ③ LOẠI: tỷ lệ bí thấp nhất (22,9%) — tutor hiện làm tương đối tốt, tối ưu thêm cho hiệu quả biên nhỏ hơn nhiều so với ①.
  - ② KHÔNG chọn làm lát cắt chính: trả lời sai deadline gây hậu quả trực tiếp (mất điểm), cần nguồn sự thật riêng và quy trình duyệt kỹ hơn khung thời gian sự kiện. *Tuy nhiên* phạm vi "Cả môn" của prototype phủ được một phần nhóm này bằng cách chỉ đọc từ nguồn chính thức (README + `04-rubric.md`), kèm nhắc kiểm tra kênh chính thức.
- **Ứng viên CHỌN + vì sao (bằng số)**: ① — hai nguồn bằng chứng độc lập chỉ cùng một chỗ: log cho thấy nhóm bí **62,6%** (cao gấp ~3 lần nhóm ③), khảo sát cho thấy đây là vấn đề bị nêu nhiều nhất (**51,7%**) và 79,3% chê khả năng tóm tắt hiện tại; 89,7% sẵn sàng dùng giải pháp. Nguyên nhân gốc xác định được rõ (retrieval neo theo trang) nên sửa đúng một chỗ là giải cả nhóm câu hỏi.

## §3. Giải pháp tương tự đã nghiên cứu

- **NotebookLM (Google)**: flow hỏi-đáp trên tài liệu cá nhân, mọi câu trả lời kèm trích dẫn đối chiếu nguồn. *Đáng học*: citation là công cụ tự kiểm của user. *Đáng né*: không cho user thấy/chọn hệ thống đang đọc trong phạm vi nào. *Mình khác gì*: thang phạm vi hiển thị ngay trên panel (Trang này / Cả buổi / Cả môn) + dòng thông báo khi hệ thống tự nới phạm vi.
- **ChatGPT (upload file)**: flow chat tự do trên file đính kèm. *Đáng học*: linh hoạt, hiểu câu hỏi nói đời thường. *Đáng né*: không neo trang — số trang trong câu trả lời do model tự sinh, dễ bịa. *Mình khác gì*: số trang trích dẫn sinh từ lớp retrieval (tìm kiếm thật trên nội dung slide), model chỉ sinh câu chữ; bấm trích dẫn là nhảy đúng slide.
- **Perplexity**: flow trả lời kèm danh sách nguồn bấm được, nói rõ khi không tìm thấy. *Đáng học*: giọng "không thấy thì nói không thấy". *Đáng né*: trả lời văn xuôi dài, khó quét nhanh khi đang ôn bài. *Mình khác gì*: câu trả lời cấp buổi là khối có cấu trúc (dàn ý theo khoảng trang, takeaway, thuật ngữ) thay vì văn xuôi.

## §4. Thiết kế

- **Lát cắt MỘT CÂU**: Một học viên đang đọc slide trên VLearn · hỏi "tóm tắt buổi hôm nay" · hệ thống tự quyết định nới phạm vi truy xuất từ trang đang mở ra cả buổi (và nói rõ đã nới) · nhận dàn ý 6 mục + takeaway + thuật ngữ kèm khoảng trang bấm được để nhảy tới đúng slide.
- **Non-goals (≥3 thứ KHÔNG build)**:
  1. Không chấm điểm bài làm / dự đoán điểm của học viên.
  2. Không trả lời về tài liệu chưa upload lên VLearn (nói rõ thay vì đoán).
  3. Không đọc/parse file PDF thật trong runtime — nội dung slide dựng lại từ PDF của data pack.
  4. Không cá nhân hoá theo lịch sử học của từng học viên; không lưu hội thoại server-side.
- **Mức prototype nhắm tới**: [ ] Sketch [ ] Mock [x] **Working** — *phần thật*: lời gọi AI chạy thật qua route `/api/chat` (OpenAI `gpt-4.1-mini`, key server-side); lớp chọn phạm vi + tìm kiếm (bỏ dấu, chấm điểm tiêu đề/thân slide) chạy thật; nội dung slide Day 1–2 dựng theo đúng 29 trang PDF thật; dữ liệu vận hành lớp lấy thật từ README/rubric của repo. *Phần mock*: nội dung Day 3–6 là slide dựng tay; retrieval dùng keyword matching thay vì embeddings; tải xuống/lưu/đính kèm chỉ hiện toast.
- **Automation**: [x] augment [ ] conditional [ ] automate — *lý do theo cost-of-error*: sai kiến thức là lỗi đắt nhất trong domain học tập (học sai → mất điểm, mất niềm tin). Vì vậy AI chỉ **đề xuất** câu trả lời kèm trích dẫn trang bấm được để học viên tự kiểm; không có hành động tự động nào thay user; khi thiếu căn cứ, hệ thống nói rõ đã quét bao nhiêu slide và gợi ý nới phạm vi thay vì đoán.
- **§4b. Nguyên tắc đã áp dụng (HAX/PAIR)**:

  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | PAIR — Mental Models (đặt kỳ vọng đúng) | Dòng *"Câu hỏi ở cấp buổi học — đã tự nới phạm vi từ trang 2 ra Cả buổi · Day 6"* cho user thấy hệ thống đang đọc gì, vì sao lần này trả lời được |
  | PAIR — Explainability + Trust (tin đúng mức) | Mọi câu trả lời kèm chip phạm vi + trích dẫn trang bấm được; số trang sinh từ retrieval, không do model tự bịa |
  | PAIR — Feedback + Control | 👍/👎, sao chép, "Tạo lại" ngay trong luồng chat; thanh phạm vi cho user **ép** Trang này / Cả buổi / Cả môn — user luôn override được máy |
  | PAIR — Errors + Graceful Failure | Lỗi-do-giới-hạn ("đã quét cả 29 slide của Day 1 nhưng không thấy — thử nới sang Cả môn") tách khỏi lỗi-hệ-thống (mất mạng/hết quota → tự lui về câu trả lời dựng sẵn + toast báo) |
  | HAX G5 — hợp chuẩn mực xã hội | Tutor xưng "mình", gọi "bạn", giọng thân thiện đúng ngữ cảnh sinh viên VN |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản

| # | Lớp | Kịch bản | Hành vi thiết kế |
|---|---|---|---|
| 1 | ① Nguồn sự thật | Hỏi nội dung không có trong buổi ("RAG là gì?" ở Day 1) | Nói rõ *đã quét N slide không thấy*, gợi ý nới phạm vi "Cả môn" hoặc hỏi bằng từ khoá trong slide — không bịa |
| 2 | ① Nguồn sự thật | Model tự sinh số trang sai (hallucinate citation) | Trích dẫn trang lấy từ lớp retrieval, KHÔNG lấy từ text model sinh; prompt cấm nêu nội dung ngoài ngữ cảnh |
| 3 | ① Nguồn sự thật | Hỏi deadline/cách chấm | Chỉ trả lời từ dữ liệu vận hành chính thức (README + rubric) đưa vào ngữ cảnh; không để model "nhớ" |
| 4 | ② Mơ hồ | "Tóm tắt" không rõ trang hay buổi | Ưu tiên cấp buổi khi câu có "buổi/hôm nay/toàn bộ"; ngược lại mặc định trang đang mở; chip phạm vi hiển thị để user sửa ngay nếu đoán sai |
| 5 | ② Mơ hồ | "Slide này là gì?" — thiếu số slide | Dùng ngữ cảnh UI (trang đang mở), tuyệt đối không bịa số slide từ câu chữ (đúng quy tắc bộ eval NLU) |
| 6 | ③ Ngoài phạm vi | Đòi chấm bài / dự đoán điểm | Từ chối + liệt kê rõ những việc làm được (câu trả lời tutor-probe) |
| 7 | ③ Ngoài phạm vi | Hỏi tài liệu chưa upload / xin đề thi, đáp án quiz | Nói rõ tài liệu chưa có trên VLearn / từ chối kèm hướng thay thế (câu ôn tập tự luyện) |
| 8 | ④ Đặc thù domain | Trích sai số trang → học viên mở nhầm slide, mất niềm tin | Citation sinh từ tìm kiếm thật trên nội dung slide; bấm là nhảy đúng trang — sai lệch phát hiện được ngay |
| 9 | ④ Đặc thù domain | Học viên gõ tiếng Việt không dấu / sai chính tả ("tóm tat bai hoc day 3" — quote thật T1139) | Bỏ dấu (deaccent) cả câu hỏi lẫn nội dung slide trước khi so khớp |
| 10 | ④ Đặc thù domain | Trả lời sai deadline → nộp muộn = 0 điểm mốc đó | Nguồn duy nhất là dữ liệu vận hành trong repo + câu trả lời kèm cảnh báo hạn cứng; nhóm câu này ghim ở phạm vi "Cả môn" bất kể user chọn gì |
| 11 | ② Mơ hồ | Câu ngoài miền hoàn toàn ("Hôm nay ăn gì?") | Không được nhận nhầm thành intent tóm tắt (đo bằng negative case trong golden set — FPR hiện 0/3) |

## §6. Bốn đường đi của trải nghiệm

- **Happy path**: hỏi "Tóm tắt buổi học hôm nay" → chip *Cả buổi · Day 6* + dòng "đã tự nới phạm vi từ trang 2" → dàn ý 6 mục kèm khoảng trang bấm được → bấm là nhảy đúng slide.
- **Low-confidence (②)**: kết quả tìm ít/điểm thấp → trả về danh sách "các slide khớp nhất" kèm snippet để user tự chọn, thay vì khẳng định một đáp án.
- **Failure/không căn cứ (①)**: "Mình đã quét cả 29 slide của Day 1 nhưng không thấy nội dung khớp. Có thể chủ đề này nằm ở buổi khác — thử đổi phạm vi sang Cả môn, hoặc hỏi lại bằng từ khoá trong slide."
- **Correction (user sửa)**: user ép phạm vi trên thanh Phạm vi tìm → toast xác nhận; "Tạo lại" sinh lại câu trả lời theo cách diễn đạt khác; 👎 được ghi nhận ("mình sẽ trả lời lại tốt hơn").
- **Khi bị đòi ngoài phạm vi (③)**: từ chối rõ ràng + chuyển hướng hữu ích: nêu 5 việc làm được, 2 việc không làm được (chấm điểm, tài liệu chưa upload).
- **Case đặc thù domain (④)**: câu vận hành lớp (deadline/rubric/nộp bài) luôn trả lời ở cấp môn từ nguồn chính thức, kèm bảng mốc và cảnh báo hạn cứng.

## §7. Kiểm thử

- **Chiều chất lượng + định nghĩa kiểm chứng được** *(đo bằng 2 bộ test độc lập)*:
  1. **NLU đúng ý định** *(bộ 1 — `eval/phuc/`)*: intent accuracy trên golden set (exact match nhãn); entity không được bịa (empty-entity exact match); OOD recall + false-positive rate của intent tóm tắt trên negative case.
  2. **Chất lượng câu trả lời** *(bộ 2 — `eval/manjhh/`)*: 4 tiêu chí chấm thang 0–2 theo rubric trong `eval/manjhh/README.md` — **Accuracy** (khớp nguồn, không thêm fact sai) · **Relevance** (bám đúng câu hỏi) · **Completeness** (đủ ý bắt buộc trong đáp án mẫu) · **Hallucination rate** (số case chứa ≥1 thông tin không nguồn nào ủng hộ / tổng case; case `must_not_include` là bẫy).
  3. **Trả lời có căn cứ**: câu trả lời cấp buổi phải kèm ≥1 trích dẫn trang bấm được, số trang nằm trong tài liệu thật.
- **Golden set (tổng 35 case trên 2 bộ — đạt yêu cầu ≥20 của guide §2.6)**:
  - Bộ 1: `eval/phuc/p_summarytest.json` — 15 case NLU (4 happy · 3 colloquial · 3 missing-entity · 2 typo · 3 negative), quy tắc gán nhãn trong `eval/phuc/README.md`.
  - Bộ 2: `eval/manjhh/golden-set.json` — 20 case answer-quality bám deck Day 6 + transcript 04/05 (có mã trích dẫn), format `expected_answer` / `must_include` / `must_not_include`.
  - Kế hoạch mở rộng trước CP5: thêm ≥5 case NLU lấy từ câu hỏi thật trong chatlog (T0952, T0411, T0776, T1118, T1139, T0607, T0280 — đã xác định sẵn ở §1).
- **Quality bar (chốt từ 23:59 N1, giữ nguyên)**: **"Đạt khi (a) bộ NLU: ≥80% (12/15) đúng intent và 0/3 negative case bị nhận nhầm thành intent tóm tắt; (b) bộ answer-quality: Accuracy TB ≥1,5 · Relevance TB ≥1,5 · Completeness TB ≥1,4 · Hallucination rate ≤10%; (c) mọi câu trả lời cấp buổi trong demo kèm ≥1 trích dẫn trang đúng."** *(Bar 80% = cho phép sai 3/15 case — suite nhỏ nên mỗi case nặng 6,67%; ngưỡng 93,33% trong `eval/phuc/README.md` giữ làm mục tiêu vươn tới, không phải bar. Ngưỡng phụ khi có entity extractor: entity micro-F1 ≥ 0,90; empty-entity exact match 100%.)*
- **Kết quả các lượt chạy** *(cập nhật đến trước CP6)*:

  *Bộ 1 — NLU intent (`eval/phuc/`):*

  | Lượt | Ngày | Phiên bản | Overall intent | Summary intent | OOD FPR | Ghi chú |
  |---|---|---|---|---|---|---|
  | 1 | 30/07 | Baseline — `classifyIntent` regex hiện tại | **46,7%** (7/15) | 33,3% (4/12) | **0/3** ✓ | CHƯA ĐẠT bar. Lỗi chính: "tóm tắt slide N" bị nhận nhầm `session-summary` (tc_001/006/011); câu nói đời thường & typo rơi vào `keyword` (tc_005/007/009/012). Điểm sáng: không false-positive trên câu ngoài miền |
  | 1b | 30/07 16:02 | Xác nhận độc lập — port Python cùng bộ regex (`run_p_summary_test.py`, bộ mở rộng 17 case) | **47,1%** (8/17) | — | — | Hai cách chạy độc lập ra cùng baseline ~47% → số đo tin được; kết quả tại `eval/p_summarytest_results.json` |
  | 2 | [ĐIỀN] | Sửa pattern: ưu tiên `page-summary` khi câu có "slide/trang + số"; thêm nhãn từ chối ngoài miền | [ĐIỀN] | [ĐIỀN] | [ĐIỀN] | Mục tiêu ĐẠT bar ≥80% (12/15) |
  | 3 | [ĐIỀN] | (Nếu lượt 2 chưa đạt) chuyển bước đoán intent sang lời gọi LLM có schema | [ĐIỀN] | [ĐIỀN] | [ĐIỀN] | Vượt bar, hướng tới 93,33% |

  *Bộ 2 — answer-quality (`eval/manjhh/`, chấm tay theo rubric 0–2):*

  | Lượt | Ngày | Phiên bản | Accuracy TB | Relevance TB | Completeness TB | Hallucination | Ghi chú |
  |---|---|---|---|---|---|---|---|
  | 1 | 30/07 16:02 (CP3) | Prototype gọi AI thật + chấm bằng LLM-as-judge theo rubric (`run_eval.py`, source = deck Day 6, 21 case) | **1,71** ✓ (bar 1,5) | **1,90** ✓ (bar 1,5) | **1,62** ✓ (bar 1,4) | **0%** ✓ (bar ≤10%) | **ĐẠT bar cả 4 tiêu chí.** Kết quả từng case kèm reasoning tại `eval/manjhh/eval-results.json` (đã merge về main). Người chạy: Long. Lưu ý phương pháp: LLM chấm theo rubric — nên đối chiếu tay ~5 case để hiệu chuẩn (guide §2.6) |

## §8. Phân công & kế hoạch

- **Phân công có tên**:
  - **Long** — điều phối & phân chia việc; thu thập dữ liệu nguồn A (khảo sát); **eval model qua 2 bộ test tại CP3** (`eval/phuc/` + `eval/manjhh/`); chốt quality bar cho model.
  - **Duy** — phát triển giải pháp AI + prototype (codebase, route `/api/chat`); phân tích dữ liệu nguồn A; viết Canvas nộp CP1.
  - **Quân** — phân tích dữ liệu nguồn B (mining chatlog — số liệu §1); định nghĩa khung eval; phối hợp Duy làm prototype.
  - **Phúc** — đi khảo sát thu dữ liệu nguồn A; xây bộ eval **intent accuracy + entity extraction** (`eval/phuc/`).
  - **Mạnh** — tạo form khảo sát nguồn A; xây bộ eval **accuracy · relevance · completeness · hallucination rate** (`eval/manjhh/`).
- **Willing users (≥3 tên) + kế hoạch vòng validation CP5**: **Nguyễn Đình Liêm, Nguyễn Hồng Yến, Nguyễn Đăng Hưng** (nhóm B2 · K3 · E403 — ngoài nhóm) đã đồng ý thử prototype trước demo; khảo sát nền cho thấy 11/29 người "rất sẵn sàng, đây chính là thứ tôi đang cần". Kịch bản 10 phút/người: giao 3 nhiệm vụ (①"hỏi tóm tắt buổi đang mở" ②"tìm một khái niệm không nhớ ở trang nào" ③"hỏi một câu ngoài phạm vi bất kỳ"), quan sát không nhắc. 3 câu hỏi log lại: *"Bạn có tin phần trích dẫn trang không — có bấm thử không?" · "Dòng 'đã tự nới phạm vi' có giúp bạn hiểu vì sao lần này trả lời được?" · "Chỗ nào bạn muốn sửa câu trả lời của máy?"* — Long log vào `validation/`.
- **Multi-prototype**: không làm — dồn thời gian cho vòng eval intent (điểm yếu đo được ở §7).

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 30/07 · CP1 | Chốt hướng A — tối ưu tutor, lát cắt "trả lời cấp buổi" | Mining chatlog: nhóm tóm tắt buổi bí 62,6% (97/155) — cao nhất mọi nhóm (§1) |
| 30/07 · CP2 | Mock prototype: thang phạm vi Trang/Buổi/Môn + dòng "tự nới phạm vi" + trả lời dạng khối có trích dẫn bấm được | Quote thật T0952/T1118/T0280...: học viên hỏi cấp buổi khi đang đứng ở một trang bất kỳ — cần nới phạm vi và nói rõ đã nới |
| 30/07 · CP3 | Gọi AI thật qua `/api/chat` (OpenAI, key server-side, fallback câu dựng sẵn); dựng lại slide Day 1–2 đúng 29 trang theo PDF data pack | Đạt ràng buộc ≥1 lời gọi AI thật; retrieval cần nội dung thật để trích dẫn đúng trang |
| 30/07 · CP3 | Thêm golden set NLU 15 case (`eval/phuc/`) + chạy lượt eval đầu: 46,7% overall | Cần số đo trước khi sửa classifier — lượt 1 chỉ ra đúng 2 nhóm lỗi cần sửa (§7) |
| 30/07 · CP3 | Bổ sung evidence chuẩn A: khảo sát n=41 (79,3% chê khả năng tóm tắt, 89,7% sẵn sàng dùng giải pháp) + bộ eval answer-quality 20 case (`eval/manjhh/`) | Tiêu chí nghiệm thu #2 yêu cầu chuẩn A và/hoặc B — giờ có cả hai, hai nguồn độc lập xác nhận cùng một pain |
| 30/07 · trước 23:59 | Chốt quality bar intent ở **80% (12/15)** thay vì 93,33% như đề xuất ban đầu của `eval/phuc/README.md` | Suite 15 case → mỗi case nặng 6,67%; 93,33% chỉ cho phép sai 1 case — quá rủi ro với khung 1,5 ngày. 80% vẫn gấp 1,7 lần baseline đo được (46,7%) và giữ điều kiện cứng FPR 0/3 trên câu ngoài miền |
| 30/07 16:02 · CP3 | Chạy lượt eval đầu bộ answer-quality bằng LLM-as-judge: **đạt bar cả 4 tiêu chí** (1,71/1,90/1,62/0%); NLU baseline được xác nhận độc lập lần 2 (47,1% trên 17 case) | Mốc CP3 yêu cầu "AI chạy thật + đo lượt đầu" — chất lượng câu trả lời đã đạt, việc còn lại tập trung vào classifier intent (đang 47% < bar 80%) |
