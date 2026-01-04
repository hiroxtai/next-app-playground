# shadcn/ui 使用ガイド

このドキュメントでは、本プロジェクトにおける shadcn/ui の設定、使用方法、カスタマイズについて説明します。

## 概要

[shadcn/ui](https://ui.shadcn.com/) は、Radix UI と Tailwind CSS をベースにした再利用可能なコンポーネントコレクションです。
npmパッケージとしてインストールするのではなく、**コンポーネントのソースコードを直接プロジェクトにコピー**する形式を採用しています。

### なぜ shadcn/ui を選んだか

1. **カスタマイズ性**: コンポーネントのソースコードが手元にあるため、自由にカスタマイズ可能
2. **学習効果**: コンポーネントの実装を読んで学べる
3. **アクセシビリティ**: Radix UI ベースで WAI-ARIA に準拠
4. **軽量**: 必要なコンポーネントだけを追加できる
5. **Next.js 対応**: App Router、Server Components に対応

## プロジェクト設定

### 設定ファイル (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

### スタイル設定

- **スタイル**: `new-york` - よりシャープでモダンなデザイン
- **ベースカラー**: `zinc` - ニュートラルなグレースケール
- **カラーモデル**: `oklch` - 知覚的に均一な色空間

### ディレクトリ構成

```
src/
├── components/
│   ├── ui/           # shadcn/ui コンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── theme-provider.tsx  # next-themes ラッパー
│   └── theme-toggle.tsx    # テーマ切替ドロップダウン
└── lib/
    └── utils.ts      # cn() ユーティリティ関数
```

## 導入済みコンポーネント

| カテゴリ | コンポーネント |
|---------|---------------|
| フォーム | Button, Input, Label, Textarea, Select, Checkbox, Switch |
| レイアウト | Card, Separator, Tabs |
| オーバーレイ | Dialog, DropdownMenu, Tooltip |
| フィードバック | Alert, Badge, Sonner (Toast) |
| データ表示 | Avatar |
| テーマ | ThemeProvider, ThemeToggle |

## 使い方

### 基本的なインポート

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

### Button の例

```tsx
import { Button } from "@/components/ui/button";

// バリエーション
<Button variant="default">デフォルト</Button>
<Button variant="destructive">削除</Button>
<Button variant="outline">アウトライン</Button>
<Button variant="secondary">セカンダリ</Button>
<Button variant="ghost">ゴースト</Button>
<Button variant="link">リンク</Button>

// サイズ
<Button size="sm">小</Button>
<Button size="default">中</Button>
<Button size="lg">大</Button>
<Button size="icon">🔍</Button>

// アイコン付き
import { Mail } from "lucide-react";
<Button>
  <Mail />
  メール送信
</Button>

// リンクとして使用（asChild）
import Link from "next/link";
<Button asChild>
  <Link href="/about">詳細へ</Link>
</Button>
```

### Card の例

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>カードタイトル</CardTitle>
    <CardDescription>カードの説明文</CardDescription>
  </CardHeader>
  <CardContent>
    <p>メインコンテンツ</p>
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>
```

### Toast (Sonner) の例

```tsx
import { toast } from "sonner";

// 基本
toast("メッセージを表示");

// 種類別
toast.success("成功しました！");
toast.error("エラーが発生しました");
toast.warning("警告です");
toast.info("お知らせです");

// カスタム
toast("タイトル", {
  description: "詳細な説明文",
  action: {
    label: "取り消し",
    onClick: () => console.log("取り消しました"),
  },
});
```

## ダークモード

### 仕組み

- **next-themes**: `<html>` タグに `class="dark"` を付与
- **Tailwind CSS v4**: `@custom-variant dark (&:is(.dark *))` でダークモード対応
- **CSS 変数**: `:root` と `.dark` で色を切り替え

### ThemeToggle の使用

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

// ヘッダーなどに配置
<header>
  <nav>...</nav>
  <ThemeToggle />
</header>
```

### プログラムからのテーマ切替

```tsx
"use client";

import { useTheme } from "next-themes";

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      テーマ切替
    </button>
  );
}
```

## 新しいコンポーネントの追加

### shadcn CLI を使用

```bash
# 単一コンポーネント
pnpm dlx shadcn@latest add accordion

# 複数コンポーネント
pnpm dlx shadcn@latest add table pagination slider

# すべてのコンポーネント
pnpm dlx shadcn@latest add --all
```

### 利用可能なコンポーネント一覧

```bash
pnpm dlx shadcn@latest add --help
```

または [shadcn/ui Components](https://ui.shadcn.com/docs/components) を参照。

## カスタマイズ

### 色のカスタマイズ

`src/app/globals.css` の CSS 変数を編集：

```css
:root {
  --primary: oklch(0.21 0.006 285.885);       /* プライマリカラー */
  --primary-foreground: oklch(0.985 0 0);     /* プライマリ上のテキスト */
  --accent: oklch(0.967 0.001 286.375);       /* アクセントカラー */
  /* ... */
}

.dark {
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0.006 285.938);
  /* ... */
}
```

### コンポーネントのカスタマイズ

`src/components/ui/` 内のファイルを直接編集できます。

例: Button のデフォルトスタイルを変更

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  // ベーススタイルを編集
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        // 新しいバリアントを追加
        gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90",
      },
      // ...
    },
  }
);
```

## Storybook での確認

shadcn/ui コンポーネントは Storybook で確認できます：

```bash
pnpm storybook
```

- **ダークモード切替**: ツールバーの 🌙 アイコンで Light/Dark を切替
- **コントロールパネル**: props を変更してリアルタイムでプレビュー
- **インタラクションテスト**: play function でユーザー操作をテスト

## アイコン (lucide-react)

### 基本的な使い方

```tsx
import { Search, Menu, X, ChevronRight } from "lucide-react";

<Search className="h-4 w-4" />
<Menu className="h-6 w-6 text-gray-500" />
```

### アイコン検索

[Lucide Icons](https://lucide.dev/icons) で利用可能なアイコンを検索できます。

## ベストプラクティス

### 1. コンポーネントの組み合わせ

```tsx
// ✅ 推奨: shadcn/ui コンポーネントを組み合わせる
<Card>
  <CardHeader>
    <CardTitle>ログイン</CardTitle>
  </CardHeader>
  <CardContent>
    <form>
      <Label htmlFor="email">メールアドレス</Label>
      <Input id="email" type="email" />
      <Button type="submit">送信</Button>
    </form>
  </CardContent>
</Card>
```

### 2. asChild パターン

```tsx
// ✅ 推奨: asChild で別の要素としてレンダリング
<Button asChild>
  <Link href="/dashboard">ダッシュボード</Link>
</Button>

// ❌ 非推奨: ネストした要素
<Button>
  <Link href="/dashboard">ダッシュボード</Link>
</Button>
```

### 3. アクセシビリティ

```tsx
// ✅ 推奨: アイコンのみのボタンには sr-only でラベルを追加
<Button size="icon">
  <Search />
  <span className="sr-only">検索</span>
</Button>

// ✅ 推奨: フォーム要素には Label を関連付け
<Label htmlFor="name">名前</Label>
<Input id="name" />
```

## トラブルシューティング

### CSS 変数が適用されない

1. `globals.css` が正しくインポートされているか確認
2. Tailwind CSS v4 の設定を確認

### ダークモードが効かない

1. `ThemeProvider` が `layout.tsx` でラップされているか確認
2. `<html>` タグに `suppressHydrationWarning` があるか確認
3. `attribute="class"` が設定されているか確認

### コンポーネントが見つからない

```bash
# コンポーネントを追加
pnpm dlx shadcn@latest add [component-name]
```

## 参考リンク

- [shadcn/ui 公式ドキュメント](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Sonner](https://sonner.emilkowal.ski/)
- [Lucide Icons](https://lucide.dev/)
