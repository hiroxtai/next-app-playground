import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { PageInfo } from "@/app/_lib/catalog-data";
import { categoryStyles } from "@/app/_lib/category-styles";

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
 * 3D ホバー効果とノイズテクスチャで洗練された印象を与えます。
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
      className="perspective-card animate-fade-in-scale group"
      style={
        {
          "--animation-delay": `${index * 60}ms`,
        } as React.CSSProperties
      }
    >
      <div className="perspective-card-inner relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-200/50 bg-white transition-all duration-300 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 dark:border-brand-800/30 dark:bg-zinc-900 dark:hover:border-brand-700/50 dark:hover:shadow-brand-500/5">
        {/* ノイズテクスチャオーバーレイ */}
        <div
          className="pointer-events-none absolute inset-0 noise-texture opacity-[0.02] mix-blend-overlay"
          aria-hidden="true"
        />

        {/* 上部のグラデーションアクセント */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${style.gradient} opacity-80 transition-opacity group-hover:opacity-100`}
        />

        {/* ホバー時のグロー効果 */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
        </div>

        {/* カード本体 */}
        <div className="relative flex flex-1 flex-col p-5">
          {/* ヘッダー: アイコン + 難易度 */}
          <div className="mb-4 flex items-start justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.iconBg} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
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
          <h3 className="font-display mb-2 text-lg font-semibold text-zinc-900 transition-colors group-hover:text-brand-700 dark:text-zinc-50 dark:group-hover:text-brand-300">
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
                  className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
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
          <div className="mt-auto flex items-center justify-between border-t border-brand-100/50 pt-4 dark:border-brand-800/30">
            <span className="text-sm font-medium text-zinc-500 transition-colors group-hover:text-brand-600 dark:text-zinc-500 dark:group-hover:text-brand-400">
              詳細を見る
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/25 dark:bg-brand-900/50 dark:text-brand-400 dark:group-hover:bg-brand-500">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
