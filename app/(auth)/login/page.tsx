import { Suspense } from "react";

import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { GlassPanel, StoryTitle } from "@/components/visual";
import { YamaLoading } from "@/components/ui/yama-loading";
import { LoginForm } from "@/features/authentication/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthBrandHeader
        title="Welcome back, Climber"
        description="Sign in to continue your journey."
      />
      <GlassPanel className="space-y-4 p-5">
        <StoryTitle as="h2" className="text-sm">
          Sign In
        </StoryTitle>
        <Suspense fallback={<YamaLoading mode="compact" animate={false} percent={12} />}>
          <LoginForm />
        </Suspense>
      </GlassPanel>
    </div>
  );
}
