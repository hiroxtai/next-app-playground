/**
 * shadcn/ui Tabs コンポーネントの Story
 *
 * @remarks
 * Tabs はコンテンツを複数のセクションに分けて表示するコンポーネントです。
 * ユーザーはタブをクリックして表示するセクションを切り替えられます。
 *
 * @see https://ui.shadcn.com/docs/components/tabs
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

/**
 * Tabs コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのタブ
 *
 * @remarks
 * 基本的なタブの使用例です。
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="password">パスワード</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          アカウント設定を変更できます。
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          パスワードを変更できます。
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * カード付きタブ
 *
 * @remarks
 * タブコンテンツにカードを含む例です。
 */
export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="password">パスワード</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>アカウント</CardTitle>
            <CardDescription>
              アカウント情報を変更します。保存をクリックして適用してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">名前</Label>
              <Input id="name" defaultValue="田中 太郎" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">ユーザー名</Label>
              <Input id="username" defaultValue="@tanaka" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>保存</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>パスワード</CardTitle>
            <CardDescription>
              パスワードを変更します。変更後は再ログインが必要です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">現在のパスワード</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">新しいパスワード</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>パスワードを変更</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * 複数タブ
 */
export const MultipleTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="analytics">分析</TabsTrigger>
        <TabsTrigger value="reports">レポート</TabsTrigger>
        <TabsTrigger value="notifications">通知</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4">
        <h3 className="font-medium">概要</h3>
        <p className="text-sm text-muted-foreground">
          プロジェクトの全体的な状況を確認できます。
        </p>
      </TabsContent>
      <TabsContent value="analytics" className="p-4">
        <h3 className="font-medium">分析</h3>
        <p className="text-sm text-muted-foreground">
          詳細な分析データを確認できます。
        </p>
      </TabsContent>
      <TabsContent value="reports" className="p-4">
        <h3 className="font-medium">レポート</h3>
        <p className="text-sm text-muted-foreground">
          生成されたレポートを確認・ダウンロードできます。
        </p>
      </TabsContent>
      <TabsContent value="notifications" className="p-4">
        <h3 className="font-medium">通知</h3>
        <p className="text-sm text-muted-foreground">
          通知設定を管理できます。
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * 無効なタブ
 */
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">アクティブ</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          無効（準備中）
        </TabsTrigger>
        <TabsTrigger value="other">その他</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-4">
        <p className="text-sm text-muted-foreground">
          このタブはアクティブです。
        </p>
      </TabsContent>
      <TabsContent value="other" className="p-4">
        <p className="text-sm text-muted-foreground">
          その他のコンテンツです。
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * タブ切替テスト
 *
 * @remarks
 * タブをクリックしたときにコンテンツが切り替わることを確認します。
 */
export const TabSwitchTest: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">タブ 1</TabsTrigger>
        <TabsTrigger value="tab2">タブ 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p data-testid="content1">タブ 1 のコンテンツ</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p data-testid="content2">タブ 2 のコンテンツ</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態ではタブ 1 が表示
    await expect(canvas.getByTestId("content1")).toBeVisible();

    // タブ 2 をクリック
    const tab2 = canvas.getByRole("tab", { name: "タブ 2" });
    await userEvent.click(tab2);

    // タブ 2 のコンテンツが表示される
    await expect(canvas.getByTestId("content2")).toBeVisible();
  },
};
