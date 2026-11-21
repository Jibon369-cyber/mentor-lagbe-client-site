"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import { api, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextType = {
  user: User | null; // user from our database (has role, plan, image...)
  loading: boolean; // true while we are checking the login
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);
  // the email we have finished loading for (null = nobody logged in)
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(
    undefined,
  );

  const email = session?.user.email ?? null;

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setToken(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      setLoadedFor(null);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const { token } = await api<{ token: string }>("/jwt"); // 1) get JWT
        if (cancelled) return;
        setToken(token);
        const dbUser = await api<User>("/users/me"); // 2) get user from database
        if (cancelled) return;
        setUser({ ...dbUser, savedTuitions: dbUser.savedTuitions ?? [] });
      } catch {
        if (cancelled) return;
        setToken(null);
        setUser(null);
      }
      if (!cancelled) setLoadedFor(email);
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [email, isPending]);

  // Still loading until we have checked the current session.
  // This is why a reload on a private page does NOT redirect to login.
  const loading = isPending || loadedFor !== email;

  async function refreshUser() {
    try {
      const dbUser = await api<User>("/users/me");
      setUser({ ...dbUser, savedTuitions: dbUser.savedTuitions ?? [] });
    } catch {
      // Keep the current user if a refresh fails temporarily.
    }
  }

  async function logout() {
    await authClient.signOut();
    setToken(null);
    setUser(null);
    setLoadedFor(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
