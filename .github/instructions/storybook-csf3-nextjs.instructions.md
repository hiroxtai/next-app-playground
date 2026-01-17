---
applyTo: "**/*.stories.tsx, **/*.stories.ts, .storybook/**"
description: "Storybook CSF 3.0 guidelines for Next.js projects"
---

# Storybook CSF 3.0 + Next.js ガイドライン

このプロジェクトでは **Storybook 10** を使用してコンポーネントの開発・ドキュメント化を行います。

## 基本方針

- **学習重視**: 初学者が Story の書き方を理解しやすいよう、JSDoc コメントを充実させる
- **Colocation**: Story ファイルはコンポーネントと同じディレクトリに配置
- **autodocs**: すべての Story に `tags: ['autodocs']` を指定し、自動ドキュメント生成を有効化
- **アクセシビリティ**: addon-a11y による自動チェックを活用

## Story ファイルの配置

コンポーネントと同じディレクトリに `*.stories.tsx` ファイルを配置します。

```
src/components/ui/
├── button.tsx          # コンポーネント
├── button.stories.tsx  # Story ファイル
└── card.tsx
```

## CSF 3.0 形式の Story

### 基本構成

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

/**
 * Button コンポーネントの Story
 *
 * @remarks
 * shadcn/ui の Button コンポーネントを使用しています。
 * バリエーションやサイズの組み合わせをプレビューできます。
 */
const meta = {
  title: "UI/Button",           // サイドバーの階層構造
  component: Button,            // 対象コンポーネント
  parameters: {
    layout: "centered",         // レイアウト（centered / fullscreen / padded）
  },
  tags: ["autodocs"],           // 自動ドキュメント生成
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "ボタンのスタイル",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "ボタンのサイズ",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
```

### Story の定義

```typescript
/**
 * デフォルトバリアント
 *
 * @remarks
 * 最も基本的なボタンのスタイル。
 * プライマリアクションに使用します。
 */
export const Default: Story = {
  args: {
    variant: "default",
    children: "ボタン",
  },
};

/**
 * アウトラインバリアント
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "アウトライン",
  },
};

/**
 * 小さいサイズ
 */
export const Small: Story = {
  args: {
    size: "sm",
    children: "小さいボタン",
  },
};
```

## Next.js App Router との統合

### App Directory の設定

Next.js App Router を使用するコンポーネントには、`nextjs.appDirectory` パラメータを設定します。

```typescript
const meta = {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true,  // App Router を有効化
    },
  },
} satisfies Meta<typeof NavigationBasedComponent>;
```

### Navigation のモック

```typescript
export const WithNavigation: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/profile",
        query: {
          user: "1",
        },
      },
    },
  },
};
```

### Router のモック

```typescript
export const WithRouter: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: "/profile/[id]",
        asPath: "/profile/1",
        query: {
          id: "1",
        },
      },
    },
  },
};
```

## インタラクションテスト (play function)

### 基本的な使い方

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

### step を使った整理

```typescript
import { expect, fn, userEvent, waitFor } from "storybook/test";

export const FormSubmission: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ args, canvas, step, userEvent }) => {
    await step("フォームに入力", async () => {
      await userEvent.type(canvas.getByTestId("email"), "test@example.com");
      await userEvent.type(canvas.getByTestId("password"), "password123");
    });

    await step("フォームを送信", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "送信" }));
    });

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalled());
  },
};
```

### play 関数の合成

```typescript
// 前のストーリーの play 関数を再利用
export const StepTwoComplete: Story = {
  play: async (context) => {
    // Step 1 を実行
    await StepOneComplete.play?.(context);

    const canvas = within(context.canvasElement);
    // Step 2 の操作を実行
    await userEvent.type(canvas.getByLabelText("住所"), "東京都渋谷区...");
    await userEvent.click(canvas.getByRole("button", { name: "次へ" }));
  },
};
```

## デコレーター

### 基本的な使い方

```typescript
const meta = {
  component: Component,
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Component>;
```

### ThemeProvider デコレーター

```typescript
import { ThemeProvider } from "@/components/theme-provider";

const meta = {
  component: ThemedComponent,
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemedComponent>;
```

### Story 固有のデコレーター

```typescript
export const WithSidebar: Story = {
  decorators: [
    (Story) => (
      <div className="flex">
        <aside className="w-64">サイドバー</aside>
        <main className="flex-1">
          <Story />
        </main>
      </div>
    ),
  ],
};
```

## argTypes 設定

### コントロールの種類

```typescript
argTypes: {
  // セレクト
  variant: {
    control: { type: "select" },
    options: ["default", "outline", "ghost"],
  },
  // テキスト
  label: {
    control: { type: "text" },
  },
  // 数値
  count: {
    control: { type: "number", min: 0, max: 100 },
  },
  // 真偽値
  disabled: {
    control: { type: "boolean" },
  },
  // 色
  color: {
    control: { type: "color" },
  },
  // 日付
  date: {
    control: { type: "date" },
  },
  // オブジェクト
  config: {
    control: { type: "object" },
  },
  // 非表示
  onClick: {
    table: { disable: true },
  },
}
```

## ベストプラクティス

### 1. Story の命名

```typescript
// ✅ 推奨: 明確で一貫性のある命名
export const Default: Story = { ... };
export const WithIcon: Story = { ... };
export const Loading: Story = { ... };
export const Disabled: Story = { ... };

// ❌ 非推奨: 曖昧な命名
export const Story1: Story = { ... };
export const Test: Story = { ... };
```

### 2. args の再利用

```typescript
const baseArgs = {
  children: "ボタン",
};

export const Default: Story = {
  args: baseArgs,
};

export const Large: Story = {
  args: {
    ...baseArgs,
    size: "lg",
  },
};
```

### 3. JSDoc の記述

```typescript
/**
 * ローディング状態
 *
 * @remarks
 * API 呼び出し中などの非同期処理中に表示するスタイル。
 * スピナーとテキストを組み合わせて使用します。
 */
export const Loading: Story = {
  args: {
    disabled: true,
    children: "読み込み中...",
  },
};
```

### 4. アクセシビリティテスト

addon-a11y が自動的にアクセシビリティをチェックします。

```typescript
// アイコンのみのボタンには sr-only でラベルを追加
export const IconOnly: Story = {
  render: () => (
    <Button size="icon">
      <Search />
      <span className="sr-only">検索</span>
    </Button>
  ),
};
```

## Storybook の起動

```bash
# 開発サーバーを起動（ポート 6006）
pnpm storybook

# 静的ビルド
pnpm build-storybook
```

## 参考リンク

- [Storybook 公式ドキュメント](https://storybook.js.org/docs)
- [CSF 3.0](https://storybook.js.org/docs/api/csf)
- [Play function](https://storybook.js.org/docs/writing-stories/play-function)
- [Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [Next.js Integration](https://storybook.js.org/docs/get-started/frameworks/nextjs)
