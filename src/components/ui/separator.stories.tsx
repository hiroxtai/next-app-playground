/**
 * shadcn/ui Separator コンポーネントの Story
 *
 * @remarks
 * Separator はコンテンツを視覚的に区切るためのコンポーネントです。
 * 水平方向と垂直方向の両方に対応しています。
 *
 * @see https://ui.shadcn.com/docs/components/separator
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";

/**
 * Separator コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "セパレーターの向き",
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * 水平セパレーター（デフォルト）
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          オープンソースの UI コンポーネントライブラリ
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>ブログ</div>
        <Separator orientation="vertical" />
        <div>ドキュメント</div>
        <Separator orientation="vertical" />
        <div>ソース</div>
      </div>
    </div>
  ),
};

/**
 * 垂直セパレーター
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>ホーム</div>
      <Separator orientation="vertical" />
      <div>製品</div>
      <Separator orientation="vertical" />
      <div>会社情報</div>
      <Separator orientation="vertical" />
      <div>お問い合わせ</div>
    </div>
  ),
};

// ============================================================================
// 使用例
// ============================================================================

/**
 * リスト内のセパレーター
 */
export const InList: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="py-2">
        <h4 className="font-medium">アカウント</h4>
        <p className="text-sm text-muted-foreground">アカウント設定を管理</p>
      </div>
      <Separator />
      <div className="py-2">
        <h4 className="font-medium">通知</h4>
        <p className="text-sm text-muted-foreground">通知設定を管理</p>
      </div>
      <Separator />
      <div className="py-2">
        <h4 className="font-medium">セキュリティ</h4>
        <p className="text-sm text-muted-foreground">セキュリティ設定を管理</p>
      </div>
    </div>
  ),
};

/**
 * ナビゲーション内のセパレーター
 */
export const InNavigation: Story = {
  render: () => (
    <nav className="flex items-center space-x-2 text-sm">
      <span className="cursor-pointer text-foreground hover:underline">
        ダッシュボード
      </span>
      <Separator orientation="vertical" className="h-4" />
      <span className="cursor-pointer text-muted-foreground hover:text-foreground">
        プロジェクト
      </span>
      <Separator orientation="vertical" className="h-4" />
      <span className="cursor-pointer text-muted-foreground hover:text-foreground">
        設定
      </span>
    </nav>
  ),
};

/**
 * カスタムスタイル
 */
export const CustomStyle: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">デフォルト</p>
        <Separator className="my-2" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">太い線</p>
        <Separator className="my-2 h-[2px]" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">破線風</p>
        <Separator className="my-2 bg-transparent border-t border-dashed border-border" />
      </div>
    </div>
  ),
};
