import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { createAnimationDelayStyle } from "./animation-delay-style";
import type {
  ExamplePageNextStepsAction,
  ExamplePageNextStepsProps,
} from "./types";

const defaultAction: ExamplePageNextStepsAction = {
  href: "/catalog",
  label: "カタログを見る",
};

/**
 * サンプルページの Next Steps 領域です。
 *
 * @remarks
 * 「次に見るページ」への導線表現を共通化し、
 * ページごとの文言とリンク先だけを差し替えられるようにします。
 */
export function ExamplePageNextSteps({
  description,
  action = defaultAction,
  title = "Next Steps",
  subtitle = "次のステップ",
  icon,
  className,
  animationDelayMs,
}: ExamplePageNextStepsProps) {
  const style = createAnimationDelayStyle(animationDelayMs);

  return (
    <Card
      className={cn(
        "animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30",
        className,
      )}
      style={style}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            {action.label}
            {icon ?? <ChevronRight className="size-4" />}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
