# Grid レイアウト

このページでは、Tailwind CSS の CSS Grid ユーティリティクラスを使用した高度なレイアウト実装を学びます。

## 学習できること

- CSS Grid の基本概念
- グリッドカラム数の指定
- `col-span` / `row-span` によるセル結合
- `gap` によるグリッド間隔の調整
- レスポンシブグリッドの実装

## CSS Grid の基本

CSS Grid は、2次元のグリッドレイアウトを作成するための CSS レイアウトモデルです。

```tsx
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
```

## 主要なクラス一覧

### カラム数（grid-cols）

| クラス | 説明 |
|--------|------|
| `grid-cols-1` | 1列 |
| `grid-cols-2` | 2列 |
| `grid-cols-3` | 3列 |
| `grid-cols-4` | 4列 |
| `grid-cols-12` | 12列（Bootstrap風） |

### セル結合（col-span / row-span）

| クラス | 説明 |
|--------|------|
| `col-span-2` | 2カラム分の幅を占める |
| `col-span-3` | 3カラム分の幅を占める |
| `col-span-full` | 全カラムを占める |
| `row-span-2` | 2行分の高さを占める |

### グリッド間隔（gap）

| クラス | 説明 |
|--------|------|
| `gap-1` | 0.25rem (4px) |
| `gap-2` | 0.5rem (8px) |
| `gap-4` | 1rem (16px) |
| `gap-8` | 2rem (32px) |
| `gap-x-4` | 横方向のみ 1rem |
| `gap-y-4` | 縦方向のみ 1rem |

## 使用例

### 基本的なグリッド

```tsx
<div className="grid grid-cols-3 gap-4">
  <div>カード1</div>
  <div>カード2</div>
  <div>カード3</div>
</div>
```

### セル結合

```tsx
<div className="grid grid-cols-4 gap-4">
  <div className="col-span-2">2カラム幅</div>
  <div>1カラム</div>
  <div>1カラム</div>
  <div className="col-span-3">3カラム幅</div>
  <div>1カラム</div>
</div>
```

### レスポンシブグリッド

```tsx
{/* モバイル: 1列、タブレット: 2列、デスクトップ: 3列 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>カード1</div>
  <div>カード2</div>
  <div>カード3</div>
  <div>カード4</div>
  <div>カード5</div>
  <div>カード6</div>
</div>
```

### 自動フィットグリッド

```tsx
{/* コンテンツに応じて自動的にカラム数を調整 */}
<div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
  <div>カード</div>
  <div>カード</div>
  <div>カード</div>
</div>
```

## Flexbox vs Grid

| 特徴 | Flexbox | Grid |
|------|---------|------|
| 次元 | 1次元（行または列） | 2次元（行と列） |
| 用途 | ナビゲーション、カード配置 | 複雑なページレイアウト |
| アイテム配置 | コンテンツベース | グリッドベース |

## ポイント

1. **レスポンシブ**: ブレークポイントでカラム数を変更するのが一般的
2. **auto-fill vs auto-fit**: コンテナサイズに応じた自動カラム調整
3. **組み合わせ**: Grid と Flexbox は組み合わせて使用可能

## 参考リンク

- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN CSS Grid](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Grid_Layout)
