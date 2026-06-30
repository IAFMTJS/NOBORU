import { JapaneseFontScope } from "@/components/fonts/japanese-font-scope";

export default function StudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <JapaneseFontScope>{children}</JapaneseFontScope>;
}
