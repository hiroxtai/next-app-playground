import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppBreadcrumb } from "./app-breadcrumb";

describe("AppBreadcrumb", () => {
  it("renders intermediate items as links and the last item as the current page", () => {
    render(
      <AppBreadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "カタログ", href: "/catalog" },
          { label: "UI基礎" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "カタログ" })).toHaveAttribute(
      "href",
      "/catalog",
    );

    const currentPage = screen.getByText("UI基礎");
    expect(currentPage).toHaveAttribute("aria-current", "page");
    expect(
      screen.queryByRole("link", { name: "UI基礎" }),
    ).not.toBeInTheDocument();
  });

  it("treats the last item as current page even when href is provided", () => {
    render(
      <AppBreadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "現在地", href: "/should-not-be-link" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "ホーム" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.queryByRole("link", { name: "現在地" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("現在地")).toHaveAttribute("aria-current", "page");
  });
});
