import { AlertCircle, CheckCircle2, Send } from "lucide-react";

import {
  ExamplePageContent,
  ExamplePageHero,
  ExamplePageNextSteps,
  ExamplePageShell,
} from "@/app/examples/_components";
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
    <ExamplePageShell>
      <ExamplePageHero
        badge="Next.js Features - 中級"
        title={
          <>
            Server
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              Actions
            </span>
          </>
        }
        subtitle="フォーム送信とサーバー処理を統合する新しいパターン"
      />

      <ExamplePageContent columns="two">
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

        <ExamplePageNextSteps
          className="sm:col-span-2"
          animationDelayMs={500}
          description="Suspense とローディング UI を学んでみましょう。"
        />
      </ExamplePageContent>
    </ExamplePageShell>
  );
}
