# Research: 二重振り子シミュレーションデモページ

**Date**: 2026-06-11 | **Plan**: [plan.md](./plan.md)

Technical Context に NEEDS CLARIFICATION はないが、実装方式の選定理由を以下に記録する。

## R1. 描画技術の選定

- **Decision**: HTML Canvas 2D API + `requestAnimationFrame`
- **Rationale**: 毎フレーム数百点の光跡を透明度付きで描画するユースケースでは、
  DOM/SVG はノード数が膨らみ 60fps 維持が難しい。Canvas 2D は単一要素への即時描画で
  GC 負荷が小さく、`shadowBlur` や `globalCompositeOperation: "lighter"` による発光表現も
  標準機能で実現できる。新規依存ゼロで憲法の「技術スタック制約」に適合する
- **Alternatives considered**:
  - SVG + CSS: 振り子本体のみなら可能だが、数百点の軌跡更新で DOM 更新コストが過大
  - WebGL (Three.js / PixiJS 等): 表現力は高いが新規ランタイム依存が必要で ADR 対象に
    なる。2D の線と円のみの本デモにはオーバースペック
  - CSS アニメーション: カオス系の数値解はキーフレーム化できず不適

## R2. 数値積分法

- **Decision**: 4 次ルンゲ＝クッタ法（RK4）+ 固定タイムステップ（1/240 秒）+
  アキュムレータ方式。フレーム間 delta は上限（例: 1/30 秒）でクランプ
- **Rationale**: 二重振り子はカオス系で誤差が指数的に増幅するため、オイラー法では
  エネルギーが発散し「画面外へ飛ぶ」破綻が起きやすい（spec の Edge Case）。RK4 +
  固定ステップなら減衰なしの理想系でも長時間（5 分以上 = SC-004）安定する。
  固定ステップはフレームレートに依存しない決定論的な軌道を保証し、SC-005
  （リセット再現性 100%）を満たす。delta クランプによりタブ非アクティブ復帰時の
  時間スキップ破綻を防ぐ
- **Alternatives considered**:
  - 陽的オイラー法: 実装は最簡だがエネルギー増大で数秒〜数十秒で破綻
  - 半陰的（シンプレクティック）オイラー: 安定性は改善するが精度が低く、
    高角速度時に軌道誤差が目立つ
  - 可変ステップ（delta そのまま使用）: フレームレート依存で再現性が失われ FR-009 違反

## R3. 運動方程式

- **Decision**: 質点 2 つ・剛体棒 2 本の標準的な二重振り子のラグランジュ方程式
  （角度 θ1, θ2 と角速度 ω1, ω2 の 1 階連立 ODE 形式）。質量 m1 = m2 = 1、
  重力加速度 g = 9.8 で固定
- **Rationale**: 教科書的に確立した式であり、ユニットテストで検証可能な性質
  （初期静止時の角加速度の符号、エネルギー保存の近似維持など）が明確。
  質量・重力の固定は spec の Assumptions どおり
- **Alternatives considered**: 物理エンジンライブラリ（matter.js 等）— 制約系の精度が
  目的に対して不足し、新規依存も増えるため不採用

## R4. 光跡（トレイル）の表現

- **Decision**: 先端座標を上限付きリングバッファ（約 400 点 ≒ 60fps で数秒分）に
  記録し、毎フレーム全消去 → 古い点ほど低透明度・細い線幅で折れ線を重ね描き。
  発光感は `globalCompositeOperation: "lighter"` と二重ストローク（太い半透明 +
  細い高輝度）で表現
- **Rationale**: 点ごとの経過時間から透明度を算出する方式は、一時停止中に光跡が
  消えない・リセットで確実に消える（US3 受け入れ条件）を自然に満たす。上限付き
  バッファで長時間動作でもメモリ・描画コストが一定（SC-004 / US3-3）
- **Alternatives considered**:
  - 全画面に半透明矩形を重ねるフェード方式: 実装は簡単だが、ダーク/ライトモードの
    背景色変化への追従が難しく、一時停止中もフェードが進む副作用がある
  - オフスクリーンキャンバス合成: 品質向上は僅かで複雑性が増すため初版では不採用

## R5. 状態管理と React 統合

- **Decision**: ページローカルの `useState`（パラメータ・再生状態）+ `useRef`
  （シミュレーション状態・rAF ハンドル）。Jotai は使用しない。物理計算と描画は
  rAF ループ内で ref を介して行い、React の再レンダリングを毎フレーム発生させない
- **Rationale**: 状態はこのページに閉じておりグローバル共有が不要。毎フレーム
  setState すると React Compiler でも 60fps 維持が困難なため、描画系は React の
  レンダリングサイクル外で実行する。React Compiler 有効下で手動メモ化も不要
- **Alternatives considered**: Jotai atom 化 — カタログの状態管理カテゴリの例題では
  有用だが、本ページでは間接層が増えるだけで利点がない

## R6. パラメータ UI

- **Decision**: shadcn/ui の `slider` を公式 CLI（`pnpm dlx shadcn@latest add slider`）で
  追加し、節の長さ 2 つ・開始角度 2 つの調整に使用。開始・一時停止・リセットは既存の
  `button` を使用。パラメータ変更はリセット時に適用（動作中は「リセットで適用」の
  注記を表示）
- **Rationale**: 憲法 III（shadcn/ui への統一）に適合。slider は範囲制約
  （min/max/step）を UI レベルで保証し、FR-003/004 の「許容範囲内に制限」を満たす
- **Alternatives considered**: number input のみ — 範囲外入力のバリデーションが別途
  必要になり、モバイルでの操作性も劣る

## R7. アクセシビリティ / reduced motion / テーマ対応

- **Decision**: `matchMedia("(prefers-reduced-motion: reduce)")` が真なら自動再生せず
  静止状態で表示（開始ボタンで明示的に再生）。Canvas の配色は CSS カスタムプロパティ
  （テーマトークン）を `getComputedStyle` で解決し、`next-themes` のテーマ切替に追従。
  コントロールはすべて Radix ベースでキーボード操作可能
- **Rationale**: spec の Edge Case と憲法 III（アクセシビリティ・ダークモード）に対応。
  vitest.setup.ts に matchMedia モックが既にあり、テストも容易
- **Alternatives considered**: テーマ色のハードコード — ダークモード切替に追従できず不採用
