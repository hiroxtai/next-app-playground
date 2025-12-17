import { pages } from "@/app/_lib/catalog-data";
import { PageCard } from "./_components";

/**
 * カタログトップページ
 * すべてのサンプルページをカードグリッド形式で表示します。
 */
export default function CatalogPage() {
  return (
    <div className="p-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          ページカタログ
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          学習用サンプルページ一覧です。カテゴリから探すか、下記一覧からページを選択してください。
        </p>
      </div>

      {/* カードグリッド */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            examplePath={`/examples/${page.category}/${page.id}`}
          />
        ))}
      </div>

      {/* ページが存在しない場合の表示 */}
      {pages.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            サンプルページはまだありません。
          </p>
        </div>
      )}
    </div>
  );
}
