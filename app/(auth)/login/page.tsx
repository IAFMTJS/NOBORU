import { Suspense } from "react";

import { MascotImage } from "@/components/media/mascot-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/authentication/components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <MascotImage alt="Yama" fill className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-semibold">Welcome back, Climber</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue your journey.
        </p>
      </div>
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
