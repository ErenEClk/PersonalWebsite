import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <head>
        {/* Google AdSense - using dangerouslySetInnerHTML to avoid Next.js Script issues */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9255607935991101"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleAnalytics measurementId="G-0T9H646SWH" />
        <UserTrackingWrapper />
        <LanguageProvider>
          {/* <ThreeBodyBackground /> */}
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </LanguageProvider>
        
        {/* Tawk.to Live Chat */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/690fb469aadb9719591b6412/1j9ilhf0s';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
