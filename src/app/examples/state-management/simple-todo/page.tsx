import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TodoApp } from "./_components/TodoApp";

/**
 * シンプルTodoアプリページのメタデータ。
 */
export const metadata: Metadata = {
  title: "シンプルTodoアプリ",
  description:
    "useState によるインメモリ状態管理で、タスクの作成・完了切替・削除（確認付き）を学ぶサンプル。",
};

/**
 * シンプルTodoアプリのサンプルページ。
 *
 * @remarks
 * 学習用に最小構成で実装したTodoアプリです。
 * 状態は `useState` のみで保持し、リロードすると初期化されます（永続化なし）。
 */
export default function SimpleTodoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            シンプル
            <span className="bg-linear-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              Todo
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            タスクの作成・完了・削除ができる最小構成のTodoアプリ
          </p>
        </header>

        {/* Todo 本体 */}
        <Card>
          <CardHeader>
            <CardTitle>タスク管理</CardTitle>
            <CardDescription>
              タスクを追加し、完了の切り替えや削除を試してみましょう。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodoApp />
          </CardContent>
        </Card>

        {/* カタログに戻るリンク */}
        <div className="mt-8 text-center">
          <Link
            href="/catalog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← カタログに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
