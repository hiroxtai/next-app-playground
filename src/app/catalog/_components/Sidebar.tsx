"use client";

import Link from "next/link";
import { categories } from "@/app/_lib/catalog-data";

/**
 * カタログのサイドバーナビゲーションコンポーネント
 * カテゴリ一覧を表示し、ユーザーがカテゴリでフィルタできます。
 */
export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          カテゴリ
        </h2>
      </div>

      {/* カテゴリリスト */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {/* 全て表示リンク */}
          <li>
            <Link
              href="/catalog"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              すべてのページ
            </Link>
          </li>

          {/* カテゴリリンク */}
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/catalog/category/${category.id}`}
                className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                title={category.description}
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* フッター（オプション） */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          学習用サンプルページカタログ
        </p>
      </div>
    </aside>
  );
}
