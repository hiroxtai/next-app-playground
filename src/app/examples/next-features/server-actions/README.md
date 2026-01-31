# Server Actions

このページでは、Next.js の Server Actions を使用してフォーム送信とサーバー処理を統合する方法を学びます。

## 学習できること

- Server Actions の基本概念と使い方
- `"use server"` ディレクティブ
- `useActionState` フックによるフォーム状態管理
- フォームバリデーションの実装
- プログレッシブエンハンスメント

## Server Actions とは

Server Actions は、フォーム送信などのミューテーション（データ変更）をサーバーサイドで処理するための機能です。API ルートを別途作成せずに、サーバー処理を直接コンポーネントから呼び出せます。

## "use server" ディレクティブ

Server Actions は `"use server"` ディレクティブで定義します：

```tsx
// actions.ts
"use server";

export async function submitForm(formData: FormData) {
  const name = formData.get("name") as string;
  // サーバーサイドの処理...
  return { success: true };
}
```

## 実装例

### 基本的な Server Action

```tsx
// actions.ts
"use server";

interface FormState {
  success: boolean;
  message: string;
}

export async function submitContactForm(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // バリデーション
  if (!name || name.length < 2) {
    return { success: false, message: "名前は2文字以上で入力してください" };
  }

  // 処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, message: "送信が完了しました" };
}
```

### useActionState による状態管理

```tsx
"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );

  return (
    <form action={formAction}>
      <input name="name" placeholder="名前" required />
      <input name="email" type="email" placeholder="メール" required />

      <button type="submit" disabled={isPending}>
        {isPending ? "送信中..." : "送信"}
      </button>

      {state?.message && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

### 累積的な状態管理（Todo リスト）

```tsx
// actions.ts
"use server";

interface TodoState {
  todos: { id: string; text: string; completed: boolean }[];
}

export async function addTodo(
  prevState: TodoState,
  formData: FormData
): Promise<TodoState> {
  const text = formData.get("todo") as string;

  const newTodo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };

  return {
    todos: [...prevState.todos, newTodo],
  };
}
```

## Server Actions vs API Routes

| 特徴 | Server Actions | API Routes |
|------|---------------|------------|
| ファイル | コンポーネントと同じファイルまたは別ファイル | `/app/api/` ディレクトリ |
| 呼び出し | form action または直接呼び出し | fetch() |
| 型安全性 | TypeScript で型推論可能 | 手動で型定義が必要 |
| プログレッシブ | JavaScript 無効でも動作 | JavaScript 必須 |

## useActionState のシグネチャ

```tsx
const [state, formAction, isPending] = useActionState(
  action,      // Server Action 関数
  initialState // 初期状態
);
```

- `state`: 現在の状態（Action の戻り値）
- `formAction`: form の action に渡す関数
- `isPending`: 処理中かどうかのフラグ

## ポイント

1. **バリデーション**: クライアントとサーバー両方でバリデーションを行う
2. **エラーハンドリング**: try-catch でエラーを適切にキャッチ
3. **楽観的更新**: `useOptimistic` と組み合わせて UX を向上
4. **リバリデーション**: `revalidatePath()` でキャッシュを更新

## セキュリティ上の注意

```tsx
"use server";

import { cookies } from "next/headers";

export async function sensitiveAction(formData: FormData) {
  // 認証チェックを必ず行う
  const session = await getSession(cookies());
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 処理を続行...
}
```

## 参考リンク

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useActionState](https://react.dev/reference/react/useActionState)
- [フォームとミューテーション](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)
