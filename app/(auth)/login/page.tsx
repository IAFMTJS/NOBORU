import { Suspense } from "react";

import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { GlassPanel, StoryTitle } from "@/components/visual";
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
        <Suspense fallback={<p className="text-body-sm text-muted-foreground">Loading...</p>}>
          <LoginForm />
        </Suspense>
      </GlassPanel>
    </div>
  );
}
