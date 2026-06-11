import { NoboruWordmark } from "@/components/brand/noboru-wordmark";
import { MascotImage } from "@/components/media/mascot-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/authentication/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <NoboruWordmark className="mx-auto mb-4" priority />
        <div className="relative mx-auto mb-4 h-16 w-16">
          <MascotImage alt="Yama" fill className="object-contain" priority />
        </div>
        <h1 className="text-heading-4">Reset your path</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          We&apos;ll send a link to get you back on the trail.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
