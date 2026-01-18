import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * カタログレイアウト
 *
 * @remarks
 * shadcn/ui の SidebarProvider を使用した2カラムレイアウト。
 * モバイルではシートとして表示され、デスクトップでは固定サイドバーになります。
 * ヘッダーに SidebarTrigger を配置し、折りたたみが可能です。
 */
export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* サイドバー */}
      <AppSidebar />

      {/* メインコンテンツエリア */}
      <SidebarInset>
        {/* ヘッダー: サイドバートグルとセパレーター */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">カタログ</span>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
