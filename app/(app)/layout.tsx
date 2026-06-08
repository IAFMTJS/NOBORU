import { BottomNav } from "@/components/layout/bottom-nav";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto min-h-dvh max-w-lg pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
