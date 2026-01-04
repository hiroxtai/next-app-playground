/**
 * shadcn/ui Breadcrumb コンポーネントの Story
 *
 * @remarks
 * このファイルでは、Breadcrumb コンポーネントのすべてのバリエーションを
 * Storybook で確認できるようにしています。
 *
 * shadcn/ui の Breadcrumb は以下の特徴を持ちます:
 * - セマンティックな HTML 構造（nav, ol, li）
 * - Next.js Link との統合（asChild パターン）
 * - カスタマイズ可能なセパレーター
 * - 省略記号（Ellipsis）によるスペース節約
 * - アクセシビリティ対応（ARIA 属性）
 *
 * @see https://ui.shadcn.com/docs/components/breadcrumb
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home, Slash } from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

/**
 * Breadcrumb コンポーネントのメタデータ
 */
const meta = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "BreadcrumbList を含むナビゲーション構造",
      control: false,
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なパンくずリスト
 *
 * @remarks
 * 最もシンプルなパンくずリストの実装例です。
 * ホーム → Components → Breadcrumb の階層を表示します。
 */
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">コンポーネント</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Next.js Link との統合
 *
 * @remarks
 * asChild プロパティを使用して Next.js の Link コンポーネントを統合します。
 * これにより、SPA ライクなページ遷移が可能になります。
 */
export const WithNextLink: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/catalog">カタログ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>UI基礎</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * カスタムセパレーター（スラッシュ）
 *
 * @remarks
 * デフォルトの ChevronRight の代わりに、Slash アイコンをセパレーターとして使用します。
 * セパレーターは自由にカスタマイズできます。
 */
export const WithSlashSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs">ドキュメント</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>ガイド</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * アイコン付きパンくずリスト
 *
 * @remarks
 * ホームアイコンを最初の項目に追加した例です。
 * アイコンとテキストを組み合わせることで、視覚的に分かりやすくなります。
 */
export const WithIcon: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span>ホーム</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/products">製品</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>カテゴリ</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * 省略記号（Ellipsis）を使用
 *
 * @remarks
 * 長いパンくずリストの場合、中間の項目を省略記号で表現できます。
 * スペースを節約しつつ、重要な情報（最初と最後）を表示します。
 */
export const WithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/components">コンポーネント</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * 深い階層のパンくずリスト
 *
 * @remarks
 * 5階層以上の深いナビゲーション構造の例です。
 * 実際のアプリケーションでは、このような場合に省略記号を使うことが推奨されます。
 */
export const DeepHierarchy: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs">ドキュメント</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs/guides">ガイド</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs/guides/getting-started">はじめに</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>インストール</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * シンプルな2階層
 *
 * @remarks
 * 最小限のパンくずリスト（ホーム → 現在のページ）の例です。
 * ナビゲーション構造がシンプルな場合に使用します。
 */
export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>設定</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * カスタムスタイル
 *
 * @remarks
 * Tailwind CSS のクラスを使用して、パンくずリストの見た目をカスタマイズした例です。
 * 文字サイズ、色、フォントウェイトなどを調整できます。
 */
export const CustomStyle: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList className="text-base">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              ホーム
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-400" />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/products"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              製品
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-400" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-gray-700">
            詳細
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * 実際のアプリケーション例（カタログページ）
 *
 * @remarks
 * このプロジェクトで実際に使用されているパンくずリストの例です。
 * カタログ → カテゴリ → 詳細 の階層を表示します。
 */
export const CatalogExample: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/catalog">カタログ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>UI基礎</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * テキストのみのセパレーター
 *
 * @remarks
 * アイコンの代わりに、テキスト（ / や > など）をセパレーターとして使用する例です。
 * シンプルでクラシックな見た目になります。
 */
export const TextSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span className="text-zinc-400">/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/blog">ブログ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span className="text-zinc-400">/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>記事</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
