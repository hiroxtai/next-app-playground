/**
 * Button コンポーネントのエクスポート
 *
 * @remarks
 * バレルエクスポート（index.ts）を使用することで、
 * インポートパスを簡潔にできます。
 *
 * @example
 * ```tsx
 * // index.ts を使用する場合
 * import { Button } from '@/components/atoms/Button';
 *
 * // index.ts を使用しない場合
 * import { Button } from '@/components/atoms/Button/Button';
 * ```
 */

export type { ButtonProps } from "./Button";
export { Button } from "./Button";
