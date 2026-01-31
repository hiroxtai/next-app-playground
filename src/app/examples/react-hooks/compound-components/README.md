# Compound Components

このページでは、Compound Components（複合コンポーネント）パターンを使用した柔軟で再利用可能な UI コンポーネント設計を学びます。

## 学習できること

- Compound Components パターンの概念
- React Context を使った状態共有
- 暗黙的な API と明示的な API の比較
- Accordion コンポーネントの実装
- Tabs コンポーネントの実装

## Compound Components とは

Compound Components は、複数のコンポーネントが連携して1つの機能を提供するパターンです。HTML の `<select>` と `<option>` の関係に似ています。

```tsx
{/* HTML の例 */}
<select>
  <option value="1">選択肢1</option>
  <option value="2">選択肢2</option>
</select>

{/* Compound Components の例 */}
<Accordion>
  <AccordionItem title="セクション1">
    コンテンツ1
  </AccordionItem>
  <AccordionItem title="セクション2">
    コンテンツ2
  </AccordionItem>
</Accordion>
```

## "use client" ディレクティブ

このページは **Client Component** です。

```tsx
"use client";
```

`useState` と `useContext` を使用して状態を管理するため、Client Component として実装しています。

## 実装例

### Context の定義

```tsx
interface AccordionContextValue {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }
  return context;
}
```

### 親コンポーネント（Accordion）

```tsx
interface AccordionProps {
  children: ReactNode;
  defaultIndex?: number | null;
}

export function Accordion({ children, defaultIndex = null }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);

  const toggleIndex = (index: number | null) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <AccordionContext.Provider
      value={{ activeIndex, setActiveIndex: toggleIndex }}
    >
      <div className="divide-y divide-border rounded-lg border">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
```

### 子コンポーネント（AccordionItem）

```tsx
interface AccordionItemProps {
  title: string;
  children: ReactNode;
  index?: number;
}

export function AccordionItem({ title, children, index = 0 }: AccordionItemProps) {
  const { activeIndex, setActiveIndex } = useAccordion();
  const isOpen = activeIndex === index;

  return (
    <div>
      <button
        type="button"
        onClick={() => setActiveIndex(index)}
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className={isOpen ? "rotate-180" : ""} />
      </button>
      <div className={isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}>
        {children}
      </div>
    </div>
  );
}
```

## 使用例

### Accordion

```tsx
<Accordion defaultIndex={0}>
  <AccordionItem title="セクション1" index={0}>
    コンテンツ1
  </AccordionItem>
  <AccordionItem title="セクション2" index={1}>
    コンテンツ2
  </AccordionItem>
  <AccordionItem title="セクション3" index={2}>
    コンテンツ3
  </AccordionItem>
</Accordion>
```

### Tabs

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">タブ1</TabsTrigger>
    <TabsTrigger value="tab2">タブ2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">タブ1の内容</TabsContent>
  <TabsContent value="tab2">タブ2の内容</TabsContent>
</Tabs>
```

## Props API vs Compound Components

| 特徴 | Props API | Compound Components |
|------|-----------|---------------------|
| 柔軟性 | 低い | 高い |
| 学習コスト | 低い | やや高い |
| カスタマイズ | 限定的 | 自由度高い |
| 使用例 | `<Accordion items={[...]} />` | `<Accordion><AccordionItem>...</AccordionItem></Accordion>` |

## パターンのメリット

1. **柔軟な構成**: 子コンポーネントの順序や組み合わせを自由に変更可能
2. **関心の分離**: 各コンポーネントが特定の責務に集中
3. **暗黙的な状態共有**: Context により props drilling を回避
4. **再利用性**: コンポーネントを別のコンテキストで再利用可能

## エラーハンドリング

Context が存在しない場合のエラーを適切に処理：

```tsx
function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "AccordionItem must be used within an Accordion"
    );
  }
  return context;
}
```

## ポイント

1. **Context の分離**: 関連するコンポーネントごとに Context を作成
2. **TypeScript 活用**: 型定義でコンポーネント間の契約を明確化
3. **アクセシビリティ**: `aria-expanded` などの ARIA 属性を適切に設定
4. **デフォルト値**: `defaultIndex` のような初期値オプションを提供

## 参考リンク

- [Kent C. Dodds - Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Radix UI](https://www.radix-ui.com/) - Compound Components を採用したライブラリ
- [Headless UI](https://headlessui.com/) - 同様のパターンを採用
