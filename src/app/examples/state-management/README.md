# Jotai で学ぶ状態管理

このディレクトリには、[Jotai](https://jotai.org/) を使った React の状態管理を学ぶためのサンプルページが含まれています。

## Jotai とは

Jotai（状態）は、React のための**最小限で柔軟な状態管理ライブラリ**です。「atom」という単位で状態を管理し、`useState` と同じ感覚で使えるシンプルな API が特徴です。

### 主な特徴

| 特徴 | 説明 |
|------|------|
| 🪶 ミニマル | コア API は `atom` と `useAtom` だけ |
| 🔄 useState ライク | `useState` からの移行が簡単 |
| ⚡ 最小再レンダリング | atom 単位で購読するため効率的 |
| 🧩 ボトムアップ | 小さな atom を組み合わせて複雑な状態を構築 |
| 📦 TypeScript 対応 | 型推論が優秀で型安全 |

## 環境構築

### インストール

```bash
pnpm add jotai
```

Jotai は依存パッケージなしで、これだけで使えます。Provider の設定も**不要**です（オプション）。

### Next.js での注意点

Jotai の `useAtom` は React の Hook なので、**Client Component** でのみ使用できます。

```tsx
"use client"; // ← 必須！

import { atom, useAtom } from "jotai";
```

## サンプルページ構成

3つのサンプルで段階的に学べるように構成されています。

### 1. Jotai 基礎（初級）

**パス:** `/examples/state-management/jotai-basics`

最も基本的な使い方を学びます。

- `atom()` で状態を定義する
- `useAtom()` で値の読み書き
- `useAtomValue()` で読み取り専用
- `useSetAtom()` で書き込み専用
- プリミティブ値・文字列・オブジェクトの Atom
- `useState` と Jotai の比較

### 2. Jotai 派生Atom（中級）

**パス:** `/examples/state-management/jotai-derived`

他の Atom から新しい値を計算する「派生Atom」の3つのパターンを学びます。

- **読み取り専用**: `atom((get) => ...)` — 料金計算の例
- **書き込み専用**: `atom(null, (get, set) => ...)` — リセットアクション
- **読み書き可能**: `atom(getter, setter)` — 通貨変換・温度変換

### 3. Jotai Todoアプリ（上級）

**パス:** `/examples/state-management/jotai-todo-app`

実践的な Todo アプリで応用パターンを学びます。

- `atomWithStorage` による localStorage 永続化
- アクション Atom（CRUD 操作の Atom 化）
- `useState`（ローカル）と Jotai（グローバル）の使い分け
- フィルタリングと統計情報の派生Atom

## Jotai 基本 API リファレンス

### atom（状態の定義）

```typescript
import { atom } from "jotai";

// Primitive Atom（基本的な Atom）
const countAtom = atom(0);
const nameAtom = atom("");
const userAtom = atom({ name: "", age: 0 });

// Derived Atom（派生 Atom）
// 読み取り専用
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// 書き込み専用
const resetAtom = atom(null, (_get, set) => {
  set(countAtom, 0);
  set(nameAtom, "");
});

// 読み書き可能
const fahrenheitAtom = atom(
  (get) => get(celsiusAtom) * 9/5 + 32,       // 読み取り
  (_get, set, f: number) => {                   // 書き込み
    set(celsiusAtom, (f - 32) * 5/9);
  }
);
```

### useAtom / useAtomValue / useSetAtom（状態の使用）

```typescript
import { useAtom, useAtomValue, useSetAtom } from "jotai";

// 読み書き両方
const [count, setCount] = useAtom(countAtom);

// 読み取りのみ（最適化：値が変わった時だけ再レンダリング）
const count = useAtomValue(countAtom);

// 書き込みのみ（最適化：値が変わっても再レンダリングされない）
const setCount = useSetAtom(countAtom);
```

### atomWithStorage（永続化）

```typescript
import { atomWithStorage } from "jotai/utils";

// localStorage に自動保存
const themeAtom = atomWithStorage("theme", "light");
const todosAtom = atomWithStorage<Todo[]>("todos", []);
```

## Atom 定義の重要なルール

### ✅ コンポーネントの外で定義する

```typescript
// ✅ 正しい：コンポーネントの外で定義
const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <p>{count}</p>;
}
```

### ❌ コンポーネント内で定義しない

```typescript
function Counter() {
  // ❌ 間違い：レンダリングのたびに新しい atom が作られる → 無限ループ
  const [count, setCount] = useAtom(atom(0));
  return <p>{count}</p>;
}
```

Atom はレンダリングの外（モジュールスコープ）で定義する必要があります。
コンポーネント内で動的に作りたい場合は `useMemo` で包むか、`atomFamily` を使います。

## useState vs Jotai 使い分けガイド

| 使い場面 | 推奨 | 理由 |
|----------|------|------|
| フォームの入力中テキスト | `useState` | そのコンポーネントだけで使う |
| モーダルの開閉状態 | `useState` | UI のローカルな状態 |
| ログインユーザー情報 | Jotai | 複数コンポーネントで参照 |
| カートの中身 | Jotai | 複数ページで共有 |
| テーマ（ダーク/ライト） | Jotai + `atomWithStorage` | 永続化が必要 |
| Todo リスト | Jotai + `atomWithStorage` | 共有 + 永続化 |

**指針:** 「他のコンポーネントでも使う？」→ Yes なら Jotai、No なら useState

## 派生Atom パターン一覧

```
┌─────────────────────────────────────────────────┐
│  Primitive Atom                                  │
│  atom(initialValue)                              │
│  → 基本的な状態の入れ物                             │
├─────────────────────────────────────────────────┤
│  Read-only Derived Atom                          │
│  atom((get) => get(baseAtom) * 2)                │
│  → 他の atom から計算した値を表示                     │
│  → 例: フィルタリング、合計計算、フォーマット変換       │
├─────────────────────────────────────────────────┤
│  Write-only Derived Atom                         │
│  atom(null, (_get, set, arg) => set(base, arg))  │
│  → 複数 atom をまとめて更新するアクション              │
│  → 例: リセット、一括更新、複雑なミューテーション        │
├─────────────────────────────────────────────────┤
│  Read-Write Derived Atom                         │
│  atom((get) => ..., (_get, set, val) => ...)     │
│  → 変換と逆変換を同時に定義                          │
│  → 例: 通貨変換、温度変換、単位変換                   │
└─────────────────────────────────────────────────┘
```

## ディレクトリ構成

```
src/app/examples/state-management/
├── jotai-basics/        # 初級：基本的な atom と useAtom
│   └── page.tsx
├── jotai-derived/       # 中級：派生Atom の3パターン
│   └── page.tsx
├── jotai-todo-app/      # 上級：実践的な Todo アプリ
│   └── page.tsx
└── README.md            # このファイル
```

## よくある質問

### Q: Provider は必要ですか？

**A:** 基本的には不要です。Jotai はデフォルトでグローバルな store を使用します。テストやサブツリー単位で状態を分離したい場合のみ `<Provider>` を使います。

### Q: Redux との違いは？

**A:** Redux は「ストア → アクション → リデューサー」の一方向データフローですが、Jotai は個別の atom を直接操作します。ボイラープレートが少なく、学習コストが低いのが特徴です。

### Q: Zustand との違いは？

**A:** Zustand はストア全体を一つのオブジェクトで管理しますが、Jotai は個別の atom を組み合わせるボトムアップアプローチです。コンポーネント単位の最適化が自動的に行われます。

### Q: Next.js の Server Components で使えますか？

**A:** 使えません。`useAtom` は React Hook なので、`"use client"` ディレクティブが必要です。サーバーサイドのデータ取得は Server Components で行い、クライアントサイドの状態管理に Jotai を使う、という組み合わせが推奨されます。

## 参考リンク

- [Jotai 公式サイト](https://jotai.org/)
- [Jotai GitHub](https://github.com/pmndrs/jotai)
- [Jotai ドキュメント - Core](https://jotai.org/docs/core/atom)
- [Jotai ドキュメント - Utilities](https://jotai.org/docs/utilities/storage)
- [Jotai ドキュメント - Async](https://jotai.org/docs/guides/async)
- [React 公式 - 状態管理](https://react.dev/learn/managing-state)
