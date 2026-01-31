# カスタムフック

このページでは、React のカスタムフックを作成して、ロジックを再利用可能にする方法を学びます。

## 学習できること

- カスタムフックの基本的な作成方法
- `useLocalStorage`: ローカルストレージとの同期
- `useDebounce`: 入力値のデバウンス処理
- `useToggle`: ブール値の切り替え
- フックの命名規則（`use` プレフィックス）

## "use client" ディレクティブ

このページは **Client Component** です。

```tsx
"use client";
```

カスタムフックは `useState` や `useEffect` などの React フックを使用するため、Client Component として実装しています。

## カスタムフックとは

カスタムフックは、コンポーネント間でステートフルなロジックを再利用するための仕組みです。

### 命名規則

カスタムフックは必ず `use` で始める必要があります：

```tsx
// ✅ 正しい命名
function useLocalStorage() { ... }
function useDebounce() { ... }

// ❌ 間違った命名
function getLocalStorage() { ... }  // フックとして認識されない
```

## 実装例

### useLocalStorage

ローカルストレージと状態を同期するフック：

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore =
      value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
```

**使用例：**

```tsx
const [name, setName] = useLocalStorage("user-name", "");
```

### useDebounce

入力値の変更を遅延させるフック：

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**使用例：**

```tsx
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

// debouncedSearch は入力から500ms後に更新される
```

### useToggle

ブール値を簡単に切り替えるフック：

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}
```

**使用例：**

```tsx
const { value: isOpen, toggle, setFalse: close } = useToggle();

<button onClick={toggle}>メニュー開閉</button>
<button onClick={close}>閉じる</button>
```

## カスタムフックのベストプラクティス

| プラクティス | 説明 |
|-------------|------|
| 単一責任 | 1つのフックは1つの機能に集中 |
| 汎用性 | 特定のコンポーネントに依存しない |
| テスト可能 | 独立してテストできる設計 |
| 型安全 | TypeScript で型を明確に定義 |

## ポイント

1. **SSR 対応**: `typeof window === "undefined"` でサーバー側での実行を考慮
2. **クリーンアップ**: `useEffect` 内でタイマーやイベントリスナーを適切に解除
3. **メモ化**: `useCallback` や `useMemo` でパフォーマンス最適化
4. **依存配列**: `useEffect` の依存配列を正しく設定

## 参考リンク

- [React カスタムフック](https://ja.react.dev/learn/reusing-logic-with-custom-hooks)
- [useHooks](https://usehooks.com/) - カスタムフック集
- [ahooks](https://ahooks.js.org/) - 高品質なフックライブラリ
