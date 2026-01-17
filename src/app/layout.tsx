import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

/**
 * ディスプレイフォント（ヒーロータイトル、見出し用）
 *
 * @remarks
 * Space Grotesk は幾何学的でモダンな印象を与えるサンセリフフォント。
 * 技術系プロジェクトやモダンな Web アプリに最適です。
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * 本文フォント（UI テキスト、説明文用）
 *
 * @remarks
 * Inter は UI に最適化された可読性の高いサンセリフフォント。
 * 小さいサイズでも読みやすく、長文にも適しています。
 */
const inter = Inter({
  variable: "--font-sans",
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
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
