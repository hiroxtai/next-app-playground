# AI チャットボット

Vercel AI SDK を使用した SSE ストリーミング対応の AI チャットボットの実装を学びます。

## 学習できること

- Vercel AI SDK の基本概念と役割
- SSE（Server-Sent Events）によるリアルタイムストリーミング
- `useChat` フックによるチャット状態管理
- Next.js API Route Handler を使ったサーバー側の処理
- クライアント ↔ サーバー ↔ LLM のアーキテクチャ

## 環境構築

### 1. パッケージのインストール

AI SDK 関連のパッケージはプロジェクトにインストール済みです。
新規プロジェクトで使用する場合は、以下のコマンドでインストールします。

```bash
pnpm add ai @ai-sdk/react @ai-sdk/openai zod
```

| パッケージ | 役割 |
|-----------|------|
| `ai` | AI SDK コアパッケージ。`streamText`、`UIMessage` 等を提供 |
| `@ai-sdk/react` | React 用フック。`useChat` でチャット状態を管理 |
| `@ai-sdk/openai` | OpenAI プロバイダー。GPT-4o, GPT-4o-mini 等を利用 |
| `zod` | スキーマバリデーション。ツール定義等で使用 |

### 2. OpenAI API キーの設定

OpenAI の API キーが必要です。プロジェクトルートに `.env.local` ファイルを作成してください。

```bash
# .env.local
OPENAI_API_KEY=sk-xxxxx
```

API キーは [OpenAI Platform](https://platform.openai.com/api-keys) から取得できます。

> **注意:** `.env.local` は `.gitignore` に含まれているため、Git にコミットされません。
> API キーをソースコードやリポジトリに含めないでください。

### 3. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000/examples/ai/chatbot にアクセスします。

## Vercel AI SDK とは

[Vercel AI SDK](https://ai-sdk.dev/) は、AI アプリケーションを構築するための TypeScript ツールキットです。

### 特徴

- **統一 API**: OpenAI、Anthropic、Google など複数の AI プロバイダーを同じインターフェースで扱える
- **ストリーミング対応**: SSE を使ってトークン単位でリアルタイムにレスポンスを表示
- **React フック**: `useChat` や `useCompletion` でチャット状態を簡単に管理
- **型安全**: TypeScript ファーストで設計されており、型推論が効く
- **フレームワーク統合**: Next.js の App Router や Route Handler とシームレスに連携

### AI SDK の構成レイヤー

```
┌──────────────────────────────────────────┐
│  @ai-sdk/react  （React フック層）         │
│  useChat, useCompletion, useObject       │
├──────────────────────────────────────────┤
│  ai  （コアパッケージ）                     │
│  streamText, generateText, UIMessage     │
├──────────────────────────────────────────┤
│  @ai-sdk/openai  （プロバイダー層）         │
│  openai("gpt-4o-mini") など               │
└──────────────────────────────────────────┘
```

## アーキテクチャ

このチャットボットは、以下の 3 層で構成されています。

```
┌─────────────┐     POST /api/chat     ┌──────────────┐     API Call     ┌─────────┐
│   Client    │ ──────────────────────▶ │  API Route   │ ──────────────▶ │   LLM   │
│  (useChat)  │ ◀────────────────────── │ (streamText) │ ◀────────────── │ (OpenAI)│
│             │    SSE ストリーミング     │              │   レスポンス     │         │
└─────────────┘                        └──────────────┘                 └─────────┘
```

### 処理の流れ

1. **ユーザーがメッセージを入力** → `sendMessage()` が呼ばれる
2. **`useChat` が POST リクエストを送信** → `/api/chat` に `UIMessage[]` を送る
3. **API Route が LLM にリクエスト** → `streamText()` で OpenAI に問い合わせ
4. **LLM がトークンを生成** → 1 トークンずつ順番に返される
5. **SSE でクライアントに配信** → `toUIMessageStreamResponse()` がストリーミング
6. **画面にリアルタイム表示** → `useChat` がメッセージを自動更新

## ファイル構成

Colocation パターンに従い、関連ファイルを同じディレクトリにまとめています。

```
src/app/
├── api/chat/
│   └── route.ts              # API ルートハンドラ（サーバー側）
└── examples/ai/chatbot/
    ├── page.tsx               # ページコンポーネント（Server Component）
    ├── README.md              # このドキュメント
    └── _components/
        ├── index.ts           # バレルエクスポート
        └── ChatBot.tsx        # チャット UI（Client Component）
```

## コード解説

### API ルートハンドラ（サーバー側）

`src/app/api/chat/route.ts` は、Next.js の **Route Handler** です。
`app/api/` ディレクトリ内の `route.ts` は、ファイルパスがそのまま API エンドポイントの URL になります。

```tsx
// src/app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Vercel の Serverless Functions のタイムアウトを 30 秒に延長
export const maxDuration = 30;

export async function POST(req: Request) {
  // 1. クライアントからのメッセージを取得
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 2. streamText でストリーミングレスポンスを生成
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "あなたは親切で丁寧な AI アシスタントです。日本語で回答してください。",
    messages: await convertToModelMessages(messages),
  });

  // 3. SSE 形式でレスポンスを返す
  return result.toUIMessageStreamResponse();
}
```

#### ポイント

| コード | 説明 |
|--------|------|
| `export async function POST` | HTTP POST メソッドに自動的にマッピングされる |
| `maxDuration = 30` | Serverless Functions のタイムアウトを延長。AI の応答は時間がかかるため必要 |
| `openai("gpt-4o-mini")` | 使用する AI モデルを指定。学習用にはコスト効率の良い mini を推奨 |
| `convertToModelMessages()` | UI 形式のメッセージをモデルが理解できる形式に変換 |
| `streamText()` | テキストをストリーミング生成する。一括ではなく逐次的に返す |
| `toUIMessageStreamResponse()` | SSE（Server-Sent Events）形式のレスポンスに変換 |

### チャット UI（クライアント側）

`_components/ChatBot.tsx` は、`useChat` フックでチャット全体の状態を管理する Client Component です。

```tsx
// _components/ChatBot.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function ChatBot() {
  const [input, setInput] = useState("");

  // useChat フックでチャット状態を管理
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",   // API エンドポイントを指定
    }),
  });

  const isStreaming = status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });  // メッセージを送信
    setInput("");
  };

  return (
    <div>
      {/* メッセージ一覧の表示 */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">送信</button>
      </form>
    </div>
  );
}
```

#### `useChat` フックの返り値

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `messages` | `UIMessage[]` | ユーザーと AI の全メッセージ履歴 |
| `sendMessage` | `(message) => void` | メッセージを API に送信する関数 |
| `status` | `string` | 接続状態（`"ready"`, `"streaming"`, `"error"` 等） |

#### メッセージの描画

各メッセージは `parts` 配列を持ち、テキストやツール結果などのブロックで構成されます。

```tsx
message.parts.map((part) => {
  if (part.type === "text") {
    return <p>{part.text}</p>;
  }
  // 将来的にツール結果なども描画可能
  return null;
});
```

## 主要な概念

### SSE（Server-Sent Events）とは

SSE は、サーバーからクライアントに一方向でデータをリアルタイムに送信するプロトコルです。

```
通常の HTTP:
  Client ──────── Request ──────────▶ Server
  Client ◀─────── Response（一括）──── Server

SSE:
  Client ──────── Request ──────────▶ Server
  Client ◀─────── data: token1 ────── Server
  Client ◀─────── data: token2 ────── Server
  Client ◀─────── data: token3 ────── Server
  Client ◀─────── [DONE] ──────────── Server
```

AI のレスポンスは1トークン（単語や文字の断片）ずつ生成されるため、SSE を使うことで順次表示が可能になります。
これにより、全文が完成するまで待つ必要がなく、ChatGPT のように文字が流れるように表示されます。

### "use client" ディレクティブ

`ChatBot.tsx` は **Client Component** です。

```tsx
"use client";
```

`useState` や `useChat` といった React のフックはクライアント側でのみ動作するため、
`"use client"` ディレクティブでクライアントコンポーネントとして宣言する必要があります。

一方、`page.tsx` は **Server Component**（デフォルト）のままで、メタデータや静的コンテンツを扱います。

### Route Handler（API ルートハンドラ）

Next.js の Route Handler は、ファイルシステムベースで API エンドポイントを自動生成する仕組みです。

```
ファイルパス                    →  API エンドポイント
src/app/api/chat/route.ts       →  POST /api/chat
src/app/api/users/route.ts      →  GET /api/users
src/app/api/users/[id]/route.ts →  GET /api/users/:id
```

エクスポートする関数名が HTTP メソッドに対応します：

| 関数名 | HTTP メソッド |
|--------|-------------|
| `GET` | GET |
| `POST` | POST |
| `PUT` | PUT |
| `DELETE` | DELETE |
| `PATCH` | PATCH |

## カスタマイズのヒント

### モデルの変更

`route.ts` の `model` を変更するだけで、別のモデルに切り替えられます。

```tsx
// より高性能なモデル
model: openai("gpt-4o"),

// コスト重視
model: openai("gpt-4o-mini"),
```

### システムプロンプトの変更

`system` パラメータで AI の振る舞いを変更できます。

```tsx
system: "あなたはプログラミングの先生です。コードの例を交えて分かりやすく教えてください。",
```

### 別のプロバイダーに切り替え

AI SDK の統一 API により、プロバイダーの切り替えは最小限の変更で済みます。

```tsx
// Anthropic を使う場合
import { anthropic } from "@ai-sdk/anthropic";
model: anthropic("claude-sonnet-4-20250514"),

// Google を使う場合
import { google } from "@ai-sdk/google";
model: google("gemini-2.0-flash"),
```

## トラブルシューティング

| 症状 | 原因と対処 |
|------|-----------|
| チャットに何も表示されない | `.env.local` に `OPENAI_API_KEY` が設定されているか確認 |
| API キーエラーが出る | API キーが有効か、残高があるか [OpenAI Dashboard](https://platform.openai.com/) で確認 |
| レスポンスが途中で切れる | `maxDuration` の値を増やしてタイムアウトを延長する |
| ストリーミングされず一括表示される | `streamText` と `toUIMessageStreamResponse` を使っているか確認 |

## 参考リンク

- [Vercel AI SDK 公式ドキュメント](https://ai-sdk.dev/)
- [AI SDK - useChat](https://ai-sdk.dev/docs/reference/ai-sdk-react/use-chat)
- [AI SDK - streamText](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [OpenAI API リファレンス](https://platform.openai.com/docs/api-reference)
- [MDN - Server-Sent Events](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events)
