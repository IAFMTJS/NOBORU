import { MascotImage } from "@/components/media/mascot-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/features/authentication/components/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <MascotImage alt="Yama" fill className="object-contain" priority />
        </div>
        <h1 className="text-heading-4">Set a new password</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Choose a secure password for your climb.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
