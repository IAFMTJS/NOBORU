import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/authentication/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <AuthBrandHeader
        title="Reset your path"
        description="We'll send a link to get you back on the trail."
      />
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
