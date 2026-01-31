# useState カウンター

このページでは、React の `useState` フックを使用した状態管理の基礎を学びます。

## 学習できること

- `useState` フックの基本的な使い方
- 数値、オブジェクト、配列の状態管理
- イミュータブルな状態更新パターン
- イベントハンドラとの連携

## "use client" ディレクティブ

このページは **Client Component** です。

```tsx
"use client";
```

`useState` などの React Hooks は Client Component でのみ使用できます。

## useState の基本

```tsx
const [state, setState] = useState(初期値);
```

- `state`: 現在の状態値
- `setState`: 状態を更新する関数
- `初期値`: 状態の初期値

## 使用例

### 数値の状態管理

```tsx
const [count, setCount] = useState(0);

// インクリメント
setCount(count + 1);

// デクリメント
setCount(count - 1);

// リセット
setCount(0);
```

### オブジェクトの状態管理

```tsx
const [user, setUser] = useState({ name: "", age: 0 });

// 特定のプロパティのみ更新（スプレッド構文）
setUser({ ...user, name: "太郎" });

// 複数プロパティを更新
setUser({ ...user, name: "太郎", age: 25 });
```

> **重要**: オブジェクトを直接変更してはいけません。必ず新しいオブジェクトを作成します。

### 配列の状態管理

```tsx
const [items, setItems] = useState<string[]>([]);

// 要素を追加
setItems([...items, "新しいアイテム"]);

// 要素を削除（index位置の要素を除外）
setItems(items.filter((_, i) => i !== index));

// 要素を更新
setItems(items.map((item, i) => (i === index ? "更新後" : item)));
```

## イミュータブル更新の重要性

React は状態の変更を **参照の比較** で検出します。そのため、オブジェクトや配列を直接変更しても再レンダリングされません。

```tsx
// ❌ 悪い例（直接変更）
user.name = "太郎";
setUser(user); // 再レンダリングされない！

// ✅ 良い例（新しいオブジェクトを作成）
setUser({ ...user, name: "太郎" }); // 再レンダリングされる
```

## 関数型更新

前の状態に基づいて更新する場合は、関数型更新を使うと安全です。

```tsx
// 通常の更新
setCount(count + 1);

// 関数型更新（推奨）
setCount((prevCount) => prevCount + 1);
```

関数型更新は、非同期処理や連続した更新で古い状態を参照してしまう問題を防ぎます。

## ポイント

1. **初期値の型**: TypeScript では `useState<型>(初期値)` で型を明示できる
2. **遅延初期化**: 重い計算は `useState(() => 計算())` で遅延実行可能
3. **状態の分割**: 関連する状態はまとめ、独立した状態は分割する

## 参考リンク

- [React useState](https://react.dev/reference/react/useState)
- [Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
