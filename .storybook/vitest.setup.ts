/**
 * Storybook + Vitest 統合のセットアップファイル
 *
 * @remarks
 * このファイルは Storybook の Story を Vitest でテストする際に使用されます。
 * Portable Stories 機能により、Story をテストケースとして再利用できます。
 *
 * 主な機能:
 * - Story のレンダリング設定の適用
 * - アクセシビリティ（a11y）アドオンの統合
 * - preview.ts の設定の適用
 *
 * @see https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest
 */
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import * as projectAnnotations from "./preview";

/**
 * プロジェクト全体の Story 設定を適用
 *
 * @remarks
 * 以下の設定が Story テスト時に適用されます:
 * - a11yAddonAnnotations: アクセシビリティチェックの設定
 * - projectAnnotations: preview.ts で定義した設定（Tailwind CSS など）
 */
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
