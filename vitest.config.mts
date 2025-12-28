/**
 * Vitest の設定ファイル
 *
 * @remarks
 * Next.js プロジェクトで Vitest を使用するための設定です。
 * React Compiler が有効なため、plugin-react を使用してトランスパイルします。
 *
 * この設定では 2 つのテストプロジェクトを定義しています:
 * 1. デフォルトプロジェクト: 通常の単体テスト（jsdom 環境）
 * 2. storybook プロジェクト: Story のテスト（ブラウザ環境）
 *
 * @see https://vitest.dev/config/
 * @see https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    /**
     * React コンポーネントのトランスパイル
     *
     * @remarks
     * React Compiler と連携して JSX を処理します。
     */
    react(),

    /**
     * TypeScript パスエイリアスの解決
     *
     * @remarks
     * tsconfig.json の paths 設定（@/* エイリアス）を自動解決します。
     */
    tsconfigPaths(),
  ],
  test: {
    /**
     * テスト環境: jsdom
     *
     * @remarks
     * ブラウザ環境をシミュレートし、DOM 操作を可能にします。
     */
    environment: "jsdom",

    /**
     * テスト前の初期化処理
     *
     * @remarks
     * Testing Library のマッチャー（toBeInTheDocument など）を追加し、
     * 各テスト後に DOM をクリーンアップします。
     */
    setupFiles: ["./vitest.setup.ts"],

    /**
     * グローバル API の有効化
     *
     * @remarks
     * describe, it, expect を import なしで使用可能にします（Jest 互換）。
     */
    globals: true,

    /**
     * テストプロジェクトの定義
     *
     * @remarks
     * Storybook の Story をブラウザ環境でテストするための設定です。
     * Playwright を使用してヘッドレス Chromium でテストを実行します。
     */
    projects: [
      {
        extends: true,
        plugins: [
          /**
           * Storybook テストプラグイン
           *
           * @remarks
           * .storybook/main.ts で定義された Story を
           * テストケースとして実行します。
           */
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
