# パンくずリスト実装とデザイン改善

## 📋 概要

カタログページとカテゴリページにパンくずリスト（Breadcrumb）を追加し、全体のデザインをより洗練されたものに改善しました。

## ✨ 実装した機能

### 1. パンくずリスト（Breadcrumb）

shadcn/ui の Breadcrumb コンポーネントを使用して、階層構造を視覚的に表示します。

#### カタログページ (`/catalog`)
```
ホーム > カタログ
```

#### カテゴリページ (`/catalog/category/[categoryId]`)
```
ホーム > カタログ > UI基礎
```

**主な機能:**
- クリック可能なリンクで上位階層に戻れる
- 現在のページは非リンク（`BreadcrumbPage`）として表示
- Next.js の `Link` コンポーネントで SPA ライクなナビゲーション
- レスポンシブ対応

### 2. デザイン改善

#### ページヘッダー
- **フォント**: より大きく、読みやすいサイズに変更（`text-3xl sm:text-4xl`）
- **tracking**: `tracking-tight` で文字間を調整
- **余白**: `space-y-2` で適切な間隔
- **レスポンシブ**: 小画面と大画面で最適化

#### PageCard コンポーネント
より洗練されたカードデザインに刷新：

**サムネイル部分:**
- 高さを `h-32` → `h-40` に拡大
- グラデーションを改善（`from-zinc-50 via-zinc-100 to-zinc-200`）
- アイコンサイズを `text-3xl` → `text-5xl` に拡大
- ホバーでアイコンがスケールアップ（`group-hover:scale-110`）
- グラデーションオーバーレイを追加（`bg-gradient-to-t from-black/10`）

**カード本体:**
- 角丸を `rounded-lg` → `rounded-xl` に変更
- シャドウを追加（`shadow-sm hover:shadow-lg`）
- パディングを `p-4` → `p-5` に増加
- ボーダー色を改善（`border-zinc-200 hover:border-zinc-300`）

**タイトルと難易度:**
- タイトルを大きく（`text-lg font-semibold`）
- 難易度バッジを右上に配置
- Flexbox で柔軟なレイアウト

**説明文:**
- `line-clamp-2` で2行に制限
- `leading-relaxed` で読みやすい行間

**タグ:**
- デザインを改善（`ring-1 ring-inset ring-zinc-200`）
- 3つまで表示、それ以上は「+N」で表示
- スペーシングを `gap-1` → `gap-1.5` に調整

**ボタン:**
- フルワイドボタンに変更（`w-full`）
- テキストを「開く」→「ページを開く」に変更
- 矢印アイコンを追加（ホバーでアニメーション）
- サイズを大きく（`px-4 py-2.5`）
- ホバーでシャドウ追加

#### レイアウト
- パディングをレスポンシブに（`p-4 sm:p-6 lg:p-8`）
- `space-y` → `gap-6` で flex-col レイアウトに統一

## 🎨 デザインパターンの参考

Context7 で shadcn/ui の公式ドキュメントを参照：

1. **Breadcrumb コンポーネント**
   - 基本的な使い方
   - Next.js Link との統合（`asChild` パターン）
   - セパレーターのカスタマイズ

2. **Card レイアウト**
   - グリッドレイアウトのベストプラクティス
   - ホバーエフェクト
   - レスポンシブデザイン

3. **アクセシビリティ**
   - `aria-hidden="true"` で装飾的な SVG を隠す
   - セマンティックな HTML 構造
   - キーボードナビゲーション対応

## 📁 変更したファイル

```
src/
├── app/
│   └── catalog/
│       ├── page.tsx                          # ✅ パンくず追加、ヘッダー改善
│       ├── category/
│       │   └── [categoryId]/
│       │       └── page.tsx                  # ✅ パンくず追加、ヘッダー改善
│       └── _components/
│           └── PageCard.tsx                  # ✅ デザイン全面改善
└── components/
    └── ui/
        └── breadcrumb.tsx                    # 🆕 shadcn/ui からインストール
```

## 🚀 使用方法

### 開発サーバーで確認

```bash
pnpm dev
```

ブラウザで以下のページを開く：
- http://localhost:3000/catalog - カタログトップページ
- http://localhost:3000/catalog/category/ui-basics - カテゴリページ例

### ビルド・型チェック

```bash
# 型チェック
pnpm type-check

# リント・フォーマット
pnpm biome check --write src/app/catalog

# プロダクションビルド
pnpm build
```

## 🎯 今後の改善案

- [ ] パンくずリストを共通コンポーネント化
- [ ] ページ遷移アニメーション
- [ ] スケルトンローディング
- [ ] カテゴリアイコンのカスタマイズ
- [ ] カードのサムネイル画像対応
- [ ] お気に入り機能
- [ ] 検索・フィルター機能

## 📚 参考リンク

- [shadcn/ui - Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb)
- [shadcn/ui - Card](https://ui.shadcn.com/docs/components/card)
- [Next.js - Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
- [Tailwind CSS - Flexbox](https://tailwindcss.com/docs/flex)
