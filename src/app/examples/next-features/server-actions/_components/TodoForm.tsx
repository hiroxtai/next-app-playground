"use client";

import { Loader2, Plus } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { addTodo, type TodoState } from "../actions";

/**
 * TODOリストフォームコンポーネント
 *
 * @remarks
 * useActionState を使用して Server Action の状態を累積的に管理します。
 */
export function TodoForm() {
  const initialState: TodoState = {
    todos: [],
    message: "",
  };

  const [state, formAction, isPending] = useActionState<TodoState, FormData>(
    addTodo,
    initialState,
  );

  return (
    <div className="space-y-4">
      <form action={formAction} className="flex gap-2">
        <Input
          name="todo"
          placeholder="新しいTODOを入力..."
          disabled={isPending}
        />
        <Button type="submit" size="icon" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      </form>

      {state.message && (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      )}

      <ul className="space-y-2">
        {state.todos.map((todo, index) => (
          <li
            key={`todo-${todo}-${index}`}
            className="rounded-lg bg-muted px-4 py-2 text-sm"
          >
            {todo}
          </li>
        ))}
        {state.todos.length === 0 && (
          <li className="text-center text-sm text-muted-foreground">
            TODOがありません
          </li>
        )}
      </ul>

      <div className="rounded-lg bg-muted p-3">
        <p className="text-xs text-muted-foreground">
          TODO数: {state.todos.length}
        </p>
      </div>
    </div>
  );
}
