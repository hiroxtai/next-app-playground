# Interface Contracts: 二重振り子シミュレーションデモページ

**Date**: 2026-06-11 | **Plan**: [../plan.md](../plan.md) | **Data Model**: [../data-model.md](../data-model.md)

外部 API は持たない（クライアント完結）。本機能の「契約」は (1) 物理エンジンの
純関数インターフェース、(2) コロケーションされた React コンポーネントの props、
(3) カタログへの登録、の 3 つ。

## 1. 物理エンジン `_lib/double-pendulum.ts`（純関数・React 非依存）

```ts
/** ユーザー調整可能なパラメータ（単位・範囲は data-model.md 参照） */
export interface SimulationParams {
  length1: number;
  length2: number;
  angle1: number; // deg
  angle2: number; // deg
}

/** 力学状態（rad / rad/s） */
export interface PendulumState {
  theta1: number;
  theta2: number;
  omega1: number;
  omega2: number;
}

/** パラメータを許容範囲内にクランプする */
export function clampParams(params: SimulationParams): SimulationParams;

/** パラメータから決定論的に初期状態を生成する（ω は常に 0） */
export function createInitialState(params: SimulationParams): PendulumState;

/** RK4 で dt 秒だけ時間発展させた新しい状態を返す（引数は変更しない） */
export function step(
  state: PendulumState,
  params: SimulationParams,
  dt: number,
): PendulumState;

/** 関節 1・先端（質点 2）の直交座標を返す（原点 = 支点、y 下向き正） */
export function toCartesian(
  state: PendulumState,
  params: SimulationParams,
): { joint: { x: number; y: number }; tip: { x: number; y: number } };

/** 全力学的エネルギーを返す（テスト用: 保存性の検証に使う） */
export function totalEnergy(
  state: PendulumState,
  params: SimulationParams,
): number;
```

**契約上の保証（ユニットテストで検証する性質）**:

- `createInitialState` は同一入力に対し常に同一出力（FR-009 / SC-005）
- `step` は純関数（入力オブジェクトを変更しない）
- 静止状態（ω=0, θ1=90°, θ2=0°）からの `step` で θ1 が重力方向（角度減少）へ動く
- 固定 dt=1/240 で 5 分相当（72,000 ステップ）進めても `totalEnergy` の相対誤差が
  1% 未満（SC-004 / Edge Case「数値発散しない」）
- `clampParams` は範囲外入力を境界値へ丸め、範囲内入力をそのまま返す

## 2. 定数 `_lib/constants.ts`

```ts
export const PARAM_RANGES: Record<keyof SimulationParams, { min: number; max: number; step: number }>;
export const DEFAULT_PARAMS: SimulationParams; // { length1: 1, length2: 1, angle1: 120, angle2: -10 }
export const PHYSICS = { mass1: 1, mass2: 1, gravity: 9.8, fixedDt: 1 / 240, maxFrameDelta: 1 / 30 } as const;
export const TRAIL = { maxPoints: 400, lifetimeSec: 4 } as const;
```

## 3. React コンポーネント契約

### `page.tsx`（Server Component）

- `export const metadata: Metadata` でタイトル・説明を定義
- レイアウト（見出し・説明文）を描画し、`DoublePendulumDemo` を配置する
- `"use client"` を付けない

### `_components/double-pendulum-demo.tsx`（Client Component・状態の所有者）

```ts
/** props なし（自己完結）。パラメータ・再生状態・rAF ループを所有する */
export function DoublePendulumDemo(): ReactElement;
```

- `PlaybackStatus` 状態機械（data-model.md）を実装
- `prefers-reduced-motion: reduce` の場合は自動再生しない（R7）
- 子に `PendulumCanvas` と `PendulumControls` を配置

### `_components/pendulum-canvas.tsx`

```ts
/** 1 フレームぶんの描画スナップショット */
export interface PendulumFrame {
  state: PendulumState;
  trail: readonly TrailPoint[];
  /** シミュレーション経過時刻 [s]（光跡のフェード計算に使用） */
  simTime: number;
}

export interface PendulumCanvasProps {
  /**
   * 毎フレーム呼ばれるコールバック。deltaSec ぶんシミュレーションを進めて
   * スナップショットを返す。静止中の再描画では deltaSec = 0 で呼ばれる
   */
  onFrame: (deltaSec: number) => PendulumFrame;
  /** 適用中のパラメータ（腕の長さから描画スケールを計算） */
  params: SimulationParams;
  /** true の間だけ rAF ループを回す */
  isRunning: boolean;
  /** リセットのたびに増える番号。静止中でも再描画をトリガーする */
  resetCount: number;
}
export function PendulumCanvas(props: PendulumCanvasProps): ReactElement;
```

> 実装メモ: 当初案の「getState / getTrail getter を渡す」形から、
> rAF ループを Canvas 側に一本化する `onFrame` コールバック形へ変更した。
> ループが 1 つになり、シミュレーション進行（親）と描画（子）の責務分離は
> 保たれるため、こちらを正式な契約とする。

- Canvas はコンテナ幅に追従（`ResizeObserver`）し、`devicePixelRatio` を考慮
- 配色はテーマトークン（CSS カスタムプロパティ）から解決（R7）

### `_components/pendulum-controls.tsx`（プレゼンテーショナル・Storybook 対象）

```ts
export interface PendulumControlsProps {
  params: SimulationParams;
  status: "idle" | "running" | "paused";
  /** スライダー操作（範囲内の値のみ渡される） */
  onParamsChange: (params: SimulationParams) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}
export function PendulumControls(props: PendulumControlsProps): ReactElement;
```

- slider × 4（節 1/2 の長さ、腕 1/2 の開始角度）+ 開始/一時停止/リセットボタン
- `status === "running"` 中のパラメータ変更時は「リセットで適用」の注記を表示（US2-4）
- すべてキーボード操作可能（Radix slider / button）

## 4. カタログ登録契約

- `categories` へ `simulation` を追加すると、サイドバー・カタログ一覧・
  `[category]` フォールバックが自動で新カテゴリを表示する（既存機構）
- `categoryStyles` に `simulation` エントリがないと型エラーになる
  （`Record<CategoryId, CategoryStyle>`）— 型で整合性が強制される
- ページ URL: `/examples/simulation/double-pendulum`
