import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

import { DoublePendulumDemo } from "./_components/double-pendulum-demo";

/**
 * ページのメタデータ
 */
export const metadata: Metadata = {
  title: "二重振り子シミュレーション",
  description:
    "カオス的な動きを見せる二重振り子の物理シミュレーション。節の長さや開始角度を調整して、光跡の美しい軌道を楽しめます。",
};

/**
 * 二重振り子シミュレーション サンプルページ
 *
 * @remarks
 * このページ自体は Server Component です。インタラクティブな部分
 * （シミュレーションと操作パネル）だけを Client Component
 * （DoublePendulumDemo）に切り出すことで、クライアントへ送る
 * JavaScript を必要最小限にしています。
 *
 * 学べること:
 * - ラグランジュ方程式と RK4 数値積分による物理シミュレーション
 * - Canvas 2D と requestAnimationFrame による 60fps 描画
 * - 固定タイムステップによる決定論的（再現可能）なシミュレーション
 * - 光跡（トレイル）のフェード表現
 */
export default function DoublePendulumPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        {/* ヘッダー */}
        <header className="mb-10">
          <Badge variant="secondary" className="mb-4">
            シミュレーション
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            二重
            <span className="bg-gradient-to-r from-fuchsia-500 to-violet-600 bg-clip-text text-transparent dark:from-fuchsia-400 dark:to-violet-400">
              振り子
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            振り子の先にもう 1 つ振り子をつないだだけで、動きは予測不能な
            カオスになります。節の長さと開始角度を変えて、先端が描く
            光の軌跡を楽しんでください。
          </p>
        </header>

        {/* デモ本体（Client Component） */}
        <DoublePendulumDemo />

        {/* 解説 */}
        <section className="mt-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <h2 className="mb-2 font-semibold text-foreground">
            カオスとはなにか
          </h2>
          <p>
            二重振り子は「初期値鋭敏性」を示す代表的な系です。開始角度を ほんの
            1° 変えるだけで、数秒後の軌道はまったく別物になります。
            同じ設定でリセットすれば毎回同じ軌道をたどる（決定論的）のに、
            わずかな違いが指数的に拡大していく——これがカオスの本質です。
          </p>
        </section>
      </div>
    </div>
  );
}
