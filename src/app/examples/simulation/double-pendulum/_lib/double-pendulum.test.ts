import { describe, expect, it } from "vitest";
import { DEFAULT_PARAMS, PARAM_RANGES, PHYSICS } from "./constants";
import {
  clampParams,
  createInitialState,
  step,
  toCartesian,
  totalEnergy,
} from "./double-pendulum";

/**
 * 二重振り子の物理エンジンのテスト
 *
 * @remarks
 * contracts/components.md の「契約上の保証」を検証します。
 * - createInitialState の決定論性（同じ入力 → 常に同じ出力）
 * - step の純関数性（引数のオブジェクトを変更しない）
 * - 静止状態からは重力方向へ動き出すこと
 * - 長時間積分してもエネルギーが保存されること（数値的安定性）
 * - clampParams が範囲外の値を境界に丸めること
 */
describe("double-pendulum", () => {
  // ============================================
  // createInitialState のテスト
  // ============================================
  describe("createInitialState", () => {
    it("同じパラメータからは常に同じ初期状態を生成する（決定論性）", () => {
      const a = createInitialState(DEFAULT_PARAMS);
      const b = createInitialState(DEFAULT_PARAMS);
      expect(a).toEqual(b);
    });

    it("開始角度（度）がラジアンに変換されて初期状態になる", () => {
      const state = createInitialState({
        length1: 1,
        length2: 1,
        angle1: 90,
        angle2: -90,
      });
      expect(state.theta1).toBeCloseTo(Math.PI / 2);
      expect(state.theta2).toBeCloseTo(-Math.PI / 2);
    });

    it("初期角速度は常に 0 である", () => {
      const state = createInitialState(DEFAULT_PARAMS);
      expect(state.omega1).toBe(0);
      expect(state.omega2).toBe(0);
    });
  });

  // ============================================
  // step のテスト
  // ============================================
  describe("step", () => {
    it("引数の state を変更しない（純関数）", () => {
      const state = createInitialState(DEFAULT_PARAMS);
      const snapshot = { ...state };
      step(state, DEFAULT_PARAMS, PHYSICS.fixedDt);
      expect(state).toEqual(snapshot);
    });

    it("真横（90°）で静止した振り子は重力方向（角度減少）へ動き出す", () => {
      // 腕 1 を真横に持ち上げて静かに放すと、重力で振り下ろされて
      // theta1 は減少するはず
      const state = createInitialState({
        length1: 1,
        length2: 1,
        angle1: 90,
        angle2: 90,
      });
      const next = step(state, DEFAULT_PARAMS, PHYSICS.fixedDt);
      expect(next.omega1).toBeLessThan(0);
    });

    it("真下（0°）で静止した振り子は動かない（平衡点）", () => {
      const state = createInitialState({
        length1: 1,
        length2: 1,
        angle1: 0,
        angle2: 0,
      });
      const next = step(state, DEFAULT_PARAMS, PHYSICS.fixedDt);
      expect(next.theta1).toBeCloseTo(0);
      expect(next.theta2).toBeCloseTo(0);
      expect(next.omega1).toBeCloseTo(0);
      expect(next.omega2).toBeCloseTo(0);
    });

    it("同じ初期状態から同じ回数 step すると同じ軌道になる（再現性）", () => {
      let a = createInitialState(DEFAULT_PARAMS);
      let b = createInitialState(DEFAULT_PARAMS);
      for (let i = 0; i < 1000; i++) {
        a = step(a, DEFAULT_PARAMS, PHYSICS.fixedDt);
        b = step(b, DEFAULT_PARAMS, PHYSICS.fixedDt);
      }
      expect(a).toEqual(b);
    });

    it("5 分相当（72,000 ステップ）積分してもエネルギーの相対誤差が 1% 未満", () => {
      let state = createInitialState(DEFAULT_PARAMS);
      const initialEnergy = totalEnergy(state, DEFAULT_PARAMS);
      for (let i = 0; i < 72_000; i++) {
        state = step(state, DEFAULT_PARAMS, PHYSICS.fixedDt);
      }
      const finalEnergy = totalEnergy(state, DEFAULT_PARAMS);
      const relativeError = Math.abs(
        (finalEnergy - initialEnergy) / initialEnergy,
      );
      expect(relativeError).toBeLessThan(0.01);
    });
  });

  // ============================================
  // toCartesian のテスト
  // ============================================
  describe("toCartesian", () => {
    it("真下（0°）のとき関節と先端は支点の真下に位置する", () => {
      const state = createInitialState({
        length1: 1,
        length2: 1,
        angle1: 0,
        angle2: 0,
      });
      const { joint, tip } = toCartesian(state, {
        length1: 1,
        length2: 1,
        angle1: 0,
        angle2: 0,
      });
      expect(joint.x).toBeCloseTo(0);
      expect(joint.y).toBeCloseTo(1);
      expect(tip.x).toBeCloseTo(0);
      expect(tip.y).toBeCloseTo(2);
    });

    it("真横（90°）のとき関節は支点の真横に位置する", () => {
      const params = { length1: 1.5, length2: 1, angle1: 90, angle2: 0 };
      const state = createInitialState(params);
      const { joint } = toCartesian(state, params);
      expect(joint.x).toBeCloseTo(1.5);
      expect(joint.y).toBeCloseTo(0);
    });
  });

  // ============================================
  // clampParams のテスト
  // ============================================
  describe("clampParams", () => {
    it("範囲内の値はそのまま返す", () => {
      expect(clampParams(DEFAULT_PARAMS)).toEqual(DEFAULT_PARAMS);
    });

    it("範囲外の値は境界値に丸める", () => {
      const clamped = clampParams({
        length1: 100,
        length2: -5,
        angle1: 720,
        angle2: -720,
      });
      expect(clamped.length1).toBe(PARAM_RANGES.length1.max);
      expect(clamped.length2).toBe(PARAM_RANGES.length2.min);
      expect(clamped.angle1).toBe(PARAM_RANGES.angle1.max);
      expect(clamped.angle2).toBe(PARAM_RANGES.angle2.min);
    });

    it("引数のオブジェクトを変更しない（純関数）", () => {
      const params = { length1: 100, length2: 1, angle1: 0, angle2: 0 };
      const snapshot = { ...params };
      clampParams(params);
      expect(params).toEqual(snapshot);
    });
  });
});
