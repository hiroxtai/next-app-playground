# ボタンの基礎

このページでは、shadcn/ui の `Button` コンポーネントを使用した様々なスタイルとサイズのボタンを学びます。

## 学習できること

- shadcn/ui Button コンポーネントの使い方
- バリアント（variant）によるスタイルの切り替え
- サイズ（size）による大きさの調整
- アイコンとテキストの組み合わせ
- disabled 状態の表現

## 使用しているコンポーネント

```tsx
import { Button } from "@/components/ui/button";
```

## バリアント一覧

| バリアント | 用途 |
|-----------|------|
| `default` | 主要なアクション（デフォルト） |
| `secondary` | 補助的なアクション |
| `outline` | 枠線のみのボタン |
| `ghost` | 背景なしのボタン |
| `link` | テキストリンク風 |
| `destructive` | 削除など危険な操作 |
| `brand` | ブランドカラーのボタン |
| `brand-outline` | ブランドカラーの枠線ボタン |
| `brand-ghost` | ブランドカラーのゴーストボタン |

## 使用例

```tsx
// 基本的な使い方
<Button>クリック</Button>

// バリアントを指定
<Button variant="destructive">削除</Button>

// サイズを指定
<Button size="lg">大きいボタン</Button>

// アイコン付き
<Button>
  <Mail />
  メールを送信
</Button>

// ローディング状態
<Button disabled>
  <Loader2 className="animate-spin" />
  処理中...
</Button>
```

## サイズ一覧

| サイズ | 説明 |
|--------|------|
| `sm` | 小さいボタン |
| `default` | 標準サイズ |
| `lg` | 大きいボタン |
| `icon` | アイコンのみ（正方形） |
| `icon-sm` | 小さいアイコンボタン |
| `icon-lg` | 大きいアイコンボタン |

## ポイント

1. **アクセシビリティ**: Button コンポーネントは適切な `role` と `tabIndex` を持っています
2. **disabled 状態**: `disabled` 属性を付けると自動的にスタイルが変わります
3. **アイコンの配置**: 子要素としてアイコンを入れるだけで自動的にスペースが調整されます

## 参考リンク

- [shadcn/ui Button](https://ui.shadcn.com/docs/components/button)
- [Radix UI](https://www.radix-ui.com/)
