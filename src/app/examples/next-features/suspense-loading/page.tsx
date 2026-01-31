import { ChevronRight, Clock, Layers, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  FastComponent,
  SlowComponent,
  UserProfile,
} from "./_components/AsyncComponents";

/**
 * Suspense とローディング サンプルページ
 *
 * @remarks
 * React Suspense を使用した非同期コンポーネントのローディング状態管理を学びます。
 */
export default function SuspenseLoadingPage() {
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
            Next.js Features - 上級
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Suspense と
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              ローディング
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            非同期コンポーネントの読み込み状態を宣言的に管理
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Suspense とは */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-brand-500" />
                Suspense とは
              </CardTitle>
              <CardDescription>
                非同期処理の完了を待つ間、フォールバックUIを表示
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>`}
                </code>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Zap className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  非同期コンポーネントの読み込み中にスケルトンを表示
                </li>
                <li className="flex gap-2">
                  <Layers className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  複数の Suspense 境界でストリーミングSSRを実現
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 高速なコンポーネント */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>高速なコンポーネント</CardTitle>
              <CardDescription>500ms で読み込み完了</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                }
              >
                <FastComponent />
              </Suspense>
            </CardContent>
          </Card>

          {/* 遅いコンポーネント */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>遅いコンポーネント</CardTitle>
              <CardDescription>2秒で読み込み完了</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                }
              >
                <SlowComponent />
              </Suspense>
            </CardContent>
          </Card>

          {/* ユーザープロフィール */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>ユーザープロフィール</CardTitle>
              <CardDescription>
                Skeleton UI を活用した実践的な例
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                }
              >
                <UserProfile />
              </Suspense>
            </CardContent>
          </Card>

          {/* ストリーミング SSR */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>ストリーミング SSR の仕組み</CardTitle>
              <CardDescription>
                複数の Suspense 境界による段階的なレンダリング
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-green-500/30 bg-green-50 p-4 dark:bg-green-950/30">
                    <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-400">
                      1. 即座にレンダリング
                    </p>
                    <p className="text-xs text-muted-foreground">
                      静的な部分とSuspenseのfallbackを最初に送信
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-950/30">
                    <p className="mb-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                      2. 高速データ到着
                    </p>
                    <p className="text-xs text-muted-foreground">
                      準備できた部分から順次ストリーミング
                    </p>
                  </div>
                  <div className="rounded-lg border border-brand-500/30 bg-brand-50 p-4 dark:bg-brand-950/30">
                    <p className="mb-2 text-sm font-medium text-brand-700 dark:text-brand-400">
                      3. 遅いデータ到着
                    </p>
                    <p className="text-xs text-muted-foreground">
                      最後に遅いコンポーネントが差し替わる
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  このページをリロードすると、各コンポーネントが順番に表示される様子を確認できます。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 sm:col-span-2 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "600ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Compound Components パターンを学んでみましょう。
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
