# Quickstart: シンプルTodoアプリ検証ガイド

## Prerequisites

- Node.js / pnpm がセットアップ済み
- 依存関係インストール済み (`pnpm install`)

## 1. 開発サーバー起動

```bash
pnpm dev
```

- ブラウザでアプリを開き、対象の Todo サンプルページへ遷移する。

## 2. 受け入れシナリオ検証（手動）

1. 作成
- 1〜100文字のタスク名を入力して追加できること
- 空文字 / 空白のみ / 101文字以上は追加拒否されること

2. 完了切替
- 任意タスクの完了/未完了を切り替えられること
- 切替後も表示順が作成順のままであること

3. 削除
- 削除時に確認が表示されること
- キャンセルで一覧が変わらないこと
- 承認で対象タスクのみ削除されること

4. 空状態
- 全削除後に空状態メッセージが表示されること

5. リロード
- ページをフルリロードするとタスク一覧が初期状態に戻ること

## 3. 自動テスト実行

```bash
pnpm test:unit:run
```

期待結果:
- Todo機能に追加した unit テストがすべて成功する

## 4. 品質チェック

```bash
pnpm type-check
pnpm lint
```

期待結果:
- 型エラーなし
- Biome チェック成功

## References

- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Data model: [data-model.md](./data-model.md)
- Contract: [contracts/todo-ui-contract.md](./contracts/todo-ui-contract.md)
