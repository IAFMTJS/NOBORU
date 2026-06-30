import { JapaneseFontScope } from "@/components/fonts/japanese-font-scope";

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <JapaneseFontScope>
      <div className="relative">{children}</div>
    </JapaneseFontScope>
  );
}
