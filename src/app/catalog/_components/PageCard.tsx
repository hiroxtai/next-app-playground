import Link from "next/link";
import type { PageInfo } from "@/app/_lib/catalog-data";

/**
 * ページカードコンポーネント
 * 個別のサンプルページを表示するカード。
 * Atomic Design でいう molecules レベルのコンポーネント。
 */
export default function PageCard({
  page,
  examplePath,
}: {
  page: PageInfo;
  examplePath: string;
}) {
  const difficultyColor: Record<PageInfo["difficulty"], string> = {
    初級: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    中級: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    上級: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600">
      {/* プレースホルダーサムネイル */}
      <div className="h-32 bg-gradient-to-br from-zinc-100 to-zinc-800 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center">
        <div className="text-3xl text-zinc-400 dark:text-zinc-500">
          {page.category === "ui-basics" && "🎨"}
          {page.category === "layout" && "📐"}
          {page.category === "animation" && "✨"}
          {page.category === "react-hooks" && "⚛️"}
          {page.category === "next-features" && "🚀"}
        </div>
      </div>

      {/* カード本体 */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          {page.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {page.description}
        </p>

        {/* タグ */}
        {page.tags && page.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {page.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* フッター */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${difficultyColor[page.difficulty]}`}
          >
            {page.difficulty}
          </span>
          <Link
            href={examplePath}
            className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            開く
          </Link>
        </div>
      </div>
    </div>
  );
}
