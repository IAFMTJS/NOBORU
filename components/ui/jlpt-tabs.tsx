"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const JLPT_LEVELS = ["All", "N5", "N4", "N3", "N2", "N1"] as const;

export type JlptLevel = (typeof JLPT_LEVELS)[number];

type JlptTabsProps = {
  value: JlptLevel;
  onValueChange: (value: JlptLevel) => void;
  className?: string;
};

export function JlptTabs({ value, onValueChange, className }: JlptTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as JlptLevel)}
      className={className}
    >
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
        {JLPT_LEVELS.map((level) => (
          <TabsTrigger
            key={level}
            value={level}
            className={cn(
              "rounded-full border border-transparent px-3 py-1.5 text-body-sm data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none",
            )}
          >
            {level}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
