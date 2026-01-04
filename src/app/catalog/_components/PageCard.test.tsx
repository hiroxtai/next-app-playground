import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PageInfo } from "@/app/_lib/catalog-data";
import PageCard from "./PageCard";

/**
 * PageCard コンポーネントのテスト
 *
 * @remarks
 * Atomic Design の molecules レベルのコンポーネントとして、
 * props を受け取って正しくレンダリングできるかをテストします。
 */
describe("PageCard Component", () => {
  /**
   * 基本的なレンダリングテスト
   * タイトルと説明文が正しく表示されることを確認
   */
  it("should render page title and description", () => {
    const mockPage: PageInfo = {
      id: "test-page",
      title: "テストページ",
      description: "これはテストページの説明文です",
      category: "ui-basics",
      difficulty: "初級",
    };

    render(<PageCard page={mockPage} examplePath="/examples/test/test-page" />);

    // タイトルが表示されていることを確認
    expect(screen.getByText("テストページ")).toBeInTheDocument();

    // 説明文が表示されていることを確認
    expect(
      screen.getByText("これはテストページの説明文です"),
    ).toBeInTheDocument();
  });

  /**
   * 難易度バッジのテスト
   * 各難易度レベルで正しいテキストが表示されることを確認
   */
  it.each([
    ["初級"],
    ["中級"],
    ["上級"],
  ] as const)("should render difficulty badge for %s", (difficulty) => {
    const mockPage: PageInfo = {
      id: "test-page",
      title: "テストページ",
      description: "説明文",
      category: "ui-basics",
      difficulty,
    };

    render(<PageCard page={mockPage} examplePath="/examples/test/test-page" />);

    expect(screen.getByText(difficulty)).toBeInTheDocument();
  });

  /**
   * タグ表示のテスト
   * タグが存在する場合、すべてのタグが表示されることを確認
   */
  it("should render all tags when provided", () => {
    const mockPage: PageInfo = {
      id: "test-page",
      title: "テストページ",
      description: "説明文",
      category: "ui-basics",
      difficulty: "初級",
      tags: ["React", "TypeScript", "Next.js"],
    };

    render(<PageCard page={mockPage} examplePath="/examples/test/test-page" />);

    // すべてのタグが表示されていることを確認
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  /**
   * タグなしの場合のテスト
   * タグが未定義の場合でもエラーなくレンダリングできることを確認
   */
  it("should render without tags when not provided", () => {
    const mockPage: PageInfo = {
      id: "test-page",
      title: "テストページ",
      description: "説明文",
      category: "ui-basics",
      difficulty: "初級",
      // tags プロパティを省略
    };

    const { container } = render(
      <PageCard page={mockPage} examplePath="/examples/test/test-page" />,
    );

    // タグなしでもエラーなくレンダリングできることを確認
    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * リンクのテスト
   * 「開く」ボタンが正しいパスを指していることを確認
   */
  it("should render link with correct path", () => {
    const mockPage: PageInfo = {
      id: "test-page",
      title: "テストページ",
      description: "説明文",
      category: "ui-basics",
      difficulty: "初級",
    };

    const examplePath = "/examples/ui-basics/test-page";
    render(<PageCard page={mockPage} examplePath={examplePath} />);

    // 「ページを開く」リンクが存在することを確認
    const link = screen.getByRole("link", { name: "ページを開く" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", examplePath);
  });

  /**
   * カテゴリアイコンのテスト
   * 各カテゴリに対応する絵文字が表示されることを確認
   */
  it.each([
    ["ui-basics", "🎨"],
    ["layout", "📐"],
    ["animation", "✨"],
    ["react-hooks", "⚛️"],
    ["next-features", "🚀"],
  ] as const)("should render category icon for %s category", (category, expectedIcon) => {
    const mockPage: PageInfo = {
      id: "test-page",
      title: "テストページ",
      description: "説明文",
      category,
      difficulty: "初級",
    };

    const { container } = render(
      <PageCard page={mockPage} examplePath="/examples/test/test-page" />,
    );

    // 絵文字が含まれていることを確認
    expect(container.textContent).toContain(expectedIcon);
  });
});
