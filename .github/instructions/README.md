# GitHub Copilot Instructions

このフォルダには、GitHub Copilot のカスタム指示書 (`.instructions.md`) が格納されています。

## 📖 指示書とは？

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

## 📁 利用可能な指示書一覧

### 🏗️ フレームワーク・言語

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Next.js** | `nextjs.instructions.md` | `**/*.tsx, **/*.ts, **/*.css` |
| **Next.js + Tailwind** | `nextjs-tailwind.instructions.md` | `**/*.tsx, **/*.ts, **/*.css` |
| **TypeScript 5.x** | `typescript-5-es2022.instructions.md` | `**/*.ts, **/*.tsx` |
| **Node.js + Vitest** | `nodejs-javascript-vitest.instructions.md` | `**/*.js, **/*.ts, **/*.test.*` |

### 🎨 UI・コンポーネント

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **shadcn/ui + Radix** | `shadcn-ui-radix.instructions.md` | `src/components/ui/*.tsx` |
| **Storybook CSF 3.0** | `storybook-csf3-nextjs.instructions.md` | `**/*.stories.tsx` |

### 🧪 テスト

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Playwright** | `playwright-typescript.instructions.md` | `**/*.spec.ts, **/e2e/**` |

### 🔧 開発ツール

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Biome** | `biome-linter-formatter.instructions.md` | `**/*.ts, **/*.tsx, biome.json` |
| **Git Hooks (Husky)** | `git-hooks-husky.instructions.md` | `.husky/*, .github/workflows/*` |

### 📐 アーキテクチャ・設計

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Colocation Pattern** | `project-architecture-colocation.instructions.md` | `src/app/**, src/components/**` |
| **Object Calisthenics** | `object-calisthenics.instructions.md` | `**/*.ts, **/*.cs, **/*.java` |

### 🔒 品質・セキュリティ

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **アクセシビリティ (a11y)** | `a11y.instructions.md` | `**/*.tsx, **/*.html, **/*.css` |
| **セキュリティ (OWASP)** | `security-and-owasp.instructions.md` | `**/*.ts, **/*.tsx` |
| **パフォーマンス最適化** | `performance-optimization.instructions.md` | `**/*.ts, **/*.tsx, **/*.css` |
| **コードレビュー** | `code-review-generic.instructions.md` | `**` |

### 📝 ドキュメント・コメント

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **Markdown** | `markdown.instructions.md` | `**/*.md` |
| **自己説明的コード** | `self-explanatory-code-commenting.instructions.md` | `**/*.ts, **/*.tsx` |
| **ドキュメント自動更新** | `update-docs-on-code-change.instructions.md` | `**/*.md, **/*.ts, ...` |
| **ローカライゼーション** | `localization.instructions.md` | `**/*.md` |

### 🛠️ メタ指示書（Copilot カスタマイズ用）

| 指示書 | ファイル名 | 適用対象 |
|--------|-----------|----------|
| **指示書の書き方** | `instructions.instructions.md` | `**/*.instructions.md` |
| **プロンプトの書き方** | `prompt.instructions.md` | `**/*.prompt.md` |
| **エージェントの書き方** | `agents.instructions.md` | `**/*.agent.md` |
| **コレクションの書き方** | `collections.instructions.md` | `collections/*.yml` |

## 🚀 使い方

### 自動適用（推奨）

指示書は `applyTo` で指定されたファイルを編集する際に自動的に適用されます。特別な操作は不要です。

例：`src/components/ui/button.tsx` を編集すると、以下の指示書が自動適用されます：
- `nextjs.instructions.md`
- `nextjs-tailwind.instructions.md`
- `typescript-5-es2022.instructions.md`
- `shadcn-ui-radix.instructions.md`

### 手動で添付

チャットで特定の指示書を明示的に参照することもできます：

```
#file:.github/instructions/security-and-owasp.instructions.md
このコードのセキュリティレビューをして
```

## 📝 使用例

### TypeScript ファイルの作成

TypeScript ファイルを作成・編集する際、Copilot は自動的に以下を考慮します：
- ES2022+ の機能を活用
- strict モードの型安全性
- 命名規則とコードスタイル

```typescript
// Copilot は自動的に TypeScript のベストプラクティスに従ったコードを生成
const fetchUsers = async (): Promise<User[]> => {
  // ...
}
```

### React コンポーネントの作成

`src/app/` 配下でコンポーネントを作成すると：
- Next.js App Router のパターンに従う
- Server/Client Components を適切に使い分け
- Tailwind CSS のユーティリティクラスを使用
- アクセシビリティを考慮

### テストファイルの作成

`*.test.tsx` や `*.spec.ts` を作成すると：
- Vitest または Playwright のベストプラクティスに従う
- 適切なアサーションを使用
- テストの構造化（Arrange-Act-Assert）

## ⚙️ 設定

### VS Code 設定

`settings.json` で指示書ファイルの場所を指定できます：

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  }
}
```

### 特定の指示書を無効化

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".github/instructions/legacy": false
  }
}
```

## 📚 参考リンク

- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [Custom Instructions Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization#_instruction-files)

## 🆕 新しい指示書の作成

新しい指示書を作成する場合は、`instructions.instructions.md` のガイドラインに従ってください。

```bash
# ファイル名の規則
<technology-or-topic>.instructions.md

# 例
react-query.instructions.md
api-design.instructions.md
```

### テンプレート

```yaml
---
applyTo: "適用対象のファイルパターン"
description: "指示書の説明"
---

# 指示書タイトル

## 概要
この指示書の目的...

## ルール
1. ルール1
2. ルール2

## 例

### ✅ 良い例
\`\`\`typescript
// 良いコード例
\`\`\`

### ❌ 悪い例
\`\`\`typescript
// 避けるべきコード例
\`\`\`
```
