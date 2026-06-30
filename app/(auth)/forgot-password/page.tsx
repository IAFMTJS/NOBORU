import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { GlassPanel } from "@/components/visual/primitives/glass-panel";
import { StoryTitle } from "@/components/visual/primitives/story-title";
import { ForgotPasswordForm } from "@/features/authentication/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <AuthBrandHeader
        title="Reset your path"
        description="We'll send a link to get you back on the trail."
      />
      <GlassPanel className="space-y-4 p-5">
        <StoryTitle as="h2" className="text-sm">
          Password Reset
        </StoryTitle>
        <ForgotPasswordForm />
      </GlassPanel>
    </div>
  );
}
