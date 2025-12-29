# Next.js Playground

[![CI](https://github.com/hiroxtai/next-app-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/hiroxtai/next-app-playground/actions/workflows/ci.yml)
[![Format Check](https://github.com/hiroxtai/next-app-playground/actions/workflows/format.yml/badge.svg)](https://github.com/hiroxtai/next-app-playground/actions/workflows/format.yml)
[![Dependency Review](https://github.com/hiroxtai/next-app-playground/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/hiroxtai/next-app-playground/actions/workflows/dependency-review.yml)

このプロジェクトは学習用の Next.js Playground です。最新の Next.js の機能を試したり、実装パターンを学ぶために使用します。

🌐 **デプロイ先**: https://next-app-playground-eight.vercel.app/

## プロジェクト作成コマンド

このプロジェクトは以下のコマンドで作成されました：

```bash
npx create-next-app@latest --use-pnpm
```

### プロジェクト作成時の選択内容

| 項目 | 選択 |
|------|------|
| Project name | `next-app-playground` |
| TypeScript | ✅ Yes |
| Linter | Biome |
| React Compiler | ✅ Yes |
| Tailwind CSS | ✅ Yes |
| `src/` directory | ✅ Yes |
| App Router | ✅ Yes (推奨) |
| Import alias | `@/*` (デフォルト) |

## 技術スタック

- **Next.js 16** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Biome** - 高速な linter / formatter
- **React Compiler** - 最適化されたレンダリング
- **Tailwind CSS** - ユーティリティファーストの CSS フレームワーク
- **Vitest** - 高速な単体テストフレームワーク
- **React Testing Library** - ユーザー視点のコンポーネントテスト
- **Storybook 10** - コンポーネントカタログ / ドキュメント生成
- **pnpm** - 高速で効率的なパッケージマネージャー

## ディレクトリ構造

```
next-app-playground/
├── .storybook/       # Storybook の設定
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── app/          # App Router のページとレイアウト
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/   # 共通コンポーネント（Atomic Design）
│       ├── atoms/    # Button, Input など
│       ├── molecules/
│       ├── organisms/
│       └── templates/
├── public/           # 静的ファイル
├── biome.json        # Biome の設定ファイル
├── next.config.ts    # Next.js の設定ファイル
├── tsconfig.json     # TypeScript の設定ファイル
└── vitest.config.mts # Vitest の設定ファイル
```

## 開発環境のセットアップ

### 必要な環境

- Node.js 18.17 以上
- pnpm (推奨)

### インストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### その他のコマンド

```bash
# ビルド
pnpm build

# 本番環境の起動
pnpm start

# コードチェック（Biome）
pnpm lint
```

### テストコマンド

```bash
# テストを実行（watch mode）
pnpm test

# テストを1回だけ実行（CI用）
pnpm test -- --run

# UIモードでテストを実行
pnpm test:ui

# カバレッジを計測
pnpm test:coverage
```

### Storybook コマンド

```bash
# Storybook 開発サーバーを起動（ポート 6006）
pnpm storybook

# Storybook を静的サイトとしてビルド
pnpm build-storybook
```

## Storybook（コンポーネントカタログ）

このプロジェクトでは **Storybook 10** を使用してコンポーネントカタログを管理しています。

### 特徴

- **@storybook/nextjs-vite**: Vite ベースの高速な開発体験
- **addon-a11y**: アクセシビリティチェック
- **addon-vitest**: Vitest との統合によるインタラクションテスト
- **autodocs**: Props から自動生成されるドキュメント

### Story ファイルの配置

コンポーネントと同じディレクトリに `.stories.tsx` ファイルを配置します：

```
src/components/atoms/Button/
├── Button.tsx          # コンポーネント
├── Button.stories.tsx  # Story ファイル
└── index.ts            # バレルエクスポート
```

### コンポーネント構造（Atomic Design）

```
src/components/
├── atoms/       # ボタン、入力など最小単位
├── molecules/   # Atom の組み合わせ
├── organisms/   # 独立したセクション
└── templates/   # ページレイアウト
```

詳細は [.github/copilot-instructions.md](.github/copilot-instructions.md) を参照してください。

## コーディング規約

このプロジェクトでは **Biome** を使用してコードの品質を保っています。

- 保存時に自動フォーマットされるよう、エディタの設定を推奨
- Biome の設定は [biome.json](biome.json) で管理

## Git Hooks（husky）

このプロジェクトでは **husky** を使用して Git Hooks を管理し、コミット前に自動的にコード品質をチェックしています。

### フックの構成

| フック | タイミング | 実行内容 |
|--------|-----------|---------|
| `pre-commit` | コミット前 | Biome によるフォーマット・リント（ステージファイルのみ） |
| `pre-push` | プッシュ前 | TypeScript 型チェック |

### 仕組み

```
git commit
    ↓
┌─────────────────────────────────────┐
│ pre-commit フック                    │
│ - biome check --staged --write      │
│ - git update-index --again          │
└─────────────────────────────────────┘
    ↓
コミット完了

git push
    ↓
┌─────────────────────────────────────┐
│ pre-push フック                      │
│ - pnpm type-check                   │
└─────────────────────────────────────┘
    ↓
プッシュ完了
```

### メリット

- 🚀 **高速**: `--staged` オプションにより、変更したファイルのみをチェック
- ✨ **自動修正**: `--write` オプションで、フォーマットエラーを自動的に修正
- 🛡️ **品質保証**: CI に到達する前に問題を検出し、フィードバックループを短縮
- 🔄 **CI との連携**: ローカルでの高速チェック + CI での完全なチェックを両立

### セットアップ

新しく clone した場合、依存関係のインストール時に自動的に husky がセットアップされます：

```bash
pnpm install
```

### フックをスキップする場合

緊急時など、フックをスキップしてコミットしたい場合：

```bash
git commit --no-verify -m "緊急修正"
```

> ⚠️ 通常はフックをスキップせず、CI で失敗しないようにすることを推奨します。

## GitHub Actions / CI

このプロジェクトでは、コード品質とセキュリティを保つために GitHub Actions を使用しています。

- ✅ **自動テスト**: リント・型チェック・ビルドを自動実行
- 🎨 **フォーマットチェック**: コードスタイルの一貫性を保証
- 🔒 **セキュリティレビュー**: 依存関係の脆弱性を自動検出
- 🤖 **自動更新**: Dependabot による依存関係の週次更新

各ワークフローには学習用のコメントが記載されています。詳細は [GitHub Actions ドキュメント](.github/workflows/README.md) を参照してください。

## テスト

このプロジェクトでは **Vitest** と **React Testing Library** を使用して、コンポーネントとロジックの単体テストを実装しています。

### テストの方針

- ✅ **ユーザー視点**: 実装の詳細ではなく、ユーザーの視点でテスト
- 📝 **学習重視**: 初学者が理解しやすい、シンプルで明確なテスト
- 🎯 **重要な部分を優先**: 完璧なカバレッジより、ビジネスロジックとエッジケースを重点的にテスト
- 📦 **コロケーション**: テストファイルは対象コンポーネントと同じディレクトリに配置

### テストファイルの配置ルール

テストファイルは **コロケーションパターン** に従い、テスト対象と同じディレクトリに配置します。

**命名規則**: `[name].test.tsx` または `[name].test.ts`

```
src/app/catalog/_components/
├── PageCard.tsx
├── PageCard.test.tsx       # PageCard のテスト
├── Sidebar.tsx
└── index.ts
```

**メリット**:
- テスト対象とテストコードが近くにあり、メンテナンスが容易
- コンポーネントを削除する際、テストも一緒に削除できる
- 関連ファイルが一目でわかる

### テストの書き方

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

/**
 * MyComponent のテスト
 */
describe("MyComponent", () => {
  it("should render without crashing", () => {
    render(<MyComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

**推奨クエリの優先順位**:
1. `getByRole()` - 最優先（アクセシビリティにも貢献）
2. `getByLabelText()` - フォーム要素に適している
3. `getByText()` - テキストコンテンツで検索
4. `getByTestId()` - 最終手段

### CI での自動実行

すべてのテストは GitHub Actions で自動実行されます。プルリクエストやプッシュ時に、リント・型チェックと並行して実行されるため、品質を保ちながら開発を進められます。

詳細なガイドラインは [GitHub Copilot Instructions](.github/copilot-instructions.md) を参照してください。

## Vercel へのデプロイ

このプロジェクトは Vercel にデプロイされています。

**本番環境**: https://next-app-playground-eight.vercel.app/

### デプロイ設定

- `main` ブランチへのプッシュで自動デプロイ
- プレビュー環境は各 Pull Request で自動生成
- ビルドコマンド: `pnpm build`
- 出力ディレクトリ: `.next`

### デプロイ手順（初回）

1. [Vercel](https://vercel.com) にログイン
2. GitHub リポジトリを接続
3. プロジェクト設定を確認して Deploy
4. 自動デプロイが設定完了

詳細は [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## 学習リソース

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなチュートリアル
- [Next.js GitHub](https://github.com/vercel/next.js) - フィードバックや貢献を歓迎
- [Biome Documentation](https://biomejs.dev/) - Biome の使い方
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Tailwind CSS のドキュメント

## 学習目的

このプロジェクトでは以下の内容を学ぶことができます：

- App Router の基本的な使い方
- TypeScript と Next.js の統合
- Biome による効率的なコード管理
- React Compiler の活用
- Tailwind CSS を使ったスタイリング
- Vitest と React Testing Library によるテスト駆動開発
- Vercel へのデプロイメント

## ライセンス

学習用プロジェクトのため、自由に使用・改変してください。
