# Tasks: シンプルTodoアプリ

**Input**: Design documents from `/specs/001-simple-todo-app/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 仕様と research.md で unit テスト方針が明示されているため、各ユーザーストーリーに対応するテストタスクを含める。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Todo サンプルページを追加するための最小セットアップ

- [X] T001 Create simple todo page scaffold in src/app/examples/state-management/simple-todo/page.tsx and src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
- [X] T002 Register simple todo page metadata entry in src/app/_lib/catalog-data.ts
- [X] T003 Align catalog page count assertions for new entry in src/app/_lib/catalog-data.test.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのユーザーストーリー実装で共有する基盤を先に整備する

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define Task and delete-confirmation domain types in src/app/examples/state-management/simple-todo/_components/todo-types.ts
- [X] T005 [P] Implement pure task state transition helpers in src/app/examples/state-management/simple-todo/_components/todo-state.ts
- [X] T006 [P] Create reusable task row component API in src/app/examples/state-management/simple-todo/_components/TodoItem.tsx
- [X] T007 Compose base TodoApp screen layout and sections in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
- [X] T008 Wire page-level metadata and TodoApp mount in src/app/examples/state-management/simple-todo/page.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - タスクを作成する (Priority: P1) 🎯 MVP

**Goal**: 学習者がタスクを追加でき、入力制約違反時は明確なエラーを確認できる

**Independent Test**: 1〜100文字入力で追加成功、空白/空/101文字以上で追加失敗し理由表示を確認

### Tests for User Story 1

- [X] T009 [US1] Add unit tests for task creation success and validation failures in src/app/examples/state-management/simple-todo/_components/TodoApp.test.tsx

### Implementation for User Story 1

- [X] T010 [US1] Implement input validation rules (trim, min/max length) and error messaging in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
- [X] T011 [US1] Implement add-task flow appending tasks by creation order in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
- [X] T012 [US1] Render created task items with stable ids via src/app/examples/state-management/simple-todo/_components/TodoItem.tsx

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - タスク完了状態を切り替える (Priority: P2)

**Goal**: 利用者が完了/未完了を切り替えられ、表示順が作成順で固定される

**Independent Test**: 任意タスクを完了↔未完了に切替でき、切替後も並び順不変を確認

### Tests for User Story 2

- [X] T013 [US2] Add unit tests for completion toggling and creation-order invariance in src/app/examples/state-management/simple-todo/_components/TodoApp.test.tsx

### Implementation for User Story 2

- [X] T014 [US2] Add completion toggle UI controls to each task in src/app/examples/state-management/simple-todo/_components/TodoItem.tsx
- [X] T015 [US2] Wire toggle handlers through state helpers in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
- [X] T016 [US2] Add completed-state visual/semantic representation in src/app/examples/state-management/simple-todo/_components/TodoItem.tsx

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - タスクを削除する (Priority: P3)

**Goal**: 利用者が削除確認を経てタスクを削除でき、キャンセル時は変更されない

**Independent Test**: 削除確認の承認で削除・キャンセルで無変更、最後の1件削除後に空状態表示を確認

### Tests for User Story 3

- [X] T017 [US3] Add unit tests for delete confirmation approve/cancel and final empty-state behavior in src/app/examples/state-management/simple-todo/_components/TodoApp.test.tsx

### Implementation for User Story 3

- [X] T018 [US3] Implement delete request and confirmation UI flow in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
- [X] T019 [US3] Implement confirm/cancel delete transitions in src/app/examples/state-management/simple-todo/_components/todo-state.ts
- [X] T020 [US3] Implement post-delete empty-state message behavior in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 文書整合と最終検証

- [X] T021 [P] Update state management example index guidance for the new todo page in src/app/examples/state-management/README.md
- [X] T022 Run unit test suite and address failures relevant to new feature in src/app/examples/state-management/simple-todo/_components/TodoApp.test.tsx
- [X] T023 Run type/lint quality gates and resolve issues in src/app/examples/state-management/simple-todo/page.tsx
- [X] T024 Add explicit reload-reset verification test for FR-009 in src/app/examples/state-management/simple-todo/_components/TodoApp.test.tsx
- [X] T025 Add measurable interaction latency check (<1s) for SC-002 in src/app/examples/state-management/simple-todo/_components/TodoApp.test.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3+ (User Stories)**: Depend on Phase 2 completion; proceed in priority order for MVP
- **Phase 6 (Polish)**: Depends on completion of selected user stories

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on other stories
- **US2 (P2)**: Starts after Phase 2; depends functionally on shared task list from US1 but independently testable
- **US3 (P3)**: Starts after Phase 2; depends functionally on existing task items and independently testable

### Within Each User Story

- Tests should be implemented before or alongside implementation and must pass at checkpoint
- UI event wiring depends on shared state helper availability
- Story is complete only when independent test criteria are met

### Parallel Opportunities

- T005 and T006 can run in parallel (different files, same phase)
- In polish, T021 can run in parallel with verification tasks T022/T023/T024/T025
- After Phase 2, different developers can implement US2 and US3 in parallel while preserving story checkpoints

---

## Parallel Example: User Story 2

```bash
# Parallelizable tasks after US2 test scaffold is in place:
Task: T014 Add completion toggle UI controls in src/app/examples/state-management/simple-todo/_components/TodoItem.tsx
Task: T015 Wire toggle handlers in src/app/examples/state-management/simple-todo/_components/TodoApp.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate US1 independently against its acceptance scenarios

### Incremental Delivery

1. Deliver MVP with US1 (task creation + validation)
2. Add US2 (completion toggle, order invariance)
3. Add US3 (delete confirmation flow)
4. Finish with Phase 6 quality, FR-009 reload verification, and SC-002 latency check

### Parallel Team Strategy

1. Team aligns on Phase 1 and Phase 2 together
2. After foundation checkpoint:
   - Developer A: US1/US2 flow completion
   - Developer B: US3 delete confirmation flow
3. Merge at story checkpoints and run shared quality gates

---

## Notes

- `[P]` tasks are limited to different files with no direct dependency
- `[USx]` labels ensure traceability back to prioritized user stories
- Keep feature scoped to in-memory state only (no persistence)
- Preserve creation-order display invariant across all story implementations
