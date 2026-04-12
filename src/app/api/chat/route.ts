import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

/**
 * 学習用の軽量レートリミッター（プロセスメモリ保存）
 *
 * @remarks
 * - サーバープロセスごとに独立してカウントされます（分散環境で共有されません）。
 * - サーバー再起動時にカウントはリセットされます。
 * - 本番では Redis などの共有ストレージを使う方式を推奨します。
 */
const inMemoryRateLimitStore = new Map<string, RateLimitEntry>();

const messagePartSchema = z
  .object({
    type: z.string().min(1),
    text: z.string().optional(),
  })
  .passthrough()
  .superRefine((part, ctx) => {
    if (part.type !== "text") return;
    if (typeof part.text === "string" && part.text.trim().length > 0) return;

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "type が text のパートには、空でない text フィールドが必要です。",
    });
  });

const uiMessageSchema = z
  .object({
    id: z.string().min(1).max(200),
    role: z.enum(["system", "user", "assistant", "tool"]),
    parts: z.array(messagePartSchema).min(1).max(20),
  })
  .passthrough();

const chatRequestSchema = z
  .object({
    messages: z.array(uiMessageSchema).min(1).max(50),
  })
  .passthrough();

function createJsonErrorResponse(options: {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  headers?: HeadersInit;
}) {
  const { status, code, message, details, headers } = options;

  return new Response(
    JSON.stringify({
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    },
  );
}

function getClientIdentifier(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown-client";
}

function checkRateLimit(clientId: string) {
  const now = Date.now();
  const currentEntry = inMemoryRateLimitStore.get(clientId);

  if (!currentEntry || now >= currentEntry.resetAt) {
    inMemoryRateLimitStore.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true as const };
  }

  if (currentEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((currentEntry.resetAt - now) / 1000),
    );

    return { allowed: false as const, retryAfterSeconds };
  }

  inMemoryRateLimitStore.set(clientId, {
    ...currentEntry,
    count: currentEntry.count + 1,
  });

  return { allowed: true as const };
}

/**
 * ストリーミングレスポンスの最大持続時間（秒）
 *
 * @remarks
 * Vercel の Serverless Functions はデフォルトで 10 秒のタイムアウトがあるため、
 * AI のレスポンスが途中で切れないよう 30 秒に設定しています。
 */
export const maxDuration = 30;

/**
 * AI チャットの API ルートハンドラ
 *
 * @remarks
 * Vercel AI SDK の `streamText` を使用して、OpenAI の GPT-4o-mini モデルから
 * SSE（Server-Sent Events）形式でレスポンスをストリーミングします。
 *
 * **必要な環境変数:**
 * - `OPENAI_API_KEY`: OpenAI の API キー（`.env.local` に設定）
 *
 * **処理の流れ:**
 * 1. クライアントから送信されたメッセージ配列を受け取る
 * 2. `convertToModelMessages` で UI メッセージをモデル形式に変換
 * 3. `streamText` でモデルにリクエストし、ストリーミングレスポンスを生成
 * 4. `toUIMessageStreamResponse` で SSE レスポンスとしてクライアントに返却
 *
 * @param req - クライアントからの POST リクエスト（messages: UIMessage[] を含む）
 * @returns SSE 形式のストリーミングレスポンス
 */
export async function POST(req: Request) {
  const clientId = getClientIdentifier(req);
  const rateLimitResult = checkRateLimit(clientId);

  if (!rateLimitResult.allowed) {
    return createJsonErrorResponse({
      status: 429,
      code: "rate_limited",
      message:
        "リクエストが多すぎます。しばらく待ってから、もう一度お試しください。",
      details: {
        retryAfterSeconds: rateLimitResult.retryAfterSeconds,
      },
      headers: {
        "Retry-After": String(rateLimitResult.retryAfterSeconds),
      },
    });
  }

  // 環境変数のチェック
  if (!process.env.OPENAI_API_KEY) {
    return createJsonErrorResponse({
      status: 500,
      code: "server_configuration_error",
      message:
        "OPENAI_API_KEY が設定されていません。.env.local に OPENAI_API_KEY=sk-... を追加してください。",
    });
  }

  let requestBody: unknown;
  try {
    requestBody = await req.json();
  } catch {
    return createJsonErrorResponse({
      status: 400,
      code: "invalid_json",
      message: "JSON の形式が不正です。",
    });
  }

  const parsedRequest = chatRequestSchema.safeParse(requestBody);
  if (!parsedRequest.success) {
    return createJsonErrorResponse({
      status: 400,
      code: "invalid_payload",
      message:
        "リクエスト形式が正しくありません。messages 配列の構造を確認してください。",
      details: parsedRequest.error.flatten(),
    });
  }
  const { messages } = parsedRequest.data;

  const result = streamText({
    // OpenAI のモデルを指定（学習用なのでコスト効率の良い gpt-4o-mini を使用）
    model: openai("gpt-4o-mini"),
    // システムプロンプトで AI の振る舞いを定義
    system:
      "あなたは親切で丁寧な AI アシスタントです。日本語で回答してください。",
    // UI メッセージをモデルが理解できる形式に変換
    messages: await convertToModelMessages(messages as UIMessage[]),
  });

  // SSE（Server-Sent Events）形式のレスポンスを返す
  // これにより、クライアント側でリアルタイムにテキストが表示される
  return result.toUIMessageStreamResponse();
}
