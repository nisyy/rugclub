import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Dela_Gothic_One } from "next/font/google";
import "./globals.css";

// 本文・UIフォント（日本語対応）
const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

// 見出し表示フォント（dilly-dally 近似・極太ゴシック）
const delaGothic = Dela_Gothic_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = "https://ragclubprod.vercel.app";
const siteDescription =
  "身近にアートを感じられるカフェ。大阪・東大阪にあるギャラリーカフェ。コーヒー・パフェ・焼き菓子・アート作品の展示販売・レンタルスペース。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CAFE RUG CLUB | ギャラリーカフェ",
    template: "%s | CAFE RUG CLUB",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "CAFE RUG CLUB",
    title: "CAFE RUG CLUB | ギャラリーカフェ",
    description: siteDescription,
    images: [{ url: "/og-logo.png", width: 1080, height: 1080, alt: "CAFE RUG CLUB ロゴ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CAFE RUG CLUB | ギャラリーカフェ 東大阪",
    description: siteDescription,
    images: ["/og-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#C4531A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${delaGothic.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
