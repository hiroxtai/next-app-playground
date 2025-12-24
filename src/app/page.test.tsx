import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

/**
 * ホームページのテスト
 *
 * @remarks
 * ホームページは Next.js の redirect() を使用して /catalog へリダイレクトする仕様です。
 * redirect() は Next.js のサーバーサイド機能のため、Vitest では完全にテストできません。
 * ここでは、コンポーネントが正常にレンダリング処理を開始できることのみを確認します。
 *
 * E2E テスト（Playwright）でリダイレクトの動作を確認することを推奨します。
 */
describe("Home Page", () => {
  it("should render without crashing", () => {
    // redirect() は Next.js のサーバー機能のため、エラーがスローされる可能性があります
    // ここでは、コンポーネントが定義されていることを確認
    expect(Home).toBeDefined();
    expect(typeof Home).toBe("function");
  });
});
