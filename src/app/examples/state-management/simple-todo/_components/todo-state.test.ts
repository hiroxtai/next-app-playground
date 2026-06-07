import { describe, expect, it } from "vitest";

import {
  addTask,
  removeTask,
  TITLE_MAX_LENGTH,
  toggleTask,
  validateTitle,
} from "./todo-state";
import type { Task } from "./todo-types";

/**
 * タスク状態の純粋関数テスト
 *
 * @remarks
 * 入力検証・追加・完了切替・削除の不変条件（特に作成順固定）を検証します。
 */
describe("todo-state", () => {
  /** 連番IDを生成するテスト用ファクトリ */
  function createSequentialIdFactory() {
    let counter = 0;
    return () => {
      counter += 1;
      return `id-${counter}`;
    };
  }

  describe("validateTitle", () => {
    it("空文字を拒否する", () => {
      expect(validateTitle("")).toEqual({
        valid: false,
        reason: "タスク名を入力してください。",
      });
    });

    it("空白のみを拒否する", () => {
      expect(validateTitle("   ").valid).toBe(false);
    });

    it("100文字超を拒否する", () => {
      const result = validateTitle("あ".repeat(TITLE_MAX_LENGTH + 1));
      expect(result.valid).toBe(false);
    });

    it("境界値（100文字）を許可する", () => {
      expect(validateTitle("あ".repeat(TITLE_MAX_LENGTH))).toEqual({
        valid: true,
      });
    });
  });

  describe("addTask", () => {
    it("作成順の連番を付与して末尾に追加する", () => {
      const createId = createSequentialIdFactory();
      const afterFirst = addTask([], "1番目", createId);
      const afterSecond = addTask(afterFirst, "2番目", createId);

      expect(afterSecond.map((task) => task.title)).toEqual(["1番目", "2番目"]);
      expect(afterSecond.map((task) => task.createdOrder)).toEqual([1, 2]);
    });

    it("前後の空白を除いて保存する", () => {
      const tasks = addTask([], "  買い物  ", () => "id-1");
      expect(tasks[0].title).toBe("買い物");
    });
  });

  describe("toggleTask", () => {
    it("対象タスクの完了状態のみ反転する", () => {
      const base: Task[] = [
        { id: "a", title: "A", completed: false, createdOrder: 1 },
        { id: "b", title: "B", completed: false, createdOrder: 2 },
      ];

      const toggled = toggleTask(base, "a");

      expect(toggled[0].completed).toBe(true);
      expect(toggled[1].completed).toBe(false);
    });

    it("配列の順序を変更しない", () => {
      const base: Task[] = [
        { id: "a", title: "A", completed: false, createdOrder: 1 },
        { id: "b", title: "B", completed: false, createdOrder: 2 },
      ];

      const toggled = toggleTask(base, "a");
      expect(toggled.map((task) => task.id)).toEqual(["a", "b"]);
    });
  });

  describe("removeTask", () => {
    it("対象タスクのみ除外する", () => {
      const base: Task[] = [
        { id: "a", title: "A", completed: false, createdOrder: 1 },
        { id: "b", title: "B", completed: false, createdOrder: 2 },
      ];

      expect(removeTask(base, "a")).toEqual([base[1]]);
    });
  });
});
