/**
 * 共通コンポーネントのエクスポート
 *
 * @remarks
 * このファイルは src/components 配下のすべてのコンポーネントを
 * 一箇所からエクスポートするバレルファイルです。
 *
 * ## Atomic Design 構造
 *
 * ```
 * src/components/
 * ├── atoms/       # 最小単位（ボタン、入力など）
 * ├── molecules/   # Atom の組み合わせ（検索フォームなど）
 * ├── organisms/   # 独立したセクション（ヘッダーなど）
 * └── templates/   # ページレイアウト
 * ```
 *
 * @example
 * ```tsx
 * // 単一のインポートで複数のコンポーネントを使用
 * import { Button } from '@/components';
 *
 * // または階層を指定してインポート
 * import { Button } from '@/components/atoms';
 * ```
 */

// Atoms（原子）
export * from "./atoms";

// Molecules（分子）- 今後追加予定
// export * from './molecules';

// Organisms（生体）- 今後追加予定
// export * from './organisms';

// Templates（テンプレート）- 今後追加予定
// export * from './templates';
