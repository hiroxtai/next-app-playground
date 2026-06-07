/**
 * シンプルTodoアプリのドメイン型定義。
 *
 * @remarks
 * 学習用の最小構成のため、永続化は行わずインメモリ状態のみを扱います。
 * ページをフルリロードすると状態は初期化されます（FR-009）。
 */

/**
 * 1件のタスクを表す型。
 *
 * @remarks
 * - `createdOrder` は作成順を示す連番で、一覧は常にこの昇順で固定表示します（FR-007）。
 */
export interface Task {
  /** 一覧内で一意な識別子 */
  id: string;
  /** 表示名（1〜100文字、空白のみ禁止） */
  title: string;
  /** 完了状態 */
  completed: boolean;
  /** 作成順を示す連番（表示順の固定に使用） */
  createdOrder: number;
}

/**
 * タイトル検証の結果。
 *
 * @remarks
 * 検証に失敗した場合、`reason` に表示用のエラーメッセージが入ります（FR-002）。
 */
export type TitleValidationResult =
  | { valid: true }
  | { valid: false; reason: string };
