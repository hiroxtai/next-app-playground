import { cn } from "@/lib/utils";

import { createAnimationDelayStyle } from "./animation-delay-style";
import type { ExamplePageContentProps, ExamplePageSectionProps } from "./types";

const columnClassMap = {
  single: "",
  two: "sm:grid-cols-2",
} as const;

/**
 * サンプルページのコンテンツグリッドです。
 *
 * @remarks
 * 列数だけを指定して、各セクション配置の土台をそろえます。
 */
export function ExamplePageContent({
  children,
  columns = "single",
  className,
}: ExamplePageContentProps) {
  return (
    <div className={cn("grid gap-6", columnClassMap[columns], className)}>
      {children}
    </div>
  );
}

/**
 * コンテンツ内の1セクションを包むラッパーです。
 *
 * @remarks
 * 遅延アニメーションの指定を各カードから分離し、
 * セクションの意図を読み取りやすくします。
 */
export function ExamplePageSection({
  children,
  className,
  animationDelayMs,
}: ExamplePageSectionProps) {
  const style = createAnimationDelayStyle(animationDelayMs);

  return (
    <section className={cn("animate-fade-in-up", className)} style={style}>
      {children}
    </section>
  );
}
