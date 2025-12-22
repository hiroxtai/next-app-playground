/**
 * husky のサイレントインストールスクリプト
 *
 * このスクリプトは CI 環境や本番環境で husky のセットアップをスキップします。
 * これにより、husky がインストールされていない環境でも「command not found」エラーを防ぎます。
 *
 * @remarks
 * - CI=true: GitHub Actions などの CI 環境
 * - NODE_ENV=production: 本番環境でのデプロイ時
 */

// CI 環境または本番環境では husky のインストールをスキップ
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}

const husky = (await import("husky")).default;
console.log(husky());
