import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PrototypeHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "page" | "section" | "card";
};

/** Prototype headings — Inter sans, matches main app UI (not story serif). */
export function PrototypeHeading({
  as: Tag = "h2",
  size = "section",
  className,
  children,
  ...props
}: PrototypeHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-sans font-semibold tracking-tight text-foreground",
        size === "page" && "text-heading-6",
        size === "section" && "text-section-header",
        size === "card" && "text-body font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

type PrototypeEyebrowProps = HTMLAttributes<HTMLParagraphElement>;

export function PrototypeEyebrow({ className, children, ...props }: PrototypeEyebrowProps) {
  return (
    <p
      className={cn(
        "font-sans text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
