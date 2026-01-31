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
 * Gridレイアウト サンプルページ
 *
 * @remarks
 * CSS Gridを使用した高度なレイアウト実装を学びます。
 * Tailwind CSS のGridユーティリティクラスを活用しています。
 */
export default function GridLayoutPage() {
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
            Grid
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              レイアウト
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            CSS Grid を使った高度なレイアウト実装
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6">
          {/* 基本的なグリッド */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>基本的なグリッド</CardTitle>
              <CardDescription>grid-cols-* でカラム数を指定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  grid-cols-2（2列）
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  grid-cols-3（3列）
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  grid-cols-4（4列）
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div
                      key={n}
                      className="flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* col-span / row-span */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>col-span / row-span</CardTitle>
              <CardDescription>
                セルの結合（複数カラム・行にまたがる）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 grid-rows-3 gap-2">
                <div className="col-span-2 flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white">
                  col-span-2
                </div>
                <div className="row-span-2 flex items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
                  row-span-2
                </div>
                <div className="flex h-12 items-center justify-center rounded-lg bg-brand-700 font-bold text-white">
                  1
                </div>
                <div className="flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white">
                  2
                </div>
                <div className="flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white">
                  3
                </div>
                <div className="flex h-12 items-center justify-center rounded-lg bg-brand-500 font-bold text-white">
                  4
                </div>
                <div className="col-span-3 flex h-12 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
                  col-span-3
                </div>
                <div className="flex h-12 items-center justify-center rounded-lg bg-brand-700 font-bold text-white">
                  5
                </div>
              </div>
            </CardContent>
          </Card>

          {/* レスポンシブグリッド */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>レスポンシブグリッド</CardTitle>
              <CardDescription>
                ブレークポイントに応じてカラム数を変更
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                sm:grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3
                <br />
                画面サイズを変えて確認してください
              </p>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white"
                  >
                    Card {n}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* gap プロパティ */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>gap プロパティ</CardTitle>
              <CardDescription>
                グリッドアイテム間のスペースを制御
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  gap-1（小さい間隔）
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex h-10 items-center justify-center rounded bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  gap-4（標準間隔）
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex h-10 items-center justify-center rounded bg-brand-500 font-bold text-white"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  gap-8（大きい間隔）
                </p>
                <div className="grid grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex h-10 items-center justify-center rounded bg-brand-500 font-bold text-white"
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
                アニメーションの実装を学んでみましょう。
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
