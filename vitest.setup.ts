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
 * 各テスト後に DOM をクリーンアップ
 *
 * @remarks
 * テスト間の状態漏れを防ぐため、すべてのテスト実行後に自動的に
 * レンダリングされた要素を削除します。
 */
afterEach(() => {
  cleanup();
});
