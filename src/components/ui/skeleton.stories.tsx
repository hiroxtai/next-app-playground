/**
 * shadcn/ui Skeleton コンポーネントの Story
 *
 * @remarks
 * Skeleton はコンテンツのローディング状態を表現するプレースホルダーです。
 * データ取得中やコンポーネントの遅延読み込み時に、レイアウトシフトを防ぎつつ
 * ユーザーにローディング中であることを視覚的に伝えます。
 *
 * @see https://ui.shadcn.com/docs/components/skeleton
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Skeleton } from "./skeleton";

/**
 * Skeleton コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的な使用例
// ============================================================================

/**
 * デフォルトの Skeleton
 *
 * @remarks
 * テキスト行のローディング状態を表現する基本的な Skeleton です。
 */
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

/**
 * カードのローディング状態
 *
 * @remarks
 * カード型コンポーネントのローディング状態を Skeleton で表現する例です。
 * アバター、タイトル、説明文のレイアウトを模倣しています。
 */
export const CardSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

/**
 * 複数行のローディング状態
 *
 * @remarks
 * 記事やコメントなど、複数行のテキストコンテンツの
 * ローディング状態を表現する例です。
 */
export const MultipleLines: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};
