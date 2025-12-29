/**
 * shadcn/ui Alert コンポーネントの Story
 *
 * @remarks
 * Alert は重要な情報をユーザーに伝えるためのコンポーネントです。
 * デフォルトと destructive の 2 つのバリアントがあります。
 *
 * @see https://ui.shadcn.com/docs/components/alert
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircle, Info, Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

/**
 * Alert コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive"],
      description: "アラートのスタイルバリアント",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのアラート
 *
 * @remarks
 * 一般的な情報を伝えるために使用します。
 */
export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>お知らせ</AlertTitle>
      <AlertDescription>
        このコマンドを実行して依存関係をインストールしてください。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive バリアント
 *
 * @remarks
 * エラーや警告など、注意が必要な情報を伝えるために使用します。
 */
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>エラー</AlertTitle>
      <AlertDescription>
        セッションの有効期限が切れました。もう一度ログインしてください。
      </AlertDescription>
    </Alert>
  ),
};

// ============================================================================
// その他のパターン
// ============================================================================

/**
 * アイコンなしのアラート
 */
export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>注意</AlertTitle>
      <AlertDescription>
        アイコンなしでもアラートを使用できます。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * タイトルのみのアラート
 */
export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>簡潔なお知らせです。</AlertTitle>
    </Alert>
  ),
};

/**
 * 説明のみのアラート
 */
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        タイトルなしで説明文のみを表示することもできます。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * すべてのバリアントを一覧表示
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>デフォルトのアラートスタイル</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>警告・エラー用のアラートスタイル</AlertDescription>
      </Alert>
    </div>
  ),
};
