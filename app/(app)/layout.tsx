import { AppViewportBackground } from "@/components/visual/navigation/app-viewport-background";
import { BottomNav } from "@/components/visual/navigation/bottom-nav";
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
      <div className="relative min-h-dvh bg-background text-foreground">
        <AppViewportBackground />
        <BetaBanner />
        <main className="relative z-10 mx-auto min-h-dvh max-w-phone bg-background/0 pb-nav-clearance">
          {children}
        </main>
        <BottomNav />
      </div>
    </OfflineProvider>
  );
}
