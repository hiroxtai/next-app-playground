/**
 * Storybook のプレビュー設定ファイル
 *
 * @remarks
 * このファイルでは、Story の表示に関するグローバル設定を定義します。
 *
 * - Tailwind CSS の読み込み（globals.css）
 * - ダークモード切替（toolbar から選択可能）
 * - Controls アドオンの設定
 * - アクセシビリティテストの設定
 *
 * @see https://storybook.js.org/docs/configure#configure-story-rendering
 */

import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/nextjs-vite";

/**
 * Tailwind CSS のグローバルスタイルを読み込み
 *
 * @remarks
 * Next.js アプリで使用している globals.css を Storybook でも適用します。
 * これにより、実際のアプリと同じスタイルで Story を表示できます。
 */
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    /**
     * Controls アドオンの設定
     *
     * @remarks
     * 自動的に Props の型を推測してコントロールを生成します。
     * - color: 色関連の Props にはカラーピッカーを表示
     * - date: 日付関連の Props には日付ピッカーを表示
     */
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    /**
     * アクセシビリティ（a11y）テストの設定
     *
     * @remarks
     * axe-core を使用してアクセシビリティの問題を検出します。
     *
     * テストモードの選択肢:
     * - 'todo': 違反を UI にのみ表示（CI では失敗しない）
     * - 'error': 違反があれば CI を失敗させる
     * - 'off': a11y チェックをスキップ
     *
     * 学習段階では 'todo' を推奨し、慣れてきたら 'error' に変更しましょう。
     */
    a11y: {
      test: "todo",
    },
  },

  /**
   * グローバルデコレーター
   *
   * @remarks
   * すべての Story に適用されるラッパーコンポーネントを定義します。
   * withThemeByClassName を使用して、ダークモード切替を実装しています。
   */
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
