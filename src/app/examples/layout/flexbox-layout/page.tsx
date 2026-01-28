import { ChevronRight } from "lucide-react";
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
 * Flexboxレイアウト サンプルページ
 *
 * @remarks
 * Flexboxを使用した柔軟なレイアウト設計とレスポンシブ対応を学びます。
 * Tailwind CSS のFlexboxユーティリティクラスを活用しています。
 */
export default function FlexboxLayoutPage() {
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
            Layout
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Flexbox
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              レイアウト
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            柔軟なレイアウト設計とレスポンシブ対応
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6">
          {/* flex-direction */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>flex-direction</CardTitle>
              <CardDescription>
                flex-row と flex-col で方向を制御
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  flex-row（横並び）
                </p>
                <div className="flex flex-row gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex size-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  flex-col（縦並び）
                </p>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex h-12 w-24 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* justify-content */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>justify-content</CardTitle>
              <CardDescription>主軸方向の配置を制御</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "justify-start", className: "justify-start" },
                { label: "justify-center", className: "justify-center" },
                { label: "justify-end", className: "justify-end" },
                { label: "justify-between", className: "justify-between" },
                { label: "justify-around", className: "justify-around" },
                { label: "justify-evenly", className: "justify-evenly" },
              ].map(({ label, className }) => (
                <div key={label}>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <div className={`flex ${className} rounded-lg bg-muted p-2`}>
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="flex size-10 items-center justify-center rounded bg-brand-500 font-bold text-white"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* align-items */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>align-items</CardTitle>
              <CardDescription>交差軸方向の配置を制御</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "items-start", className: "items-start" },
                { label: "items-center", className: "items-center" },
                { label: "items-end", className: "items-end" },
                { label: "items-stretch", className: "items-stretch" },
              ].map(({ label, className }) => (
                <div key={label}>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <div
                    className={`flex ${className} h-20 gap-2 rounded-lg bg-muted p-2`}
                  >
                    <div className="flex h-8 w-12 items-center justify-center rounded bg-brand-500 font-bold text-white">
                      1
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-brand-600 font-bold text-white">
                      2
                    </div>
                    <div className="flex w-12 items-center justify-center rounded bg-brand-700 font-bold text-white">
                      3
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* flex-wrap とレスポンシブ */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>flex-wrap とレスポンシブ</CardTitle>
              <CardDescription>折り返しとブレークポイント対応</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  flex-wrap（折り返しあり）
                </p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div
                      key={n}
                      className="flex size-16 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  レスポンシブ: sm:flex-row（モバイルは縦、タブレット以上は横）
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex h-12 flex-1 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                CSS Grid レイアウトも学んでみましょう。
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                カタログを見る
                <ChevronRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
