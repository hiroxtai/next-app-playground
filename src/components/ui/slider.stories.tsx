/**
 * shadcn/ui Slider コンポーネントの Story
 *
 * @remarks
 * Slider は範囲内の数値を選択するためのコンポーネントです。
 * 音量調整やパラメータ設定など、連続値の入力に使用します。
 *
 * @see https://ui.shadcn.com/docs/components/slider
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import { Slider } from "./slider";

/**
 * Slider コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "スライダーの無効状態",
    },
    min: {
      control: { type: "number" },
      description: "最小値",
    },
    max: {
      control: { type: "number" },
      description: "最大値",
    },
    step: {
      control: { type: "number" },
      description: "刻み幅",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのスライダー
 */
export const Default: Story = {
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
  },
};

/**
 * 刻み幅を指定したスライダー
 *
 * @remarks
 * step を大きくすると、決まった間隔の値だけを選択できます。
 */
export const WithStep: Story = {
  args: {
    defaultValue: [0.5],
    min: 0.5,
    max: 2.0,
    step: 0.1,
  },
};

/**
 * 無効状態のスライダー
 */
export const Disabled: Story = {
  args: {
    defaultValue: [30],
    disabled: true,
  },
};

/**
 * ラベル付きスライダー
 *
 * @remarks
 * パラメータ調整 UI での典型的な使い方です。
 */
export const WithLabel: Story = {
  args: {
    defaultValue: [120],
    min: -180,
    max: 180,
    step: 1,
  },
  render: (args) => (
    <div className="grid w-80 gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="angle-slider">開始角度</Label>
        <span className="text-sm text-muted-foreground">120°</span>
      </div>
      <Slider id="angle-slider" {...args} />
    </div>
  ),
};
