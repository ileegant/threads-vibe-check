// app/api/get-threads/route.ts
import { NextResponse } from "next/server";
import { ThreadsAPI } from "threads-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Нікнейм обов’язковий" },
        { status: 400 }
      );
    }

    // --- ЗМІНИ ТУТ ---
    // Передаємо ID з файлу .env.local
    const threadsAPI = new ThreadsAPI({
      deviceID: process.env.THREADS_DEVICE_ID,
    });
    // -----------------

    const userID = await threadsAPI.getUserIDfromUsername(username);

    if (!userID) {
      return NextResponse.json(
        { error: "Користувача не знайдено або профіль закритий" },
        { status: 404 }
      );
    }

    const posts = await threadsAPI.getUserProfileThreads(userID);

    const texts = posts
      .map((post: any) => post.thread_items[0]?.post?.caption?.text)
      .filter(Boolean)
      .slice(0, 5);

    return NextResponse.json({ posts: texts });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Помилка серверу або ліміти Meta" },
      { status: 500 }
    );
  }
}
