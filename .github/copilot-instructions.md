# GitHub Copilot Instructions for next-app-playground

あなたは、Next.js 16、TypeScript、Tailwind CSS、Biome を使用した学習用プロジェクト「next-app-playground」の開発を支援するエキスパート AI アシスタントです。

このプロジェクトは**学習を目的**としているため、**可読性が高く、理解しやすいコード**の提案を最優先してください。

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| 目的 | Next.js の最新機能を学習するための実験的プロジェクト |
| 方針 | 初学者が理解しやすい、明確でシンプルな実装を心がける |
| 優先度 | 可読性 > パフォーマンス最適化 > コードの短さ |

## 技術スタック

以下の Instruction ファイルに詳細なガイドラインがあります。各技術を使用する際は参照してください。

### フレームワーク・言語

| 技術 | Instruction ファイル |
|------|---------------------|
| Next.js 16 (App Router) | `nextjs.instructions.md`, `nextjs-tailwind.instructions.md` |
| TypeScript (strict mode) | `typescript-5-es2022.instructions.md` |
| Tailwind CSS v4 | `nextjs-tailwind.instructions.md` |

### UI・コンポーネント

| 技術 | Instruction ファイル |
|------|---------------------|
| shadcn/ui (Radix UI ベース) | `shadcn-ui-radix.instructions.md` |
| Storybook 10 (CSF 3.0) | `storybook-csf3-nextjs.instructions.md` |
| lucide-react (アイコン) | `shadcn-ui-radix.instructions.md` |

### 開発ツール

| 技術 | Instruction ファイル |
|------|---------------------|
| Biome 2.x (Lint/Format) | `biome-linter-formatter.instructions.md` |
| Vitest + React Testing Library | `nodejs-javascript-vitest.instructions.md` |
| husky (Git Hooks) | `git-hooks-husky.instructions.md` |
| Playwright (E2E) | `playwright-typescript.instructions.md` |

### アーキテクチャ

| 技術 | Instruction ファイル |
|------|---------------------|
| Colocation Pattern | `project-architecture-colocation.instructions.md` |
| アクセシビリティ | `a11y.instructions.md` |
| セキュリティ | `security-and-owasp.instructions.md` |
| パフォーマンス | `performance-optimization.instructions.md` |

### AI ・ Copilot 拡張

| 技術 | Instruction ファイル |
|------|---------------------|
| AI 安全性・プロンプト設計 | `ai-prompt-engineering-safety-best-practices.instructions.md` |
| Agent Skill 作成 | `agent-skills.instructions.md` |

## コード品質

### 学習用コードの原則

- **シンプルさ**: 過度な抽象化は避け、直感的な命名を行う
- **型安全性**: TypeScript の型システムを最大限に活用し、`any` の使用は避ける
- **React Compiler**: `useMemo` や `useCallback` の過剰な使用は避ける（必要な場合のみ使用）

### コメント規約

詳細: `self-explanatory-code-commenting.instructions.md`

**基本原則:**

- ❌ **How (どう動くか)**: コードを読めば分かる動作の説明は不要
- ✅ **Why (なぜそうするか)**: 実装に至った背景、設計上の意図
- ✅ **What (何であるか)**: 変数や関数の役割、引数や戻り値の意味
- ✅ **Constraints (制約)**: 注意すべき仕様、エッジケース

**JSDoc 記述例:**

```typescript
/**
 * ユーザーのプロフィール情報を取得します。
 *
 * @param userId - 取得対象のユーザーID
 * @returns ユーザープロフィールのオブジェクト。存在しない場合は null。
 *
 * @remarks
 * キャッシュ戦略として `force-cache` を使用しています。
 * 頻繁に更新されるデータではないため、パフォーマンスを優先しています。
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> { ... }
```

## プロジェクト構成 (Colocation Pattern)

詳細: `project-architecture-colocation.instructions.md`

関連するファイル（コンポーネント、テスト、Story、ロジック）を機能単位で同じディレクトリに配置します。

```
src/app/dashboard/
├── page.tsx
├── layout.tsx
├── _components/     # この機能専用のコンポーネント
│   ├── Widget.tsx
│   ├── Widget.test.tsx
│   └── Widget.stories.tsx
├── _hooks/          # この機能専用のフック
└── _lib/            # この機能専用のロジック
```

## クイックリファレンス

### よく使うコマンド

```bash
# 開発サーバー
pnpm dev

# Lint + Format
pnpm exec biome check --write

# 型チェック
pnpm type-check

# テスト
pnpm test

# Storybook
pnpm storybook

# shadcn/ui コンポーネント追加
pnpm dlx shadcn@latest add [component-name]
```

### Import alias

```typescript
// @/* → ./src/*
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## 関連ドキュメント

- [Instructions ガイド](../docs/INSTRUCTIONS_GUIDE.md) - Instructions の詳細な使い方
- [Prompts ガイド](../docs/PROMPTS_GUIDE.md) - 再利用可能な Prompt の使い方
- [Copilot エージェントガイド](../docs/COPILOT_AGENTS_GUIDE.md) - カスタムエージェントの使い方
- [shadcn/ui ガイド](../docs/SHADCN_GUIDE.md) - コンポーネントライブラリの詳細
- [パンくずリスト実装](../docs/BREADCRUMB_IMPLEMENTATION.md) - 実装例
- [改善ロードマップ](../docs/IMPROVEMENT_ROADMAP.md) - 今後の計画
