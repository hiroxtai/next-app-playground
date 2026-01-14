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
   * カード全体がリンクとして正しいパスを指していることを確認
   *
   * @remarks
   * 新デザインでは、カード全体がリンクになっているため、
   * テキスト「詳細を見る」を含むリンクを確認します。
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

    // カード全体がリンクになっていることを確認
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", examplePath);
    // 「詳細を見る」テキストが含まれていることを確認
    expect(screen.getByText("詳細を見る")).toBeInTheDocument();
  });

  /**
   * カテゴリアイコンのテスト
   * 各カテゴリに対応する lucide-react アイコンが SVG として表示されることを確認
   *
   * @remarks
   * 新デザインでは、絵文字ではなく lucide-react の SVG アイコンを使用しています。
   * 各 SVG は aria-hidden="true" で、視覚的なデザイン要素として機能します。
   * lucide-react のアイコンは class="lucide lucide-{icon-name}" の形式を使用します。
   */
  it.each([
    ["ui-basics", "lucide-palette"],
    ["layout", "lucide-panels-top-left"], // Layout アイコンは lucide-panels-top-left として出力される
    ["animation", "lucide-sparkles"],
    ["react-hooks", "lucide-atom"],
    ["next-features", "lucide-rocket"],
  ] as const)("should render category icon for %s category", (category, expectedIconClass) => {
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

    // lucide-react アイコンの SVG が含まれていることを確認
    // lucide-react は class="lucide lucide-{icon}" 形式を使用
    const svgIcon = container.querySelector(`svg.lucide.${expectedIconClass}`);
    expect(svgIcon).toBeInTheDocument();
  });
});
