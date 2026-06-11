/**
 * 二重振り子の物理エンジン
 *
 * @remarks
 * React に依存しない純関数だけで構成されたモジュールです。
 * 「同じ入力からは必ず同じ結果が得られる」ことを保証しているため、
 * ユニットテストが容易で、リセット時の再現性も自然に成立します。
 *
 * 二重振り子は、振り子の先にもう 1 つ振り子をつないだ系で、
 * 単純な構造にもかかわらずカオス（初期値鋭敏性）を示す代表例です。
 * 運動方程式はラグランジュ力学から導かれる連立常微分方程式で、
 * ここでは 4 次ルンゲ＝クッタ法（RK4）で数値的に解いています。
 *
 * @see https://ja.wikipedia.org/wiki/二重振り子
 */

import { PARAM_RANGES, PHYSICS } from "./constants";

/**
 * ユーザーが調整できるシミュレーションパラメータ
 *
 * @remarks
 * 長さの単位はメートル、角度の単位は度です。
 * 角度は「真下が 0°、時計回りが正」と定義しています。
 */
export interface SimulationParams {
  /** 節 1（上の腕）の長さ [m] */
  length1: number;
  /** 節 2（下の腕）の長さ [m] */
  length2: number;
  /** 腕 1 の開始角度 [deg] */
  angle1: number;
  /** 腕 2 の開始角度 [deg] */
  angle2: number;
}

/**
 * ある瞬間の振り子の力学状態
 *
 * @remarks
 * 二重振り子の運動は「2 つの角度」と「2 つの角速度」の
 * 4 つの数値だけで完全に決まります（これを状態変数と呼びます）。
 * 内部計算ではラジアンを使用します。
 */
export interface PendulumState {
  /** 腕 1 の角度 [rad]（鉛直下向きが 0） */
  theta1: number;
  /** 腕 2 の角度 [rad] */
  theta2: number;
  /** 腕 1 の角速度 [rad/s] */
  omega1: number;
  /** 腕 2 の角速度 [rad/s] */
  omega2: number;
}

/** 度をラジアンに変換します */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 値を [min, max] の範囲に収めます */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * パラメータを許容範囲内にクランプ（丸め込み）します
 *
 * @remarks
 * スライダー UI 側でも範囲は制約されますが、物理エンジンの入口でも
 * 二重に防御することで、想定外の値による数値破綻を防ぎます。
 *
 * @param params - 検証前のパラメータ
 * @returns すべての値が許容範囲に収まった新しいパラメータ
 */
export function clampParams(params: SimulationParams): SimulationParams {
  return {
    length1: clamp(
      params.length1,
      PARAM_RANGES.length1.min,
      PARAM_RANGES.length1.max,
    ),
    length2: clamp(
      params.length2,
      PARAM_RANGES.length2.min,
      PARAM_RANGES.length2.max,
    ),
    angle1: clamp(
      params.angle1,
      PARAM_RANGES.angle1.min,
      PARAM_RANGES.angle1.max,
    ),
    angle2: clamp(
      params.angle2,
      PARAM_RANGES.angle2.min,
      PARAM_RANGES.angle2.max,
    ),
  };
}

/**
 * パラメータから初期状態を生成します
 *
 * @remarks
 * 開始角度（度）をラジアンへ変換し、角速度 0（静止）の状態を作ります。
 * 純粋な計算のみなので、同じパラメータからは必ず同じ初期状態が
 * 得られます（リセットの再現性）。
 *
 * @param params - シミュレーションパラメータ
 * @returns 静止した初期状態
 */
export function createInitialState(params: SimulationParams): PendulumState {
  return {
    theta1: degToRad(params.angle1),
    theta2: degToRad(params.angle2),
    omega1: 0,
    omega2: 0,
  };
}

/**
 * 状態の時間微分（角加速度など）を運動方程式から計算します
 *
 * @remarks
 * ここが物理の核心部です。ラグランジュ力学から導かれる
 * 二重振り子の運動方程式を、そのまま式の形で実装しています。
 * 戻り値は「状態の各成分が 1 秒あたりどれだけ変化するか」です。
 *
 * - theta の変化率 = omega（角度の変化率は角速度そのもの）
 * - omega の変化率 = 角加速度（重力と 2 つの腕の相互作用で決まる）
 */
function derivatives(
  state: PendulumState,
  params: SimulationParams,
): PendulumState {
  const { theta1, theta2, omega1, omega2 } = state;
  const { length1: l1, length2: l2 } = params;
  const { mass1: m1, mass2: m2, gravity: g } = PHYSICS;

  // 2 つの腕の角度差。相互作用の強さを決める重要な量
  const delta = theta1 - theta2;
  const cosDelta = Math.cos(delta);
  const sinDelta = Math.sin(delta);

  // 分母（2 つの式で共通）。物理的に 0 にはならない
  const denominator = m1 + m2 * sinDelta * sinDelta;

  // 腕 1 の角加速度
  const alpha1 =
    (-m2 * l1 * omega1 * omega1 * sinDelta * cosDelta -
      m2 * l2 * omega2 * omega2 * sinDelta +
      m2 * g * Math.sin(theta2) * cosDelta -
      (m1 + m2) * g * Math.sin(theta1)) /
    (l1 * denominator);

  // 腕 2 の角加速度
  const alpha2 =
    ((m1 + m2) * l1 * omega1 * omega1 * sinDelta +
      m2 * l2 * omega2 * omega2 * sinDelta * cosDelta +
      (m1 + m2) * g * Math.sin(theta1) * cosDelta -
      (m1 + m2) * g * Math.sin(theta2)) /
    (l2 * denominator);

  return {
    theta1: omega1,
    theta2: omega2,
    omega1: alpha1,
    omega2: alpha2,
  };
}

/** state + derivative * scale を計算するヘルパー（RK4 の中間状態づくり） */
function addScaled(
  state: PendulumState,
  derivative: PendulumState,
  scale: number,
): PendulumState {
  return {
    theta1: state.theta1 + derivative.theta1 * scale,
    theta2: state.theta2 + derivative.theta2 * scale,
    omega1: state.omega1 + derivative.omega1 * scale,
    omega2: state.omega2 + derivative.omega2 * scale,
  };
}

/**
 * 4 次ルンゲ＝クッタ法（RK4）で dt 秒だけ時間を進めた新しい状態を返します
 *
 * @remarks
 * もっとも単純なオイラー法（現在の傾きで一直線に進む）では、
 * 二重振り子のようなカオス系は誤差が急速に蓄積してエネルギーが
 * 増え続け、振り子が暴走してしまいます。
 *
 * RK4 は「区間の始点・中間 2 回・終点」の 4 か所で傾きを調べ、
 * その重み付き平均で進む方法で、同じ計算量あたりの精度が
 * 格段に高く、長時間でも安定した軌道が得られます。
 *
 * @param state - 現在の状態（変更されません）
 * @param params - シミュレーションパラメータ
 * @param dt - 進める時間 [s]（通常は PHYSICS.fixedDt）
 * @returns dt 秒後の新しい状態
 *
 * @example
 * ```ts
 * let state = createInitialState(DEFAULT_PARAMS);
 * state = step(state, DEFAULT_PARAMS, PHYSICS.fixedDt);
 * ```
 */
export function step(
  state: PendulumState,
  params: SimulationParams,
  dt: number,
): PendulumState {
  // k1〜k4: 区間内の 4 か所で評価した「状態の傾き」
  const k1 = derivatives(state, params);
  const k2 = derivatives(addScaled(state, k1, dt / 2), params);
  const k3 = derivatives(addScaled(state, k2, dt / 2), params);
  const k4 = derivatives(addScaled(state, k3, dt), params);

  // 重み付き平均（1 : 2 : 2 : 1）で次の状態へ進む
  return {
    theta1:
      state.theta1 +
      ((k1.theta1 + 2 * k2.theta1 + 2 * k3.theta1 + k4.theta1) * dt) / 6,
    theta2:
      state.theta2 +
      ((k1.theta2 + 2 * k2.theta2 + 2 * k3.theta2 + k4.theta2) * dt) / 6,
    omega1:
      state.omega1 +
      ((k1.omega1 + 2 * k2.omega1 + 2 * k3.omega1 + k4.omega1) * dt) / 6,
    omega2:
      state.omega2 +
      ((k1.omega2 + 2 * k2.omega2 + 2 * k3.omega2 + k4.omega2) * dt) / 6,
  };
}

/**
 * 角度から関節（質点 1）と先端（質点 2）の直交座標を計算します
 *
 * @remarks
 * 座標系は「原点 = 支点、x 右向き正、y 下向き正」です。
 * 画面描画では支点の位置と拡大率をかけてピクセル座標に変換します。
 *
 * @param state - 現在の状態
 * @param params - シミュレーションパラメータ（腕の長さを使用）
 * @returns 関節と先端の座標 [m]
 */
export function toCartesian(
  state: PendulumState,
  params: SimulationParams,
): { joint: { x: number; y: number }; tip: { x: number; y: number } } {
  const joint = {
    x: params.length1 * Math.sin(state.theta1),
    y: params.length1 * Math.cos(state.theta1),
  };
  const tip = {
    x: joint.x + params.length2 * Math.sin(state.theta2),
    y: joint.y + params.length2 * Math.cos(state.theta2),
  };
  return { joint, tip };
}

/**
 * 系の全力学的エネルギー（運動エネルギー + 位置エネルギー）を計算します
 *
 * @remarks
 * 摩擦のない理想系ではエネルギーは保存されるはずなので、
 * 「長時間積分してもこの値がほぼ変わらないこと」が
 * 数値計算の正しさを確かめるテストの指標になります。
 *
 * @param state - 現在の状態
 * @param params - シミュレーションパラメータ
 * @returns 全力学的エネルギー [J]
 */
export function totalEnergy(
  state: PendulumState,
  params: SimulationParams,
): number {
  const { theta1, theta2, omega1, omega2 } = state;
  const { length1: l1, length2: l2 } = params;
  const { mass1: m1, mass2: m2, gravity: g } = PHYSICS;

  // 質点 1 の速度の 2 乗
  const v1Squared = l1 * l1 * omega1 * omega1;
  // 質点 2 の速度の 2 乗（腕 1 の運動と腕 2 の運動の合成）
  const v2Squared =
    v1Squared +
    l2 * l2 * omega2 * omega2 +
    2 * l1 * l2 * omega1 * omega2 * Math.cos(theta1 - theta2);

  const kinetic = (m1 * v1Squared) / 2 + (m2 * v2Squared) / 2;

  // 位置エネルギー（支点を基準、下向きほど低い）
  const y1 = -l1 * Math.cos(theta1);
  const y2 = y1 - l2 * Math.cos(theta2);
  const potential = m1 * g * y1 + m2 * g * y2;

  return kinetic + potential;
}
