/**
 * shadcn/ui Label コンポーネントの Story
 *
 * @remarks
 * Label はフォーム要素に関連付けるラベルコンポーネントです。
 * アクセシビリティを向上させるために使用します。
 *
 * @see https://ui.shadcn.com/docs/components/label
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";

/**
 * Label コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのラベル
 */
export const Default: Story = {
  args: {
    children: "ラベル",
  },
};

/**
 * Input と組み合わせ
 *
 * @remarks
 * htmlFor 属性で Input と関連付けます。
 */
export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">メールアドレス</Label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
  ),
};

/**
 * Checkbox と組み合わせ
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">利用規約に同意する</Label>
    </div>
  ),
};

/**
 * Switch と組み合わせ
 */
export const WithSwitch: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">機内モード</Label>
    </div>
  ),
};

// ============================================================================
// 状態
// ============================================================================

/**
 * 無効状態のラベル
 *
 * @remarks
 * 関連するフォーム要素が無効な場合、ラベルも半透明になります。
 */
export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled-input" className="opacity-50">
        無効な入力
      </Label>
      <Input type="text" id="disabled-input" disabled placeholder="入力不可" />
    </div>
  ),
};

/**
 * 必須フィールドのラベル
 */
export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required-input">
        名前 <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="required-input" placeholder="必須項目" />
    </div>
  ),
};

// ============================================================================
// フォーム例
// ============================================================================

/**
 * フォームの例
 *
 * @remarks
 * 複数のフォーム要素とラベルを組み合わせた例です。
 */
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">
          名前 <span className="text-destructive">*</span>
        </Label>
        <Input type="text" id="name" placeholder="田中 太郎" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email2">
          メールアドレス <span className="text-destructive">*</span>
        </Label>
        <Input type="email" id="email2" placeholder="tanaka@example.com" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="subscribe" />
        <Label htmlFor="subscribe">ニュースレターを購読する</Label>
      </div>
    </div>
  ),
};
