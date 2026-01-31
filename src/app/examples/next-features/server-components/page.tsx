import {
  ChevronRight,
  Database,
  Lock,
  Monitor,
  Package,
  Server,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * サーバーサイドでデータを取得する非同期関数
 * 実際のアプリケーションではAPIやデータベースからデータを取得します
 */
async function fetchServerData() {
  // サーバーサイドでの処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
  };
}

/**
 * Server Components サンプルページ
 *
 * @remarks
 * Next.js App RouterのServer Componentsの使用方法と利点を学びます。
 * このページ自体がServer Componentとして動作しています。
 */
export default async function ServerComponentsPage() {
  // サーバーサイドでデータを取得（async/await が使える！）
  const serverData = await fetchServerData();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/40 via-transparent to-brand-200/30 dark:from-brand-900/20 dark:to-brand-800/10" />

      {/* ノイズテクスチャオーバーレイ */}
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]" />

      {/* メインコンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header
          className="animate-fade-in-scale mb-16 text-center"
          style={{ "--animation-delay": "0ms" } as React.CSSProperties}
        >
          <Badge variant="secondary" className="mb-6">
            Next.js Features
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Server
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              Components
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            サーバーサイドで実行されるReactコンポーネント
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* このページはServer Component */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="size-5 text-brand-500" />
                このページはServer Component
              </CardTitle>
              <CardDescription>
                サーバーサイドで実行され、HTMLとしてクライアントに送信されます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 p-6 dark:from-brand-950 dark:to-brand-900">
                <h4 className="mb-4 font-semibold text-foreground">
                  サーバーから取得したデータ:
                </h4>
                <dl className="space-y-2 font-mono text-sm">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Timestamp:</dt>
                    <dd className="text-foreground">{serverData.timestamp}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Environment:</dt>
                    <dd className="text-foreground">
                      {serverData.environment}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Node Version:</dt>
                    <dd className="text-foreground">
                      {serverData.nodeVersion}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`// Server Component は async 関数にできる
export default async function Page() {
  const data = await fetchData(); // サーバーサイドで実行
  return <div>{data}</div>;
}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Server Components のメリット */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Server Components のメリット</CardTitle>
              <CardDescription>
                パフォーマンスとセキュリティの向上
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Package className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <div>
                    <h4 className="font-medium">バンドルサイズ削減</h4>
                    <p className="text-sm text-muted-foreground">
                      依存ライブラリがクライアントに送信されない
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Database className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <div>
                    <h4 className="font-medium">直接データアクセス</h4>
                    <p className="text-sm text-muted-foreground">
                      DBやファイルシステムに直接アクセス可能
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Lock className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <div>
                    <h4 className="font-medium">セキュリティ向上</h4>
                    <p className="text-sm text-muted-foreground">
                      APIキーやトークンがクライアントに露出しない
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Zap className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <div>
                    <h4 className="font-medium">高速な初期表示</h4>
                    <p className="text-sm text-muted-foreground">
                      サーバーでHTMLを生成して送信
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Server vs Client の比較 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Server vs Client</CardTitle>
              <CardDescription>使い分けのガイドライン</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-medium">
                    <Server className="size-4 text-brand-500" />
                    Server Component を使う場合
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• データ取得が必要</li>
                    <li>• バックエンドリソースにアクセス</li>
                    <li>• 重い依存関係を使用</li>
                    <li>• インタラクションが不要</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-medium">
                    <Monitor className="size-4 text-brand-500" />
                    Client Component を使う場合
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• イベントリスナーが必要</li>
                    <li>• useState/useEffect を使用</li>
                    <li>• ブラウザ API を使用</li>
                    <li>• リアルタイム更新が必要</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 使い方 */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Client Component の宣言</CardTitle>
              <CardDescription>
                &quot;use client&quot; ディレクティブでClient Componentに変換
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-medium text-brand-600 dark:text-brand-400">
                    Server Component（デフォルト）
                  </h4>
                  <code className="whitespace-pre-wrap text-sm">
                    {`// 何も宣言しない = Server Component
export default function Page() {
  return <div>Server で実行</div>;
}`}
                  </code>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-medium text-brand-600 dark:text-brand-400">
                    Client Component
                  </h4>
                  <code className="whitespace-pre-wrap text-sm">
                    {`"use client"; // ← これを追加

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={...}>
}`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 sm:col-span-2 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                他のサンプルページもぜひご覧ください。
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                カタログを見る
                <ChevronRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
