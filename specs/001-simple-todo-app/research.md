# Research: シンプルTodoアプリ

## Decision 1: 状態保持方式はインメモリのみ

- Decision: タスク状態はクライアント側のインメモリ状態で管理し、ページ再読み込みで初期化する。
- Rationale: 仕様の Clarification で保持範囲が「ページを開いている間のみ」と確定しており、学習向け簡易実装に最も適合するため。
- Alternatives considered:
  - localStorage 永続化: 学習初期段階で責務が増え、今回要件外。
  - sessionStorage 永続化: 再訪問時の復元要件が発生し、仕様と乖離。

## Decision 2: 一覧順は作成順固定

- Decision: タスク一覧は作成順で固定表示し、完了状態の切替で並べ替えない。
- Rationale: Clarification で明示され、ユーザー期待とテスト観点を単純化できる。
- Alternatives considered:
  - 未完了優先ソート: 進捗把握には有効だが、仕様確定事項と不一致。
  - 新規先頭表示: 更新順と作成順が混ざり、学習時の理解負荷が増える。

## Decision 3: 削除は確認ダイアログ必須

- Decision: 削除操作時は確認ステップを経て、承認時のみ削除を実行する。
- Rationale: Clarification で確定済み。誤操作防止を要件レベルで担保できる。
- Alternatives considered:
  - 即時削除: 学習用でも誤削除リスクが高い。
  - Undo 方式: 実装が増え、今回の簡易範囲を超える。

## Decision 4: 入力制約は 1〜100 文字

- Decision: タスク名は 1〜100 文字に制限し、違反時は追加を拒否して理由を表示する。
- Rationale: Clarification で確定済み。UI崩れと異常入力の境界が明確になる。
- Alternatives considered:
  - 1〜200 文字: 表示崩れ検討範囲が広がる。
  - 上限なし: 学習用途でもバリデーション意図が不明瞭になる。

## Decision 5: テスト戦略は unit 中心

- Decision: Vitest + React Testing Library で、作成・完了切替・削除確認・入力制約・空状態を unit テストで担保する。
- Rationale: 既存プロジェクトの標準テスト基盤と一致し、機能規模に対して十分。
- Alternatives considered:
  - E2E のみ: 学習コストと実行コストが高い。
  - 手動検証のみ: 回帰防止が弱く、要件トレーサビリティが落ちる。
