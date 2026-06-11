---

description: "Task list for 二重振り子シミュレーションデモページ"
---

# Tasks: 二重振り子シミュレーションデモページ

**Input**: Design documents from `/specs/002-double-pendulum-demo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/components.md, quickstart.md

**Tests**: 憲法原則 II（テスト標準・NON-NEGOTIABLE）により、テストタスクは必須。
物理エンジンは Vitest ユニットテスト、UI コントロールは Storybook ストーリーで検証する。

**Organization**: タスクはユーザーストーリー単位でグループ化し、各ストーリーが独立して
実装・検証できるようにする。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル・未完了タスクへの依存なし）
- **[Story]**: 対応するユーザーストーリー（US1, US2, US3）
- 各タスクに正確なファイルパスを含む

## Path Conventions

- 例題ページ: `src/app/examples/simulation/double-pendulum/`
- ページ固有コード: 同ディレクトリ配下の `_components/` / `_lib/` にコロケーション
- 共有データ: `src/app/_lib/`、共有 UI: `src/components/ui/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 共有 UI コンポーネントの追加

- [X] T001 `pnpm dlx shadcn@latest add slider` を実行して `src/components/ui/slider.tsx` を追加し、`pnpm lint` が通ることを確認する
- [X] T002 [P] 既存 ui コンポーネントの規約（CSF3 + `autodocs`）に合わせて `src/components/ui/slider.stories.tsx` を作成する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: カタログ登録と定数定義 — 全ストーリーの前提

**⚠️ CRITICAL**: このフェーズ完了までユーザーストーリーの実装を開始しない

- [X] T003 `src/app/_lib/catalog-data.ts` の `categories` に `simulation` カテゴリ（label: シミュレーション）を追加し、`pages` に `double-pendulum` エントリ（category: simulation, difficulty: 上級, tags: Canvas/物理/アニメーション）を追加する（data-model.md「カタログ登録データ」参照）
- [X] T004 `src/app/_lib/category-styles.ts` の `categoryStyles` に `simulation` エントリ（icon: `Orbit`、violet 系の gradient / iconBg）を追加する（T003 の型変更により必須）
- [X] T005 [P] `src/app/examples/simulation/double-pendulum/_lib/constants.ts` を作成し、`PARAM_RANGES` / `DEFAULT_PARAMS` / `PHYSICS` / `TRAIL` を contracts/components.md §2 のとおり日本語 JSDoc 付きで定義する

**Checkpoint**: カタログにカテゴリが現れ、`pnpm type-check` が通る状態

---

## Phase 3: User Story 1 - 二重振り子の動きを観察する (Priority: P1) 🎯 MVP

**Goal**: デモページで二重振り子が物理法則に従って動き、開始・一時停止・リセットで操作できる

**Independent Test**: quickstart.md S1・S2 — カタログから遷移し、振り子が滑らかに動き、再生コントロールが機能する

### Tests for User Story 1 (REQUIRED per constitution principle II) ⚠️

> **NOTE: 物理エンジンのテストを先に書き、実装前に FAIL することを確認する**

- [X] T006 [P] [US1] `src/app/examples/simulation/double-pendulum/_lib/double-pendulum.test.ts` を作成し、contracts/components.md §1「契約上の保証」を検証する: (a) `createInitialState` の決定論性、(b) `step` の純関数性（入力非破壊）、(c) 静止状態からの重力方向への加速、(d) 72,000 ステップ後の `totalEnergy` 相対誤差 < 1%、(e) `clampParams` の境界丸め

### Implementation for User Story 1

- [X] T007 [US1] `src/app/examples/simulation/double-pendulum/_lib/double-pendulum.ts` に物理エンジンを実装する: `SimulationParams` / `PendulumState` 型、`clampParams` / `createInitialState` / `step`（RK4, 固定 dt）/ `toCartesian` / `totalEnergy`（research.md R2・R3、日本語 JSDoc 必須）。T006 のテストが全て PASS すること
- [X] T008 [US1] `src/app/examples/simulation/double-pendulum/_components/pendulum-canvas.tsx` に Canvas 描画コンポーネントを実装する: `ResizeObserver` でコンテナ幅追従、`devicePixelRatio` 対応、テーマトークンから配色解決（research.md R7）、支点・2 本の節・2 つの質点の描画
- [X] T009 [US1] `src/app/examples/simulation/double-pendulum/_components/pendulum-controls.tsx` を作成し、開始・一時停止・リセットボタン（既存 `Button` 使用、`status` に応じた表示切替）を実装する（スライダーは US2 で追加）
- [X] T010 [US1] `src/app/examples/simulation/double-pendulum/_components/double-pendulum-demo.tsx` に `"use client"` のデモ本体を実装する: `idle/running/paused` 状態機械、rAF ループ + 固定タイムステップのアキュムレータ + delta クランプ（research.md R2・R5）、`prefers-reduced-motion` 時の自動再生抑止（R7）、リセットの決定論性（FR-009）
- [X] T011 [US1] `src/app/examples/simulation/double-pendulum/page.tsx` を Server Component として作成する: `metadata`（タイトル・説明）、見出しと説明文、`DoublePendulumDemo` の配置（`"use client"` を付けない — 憲法 IV）

**Checkpoint**: quickstart.md S1・S2 が手動確認でき、`pnpm test:run` が通る — MVP 成立

---

## Phase 4: User Story 2 - パラメータを調整して挙動の変化を楽しむ (Priority: P2)

**Goal**: 節の長さ × 2・開始角度 × 2 をスライダーで調整し、リセットで反映できる

**Independent Test**: quickstart.md S3 — スライダー操作後のリセットで形状・動き出しが変わり、同一設定なら 10 回リセットしても同じ動きになる

### Tests for User Story 2 (REQUIRED per constitution principle II) ⚠️

- [X] T012 [P] [US2] `src/app/examples/simulation/double-pendulum/_components/pendulum-controls.stories.tsx` を CSF3 + `autodocs` で作成する: idle / running / paused 各状態のストーリーと、running 中のパラメータ変更で「リセットで適用」注記が表示されることの play 関数による検証（US2-4）

### Implementation for User Story 2

- [X] T013 [US2] `src/app/examples/simulation/double-pendulum/_components/pendulum-controls.tsx` に `Slider` × 4（節 1/2 の長さ、腕 1/2 の開始角度。min/max/step は `PARAM_RANGES` から）と現在値表示、`onParamsChange` コールバック、running 中の「リセットで適用」注記を追加する（contracts/components.md §3）
- [X] T014 [US2] `src/app/examples/simulation/double-pendulum/_components/double-pendulum-demo.tsx` にパラメータ state を追加し、リセット時に `clampParams` → `createInitialState` で適用する。腕の長さ変更が Canvas の描画スケールに反映されることを確認する

**Checkpoint**: quickstart.md S3 が確認でき、US1 の動作が壊れていない

---

## Phase 5: User Story 3 - 美しい光跡の演出を楽しむ (Priority: P3)

**Goal**: 先端の軌跡が光る尾として残り、シミュレーション時間基準で滑らかに減衰して消える

**Independent Test**: quickstart.md S4 — 再生中に光跡が残って数秒で消え、一時停止中は保持され、リセットで消える。5 分動作しても滑らかさが維持される

### Tests for User Story 3 (REQUIRED per constitution principle II) ⚠️

- [X] T015 [P] [US3] `src/app/examples/simulation/double-pendulum/_lib/trail.test.ts` を作成し、光跡バッファを検証する: (a) `TRAIL.maxPoints` 超過時に最古の点が破棄される、(b) `TRAIL.lifetimeSec` 経過点の透明度が 0 になり破棄される、(c) クリアで空になる、(d) 透明度がシミュレーション時刻基準で計算される（一時停止中に減衰しない）

### Implementation for User Story 3

- [X] T016 [US3] `src/app/examples/simulation/double-pendulum/_lib/trail.ts` に純関数の光跡バッファを実装する: `TrailPoint` 型、追加・寿命切れ破棄・上限管理・経過時間→透明度の算出（data-model.md「TrailPoint / Trail」、日本語 JSDoc）。T015 が全て PASS すること
- [X] T017 [US3] `src/app/examples/simulation/double-pendulum/_components/pendulum-canvas.tsx` に光跡描画を追加する: `globalCompositeOperation: "lighter"` + 二重ストローク（太い半透明 + 細い高輝度）による発光表現（research.md R4）、`double-pendulum-demo.tsx` で毎ステップ先端座標を記録しリセット時にクリアする

**Checkpoint**: 全ストーリーが独立して機能する

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 仕上げ・ドキュメント・品質ゲート

- [X] T018 [P] `src/app/examples/simulation/double-pendulum/README.md` を作成し、二重振り子の物理（運動方程式・カオス性）と実装のポイント（RK4・Canvas・光跡）を学習者向けに解説する
- [X] T019 quickstart.md S5 を検証する: ダーク/ライト両モードの配色、375px 幅でのレイアウト、reduced-motion 時の自動再生抑止、Tab キーでの全コントロール操作。問題があれば該当コンポーネントを修正する
- [X] T020 品質ゲートを実行し全て成功させる: `pnpm lint && pnpm type-check && pnpm test:run && pnpm build`（憲法「検証コマンド」）。quickstart.md S1〜S4 を `pnpm dev` で最終確認する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし — 即時開始可能
- **Foundational (Phase 2)**: Phase 1 と独立して開始可能（T004 は T003 の後）。ユーザーストーリー実装の前提
- **User Stories (Phase 3+)**: Phase 2 完了後。優先度順（P1 → P2 → P3）の逐次実施を推奨
- **Polish (Phase 6)**: 対象ストーリー完了後

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に開始可能。他ストーリーへの依存なし — 単独で MVP
- **US2 (P2)**: US1 の `pendulum-controls.tsx` / `double-pendulum-demo.tsx` を拡張するため US1 完了後
- **US3 (P3)**: US1 の `pendulum-canvas.tsx` / `double-pendulum-demo.tsx` を拡張するため US1 完了後（US2 とは独立 — US2 と並行可能）

### Within Each User Story

- テスト（T006, T015）は対応する実装の前に書き、FAIL を確認してから実装する
- US1 内: T007（エンジン）→ T008/T009（[P] 相当だが T010 の前）→ T010（統合）→ T011（ページ）

### Parallel Opportunities

- T001 と T003〜T005 は並列可能（異なるファイル）
- T002 と T005 は他タスクと並列可能 [P]
- T006 は T005 完了後、T007 と別ファイルのため先行作成可能 [P]
- US2 と US3 は US1 完了後、別ファイル中心のため並行作業可能（`double-pendulum-demo.tsx` の変更のみ競合に注意）
- T012 / T015 / T018 はそれぞれのフェーズ内で並列可能 [P]

---

## Parallel Example: User Story 1

```bash
# テストを先行作成（T005 完了後すぐ）:
Task: "T006 物理エンジンのユニットテストを _lib/double-pendulum.test.ts に作成"

# エンジン実装後、UI 2 コンポーネントを並行作成:
Task: "T008 pendulum-canvas.tsx を実装"
Task: "T009 pendulum-controls.tsx（再生ボタンのみ）を実装"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup（slider 追加 — US2 で使うが先に入れて lint を安定させる）
2. Phase 2: Foundational（カタログ登録・定数）
3. Phase 3: US1 完了 → quickstart S1・S2 で検証
4. **ここで止めてもデモとして公開可能（MVP）**

### Incremental Delivery

1. US1 完了 → 「眺めて楽しめる」デモとして成立
2. US2 追加 → 「実験して遊べる」体験へ
3. US3 追加 → 「美しい」ビジュアルの完成
4. Polish → ドキュメント・品質ゲート → PR 作成（マージは人間が実施 — 憲法）

---

## Notes

- [P] タスク = 異なるファイル・未完了依存なし
- 各タスク完了ごとにコミットし、ストーリー単位のチェックポイントで quickstart の
  該当シナリオを確認する
- 完了条件は常に `pnpm lint && pnpm type-check && pnpm test:run` の全成功（憲法 II）
