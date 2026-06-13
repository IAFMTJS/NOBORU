import { BottomNav } from "@/components/layout/bottom-nav";
import { BetaBanner } from "@/features/feedback/components/beta-banner";
import { OfflineProvider } from "@/features/offline/components/offline-provider";
import { getCachedAuthSession } from "@/lib/cache/request-cache";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCachedAuthSession();

  return (
    <OfflineProvider userId={session?.userId}>
      <div className="min-h-dvh bg-background text-foreground">
        <BetaBanner />
        <main className="mx-auto min-h-dvh max-w-lg pb-24">{children}</main>
        <BottomNav />
      </div>
    </OfflineProvider>
  );
}
