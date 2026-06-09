"use client";

import { useCallback, useEffect, useState } from "react";

import type { ApiResponse } from "@/lib/api/responses";

export function useAdminResource<T, TInput>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      const result = (await response.json()) as ApiResponse<T[]>;

      if (!result.success) {
        setError(result.error);
        setItems([]);
        return;
      }

      setItems(result.data);
    } catch {
      setError("Unable to load content.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(input: TInput) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = (await response.json()) as ApiResponse<T>;
    if (!result.success) throw new Error(result.error);
    await load();
    return result.data;
  }

  async function update(id: string, input: TInput) {
    const response = await fetch(`${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = (await response.json()) as ApiResponse<T>;
    if (!result.success) throw new Error(result.error);
    await load();
    return result.data;
  }

  async function remove(id: string) {
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    const result = (await response.json()) as ApiResponse<{ id: string }>;
    if (!result.success) throw new Error(result.error);
    await load();
  }

  return { items, loading, error, load, create, update, remove };
}
