/**
 * PageCard コンポーネントの Story
 *
 * @remarks
 * このファイルでは PageCard コンポーネントのさまざまな状態を Story として定義しています。
 *
 * ## デザインシステム
 *
 * PageCard は以下の新デザイン要素を取り入れています：
 * - **3D ホバー効果**: perspective-card クラスによる奥行きのあるホバーアニメーション
 * - **ノイズテクスチャ**: 微細なノイズオーバーレイでテクスチャ感を追加
 * - **Brand カラー**: Teal 系のブランドカラーを使用（タグ、ボーダー、ホバー効果）
 * - **グロー効果**: ホバー時に微細なグロー効果を表示
 *
 * ## Story の書き方（CSF 3 形式）
 *
 * Story は Component Story Format (CSF) という形式で記述します。
 * CSF 3 は最新のフォーマットで、以下の構造を持ちます：
 *
 * 1. `meta`: コンポーネントのメタデータ（タイトル、コンポーネント参照など）
 * 2. 個別の Story: 各バリエーションを `StoryObj` 型のオブジェクトとして export
 *
 * ## autodocs について
 *
 * `tags: ['autodocs']` を指定すると、Props の型情報から
 * 自動的にドキュメントページが生成されます。
 *
 * @see https://storybook.js.org/docs/writing-stories
 */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageCard from "./PageCard";

/**
 * メタデータ定義
 *
 * @remarks
 * - title: Storybook のサイドバーに表示される階層構造
 * - component: Story の対象コンポーネント
 * - parameters.layout: Story のレイアウト（'centered' で中央配置）
 * - tags: 'autodocs' で自動ドキュメント生成を有効化
 */
const meta = {
  title: "Catalog/PageCard",
  component: PageCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  /**
   * argTypes: Props のコントロール設定
   *
   * @remarks
   * Storybook の Controls パネルで Props を操作できるように設定します。
   * control の type により、UI が変わります（text, select, boolean など）。
   */
  argTypes: {
    page: {
      description: "表示するページの情報",
    },
    examplePath: {
      description: "ページへのリンクパス",
      control: "text",
    },
  },
} satisfies Meta<typeof PageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 基本的な Story
// ============================================================================

/**
 * 初級レベルのページカード
 *
 * @remarks
 * 最も基本的な使用例。緑色の難易度バッジが表示されます。
 */
export const Beginner: Story = {
  args: {
    page: {
      id: "button-basics",
      title: "ボタンの基礎",
      description:
        "異なるスタイルのボタンを実装し、Tailwind CSSでの表現方法を学びます。",
      category: "ui-basics",
      difficulty: "初級",
      tags: ["Button", "Tailwind CSS"],
    },
    examplePath: "/examples/ui-basics/button-basics",
  },
};

/**
 * 中級レベルのページカード
 *
 * @remarks
 * 黄色の難易度バッジが表示されます。
 */
export const Intermediate: Story = {
  args: {
    page: {
      id: "flexbox-layout",
      title: "Flexboxレイアウト",
      description: "Flexboxを使用した柔軟なレイアウト設計とレスポンシブ対応。",
      category: "layout",
      difficulty: "中級",
      tags: ["Flexbox", "Responsive", "CSS"],
    },
    examplePath: "/examples/layout/flexbox-layout",
  },
};

/**
 * 上級レベルのページカード
 *
 * @remarks
 * 赤色の難易度バッジが表示されます。
 */
export const Advanced: Story = {
  args: {
    page: {
      id: "server-actions",
      title: "Server Actions",
      description:
        "Next.js の Server Actions を使用したフォーム処理と API 連携。",
      category: "next-features",
      difficulty: "上級",
      tags: ["Server Actions", "Next.js 15", "Forms"],
    },
    examplePath: "/examples/next-features/server-actions",
  },
};

// ============================================================================
// バリエーション
// ============================================================================

/**
 * タグなしのカード
 *
 * @remarks
 * tags が空の場合の表示を確認できます。
 */
export const NoTags: Story = {
  args: {
    page: {
      id: "simple-page",
      title: "シンプルなページ",
      description: "タグがない場合のカード表示例です。",
      category: "ui-basics",
      difficulty: "初級",
    },
    examplePath: "/examples/ui-basics/simple-page",
  },
};

/**
 * 長いタイトルと説明
 *
 * @remarks
 * テキストが長い場合のレイアウト確認用です。
 */
export const LongText: Story = {
  args: {
    page: {
      id: "long-content",
      title:
        "とても長いタイトルを持つページのカードがどのように表示されるか確認",
      description:
        "この説明文はとても長いです。長い説明文がどのように表示されるかを確認するための Story です。カードのレイアウトが崩れないことを確認しましょう。",
      category: "animation",
      difficulty: "中級",
      tags: [
        "Long Tag Name Example",
        "Another Long Tag",
        "Short",
        "Tag",
        "More Tags",
      ],
    },
    examplePath: "/examples/animation/long-content",
  },
};

/**
 * React Hooks カテゴリ
 *
 * @remarks
 * カテゴリごとのアイコン表示確認用です（⚛️ が表示されます）。
 */
export const ReactHooksCategory: Story = {
  args: {
    page: {
      id: "use-state",
      title: "useState の使い方",
      description: "React の useState フックを使った状態管理の基礎。",
      category: "react-hooks",
      difficulty: "初級",
      tags: ["useState", "React", "Hooks"],
    },
    examplePath: "/examples/react-hooks/use-state",
  },
};

// ============================================================================
// グリッド表示
// ============================================================================

/**
 * グリッド表示（複数カード）
 *
 * @remarks
 * 実際のカタログページと同様のグリッドレイアウトで複数のカードを表示します。
 * スタガードアニメーション（各カードが順番に出現）も確認できます。
 */
export const Grid: Story = {
  args: {
    page: {
      id: "button-basics",
      title: "ボタンの基礎",
      description:
        "異なるスタイルのボタンを実装し、Tailwind CSSでの表現方法を学びます。",
      category: "ui-basics",
      difficulty: "初級",
      tags: ["Button", "Tailwind CSS"],
    },
    examplePath: "/examples/ui-basics/button-basics",
    index: 0,
  },
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <PageCard
        page={{
          id: "button-basics",
          title: "ボタンの基礎",
          description:
            "異なるスタイルのボタンを実装し、Tailwind CSSでの表現方法を学びます。",
          category: "ui-basics",
          difficulty: "初級",
          tags: ["Button", "Tailwind CSS"],
        }}
        examplePath="/examples/ui-basics/button-basics"
        index={0}
      />
      <PageCard
        page={{
          id: "flexbox-layout",
          title: "Flexboxレイアウト",
          description:
            "Flexboxを使用した柔軟なレイアウト設計とレスポンシブ対応。",
          category: "layout",
          difficulty: "中級",
          tags: ["Flexbox", "Responsive"],
        }}
        examplePath="/examples/layout/flexbox-layout"
        index={1}
      />
      <PageCard
        page={{
          id: "server-actions",
          title: "Server Actions",
          description:
            "Next.js の Server Actions を使用したフォーム処理と API 連携。",
          category: "next-features",
          difficulty: "上級",
          tags: ["Server Actions", "Next.js"],
        }}
        examplePath="/examples/next-features/server-actions"
        index={2}
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
