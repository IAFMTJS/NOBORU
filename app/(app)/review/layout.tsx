import { JapaneseFontScope } from "@/components/fonts/japanese-font-scope";

export default function ReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <JapaneseFontScope>{children}</JapaneseFontScope>;
}
