"use client";



import { YamaPresence } from "@/features/yama/components/yama-presence";

import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";



type ExpeditionHeroYamaProps = {

  yama: YamaPresenceViewModel;

};



export function ExpeditionHeroYama({ yama }: ExpeditionHeroYamaProps) {

  return (

    <div className="pointer-events-none absolute bottom-2 right-2 z-10 flex max-w-[min(100%,20rem)] justify-end sm:bottom-3 sm:right-3">

      <YamaPresence

        presence={yama}

        size="xl"

        fit="full"

        layout="horizontal"

        priority

        className="flex-row-reverse items-end gap-2.5"

        bubbleClassName="max-w-[11rem] border-white/15 bg-black/50 px-3 py-2 text-caption text-white/90 shadow-lg backdrop-blur-md sm:max-w-[13rem] sm:text-body-sm"

      />

    </div>

  );

}


