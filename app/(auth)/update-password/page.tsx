import dynamic from "next/dynamic";

import { GlassPanel } from "@/components/visual/primitives/glass-panel";
import { StoryTitle } from "@/components/visual/primitives/story-title";
import { UpdatePasswordForm } from "@/features/authentication/components/update-password-form";

const YamaAvatar = dynamic(
  () =>
    import("@/features/yama/components/yama-avatar").then((module) => ({
      default: module.YamaAvatar,
    })),
  {
    loading: () => <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted/40" aria-hidden />,
  },
);

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <YamaAvatar expression="main" size="lg" alt="Yama" />
        </div>
        <StoryTitle as="h1" className="text-xl">
          Set a new password
        </StoryTitle>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Choose a secure password for your climb.
        </p>
      </div>
      <GlassPanel className="space-y-4 p-5">
        <StoryTitle as="h2" className="text-sm">
          Update Password
        </StoryTitle>
        <UpdatePasswordForm />
      </GlassPanel>
    </div>
  );
}
