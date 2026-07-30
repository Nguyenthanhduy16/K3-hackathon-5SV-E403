import os
import sys
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')


# Read OpenAI API Key from command line or environment
OPENAI_API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("Error: Please provide the OpenAI API key either as an argument or set the OPENAI_API_KEY environment variable.")
    print("Usage: python run_eval.py <OPENAI_API_KEY>")
    sys.exit(1)

# Slide contents of Day 6
slides_day6 = """
Slide 1 (Cover):
Title: AI Product & Project Management
Subtitle: AICB-P1 · Ngày 6 · Quản lý sản phẩm AI như thế nào?
Body: Tên Giảng Viên
Footnote: VinUniversity · Phase 1 · Tuần 1 · 2026

Slide 2 (Think):
Eyebrow: HÃY SUY NGHĨ...
Title: Team đã build 3 tuần. Nhưng stakeholder muốn đổi requirements. Làm sao xử lý?
Footnote: Giữ câu hỏi này trong đầu khi học bài hôm nay

Slide 3 (Section):
Eyebrow: PHẦN 1
Title: Vì sao quản lý sản phẩm AI khác đi
Subtitle: Ba nguồn bất định mà dự án phần mềm thường không có

Slide 4 (Bullets):
Eyebrow: BỐI CẢNH
Title: Ba điều khiến dự án AI khó ước lượng
Bullets:
- Chất lượng đầu ra là phân phối xác suất, không phải trạng thái đúng/sai.
- Chi phí và độ trễ thay đổi theo prompt, model và lưu lượng thật.
- Người dùng đổi kỳ vọng ngay khi họ chạm vào bản chạy đầu tiên.
Footnote: Hệ quả: kế hoạch phải bám vào bằng chứng, không bám vào niềm tin.

Slide 5 (Compare):
Eyebrow: SO SÁNH
Title: Phần mềm truyền thống vs sản phẩm AI
Phần mềm truyền thống:
- Requirement rõ → test pass/fail
- Bug tái hiện được
- Ước lượng theo số màn hình
- Chốt scope là chốt kết quả
Sản phẩm AI:
- Requirement mờ → cần quality bar
- Lỗi mang tính xác suất
- Ước lượng theo số vòng eval
- Chốt scope chỉ chốt phạm vi thử

Slide 6 (Bullets):
Eyebrow: VÒNG ĐỜI
Title: Năm chặng của một sản phẩm AI
Bullets:
- Khám phá — tìm bằng chứng cho job cần giải.
- Spec — chốt lát cắt, quality bar và cách đo.
- Prototype — chạy thật ít nhất một lời gọi AI.
- Eval — đo trên golden set, ghi nhận trung thực.
- Validation — đưa cho người dùng thật, sửa theo phản hồi.

Slide 7 (Section):
Eyebrow: PHẦN 2
Title: Khi requirements thay đổi giữa chừng
Subtitle: Xử lý thay đổi mà không phá kế hoạch

Slide 8 (Bullets):
Eyebrow: CHẨN ĐOÁN
Title: Scope creep thường vào cửa nào?
Bullets:
- Stakeholder mới xuất hiện sau khi team đã bắt đầu build.
- Demo giữa kỳ khiến người xem nghĩ ra tính năng mới.
- Tiêu chí thành công chưa bao giờ được viết ra thành số.
- Một lỗi lẻ được nâng cấp thành yêu cầu lớn.

Slide 9 (Checklist):
Eyebrow: QUY TRÌNH
Title: Bốn bước xử lý yêu cầu thay đổi
Bullets:
- Làm rõ: thay đổi này giải quyết vấn đề gì cho ai?
- Định lượng: ảnh hưởng tới phạm vi, thời gian, nguồn lực bao nhiêu?
- Đưa lựa chọn: đổi ngay · làm sau · đánh đổi với hạng mục khác.
- Chốt bằng văn bản: cập nhật spec và thông báo lại cho cả nhóm.
Footnote: Không từ chối ngay, cũng không gật đầu ngay.

Slide 10 (Quote):
Eyebrow: GHI NHỚ
Title: Nói không với một thay đổi là bảo vệ lời hứa bạn đã đưa ra cho thay đổi trước đó.
Footnote: Ưu tiên là một danh sách có thứ tự, không phải một cái túi.

Slide 11 (Section):
Eyebrow: PHẦN 3
Title: Đo lường và chất lượng
Subtitle: Quality bar, golden set và cách đọc kết quả

Slide 12 (Bullets):
Eyebrow: QUALITY BAR
Title: Chốt trước, giữ nguyên sau đó
Bullets:
- Viết bằng con số: tỷ lệ đạt, độ trễ tối đa, chi phí mỗi lượt.
- Gắn với một lát cắt cụ thể, không phải toàn bộ sản phẩm.
- Ai cũng đọc được trong 30 giây — nếu không, viết lại.
- Thay đổi quality bar giữa chừng là thay đổi kết quả đo.

Slide 13 (Bullets):
Eyebrow: GOLDEN SET
Title: Bộ ca kiểm thử tối thiểu
Bullets:
- 20–30 ca là đủ để thấy xu hướng ở giai đoạn prototype.
- Trộn ca dễ, ca khó và ca nên từ chối trả lời.
- Ghi rõ đầu vào, đầu ra mong đợi và lý do chấm đạt.
- Chạy lại nguyên bộ sau mỗi lần đổi prompt.

Slide 14 (Compare):
Eyebrow: RỦI RO
Title: Rủi ro kỹ thuật vs rủi ro sản phẩm
Kỹ thuật:
- Model trả lời sai tự tin
- Chi phí vượt ngân sách
- Độ trễ vượt ngưỡng chịu đựng
- Phụ thuộc một nhà cung cấp
Sản phẩm:
- Giải đúng bài toán không ai cần
- Người dùng không tin kết quả
- Không đo được giá trị mang lại
- Quy trình cũ vẫn nhanh hơn

Slide 15 (Checklist):
Eyebrow: TRƯỚC DEMO
Title: Checklist 6 mục cần chuẩn bị
Bullets:
- Một câu nói rõ sản phẩm giải job gì cho ai.
- Bằng chứng dẫn tới quyết định thiết kế.
- Bản chạy được với ít nhất một lời gọi AI thật.
- Bảng kết quả eval kèm ca thất bại.
- Phản hồi từ vòng user test.
- Kịch bản dự phòng khi demo hỏng.

Slide 16 (Bullets):
Eyebrow: TÓM LẠI
Title: Ba điều mang về từ hôm nay
Bullets:
- Kế hoạch AI là kế hoạch học — mỗi vòng lặp phải trả lời một câu hỏi.
- Thay đổi yêu cầu là tín hiệu, không phải tai nạn — hãy định lượng nó.
- Không có phép đo trung thực thì không có tiến bộ để báo cáo.

Slide 17 (Role):
Eyebrow: VAI TRÒ
Title: Ai làm gì trong nhóm sản phẩm AI
Bullets:
- Product owner giữ job và quality bar.
- Kỹ sư giữ vòng lặp eval chạy được hằng ngày.
- Người thiết kế giữ kịch bản khi AI trả lời sai.

Slide 18 (Nhịp làm việc):
Eyebrow: NHỊP LÀM VIỆC
Title: Một tuần trông như thế nào
Bullets:
- Đầu tuần: chọn một giả thuyết để kiểm chứng.
- Giữa tuần: chạy eval và ghi lại số liệu thô.
- Cuối tuần: quyết định giữ, sửa hay bỏ.

Slide 19 (Ưu tiên):
Eyebrow: ƯU TIÊN
Title: Xếp hạng bằng ba câu hỏi
Bullets:
- Nếu bỏ đi, người dùng có nhận ra không?
- Ta có cách đo kết quả trong tuần này không?
- Chi phí sai lầm là bao nhiêu?

Slide 20 (Ước lượng):
Eyebrow: ƯỚC LƯỢNG
Title: Đếm vòng lặp, đừng đếm giờ
Bullets:
- Một vòng = đổi prompt, chạy eval, đọc kết quả.
- Ghi lại số vòng thực tế đã tốn cho mỗi lát cắt.
- Dùng số đó cho lần ước lượng kế tiếp.

Slide 21 (Giao tiếp):
Eyebrow: GIAO TIẾP
Title: Báo cáo tiến độ cho stakeholder
Bullets:
- Nói bằng kết quả đo, không bằng số commit.
- Nêu rõ điều đang chặn và cần ai gỡ.
- Luôn kèm một quyết định cần người khác chốt.

Slide 22 (Tài liệu):
Eyebrow: TÀI LIỆU
Title: Spec sống cùng sản phẩm
Bullets:
- Mỗi thay đổi lớn để lại một dòng lịch sử.
- Phần nào là mock thì ghi rõ là mock.
- Không ai nhớ được lý do — nên hãy viết lý do.

Slide 23 (Chi phí):
Eyebrow: CHI PHÍ
Title: Ba con số cần theo dõi
Bullets:
- Chi phí chạy model (token, api key)
- Thời gian trễ
- Tỷ lệ lỗi (lượng query fail)
"""

def call_openai(messages, response_format=None):
    url = "https://api.openai.com/v1/chat/completions"
    data = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.1
    }
    if response_format:
        data["response_format"] = response_format

    req_data = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as res:
            res_data = res.read().decode("utf-8")
            parsed = json.loads(res_data)
            return parsed["choices"][0]["message"]["content"].strip()
    except urllib.error.HTTPError as e:
        error_info = e.read().decode("utf-8")
        raise RuntimeError(f"OpenAI API Error {e.code}: {error_info}")

def run():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    golden_set_path = os.path.join(base_dir, 'eval', 'manjhh', 'golden-set.json')
    
    with open(golden_set_path, 'r', encoding='utf-8') as f:
        golden_set = json.load(f)

    print(f"Loaded {len(golden_set['cases'])} evaluation cases.")

    t4_path = os.path.join(base_dir, 'data', 'vlearn-pack', 'transcript', 'transcript-04-clean.md')
    t5_path = os.path.join(base_dir, 'data', 'vlearn-pack', 'transcript', 'transcript-05-clean.md')

    t4_content = ""
    if os.path.exists(t4_path):
        with open(t4_path, 'r', encoding='utf-8') as f:
            t4_content = f.read()

    t5_content = ""
    if os.path.exists(t5_path):
        with open(t5_path, 'r', encoding='utf-8') as f:
            t5_content = f.read()

    results = []

    for c in golden_set['cases']:
        print(f"\nEvaluating Case {c['id']}: \"{c['prompt']}\"...")

        # Determine Context
        context = ""
        if "mock-data.ts" in c['source']:
            context = slides_day6
        elif "transcript-04-clean.md" in c['source']:
            context = t4_content
        elif "transcript-05-clean.md" in c['source']:
            context = t5_content

        # Call Tutor Model
        system_prompt = f"""You are VLearn Tutor. You answer questions based ONLY on the provided context. If the answer cannot be found in the context, say "Không tìm thấy".
Keep the answer concise and well-structured, using bullet points or tables where appropriate, following VLearn's response style.

Context:
{context}"""

        try:
            response = call_openai([
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": c['prompt']}
            ])
            print(f"> Response: {response.replace(chr(10), ' ')}")
        except Exception as e:
            print(f"Error calling OpenAI for case {c['id']}: {e}")
            continue

        # Grade Response
        grading_system_prompt = f"""You are an AI model evaluation judge.
Evaluate the model response against the context and expected answer criteria.
Criteria:
1. Accuracy (0-2):
   - 2: Fully accurate, no false facts or claims unsupported by context.
   - 1: Mostly accurate but minor inaccuracies or fluff.
   - 0: Major inaccuracies or claims unsupported by context.
2. Relevance (0-2):
   - 2: Direct answer, on-topic.
   - 1: Slightly off-topic but still helpful.
   - 0: Irrelevant.
3. Completeness (0-2):
   - 2: Includes all points in "must_include".
   - 1: Missing some points but contains main ideas.
   - 0: Missing most or all points.
4. Hallucination (0 or 1):
   - 1: Contains any fact/information not present in or supported by the context (especially if it matches any "must_not_include" pattern or introduces unrelated outside info).
   - 0: No hallucination (all statements are strictly supported by the context).

Expected Answer: {c['expected_answer']}
Must Include (exact concepts or words): {json.dumps(c['must_include'])}
Must Not Include: {json.dumps(c['must_not_include'])}

Model Response: {response}

Return a JSON object:
{{
  "accuracy": number (0-2),
  "relevance": number (0-2),
  "completeness": number (0-2),
  "hallucination": number (0 or 1),
  "reasoning": "brief explanation"
}}"""

        grade = {"accuracy": 0, "relevance": 0, "completeness": 0, "hallucination": 1, "reasoning": "Evaluation failed"}
        try:
            grading_result = call_openai([
                {"role": "system", "content": grading_system_prompt},
                {"role": "user", "content": "Please evaluate the response and return output in JSON format."}
            ], response_format={"type": "json_object"})
            grade = json.loads(grading_result)
            print(f"> Grade: Acc={grade.get('accuracy')}, Rel={grade.get('relevance')}, Comp={grade.get('completeness')}, Hal={grade.get('hallucination')} ({grade.get('reasoning')})")
        except Exception as e:
            print(f"Error grading case {c['id']}: {e}")

        results.append({
            "id": c['id'],
            "prompt": c['prompt'],
            "response": response,
            "grade": grade
        })

    # Calculate Aggregates
    total = len(results)
    sum_acc = sum(r['grade'].get('accuracy', 0) for r in results)
    sum_rel = sum(r['grade'].get('relevance', 0) for r in results)
    sum_comp = sum(r['grade'].get('completeness', 0) for r in results)
    sum_hal = sum(r['grade'].get('hallucination', 1) for r in results)

    avg_acc = sum_acc / total if total > 0 else 0
    avg_rel = sum_rel / total if total > 0 else 0
    avg_comp = sum_comp / total if total > 0 else 0
    hal_rate = (sum_hal / total) * 100 if total > 0 else 100

    print("\n================ EVALUATION SUMMARY ================")
    print(f"Total Cases: {total}")
    print(f"Average Accuracy: {avg_acc:.2f} (Target >= 1.5)")
    print(f"Average Relevance: {avg_rel:.2f} (Target >= 1.5)")
    print(f"Average Completeness: {avg_comp:.2f} (Target >= 1.4)")
    print(f"Hallucination Rate: {hal_rate:.1f}% (Target <= 10%)")
    print("====================================================")

    output_path = os.path.join(base_dir, 'eval', 'manjhh', 'eval-results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            "summary": {
                "total": total,
                "avgAccuracy": avg_acc,
                "avgRelevance": avg_rel,
                "avgCompleteness": avg_comp,
                "hallucinationRate": hal_rate
            },
            "results": results
        }, f, indent=2, ensure_ascii=False)

    print(f"Results saved to {output_path}")

if __name__ == "__main__":
    run()
