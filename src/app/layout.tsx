import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from './contexts/LanguageContext';
// import ThreeBodyBackground from "./ThreeBodyBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eren Ege Çelik",
  description: "Physics student at IZTECH with interests in mathematics, logic, and computer science. Research focus on theoretical physics and computational problems.",
  openGraph: {
    title: "Eren Ege Çelik",
    description: "Physics student at IZTECH with interests in mathematics, logic, and computer science. Research focus on theoretical physics and computational problems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Eren Ege Çelik",
    description: "Physics student at IZTECH with interests in mathematics, logic, and computer science. Research focus on theoretical physics and computational problems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          {/* <ThreeBodyBackground /> */}
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
