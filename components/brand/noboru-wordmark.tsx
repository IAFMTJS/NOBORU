"use client";



import Image from "next/image";

import { useTheme } from "next-themes";



import { getWordmarkPath } from "@/lib/assets/registry";

import { cn } from "@/lib/utils";



type NoboruWordmarkProps = {

  className?: string;

  priority?: boolean;

};



export function NoboruWordmark({ className, priority }: NoboruWordmarkProps) {

  const { resolvedTheme } = useTheme();

  const src = getWordmarkPath(resolvedTheme);



  if (!src) {

    return (

      <div

        className={cn(

          "flex h-12 w-40 items-center justify-center font-story text-2xl font-semibold tracking-wide text-primary",

          className,

        )}

        aria-label="NOBORU"

      >

        NOBORU

      </div>

    );

  }



  return (

    <Image

      src={src}

      alt="NOBORU"

      width={160}

      height={48}

      priority={priority}

      className={cn("h-12 w-auto object-contain", className)}

    />

  );

}

