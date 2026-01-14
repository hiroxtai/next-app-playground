import { Sidebar } from "./_components";

/**
 * カタログレイアウト
 *
 * @remarks
 * サイドバー + メインコンテンツの2カラムレイアウトを提供します。
 * Route Group (catalog) 配下のすべてのページに適用されます。
 */
export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
