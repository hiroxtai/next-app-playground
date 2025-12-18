import { redirect } from "next/navigation";

/**
 * ホームページ
 * カタログページへリダイレクトします。
 */
export default function Home() {
  redirect("/catalog");
}
