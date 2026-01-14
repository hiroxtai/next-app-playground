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
 * <div className={`bg-gradient-to-br ${style.gradient}`}>
 *   <Icon className="h-5 w-5" />
 * </div>
 * ```
 */
export const categoryStyles: Record<CategoryId, CategoryStyle> = {
  "ui-basics": {
    icon: Palette,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  layout: {
    icon: Layout,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  animation: {
    icon: Sparkles,
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
  },
  "react-hooks": {
    icon: Atom,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  "next-features": {
    icon: Rocket,
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
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
