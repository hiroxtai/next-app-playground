#!/bin/sh

# ========================================
# worktree-checkout.sh
# ========================================
#
# 【実行内容】
# リモートリポジトリの既存ブランチから worktree を作成します。
#
# 【使用方法】
# ./worktree-checkout.sh <ブランチ名>
#
# 【例】
# ./worktree-checkout.sh feature/existing-branch
# → origin/feature/existing-branch から worktree を作成
#
# ========================================

# ========================================
# 引数チェック
# ========================================

if [ -z "$1" ]; then
  echo "❌ エラー: ブランチ名が指定されていません"
  echo ""
  echo "使用方法: ./worktree-checkout.sh <ブランチ名>"
  echo "例: ./worktree-checkout.sh feature/existing-branch"
  echo ""
  echo "【リモートブランチ一覧】"
  git branch -r | grep -v 'HEAD'
  exit 1
fi

BRANCH_NAME="$1"

# ========================================
# ブランチ名からフォルダ名を生成
# ========================================
#
# 【処理内容】
# ブランチ名の "/" を "-" に変換してフォルダ名として使用します。
#
# 例: feature/example → feature-example
# ========================================

FOLDER_NAME=$(echo "$BRANCH_NAME" | tr '/' '-')

# ========================================
# Worktree のパスを設定
# ========================================

WORKTREE_BASE="../next-app-playground.worktrees"
WORKTREE_DIR="$WORKTREE_BASE/$FOLDER_NAME"

# ========================================
# 既存の worktree チェック
# ========================================

if [ -d "$WORKTREE_DIR" ]; then
  echo "❌ エラー: worktree ディレクトリが既に存在します"
  echo ""
  echo "パス: $WORKTREE_DIR"
  echo ""
  echo "【解決方法】"
  echo "1. 既存の worktree を削除する場合:"
  echo "   ./worktree-remove.sh $FOLDER_NAME"
  echo ""
  echo "2. 既存の worktree を使用する場合:"
  echo "   cd $WORKTREE_DIR"
  exit 1
fi

# ========================================
# リモートブランチの最新情報を取得
# ========================================
#
# 【実行内容】
# git fetch でリモートブランチの最新情報を取得します。
#
# 【なぜ必要か】
# リモートに新しく追加されたブランチは、fetch しないと
# ローカルで認識されません。
# ========================================

echo "🔄 リモートブランチの最新情報を取得しています..."
if ! git fetch origin; then
  echo ""
  echo "❌ エラー: git fetch に失敗しました"
  echo ""
  echo "【考えられる原因】"
  echo "- ネットワーク接続がない"
  echo "- リモートリポジトリにアクセスできない"
  echo "- 認証情報が正しくない"
  exit 1
fi

# ========================================
# リモートブランチの存在確認
# ========================================

if ! git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME"; then
  echo ""
  echo "❌ エラー: リモートブランチ 'origin/$BRANCH_NAME' が見つかりません"
  echo ""
  echo "【リモートブランチ一覧】"
  git branch -r | grep -v 'HEAD'
  echo ""
  echo "【解決方法】"
  echo "1. 正しいブランチ名を確認する"
  echo ""
  echo "2. 新しいブランチを作成する場合:"
  echo "   ./worktree-create.sh $BRANCH_NAME"
  exit 1
fi

# ========================================
# ローカルブランチの存在チェック
# ========================================
#
# 【処理内容】
# ローカルに同名のブランチが既に存在する場合、
# リモートブランチを追跡するように設定します。
# ========================================

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "⚠️  警告: ローカルブランチ '$BRANCH_NAME' が既に存在します"
  echo ""
  echo "既存のローカルブランチから worktree を作成します。"
  CHECKOUT_TARGET="$BRANCH_NAME"
else
  # ローカルブランチが存在しない場合は、リモートブランチを指定
  CHECKOUT_TARGET="origin/$BRANCH_NAME"
fi

# ========================================
# Worktree ベースディレクトリの作成
# ========================================

echo "📁 worktree ベースディレクトリを作成しています..."
mkdir -p "$WORKTREE_BASE"

# ========================================
# Git worktree の作成
# ========================================
#
# 【実行内容】
# リモートブランチから worktree を作成します。
#
# 【動作】
# - ローカルブランチが存在しない場合:
#   origin/<ブランチ名> を追跡する新しいローカルブランチを作成
# - ローカルブランチが存在する場合:
#   既存のブランチをチェックアウト
# ========================================

echo "🌿 ブランチ '$BRANCH_NAME' から worktree をセットアップしています..."

if [ "$CHECKOUT_TARGET" = "origin/$BRANCH_NAME" ]; then
  # リモートブランチを追跡する新しいローカルブランチを作成
  if ! git worktree add -b "$BRANCH_NAME" "$WORKTREE_DIR" "$CHECKOUT_TARGET"; then
    echo ""
    echo "❌ エラー: git worktree の作成に失敗しました"
    echo ""
    echo "【考えられる原因】"
    echo "- リモートブランチが見つからない"
    echo "- ディレクトリの作成権限がない"
    echo "- ブランチ名に不正な文字が含まれている"
    exit 1
  fi
else
  # 既存のローカルブランチをチェックアウト
  if ! git worktree add "$WORKTREE_DIR" "$CHECKOUT_TARGET"; then
    echo ""
    echo "❌ エラー: git worktree の作成に失敗しました"
    echo ""
    echo "【考えられる原因】"
    echo "- ブランチが見つからない"
    echo "- ディレクトリの作成権限がない"
    exit 1
  fi
fi

# ========================================
# .serena/ フォルダのコピー
# ========================================
#
# 【実行内容】
# Serena のプロジェクト設定とメモリーを新しい worktree にコピーします。
#
# 【除外ファイル】
# cache/: 言語サーバーのキャッシュファイル（worktree ごとに再生成されるため不要）
# ========================================

echo "📋 .serena/ フォルダをコピーしています..."
if ! rsync -a --exclude='cache/' .serena/ "$WORKTREE_DIR/.serena/"; then
  echo ""
  echo "❌ エラー: .serena/ フォルダのコピーに失敗しました"
  echo ""
  echo "【考えられる原因】"
  echo "- rsync コマンドがインストールされていない"
  echo "- .serena/ ディレクトリが存在しない"
  echo "- 書き込み権限がない"
  echo ""
  echo "【解決方法】"
  echo "手動でコピーする場合:"
  echo "  cp -r .serena/ $WORKTREE_DIR/.serena/"
  exit 1
fi

# ========================================
# pnpm install の実行
# ========================================
#
# 【実行内容】
# 新しい worktree で依存関係をインストールします。
# ========================================

echo "📦 依存関係をインストールしています..."
cd "$WORKTREE_DIR" || exit 1

if ! pnpm install; then
  echo ""
  echo "❌ エラー: pnpm install に失敗しました"
  echo ""
  echo "【考えられる原因】"
  echo "- pnpm がインストールされていない"
  echo "- package.json または pnpm-lock.yaml が壊れている"
  echo "- ディスク容量が不足している"
  echo ""
  echo "【解決方法】"
  echo "1. pnpm がインストールされているか確認:"
  echo "   pnpm --version"
  echo ""
  echo "2. pnpm をインストール:"
  echo "   npm install -g pnpm"
  exit 1
fi

# ========================================
# 完了メッセージ
# ========================================

echo ""
echo "✅ worktree のセットアップが完了しました！"
echo ""
echo "📂 Worktree パス: $WORKTREE_DIR"
echo "🌿 ブランチ名: $BRANCH_NAME"
echo "🔗 追跡ブランチ: origin/$BRANCH_NAME"
echo ""
echo "【次のステップ】"
echo "1. worktree ディレクトリに移動:"
echo "   cd $WORKTREE_DIR"
echo ""
echo "2. 最新の変更を取得（必要に応じて）:"
echo "   git pull"
echo ""
echo "3. 開発サーバーを起動:"
echo "   pnpm dev"
echo ""
