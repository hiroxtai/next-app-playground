"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { TodoItem } from "./TodoItem";
import { addTask, removeTask, toggleTask, validateTitle } from "./todo-state";
import type { Task } from "./todo-types";

/**
 * シンプルTodoアプリ本体。
 *
 * @remarks
 * 状態はインメモリ（`useState`）のみで保持し、ページをフルリロードすると
 * 初期状態に戻ります（FR-009）。永続化は意図的に行いません。
 *
 * 担当する要件:
 * - 作成と入力検証（US1 / FR-001, FR-002, FR-003）
 * - 完了状態の切替と作成順固定（US2 / FR-004, FR-005, FR-007）
 * - 削除確認フローと空状態表示（US3 / FR-006, FR-008）
 */
export function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const inputId = useId();
  const errorId = useId();

  /** 削除確認中のタスク（存在しなければ null） */
  const pendingDeleteTask =
    pendingDeleteId === null
      ? null
      : (tasks.find((task) => task.id === pendingDeleteId) ?? null);

  /**
   * 入力されたタスクを検証し、問題なければ作成順の末尾に追加します。
   */
  const handleAddTask = (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateTitle(draftTitle);
    if (!result.valid) {
      setErrorMessage(result.reason);
      return;
    }

    setTasks((current) =>
      addTask(current, draftTitle, () => crypto.randomUUID()),
    );
    setDraftTitle("");
    setErrorMessage(null);
  };

  /** 完了状態を切り替えます（表示順は変えません）。 */
  const handleToggle = (taskId: string) => {
    setTasks((current) => toggleTask(current, taskId));
  };

  /** 削除確認ダイアログを開きます（この時点では削除しません）。 */
  const handleRequestDelete = (taskId: string) => {
    setPendingDeleteId(taskId);
  };

  /** 削除を承認し、対象タスクを確定削除します。 */
  const handleConfirmDelete = () => {
    if (pendingDeleteId === null) return;

    setTasks((current) => removeTask(current, pendingDeleteId));
    setPendingDeleteId(null);
  };

  /** 削除をキャンセルし、一覧を変更しません。 */
  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  const isEmpty = tasks.length === 0;

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <form onSubmit={handleAddTask} className="space-y-2">
        <div className="flex gap-2">
          <Input
            id={inputId}
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            placeholder="新しいタスクを入力..."
            aria-label="新しいタスク"
            aria-invalid={errorMessage !== null}
            aria-describedby={errorMessage ? errorId : undefined}
          />
          <Button type="submit" className="gap-1">
            <Plus className="size-4" />
            追加
          </Button>
        </div>

        {errorMessage && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </form>

      {/* タスク一覧 / 空状態 */}
      {isEmpty ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          タスクはまだありません。最初のタスクを追加しましょう。
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onRequestDelete={handleRequestDelete}
            />
          ))}
        </ul>
      )}

      {/* 削除確認ダイアログ */}
      <Dialog
        open={pendingDeleteTask !== null}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>タスクを削除しますか？</DialogTitle>
            <DialogDescription>
              「{pendingDeleteTask?.title}
              」を削除します。この操作は元に戻せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
