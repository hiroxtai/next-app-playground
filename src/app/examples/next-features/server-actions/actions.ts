"use server";

/**
 * Server Actions 定義ファイル
 *
 * @remarks
 * "use server" ディレクティブにより、このファイル内の関数は
 * すべてサーバーサイドで実行される Server Actions になります。
 */

import { logger } from "@/lib/logger";

// 連絡フォームの送信結果
export interface ContactFormState {
  success: boolean;
  message: string;
}

/**
 * 連絡フォームを送信する Server Action
 */
export async function submitContactForm(
  _prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  // サーバーサイドでの処理をシミュレート（1秒待機）
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // バリデーション
  if (!name || name.length < 2) {
    return {
      success: false,
      message: "名前は2文字以上で入力してください",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "正しいメールアドレスを入力してください",
    };
  }

  if (!message || message.length < 10) {
    return {
      success: false,
      message: "メッセージは10文字以上で入力してください",
    };
  }

  // 実際のアプリケーションではここでデータベース保存やメール送信を行う
  logger.info({ name, email, message }, "お問い合わせフォームが送信されました");

  return {
    success: true,
    message: `${name} さん、お問い合わせありがとうございます！`,
  };
}

// TODOリストの状態
export interface TodoState {
  todos: string[];
  message: string;
}

/**
 * TODOを追加する Server Action
 */
export async function addTodo(
  prevState: TodoState,
  formData: FormData,
): Promise<TodoState> {
  // サーバーサイドでの処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 300));

  const todo = formData.get("todo") as string;

  if (!todo || todo.trim().length === 0) {
    return {
      ...prevState,
      message: "TODOを入力してください",
    };
  }

  return {
    todos: [...prevState.todos, todo.trim()],
    message: `「${todo.trim()}」を追加しました`,
  };
}
