import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PrimaryClimbButtonProps = ComponentProps<typeof Button>;

export function PrimaryClimbButton({
  className,
  children,
  ...props
}: PrimaryClimbButtonProps) {
  return (
    <Button
      className={cn(
        "motion-button h-12 w-full rounded-[var(--radius)] text-base font-semibold shadow-elevation-2 transition-[transform,opacity,background-color,box-shadow]",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
