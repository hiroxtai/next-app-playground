# GitHub Copilot Agents

このフォルダには、GitHub Copilot のカスタムエージェント (`.agent.md`) が格納されています。

## 📖 エージェントとは？

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

## 📁 利用可能なエージェント一覧

### 🔧 開発支援

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Expert Next.js Developer** | `expert-nextjs-developer.agent.md` | Next.js 16, App Router, Server Components, Turbopack, TypeScript の専門家 |
| **Context7** | `context7.agent.md` | ライブラリのドキュメント取得、バージョン確認、アップグレード提案 |

### ♿ 品質・アクセシビリティ

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Accessibility Expert** | `accessibility.agent.md` | WCAG 2.2 Level AA 準拠、セマンティック HTML、ARIA パターン |
| **Janitor** | `janitor.agent.md` | 技術的負債の解消、コードのクリーンアップ、シンプル化 |

### 🧪 TDD（テスト駆動開発）

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **TDD Red** | `tdd-red.agent.md` | 失敗するテストを書く（要件を定義） |
| **TDD Green** | `tdd-green.agent.md` | テストを通す最小限のコードを書く |
| **TDD Refactor** | `tdd-refactor.agent.md` | テストを維持しながらコードを改善 |

### 🧪 テスト自動化

| エージェント | ファイル名 | 説明 |
|-------------|-----------|------|
| **Playwright Tester** | `playwright-tester.agent.md` | Playwright + TypeScript での E2E テスト作成・保守 |

## 🚀 使い方

### 1. チャットパネルから呼び出す

VS Code のチャットパネルで `@` を入力し、エージェント名を選択します。

```
@expert-nextjs-developer App Router でのルーティングのベストプラクティスを教えてください
```

### 2. 直接エージェントを指定

```
@tdd-red ユーザー登録機能のテストを書いて
```

### 3. エージェントモードを使用

エージェントモードを有効にすると、自動的にツールを使用してタスクを完了します。

## 📝 使用例

### Expert Next.js Developer

```
@expert-nextjs-developer Server Components と Client Components の使い分けを説明して
```

```
@expert-nextjs-developer このページをストリーミング対応にリファクタリングして
```

### Janitor（技術的負債の解消）

```
@janitor このプロジェクトの未使用のインポートを削除して
```

```
@janitor src/components フォルダの重複コードを整理して
```

### TDD サイクル

```
# Step 1: 失敗するテストを書く
@tdd-red ユーザー名のバリデーション機能のテストを書いて

# Step 2: テストを通す
@tdd-green このテストを通す最小限のコードを書いて

# Step 3: リファクタリング
@tdd-refactor コードの品質を改善して（テストは維持）
```

### Accessibility Expert

```
@accessibility このフォームのアクセシビリティを監査して
```

```
@accessibility スクリーンリーダー対応のナビゲーションを実装して
```

### Playwright Tester

```
@playwright-tester ログインフローの E2E テストを作成して
```

```
@playwright-tester 失敗しているテストの原因を調査して修正して
```

### Context7

```
@context7 shadcn/ui の最新ドキュメントを取得して
```

```
@context7 Next.js 16 の新機能について調べて
```

## ⚙️ 設定

### VS Code 設定

`settings.json` でエージェントファイルの場所を指定できます：

```json
{
  "chat.agentFilesLocations": {
    ".github/agents": true
  }
}
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

## 📚 参考リンク

- [VS Code Copilot Chat Modes](https://code.visualstudio.com/docs/copilot/chat/chat-modes)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)

## 🆕 新しいエージェントの作成

新しいエージェントを作成する場合は、`.github/instructions/agents.instructions.md` のガイドラインに従ってください。

```bash
# ファイル名の規則
<purpose>.agent.md

# 例
code-reviewer.agent.md
documentation-writer.agent.md
```
