"use client";

import { ArrowRight, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Accordion, AccordionItem } from "./_components/Accordion";

/**
 * Compound Components サンプルページ
 *
 * @remarks
 * Compound Components パターンによる柔軟で再利用可能なUIコンポーネント設計を学びます。
 */
export default function CompoundComponentsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/40 via-transparent to-brand-200/30 dark:from-brand-900/20 dark:to-brand-800/10" />

      {/* ノイズテクスチャオーバーレイ */}
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]" />

      {/* メインコンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header
          className="animate-fade-in-scale mb-16 text-center"
          style={{ "--animation-delay": "0ms" } as React.CSSProperties}
        >
          <Badge variant="secondary" className="mb-6">
            React Hooks - 上級
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Compound
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              Components
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            柔軟で再利用可能なUIコンポーネント設計パターン
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* パターンの説明 */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="size-5 text-brand-500" />
                Compound Components とは
              </CardTitle>
              <CardDescription>
                親子関係を持つコンポーネントが暗黙的に状態を共有するパターン
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">従来のアプローチ ❌</p>
                  <div className="rounded-lg bg-muted p-4">
                    <code className="whitespace-pre-wrap text-xs">
                      {`<Accordion
  items={[
    { title: "...", content: "..." },
    { title: "...", content: "..." },
  ]}
/>`}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    props で全てのデータを渡す必要がある
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Compound Components ✅</p>
                  <div className="rounded-lg bg-muted p-4">
                    <code className="whitespace-pre-wrap text-xs">
                      {`<Accordion>
  <AccordionItem title="...">
    コンテンツ
  </AccordionItem>
  <AccordionItem title="...">
    コンテンツ
  </AccordionItem>
</Accordion>`}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    子コンポーネントで柔軟に構成
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 実践例：Accordion */}
          <Card
            className="animate-fade-in-up sm:col-span-2"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>実践例：アコーディオン</CardTitle>
              <CardDescription>Context API を使用した状態共有</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion>
                <AccordionItem title="Compound Components の利点">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      柔軟な構成：子コンポーネントの順序や内容を自由に変更可能
                    </li>
                    <li className="flex gap-2">
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      関心の分離：親は状態管理、子は表示に集中
                    </li>
                    <li className="flex gap-2">
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      暗黙的な状態共有：props drilling を回避
                    </li>
                  </ul>
                </AccordionItem>
                <AccordionItem title="実装のポイント">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      React.createContext で状態を共有
                    </li>
                    <li className="flex gap-2">
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      useContext で子コンポーネントから状態にアクセス
                    </li>
                    <li className="flex gap-2">
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-500" />
                      カスタムフックでコンテキストの使用を簡略化
                    </li>
                  </ul>
                </AccordionItem>
                <AccordionItem title="使用例">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">代表的なライブラリでの採用例：</p>
                    <ul className="space-y-1">
                      <li>• Radix UI（shadcn/ui の基盤）</li>
                      <li>• Headless UI</li>
                      <li>• React Aria</li>
                      <li>• Chakra UI</li>
                    </ul>
                  </div>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* 実装コード */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Context の作成</CardTitle>
              <CardDescription>親コンポーネントで状態を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-xs">
                  {`// Context の作成
const AccordionContext = createContext<{
  activeIndex: number | null;
  setActiveIndex: (i: number) => void;
} | null>(null);

// 親コンポーネント
function Accordion({ children }) {
  const [activeIndex, setActiveIndex]
    = useState<number | null>(null);

  return (
    <AccordionContext.Provider
      value={{ activeIndex, setActiveIndex }}
    >
      {children}
    </AccordionContext.Provider>
  );
}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* 子コンポーネントの実装 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>子コンポーネント</CardTitle>
              <CardDescription>useContext で状態にアクセス</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <code className="whitespace-pre-wrap text-xs">
                  {`// カスタムフック
function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "AccordionItem must be used within Accordion"
    );
  }
  return context;
}

// 子コンポーネント
function AccordionItem({ title, children, index }) {
  const { activeIndex, setActiveIndex }
    = useAccordion();
  const isOpen = activeIndex === index;

  return (
    <div onClick={() => setActiveIndex(index)}>
      {title}
      {isOpen && children}
    </div>
  );
}`}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 sm:col-span-2 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                他の中級・上級サンプルもぜひご覧ください。
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                カタログを見る
                <ChevronRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
