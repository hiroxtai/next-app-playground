"use client";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  Check,
  ChevronRight,
  Filter,
  ListTodo,
  Plus,
  Trash2,
  X,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================
// 型定義
// ============================================

/** Todo アイテムの型 */
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/** フィルターの種類 */
type FilterType = "all" | "active" | "completed";

// ============================================
// Atom 定義
// ============================================

/**
 * atomWithStorage: localStorage に永続化される Atom
 *
 * jotai/utils に含まれるユーティリティです。
 * 第1引数にキー名、第2引数に初期値を渡します。
 * ブラウザをリロードしても状態が保持されます。
 */
const todosAtom = atomWithStorage<Todo[]>("jotai-todos", []);

/**
 * フィルター状態の Atom
 */
const filterAtom = atom<FilterType>("all");

/**
 * フィルタリングされた Todo リスト（読み取り専用の派生Atom）
 *
 * todosAtom と filterAtom に依存し、
 * フィルター条件に合う Todo だけを返します。
 */
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
});

/**
 * Todo の統計情報（読み取り専用の派生Atom）
 *
 * 複数の値を計算してオブジェクトで返すパターン。
 */
const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom);
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, active, progress };
});

/**
 * Todo を追加するアクション Atom（書き込み専用の派生Atom）
 *
 * 引数に新しい Todo のテキストを受け取り、
 * todosAtom に追加します。
 */
const addTodoAtom = atom(null, (_get, set, text: string) => {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
  set(todosAtom, (prev) => [...prev, newTodo]);
});

/**
 * Todo の完了状態を切り替えるアクション Atom
 */
const toggleTodoAtom = atom(null, (_get, set, id: string) => {
  set(todosAtom, (prev) =>
    prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    ),
  );
});

/**
 * Todo を削除するアクション Atom
 */
const removeTodoAtom = atom(null, (_get, set, id: string) => {
  set(todosAtom, (prev) => prev.filter((todo) => todo.id !== id));
});

/**
 * 完了済み Todo を一括削除するアクション Atom
 */
const clearCompletedAtom = atom(null, (_get, set) => {
  set(todosAtom, (prev) => prev.filter((todo) => !todo.completed));
});

// ============================================
// サブコンポーネント
// ============================================

/**
 * Todo 入力フォーム
 *
 * useState（ローカル状態）と Jotai（グローバル状態）を
 * 組み合わせるパターンの例です。
 * 入力中のテキストはローカル、追加後の Todo リストはグローバル。
 */
function TodoInput() {
  // 入力中のテキストはコンポーネント内だけで使うので useState
  const [text, setText] = useState("");
  // addTodoAtom は書き込み専用なので useSetAtom を使う
  const addTodo = useSetAtom(addTodoAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しい Todo を入力..."
        aria-label="新しいTodoを入力"
        className="flex-1"
      />
      <Button type="submit" disabled={!text.trim()}>
        <Plus className="mr-1 size-4" />
        追加
      </Button>
    </form>
  );
}

/**
 * 個別の Todo アイテム
 *
 * useSetAtom を使い、値自体は読まないため、
 * 他の Todo が変更されてもこのコンポーネントは再レンダリングされません。
 */
function TodoItem({ todo }: { todo: Todo }) {
  const toggleTodo = useSetAtom(toggleTodoAtom);
  const removeTodo = useSetAtom(removeTodoAtom);

  return (
    <li className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
        aria-label={`${todo.text}を${todo.completed ? "未完了" : "完了"}にする`}
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 text-sm cursor-pointer ${
          todo.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => removeTodo(todo.id)}
        aria-label={`${todo.text}を削除`}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

/**
 * Todo リスト表示
 */
function TodoList() {
  const filteredTodos = useAtomValue(filteredTodosAtom);

  if (filteredTodos.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        <ListTodo className="mx-auto mb-2 size-8 opacity-50" />
        <p>Todo がありません</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

/**
 * フィルターバー
 */
function FilterBar() {
  const [filter, setFilter] = useAtom(filterAtom);
  const stats = useAtomValue(todoStatsAtom);
  const clearCompleted = useSetAtom(clearCompletedAtom);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
        >
          <SelectTrigger className="w-[140px]" aria-label="フィルター">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて ({stats.total})</SelectItem>
            <SelectItem value="active">未完了 ({stats.active})</SelectItem>
            <SelectItem value="completed">
              完了済み ({stats.completed})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {stats.completed > 0 && (
        <Button variant="outline" size="sm" onClick={clearCompleted}>
          <X className="mr-1 size-3" />
          完了済みを削除
        </Button>
      )}
    </div>
  );
}

/**
 * 進捗バー
 */
function ProgressBar() {
  const stats = useAtomValue(todoStatsAtom);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">進捗</span>
        <span className="font-medium">
          {stats.completed}/{stats.total} 完了（{stats.progress}%）
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-500"
          style={{ width: `${stats.progress}%` }}
          role="progressbar"
          aria-valuenow={stats.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`進捗: ${stats.progress}%`}
        />
      </div>
    </div>
  );
}

// ============================================
// メインページ
// ============================================

/**
 * Jotai Todo アプリ サンプルページ
 *
 * @remarks
 * atomWithStorage、派生Atom、アクションAtom を組み合わせた
 * 実践的な Todo アプリケーションです。
 */
export default function JotaiTodoAppPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-100/40 via-transparent to-emerald-200/30 dark:from-cyan-900/20 dark:to-emerald-800/10" />

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
            <span className="bg-gradient-to-r from-cyan-500 to-emerald-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-emerald-500">
              Todoアプリ
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            実践的な Todo アプリで学ぶ Jotai の応用パターン
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* ===== 使用している技術 ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>
                <Check className="mr-2 inline-block size-5" />
                この Todo アプリで学べること
              </CardTitle>
              <CardDescription>
                Jotai の応用パターンを実践的に学びます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <h4 className="mb-1 font-semibold text-xs">
                    💾 atomWithStorage
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    localStorage に状態を永続化
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <h4 className="mb-1 font-semibold text-xs">
                    📖 読み取り専用 Atom
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    フィルタリング、統計情報の計算
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <h4 className="mb-1 font-semibold text-xs">
                    ✏️ アクション Atom
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    追加・切替・削除の書き込み操作
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <h4 className="mb-1 font-semibold text-xs">
                    🔄 useState + Jotai
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    ローカルとグローバルの使い分け
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== Todo アプリ本体 ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>
                <ListTodo className="mr-2 inline-block size-5" />
                Todo アプリ
              </CardTitle>
              <CardDescription>
                ブラウザを閉じても保存される Todo アプリ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 進捗バー */}
              <ProgressBar />

              {/* 入力フォーム */}
              <TodoInput />

              {/* フィルター */}
              <FilterBar />

              {/* Todo リスト */}
              <TodoList />
            </CardContent>
          </Card>

          {/* ===== コード解説: atomWithStorage ===== */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>atomWithStorage</CardTitle>
              <CardDescription>
                localStorage に自動保存する Atom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  jotai/utils
                </code>
                に含まれるユーティリティです。
                ブラウザをリロードしても状態が保持されます。
              </p>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  {`import { atomWithStorage } from "jotai/utils";`}
                  <br />
                  <br />
                  {`// 第1引数: localStorage のキー名`}
                  <br />
                  {`// 第2引数: 初期値`}
                  <br />
                  {`const todosAtom = atomWithStorage(`}
                  <br />
                  {`  "jotai-todos",`}
                  <br />
                  {`  []`}
                  <br />
                  {`);`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ===== コード解説: アクション Atom ===== */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>アクション Atom パターン</CardTitle>
              <CardDescription>CRUD 操作を Atom として定義する</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                書き込み専用の派生 Atom を「アクション」として使うと、
                ロジックを Atom
                層に移動でき、コンポーネントがシンプルになります。
              </p>
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  {`// 追加アクション`}
                  <br />
                  {`const addTodoAtom = atom(`}
                  <br />
                  {`  null,`}
                  <br />
                  {`  (_get, set, text: string) => {`}
                  <br />
                  {`    const newTodo = {`}
                  <br />
                  {`      id: crypto.randomUUID(),`}
                  <br />
                  {`      text, completed: false`}
                  <br />
                  {`    };`}
                  <br />
                  {`    set(todosAtom, (prev) =>`}
                  <br />
                  {`      [...prev, newTodo]`}
                  <br />
                  {`    );`}
                  <br />
                  {`  }`}
                  <br />
                  {`);`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ===== コード解説: useState + Jotai ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>useState と Jotai の使い分け</CardTitle>
              <CardDescription>
                ローカルとグローバルの適切な使い分け
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <h4 className="mb-2 font-semibold text-sm text-blue-700 dark:text-blue-300">
                    useState を使う場面
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• 入力フォームの一時的な値</li>
                    <li>• モーダルの開閉状態</li>
                    <li>• ドロップダウンの展開状態</li>
                    <li>• そのコンポーネントでしか使わない状態</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950">
                  <h4 className="mb-2 font-semibold text-sm text-cyan-700 dark:text-cyan-300">
                    Jotai を使う場面
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• 複数コンポーネントで共有する状態</li>
                    <li>• 永続化が必要な状態（atomWithStorage）</li>
                    <li>• 派生値の計算が必要な状態</li>
                    <li>• アプリ全体のテーマや設定</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  この Todo アプリでの使い分け
                </p>
                <code className="text-sm">
                  {`// ローカル: 入力中のテキスト（このコンポーネントだけ）`}
                  <br />
                  {`const [text, setText] = useState("");`}
                  <br />
                  <br />
                  {`// グローバル: Todo リスト（複数コンポーネントで共有）`}
                  <br />
                  {`const addTodo = useSetAtom(addTodoAtom);`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* ===== 設計パターン図解 ===== */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "600ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Atom の設計パターン</CardTitle>
              <CardDescription>この Todo アプリの Atom 構成図</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
                <pre>{`┌─────────────────────────────────────────────┐
│              Primitive Atoms                │
│                                             │
│  todosAtom ─────── atomWithStorage          │
│  (Todo[])          (localStorage に保存)      │
│                                             │
│  filterAtom ────── atom("all")              │
│  ("all"|"active"|"completed")               │
├─────────────────────────────────────────────┤
│           Derived Atoms (読み取り専用)          │
│                                             │
│  filteredTodosAtom  ← todosAtom + filterAtom │
│  todoStatsAtom      ← todosAtom             │
├─────────────────────────────────────────────┤
│           Action Atoms (書き込み専用)          │
│                                             │
│  addTodoAtom        → todosAtom             │
│  toggleTodoAtom     → todosAtom             │
│  removeTodoAtom     → todosAtom             │
│  clearCompletedAtom → todosAtom             │
└─────────────────────────────────────────────┘`}</pre>
              </div>
            </CardContent>
          </Card>

          {/* ===== Next Steps ===== */}
          <Card
            className="animate-fade-in-up border-cyan-200/50 bg-gradient-to-br from-cyan-50/50 to-emerald-100/30 sm:col-span-2 dark:border-cyan-800/30 dark:from-cyan-950/50 dark:to-emerald-900/30"
            style={{ "--animation-delay": "700ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>おめでとうございます！🎉</CardTitle>
              <CardDescription>
                Jotai の基礎から応用まで学びました
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>ここまでで、Jotai の主要なパターンをすべて学びました。</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Primitive Atom と useAtom の基本</li>
                  <li>useAtomValue / useSetAtom による最適化</li>
                  <li>読み取り専用・書き込み専用・読み書き可能な派生Atom</li>
                  <li>atomWithStorage による永続化</li>
                  <li>アクション Atom パターン</li>
                  <li>useState と Jotai の使い分け</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/examples/state-management/jotai-basics"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  基礎に戻る
                </Link>
                <Link
                  href="/examples/state-management/jotai-derived"
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  派生 Atom に戻る
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
                >
                  カタログを見る
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
