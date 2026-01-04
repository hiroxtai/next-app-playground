import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * アプリケーションのメタデータ
 *
 * @remarks
 * Next.js の Metadata API を使用して、ページのタイトルや説明を設定します。
 * 各ページで個別に設定することも可能です。
 */
export const metadata: Metadata = {
  title: {
    default: "Next.js Playground",
    template: "%s | Next.js Playground",
  },
  description:
    "Next.js 16 の機能を学習するための Playground プロジェクト。shadcn/ui を使用した UI コンポーネントライブラリ。",
};

/**
 * アプリケーションのルートレイアウト
 *
 * @remarks
 * - ThemeProvider: ダークモード対応（next-themes）
 * - Toaster: トースト通知（Sonner）
 * - suppressHydrationWarning: ハイドレーションの警告を抑制（テーマ切替時）
 *
 * @param children - 子コンポーネント（各ページの内容）
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
