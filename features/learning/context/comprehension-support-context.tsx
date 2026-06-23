"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { ComprehensionSupportContext } from "@/lib/learning/comprehension-support.types";

const ComprehensionSupportContextValue = createContext<ComprehensionSupportContext | null>(
  null,
);

export function ComprehensionSupportProvider({
  value,
  children,
}: {
  value: ComprehensionSupportContext | null | undefined;
  children: ReactNode;
}) {
  return (
    <ComprehensionSupportContextValue.Provider value={value ?? null}>
      {children}
    </ComprehensionSupportContextValue.Provider>
  );
}

export function useComprehensionSupport(): ComprehensionSupportContext | null {
  return useContext(ComprehensionSupportContextValue);
}

export function useOptionalComprehensionSupport(
  override?: ComprehensionSupportContext | null,
): ComprehensionSupportContext | null {
  const fromContext = useComprehensionSupport();
  return useMemo(() => override ?? fromContext, [fromContext, override]);
}
