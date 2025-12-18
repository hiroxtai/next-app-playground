import { notFound } from "next/navigation";
import { use } from "react";
import { categories, getPagesByCategory } from "@/app/_lib/catalog-data";
import { PageCard } from "../../_components";

/**
 * カテゴリフィルタページ
 * 指定したカテゴリのページのみをフィルタして表示します。
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

  return (
    <div className="p-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {category.label}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {category.description}
        </p>
      </div>

      {/* カードグリッド */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pagesByCategory.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            examplePath={`/examples/${page.category}/${page.id}`}
          />
        ))}
      </div>

      {/* ページが存在しない場合の表示 */}
      {pagesByCategory.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            このカテゴリにはまだページがありません。
          </p>
        </div>
      )}
    </div>
  );
}
