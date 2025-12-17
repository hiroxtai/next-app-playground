/**
 * Hello World サンプルページ
 *
 * 最もシンプルなサンプルページです。
 * React コンポーネントとして構築され、Tailwind CSSでスタイリングされています。
 */
export default function HelloWorldPage() {
  return (
    <div className="min-h-screen bg-white p-8 dark:bg-black">
      {/* メインコンテンツ */}
      <div className="mx-auto max-w-4xl">
        {/* タイトルセクション */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
            Hello World!
          </h1>
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
            ようこそ、Next.js Playgroundへ
          </p>
        </div>

        {/* カードセクション */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            このページについて
          </h2>
          <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>これは最もシンプルなサンプルページです。</p>
            <p>React コンポーネントとして構築されています。</p>
            <p>Tailwind CSS を使用してスタイリングしています。</p>
            <p>ダークモードにも対応しています。</p>
          </div>
        </div>

        {/* 技術情報セクション */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            使用技術
          </h2>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li className="flex items-center">
              <span className="mr-2">⚛️</span>
              <span>React 19 - UI ライブラリ</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">▲</span>
              <span>Next.js 16 - React フレームワーク（App Router）</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🎨</span>
              <span>Tailwind CSS v4 - ユーティリティファーストCSS</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📘</span>
              <span>TypeScript - 型安全な開発</span>
            </li>
          </ul>
        </div>

        {/* Next Steps セクション */}
        <div className="mt-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-blue-950 dark:to-indigo-950">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Next Steps
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            他のサンプルページもぜひご覧ください。
            カタログページから様々なサンプルを探索できます。
          </p>
        </div>
      </div>
    </div>
  );
}
