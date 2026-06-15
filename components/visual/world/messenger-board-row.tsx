import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type MessengerBoardRowProps = {
  title: string;
  body: string;
  time?: string;
  timeDateTime?: string;
  leading?: ReactNode;
  unread?: boolean;
  href?: string;
  className?: string;
};

/** Trail messenger board pin — in-world notification row. */
export function MessengerBoardRow({
  title,
  body,
  time,
  timeDateTime,
  leading,
  unread = false,
  href,
  className,
}: MessengerBoardRowProps) {
  const content = (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border border-amber-900/35 bg-gradient-to-r from-amber-950/50 to-black/45 px-3 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-colors",
        unread && "ring-1 ring-trail-glow/30",
        href && "hover:border-trail-glow/40",
        className,
      )}
    >
      {unread ? (
        <span
          className="absolute -left-1 top-3 h-2 w-2 rounded-full bg-trail-glow shadow-[0_0_8px_hsl(var(--trail-glow)/0.6)]"
          aria-hidden
        />
      ) : null}
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body-sm font-semibold">{title}</p>
          {time ? (
            <time className="shrink-0 text-caption text-muted-foreground" dateTime={timeDateTime}>
              {time}
            </time>
          ) : null}
        </div>
        <p className="text-body-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus-ring block rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
