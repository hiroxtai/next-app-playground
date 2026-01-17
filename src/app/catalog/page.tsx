import { BookOpen, Layers, Sparkles } from "lucide-react";
import { categories, pages } from "@/app/_lib/catalog-data";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { PageCard } from "./_components";

/**
 * カタログトップページ
 *
 * @remarks
 * すべてのサンプルページをカードグリッド形式で表示します。
 * パンくずリストで現在の位置を示し、ユーザーのナビゲーションを支援します。
 */
export default function CatalogPage() {
  // 統計情報
  const stats = [
    {
      label: "ページ数",
      value: pages.length,
      icon: BookOpen,
    },
    {
      label: "カテゴリ",
      value: categories.length,
      icon: Layers,
    },
    {
      label: "初級",
      value: pages.filter((p) => p.difficulty === "初級").length,
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden border-b border-brand-200/50 bg-brand-50 dark:border-brand-800/30 dark:bg-brand-950">
        {/* ノイズテクスチャオーバーレイ */}
        <div
          className="pointer-events-none absolute inset-0 noise-texture opacity-[0.03] mix-blend-overlay"
          aria-hidden="true"
        />

        {/* 装飾的な背景パターン（グリッド） */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.7_0.14_182/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.7_0.14_182/0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
          {/* パンくずリスト */}
          <AppBreadcrumb
            items={[{ label: "ホーム", href: "/" }, { label: "カタログ" }]}
            className="mb-6"
          />

          {/* タイトル */}
          <div className="max-w-2xl space-y-4">
            <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              ページ
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-200">
                カタログ
              </span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
              Next.js と React の学習用サンプルページ一覧。
              <br className="hidden sm:inline" />
              カテゴリから探すか、下記一覧からページを選択してください。
            </p>
          </div>

          {/* 統計カード */}
          <div className="mt-10 flex flex-wrap gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl border border-brand-200/30 bg-white/90 px-5 py-3 dark:border-brand-700/30 dark:bg-zinc-900/90"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 px-6 py-10 sm:px-8 sm:py-12">
        {/* カードグリッド */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {pages.map((page, index) => (
            <PageCard
              key={page.id}
              page={page}
              examplePath={`/examples/${page.category}/${page.id}`}
              index={index}
            />
          ))}
        </div>

        {/* ページが存在しない場合の表示 */}
        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-16 text-center dark:border-brand-800 dark:bg-brand-900/50">
            <div className="mb-4 rounded-full bg-brand-100 p-4 dark:bg-brand-800">
              <BookOpen className="h-8 w-8 text-brand-500" />
            </div>
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
              サンプルページはまだありません
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
              新しいページを追加してみましょう
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
