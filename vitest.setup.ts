import "@testing-library/jest-dom"; // toBeInTheDocument などのマッチャーを追加
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * Vitest のセットアップファイル
 *
 * @remarks
 * すべてのテストファイルで共通して実行される初期化処理を定義します。
 * Testing Library の jest-dom マッチャーを有効化し、
 * 各テスト後に DOM をクリーンアップすることで、テスト間の状態漏れを防ぎます。
 */

/**
 * jsdom 環境に window.matchMedia のモックを追加
 *
 * @remarks
 * next-themes など、matchMedia を使用するライブラリのテストに必要です。
 * jsdom はデフォルトで matchMedia を実装していないため、最小限のモックを提供します。
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/**
 * 各テスト後に DOM をクリーンアップ
 *
 * @remarks
 * テスト間の状態漏れを防ぐため、すべてのテスト実行後に自動的に
 * レンダリングされた要素を削除します。
 */
afterEach(() => {
  cleanup();
});
