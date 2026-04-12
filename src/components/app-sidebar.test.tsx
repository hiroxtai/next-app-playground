import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { categories } from "@/app/_lib/catalog-data";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: usePathnameMock,
}));

vi.mock("./theme-toggle", () => ({
  ThemeToggle: function ThemeToggleMock() {
    return null;
  },
}));

function renderAppSidebar(pathname: string) {
  usePathnameMock.mockReturnValue(pathname);

  return render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>,
  );
}

describe("AppSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders top-level navigation links", () => {
    renderAppSidebar("/");

    expect(screen.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: "すべてのページ" }),
    ).toHaveAttribute("href", "/catalog");
  });

  it("renders one category link for each catalog category", () => {
    renderAppSidebar("/");

    for (const category of categories) {
      expect(
        screen.getByRole("link", { name: category.label }),
      ).toHaveAttribute("href", `/catalog/category/${category.id}`);
    }
  });

  it("marks the catalog index link as active on /catalog", () => {
    renderAppSidebar("/catalog");

    expect(
      screen.getByRole("link", { name: "すべてのページ" }),
    ).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  it("marks the current category link as active", () => {
    const activeCategory = categories[0];
    renderAppSidebar(`/catalog/category/${activeCategory.id}`);

    expect(
      screen.getByRole("link", { name: activeCategory.label }),
    ).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("link", { name: "すべてのページ" }),
    ).toHaveAttribute("data-active", "false");
  });
});
