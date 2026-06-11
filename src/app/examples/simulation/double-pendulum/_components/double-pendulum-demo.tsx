"use client";

import { useEffect, useRef, useState } from "react";

import { DEFAULT_PARAMS, PHYSICS } from "../_lib/constants";
import type { PendulumState, SimulationParams } from "../_lib/double-pendulum";
import {
  clampParams,
  createInitialState,
  step,
  toCartesian,
} from "../_lib/double-pendulum";
import type { TrailPoint } from "../_lib/trail";
import { addTrailPoint, pruneTrail } from "../_lib/trail";
import type { PendulumFrame } from "./pendulum-canvas";
import { PendulumCanvas } from "./pendulum-canvas";
import type { PlaybackStatus } from "./pendulum-controls";
import { PendulumControls } from "./pendulum-controls";

/**
 * 二重振り子デモの本体
 *
 * @remarks
 * このコンポーネントが「シミュレーションの所有者」です。
 * - パラメータと再生状態は React の state で管理（UI に反映される値）
 * - 毎フレーム変わる力学状態・光跡は ref で管理し、
 *   再レンダリングを発生させずに 60fps を維持する
 *
 * **固定タイムステップ + アキュムレータ**という定番パターンを使っています。
 * フレーム間の経過時間（毎回バラつく）をそのまま物理計算に使うと
 * 結果がフレームレート依存になりカオス系では再現性が失われるため、
 * 「経過時間を貯金（accumulator）し、固定の刻み幅（1/240 秒）で
 * 貯金がなくなるまで積分する」方式にしています。
 *
 * また、タブが非アクティブになって戻ると経過時間が数秒になることが
 * あるため、1 フレームで進める時間に上限（maxFrameDelta）を設けて
 * 「時間の一気スキップ」を防いでいます。
 */
export function DoublePendulumDemo() {
  // --- UI に反映される状態（React state） ---
  /** スライダーで編集中のパラメータ（リセットで適用される） */
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  /** シミュレーションに適用済みのパラメータ */
  const [appliedParams, setAppliedParams] =
    useState<SimulationParams>(DEFAULT_PARAMS);
  /** 再生状態 */
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  /** リセット回数（静止中の Canvas 再描画トリガー） */
  const [resetCount, setResetCount] = useState(0);

  // --- 毎フレーム変わる状態（ref: 再レンダリングさせない） ---
  const stateRef = useRef<PendulumState>(createInitialState(DEFAULT_PARAMS));
  const trailRef = useRef<TrailPoint[]>([]);
  const simTimeRef = useRef(0);
  const accumulatorRef = useRef(0);

  /**
   * Canvas から毎フレーム呼ばれるコールバック。
   * deltaSec ぶんシミュレーションを進めて描画用スナップショットを返す。
   */
  const handleFrame = (deltaSec: number): PendulumFrame => {
    if (deltaSec > 0) {
      // タブ復帰などで delta が異常に大きいときはクランプする
      const clampedDelta = Math.min(deltaSec, PHYSICS.maxFrameDelta);
      accumulatorRef.current += clampedDelta;

      // 貯金した時間を固定の刻み幅で消化する
      while (accumulatorRef.current >= PHYSICS.fixedDt) {
        stateRef.current = step(
          stateRef.current,
          appliedParams,
          PHYSICS.fixedDt,
        );
        simTimeRef.current += PHYSICS.fixedDt;
        accumulatorRef.current -= PHYSICS.fixedDt;
      }

      // このフレームの先端位置を光跡に記録し、寿命切れの点を捨てる
      const { tip } = toCartesian(stateRef.current, appliedParams);
      trailRef.current = pruneTrail(
        addTrailPoint(trailRef.current, {
          x: tip.x,
          y: tip.y,
          time: simTimeRef.current,
        }),
        simTimeRef.current,
      );
    }

    return {
      state: stateRef.current,
      trail: trailRef.current,
      simTime: simTimeRef.current,
    };
  };

  /** 開始・再開 */
  const handleStart = () => {
    setStatus("running");
  };

  /** 一時停止（状態と光跡は保持される） */
  const handlePause = () => {
    setStatus("paused");
  };

  /**
   * リセット: 編集中のパラメータを適用して初期状態に戻す。
   * createInitialState は純関数なので、同じパラメータなら
   * 何度リセットしても必ず同じ初期状態になる（再現性）。
   */
  const handleReset = () => {
    const next = clampParams(params);
    setParams(next);
    setAppliedParams(next);
    stateRef.current = createInitialState(next);
    trailRef.current = [];
    simTimeRef.current = 0;
    accumulatorRef.current = 0;
    setStatus("idle");
    setResetCount((count) => count + 1);
  };

  // 初回表示時の自動再生。「視差効果を減らす」設定のユーザーには
  // 自動再生せず、開始ボタンによる明示的な操作に委ねる
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!prefersReducedMotion) {
      setStatus("running");
    }
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* 描画領域 */}
      <div className="aspect-square max-h-[70vh] w-full overflow-hidden rounded-xl border bg-card lg:aspect-auto lg:min-h-[480px]">
        <PendulumCanvas
          onFrame={handleFrame}
          params={appliedParams}
          isRunning={status === "running"}
          resetCount={resetCount}
        />
      </div>

      {/* 操作パネル */}
      <div className="rounded-xl border bg-card p-6">
        <PendulumControls
          params={params}
          status={status}
          onParamsChange={setParams}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
