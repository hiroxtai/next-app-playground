/**
 * 共通コンポーネントのエクスポート
 *
 * @remarks
 * このファイルは src/components 配下のすべてのコンポーネントを
 * 一箇所からエクスポートするバレルファイルです。
 *
 * ## ディレクトリ構造
 *
 * ```
 * src/components/
 * ├── ui/           # shadcn/ui コンポーネント（自動生成）
 * ├── theme-*.tsx   # テーマ関連コンポーネント
 * ├── molecules/    # 複合コンポーネント（今後追加予定）
 * ├── organisms/    # 独立したセクション（今後追加予定）
 * └── templates/    # ページレイアウト（今後追加予定）
 * ```
 *
 * @example
 * ```tsx
 * // shadcn/ui コンポーネントのインポート
 * import { Button, Card, Input } from '@/components/ui/button';
 *
 * // または個別にインポート
 * import { Button } from '@/components/ui/button';
 * import { Card } from '@/components/ui/card';
 * ```
 */

// Theme（テーマ関連）
export { ThemeProvider } from "./theme-provider";
export { ThemeToggle } from "./theme-toggle";

// UI コンポーネント（shadcn/ui）
// 注: shadcn/ui コンポーネントは @/components/ui/[component] から
// 個別にインポートすることを推奨します。

// Molecules（分子）- 今後追加予定
// export * from './molecules';

// Organisms（生体）- 今後追加予定
// export * from './organisms';

// Templates（テンプレート）- 今後追加予定
// export * from './templates';
