import {
  ArrowRight,
  BookOpen,
  Github,
  Layers,
  Library,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { categories, pages } from "@/app/_lib/catalog-data";
import { categoryStyles } from "@/app/_lib/category-styles";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * ダッシュボード風ホームページ
 *
 * @remarks
 * Next.js Playground のランディングページ。
 * ヒーローセクション、統計情報、最近のページ、カテゴリ一覧を表示します。
 */
export default function Home() {
  // 最近追加されたページ（最新3件）
  const recentPages = pages.slice(0, 3);

  // 統計情報
  const stats = [
    {
      label: "サンプルページ",
      value: pages.length,
      icon: BookOpen,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "カテゴリ",
      value: categories.length,
      icon: Layers,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "初級ページ",
      value: pages.filter((p) => p.difficulty === "初級").length,
      icon: Sparkles,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md">
              <Library className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Next.js Playground</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        {/* 装飾的な背景パターン */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Next.js を
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                {" "}
                楽しく学ぼう
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
              実践的なサンプルコードで React と Next.js
              の基礎から応用まで学習できます。 初級から順番に進めて、モダンな
              Web 開発スキルを身につけましょう。
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/catalog">
                  カタログを見る
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Next.js ドキュメント
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="border-y border-zinc-200 bg-white/50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-800/50"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最近追加されたページ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                サンプルページ
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                最新のサンプルページをチェックしましょう
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-1">
              <Link href="/catalog">
                すべて見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPages.map((page) => {
              const style = categoryStyles[page.category];
              const Icon = style.icon;

              return (
                <Card
                  key={page.id}
                  className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${style.gradient}`}
                  />
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.iconBg} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {page.difficulty}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {page.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="mt-4 w-full gap-1"
                    >
                      <Link href={`/examples/${page.category}/${page.id}`}>
                        詳細を見る
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* カテゴリ一覧 */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              カテゴリから探す
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              学びたい分野を選んでください
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category) => {
              const style = categoryStyles[category.id];
              const Icon = style.icon;
              const pageCount = pages.filter(
                (p) => p.category === category.id,
              ).length;

              return (
                <Link
                  key={category.id}
                  href={`/catalog/category/${category.id}`}
                  className="group flex flex-col items-center rounded-xl border border-zinc-200/50 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-800/50 dark:hover:border-zinc-700"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {category.label}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {pageCount} ページ
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Next.js Playground - Next.js 学習用プロジェクト
          </p>
        </div>
      </footer>
    </div>
  );
}
