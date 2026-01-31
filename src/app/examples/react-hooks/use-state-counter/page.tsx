"use client";

import { ChevronRight, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

/**
 * useState カウンター サンプルページ
 *
 * @remarks
 * useStateフックを使用したシンプルなカウンター実装と、
 * 様々な状態管理パターンを学びます。
 */
export default function UseStateCounterPage() {
  // 基本的なカウンター
  const [count, setCount] = useState(0);

  // オブジェクト状態
  const [user, setUser] = useState({ name: "", age: 0 });

  // 配列状態
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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
            useState
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              カウンター
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            useStateフックを使用した状態管理の基礎
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* 基本的なカウンター */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>基本的なカウンター</CardTitle>
              <CardDescription>数値の状態管理とボタン操作</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCount(count - 1)}
                >
                  <Minus />
                </Button>
                <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
                  <span className="font-display text-4xl font-bold text-white">
                    {count}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCount(count + 1)}
                >
                  <Plus />
                </Button>
              </div>
              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => setCount(0)}>
                  <RotateCcw className="mr-2 size-4" />
                  リセット
                </Button>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  const [count, setCount] = useState(0);
                  <br />
                  setCount(count + 1); {/* インクリメント */}
                  <br />
                  setCount(count - 1); {/* デクリメント */}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* オブジェクト状態 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>オブジェクト状態</CardTitle>
              <CardDescription>
                オブジェクトのプロパティを個別に更新
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="user-name" className="text-sm font-medium">
                  名前
                </label>
                <Input
                  id="user-name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="名前を入力"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user-age" className="text-sm font-medium">
                  年齢
                </label>
                <Input
                  id="user-age"
                  type="number"
                  value={user.age || ""}
                  onChange={(e) =>
                    setUser({ ...user, age: Number(e.target.value) })
                  }
                  placeholder="年齢を入力"
                />
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">現在の状態:</p>
                <code className="text-sm">{JSON.stringify(user, null, 2)}</code>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  setUser({"{"} ...user, name: value {"}"});
                </code>
              </div>
            </CardContent>
          </Card>

          {/* 配列状態 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>配列状態</CardTitle>
              <CardDescription>配列への追加と削除</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="アイテムを入力"
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <Button onClick={addItem}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li
                    key={`item-${item}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-muted px-4 py-2"
                  >
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-center text-sm text-muted-foreground">
                    アイテムがありません
                  </li>
                )}
              </ul>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  setItems([...items, newItem]); {/* 追加 */}
                  <br />
                  setItems(items.filter((_, i) ={">"} i !== index));{" "}
                  {/* 削除 */}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 sm:col-span-2 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                useEffect フックでライフサイクル管理を学んでみましょう。
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
