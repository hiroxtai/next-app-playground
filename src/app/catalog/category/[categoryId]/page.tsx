import { BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import { categories, getPagesByCategory } from "@/app/_lib/catalog-data";
import { categoryStyles } from "@/app/_lib/category-styles";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { PageCard } from "../../_components";

/**
 * カテゴリフィルタページ
 *
 * @remarks
 * 指定したカテゴリのページのみをフィルタして表示します。
 * パンくずリストでカタログ → カテゴリの階層を明示し、
 * ユーザーが現在どのカテゴリを閲覧しているか分かりやすくします。
 */
export default function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  // 非同期のpramsを処理（Next.js 15+）
  const { categoryId } = use(params);

  // カテゴリ情報を取得
  const category = categories.find((cat) => cat.id === categoryId);

  // カテゴリが見つからない場合は404
  if (!category) {
    notFound();
  }

  // カテゴリに属するページを取得
  // category.id は CategoryId 型として安全に使用可能
  const pagesByCategory = getPagesByCategory(category.id);
  const style = categoryStyles[category.id];
  const Icon = style.icon;

  return (
    <div className="flex flex-col">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden border-b border-brand-200/50 bg-gradient-to-br from-brand-50 via-white to-brand-100/50 dark:border-brand-800/30 dark:from-brand-950 dark:via-zinc-900 dark:to-brand-900/20">
        {/* ノイズテクスチャオーバーレイ */}
        <div
          className="pointer-events-none absolute inset-0 noise-texture opacity-[0.03] mix-blend-overlay"
          aria-hidden="true"
        />

        {/* 装飾的な背景パターン */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.7_0.14_182/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.7_0.14_182/0.08)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* 装飾的なグラデーションオーブ */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-brand-400/20 to-brand-600/10 blur-3xl" />

        <div className="relative px-6 py-12 sm:px-8 sm:py-16">
          {/* パンくずリスト */}
          <AppBreadcrumb
            items={[
              { label: "ホーム", href: "/" },
              { label: "カタログ", href: "/catalog" },
              { label: category.label },
            ]}
            className="mb-6"
          />

          {/* タイトル */}
          <div className="flex items-center gap-4">
            <div
              className={`flex size-14 items-center justify-center rounded-2xl ${style.gradient} text-white shadow-lg shadow-brand-500/20`}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                {category.label}
              </h1>
              <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
                {category.description}
              </p>
            </div>
          </div>

          {/* ページ数バッジ */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-200/30 bg-white/80 px-4 py-2 dark:bg-zinc-900/80">
            <BookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {pagesByCategory.length} ページ
            </span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 px-6 py-10 sm:px-8 sm:py-12">
        {/* カードグリッド */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {pagesByCategory.map((page, index) => (
            <PageCard
              key={page.id}
              page={page}
              examplePath={`/examples/${page.category}/${page.id}`}
              index={index}
            />
          ))}
        </div>

        {/* ページが存在しない場合の表示 */}
        {pagesByCategory.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-16 text-center dark:border-brand-800 dark:bg-brand-900/50">
            <div className="mb-4 rounded-full bg-brand-100 p-4 dark:bg-brand-800">
              <BookOpen className="h-8 w-8 text-brand-500" />
            </div>
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
              このカテゴリにはまだページがありません
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
