import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { GlassPanel } from "@/components/visual/primitives/glass-panel";
import { StoryTitle } from "@/components/visual/primitives/story-title";
import { RegisterForm } from "@/features/authentication/components/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthBrandHeader
        title="Join the climb"
        description="Create your account and begin your ascent."
      />
      <GlassPanel className="space-y-4 p-5">
        <StoryTitle as="h2" className="text-sm">
          Create Account
        </StoryTitle>
        <RegisterForm />
      </GlassPanel>
    </div>
  );
}
