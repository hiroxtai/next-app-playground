import {
  ArrowUpRight,
  Atom,
  Layout,
  Palette,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { CategoryId, PageInfo } from "@/app/_lib/catalog-data";

/** カテゴリごとのアイコンとグラデーション */
const categoryStyles: Record<
  CategoryId,
  { icon: typeof Palette; gradient: string; iconBg: string }
> = {
  "ui-basics": {
    icon: Palette,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  layout: {
    icon: Layout,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  animation: {
    icon: Sparkles,
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  "react-hooks": {
    icon: Atom,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  "next-features": {
    icon: Rocket,
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
};

/** 難易度のスタイル */
const difficultyStyles: Record<
  PageInfo["difficulty"],
  { bg: string; text: string; dot: string }
> = {
  初級: {
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  中級: {
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  上級: {
    bg: "bg-rose-50 dark:bg-rose-950/50",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

/**
 * ページカードコンポーネント
 *
 * @remarks
 * 個別のサンプルページを表示するモダンなカード。
 * カテゴリごとに異なるグラデーションとアイコンを表示します。
 */
export default function PageCard({
  page,
  examplePath,
  index = 0,
}: {
  page: PageInfo;
  examplePath: string;
  /** アニメーション遅延用のインデックス */
  index?: number;
}) {
  const style = categoryStyles[page.category];
  const diffStyle = difficultyStyles[page.difficulty];
  const Icon = style.icon;

  return (
    <Link
      href={examplePath}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-zinc-950/50"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* 上部のグラデーションアクセント */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${style.gradient} opacity-80 transition-opacity group-hover:opacity-100`}
      />

      {/* カード本体 */}
      <div className="flex flex-1 flex-col p-5">
        {/* ヘッダー: アイコン + 難易度 */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.iconBg} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${diffStyle.bg} ${diffStyle.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${diffStyle.dot}`} />
            {page.difficulty}
          </span>
        </div>

        {/* タイトル */}
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {page.title}
        </h3>

        {/* 説明 */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {page.description}
        </p>

        {/* タグ */}
        {page.tags && page.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {page.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
            {page.tags.length > 3 && (
              <span className="px-1 text-xs text-zinc-400 dark:text-zinc-500">
                +{page.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* フッター */}
        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
            詳細を見る
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
