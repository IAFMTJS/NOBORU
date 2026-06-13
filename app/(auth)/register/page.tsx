import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/authentication/components/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthBrandHeader
        title="Join the climb"
        description="Create your account and begin your ascent."
      />
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
