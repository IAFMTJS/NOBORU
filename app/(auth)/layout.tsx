import { AuthAtmosphere } from "@/components/layout/auth-atmosphere";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center overflow-hidden p-4">
      <AuthAtmosphere />
      <div className="relative">{children}</div>
    </div>
  );
}
