import { useState, useEffect, useCallback } from "react";
import { authManager } from "../auth/AuthManager";

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

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      validateSession(sessionId);
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const validateSession = async (sessionId: string) => {
    try {
      const isValid = await authManager.validateSession(sessionId);
      if (isValid) {
        const user = await authManager.getUser(sessionId);
        setState({
          user,
          loading: false,
          error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const session = await authManager.login(
        email,
        password,
        window.location.hostname,
        navigator.userAgent,
      );
      localStorage.setItem("sessionId", session.id);
      const user = await authManager.getUser(session.id);
      setState({
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: "Invalid credentials",
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        await authManager.logout(sessionId);
        localStorage.removeItem("sessionId");
      }
      setState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
        }));
        return user;
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: "Failed to register",
        });
        throw error;
      }
    },
    [],
  );

  const hasAccess = useCallback(async (feature: string) => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      return false;
    }
    return authManager.hasAccess(sessionId, feature);
  }, []);

  const updatePreferences = useCallback(
    async (preferences: Partial<User["preferences"]>) => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          throw new Error("No active session");
        }
        const user = await authManager.updateUserPreferences(
          sessionId,
          preferences,
        );
        setState((prev) => ({
          ...prev,
          user,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to update preferences",
        }));
      }
    },
    [],
  );

  return {
    ...state,
    login,
    logout,
    register,
    hasAccess,
    updatePreferences,
  };
}
