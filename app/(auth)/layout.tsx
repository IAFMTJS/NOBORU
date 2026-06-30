import { AuthAtmosphere } from "@/components/layout/auth-atmosphere";
import { AuthServiceWarmup } from "@/features/authentication/components/auth-service-warmup";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center overflow-hidden p-4">
      <AuthServiceWarmup />
      <AuthAtmosphere />
      <div className="relative">{children}</div>
    </div>
  );
}
