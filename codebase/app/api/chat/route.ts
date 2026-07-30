import type { AiTurn } from "@/lib/ai-context";

/**
 * Lời gọi AI thật của VLearn Tutor.
 *
 * Client đã tự chọn phạm vi truy xuất và gom sẵn grounding context (xem
 * `lib/ai-context.ts`); route này chỉ ghép prompt và gọi OpenAI. API key đọc
 * từ biến môi trường `OPENAI_API_KEY` (file `.env.local`, không commit) nên
 * không bao giờ lộ xuống trình duyệt.
 *
 * Chưa có key hoặc gọi lỗi → trả JSON lỗi, client tự lui về câu trả lời
 * dựng sẵn trong `lib/ai-mock.ts` để bản demo không bao giờ chết.
 */

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// Model dòng suy luận (gpt-5*, o*) không nhận temperature tuỳ chỉnh.
const IS_REASONING_MODEL = /^(gpt-5|o\d)/.test(OPENAI_MODEL);

interface ChatRequest {
  question: string;
  /** Grounding context của phạm vi đã chọn, dựng ở client. */
  context: string;
  /** Nhãn phạm vi hiển thị, ví dụ "Cả buổi · Day 6" — đưa vào prompt. */
  scopeLabel: string;
  lang: "vi" | "en";
  history: AiTurn[];
  /** true khi người dùng bấm "Tạo lại" — yêu cầu diễn đạt theo cách khác. */
  rephrase?: boolean;
}

function systemPrompt(lang: "vi" | "en", scopeLabel: string): string {
  const vi = lang === "vi";
  return [
    vi
      ? "Bạn là VLearn Tutor — trợ lý học tập trên nền tảng đọc học liệu VLearn, đang giúp sinh viên trong một mini-hackathon về sản phẩm AI."
      : "You are VLearn Tutor — the study assistant inside the VLearn reading platform, helping a student during an AI-product mini-hackathon.",
    vi
      ? `Phạm vi truy xuất của lượt này: ${scopeLabel}. Chỉ trả lời dựa trên NGỮ CẢNH được cung cấp. Khi nêu nội dung lấy từ slide, ghi kèm số trang dạng "(trang N)".`
      : `Retrieval scope for this turn: ${scopeLabel}. Answer ONLY from the provided CONTEXT. When citing slide content, add the page number as "(page N)".`,
    vi
      ? "Nếu ngữ cảnh không đủ để trả lời, nói thẳng là chưa tìm thấy trong phạm vi này và gợi ý người học nới phạm vi tìm (Trang này → Cả buổi → Cả môn) — đừng bịa."
      : "If the context is insufficient, say so plainly and suggest widening the scope (This page → Whole session → Whole course) — never invent facts.",
    vi
      ? "Trả lời bằng tiếng Việt, thân thiện, xưng \"mình\", gọi người học là \"bạn\". Ngắn gọn: tối đa khoảng 180 từ."
      : "Answer in English, friendly and concise: at most ~180 words.",
    vi
      ? "Định dạng: text thuần, KHÔNG dùng markdown đậm/nghiêng/bảng/tiêu đề #. Được dùng gạch đầu dòng \"- \" và danh sách đánh số \"1.\" khi giúp câu trả lời rõ hơn; dòng giới thiệu danh sách kết thúc bằng dấu hai chấm."
      : "Format: plain text only — NO bold/italics/tables/# headings. You may use \"- \" bullets and numbered \"1.\" lists when they help; introduce a list with a line ending in a colon.",
  ].join("\n");
}

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return Response.json({ error: "missing-key" }, { status: 503 });
  }

  const vi = body.lang !== "en";
  const messages = [
    { role: "system", content: systemPrompt(body.lang, body.scopeLabel) },
    // Lịch sử gần nhất để giữ mạch hội thoại (client đã cắt còn vài lượt).
    ...(Array.isArray(body.history) ? body.history : []).map((turn) => ({
      role: turn.role === "assistant" ? "assistant" : "user",
      content: turn.text,
    })),
    {
      role: "user",
      content: [
        vi ? "NGỮ CẢNH (trích từ học liệu):" : "CONTEXT (from course materials):",
        body.context ?? "",
        "---",
        vi ? `Câu hỏi của người học: ${question}` : `Student question: ${question}`,
        body.rephrase
          ? vi
            ? "(Người học bấm \"Tạo lại\" — hãy diễn đạt câu trả lời theo một cách khác.)"
            : "(The student asked to regenerate — phrase the answer differently.)"
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_completion_tokens: 1024,
        ...(IS_REASONING_MODEL ? {} : { temperature: body.rephrase ? 0.8 : 0.4 }),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`OpenAI ${res.status}: ${detail.slice(0, 500)}`);
      return Response.json(
        { error: res.status === 429 ? "rate-limited" : "upstream" },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return Response.json({ error: "empty" }, { status: 502 });
    }

    return Response.json({ text });
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return Response.json({ error: "network" }, { status: 502 });
  }
}
