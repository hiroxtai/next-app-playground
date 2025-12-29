/**
 * shadcn/ui Dialog コンポーネントの Story
 *
 * @remarks
 * Dialog はモーダルウィンドウを表示するためのコンポーネントです。
 * ユーザーの注意を引く重要な操作や確認に使用します。
 *
 * @see https://ui.shadcn.com/docs/components/dialog
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";

/**
 * Dialog コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的なバリエーション
// ============================================================================

/**
 * デフォルトのダイアログ
 *
 * @remarks
 * 基本的なダイアログの使用例です。
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タイトル</DialogTitle>
          <DialogDescription>
            これはダイアログの説明文です。重要な情報を伝えるために使用します。
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * フォーム付きダイアログ
 *
 * @remarks
 * ダイアログ内にフォームを含む例です。
 */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>プロフィールを編集</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
          <DialogDescription>
            プロフィール情報を変更します。完了したら保存をクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名前
            </Label>
            <Input id="name" defaultValue="田中 太郎" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              ユーザー名
            </Label>
            <Input
              id="username"
              defaultValue="@tanaka"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * 確認ダイアログ
 *
 * @remarks
 * 削除などの破壊的な操作の確認に使用します。
 */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">アカウントを削除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>本当に削除しますか？</DialogTitle>
          <DialogDescription>
            この操作は取り消せません。アカウントとすべてのデータが完全に削除されます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button variant="destructive">削除する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * 閉じるボタンなし
 *
 * @remarks
 * showCloseButton={false} で閉じるボタンを非表示にできます。
 */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">閉じるボタンなし</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>閉じるボタンなし</DialogTitle>
          <DialogDescription>
            右上の閉じるボタンが非表示になっています。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ============================================================================
// インタラクションテスト
// ============================================================================

/**
 * 開閉テスト
 *
 * @remarks
 * ダイアログの開閉動作をテストします。
 */
export const OpenCloseTest: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-testid="trigger">テスト用ダイアログ</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>テストダイアログ</DialogTitle>
          <DialogDescription>
            このダイアログはインタラクションテスト用です。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button data-testid="close-btn">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("trigger");

    // ダイアログを開く
    await userEvent.click(trigger);

    // ダイアログが表示されていることを確認
    const dialog = await within(document.body).findByRole("dialog");
    await expect(dialog).toBeInTheDocument();
  },
};
