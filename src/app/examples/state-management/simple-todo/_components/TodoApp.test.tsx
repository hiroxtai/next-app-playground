import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TodoApp } from "./TodoApp";

/**
 * シンプルTodoアプリのテスト
 *
 * @remarks
 * 仕様の受け入れシナリオ（US1〜US3）と、FR-009（リロード初期化）・
 * SC-002（操作反映1秒以内）をユーザー視点で検証します。
 */
describe("TodoApp", () => {
  /** タスクを1件追加するヘルパー */
  async function addTask(
    user: ReturnType<typeof userEvent.setup>,
    title: string,
  ) {
    await user.type(screen.getByLabelText("新しいタスク"), title);
    await user.click(screen.getByRole("button", { name: "追加" }));
  }

  // ============================================
  // US1: タスクを作成する
  // ============================================
  describe("US1: タスク作成", () => {
    it("有効な入力でタスクを追加できる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "牛乳を買う");

      expect(screen.getByText("牛乳を買う")).toBeInTheDocument();
    });

    it("空白のみの入力は追加されず理由が表示される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "   ");

      expect(screen.getByRole("alert")).toHaveTextContent(
        "タスク名を入力してください。",
      );
    });

    it("100文字を超える入力は追加されず理由が表示される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "あ".repeat(101));

      expect(screen.getByRole("alert")).toHaveTextContent(
        "100文字以内で入力してください。",
      );
    });

    it("新規タスクは作成順で末尾に追加される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "1番目");
      await addTask(user, "2番目");

      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("1番目");
      expect(items[1]).toHaveTextContent("2番目");
    });
  });

  // ============================================
  // US2: 完了状態の切替
  // ============================================
  describe("US2: 完了切替", () => {
    it("タスクの完了状態を切り替えられる", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "掃除する");
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("完了切替後も表示順は作成順のまま維持される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "A");
      await addTask(user, "B");
      await addTask(user, "C");

      // 先頭タスクを完了にする
      await user.click(screen.getAllByRole("checkbox")[0]);

      const items = screen.getAllByRole("listitem");
      expect(items[0]).toHaveTextContent("A");
      expect(items[1]).toHaveTextContent("B");
      expect(items[2]).toHaveTextContent("C");
    });
  });

  // ============================================
  // US3: 削除（確認付き）
  // ============================================
  describe("US3: 削除", () => {
    it("確認を承認すると対象タスクのみ削除される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "残すタスク");
      await addTask(user, "消すタスク");

      await user.click(
        screen.getByRole("button", { name: "「消すタスク」を削除する" }),
      );
      const dialog = screen.getByRole("dialog");
      await user.click(
        within(dialog).getByRole("button", { name: "削除する" }),
      );

      expect(screen.queryByText("消すタスク")).not.toBeInTheDocument();
      expect(screen.getByText("残すタスク")).toBeInTheDocument();
    });

    it("確認をキャンセルすると一覧は変更されない", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "消さないタスク");

      await user.click(
        screen.getByRole("button", { name: "「消さないタスク」を削除する" }),
      );
      const dialog = screen.getByRole("dialog");
      await user.click(
        within(dialog).getByRole("button", { name: "キャンセル" }),
      );

      expect(screen.getByText("消さないタスク")).toBeInTheDocument();
    });

    it("最後の1件を削除すると空状態が表示される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      await addTask(user, "最後のタスク");

      await user.click(
        screen.getByRole("button", { name: "「最後のタスク」を削除する" }),
      );
      const dialog = screen.getByRole("dialog");
      await user.click(
        within(dialog).getByRole("button", { name: "削除する" }),
      );

      expect(
        screen.getByText(
          "タスクはまだありません。最初のタスクを追加しましょう。",
        ),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // FR-009: リロードで初期化
  // ============================================
  describe("FR-009: リロード初期化", () => {
    it("再マウント（リロード相当）で状態が初期化される", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<TodoApp />);

      await addTask(user, "セッション限定タスク");
      expect(screen.getByText("セッション限定タスク")).toBeInTheDocument();

      // フルリロード相当: アンマウントして新しいインスタンスを描画
      unmount();
      render(<TodoApp />);

      expect(
        screen.queryByText("セッション限定タスク"),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "タスクはまだありません。最初のタスクを追加しましょう。",
        ),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // SC-002: 操作反映が1秒以内
  // ============================================
  describe("SC-002: 反映レイテンシ", () => {
    it("タスク追加が1秒以内に一覧へ反映される", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const start = performance.now();
      await addTask(user, "高速反映タスク");
      const elapsed = performance.now() - start;

      expect(screen.getByText("高速反映タスク")).toBeInTheDocument();
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
