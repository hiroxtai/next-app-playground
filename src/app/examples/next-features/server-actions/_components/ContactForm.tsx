"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { type ContactFormState, submitContactForm } from "../actions";

/**
 * お問い合わせフォームコンポーネント
 *
 * @remarks
 * useActionState を使用して Server Action の状態を管理します。
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState<
    ContactFormState | null,
    FormData
  >(submitContactForm, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">名前</Label>
        <Input
          id="name"
          name="name"
          placeholder="山田太郎"
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">メッセージ</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="お問い合わせ内容を入力してください..."
          rows={3}
          disabled={isPending}
          required
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            送信中...
          </>
        ) : (
          "送信"
        )}
      </Button>

      {state && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            state.success
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <XCircle className="size-4" />
          )}
          {state.message}
        </div>
      )}
    </form>
  );
}
