"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * チャットメッセージの吹き出しコンポーネント
 *
 * @remarks
 * ユーザーと AI のメッセージを視覚的に区別して表示します。
 * `message.parts` を使用してメッセージの各パートを描画します。
 */
function ChatMessage({
  message,
}: {
  message: {
    id: string;
    role: string;
    parts: { type: string; text?: string }[];
  };
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* アバター */}
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-brand-500 text-white"
            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
        }`}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      {/* メッセージ本文 */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-brand-500 text-white"
            : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <p
                key={`${message.id}-${index}`}
                className="whitespace-pre-wrap text-sm leading-relaxed"
              >
                {part.text}
              </p>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

/**
 * AI チャットボットコンポーネント
 *
 * @remarks
 * Vercel AI SDK の `useChat` フックを使用してチャット機能を実装しています。
 *
 * **AI SDK の主要な概念:**
 * - `useChat`: チャットの状態管理（メッセージ、入力、ステータス）を提供するフック
 * - `DefaultChatTransport`: API エンドポイントとの通信方法を定義
 * - `sendMessage`: メッセージを API に送信し、SSE でレスポンスを受信
 * - `status`: 接続状態（"ready" | "streaming" | "error" など）
 * - `messages`: チャット履歴の配列
 *
 * **SSE（Server-Sent Events）による配信:**
 * サーバーからのレスポンスは SSE 形式でストリーミングされ、
 * AI の応答がリアルタイムにトークン単位で画面に表示されます。
 */
export function ChatBot() {
  const [input, setInput] = useState("");

  /**
   * useChat フック - AI SDK のチャット状態管理
   *
   * @remarks
   * - `messages`: すべてのチャットメッセージ（ユーザー + AI）の配列
   * - `sendMessage`: メッセージを送信する関数
   * - `status`: 現在の接続状態
   * - `transport`: API との通信方法（デフォルトで /api/chat にPOST）
   */
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  /** AI が応答を生成中かどうか */
  const isStreaming = status === "streaming";

  /**
   * フォーム送信ハンドラ
   * 入力テキストを AI に送信し、入力欄をクリアします。
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex h-150 flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* メッセージ表示エリア */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Bot className="mx-auto mb-3 size-10 text-zinc-400" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                メッセージを入力して会話を始めましょう
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {/* AI 応答生成中のインジケーター */}
        {isStreaming && messages.at(-1)?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
              <Bot className="size-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
              <Loader2 className="size-4 animate-spin text-zinc-500" />
              <span className="text-sm text-zinc-500">考え中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 入力フォーム */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          disabled={isStreaming}
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 dark:border-zinc-700 dark:placeholder:text-zinc-500"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isStreaming}
          aria-label="メッセージを送信"
        >
          {isStreaming ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
