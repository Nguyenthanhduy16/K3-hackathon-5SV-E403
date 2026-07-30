import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')


# Deaccent function mimicking codebase/lib/session-data.ts's deaccent
def deaccent(s):
    # Very simple deaccenting for Vietnamese lowercase
    s = s.lower()
    replacements = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ề': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd'
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s

# Regex patterns translated from codebase/lib/ai-mock.ts
PATTERNS = [
    {
        "intent": "tutor-probe",
        "re": re.compile(r"\b(ban la ai|ban ten|ban lam duoc gi|giup duoc gi|ban co the lam|lam duoc nhung gi|who are you|what can you do|how can you help)\b")
    },
    {
        "intent": "ops",
        "re": re.compile(r"\b(deadline|han nop|hen nop|nop bai|nop spec|checkpoint|cp[1-6]|moc|lich|thoi gian bieu|may gio|diem|cham diem|rubric|repo|cau truc thu muc|quy dinh|luat|the le|bao nhieu diem)\b")
    },
    # session-summary
    {
        "intent": "session-summary",
        "re": re.compile(r"\b(tom tat|tom luoc|tong hop|tong ket|recap|summar|overview)\w*\b.{0,40}\b(buoi|hom nay|bai hoc|bai giang|ca bai|toan bo|session|lecture|day ?[1-6])\b|^\s*(tom tat buoi|tom tat bai|hom nay hoc gi|buoi nay hoc gi|buoi hom nay hoc gi)")
    },
    # page-summary
    {
        "intent": "page-summary",
        "re": re.compile(r"\b(tom tat|tom luoc|summar)\w*\b.{0,24}\b(trang nay|trang hien tai|trang dang doc|slide nay|doan nay|this page|this slide|current page|trang \d+)\b")
    },
    # compare
    {
        "intent": "compare",
        "re": re.compile(r"\b(so sanh|khac nhau|khac gi|khac biet|versus|\bvs\b|khi nao dung|nen dung cai nao|compar\w*|difference)\b")
    },
    # quiz
    {
        "intent": "quiz",
        "re": re.compile(r"\b(cau hoi on tap|on tap|quiz|kiem tra kien thuc|revision question|test me)\b")
    },
    # example
    {
        "intent": "example",
        "re": re.compile(r"\b(vi du|example|thuc te|real.?world|case study)\b")
    },
    # definition
    {
        "intent": "definition",
        "re": re.compile(r"\b(la gi|nghia la|dinh nghia|thuat ngu|what is|what does .* mean|defin\w*)\b")
    },
    # page-explain
    {
        "intent": "page-explain",
        "re": re.compile(r"\b(giai thich|de hieu hon|noi de hieu|don gian hon|explain|simpler|slide nay|trang nay|doan nay|doan dang doc)\b")
    },
    # mechanism
    {
        "intent": "mechanism",
        "re": re.compile(r"\b(vi sao|tai sao|co che|hoat dong (nhu )?the nao|van hanh ra sao|how does .* work|why)\b")
    }
]

def classify_intent(question):
    q = deaccent(question)
    for p in PATTERNS:
        if p["re"].search(q):
            return p["intent"]
    return "keyword"

def run_tests():
    with open('eval/p_summarytest.json', 'r', encoding='utf-8') as f:
        test_cases = json.load(f)

    passed = 0
    results = []

    print(f"Running intent classification tests on {len(test_cases)} cases...\n")

    for tc in test_cases:
        utterance = tc["utterance"]
        expected = tc["expected_intent"]
        
        # Translate OUT_OF_DOMAIN expected to "keyword" because our code returns "keyword" when no intent matches
        translated_expected = "keyword" if expected == "OUT_OF_DOMAIN" else expected

        predicted = classify_intent(utterance)
        is_pass = (predicted == translated_expected)
        
        if is_pass:
            passed += 1
        
        results.append({
            "id": tc["id"],
            "utterance": utterance,
            "expected": expected,
            "predicted": "OUT_OF_DOMAIN" if predicted == "keyword" else predicted,
            "pass": is_pass
        })

        status = "PASS" if is_pass else "FAIL"
        print(f"[{status}] {tc['id']}: '{utterance}'")
        print(f"      Expected: {expected} | Predicted: {'OUT_OF_DOMAIN' if predicted == 'keyword' else predicted}\n")

    print("========================================")
    print(f"Result: {passed}/{len(test_cases)} passed")
    print("========================================")

    # Save to eval/p_summarytest_results.json
    output_path = 'eval/p_summarytest_results.json'
    output_data = {
        "summary": {
            "total": len(test_cases),
            "passed": passed,
            "failed": len(test_cases) - passed,
            "accuracy": passed / len(test_cases) if len(test_cases) > 0 else 0
        },
        "results": results
    }
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    print(f"Saved results to {output_path}")

if __name__ == "__main__":
    run_tests()
