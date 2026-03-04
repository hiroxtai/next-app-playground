/**
 * Next.js サーバーサイド Instrumentation
 *
 * Next.js サーバーインスタンスの起動時に一度だけ呼び出される `register` 関数と、
 * サーバーサイドでのリクエストエラーをキャプチャする `onRequestError` 関数を定義します。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */
import type { Instrumentation } from "next";
import { logger } from "@/lib/logger";

/**
 * Next.js サーバーインスタンスの起動時に一度だけ呼び出される。
 * ロガーの初期化やオブザーバビリティツールのセットアップに使用する。
 *
 * @remarks
 * 将来的に OpenTelemetry を導入する場合もここで register する。
 */
export function register() {
  logger.info(
    { runtime: process.env.NEXT_RUNTIME },
    "Next.js サーバーが起動しました",
  );
}

/**
 * サーバーサイドでリクエスト処理中にエラーが発生した際に呼び出される。
 * Server Components、Route Handlers、Server Actions でのエラーをキャプチャし、
 * 構造化ログとして記録する。
 *
 * @remarks
 * 本番環境では外部のエラートラッキングサービス（Sentry 等）への送信も検討する。
 */
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  const error = err instanceof Error ? err : new Error(String(err));

  logger.error(
    {
      err: {
        message: error.message,
        digest:
          "digest" in error ? (error as { digest?: string }).digest : undefined,
        stack: error.stack,
      },
      request: {
        path: request.path,
        method: request.method,
      },
      context: {
        routerKind: context.routerKind,
        routePath: context.routePath,
        routeType: context.routeType,
      },
    },
    "サーバーリクエストエラーが発生しました",
  );
};
