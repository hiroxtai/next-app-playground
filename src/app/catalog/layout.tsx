import { Sidebar } from "./_components";

/**
 * カタログレイアウト
 * サイドバー + メインコンテンツの2カラムレイアウトを提供します。
 * Route Group (catalog) 配下のすべてのページに適用されます。
 */
export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
