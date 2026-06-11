/**
 * PendulumControls コンポーネントの Story
 *
 * @remarks
 * 二重振り子デモの操作パネルです。再生状態（idle / running / paused）に
 * 応じてボタンの表示が切り替わり、running 中はパラメータ変更が
 * リセット時に適用される旨の注記が表示されます。
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { DEFAULT_PARAMS } from "../_lib/constants";
import { PendulumControls } from "./pendulum-controls";

/**
 * PendulumControls コンポーネントのメタデータ
 */
const meta = {
  title: "Examples/Simulation/PendulumControls",
  component: PendulumControls,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    params: DEFAULT_PARAMS,
    onParamsChange: fn(),
    onStart: fn(),
    onPause: fn(),
    onReset: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PendulumControls>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 再生状態ごとのバリエーション
// ============================================================================

/**
 * 初期状態（idle）
 *
 * @remarks
 * 「開始」ボタンが表示され、注記は表示されません。
 */
export const Idle: Story = {
  args: {
    status: "idle",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "開始" }),
    ).toBeInTheDocument();
    await expect(
      canvas.queryByText("パラメータの変更はリセット時に適用されます"),
    ).not.toBeInTheDocument();
  },
};

/**
 * 再生中（running）
 *
 * @remarks
 * 「一時停止」ボタンと、パラメータ変更がリセット時に適用される旨の
 * 注記が表示されます。
 */
export const Running: Story = {
  args: {
    status: "running",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "一時停止" }),
    ).toBeInTheDocument();
    // 再生中はパラメータが即時反映されないことをユーザーに伝える注記
    await expect(
      canvas.getByText("パラメータの変更はリセット時に適用されます"),
    ).toBeInTheDocument();
  },
};

/**
 * 一時停止中（paused）
 *
 * @remarks
 * 「再開」ボタンが表示されます。
 */
export const Paused: Story = {
  args: {
    status: "paused",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "再開" }),
    ).toBeInTheDocument();
  },
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * ボタン操作でコールバックが呼ばれる
 */
export const ButtonInteractions: Story = {
  args: {
    status: "idle",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "開始" }));
    await expect(args.onStart).toHaveBeenCalledOnce();

    await userEvent.click(canvas.getByRole("button", { name: "リセット" }));
    await expect(args.onReset).toHaveBeenCalledOnce();
  },
};

/**
 * スライダーがキーボードで操作できる
 *
 * @remarks
 * Radix Slider は矢印キーで step ぶんだけ値を変更できます。
 * アクセシビリティ（キーボード操作）の検証を兼ねています。
 */
export const SliderKeyboardInteraction: Story = {
  args: {
    status: "idle",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "節 1 の長さ" });

    slider.focus();
    await userEvent.keyboard("{ArrowRight}");

    // step (0.1m) だけ増えた値でコールバックが呼ばれる
    await expect(args.onParamsChange).toHaveBeenCalledWith({
      ...DEFAULT_PARAMS,
      length1: DEFAULT_PARAMS.length1 + 0.1,
    });
  },
};
