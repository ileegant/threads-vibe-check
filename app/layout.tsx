import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Метадані для пошуковиків і соцмереж (Телеграм, Тредс, Інста)
export const metadata: Metadata = {
  title: "Threads Vibe Check | Твій чек за крінж",
  description:
    "ШІ просканує твій профіль, виміряє рівень токсичності та випише фіскальний чек. Готуй виправдання! Створено by ileegant.",
  keywords: [
    "threads",
    "vibe check",
    "instagram",
    "ai",
    "roast",
    "чек",
    "тредс",
  ],
  authors: [{ name: "ileegant" }],
  openGraph: {
    title: "Threads Vibe Check",
    description:
      "Дізнайся, хто ти: Душніла чи Амбасадор вигорання? Отримай свій чек.",
    type: "website",
    locale: "uk_UA",
    siteName: "Threads Vibe Check",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threads Vibe Check",
    description: "Фіскальний чек твого его. Перевір себе.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧾</text></svg>",
  },
};

// 2. Налаштування для мобільних (колір бару в сафарі і зум)
export const viewport: Viewport = {
  themeColor: "#050505", // Чорний колір браузера на телефоні
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Забороняє зум при кліку на інпут (для iPhone)
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
