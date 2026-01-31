"use client";

import { ChevronDown } from "lucide-react";
import { createContext, type ReactNode, useContext, useState } from "react";

// ============================================
// Accordion Context
// ============================================
interface AccordionContextValue {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Accordion コンテキストを取得するカスタムフック
 */
function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }
  return context;
}

// ============================================
// Accordion（親コンポーネント）
// ============================================
interface AccordionProps {
  children: ReactNode;
  defaultIndex?: number | null;
}

/**
 * Accordion 親コンポーネント
 *
 * @remarks
 * 子の AccordionItem コンポーネントに状態を提供します。
 * Compound Components パターンにより、柔軟な構成が可能です。
 */
export function Accordion({ children, defaultIndex = null }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultIndex);

  const toggleIndex = (index: number | null) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <AccordionContext.Provider
      value={{ activeIndex, setActiveIndex: toggleIndex }}
    >
      <div className="divide-y divide-border rounded-lg border">
        {/* 子要素に index を自動付与 */}
        {Array.isArray(children)
          ? children.map((child, index) => {
              if (child && typeof child === "object" && "props" in child) {
                return { ...child, props: { ...child.props, index } };
              }
              return child;
            })
          : children}
      </div>
    </AccordionContext.Provider>
  );
}

// ============================================
// AccordionItem（子コンポーネント）
// ============================================
interface AccordionItemProps {
  title: string;
  children: ReactNode;
  index?: number;
}

/**
 * AccordionItem 子コンポーネント
 *
 * @remarks
 * Accordion 内でのみ使用可能。
 * useContext を通じて親の状態にアクセスします。
 */
export function AccordionItem({
  title,
  children,
  index = 0,
}: AccordionItemProps) {
  const { activeIndex, setActiveIndex } = useAccordion();
  const isOpen = activeIndex === index;

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50"
        onClick={() => setActiveIndex(index)}
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2">{children}</div>
      </div>
    </div>
  );
}
