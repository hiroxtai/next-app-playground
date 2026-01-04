/**
 * shadcn/ui Select コンポーネントの Story
 *
 * @remarks
 * Select はドロップダウンから選択肢を選ぶためのコンポーネントです。
 * ネイティブの select 要素よりも高度なカスタマイズが可能です。
 *
 * @see https://ui.shadcn.com/docs/components/select
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * Select コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのセレクト
 *
 * @remarks
 * 基本的な Select コンポーネントの使用例です。
 */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="テーマを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">ライト</SelectItem>
        <SelectItem value="dark">ダーク</SelectItem>
        <SelectItem value="system">システム</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * デフォルト値あり
 */
export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="dark">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="テーマを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">ライト</SelectItem>
        <SelectItem value="dark">ダーク</SelectItem>
        <SelectItem value="system">システム</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * グループ付きセレクト
 *
 * @remarks
 * SelectGroup と SelectLabel で選択肢をグループ化できます。
 */
export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="タイムゾーンを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>アジア</SelectLabel>
          <SelectItem value="asia/tokyo">東京</SelectItem>
          <SelectItem value="asia/seoul">ソウル</SelectItem>
          <SelectItem value="asia/shanghai">上海</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>ヨーロッパ</SelectLabel>
          <SelectItem value="europe/london">ロンドン</SelectItem>
          <SelectItem value="europe/paris">パリ</SelectItem>
          <SelectItem value="europe/berlin">ベルリン</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>アメリカ</SelectLabel>
          <SelectItem value="america/new_york">ニューヨーク</SelectItem>
          <SelectItem value="america/los_angeles">ロサンゼルス</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * 無効な選択肢
 */
export const WithDisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="プランを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">無料プラン</SelectItem>
        <SelectItem value="pro">プロプラン</SelectItem>
        <SelectItem value="enterprise" disabled>
          エンタープライズ（準備中）
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="選択不可" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">オプション 1</SelectItem>
        <SelectItem value="option2">オプション 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================================================
// サイズバリエーション
// ============================================================================

/**
 * サイズバリエーション
 *
 * @remarks
 * SelectTrigger の size prop でサイズを変更できます。
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Small</span>
        <Select>
          <SelectTrigger size="sm" className="w-[180px]">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">オプション 1</SelectItem>
            <SelectItem value="option2">オプション 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-muted-foreground">Default</span>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">オプション 1</SelectItem>
            <SelectItem value="option2">オプション 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// ============================================================================
// フォーム例
// ============================================================================

/**
 * ラベル付きセレクト
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="country">国</Label>
      <Select>
        <SelectTrigger id="country">
          <SelectValue placeholder="国を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jp">日本</SelectItem>
          <SelectItem value="us">アメリカ</SelectItem>
          <SelectItem value="uk">イギリス</SelectItem>
          <SelectItem value="de">ドイツ</SelectItem>
          <SelectItem value="fr">フランス</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * フォームの例
 */
export const FormExample: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="framework">フレームワーク</Label>
        <Select>
          <SelectTrigger id="framework">
            <SelectValue placeholder="フレームワークを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nextjs">Next.js</SelectItem>
            <SelectItem value="remix">Remix</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="language">言語</Label>
        <Select defaultValue="typescript">
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
