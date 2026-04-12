import { describe, expect, it } from "vitest";
import {
  categories,
  getPageById,
  getPagesByCategory,
  pages,
} from "./catalog-data";

/**
 * カタログデータのテスト
 *
 * @remarks
 * カテゴリとページのデータ整合性を検証します。
 * 新しいページやカテゴリを追加した際に、ID の重複やカテゴリの不一致を検出できます。
 */
describe("catalog-data", () => {
  // ============================================
  // categories のテスト
  // ============================================
  describe("categories", () => {
    it("should have 7 categories", () => {
      expect(categories).toHaveLength(7);
    });

    it("should have unique category IDs", () => {
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  // ============================================
  // pages のテスト
  // ============================================
  describe("pages", () => {
    it("should have 17 pages", () => {
      expect(pages).toHaveLength(17);
    });

    it("should have unique page IDs", () => {
      const ids = pages.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should reference valid category IDs", () => {
      const validCategoryIds = categories.map((c) => c.id);
      for (const page of pages) {
        expect(validCategoryIds).toContain(page.category);
      }
    });

    it("should have valid difficulty levels", () => {
      const validDifficulties = ["初級", "中級", "上級"];
      for (const page of pages) {
        expect(validDifficulties).toContain(page.difficulty);
      }
    });
  });

  // ============================================
  // getPagesByCategory のテスト
  // ============================================
  describe("getPagesByCategory", () => {
    it("should return only pages matching the category", () => {
      const uiPages = getPagesByCategory("ui-basics");
      expect(uiPages.length).toBeGreaterThan(0);
      for (const page of uiPages) {
        expect(page.category).toBe("ui-basics");
      }
    });

    it("should return pages for every category", () => {
      for (const category of categories) {
        const categoryPages = getPagesByCategory(category.id);
        expect(categoryPages.length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================
  // getPageById のテスト
  // ============================================
  describe("getPageById", () => {
    it("should find an existing page", () => {
      const page = getPageById("hello-world");
      expect(page).toBeDefined();
      expect(page?.title).toBe("Hello World");
    });

    it("should return undefined for non-existent page", () => {
      const page = getPageById("non-existent-page");
      expect(page).toBeUndefined();
    });

    it("should find every page by its ID", () => {
      for (const page of pages) {
        const found = getPageById(page.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(page.id);
      }
    });
  });
});
