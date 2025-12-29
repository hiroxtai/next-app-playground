/**
 * shadcn/ui Tooltip コンポーネントの Story
 *
 * @remarks
 * Tooltip はホバー時に追加情報を表示するコンポーネントです。
 * ボタンやアイコンの説明を補足するために使用します。
 *
 * @see https://ui.shadcn.com/docs/components/tooltip
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus, Settings } from "lucide-react";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/**
 * Tooltip コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのツールチップ
 *
 * @remarks
 * ボタンにホバーするとツールチップが表示されます。
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">ホバーしてください</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>ツールチップの内容</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * アイコンボタンのツールチップ
 *
 * @remarks
 * アイコンのみのボタンに説明を追加する典型的な使用例です。
 */
export const IconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">追加</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>新規追加</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// ============================================================================
// 位置のバリエーション
// ============================================================================

/**
 * 上に表示
 */
export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">上</Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>上に表示されます</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 下に表示
 */
export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">下</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>下に表示されます</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 左に表示
 */
export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">左</Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>左に表示されます</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 右に表示
 */
export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">右</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>右に表示されます</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 全方向のツールチップ
 */
export const AllSides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            上
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">上に表示</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            右
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">右に表示</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            下
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">下に表示</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            左
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">左に表示</TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ============================================================================
// 使用例
// ============================================================================

/**
 * ツールバーの例
 *
 * @remarks
 * アイコンボタンが並ぶツールバーでの典型的な使用例です。
 */
export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">追加</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>新規追加</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">設定</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>設定を開く</TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * 長いコンテンツ
 */
export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">詳細情報</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px]">
        <p>
          これは長いツールチップの内容です。複数行にわたる説明を表示できます。
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * ショートカットキー表示
 */
export const WithShortcut: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">保存</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          保存する <kbd className="ml-1 text-xs opacity-60">⌘S</kbd>
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};
