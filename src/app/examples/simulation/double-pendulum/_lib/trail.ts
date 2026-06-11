/**
 * 光跡（トレイル）バッファ
 *
 * @remarks
 * 振り子の先端が通った位置を記録し、「光る尾」として描画するための
 * 純関数モジュールです。ポイントは次の 2 つです。
 *
 * 1. **上限付きバッファ**: 点の数に上限を設け、超えたら古い点から
 *    破棄します。これにより長時間動かしてもメモリ使用量と
 *    描画コストが一定に保たれます。
 * 2. **シミュレーション時間基準のフェード**: 各点は「実時間」ではなく
 *    「シミュレーション経過時刻」を持ちます。一時停止中は
 *    シミュレーション時刻が止まるため、光跡も消えずに保持されます。
 */

import { TRAIL } from "./constants";

/**
 * 光跡の 1 点
 */
export interface TrailPoint {
  /** 先端の x 座標（物理座標 [m]） */
  x: number;
  /** 先端の y 座標（物理座標 [m]） */
  y: number;
  /** 記録時のシミュレーション経過時刻 [s] */
  time: number;
}

/**
 * 光跡に点を追加した新しい配列を返します
 *
 * @remarks
 * 上限（`TRAIL.maxPoints`）を超える場合は、最古の点を破棄して
 * 全体の長さを一定に保ちます（リングバッファ的な動作）。
 *
 * @param trail - 現在の光跡（変更されません）
 * @param point - 追加する点
 * @param maxPoints - 保持する点数の上限（省略時は TRAIL.maxPoints）
 * @returns 点が追加された新しい光跡
 */
export function addTrailPoint(
  trail: readonly TrailPoint[],
  point: TrailPoint,
  maxPoints: number = TRAIL.maxPoints,
): TrailPoint[] {
  const next = [...trail, point];
  // 上限を超えた分だけ先頭（最古）から切り捨てる
  return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
}

/**
 * 寿命が切れた点を取り除いた新しい配列を返します
 *
 * @param trail - 現在の光跡（変更されません）
 * @param now - 現在のシミュレーション経過時刻 [s]
 * @param lifetimeSec - 点の寿命 [s]（省略時は TRAIL.lifetimeSec）
 * @returns 生きている点だけの光跡
 */
export function pruneTrail(
  trail: readonly TrailPoint[],
  now: number,
  lifetimeSec: number = TRAIL.lifetimeSec,
): TrailPoint[] {
  return trail.filter((point) => now - point.time < lifetimeSec);
}

/**
 * 点の透明度（0〜1）を経過時間から計算します
 *
 * @remarks
 * 記録直後は 1（不透明）、寿命に達すると 0（完全に透明）まで
 * 線形に減衰します。`now` にシミュレーション経過時刻を渡すことで、
 * 一時停止中（時刻が進まない間）はフェードも止まります。
 *
 * @param point - 対象の点
 * @param now - 現在のシミュレーション経過時刻 [s]
 * @param lifetimeSec - 点の寿命 [s]（省略時は TRAIL.lifetimeSec）
 * @returns 透明度（0 = 透明、1 = 不透明）
 */
export function trailOpacity(
  point: TrailPoint,
  now: number,
  lifetimeSec: number = TRAIL.lifetimeSec,
): number {
  const age = now - point.time;
  return Math.max(0, 1 - age / lifetimeSec);
}
