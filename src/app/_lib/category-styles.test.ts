import { describe, expect, it } from "vitest";
import { categories } from "./catalog-data";
import { categoryStyles, getCategoryStyle } from "./category-styles";

/**
 * カテゴリスタイルのテスト
 *
 * @remarks
 * すべてのカテゴリに対応するスタイルが定義されていることを検証します。
 * 新しいカテゴリを追加した際に、スタイル定義の漏れを検出できます。
 */
describe("category-styles", () => {
  // ============================================
  // categoryStyles のテスト
  // ============================================
  describe("categoryStyles", () => {
    it("should have a style for every category", () => {
      for (const category of categories) {
        expect(categoryStyles[category.id]).toBeDefined();
      }
    });

    it("should include icon, gradient, and iconBg for each style", () => {
      for (const category of categories) {
        const style = categoryStyles[category.id];
        expect(style.icon).toBeDefined();
        expect(typeof style.gradient).toBe("string");
        expect(typeof style.iconBg).toBe("string");
      }
    });
  });

  // ============================================
  // getCategoryStyle のテスト
  // ============================================
  describe("getCategoryStyle", () => {
    it("should return the correct style for each category", () => {
      for (const category of categories) {
        const style = getCategoryStyle(category.id);
        expect(style).toBe(categoryStyles[category.id]);
      }
    });
  });
});
