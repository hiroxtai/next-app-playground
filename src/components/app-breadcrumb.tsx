import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

/**
 * パンくずリストのアイテム
 */
export interface BreadcrumbItemData {
  /** 表示ラベル */
  label: string;
  /** リンク先（省略時は現在のページとして扱う） */
  href?: string;
}

/**
 * AppBreadcrumb のプロパティ
 */
export interface AppBreadcrumbProps {
  /** パンくずアイテムの配列（順序通りに表示） */
  items: BreadcrumbItemData[];
  /** 追加のクラス名 */
  className?: string;
}

/**
 * アプリケーション共通パンくずリストコンポーネント
 *
 * @remarks
 * shadcn/ui の Breadcrumb コンポーネントを使用し、
 * 統一されたスタイル（`text-muted-foreground hover:text-foreground`）で描画します。
 * 最後のアイテムは自動的に現在のページとして扱われます。
 *
 * @example
 * ```tsx
 * <AppBreadcrumb
 *   items={[
 *     { label: "ホーム", href: "/" },
 *     { label: "カタログ", href: "/catalog" },
 *     { label: "UI基礎" }, // href なし = 現在のページ
 *   ]}
 * />
 * ```
 */
export function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-medium text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
