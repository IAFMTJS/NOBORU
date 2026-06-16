import { ThemeProvider } from "@/components/providers/theme-provider";
import { PrototypeLabShell } from "@/features/prototype/components/prototype-lab-shell";

/** UI Lab layout — full viewport, light mode only, no app bottom nav. */
export default function LabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <PrototypeLabShell>{children}</PrototypeLabShell>
    </ThemeProvider>
  );
}
