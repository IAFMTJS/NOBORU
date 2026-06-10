"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  Flag,
  Languages,
  LayoutDashboard,
  Map,
  MessageSquare,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/content/vocabulary", label: "Vocabulary", icon: Languages, exact: false },
  { href: "/admin/content/kanji", label: "Kanji", icon: Brain, exact: false },
  { href: "/admin/content/grammar", label: "Grammar", icon: BookOpen, exact: false },
  { href: "/admin/content/lessons", label: "Lessons", icon: Flag, exact: false },
  { href: "/admin/content/regions", label: "Regions", icon: Map, exact: false },
  { href: "/admin/content/feedback", label: "Feedback", icon: MessageSquare, exact: false },
  { href: "/admin/content/achievements", label: "Achievements", icon: Trophy, exact: false },
] as const;

export function AdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="w-full border-b border-border bg-card lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-4">
        <p className="text-caption uppercase tracking-wide text-muted-foreground">
          Noboru Admin
        </p>
        <p className="text-heading-6">Content CMS</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:px-3 lg:pb-6">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-body-sm transition-colors lg:w-full",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
