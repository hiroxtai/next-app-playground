/**
 * shadcn/ui Button コンポーネントの Story
 *
 * @remarks
 * このファイルでは、Button コンポーネントのすべてのバリエーションを
 * Storybook で確認できるようにしています。
 *
 * shadcn/ui の Button は以下の特徴を持ちます:
 * - 6 つのバリアント（default, destructive, outline, secondary, ghost, link）
 * - 6 つのサイズ（default, sm, lg, icon, icon-sm, icon-lg）
 * - asChild prop によるカスタムコンポーネントのレンダリング
 *
 * @see https://ui.shadcn.com/docs/components/button
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Loader2, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "./button";

/**
 * Button コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "ボタンのスタイルバリアント",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
      description: "ボタンのサイズ",
    },
    disabled: {
      control: { type: "boolean" },
      description: "ボタンの無効状態",
    },
    asChild: {
      control: { type: "boolean" },
      description: "子要素をボタンとしてレンダリング",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのボタン
 *
 * @remarks
 * 最も一般的に使用されるプライマリボタンです。
 * 主要なアクションに使用します。
 */
export const Default: Story = {
  args: {
    children: "Button",
  },
};

/**
 * Destructive バリアント
 *
 * @remarks
 * 削除や破壊的なアクションに使用します。
 * 赤色で警告を示します。
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

/**
 * Outline バリアント
 *
 * @remarks
 * 境界線のみのボタンです。
 * セカンダリアクションに使用します。
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

/**
 * Secondary バリアント
 *
 * @remarks
 * セカンダリカラーを使用したボタンです。
 * 補助的なアクションに使用します。
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

/**
 * Ghost バリアント
 *
 * @remarks
 * 背景のない透明なボタンです。
 * ナビゲーションやツールバーに使用します。
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

/**
 * Link バリアント
 *
 * @remarks
 * リンクのように見えるボタンです。
 * インラインアクションに使用します。
 */
export const LinkVariant: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

// ============================================================================
// サイズバリエーション
// ============================================================================

/**
 * Small サイズ
 */
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

/**
 * Large サイズ
 */
export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

/**
 * Icon サイズ（アイコンのみのボタン）
 */
export const Icon: Story = {
  args: {
    size: "icon",
    "aria-label": "Add item",
    children: <Plus className="h-4 w-4" />,
  },
};

// ============================================================================
// 状態バリエーション
// ============================================================================

/**
 * 無効状態のボタン
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

/**
 * ローディング状態のボタン
 *
 * @remarks
 * 非同期処理中に表示するローディング状態です。
 * Loader2 アイコンを使用してスピナーを表示します。
 */
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className="animate-spin" />
        Please wait
      </>
    ),
  },
};

// ============================================================================
// アイコン付きボタン
// ============================================================================

/**
 * 左アイコン付きボタン
 */
export const WithLeftIcon: Story = {
  args: {
    children: (
      <>
        <Mail />
        Login with Email
      </>
    ),
  },
};

/**
 * 右アイコン付きボタン
 */
export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        Login with Email
        <Mail />
      </>
    ),
  },
};

// ============================================================================
// asChild を使用したカスタムレンダリング
// ============================================================================

/**
 * Link として使用
 *
 * @remarks
 * asChild prop を使用して、Next.js の Link コンポーネントを
 * ボタンのスタイルでレンダリングします。
 */
export const AsLink: Story = {
  args: {
    asChild: true,
    children: <Link href="/">Go to Home</Link>,
  },
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * クリックテスト
 *
 * @remarks
 * ボタンをクリックしたときに onClick ハンドラが
 * 呼び出されることを確認します。
 */
export const ClickTest: Story = {
  args: {
    children: "Click me",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Click me" });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

/**
 * すべてのバリアントを一覧表示
 *
 * @remarks
 * すべてのバリアントを一度に確認できるストーリーです。
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

/**
 * すべてのサイズを一覧表示
 *
 * @remarks
 * すべてのサイズを一度に確認できるストーリーです。
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
};
