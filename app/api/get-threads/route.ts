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

    const threadsAPI = new ThreadsAPI({
      deviceID: process.env.THREADS_DEVICE_ID,
    });

    const userID = await threadsAPI.getUserIDfromUsername(username);

    if (!userID) {
      return NextResponse.json(
        { error: "Користувача не знайдено" },
        { status: 404 }
      );
    }

    // Отримуємо пости
    const posts = await threadsAPI.getUserProfileThreads(userID);

    // Витягуємо тексти
    const texts = posts
      .map((post: any) => post.thread_items[0]?.post?.caption?.text)
      .filter(Boolean)
      .slice(0, 5);

    // 🔥 ВИПРАВЛЕННЯ АВАТАРКИ
    // 1. Шукаємо URL аватарки всередині об'єкта поста (так надійніше)
    let avatarUrl = null;
    try {
      // Пробуємо знайти юзера в першому пості
      const userObj = posts[0]?.thread_items[0]?.post?.user;
      if (userObj && userObj.profile_pic_url) {
        avatarUrl = userObj.profile_pic_url;
      }
    } catch (e) {
      console.log("Could not find avatar in posts");
    }

    // 2. Якщо знайшли URL, перетворюємо картинку в Base64 на сервері
    // Це ОБОВ'ЯЗКОВО для того, щоб html-to-image міг її зберегти
    let avatarBase64 = null;
    if (avatarUrl) {
      try {
        const imageRes = await fetch(avatarUrl);
        if (imageRes.ok) {
          const arrayBuffer = await imageRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          avatarBase64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        }
      } catch (e) {
        console.error("Failed to convert avatar to base64", e);
      }
    }

    return NextResponse.json({
      posts: texts,
      avatar: avatarBase64, // Віддаємо вже закодовану картинку
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Помилка серверу" }, { status: 500 });
  }
}
