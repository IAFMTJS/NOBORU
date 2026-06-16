import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-phone space-y-6 p-4 pb-nav-clearance",
        className,
      )}
    >
      {children}
    </div>
  );
}
