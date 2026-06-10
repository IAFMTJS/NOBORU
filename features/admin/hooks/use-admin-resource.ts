"use client";

import { useCallback, useEffect, useState } from "react";

import type { PaginatedResult } from "@/lib/api/pagination";
import type { ApiResponse } from "@/lib/api/responses";

type UseAdminResourceOptions = {
  page?: number;
  limit?: number;
};

export function useAdminResource<T, TInput>(
  endpoint: string,
  options: UseAdminResourceOptions = {},
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(options.page ?? 1);
  const [limit] = useState(options.limit ?? 50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));

      const response = await fetch(url.pathname + url.search);
      const result = (await response.json()) as ApiResponse<PaginatedResult<T>>;

      if (!result.success) {
        setError(result.error);
        setItems([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      setItems(result.data.items);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    } catch {
      setError("Unable to load content.");
      setItems([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit, page]);

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

  return {
    items,
    loading,
    error,
    page,
    setPage,
    limit,
    total,
    totalPages,
    load,
    create,
    update,
    remove,
  };
}
