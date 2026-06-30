import { JapaneseFontScope } from "@/components/fonts/japanese-font-scope";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <JapaneseFontScope>
      <div className="min-h-dvh bg-background">{children}</div>
    </JapaneseFontScope>
  );
}
