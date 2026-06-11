<!--
Sync Impact Report
==================
Version change: (template) → 1.0.0
Modified principles: 初回制定のためすべて新規
Added sections:
  - Core Principles（I. コード品質 / II. テスト標準 / III. ユーザーエクスペリエンスの一貫性 / IV. パフォーマンス要件）
  - 技術スタック制約
  - 開発ワークフローと品質ゲート
  - Governance
Removed sections: なし（テンプレートの 5 原則枠を、ユーザー指定の 4 原則に集約）
Templates requiring updates:
  - ✅ .specify/templates/plan-template.md（Constitution Check は憲法を動的参照する形式のため変更不要）
  - ✅ .specify/templates/spec-template.md（必須セクションと矛盾なし。Success Criteria が原則 IV の測定可能な
       成果指標と整合）
  - ✅ .specify/templates/tasks-template.md（テスト任意の文言を原則 II に合わせて「必須」に更新済み）
  - ✅ .specify/templates/checklist-template.md（汎用形式のため変更不要）
Follow-up TODOs: なし
-->

# next-app-playground Constitution

## Core Principles

### I. コード品質（Code Quality）

コードは「学習カタログとして読まれること」を第一級の要件とする。

- TypeScript は strict モードを維持し、`any` の使用を禁止する。やむを得ず型を緩める場合は
  理由を JSDoc コメントで明記しなければならない（MUST）
- すべてのコードは Biome の lint / format を通過しなければならない（MUST）。
  ESLint / Prettier は導入しない
- 公開コンポーネント・関数・フックには日本語 JSDoc を付与し、`@remarks` / `@example` /
  `@see` タグを積極的に使用する（MUST）
- React Compiler を前提とし、`useMemo` / `useCallback` / `memo` による手動メモ化は
  Compiler が対応できない場合に限り、理由を添えて使用する（SHOULD NOT を既定とする）
- 例題固有のコンポーネントは当該ページの `_components/` にコロケーションし、
  共有コンポーネントのみ `src/components/` に置く（MUST）

**Rationale**: 本リポジトリは学習プレイグラウンドであり、コード自体が教材である。
読み手が模倣してよい品質のコードのみを置く。

### II. テスト標準（Testing Standards）（NON-NEGOTIABLE）

すべての変更はテストによって検証されなければならない。

- 新規機能・バグ修正は、Vitest ユニットテスト（`*.test.ts(x)`）または Storybook
  ストーリー（`*.stories.tsx`）の少なくとも一方を伴わなければならない（MUST）
- Storybook ストーリーは CSF 3 形式で記述し、`autodocs` タグを必須とする（MUST）
- ロジック（フック、ユーティリティ、データ変換）はユニットテスト、UI コンポーネントは
  Storybook ストーリー＋インタラクションテストを優先する（SHOULD）
- 実装は `pnpm lint && pnpm type-check && pnpm test:run` がすべて成功するまで
  完了とみなさない（MUST）
- 既存テストを削除・スキップして CI を通すことを禁止する。テストが妥当でなくなった場合は
  PR 内で理由を説明して修正する（MUST）

**Rationale**: 自律開発パイプライン（コーディングエージェント）が主たる実装者であるため、
人間の目視に依存しない機械的な検証が品質の生命線となる。

### III. ユーザーエクスペリエンスの一貫性（UX Consistency）

カタログ全体がひとつのプロダクトとして一貫した体験を提供する。

- UI は shadcn/ui（new-york スタイル）と Tailwind CSS v4 のテーマトークン
  （`globals.css` 定義）を使用し、場当たり的な独自スタイルを追加しない（MUST）。
  新規 UI 部品が必要な場合は `pnpm dlx shadcn@latest add <component>` を優先する
- 例題ページは `src/app/_lib/catalog-data.ts` に登録し、カテゴリ配色は
  `category-styles.ts` の定義に従う（MUST）
- すべてのページはレスポンシブ対応・ダークモード対応とする（MUST）
- セマンティック HTML とキーボード操作可能なインタラクションを基本とし、
  アクセシビリティを損なう実装をしない（MUST）
- 非同期処理を伴うページはローディング状態とエラー状態を明示的に提示する
  （`loading.tsx` / `error.tsx` / Suspense fallback 等）（SHOULD）

**Rationale**: カタログアプリは「パターンの見本市」であり、ページごとに見た目や操作感が
ぶれると教材としての信頼性を失う。

### IV. パフォーマンス要件（Performance Requirements）

Next.js のレンダリングモデルを正しく使い、計測可能な速度基準を守る。

- Server Components を既定とし、`"use client"` はインタラクションに必要な最小の
  サブツリーに限定する（MUST）
- 静的化可能なページは `generateStaticParams` / 静的メタデータにより静的生成する（MUST）
- 画像は `next/image`、フォントは `next/font` を使用する（MUST）。
  重い Client Component は `next/dynamic` による遅延読み込みを検討する（SHOULD）
- 依存パッケージの追加はバンドルサイズへの影響を考慮し、PR で必要性を説明する（MUST）
- Core Web Vitals を劣化させない。目安として LCP < 2.5s / CLS < 0.1 / INP < 200ms を
  維持し、`pnpm build` の出力でバンドルサイズの異常増加がないことを確認する（SHOULD）

**Rationale**: パフォーマンス最適化のパターン自体が本カタログの学習テーマであり、
アプリ自身がベストプラクティスの実例でなければならない。

## 技術スタック制約

採用技術は以下に固定し、逸脱には ADR（`docs/adr/`）を必須とする。

- Next.js 16（App Router）/ React 19 / TypeScript（strict）
- Tailwind CSS v4 + shadcn/ui（new-york スタイル）
- 状態管理: Jotai / AI 連携: Vercel AI SDK + OpenAI
- テスト: Vitest 4 + Testing Library + Storybook 10
- ツーリング: Biome（lint・format）/ pnpm
- インポートエイリアスは `@/*` → `src/*` を使用する

新しいライブラリ・フレームワークの導入、既存スタックの置き換えは、ADR で代替案との
比較と採用理由を記録したうえで行う。

## 開発ワークフローと品質ゲート

- 自動処理してよいタスクは `claude:auto` ラベル付き Issue とし、自律開発パイプライン
  （調査 → 実装 → テスト → PR 作成）に委ねる。`copilot:auto` ラベルの場合は
  GitHub Copilot coding agent が処理する
- PR は CI（lint / type-check / test / build）と自動レビューを通過しなければならない。
  **マージは人間が行う**（自動マージしない）
- 重要な設計判断は `docs/adr/` に記録する（基準は `docs/adr/README.md`）
- ページ追加は CLAUDE.md の手順（catalog-data.ts 登録 → 専用ページ作成 →
  `_components/` コロケーション）に従う

## Governance

- 本憲法はその他すべての慣行・ドキュメントに優先する。矛盾がある場合は憲法に従い、
  必要なら憲法自体の改正を提案する
- 改正は PR として提出し、変更理由を記述する。設計判断を伴う場合は ADR を併記する。
  バージョンはセマンティックバージョニングに従う:
  - **MAJOR**: 原則の削除・互換性のない再定義
  - **MINOR**: 原則・セクションの追加、または指針の実質的な拡張
  - **PATCH**: 文言の明確化・誤記修正など意味を変えない改善
- すべての PR とレビューは本憲法への適合を確認しなければならない。原則からの逸脱
  （複雑性の追加を含む）は plan.md の Complexity Tracking で正当化する
- 日常の開発ガイダンスは `CLAUDE.md` を参照する。憲法と CLAUDE.md の重複部分は
  憲法が規範、CLAUDE.md が運用手引きという関係とする

**Version**: 1.0.0 | **Ratified**: 2026-06-11 | **Last Amended**: 2026-06-11
