import { BottomNav } from "@/components/layout/bottom-nav";
import { BetaBanner } from "@/features/feedback/components/beta-banner";
import { OfflineProvider } from "@/features/offline/components/offline-provider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OfflineProvider>
      <div className="min-h-dvh bg-background">
        <BetaBanner />
        <main className="mx-auto min-h-dvh max-w-lg pb-24">{children}</main>
        <BottomNav />
      </div>
    </OfflineProvider>
  );
}
