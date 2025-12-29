/**
 * shadcn/ui Badge コンポーネントの Story
 *
 * @remarks
 * Badge はステータスやラベルを表示するための小さなコンポーネントです。
 * 4 つのバリアント（default, secondary, destructive, outline）があります。
 *
 * @see https://ui.shadcn.com/docs/components/badge
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "./badge";

/**
 * Badge コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
      description: "バッジのスタイルバリアント",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトバッジ
 */
export const Default: Story = {
  args: {
    children: "Badge",
  },
};

/**
 * Secondary バリアント
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

/**
 * Destructive バリアント
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

/**
 * Outline バリアント
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

// ============================================================================
// すべてのバリアント
// ============================================================================

/**
 * すべてのバリアントを一覧表示
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// ============================================================================
// 使用例
// ============================================================================

/**
 * ステータス表示
 *
 * @remarks
 * バッジはステータスを示すために使用されることが多いです。
 */
export const StatusExamples: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">公開中</Badge>
      <Badge variant="secondary">下書き</Badge>
      <Badge variant="destructive">期限切れ</Badge>
      <Badge variant="outline">アーカイブ</Badge>
    </div>
  ),
};

/**
 * カテゴリタグ
 */
export const CategoryTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">React</Badge>
      <Badge variant="outline">TypeScript</Badge>
      <Badge variant="outline">Next.js</Badge>
      <Badge variant="outline">Tailwind CSS</Badge>
    </div>
  ),
};
