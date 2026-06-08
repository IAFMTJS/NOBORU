import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ASSET_REGISTRY } from "@/lib/assets/registry";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Noboru",
  description: "Your climb. Your language. Your journey.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: ASSET_REGISTRY.icons.appDark,
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: ASSET_REGISTRY.icons.appLight,
        media: "(prefers-color-scheme: light)",
      },
    ],
    apple: ASSET_REGISTRY.icons.appLight,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1115" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
