/**
 * shadcn/ui Switch コンポーネントの Story
 *
 * @remarks
 * Switch はオン/オフを切り替えるためのトグルコンポーネントです。
 * 設定の有効/無効の切り替えに使用します。
 *
 * @see https://ui.shadcn.com/docs/components/switch
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Label } from "./label";
import { Switch } from "./switch";

/**
 * Switch コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "スイッチの無効状態",
    },
    checked: {
      control: { type: "boolean" },
      description: "スイッチのオン/オフ状態",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのスイッチ
 */
export const Default: Story = {
  args: {},
};

/**
 * オン状態
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * オン + 無効状態
 */
export const CheckedDisabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};

// ============================================================================
// ラベル付き
// ============================================================================

/**
 * ラベル付きスイッチ
 *
 * @remarks
 * Label コンポーネントと組み合わせて使用する推奨パターンです。
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">機内モード</Label>
    </div>
  ),
};

/**
 * 説明付きスイッチ
 */
export const WithDescription: Story = {
  render: () => (
    <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor="marketing">マーケティングメール</Label>
        <p className="text-sm text-muted-foreground">
          新商品やプロモーションのお知らせを受け取る
        </p>
      </div>
      <Switch id="marketing" />
    </div>
  ),
};

// ============================================================================
// 設定例
// ============================================================================

/**
 * 設定リストの例
 */
export const SettingsList: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="notifications">プッシュ通知</Label>
          <p className="text-sm text-muted-foreground">
            重要なお知らせを受け取る
          </p>
        </div>
        <Switch id="notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="emails">メール通知</Label>
          <p className="text-sm text-muted-foreground">
            更新情報をメールで受け取る
          </p>
        </div>
        <Switch id="emails" />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="security" className="opacity-50">
            二要素認証
          </Label>
          <p className="text-sm text-muted-foreground opacity-50">
            アカウントのセキュリティを強化（準備中）
          </p>
        </div>
        <Switch id="security" disabled />
      </div>
    </div>
  ),
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * トグルテスト
 *
 * @remarks
 * スイッチをクリックしたときに状態が変わることを確認します。
 */
export const ToggleTest: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="test-switch" />
      <Label htmlFor="test-switch">クリックしてテスト</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchElement = canvas.getByRole("switch");

    // 初期状態はオフ
    await expect(switchElement).not.toBeChecked();

    // クリックするとオン
    await userEvent.click(switchElement);
    await expect(switchElement).toBeChecked();

    // 再度クリックするとオフ
    await userEvent.click(switchElement);
    await expect(switchElement).not.toBeChecked();
  },
};
