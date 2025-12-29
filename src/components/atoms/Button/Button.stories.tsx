/**
 * Button コンポーネントの Story
 *
 * @remarks
 * このファイルでは Button コンポーネントのすべてのバリエーションを
 * Story として定義しています。
 *
 * ## 学習ポイント
 *
 * 1. **argTypes**: Props のコントロールを細かく設定
 * 2. **args のデフォルト値**: meta で定義した args は全 Story に適用
 * 3. **play function**: ユーザー操作をシミュレート（インタラクションテスト）
 *
 * @see https://storybook.js.org/docs/writing-stories/args
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  /**
   * argTypes: Props の詳細設定
   *
   * @remarks
   * Controls パネルでの表示方法を細かく制御できます。
   * - control.type: 使用するコントロールの種類
   * - options: 選択肢のリスト
   * - description: Props の説明（autodocs に表示）
   */
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
      description: "ボタンのスタイルバリアント",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "ボタンのサイズ",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "ボタンを無効化するかどうか",
    },
    children: {
      control: { type: "text" },
      description: "ボタンのラベル",
    },
    onClick: {
      action: "clicked",
      description: "クリック時のコールバック関数",
    },
  },
  /**
   * args: 全 Story に適用されるデフォルト値
   */
  args: {
    children: "ボタン",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// バリアント別
// ============================================================================

/**
 * Primary ボタン（デフォルト）
 *
 * @remarks
 * メインアクション用のボタンです。
 * ダークな背景色で目立つようにデザインされています。
 */
export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

/**
 * Secondary ボタン
 *
 * @remarks
 * サブアクション用のボタンです。
 * Primary より控えめな色合いで、補助的なアクションに使用します。
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Ghost ボタン
 *
 * @remarks
 * テキストリンク風のボタンです。
 * ナビゲーションやキャンセルアクションに適しています。
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

// ============================================================================
// サイズ別
// ============================================================================

/**
 * Small サイズ
 *
 * @remarks
 * コンパクトな UI やテーブル内のアクションに適しています。
 */
export const Small: Story = {
  args: {
    size: "sm",
    children: "小さいボタン",
  },
};

/**
 * Medium サイズ（デフォルト）
 */
export const Medium: Story = {
  args: {
    size: "md",
    children: "標準ボタン",
  },
};

/**
 * Large サイズ
 *
 * @remarks
 * CTA（Call to Action）やヒーローセクションに適しています。
 */
export const Large: Story = {
  args: {
    size: "lg",
    children: "大きいボタン",
  },
};

// ============================================================================
// 状態別
// ============================================================================

/**
 * 無効化されたボタン
 *
 * @remarks
 * disabled 属性が true の場合の表示です。
 * opacity が下がり、cursor が not-allowed になります。
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "無効なボタン",
  },
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * クリックイベントのテスト
 *
 * @remarks
 * play function を使用して、ボタンのクリックをシミュレートしています。
 *
 * ## play function とは？
 *
 * Story がレンダリングされた後に実行されるテスト関数です。
 * ユーザー操作をシミュレートし、結果を検証できます。
 *
 * - userEvent: ユーザー操作をシミュレート（click, type など）
 * - within: 特定の要素内で検索
 * - expect: アサーション（検証）
 *
 * @see https://storybook.js.org/docs/writing-tests/interaction-testing
 */
export const WithClickTest: Story = {
  args: {
    children: "クリックしてテスト",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // ボタンを取得
    const button = canvas.getByRole("button", { name: "クリックしてテスト" });

    // ボタンをクリック
    await userEvent.click(button);

    // onClick が呼ばれたことを確認
    await expect(args.onClick).toHaveBeenCalled();
  },
};

// ============================================================================
// 組み合わせ
// ============================================================================

/**
 * すべてのバリアントを並べて表示
 *
 * @remarks
 * デコレーターを使用して複数のボタンを横に並べています。
 * デザインの一貫性を確認するのに便利です。
 */
export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

/**
 * すべてのサイズを並べて表示
 */
export const AllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
