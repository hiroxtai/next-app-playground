# Suspense とローディング

このページでは、React Suspense を使用した非同期コンポーネントのローディング状態管理を学びます。

## 学習できること

- React Suspense の基本概念
- Server Components での非同期処理
- Skeleton UI によるローディング表示
- ストリーミング SSR の仕組み
- 複数の Suspense 境界の使い分け

## Suspense とは

Suspense は、コンポーネントが準備できるまで「待機」し、その間にフォールバック UI を表示する React の機能です。

```tsx
import { Suspense } from "react";

<Suspense fallback={<LoadingSkeleton />}>
  <AsyncComponent />
</Suspense>
```

## Server Components での非同期処理

Next.js の Server Components では、コンポーネント自体を `async` 関数として定義できます：

```tsx
// これは Server Component（async 関数）
export async function UserProfile() {
  // データベースアクセスをシミュレート
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const user = await fetchUser();

  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

## 実装例

### 基本的な Suspense 境界

```tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Suspense fallback={<CardSkeleton />}>
        <FastComponent />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

### Skeleton コンポーネント

```tsx
function CardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
```

### 非同期コンポーネント

```tsx
export async function FastComponent() {
  // 500ms の遅延
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div>
      <p>高速コンポーネント</p>
      <p>500ms で読み込まれました</p>
    </div>
  );
}

export async function SlowComponent() {
  // 2秒の遅延
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div>
      <p>遅いコンポーネント</p>
      <p>2秒で読み込まれました</p>
    </div>
  );
}
```

## ストリーミング SSR

Suspense を使用すると、Next.js は HTML をストリーミングで送信します：

```
1. 初期 HTML（Skeleton 付き）が即座に送信される
2. FastComponent の準備が完了 → HTML に挿入
3. SlowComponent の準備が完了 → HTML に挿入
```

これにより、ユーザーは全てのデータが揃う前にページを見ることができます。

## Suspense 境界の戦略

| パターン | 説明 | 用途 |
|---------|------|------|
| ページ全体 | 1つの Suspense でページ全体をラップ | シンプルなページ |
| セクション単位 | 各セクションに Suspense | ダッシュボード |
| コンポーネント単位 | 個別コンポーネントに Suspense | 独立したウィジェット |

### 推奨パターン

```tsx
// ✅ 良い例：独立したコンポーネントごとに Suspense
<div className="grid grid-cols-2 gap-4">
  <Suspense fallback={<UserSkeleton />}>
    <UserProfile />
  </Suspense>
  <Suspense fallback={<StatsSkeleton />}>
    <UserStats />
  </Suspense>
</div>

// ❌ 避けるべき例：全体を1つの Suspense でラップ
<Suspense fallback={<PageSkeleton />}>
  <UserProfile />
  <UserStats />
</Suspense>
```

## loading.tsx との違い

| 機能 | loading.tsx | Suspense |
|------|------------|----------|
| スコープ | ルートセグメント全体 | Suspense 境界内 |
| 自動化 | 自動的に適用 | 明示的に配置 |
| 柔軟性 | 低い | 高い |
| 用途 | ページ遷移 | 部分的なローディング |

## ポイント

1. **適切な粒度**: Suspense 境界は細かすぎても粗すぎても良くない
2. **ネスト**: Suspense はネスト可能、内側から順に解決
3. **エラー境界**: `error.tsx` と組み合わせてエラーハンドリング
4. **キャッシュ**: 同じデータは自動的にキャッシュされる

## 参考リンク

- [React Suspense](https://ja.react.dev/reference/react/Suspense)
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Streaming SSR](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
