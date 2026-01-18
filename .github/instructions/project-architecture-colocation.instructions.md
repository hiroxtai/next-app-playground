---
applyTo: "src/app/**, src/components/**"
description: "Project architecture guidelines with colocation pattern"
---

# プロジェクトアーキテクチャ (Colocation Pattern) ガイドライン

このプロジェクトでは、Next.js App Router の機能を活かし、関連するファイルを機能単位で同じディレクトリに配置する「Colocation Pattern」を採用しています。

## 基本方針

- **関連ファイルの近接配置**: コンポーネント、テスト、Story、スタイル、ロジックを同じディレクトリに配置
- **機能単位の分割**: ページや機能ごとにディレクトリを分け、依存関係を明確に
- **プライベートフォルダ**: `_` プレフィックスで内部実装を明示

## ディレクトリ構造

### App Router の構成

```
src/app/
├── globals.css          # グローバルスタイル
├── layout.tsx           # ルートレイアウト
├── page.tsx             # ホームページ
├── page.test.tsx        # ホームページのテスト
├── _lib/                # アプリ全体の共通ロジック
│   └── catalog-data.ts
├── catalog/             # カタログ機能
│   ├── layout.tsx
│   ├── page.tsx
│   ├── README.md
│   ├── _components/     # カタログ専用コンポーネント
│   │   ├── PageCard.tsx
│   │   ├── PageCard.test.tsx
│   │   ├── PageCard.stories.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Sidebar.stories.tsx
│   │   └── index.ts
│   └── category/
│       └── [categoryId]/
│           └── page.tsx
└── examples/
    └── [category]/
        └── [page]/
            ├── layout.tsx
            └── page.tsx
```

### 共有コンポーネントの構成

```
src/components/
├── ui/                    # shadcn/ui コンポーネント
│   ├── button.tsx
│   ├── button.stories.tsx
│   ├── card.tsx
│   ├── card.stories.tsx
│   └── ...
├── theme-provider.tsx     # next-themes ラッパー
├── theme-toggle.tsx       # テーマ切替
└── index.ts               # エクスポート
```

## 命名規則

### ファイル命名

| 種類 | パターン | 例 |
|------|---------|-----|
| コンポーネント | `PascalCase.tsx` | `PageCard.tsx` |
| テスト | `*.test.tsx` / `*.test.ts` | `PageCard.test.tsx` |
| Story | `*.stories.tsx` | `PageCard.stories.tsx` |
| ユーティリティ | `kebab-case.ts` | `catalog-data.ts` |
| 型定義 | `types.ts` / `*.types.ts` | `types.ts` |

### ディレクトリ命名

| 種類 | パターン | 例 |
|------|---------|-----|
| ルートセグメント | `kebab-case` | `catalog/`, `user-profile/` |
| 動的ルート | `[param]` | `[categoryId]/` |
| プライベートフォルダ | `_name` | `_components/`, `_lib/` |
| グループ化 | `(name)` | `(marketing)/` |

## プライベートフォルダ (`_` プレフィックス)

`_` プレフィックスを持つフォルダは、ルーティングの対象外になります。

### 用途

```
src/app/catalog/
├── _components/     # この機能専用のコンポーネント
├── _hooks/          # この機能専用のフック
├── _lib/            # この機能専用のロジック
└── _utils/          # この機能専用のユーティリティ
```

### メリット

- **スコープの明確化**: その機能でのみ使用されることが明示される
- **ルーティング除外**: Next.js のルーティング対象外になる
- **依存関係の可視化**: インポートパスで依存先が分かる

## Colocation Pattern のメリット

### 1. メンテナンス性

```
// ✅ 関連ファイルが近くにあり、変更が容易
src/app/catalog/_components/
├── PageCard.tsx          # 実装
├── PageCard.test.tsx     # テスト
└── PageCard.stories.tsx  # Story

// ❌ ファイルが分散していると、変更漏れが発生しやすい
src/components/PageCard.tsx
src/__tests__/PageCard.test.tsx
src/stories/PageCard.stories.tsx
```

### 2. 削除の容易さ

```bash
# ✅ フォルダごと削除すれば完了
rm -rf src/app/catalog/_components/PageCard*

# ❌ 複数の場所から削除が必要
rm src/components/PageCard.tsx
rm src/__tests__/PageCard.test.tsx
rm src/stories/PageCard.stories.tsx
```

### 3. 依存関係の明確化

```typescript
// ✅ インポートパスで依存先が分かる
import { PageCard } from "./_components/PageCard";  // ローカル
import { Button } from "@/components/ui/button";    // 共有

// ❌ すべてが同じレベルで、依存関係が不明確
import { PageCard } from "@/components/PageCard";
import { Button } from "@/components/Button";
```

## 共有 vs ローカルの判断基準

### 共有コンポーネント (`src/components/`)

- **複数の機能で使用される** UI コンポーネント
- **デザインシステム** の一部 (shadcn/ui)
- **汎用的なユーティリティ** コンポーネント

```
src/components/
├── ui/           # shadcn/ui (汎用 UI)
├── theme-*       # テーマ関連 (全体で使用)
└── layouts/      # レイアウトコンポーネント
```

### ローカルコンポーネント (`_components/`)

- **特定の機能でのみ使用される** コンポーネント
- **ビジネスロジックに依存する** コンポーネント
- **再利用の予定がない** コンポーネント

```
src/app/catalog/_components/
├── PageCard.tsx      # カタログページ専用
├── Sidebar.tsx       # カタログサイドバー専用
└── FilterPanel.tsx   # カタログフィルター専用
```

## index.ts によるエクスポート

### ローカルコンポーネントのエクスポート

```typescript
// src/app/catalog/_components/index.ts
export { PageCard } from "./PageCard";
export { Sidebar } from "./Sidebar";
```

### 使用側

```typescript
// src/app/catalog/page.tsx
import { PageCard, Sidebar } from "./_components";
```

## ベストプラクティス

### 1. 小さく始める

```typescript
// ✅ 最初はページ内に直接定義
// src/app/catalog/page.tsx
function PageCard({ ... }) { ... }

export default function CatalogPage() {
  return <PageCard ... />;
}

// ❌ 最初から過度に分割しない
```

### 2. 必要に応じて分離

```typescript
// ✅ 複雑になったら _components に移動
// src/app/catalog/_components/PageCard.tsx
export function PageCard({ ... }) { ... }

// src/app/catalog/page.tsx
import { PageCard } from "./_components/PageCard";
```

### 3. 再利用時に共有化

```typescript
// ✅ 2箇所以上で使うようになったら共有コンポーネントへ
// src/components/PageCard.tsx
export function PageCard({ ... }) { ... }
```

## テストファイルの配置

テストファイルは、テスト対象と同じディレクトリに配置します。

```
src/app/catalog/_components/
├── PageCard.tsx
├── PageCard.test.tsx     # 同じディレクトリ
├── Sidebar.tsx
└── Sidebar.test.tsx      # 同じディレクトリ
```

### テストのインポート

```typescript
// src/app/catalog/_components/PageCard.test.tsx
import { render, screen } from "@testing-library/react";
import { PageCard } from "./PageCard";  // 相対インポート

describe("PageCard", () => {
  it("should render correctly", () => {
    render(<PageCard title="テスト" />);
    expect(screen.getByText("テスト")).toBeInTheDocument();
  });
});
```

## Story ファイルの配置

Story ファイルもコンポーネントと同じディレクトリに配置します。

```
src/app/catalog/_components/
├── PageCard.tsx
├── PageCard.stories.tsx  # 同じディレクトリ
├── Sidebar.tsx
└── Sidebar.stories.tsx   # 同じディレクトリ
```

## 参考リンク

- [Next.js Project Organization](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Colocation](https://nextjs.org/docs/app/getting-started/project-structure#colocation)
- [Next.js Private Folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)
