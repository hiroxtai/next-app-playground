import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

/**
 * AppSidebar コンポーネントの Storybook
 *
 * @remarks
 * shadcn/ui の Sidebar コンポーネントを使用したアプリケーションサイドバー。
 * モバイルでは自動的にシートとして表示され、デスクトップでは固定サイドバーになります。
 */
const meta: Meta<typeof AppSidebar> = {
  title: "Components/AppSidebar",
  component: AppSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">
              サイドバーのデモ
            </span>
          </header>
          <main className="flex-1 p-6">
            <div className="rounded-xl border border-dashed border-muted-foreground/25 p-8 text-center">
              <p className="text-muted-foreground">メインコンテンツエリア</p>
              <p className="mt-2 text-sm text-muted-foreground/60">
                左のサイドバーからナビゲーションできます。
                <br />
                サイドバートリガーをクリックして折りたたみを試してください。
              </p>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

/**
 * デフォルト状態（展開）
 *
 * @remarks
 * デスクトップでは常に表示され、キーボードショートカット `b` で折りたたみ可能。
 */
export const Default: Story = {};

/**
 * ダークモード
 *
 * @remarks
 * ダークモードでのサイドバー表示を確認できます。
 * Storybook のテーマ切り替えでダークモードに変更してください。
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};
