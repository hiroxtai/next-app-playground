# カタログシステム

学習用サンプルページを整理・探索できるカタログ機能のドキュメントです。

## 📚 目次

- [概要](#概要)
- [ディレクトリ構造](#ディレクトリ構造)
- [使用方法](#使用方法)
- [技術スタック](#技術スタック)
- [設計パターン](#設計パターン)
- [主要コンポーネント](#主要コンポーネント)
- [カスタマイズ](#カスタマイズ)
- [トラブルシューティング](#トラブルシューティング)

---

## 概要

このカタログシステムは、学習用に作成した複数のサンプルページを、カテゴリ別に整理して表示する機能です。

### 主な機能

- 📂 **カテゴリ別分類**: UI基礎、レイアウト、アニメーションなど5つのカテゴリ
- 🔍 **カードグリッド表示**: 視覚的に見やすいカード形式でページ一覧を表示
- 🏷️ **タグとバッジ**: 難易度やタグで技術スタックを明示
- 🌓 **ダークモード対応**: システムの設定に応じて自動切り替え
- 📱 **レスポンシブデザイン**: デスクトップ・タブレット・モバイルに対応

### アクセス方法

- カタログトップ: `http://localhost:3000/catalog`
- カテゴリフィルタ: `http://localhost:3000/catalog/category/[categoryId]`
- 個別サンプルページ: `http://localhost:3000/examples/[category]/[page]`

---

## ディレクトリ構造

```
src/app/
├── _lib/
│   └── catalog-data.ts          # カタログデータ定義（カテゴリ、ページ情報）
│
├── catalog/                     # カタログ機能（/catalog パスに対応）
│   ├── layout.tsx               # サイドバー + メインコンテンツのレイアウト
│   ├── page.tsx                 # カタログトップページ（全ページ一覧）
│   ├── category/
│   │   └── [categoryId]/
│   │       └── page.tsx         # カテゴリフィルタページ
│   └── _components/
│       ├── index.ts             # コンポーネントのエクスポート
│       ├── Sidebar.tsx          # サイドバーナビゲーション
│       └── PageCard.tsx         # ページカード（molecules）
│
└── examples/                    # サンプルページ本体
    └── [category]/
        └── [page]/
            └── page.tsx         # 動的ルートで各サンプルを表示
```

### 重要なポイント

#### 1. **`catalog/` ディレクトリは通常のセグメント**
```
catalog/         → /catalog にアクセス可能
(catalog)/       → /catalog にはアクセスできない（Route Group）
```
- Route Group `(folder)` は URL パスに現れません
- 今回は `/catalog` でアクセスしたいため、括弧なしの `catalog/` を使用

#### 2. **`_lib/` と `_components/` の違い**
```
_lib/            → プロジェクト全体で共有するデータやユーティリティ
_components/     → 特定のルート（catalog）専用のコンポーネント
```
- アンダースコア `_` で始まるフォルダは、Next.js のルーティング対象外

---

## 使用方法

### 新しいサンプルページを追加する

#### Step 1: カタログデータに登録

`src/app/_lib/catalog-data.ts` を編集します：

```typescript
export const pages: PageInfo[] = [
  // 既存のページ...
  
  // 新しいページを追加
  {
    id: "my-new-page",              // ページID（URL用、ユニーク）
    title: "新しいサンプル",          // ページタイトル
    description: "このページの説明", // 説明文
    category: "ui-basics",          // カテゴリID
    difficulty: "初級",              // 難易度（初級・中級・上級）
    tags: ["React", "Tailwind CSS"], // タグ（オプション）
  },
];
```

#### Step 2: サンプルページファイルを作成

ディレクトリとファイルを作成します：

```bash
mkdir -p src/app/examples/ui-basics/my-new-page
touch src/app/examples/ui-basics/my-new-page/page.tsx
```

`page.tsx` の内容：

```tsx
export default function MyNewPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">新しいサンプル</h1>
      <p className="mt-4">サンプルコンテンツをここに実装します。</p>
    </div>
  );
}
```

#### Step 3: 確認

1. 開発サーバーを起動: `pnpm dev`
2. ブラウザで `/catalog` にアクセス
3. カード一覧に新しいページが表示されることを確認
4. カードの「開く」ボタンをクリックして動作確認

### 新しいカテゴリを追加する

`src/app/_lib/catalog-data.ts` を編集：

```typescript
export const categories = [
  // 既存のカテゴリ...
  
  {
    id: "new-category",
    label: "新カテゴリ",
    description: "カテゴリの説明文",
  },
] as const;
```

**注意**: `as const` を必ず付けてください。これにより、TypeScript が厳密な型推論を行います。

---

## 技術スタック

### フレームワーク・ライブラリ

| 技術 | バージョン | 役割 |
|------|-----------|------|
| **Next.js** | 16.0.10 | React フレームワーク（App Router） |
| **React** | 19.2.1 | UI ライブラリ |
| **TypeScript** | 5.x | 型安全性 |
| **Tailwind CSS** | v4 | スタイリング |

### Next.js の主要機能

#### 1. **App Router**
```
src/app/
├── catalog/
│   └── page.tsx       → /catalog
└── examples/
    └── [category]/
        └── [page]/
            └── page.tsx → /examples/ui-basics/button-basics
```
- ファイルシステムベースのルーティング
- `page.tsx` がルート、`layout.tsx` がレイアウト

#### 2. **動的ルート（Dynamic Routes）**
```typescript
// [categoryId]/page.tsx
export default function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  // ...
}
```
- `[folder]` で動的セグメント
- Next.js 15+ では `params` が Promise 型

#### 3. **Server Components（デフォルト）**
```typescript
// Sidebar.tsx - Server Component
export default function Sidebar() {
  // データベースアクセス、APIコール可能
  // クライアントにJavaScriptを送信しない
}
```
- `'use client'` がない場合、Server Component
- バンドルサイズ削減、パフォーマンス向上

#### 4. **Client Components**
```typescript
'use client';

// useState、useEffect、イベントハンドラーが必要な場合のみ
export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

---

## 設計パターン

### 1. Atomic Design

コンポーネントを階層的に設計する方法論です。

```
atoms（原子）
  ↓ 組み合わせ
molecules（分子）
  ↓ 組み合わせ
organisms（有機体）
  ↓ 配置
templates（テンプレート）
  ↓ データ挿入
pages（ページ）
```

#### 本プロジェクトでの適用

| レベル | 例 | 場所 |
|--------|----|----|
| **atoms** | `<Link>`, `<span>`, `<div>` | Next.js / HTML 組み込み |
| **molecules** | `<PageCard>` | `catalog/_components/PageCard.tsx` |
| **organisms** | サイドバー + カードグリッド | `catalog/layout.tsx` + `page.tsx` |
| **templates** | カタログレイアウト | `catalog/layout.tsx` |
| **pages** | カタログページ | `catalog/page.tsx` |

#### PageCard.tsx の構造（molecules）

```
PageCard（molecules）
├── サムネイル（atoms: div）
├── タイトル（atoms: h3）
├── 説明文（atoms: p）
├── タグリスト
│   └── タグバッジ（atoms: span） × 複数
├── 難易度バッジ（atoms: span）
└── 開くボタン（atoms: Link）
```

### 2. コロケーションパターン（Colocation）

関連するファイルを同じディレクトリに配置する設計です。

```
catalog/
├── page.tsx              # カタログページ
├── layout.tsx            # レイアウト
└── _components/          # このルート専用のコンポーネント
    ├── Sidebar.tsx
    └── PageCard.tsx
```

**メリット**:
- ファイルの関連性が明確
- 変更時の影響範囲が限定的
- 削除時にまとめて消せる

### 3. データ駆動（Data-Driven）

UIをハードコードせず、データから生成します。

```typescript
// ❌ 悪い例（ハードコード）
<ul>
  <li>UI基礎</li>
  <li>レイアウト</li>
  <li>アニメーション</li>
</ul>

// ✅ 良い例（データ駆動）
<ul>
  {categories.map((category) => (
    <li key={category.id}>{category.label}</li>
  ))}
</ul>
```

**メリット**:
- カテゴリ追加時、データ更新のみで済む
- コードの重複がない（DRY原則）
- テストしやすい

---

## 主要コンポーネント

### 1. `catalog-data.ts`

カタログのすべてのデータを管理します。

```typescript
// カテゴリ定義
export const categories = [
  {
    id: "ui-basics",           // カテゴリID（URL用）
    label: "UI基礎",           // 表示名
    description: "説明文",     // 説明
  },
  // ...
] as const;

// ページ定義
export const pages: PageInfo[] = [
  {
    id: "button-basics",
    title: "ボタンの基礎",
    description: "...",
    category: "ui-basics",      // カテゴリIDを参照
    difficulty: "初級",
    tags: ["Button", "Tailwind CSS"],
  },
  // ...
];
```

#### 型定義の仕組み

```typescript
export type CategoryId = (typeof categories)[number]["id"];
// → "ui-basics" | "layout" | "animation" | ...
```

`as const` により、TypeScript が厳密な文字列リテラル型を推論します。

#### ヘルパー関数

```typescript
// カテゴリからページを取得
getPagesByCategory(categoryId: CategoryId): PageInfo[]

// IDからページを取得
getPageById(pageId: string): PageInfo | undefined
```

### 2. `Sidebar.tsx`

サイドバーナビゲーションコンポーネントです。

```typescript
export default function Sidebar() {
  return (
    <aside className="w-64 border-r ...">
      <nav>
        <ul>
          {/* すべてのページ */}
          <li><Link href="/catalog">すべてのページ</Link></li>
          
          {/* カテゴリリンク */}
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/catalog/category/${category.id}`}>
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

#### 技術的なポイント

- **Server Component**: 静的コンテンツなので Client Component 不要
- **データ駆動**: `categories` 配列から自動生成
- **Tailwind CSS**: `w-64`（幅256px）、`border-r`（右ボーダー）

### 3. `PageCard.tsx`

個別ページを表示するカードコンポーネントです。

```typescript
export default function PageCard({
  page,
  examplePath,
}: {
  page: PageInfo;
  examplePath: string;
}) {
  return (
    <div className="...カードスタイル...">
      {/* サムネイル */}
      <div className="h-32 bg-gradient-to-br ...">
        {/* カテゴリ別アイコン */}
      </div>
      
      {/* カード本体 */}
      <div className="p-4">
        <h3>{page.title}</h3>
        <p>{page.description}</p>
        
        {/* タグ */}
        {page.tags?.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
        
        {/* 難易度バッジ */}
        <span>{page.difficulty}</span>
        
        {/* 開くボタン */}
        <Link href={examplePath}>開く</Link>
      </div>
    </div>
  );
}
```

#### Atomic Design での位置づけ

- **molecules**: 複数の atoms（Link、span、div）を組み合わせた複合コンポーネント
- **再利用可能**: カタログトップとカテゴリページで共通使用
- **props駆動**: データを受け取り、表示のみを担当

### 4. `catalog/layout.tsx`

サイドバー + メインコンテンツのレイアウトです。

```typescript
export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

#### Next.js Layout の仕組み

```
catalog/layout.tsx が適用される範囲:
├── /catalog                   ✅ 適用
├── /catalog/category/ui-basics ✅ 適用
└── /examples/...              ❌ 適用外（別のディレクトリ）
```

- `children` は `page.tsx` の内容が渡される
- ナビゲーション時にレイアウトは再レンダリングされない（状態保持）

### 5. `catalog/page.tsx`

カタログトップページです。

```typescript
export default function CatalogPage() {
  return (
    <div className="p-8">
      <h1>ページカタログ</h1>
      
      {/* カードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            examplePath={`/examples/${page.category}/${page.id}`}
          />
        ))}
      </div>
    </div>
  );
}
```

#### Tailwind CSS のレスポンシブ設計

```css
grid-cols-1           /* デフォルト: 1列 */
md:grid-cols-2        /* 768px以上: 2列 */
lg:grid-cols-3        /* 1024px以上: 3列 */
```

### 6. `category/[categoryId]/page.tsx`

カテゴリフィルタページです。

```typescript
export default function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = React.use(params);
  
  // カテゴリ情報取得
  const category = categories.find((cat) => cat.id === categoryId);
  
  // 404エラー
  if (!category) {
    notFound();
  }
  
  // カテゴリに属するページ取得
  const pagesByCategory = getPagesByCategory(categoryId as any);
  
  // 表示（catalog/page.tsx と同様の構造）
}
```

#### 動的ルートのポイント

- `[categoryId]` フォルダが動的セグメント
- `params.categoryId` で値を取得
- Next.js 15+ では `params` が Promise 型（`React.use()` で解決）

---

## カスタマイズ

### 1. サイドバーの幅を変更

`catalog/_components/Sidebar.tsx` を編集：

```typescript
// 現在: w-64（256px）
<aside className="w-64 border-r ...">

// 変更例: w-80（320px）
<aside className="w-80 border-r ...">
```

### 2. カードのカラム数を変更

`catalog/page.tsx` を編集：

```typescript
// 現在: 1列 → 2列 → 3列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 変更例: 1列 → 3列 → 4列
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
```

### 3. カテゴリアイコンのカスタマイズ

`catalog/_components/PageCard.tsx` を編集：

```typescript
<div className="text-3xl">
  {page.category === 'ui-basics' && '🎨'}  // 変更
  {page.category === 'layout' && '📐'}     // 変更
  // ...
</div>
```

**推奨**: 将来的には `catalog-data.ts` に `icon` プロパティを追加してデータ駆動にする。

### 4. 難易度の色を変更

`catalog/_components/PageCard.tsx` を編集：

```typescript
const difficultyColor: Record<PageInfo['difficulty'], string> = {
  初級: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  中級: 'bg-yellow-100 text-yellow-800 ...',  // 変更
  上級: 'bg-red-100 text-red-800 ...',        // 変更
};
```

---

## トラブルシューティング

### Q1: `/catalog` にアクセスすると 404 エラーが出る

**原因**: ディレクトリ名が `(catalog)` になっている可能性

**解決策**:
```bash
# Route Group の括弧を削除
mv src/app/\(catalog\) src/app/catalog
```

Route Group `(folder)` は URL パスに現れません。`/catalog` でアクセスするには括弧なしの `catalog/` を使用します。

### Q2: 新しいページを追加したのにカタログに表示されない

**確認事項**:

1. **`catalog-data.ts` に登録したか？**
   ```typescript
   export const pages: PageInfo[] = [
     // ここに追加
   ];
   ```

2. **`category` が有効なカテゴリIDか？**
   ```typescript
   category: "ui-basics"  // categories に存在するIDか確認
   ```

3. **開発サーバーを再起動したか？**
   ```bash
   # Ctrl+C で停止 → 再起動
   pnpm dev
   ```

### Q3: TypeScript エラー「型 'string' を型 'CategoryId' に割り当てることはできません」

**原因**: カテゴリIDが `categories` に定義されていない

**解決策**:
```typescript
// catalog-data.ts に新しいカテゴリを追加
export const categories = [
  // 既存...
  {
    id: "your-new-category",  // ← ここに追加
    label: "新カテゴリ",
    description: "...",
  },
] as const;
```

### Q4: ダークモードが正しく動作しない

**確認事項**:

1. **Tailwind CSS の設定**
   ```javascript
   // tailwind.config.ts
   export default {
     darkMode: 'class', // または 'media'
   }
   ```

2. **すべてのクラスに `dark:` プレフィックスを追加したか？**
   ```typescript
   className="bg-white dark:bg-black"
   ```

### Q5: `React.use()` でエラーが出る

**原因**: React 19 未満、または import 忘れ

**解決策**:
```typescript
import React from 'react';

// Next.js 15+ では params が Promise
const { categoryId } = React.use(params);
```

または、async/await を使用：
```typescript
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  // ...
}
```

---

## 参考リンク

- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Atomic Design 解説](https://bradfrost.com/blog/post/atomic-web-design/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)

---

## まとめ

このカタログシステムは、以下を学ぶための実践的なリファレンス実装です：

✅ **Next.js App Router** の動的ルーティング  
✅ **Server Components** と **Client Components** の使い分け  
✅ **TypeScript** の型安全性と型推論  
✅ **Tailwind CSS** のレスポンシブデザイン  
✅ **Atomic Design** のコンポーネント設計  
✅ **データ駆動** のUI構築

新しいサンプルページを追加しながら、これらの技術を実践的に学習できます。
