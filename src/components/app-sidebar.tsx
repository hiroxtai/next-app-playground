"use client";

import { ChevronRight, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/app/_lib/catalog-data";
import { categoryStyles } from "@/app/_lib/category-styles";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "./ui/sidebar";

/**
 * アプリケーション共通サイドバーコンポーネント
 *
 * @remarks
 * shadcn/ui の Sidebar コンポーネントを使用した公式パターンに準拠。
 * モバイルでは自動的にシートとして表示され、デスクトップでは固定サイドバーになります。
 * ThemeToggle をフッターに配置し、ダークモード切り替えが可能です。
 */
export function AppSidebar() {
  const pathname = usePathname();
  const isAllActive = pathname === "/catalog";

  return (
    <Sidebar>
      {/* ヘッダー: ロゴとタイトル */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/25">
            <Library className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Playground</h2>
            <p className="text-xs text-muted-foreground">Next.js 学習サイト</p>
          </div>
        </Link>
      </SidebarHeader>

      {/* メインコンテンツ: ナビゲーションメニュー */}
      <SidebarContent>
        {/* メインナビゲーション */}
        <SidebarGroup>
          <SidebarGroupLabel>ナビゲーション</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* ホームリンク */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Library className="size-4" />
                    <span>ホーム</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* すべてのページリンク */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isAllActive}>
                  <Link href="/catalog">
                    <Library className="size-4" />
                    <span>すべてのページ</span>
                    {isAllActive && <ChevronRight className="ml-auto size-4" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* カテゴリナビゲーション */}
        <SidebarGroup>
          <SidebarGroupLabel>カテゴリ</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const style = categoryStyles[category.id];
                const Icon = style.icon;
                const isActive =
                  pathname === `/catalog/category/${category.id}`;

                return (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={category.description}
                    >
                      <Link href={`/catalog/category/${category.id}`}>
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-md transition-colors",
                            isActive
                              ? `${style.iconBg} text-white`
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="size-3.5" />
                        </div>
                        <span>{category.label}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto size-4" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* フッター: 学習ヒントとテーマ切り替え */}
      <SidebarFooter className="border-t border-sidebar-border">
        {/* 学習のヒント */}
        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-3 dark:from-violet-500/20 dark:to-indigo-500/20">
          <p className="text-xs font-medium">💡 学習のヒント</p>
          <p className="mt-1 text-xs text-muted-foreground">
            初級から順番に進めると効果的です
          </p>
        </div>

        {/* テーマ切り替え */}
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-sm text-muted-foreground">テーマ</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>

      {/* サイドバーレール（折りたたみ操作用） */}
      <SidebarRail />
    </Sidebar>
  );
}
