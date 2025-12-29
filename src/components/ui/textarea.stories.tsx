/**
 * shadcn/ui Textarea コンポーネントの Story
 *
 * @remarks
 * Textarea は複数行のテキスト入力を受け付けるコンポーネントです。
 * コメントや説明文など、長いテキストの入力に使用します。
 *
 * @see https://ui.shadcn.com/docs/components/textarea
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./button";
import { Label } from "./label";
import { Textarea } from "./textarea";

/**
 * Textarea コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: { type: "text" },
      description: "プレースホルダーテキスト",
    },
    disabled: {
      control: { type: "boolean" },
      description: "無効状態",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのテキストエリア
 */
export const Default: Story = {
  args: {
    placeholder: "ここに入力してください...",
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    placeholder: "入力不可",
    disabled: true,
  },
};

/**
 * デフォルト値あり
 */
export const WithDefaultValue: Story = {
  args: {
    defaultValue:
      "これはデフォルトで入力されているテキストです。\n複数行のテキストを入力できます。",
  },
};

// ============================================================================
// ラベル付き
// ============================================================================

/**
 * ラベル付きテキストエリア
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">メッセージ</Label>
      <Textarea placeholder="メッセージを入力してください" id="message" />
    </div>
  ),
};

/**
 * ヘルプテキスト付き
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="bio">自己紹介</Label>
      <Textarea placeholder="自己紹介を入力してください" id="bio" />
      <p className="text-sm text-muted-foreground">
        500文字以内で入力してください。
      </p>
    </div>
  ),
};

// ============================================================================
// フォーム例
// ============================================================================

/**
 * フォームの例
 */
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="subject">件名</Label>
        <Textarea
          id="subject"
          placeholder="件名を入力してください"
          className="min-h-[60px]"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="body">本文</Label>
        <Textarea
          id="body"
          placeholder="本文を入力してください"
          className="min-h-[120px]"
        />
      </div>
      <Button>送信</Button>
    </div>
  ),
};

/**
 * 文字数カウント付き
 */
export const WithCharacterCount: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="limited">コメント</Label>
      <Textarea
        id="limited"
        placeholder="コメントを入力してください"
        maxLength={200}
      />
      <p className="text-sm text-muted-foreground text-right">0 / 200</p>
    </div>
  ),
};

// ============================================================================
// サイズバリエーション
// ============================================================================

/**
 * サイズバリエーション
 */
export const Sizes: Story = {
  render: () => (
    <div className="grid w-full gap-4">
      <div className="grid gap-1.5">
        <Label>小さいテキストエリア</Label>
        <Textarea placeholder="小" className="min-h-[60px]" />
      </div>
      <div className="grid gap-1.5">
        <Label>中サイズ（デフォルト）</Label>
        <Textarea placeholder="中" />
      </div>
      <div className="grid gap-1.5">
        <Label>大きいテキストエリア</Label>
        <Textarea placeholder="大" className="min-h-[200px]" />
      </div>
    </div>
  ),
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * 入力テスト
 *
 * @remarks
 * テキストエリアに入力ができることを確認します。
 */
export const InputTest: Story = {
  render: () => (
    <Textarea placeholder="入力テスト" data-testid="test-textarea" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByTestId("test-textarea");

    // テキストを入力
    await userEvent.type(textarea, "テスト入力です。\n複数行も入力できます。");

    // 入力された値を確認
    await expect(textarea).toHaveValue(
      "テスト入力です。\n複数行も入力できます。",
    );
  },
};
