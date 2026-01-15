# GitHub Copilot Instructions ガイド

このドキュメントでは、`.github/instructions` ディレクトリに格納されている様々な Instructions ファイルについて、それぞれの役割、使い方、使い分け方を学習者向けに解説します。

**最終更新**: 2025年7月

> **📊 ファイル数**: 現在 **34** 個の Instructions ファイルが利用可能です。

---

## 📖 目次

1. [Instructions とは](#instructions-とは)
2. [Instructions の仕組み](#instructions-の仕組み)
3. [カテゴリ別ガイド](#カテゴリ別ガイド)
   - [🔧 メタ Instructions（Instructions 作成用）](#-メタ-instructionsinstructions-作成用)
   - [⚛️ フレームワーク・ライブラリ](#️-フレームワークライブラリ)
   - [📝 言語・開発標準](#-言語開発標準)
   - [🧪 テスト・品質保証](#-テスト品質保証)
   - [🎨 UI・スタイリング](#-uiスタイリング)
   - [🔒 セキュリティ・パフォーマンス](#-セキュリティパフォーマンス)
   - [📋 プロジェクト管理・アーキテクチャ](#-プロジェクト管理アーキテクチャ)
   - [🛠️ DevOps・ツール](#️-devopsツール)
   - [📚 ドキュメント・ローカライゼーション](#-ドキュメントローカライゼーション)
   - [🤖 Copilot 制御](#-copilot-制御)
   - [🛡️ AI 安全性・プロンプトエンジニアリング](#️-ai-安全性プロンプトエンジニアリング)
4. [Instructions の使い分けフローチャート](#instructions-の使い分けフローチャート)
5. [このプロジェクトで有効な Instructions](#このプロジェクトで有効な-instructions)
6. [カスタム Instructions の作成方法](#カスタム-instructions-の作成方法)
7. [参考リンク](#参考リンク)

---

## Instructions とは

**Instructions** は、GitHub Copilot に対してプロジェクト固有のルールやベストプラクティスを教えるための設定ファイルです。これにより、Copilot はあなたのプロジェクトのコーディング規約、アーキテクチャパターン、使用ライブラリの最新のベストプラクティスに沿ったコードを生成できます。

### Instructions の特徴

| 特徴 | 説明 |
|------|------|
| **自動適用** | `applyTo` で指定したファイルパターンに一致するファイルを編集する際、自動的に適用される |
| **累積効果** | 複数の Instructions を組み合わせて使用可能 |
| **プロジェクト固有** | リポジトリ単位でカスタマイズ可能 |
| **ドキュメント形式** | Markdown で記述され、人間にも読みやすい |

### Instructions の効果

```
Before (Instructions なし):
Copilot → 一般的なコードを生成（プロジェクトの規約を無視）

After (Instructions あり):
Copilot → プロジェクトの規約に沿ったコードを生成
        → 使用ライブラリのベストプラクティスを適用
        → セキュリティ・パフォーマンスを考慮
```

---

## Instructions の仕組み

### ファイル構造

Instructions ファイルは以下の構造を持ちます：

```yaml
---
description: '簡潔な説明文'
applyTo: '適用対象のファイルパターン'
---

# タイトル

本文（Markdown形式でルールやベストプラクティスを記述）
```

### 主要なフロントマターフィールド

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `description` | 推奨 | Instructions の目的を説明（1-500文字） |
| `applyTo` | 必須 | 適用対象のファイルパターン（glob形式） |

### applyTo パターン例

| パターン | 適用対象 |
|---------|---------|
| `**/*.ts` | すべての TypeScript ファイル |
| `**/*.tsx, **/*.ts` | TypeScript + TSX ファイル |
| `src/components/**` | src/components 配下のすべてのファイル |
| `**` | すべてのファイル |
| `**/Dockerfile` | すべての Dockerfile |

---

## カテゴリ別ガイド

### 🔧 メタ Instructions（Instructions 作成用）

新しい Instructions、Agent、Prompt、Collection を作成する際のガイドラインです。

#### instructions.instructions.md

**目的**: 高品質な Instructions ファイルの作成ガイドライン

**適用対象**: `**/*.instructions.md`

**主な内容**:
- Instructions ファイルの必須構造（フロントマター、セクション構成）
- 良い Instructions の書き方（具体例の提供、Why の説明）
- 命名規則（kebab-case、説明的なファイル名）

**使い方**:
```bash
# 新しい Instructions を作成する際に参考にする
# Copilot に「新しい Instructions を作成して」と依頼すると、
# このガイドラインに沿ったファイルが生成される
```

---

#### agents.instructions.md

**目的**: カスタム Agent ファイルの作成ガイドライン

**適用対象**: `**/*.agent.md`

**主な内容**:
- Agent のフロントマター構造（name, description, tools, model）
- ツール設定方法
- Handoffs（エージェント間の引き継ぎ）の設定

**使い方**:
```bash
# カスタム Agent を作成する際に参考にする
@custom-agent-foundry 〇〇用のエージェントを作成して
```

---

#### prompt.instructions.md

**目的**: Prompt ファイルの作成ガイドライン

**適用対象**: `**/*.prompt.md`

**主な内容**:
- Prompt のフロントマター（description, tools, agent）
- 入力変数の使い方（`${input:variableName}`）
- 品質保証チェックリスト

**使い方**:
```bash
# 再利用可能な Prompt を作成する際に参考にする
```

---

#### collections.instructions.md

**目的**: awesome-copilot Collections の作成ガイドライン

**適用対象**: `collections/*.collection.yml`

**主な内容**:
- Collection の YAML スキーマ
- バリデーションルール
- ベストプラクティス（3-10アイテムの推奨）

---

#### agent-skills.instructions.md ⭐ NEW

**目的**: Agent Skills（スキルファイル）の作成ガイドライン

**適用対象**: `**/.github/skills/**/SKILL.md, **/.claude/skills/**/SKILL.md`

**主な内容**:
- Agent Skills とは（ポータブル、プログレッシブ読み込み、リソースバンドル）
- ディレクトリ構成（`.github/skills/<skill-name>/`）
- SKILL.md の必須フォーマット（フロントマター、本文）
- リソースのバンドル方法（scripts/, references/, assets/, templates/）

**SKILL.md の基本構造**:
```yaml
---
name: webapp-testing
description: Toolkit for testing local web applications using Playwright...
license: Complete terms in LICENSE.txt
---

# Title

## When to Use This Skill
## Prerequisites
## Step-by-Step Workflows
## Troubleshooting
```

**description の書き方（重要）**:
```yaml
# ✅ 良い例: WHAT + WHEN + KEYWORDS を含む
description: Toolkit for testing local web applications using Playwright. 
  Use when asked to verify frontend functionality, debug UI behavior, 
  capture browser screenshots, check for visual regressions, or view 
  browser console logs. Supports Chrome, Firefox, and WebKit browsers.

# ❌ 悪い例: 曖昧で発見されにくい
description: Web testing helpers
```

---

### ⚛️ フレームワーク・ライブラリ

特定のフレームワークやライブラリを使用する際のベストプラクティスです。

#### nextjs.instructions.md ⭐

**目的**: Next.js 16 (App Router) のベストプラクティス

**適用対象**: `**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css`

**主な内容**:
- プロジェクト構造（`app/`, `lib/`, `components/`）
- Server/Client Components の使い分け
- **v16 の重要な変更**: `params`, `searchParams` が async になった
- キャッシュ戦略（`use cache` ディレクティブ）

**重要なルール**:
```typescript
// ❌ NG: Server Component で dynamic({ ssr: false }) を使う
import dynamic from 'next/dynamic';
const ClientOnly = dynamic(() => import('./Client'), { ssr: false }); // エラー！

// ✅ OK: Client Component を直接インポート
import ClientComponent from './ClientComponent';
```

**使い方**:
- Next.js のコードを書く際に自動適用
- Server/Client の境界を意識したコード生成

---

#### nextjs-tailwind.instructions.md

**目的**: Next.js + Tailwind CSS の統合ガイドライン

**適用対象**: `**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css`

**主な内容**:
- アーキテクチャ（App Router, Server/Client Components）
- TypeScript との統合（strict mode）
- スタイリング（ダークモード、レスポンシブデザイン）
- セキュリティ・パフォーマンスのベストプラクティス

---

#### reactjs.instructions.md

**目的**: React 19+ の開発標準

**適用対象**: `**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css, **/*.scss`

**主な内容**:
- 関数コンポーネント + Hooks の使用
- 状態管理（useState, useReducer, useContext）
- カスタム Hooks の作成
- TypeScript との統合

**重要なルール**:
```typescript
// ✅ 関数コンポーネント + Hooks
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  // ...
}

// ❌ クラスコンポーネント（非推奨）
class UserProfile extends React.Component { }
```

---

#### shadcn-ui-radix.instructions.md ⭐

**目的**: shadcn/ui + Radix UI のガイドライン

**適用対象**: `src/components/ui/*.tsx, components.json`

**主な内容**:
- コンポーネントの追加方法（`pnpm dlx shadcn@latest add`）
- ディレクトリ構成（`src/components/ui/`）
- カスタマイズ方法
- `asChild` パターンの使い方

**使い方**:
```bash
# コンポーネントの追加
pnpm dlx shadcn@latest add button card input

# Button の使用例（Copilot が自動生成）
<Button variant="outline" size="sm">Click me</Button>
```

---

#### storybook-csf3-nextjs.instructions.md ⭐

**目的**: Storybook 10 (CSF 3.0) のガイドライン

**適用対象**: `**/*.stories.tsx, **/*.stories.ts, .storybook/**`

**主な内容**:
- Story ファイルの配置（コンポーネントと同じディレクトリ）
- CSF 3.0 形式の書き方
- `autodocs` タグによる自動ドキュメント生成
- インタラクションテスト（play function）

**Story の基本構造**:
```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"], // 自動ドキュメント生成
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Button" },
};
```

---

#### tanstack-start-shadcn-tailwind.instructions.md

**目的**: TanStack Start アプリケーションのガイドライン

**適用対象**: `**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css, **/*.scss, **/*.json`

**主な内容**:
- TanStack Start + shadcn/ui + Tailwind CSS の統合
- Route Loaders vs React Query の使い分け
- Zod によるバリデーション

---

### 📝 言語・開発標準

プログラミング言語固有のベストプラクティスです。

#### typescript-5-es2022.instructions.md ⭐

**目的**: TypeScript 5.x + ES2022 の開発ガイドライン

**適用対象**: `**/*.ts, **/*.tsx`

**主な内容**:
- strict mode の必須設定
- `any` の禁止（`unknown` を使用）
- 型ガード、ジェネリクス、ユーティリティ型
- ES2022 機能（`at()`, `hasOwn()`, top-level await）

**重要なルール**:
```typescript
// ❌ any は使用禁止
function process(data: any) { }

// ✅ 具体的な型を定義
interface UserData {
  id: string;
  name: string;
}
function process(data: UserData) { }

// ✅ 未知のデータには unknown を使用
function processUnknown(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // 型ガードで絞り込む
  }
}
```

---

#### nodejs-javascript-vitest.instructions.md ⭐

**目的**: Node.js + JavaScript/TypeScript + Vitest の開発標準

**適用対象**: `**/*.js, **/*.ts, **/*.test.js, **/*.test.ts`

**主な内容**:
- Node.js 20.x LTS 以上
- ES Modules の使用（`node:` プロトコル）
- Vitest によるテスト
- async/await、destructuring などのモダン構文

**Vitest テスト例**:
```typescript
import { describe, it, expect } from 'vitest';

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

---

#### object-calisthenics.instructions.md

**目的**: Object Calisthenics の9つのルール

**適用対象**: `**/*.{cs,ts,java}`

**主な内容**:
- メソッドのインデントは1レベルまで
- `else` キーワードの禁止（早期リターンを使用）
- プリミティブの隠蔽
- ファーストクラスコレクション
- 1行に1ドットまで

**適用範囲**:
- ビジネスドメインコード（エンティティ、値オブジェクト、ドメインサービス）
- **除外**: DTO、APIモデル、設定クラス

---

### 🧪 テスト・品質保証

テストやコード品質に関するガイドラインです。

#### playwright-typescript.instructions.md ⭐

**目的**: Playwright E2E テストのガイドライン

**適用対象**: `**/*.spec.ts, **/*.test.ts, **/e2e/**`

**主な内容**:
- ユーザー視点のテスト設計
- 強いセレクター（`getByRole`, `getByLabel`）の使用
- Page Object Model パターン
- テストの独立性

**セレクターの優先順位**:
```typescript
// ✅ 推奨: アクセシビリティベースのセレクター
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@example.com');

// ⚠️ 次善策
await page.getByTestId('submit-button').click();

// ❌ 避ける: 脆弱なセレクター
await page.locator('.btn-primary').click();
```

---

#### self-explanatory-code-commenting.instructions.md ⭐

**目的**: 自己説明的コードとコメントのガイドライン

**適用対象**: `**/*.ts, **/*.tsx, **/*.js, **/*.jsx`

**主な内容**:
- **WHY** を説明するコメントを書く（WHAT は書かない）
- 変数名・関数名で意図を表現
- JSDoc は公開 API に使用

**コメントの原則**:
```typescript
// ❌ 不要なコメント（何をしているかは見れば分かる）
// ユーザーIDでユーザーを取得
function getUserById(id: string) { }

// ✅ 必要なコメント（なぜそうするかの説明）
// NOTE: 外部APIの制限により、1回のリクエストで100件までしか取得できない
const BATCH_SIZE = 100;
```

---

#### code-review-generic.instructions.md

**目的**: コードレビューのガイドライン

**適用対象**: `**`（すべてのファイル）

**主な内容**:
- レビュー優先度（🔴 CRITICAL → 🟡 IMPORTANT → 🟢 SUGGESTION）
- Clean Code チェック項目
- セキュリティレビュー（OWASP）
- テスト品質のチェック

---

### 🎨 UI・スタイリング

UI デザインやスタイリングに関するガイドラインです。

#### html-css-style-color-guide.instructions.md

**目的**: HTML/CSS のカラー使用ガイドライン

**適用対象**: `**/*.html, **/*.css, **/*.js`

**主な内容**:
- **60-30-10 ルール**（Primary 60%, Secondary 30%, Accent 10%）
- 背景色の推奨（白、オフホワイト、ライトブルー）
- テキスト色の推奨（ダークニュートラル）
- アクセシビリティを考慮したコントラスト

---

### 🔒 セキュリティ・パフォーマンス

セキュリティとパフォーマンス最適化のガイドラインです。

#### security-and-owasp.instructions.md ⭐

**目的**: OWASP Top 10 に基づくセキュリティガイドライン

**適用対象**: `**/*.ts, **/*.tsx, **/*.js, **/*.jsx`

**主な内容**:
- **A01: Broken Access Control** - サーバーサイドでのアクセス制御
- **A02: Cryptographic Failures** - 強力な暗号化アルゴリズムの使用
- **A03: Injection** - パラメータ化クエリの使用
- **A07: XSS** - 入力のサニタイズ

**重要なルール**:
```typescript
// ❌ SQL インジェクションの脆弱性
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ パラメータ化クエリ
const stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
stmt.setString(1, email);
```

---

#### a11y.instructions.md ⭐

**目的**: WCAG 2.2 Level AA アクセシビリティガイドライン

**適用対象**: `**/*.tsx, **/*.ts, **/*.jsx, **/*.html, **/*.css`

**主な内容**:
- **WCAG 4原則**: Perceivable, Operable, Understandable, Robust
- キーボードナビゲーション
- ARIA 属性の使用
- フォーカス管理

**重要なルール**:
```tsx
// ❌ キーボードでアクセスできない
<div onClick={handleClick}>Click me</div>

// ✅ キーボードでもアクセス可能
<button onClick={handleClick}>Click me</button>

// または、div を使う必要がある場合
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  }}
>
  Click me
</div>
```

---

#### performance-optimization.instructions.md ⭐

**目的**: パフォーマンス最適化の包括的ガイドライン

**適用対象**: `**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css`

**主な内容**:
- **フロントエンド**: コード分割、遅延ロード、画像最適化
- **バックエンド**: N+1 問題の回避、キャッシュ戦略
- **データベース**: インデックス、クエリ最適化

---

### 📋 プロジェクト管理・アーキテクチャ

プロジェクト構造やワークフローに関するガイドラインです。

#### project-architecture-colocation.instructions.md ⭐

**目的**: Colocation Pattern によるプロジェクト構造

**適用対象**: `src/app/**, src/components/**`

**主な内容**:
- 関連ファイルを同じディレクトリに配置
- `_` プレフィックスでプライベートフォルダを示す
- 命名規則（コンポーネント: PascalCase、ユーティリティ: kebab-case）

**ディレクトリ構成例**:
```
src/app/catalog/
├── page.tsx           # ページ
├── _components/       # このページ専用のコンポーネント
│   ├── PageCard.tsx
│   ├── PageCard.test.tsx
│   └── PageCard.stories.tsx
├── _hooks/            # このページ専用のフック
└── _lib/              # このページ専用のロジック
```

---

#### spec-driven-workflow-v1.instructions.md

**目的**: 仕様駆動開発ワークフロー

**適用対象**: `**`（すべてのファイル）

**主な内容**:
- 6フェーズの開発プロセス（ANALYZE → DESIGN → IMPLEMENT → VALIDATE → REFLECT → HANDOFF）
- EARS 記法による要件定義
- 信頼度スコアに基づく戦略選択

---

#### task-implementation.instructions.md

**目的**: タスク計画の実装ガイドライン

**適用対象**: `**/.copilot-tracking/changes/*.md`

**主な内容**:
- task-planner で生成された計画の実装方法
- 変更追跡ファイルの更新
- 品質基準

**使い方**:
```bash
# task-planner で計画を作成した後、Agent モードで実行
#file:.copilot-tracking/prompts/implement-*.prompt.md
```

---

### 🛠️ DevOps・ツール

開発ツールや CI/CD に関するガイドラインです。

#### biome-linter-formatter.instructions.md ⭐

**目的**: Biome (Linter/Formatter) のガイドライン

**適用対象**: `**/*.ts, **/*.tsx, **/*.js, **/*.jsx, biome.json`

**主な内容**:
- CLI コマンド（`biome check --write`）
- 設定ファイル（`biome.json`）の構成
- VS Code 連携

**よく使うコマンド**:
```bash
# Lint + Format のチェック + 自動修正
pnpm exec biome check --write

# ステージファイルのみ
pnpm exec biome check --staged --write
```

---

#### git-hooks-husky.instructions.md ⭐

**目的**: husky による Git Hooks の設定

**適用対象**: `.husky/*, .github/workflows/*`

**主な内容**:
- pre-commit: `biome check --staged --write`
- pre-push: `pnpm type-check`
- CI 環境でのスキップ設定

---

#### devops-core-principles.instructions.md

**目的**: DevOps のコア原則

**適用対象**: `*`（すべてのファイル）

**主な内容**:
- **CALMS フレームワーク**: Culture, Automation, Lean, Measurement, Sharing
- **DORA メトリクス**: Deployment Frequency, Lead Time, Change Failure Rate, MTTR

---

#### containerization-docker-best-practices.instructions.md

**目的**: Docker のベストプラクティス

**適用対象**: `**/Dockerfile, **/docker-compose*.yml`

**主な内容**:
- マルチステージビルド
- イメージサイズの最適化
- セキュリティスキャン
- ランタイムのベストプラクティス

---

### 📚 ドキュメント・ローカライゼーション

ドキュメント作成に関するガイドラインです。

#### markdown.instructions.md

**目的**: Markdown ドキュメントの作成標準

**適用対象**: `**/*.md`

**主な内容**:
- 見出し構造（H1 は使わない、H2 から始める）
- コードブロック（言語指定必須）
- リンク・画像の書き方
- フロントマターの必須フィールド

---

#### localization.instructions.md

**目的**: ドキュメントのローカライズガイドライン

**適用対象**: `**/*.md`

**主な内容**:
- ロケール形式（`ja-jp`, `en-us`）
- 配置先（`localization/{{locale}}/`）
- Disclaimer の追加

---

#### update-docs-on-code-change.instructions.md

**目的**: コード変更時のドキュメント自動更新

**適用対象**: `**/*.{md,js,ts,tsx,...}`

**主な内容**:
- ドキュメント更新のトリガー条件
- README.md の更新タイミング
- API ドキュメントの同期

---

### 🤖 Copilot 制御

GitHub Copilot の動作を制御するガイドラインです。

#### taming-copilot.instructions.md ⭐

**目的**: Copilot の動作を制御し、予期しない変更を防ぐ

**適用対象**: `**`（すべてのファイル）

**主な内容**:
- **ユーザー指示の優先**: ユーザーの明示的な指示が最優先
- **事実の検証**: ツールを使って最新情報を確認
- **最小限の変更**: 既存コードを尊重し、必要最小限の変更のみ

**重要なルール**:
```
✅ DO:
- シンプルで最小限のソリューションを提供
- 標準ライブラリを優先
- 既存のコードスタイルを維持
- 変更の理由を説明

❌ DON'T:
- 要求されていないリファクタリング
- 複雑で「賢い」解決策
- 既存コードの大規模な置き換え
```

---

### 🛡️ AI 安全性・プロンプトエンジニアリング

AI の安全な使用とプロンプトエンジニアリングに関するガイドラインです。

#### ai-prompt-engineering-safety-best-practices.instructions.md ⭐ NEW

**目的**: AI プロンプトエンジニアリング、安全フレームワーク、バイアス軽減、責任ある AI 使用のベストプラクティス

**適用対象**: `**`（すべてのファイル）

**主な内容**:

1. **プロンプトエンジニアリングの基礎**
   - 明確さ、コンテキスト、制約の重要性
   - プロンプトパターン（Zero-Shot、Few-Shot、Chain-of-Thought、Role Prompting）
   - アンチパターン（曖昧さ、冗長さ、プロンプトインジェクション）

2. **安全性とバイアス軽減**
   - レッドチーミング手法
   - 有害なアウトプットの検出
   - バイアスを減らすためのプロンプト表現
   - モデレーション API の統合

3. **責任ある AI 使用**
   - 透明性と説明可能性
   - データプライバシーと監査可能性
   - Microsoft / Google / OpenAI の AI 原則

4. **セキュリティ**
   - プロンプトインジェクションの防止
   - データ漏洩の防止
   - 入力のバリデーションとサニタイズ

**プロンプトパターンの使い分け**:

| パターン | 用途 | 使用タイミング |
|---------|------|---------------|
| Zero-Shot | シンプルで明確なタスク | 素早い回答、明確な問題 |
| Few-Shot | 複雑なタスク、特定のフォーマット | 例があると期待が明確になる場合 |
| Chain-of-Thought | 問題解決、推論 | ステップバイステップの思考が必要な場合 |
| Role Prompting | 専門知識、特定の視点 | 専門性や視点が重要な場合 |

**安全なプロンプト構築の例**:
```javascript
// ❌ 脆弱: ユーザー入力を直接補間
const prompt = `Translate this text: ${userInput}`;

// ✅ 安全: 入力をサニタイズ
const sanitizedInput = sanitizeInput(userInput);
const prompt = `Translate this text: ${sanitizedInput}`;
```

**Safety Review Checklist**:
- [ ] 有害なコンテンツのテスト済み
- [ ] モデレーションレイヤーが設置済み
- [ ] バイアスのテスト済み
- [ ] 入力バリデーションが実装済み
- [ ] 監査トレイルが維持されている

---

## Instructions の使い分けフローチャート

```
┌─────────────────────────────────────────────────────────────────┐
│              Instructions 選択フローチャート                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  「何を作成・編集する？」                                         │
│         │                                                       │
│    ┌────┴────┬─────────┬─────────┬─────────┐                   │
│  React/     テスト    ドキュメント  設定/     その他             │
│  Next.js    作成      作成        インフラ                       │
│    │         │         │          │                             │
│    ▼         ▼         ▼          ▼                             │
│  nextjs     playwright markdown   docker                        │
│  reactjs    vitest    localization husky                        │
│  shadcn-ui                        biome                         │
│                                                                 │
│  常に適用される Instructions:                                    │
│  ├── typescript-5-es2022 (TypeScript コード)                    │
│  ├── security-and-owasp (セキュリティ)                          │
│  ├── a11y (アクセシビリティ)                                    │
│  ├── performance-optimization (パフォーマンス)                   │
│  ├── self-explanatory-code-commenting (コメント)                │
│  └── taming-copilot (Copilot 制御)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## このプロジェクトで有効な Instructions

### プライマリ（必ず参照）

| Instructions | 説明 | 重要度 |
|-------------|------|-------|
| **nextjs.instructions.md** | Next.js 16 のベストプラクティス | ⭐⭐⭐ |
| **typescript-5-es2022.instructions.md** | TypeScript の型安全性 | ⭐⭐⭐ |
| **shadcn-ui-radix.instructions.md** | UI コンポーネント | ⭐⭐⭐ |
| **biome-linter-formatter.instructions.md** | コード品質 | ⭐⭐⭐ |

### セカンダリ（関連する作業時に参照）

| Instructions | 適用場面 |
|-------------|---------|
| **storybook-csf3-nextjs.instructions.md** | Story ファイル作成時 |
| **nodejs-javascript-vitest.instructions.md** | テストコード作成時 |
| **playwright-typescript.instructions.md** | E2E テスト作成時 |
| **project-architecture-colocation.instructions.md** | ファイル配置を決める時 |

### 常に適用（すべての作業）

| Instructions | 説明 |
|-------------|------|
| **security-and-owasp.instructions.md** | セキュリティ |
| **a11y.instructions.md** | アクセシビリティ |
| **self-explanatory-code-commenting.instructions.md** | コメント規約 |
| **taming-copilot.instructions.md** | Copilot 制御 |
| **ai-prompt-engineering-safety-best-practices.instructions.md** | AI 安全性・プロンプト設計 |

### メタ（Copilot 設定作成時に参照）

| Instructions | 適用場面 |
|-------------|---------|
| **instructions.instructions.md** | 新しい Instructions 作成時 |
| **agents.instructions.md** | 新しい Agent 作成時 |
| **prompt.instructions.md** | 新しい Prompt 作成時 |
| **agent-skills.instructions.md** | 新しい Skill 作成時 |

---

## カスタム Instructions の作成方法

### 1. ファイルの作成

```bash
# .github/instructions/ ディレクトリに新しいファイルを作成
touch .github/instructions/my-custom.instructions.md
```

### 2. フロントマターの追加

```yaml
---
description: '何のための Instructions かを簡潔に説明'
applyTo: '適用対象のファイルパターン'
---
```

### 3. 本文の作成

```markdown
# タイトル

> 概要（1-2文で目的を説明）

## セクション1

具体的なルールやベストプラクティスを記述...

### Good Example

\`\`\`typescript
// 推奨されるコード例
\`\`\`

### Bad Example

\`\`\`typescript
// 避けるべきコード例
\`\`\`
```

### 4. ベストプラクティス

- **具体的に**: 抽象的な説明ではなく、コード例を含める
- **Why を説明**: なぜそのルールが重要かを説明
- **更新を維持**: 使用するライブラリのバージョンアップに合わせて更新

---

## 参考リンク

### 公式ドキュメント

- [VS Code Copilot Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [GitHub Copilot Prompt Engineering](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)

### awesome-copilot

- [Instructions Collection](https://github.com/github/awesome-copilot/tree/main/instructions)
- [Agents Collection](https://github.com/github/awesome-copilot/tree/main/agents)
- [Prompts Collection](https://github.com/github/awesome-copilot/tree/main/prompts)

### このプロジェクトの関連ドキュメント

- [Copilot Agents Guide](./COPILOT_AGENTS_GUIDE.md) - カスタム Agent の使い方
- [shadcn/ui Guide](./SHADCN_GUIDE.md) - UI コンポーネントの詳細
- [Improvement Roadmap](./IMPROVEMENT_ROADMAP.md) - プロジェクトの改善計画

---

*このドキュメントは学習者向けに作成されています。各 Instructions を実際に使ってみて、Copilot の出力がどのように変わるかを確認してください！*
