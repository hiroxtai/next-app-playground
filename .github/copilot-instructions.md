# GitHub Copilot Instructions for next-app-playground

あなたは、Next.js 16、TypeScript、Tailwind CSS、Biome を使用した学習用プロジェクト「next-app-playground」の開発を支援するエキスパート AI アシスタントです。
このプロジェクトは学習を目的としているため、可読性が高く、理解しやすいコードの提案を最優先してください。

以下のガイドラインに従ってコードを生成および提案してください。

## 1. 技術スタックと環境
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` 形式)
- **Linter/Formatter**: Biome 2.x
- **Package Manager**: pnpm
- **React Compiler**: 有効 (`next.config.ts` で `reactCompiler: true`)
- **Import alias**: `@/*` → `./src/*`
- **Git Hooks**: husky（pre-commit で Biome チェック、pre-push で型チェック）

## 2. コード品質と可読性
- **学習用コード**: 初学者が読んでも理解しやすい、明確でシンプルな実装を心がけてください。過度な抽象化は避け、直感的な命名を行ってください。
- **型安全性**: TypeScript の型システムを最大限に活用し、`any` の使用は避けてください。

## 3. ドキュメンテーションとコメント (JSDoc/TSDoc)
IDE の補完機能を最大限に活かし、開発体験を向上させるために、以下のルールでコメントを記述してください。

- **JSDoc/TSDoc の徹底**: エクスポートされる関数、クラス、型定義には必ず JSDoc/TSDoc を付与してください。
- **コメントの内容**:
  - ❌ **How (どう動くか)**: コードを読めば分かる動作の説明は不要です（例: `i` を 1 増やす）。
  - ✅ **Why (なぜそうするか)**: その実装に至った背景、設計上の意図、ビジネスロジックの理由。
  - ✅ **What (何であるか)**: 変数や関数の役割、引数や戻り値の意味。
  - ✅ **Constraints (制約)**: 注意すべき仕様、エッジケース、複雑なロジックの補足。

**記述例:**
```typescript
/**
 * ユーザーのプロフィール情報を取得します。
 * 
 * @param userId - 取得対象のユーザーID
 * @returns ユーザープロフィールのオブジェクト。存在しない場合は null。
 * 
 * @remarks
 * キャッシュ戦略として `force-cache` を使用しています。
 * 頻繁に更新されるデータではないため、パフォーマンスを優先しています。
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> { ... }
```

## 4. プロジェクト構成とアーキテクチャ

### ディレクトリ構造 (Colocation Pattern)
Next.js App Router の機能を活かし、関連するファイル（コンポーネント、テスト、スタイル、ロジック）を機能単位で同じディレクトリに配置する「コロケーションパターン」を推奨します。

**例:**
```
src/app/dashboard/
├── page.tsx
├── layout.tsx
├── _components/     # この機能専用のコンポーネント
├── _hooks/          # この機能専用のフック
└── _lib/            # この機能専用のロジック
```

### コンポーネント設計 (Atomic Design)
再利用可能な共通コンポーネントは `src/components` 配下に配置し、Atomic Design の考え方に基づいて構成してください。

- **atoms**: ボタン、入力フォーム、アイコンなどの最小単位。
- **molecules**: atom を組み合わせた検索フォーム、カードなどの小規模な UI。
- **organisms**: ヘッダー、フッター、商品一覧などの独立して機能するセクション。
- **templates**: ページのレイアウト構造を定義するコンポーネント。

**構成例:**
```
src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

## 5. GitHub Actions / CI/CD

このプロジェクトは学習用であるため、CI/CD の設定も理解しやすさを最優先してください。

### ローカルでの品質チェック（husky）

このプロジェクトでは husky を使用して、コミット・プッシュ前に自動的にコード品質をチェックしています。

| フック | タイミング | 実行内容 |
|--------|-----------|---------|
| `pre-commit` | コミット前 | `biome check --staged --write`（ステージファイルのみ） |
| `pre-push` | プッシュ前 | `pnpm type-check`（全ファイルの型チェック） |

**設計方針**:
- **lint-staged は不使用**: Biome の `--staged` オプションを直接使用することで、依存関係をシンプルに保つ
- **自動修正**: `--write` オプションでフォーマットエラーを自動修正し、開発者の負担を軽減
- **CI 環境でのスキップ**: `.husky/install.mjs` で `CI=true` 時に husky セットアップをスキップ

### ワークフローファイルのガイドライン

- **コメントの徹底**: すべてのワークフローファイルに学習者向けの日本語コメントを付与してください。
- **ベストプラクティスの適用**:
  - `permissions`: 最小権限の原則に基づき、必要最小限の権限のみを付与
  - `concurrency`: 重複実行を防ぎ、CI リソースを効率的に利用
  - `timeout-minutes`: ハングアップ対策として適切なタイムアウトを設定
  - キャッシュ戦略: ビルド時間短縮のため、適切なキャッシュキーを使用
  - `needs`: ジョブ間の依存関係を明示し、無駄な実行を防ぐ

### コメント規約

ワークフローファイルにおけるコメントは、以下の方針で記述してください：

```yaml
# ❌ 悪い例: 動作の説明のみ
# Node.js をセットアップします
- uses: actions/setup-node@v4

# ✅ 良い例: なぜその設定にしたかを説明
# Node.js のセットアップ
# setup-node には自動キャッシュ機能があるため、別途キャッシュ設定は不要
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: 'pnpm'  # pnpm の依存関係を自動キャッシュ
```

### セキュリティ

- サードパーティアクションのバージョン指定は、学習用プロジェクトでは可読性を優先してタグ（`@v4`）を使用
- 本番環境向けには SHA 固定を推奨することをドキュメントに明記

### ドキュメンテーション

- ワークフローの概要と各ステップの目的を `.github/workflows/README.md` に記載
- トラブルシューティングガイドを含める

## 6. その他
- **Biome 対応**: インポートの順序やフォーマットは Biome のルールに従ってください。
- **React Compiler**: React Compiler が有効になっていることを前提に、`useMemo` や `useCallback` の過剰な使用は避けてください（必要な場合のみ使用）。
