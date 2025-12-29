/**
 * Button コンポーネント
 *
 * @remarks
 * Atomic Design における「Atom（原子）」レベルのコンポーネントです。
 *
 * ## Atomic Design とは？
 *
 * UI を以下の 5 つの階層に分けて設計するアプローチです：
 *
 * 1. **Atoms（原子）**: ボタン、入力フィールド、ラベルなど最小単位の要素
 * 2. **Molecules（分子）**: Atom を組み合わせた検索フォームなど
 * 3. **Organisms（生体）**: ヘッダー、サイドバーなど独立したセクション
 * 4. **Templates**: ページのレイアウト構造
 * 5. **Pages**: 実際のコンテンツが入ったページ
 *
 * ## このコンポーネントの特徴
 *
 * - variant: ボタンのスタイル（primary / secondary / ghost）
 * - size: ボタンのサイズ（sm / md / lg）
 * - Tailwind CSS を使用したスタイリング
 * - アクセシビリティを考慮した設計（disabled 状態など）
 *
 * @see https://atomicdesign.bradfrost.com/
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Button の Props 型定義
 */
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  /**
   * ボタンのスタイルバリアント
   *
   * @remarks
   * - primary: メインアクション用（目立つ色）
   * - secondary: サブアクション用（控えめな色）
   * - ghost: テキストリンク風（背景なし）
   *
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "ghost";

  /**
   * ボタンのサイズ
   *
   * @remarks
   * - sm: 小さいボタン（コンパクトな UI 向け）
   * - md: 標準サイズ
   * - lg: 大きいボタン（CTA などで使用）
   *
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * ボタンの中身
   */
  children: ReactNode;
}

/**
 * Button コンポーネント
 *
 * @param props - ボタンの Props
 * @returns ボタン要素
 *
 * @example
 * ```tsx
 * // Primary ボタン（デフォルト）
 * <Button>クリック</Button>
 *
 * // Secondary ボタン（大サイズ）
 * <Button variant="secondary" size="lg">キャンセル</Button>
 *
 * // Ghost ボタン（disabled）
 * <Button variant="ghost" disabled>無効</Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  /**
   * バリアント別のスタイル
   *
   * @remarks
   * Record<T, string> を使用することで、
   * すべてのバリアントに対してスタイルが定義されていることを型で保証しています。
   */
  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
    ghost:
      "bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800",
  };

  /**
   * サイズ別のスタイル
   */
  const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
