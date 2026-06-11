/**
 * 二重振り子シミュレーションの定数定義
 *
 * @remarks
 * ユーザーが調整できるパラメータの既定値・許容範囲と、
 * 固定の物理定数・光跡の設定をここで一元管理します。
 */

import type { SimulationParams } from "./double-pendulum";

/**
 * パラメータごとの許容範囲とスライダーの刻み幅
 *
 * @remarks
 * 長さの単位はメートル、角度の単位は度（真下が 0°、時計回りが正）です。
 * スライダーの min / max / step にそのまま渡せる形にしています。
 */
export const PARAM_RANGES: Record<
  keyof SimulationParams,
  { min: number; max: number; step: number }
> = {
  length1: { min: 0.5, max: 2.0, step: 0.1 },
  length2: { min: 0.5, max: 2.0, step: 0.1 },
  angle1: { min: -180, max: 180, step: 1 },
  angle2: { min: -180, max: 180, step: 1 },
};

/**
 * パラメータの既定値
 *
 * @remarks
 * 開始角度 120° / -10° は、最初からカオス的で見ていて面白い軌道を
 * 描く組み合わせとして選んでいます（ほぼ真上に近い位置から落ちるため、
 * エネルギーが大きく複雑な回転運動になります）。
 */
export const DEFAULT_PARAMS: SimulationParams = {
  length1: 1.0,
  length2: 1.0,
  angle1: 120,
  angle2: -10,
};

/**
 * 固定の物理定数
 *
 * @remarks
 * - `mass1` / `mass2`: 各質点の質量 [kg]。このデモでは調整対象外
 * - `gravity`: 重力加速度 [m/s²]
 * - `fixedDt`: 数値積分の固定タイムステップ [s]。フレームレートに
 *   依存しない決定論的な軌道を得るため、描画とは独立した刻みで積分します
 * - `maxFrameDelta`: 1 フレームで進めてよい最大時間 [s]。タブが
 *   非アクティブから復帰した際の「時間の一気にスキップ」を防ぎます
 */
export const PHYSICS = {
  mass1: 1.0,
  mass2: 1.0,
  gravity: 9.8,
  fixedDt: 1 / 240,
  maxFrameDelta: 1 / 30,
} as const;

/**
 * 光跡（トレイル）の設定
 *
 * @remarks
 * - `maxPoints`: 保持する軌跡点の上限。古い点から破棄することで、
 *   長時間動かしてもメモリと描画コストが一定に保たれます
 * - `lifetimeSec`: 各点が完全に消えるまでの時間 [s]。経過時間に応じて
 *   透明度を下げ、滑らかにフェードアウトさせます
 */
export const TRAIL = {
  maxPoints: 400,
  lifetimeSec: 4,
} as const;
