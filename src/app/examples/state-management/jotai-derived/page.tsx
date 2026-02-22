"use client";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRight, Percent, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";

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
// 派生Atom の3つのパターン
// ============================================

/**
 * ベースとなる Primitive Atom
 * 他の派生Atom はこの atom の値を元に計算します。
 */
const priceAtom = atom(1000);
const quantityAtom = atom(1);
const taxRateAtom = atom(10); // パーセント

/**
 * パターン1: 読み取り専用の派生Atom（Read-only Derived Atom）
 *
 * atom() の第1引数にゲッター関数を渡すと、
 * 他の atom の値を元に計算した結果を返す「読み取り専用」な atom になります。
 * 依存する atom が更新されると自動的に再計算されます。
 */
const subtotalAtom = atom((get) => {
  const price = get(priceAtom);
  const quantity = get(quantityAtom);
  return price * quantity;
});

/**
 * 税額を計算する派生Atom
 */
const taxAmountAtom = atom((get) => {
  const subtotal = get(subtotalAtom); // 派生Atom も依存先にできる
  const taxRate = get(taxRateAtom);
  return Math.floor(subtotal * (taxRate / 100));
});

/**
 * 合計金額を計算する派生Atom（複数の派生Atom を組み合わせ）
 */
const totalAtom = atom((get) => {
  const subtotal = get(subtotalAtom);
  const tax = get(taxAmountAtom);
  return subtotal + tax;
});

/**
 * パターン2: 書き込み専用の派生Atom（Write-only Derived Atom）
 *
 * 第1引数に null、第2引数にセッター関数を渡すと、
 * 「書き込み専用」な atom になります。
 * 複数の atom をまとめて更新するアクションとして使えます。
 */
const resetCartAtom = atom(null, (_get, set) => {
  set(priceAtom, 1000);
  set(quantityAtom, 1);
  set(taxRateAtom, 10);
});

/**
 * パターン3: 読み書き可能な派生Atom（Read-Write Derived Atom）
 *
 * 第1引数にゲッター、第2引数にセッターを渡すと、
 * 「読み書き可能」な派生 atom になります。
 * 表示用の変換と、入力からの逆変換を同時に定義できます。
 */
const priceInDollarsAtom = atom(
  // get: 円からドルに変換して返す（表示用）
  (get) => Math.round(get(priceAtom) / 150),
  // set: ドルから円に変換して priceAtom を更新
  (_get, set, newDollars: number) => {
    set(priceAtom, newDollars * 150);
  },
);

// ============================================
// 温度変換の例（読み書き可能な派生Atom の別の例）
// ============================================

/** 摂氏（ベース） */
const celsiusAtom = atom(25);

/** 華氏（派生：読み書き可能） */
const fahrenheitAtom = atom(
  (get) => get(celsiusAtom) * (9 / 5) + 32,
  (_get, set, newFahrenheit: number) => {
    set(celsiusAtom, (newFahrenheit - 32) * (5 / 9));
  },
);

// ============================================
// メインページコンポーネント
// ============================================

/**
 * Jotai 派生Atom サンプルページ
 *
 * @remarks
 * 読み取り専用・書き込み専用・読み書き可能な3種類の派生Atom を学びます。
 * 料金計算と温度変換の実例で理解を深めます。
 */
export default function JotaiDerivedPage() {
  const [price, setPrice] = useAtom(priceAtom);
  const [quantity, setQuantity] = useAtom(quantityAtom);
  const [taxRate, setTaxRate] = useAtom(taxRateAtom);
  const subtotal = useAtomValue(subtotalAtom);
  const taxAmount = useAtomValue(taxAmountAtom);
  const total = useAtomValue(totalAtom);
  const resetCart = useSetAtom(resetCartAtom);

  const [priceInDollars, setPriceInDollars] = useAtom(priceInDollarsAtom);
  const [celsius, setCelsius] = useAtom(celsiusAtom);
  const [fahrenheit, setFahrenheit] = useAtom(fahrenheitAtom);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-100/40 via-transparent to-teal-200/30 dark:from-cyan-900/20 dark:to-teal-800/10" />

      {/* メインコンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header
          className="animate-fade-in-scale mb-16 text-center"
          style={{ "--animation-delay": "0ms" } as React.CSSProperties}
        >
          <Badge variant="secondary" className="mb-6">
            状態管理
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Jotai
            <span className="bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-teal-500">
              派生Atom
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            既存の atom から新しい値を計算する3つのパターン
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* ===== 派生Atom の概要 ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>派生Atom（Derived Atom）とは？</CardTitle>
              <CardDescription>
                他の atom の値から計算された atom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                派生 Atom は、atom() のゲッター関数で他の atom
                の値を読み取り、計算結果を返します。 依存先の atom
                が変わると、自動的に再計算されます。
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <h4 className="mb-1 font-semibold text-sm text-blue-700 dark:text-blue-300">
                    📖 読み取り専用
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    他の atom から計算した値を返すだけ
                  </p>
                  <code className="mt-2 block text-xs">
                    atom((get) =&gt; get(a) * 2)
                  </code>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <h4 className="mb-1 font-semibold text-sm text-amber-700 dark:text-amber-300">
                    ✏️ 書き込み専用
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    複数の atom をまとめて更新するアクション
                  </p>
                  <code className="mt-2 block text-xs">
                    atom(null, (get, set) =&gt; ...)
                  </code>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                  <h4 className="mb-1 font-semibold text-sm text-green-700 dark:text-green-300">
                    🔄 読み書き可能
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    変換と逆変換の両方を定義
                  </p>
                  <code className="mt-2 block text-xs">
                    atom((get) =&gt; ..., (get, set, v) =&gt; ...)
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== 料金計算の例 ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>
                <ShoppingCart className="mr-2 inline-block size-5" />
                料金計算（読み取り専用の派生Atom）
              </CardTitle>
              <CardDescription>
                price × quantity + tax を派生Atom で自動計算
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 入力フォーム */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    <Tag className="mr-1 inline-block size-3" />
                    単価（円）
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    数量
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tax-rate" className="text-sm font-medium">
                    <Percent className="mr-1 inline-block size-3" />
                    税率（%）
                  </label>
                  <Input
                    id="tax-rate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              {/* 計算結果 */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">小計</span>
                    <span>¥{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      消費税（{taxRate}%）
                    </span>
                    <span>¥{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>合計</span>
                      <span className="text-cyan-600 dark:text-cyan-400">
                        ¥{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={resetCart}>
                カートをリセット
              </Button>

              {/* コード解説 */}
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    読み取り専用 Atom の定義
                  </p>
                  <code className="text-sm">
                    {`const subtotalAtom = atom((get) => {`}
                    <br />
                    {`  return get(priceAtom) * get(quantityAtom);`}
                    <br />
                    {`});`}
                    <br />
                    {`// ↑ priceAtom か quantityAtom が変わると自動再計算`}
                  </code>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    書き込み専用 Atom（リセットアクション）
                  </p>
                  <code className="text-sm">
                    {`const resetCartAtom = atom(null, (_get, set) => {`}
                    <br />
                    {`  set(priceAtom, 1000);`}
                    <br />
                    {`  set(quantityAtom, 1);`}
                    <br />
                    {`});`}
                    <br />
                    {`// ↑ 複数の atom をまとめて更新`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== 読み書き可能な派生Atom ===== */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>通貨変換</CardTitle>
              <CardDescription>
                読み書き可能な派生Atom で双方向変換
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="yen" className="text-sm font-medium">
                    🇯🇵 日本円
                  </label>
                  <Input
                    id="yen"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dollar" className="text-sm font-medium">
                    🇺🇸 US ドル
                  </label>
                  <Input
                    id="dollar"
                    type="number"
                    value={priceInDollars}
                    onChange={(e) => setPriceInDollars(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  {`const priceInDollarsAtom = atom(`}
                  <br />
                  {`  (get) => get(priceAtom) / 150, // 読み取り`}
                  <br />
                  {`  (_get, set, usd) => {           // 書き込み`}
                  <br />
                  {`    set(priceAtom, usd * 150);`}
                  <br />
                  {`  }`}
                  <br />
                  {`);`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ===== 温度変換 ===== */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>温度変換</CardTitle>
              <CardDescription>摂氏と華氏を双方向で変換</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="celsius" className="text-sm font-medium">
                    🌡️ 摂氏（°C）
                  </label>
                  <Input
                    id="celsius"
                    type="number"
                    value={Math.round(celsius * 10) / 10}
                    onChange={(e) => setCelsius(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fahrenheit" className="text-sm font-medium">
                    🌡️ 華氏（°F）
                  </label>
                  <Input
                    id="fahrenheit"
                    type="number"
                    value={Math.round(fahrenheit * 10) / 10}
                    onChange={(e) => setFahrenheit(Number(e.target.value))}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                どちらの入力を変更しても、もう一方が自動で更新されます。
                これが「読み書き可能な派生Atom」の力です。
              </p>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  {`const fahrenheitAtom = atom(`}
                  <br />
                  {`  (get) => get(celsiusAtom) * 9/5 + 32,`}
                  <br />
                  {`  (_get, set, f) => {`}
                  <br />
                  {`    set(celsiusAtom, (f - 32) * 5/9);`}
                  <br />
                  {`  }`}
                  <br />
                  {`);`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ===== まとめ ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>派生Atom まとめ</CardTitle>
              <CardDescription>3つのパターンの使い分け</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-semibold">パターン</th>
                      <th className="pb-2 text-left font-semibold">定義</th>
                      <th className="pb-2 text-left font-semibold">用途</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 font-medium text-blue-600 dark:text-blue-400">
                        読み取り専用
                      </td>
                      <td className="py-2">
                        <code className="text-xs">atom((get) =&gt; ...)</code>
                      </td>
                      <td className="py-2 text-muted-foreground">
                        計算結果の表示、フィルタリング
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-amber-600 dark:text-amber-400">
                        書き込み専用
                      </td>
                      <td className="py-2">
                        <code className="text-xs">
                          atom(null, (get, set) =&gt; ...)
                        </code>
                      </td>
                      <td className="py-2 text-muted-foreground">
                        リセット、一括更新などのアクション
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-green-600 dark:text-green-400">
                        読み書き可能
                      </td>
                      <td className="py-2">
                        <code className="text-xs">
                          atom((get) =&gt; ..., (get, set, v) =&gt; ...)
                        </code>
                      </td>
                      <td className="py-2 text-muted-foreground">
                        双方向変換（通貨、単位など）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ===== Next Steps ===== */}
          <Card
            className="animate-fade-in-up border-cyan-200/50 bg-gradient-to-br from-cyan-50/50 to-teal-100/30 sm:col-span-2 dark:border-cyan-800/30 dark:from-cyan-950/50 dark:to-teal-900/30"
            style={{ "--animation-delay": "600ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                実践的な Todo アプリを作りながら、atomFamily
                や非同期処理など応用パターンを学びましょう。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/examples/state-management/jotai-todo-app"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
                >
                  Todo アプリを作る
                  <ChevronRight className="size-4" />
                </Link>
                <Link
                  href="/examples/state-management/jotai-basics"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  基礎に戻る
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
