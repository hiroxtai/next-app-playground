/**
 * Sidebar コンポーネントの Story
 *
 * @remarks
 * カタログページのサイドバーナビゲーションを表示する Story です。
 *
 * ## デコレーターについて
 *
 * Sidebar は高さのあるコンポーネントのため、`decorators` を使用して
 * 表示領域を調整しています。デコレーターは Story を包むラッパーで、
 * レイアウトやコンテキストの提供に使用します。
 *
 * ## next/link について
 *
 * Storybook の `@storybook/nextjs-vite` フレームワークは
 * `next/link` を自動的にサポートしています。
 * 追加設定なしでリンクが動作します。
 *
 * @see https://storybook.js.org/docs/writing-stories/decorators
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar from "./Sidebar";

const meta = {
  title: "Catalog/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    /**
     * layout: 'fullscreen'
     *
     * @remarks
     * Sidebar は画面の左側に配置される想定のため、
     * 'centered' ではなく 'fullscreen' を使用します。
     */
    layout: "fullscreen",
  },
  /**
   * デコレーター: Story を包むラッパー
   *
   * @remarks
   * Sidebar が適切な高さで表示されるように、
   * 高さを指定したコンテナで包んでいます。
   */
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的な Story
// ============================================================================

/**
 * デフォルト表示
 *
 * @remarks
 * カテゴリ一覧を表示する標準的なサイドバーです。
 * ライトモードとダークモードの両方で確認できます。
 *
 * このコンポーネントは Props を持たないため、
 * args は空オブジェクトです。
 */
export const Default: Story = {
  args: {},
};

/**
 * 狭い高さでの表示
 *
 * @remarks
 * スクロールが発生する状況をシミュレートします。
 * `overflow-y-auto` が正しく機能していることを確認できます。
 */
export const CompactHeight: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ height: "300px", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
};
