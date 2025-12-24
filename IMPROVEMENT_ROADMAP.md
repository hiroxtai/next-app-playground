# プロジェクト改善ロードマップ

このドキュメントは、next-app-playground プロジェクトの品質向上とモダン化のための改善計画をまとめたものです。
学習用プロジェクトとして、各改善項目を段階的に導入することで、モダンな開発環境のベストプラクティスを習得できます。

**最終更新日**: 2025年12月23日

---

## 📊 現在の構成状況

### ✅ 既に実装済み
- [x] Next.js 16.1.0 (最新版)
- [x] TypeScript strict mode
- [x] Tailwind CSS v4
- [x] Biome (リント・フォーマット)
- [x] GitHub Actions CI/CD
- [x] Husky (Git hooks)
- [x] GitHub Copilot Instructions
- [x] VS Code 設定（Biome、Tailwind CSS）
- [x] Dependabot 自動マージ
- [x] Git Worktree 管理スクリプト

### 🎯 改善が必要な領域
1. テスト環境
2. 環境変数管理
3. エディタ設定の標準化
4. コミットメッセージ規約
5. パフォーマンス監視
6. バンドル分析
7. コンポーネント開発環境

---

## 🚀 改善項目一覧

各項目には以下の情報が含まれます：
- **優先度**: 高・中・低
- **難易度**: ⭐（簡単）〜 ⭐⭐⭐（複雑）
- **所要時間**: 概算の実装時間
- **依存関係**: 他の項目との関連性

---

## 【優先度: 高】すぐに導入すべき改善

### 1. テスト環境の構築

**優先度**: 🔴 高  
**難易度**: ⭐⭐⭐  
**所要時間**: 2-3時間  
**ステータス**: ❌ 未実装

#### 目的
学習用プロジェクトとして、テストの書き方を学び、コードの品質を担保するため。

#### 導入内容

##### 1-1. Vitest（単体テスト）

**なぜ Vitest か？**
- Jest より高速（Vite ベース）
- Next.js 16 公式ドキュメントで推奨
- TypeScript のサポートが優れている
- 学習曲線が緩やか

**必要なパッケージ**
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**設定ファイル: `vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**セットアップファイル: `vitest.setup.ts`**
```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup()
})
```

**package.json スクリプト追加**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**テスト例: `src/app/page.test.tsx`**
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Home Page', () => {
  it('should render without crashing', () => {
    render(<Page />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

##### 1-2. Playwright（E2E テスト）

**なぜ Playwright か？**
- Next.js 公式推奨の E2E テストツール
- クロスブラウザテスト（Chromium、Firefox、WebKit）
- 自動待機機能が優れている
- ビジュアルリグレッションテスト可能

**インストール**
```bash
pnpm create playwright
```

**設定のポイント**
- `playwright.config.ts` で `baseURL` を `http://localhost:3000` に設定
- `webServer` で Next.js 開発サーバーを自動起動
- `projects` でブラウザ指定（学習用は Chromium のみで開始可）

**E2E テスト例: `tests/navigation.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('should navigate to catalog page', async ({ page }) => {
  await page.goto('/')
  
  // ホームページから /catalog にリダイレクトされることを確認
  await expect(page).toHaveURL('/catalog')
  
  // カタログページの要素が存在することを確認
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
```

**package.json スクリプト追加**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report"
  }
}
```

##### 1-3. GitHub Actions CI への統合

**ワークフロー追加: `.github/workflows/test.yml`**
```yaml
name: Test

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  unit-test:
    name: Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v6
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v6
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: pnpm build
      - run: pnpm test:e2e
```

#### 導入後の効果
- コンポーネントの動作保証
- リファクタリング時の安全性向上
- バグの早期発見
- テスト駆動開発（TDD）の学習

---

### 2. 環境変数管理

**優先度**: 🔴 高  
**難易度**: ⭐  
**所要時間**: 15分  
**ステータス**: ❌ 未実装

#### 目的
新規参画者が必要な環境変数を把握し、セットアップを容易にする。

#### 導入内容

##### 2-1. `.env.example` の作成

**ファイル: `.env.example`**
```bash
# ========================================
# Next.js 環境変数テンプレート
# ========================================
#
# 【使用方法】
# 1. このファイルを .env.local にコピー
#    cp .env.example .env.local
#
# 2. 各変数に適切な値を設定
#
# 3. .env.local は Git にコミットしないこと
#    （.gitignore で除外済み）
#
# ========================================

# ========================================
# アプリケーション設定
# ========================================

# Next.js の公開 URL（本番環境）
# 例: https://next-app-playground-eight.vercel.app
NEXT_PUBLIC_APP_URL=

# API のベース URL
# 開発環境: http://localhost:3000
# 本番環境: https://api.example.com
NEXT_PUBLIC_API_BASE_URL=

# ========================================
# 開発環境設定
# ========================================

# 開発サーバーのポート番号（デフォルト: 3000）
# PORT=3000

# ========================================
# 分析・監視ツール
# ========================================

# Vercel Analytics（オプション）
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# Google Analytics（オプション）
# NEXT_PUBLIC_GA_MEASUREMENT_ID=

# ========================================
# 外部サービス API キー
# ========================================

# 将来的に必要になる可能性のある API キー
# API_KEY=
# API_SECRET=

# ========================================
# データベース（将来的に使用する可能性あり）
# ========================================

# DATABASE_URL=
```

##### 2-2. `.env.local` の作成（各開発者が個別に作成）

開発者がローカルで作成し、Git には含めません。

##### 2-3. テスト用環境変数

**ファイル: `.env.test`**
```bash
# テスト環境用の環境変数
# Vitest、Playwright などのテスト実行時に使用

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

##### 2-4. `.gitignore` の確認

以下がすでに除外されていることを確認：
```gitignore
# env files
.env*
!.env.example
!.env.test
```

##### 2-5. README への記載

**`README.md` に追加**
```markdown
## 環境変数の設定

1. `.env.example` を `.env.local` にコピー
   ```bash
   cp .env.example .env.local
   ```

2. `.env.local` に必要な値を設定

3. 開発サーバーを再起動
```

#### 導入後の効果
- 新規開発者のオンボーディングが容易になる
- 環境変数の一覧が可視化される
- 設定ミスによるエラーが減少

---

### 3. エディタ設定の標準化

**優先度**: 🔴 高  
**難易度**: ⭐  
**所要時間**: 10分  
**ステータス**: ❌ 未実装

#### 目的
複数人開発時に、エディタ間の差異（改行コード、インデントなど）を吸収し、一貫性を保つ。

#### 導入内容

##### 3-1. `.editorconfig` の作成

**ファイル: `.editorconfig`**
```editorconfig
# ========================================
# EditorConfig
# ========================================
#
# 【目的】
# エディタ間で一貫したコーディングスタイルを維持します。
# VS Code、IntelliJ、Vim など、多くのエディタが対応しています。
#
# 【設定内容】
# - 文字コード: UTF-8
# - 改行コード: LF (Unix スタイル)
# - インデント: スペース 2 つ
# - 行末の空白を削除
# - ファイル末尾に改行を挿入
#
# ========================================

# このファイルがプロジェクトのルート設定であることを示す
root = true

# すべてのファイルに適用される設定
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

# Markdown ファイルは行末のスペースを許可
# （Markdown では行末の 2 つのスペースが改行を意味するため）
[*.md]
trim_trailing_whitespace = false

# package.json と pnpm-lock.yaml はインデント 2
[{package.json,pnpm-lock.yaml}]
indent_size = 2

# Makefile はタブインデント
[Makefile]
indent_style = tab
```

##### 3-2. VS Code 拡張機能の追加

**`.vscode/extensions.json` に追加**
```json
{
  "recommendations": [
    "biomejs.biome",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker",
    "editorconfig.editorconfig"  // 追加
  ]
}
```

#### 導入後の効果
- エディタ間の差異を自動的に吸収
- Git の差分が見やすくなる（改行コードの統一）
- チーム開発時のコンフリクトが減少

---

### 4. コミットメッセージ規約

**優先度**: 🔴 高  
**難易度**: ⭐⭐  
**所要時間**: 30分  
**ステータス**: ❌ 未実装

#### 目的
コミットメッセージを構造化し、変更履歴を読みやすくする。将来的な CHANGELOG 自動生成にも対応。

#### 導入内容

##### 4-1. Conventional Commits の採用

**コミットメッセージの形式**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type の種類**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマットなど）
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

**例**
```
feat(catalog): カテゴリフィルタリング機能を追加

ユーザーがカテゴリごとにページをフィルタリングできるように、
Sidebar コンポーネントにフィルタ UI を追加しました。

Closes #123
```

##### 4-2. commitlint の導入

**必要なパッケージ**
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**設定ファイル: `commitlint.config.js`**
```javascript
/**
 * Commitlint 設定
 * 
 * Conventional Commits の規約に従ったコミットメッセージを強制します。
 * 
 * @see https://commitlint.js.org/
 * @see https://www.conventionalcommits.org/
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type は必須
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新機能
        'fix',      // バグ修正
        'docs',     // ドキュメント
        'style',    // フォーマット
        'refactor', // リファクタリング
        'perf',     // パフォーマンス
        'test',     // テスト
        'chore',    // ビルド・ツール
        'revert',   // コミットの取り消し
        'ci',       // CI/CD
      ],
    ],
    // Subject は 100 文字以内
    'subject-max-length': [2, 'always', 100],
    // Subject は小文字で始める（日本語の場合は無視）
    'subject-case': [0],
  },
}
```

##### 4-3. Husky フックの追加

**ファイル: `.husky/commit-msg`**
```sh
#!/bin/sh

# ========================================
# commit-msg フック
# ========================================
#
# 【実行内容】
# コミットメッセージが Conventional Commits の規約に
# 従っているかを検証します。
#
# 【なぜこのチェックが必要か】
# - コミット履歴を構造化し、CHANGELOG の自動生成を可能にする
# - 変更内容を一目で理解できるようにする
# - チーム全体で一貫したコミットメッセージを維持する
#
# ========================================

npx --no-install commitlint --edit "$1"
```

**実行権限の付与**
```bash
chmod +x .husky/commit-msg
```

##### 4-4. README への記載

**`README.md` に追加**
```markdown
## コミットメッセージ規約

このプロジェクトは [Conventional Commits](https://www.conventionalcommits.org/) を採用しています。

### 形式
\`\`\`
<type>(<scope>): <subject>
\`\`\`

### 例
\`\`\`bash
git commit -m "feat(catalog): カテゴリフィルタリング機能を追加"
git commit -m "fix(ui): ボタンのクリック領域を修正"
git commit -m "docs(readme): セットアップ手順を更新"
\`\`\`

### Type 一覧
- \`feat\`: 新機能
- \`fix\`: バグ修正
- \`docs\`: ドキュメント
- \`style\`: フォーマット
- \`refactor\`: リファクタリング
- \`test\`: テスト
- \`chore\`: ビルド・ツール
```

#### 導入後の効果
- コミット履歴が読みやすくなる
- CHANGELOG の自動生成が可能になる
- レビュー時に変更内容を素早く把握できる

---

## 【優先度: 中】品質向上のための改善

### 5. バンドル分析ツール

**優先度**: 🟡 中  
**難易度**: ⭐  
**所要時間**: 15分  
**ステータス**: ❌ 未実装

#### 目的
ビルドサイズを可視化し、最適化の余地を見つける。

#### 導入内容

##### 5-1. @next/bundle-analyzer の導入

**必要なパッケージ**
```bash
pnpm add -D @next/bundle-analyzer
```

**設定ファイル: `next.config.ts`**
```typescript
import type { NextConfig } from 'next'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default withBundleAnalyzer(nextConfig)
```

**package.json スクリプト追加**
```json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

**使用方法**
```bash
pnpm analyze
```

実行後、ブラウザで自動的にバンドルサイズのビジュアライゼーションが開きます。

#### 導入後の効果
- 不要な依存関係の発見
- コード分割の最適化
- ビルドサイズの削減

---

### 6. パフォーマンス監視

**優先度**: 🟡 中  
**難易度**: ⭐  
**所要時間**: 20分  
**ステータス**: ❌ 未実装

#### 目的
実際のユーザー体験を監視し、パフォーマンスの問題を早期発見する。

#### 導入内容

##### 6-1. Vercel Speed Insights

**必要なパッケージ**
```bash
pnpm add @vercel/speed-insights
```

**設定: `src/app/layout.tsx`**
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

##### 6-2. Vercel Analytics

**必要なパッケージ**
```bash
pnpm add @vercel/analytics
```

**設定: `src/app/layout.tsx`**
```typescript
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
```

#### 導入後の効果
- Core Web Vitals の監視
- ユーザー体験の可視化
- パフォーマンス問題の早期発見

---

### 7. Storybook（コンポーネントカタログ）

**優先度**: 🟡 中  
**難易度**: ⭐⭐⭐  
**所要時間**: 2-3時間  
**ステータス**: ❌ 未実装

#### 目的
UI コンポーネントの開発・テスト・ドキュメント化を効率化する。

#### 導入内容

##### 7-1. Storybook のインストール

**インストール**
```bash
npx storybook@latest init
```

自動的に以下が設定されます：
- `.storybook/` ディレクトリ
- サンプルストーリー
- 必要な依存関係

##### 7-2. Tailwind CSS の設定

**ファイル: `.storybook/preview.ts`**
```typescript
import type { Preview } from '@storybook/react'
import '../src/app/globals.css' // Tailwind CSS をインポート

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

##### 7-3. ストーリー例

**ファイル: `src/components/atoms/Button.stories.tsx`**
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}
```

**package.json スクリプト追加**
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

#### 導入後の効果
- コンポーネントの可視化
- デザインシステムの構築
- コンポーネントの動作確認が容易
- ドキュメント自動生成

---

### 8. SEO 強化

**優先度**: 🟡 中  
**難易度**: ⭐⭐  
**所要時間**: 1時間  
**ステータス**: ❌ 未実装

#### 目的
検索エンジン最適化を強化し、アプリの発見性を向上させる。

#### 導入内容

##### 8-1. Next.js Metadata API の活用

**ファイル: `src/app/layout.tsx`**
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Next.js Playground',
    template: '%s | Next.js Playground',
  },
  description: 'Next.js 16 の機能を学習するための Playground プロジェクト',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://next-app-playground-eight.vercel.app',
    siteName: 'Next.js Playground',
    title: 'Next.js Playground',
    description: 'Next.js 16 の機能を学習するための Playground プロジェクト',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Playground',
    description: 'Next.js 16 の機能を学習するための Playground プロジェクト',
  },
}
```

**各ページでの Metadata 設定例: `src/app/catalog/page.tsx`**
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'カタログ',
  description: 'Next.js の実装例をカテゴリ別に閲覧できます',
}
```

##### 8-2. sitemap.xml の生成

**ファイル: `src/app/sitemap.ts`**
```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://next-app-playground-eight.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://next-app-playground-eight.vercel.app/catalog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
```

##### 8-3. robots.txt の生成

**ファイル: `src/app/robots.ts`**
```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://next-app-playground-eight.vercel.app/sitemap.xml',
  }
}
```

#### 導入後の効果
- 検索エンジンでの発見性向上
- ソーシャルメディアでのシェア時の見栄え改善
- SEO スコアの向上

---

## 【優先度: 低】将来的な検討項目

### 9. 国際化 (i18n)

**優先度**: 🟢 低  
**難易度**: ⭐⭐⭐  
**所要時間**: 3-4時間  
**ステータス**: ❌ 未実装  
**依存関係**: なし

#### 概要
将来的に多言語対応が必要になった場合に導入を検討します。

**推奨ライブラリ**: `next-intl`

**理由**:
- Next.js App Router に完全対応
- TypeScript サポートが優れている
- サーバーコンポーネントで動作

**参考**: 必要になったタイミングで詳細な導入手順を作成

---

### 10. 認証システム

**優先度**: 🟢 低  
**難易度**: ⭐⭐⭐  
**所要時間**: 4-5時間  
**ステータス**: ❌ 未実装  
**依存関係**: データベース（項目11）

#### 概要
ユーザー認証が必要になった場合に導入を検討します。

**推奨ライブラリ**: `NextAuth.js` (Auth.js)

**理由**:
- Next.js 公式推奨
- 多様なプロバイダー対応（Google、GitHub など）
- セキュリティベストプラクティスを実装済み

**参考**: 必要になったタイミングで詳細な導入手順を作成

---

### 11. データベース ORM

**優先度**: 🟢 低  
**難易度**: ⭐⭐⭐  
**所要時間**: 4-5時間  
**ステータス**: ❌ 未実装  
**依存関係**: なし

#### 概要
データベース連携が必要になった場合に導入を検討します。

**推奨ライブラリ**: `Drizzle ORM` または `Prisma`

**Drizzle ORM の特徴**:
- TypeScript ファーストで型安全
- 軽量で高速
- SQL ライクな API

**Prisma の特徴**:
- 強力な型生成
- マイグレーション管理が簡単
- GUI ツール（Prisma Studio）

**参考**: 必要になったタイミングで詳細な導入手順を作成

---

## 📋 推奨実装順序

以下の順序で段階的に導入することを推奨します：

### フェーズ 1: 基盤整備（1日）
1. ✅ 環境変数管理（15分） → **最初に実施**
2. ✅ エディタ設定（10分）
3. ✅ コミットメッセージ規約（30分）

### フェーズ 2: テスト環境（2-3日）
4. ✅ Vitest 導入（1-2時間）
5. ✅ 既存コンポーネントの単体テスト作成（2-3時間）
6. ✅ Playwright 導入（1時間）
7. ✅ E2E テスト作成（2-3時間）
8. ✅ GitHub Actions への統合（30分）

### フェーズ 3: 監視・分析（半日）
9. ✅ バンドル分析ツール（15分）
10. ✅ パフォーマンス監視（20分）

### フェーズ 4: 開発体験向上（1-2日）
11. ✅ SEO 強化（1時間）
12. ✅ Storybook 導入（2-3時間） → **必要に応じて**

### フェーズ 5: 機能拡張（必要に応じて）
13. ⏸️ 国際化
14. ⏸️ 認証システム
15. ⏸️ データベース ORM

---

## 🎯 各フェーズの完了条件

### フェーズ 1 完了条件
- [ ] `.env.example` が作成され、README に手順が記載されている
- [ ] `.editorconfig` が作成され、VS Code 拡張機能が推奨されている
- [ ] `commitlint` が動作し、不正なコミットメッセージが拒否される

### フェーズ 2 完了条件
- [ ] `pnpm test` でユニットテストが実行できる
- [ ] 主要コンポーネント（Page、PageCard、Sidebar）にテストがある
- [ ] `pnpm test:e2e` で E2E テストが実行できる
- [ ] ナビゲーションテストが動作する
- [ ] GitHub Actions で全テストが自動実行される

### フェーズ 3 完了条件
- [ ] `pnpm analyze` でバンドル分析ができる
- [ ] Vercel Speed Insights が動作している
- [ ] Vercel Analytics が動作している

### フェーズ 4 完了条件
- [ ] Metadata API が各ページに設定されている
- [ ] sitemap.xml と robots.txt が生成される
- [ ] Storybook が起動し、コンポーネントが表示される（導入する場合）

---

## 📚 参考リソース

### 公式ドキュメント
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [EditorConfig](https://editorconfig.org/)

### 学習リソース
- [Testing Library](https://testing-library.com/)
- [Storybook for Next.js](https://storybook.js.org/docs/get-started/nextjs)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)

---

## ✅ 進捗管理

このドキュメントを更新しながら、各項目のステータスを管理してください：

- ❌ 未実装
- 🚧 実装中
- ✅ 完了
- ⏸️ 保留

**最終更新**: 2025年12月23日

---

## 💡 次のステップ

1. **フェーズ 1 から開始**: 環境変数管理とエディタ設定を導入
2. **フェーズ 2 へ進む**: テスト環境を構築し、コード品質を担保
3. **各フェーズ完了後**: このドキュメントを更新し、進捗を記録
4. **必要に応じて調整**: プロジェクトの状況に応じて優先順位を変更

導入する項目が決まったら、このドキュメントの該当セクションを参照して実装を進めてください。
