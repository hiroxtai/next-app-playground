import { ChevronRight, Loader2, Mail, Plus } from "lucide-react";
import Link from "next/link";

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
 * ボタンの基礎 サンプルページ
 *
 * @remarks
 * shadcn/ui の Button コンポーネントを使用した各種スタイルとサイズのデモンストレーション。
 * Tailwind CSS でのボタン表現方法を学びます。
 */
export default function ButtonBasicsPage() {
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
            UI Basics
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            ボタンの
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              基礎
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            shadcn/ui Button コンポーネントのバリエーション
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6">
          {/* バリアント */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>バリアント</CardTitle>
              <CardDescription>
                用途に応じた様々なスタイルのボタン
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="brand">Brand</Button>
                <Button variant="brand-outline">Brand Outline</Button>
                <Button variant="brand-ghost">Brand Ghost</Button>
              </div>
            </CardContent>
          </Card>

          {/* サイズ */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>サイズ</CardTitle>
              <CardDescription>
                用途に応じた異なるサイズのボタン
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Plus />
                </Button>
                <Button size="icon-sm">
                  <Plus />
                </Button>
                <Button size="icon-lg">
                  <Plus />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* アイコン付きボタン */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>アイコン付きボタン</CardTitle>
              <CardDescription>
                テキストとアイコンを組み合わせたボタン
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Mail />
                  メールを送信
                </Button>
                <Button variant="outline">
                  続きを読む
                  <ChevronRight />
                </Button>
                <Button variant="secondary">
                  <Plus />
                  新規作成
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 状態 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>状態</CardTitle>
              <CardDescription>
                ローディング中や無効化されたボタン
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  処理中...
                </Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Outline Disabled
                </Button>
                <Button variant="destructive" disabled>
                  Destructive Disabled
                </Button>
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
                他のUIコンポーネントもぜひご覧ください。
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
