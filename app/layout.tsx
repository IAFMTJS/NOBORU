import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaSplashLinks } from "@/components/pwa/pwa-splash-links";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OFFICIAL_RELEASE, RELEASE } from "@/lib/release/release.constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: RELEASE.name,
    template: `%s · ${RELEASE.name}`,
  },
  description: RELEASE.isBeta
    ? "Noboru public beta — begin in the Realm of First Light (N5)."
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
      { url: "/icons/icon-192_v1.webp", sizes: "192x192", type: "image/webp" },
      { url: "/icons/icon-512_v1.webp", sizes: "512x512", type: "image/webp" },
    ],
    apple: "/icons/apple-touch-icon_v1.png",
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
      <head>
        <PwaSplashLinks />
      </head>
      <body className={`${inter.variable} font-sans`}>
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
