"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";

// Loads data from the server when the page opens (or when `path` changes)
export function useFetch<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setData(await api<T>(path));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoadedPath(path);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  // loading is true until the current path has been loaded
  return { data, loading: loadedPath !== path, error, reload: load };
}
