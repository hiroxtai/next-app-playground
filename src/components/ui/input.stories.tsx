/**
 * shadcn/ui Input コンポーネントの Story
 *
 * @remarks
 * Input はテキスト入力のための基本的なフォームコンポーネントです。
 * HTML の input 要素をラップし、一貫したスタイリングを提供します。
 *
 * @see https://ui.shadcn.com/docs/components/input
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

/**
 * Input コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "入力タイプ",
    },
    placeholder: {
      control: { type: "text" },
      description: "プレースホルダーテキスト",
    },
    disabled: {
      control: { type: "boolean" },
      description: "無効状態",
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的な使用例
// ============================================================================

/**
 * デフォルトの Input
 */
export const Default: Story = {
  args: {
    placeholder: "テキストを入力...",
  },
};

/**
 * Email タイプ
 */
export const Email: Story = {
  args: {
    type: "email",
    placeholder: "example@email.com",
  },
};

/**
 * Password タイプ
 */
export const Password: Story = {
  args: {
    type: "password",
    placeholder: "パスワード",
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "無効な入力",
    value: "編集できません",
  },
};

/**
 * ファイル入力
 */
export const File: Story = {
  args: {
    type: "file",
  },
};

// ============================================================================
// Label との組み合わせ
// ============================================================================

/**
 * Label 付き Input
 *
 * @remarks
 * アクセシビリティのため、Input には常に Label を付けることを推奨します。
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">メールアドレス</Label>
      <Input type="email" id="email" placeholder="example@email.com" />
    </div>
  ),
};

/**
 * ヘルプテキスト付き
 */
export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">ユーザー名</Label>
      <Input id="username" placeholder="username" />
      <p className="text-sm text-muted-foreground">
        3文字以上20文字以内で入力してください。
      </p>
    </div>
  ),
};

/**
 * エラー状態
 *
 * @remarks
 * aria-invalid 属性を使用してエラー状態を示します。
 */
export const WithError: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error">メールアドレス</Label>
      <Input
        type="email"
        id="email-error"
        placeholder="example@email.com"
        aria-invalid="true"
        defaultValue="invalid-email"
      />
      <p className="text-sm text-destructive">
        有効なメールアドレスを入力してください。
      </p>
    </div>
  ),
};

// ============================================================================
// Button との組み合わせ
// ============================================================================

/**
 * 検索フォーム
 */
export const SearchForm: Story = {
  render: () => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="search" placeholder="検索..." />
      <Button type="submit">検索</Button>
    </div>
  ),
};

/**
 * ニュースレター登録
 */
export const Newsletter: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col space-y-2">
      <Label htmlFor="newsletter">ニュースレターに登録</Label>
      <div className="flex space-x-2">
        <Input
          id="newsletter"
          type="email"
          placeholder="メールアドレスを入力"
        />
        <Button type="submit">登録</Button>
      </div>
    </div>
  ),
};
