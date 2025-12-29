"use client";

import { useEffect, useState } from "react";

const NEW_DOMAIN = "https://trds.fun/vibe-check";

export default function Moved() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Таймер зворотного відліку
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = NEW_DOMAIN;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(255, 255, 255, 0.05) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 50;
        }
        .animate-glitch {
          animation: glitch 1s linear infinite;
        }
        @keyframes glitch {
          2%,
          64% {
            transform: translate(2px, 0) skew(0deg);
          }
          4%,
          60% {
            transform: translate(-2px, 0) skew(0deg);
          }
          62% {
            transform: translate(0, 0) skew(5deg);
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
        {/* Фонові ефекти */}
        <div className="scanline"></div>

        <div className="z-10 max-w-md w-full text-center animate-fade-in">
          {/* Агресивний заголовок */}
          <div className="border-4 border-white p-6 bg-black shadow-[8px_8px_0px_0px_#ff0000] relative mb-8">
            <div className="absolute -top-4 -left-4 bg-[#ff0000] text-black font-black px-4 py-1 uppercase tracking-widest text-sm transform -rotate-2">
              Redirect Protocol 301
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-4 animate-glitch">
              МИ <br /> ЗВАЛИЛИ
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-bold border-t-2 border-dashed border-white/20 pt-4">
              Цей домен занадто крінжовий навіть для нас. Олег купив нормальну
              адресу (нарешті).
            </p>
          </div>

          {/* Таймер */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
              Телепортація душніл через:
            </p>
            <div className="text-6xl font-black text-white">
              00:0{countdown}
            </div>
          </div>

          {/* Кнопка (якщо таймер тупить) */}
          <a
            href={NEW_DOMAIN}
            className="group block w-full py-4 bg-white text-black font-black text-xl uppercase tracking-widest hover:bg-[#F4FF5F] transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[4px_4px_0px_0px_#ff00ff] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          >
            <span className="group-hover:hidden">Чекати не буду</span>
            <span className="hidden group-hover:inline">👉 ВАЛИМО ТУДИ</span>
          </a>

          {/* Футер */}
          <div className="mt-12 text-[10px] text-gray-600 uppercase tracking-widest">
            Transferring vibe data to{" "}
            <span className="text-white underline">
              {NEW_DOMAIN.replace("https://", "")}
            </span>
          </div>
        </div>

        {/* Декоративний шум знизу */}
        <div className="absolute bottom-4 left-4 text-[10px] text-[#333] hidden md:block">
          STATUS: MIGRATION_COMPLETE
          <br />
          PACKETS: LOST (HOPEFULLY)
          <br />
          COFFEE: NEEDED
        </div>
      </div>
    </>
  );
}
