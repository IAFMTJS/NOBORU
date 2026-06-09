import type { ReactNode } from "react";

import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
  role: string;
};

export function AdminShell({ children, role }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border px-4 py-3 lg:px-6">
            <p className="text-caption text-muted-foreground">
              Signed in as content admin · {role.replaceAll("_", " ")}
            </p>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
