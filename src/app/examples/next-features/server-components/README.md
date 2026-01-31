# Server Components

このページでは、Next.js App Router の Server Components の特徴と使い方を学びます。

## 学習できること

- Server Components と Client Components の違い
- Server Components のメリット
- 非同期データ取得の方法
- "use client" ディレクティブの使い方
- 使い分けのガイドライン

## Server Components とは

Server Components は、**サーバーサイドでのみ実行される** React コンポーネントです。Next.js App Router では、デフォルトですべてのコンポーネントが Server Component として扱われます。

```tsx
// これは Server Component（デフォルト）
export default function Page() {
  return <div>サーバーで実行されます</div>;
}
```

## Server Components のメリット

### 1. バンドルサイズの削減

```tsx
// この重いライブラリはクライアントに送信されない
import { heavyLibrary } from "heavy-library";

export default function Page() {
  const result = heavyLibrary.process();
  return <div>{result}</div>;
}
```

### 2. 直接データアクセス

```tsx
// データベースに直接アクセス可能
import { db } from "@/lib/db";

export default async function Page() {
  const users = await db.user.findMany();
  return <UserList users={users} />;
}
```

### 3. セキュリティ向上

```tsx
// APIキーがクライアントに露出しない
const API_KEY = process.env.SECRET_API_KEY;

export default async function Page() {
  const data = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  return <div>{data}</div>;
}
```

### 4. 高速な初期表示

サーバーで HTML を生成してからクライアントに送信するため、初期表示が高速です。

## 非同期データ取得

Server Components では、コンポーネント自体を `async` 関数にできます。

```tsx
// Server Component は async にできる！
export default async function Page() {
  // await を直接使える
  const data = await fetch("https://api.example.com/data");
  const json = await data.json();

  return <div>{json.title}</div>;
}
```

## Client Components との使い分け

### Server Component を使う場合

- データ取得が必要
- バックエンドリソース（DB、ファイルシステム）にアクセス
- 機密情報（APIキー、トークン）を使用
- 重い依存関係を使用
- インタラクションが不要

### Client Component を使う場合

- イベントハンドラが必要（onClick, onChange など）
- React Hooks を使用（useState, useEffect など）
- ブラウザ API を使用（localStorage, window など）
- リアルタイム更新が必要

## Client Component の宣言

ファイルの先頭に `"use client"` を追加すると Client Component になります。

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## コンポーネントの組み合わせ

Server Component の中で Client Component を使用できます。

```tsx
// page.tsx (Server Component)
import { ClientButton } from "./ClientButton";

export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <h1>{data.title}</h1>
      {/* Client Component を子として使用 */}
      <ClientButton />
    </div>
  );
}
```

```tsx
// ClientButton.tsx (Client Component)
"use client";

export function ClientButton() {
  return <button onClick={() => alert("クリック!")}>ボタン</button>;
}
```

## ポイント

1. **デフォルトは Server**: 明示的に `"use client"` を追加しない限り Server Component
2. **Client の境界**: `"use client"` を追加したファイルとその子は全て Client Component
3. **Props の受け渡し**: Server から Client へは シリアライズ可能な値のみ渡せる
4. **最小限の Client**: できるだけ Server Component を使い、必要な部分だけ Client にする

## 参考リンク

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Server Components](https://react.dev/reference/rsc/server-components)
