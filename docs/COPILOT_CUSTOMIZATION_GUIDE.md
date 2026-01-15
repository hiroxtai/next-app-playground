# GitHub Copilot カスタマイズガイド

このドキュメントは、GitHub Copilot のカスタマイズ機能（Instructions、Prompts、Agents、Skills）の概要と使い方をまとめたものです。

**最終更新**: 2025年7月

> **📊 ファイル数**: **Instructions** 34 個 | **Prompts** 52 個 | **Agents** 42 個 | **Skills** 3 個

---

## 📋 目次

- [概要](#概要)
- [Instructions（指示書）](#instructions指示書)
- [Prompts（プロンプト）](#promptsプロンプト)
- [Agents（エージェント）](#agentsエージェント)
- [Skills（スキル）](#skillsスキル)
- [高度な機能](#高度な機能)
- [設定](#設定)
- [参考リンク](#参考リンク)

---

## 概要

GitHub Copilot には4種類のカスタマイズファイルがあります：

| 種類 | ファイル形式 | 格納場所 | 用途 | ファイル数 |
|------|-------------|----------|------|-----------|
| **Instructions** | `.instructions.md` | `.github/instructions/` | コーディングスタイルやルールを自動適用 | 34 |
| **Prompts** | `.prompt.md` | `.github/prompts/` | 再利用可能なタスクテンプレート | 52 |
| **Agents** | `.agent.md` | `.github/agents/` | 特定タスクに特化した AI アシスタント | 42 |
| **Skills** | `SKILL.md` | `.github/skills/<name>/` | ドメイン特化のツールキット | 3 |

### 比較表

| 特徴 | Instructions | Prompts | Agents | Skills |
|------|-------------|---------|--------|--------|
| 適用方式 | 自動（ファイルパターン） | 手動（呼び出し） | 手動（呼び出し） | 自動（キーワード検出） |
| 対話形式 | なし（背景知識） | 単発タスク | 継続的な会話 | タスク支援 |
| ツール利用 | なし | 指定可能 | 指定可能 | バンドル可能 |
| 主な用途 | コーディング規約の統一 | 定型タスクの自動化 | 専門家としての支援 | ドメイン知識の提供 |
| モデル指定 | 不可 | 可能 | 可能 | なし |
| Handoffs | 不可 | 不可 | 可能 | なし |

---

## Instructions（指示書）

### 概要

**指示書（Instructions）** は、GitHub Copilot に対してコーディングスタイル、ベストプラクティス、プロジェクト固有のルールを伝えるためのファイルです。指定されたファイルパターンに自動的に適用され、一貫したコード生成を実現します。

### 特徴

- **自動適用**: `applyTo` で指定したファイルパターンに自動適用
- **コンテキスト提供**: Copilot がコードを生成する際の背景知識を提供
- **チーム共有**: Git でバージョン管理し、チーム全体で共有可能
- **モジュラー設計**: トピックごとに分割して管理
- **エージェント除外**: `excludeAgent` で特定のエージェントを除外可能

### ファイル形式

```yaml
---
applyTo: "**/*.ts, **/*.tsx"  # 適用対象のファイルパターン（glob 形式）
description: "指示書の説明（必須・推奨）"
excludeAgent: ["coding-agent"]  # 除外するエージェント（オプション）
---

# 指示書タイトル

具体的な指示内容...
```

### 利用可能な指示書一覧（34個）

#### 🏗️ フレームワーク・言語

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Next.js 16** | `nextjs.instructions.md` | `**/*.tsx, **/*.ts, **/*.css` |
| **Next.js + Tailwind** | `nextjs-tailwind.instructions.md` | `**/*.tsx, **/*.ts, **/*.css` |
| **TypeScript 5.x** | `typescript-5-es2022.instructions.md` | `**/*.ts, **/*.tsx` |
| **React.js** | `reactjs.instructions.md` | `**/*.jsx, **/*.tsx, **/*.css` |
| **Node.js + Vitest** | `nodejs-javascript-vitest.instructions.md` | `**/*.js, **/*.ts, **/*.test.*` |
| **TanStack Start** | `tanstack-start-shadcn-tailwind.instructions.md` | `**/*.ts, **/*.tsx, **/*.css` |
| **PCF React** | `pcf-react-platform-libraries.instructions.md` | `**/*.ts, **/*.tsx, **/*.pcfproj` |

#### 🎨 UI・コンポーネント

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **shadcn/ui + Radix** | `shadcn-ui-radix.instructions.md` | `src/components/ui/*.tsx` |
| **Storybook CSF 3.0** | `storybook-csf3-nextjs.instructions.md` | `**/*.stories.tsx` |
| **HTML/CSS カラー** | `html-css-style-color-guide.instructions.md` | `**/*.html, **/*.css` |

#### 🧪 テスト

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Playwright** | `playwright-typescript.instructions.md` | `**/*.spec.ts, **/e2e/**` |

#### 🔧 開発ツール・DevOps

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Biome** | `biome-linter-formatter.instructions.md` | `**/*.ts, **/*.tsx, biome.json` |
| **Git Hooks (Husky)** | `git-hooks-husky.instructions.md` | `.husky/*, .github/workflows/*` |
| **Docker** | `containerization-docker-best-practices.instructions.md` | `**/Dockerfile, **/docker-compose*.yml` |
| **DevOps 原則** | `devops-core-principles.instructions.md` | `*` |

#### 📐 アーキテクチャ・設計

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Colocation Pattern** | `project-architecture-colocation.instructions.md` | `src/app/**, src/components/**` |
| **Object Calisthenics** | `object-calisthenics.instructions.md` | `**/*.ts, **/*.cs, **/*.java` |
| **Spec-Driven Workflow** | `spec-driven-workflow-v1.instructions.md` | `**` |
| **タスク実装** | `task-implementation.instructions.md` | `**/.copilot-tracking/changes/*.md` |

#### 🔒 品質・セキュリティ

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **アクセシビリティ (a11y)** | `a11y.instructions.md` | `**/*.tsx, **/*.html, **/*.css` |
| **セキュリティ (OWASP)** | `security-and-owasp.instructions.md` | `**/*.ts, **/*.tsx` |
| **パフォーマンス最適化** | `performance-optimization.instructions.md` | `**/*.ts, **/*.tsx, **/*.css` |
| **コードレビュー** | `code-review-generic.instructions.md` | `**` |
| **AI 安全性・プロンプト** | `ai-prompt-engineering-safety-best-practices.instructions.md` | `**` |

#### 📝 ドキュメント・コメント

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Markdown** | `markdown.instructions.md` | `**/*.md` |
| **自己説明的コード** | `self-explanatory-code-commenting.instructions.md` | `**/*.ts, **/*.tsx` |
| **ドキュメント自動更新** | `update-docs-on-code-change.instructions.md` | `**/*.md, **/*.ts, ...` |
| **ローカライゼーション** | `localization.instructions.md` | `**/*.md` |

#### 🤖 Copilot 制御・メタ指示書

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Copilot 制御** | `taming-copilot.instructions.md` | `**` |
| **指示書の書き方** | `instructions.instructions.md` | `**/*.instructions.md` |
| **プロンプトの書き方** | `prompt.instructions.md` | `**/*.prompt.md` |
| **エージェントの書き方** | `agents.instructions.md` | `**/*.agent.md` |
| **スキルの書き方** | `agent-skills.instructions.md` | `**/.github/skills/**/SKILL.md` |
| **コレクションの書き方** | `collections.instructions.md` | `collections/*.yml` |

### 使い方

#### 自動適用（推奨）

指示書は `applyTo` で指定されたファイルを編集する際に自動的に適用されます。特別な操作は不要です。

**例**: `src/components/ui/button.tsx` を編集すると、以下の指示書が自動適用されます：

- `nextjs.instructions.md`
- `typescript-5-es2022.instructions.md`
- `shadcn-ui-radix.instructions.md`
- `a11y.instructions.md`
- `security-and-owasp.instructions.md`

#### 手動で添付

チャットで特定の指示書を明示的に参照することもできます：

```
#file:.github/instructions/security-and-owasp.instructions.md
このコードのセキュリティレビューをして
```

### 新しい指示書の作成

新しい指示書を作成する場合は、`instructions.instructions.md` のガイドラインに従ってください。

```bash
# ファイル名の規則
<technology-or-topic>.instructions.md

# 例
react-query.instructions.md
api-design.instructions.md
```

---

## Prompts（プロンプト）

### 概要

**プロンプト**は、特定のタスクを実行するための再利用可能な指示テンプレートです。一度作成すれば、何度でも同じタスクを実行できます。

### 特徴

- **再利用性**: 同じタスクを繰り返し実行可能
- **タスク指向**: 特定の目的（コード生成、レビュー、ドキュメント作成など）に特化
- **変数サポート**: `${input:name}` で動的な入力を受け付け
- **モード指定**: `ask`、`edit`、`agent` モードを選択可能
- **ツール指定**: 使用するツールを明示的に指定可能
- **モデル指定**: 使用する AI モデルを指定可能

### ファイル形式

```yaml
---
mode: 'agent'  # ask | edit | agent
tools: ['codebase', 'editFiles', 'githubRepo']  # 使用するツール
description: 'プロンプトの説明'
---

# プロンプトタイトル

実行する具体的なタスク...
```

### 利用可能なプロンプト一覧（52個）

#### 📋 計画・仕様策定

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **仕様書作成** | `create-specification.prompt.md` | AI 用の構造化仕様書を生成 |
| **実装計画作成** | `create-implementation-plan.prompt.md` | 実装計画ドキュメントを生成 |
| **技術スパイク** | `create-technical-spike.prompt.md` | 技術調査ドキュメントを作成 |
| **Epic 分解 (PM)** | `breakdown-epic-pm.prompt.md` | Epic の PRD を作成 |
| **Epic 分解 (Arch)** | `breakdown-epic-arch.prompt.md` | Epic のアーキテクチャ仕様を作成 |
| **Feature 実装** | `breakdown-feature-implementation.prompt.md` | Feature の実装計画を作成 |
| **計画分解** | `breakdown-plan.prompt.md` | Epic/Feature/Story/Task に分解 |

#### 🏗️ アーキテクチャ分析

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Architecture Blueprint** | `architecture-blueprint-generator.prompt.md` | アーキテクチャドキュメントを生成 |
| **Technology Stack** | `technology-stack-blueprint-generator.prompt.md` | 技術スタックをドキュメント化 |
| **Folder Structure** | `folder-structure-blueprint-generator.prompt.md` | フォルダ構造をドキュメント化 |
| **Code Exemplars** | `code-exemplars-blueprint-generator.prompt.md` | 高品質なコード例を抽出 |
| **Workflow Analysis** | `project-workflow-analysis-blueprint-generator.prompt.md` | ワークフローを分析・ドキュメント化 |
| **ADR Generator** | `adr-generator.prompt.md` | アーキテクチャ決定記録 (ADR) を生成 |
| **ADR 作成** | `create-architectural-decision-record.prompt.md` | ADR の詳細版を作成 |

#### 📄 ドキュメント生成

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **README Generator** | `readme-blueprint-generator.prompt.md` | README.md を自動生成 |
| **README 作成** | `create-readme.prompt.md` | シンプルな README を作成 |
| **TLDR 作成** | `tldr-prompt.prompt.md` | TLDR サマリーを作成 |
| **TLDR ページ** | `create-tldr-page.prompt.md` | TLDR ページを作成 |
| **Copilot Instructions** | `copilot-instructions-blueprint-generator.prompt.md` | copilot-instructions.md を生成 |

#### 🔍 コードレビュー・リファクタリング

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Review and Refactor** | `review-and-refactor.prompt.md` | コードレビューとリファクタリング |
| **Custom Instructions 生成** | `generate-custom-instructions-from-codebase.prompt.md` | コードから Instructions を生成 |
| **コーディング標準** | `write-coding-standards-from-file.prompt.md` | コーディング標準を作成 |

#### 🧪 テスト生成

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Jest/Vitest Test** | `javascript-typescript-jest.prompt.md` | ユニットテストを生成 |
| **Playwright Explore** | `playwright-explore-website.prompt.md` | Web サイト探索 |
| **Playwright Generate** | `playwright-generate-test.prompt.md` | E2E テストを生成 |

#### 🔄 GitHub 連携

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Issue 作成 (仕様)** | `create-github-issue-feature-from-specification.prompt.md` | 仕様から Issue を作成 |
| **Issue 作成 (計画)** | `create-github-issues-feature-from-implementation-plan.prompt.md` | 計画から Issue を作成 |
| **Issue 作成 (未達成)** | `create-github-issues-for-unmet-specification-requirements.prompt.md` | 未達成要件の Issue を作成 |
| **PR 作成** | `create-github-pull-request-from-specification.prompt.md` | 仕様から PR を作成 |
| **マイ PR** | `my-pull-requests.prompt.md` | 自分の PR を管理 |
| **仕様→Issue** | `gen-specs-as-issues.prompt.md` | 仕様を Issue として生成 |

#### 🛠️ DevOps

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Actions 仕様** | `create-github-action-workflow-specification.prompt.md` | GitHub Actions 仕様書を作成 |
| **ロールアウト計画** | `devops-rollout-plan.prompt.md` | デプロイ計画を作成 |
| **EditorConfig** | `editorconfig.prompt.md` | EditorConfig を生成 |
| **Git Flow** | `git-flow-branch-creator.prompt.md` | Git Flow ブランチを作成 |

#### 💡 ユーティリティ

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Prompt Builder** | `prompt-builder.prompt.md` | 高品質なプロンプトを作成 |
| **Finalize Agent** | `finalize-agent-prompt.prompt.md` | プロンプトを最終調整 |
| **Remember** | `remember.prompt.md` | メモリとして保存 |
| **Memory Merger** | `memory-merger.prompt.md` | メモリファイルをマージ |
| **Model Recommendation** | `model-recommendation.prompt.md` | AI モデルを推奨 |
| **Repo Story Time** | `repo-story-time.prompt.md` | リポジトリのストーリーを生成 |
| **Copilot Starter** | `github-copilot-starter.prompt.md` | Copilot 入門ガイド |

#### 📦 awesome-copilot 連携

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Prompts 提案** | `suggest-awesome-github-copilot-prompts.prompt.md` | Prompts を提案 |
| **Instructions 提案** | `suggest-awesome-github-copilot-instructions.prompt.md` | Instructions を提案 |
| **Collections 提案** | `suggest-awesome-github-copilot-collections.prompt.md` | Collections を提案 |
| **Chat Modes 提案** | `suggest-awesome-github-copilot-chatmodes.prompt.md` | Agents を提案 |

#### 🌐 その他

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **next-intl 言語追加** | `next-intl-add-language.prompt.md` | 新しい言語を追加 |
| **仕様更新** | `update-specification.prompt.md` | 仕様書を更新 |
| **計画更新** | `update-implementation-plan.prompt.md` | 計画を更新 |
| **LLM 更新** | `update-llms.prompt.md` | LLM 設定を更新 |
| **Markdown Index** | `update-markdown-file-index.prompt.md` | Markdown インデックスを更新 |
| **Component Docs** | `update-oo-component-documentation.prompt.md` | コンポーネントドキュメントを更新 |

### 使い方

#### 方法 1: チャットパネルから実行

1. チャットパネルで `/` を入力
2. プロンプト名を選択または入力
3. 必要に応じてパラメータを入力

```
/create-specification
```

#### 方法 2: コマンドパレットから実行

1. `Cmd+Shift+P` (macOS) / `Ctrl+Shift+P` (Windows/Linux)
2. 「Chat: Run Prompt」を選択
3. プロンプトを選択

#### 方法 3: ファイル参照

```
#file:.github/prompts/create-readme.prompt.md
```

### プロンプトの変数

プロンプト内で使用できる変数：

| 変数 | 説明 |
|------|------|
| `${workspaceFolder}` | ワークスペースのルートパス |
| `${file}` | 現在開いているファイルのパス |
| `${selection}` | 現在選択しているテキスト |
| `${input:name}` | ユーザー入力を求める |
| `${input:name\|default}` | デフォルト値付きユーザー入力 |

### モードの選択

| モード | 用途 | 例 |
|--------|------|-----|
| `ask` | 質問への回答、情報取得 | ドキュメント検索、コード説明 |
| `edit` | コードの編集、修正 | リファクタリング、バグ修正 |
| `agent` | 複雑なタスクの自律実行 | プロジェクト生成、テスト作成 |

---

## Agents（エージェント）

### 概要

**エージェント**は、特定のタスクに特化した AI アシスタントです。チャットモードとして機能し、専門的な知識と機能を持ってユーザーの質問やタスクに対応します。

### 特徴

- **専門性**: 特定のドメインや技術に精通した専門家として振る舞う
- **ツール利用**: 指定されたツールを使ってコードベースの探索、編集、実行が可能
- **継続的な対話**: チャット形式で複数ターンの会話が可能
- **コンテキスト保持**: 会話の文脈を維持しながら作業を進める
- **モデル指定**: 使用する AI モデルを指定可能
- **Handoffs**: 他のエージェントへタスクを引き継ぎ可能

### ファイル形式

```yaml
---
name: "エージェント名（オプション）"
description: 'エージェントの説明（チャットパネルに表示される）'
tools: ['codebase', 'editFiles', 'runInTerminal', ...]
model: 'GPT-4o'  # 使用する AI モデル（オプション）
handoffs:  # 他エージェントへの引き継ぎ（オプション）
  - label: "手続き的なコードタスクを引き継ぐ"
    agent: "blueprint-mode"
    prompt: "コードを実装して"
---

# エージェント名

エージェントの詳細な指示...
```

### 利用可能なエージェント一覧（42個）

#### 🚀 開発・実装

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Expert Next.js Developer** | `expert-nextjs-developer.agent.md` | Next.js 16, App Router, Server Components |
| **Blueprint Mode** | `blueprint-mode.agent.md` | 構造化ワークフローで厳密な品質管理 |
| **Playwright Tester** | `playwright-tester.agent.md` | Playwright + TypeScript での E2E テスト |
| **Address Comments** | `address-comments.agent.md` | PR コメントへの対応 |

#### 📋 計画・設計

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Plan Mode** | `plan.agent.md` | 戦略的計画とアーキテクチャ分析 |
| **Planner** | `planner.agent.md` | シンプルな実装計画の生成 |
| **Implementation Plan** | `implementation-plan.agent.md` | 詳細な実装計画の生成 |
| **Task Planner** | `task-planner.agent.md` | 研究に基づいた実行可能な計画 |
| **Task Researcher** | `task-researcher.agent.md` | 実装前の深い調査 |
| **Specification** | `specification.agent.md` | 仕様書の生成・更新 |
| **Refine Issue** | `refine-issue.agent.md` | Issue の詳細化 |
| **Arch** | `arch.agent.md` | クラウドアーキテクチャ図の作成 |
| **HLBPA** | `hlbpa.agent.md` | ハイレベル設計・ドキュメント |

#### 🧪 TDD（テスト駆動開発）

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **TDD Red** | `tdd-red.agent.md` | 失敗するテストを書く（要件定義） |
| **TDD Green** | `tdd-green.agent.md` | テストを通す最小限のコード |
| **TDD Refactor** | `tdd-refactor.agent.md` | テストを維持しながらリファクタ |

#### 🔐 セキュリティ・レビュー

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **WG Code Sentinel** | `wg-code-sentinel.agent.md` | OWASP Top 10、セキュリティレビュー |
| **SE Security Reviewer** | `se-security-reviewer.agent.md` | Zero Trust、LLM セキュリティ |
| **WG Code Alchemist** | `wg-code-alchemist.agent.md` | Clean Code、SOLID 原則 |
| **Gilfoyle** | `gilfoyle.agent.md` | 辛辣だが的確なコードレビュー |
| **Accessibility** | `accessibility.agent.md` | WCAG 2.2 準拠、アクセシビリティ監査 |
| **SE Responsible AI** | `se-responsible-ai-code.agent.md` | バイアス防止、倫理的 AI |

#### 📚 ドキュメント・学習

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Context7** | `context7.agent.md` | ライブラリドキュメントの取得 |
| **SE Technical Writer** | `se-technical-writer.agent.md` | 技術ドキュメント、ブログ、チュートリアル |
| **Technical Content Evaluator** | `technical-content-evaluator.agent.md` | 教育コンテンツの評価・改善 |

#### 🛠️ DevOps・インフラ

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **DevOps Expert** | `devops-expert.agent.md` | CI/CD パイプライン、デプロイ戦略 |
| **GitHub Actions Expert** | `github-actions-expert.agent.md` | セキュアなワークフロー |
| **SE GitOps CI Specialist** | `se-gitops-ci-specialist.agent.md` | デプロイトラブルシューティング |
| **SE System Architecture Reviewer** | `se-system-architecture-reviewer.agent.md` | アーキテクチャ評価 |

#### 💡 アイデア・ブレスト

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Simple App Idea Generator** | `simple-app-idea-generator.agent.md` | アプリアイデアの創出 |
| **SE Product Manager Advisor** | `se-product-manager-advisor.agent.md` | Issue 作成、ユーザーニーズ分析 |
| **SE UX UI Designer** | `se-ux-ui-designer.agent.md` | Jobs-to-be-Done 分析、UX 設計 |

#### 🧹 リファクタリング・改善

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Janitor** | `janitor.agent.md` | 不要コード削除、シンプル化 |
| **Tech Debt Remediation Plan** | `tech-debt-remediation-plan.agent.md` | 技術的負債の分析と計画 |
| **Modernization** | `modernization.agent.md` | レガシープロジェクトの近代化 |

#### 🎓 メンタリング・教育

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Mentor** | `mentor.agent.md` | ソクラテス式の質問で思考を深める |
| **Critical Thinking** | `critical-thinking.agent.md` | 前提を検証、批判的思考を促進 |
| **Demonstrate Understanding** | `demonstrate-understanding.agent.md` | 理解度を質問で検証 |

#### 🔧 ユーティリティ

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Prompt Engineer** | `prompt-engineer.agent.md` | プロンプトの分析と改善 |
| **Prompt Builder** | `prompt-builder.agent.md` | 高品質なプロンプトの構築 |
| **Custom Agent Foundry** | `custom-agent-foundry.agent.md` | 新しいエージェントの設計・作成 |
| **Research Technical Spike** | `research-technical-spike.agent.md` | 技術調査の実施 |

### 使い方

#### 1. チャットパネルから呼び出す

VS Code のチャットパネルで `@` を入力し、エージェント名を選択します。

```
@expert-nextjs-developer App Router でのルーティングのベストプラクティスを教えてください
```

#### 2. 直接エージェントを指定

```
@tdd-red ユーザー登録機能のテストを書いて
```

#### 3. エージェントモードを使用

エージェントモードを有効にすると、自動的にツールを使用してタスクを完了します。

### 使用例

#### Expert Next.js Developer

```
@expert-nextjs-developer Server Components と Client Components の使い分けを説明して
```

#### Blueprint Mode（構造化ワークフロー）

```
@blueprint-mode 全ページにパンくずリストを追加して
```

Blueprint Mode は 4 つのワークフロー（Debug、Express、Main、Loop）を自動選択し、厳密な品質管理で実装を行います。

#### Task Planner + Task Researcher

```
# Step 1: 調査
@task-researcher Next.js 16 の Server Actions について調査して

# Step 2: 計画作成
@task-planner 検索フィルター機能を実装したい
```

#### TDD サイクル

```
# Step 1: 失敗するテストを書く
@tdd-red ユーザー名のバリデーション機能のテストを書いて

# Step 2: テストを通す
@tdd-green このテストを通す最小限のコードを書いて

# Step 3: リファクタリング
@tdd-refactor コードの品質を改善して（テストは維持）
```

### 利用可能なツール

エージェントは以下のツールを使用できます：

| ツール | 説明 |
|--------|------|
| `codebase` | コードベースの検索・分析 |
| `editFiles` | ファイルの編集 |
| `runInTerminal` | ターミナルでコマンド実行 |
| `fetch` | Web からのデータ取得 |
| `githubRepo` | GitHub リポジトリの操作 |
| `runTests` | テストの実行 |
| `problems` | エラー・警告の確認 |
| `usages` | シンボルの使用箇所検索 |
| `changes` | 変更差分の取得 |
| `findTestFiles` | テストファイルの検索 |

---

## Skills（スキル）

### 概要

**スキル**は、特定のドメインに関する知識とリソースをバンドルしたツールキットです。エージェントがタスクを実行する際に、必要なスキルを自動的に検出して読み込みます。

### 特徴

- **ポータブル**: プロジェクト間で再利用可能
- **プログレッシブ読み込み**: 必要な時にのみ読み込まれる
- **リソースバンドル**: スクリプト、テンプレート、参照ドキュメントを含む
- **キーワード検出**: description に含まれるキーワードで自動検出

### ディレクトリ構成

```
.github/skills/<skill-name>/
├── SKILL.md           # 必須: スキルの説明と使用方法
├── scripts/           # オプション: 実行可能なスクリプト
├── references/        # オプション: 参照ドキュメント
├── assets/            # オプション: 画像、設定ファイルなど
└── templates/         # オプション: コードテンプレート
```

### ファイル形式（SKILL.md）

```yaml
---
name: skill-name
description: >
  スキルの詳細な説明。WHAT（何をするか）、WHEN（いつ使うか）、
  KEYWORDS（検出用キーワード）を含める。
license: LICENSE.txt に完全な条件を記載
---

# スキルタイトル

## When to Use This Skill
このスキルを使用するタイミング...

## Prerequisites
前提条件...

## Step-by-Step Workflows
手順...

## Troubleshooting
トラブルシューティング...
```

### 利用可能なスキル一覧（3個）

| スキル | ディレクトリ | 説明 |
|--------|-------------|------|
| **Frontend Design** | `frontend-design/` | 高品質なフロントエンド UI の作成 |
| **Webapp Testing** | `webapp-testing/` | Playwright を使ったローカルアプリのテスト |
| **Web Design Reviewer** | `web-design-reviewer/` | Web サイトデザインの視覚的検査と修正 |

### description の書き方（重要）

スキルは description のキーワードで検出されるため、適切な記述が重要です：

```yaml
# ✅ 良い例: WHAT + WHEN + KEYWORDS を含む
description: >
  Toolkit for testing local web applications using Playwright.
  Use when asked to verify frontend functionality, debug UI behavior,
  capture browser screenshots, check for visual regressions, or view
  browser console logs. Supports Chrome, Firefox, and WebKit browsers.

# ❌ 悪い例: 曖昧で検出されにくい
description: Web testing helpers
```

---

## 高度な機能

### Handoffs（エージェント間の引き継ぎ）

エージェントは他のエージェントにタスクを引き継ぐことができます：

```yaml
---
description: "計画立案エージェント"
handoffs:
  - label: "コード実装を引き継ぐ"
    agent: "blueprint-mode"
    prompt: "計画に基づいてコードを実装して"
    send: "always"  # always | onApproval
---
```

### モデル指定

エージェントやプロンプトで使用する AI モデルを指定できます：

```yaml
---
model: 'GPT-4o'  # GPT-4o, Claude Sonnet 4, など
---
```

### ツール参照

プロンプト内でツールを参照する場合：

```markdown
#tool:githubRepo を使用してリポジトリを検索します。
```

### Tool Sets（ツールセット）

複数のツールをグループ化して管理できます（`.vscode/tool-sets.jsonc`）：

```json
{
  "reader": {
    "tools": ["changes", "codebase", "fetch", "problems", "usages"],
    "description": "読み取り専用ツール",
    "icon": "book"
  }
}

---

## 設定

### VS Code 設定

`settings.json` で各カスタマイズファイルの場所を指定できます：

```json
{
  // Instructions の場所（自動適用されるルール）
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".copilot-tracking/plans": true,
    ".copilot-tracking/details": true
  },
  // Prompts の場所（スラッシュコマンドで呼び出し）
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },
  // Agents の場所（@で呼び出し）
  "chat.agentFilesLocations": {
    ".github/agents": true
  }
}
```

### 特定のフォルダを無効化

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".github/instructions/deprecated": false
  }
}
```

### 追加の推奨設定

```json
{
  // Copilot の応答言語
  "github.copilot.chat.localeOverride": "ja",
  
  // Agent モードでのツール確認
  "chat.tools.autoRun": false,  // true: 自動実行 / false: 確認後に実行
  
  // コードアクションの有効化
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }
}
```

---

## 参考リンク

### 公式ドキュメント

- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [Custom Instructions](https://code.visualstudio.com/docs/copilot/copilot-customization#_instruction-files)
- [Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
- [Chat Modes / Agents](https://code.visualstudio.com/docs/copilot/chat/chat-modes)
- [Agent Skills](https://code.visualstudio.com/docs/copilot/copilot-customization#_agent-skills)
- [Tool Sets](https://code.visualstudio.com/docs/copilot/copilot-customization#_tool-sets)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Copilot Prompt Engineering](https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot)

### コミュニティリソース

- [awesome-copilot リポジトリ](https://github.com/github/awesome-copilot) - エージェント、プロンプト、Instructions のコレクション

### プロジェクト内ガイドライン

新しいカスタマイズファイルを作成する際は、以下のガイドラインを参照してください：

| ファイル種別 | ガイドライン |
|-------------|-------------|
| Instructions | `.github/instructions/instructions.instructions.md` |
| Prompts | `.github/instructions/prompt.instructions.md` |
| Agents | `.github/instructions/agents.instructions.md` |
| Skills | `.github/instructions/agent-skills.instructions.md` |

### 関連プロジェクトドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [INSTRUCTIONS_GUIDE.md](./INSTRUCTIONS_GUIDE.md) | Instructions の詳細ガイド |
| [PROMPTS_GUIDE.md](./PROMPTS_GUIDE.md) | Prompts の詳細ガイド |
| [COPILOT_AGENTS_GUIDE.md](./COPILOT_AGENTS_GUIDE.md) | Agents の詳細ガイド |
| [copilot-instructions.md](../.github/copilot-instructions.md) | プロジェクト全体の Copilot 設定 |
