"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ライト/ダーク/システムテーマを切り替えるトグルボタン
 *
 * @remarks
 * ドロップダウンメニューでテーマを選択できます。
 * - Light: ライトテーマを適用
 * - Dark: ダークテーマを適用
 * - System: システムの設定に従う
 *
 * lucide-react のアイコンを使用し、現在のテーマに応じて
 * Sun または Moon アイコンを表示します。
 *
 * @example
 * ```tsx
 * // ヘッダーでの使用例
 * <header className="flex justify-between items-center">
 *   <h1>My App</h1>
 *   <ThemeToggle />
 * </header>
 * ```
 *
 * @see https://ui.shadcn.com/docs/dark-mode/next
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="テーマを切り替え">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">テーマを切り替え</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
