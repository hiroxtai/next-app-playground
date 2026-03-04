/**
 * Next.js クライアントサイド Instrumentation
 *
 * ブラウザでアプリケーションが初期化される際に実行されるコード。
 * ナビゲーションの追跡やクライアントサイドのパフォーマンスメトリクス収集に使用する。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
import { clientLogger } from "@/lib/client-logger";

const logger = clientLogger.child({ module: "instrumentation-client" });

logger.debug("クライアントサイドの初期化が完了しました");

/**
 * Next.js App Router のルーター遷移開始時に呼び出されるコールバック。
 * ナビゲーションパターンの追跡やパフォーマンス計測に使用する。
 *
 * @param url - 遷移先の URL
 * @param navigationType - ナビゲーションの種類（push / replace / traverse）
 */
export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse",
) {
  logger.debug({ url, navigationType }, "ルーター遷移を開始");
}
