"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * フェードトランジション サンプルページ
 *
 * @remarks
 * CSSトランジションを使用したフェードイン/アウト効果を学びます。
 * Tailwind CSS のトランジションユーティリティクラスを活用しています。
 */
export default function FadeTransitionPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScaled, setIsScaled] = useState(false);
  const [isSlided, setIsSlided] = useState(false);

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
            Animation
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            フェード
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              トランジション
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            CSSトランジションを使用したフェードイン/アウト効果
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* フェードイン/アウト */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>フェードイン / アウト</CardTitle>
              <CardDescription>
                opacity を使った基本的なフェード効果
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? "フェードアウト" : "フェードイン"}
              </Button>
              <div
                className={`flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white transition-opacity duration-500 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                transition-opacity duration-500
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  className=&quot;transition-opacity duration-500{" "}
                  {isVisible ? "opacity-100" : "opacity-0"}&quot;
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ホバーエフェクト */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>ホバーエフェクト</CardTitle>
              <CardDescription>
                マウスオーバーで変化するトランジション
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg bg-brand-500 font-bold text-white transition-all duration-300 hover:bg-brand-700 hover:shadow-lg">
                hover:bg-brand-700
              </div>
              <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg bg-brand-500 font-bold text-white opacity-70 transition-opacity duration-300 hover:opacity-100">
                opacity-70 hover:opacity-100
              </div>
            </CardContent>
          </Card>

          {/* スケールトランジション */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>スケールトランジション</CardTitle>
              <CardDescription>scale を使った拡大/縮小効果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setIsScaled(!isScaled)}>
                {isScaled ? "縮小" : "拡大"}
              </Button>
              <div
                className={`flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white transition-transform duration-300 ${
                  isScaled ? "scale-110" : "scale-100"
                }`}
              >
                transition-transform
              </div>
            </CardContent>
          </Card>

          {/* スライドトランジション */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>スライドトランジション</CardTitle>
              <CardDescription>translate を使った移動効果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setIsSlided(!isSlided)}>
                {isSlided ? "戻す" : "スライド"}
              </Button>
              <div className="overflow-hidden rounded-lg bg-muted p-4">
                <div
                  className={`flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white transition-transform duration-500 ease-out ${
                    isSlided ? "translate-x-12" : "translate-x-0"
                  }`}
                >
                  translate-x
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 複合トランジション */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>複合トランジション</CardTitle>
              <CardDescription>
                transition-all で複数のプロパティを同時に変化
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg bg-brand-500 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-brand-700 hover:shadow-xl">
                hover で複数変化
                <br />
                (scale + bg + shadow)
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "600ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                React Hooks を使った状態管理を学んでみましょう。
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
