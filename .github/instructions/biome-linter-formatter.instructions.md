---
applyTo: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx, biome.json"
description: "Biome linter and formatter guidelines for code quality"
---

# Biome Linter / Formatter ガイドライン

Biome は高速でオールインワンの JavaScript/TypeScript ツールチェーンです。このプロジェクトでは Biome を Linter / Formatter として使用しています。

## 基本方針

- **高速**: Rust で実装されており、ESLint + Prettier より大幅に高速
- **オールインワン**: Linter と Formatter が統合されており、設定がシンプル
- **ゼロコンフィグ**: 合理的なデフォルト設定で、追加設定なしで利用可能

## CLI コマンド

### 基本コマンド

```bash
# Lint + Format のチェック（エラーがあれば報告）
pnpm exec biome check

# Lint + Format のチェック + 自動修正
pnpm exec biome check --write

# ステージファイルのみチェック + 自動修正
pnpm exec biome check --staged --write

# 特定のファイルをチェック
pnpm exec biome check src/app/page.tsx

# フォーマットのみ実行
pnpm exec biome format --write

# Lint のみ実行
pnpm exec biome lint
```

### 主要オプション

| オプション | 説明 |
|-----------|------|
| `--write` | 自動修正を適用 |
| `--staged` | Git でステージされたファイルのみを対象 |
| `--changed` | Git で変更されたファイルのみを対象 |
| `--config-path=<path>` | 設定ファイルのパスを指定 |

## 設定ファイル (`biome.json`)

### 基本構成

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```

### ルール設定

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "complexity": {
        "noUselessFragments": "warn"
      },
      "correctness": {
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "noNonNullAssertion": "off"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  }
}
```

### ルールレベル

- `"error"` / `"on"`: エラーとして報告（CI でブロック）
- `"warn"`: 警告として報告（CI はブロックしない）
- `"off"`: ルールを無効化

## インラインでのルール無効化

### 特定の行を無効化

```typescript
// biome-ignore lint/suspicious/noExplicitAny: レガシーコードとの互換性のため
const legacyData: any = fetchLegacyData();
```

### 複数ルールを無効化

```typescript
// biome-ignore lint/style/useConst lint/suspicious/noConsole: デバッグ用
let debugValue = "test";
console.log(debugValue);
```

### 無効化コメントの書き方

```typescript
// ✅ 推奨: 理由を明記
// biome-ignore lint/suspicious/noExplicitAny: 外部 API のレスポンス型が不明なため

// ❌ 非推奨: 理由なし
// biome-ignore lint/suspicious/noExplicitAny
```

## Git Hooks との連携

### pre-commit フック

```bash
#!/bin/sh
# .husky/pre-commit

# ステージファイルのみを Biome でチェック + 自動修正
pnpm exec biome check --staged --write

# 自動修正されたファイルを再ステージ
git update-index --again
```

### 設計方針

- **lint-staged は不使用**: Biome の `--staged` オプションを直接使用
- **自動修正**: `--write` でフォーマットエラーを自動修正
- **再ステージ**: `git update-index --again` で修正ファイルを追加

## CI 環境での使用

### GitHub Actions

```yaml
- name: Run Biome
  run: pnpm exec biome check

# CI では --write を使わない（変更が発生するとエラーにすべき）
```

## VSCode 統合

### 推奨拡張機能

- **Biome** (`biomejs.biome`): リアルタイム Lint + Format

### 設定 (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## ベストプラクティス

### 1. エディタ保存時に自動フォーマット

- VSCode の `formatOnSave` を有効化し、コミット前の手動修正を不要に

### 2. CI でチェックのみ実行

- CI では `--write` を使わず、フォーマット違反をエラーとして検出

### 3. コミット前に自動修正

- `pre-commit` フックで `--staged --write` を実行し、修正をステージに含める

### 4. ルール無効化には理由を明記

- `biome-ignore` コメントには必ず理由を記載

## ESLint / Prettier からの移行

### 削除するファイル

- `.eslintrc.js` / `.eslintrc.json`
- `.prettierrc` / `.prettierrc.json`
- `.eslintignore` / `.prettierignore`

### 削除するパッケージ

```bash
pnpm remove eslint prettier eslint-config-prettier eslint-plugin-*
```

### Biome のインストール

```bash
pnpm add -D @biomejs/biome
pnpm exec biome init
```

## 参考リンク

- [Biome 公式ドキュメント](https://biomejs.dev/)
- [Biome CLI リファレンス](https://biomejs.dev/reference/cli/)
- [Biome ルール一覧](https://biomejs.dev/linter/rules/)
