/**
 * shadcn/ui Checkbox コンポーネントの Story
 *
 * @remarks
 * Checkbox はユーザーが選択状態を切り替えるためのコンポーネントです。
 * ラベルと組み合わせて使用することが推奨されます。
 *
 * @see https://ui.shadcn.com/docs/components/checkbox
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

/**
 * Checkbox コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "チェックボックスの無効状態",
    },
    checked: {
      control: { type: "boolean" },
      description: "チェック状態",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのチェックボックス
 */
export const Default: Story = {
  args: {},
};

/**
 * チェック済み
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
 * チェック済み + 無効状態
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
 * ラベル付きチェックボックス
 *
 * @remarks
 * Label コンポーネントと組み合わせて使用する推奨パターンです。
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">利用規約に同意する</Label>
    </div>
  ),
};

/**
 * 説明付きチェックボックス
 */
export const WithDescription: Story = {
  render: () => (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="terms1">利用規約に同意する</Label>
        <p className="text-sm text-muted-foreground">
          当サービスの利用規約とプライバシーポリシーに同意します。
        </p>
      </div>
    </div>
  ),
};

// ============================================================================
// フォーム例
// ============================================================================

/**
 * 複数選択の例
 */
export const MultipleOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" defaultChecked />
        <Label htmlFor="option1">メールで通知を受け取る</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2">SMSで通知を受け取る</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">プッシュ通知を受け取る</Label>
      </div>
    </div>
  ),
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * クリックテスト
 *
 * @remarks
 * チェックボックスをクリックしたときに状態が変わることを確認します。
 */
export const ClickTest: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="test-checkbox" />
      <Label htmlFor="test-checkbox">クリックしてテスト</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // 初期状態はチェックされていない
    await expect(checkbox).not.toBeChecked();

    // クリックするとチェックされる
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // 再度クリックするとチェックが外れる
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};
