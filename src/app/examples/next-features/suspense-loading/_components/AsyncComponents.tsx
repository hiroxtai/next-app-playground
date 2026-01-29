import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * 高速に読み込まれるコンポーネント
 */
export async function FastComponent() {
  // 500ms の遅延をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">高速コンポーネント</p>
      <p className="text-sm text-muted-foreground">
        このコンポーネントは 500ms で読み込まれました。
      </p>
      <div className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
        読み込み完了
      </div>
    </div>
  );
}

/**
 * 遅く読み込まれるコンポーネント
 */
export async function SlowComponent() {
  // 2秒の遅延をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">遅いコンポーネント</p>
      <p className="text-sm text-muted-foreground">
        このコンポーネントは 2秒 で読み込まれました。
      </p>
      <div className="rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        読み込み完了（遅延あり）
      </div>
    </div>
  );
}

/**
 * ユーザープロフィールを模したコンポーネント
 */
export async function UserProfile() {
  // 1.5秒の遅延をシミュレート（データベースアクセスを想定）
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // ダミーのユーザーデータ
  const user = {
    name: "田中 太郎",
    email: "tanaka@example.com",
    role: "フロントエンドエンジニア",
    avatar: null,
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
        <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
          {user.name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {user.role}
        </p>
      </div>
    </div>
  );
}
