"use client";

import { ChevronRight, Clock, Eye, EyeOff, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * useEffect ライフサイクル サンプルページ
 *
 * @remarks
 * useEffectフックを使用したコンポーネントのライフサイクル管理を学びます。
 * マウント、更新、アンマウント時の処理とクリーンアップ関数を実演します。
 */

// 現在時刻表示コンポーネント（クリーンアップ関数のデモ用）
function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // マウント時にインターバルを設定
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // クリーンアップ関数：アンマウント時にインターバルをクリア
    return () => {
      clearInterval(intervalId);
    };
  }, []); // 空の依存配列 = マウント時のみ実行

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 px-6 py-4 font-mono text-2xl font-bold text-white">
      <Clock className="size-6" />
      {time.toLocaleTimeString("ja-JP")}
    </div>
  );
}

export default function UseEffectLifecyclePage() {
  const [showClock, setShowClock] = useState(true);
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // マウント時のみ実行
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString("ja-JP");
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] コンポーネントがマウントされました`,
    ]);
  }, []);

  // countが変更されるたびに実行
  useEffect(() => {
    if (count > 0) {
      const timestamp = new Date().toLocaleTimeString("ja-JP");
      setLogs((prev) => [
        ...prev,
        `[${timestamp}] count が ${count} に変更されました`,
      ]);
    }
  }, [count]);

  const clearLogs = () => setLogs([]);

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
            React Hooks
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            useEffect
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              ライフサイクル
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            副作用の処理とクリーンアップ関数の使い方
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* クリーンアップ関数のデモ */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>クリーンアップ関数</CardTitle>
              <CardDescription>
                コンポーネントのアンマウント時にリソースを解放
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  variant={showClock ? "destructive" : "default"}
                  onClick={() => setShowClock(!showClock)}
                >
                  {showClock ? (
                    <>
                      <EyeOff className="mr-2 size-4" />
                      時計を非表示
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 size-4" />
                      時計を表示
                    </>
                  )}
                </Button>
              </div>
              <div className="flex min-h-[60px] items-center">
                {showClock ? (
                  <CurrentTime />
                ) : (
                  <p className="text-muted-foreground">
                    時計コンポーネントはアンマウントされ、setIntervalがクリアされました
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`useEffect(() => {
  const intervalId = setInterval(() => {
    setTime(new Date());
  }, 1000);

  // クリーンアップ関数
  return () => clearInterval(intervalId);
}, []); // 空の依存配列`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* 依存配列のデモ */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>依存配列</CardTitle>
              <CardDescription>特定の値が変更されたときに実行</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={() => setCount(count + 1)}>
                  count: {count}
                </Button>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`useEffect(() => {
  // count が変更されるたびに実行
  console.log(\`count: \${count}\`);
}, [count]); // count を監視`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ログ表示 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                イベントログ
                <Button variant="ghost" size="sm" onClick={clearLogs}>
                  <RefreshCw className="mr-2 size-4" />
                  クリア
                </Button>
              </CardTitle>
              <CardDescription>
                useEffect の実行タイミングを確認
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 overflow-y-auto rounded-lg bg-muted p-4">
                {logs.length > 0 ? (
                  <ul className="space-y-1 font-mono text-sm">
                    {logs.map((log, index) => (
                      <li
                        key={`log-${index}`}
                        className="text-muted-foreground"
                      >
                        {log}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    ログはありません
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 依存配列の種類 */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>依存配列の種類</CardTitle>
              <CardDescription>
                依存配列の指定方法による挙動の違い
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">空の配列 []</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    マウント時に1回だけ実行
                  </p>
                  <code className="text-xs">
                    useEffect(() ={">"} {"{"} ... {"}"}, []);
                  </code>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">依存値あり [value]</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    value 変更時に実行
                  </p>
                  <code className="text-xs">
                    useEffect(() ={">"} {"{"} ... {"}"}, [value]);
                  </code>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">配列なし</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    毎レンダー時に実行（非推奨）
                  </p>
                  <code className="text-xs">
                    useEffect(() ={">"} {"{"} ... {"}"});
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
                Next.js の Server Components について学んでみましょう。
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
