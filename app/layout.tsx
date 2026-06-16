import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OFFICIAL_RELEASE, RELEASE } from "@/lib/release/release.constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-story",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: RELEASE.name,
    template: `%s · ${RELEASE.name}`,
  },
  description: RELEASE.isBeta
    ? "Noboru public beta — climb Japanese from Foothills through N5."
    : OFFICIAL_RELEASE.message,
  manifest: "/manifest.json",
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  openGraph: {
    title: RELEASE.name,
    description: OFFICIAL_RELEASE.message,
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Noboru",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  applicationName: "Noboru",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/art/brand/icon-app-dark.webp",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/art/brand/icon-app-dark.webp",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#05070A" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
