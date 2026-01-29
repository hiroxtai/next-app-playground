"use client";

import { ChevronRight, Save, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ============================================
// カスタムフック: useLocalStorage
// ============================================
/**
 * localStorage に値を永続化するカスタムフック
 * @param key - localStorage のキー
 * @param initialValue - 初期値
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // 初期値の取得（SSR対応）
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 値を更新し、localStorage に保存
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}

// ============================================
// カスタムフック: useDebounce
// ============================================
/**
 * 値の変更を遅延させるカスタムフック
 * @param value - 遅延させる値
 * @param delay - 遅延時間（ミリ秒）
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ：前のタイマーをキャンセル
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// カスタムフック: useToggle
// ============================================
/**
 * boolean値を切り替えるシンプルなカスタムフック
 * @param initialValue - 初期値
 */
function useToggle(
  initialValue = false,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggle, setValue];
}

/**
 * カスタムフック サンプルページ
 */
export default function CustomHooksPage() {
  // useLocalStorage の使用例
  const [savedName, setSavedName] = useLocalStorage("demo-name", "");
  const [nameInput, setNameInput] = useState(savedName);

  // useDebounce の使用例
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [searchCount, setSearchCount] = useState(0);

  // useToggle の使用例
  const [isEnabled, toggleEnabled] = useToggle(false);

  // デバウンスされた値が変更されたら検索を実行
  useEffect(() => {
    if (debouncedQuery) {
      setSearchCount((prev) => prev + 1);
    }
  }, [debouncedQuery]);

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
            React Hooks - 中級
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            カスタム
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              フック
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            再利用可能なロジックをカスタムフックに抽出
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* useLocalStorage */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="size-5 text-brand-500" />
                useLocalStorage
              </CardTitle>
              <CardDescription>
                localStorage に値を永続化するフック
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="名前を入力してください"
                />
                <Button onClick={() => setSavedName(nameInput)}>
                  <Save className="mr-2 size-4" />
                  保存
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSavedName("");
                    setNameInput("");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  保存された値:{" "}
                  <span className="font-medium text-foreground">
                    {savedName || "(なし)"}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ページをリロードしても値が保持されます
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`const [value, setValue] = useLocalStorage("key", initialValue);`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* useDebounce */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="size-5 text-brand-500" />
                useDebounce
              </CardTitle>
              <CardDescription>
                入力を遅延させて API 呼び出しを最適化
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="検索キーワードを入力..."
              />
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">入力値:</span>
                  <span className="font-mono">{searchQuery || "(空)"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    デバウンス後 (500ms):
                  </span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">
                    {debouncedQuery || "(空)"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">検索実行回数:</span>
                  <span className="font-mono">{searchCount}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                入力を止めてから500ms後に検索が実行されます
              </p>
            </CardContent>
          </Card>

          {/* useToggle */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>useToggle</CardTitle>
              <CardDescription>
                シンプルな boolean 切り替えフック
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={toggleEnabled}>トグル</Button>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    isEnabled
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {isEnabled ? "ON" : "OFF"}
                </span>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-sm">
                  {`const [value, toggle, setValue] = useToggle(false);
toggle(); // 値を反転`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* カスタムフック作成のポイント */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>カスタムフック作成のポイント</CardTitle>
              <CardDescription>
                良いカスタムフックを作るためのガイドライン
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    1
                  </span>
                  <div>
                    <p className="font-medium">use で始める命名</p>
                    <p className="text-sm text-muted-foreground">
                      React がフックとして認識するため必須です
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    2
                  </span>
                  <div>
                    <p className="font-medium">単一の責任</p>
                    <p className="text-sm text-muted-foreground">
                      1つのフックは1つの機能に集中させる
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    3
                  </span>
                  <div>
                    <p className="font-medium">クリーンアップを忘れずに</p>
                    <p className="text-sm text-muted-foreground">
                      useEffect 内のタイマーやイベントリスナーは必ず解除
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    4
                  </span>
                  <div>
                    <p className="font-medium">TypeScript で型付け</p>
                    <p className="text-sm text-muted-foreground">
                      ジェネリクスを使って汎用的なフックを作成
                    </p>
                  </div>
                </li>
              </ul>
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
                Server Actions でサーバー処理を学んでみましょう。
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
