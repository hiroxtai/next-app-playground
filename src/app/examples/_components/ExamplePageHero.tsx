import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { createAnimationDelayStyle } from "./animation-delay-style";
import type { ExamplePageHeroProps } from "./types";

const heroAnimationStyle = createAnimationDelayStyle(0);

/**
 * サンプルページのヒーロー領域を表示します。
 *
 * @remarks
 * バッジ・タイトル・サブタイトルを統一した見た目で表示し、
 * ページごとの差分を文言だけに寄せやすくします。
 */
export function ExamplePageHero({
  badge,
  title,
  subtitle,
  className,
}: ExamplePageHeroProps) {
  return (
    <header
      className={cn("animate-fade-in-scale mb-16 text-center", className)}
      style={heroAnimationStyle}
    >
      <Badge variant="secondary" className="mb-6">
        {badge}
      </Badge>
      <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
