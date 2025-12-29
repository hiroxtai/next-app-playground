/**
 * Atoms（原子）コンポーネントのエクスポート
 *
 * @remarks
 * Atomic Design における最小単位のコンポーネント群です。
 *
 * ## Atoms の特徴
 *
 * - 単独で意味を持つ最小の UI 要素
 * - 他のコンポーネントに依存しない
 * - ボタン、入力フィールド、ラベル、アイコンなど
 *
 * @example
 * ```tsx
 * import { Button } from '@/components/atoms';
 *
 * <Button variant="primary">送信</Button>
 * ```
 */

export type { ButtonProps } from "./Button";
export { Button } from "./Button";
