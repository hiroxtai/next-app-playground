"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { TRAIL } from "../_lib/constants";
import type { PendulumState, SimulationParams } from "../_lib/double-pendulum";
import { toCartesian } from "../_lib/double-pendulum";
import type { TrailPoint } from "../_lib/trail";
import { trailOpacity } from "../_lib/trail";

/**
 * 1 フレームぶんの描画スナップショット
 */
export interface PendulumFrame {
  /** 現在の力学状態 */
  state: PendulumState;
  /** 光跡の点列 */
  trail: readonly TrailPoint[];
  /** シミュレーション経過時刻 [s]（光跡のフェード計算に使用） */
  simTime: number;
}

/**
 * PendulumCanvas の props
 */
export interface PendulumCanvasProps {
  /**
   * 毎フレーム呼び出されるコールバック。
   * `deltaSec` ぶんシミュレーションを進め、描画用スナップショットを返します。
   * 静止中の再描画では `deltaSec = 0` で呼ばれます（時間は進まない）。
   */
  onFrame: (deltaSec: number) => PendulumFrame;
  /** 適用中のパラメータ（腕の長さから描画スケールを計算） */
  params: SimulationParams;
  /** true の間だけアニメーションループ（rAF）を回す */
  isRunning: boolean;
  /** リセットのたびに増える番号。静止中でも再描画をトリガーする */
  resetCount: number;
}

/** 光跡の発光色（ダーク/ライト共通で映える明るいフクシア） */
const TRAIL_COLOR = "oklch(0.74 0.26 322)";

/**
 * 現在のテーマから Canvas 描画に使う色を解決します
 *
 * @remarks
 * Tailwind のテーマトークン（CSS カスタムプロパティ）を実行時に読み取ることで、
 * ダーク/ライトモードの切り替えに描画色が追従します。
 */
function resolveColors(canvas: HTMLCanvasElement) {
  const style = getComputedStyle(canvas);
  return {
    /** 節（棒）の色 */
    rod: style.getPropertyValue("--muted-foreground").trim() || "#888",
    /** 質点（おもり）の色 */
    bob: style.getPropertyValue("--foreground").trim() || "#000",
    /** 支点の色 */
    pivot: style.getPropertyValue("--border").trim() || "#ccc",
  };
}

/**
 * 二重振り子と光跡を描画する Canvas コンポーネント
 *
 * @remarks
 * 描画のことだけを担当し、物理計算は `onFrame` コールバック経由で
 * 親（DoublePendulumDemo）に委ねます。この分離により、
 * 物理エンジンは React や Canvas に依存しない純関数のままテストできます。
 *
 * 実装のポイント:
 * - `requestAnimationFrame` ループは `isRunning` の間だけ回す
 * - `ResizeObserver` + `devicePixelRatio` で、どの画面サイズでも
 *   くっきり描画する
 * - 色はテーマトークンから実行時に解決し、ダークモードに追従する
 * - 光跡は「太い半透明の線」と「細い明るい線」の二重描きで発光感を出す
 */
export function PendulumCanvas({
  onFrame,
  params,
  isRunning,
  resetCount,
}: PendulumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // onFrame を ref に保持し、rAF ループを張り直さずに最新の関数を呼べるようにする
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetCount はリセット時に静止中でも再描画するための意図的な依存
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = resolvedTheme === "dark";

    /** スナップショットを 1 枚描画する */
    const draw = (frame: PendulumFrame) => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const colors = resolveColors(canvas);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 支点を中央に置き、腕を最大に伸ばしても収まる拡大率を計算
      const pivotX = width / 2;
      const pivotY = height / 2;
      const reach = params.length1 + params.length2;
      const scale = (Math.min(width, height) * 0.45) / reach;

      /** 物理座標 [m] → 画面座標 [px] */
      const toScreen = (p: { x: number; y: number }) => ({
        x: pivotX + p.x * scale,
        y: pivotY + p.y * scale,
      });

      // --- 光跡: 古い点ほど薄く・細く描き、二重描きで発光させる ---
      if (frame.trail.length >= 2) {
        // ダーク背景では加算合成にすると光が重なって明るくなる
        ctx.globalCompositeOperation = isDark ? "lighter" : "source-over";
        for (let i = 1; i < frame.trail.length; i++) {
          const prev = frame.trail[i - 1];
          const curr = frame.trail[i];
          const opacity = trailOpacity(curr, frame.simTime, TRAIL.lifetimeSec);
          if (opacity <= 0) continue;

          const from = toScreen(prev);
          const to = toScreen(curr);

          // 1 本目: 太く淡い線（光のにじみ）
          ctx.strokeStyle = TRAIL_COLOR;
          ctx.lineCap = "round";
          ctx.globalAlpha = opacity * 0.25;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();

          // 2 本目: 細く明るい線（光の芯）
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      // --- 振り子本体 ---
      const { joint, tip } = toCartesian(frame.state, params);
      const jointPx = toScreen(joint);
      const tipPx = toScreen(tip);

      // 節（2 本の棒）
      ctx.strokeStyle = colors.rod;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(jointPx.x, jointPx.y);
      ctx.lineTo(tipPx.x, tipPx.y);
      ctx.stroke();

      // 支点
      ctx.fillStyle = colors.pivot;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fill();

      // 質点 1（関節）
      ctx.fillStyle = colors.bob;
      ctx.beginPath();
      ctx.arc(jointPx.x, jointPx.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // 質点 2（先端）: 光跡と同じ色で発光しているように見せる
      ctx.fillStyle = TRAIL_COLOR;
      ctx.beginPath();
      ctx.arc(tipPx.x, tipPx.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    /** コンテナサイズと devicePixelRatio に合わせて実ピクセル数を調整する */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      // サイズ変更で内容が消えるため、時間を進めずに再描画する
      draw(onFrameRef.current(0));
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    // 再生中だけアニメーションループを回す
    let rafId = 0;
    let lastTime = 0;
    if (isRunning) {
      const loop = (time: number) => {
        // 初回フレームは経過時間 0 として扱う
        const deltaSec = lastTime === 0 ? 0 : (time - lastTime) / 1000;
        lastTime = time;
        draw(onFrameRef.current(deltaSec));
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isRunning, params, resetCount, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      role="img"
      aria-label="二重振り子のシミュレーション。2本の腕がカオス的に揺れ、先端が光る軌跡を残します。"
    />
  );
}
