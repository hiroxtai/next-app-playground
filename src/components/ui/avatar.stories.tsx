/**
 * shadcn/ui Avatar コンポーネントの Story
 *
 * @remarks
 * Avatar はユーザーのプロフィール画像を表示するためのコンポーネントです。
 * 画像の読み込みに失敗した場合はフォールバックが表示されます。
 *
 * @see https://ui.shadcn.com/docs/components/avatar
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

/**
 * Avatar コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * 画像付きアバター
 *
 * @remarks
 * 正常に画像が読み込まれる場合のデフォルト表示です。
 */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * フォールバック表示
 *
 * @remarks
 * 画像が読み込めない場合にフォールバックが表示されます。
 */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/broken-image.jpg" alt="@user" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/**
 * フォールバックのみ
 *
 * @remarks
 * 画像なしでフォールバックのみを表示します。
 */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

// ============================================================================
// サイズバリエーション
// ============================================================================

/**
 * サイズバリエーション
 *
 * @remarks
 * className でサイズをカスタマイズできます。
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback className="text-xs">S</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback className="text-xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * アバターグループ
 *
 * @remarks
 * 複数のアバターを重ねて表示する例です。
 */
export const Group: Story = {
  render: () => (
    <div className="flex -space-x-3">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};
