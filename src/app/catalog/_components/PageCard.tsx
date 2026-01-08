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
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* プレースホルダーサムネイル */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-5xl opacity-80 transition-transform duration-200 group-hover:scale-110">
            {page.category === "ui-basics" && "🎨"}
            {page.category === "layout" && "📐"}
            {page.category === "animation" && "✨"}
            {page.category === "react-hooks" && "⚛️"}
            {page.category === "next-features" && "🚀"}
          </div>
        </div>
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-black/30" />
      </div>

      {/* カード本体 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="flex-1 text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            {page.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColor[page.difficulty]}`}
          >
            {page.difficulty}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {page.description}
        </p>

        {/* タグ */}
        {page.tags && page.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {page.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
              >
                {tag}
              </span>
            ))}
            {page.tags.length > 3 && (
              <span className="inline-flex items-center text-xs text-zinc-500 dark:text-zinc-500">
                +{page.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* フッター */}
        <div className="mt-auto pt-4">
          <Link
            href={examplePath}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <span>ページを開く</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
