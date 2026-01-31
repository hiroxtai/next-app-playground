import { AlertCircle, CheckCircle2, ChevronRight, Send } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ContactForm } from "./_components/ContactForm";
import { TodoForm } from "./_components/TodoForm";

/**
 * Server Actions サンプルページ
 *
 * @remarks
 * Server Actions を使用したフォーム送信とサーバー処理の実装パターンを学びます。
 * このページ自体は Server Component です。
 */
export default function ServerActionsPage() {
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
            Next.js Features - 中級
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Server
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              Actions
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            フォーム送信とサーバー処理を統合する新しいパターン
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Server Actions とは */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="size-5 text-brand-500" />
                Server Actions とは
              </CardTitle>
              <CardDescription>
                サーバーで実行される非同期関数を直接呼び出せる機能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium">API ルート不要</p>
                    <p className="text-sm text-muted-foreground">
                      従来の /api エンドポイントを作成する必要がない
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium">型安全</p>
                    <p className="text-sm text-muted-foreground">
                      TypeScript の型がクライアントとサーバー間で共有される
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium">Progressive Enhancement</p>
                    <p className="text-sm text-muted-foreground">
                      JavaScript が無効でもフォームが動作する
                    </p>
                  </div>
                </li>
              </ul>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`// actions.ts
"use server";

export async function submitForm(formData: FormData) {
  const name = formData.get("name");
  // サーバーサイドで処理
  return { success: true };
}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* お問い合わせフォーム */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>お問い合わせフォーム</CardTitle>
              <CardDescription>基本的な Server Action の使用例</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* TODO リスト */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>TODO リスト</CardTitle>
              <CardDescription>useActionState を使った状態管理</CardDescription>
            </CardHeader>
            <CardContent>
              <TodoForm />
            </CardContent>
          </Card>

          {/* 実装のポイント */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>実装のポイント</CardTitle>
              <CardDescription>Server Actions を使う際の注意点</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-medium text-green-600 dark:text-green-400">
                    使用すべきケース
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• フォーム送信</li>
                    <li>• データベース操作</li>
                    <li>• 外部 API 呼び出し</li>
                    <li>• ファイルアップロード</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                    <AlertCircle className="size-4" />
                    注意点
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 入力値のバリデーションは必須</li>
                    <li>• エラーハンドリングを忘れずに</li>
                    <li>• 機密情報の扱いに注意</li>
                    <li>• revalidatePath で再検証</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 sm:col-span-2 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Suspense とローディング UI を学んでみましょう。
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
