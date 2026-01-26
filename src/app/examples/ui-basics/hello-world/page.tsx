import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Hello World サンプルページ
 *
 * @remarks
 * 最もシンプルなサンプルページです。
 * shadcn/ui コンポーネントとプロジェクトのブランドカラーを活用しています。
 */
export default function HelloWorldPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/40 via-transparent to-brand-200/30 dark:from-brand-900/20 dark:to-brand-800/10" />

      {/* ノイズテクスチャオーバーレイ */}
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]" />

      {/* メインコンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header
          className="animate-fade-in-scale mb-16 text-center"
          style={{ "--animation-delay": "0ms" } as React.CSSProperties}
        >
          <Badge variant="secondary" className="mb-6">
            Sample Page
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Hello{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              World!
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            ようこそ、Next.js Playground へ
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* このページについて */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>このページについて</CardTitle>
              <CardDescription>
                最もシンプルなサンプルページです
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-brand-500" />
                  React Server Component として構築されています
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-brand-500" />
                  shadcn/ui コンポーネントでスタイリングしています
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-brand-500" />
                  ダークモードにも対応しています
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 使用技術 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>使用技術</CardTitle>
              <CardDescription>Tech Stack</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {[
                  { icon: "⚛️", name: "React 19", desc: "UI ライブラリ" },
                  { icon: "▲", name: "Next.js 16", desc: "App Router" },
                  { icon: "🎨", name: "Tailwind v4", desc: "CSS" },
                  { icon: "📘", name: "TypeScript", desc: "型安全" },
                ].map((tech) => (
                  <li key={tech.name} className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-base">
                      {tech.icon}
                    </span>
                    <div>
                      <div className="font-medium text-foreground">
                        {tech.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tech.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                他のサンプルページもぜひご覧ください。
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                カタログを見る
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
