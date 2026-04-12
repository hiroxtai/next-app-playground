import type { CSSProperties } from "react";

/**
 * アニメーション遅延に使う CSS 変数スタイルです。
 *
 * @remarks
 * `--animation-delay` の値を `${number}ms` に限定し、
 * 各ページで `as React.CSSProperties` を繰り返さないために使います。
 */
export type AnimationDelayStyle = CSSProperties & {
  "--animation-delay": `${number}ms`;
};

/**
 * アニメーション遅延用の style オブジェクトを生成します。
 *
 * @param delayMs - 遅延時間（ミリ秒）
 * @returns `--animation-delay` を含む style オブジェクト
 */
export function createAnimationDelayStyle(delayMs: number): AnimationDelayStyle;
export function createAnimationDelayStyle(
  delayMs?: number,
): AnimationDelayStyle | undefined;
export function createAnimationDelayStyle(
  delayMs?: number,
): AnimationDelayStyle | undefined {
  if (delayMs === undefined) {
    return undefined;
  }

  return {
    "--animation-delay": `${delayMs}ms`,
  };
}
