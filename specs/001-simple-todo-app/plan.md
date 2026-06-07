# Implementation Plan: シンプルTodoアプリ

**Branch**: `001-pre-specify-hook` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-simple-todo-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

学習向けのシンプルTodoアプリとして、タスクの作成・完了切替・削除（確認付き）を提供する。仕様で確定した制約（1〜100文字、作成順固定、リロードで初期化）を最優先で満たし、Next.js App Router 配下に小さな自己完結UIとして実装する。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x (strict), React 19, Next.js 16.2.x

**Primary Dependencies**: Next.js App Router, React, shadcn/ui, Tailwind CSS v4

**Storage**: In-memory UI state only (no persistence; reset on full reload)

**Testing**: Vitest (unit project) + React Testing Library

**Target Platform**: Modern desktop/mobile browsers (Next.js web app)

**Project Type**: Web application feature page (frontend-only interaction)

**Performance Goals**: 操作結果の表示反映を 1 秒以内（SC-002）

**Constraints**: 入力 1〜100 文字、削除は確認必須、一覧は作成順固定、リロード時に初期化、学習向けに実装を簡潔化

**Scale/Scope**: 単一画面、単一ユーザー想定、数十〜数百タスク規模

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Gate 1: Constitution file is currently a placeholder template with no enforceable principles.
- Gate 2: No explicit constitutional violations detected for this feature plan.
- Gate 3: Proceed allowed, but governance risk noted due to missing ratified constitution content.

**Phase 0 Gate Result**: PASS (with risk note: constitution not yet concretized)

## Project Structure

### Documentation (this feature)

```text
specs/001-simple-todo-app/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── _lib/
│   │   └── catalog-data.ts
│   └── examples/
│       └── state-management/
│           └── simple-todo/
│               ├── page.tsx
│               └── _components/
│                   ├── TodoApp.tsx
│                   └── TodoItem.tsx (optional, if split needed)
└── components/
    └── ui/ (reuse existing UI primitives)

src/app/examples/state-management/simple-todo/
└── *.test.tsx
```

**Structure Decision**: 既存の Next.js 単一プロジェクト構造を採用し、例題ページを `src/app/examples/state-management/` 配下にコロケーションして追加する。

## Phase 0: Research Plan

- Validate minimal state strategy: in-memory client state only, no browser storage.
- Validate interaction contract: create/complete/delete-confirm behavior and creation-order invariants.
- Validate testing scope: unit tests covering happy path + clarified edge cases.

## Phase 1: Design Plan

- Define data model for Task and TaskCollection behavior boundaries.
- Define UI interaction contract for actions and visible outcomes.
- Produce quickstart validation steps aligned with acceptance scenarios.
- Refresh agent context reference after design artifacts are generated.

**Post-Design Constitution Check**: PASS (same risk note retained; no new violation introduced)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
