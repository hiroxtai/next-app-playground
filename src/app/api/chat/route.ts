import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { logger } from "@/lib/logger";

const chatLogger = logger.child({ module: "api/chat" });

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
  const { messages }: { messages: UIMessage[] } = await req.json();

  chatLogger.info(
    { messageCount: messages.length },
    "チャットリクエストを受信",
  );

  const result = streamText({
    // OpenAI のモデルを指定（学習用なのでコスト効率の良い gpt-4o-mini を使用）
    model: openai("gpt-4o-mini"),
    // システムプロンプトで AI の振る舞いを定義
    system:
      "あなたは親切で丁寧な AI アシスタントです。日本語で回答してください。",
    // UI メッセージをモデルが理解できる形式に変換
    messages: await convertToModelMessages(messages),
  });

  // SSE（Server-Sent Events）形式のレスポンスを返す
  // これにより、クライアント側でリアルタイムにテキストが表示される
  return result.toUIMessageStreamResponse();
}
