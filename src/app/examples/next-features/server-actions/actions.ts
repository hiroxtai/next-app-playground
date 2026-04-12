"use server";

import { z } from "zod";

/**
 * Server Actions 定義ファイル
 *
 * @remarks
 * "use server" ディレクティブにより、このファイル内の関数は
 * すべてサーバーサイドで実行される Server Actions になります。
 */

type ActionStatus = "idle" | "success" | "error";

interface ActionState {
  status: ActionStatus;
  message: string;
}

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "名前は2文字以上で入力してください" }),
  email: z
    .string()
    .trim()
    .email({ message: "正しいメールアドレスを入力してください" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "メッセージは10文字以上で入力してください" }),
});

const todoInputSchema = z.object({
  todo: z.string().trim().min(1, { message: "TODOを入力してください" }),
});

/**
 * FormData の値を安全に文字列へ変換します。
 */
function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Zod の先頭エラーメッセージを取得します。
 */
function getValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "入力内容を確認してください";
}

function createSuccessState(message: string): ActionState {
  return { status: "success", message };
}

function createErrorState(message: string): ActionState {
  return { status: "error", message };
}

// 連絡フォームの送信結果
export interface ContactFormState extends ActionState {}

/**
 * 連絡フォームを送信する Server Action
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // サーバーサイドでの処理をシミュレート（1秒待機）
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const validationResult = contactFormSchema.safeParse({
    name: getFormValue(formData, "name"),
    email: getFormValue(formData, "email"),
    message: getFormValue(formData, "message"),
  });

  if (!validationResult.success) {
    return createErrorState(getValidationMessage(validationResult.error));
  }

  // 実際のアプリケーションではここでデータベース保存やメール送信を行う
  console.log("Contact form submitted:", validationResult.data);

  return createSuccessState(
    `${validationResult.data.name} さん、お問い合わせありがとうございます！`,
  );
}

// TODOリストの状態
// useActionState のクライアント側ステートとして保持されるため、
// ページリロードでリセットされます。本番アプリではデータベース等への永続化が必要です。
export interface TodoItem {
  id: string;
  text: string;
}

export interface TodoState extends ActionState {
  todos: TodoItem[];
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

  const validationResult = todoInputSchema.safeParse({
    todo: getFormValue(formData, "todo"),
  });

  if (!validationResult.success) {
    return {
      ...prevState,
      ...createErrorState(getValidationMessage(validationResult.error)),
    };
  }

  const nextTodo: TodoItem = {
    id: crypto.randomUUID(),
    text: validationResult.data.todo,
  };

  return {
    todos: [...prevState.todos, nextTodo],
    ...createSuccessState(`「${nextTodo.text}」を追加しました`),
  };
}
