import { redirect } from "next/navigation";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { getAdminSession } from "@/lib/admin/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/home");
  }

  return <AdminShell role={session.role}>{children}</AdminShell>;
}
