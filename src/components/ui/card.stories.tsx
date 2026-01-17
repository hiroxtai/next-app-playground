/**
 * shadcn/ui Card コンポーネントの Story
 *
 * @remarks
 * Card は情報をグループ化して表示するためのコンテナコンポーネントです。
 *
 * ## 新デザインシステム
 *
 * Card は以下の新デザイン要素を取り入れています：
 * - **Brand ボーダー**: Teal 系のブランドカラーを使用したボーダー
 * - **ホバー効果**: ホバー時にボーダーとシャドウが変化
 * - **ダークモード対応**: ダークモードで最適化されたカラー
 *
 * 構成要素:
 * - Card: メインのコンテナ
 * - CardHeader: タイトルと説明を含むヘッダー
 * - CardTitle: カードのタイトル
 * - CardDescription: カードの説明文
 * - CardContent: メインコンテンツ
 * - CardFooter: アクションボタンなどを配置するフッター
 *
 * @see https://ui.shadcn.com/docs/components/card
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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

/**
 * Card コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的な使用例
// ============================================================================

/**
 * デフォルトのカード
 *
 * @remarks
 * すべての構成要素を使用した基本的なカードの例です。
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>
          カードの説明文がここに入ります。簡潔に内容を説明しましょう。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>ここにメインコンテンツが入ります。</p>
      </CardContent>
      <CardFooter>
        <Button>アクション</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * フォームを含むカード
 *
 * @remarks
 * ログインフォームなど、入力フォームを含むカードの例です。
 */
export const WithForm: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>アカウント作成</CardTitle>
        <CardDescription>
          新しいアカウントを作成するには、以下の情報を入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">名前</Label>
              <Input id="name" placeholder="山田 太郎" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" placeholder="example@email.com" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">キャンセル</Button>
        <Button>作成</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * シンプルなカード
 *
 * @remarks
 * ヘッダーとコンテンツのみのシンプルなカードです。
 */
export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>お知らせ</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          システムメンテナンスのため、明日 10:00-12:00
          の間サービスを一時停止します。
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * 複数のアクションを持つカード
 *
 * @remarks
 * フッターに複数のボタンを配置した例です。
 */
export const MultipleActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>確認</CardTitle>
        <CardDescription>この操作を実行しますか？</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">この操作は取り消すことができません。</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost">キャンセル</Button>
        <Button variant="destructive">削除</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * 画像付きカード
 *
 * @remarks
 * 画像コンテンツを含むカードの例です。
 * 新しいブランドカラーのグラデーションを使用しています。
 */
export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-brand-400/30 to-brand-600/10" />
      <CardHeader>
        <CardTitle>美しい風景</CardTitle>
        <CardDescription>山と湖の素晴らしい景色</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          この写真は北海道で撮影されました。
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="brand-outline" className="w-full">
          詳細を見る
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================================================
// Brand バリエーション
// ============================================================================

/**
 * Brand カードの例
 *
 * @remarks
 * ブランドカラーを活用したカードのバリエーションです。
 */
export const BrandCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-brand-700 dark:text-brand-300">
          新機能のお知らせ
        </CardTitle>
        <CardDescription>
          新しいデザインシステムが導入されました。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Teal 系のブランドカラー
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Space Grotesk フォント
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            ノイズテクスチャ
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="brand" className="flex-1">
          詳細を見る
        </Button>
        <Button variant="brand-ghost">後で</Button>
      </CardFooter>
    </Card>
  ),
};
