/**
 * Storybook のメイン設定ファイル
 *
 * @remarks
 * このファイルでは、Storybook の動作に関する主要な設定を定義します。
 *
 * - stories: Story ファイルの場所を指定
 * - addons: 使用するアドオン（拡張機能）を指定
 * - framework: 使用するフレームワーク（Next.js + Vite）
 * - staticDirs: 静的ファイル（画像など）のディレクトリ
 *
 * @see https://storybook.js.org/docs/configure
 */
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  /**
   * Story ファイルのパスパターン
   *
   * @remarks
   * - `*.mdx`: MDX 形式のドキュメント
   * - `*.stories.tsx`: Component Story Format (CSF) 形式の Story
   *
   * このパターンにより、src ディレクトリ内のすべての Story が自動的に読み込まれます。
   * コロケーションパターンに従い、コンポーネントと同じディレクトリに Story を配置できます。
   */
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  /**
   * Storybook アドオン（拡張機能）
   *
   * @remarks
   * 各アドオンの役割:
   * - @chromatic-com/storybook: Chromatic（ビジュアルリグレッションテスト）との統合
   * - @storybook/addon-vitest: Vitest でのテスト実行をサポート
   * - @storybook/addon-a11y: アクセシビリティ（a11y）チェック機能
   * - @storybook/addon-docs: 自動ドキュメント生成（autodocs）
   * - @storybook/addon-themes: ダークモード切替（Light/Dark）
   * - @storybook/addon-onboarding: 初回起動時のチュートリアル
   */
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-onboarding",
  ],

  /**
   * 使用するフレームワーク
   *
   * @remarks
   * `@storybook/nextjs-vite` は Next.js + Vite ベースのフレームワークです。
   * Webpack 版（@storybook/nextjs）より高速に動作します。
   *
   * Next.js の機能（next/image, next/navigation など）は自動的にサポートされます。
   */
  framework: "@storybook/nextjs-vite",

  /**
   * 静的ファイルのディレクトリ
   *
   * @remarks
   * public ディレクトリの画像やフォントを Storybook でも使用できるようにします。
   */
  staticDirs: ["../public"],
};

export default config;
