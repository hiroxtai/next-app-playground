"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { PARAM_RANGES } from "../_lib/constants";
import type { SimulationParams } from "../_lib/double-pendulum";

/**
 * 再生状態
 *
 * @remarks
 * - `idle`: 初期表示・リセット直後（まだ動いていない）
 * - `running`: シミュレーション進行中
 * - `paused`: 一時停止中（状態と光跡は保持される）
 */
export type PlaybackStatus = "idle" | "running" | "paused";

/**
 * PendulumControls の props
 */
export interface PendulumControlsProps {
  /** 現在編集中のパラメータ */
  params: SimulationParams;
  /** 再生状態 */
  status: PlaybackStatus;
  /** スライダー操作時に呼ばれる（範囲内の値のみ渡される） */
  onParamsChange: (params: SimulationParams) => void;
  /** 開始・再開 */
  onStart: () => void;
  /** 一時停止 */
  onPause: () => void;
  /** リセット（編集中のパラメータを適用して初期状態に戻す） */
  onReset: () => void;
}

/**
 * スライダー 1 本ぶんの設定
 */
interface SliderConfig {
  key: keyof SimulationParams;
  label: string;
  /** 値の表示に使う単位 */
  unit: string;
}

/** 4 つのパラメータスライダーの表示定義 */
const SLIDER_CONFIGS: SliderConfig[] = [
  { key: "length1", label: "節 1 の長さ", unit: "m" },
  { key: "length2", label: "節 2 の長さ", unit: "m" },
  { key: "angle1", label: "腕 1 の開始角度", unit: "°" },
  { key: "angle2", label: "腕 2 の開始角度", unit: "°" },
];

/**
 * 二重振り子のパラメータ調整と再生操作の UI
 *
 * @remarks
 * 状態を持たないプレゼンテーショナルコンポーネントです。
 * すべての変更はコールバックで親（DoublePendulumDemo）へ通知します。
 *
 * パラメータの変更は「リセット時に適用」されます。再生中に
 * スライダーを動かした場合は、その旨の注記を表示してユーザーに
 * リセット操作を促します（変更がいつ反映されるかを明確にするため）。
 *
 * @example
 * ```tsx
 * <PendulumControls
 *   params={params}
 *   status="idle"
 *   onParamsChange={setParams}
 *   onStart={start}
 *   onPause={pause}
 *   onReset={reset}
 * />
 * ```
 */
export function PendulumControls({
  params,
  status,
  onParamsChange,
  onStart,
  onPause,
  onReset,
}: PendulumControlsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 再生コントロール */}
      <div className="flex items-center gap-2">
        {status === "running" ? (
          <Button onClick={onPause} variant="secondary">
            <Pause aria-hidden="true" />
            一時停止
          </Button>
        ) : (
          <Button onClick={onStart}>
            <Play aria-hidden="true" />
            {status === "paused" ? "再開" : "開始"}
          </Button>
        )}
        <Button onClick={onReset} variant="outline">
          <RotateCcw aria-hidden="true" />
          リセット
        </Button>
      </div>

      {/* パラメータスライダー */}
      <div className="flex flex-col gap-5">
        {SLIDER_CONFIGS.map(({ key, label, unit }) => {
          const range = PARAM_RANGES[key];
          const value = params[key];
          const sliderId = `pendulum-${key}`;
          return (
            <div key={key} className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={sliderId}>{label}</Label>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {value}
                  {unit}
                </span>
              </div>
              <Slider
                id={sliderId}
                aria-label={label}
                min={range.min}
                max={range.max}
                step={range.step}
                value={[value]}
                onValueChange={([next]) => {
                  if (next !== undefined) {
                    onParamsChange({ ...params, [key]: next });
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 再生中にパラメータを変えても即時反映されないことの注記 */}
      {status === "running" && (
        <p className="text-sm text-muted-foreground" role="status">
          パラメータの変更はリセット時に適用されます
        </p>
      )}
    </div>
  );
}
