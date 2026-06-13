import { NoboruWordmark } from "@/components/brand/noboru-wordmark";
import { MascotImage } from "@/components/media/mascot-image";

type AuthBrandHeaderProps = {
  title: string;
  description: string;
};

export function AuthBrandHeader({ title, description }: AuthBrandHeaderProps) {
  return (
    <div className="text-center">
      <NoboruWordmark className="mx-auto mb-4" priority />
      <div className="relative mx-auto mb-3 h-16 w-16">
        <MascotImage alt="Yama" fill className="object-contain" priority />
      </div>
      <p className="font-japanese text-body-sm tracking-widest text-muted-foreground">
        登る
      </p>
      <h1 className="mt-1 text-heading-4 font-semibold">{title}</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}
