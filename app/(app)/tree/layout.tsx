import { JapaneseFontScope } from "@/components/fonts/japanese-font-scope";

export default function TreeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <JapaneseFontScope>{children}</JapaneseFontScope>;
}
