# Next.js Playground

このプロジェクトは学習用の Next.js Playground です。最新の Next.js の機能を試したり、実装パターンを学ぶために使用します。

🌐 **デプロイ先**: https://next-app-playground-eight.vercel.app/

## プロジェクト作成コマンド

このプロジェクトは以下のコマンドで作成されました：

```bash
npx create-next-app@latest --use-pnpm
```

### プロジェクト作成時の選択内容

| 項目 | 選択 |
|------|------|
| Project name | `next-app-playground` |
| TypeScript | ✅ Yes |
| Linter | Biome |
| React Compiler | ✅ Yes |
| Tailwind CSS | ✅ Yes |
| `src/` directory | ✅ Yes |
| App Router | ✅ Yes (推奨) |
| Import alias | `@/*` (デフォルト) |

## 技術スタック

- **Next.js 16** - React フレームワーク
- **TypeScript** - 型安全な開発
- **Biome** - 高速な linter / formatter
- **React Compiler** - 最適化されたレンダリング
- **Tailwind CSS** - ユーティリティファーストの CSS フレームワーク
- **pnpm** - 高速で効率的なパッケージマネージャー

## ディレクトリ構造

```
next-app-playground/
├── src/
│   └── app/          # App Router のページとレイアウト
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/           # 静的ファイル
├── biome.json        # Biome の設定ファイル
├── next.config.ts    # Next.js の設定ファイル
├── tsconfig.json     # TypeScript の設定ファイル
└── tailwind.config.ts
```

## 開発環境のセットアップ

### 必要な環境

- Node.js 18.17 以上
- pnpm (推奨)

### インストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### その他のコマンド

```bash
# ビルド
pnpm build

# 本番環境の起動
pnpm start

# コードチェック（Biome）
pnpm lint
```

## コーディング規約

このプロジェクトでは **Biome** を使用してコードの品質を保っています。

- 保存時に自動フォーマットされるよう、エディタの設定を推奨
- Biome の設定は [biome.json](biome.json) で管理

## Vercel へのデプロイ

このプロジェクトは Vercel にデプロイされています。

**本番環境**: https://next-app-playground-eight.vercel.app/

### デプロイ設定

- `main` ブランチへのプッシュで自動デプロイ
- プレビュー環境は各 Pull Request で自動生成
- ビルドコマンド: `pnpm build`
- 出力ディレクトリ: `.next`

### デプロイ手順（初回）

1. [Vercel](https://vercel.com) にログイン
2. GitHub リポジトリを接続
3. プロジェクト設定を確認して Deploy
4. 自動デプロイが設定完了

詳細は [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## 学習リソース

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなチュートリアル
- [Next.js GitHub](https://github.com/vercel/next.js) - フィードバックや貢献を歓迎
- [Biome Documentation](https://biomejs.dev/) - Biome の使い方
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Tailwind CSS のドキュメント

## 学習目的

このプロジェクトでは以下の内容を学ぶことができます：

- App Router の基本的な使い方
- TypeScript と Next.js の統合
- Biome による効率的なコード管理
- React Compiler の活用
- Tailwind CSS を使ったスタイリング
- Vercel へのデプロイメント

## ライセンス

学習用プロジェクトのため、自由に使用・改変してください。
