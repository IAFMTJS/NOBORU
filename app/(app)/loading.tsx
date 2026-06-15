import { SceneImage } from "@/components/media/scene-image";
import { YamaLoading } from "@/components/ui/yama-loading";

/** Illustrated loading splash — camp trail at night (Doc 08). */
export default function AppLoading() {
  return (
    <div className="relative flex min-h-[50dvh] flex-col items-center justify-center">
      <SceneImage
        scene="camp_base"
        alt=""
        className="pointer-events-none absolute inset-0 object-cover opacity-40"
      />
      <div className="relative z-10">
        <YamaLoading />
      </div>
    </div>
  );
}
