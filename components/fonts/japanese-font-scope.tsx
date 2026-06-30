import "@/lib/fonts/load-japanese-fonts";

type JapaneseFontScopeProps = {
  children: React.ReactNode;
};

/** Wraps study routes so Noto Sans JP loads only where Japanese is shown. */
export function JapaneseFontScope({ children }: JapaneseFontScopeProps) {
  return children;
}
