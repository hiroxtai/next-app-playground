import { ArrowRight, Bot, Code, MessageSquare, Radio, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChatBot } from "./_components";

/**
 * AI チャットボットページのメタデータ
 */
export const metadata: Metadata = {
  title: "AI チャットボット",
  description:
    "Vercel AI SDK を使用した SSE ストリーミング対応の AI チャットボット",
};

/**
 * AI チャットボットサンプルページ
 *
 * @remarks
 * Vercel AI SDK の基本的な使い方を学ぶためのサンプルページです。
 * `useChat` フックと `streamText` を使用して、
 * OpenAI の GPT-4o-mini とリアルタイムにチャットできます。
 *
 * **学習ポイント:**
 * - Vercel AI SDK のアーキテクチャ（クライアント ↔ API Route ↔ LLM）
 * - `useChat` フックによるチャット状態管理
 * - `streamText` によるサーバー側のストリーミング処理
 * - SSE（Server-Sent Events）によるリアルタイム通信
 */
export default function ChatbotPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-100/40 via-transparent to-sky-100/30 dark:from-violet-900/20 dark:to-sky-900/10" />

      {/* メインコンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header className="mb-16 text-center">
          <Badge variant="secondary" className="mb-6">
            AI - 中級
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            AI
            <span className="bg-linear-to-r from-violet-500 to-sky-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-sky-400">
              {" "}
              Chatbot
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Vercel AI SDK で実現するリアルタイム AI チャット
          </p>
        </header>

        {/* 概要カード */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5 text-violet-500" />
              Vercel AI SDK とは
            </CardTitle>
            <CardDescription>
              AI アプリケーションを構築するための TypeScript ツールキット
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vercel AI SDK は、Next.js や React と統合された AI
              アプリケーション開発のための OSS ライブラリです。
              OpenAI、Anthropic、Google など複数のプロバイダーを統一的な API
              で扱えます。
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50">
                  <Radio className="size-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">SSE ストリーミング</p>
                  <p className="text-xs text-muted-foreground">
                    AI の応答をリアルタイムに表示
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/50">
                  <Zap className="size-4 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">useChat フック</p>
                  <p className="text-xs text-muted-foreground">
                    React でのチャット状態管理
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <MessageSquare className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">統一プロバイダー API</p>
                  <p className="text-xs text-muted-foreground">
                    複数の AI モデルを同じ API で
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アーキテクチャ説明 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="size-5 text-sky-500" />
              アーキテクチャ
            </CardTitle>
            <CardDescription>このチャットボットの仕組み</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 rounded-lg bg-zinc-50 p-6 dark:bg-zinc-900 sm:flex-row sm:justify-center">
              <div className="rounded-lg bg-violet-100 px-4 py-2 text-center text-sm font-medium text-violet-800 dark:bg-violet-900/60 dark:text-violet-300">
                Client
                <br />
                <span className="text-xs font-normal">useChat フック</span>
              </div>
              <ArrowRight className="size-5 rotate-90 text-zinc-400 sm:rotate-0" />
              <div className="rounded-lg bg-sky-100 px-4 py-2 text-center text-sm font-medium text-sky-800 dark:bg-sky-900/60 dark:text-sky-300">
                API Route
                <br />
                <span className="text-xs font-normal">streamText</span>
              </div>
              <ArrowRight className="size-5 rotate-90 text-zinc-400 sm:rotate-0" />
              <div className="rounded-lg bg-emerald-100 px-4 py-2 text-center text-sm font-medium text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                LLM
                <br />
                <span className="text-xs font-normal">OpenAI GPT-4o-mini</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>1.</strong> クライアント: <code>useChat</code>{" "}
                フックがメッセージを <code>/api/chat</code> に POST 送信
              </p>
              <p>
                <strong>2.</strong> API Route: <code>streamText</code> で OpenAI
                にリクエストし、SSE 形式でストリーミング返却
              </p>
              <p>
                <strong>3.</strong> クライアント: SSE を受信し、AI
                の応答をリアルタイムに画面に描画
              </p>
            </div>
          </CardContent>
        </Card>

        {/* チャットボット */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
            チャットを試す
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            下のチャットボックスにメッセージを入力して、AI
            とリアルタイムに会話してみましょう。 レスポンスが SSE
            で1トークンずつストリーミングされる様子を確認できます。
          </p>
          <ChatBot />
        </div>

        {/* 使用技術 */}
        <Card>
          <CardHeader>
            <CardTitle>使用パッケージ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3 dark:border-zinc-800">
                <code className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                  ai
                </code>
                <p className="mt-1 text-xs text-muted-foreground">
                  AI SDK コアパッケージ。streamText、UIMessage 等を提供
                </p>
              </div>
              <div className="rounded-lg border p-3 dark:border-zinc-800">
                <code className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                  @ai-sdk/react
                </code>
                <p className="mt-1 text-xs text-muted-foreground">
                  React 用フック。useChat でチャット状態を管理
                </p>
              </div>
              <div className="rounded-lg border p-3 dark:border-zinc-800">
                <code className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  @ai-sdk/openai
                </code>
                <p className="mt-1 text-xs text-muted-foreground">
                  OpenAI プロバイダー。GPT-4o, GPT-4o-mini 等を利用
                </p>
              </div>
              <div className="rounded-lg border p-3 dark:border-zinc-800">
                <code className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  zod
                </code>
                <p className="mt-1 text-xs text-muted-foreground">
                  スキーマバリデーション。ツール定義等で使用
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* カタログに戻るリンク */}
        <div className="mt-8 text-center">
          <Link
            href="/catalog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← カタログに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
