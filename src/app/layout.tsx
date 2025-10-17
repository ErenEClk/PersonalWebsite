import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from './contexts/LanguageContext';
import GoogleAnalytics from './components/GoogleAnalytics';
import UserTrackingWrapper from './components/UserTrackingWrapper';
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
  description: "Second-year Physics student at METU with interests in mathematics, logic, and computer science. Research focus on theoretical physics and computational problems.",
  openGraph: {
    title: "Eren Ege Çelik",
    description: "Second-year Physics student at METU with interests in mathematics, logic, and computer science. Research focus on theoretical physics and computational problems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Eren Ege Çelik",
    description: "Second-year Physics student at METU with interests in mathematics, logic, and computer science. Research focus on theoretical physics and computational problems.",
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
        {/* Google AdSense - moved to body to prevent hydration issues */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9255607935991101"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        <GoogleAnalytics measurementId="G-0T9H646SWH" />
        <UserTrackingWrapper />
        <LanguageProvider>
          {/* <ThreeBodyBackground /> */}
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
