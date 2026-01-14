"use client";

import {
  Atom,
  ChevronRight,
  Layout,
  Library,
  Palette,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryId } from "@/app/_lib/catalog-data";
import { categories } from "@/app/_lib/catalog-data";
import { cn } from "@/lib/utils";

/** カテゴリごとのアイコン */
const categoryIcons: Record<CategoryId, typeof Palette> = {
  "ui-basics": Palette,
  layout: Layout,
  animation: Sparkles,
  "react-hooks": Atom,
  "next-features": Rocket,
};

/**
 * カタログのサイドバーナビゲーションコンポーネント
 *
 * @remarks
 * カテゴリ一覧を表示し、ユーザーがカテゴリでフィルタできます。
 * 現在のパスに基づいてアクティブ状態を表示します。
 */
export default function Sidebar() {
  const pathname = usePathname();
  const isAllActive = pathname === "/catalog";

  return (
    <aside className="flex w-72 flex-col border-r border-zinc-200/80 bg-zinc-50/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 border-b border-zinc-200/80 bg-zinc-50/80 p-6 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              カテゴリ
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {categories.length} カテゴリ
            </p>
          </div>
        </div>
      </div>

      {/* カテゴリリスト */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {/* 全て表示リンク */}
          <li>
            <Link
              href="/catalog"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isAllActive
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  isAllActive
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-600",
                )}
              >
                <Library className="h-4 w-4" />
              </div>
              <span className="flex-1">すべてのページ</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isAllActive
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-50",
                )}
              />
            </Link>
          </li>

          {/* セパレーター */}
          <li className="py-2">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
          </li>

          {/* カテゴリリンク */}
          {categories.map((category) => {
            const Icon = categoryIcons[category.id];
            const isActive = pathname === `/catalog/category/${category.id}`;

            return (
              <li key={category.id}>
                <Link
                  href={`/catalog/category/${category.id}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-white hover:text-zinc-900 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                  )}
                  title={category.description}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                        : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400 dark:group-hover:bg-zinc-600",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{category.label}</span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* フッター */}
      <div className="border-t border-zinc-200/80 p-4 dark:border-zinc-800/80">
        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4 dark:from-violet-500/20 dark:to-indigo-500/20">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            💡 学習のヒント
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            初級から順番に進めると効果的です
          </p>
        </div>
      </div>
    </aside>
  );
}
