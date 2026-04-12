import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";
import Home from "./page";

/**
 * ホームページのテスト
 *
 * @remarks
 * ダッシュボード風ランディングページのレンダリングをテストします。
 * ヒーローセクション、統計情報、カテゴリ一覧など主要な要素が
 * 正しく表示されることを確認します。
 *
 * ThemeToggle コンポーネントが next-themes の useTheme を使用するため、
 * ThemeProvider でラップしてレンダリングします。
 */
describe("Home Page", () => {
  /**
   * テスト用のレンダリングヘルパー
   * ThemeProvider で Home コンポーネントをラップして描画する
   */
  function renderHome() {
    return render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Home />
      </ThemeProvider>,
    );
  }

  it("should render the hero heading", () => {
    renderHome();
    expect(screen.getByText("楽しく学ぼう")).toBeInTheDocument();
  });

  it("should render the catalog link", () => {
    renderHome();
    expect(
      screen.getByRole("link", { name: "カタログを見る" }),
    ).toHaveAttribute("href", "/catalog");
  });

  it("should render the stats section", () => {
    renderHome();
    // 統計セクションに各ラベルが表示されていることを確認
    // 「サンプルページ」はセクション見出しにも使われるため getAllByText を使用
    expect(screen.getAllByText("サンプルページ").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("カテゴリ")).toBeInTheDocument();
    expect(screen.getByText("初級ページ")).toBeInTheDocument();
  });

  it("should render all category labels", () => {
    renderHome();
    const expectedLabels = [
      "UI基礎",
      "レイアウト",
      "アニメーション",
      "React Hooks",
      "Next.js機能",
      "状態管理",
      "AI",
    ];
    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
