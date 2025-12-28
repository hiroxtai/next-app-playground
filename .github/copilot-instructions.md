# GitHub Copilot Instructions for next-app-playground

あなたは、Next.js 16、TypeScript、Tailwind CSS、Biome を使用した学習用プロジェクト「next-app-playground」の開発を支援するエキスパート AI アシスタントです。
このプロジェクトは学習を目的としているため、可読性が高く、理解しやすいコードの提案を最優先してください。

以下のガイドラインに従ってコードを生成および提案してください。

## 1. 技術スタックと環境
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` 形式)
- **Linter/Formatter**: Biome 2.x
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm
- **React Compiler**: 有効 (`next.config.ts` で `reactCompiler: true`)
- **Import alias**: `@/*` → `./src/*`
- **Git Hooks**: husky（pre-commit で Biome チェック、pre-push で型チェック）

## 2. コード品質と可読性
- **学習用コード**: 初学者が読んでも理解しやすい、明確でシンプルな実装を心がけてください。過度な抽象化は避け、直感的な命名を行ってください。
- **型安全性**: TypeScript の型システムを最大限に活用し、`any` の使用は避けてください。

## 3. ドキュメンテーションとコメント (JSDoc/TSDoc)
IDE の補完機能を最大限に活かし、開発体験を向上させるために、以下のルールでコメントを記述してください。

- **JSDoc/TSDoc の徹底**: エクスポートされる関数、クラス、型定義には必ず JSDoc/TSDoc を付与してください。
- **コメントの内容**:
  - ❌ **How (どう動くか)**: コードを読めば分かる動作の説明は不要です（例: `i` を 1 増やす）。
  - ✅ **Why (なぜそうするか)**: その実装に至った背景、設計上の意図、ビジネスロジックの理由。
  - ✅ **What (何であるか)**: 変数や関数の役割、引数や戻り値の意味。
  - ✅ **Constraints (制約)**: 注意すべき仕様、エッジケース、複雑なロジックの補足。

**記述例:**
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

## 4. プロジェクト構成とアーキテクチャ

### ディレクトリ構造 (Colocation Pattern)
Next.js App Router の機能を活かし、関連するファイル（コンポーネント、テスト、スタイル、ロジック）を機能単位で同じディレクトリに配置する「コロケーションパターン」を推奨します。

**例:**
```
src/app/dashboard/
├── page.tsx
├── layout.tsx
├── _components/     # この機能専用のコンポーネント
├── _hooks/          # この機能専用のフック
└── _lib/            # この機能専用のロジック
```

### コンポーネント設計 (Atomic Design)
再利用可能な共通コンポーネントは `src/components` 配下に配置し、Atomic Design の考え方に基づいて構成してください。

- **atoms**: ボタン、入力フォーム、アイコンなどの最小単位。
- **molecules**: atom を組み合わせた検索フォーム、カードなどの小規模な UI。
- **organisms**: ヘッダー、フッター、商品一覧などの独立して機能するセクション。
- **templates**: ページのレイアウト構造を定義するコンポーネント。

**構成例:**
```
src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

### テストファイルの配置 (Colocation Pattern)
テストファイルは、テスト対象のコンポーネント・関数と同じディレクトリに配置してください。

**命名規則:**
- `[name].test.tsx` または `[name].test.ts`
- 例: `PageCard.tsx` → `PageCard.test.tsx`

**配置例:**
```
src/app/catalog/_components/
├── PageCard.tsx
├── PageCard.test.tsx       # PageCard のテスト
├── Sidebar.tsx
├── Sidebar.test.tsx        # Sidebar のテスト
└── index.ts
```

**なぜコロケーション？**
- テスト対象とテストコードが近くにあり、メンテナンスが容易
- コンポーネントを削除する際、テストも一緒に削除できる
- 関連ファイルが一目でわかる

## 5. テストの書き方 (Vitest + React Testing Library)

このプロジェクトでは **Vitest** を使用して単体テストを記述します。以下のガイドラインに従ってください。

### 基本方針

- **学習重視**: 初学者が理解しやすい、シンプルで明確なテストを記述
- **ユーザー視点**: Testing Library の原則に従い、実装の詳細ではなくユーザーの視点でテスト
- **包括的**: 正常系・異常系・エッジケースを適切にカバー
- **保守性**: テストコードも本番コードと同様に、可読性と保守性を重視

### テストの構造

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

/**
 * MyComponent のテスト
 * 
 * @remarks
 * このコンポーネントは... という役割を持つため、
 * ...という観点でテストを記述しています。
 */
describe("MyComponent", () => {
  /**
   * 基本的なレンダリングテスト
   * コンポーネントが正しく表示されることを確認
   */
  it("should render without crashing", () => {
    render(<MyComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  /**
   * props による表示切り替えのテスト
   * variant に応じて適切なスタイルが適用されることを確認
   */
  it.each([
    ["primary", "bg-blue-500"],
    ["secondary", "bg-gray-500"],
  ])("should render %s variant with correct styles", (variant, expectedClass) => {
    // テスト実装
  });
});
```

### Vitest 特有のルール

**✅ 推奨:**
- `import { describe, it, expect, vi } from "vitest"` を使用
- モックには `vi.mock()` を使用（Jest の `jest.mock()` ではない）
- `it.each()` を使用してテーブル駆動テストを記述
- `describe` ブロックでテストをグループ化

**❌ 避ける:**
- Jest のマッチャーや API を使用しない
- `test` の代わりに `it` を使用（一貫性のため）

### React Testing Library のルール

**クエリの優先順位:**
1. `getByRole()`: 最優先（アクセシビリティにも貢献）
2. `getByLabelText()`: フォーム要素に適している
3. `getByPlaceholderText()`: プレースホルダーが明確な場合
4. `getByText()`: テキストコンテンツで検索
5. `getByTestId()`: 最終手段（他の方法がない場合のみ）

**例:**
```typescript
// ✅ 推奨: role を使用
const button = screen.getByRole("button", { name: "送信" });

// ❌ 避ける: test-id に頼る
const button = screen.getByTestId("submit-button");
```

### モックとスタブ

**コンポーネントのモック:**
```typescript
// 子コンポーネントをモック
vi.mock("./ChildComponent", () => ({
  default: () => <div>Mocked Child</div>,
}));
```

**Next.js の機能をモック:**
```typescript
// next/navigation をモック
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: "/",
  }),
}));
```

### テストのスコープ

**単体テスト（Vitest）で確認すること:**
- ✅ コンポーネントのレンダリング
- ✅ props による表示の変化
- ✅ ユーザーインタラクション（クリック、入力など）
- ✅ 条件分岐やエッジケース
- ✅ クライアントサイドのロジック

**単体テストで確認しないこと:**
- ❌ Next.js の `redirect()` や `notFound()` などのサーバー機能（E2E テストで確認）
- ❌ Async Server Components（Vitest では非対応）
- ❌ 実際のネットワークリクエスト（モックを使用）

### JSDoc/TSDoc の記述

テストコードにも JSDoc を記述し、テストの意図を明確にしてください：

```typescript
/**
 * エラー状態のテスト
 * 
 * @remarks
 * API エラー時には、エラーメッセージが表示され、
 * リトライボタンがクリック可能になることを確認します。
 */
it("should display error message and retry button on API failure", () => {
  // テスト実装
});
```

### テストカバレッジ

完璧なカバレッジを目指すのではなく、**重要な機能とエッジケース**を優先的にテストしてください。

**優先順位:**
1. 🔴 高: ビジネスロジック、条件分岐、エラーハンドリング
2. 🟡 中: UI の表示切り替え、フォームバリデーション
3. 🟢 低: 静的なコンテンツの表示

## 6. GitHub Actions / CI/CD

このプロジェクトは学習用であるため、CI/CD の設定も理解しやすさを最優先してください。

### ローカルでの品質チェック（husky）

このプロジェクトでは husky を使用して、コミット・プッシュ前に自動的にコード品質をチェックしています。

| フック | タイミング | 実行内容 |
|--------|-----------|---------|
| `pre-commit` | コミット前 | `biome check --staged --write`（ステージファイルのみ） |
| `pre-push` | プッシュ前 | `pnpm type-check`（全ファイルの型チェック） |

**設計方針**:
- **lint-staged は不使用**: Biome の `--staged` オプションを直接使用することで、依存関係をシンプルに保つ
- **自動修正**: `--write` オプションでフォーマットエラーを自動修正し、開発者の負担を軽減
- **CI 環境でのスキップ**: `.husky/install.mjs` で `CI=true` 時に husky セットアップをスキップ

### ワークフローファイルのガイドライン

- **コメントの徹底**: すべてのワークフローファイルに学習者向けの日本語コメントを付与してください。
- **ベストプラクティスの適用**:
  - `permissions`: 最小権限の原則に基づき、必要最小限の権限のみを付与
  - `concurrency`: 重複実行を防ぎ、CI リソースを効率的に利用
  - `timeout-minutes`: ハングアップ対策として適切なタイムアウトを設定
  - キャッシュ戦略: ビルド時間短縮のため、適切なキャッシュキーを使用
  - `needs`: ジョブ間の依存関係を明示し、無駄な実行を防ぐ

### コメント規約

ワークフローファイルにおけるコメントは、以下の方針で記述してください：

```yaml
# ❌ 悪い例: 動作の説明のみ
# Node.js をセットアップします
- uses: actions/setup-node@v4

# ✅ 良い例: なぜその設定にしたかを説明
# Node.js のセットアップ
# setup-node には自動キャッシュ機能があるため、別途キャッシュ設定は不要
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm'  # pnpm の依存関係を自動キャッシュ
```

### セキュリティ

- サードパーティアクションのバージョン指定は、学習用プロジェクトでは可読性を優先してタグ（`@v4`）を使用
- 本番環境向けには SHA 固定を推奨することをドキュメントに明記

### ドキュメンテーション

- ワークフローの概要と各ステップの目的を `.github/workflows/README.md` に記載
- トラブルシューティングガイドを含める

### CI でのテスト実行

GitHub Actions では、以下のように Vitest が自動実行されます：

```yaml
- name: Run Vitest tests
  run: pnpm test -- --run --reporter=verbose
```

- `--run`: watch mode を無効化（CI 環境では必須）
- `--reporter=verbose`: 詳細な出力で失敗時のデバッグを容易に

## 7. Storybook（コンポーネントカタログ）

このプロジェクトでは **Storybook 10** を使用してコンポーネントの開発・ドキュメント化を行います。

### 基本方針

- **学習重視**: 初学者が Story の書き方を理解しやすいよう、JSDoc コメントを充実させる
- **コロケーション**: Story ファイルはコンポーネントと同じディレクトリに配置
- **autodocs**: すべての Story に `tags: ['autodocs']` を指定し、自動ドキュメント生成を有効化
- **アクセシビリティ**: addon-a11y による自動チェックを活用

### Story ファイルの配置

コンポーネントと同じディレクトリに `*.stories.tsx` ファイルを配置します：

```
src/components/atoms/Button/
├── Button.tsx          # コンポーネント
├── Button.stories.tsx  # Story ファイル
├── Button.test.tsx     # テストファイル（任意）
└── index.ts            # バレルエクスポート
```

### Story の書き方（CSF 3 形式）

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

/**
 * メタデータ定義
 */
const meta = {
  title: "Atoms/Button",      // サイドバーの階層構造
  component: Button,          // 対象コンポーネント
  parameters: {
    layout: "centered",       // レイアウト（centered / fullscreen / padded）
  },
  tags: ["autodocs"],         // 自動ドキュメント生成
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
      description: "ボタンのスタイル",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary バリアント
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "ボタン",
  },
};
```

### インタラクションテスト（play function）

ユーザー操作をシミュレートしてテストを行う場合は `play` 関数を使用します：

```typescript
import { expect, fn, userEvent, within } from "storybook/test";

export const WithClickTest: Story = {
  args: {
    onClick: fn(),
    children: "クリック",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

### デコレーターの使用

Story を包むラッパーが必要な場合はデコレーターを使用します：

```typescript
const meta = {
  // ...
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Component>;
```

### Storybook の起動

```bash
# 開発サーバーを起動（ポート 6006）
pnpm storybook

# 静的ビルド
pnpm build-storybook
```

## 8. その他
- **Biome 対応**: インポートの順序やフォーマットは Biome のルールに従ってください。
- **React Compiler**: React Compiler が有効になっていることを前提に、`useMemo` や `useCallback` の過剰な使用は避けてください（必要な場合のみ使用）。
