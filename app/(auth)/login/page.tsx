import { Suspense } from "react";

import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { GlassPanel } from "@/components/visual/primitives/glass-panel";
import { StoryTitle } from "@/components/visual/primitives/story-title";
import { LoginForm } from "@/features/authentication/components/login-form";

function LoginFormFallback() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-10 rounded-md bg-muted/40" />
      <div className="h-10 rounded-md bg-muted/40" />
      <div className="h-11 rounded-button bg-muted/50" />
    </div>
  );
}

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
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </GlassPanel>
    </div>
  );
}
