import { GlassPanel, StoryTitle } from "@/components/visual";
import { UpdatePasswordForm } from "@/features/authentication/components/update-password-form";
import { YamaAvatar } from "@/features/yama/components/yama-avatar";

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <YamaAvatar expression="main" size="lg" alt="Yama" priority />
        </div>
        <StoryTitle as="h1" className="text-xl normal-case tracking-wide">
          Set a new password
        </StoryTitle>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Choose a secure password for your climb.
        </p>
      </div>
      <GlassPanel className="space-y-4 p-5">
        <StoryTitle as="h2" className="text-sm normal-case tracking-wide">
          Update Password
        </StoryTitle>
        <UpdatePasswordForm />
      </GlassPanel>
    </div>
  );
}
