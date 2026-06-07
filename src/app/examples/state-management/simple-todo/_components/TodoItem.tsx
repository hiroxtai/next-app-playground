"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { Task } from "./todo-types";

/**
 * 1件のタスク行を表示するコンポーネント。
 *
 * @remarks
 * 完了切替と削除要求は親へコールバックで委譲し、この行自体は状態を持ちません。
 * 完了状態は取り消し線（視覚）と `aria-checked`（セマンティック）の両方で表現します。
 *
 * @param task - 表示対象のタスク
 * @param onToggle - 完了状態の切替要求（FR-004 / FR-005）
 * @param onRequestDelete - 削除確認を開く要求（FR-006）
 */
export function TodoItem({
  task,
  onToggle,
  onRequestDelete,
}: {
  task: Task;
  onToggle: (taskId: string) => void;
  onRequestDelete: (taskId: string) => void;
}) {
  const checkboxId = `todo-${task.id}`;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <Checkbox
        id={checkboxId}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`「${task.title}」を完了にする`}
      />

      <label
        htmlFor={checkboxId}
        className={cn(
          "flex-1 cursor-pointer text-sm",
          task.completed
            ? "text-zinc-400 line-through dark:text-zinc-500"
            : "text-zinc-900 dark:text-zinc-100",
        )}
      >
        {task.title}
      </label>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRequestDelete(task.id)}
        aria-label={`「${task.title}」を削除する`}
      >
        <Trash2 className="size-4 text-zinc-500" />
      </Button>
    </li>
  );
}
