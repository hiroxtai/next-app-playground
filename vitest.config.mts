/**
 * Vitest の設定ファイル
 *
 * @remarks
 * Next.js プロジェクトで Vitest を使用するための設定です。
 * React Compiler が有効なため、plugin-react を使用してトランスパイルします。
 *
 * この設定では 2 つのテストプロジェクトを定義しています:
 * 1. unit プロジェクト: 通常の単体テスト（jsdom 環境）
 * 2. storybook プロジェクト: Story のテスト（ブラウザ環境）
 *
 * テスト実行方法:
 * - 単体テストのみ: pnpm test --project=unit
 * - Storybook テストのみ: pnpm test:storybook（--project=storybook）
 * - 全プロジェクト: pnpm test（projects 配列内のすべて）
 *
 * CI では単体テストと Storybook テストを分離して実行することを推奨:
 * - test ジョブ: --project=unit（Playwright 不要）
 * - storybook-build ジョブ: --project=storybook（Playwright 必要）
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
     * テストプロジェクトの定義
     *
     * @remarks
     * Vitest 4 では projects 配列で複数のテスト環境を定義できます。
     * 各プロジェクトは独立した設定を持ち、--project オプションで個別に実行可能です。
     */
    projects: [
      /**
       * 1. 単体テストプロジェクト (unit)
       *
       * @remarks
       * jsdom 環境で *.test.tsx ファイルをテストします。
       * Playwright ブラウザは不要です。
       */
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/*.stories.tsx"],
          setupFiles: ["./vitest.setup.ts"],
          globals: true,
        },
      },

      /**
       * 2. Storybook テストプロジェクト (storybook)
       *
       * @remarks
       * Playwright を使用してブラウザ環境で Story をテストします。
       * このプロジェクトを実行するには Playwright ブラウザのインストールが必要です:
       *   pnpm exec playwright install chromium
       *
       * テスト対象の Story は .storybook/main.ts の stories 設定で制御されます。
       */
      {
        extends: true,
        plugins: [
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
