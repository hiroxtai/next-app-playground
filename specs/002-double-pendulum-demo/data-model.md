# Data Model: 二重振り子シミュレーションデモページ

**Date**: 2026-06-11 | **Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

すべてメモリ内のデータであり、永続化は行わない。

## SimulationParams（シミュレーションパラメータ）

ユーザーが調整できる設定値。リセット時にシミュレーションへ適用される（FR-003〜005）。

| フィールド | 型 | 既定値 | 範囲 | 説明 |
|-----------|------|--------|------|------|
| `length1` | number | 1.0 | 0.5 〜 2.0 | 節 1（上腕）の長さ [m] |
| `length2` | number | 1.0 | 0.5 〜 2.0 | 節 2（下腕）の長さ [m] |
| `angle1`  | number | 120 | -180 〜 180 | 腕 1 の開始角度 [deg]（真下 = 0、時計回り正） |
| `angle2`  | number | -10 | -180 〜 180 | 腕 2 の開始角度 [deg]（腕 1 からの相対ではなく鉛直基準） |

**バリデーション**: スライダーの min/max/step で UI レベルで制約。物理エンジン側でも
`clampParams()` で範囲内へクランプする（防御的二重化、Edge Case 対応）。

**既定値の根拠**: angle1 = 120° / angle2 = -10° はカオス的で視覚的に面白い軌道を
即座に生む組み合わせ（FR-007）。

## 固定物理定数（ユーザー調整不可 — spec Assumptions）

| 定数 | 値 | 説明 |
|------|-----|------|
| `mass1`, `mass2` | 1.0 | 各質点の質量 [kg] |
| `gravity` | 9.8 | 重力加速度 [m/s²] |
| `fixedDt` | 1/240 | 積分の固定タイムステップ [s]（R2） |
| `maxFrameDelta` | 1/30 | 1 フレームで進めてよい最大時間 [s]（タブ復帰対策） |

## PendulumState（振り子の状態）

ある瞬間の力学状態。`SimulationParams` から `createInitialState()` で決定論的に生成され
（FR-009）、`step()` で時間発展する。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `theta1` | number | 腕 1 の角度 [rad]（鉛直下向き基準） |
| `theta2` | number | 腕 2 の角度 [rad] |
| `omega1` | number | 腕 1 の角速度 [rad/s]（初期値 0） |
| `omega2` | number | 腕 2 の角速度 [rad/s]（初期値 0） |

**状態遷移**:

```
createInitialState(params) → PendulumState(θ=開始角度, ω=0)
step(state, params, dt)    → 次の PendulumState（RK4、純関数・非破壊）
```

**派生値**: 各関節・先端の画面座標は `toCartesian(state, params)` で都度導出する
（保存しない）。

## TrailPoint（光跡の点）/ Trail（光跡バッファ）

振り子の先端が通過した位置の履歴（FR-006）。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `x`, `y` | number | 先端の物理座標 |
| `time` | number | 記録時のシミュレーション経過時刻 [s] |

**Trail のルール**:

- 上限 `TRAIL_MAX_POINTS`（400 点）のリングバッファ。超過時は最古を破棄（US3-3）
- 描画時の透明度 = `1 - (now - point.time) / TRAIL_LIFETIME`（`TRAIL_LIFETIME` ≒ 4 秒、
  SC-006）。負になった点は描画スキップ＆破棄
- 経過時刻はシミュレーション時間基準のため、一時停止中はフェードも停止する
- `reset()` で全消去（US3-2）

## PlaybackStatus（再生状態）

UI の再生コントロールの状態機械（FR-005）。

```
        start          pause
idle ────────→ running ──────→ paused
  ↑                │  ↑  resume   │
  └── reset ←──────┴──┴───────────┘
```

- `idle`: 初期表示。reduced-motion 環境ではここから自動遷移しない（R7）
- `running`: rAF ループで積分・描画が進行
- `paused`: 状態・光跡を保持したまま停止
- `reset`: 現在の `SimulationParams` で `createInitialState()` を再実行し、Trail を
  クリアして `idle` へ戻る

## カタログ登録データ（既存モデルへの追記）

- `categories` 配列（`src/app/_lib/catalog-data.ts`）に追加:
  `{ id: "simulation", label: "シミュレーション", description: "物理シミュレーションやゲームなどインタラクティブなデモ" }`
- `pages` 配列に追加:
  `{ id: "double-pendulum", title: "二重振り子", category: "simulation", difficulty: "上級", tags: ["Canvas", "物理", "アニメーション"] }`
- `categoryStyles`（`category-styles.ts`）に `simulation` 用のアイコン（例: `Orbit`）と
  配色（例: violet 系）を追加
