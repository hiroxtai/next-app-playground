/**
 * クライアントサイド用ロガー（Pino Browser API）
 *
 * Client Components で使用する構造化ロガー。
 * サーバーサイドと同じ Pino の API を使用し、
 * ブラウザでは `console.*` メソッドにマッピングされます。
 *
 * @remarks
 * - Pino の `browser` フィールド（package.json）により、
 *   バンドラーが自動的にブラウザ向けの軽量ビルド（browser.js）を使用します。
 * - `child()` でコンポーネント固有のコンテキストを付与可能
 * - 本番環境ではログを無効化してパフォーマンスを最適化
 * - `transmit` オプションを設定すれば、将来的にサーバーへのリモートログ送信も可能
 *
 * @example
 * ```tsx
 * "use client";
 * import { clientLogger } from "@/lib/client-logger";
 *
 * const logger = clientLogger.child({ component: "Counter" });
 *
 * function Counter() {
 *   const handleClick = () => {
 *     logger.info({ count: 1 }, "ボタンがクリックされました");
 *   };
 *   return <button onClick={handleClick}>+1</button>;
 * }
 * ```
 */
import pino from "pino";

const isProduction =
  typeof process !== "undefined" && process.env.NODE_ENV === "production";

/**
 * アプリケーション共通のクライアントサイドロガーインスタンス。
 *
 * Pino の Browser API を使用し、サーバー側と統一された API を提供します。
 * - 開発環境: `console.*` に構造化オブジェクトとして出力
 * - 本番環境: ログを無効化（パフォーマンス最適化）
 */
export const clientLogger = pino({
  name: "next-app-playground",
  level: isProduction ? "warn" : "debug",
  browser: {
    /**
     * ログを Pino 形式のオブジェクトとして console に出力する。
     * これにより DevTools で構造化データとして確認できる。
     */
    asObject: true,
    /** 本番環境ではブラウザログを無効化 */
    disabled: isProduction,
  },
});
