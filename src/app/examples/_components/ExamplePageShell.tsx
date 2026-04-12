import type { ExamplePageShellProps } from "./types";

/**
 * サンプルページの共通外枠を提供します。
 *
 * @remarks
 * 背景装飾とコンテンツ幅の管理を1か所にまとめ、
 * ページごとの重複記述を減らします。
 */
export function ExamplePageShell({ children }: ExamplePageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/40 via-transparent to-brand-200/30 dark:from-brand-900/20 dark:to-brand-800/10" />
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]" />
      <main className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {children}
      </main>
    </div>
  );
}
