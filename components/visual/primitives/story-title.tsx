import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StoryTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
};

export function StoryTitle({
  as: Tag = "h2",
  className,
  children,
  ...props
}: StoryTitleProps) {
  return (
    <Tag className={cn("text-lg font-semibold tracking-tight", className)} {...props}>
      {children}
    </Tag>
  );
}
