import { NoboruWordmark } from "@/components/brand/noboru-wordmark";
import { MascotImage } from "@/components/media/mascot-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/authentication/components/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <NoboruWordmark className="mx-auto mb-4" priority />
        <div className="relative mx-auto mb-4 h-16 w-16">
          <MascotImage alt="Yama" fill className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-semibold">Join the climb</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your account and begin your ascent.
        </p>
      </div>
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
