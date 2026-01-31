# フェードトランジション

このページでは、CSS トランジションを使用したフェードイン/アウト効果とアニメーションの実装方法を学びます。

## 学習できること

- CSS トランジションの基本
- `opacity` を使ったフェード効果
- `transform` を使ったスケール・スライド効果
- ホバーエフェクトの実装
- 状態に応じたアニメーション制御

## "use client" ディレクティブ

このページは **Client Component** です。

```tsx
"use client";
```

`useState` を使用してアニメーションの状態を制御するため、Client Component として実装しています。

## 主要なクラス一覧

### トランジションプロパティ

| クラス | 説明 |
|--------|------|
| `transition-opacity` | opacity のみにトランジション |
| `transition-transform` | transform のみにトランジション |
| `transition-colors` | 色関連のプロパティにトランジション |
| `transition-all` | すべてのプロパティにトランジション |

### トランジション時間

| クラス | 説明 |
|--------|------|
| `duration-150` | 150ms |
| `duration-300` | 300ms（おすすめ） |
| `duration-500` | 500ms |
| `duration-700` | 700ms |

### イージング

| クラス | 説明 |
|--------|------|
| `ease-linear` | 一定速度 |
| `ease-in` | 加速 |
| `ease-out` | 減速 |
| `ease-in-out` | 加速→減速 |

## 使用例

### フェードイン/アウト

```tsx
const [isVisible, setIsVisible] = useState(true);

<div
  className={`transition-opacity duration-500 ${
    isVisible ? "opacity-100" : "opacity-0"
  }`}
>
  フェードするコンテンツ
</div>
```

### ホバーエフェクト

```tsx
<div className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
  ホバーすると拡大 + 影
</div>
```

### スケールトランジション

```tsx
const [isScaled, setIsScaled] = useState(false);

<div
  className={`transition-transform duration-300 ${
    isScaled ? "scale-110" : "scale-100"
  }`}
>
  クリックで拡大/縮小
</div>
```

### スライドトランジション

```tsx
const [isSlided, setIsSlided] = useState(false);

<div
  className={`transition-transform duration-500 ease-out ${
    isSlided ? "translate-x-12" : "translate-x-0"
  }`}
>
  スライドするコンテンツ
</div>
```

### 複合トランジション

```tsx
<div className="transition-all duration-300 hover:scale-105 hover:bg-brand-700 hover:shadow-xl">
  複数のプロパティが同時に変化
</div>
```

## ポイント

1. **transition-all は便利だが重い**: 必要なプロパティのみ指定する方がパフォーマンスが良い
2. **duration-300 が標準**: 速すぎず遅すぎない適切な速度
3. **ease-out が自然**: ユーザーアクションへの応答には減速が自然に感じられる
4. **transform を優先**: `opacity` と `transform` は GPU アクセラレーションが効くため滑らか

## アニメーション vs トランジション

| 特徴 | トランジション | アニメーション |
|------|---------------|---------------|
| トリガー | 状態変化（hover, クラス変更） | 自動実行可能 |
| 制御 | 開始→終了の2状態 | キーフレームで複数状態 |
| ループ | 不可 | 可能 |
| 用途 | インタラクション | ローディング、注目効果 |

## 参考リンク

- [Tailwind CSS Transition](https://tailwindcss.com/docs/transition-property)
- [Tailwind CSS Transform](https://tailwindcss.com/docs/transform)
- [MDN CSS Transitions](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
