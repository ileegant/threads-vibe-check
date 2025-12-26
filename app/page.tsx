"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import Barcode from "react-barcode";

// 🔥 ЧОРНИЙ СПИСОК (Пиши сюди ніки маленькими літерами)
const BLACKLIST = ["russia", "putin", "moscow", "baduser", "rusnya"];

// --- ЛОГІКА ГЕНЕРАЦІЇ ---
const generateVibe = (username: string, posts: string[]) => {
  const textSeed = posts.length > 0 ? posts.join("").length : username.length;
  const nameSeed = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = nameSeed + textSeed;

  const archetypes = [
    "Генерал Диванних Військ 🛋️",
    "Душніла 80 lvl 🤓",
    "Інфлюенсер без аудиторії 🤳",
    "Експерт з усього 🎓",
    "Людина-Зрада 😡",
    "Котик-Вуркотик 😻",
    "Королева драми 🎭",
    "Поліція моралі 👮‍♂️",
  ];
  const superpowers = [
    "Вміє знайти зраду навіть у ранковій каві з молоком.",
    "Пише треди, які ніхто не дочитує до кінця.",
    "Збирає лайки, як покемонів (але рідкісних немає).",
    "Може образитись на смайлик 🙂.",
    "Генерує контент швидше, ніж думає.",
    "Знає, як краще керувати країною, сидячи на унітазі.",
  ];
  const roasts = [
    "Тобі терміново треба вийти на вулицю і поторкати траву.",
    "Видаліть акаунт, поки це не зробив Марк Цукерберг.",
    "Твій вайб — це як піца з ананасами: на любителя.",
    "Менше тексту, більше мемів. Будь ласка.",
    "Ти серйозно це запостив? Я навіть як ШІ в шоці.",
    "Здається, тебе вкусив радіоактивний душніла.",
  ];

  return {
    archetype: archetypes[seed % archetypes.length],
    superpower: superpowers[seed % superpowers.length],
    stats: {
      toxicity: (seed * 13) % 100,
      ego: (seed * 7) % 100,
      boringness: (seed * 23) % 100,
    },
    roast: roasts[seed % roasts.length],
  };
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState<any>(null);
  const [userLocation, setUserLocation] = useState("Локація визначається...");
  const [errorMsg, setErrorMsg] = useState("");

  // Стейт для бану
  const [isBanned, setIsBanned] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        if (data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
        } else {
          setUserLocation("Україна (Інкогніто)");
        }
      })
      .catch(() => {
        setUserLocation("Десь в Інтернеті");
      });
  }, []);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const handleGenerate = async () => {
    // 1. Очищаємо нік
    const cleanNick = username.replace("@", "").trim();

    if (!cleanNick) return showError("Введи хоч щось!");

    // 2. 🔥 ПЕРЕВІРКА НА БАН (case-insensitive)
    if (BLACKLIST.includes(cleanNick.toLowerCase())) {
      setIsBanned(true);
      return; // Зупиняємо функцію тут
    }

    setLoading(true);
    setResult(null);
    setLoadingStep("🔄 Підключаємось до серверів Meta...");

    try {
      const response = await fetch("/api/get-threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanNick }),
      });

      const data = await response.json();

      let postsData = [];
      if (data.error) {
        console.log("API Error (using fallback):", data.error);
      } else {
        postsData = data.posts || [];
      }

      setLoadingStep("🧠 Аналізуємо ваші думки...");
      await new Promise((r) => setTimeout(r, 800));

      const aiResult = generateVibe(cleanNick, postsData);
      setResult(aiResult);
    } catch (error) {
      console.error(error);
      showError("Щось пішло не так. Спробуй ще раз.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const resetApp = () => {
    setResult(null);
    setUsername("");
  };

  const downloadImage = useCallback(async () => {
    if (!receiptRef.current) return;

    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        backgroundColor: "transparent",
        skipFonts: true,
        filter: (node) => node.tagName !== "LINK",
        style: {
          padding: "20px",
        },
      });

      const link = document.createElement("a");
      link.download = `vibe-${username.replace("@", "")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Помилка генерації картинки:", err);
      showError("Не вдалося створити картинку 😢");
    }
  }, [receiptRef, username]);

  return (
    <>
      {/* --- ЕКРАН БАНУ (ВИСКАКУЄ ЯКЩО НІК У BLACKLIST) --- */}
      {isBanned && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black text-[#ff0000] mb-6 uppercase tracking-tighter shake">
            ЙДИ
            <br />
            НАХУЙ
          </h1>
          <p className="text-white font-mono text-lg mb-8 uppercase">
            Цей нікнейм заблоковано системою.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition"
          >
            Зрозумів, виходжу
          </button>
        </div>
      )}

      {/* ХЕДЕР */}
      <header className="fixed top-0 left-0 w-full h-12 bg-black text-white flex items-center justify-between px-4 md:px-6 z-50 shadow-md select-none">
        <div className="font-bold tracking-widest text-xs md:text-sm truncate mr-2">
          THREADS VIBE CHECK
        </div>
        <div className="text-[10px] opacity-70 whitespace-nowrap">by Олег</div>
      </header>

      {/* АЛЕРТ */}
      {errorMsg && (
        <div className="fixed top-16 right-4 md:right-5 bg-[#ff4b4b] text-white px-4 py-3 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black z-50 animate-bounce mx-auto max-w-[90%] rounded-lg">
          ⚠️ {errorMsg}
        </div>
      )}

      <main className="min-h-screen bg-[#e5e5e5] text-black flex flex-col items-center justify-center p-4 md:p-6 font-mono pt-24 md:pt-20 pb-10">
        {!result && (
          <div className="text-center mb-8 animate-fade-in px-4">
            <h1 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-tighter">
              🧾 ЧЕК ЗА ВАЙБ
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              ШІ просканує твій Threads і винесе вирок.
              <br />
              Готуй свої виправдання.
            </p>
          </div>
        )}

        {!result ? (
          /* ФОРМА ВВОДУ */
          <div className="w-full max-w-sm space-y-4 animate-fade-in">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-white border-2 border-black text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/20 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold uppercase rounded-none appearance-none"
                placeholder="username"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-black text-white font-bold hover:bg-gray-800 transition active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] disabled:opacity-50 uppercase text-lg"
            >
              {loading ? loadingStep || "Завантаження..." : "СКАНУВАТИ ПРОФІЛЬ"}
            </button>
          </div>
        ) : (
          /* РЕЗУЛЬТАТ */
          <div className="flex flex-col items-center gap-6 w-full max-w-[380px] animate-slide-up">
            <div
              ref={receiptRef}
              className="w-full bg-transparent flex justify-center"
            >
              <div className="w-full bg-white p-6 shadow-2xl relative text-black">
                <div className="absolute top-0 left-0 w-full h-4 bg-[radial-gradient(circle,transparent_50%,#fff_50%)] bg-[length:16px_16px] -mt-2 rotate-180"></div>

                <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
                  <h2 className="text-2xl font-black uppercase tracking-widest">
                    УКР ТРЕДС ТОВ
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {userLocation}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString("uk-UA")} •{" "}
                    {new Date().toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm font-bold mt-2 break-all">
                    Клієнт: @{username.replace("@", "")}
                  </p>
                </div>

                <div className="space-y-3 mb-6 text-sm uppercase font-bold">
                  <div className="flex justify-between items-start gap-2">
                    <span>АРХЕТИП:</span>
                    <span className="text-right leading-tight text-[#6b21a8] break-words">
                      {result.archetype}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ТОКСИЧНІСТЬ</span>
                    <span>₴{result.stats.toxicity}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>РІВЕНЬ ЕГО</span>
                    <span>₴{result.stats.ego}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ДУШНІСТЬ</span>
                    <span>-₴{result.stats.boringness}.50</span>
                  </div>
                </div>

                <div className="border-b-2 border-dashed border-black mb-4"></div>

                <div className="mb-4">
                  <p className="text-xs font-bold mb-1">СУПЕРСИЛА:</p>
                  <p className="text-sm leading-tight lowercase first-letter:uppercase">
                    "{result.superpower}"
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold mb-1">ВЕРДИКТ:</p>
                  <p className="text-sm bg-black text-white p-2 inline-block -rotate-1 font-sans leading-tight">
                    {result.roast}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-2 overflow-hidden pb-2">
                  <div className="scale-y-125 opacity-80">
                    <Barcode
                      value={`CHECK${new Date().getFullYear()}${
                        result.stats.toxicity
                      }`}
                      width={1.5}
                      height={40}
                      format="CODE128"
                      displayValue={false}
                      background="transparent"
                      lineColor="#000000"
                    />
                  </div>
                  <div className="font-mono text-xl tracking-[0.3em] font-bold">
                    CHECK-{new Date().getFullYear()}
                  </div>

                  <p className="text-xs font-bold uppercase mt-3">
                    Товар поверненню не підлягає
                  </p>
                  <p className="text-[10px] text-gray-400">
                    generated by threads-vibe
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-4 bg-[radial-gradient(circle,transparent_50%,#fff_50%)] bg-[length:16px_16px] -mb-2"></div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <button
                onClick={downloadImage}
                className="w-full py-3 px-4 bg-white border-2 border-black font-bold hover:bg-gray-100 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 text-sm flex items-center justify-center gap-2 uppercase"
              >
                📥 Зберегти чек
              </button>

              <a
                href="https://send.monobank.ua/jar/ТВОЯ_БАНКА"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-transform duration-200 shadow-lg uppercase text-sm"
              >
                <span className="text-xl">🤡</span>
                <span>Сплатити штраф за крінж</span>
              </a>

              <button
                onClick={resetApp}
                className="mt-2 text-gray-500 font-bold hover:text-black underline decoration-2 underline-offset-4 transition uppercase text-xs tracking-widest"
              >
                🔄 Спробувати ще раз
              </button>
            </div>
          </div>
        )}

        <footer className="fixed bottom-4 left-0 w-full text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest select-none pointer-events-none">
          👨‍💻 Dev: Олег
        </footer>
      </main>
    </>
  );
}
