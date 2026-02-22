/**
 * カタログに表示するカテゴリとページ情報を定義するファイルです。
 * 学習用サンプルページの構造を管理し、カタログ機能から参照されます。
 */

/**
 * カテゴリ情報
 */
export const categories = [
  {
    id: "ui-basics",
    label: "UI基礎",
    description: "ボタンやフォーム、テキスト入力など基本的なUI要素",
  },
  {
    id: "layout",
    label: "レイアウト",
    description: "FlexboxやGrid、レスポンシブデザインなどレイアウト技法",
  },
  {
    id: "animation",
    label: "アニメーション",
    description: "CSSアニメーションやトランジション、モーション",
  },
  {
    id: "react-hooks",
    label: "React Hooks",
    description: "useStateやuseEffectなど主要なフック",
  },
  {
    id: "next-features",
    label: "Next.js機能",
    description: "App Router、Server Components、その他Next.js固有機能",
  },
  {
    id: "state-management",
    label: "状態管理",
    description: "Jotaiなどの状態管理ライブラリの使い方",
  },
  {
    id: "ai",
    label: "AI",
    description: "Vercel AI SDKを使用したAIアプリケーション開発",
  },
] as const;

/**
 * カテゴリIDの型定義
 */
export type CategoryId = (typeof categories)[number]["id"];

/**
 * ページ情報の型定義
 */
export interface PageInfo {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  difficulty: "初級" | "中級" | "上級";
  tags?: string[];
}

/**
 * サンプルページ一覧
 * 学習に合わせて随時追加してください。
 */
export const pages: PageInfo[] = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "最も基本的なサンプルページ。Hello Worldを表示します。",
    category: "ui-basics",
    difficulty: "初級",
    tags: ["React", "基礎"],
  },
  {
    id: "button-basics",
    title: "ボタンの基礎",
    description:
      "異なるスタイルのボタンを実装し、Tailwind CSSでの表現方法を学びます。",
    category: "ui-basics",
    difficulty: "初級",
    tags: ["Button", "Tailwind CSS"],
  },
  {
    id: "form-input",
    title: "フォーム入力",
    description:
      "テキスト入力、チェックボックス、セレクトボックスなどフォーム要素の実装。",
    category: "ui-basics",
    difficulty: "初級",
    tags: ["Form", "Input", "Tailwind CSS"],
  },
  {
    id: "flexbox-layout",
    title: "Flexboxレイアウト",
    description: "Flexboxを使用した柔軟なレイアウト設計とレスポンシブ対応。",
    category: "layout",
    difficulty: "初級",
    tags: ["Flexbox", "Tailwind CSS", "レスポンシブ"],
  },
  {
    id: "grid-layout",
    title: "Gridレイアウト",
    description: "CSS Gridを使用した高度なレイアウト実装。",
    category: "layout",
    difficulty: "中級",
    tags: ["Grid", "Tailwind CSS"],
  },
  {
    id: "fade-transition",
    title: "フェードトランジション",
    description: "CSSトランジションを使用したフェードイン/アウト効果。",
    category: "animation",
    difficulty: "初級",
    tags: ["CSS Transition", "Tailwind CSS"],
  },
  {
    id: "use-state-counter",
    title: "useState カウンター",
    description: "useStateフックを使用したシンプルなカウンター実装。",
    category: "react-hooks",
    difficulty: "初級",
    tags: ["useState", "React"],
  },
  {
    id: "use-effect-lifecycle",
    title: "useEffect ライフサイクル",
    description:
      "useEffectフックを使用したコンポーネントのライフサイクル管理。",
    category: "react-hooks",
    difficulty: "中級",
    tags: ["useEffect", "React"],
  },
  {
    id: "server-components",
    title: "Server Components",
    description: "Next.js App RouterのServer Componentsの使用方法と利点。",
    category: "next-features",
    difficulty: "中級",
    tags: ["Server Components", "Next.js"],
  },
  {
    id: "custom-hooks",
    title: "カスタムフック",
    description:
      "useLocalStorageやuseDebounceなど、再利用可能なカスタムフックの作成方法。",
    category: "react-hooks",
    difficulty: "中級",
    tags: ["Custom Hooks", "React", "再利用"],
  },
  {
    id: "server-actions",
    title: "Server Actions",
    description:
      "フォーム送信とサーバー処理を統合するServer Actionsの実装パターン。",
    category: "next-features",
    difficulty: "中級",
    tags: ["Server Actions", "Form", "Next.js"],
  },
  {
    id: "suspense-loading",
    title: "Suspense とローディング",
    description:
      "React Suspenseを使用した非同期コンポーネントのローディング状態管理。",
    category: "next-features",
    difficulty: "上級",
    tags: ["Suspense", "Loading", "Streaming"],
  },
  {
    id: "compound-components",
    title: "Compound Components",
    description:
      "複合コンポーネントパターンによる柔軟で再利用可能なUIコンポーネント設計。",
    category: "react-hooks",
    difficulty: "上級",
    tags: ["Design Patterns", "Context", "コンポーネント設計"],
  },
  {
    id: "jotai-basics",
    title: "Jotai 基礎",
    description: "Jotaiのatom・useAtomフックを使ったシンプルな状態管理の基礎。",
    category: "state-management",
    difficulty: "初級",
    tags: ["Jotai", "状態管理", "Atom"],
  },
  {
    id: "jotai-derived",
    title: "Jotai 派生Atom",
    description:
      "読み取り専用・書き込み専用・読み書き可能な派生Atomの作成方法。",
    category: "state-management",
    difficulty: "中級",
    tags: ["Jotai", "Derived Atom", "状態管理"],
  },
  {
    id: "jotai-todo-app",
    title: "Jotai Todoアプリ",
    description:
      "Jotaiを使った本格的なTodoアプリで学ぶ、実践的な状態管理パターン。",
    category: "state-management",
    difficulty: "上級",
    tags: ["Jotai", "CRUD", "atomFamily", "実践"],
  },
  {
    id: "chatbot",
    title: "AI チャットボット",
    description:
      "Vercel AI SDKのuseChat フックとstreamTextを使用したSSEストリーミング対応チャットボット。",
    category: "ai",
    difficulty: "中級",
    tags: ["AI SDK", "useChat", "SSE", "OpenAI"],
  },
];

/**
 * カテゴリからページを取得
 * @param categoryId - カテゴリID
 * @returns マッチするページ配列
 */
export function getPagesByCategory(categoryId: CategoryId): PageInfo[] {
  return pages.filter((page) => page.category === categoryId);
}

/**
 * IDからページ情報を取得
 * @param pageId - ページID
 * @returns ページ情報、存在しない場合はundefined
 */
export function getPageById(pageId: string): PageInfo | undefined {
  return pages.find((page) => page.id === pageId);
}
