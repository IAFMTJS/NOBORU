import { Suspense } from "react";

import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/authentication/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthBrandHeader
        title="Welcome back, Climber"
        description="Sign in to continue your journey."
      />
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-body-sm text-muted-foreground">Loading...</p>}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
