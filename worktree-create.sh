#!/bin/sh

# ========================================
# worktree-create.sh
# ========================================
#
# 【実行内容】
# 新しいブランチを作成し、Git worktree として設定します。
# また、.serena/ フォルダをコピーし、pnpm install を実行します。
#
# 【使用方法】
# ./worktree-create.sh <ブランチ名>
#
# 【例】
# ./worktree-create.sh feature/new-component
# → ../next-app-playground.worktrees/feature-new-component/ が作成されます
#
# ========================================

# ========================================
# 引数チェック
# ========================================

if [ -z "$1" ]; then
  echo "❌ エラー: ブランチ名が指定されていません"
  echo ""
  echo "使用方法: ./worktree-create.sh <ブランチ名>"
  echo "例: ./worktree-create.sh feature/new-component"
  exit 1
fi

BRANCH_NAME="$1"

# ========================================
# ブランチ名からフォルダ名を生成
# ========================================
#
# 【なぜこの処理が必要か】
# ブランチ名に含まれる "/" はファイルシステムでディレクトリ区切りとして
# 解釈されるため、"-" に変換してフォルダ名として使用します。
#
# 例: feature/example → feature-example
# ========================================

FOLDER_NAME=$(echo "$BRANCH_NAME" | tr '/' '-')

# ========================================
# Worktree のパスを設定
# ========================================
#
# 【配置場所】
# プロジェクトと同じ階層に "next-app-playground.worktrees" ディレクトリを作成し、
# その中に worktree を配置します。
#
# 【なぜこの配置にするか】
# - プロジェクトディレクトリを汚さない
# - 複数の worktree を一箇所に集約して管理できる
# - .gitignore の設定が不要（親ディレクトリに配置するため）
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
  echo "2. 別のブランチ名を指定する"
  exit 1
fi

# ========================================
# 既存のブランチチェック
# ========================================

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "❌ エラー: ブランチ '$BRANCH_NAME' は既に存在します"
  echo ""
  echo "【解決方法】"
  echo "1. 既存のブランチから worktree を作成する場合:"
  echo "   git worktree add $WORKTREE_DIR $BRANCH_NAME"
  echo ""
  echo "2. リモートブランチから worktree を作成する場合:"
  echo "   ./worktree-checkout.sh $BRANCH_NAME"
  echo ""
  echo "3. 別のブランチ名を指定する"
  exit 1
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
# 新しいブランチを作成し、指定したディレクトリに worktree を配置します。
#
# 【オプション】
# -b: 新しいブランチを作成
# ========================================

echo "🌿 ブランチ '$BRANCH_NAME' を作成し、worktree をセットアップしています..."
if ! git worktree add -b "$BRANCH_NAME" "$WORKTREE_DIR"; then
  echo ""
  echo "❌ エラー: git worktree の作成に失敗しました"
  echo ""
  echo "【考えられる原因】"
  echo "- Git リポジトリでない、または .git ディレクトリが見つからない"
  echo "- ディレクトリの作成権限がない"
  echo "- ブランチ名に不正な文字が含まれている"
  exit 1
fi

# ========================================
# .serena/ フォルダのコピー
# ========================================
#
# 【実行内容】
# Serena のプロジェクト設定とメモリーを新しい worktree にコピーします。
#
# 【なぜコピーが必要か】
# Serena は .serena/ ディレクトリにプロジェクト固有の設定とメモリーを保持します。
# 各 worktree で独立して Serena を使用するため、これらをコピーします。
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
#
# 【なぜ必要か】
# node_modules/ は .gitignore で除外されているため、
# 各 worktree で個別にインストールが必要です。
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
echo ""
echo "【次のステップ】"
echo "1. worktree ディレクトリに移動:"
echo "   cd $WORKTREE_DIR"
echo ""
echo "2. 開発サーバーを起動:"
echo "   pnpm dev"
echo ""
