import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Отримуємо текст, який прислав фронтенд
    const body = await req.json();
    const userText = body.text;

    if (!userText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 2. Формуємо промпт для GPT
    const systemPrompt = `
      Ти - саркастичний і чесний аналітик соціальних мереж. Твоя задача - зробити "прожарку" (roast) і аналіз профілю Threads на основі наданих постів.
      Спілкуйся українським молодіжним сленгом (крінж, база, вайб, душніла, ред флаг).

      Ти ПОВИНЕН повернути відповідь виключно у форматі JSON:
      {
        "archetype": "Коротка смішна назва типу особистості (макс 3 слова)",
        "superpower": "Опис їхньої суперсили (1 речення, смішно)",
        "stats": {
          "toxicity": (число від 0 до 100),
          "ego": (число від 0 до 100),
          "boringness": (число від 0 до 100)
        },
        "roast": "Жорсткий, але смішний висновок (1-2 речення)."
      }
    `;

    // 3. Відправляємо запит до OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Дешева і швидка модель
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Ось мої пости: "${userText}"` },
      ],
      response_format: { type: "json_object" }, // Важливо: змушуємо видати чистий JSON
    });

    // 4. Парсимо відповідь і віддаємо на фронт
    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
