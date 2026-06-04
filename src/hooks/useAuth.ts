import { useCallback, useEffect, useState } from "react";
import { readPersistedStorageValue, writePersistedStorageValue } from "@/app/lib/auth/persistence";

interface User {
  id: string;
  username: string;
  email: string;
  role: "master" | "sister" | "user";
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    tradingEnabled: boolean;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export default function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const sessionId = readPersistedStorageValue("sessionId");
    if (sessionId) validateSession(sessionId);
    else setState({ user: null, loading: false, error: null });
  }, []);

  const validateSession = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/auth/session?token=${encodeURIComponent(sessionId)}`);
      if (!res.ok) {
        writePersistedStorageValue("sessionId", null);
        setState({ user: null, loading: false, error: null });
        return false;
      }
      const data = await res.json();
      const user: User | null = data.user || null;
      if (user) {
        setState({ user, loading: false, error: null });
        return true;
      }
      setState({ user: null, loading: false, error: null });
      return false;
    } catch (err) {
      setState({ user: null, loading: false, error: "Failed to validate session" });
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      const sessionId = data.session?.id || null;
      const user: User | null = data.user || null;
      if (sessionId) writePersistedStorageValue("sessionId", sessionId);
      setState({ user, loading: false, error: null });
      return { user, sessionId };
    } catch (err: any) {
      setState({ user: null, loading: false, error: err?.message || "Invalid credentials" });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const sessionId = readPersistedStorageValue("sessionId");
      if (sessionId) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "logout", token: sessionId }),
        });
        writePersistedStorageValue("sessionId", null);
      }
      setState({ user: null, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, error: "Failed to logout" }));
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to register");
      }
      const data = await res.json();
      setState((s) => ({ ...s, loading: false, error: null }));
      return data.user;
    } catch (err: any) {
      setState({ user: null, loading: false, error: err?.message || "Failed to register" });
      throw err;
    }
  }, []);

  const hasAccess = useCallback(
    async (feature: string) => {
      if (!state.user) return false;
      if (state.user.role === "master") return true;
      // fallback: deny master-only features
      const masterOnly = ["trading", "invention_projects", "system_configuration", "user_management", "download_qcity"];
      if (masterOnly.includes(feature)) return false;
      return true;
    },
    [state.user],
  );

  const updatePreferences = useCallback(async (preferences: Partial<User["preferences"]>) => {
    try {
      const sessionId = readPersistedStorageValue("sessionId");
      if (!sessionId) throw new Error("No session");
      const res = await fetch("/api/auth/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: sessionId, preferences }),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      const data = await res.json();
      const user: User | null = data.user || null;
      if (user) setState((s) => ({ ...s, user }));
      return user;
    } catch (err) {
      setState((s) => ({ ...s, error: "Failed to update preferences" }));
      throw err;
    }
  }, []);

  return { state, login, logout, register, hasAccess, updatePreferences, validateSession };
}
