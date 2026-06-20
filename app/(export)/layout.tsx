import { ThemeProvider } from "@/components/providers/theme-provider";

/** Flat layout for full-page art audit screenshots (no viewport clip). */
export default function ExportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
