# GitHub Copilot カスタマイズガイド

このドキュメントは、GitHub Copilot のカスタマイズ機能（Instructions、Prompts、Agents）の概要と使い方をまとめたものです。

---

## 📋 目次

- [概要](#概要)
- [Instructions（指示書）](#instructions指示書)
- [Prompts（プロンプト）](#promptsプロンプト)
- [Agents（エージェント）](#agentsエージェント)
- [設定](#設定)
- [参考リンク](#参考リンク)

---

## 概要

GitHub Copilot には3種類のカスタマイズファイルがあります：

| 種類 | ファイル形式 | 格納場所 | 用途 |
|------|-------------|----------|------|
| **Instructions** | `.instructions.md` | `.github/instructions/` | コーディングスタイルやルールを自動適用 |
| **Prompts** | `.prompt.md` | `.github/prompts/` | 再利用可能なタスクテンプレート |
| **Agents** | `.agent.md` | `.github/agents/` | 特定タスクに特化した AI アシスタント |

### 比較表

| 特徴 | Instructions | Prompts | Agents |
|------|-------------|---------|--------|
| 適用方式 | 自動（ファイルパターン） | 手動（呼び出し） | 手動（呼び出し） |
| 対話形式 | なし（背景知識） | 単発タスク | 継続的な会話 |
| ツール利用 | なし | 指定可能 | 指定可能 |
| 主な用途 | コーディング規約の統一 | 定型タスクの自動化 | 専門家としての支援 |

---

## Instructions（指示書）

### 概要

**指示書（Instructions）** は、GitHub Copilot に対してコーディングスタイル、ベストプラクティス、プロジェクト固有のルールを伝えるためのファイルです。指定されたファイルパターンに自動的に適用され、一貫したコード生成を実現します。

### 特徴

- **自動適用**: `applyTo` で指定したファイルパターンに自動的に適用
- **コンテキスト提供**: Copilot がコードを生成する際の背景知識を提供
- **チーム共有**: Git でバージョン管理し、チーム全体で共有可能
- **モジュラー設計**: トピックごとに分割して管理

### ファイル形式

```yaml
---
applyTo: "**/*.ts, **/*.tsx"  # 適用対象のファイルパターン
description: "指示書の説明"
---

# 指示書タイトル

具体的な指示内容...
```

### 利用可能な指示書一覧

#### 🏗️ フレームワーク・言語

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Next.js** | `nextjs.instructions.md` | `**/*.tsx, **/*.ts, **/*.css` |
| **Next.js + Tailwind** | `nextjs-tailwind.instructions.md` | `**/*.tsx, **/*.ts, **/*.css` |
| **TypeScript 5.x** | `typescript-5-es2022.instructions.md` | `**/*.ts, **/*.tsx` |
| **Node.js + Vitest** | `nodejs-javascript-vitest.instructions.md` | `**/*.js, **/*.ts, **/*.test.*` |

#### 🎨 UI・コンポーネント

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **shadcn/ui + Radix** | `shadcn-ui-radix.instructions.md` | `src/components/ui/*.tsx` |
| **Storybook CSF 3.0** | `storybook-csf3-nextjs.instructions.md` | `**/*.stories.tsx` |

#### 🧪 テスト

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Playwright** | `playwright-typescript.instructions.md` | `**/*.spec.ts, **/e2e/**` |

#### 🔧 開発ツール

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Biome** | `biome-linter-formatter.instructions.md` | `**/*.ts, **/*.tsx, biome.json` |
| **Git Hooks (Husky)** | `git-hooks-husky.instructions.md` | `.husky/*, .github/workflows/*` |

#### 📐 アーキテクチャ・設計

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Colocation Pattern** | `project-architecture-colocation.instructions.md` | `src/app/**, src/components/**` |
| **Object Calisthenics** | `object-calisthenics.instructions.md` | `**/*.ts, **/*.cs, **/*.java` |

#### 🔒 品質・セキュリティ

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **アクセシビリティ (a11y)** | `a11y.instructions.md` | `**/*.tsx, **/*.html, **/*.css` |
| **セキュリティ (OWASP)** | `security-and-owasp.instructions.md` | `**/*.ts, **/*.tsx` |
| **パフォーマンス最適化** | `performance-optimization.instructions.md` | `**/*.ts, **/*.tsx, **/*.css` |
| **コードレビュー** | `code-review-generic.instructions.md` | `**` |

#### 📝 ドキュメント・コメント

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Markdown** | `markdown.instructions.md` | `**/*.md` |
| **自己説明的コード** | `self-explanatory-code-commenting.instructions.md` | `**/*.ts, **/*.tsx` |
| **ドキュメント自動更新** | `update-docs-on-code-change.instructions.md` | `**/*.md, **/*.ts, ...` |
| **ローカライゼーション** | `localization.instructions.md` | `**/*.md` |

#### 🛠️ メタ指示書（Copilot カスタマイズ用）

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **指示書の書き方** | `instructions.instructions.md` | `**/*.instructions.md` |
| **プロンプトの書き方** | `prompt.instructions.md` | `**/*.prompt.md` |
| **エージェントの書き方** | `agents.instructions.md` | `**/*.agent.md` |
| **コレクションの書き方** | `collections.instructions.md` | `collections/*.yml` |

### 使い方

#### 自動適用（推奨）

指示書は `applyTo` で指定されたファイルを編集する際に自動的に適用されます。特別な操作は不要です。

**例**: `src/components/ui/button.tsx` を編集すると、以下の指示書が自動適用されます：

- `nextjs.instructions.md`
- `nextjs-tailwind.instructions.md`
- `typescript-5-es2022.instructions.md`
- `shadcn-ui-radix.instructions.md`

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

### ファイル形式

```yaml
---
mode: 'agent'  # ask | edit | agent
tools: ['codebase', 'editFiles']  # 使用するツール
description: 'プロンプトの説明'
---

# プロンプトタイトル

実行する具体的なタスク...
```

### 利用可能なプロンプト一覧

#### 📄 ドキュメント生成

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **README Generator** | `readme-blueprint-generator.prompt.md` | プロジェクト構造から README.md を自動生成 |
| **ADR Generator** | `adr-generator.prompt.md` | アーキテクチャ決定記録 (ADR) を生成 |
| **Copilot Instructions Generator** | `copilot-instructions-blueprint-generator.prompt.md` | プロジェクト用の copilot-instructions.md を生成 |

#### 🏗️ アーキテクチャ分析

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Architecture Blueprint** | `architecture-blueprint-generator.prompt.md` | コードベースを分析してアーキテクチャドキュメントを生成 |
| **Technology Stack Blueprint** | `technology-stack-blueprint-generator.prompt.md` | 技術スタック、バージョン、使用パターンをドキュメント化 |
| **Code Exemplars Blueprint** | `code-exemplars-blueprint-generator.prompt.md` | 高品質なコード例を特定してカタログ化 |

#### 🔍 コードレビュー・リファクタリング

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Review and Refactor** | `review-and-refactor.prompt.md` | コードレビューとリファクタリングを実行 |

#### 🧪 テスト生成

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Jest/Vitest Test** | `javascript-typescript-jest.prompt.md` | JavaScript/TypeScript のユニットテストを生成 |
| **Playwright Explore** | `playwright-explore-website.prompt.md` | Playwright テスト作成前の Web サイト探索 |
| **Playwright Generate** | `playwright-generate-test.prompt.md` | Playwright E2E テストを生成 |

#### 🌐 国際化

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Add Language** | `next-intl-add-language.prompt.md` | next-intl アプリに新しい言語を追加 |

### 使い方

#### 方法 1: チャットパネルから実行

1. チャットパネルで `/` を入力
2. プロンプト名を選択または入力
3. 必要に応じてパラメータを入力

```
/readme-blueprint-generator
```

#### 方法 2: コマンドパレットから実行

1. `Cmd+Shift+P` (macOS) / `Ctrl+Shift+P` (Windows/Linux)
2. 「Chat: Run Prompt」を選択
3. プロンプトを選択

#### 方法 3: エクスプローラーから実行

1. `.github/prompts/` フォルダを開く
2. プロンプトファイルを右クリック
3. 「Run in Chat」を選択

### 使用例

#### README の自動生成

```
/readme-blueprint-generator
```

プロジェクトの構造を分析し、セットアップ手順、使用方法、技術スタックなどを含む README.md を生成します。

#### アーキテクチャ決定記録 (ADR) の作成

```
/adr-generator

決定: Next.js App Router の採用
コンテキスト: サーバーサイドレンダリングとファイルベースルーティングが必要
```

#### コードレビューとリファクタリング

```
/review-and-refactor

src/components/UserProfile.tsx のコードをレビューして改善して
```

#### テスト生成

```
/javascript-typescript-jest

src/lib/utils.ts のユニットテストを書いて
```

### プロンプトの変数

プロンプト内で使用できる変数：

| 変数 | 説明 |
|------|------|
| `${workspaceFolder}` | ワークスペースのルートパス |
| `${file}` | 現在開いているファイルのパス |
| `${selection}` | 現在選択しているテキスト |
| `${input:name}` | ユーザー入力を求める |
| `${input:name:placeholder}` | プレースホルダー付きユーザー入力 |

### モードの選択

| モード | 用途 | 例 |
|--------|------|-----|
| `ask` | 質問への回答、情報取得 | ドキュメント検索、コード説明 |
| `edit` | コードの編集、修正 | リファクタリング、バグ修正 |
| `agent` | 複雑なタスクの自律実行 | プロジェクト生成、テスト作成 |

### 新しいプロンプトの作成

新しいプロンプトを作成する場合は、`.github/instructions/prompt.instructions.md` のガイドラインに従ってください。

```bash
# ファイル名の規則
<task-name>.prompt.md

# 例
api-endpoint-generator.prompt.md
migration-script.prompt.md
```

---

## Agents（エージェント）

### 概要

**エージェント**は、特定のタスクに特化した AI アシスタントです。チャットモードとして機能し、専門的な知識と機能を持ってユーザーの質問やタスクに対応します。

### 特徴

- **専門性**: 特定のドメインや技術に精通した専門家として振る舞う
- **ツール利用**: 指定されたツールを使ってコードベースの探索、編集、実行が可能
- **継続的な対話**: チャット形式で複数ターンの会話が可能
- **コンテキスト保持**: 会話の文脈を維持しながら作業を進める

### ファイル形式

```yaml
---
description: 'エージェントの説明（チャットパネルに表示される）'
tools: ['codebase', 'editFiles', 'runInTerminal', ...]
---

# エージェント名

エージェントの詳細な指示...
```

### 利用可能なエージェント一覧

#### 🔧 開発支援

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Expert Next.js Developer** | `expert-nextjs-developer.agent.md` | Next.js 16, App Router, Server Components, Turbopack, TypeScript の専門家 |
| **Context7** | `context7.agent.md` | ライブラリのドキュメント取得、バージョン確認、アップグレード提案 |

#### ♿ 品質・アクセシビリティ

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Accessibility Expert** | `accessibility.agent.md` | WCAG 2.2 Level AA 準拠、セマンティック HTML、ARIA パターン |
| **Janitor** | `janitor.agent.md` | 技術的負債の解消、コードのクリーンアップ、シンプル化 |

#### 🧪 TDD（テスト駆動開発）

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **TDD Red** | `tdd-red.agent.md` | 失敗するテストを書く（要件を定義） |
| **TDD Green** | `tdd-green.agent.md` | テストを通す最小限のコードを書く |
| **TDD Refactor** | `tdd-refactor.agent.md` | テストを維持しながらコードを改善 |

#### 🧪 テスト自動化

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Playwright Tester** | `playwright-tester.agent.md` | Playwright + TypeScript での E2E テスト作成・保守 |

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

```
@expert-nextjs-developer このページをストリーミング対応にリファクタリングして
```

#### Janitor（技術的負債の解消）

```
@janitor このプロジェクトの未使用のインポートを削除して
```

```
@janitor src/components フォルダの重複コードを整理して
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

#### Accessibility Expert

```
@accessibility このフォームのアクセシビリティを監査して
```

```
@accessibility スクリーンリーダー対応のナビゲーションを実装して
```

#### Playwright Tester

```
@playwright-tester ログインフローの E2E テストを作成して
```

```
@playwright-tester 失敗しているテストの原因を調査して修正して
```

#### Context7

```
@context7 shadcn/ui の最新ドキュメントを取得して
```

```
@context7 Next.js 16 の新機能について調べて
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

### 新しいエージェントの作成

新しいエージェントを作成する場合は、`.github/instructions/agents.instructions.md` のガイドラインに従ってください。

```bash
# ファイル名の規則
<purpose>.agent.md

# 例
code-reviewer.agent.md
documentation-writer.agent.md
```

---

## 設定

### VS Code 設定

`settings.json` で各カスタマイズファイルの場所を指定できます：

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },
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

---

## 参考リンク

### 公式ドキュメント

- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [Custom Instructions Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization#_instruction-files)
- [VS Code Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
- [VS Code Copilot Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)

### プロジェクト内のガイドライン

新しいカスタマイズファイルを作成する際は、以下のガイドラインを参照してください：

| ファイル種別 | ガイドライン |
|-------------|-------------|
| Instructions | `.github/instructions/instructions.instructions.md` |
| Prompts | `.github/instructions/prompt.instructions.md` |
| Agents | `.github/instructions/agents.instructions.md` |
