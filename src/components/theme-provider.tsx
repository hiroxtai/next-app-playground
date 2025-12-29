"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

/**
 * アプリケーション全体のテーマ（ライト/ダーク）を管理するプロバイダー
 *
 * @remarks
 * next-themes の ThemeProvider をラップしたコンポーネントです。
 * - `attribute="class"`: HTML の class 属性でテーマを切り替え
 * - `defaultTheme="system"`: デフォルトはシステム設定に従う
 * - `enableSystem`: システムの色設定を自動検出
 * - `disableTransitionOnChange`: テーマ切替時のトランジションを無効化（ちらつき防止）
 *
 * @example
 * ```tsx
 * // layout.tsx での使用例
 * <ThemeProvider>
 *   {children}
 * </ThemeProvider>
 * ```
 *
 * @see https://ui.shadcn.com/docs/dark-mode/next
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
