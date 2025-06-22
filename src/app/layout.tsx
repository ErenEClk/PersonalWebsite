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
  title: "Eren Ege Çelik - Fizik Öğrencisi",
  description: "İYTE Fizik öğrencisi, matematik ve bilgisayar bilimi tutkunu",
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
