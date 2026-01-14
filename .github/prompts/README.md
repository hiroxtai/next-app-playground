# GitHub Copilot Prompts

このフォルダには、GitHub Copilot の再利用可能なプロンプト (`.prompt.md`) が格納されています。

## 📖 プロンプトとは？

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

## 📁 利用可能なプロンプト一覧

### 📄 ドキュメント生成

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **README Generator** | `readme-blueprint-generator.prompt.md` | プロジェクト構造から README.md を自動生成 |
| **ADR Generator** | `adr-generator.prompt.md` | アーキテクチャ決定記録 (ADR) を生成 |
| **Copilot Instructions Generator** | `copilot-instructions-blueprint-generator.prompt.md` | プロジェクト用の copilot-instructions.md を生成 |

### 🏗️ アーキテクチャ分析

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Architecture Blueprint** | `architecture-blueprint-generator.prompt.md` | コードベースを分析してアーキテクチャドキュメントを生成 |
| **Technology Stack Blueprint** | `technology-stack-blueprint-generator.prompt.md` | 技術スタック、バージョン、使用パターンをドキュメント化 |
| **Code Exemplars Blueprint** | `code-exemplars-blueprint-generator.prompt.md` | 高品質なコード例を特定してカタログ化 |

### 🔍 コードレビュー・リファクタリング

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Review and Refactor** | `review-and-refactor.prompt.md` | コードレビューとリファクタリングを実行 |

### 🧪 テスト生成

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Jest/Vitest Test** | `javascript-typescript-jest.prompt.md` | JavaScript/TypeScript のユニットテストを生成 |
| **Playwright Explore** | `playwright-explore-website.prompt.md` | Playwright テスト作成前の Web サイト探索 |
| **Playwright Generate** | `playwright-generate-test.prompt.md` | Playwright E2E テストを生成 |

### 🌐 国際化

| プロンプト | ファイル名 | 説明 |
|-----------|-----------|------|
| **Add Language** | `next-intl-add-language.prompt.md` | next-intl アプリに新しい言語を追加 |

## 🚀 使い方

### 方法 1: チャットパネルから実行

1. チャットパネルで `/` を入力
2. プロンプト名を選択または入力
3. 必要に応じてパラメータを入力

```
/readme-blueprint-generator
```

### 方法 2: コマンドパレットから実行

1. `Cmd+Shift+P` (macOS) / `Ctrl+Shift+P` (Windows/Linux)
2. 「Chat: Run Prompt」を選択
3. プロンプトを選択

### 方法 3: エクスプローラーから実行

1. `.github/prompts/` フォルダを開く
2. プロンプトファイルを右クリック
3. 「Run in Chat」を選択

## 📝 使用例

### README の自動生成

```
/readme-blueprint-generator
```

プロジェクトの構造を分析し、セットアップ手順、使用方法、技術スタックなどを含む README.md を生成します。

### アーキテクチャ決定記録 (ADR) の作成

```
/adr-generator

決定: Next.js App Router の採用
コンテキスト: サーバーサイドレンダリングとファイルベースルーティングが必要
```

### コードレビューとリファクタリング

```
/review-and-refactor

src/components/UserProfile.tsx のコードをレビューして改善して
```

### テスト生成

```
/javascript-typescript-jest

src/lib/utils.ts のユニットテストを書いて
```

### Playwright テスト生成

```
# Step 1: サイトを探索
/playwright-explore-website
URL: http://localhost:3000

# Step 2: テストを生成
/playwright-generate-test
ログインフローのテストを作成
```

### 技術スタックのドキュメント化

```
/technology-stack-blueprint-generator

このプロジェクトの技術スタックをドキュメント化して
```

### 新しい言語の追加（i18n）

```
/next-intl-add-language

追加する言語: フランス語 (fr)
```

## ⚙️ 設定

### VS Code 設定

`settings.json` でプロンプトファイルの場所を指定できます：

```json
{
  "chat.promptFilesLocations": {
    ".github/prompts": true
  }
}
```

### プロンプトの有効/無効

```json
{
  "chat.promptFilesLocations": {
    ".github/prompts": true,
    ".github/prompts/deprecated": false
  }
}
```

## 🔧 プロンプトの変数

プロンプト内で使用できる変数：

| 変数 | 説明 |
|------|------|
| `${workspaceFolder}` | ワークスペースのルートパス |
| `${file}` | 現在開いているファイルのパス |
| `${selection}` | 現在選択しているテキスト |
| `${input:name}` | ユーザー入力を求める |
| `${input:name:placeholder}` | プレースホルダー付きユーザー入力 |

### 使用例

```markdown
---
mode: 'agent'
description: 'コンポーネントのテストを生成'
---

# テスト生成

${file} のユニットテストを作成してください。

テスト対象: ${input:testTarget:テスト対象のコンポーネントや関数名}
```

## 📚 参考リンク

- [VS Code Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)

## 🆕 新しいプロンプトの作成

新しいプロンプトを作成する場合は、`.github/instructions/prompt.instructions.md` のガイドラインに従ってください。

```bash
# ファイル名の規則
<task-name>.prompt.md

# 例
api-endpoint-generator.prompt.md
migration-script.prompt.md
```

### テンプレート

```yaml
---
mode: 'agent'  # ask: 質問応答, edit: コード編集, agent: 自律的タスク実行
tools: ['codebase', 'editFiles']  # 必要なツール
description: 'プロンプトの説明'
---

# タスク名

## 目的
このプロンプトの目的...

## 実行内容
1. ステップ 1
2. ステップ 2
3. ステップ 3

## 入力
- ${input:paramName:パラメータの説明}

## 出力
期待される出力の形式...
```

### モードの選択

| モード | 用途 | 例 |
|--------|------|-----|
| `ask` | 質問への回答、情報取得 | ドキュメント検索、コード説明 |
| `edit` | コードの編集、修正 | リファクタリング、バグ修正 |
| `agent` | 複雑なタスクの自律実行 | プロジェクト生成、テスト作成 |
