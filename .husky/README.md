# husky による Git Hooks 管理

このドキュメントでは、husky を使用した Git Hooks の設定について解説します。

## 📚 目次

- [husky とは](#husky-とは)
- [なぜ Git Hooks を使うのか](#なぜ-git-hooks-を使うのか)
- [導入手順](#導入手順)
- [ファイル構成](#ファイル構成)
- [各フックの詳細](#各フックの詳細)
- [CI 環境での動作](#ci-環境での動作)
- [トラブルシューティング](#トラブルシューティング)
- [参考リンク](#参考リンク)

---

## husky とは

[husky](https://typicode.github.io/husky/) は、Git Hooks を簡単に管理できる npm パッケージです。

### Git Hooks とは

Git Hooks は、Git の特定のイベント（コミット、プッシュなど）が発生したときに自動的に実行されるスクリプトです。

```
git commit 実行
    ↓
pre-commit フックが自動実行
    ↓
フックが成功 → コミット完了
フックが失敗 → コミット中止
```

### husky を使うメリット

| 従来の方法 | husky を使う場合 |
|-----------|----------------|
| `.git/hooks/` に直接スクリプトを配置 | `.husky/` にスクリプトを配置 |
| Git で管理されない（`.git` は対象外） | Git で管理できる（チームで共有可能） |
| 各開発者が手動でセットアップ | `pnpm install` で自動セットアップ |

---

## なぜ Git Hooks を使うのか

### 問題: CI での失敗を減らしたい

```
開発者がコード変更
    ↓
git commit & push
    ↓
CI でリント・型チェック実行
    ↓
❌ エラー発見！
    ↓
修正して再度 push
    ↓
また CI 待ち...（時間の無駄）
```

### 解決: ローカルで事前チェック

```
開発者がコード変更
    ↓
git commit
    ↓
🔍 pre-commit フックでリントチェック
    ↓
✅ 問題なし → コミット成功
❌ 問題あり → コミット中止、即座に修正
    ↓
git push
    ↓
🔍 pre-push フックで型チェック
    ↓
CI（ほぼ確実に成功）
```

### メリット

1. **高速なフィードバック**: CI を待たずに問題を発見
2. **CI リソースの節約**: 明らかなエラーで CI を実行しない
3. **開発者体験の向上**: エラーを早期に発見・修正
4. **コード品質の向上**: チーム全体で一貫したチェックを実施

---

## 導入手順

このプロジェクトで行った husky の導入手順を説明します。

### Step 1: husky のインストール

```bash
pnpm add -D husky
```

### Step 2: package.json に prepare スクリプトを追加

```json
{
  "scripts": {
    "prepare": "node .husky/install.mjs"
  }
}
```

> **なぜ `husky` ではなく `node .husky/install.mjs` なのか？**
> 
> CI 環境や本番環境では husky のセットアップは不要です。
> `install.mjs` スクリプトで環境を判定し、必要な場合のみ husky を実行します。

### Step 3: .husky ディレクトリとフックを作成

```bash
# ディレクトリ作成
mkdir .husky

# install.mjs を作成（CI スキップ用）
# pre-commit フックを作成
# pre-push フックを作成
```

### Step 4: husky のセットアップ実行

```bash
pnpm run prepare
```

これで `.husky/_` ディレクトリに Git Hooks のエントリーポイントが生成されます。

---

## ファイル構成

```
.husky/
├── _/                  # husky が自動生成（Git Hooks のエントリーポイント）
├── install.mjs         # CI 環境でのスキップ処理
├── pre-commit          # コミット前に実行されるスクリプト
├── pre-push            # プッシュ前に実行されるスクリプト
└── README.md           # このドキュメント
```

### 各ファイルの役割

| ファイル | 役割 |
|---------|------|
| `_/` | husky が生成する Git Hooks のエントリーポイント。直接編集しない |
| `install.mjs` | 環境判定して husky のセットアップをスキップするかを決定 |
| `pre-commit` | コミット時に実行するコマンドを定義 |
| `pre-push` | プッシュ時に実行するコマンドを定義 |

---

## 各フックの詳細

### pre-commit フック

**実行タイミング**: `git commit` 実行時（コミットメッセージ入力前）

```sh
#!/bin/sh

# Biome でステージされたファイルをチェック・自動修正
pnpm biome check --staged --write

# 修正されたファイルを再度ステージに追加
git update-index --again
```

#### オプションの解説

| オプション | 説明 |
|-----------|------|
| `--staged` | ステージされたファイルのみを対象にする（高速） |
| `--write` | 検出した問題を自動修正する |

#### なぜ `git update-index --again` が必要か

```
1. ファイルをステージ（git add）
2. pre-commit で --write により自動修正
3. 修正されたファイルはワーキングディレクトリにあるが、ステージには反映されていない
4. git update-index --again で修正内容をステージに追加
5. 修正された内容でコミットが完了
```

### pre-push フック

**実行タイミング**: `git push` 実行時（リモートへの送信前）

```sh
#!/bin/sh

# TypeScript の型チェック
pnpm type-check
```

#### なぜ型チェックは pre-push なのか

| チェック | 対象 | 実行時間 | 推奨タイミング |
|---------|------|---------|---------------|
| リント・フォーマット | ステージファイルのみ | 高速（〜数秒） | pre-commit |
| 型チェック | 全ファイル | 遅い（〜数十秒） | pre-push |
| ビルド | 全ファイル | 非常に遅い | CI のみ |

コミットは頻繁に行うため、高速なチェックのみを実行します。
型チェックは全ファイルが対象となるため、プッシュ前に実行します。

---

## CI 環境での動作

### install.mjs の仕組み

```javascript
// CI 環境または本番環境では husky のインストールをスキップ
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}

const husky = (await import("husky")).default;
console.log(husky());
```

### 環境変数の判定

| 環境変数 | 値 | 動作 |
|---------|-----|------|
| `CI` | `"true"` | husky セットアップをスキップ |
| `NODE_ENV` | `"production"` | husky セットアップをスキップ |
| 上記以外 | - | 通常通り husky をセットアップ |

### GitHub Actions での動作

GitHub Actions では自動的に `CI=true` が設定されるため、
`pnpm install` 実行時に husky のセットアップはスキップされます。

```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
  # CI=true のため、husky セットアップはスキップされる
```

---

## トラブルシューティング

### フックが実行されない

**原因 1**: husky がセットアップされていない

```bash
# 解決方法
pnpm run prepare
```

**原因 2**: フックファイルに実行権限がない

```bash
# 解決方法
chmod +x .husky/pre-commit .husky/pre-push
```

### pre-commit でエラーが出る

**原因**: Biome のリントエラー

```bash
# エラー内容を確認
pnpm lint

# 自動修正を試す
pnpm format
```

### 緊急時にフックをスキップしたい

```bash
# --no-verify オプションでフックをスキップ
git commit --no-verify -m "緊急修正"
git push --no-verify
```

> ⚠️ **注意**: 通常はフックをスキップしないでください。
> CI で失敗する可能性が高くなります。

### 新しく clone した後にフックが動かない

```bash
# 依存関係をインストールすると自動的にセットアップされる
pnpm install
```

---

## Biome の --staged オプションについて

このプロジェクトでは `lint-staged` パッケージを使用せず、
Biome の `--staged` オプションを直接使用しています。

### 従来の方法（lint-staged を使用）

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["biome check --write"]
  }
}
```

```sh
# .husky/pre-commit
npx lint-staged
```

### このプロジェクトの方法（Biome の --staged を使用）

```sh
# .husky/pre-commit
pnpm biome check --staged --write
```

### メリット

| 項目 | lint-staged 使用 | Biome --staged 使用 |
|------|-----------------|-------------------|
| 依存関係 | husky + lint-staged | husky のみ |
| 設定ファイル | package.json に追加設定 | 不要 |
| 複雑さ | やや複雑 | シンプル |

Biome が `--staged` オプションをネイティブでサポートしているため、
追加のパッケージなしでステージファイルのみをチェックできます。

---

## 参考リンク

- [husky 公式ドキュメント](https://typicode.github.io/husky/)
- [Biome 公式ドキュメント](https://biomejs.dev/)
- [Biome VCS 統合ガイド](https://biomejs.dev/guides/integrate-in-vcs/)
- [Git Hooks について（Git 公式）](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA-Git-%E3%83%95%E3%83%83%E3%82%AF)

---

## まとめ

| フック | タイミング | 実行内容 | 目的 |
|--------|-----------|---------|------|
| `pre-commit` | コミット前 | Biome リント + 自動修正 | フォーマット・コード品質の保証 |
| `pre-push` | プッシュ前 | TypeScript 型チェック | 型安全性の保証 |

この設定により、CI に到達する前にほとんどの問題を検出・修正できます。
開発者はより高速なフィードバックを得られ、CI の実行時間とリソースを節約できます。
