## 調査結果のサマリ

### 現状

| 項目 | 状態 |
|------|------|
| `playwright` (ライブラリ) | `^1.59.1` インストール済み（Storybook ブラウザテスト用） |
| `@vitest/browser-playwright` | `^4.0.16` インストール済み |
| `@playwright/test` (テストランナー) | **未導入** ← これが必要 |
| 最新バージョン | **1.59.1**（2026年4月時点、プロジェクトと同一） |

### `playwright` と `@playwright/test` の違い

- **`playwright`**: ブラウザ自動化の API ライブラリのみ
- **`@playwright/test`**: テストランナー + アサーション + フィクスチャ + レポーター を含むフルテストフレームワーク。E2E テストにはこちらが必要

---

## ドキュメント全文

以下を docs/PLAYWRIGHT_SETUP_GUIDE.md として保存してください:

---

# Playwright E2E テスト導入ガイド

このドキュメントでは、next-app-playground プロジェクトに Playwright の E2E（End-to-End）テストを導入するための手順を解説します。

## 目次

- 現状の確認
- Playwright とは
- 導入手順
  - Step 1: パッケージのインストール
  - Step 2: ブラウザのインストール
  - Step 3: 設定ファイルの作成
  - Step 4: ディレクトリ構成の作成
  - Step 5: npm スクリプトの追加
  - Step 6: .gitignore の更新
  - Step 7: TypeScript 設定の確認
- playwright.config.ts の詳細解説
- サンプルテストの作成
- テストの実行方法
- CI/CD での実行
- 既存テストとの共存
- ベストプラクティス
- 参考リンク

---

## 現状の確認

本プロジェクトには、Storybook のブラウザテスト用に以下のパッケージがすでにインストールされています:

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| `playwright` | ^1.59.1 | Storybook テスト用（`@vitest/browser-playwright` 経由） |
| `@vitest/browser-playwright` | ^4.0.16 | Vitest の Storybook プロジェクトでブラウザ環境を提供 |

**E2E テスト用の `@playwright/test`（テストランナー）は未導入** です。

### Playwright ライブラリと @playwright/test の違い

| パッケージ | 役割 |
|-----------|------|
| `playwright` | ブラウザ自動化ライブラリ（API のみ） |
| `@playwright/test` | テストランナー + アサーション + フィクスチャ + レポーター を含むフルテストフレームワーク |

E2E テストを行うには `@playwright/test` が必要です。

---

## Playwright とは

[Playwright](https://playwright.dev/) は Microsoft が開発したブラウザ自動化・E2E テストフレームワークです。

### 主な特徴

- **クロスブラウザ対応**: Chromium、Firefox、WebKit を単一 API でテスト
- **自動待機（Auto-waiting）**: 要素がクリック可能になるまで自動的に待機
- **テスト分離**: 各テストが独立したブラウザコンテキストで実行
- **トレース**: テスト実行のタイムラインを記録し、デバッグに活用
- **Web-first アサーション**: DOM 要素の状態を自動再試行するアサーション

---

## 導入手順

### Step 1: パッケージのインストール

`@playwright/test` を devDependencies に追加します。

```bash
pnpm add -D @playwright/test
```

> **注意**: `playwright` ライブラリはすでにインストール済みです。`@playwright/test` は `playwright` に依存しているため、バージョンの整合性は自動的に保たれます。最新バージョンは **1.59.1** です（2026年4月時点）。

### Step 2: ブラウザのインストール

Playwright が使用するブラウザバイナリをインストールします。

```bash
# 全ブラウザ（Chromium, Firefox, WebKit）をインストール
pnpm exec playwright install

# 特定のブラウザのみインストールする場合
pnpm exec playwright install chromium

# ブラウザとシステム依存パッケージ（CI 向け）をインストール
pnpm exec playwright install --with-deps
```

> **推奨**: ローカル開発では `chromium` のみのインストールで十分です。CI 環境では `--with-deps` オプションでシステム依存パッケージも合わせてインストールしてください。

### Step 3: 設定ファイルの作成

プロジェクトルートに `playwright.config.ts` を作成します。

```typescript
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E テスト設定
 *
 * @remarks
 * Next.js 開発サーバーを自動起動し、E2E テストを実行します。
 * CI 環境では全ブラウザ、ローカルでは Chromium のみで実行します。
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /** テストファイルのディレクトリ */
  testDir: "./e2e",

  /** テストファイルのパターン（*.spec.ts にマッチ） */
  testMatch: "**/*.spec.ts",

  /** 各テストのタイムアウト（30秒） */
  timeout: 30_000,

  /** テスト全体の最大実行時間（CI: 10分、ローカル: 無制限） */
  globalTimeout: process.env.CI ? 600_000 : undefined,

  /**
   * テストの完全並列実行
   *
   * @remarks
   * true にすると、同一ファイル内のテストも並列実行されます。
   * テスト間に依存関係がないことが前提です。
   */
  fullyParallel: true,

  /**
   * test.only の禁止（CI のみ）
   *
   * @remarks
   * CI 環境で test.only が残っていた場合にビルドを失敗させます。
   */
  forbidOnly: !!process.env.CI,

  /**
   * リトライ回数
   *
   * @remarks
   * CI 環境ではフレーキーテスト対策として 2 回リトライします。
   * ローカルでは即座に失敗を確認するためリトライしません。
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * ワーカー数
   *
   * @remarks
   * CI 環境ではリソース制約のため 1 ワーカーに制限します。
   * ローカルでは CPU コア数に応じて自動で並列化されます。
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * レポーター設定
   *
   * @remarks
   * CI では見やすいリスト形式、ローカルでは HTML レポートを生成します。
   */
  reporter: process.env.CI ? "list" : "html",

  /** 全プロジェクト共通の設定 */
  use: {
    /** ベース URL（page.goto('/') で http://localhost:3000/ にアクセス） */
    baseURL: "http://localhost:3000",

    /** 初回リトライ時のみトレースを記録（デバッグ用） */
    trace: "on-first-retry",

    /** 失敗時のみスクリーンショットを取得 */
    screenshot: "only-on-failure",

    /** 失敗したテストのみ動画を保持 */
    video: "retain-on-failure",
  },

  /**
   * ブラウザプロジェクト
   *
   * @remarks
   * テスト対象のブラウザを定義します。
   * ローカル開発では --project=chromium で Chromium のみ実行を推奨します。
   */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /**
   * 開発サーバー自動起動設定
   *
   * @remarks
   * テスト実行前に Next.js 開発サーバーを自動起動します。
   * すでにサーバーが起動している場合は再利用します（CI 以外）。
   */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Step 4: ディレクトリ構成の作成

E2E テスト用のディレクトリを作成します。

```
e2e/
├── home.spec.ts           # ホームページのテスト
├── catalog.spec.ts        # カタログページのテスト
├── navigation.spec.ts     # ナビゲーション・ルーティングのテスト
├── fixtures/              # カスタムフィクスチャ
│   └── base.fixture.ts
└── pages/                 # Page Object Model（任意）
    ├── home.page.ts
    └── catalog.page.ts
```

> **配置場所について**: Playwright の E2E テストは src 内ではなくプロジェクトルートの `e2e/` ディレクトリに配置します。これは Vitest の単体テスト（`src/**/*.test.ts`）と明確に分離するためです。

### Step 5: npm スクリプトの追加

package.json の `scripts` に以下を追加します。

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:report": "playwright show-report"
  }
}
```

| スクリプト | 説明 |
|-----------|------|
| `test:e2e` | ヘッドレスモードで全ブラウザのテストを実行 |
| `test:e2e:ui` | Playwright UI モードで実行（インタラクティブにテストを選択・デバッグ） |
| `test:e2e:headed` | ブラウザを表示した状態で実行（動作確認用） |
| `test:e2e:debug` | デバッグモードで実行（ステップ実行可能） |
| `test:e2e:chromium` | Chromium のみで実行（高速なローカル開発用） |
| `test:e2e:report` | 前回のテスト結果の HTML レポートを表示 |

### Step 6: .gitignore の更新

以下のエントリを .gitignore に追加します。

```gitignore
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/e2e/.auth/
```

| パス | 説明 |
|-----|------|
| `/test-results/` | テスト実行時のスクリーンショット・動画・トレースファイル |
| `/playwright-report/` | HTML レポートの出力先 |
| `/blob-report/` | CI での分散レポート用（シャーディング時） |
| `/playwright/.cache/` | Playwright のブラウザキャッシュ |
| `/e2e/.auth/` | 認証状態の保存ファイル（将来の認証テスト用） |

### Step 7: TypeScript 設定の確認

現在の tsconfig.json はすでに `**/*.ts` を `include` しているため、`e2e/` ディレクトリ内の `.spec.ts` ファイルも型チェックの対象になります。追加の設定は不要です。

```typescript
// e2e/ ディレクトリ内のファイルでは以下のインポートが利用可能
import { test, expect, type Page } from "@playwright/test";
```

---

## playwright.config.ts の詳細解説

### webServer オプション

```typescript
webServer: {
  command: "pnpm dev",
  url: "http://localhost:3000",
  timeout: 120_000,
  reuseExistingServer: !process.env.CI,
},
```

`webServer` は Playwright の強力な機能で、テスト実行前に自動的に開発サーバーを起動します。

- **ローカル開発時**: `pnpm dev` でサーバーがすでに起動していれば再利用（`reuseExistingServer: true`）
- **CI 環境**: 毎回クリーンなサーバーを起動（`reuseExistingServer: false`）

> **Tips**: プロダクションビルドでテストしたい場合は、`command` を `"pnpm build && pnpm start"` に変更します。

### プロジェクト設定

`devices` オブジェクトにはビューポートサイズやユーザーエージェントなどの現実的なデバイス設定が含まれています。**モバイル対応テストを追加する場合:**

```typescript
projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  { name: "mobile-safari", use: { ...devices["iPhone 12"] } },
],
```

### トレースとデバッグ

テスト失敗時に詳細なデバッグ情報が自動収集されます。トレースファイルは以下で確認できます:

```bash
pnpm exec playwright show-trace test-results/path-to-trace.zip
```

---

## サンプルテストの作成

### 基本的なテスト（ホームページ）

```typescript
// e2e/home.spec.ts
import { expect, test } from "@playwright/test";

test.describe("ホームページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ページタイトルが正しく表示される", async ({ page }) => {
    await expect(page).toHaveTitle(/Next.js/);
  });

  test("ヒーローセクションが表示される", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Next.js を.*学ぼう/ })
    ).toBeVisible();
  });

  test("カタログページへ遷移できる", async ({ page }) => {
    await page.getByRole("link", { name: /カタログ/ }).click();
    await expect(page).toHaveURL(/\/catalog/);
  });
});
```

### カタログページのテスト

```typescript
// e2e/catalog.spec.ts
import { expect, test } from "@playwright/test";

test.describe("カタログページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/catalog");
  });

  test("ページカタログのタイトルが表示される", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /ページカタログ/ })
    ).toBeVisible();
  });

  test("サンプルページのカードが表示される", async ({ page }) => {
    const cards = page.locator("[data-testid='page-card']");
    await expect(cards.first()).toBeVisible();
  });

  test("パンくずリストが表示される", async ({ page }) => {
    await expect(
      page.getByRole("navigation", { name: /breadcrumb/i })
    ).toBeVisible();
  });
});
```

### Page Object Model を使ったテスト

```typescript
// e2e/pages/home.page.ts
import type { Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  get heroHeading() {
    return this.page.getByRole("heading", { name: /Next.js を.*学ぼう/ });
  }

  get catalogLink() {
    return this.page.getByRole("link", { name: /カタログ/ });
  }

  async navigateToCatalog() {
    await this.catalogLink.click();
  }
}
```

```typescript
// e2e/navigation.spec.ts
import { expect, test } from "@playwright/test";
import { HomePage } from "./pages/home.page";

test("ホームからカタログへ遷移できる", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await expect(homePage.heroHeading).toBeVisible();
  await homePage.navigateToCatalog();
  await expect(page).toHaveURL(/\/catalog/);
});
```

---

## テストの実行方法

```bash
# 全テスト実行（ヘッドレス）
pnpm test:e2e

# Chromium のみ（高速なローカル開発用）
pnpm test:e2e:chromium

# UI モード（インタラクティブ）
pnpm test:e2e:ui

# ブラウザ表示付き
pnpm test:e2e:headed

# デバッグモード
pnpm test:e2e:debug

# 特定ファイルのみ
pnpm exec playwright test e2e/home.spec.ts

# テスト名で絞り込み
pnpm exec playwright test -g "ページタイトル"

# HTML レポート表示
pnpm test:e2e:report
```

---

## CI/CD での実行

### GitHub Actions ワークフロー例

```yaml
# .github/workflows/playwright.yml
name: Playwright E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e-test:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run Playwright tests
        run: pnpm test:e2e
        env:
          CI: true

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 既存テストとの共存

本プロジェクトのテスト構成は以下の 3 層になります:

```
テスト戦略
├── Unit Tests (Vitest + jsdom)
│   ├── 対象: src/**/*.test.ts(x)
│   ├── 実行: pnpm test:unit
│   └── 目的: コンポーネントやユーティリティの単体テスト
│
├── Storybook Tests (Vitest + Playwright Browser)
│   ├── 対象: src/**/*.stories.tsx
│   ├── 実行: pnpm test:storybook
│   └── 目的: UI コンポーネントのビジュアル・インタラクションテスト
│
└── E2E Tests (Playwright Test Runner)  ← 新規追加
    ├── 対象: e2e/**/*.spec.ts
    ├── 実行: pnpm test:e2e
    └── 目的: ユーザーフロー全体の統合テスト
```

### ファイル命名規則

| テスト種別 | 拡張子 | 配置場所 |
|-----------|--------|---------|
| 単体テスト | `*.test.ts(x)` | src 内（テスト対象の隣） |
| Storybook | `*.stories.tsx` | src 内（コンポーネントの隣） |
| E2E テスト | `*.spec.ts` | `e2e/` ディレクトリ |

Vitest と Playwright Test Runner は完全に独立しており、設定ファイル・テストディレクトリ・実行コマンドすべてが分離されています。Storybook テストと E2E テストは同じ Playwright ブラウザバイナリを共有するため、ディスク容量の追加消費はありません。

---

## ベストプラクティス

### セレクタの優先順位

| 優先度 | セレクタ | 例 |
|-------|---------|-----|
| 1 (最優先) | Role ベース | `getByRole("button", { name: "送信" })` |
| 2 | Label ベース | `getByLabel("メールアドレス")` |
| 3 | Placeholder | `getByPlaceholder("検索...")` |
| 4 | Text ベース | `getByText("ようこそ")` |
| 5 | Test ID | `getByTestId("submit-btn")` |
| 6 (非推奨) | CSS セレクタ | `locator(".btn-primary")` |

### やってはいけないこと

```typescript
// ❌ 任意の待機時間
await page.waitForTimeout(3000);

// ❌ CSS クラスに依存
await page.locator(".btn-primary").click();

// ❌ テスト間の依存関係
// ❌ 実装の詳細をテスト
```

```typescript
// ✅ Auto-waiting を活用
await expect(page.getByText("送信完了")).toBeVisible();

// ✅ アクセシビリティセレクタ
await page.getByRole("button", { name: "送信" }).click();

// ✅ 独立したテスト
// ✅ ユーザー視点でテスト
```

---

## 参考リンク

| リソース | URL |
|---------|-----|
| Playwright 公式ドキュメント | https://playwright.dev/docs/intro |
| Playwright 設定リファレンス | https://playwright.dev/docs/test-configuration |
| Best Practices | https://playwright.dev/docs/best-practices |
| VS Code 拡張機能 | https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright |
| Next.js + Playwright | https://nextjs.org/docs/app/building-your-application/testing/playwright |

---

**情報源**: 上記内容は [Playwright 公式ドキュメント v1.59.1](https://playwright.dev/) および Context7 で取得した最新ドキュメントに基づいています。