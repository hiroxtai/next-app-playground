import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Vitest の設定ファイル
 *
 * @remarks
 * Next.js プロジェクトで Vitest を使用するための設定。
 * React Compiler が有効なため、plugin-react を使用してトランスパイルします。
 */
export default defineConfig({
  plugins: [
    react(), // React コンポーネントのトランスパイル
    tsconfigPaths(), // tsconfig.json の paths を自動解決（@/* エイリアス）
  ],
  test: {
    environment: "jsdom", // ブラウザ環境をシミュレート
    setupFiles: ["./vitest.setup.ts"], // テスト前の初期化処理
    globals: true, // describe, it, expect をグローバルに使用可能（Jest 互換）
  },
});
