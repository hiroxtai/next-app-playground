import { describe, expect, it } from "vitest";
import { TRAIL } from "./constants";
import { addTrailPoint, pruneTrail, trailOpacity } from "./trail";

/**
 * 光跡（トレイル）バッファのテスト
 *
 * @remarks
 * 光跡は「振り子の先端が通った位置の履歴」です。
 * - 上限を超えたら古い点から破棄される（メモリと描画コストを一定に保つ）
 * - 寿命が切れた点は破棄される
 * - 透明度はシミュレーション時間基準で計算される
 *   （実時間ではないため、一時停止中にフェードが進まない）
 */
describe("trail", () => {
  // ============================================
  // addTrailPoint のテスト
  // ============================================
  describe("addTrailPoint", () => {
    it("点を末尾に追加した新しい配列を返す", () => {
      const trail = addTrailPoint([], { x: 1, y: 2, time: 0 });
      expect(trail).toHaveLength(1);
      expect(trail[0]).toEqual({ x: 1, y: 2, time: 0 });
    });

    it("上限を超えたら最古の点を破棄する", () => {
      let trail: ReturnType<typeof addTrailPoint> = [];
      for (let i = 0; i < TRAIL.maxPoints + 10; i++) {
        trail = addTrailPoint(trail, { x: i, y: 0, time: i });
      }
      expect(trail).toHaveLength(TRAIL.maxPoints);
      // 最初の 10 点が破棄され、先頭は 10 番目の点になっている
      expect(trail[0]?.x).toBe(10);
    });

    it("引数の配列を変更しない（純関数）", () => {
      const original = [{ x: 0, y: 0, time: 0 }];
      addTrailPoint(original, { x: 1, y: 1, time: 1 });
      expect(original).toHaveLength(1);
    });
  });

  // ============================================
  // pruneTrail のテスト
  // ============================================
  describe("pruneTrail", () => {
    it("寿命が切れた点を破棄する", () => {
      const trail = [
        { x: 0, y: 0, time: 0 }, // now=5 で寿命切れ（lifetime=4）
        { x: 1, y: 1, time: 3 }, // まだ生きている
      ];
      const pruned = pruneTrail(trail, 5);
      expect(pruned).toHaveLength(1);
      expect(pruned[0]?.x).toBe(1);
    });

    it("すべて生きている場合はそのまま返す", () => {
      const trail = [
        { x: 0, y: 0, time: 4 },
        { x: 1, y: 1, time: 5 },
      ];
      expect(pruneTrail(trail, 5)).toHaveLength(2);
    });
  });

  // ============================================
  // trailOpacity のテスト
  // ============================================
  describe("trailOpacity", () => {
    it("記録直後の点は不透明（1）に近い", () => {
      expect(trailOpacity({ x: 0, y: 0, time: 10 }, 10)).toBeCloseTo(1);
    });

    it("寿命の半分が経過したら透明度はおよそ 0.5", () => {
      const halfLife = TRAIL.lifetimeSec / 2;
      expect(trailOpacity({ x: 0, y: 0, time: 0 }, halfLife)).toBeCloseTo(0.5);
    });

    it("寿命を過ぎた点の透明度は 0", () => {
      expect(trailOpacity({ x: 0, y: 0, time: 0 }, TRAIL.lifetimeSec + 1)).toBe(
        0,
      );
    });

    it("シミュレーション時刻基準なので、時刻が進まなければ減衰しない", () => {
      // 一時停止中はシミュレーション時刻が止まるため、
      // 同じ now を渡し続ける限り透明度は変わらない
      const point = { x: 0, y: 0, time: 2 };
      const a = trailOpacity(point, 3);
      const b = trailOpacity(point, 3);
      expect(a).toBe(b);
      expect(a).toBeGreaterThan(0);
    });
  });
});
