# CLAUDE.md

Next.js 16 学習プレイグラウンド — React / Next.js の各種パターンをインタラクティブに学ぶカタログアプリ。

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (new-york style)
- Jotai（状態管理） / Vercel AI SDK + OpenAI（AI連携）
- Vitest 4 + Testing Library + Storybook 10
- Biome（リント・フォーマット） / pnpm

## コマンド

```bash
pnpm dev            # 開発サーバー起動
pnpm build          # プロダクションビルド
pnpm lint           # Biome によるリント
pnpm format         # Biome によるフォーマット
pnpm type-check     # TypeScript 型チェック
pnpm test           # 全テスト実行（watch）
pnpm test:unit      # ユニットテストのみ（watch）
pnpm test:storybook # Storybook テストのみ（watch）
pnpm test:run       # 全テスト実行（non-watch）
pnpm test:unit:run  # ユニットテストのみ（non-watch, CI）
pnpm test:storybook:run  # Storybook テストのみ（non-watch, CI）
pnpm test:coverage  # カバレッジ計測
pnpm storybook      # Storybook 起動 (port 6006)
```

## ディレクトリ構成

```
src/
├── app/
│   ├── _lib/           # 共有データ (catalog-data.ts, category-styles.ts)
│   ├── api/chat/       # AI チャット API ルート
│   ├── catalog/        # カタログページ（サイドバーレイアウト）
│   ├── examples/       # カテゴリ別サンプルページ
│   │   └── [category]/[page]/  # 汎用フォールバック（静的 params / metadata 対応）
│   ├── globals.css     # Tailwind v4 テーマ定義
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── components/
│   ├── ui/             # shadcn/ui コンポーネント
│   └── *.tsx           # アプリ共通コンポーネント
├── hooks/              # カスタムフック
└── lib/utils.ts        # cn() ユーティリティ
```

## コーディング規約

- **日本語 JSDoc**: `@remarks`, `@example`, `@see` タグを積極的に使用
- **インポートエイリアス**: `@/*` → `src/*`
- **React Compiler**: 有効 (`next.config.ts` の `reactCompiler: true`)
- **コンポーネント配置**: 例題固有のコンポーネントは `_components/` にコロケーション
- **UI コンポーネント追加**: `pnpm dlx shadcn@latest add <component>`
- **フォーマッタ/リンタ**: Biome のみ使用（ESLint/Prettier は無効）

## テスト規約

- ユニットテスト: `*.test.ts(x)` — Vitest + Testing Library (jsdom)
- Storybook: `*.stories.tsx` — CSF 3 形式、`autodocs` タグ必須
- テストの setup: `vitest.setup.ts`（jest-dom マッチャー、matchMedia モック）

## ページ追加手順

1. `src/app/_lib/catalog-data.ts` の `pages` 配列にエントリ追加
2. `src/app/examples/<category>/<page-id>/page.tsx` に専用ページ作成
3. 必要に応じて `_components/` にコンポーネントをコロケーション

## 自律開発パイプライン

このリポジトリはコーディングエージェントによる自律開発を前提に運用する。
設計の全体像は `docs/AUTONOMOUS_AGENT_ENVIRONMENT.html`、採用理由は `docs/adr/0001` を参照。

- **共通フォーマット**: 自動処理してよいタスクは `claude:auto` ラベル付き Issue にする。
  ラベルが付くと `claude-resolve-issue.yml` が発火し、調査 → 実装 → テスト → PR 作成まで自動で行う
- **スキル**: `/resolve-issue <番号>`（Issue 解決）、`/propose`（改善提案）、
  `/security-audit`（セキュリティ監査）、`/write-adr <PR番号>`（ADR 作成）。
  いずれもローカルでも CI でも同じものが動く
- **品質ゲート**: PR は CI（lint / type-check / test / build）と自動レビューを通過すること。
  **マージは人間が行う**（自動マージしない）
- **ADR**: 重要な設計判断は `docs/adr/` に記録する（基準は `docs/adr/README.md`）
- **検証コマンド**: 実装後は `pnpm lint && pnpm type-check && pnpm test:run` が全て成功するまで完了としない
