# Feature Specification: シンプルTodoアプリ

**Feature Branch**: `001-pre-specify-hook`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "学習向けの簡易的アプリとしてシンプルなTodoアプリを作成したい。タスクの作成・完了・削除ができるWebアプリケーションである。"

## Clarifications

### Session 2026-06-07

- Q: FR-009 の「セッション内保持」はどの保持範囲か？ → A: ページを開いている間のみ保持し、再読み込みで初期化する
- Q: タスク削除時の挙動はどうするか？ → A: 削除時に確認を表示し、承認時のみ削除する
- Q: タスク一覧の並び順はどうするか？ → A: 作成順で固定表示し、完了切替後も並び順を変えない
- Q: タスク名の文字数制約はどうするか？ → A: 1〜100文字に制限する

## User Scenarios & Testing *(mandatory)*

### User Story 1 - タスクを作成する (Priority: P1)

学習者として、新しいタスクを入力して追加し、やるべきことを一覧に残したい。

**Why this priority**: 作成機能がないとTodoアプリとして価値が成立しないため。

**Independent Test**: 空でないテキストを入力して追加操作を行い、一覧に新規タスクが表示されれば独立して価値を確認できる。

**Acceptance Scenarios**:

1. **Given** タスク一覧が表示されている, **When** ユーザーがタスク名を入力して追加する, **Then** 新しい未完了タスクが一覧の末尾に表示される
2. **Given** 入力欄が空文字または空白のみ, **When** ユーザーが追加を実行する, **Then** タスクは追加されず入力不備が明確に示される
3. **Given** 入力テキストが100文字を超えている, **When** ユーザーが追加を実行する, **Then** タスクは追加されず文字数制約が明確に示される

---

### User Story 2 - タスク完了状態を切り替える (Priority: P2)

利用者として、やり終えたタスクを完了にして進捗を把握したい。

**Why this priority**: Todoの主要価値である進捗管理を成立させるために必須の操作だから。

**Independent Test**: 既存タスクの完了状態を操作し、表示上の状態が未完了/完了で切り替わることを確認できれば独立検証できる。

**Acceptance Scenarios**:

1. **Given** 未完了タスクが一覧にある, **When** ユーザーが完了操作を行う, **Then** そのタスクは完了状態として視覚的に区別される
2. **Given** 完了済みタスクが一覧にある, **When** ユーザーが再度同じ操作を行う, **Then** 未完了状態に戻る
3. **Given** 複数タスクが作成順で表示されている, **When** ユーザーが任意タスクの完了状態を切り替える, **Then** 一覧の表示順は作成順のまま維持される

---

### User Story 3 - タスクを削除する (Priority: P3)

利用者として、不要になったタスクを削除し、一覧を整理したい。

**Why this priority**: 作成・完了に比べると優先度は下がるが、一覧を保守するための基本機能だから。

**Independent Test**: 任意のタスクに削除操作を行い、一覧から消えることを確認できれば独立検証できる。

**Acceptance Scenarios**:

1. **Given** 複数のタスクが表示されている, **When** ユーザーが1件の削除操作後に確認を承認する, **Then** 対象タスクのみ一覧から除外される
2. **Given** タスク削除の確認が表示されている, **When** ユーザーがキャンセルする, **Then** 一覧は変更されない
3. **Given** 最後の1件を削除確認で承認する, **When** 削除が完了する, **Then** 空状態メッセージが表示される

---

### Edge Cases

- タスク名が100文字を超える場合、追加を拒否し制約を明示すること。
- 同一タスク名が複数ある場合でも、完了切替・削除が意図した1件にのみ適用されること。
- タスクが0件の状態で完了切替や削除操作UIが誤って表示されないこと。
- 連続で素早く追加操作した場合でも、重複追加や表示不整合が発生しないこと。
- 削除確認ダイアログでキャンセルした場合に、タスク状態が変化しないこと。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new task by entering text and submitting it.
- **FR-002**: System MUST reject empty, whitespace-only, or over-100-character task input and communicate why creation failed.
- **FR-003**: System MUST display created tasks in a visible list with each task identifiable as an individual item.
- **FR-004**: Users MUST be able to mark any existing task as completed.
- **FR-005**: Users MUST be able to revert a completed task back to incomplete.
- **FR-006**: Users MUST be able to delete any existing task from the list only after an explicit delete confirmation step.
- **FR-007**: System MUST update the displayed task list immediately after create, complete-toggle, and delete actions while preserving fixed creation-order display.
- **FR-008**: System MUST present an explicit empty-state message when no tasks exist.
- **FR-009**: System MUST preserve task state only while the current page session remains open, and MUST reset task state after a full page reload.

### Key Entities *(include if feature involves data)*

- **Task**: ユーザーが管理する1件のTodo。主要属性は識別子、表示名、完了状態、作成順序。
- **TaskCollection**: 画面上に表示されるTaskの集合。追加・状態切替・削除の操作対象。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 初回利用者の90%以上が、1分以内に最初のタスク作成を完了できる。
- **SC-002**: タスク作成・完了切替・削除の各操作後、1秒以内に一覧表示へ結果が反映される。
- **SC-003**: 主要3操作（作成、完了切替、削除）の成功率が、通常操作条件で95%以上となる。
- **SC-004**: 利用者テストで、80%以上が「進捗が把握しやすい」と評価する。

## Assumptions

- 本機能は学習用途の単一ユーザー向けで、認証やユーザー間共有は対象外とする。
- 対象範囲はWebブラウザ上の基本操作であり、オフライン同期や外部連携は対象外とする。
- タスクは短文を想定し、リッチテキスト編集や添付情報は扱わない。
- 永続化要件は今回の入力に含まれないため、ページ再読み込み後は初期状態に戻る前提とする。
