# Flexbox レイアウト

このページでは、Tailwind CSS の Flexbox ユーティリティクラスを使用した柔軟なレイアウト設計を学びます。

## 学習できること

- Flexbox の基本概念
- `flex-direction` による配置方向の制御
- `justify-content` による主軸方向の配置
- `align-items` による交差軸方向の配置
- `flex-wrap` による折り返し
- レスポンシブデザインへの応用

## Flexbox の基本

Flexbox は、コンテナ内の要素を柔軟に配置するための CSS レイアウトモデルです。

```tsx
<div className="flex">
  <div>アイテム1</div>
  <div>アイテム2</div>
  <div>アイテム3</div>
</div>
```

## 主要なクラス一覧

### 方向（flex-direction）

| クラス | 説明 |
|--------|------|
| `flex-row` | 横並び（デフォルト） |
| `flex-col` | 縦並び |
| `flex-row-reverse` | 横並び（逆順） |
| `flex-col-reverse` | 縦並び（逆順） |

### 主軸方向の配置（justify-content）

| クラス | 説明 |
|--------|------|
| `justify-start` | 先頭に寄せる |
| `justify-center` | 中央に配置 |
| `justify-end` | 末尾に寄せる |
| `justify-between` | 両端に寄せて均等配置 |
| `justify-around` | 均等配置（両端に半分の余白） |
| `justify-evenly` | 均等配置（すべて同じ余白） |

### 交差軸方向の配置（align-items）

| クラス | 説明 |
|--------|------|
| `items-start` | 上端に揃える |
| `items-center` | 中央に揃える |
| `items-end` | 下端に揃える |
| `items-stretch` | 高さを揃える（デフォルト） |

### 折り返し（flex-wrap）

| クラス | 説明 |
|--------|------|
| `flex-nowrap` | 折り返さない（デフォルト） |
| `flex-wrap` | 折り返す |
| `flex-wrap-reverse` | 逆方向に折り返す |

## 使用例

### 中央配置

```tsx
<div className="flex items-center justify-center h-screen">
  <div>中央に配置されたコンテンツ</div>
</div>
```

### 均等配置のナビゲーション

```tsx
<nav className="flex justify-between">
  <div>ロゴ</div>
  <div>メニュー</div>
</nav>
```

### レスポンシブ対応

```tsx
{/* モバイルは縦並び、タブレット以上は横並び */}
<div className="flex flex-col sm:flex-row gap-4">
  <div>アイテム1</div>
  <div>アイテム2</div>
  <div>アイテム3</div>
</div>
```

## ポイント

1. **gap プロパティ**: `gap-*` でアイテム間の余白を簡単に設定
2. **flex-1**: 子要素に `flex-1` を付けると残りのスペースを均等に分配
3. **レスポンシブ**: `sm:`, `md:`, `lg:` プレフィックスでブレークポイント対応

## 参考リンク

- [Tailwind CSS Flexbox](https://tailwindcss.com/docs/flex)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [MDN Flexbox](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Flexbox)
