---
applyTo: ".husky/*, .github/workflows/*"
description: "Git hooks configuration with husky for code quality automation"
---

# Git Hooks (husky) ガイドライン

husky は Git Hooks を簡単に設定できるツールです。このプロジェクトでは、コミット・プッシュ前に自動的にコード品質をチェックしています。

## 基本方針

- **ローカルでの高速チェック**: コミット前に最小限のチェックを実行
- **lint-staged は不使用**: Biome の `--staged` オプションを直接使用
- **自動修正**: フォーマットエラーは自動修正し、開発者の負担を軽減
- **CI 環境でのスキップ**: GitHub Actions では husky を無効化

## フック構成

| フック | タイミング | 実行内容 |
|--------|-----------|---------|
| `pre-commit` | コミット前 | `biome check --staged --write` |
| `pre-push` | プッシュ前 | `pnpm type-check` |

## フックの実装

### pre-commit フック

```bash
#!/bin/sh
# .husky/pre-commit

# ========================================
# pre-commit フック
# ========================================
#
# 【実行内容】
# Biome によるステージファイルの Lint + Format を実行します。
#
# 【なぜこのチェックが必要か】
# - コミット前にコード品質を担保
# - フォーマットエラーを自動修正
# - CI の実行時間を短縮
# ========================================

pnpm exec biome check --staged --write

# 自動修正されたファイルを再ステージ
git update-index --again
```

### pre-push フック

```bash
#!/bin/sh
# .husky/pre-push

# ========================================
# pre-push フック
# ========================================
#
# 【実行内容】
# TypeScript の型チェックを実行します。
#
# 【なぜこのチェックが必要か】
# - プッシュ前に型エラーを検出
# - リモートリポジトリへの破壊的変更を防止
# - CI の失敗を事前に防ぐ
# ========================================

pnpm type-check
```

## CI 環境でのスキップ

### install.mjs

```javascript
// .husky/install.mjs

// CI 環境では husky のセットアップをスキップ
// GitHub Actions では HUSKY=0 が設定される
if (process.env.CI === "true") {
  process.exit(0);
}

// ローカル環境では husky をセットアップ
const husky = (await import("husky")).default;
husky();
```

### package.json

```json
{
  "scripts": {
    "prepare": "node .husky/install.mjs"
  }
}
```

### GitHub Actions での無効化

```yaml
# .github/workflows/ci.yml
env:
  HUSKY: 0  # Git hooks を無効化
```

## ローカル vs CI の役割分担

| チェック項目 | ローカル (husky) | CI (GitHub Actions) |
|------------|-----------------|---------------------|
| フォーマット | ✅ ステージファイルのみ | ✅ 全ファイル |
| リント | ✅ ステージファイルのみ | ✅ 全ファイル |
| 型チェック | ✅ 全ファイル | ✅ 全ファイル |
| 単体テスト | ❌ | ✅ 全テスト |
| E2E テスト | ❌ | ✅ 全テスト |
| ビルド | ❌ | ✅ 本番ビルド |

## フック追加方法

### 新規フック作成

```bash
# 新しいフックを作成
echo "npm test" > .husky/pre-commit

# または手動でファイルを作成
```

### フックの権限設定

```bash
# 実行権限を付与
chmod +x .husky/pre-commit
```

## トラブルシューティング

### フックが実行されない

```bash
# husky を再インストール
pnpm run prepare

# Git hooks ディレクトリを確認
git config core.hooksPath
```

### フックをスキップしたい場合

```bash
# 一時的にフックをスキップ
git commit --no-verify -m "WIP: 作業中"
git push --no-verify
```

### 自動修正が適用されない

- `git update-index --again` が pre-commit フックに含まれているか確認
- `--write` オプションが指定されているか確認

### CI で husky がインストールされる

- `.husky/install.mjs` が正しく設定されているか確認
- `CI=true` 環境変数が設定されているか確認

## ベストプラクティス

### 1. フックのコメント

```bash
# ✅ 推奨: なぜこのチェックが必要かを説明
# 【なぜこのチェックが必要か】
# - コミット前にコード品質を担保
# - フォーマットエラーを自動修正

# ❌ 非推奨: 動作の説明のみ
# Biome を実行します
```

### 2. 高速化

```bash
# ✅ 推奨: --staged でステージファイルのみチェック
pnpm exec biome check --staged --write

# ❌ 非推奨: 全ファイルをチェック（遅い）
pnpm exec biome check --write
```

### 3. テスト用フック

```bash
#!/bin/sh
# フックのテスト時は exit 1 でコミットを中止

pnpm exec biome check --staged --write

# テスト中: コミットを中止
exit 1
```

### 4. ブランチ固有のチェック

```bash
#!/bin/sh
# ブランチに応じてチェック内容を変更

branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch" = "main" ]; then
  echo "Running strict checks for main branch..."
  pnpm exec biome check --staged --write
  pnpm type-check
else
  echo "Running basic checks..."
  pnpm exec biome check --staged --write
fi
```

## 参考リンク

- [husky 公式ドキュメント](https://typicode.github.io/husky/)
- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Biome CLI リファレンス](https://biomejs.dev/reference/cli/)
