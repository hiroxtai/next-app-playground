"use client";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRight, Minus, Plus, RotateCcw, User } from "lucide-react";
import Link from "next/link";

import {
  ExamplePageContent,
  ExamplePageHero,
  ExamplePageShell,
} from "@/app/examples/_components";
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
// Atom の定義（コンポーネントの外で定義）
// ============================================

/**
 * 基本的な Atom（Primitive Atom）
 *
 * atom() に初期値を渡すだけで、グローバルな状態が作れます。
 * useState と似ていますが、コンポーネント間で状態を共有できます。
 */
const countAtom = atom(0);

/**
 * 文字列の Atom
 * どんな型でも Atom にできます。
 */
const nameAtom = atom("");

/**
 * オブジェクトの Atom
 * オブジェクトも Atom として管理できます。
 */
const profileAtom = atom({ name: "", age: 0 });

// ============================================
// サブコンポーネント
// ============================================

/**
 * カウンター表示コンポーネント
 *
 * useAtomValue は値の読み取り専用フックです。
 * このコンポーネントは countAtom の値を「読む」だけです。
 */
function CounterDisplay() {
  // useAtomValue: 値だけを取得（再レンダリングは値が変わった時のみ）
  const count = useAtomValue(countAtom);

  return (
    <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
      <span className="font-display text-4xl font-bold text-white">
        {count}
      </span>
    </div>
  );
}

/**
 * カウンター操作コンポーネント
 *
 * useSetAtom は値の書き込み専用フックです。
 * このコンポーネントは countAtom の値を「書く」だけです。
 * 値自体を読まないので、値が変わってもこのコンポーネントは再レンダリングされません。
 */
function CounterControls() {
  // useSetAtom: セッター関数だけを取得（不要な再レンダリングを防ぐ）
  const setCount = useSetAtom(countAtom);

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCount((prev) => prev - 1)}
        aria-label="カウントを減らす"
      >
        <Minus />
      </Button>
      <CounterDisplay />
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCount((prev) => prev + 1)}
        aria-label="カウントを増やす"
      >
        <Plus />
      </Button>
    </div>
  );
}

/**
 * Jotai 基礎 サンプルページ
 *
 * @remarks
 * Jotai の atom と useAtom フックを使ったシンプルな状態管理を学びます。
 * useState との違い、useAtomValue / useSetAtom の使い分けも紹介します。
 */
export default function JotaiBasicsPage() {
  // useSetAtom: カウンターはリセットボタンだけ使うのでセッターのみ取得
  const setCount = useSetAtom(countAtom);
  // useAtom: 値とセッターの両方を取得（useState と同じ使い心地）
  const [name, setName] = useAtom(nameAtom);
  const [profile, setProfile] = useAtom(profileAtom);

  return (
    <ExamplePageShell>
      <ExamplePageHero
        badge="状態管理"
        title={
          <>
            Jotai
            <span className="bg-gradient-to-r from-cyan-500 to-cyan-700 bg-clip-text text-transparent dark:from-cyan-400 dark:to-cyan-600">
              基礎
            </span>
          </>
        }
        subtitle="atom と useAtom で始めるシンプルな状態管理"
      />

      <ExamplePageContent columns="two">
        {/* ===== セクション1: Jotai とは ===== */}
        <Card
          className="animate-fade-in-up sm:col-span-2"
          style={{ "--animation-delay": "100ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>Jotai とは？</CardTitle>
            <CardDescription>
              React のための最小限の状態管理ライブラリ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Jotai（状態）は、React の状態管理をシンプルにするライブラリです。
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                atom
              </code>
              という単位で状態を定義し、
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                useAtom
              </code>
              フックで読み書きします。
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold text-sm">🪶 ミニマル</h4>
                <p className="text-xs text-muted-foreground">
                  コア API は atom と useAtom だけ。学習コストが低い
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold text-sm">
                  🔄 useState ライク
                </h4>
                <p className="text-xs text-muted-foreground">
                  useState と同じ感覚で使える。移行が簡単
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-1 font-semibold text-sm">
                  ⚡ 最小再レンダリング
                </h4>
                <p className="text-xs text-muted-foreground">
                  atom 単位で購読するため、不要な再レンダリングが起きない
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                インストール
              </p>
              <code className="text-sm">pnpm add jotai</code>
            </div>
          </CardContent>
        </Card>

        {/* ===== セクション2: 基本的なカウンター ===== */}
        <Card
          className="animate-fade-in-up sm:col-span-2"
          style={{ "--animation-delay": "200ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>基本的なカウンター</CardTitle>
            <CardDescription>
              atom() と useAtom() の最もシンプルな使い方
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* カウンター UI */}
            <div className="flex flex-col items-center gap-4">
              <CounterControls />
              <Button
                variant="ghost"
                onClick={() => setCount(0)}
                aria-label="カウントをリセット"
              >
                <RotateCcw className="mr-2 size-4" />
                リセット
              </Button>
            </div>

            {/* コード解説 */}
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Step 1: Atom を定義する
                </p>
                <code className="text-sm">
                  {`// コンポーネントの外で定義する（重要！）`}
                  <br />
                  {`const countAtom = atom(0);`}
                </code>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Step 2: コンポーネントで使う
                </p>
                <code className="text-sm">
                  {`const [count, setCount] = useAtom(countAtom);`}
                  <br />
                  {`// ↑ useState とほぼ同じ使い方！`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== セクション3: useAtomValue / useSetAtom ===== */}
        <Card
          className="animate-fade-in-up"
          style={{ "--animation-delay": "300ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>読み取り専用 / 書き込み専用</CardTitle>
            <CardDescription>
              useAtomValue と useSetAtom の使い分け
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              上のカウンターは
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                useAtomValue
              </code>
              と
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                useSetAtom
              </code>
              を別々のコンポーネントで使っています。
            </p>
            <div className="space-y-3">
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  値だけ読む（再レンダリング最適化）
                </p>
                <code className="text-sm">
                  {`const count = useAtomValue(countAtom);`}
                </code>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  値を書くだけ（値変更で再レンダリングしない）
                </p>
                <code className="text-sm">
                  {`const setCount = useSetAtom(countAtom);`}
                </code>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  両方使う（useState と同じ）
                </p>
                <code className="text-sm">
                  {`const [count, setCount] = useAtom(countAtom);`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== セクション4: 文字列の Atom ===== */}
        <Card
          className="animate-fade-in-up"
          style={{ "--animation-delay": "400ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>
              <User className="mr-2 inline-block size-5" />
              文字列の Atom
            </CardTitle>
            <CardDescription>テキスト入力の状態管理</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name-input" className="text-sm font-medium">
                名前を入力
              </label>
              <Input
                id="name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 太郎"
              />
            </div>
            {name && (
              <p className="rounded-lg bg-cyan-50 p-3 text-sm dark:bg-cyan-950">
                こんにちは、
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {name}
                </span>
                さん！
              </p>
            )}
            <div className="rounded-lg bg-muted p-4">
              <code className="text-sm">
                {`const nameAtom = atom("");`}
                <br />
                {`const [name, setName] = useAtom(nameAtom);`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* ===== セクション5: オブジェクトの Atom ===== */}
        <Card
          className="animate-fade-in-up sm:col-span-2"
          style={{ "--animation-delay": "500ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>オブジェクトの Atom</CardTitle>
            <CardDescription>
              オブジェクトの状態をスプレッド構文で更新する
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium">
                  名前
                </label>
                <Input
                  id="profile-name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="名前を入力"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-age" className="text-sm font-medium">
                  年齢
                </label>
                <Input
                  id="profile-age"
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      age: Number(e.target.value),
                    }))
                  }
                  placeholder="年齢を入力"
                />
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                現在の状態
              </p>
              <code className="text-sm">
                {JSON.stringify(profile, null, 2)}
              </code>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                オブジェクトの更新（スプレッド構文）
              </p>
              <code className="text-sm">
                {`setProfile((prev) => ({ ...prev, name: value }));`}
                <br />
                {`// ↑ 既存のプロパティを残しつつ、一部を更新`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* ===== セクション6: useState との比較 ===== */}
        <Card
          className="animate-fade-in-up sm:col-span-2"
          style={{ "--animation-delay": "600ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>useState vs Jotai</CardTitle>
            <CardDescription>いつ Jotai を使うべき？</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-semibold">特徴</th>
                    <th className="pb-2 text-left font-semibold">useState</th>
                    <th className="pb-2 text-left font-semibold">Jotai</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-muted-foreground">スコープ</td>
                    <td className="py-2">コンポーネント内</td>
                    <td className="py-2">グローバル（アプリ全体）</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">状態の共有</td>
                    <td className="py-2">props で渡す必要あり</td>
                    <td className="py-2">どこからでもアクセス可能</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">
                      再レンダリング
                    </td>
                    <td className="py-2">親の再レンダリングが伝播</td>
                    <td className="py-2">atom を使うコンポーネントだけ</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">
                      向いている場面
                    </td>
                    <td className="py-2">ローカルな UI 状態</td>
                    <td className="py-2">複数コンポーネント間で共有する状態</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ===== Next Steps ===== */}
        <Card
          className="animate-fade-in-up border-cyan-200/50 bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 sm:col-span-2 dark:border-cyan-800/30 dark:from-cyan-950/50 dark:to-cyan-900/30"
          style={{ "--animation-delay": "700ms" } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>次のステップ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              派生 Atom（Derived Atom）で、既存の atom
              から新しい値を計算する方法を学びましょう。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/examples/state-management/jotai-derived"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
              >
                派生 Atom を学ぶ
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                カタログを見る
              </Link>
            </div>
          </CardContent>
        </Card>
      </ExamplePageContent>
    </ExamplePageShell>
  );
}
