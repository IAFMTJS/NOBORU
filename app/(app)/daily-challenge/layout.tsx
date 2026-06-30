import { JapaneseFontScope } from "@/components/fonts/japanese-font-scope";

export default function DailyChallengeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <JapaneseFontScope>{children}</JapaneseFontScope>;
}
