# GitHub Actions ワークフロー ドキュメント

このディレクトリには、プロジェクトの CI/CD を自動化する GitHub Actions ワークフローが含まれています。

## 📋 目次

- [ワークフロー一覧](#ワークフロー一覧)
- [各ワークフローの詳細](#各ワークフローの詳細)
- [ベストプラクティス解説](#ベストプラクティス解説)
- [Dependabot 設定](#dependabot-設定)
- [トラブルシューティング](#トラブルシューティング)

---

## ワークフロー一覧

| ワークフロー | トリガー | 目的 | 実行時間目安 |
|------------|---------|------|------------|
| [CI](#ci-ワークフロー) | Push to `main`, PR | コード品質チェックとビルド | 3-5分 |
| [Format Check](#format-check-ワークフロー) | PR のみ | コードフォーマットの検証 | 1-2分 |
| [Dependency Review](#dependency-review-ワークフロー) | PR のみ | 依存関係のセキュリティチェック | 1分以内 |

---

## 各ワークフローの詳細

### CI ワークフロー

**ファイル**: [`ci.yml`](./ci.yml)

#### 目的
コードの品質を保証し、本番環境にデプロイ可能な状態であることを確認します。

#### 実行内容

1. **Lint and Type Check ジョブ**
   - Biome によるコード品質チェック
   - TypeScript の型チェック
   - タイムアウト: 10分

2. **Build ジョブ**
   - Next.js アプリケーションのプロダクションビルド
   - ビルドキャッシュの利用（高速化）
   - ビルド成果物のアップロード（7日間保持）
   - タイムアウト: 15分
   - 依存関係: Lint and Type Check ジョブが成功した場合のみ実行

#### 主要な設定

```yaml
# セキュリティ: 最小権限の原則
permissions:
  contents: read

# 重複実行の制御
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### なぜこの構成？

- **ジョブの分離**: リント/型チェックとビルドを分けることで、問題の早期発見と並列実行による高速化を実現
- **needs による依存関係**: コード品質に問題がある場合、無駄なビルドを実行しない
- **キャッシュ戦略**: `.next/cache` をキャッシュすることで、ビルド時間を大幅に短縮

---

### Format Check ワークフロー

**ファイル**: [`format.yml`](./format.yml)

#### 目的
Pull Request で提案されたコードが、プロジェクトのフォーマット規約に準拠しているかを確認します。

#### 実行内容

1. Biome CI モードでフォーマットとリントをチェック
2. チェック失敗時、PR に自動でコメントを投稿

#### 主要な設定

```yaml
# PR へのコメント投稿に必要な権限
permissions:
  contents: read
  pull-requests: write
```

#### なぜこの構成？

- **PR 限定**: main ブランチは既にフォーマット済みなので、PR のみでチェック
- **自動コメント**: 開発者に修正方法を即座に伝え、フィードバックループを短縮
- **CI モード**: `biome ci` は修正せずにチェックのみを行うため、CI/CD に最適

#### 失敗時の対処方法

```bash
# ローカルでフォーマットを修正
pnpm format

# 変更をコミット
git add .
git commit -m "style: コードフォーマットを修正"
git push
```

---

### Dependency Review ワークフロー

**ファイル**: [`dependency-review.yml`](./dependency-review.yml)

#### 目的
Pull Request で追加・更新される依存関係に、既知のセキュリティ脆弱性がないかを確認します。

#### 実行内容

1. 依存関係の変更を分析
2. 脆弱性データベースと照合
3. 中程度以上の脆弱性が見つかった場合は失敗
4. 結果を PR にコメントで報告

#### 主要な設定

```yaml
fail-on-severity: moderate  # 中程度以上の脆弱性で失敗
comment-summary-in-pr: always  # 結果を常に PR にコメント
```

#### なぜこの構成？

- **プロアクティブなセキュリティ**: 脆弱性を本番環境に入れる前に検出
- **可視性**: PR コメントにより、レビュアーもセキュリティリスクを把握可能
- **moderate 基準**: critical/high はもちろん、moderate も検出することで高いセキュリティ水準を維持

---

## ベストプラクティス解説

### 1. permissions の設定

**なぜ重要？**

GitHub Actions のワークフローには、デフォルトで `GITHUB_TOKEN` が付与されます。このトークンが持つ権限を最小限にすることで、セキュリティリスクを低減できます。

**原則: 最小権限の原則 (Principle of Least Privilege)**

```yaml
# 悪い例: 権限を指定しない（デフォルトですべての権限が付与される可能性）
# permissions を記載しない

# 良い例: 必要最小限の権限のみを明示
permissions:
  contents: read  # リポジトリの読み取りのみ
```

**参考**: [GitHub Actions のセキュリティ強化](https://docs.github.com/ja/actions/security-guides/security-hardening-for-github-actions#permissions)

---

### 2. concurrency の設定

**なぜ重要？**

同じブランチで複数のコミットを連続して push すると、複数のワークフローが同時に実行されます。古い実行は無意味なため、キャンセルすることで CI リソースを節約できます。

**仕組み**

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- `group`: ワークフロー名とブランチ名で一意のグループを作成
- `cancel-in-progress: true`: 新しい実行が開始されたら、古い実行を自動キャンセル

**効果**

- ✅ CI 実行時間の短縮
- ✅ リソースの効率的な利用
- ✅ 最新のコードのみをテスト

**参考**: [ワークフローの並行性を管理する](https://docs.github.com/ja/actions/using-jobs/using-concurrency)

---

### 3. timeout-minutes の設定

**なぜ重要？**

ワークフローがハングアップ（応答なし）した場合、デフォルトでは 360 分（6時間）待機します。これは CI リソースの無駄であり、問題の発見を遅らせます。

**推奨値**

```yaml
jobs:
  lint-and-typecheck:
    timeout-minutes: 10  # 通常 2-3 分で完了するため、10 分で十分

  build:
    timeout-minutes: 15  # ビルドは時間がかかるため、余裕を持たせる
```

**効果**

- ✅ 問題の早期発見（ハングアップを素早く検知）
- ✅ CI リソースの節約
- ✅ 開発者への迅速なフィードバック

---

### 4. キャッシュ戦略

**Next.js ビルドキャッシュ**

```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
```

**キャッシュキーの構成**

1. `${{ runner.os }}`: OS が変わるとキャッシュを無効化
2. `${{ hashFiles('**/pnpm-lock.yaml') }}`: 依存関係が変更されたらキャッシュを無効化
3. `${{ hashFiles('**/*.js', ...) }}`: ソースコードが変更されたらキャッシュを無効化

**効果**

- ⚡ ビルド時間を 30-50% 短縮（初回ビルド後）
- 💰 CI 実行コストの削減

**注意**: `~/.npm` は pnpm では不要なので、含めていません。

---

### 5. アクションのバージョン指定

サードパーティのアクションを使用する際、バージョンの指定方法にはセキュリティ上の考慮が必要です。

```yaml
# タグによる指定（このプロジェクトで採用）
- uses: actions/checkout@v4

# SHA（コミットハッシュ）による指定（最も安全）
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

| 方式 | メリット | デメリット |
|------|----------|-----------|
| **タグ（@v4）** | 自動でマイナーアップデートを取得、可読性が高い | タグが書き換えられるリスク |
| **SHA** | 完全に固定され、改ざん不可能 | 手動での更新が必要、可読性が低い |

**このプロジェクトでの選択:**
学習用プロジェクトでは可読性を優先し、タグ指定を採用しています。GitHub の公式アクション（`actions/*`）は信頼性が高く、メジャーバージョンタグが安定しているためです。

**本番環境での推奨:**
セキュリティが最優先の場合は、SHA を使用し、コメントでバージョンを明記することを推奨します。Dependabot を使用すると、SHA 固定でも自動で更新 PR が作成されます。

---

### 6. ジョブの依存関係 (needs)

**なぜ使う？**

```yaml
jobs:
  lint-and-typecheck:
    # ...

  build:
    needs: lint-and-typecheck  # lint が成功しないと実行されない
```

**メリット**

1. **失敗の早期検出**: コード品質に問題があれば、ビルドせずに即座に失敗
2. **リソースの節約**: 無駄なビルドを実行しない
3. **明確なワークフロー**: 依存関係が視覚的にわかりやすい

---

## Dependabot 設定

**ファイル**: [`../.github/dependabot.yml`](../dependabot.yml)

### 目的

依存関係を最新に保ち、セキュリティパッチと機能改善を自動的に取り込みます。

### 設定内容

#### 1. GitHub Actions の自動更新

```yaml
- package-ecosystem: "github-actions"
  schedule:
    interval: "weekly"  # 毎週月曜日に実行
```

- ワークフローで使用しているアクション（`actions/checkout@v4` など）を最新版に更新
- セキュリティパッチの自動適用

#### 2. npm パッケージの自動更新

```yaml
- package-ecosystem: "npm"
  schedule:
    interval: "weekly"
  groups:
    dev-dependencies:
      patterns: ["@types/*", "@biomejs/*", "typescript"]
    production-dependencies:
      patterns: ["next", "react", "react-dom"]
```

**グループ化の利点**

- 📦 関連する依存関係を1つの PR にまとめる
- 🔍 レビューが容易になる
- ⚡ マージの手間を削減

**例**: TypeScript の型定義（`@types/*`）がすべて1つの PR で更新される

---

## トラブルシューティング

### ワークフローが失敗した場合

#### 1. Lint / Type Check の失敗

**症状**: "Run Biome lint" または "Type check" ステップが失敗

**対処方法**:

```bash
# ローカルで同じチェックを実行
pnpm lint
pnpm type-check

# エラーを修正後
git add .
git commit -m "fix: リントエラーを修正"
git push
```

#### 2. Build の失敗

**症状**: "Build Next.js application" ステップが失敗

**よくある原因**:

- TypeScript の型エラー
- 環境変数の不足
- ビルド時エラー（無効な import など）

**対処方法**:

```bash
# ローカルでビルドを実行して問題を確認
pnpm build

# エラーログを確認し、該当箇所を修正
```

#### 3. Format Check の失敗

**症状**: PR に「フォーマットが正しくありません」とコメントが付く

**対処方法**:

```bash
# 自動フォーマット
pnpm format

# 変更を確認
git diff

# コミット＆プッシュ
git add .
git commit -m "style: コードフォーマットを修正"
git push
```

#### 4. Dependency Review の失敗

**症状**: 「脆弱性が検出されました」というエラー

**対処方法**:

1. PR のコメントで脆弱性の詳細を確認
2. 該当パッケージを更新または代替パッケージを検討
3. 脆弱性がない状態になるまで更新

```bash
# 特定のパッケージを更新
pnpm update <package-name>

# または、すべてのパッケージを最新に
pnpm update
```

---

### キャッシュのクリア

キャッシュが原因で問題が発生する場合があります。

**GitHub UI でのクリア方法**:

1. リポジトリの "Actions" タブを開く
2. 左サイドバーの "Caches" をクリック
3. 不要なキャッシュを削除

---

### ワークフローの再実行

**GitHub UI での再実行**:

1. リポジトリの "Actions" タブを開く
2. 失敗したワークフローをクリック
3. "Re-run all jobs" または "Re-run failed jobs" をクリック

---

## 学習リソース

### GitHub Actions 公式ドキュメント

- [GitHub Actions のクイックスタート](https://docs.github.com/ja/actions/quickstart)
- [ワークフロー構文](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions)
- [セキュリティ強化](https://docs.github.com/ja/actions/security-guides/security-hardening-for-github-actions)

### ベストプラクティス

- [GitHub Actions のベストプラクティス](https://docs.github.com/ja/actions/learn-github-actions/best-practices-for-github-actions)
- [GitHub Actions でのセキュリティ](https://docs.github.com/ja/actions/security-guides)

### 関連ツール

- [Biome ドキュメント](https://biomejs.dev/)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Dependabot ドキュメント](https://docs.github.com/ja/code-security/dependabot)

---

## さらなる改善案

このプロジェクトの GitHub Actions は学習用に構築されていますが、以下のような改善も検討できます：

### 1. テストの自動実行

```yaml
- name: Run tests
  run: pnpm test
```

### 2. E2E テスト（Playwright）

```yaml
- name: Run E2E tests
  run: pnpm test:e2e
```

### 3. コードカバレッジのレポート

```yaml
- name: Upload coverage reports
  uses: codecov/codecov-action@v4
```

### 4. Lighthouse CI（パフォーマンス測定）

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
```

### 5. 自動デプロイメント

Vercel は自動でデプロイされますが、他のプラットフォームへのデプロイも自動化できます。

---

## まとめ

このプロジェクトの GitHub Actions ワークフローは、以下の目標を達成するよう設計されています：

- ✅ **品質保証**: すべてのコードがリント・型チェック・ビルドを通過
- 🔒 **セキュリティ**: 依存関係の脆弱性を自動検出
- ⚡ **効率性**: キャッシュと並行実行により高速化
- 📚 **学習**: コメントとドキュメントで仕組みを理解しやすく
- 🤖 **自動化**: Dependabot による継続的な更新

各設定には理由があり、ベストプラクティスに基づいています。ワークフローファイルのコメントも併せて読むことで、GitHub Actions への理解が深まります。
