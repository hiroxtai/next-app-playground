import type { ReactNode } from "react";

/**
 * サンプルページ共通シェルの基本プロパティです。
 */
export type ExamplePageShellProps = {
  children: ReactNode;
};

/**
 * ヒーロー領域の表示情報です。
 */
export type ExamplePageHeroProps = {
  badge: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

/**
 * コンテンツグリッドの段組み設定です。
 */
export type ExamplePageContentColumns = "single" | "two";

/**
 * コンテンツグリッドの表示情報です。
 */
export type ExamplePageContentProps = {
  children: ReactNode;
  columns?: ExamplePageContentColumns;
  className?: string;
};

/**
 * セクションラッパーの表示情報です。
 */
export type ExamplePageSectionProps = {
  children: ReactNode;
  className?: string;
  animationDelayMs?: number;
};

/**
 * Next Steps の導線情報です。
 */
export type ExamplePageNextStepsAction = {
  href: string;
  label: string;
};

/**
 * Next Steps 領域の表示情報です。
 */
export type ExamplePageNextStepsProps = {
  description: ReactNode;
  action?: ExamplePageNextStepsAction;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  className?: string;
  animationDelayMs?: number;
};
