import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RegionContinueFooterProps = {
  lessonTitle: string;
  href: string;
  className?: string;
};

export function RegionContinueFooter({
  lessonTitle,
  href,
  className,
}: RegionContinueFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <Button className="w-full" size="lg" asChild>
        <Link href={href}>Continue: {lessonTitle}</Link>
      </Button>
    </div>
  );
}
