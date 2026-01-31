# フォーム入力

このページでは、shadcn/ui のフォーム関連コンポーネントを使用した入力フォームの実装方法を学びます。

## 学習できること

- 各種入力コンポーネントの使い方
- `useState` を使った入力値の状態管理
- ラベルとフォーム要素の紐付け
- 制御コンポーネント（Controlled Components）パターン

## 使用しているコンポーネント

```tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
```

## "use client" ディレクティブ

このページは **Client Component** です。

```tsx
"use client";
```

フォーム入力では `useState` を使用するため、ファイルの先頭に `"use client"` を記述する必要があります。

## 入力コンポーネント一覧

| コンポーネント | 用途 |
|---------------|------|
| `Input` | テキスト入力（text, email, password, number など） |
| `Textarea` | 複数行テキスト入力 |
| `Checkbox` | チェックボックス（boolean 値） |
| `Switch` | トグルスイッチ（ON/OFF） |
| `Select` | ドロップダウン選択 |

## 使用例

### テキスト入力

```tsx
const [value, setValue] = useState("");

<Input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="入力してください"
/>
```

### チェックボックス

```tsx
const [isChecked, setIsChecked] = useState(false);

<Checkbox
  id="terms"
  checked={isChecked}
  onCheckedChange={(checked) => setIsChecked(checked === true)}
/>
<Label htmlFor="terms">利用規約に同意する</Label>
```

### セレクトボックス

```tsx
const [selected, setSelected] = useState("");

<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="選択してください" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">オプション1</SelectItem>
    <SelectItem value="option2">オプション2</SelectItem>
  </SelectContent>
</Select>
```

## ポイント

1. **Label との紐付け**: `htmlFor` と `id` を一致させてアクセシビリティを向上
2. **制御コンポーネント**: `value` と `onChange` で React が入力値を管理
3. **型の指定**: `Input` の `type` 属性で適切な入力タイプを指定

## 参考リンク

- [shadcn/ui Input](https://ui.shadcn.com/docs/components/input)
- [shadcn/ui Checkbox](https://ui.shadcn.com/docs/components/checkbox)
- [shadcn/ui Select](https://ui.shadcn.com/docs/components/select)
- [React Forms](https://react.dev/reference/react-dom/components/input)
