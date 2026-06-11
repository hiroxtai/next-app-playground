# Implementation Plan: 二重振り子シミュレーションデモページ

**Branch**: `002-double-pendulum-demo` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-double-pendulum-demo/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

カタログに新カテゴリ「シミュレーション」を追加し、二重振り子のデモページ
（`/examples/simulation/double-pendulum`）を作成する。物理計算は外部ライブラリを
使わず、純関数の物理エンジン（ラグランジュ方程式 + RK4 数値積分）として実装して
Vitest でユニットテストする。描画は HTML Canvas 2D + `requestAnimationFrame` で行い、
先端の光跡はリングバッファに保持した軌跡点を経過時間に応じた透明度で重ね描きして
表現する。パラメータ調整 UI は shadcn/ui（slider を新規追加）で構築する。

## Technical Context

**Language/Version**: TypeScript 5.x (strict) / React 19 / Next.js 16 (App Router)

**Primary Dependencies**: 既存スタックのみ（shadcn/ui, Tailwind CSS v4, lucide-react,
next-themes）。描画はブラウザ標準の Canvas 2D API。新規 npm 依存なし。
shadcn/ui の `slider` コンポーネントを `pnpm dlx shadcn@latest add slider` で追加する
（Radix UI ベース、既存の shadcn 運用の範囲内）

**Storage**: N/A（状態はすべてメモリ内。永続化・共有は対象外 — spec の Assumptions 参照）

**Testing**: Vitest 4 + Testing Library（物理エンジン・ユーティリティのユニットテスト）、
Storybook 10 CSF3 + `autodocs`（コントロール UI のストーリー）

**Target Platform**: モダンブラウザ（PC / モバイル）。レスポンシブ + ダーク/ライトモード対応

**Project Type**: 既存 Next.js カタログアプリへのページ追加（web）

**Performance Goals**: 60fps のアニメーション維持（SC-001）、光跡を含む描画 1 フレーム
あたり数 ms 以内、ページは 3 秒以内に操作可能（SC-003）

**Constraints**: 新規ランタイム依存の追加なし / React Compiler 有効（手動メモ化禁止が
既定）/ 減衰なしの理想系で長時間動作しても数値発散しない（固定タイムステップ積分）/
同一パラメータからのリセットは決定論的（SC-005）/ タブ非アクティブ復帰時の
時間スキップ対策（フレーム間 delta のクランプ）

**Scale/Scope**: 新カテゴリ 1 件 + デモページ 1 ページ + コロケーションされた
コンポーネント 3〜4 個 + 純関数物理エンジン 1 モジュール

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 評価 | 根拠 |
|------|------|------|
| I. コード品質 | ✅ PASS | TS strict / Biome は既存設定を踏襲。物理エンジン・公開コンポーネントに日本語 JSDoc（`@remarks` / `@example`）を付与。手動メモ化は使わず React Compiler に委ねる（rAF ループは ref ベースで実装し、メモ化に依存しない設計）。ページ固有コードは `_components/` / `_lib/` にコロケーション |
| II. テスト標準 | ✅ PASS | 物理エンジンは純関数として切り出し Vitest でユニットテスト（運動方程式・RK4・決定論性・パラメータクランプ）。コントロール UI は Storybook ストーリー（CSF3 + autodocs）。完了条件は `pnpm lint && pnpm type-check && pnpm test:run` 全成功 |
| III. UX 一貫性 | ✅ PASS | UI は shadcn/ui（slider は公式 CLI で追加）+ 既存テーマトークン。`catalog-data.ts` に新カテゴリ「simulation」とページを登録し、`category-styles.ts` にスタイルを追加。レスポンシブ・ダークモード対応。`prefers-reduced-motion` 時は自動再生しない |
| IV. パフォーマンス | ✅ PASS | `page.tsx` は Server Component（metadata 付き）とし、`"use client"` はデモ本体のサブツリーに限定。新規 npm 依存ゼロでバンドル影響は shadcn slider（Radix）のみ。光跡は上限付きリングバッファで蓄積を防止。60fps 目標は rAF + Canvas 2D で達成 |

**技術スタック制約**: 新ライブラリ導入なし（Canvas 2D はブラウザ標準）。ADR 不要の
範囲内。shadcn/ui コンポーネント追加は CLAUDE.md 既定の運用手順どおり。

**Post-Phase 1 再評価**: 設計成果物（data-model / contracts）作成後に再確認 → 違反なし。
Complexity Tracking への記載事項なし。

## Project Structure

### Documentation (this feature)

```text
specs/002-double-pendulum-demo/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── components.md    # コンポーネント・物理エンジンのインターフェース契約
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── _lib/
│   │   ├── catalog-data.ts                 # [変更] categories に "simulation" 追加、pages にエントリ追加
│   │   └── category-styles.ts              # [変更] simulation のアイコン・配色を追加
│   └── examples/
│       └── simulation/
│           └── double-pendulum/
│               ├── page.tsx                # [新規] Server Component（metadata + レイアウト）
│               ├── _components/
│               │   ├── double-pendulum-demo.tsx      # [新規] "use client" のデモ全体（状態管理・rAF ループ）
│               │   ├── pendulum-canvas.tsx           # [新規] Canvas 描画（振り子 + 光跡）
│               │   ├── pendulum-controls.tsx         # [新規] パラメータ調整・再生コントロール UI
│               │   └── pendulum-controls.stories.tsx # [新規] Storybook ストーリー
│               └── _lib/
│                   ├── double-pendulum.ts            # [新規] 物理エンジン（純関数: 運動方程式 + RK4）
│                   ├── double-pendulum.test.ts       # [新規] ユニットテスト
│                   └── constants.ts                  # [新規] 既定値・許容範囲の定義
└── components/
    └── ui/
        └── slider.tsx                      # [新規] shadcn CLI で追加（+ slider.stories.tsx）
```

**Structure Decision**: 既存カタログの規約どおり、例題固有コードは
`src/app/examples/simulation/double-pendulum/` 配下に `_components/` / `_lib/` として
コロケーションする。物理エンジンは React 非依存の純関数モジュールとして `_lib/` に
置き、テスト容易性と再現性（FR-009）を担保する。カタログ登録は既存の
`catalog-data.ts` / `category-styles.ts` への追記のみで、`[category]/[page]` の
汎用フォールバックとサイドバーが新カテゴリを自動反映する。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

違反なし — 記載事項なし。
