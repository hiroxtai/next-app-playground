# Todo UI Contract

## Scope

この契約は、シンプルTodoアプリ画面におけるユーザー操作と可視結果の対応を定義する。

## Inputs

- Task title input
  - Type: string
  - Constraint: 1〜100文字
  - Reject: 空文字、空白のみ、101文字以上

## User Actions

1. Create task
- Trigger: 追加アクション（ボタンまたは送信）
- Preconditions: 入力が制約を満たす
- Postconditions:
  - 新規タスクが一覧へ追加される
  - 追加位置は作成順の末尾

2. Toggle completion
- Trigger: タスクの完了切替アクション
- Preconditions: 対象タスクが存在
- Postconditions:
  - 対象タスクの完了状態が反転
  - 一覧順は変化しない

3. Delete task
- Trigger: 削除アクション
- Preconditions: 対象タスクが存在
- Flow:
  - Step 1: 確認表示を出す
  - Step 2a: 承認時のみ削除を実行
  - Step 2b: キャンセル時は変更なし
- Postconditions:
  - 承認時のみ対象タスクが一覧から除去される

## Visible States

- List state
  - Tasks are shown in fixed creation order
- Empty state
  - 条件: タスク 0 件
  - 表示: 空状態メッセージ
- Validation state
  - 入力不正時に理由を明示
- Delete confirmation state
  - 削除確定前に承認/キャンセルを選べる

## Session Behavior

- ページを開いている間は状態を保持する
- フルリロード後は初期状態に戻る

## Non-goals

- 永続化（DB / localStorage / sessionStorage）
- 認証・マルチユーザー共有
- 一括操作、検索、フィルタ、ソート切替
