---
applyTo: "src/components/ui/*.tsx, components.json"
description: "shadcn/ui component library guidelines with Radix UI primitives"
---

# shadcn/ui + Radix UI ガイドライン

shadcn/ui は、Radix UI と Tailwind CSS をベースにした再利用可能なコンポーネントコレクションです。npm パッケージではなく、コンポーネントのソースコードを直接プロジェクトにコピーする形式を採用しています。

## 基本方針

- **カスタマイズ性**: コンポーネントのソースコードが手元にあり、自由にカスタマイズ可能
- **学習効果**: コンポーネントの実装を読んで学べる
- **アクセシビリティ**: Radix UI ベースで WAI-ARIA に準拠
- **軽量**: 必要なコンポーネントだけを追加できる

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/                 # shadcn/ui コンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── theme-provider.tsx  # next-themes ラッパー
│   └── theme-toggle.tsx    # テーマ切替ドロップダウン
└── lib/
    └── utils.ts            # cn() ユーティリティ関数
```

## コンポーネントの追加

### CLI を使用

```bash
# 単一コンポーネント
pnpm dlx shadcn@latest add button

# 複数コンポーネント
pnpm dlx shadcn@latest add card input label

# すべてのコンポーネント
pnpm dlx shadcn@latest add --all

# コンポーネント一覧を確認
pnpm dlx shadcn@latest add --help
```

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

## コンポーネントの使用

### 基本的なインポート

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

### Button の例

```tsx
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

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
<Button>
  <Mail />
  メール送信
</Button>
```

### asChild パターン

`asChild` を使うと、Button のスタイルを保ちながら別の要素としてレンダリングできます。

```tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ✅ 推奨: asChild で Link をラップ
<Button asChild>
  <Link href="/about">詳細へ</Link>
</Button>

// ❌ 非推奨: ネストした要素
<Button>
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

## ダークモード

### 仕組み

- **next-themes**: `<html>` タグに `class="dark"` を付与
- **Tailwind CSS v4**: `@custom-variant dark (&:is(.dark *))` でダークモード対応
- **CSS 変数**: `:root` と `.dark` で色を切り替え

### ThemeProvider の設定

```tsx
// src/components/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Layout への統合

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### ThemeToggle コンポーネント

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">テーマを切り替え</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          ライト
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          ダーク
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          システム
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## カスタマイズ

### CSS 変数のカスタマイズ

`src/app/globals.css` の CSS 変数を編集：

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  /* ... */
}
```

### コンポーネントのカスタマイズ

`src/components/ui/` 内のファイルを直接編集できます。

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ...",
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

## cn() ユーティリティ関数

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 使用例

```tsx
import { cn } from "@/lib/utils";

// 条件付きクラス
<div className={cn("p-4", isActive && "bg-blue-500")} />

// 複数クラスのマージ
<Button className={cn("w-full", className)} />
```

## アクセシビリティ

### ベストプラクティス

```tsx
// ✅ 推奨: アイコンのみのボタンには sr-only でラベルを追加
<Button size="icon">
  <Search />
  <span className="sr-only">検索</span>
</Button>

// ✅ 推奨: フォーム要素には Label を関連付け
<Label htmlFor="email">メールアドレス</Label>
<Input id="email" type="email" />

// ✅ 推奨: aria-label を適切に設定
<Button aria-label="メニューを開く">
  <Menu />
</Button>
```

## アイコン (lucide-react)

### 基本的な使い方

```tsx
import { Search, Menu, X, ChevronRight, Mail, User } from "lucide-react";

// サイズ指定
<Search className="h-4 w-4" />
<Menu className="h-6 w-6" />

// 色指定
<User className="h-5 w-5 text-muted-foreground" />
```

### アイコン検索

[Lucide Icons](https://lucide.dev/icons) で利用可能なアイコンを検索できます。

## Toast (Sonner)

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

## 参考リンク

- [shadcn/ui 公式ドキュメント](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Sonner](https://sonner.emilkowal.ski/)
- [Lucide Icons](https://lucide.dev/)
