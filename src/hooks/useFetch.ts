"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";

/**
 * Loads data from the server when the page opens (or when `path` changes).
 * Pass `null` to skip loading, e.g. when the endpoint depends on the role.
 */
export function useFetch<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!path) {
      setData(null);
      setError("");
      setLoadedPath(null);
      return;
    }

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return {
    data,
    loading: path !== null && loadedPath !== path,
    error,
    reload: load,
  };
}
