"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import Barcode from "react-barcode";

// 🔧 НАЛАШТУВАННЯ
const DONATE_LINK = "https://send.monobank.ua/jar/ТВОЯ_БАНКА"; // <--- ВСТАВ ПОСИЛАННЯ
const DEVELOPER_NAME = "ileegant";

// 🔥 ЧОРНИЙ СПИСОК
const BLACKLIST = ["russia", "putin", "moscow", "rusnya", "brattkka"];

// 🎨 ПАЛІТРА ЧЕКІВ
const RECEIPT_COLORS = [
  { hex: "#ffffff", name: "Classic White" },
  { hex: "#F4FF5F", name: "Acid Yellow" },
  { hex: "#FF9EAA", name: "Punk Pink" },
  { hex: "#A0E9FF", name: "Electric Blue" },
  { hex: "#C7F9CC", name: "Mint Fresh" },
];

// --- СПИСКИ ДАНИХ (Ті самі, що й були) ---
const ARCHETYPES_LIST = [
  "Генерал Диванних Військ 🛋️",
  "Душніла 80 lvl 🤓",
  "Інфлюенсер без аудиторії 🤳",
  "Експерт з усього 🎓",
  "Людина-Зрада 😡",
  "Котик-Вуркотик 😻",
  "Королева драми 🎭",
  "Поліція моралі 👮‍♂️",
  "Адепт кави 3-ї хвилі ☕",
  "Мамин айтішник 💻",
  "Свідок ІПСО 🕵️‍♂️",
  "Психолог з ТікТоку 🧠",
  "Воїн світла і добра ✨",
  "Токсичний колишній 💔",
  "Міський божевільний 🤪",
  "Крипто-мільйонер (в мінусі) 📉",
  "Амбасадор вигорання 🔋",
  "Експерт з геополітики 🌍",
  "Заслужений хейтер 🤬",
  "Інста-шаманка 🔮",
  "Львівський батяр 🎩",
  "Київський сноб 🏙️",
  "Одеситка з характером ⚓",
  "Зумер на пенсії 👴",
  "Людина-мем 😂",
  "Головний по тарілочках 🍽️",
  "Ревізор твоїх сторіз 🧐",
  "Філософ о 3-й ночі 🌙",
  "Колекціонер тривог 🚨",
  "Залежний від новин 📺",
  "Король крінжа 👑",
  "Адепт успішного успіху 🚀",
  "Голос нації 🇺🇦",
  "Професійний потерпілий 🤕",
  "Власник думки, яку ніхто не питав 🗣️",
  "Детектив по лайках 🔍",
  "Архітектор повітряних замків 🏰",
  "Володар чорного поясу з сарказму 🥋",
  "Останній романтик Інтернету 🌹",
  "Генератор випадкових фактів 📚",
  "Той, хто завжди правий ☝️",
  "Людина-оркестр 🎺",
  "Блогер-початківець (10 років) 📹",
  "Експерт з стосунків (розлучений) 💔",
  "Фешн-ікона з секонду 👗",
  "Сомельє з АТБ 🍷",
  "Майстер спорту з прокрастинації 🛌",
  "Гуру продуктивності 📅",
  "Внутрішній емігрант 🧳",
  "Патріот на відстані 🔭",
  "Людина-катастрофа 🌪️",
  "Надто серйозний фейс 🗿",
  "Королева пасивної агресії 💅",
  "Стендапер без жартів 🎤",
  "Таролог 5-го розряду 🃏",
  "Нутриціолог-самоучка 🥦",
  "Свідок плоскої землі 🌎",
  "Людина-вікіпедія 📖",
  "Хранитель чужих секретів 🤫",
  "Головний душніла району 🌬️",
];

const SUPERPOWERS_LIST = [
  "Вміє знайти зраду навіть у ранковій каві з молоком.",
  "Пише треди, які ніхто не дочитує до кінця.",
  "Збирає лайки, як покемонів (але рідкісних немає).",
  "Може образитись на смайлик 🙂.",
  "Генерує контент швидше, ніж думає.",
  "Знає, як краще керувати країною, сидячи на унітазі.",
  "Бачить ІПСО у прогнозі погоди.",
  "Вміє ігнорувати реальність професійно.",
  "Робить скріншоти швидше за світло.",
  "Має чорний пояс з пасивної агресії.",
  "Може посваритися з дзеркалом і програти.",
  "Знає все про всіх, але нічого корисного.",
  "Перетворює будь-яку розмову на суперечку.",
  "Визначає діагнози по аватарці.",
  "Блокує людей швидше, ніж кліпає.",
  "Вміє нити трьома мовами одночасно.",
  "Знаходить помилки в меню ресторанів.",
  "Пам'ятає, хто що лайкнув у 2017 році.",
  "Може написати поему про відключення світла.",
  "Вважає, що Земля крутиться навколо його его.",
  "Створює проблеми там, де їх не було.",
  "Має алергію на чужу думку.",
  "Читає думки (але неправильно).",
  "Професійно вигорає по п'ятницях.",
  "Закохується в аватарки.",
  "Робить висновки космічного масштабу з нічого.",
  "Вміє мовчати так, що всім стає соромно.",
  "Знає рецепт щастя, але нікому не каже.",
  "Перетворює воду на вино (метафорично).",
  "Має суперздатність спати 12 годин і не висипатися.",
  "Відчуває вайб через екран.",
  "Може пояснити квантову фізику на пальцях (неправильно).",
  "Завжди знає, де дешевше, але купує дорого.",
  "Вміє бути онлайн і не відписувати тижнями.",
  "Створює драми на рівному місці.",
  "Має вбудований детектор брехні (зламаний).",
  "П'є каву літрами, щоб відчувати хоч щось.",
  "Завжди має «геніальну» ідею для стартапу.",
  "Вміє зіпсувати настрій одним повідомленням.",
  "Бачить майбутнє, і воно йому не подобається.",
  "Може знайти вихід, але шукає вхід.",
  "Вміє говорити «ні» можливостям.",
  "Має талант спізнюватися на онлайн-зустрічі.",
  "Завжди знає, як краще (ні).",
  "Вміє роздути з мухи слона і осідлати його.",
  "Має диплом з диванної аналітики.",
  "Пише коментарі, за які потім соромно.",
  "Вміє закохати в себе і зникнути.",
  "Знає 100 способів образитись.",
  "Має суперсилу притягувати дивних людей.",
];

const ROASTS_LIST = [
  "Тобі терміново треба вийти на вулицю і поторкати траву.",
  "Видаліть акаунт, поки це не зробив Марк Цукерберг.",
  "Твій вайб — це як піца з ананасами: на любителя.",
  "Менше тексту, більше мемів. Будь ласка.",
  "Ти серйозно це запостив? Я навіть як ШІ в шоці.",
  "Здається, тебе вкусив радіоактивний душніла.",
  "Твій екранний час лякає навіть твій телефон.",
  "Це не блог, це крик про допомогу.",
  "Твої думки глибокі, як калюжа в асфальті.",
  "Іноді краще жувати, ніж постити.",
  "Тобі платять за токсичність, чи це волонтерство?",
  "Твоє его не влазить у цей чек.",
  "Якби нудота була людиною, це був би ти.",
  "Тобі треба не лайки, а обійми.",
  "Знайди роботу, серйозно.",
  "Типу, ти реально так думаєш?",
  "Твої сторіз дивляться тільки вороги.",
  "Вимкни телефон і вийди в реальність.",
  "Твій контент — це найкраще снодійне.",
  "Навіть ChatGPT відмовляється це аналізувати.",
  "Ти занадто складний для цього світу (ні).",
  "Твій гумор застряг у 2012 році.",
  "Перестань бути таким серйозним, це Тредс.",
  "Тобі потрібен детокс від самого себе.",
  "Твої пости — це злочин проти логіки.",
  "Досить грати в експерта, всі знають правду.",
  "Ти пишеш так, ніби тобі платять за знаки.",
  "Твій профіль — це музей нереалізованих амбіцій.",
  "Заспокойся, ніхто не хоче вкрасти твої ідеї.",
  "Тобі треба медаль за занудство.",
  "Твій вайб — 'понеділок ранок'.",
  "Досить репостити крінж.",
  "Ти — причина, чому інопланетяни з нами не говорять.",
  "Твоя самооцінка вища за курс долара.",
  "Це не 'особистий бренд', це просто ниття.",
  "Тобі треба випити води і поспати.",
  "Ти геній, але тільки у своїй голові.",
  "Твій контент сухий, як курка в їдальні.",
  "Зроби паузу, з'їж Твікс (і мовчи).",
  "Ти надто стараєшся сподобатись.",
  "Твої жарти потребують пояснювальної бригади.",
  "Ти — людина-спам.",
  "Твій профіль викликає сонливість.",
  "Досить вдавати, що ти живеш 'краще життя'.",
  "Ти пишеш, а соромно мені.",
  "Тобі терміново потрібен реальний друг.",
  "Твій вайб — 'душний офіс'.",
  "Перестань шукати сенс там, де його немає.",
  "Ти — ходячий червоний прапорець 🚩.",
  "Іди обійми маму.",
];

interface VibeStats {
  toxicity: number;
  ego: number;
  boringness: number;
}

interface VibeResult {
  archetype: string;
  superpower: string;
  stats: VibeStats;
  roast: string;
}

const generateVibe = (username: string, posts: string[]): VibeResult => {
  const textSeed = posts.length > 0 ? posts.join("").length : username.length;
  const nameSeed = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = nameSeed + textSeed;

  return {
    archetype: ARCHETYPES_LIST[seed % ARCHETYPES_LIST.length],
    superpower: SUPERPOWERS_LIST[seed % SUPERPOWERS_LIST.length],
    stats: {
      toxicity: (seed * 13) % 100,
      ego: (seed * 7) % 100,
      boringness: (seed * 23) % 100,
    },
    roast: ROASTS_LIST[seed % ROASTS_LIST.length],
  };
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState<VibeResult | null>(null);
  const [userLocation, setUserLocation] = useState("Локація визначається...");
  const [errorMsg, setErrorMsg] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [receiptBg, setReceiptBg] = useState(RECEIPT_COLORS[0].hex);

  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("API Limit");
        const data = await res.json();
        if (data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_name}`);
        } else {
          throw new Error("No city data");
        }
      } catch (e) {
        setUserLocation("Україна (Інтернет)");
      }
    };
    fetchLocation();
  }, []);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim();
    if (!cleanNick) return showError("Введи нікнейм!");

    if (BLACKLIST.some((banned) => cleanNick.toLowerCase().includes(banned))) {
      setIsBanned(true);
      return;
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
      const postsData = data.posts || [];

      setLoadingStep("🧠 Аналізуємо ваші думки...");
      await new Promise((r) => setTimeout(r, 800));

      const aiResult = generateVibe(cleanNick, postsData);
      setResult(aiResult);
    } catch (error) {
      console.warn("API Error, generating locally");
      const aiResult = generateVibe(cleanNick, []);
      setResult(aiResult);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const resetApp = () => {
    setResult(null);
    setUsername("");
    setReceiptBg(RECEIPT_COLORS[0].hex);
  };

  const downloadImage = useCallback(async () => {
    if (!receiptRef.current || isSaving) return;
    setIsSaving(true);

    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        backgroundColor: "transparent",
        skipFonts: true,
        filter: (node) => node.tagName !== "LINK",
        style: { padding: "20px" },
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `vibe-${username.replace("@", "")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Save error:", err);
      showError("Не вдалося зберегти картинку 😢");
    } finally {
      setIsSaving(false);
    }
  }, [receiptRef, username, isSaving]);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>

      {/* --- ЕКРАН БАНУ --- */}
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
            onClick={() =>
              (window.location.href =
                "https://www.meme-arsenal.com/memes/393326927f757e07d786936ad5d1f35e.jpg")
            }
            className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition transform hover:scale-105"
          >
            Зрозумів, виходжу
          </button>
        </div>
      )}

      {/* --- ХЕДЕР --- */}
      <header
        onClick={resetApp}
        className="fixed top-0 left-0 w-full h-12 bg-[#0a0a0a] text-white flex items-center justify-between px-4 md:px-6 z-50 shadow-md select-none border-b border-white/5 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
      >
        <div className="font-bold tracking-widest text-xs md:text-sm truncate mr-2 flex items-center gap-2">
          THREADS VIBE CHECK
        </div>
        <div className="text-[10px] opacity-70 whitespace-nowrap font-mono text-gray-400">
          powered by {DEVELOPER_NAME}
        </div>
      </header>

      {/* --- АЛЕРТ ПОМИЛОК --- */}
      {errorMsg && (
        <div className="fixed top-16 right-0 left-0 md:left-auto md:right-5 mx-4 md:mx-0 bg-[#ff4b4b] text-white px-4 py-3 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black z-50 animate-bounce rounded-lg text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* --- ГОЛОВНИЙ КОНТЕЙНЕР --- */}
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 md:p-6 font-mono pt-24 md:pt-20 pb-10 transition-colors duration-300">
        {!result && (
          <div className="text-center mb-8 animate-fade-in px-4">
            <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter text-white">
              🧾 ФІСКАЛЬНИЙ ЧЕК ТВОГО ТРЕДСУ
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              Аналізуємо рівень токсичності, ниття та успішного успіху.
              <br />
              Результат поверненню не підлягає.
              <br />
            </p>
          </div>
        )}

        {!result ? (
          /* --- ФОРМА ВВОДУ --- */
          <div className="w-full max-w-sm space-y-4 animate-fade-in">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg group-focus-within:text-white transition-colors">
                @
              </span>
              {/* ІНПУТ: КВАДРАТНИЙ І З ТІННЮ */}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-[#111] border-2 border-white/30 text-white placeholder-gray-600 focus:outline-none focus:ring-0 focus:border-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] text-lg font-bold uppercase rounded-none appearance-none"
                placeholder="username"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            {/* КНОПКА СКАНУВАТИ: КВАДРАТНА */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold hover:bg-gray-200 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] disabled:opacity-70 disabled:cursor-not-allowed uppercase text-lg rounded-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  {loadingStep || "Завантаження..."}
                </span>
              ) : (
                "СКАНУВАТИ ПРОФІЛЬ"
              )}
            </button>
          </div>
        ) : (
          /* --- РЕЗУЛЬТАТ --- */
          <div className="flex flex-col items-center gap-6 w-full max-w-[380px] animate-slide-up">
            {/* ВИБІР КОЛЬОРУ */}
            <div className="flex gap-3 mb-2 bg-[#111] p-3 border border-white/10 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
              {RECEIPT_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setReceiptBg(color.hex)}
                  className={`w-8 h-8 border-2 transition-all duration-200 hover:scale-110 rounded-none ${
                    receiptBg === color.hex
                      ? "border-white scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>

            {/* Контейнер для скріншоту */}
            <div
              ref={receiptRef}
              className="w-full bg-transparent flex justify-center p-1"
            >
              {/* --- САМ ЧЕК --- */}
              <div
                className="w-full p-6 shadow-2xl relative text-black transition-colors duration-500 ease-in-out"
                style={{ backgroundColor: receiptBg }}
              >
                {/* Зубчики зверху */}
                <div
                  className="absolute top-0 left-0 w-full h-4 -mt-2 rotate-180 transition-all duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 50%, ${receiptBg} 50%)`,
                    backgroundSize: "16px 16px",
                  }}
                ></div>

                {/* Шапка чеку */}
                <div className="text-center border-b-2 border-dashed border-black/20 pb-4 mb-4">
                  <h2 className="text-2xl font-black uppercase tracking-widest">
                    УКР ТРЕДС ТОВ
                  </h2>
                  <p className="text-xs text-gray-700 mt-1 font-semibold">
                    📍 {userLocation}
                  </p>
                  <p className="text-xs text-gray-700">
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

                {/* Статистика */}
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
                    <span>₴{result.stats.boringness}.50</span>
                  </div>
                </div>

                <div className="border-b-2 border-dashed border-black/20 mb-4"></div>

                {/* Опис */}
                <div className="mb-4">
                  <p className="text-xs font-bold mb-1 text-gray-700">
                    СУПЕРСИЛА:
                  </p>
                  <p className="text-sm leading-tight lowercase first-letter:uppercase font-medium">
                    "{result.superpower}"
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-bold mb-1 text-gray-700">
                    ВЕРДИКТ:
                  </p>
                  <p className="text-sm bg-black text-white p-2 inline-block -rotate-1 font-sans leading-tight shadow-md">
                    {result.roast}
                  </p>
                </div>

                {/* Баркод */}
                <div className="flex flex-col items-center justify-center space-y-2 overflow-hidden pb-2">
                  <div className="scale-y-125 opacity-90 mix-blend-multiply">
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

                  <p className="text-xs font-bold uppercase mt-3 text-gray-600">
                    Товар поверненню не підлягає
                  </p>
                  <p className="text-[10px] text-gray-400">
                    generated by threads-vibe-check.vercel.app
                  </p>
                </div>

                {/* Зубчики знизу */}
                <div
                  className="absolute bottom-0 left-0 w-full h-4 -mb-2 transition-all duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 50%, ${receiptBg} 50%)`,
                    backgroundSize: "16px 16px",
                  }}
                ></div>
              </div>
            </div>

            {/* --- КНОПКИ (КВАДРАТНІ) --- */}
            <div className="flex flex-col w-full gap-4">
              {/* ЗБЕРЕГТИ: БІЛА КНОПКА З ЧОРНИМ ТЕКСТОМ І БІЛОЮ ТІННЮ */}
              <button
                onClick={downloadImage}
                disabled={isSaving}
                className="w-full py-3 px-4 bg-white text-black border-2 border-white font-bold hover:bg-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-1 active:shadow-none text-sm flex items-center justify-center gap-2 uppercase disabled:opacity-50 rounded-none"
              >
                {isSaving ? "⏳ ЗБЕРІГАЮ..." : "📸 ЗБЕРЕГТИ ЧЕК"}
              </button>

              {/* МОНОБАНК: ЧОРНА КНОПКА З БІЛОЮ РАМКОЮ І БІЛОЮ ТІННЮ */}
              <a
                href={DONATE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-black text-white border-2 border-white font-bold flex items-center justify-center gap-3 hover:bg-[#111] transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-1 active:shadow-none uppercase text-sm rounded-none"
              >
                <span className="text-xl">🤡</span>
                <span>Сплатити штраф за крінж</span>
              </a>

              <button
                onClick={resetApp}
                className="mt-2 text-gray-400 font-bold hover:text-white underline decoration-2 underline-offset-4 transition uppercase text-xs tracking-widest"
              >
                🔄 Спробувати ще раз
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
