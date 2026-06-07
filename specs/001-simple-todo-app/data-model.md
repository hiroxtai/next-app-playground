# Data Model: シンプルTodoアプリ

## Entity: Task

- Purpose: ユーザーが管理する単一タスクを表現する。
- Fields:
  - id: string（一覧内で一意な識別子）
  - title: string（1〜100文字、空白のみ禁止）
  - completed: boolean（完了状態）
  - createdOrder: number（作成順を示す連番）
- Validation rules:
  - title.trim().length >= 1
  - title.length <= 100
  - id は TaskCollection 内で重複不可
- State transitions:
  - created -> active(completed=false)
  - active -> completed(completed=true)
  - completed -> active(completed=false)
  - active/completed -> removed(一覧から削除)

## Entity: TaskCollection

- Purpose: 画面に表示される Task の集合を管理する。
- Invariants:
  - 表示順は createdOrder 昇順（作成順固定）
  - 完了切替で表示順は変化しない
  - 削除は確認承認後のみ反映
  - フルリロード後は初期状態（空）
- Derived state:
  - isEmpty: tasks.length === 0
  - completedCount: tasks.filter(t => t.completed).length
  - activeCount: tasks.filter(t => !t.completed).length

## Actions and Effects

- addTask(title)
  - Precondition: title がバリデーションを満たす
  - Effect: 新規 Task を末尾（最大 createdOrder + 1）で追加
- toggleTask(taskId)
  - Precondition: taskId が存在
  - Effect: completed を反転
- requestDelete(taskId)
  - Precondition: taskId が存在
  - Effect: 削除確認状態に遷移（未削除）
- confirmDelete(taskId)
  - Precondition: 対応する削除確認が承認済み
  - Effect: Task をコレクションから除去
- cancelDelete(taskId)
  - Effect: 一覧に変更を加えず確認状態のみ解除
