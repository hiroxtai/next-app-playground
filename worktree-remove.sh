#!/bin/sh

# ========================================
# worktree-remove.sh
# ========================================
#
# 【実行内容】
# マージ済みのブランチの worktree を安全に削除します。
#
# 【使用方法】
# ./worktree-remove.sh <ブランチ名またはフォルダ名>
#
# 【例】
# ./worktree-remove.sh feature/example
# または
# ./worktree-remove.sh feature-example
#
# ========================================

# ========================================
# 引数チェック
# ========================================

if [ -z "$1" ]; then
  echo "❌ エラー: ブランチ名が指定されていません"
  echo ""
  echo "使用方法: ./worktree-remove.sh <ブランチ名>"
  echo "例: ./worktree-remove.sh feature/example"
  echo ""
  echo "【現在の worktree 一覧】"
  git worktree list
  exit 1
fi

INPUT_NAME="$1"

# ========================================
# ブランチ名とフォルダ名の両方に対応
# ========================================
#
# 【処理内容】
# ユーザーが "feature/example" または "feature-example" のどちらを
# 指定しても動作するように、両方のパターンに対応します。
# ========================================

# "/" が含まれている場合はブランチ名として扱い、フォルダ名に変換
if echo "$INPUT_NAME" | grep -q '/'; then
  BRANCH_NAME="$INPUT_NAME"
  FOLDER_NAME=$(echo "$INPUT_NAME" | tr '/' '-')
else
  # "/" が含まれていない場合はフォルダ名として扱い、ブランチ名に変換
  FOLDER_NAME="$INPUT_NAME"
  BRANCH_NAME=$(echo "$INPUT_NAME" | tr '-' '/')
fi

# ========================================
# Worktree のパスを設定
# ========================================

WORKTREE_BASE="../next-app-playground.worktrees"
WORKTREE_DIR="$WORKTREE_BASE/$FOLDER_NAME"

# ========================================
# Worktree の存在確認
# ========================================

if [ ! -d "$WORKTREE_DIR" ]; then
  echo "❌ エラー: worktree ディレクトリが見つかりません"
  echo ""
  echo "指定されたパス: $WORKTREE_DIR"
  echo ""
  echo "【現在の worktree 一覧】"
  git worktree list
  echo ""
  echo "【解決方法】"
  echo "正しい worktree 名を指定してください"
  exit 1
fi

# ========================================
# ブランチのマージ状態を確認
# ========================================
#
# 【なぜこの確認が必要か】
# マージされていないブランチを誤って削除することを防ぎます。
# main または master ブランチにマージ済みの場合のみ削除を許可します。
#
# 【注意】
# この確認は安全策として実装していますが、確認プロンプトで
# ユーザーが明示的に承認するため、スキップすることも可能です。
# ========================================

# デフォルトブランチ（main または master）を取得
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
if [ -z "$DEFAULT_BRANCH" ]; then
  DEFAULT_BRANCH="main"
fi

# ブランチがマージ済みかチェック
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  if ! git branch --merged "$DEFAULT_BRANCH" | grep -q "^\*\?\s*${BRANCH_NAME}$"; then
    echo "⚠️  警告: ブランチ '$BRANCH_NAME' はまだ '$DEFAULT_BRANCH' にマージされていません"
    echo ""
    echo "【確認】"
    echo "このブランチを削除しても問題ありませんか？"
    echo ""
    printf "削除を続行しますか？ (y/N): "
    read -r CONFIRM
    
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
      echo ""
      echo "❌ 削除をキャンセルしました"
      exit 0
    fi
  fi
else
  echo "⚠️  警告: ローカルブランチ '$BRANCH_NAME' が見つかりません"
  echo ""
  echo "worktree のディレクトリのみを削除します。"
fi

# ========================================
# 最終確認
# ========================================

echo ""
echo "【削除対象】"
echo "Worktree: $WORKTREE_DIR"
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "ブランチ: $BRANCH_NAME"
fi
echo ""
printf "本当に削除しますか？ (y/N): "
read -r FINAL_CONFIRM

if [ "$FINAL_CONFIRM" != "y" ] && [ "$FINAL_CONFIRM" != "Y" ]; then
  echo ""
  echo "❌ 削除をキャンセルしました"
  exit 0
fi

# ========================================
# Worktree の削除
# ========================================
#
# 【実行内容】
# git worktree remove コマンドで worktree を削除します。
#
# 【--force オプション】
# 未コミットの変更がある場合でも強制的に削除します。
# ユーザーが確認プロンプトで承認しているため、安全です。
# ========================================

echo ""
echo "🗑️  worktree を削除しています..."

if git worktree list | grep -q "$WORKTREE_DIR"; then
  if ! git worktree remove --force "$WORKTREE_DIR"; then
    echo ""
    echo "❌ エラー: git worktree remove に失敗しました"
    echo ""
    echo "【解決方法】"
    echo "手動で削除する場合:"
    echo "  git worktree remove --force $WORKTREE_DIR"
    echo "  rm -rf $WORKTREE_DIR"
    exit 1
  fi
else
  # worktree リストにない場合は、ディレクトリを直接削除
  echo "⚠️  git worktree リストに見つからないため、ディレクトリを直接削除します"
  rm -rf "$WORKTREE_DIR"
fi

# ========================================
# ローカルブランチの削除
# ========================================
#
# 【実行内容】
# ローカルブランチを削除します。
#
# 【オプション】
# -D: マージされていない場合でも強制削除
#     （ユーザーが既に確認プロンプトで承認済みのため）
# ========================================

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "🌿 ローカルブランチを削除しています..."
  
  if ! git branch -D "$BRANCH_NAME"; then
    echo ""
    echo "❌ エラー: ブランチの削除に失敗しました"
    echo ""
    echo "【解決方法】"
    echo "手動で削除する場合:"
    echo "  git branch -D $BRANCH_NAME"
    exit 1
  fi
fi

# ========================================
# 完了メッセージ
# ========================================

echo ""
echo "✅ worktree とブランチの削除が完了しました！"
echo ""
echo "【削除されたもの】"
echo "- Worktree: $WORKTREE_DIR"
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" 2>/dev/null; then
  : # ブランチは既に削除されている
else
  echo "- ブランチ: $BRANCH_NAME"
fi
echo ""
echo "【現在の worktree 一覧】"
git worktree list
echo ""
