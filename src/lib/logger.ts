/**
 * サーバーサイド用ロガー（Pino）
 *
 * Server Components、Route Handlers、Server Actions、Middleware で使用する構造化ロガー。
 * 開発環境では pino-pretty による読みやすい出力、
 * 本番環境では JSON 形式の構造化ログ（ログ集約サービスとの連携に最適）を出力します。
 *
 * @remarks
 * - このモジュールはサーバーサイド専用です。
 * - Client Components では `@/lib/client-logger` を使用してください。
 * - ログレベルは `LOG_LEVEL` 環境変数で制御可能（デフォルト: `info`）
 *
 * @example
 * ```ts
 * import { logger } from "@/lib/logger";
 *
 * // 基本的な使い方
 * logger.info("サーバー処理を開始");
 *
 * // コンテキスト付きログ
 * logger.info({ userId: "123", action: "login" }, "ユーザーがログインしました");
 *
 * // 子ロガー（モジュール固有のコンテキストを付与）
 * const apiLogger = logger.child({ module: "api/chat" });
 * apiLogger.error({ err }, "APIリクエストに失敗しました");
 * ```
 */
import pino from "pino";

/**
 * アプリケーション共通のサーバーサイドロガーインスタンス。
 *
 * Pino はデフォルトで JSON 構造化ログを出力し、
 * 開発環境のみ pino-pretty transport で人間が読みやすい出力に変換します。
 */
export const logger = pino({
  name: "next-app-playground",
  level: process.env.LOG_LEVEL ?? "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});
