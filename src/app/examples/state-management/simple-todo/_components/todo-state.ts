/**
 * タスク状態を操作する純粋関数群。
 *
 * @remarks
 * UI から状態遷移ロジックを分離することで、単体テストを容易にし、
 * 仕様（作成順固定・入力制約・完了切替・削除）の不変条件を一箇所に集約します。
 */

import type { Task, TitleValidationResult } from "./todo-types";

/** タスク名の最大文字数（仕様で確定: 1〜100文字） */
export const TITLE_MAX_LENGTH = 100;

/**
 * タスク名を検証します。
 *
 * @param rawTitle - 入力された生のタスク名
 * @returns 検証結果。失敗時は表示用の理由付き。
 *
 * @remarks
 * 空文字・空白のみ・100文字超を拒否します（FR-002）。
 * 文字数は前後の空白を除いた値で判定します。
 */
export function validateTitle(rawTitle: string): TitleValidationResult {
  const trimmed = rawTitle.trim();

  if (trimmed.length === 0) {
    return { valid: false, reason: "タスク名を入力してください。" };
  }

  if (trimmed.length > TITLE_MAX_LENGTH) {
    return {
      valid: false,
      reason: `タスク名は${TITLE_MAX_LENGTH}文字以内で入力してください。`,
    };
  }

  return { valid: true };
}

/**
 * 次の作成順の連番を求めます。
 *
 * @param tasks - 現在のタスク一覧
 * @returns 既存の最大 `createdOrder` + 1（空なら 1）
 */
function nextCreatedOrder(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.createdOrder), 0) + 1;
}

/**
 * タスクを末尾（作成順）に追加した新しい配列を返します。
 *
 * @param tasks - 現在のタスク一覧
 * @param rawTitle - 追加するタスク名
 * @param createId - 識別子生成関数（テスト時に差し替え可能）
 * @returns 追加後のタスク一覧
 *
 * @remarks
 * 呼び出し側は事前に {@link validateTitle} で検証してください。
 * タイトルは前後の空白を除いて保存します。
 */
export function addTask(
  tasks: Task[],
  rawTitle: string,
  createId: () => string,
): Task[] {
  const newTask: Task = {
    id: createId(),
    title: rawTitle.trim(),
    completed: false,
    createdOrder: nextCreatedOrder(tasks),
  };

  return [...tasks, newTask];
}

/**
 * 指定タスクの完了状態を反転した新しい配列を返します。
 *
 * @param tasks - 現在のタスク一覧
 * @param taskId - 対象タスクの識別子
 * @returns 完了状態を切り替えた一覧（順序は不変）
 *
 * @remarks
 * 表示順は `createdOrder` 昇順のまま維持されます（FR-007）。
 */
export function toggleTask(tasks: Task[], taskId: string): Task[] {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task,
  );
}

/**
 * 指定タスクを除外した新しい配列を返します。
 *
 * @param tasks - 現在のタスク一覧
 * @param taskId - 削除対象の識別子
 * @returns 対象を除いた一覧
 *
 * @remarks
 * 削除の確認（承認/キャンセル）は UI 側で制御します（FR-006）。
 * この関数は承認後の確定削除のみを担います。
 */
export function removeTask(tasks: Task[], taskId: string): Task[] {
  return tasks.filter((task) => task.id !== taskId);
}
