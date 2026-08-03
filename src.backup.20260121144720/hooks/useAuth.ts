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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/hooks/useAuth.ts -->
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
  _error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    _error: null,
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
          _error: null,
        });
      } else {
        // Clear invalid session
        localStorage.removeItem("sessionId");
        setState({
          user: null,
          loading: false,
          _error: null,
        });
      }
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Failed to validate session",
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, _error: null }));
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
        _error: null,
      });
    } catch (_error) {
      setState({
        user: null,
        loading: false,
        _error: "Invalid credentials",
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
        _error: null,
      });
    } catch (_error) {
      setState((prev) => ({
        ...prev,
        _error: "Failed to logout",
      }));
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, _error: null }));
        const user = await authManager.registerUser(username, email, password);
        setState((prev) => ({
          ...prev,
          loading: false,
          _error: null,
        }));
        return user;
      } catch (_error) {
        setState({
          user: null,
          loading: false,
          _error: "Failed to register",
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
      } catch (_error) {
        setState((prev) => ({
          ...prev,
          _error: "Failed to update preferences",
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
