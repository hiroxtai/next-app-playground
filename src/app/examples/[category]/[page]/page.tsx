import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getPageById, pages } from "@/app/_lib/catalog-data";

type ExamplePageParams = {
  category: string;
  page: string;
};

export function generateStaticParams(): ExamplePageParams[] {
  return pages.map((pageInfo) => ({
    category: pageInfo.category,
    page: pageInfo.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ExamplePageParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const pageInfo = getPageById(resolvedParams.page);

  if (!pageInfo || pageInfo.category !== resolvedParams.category) {
    return {
      title: "サンプルが見つかりません",
      description:
        "指定されたサンプルページは存在しないか、カテゴリが一致しません。",
    };
  }

  const categoryLabel =
    categories.find((category) => category.id === pageInfo.category)?.label ??
    pageInfo.category;

  return {
    title: `${pageInfo.title} | ${categoryLabel}`,
    description: pageInfo.description,
    keywords: pageInfo.tags,
  };
}

/**
 * サンプルページ表示ページ
 * 各学習用サンプルページを表示します。
 */
export default async function ExamplePage({
  params,
}: {
  params: Promise<ExamplePageParams>;
}) {
  const { category, page } = await params;

  // ページ情報を取得
  const pageInfo = getPageById(page);

  // ページが見つからない場合は404
  if (!pageInfo || pageInfo.category !== category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* ヘッダー */}
      <header className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <Link
              href="/catalog"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              ← カタログに戻る
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {pageInfo.title}
            </h1>
          </div>
          <div className="text-right">
            <span className="inline-block rounded-lg bg-zinc-200 px-3 py-1 text-sm font-semibold text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50">
              {pageInfo.difficulty}
            </span>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            {pageInfo.description}
          </p>

          {/* 準備中の表示 */}
          <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-12 text-center dark:border-amber-700 dark:bg-amber-900/20">
            <p className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              🚧 このサンプルは準備中です
            </p>
            <p className="mt-2 text-amber-700 dark:text-amber-300">
              専用の実装ページは近日公開予定です。
            </p>
            <Link
              href="/catalog"
              className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
            >
              ← カタログに戻る
            </Link>
          </div>

          {/* タグ表示 */}
          {pageInfo.tags && pageInfo.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                タグ
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {pageInfo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
