# useEffect ライフサイクル

このページでは、React の `useEffect` フックを使用した副作用の処理とコンポーネントのライフサイクル管理を学びます。

## 学習できること

- `useEffect` フックの基本的な使い方
- 依存配列の役割と使い分け
- クリーンアップ関数の重要性
- マウント/アンマウント時の処理

## "use client" ディレクティブ

このページは **Client Component** です。

```tsx
"use client";
```

`useEffect` は Client Component でのみ使用できます。

## useEffect の基本構文

```tsx
useEffect(() => {
  // 副作用の処理

  return () => {
    // クリーンアップ処理（オプション）
  };
}, [依存配列]);
```

## 依存配列のパターン

### 1. 空の配列 `[]` - マウント時のみ

```tsx
useEffect(() => {
  console.log("コンポーネントがマウントされました");

  return () => {
    console.log("コンポーネントがアンマウントされました");
  };
}, []); // 空の配列 = マウント時に1回だけ実行
```

### 2. 依存値あり `[value]` - 値の変更時

```tsx
useEffect(() => {
  console.log(`count が ${count} に変更されました`);
}, [count]); // count が変更されるたびに実行
```

### 3. 依存配列なし - 毎レンダー時

```tsx
useEffect(() => {
  console.log("毎回のレンダリング後に実行");
}); // 依存配列なし = 毎回実行（通常は非推奨）
```

## クリーンアップ関数

クリーンアップ関数は、コンポーネントがアンマウントされるとき、または次の effect が実行される前に呼び出されます。

### タイマーのクリーンアップ

```tsx
useEffect(() => {
  const intervalId = setInterval(() => {
    setTime(new Date());
  }, 1000);

  // クリーンアップ：インターバルを解除
  return () => {
    clearInterval(intervalId);
  };
}, []);
```

### イベントリスナーのクリーンアップ

```tsx
useEffect(() => {
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  // クリーンアップ：イベントリスナーを解除
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

## クリーンアップが必要なケース

| ケース | クリーンアップ処理 |
|--------|-------------------|
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `addEventListener` | `removeEventListener` |
| WebSocket 接続 | `connection.close()` |
| 購読（Subscription） | `unsubscribe()` |
| AbortController | `controller.abort()` |

## よくある間違い

### 依存配列の欠落

```tsx
// ❌ 悪い例：count を使っているのに依存配列に含めていない
useEffect(() => {
  console.log(count);
}, []); // ESLint が警告を出す

// ✅ 良い例
useEffect(() => {
  console.log(count);
}, [count]);
```

### 無限ループ

```tsx
// ❌ 悪い例：オブジェクトを依存配列に入れると毎回新しい参照になる
useEffect(() => {
  // ...
}, [{ key: "value" }]); // 毎回異なるオブジェクト = 無限ループ

// ✅ 良い例：useMemo で参照を安定させる
const config = useMemo(() => ({ key: "value" }), []);
useEffect(() => {
  // ...
}, [config]);
```

## ポイント

1. **最小限の依存**: 必要な依存のみを配列に含める
2. **クリーンアップは必須**: リソースリークを防ぐため必ず実装
3. **ESLint ルールに従う**: `eslint-plugin-react-hooks` の警告を無視しない
4. **データ取得は別の方法も検討**: Next.js では Server Components や `fetch` も選択肢

## 参考リンク

- [React useEffect](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
