/**
 * カテゴリごとのスタイル定義
 *
 * @remarks
 * アイコン、グラデーション、背景色などを一元管理します。
 * AppSidebar、PageCard、カテゴリページなど複数箇所で使用されます。
 */

import {
  Atom,
  Layout,
  type LucideIcon,
  Palette,
  Rocket,
  Sparkles,
} from "lucide-react";
import type { CategoryId } from "./catalog-data";

/**
 * カテゴリスタイルの型定義
 */
export interface CategoryStyle {
  /** カテゴリを表すアイコンコンポーネント */
  icon: LucideIcon;
  /** グラデーションクラス（Tailwind CSS） */
  gradient: string;
  /** アイコン背景のグラデーションクラス */
  iconBg: string;
}

/**
 * カテゴリごとのスタイル定義
 *
 * @example
 * ```tsx
 * const style = categoryStyles["ui-basics"];
 * const Icon = style.icon;
 * <div className={style.gradient}>
 *   <Icon className="h-5 w-5" />
 * </div>
 * ```
 */
export const categoryStyles: Record<CategoryId, CategoryStyle> = {
  "ui-basics": {
    icon: Palette,
    gradient: "bg-rose-500",
    iconBg: "bg-rose-600",
  },
  layout: {
    icon: Layout,
    gradient: "bg-sky-500",
    iconBg: "bg-sky-600",
  },
  animation: {
    icon: Sparkles,
    gradient: "bg-amber-500",
    iconBg: "bg-amber-600",
  },
  "react-hooks": {
    icon: Atom,
    gradient: "bg-violet-500",
    iconBg: "bg-violet-600",
  },
  "next-features": {
    icon: Rocket,
    gradient: "bg-emerald-500",
    iconBg: "bg-emerald-600",
  },
};

/**
 * カテゴリIDからスタイルを取得するヘルパー関数
 *
 * @param categoryId - カテゴリID
 * @returns カテゴリスタイル、存在しない場合はデフォルトスタイル
 */
export function getCategoryStyle(categoryId: CategoryId): CategoryStyle {
  return categoryStyles[categoryId];
}
