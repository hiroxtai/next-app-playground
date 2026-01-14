import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppBreadcrumb } from "./app-breadcrumb";

/**
 * AppBreadcrumb コンポーネントの Storybook
 *
 * @remarks
 * 共通パンくずリストコンポーネントの各バリエーションを表示します。
 * BreadcrumbLink のスタイル（`text-muted-foreground hover:text-foreground`）が
 * 統一されていることを確認できます。
 */
const meta: Meta<typeof AppBreadcrumb> = {
  title: "Components/AppBreadcrumb",
  component: AppBreadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    items: {
      description: "パンくずアイテムの配列",
      control: "object",
    },
    className: {
      description: "追加のクラス名",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppBreadcrumb>;

/**
 * 基本的なパンくずリスト（2階層）
 */
export const Default: Story = {
  args: {
    items: [{ label: "ホーム", href: "/" }, { label: "カタログ" }],
  },
};

/**
 * 3階層のパンくずリスト
 */
export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "ホーム", href: "/" },
      { label: "カタログ", href: "/catalog" },
      { label: "UI基礎" },
    ],
  },
};

/**
 * 4階層のパンくずリスト（深い階層）
 */
export const DeepHierarchy: Story = {
  args: {
    items: [
      { label: "ホーム", href: "/" },
      { label: "カタログ", href: "/catalog" },
      { label: "React Hooks", href: "/catalog/category/react-hooks" },
      { label: "useState カウンター" },
    ],
  },
};

/**
 * 単一アイテム（現在のページのみ）
 */
export const SingleItem: Story = {
  args: {
    items: [{ label: "ホーム" }],
  },
};

/**
 * カスタムクラス付き
 */
export const WithCustomClass: Story = {
  args: {
    items: [{ label: "ホーム", href: "/" }, { label: "設定" }],
    className: "bg-muted/50 p-4 rounded-lg",
  },
};
