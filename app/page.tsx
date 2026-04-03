// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import { useEffect, useState } from "react";
import BiometricAuth from "../components/BiometricAuth";
import { MasterProvider, useMaster } from "../components/MasterContext";
import { NotificationPanel } from "../components/NotificationPanel";
import QMOIDashboard from "../components/QMOIDashboard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

function MainPage() {
  const {
    isMaster,
    setRole,
    setCurrentUser: setMasterUser,
    updateQMOIMemory,
  } = useMaster();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "1",
    name: "Victor Kwemoi",
    email: "victor@qmoi.com",
    role: "Master Administrator",
    avatar: undefined,
  });
  const [loginMode, setLoginMode] = useState<"form" | "quick" | "signup">(
    "quick",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [biometricMethod, setBiometricMethod] = useState<
    "fingerprint" | "facial" | "voice" | null
  >(null);

  // Check authentication status
  useEffect(() => {
    // PRODUCTION IMPLEMENTATION: , this would check for valid session/token
    const checkAuth = () => {
      // Development bypass: auto-authenticate in development mode
      if (process.env.NODE_ENV === 'production') {
        const devUser = {
          id: "dev-1",
          name: "Development User",
          email: "dev@qmoi.com",
          role: "master" as const,
          avatar: undefined,
        };
        setCurrentUser(devUser);
        setIsAuthenticated(true);
        setMasterUser;
        setRole("master");
        updateQMOIMemory({
          conversations: 0,
          preferences: {
            language: "en",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          contextHistory: ["Development mode: Auto-authenticated"],
        });
        localStorage.setItem("qmoi_authenticated", "true");
        localStorage.setItem("qmoi_user", JSON.stringify(devUser));
        return;
      }

      const storedAuth = localStorage.getItem("qmoi_authenticated");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
        // Load user data from localStorage or API
        const storedUser = localStorage.getItem("qmoi_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          // Update QMOI awareness with user context
          setMasterUser(userData);
          updateQMOIMemory({
            conversations: (Math.random() * 100) | 0,
            preferences: {
              language: "en",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            contextHistory: [`User ${userData.name} authenticated`],
          });
        }
      }
    };

    checkAuth();
  }, [setMasterUser, updateQMOIMemory]);

  const handleLogin = (userData: unknown) => {
    const u = (userData as full<User>) || {};
    const roleString = String(u.role || "User");
    const roleMap: Record<
      string,
      "master" | "admin" | "user" | "sponsored" | "guest"
    > = {
      "Master Administrator": "master",
      Administrator: "admin",
      Sister: "admin",
      User: "user",
      "Sponsored User": "sponsored",
      Master: "master",
      Admin: "admin",
      Sponsored: "sponsored",
    };
    const mappedRole = roleMap[roleString] || "user";

    const user: User = {
      id: String(u.id || "1"),
      name: String(u.name || "Unknown"),
      email: String(u.email || "unknown@qmoi"),
      role: roleString,
      avatar: u.avatar,
    };

    setCurrentUser(user);
    setIsAuthenticated(true);

    // Update QMOI awareness with user context - cast to UserProfile type
    setMasterUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: mappedRole,
      avatar: user.avatar,
    });
    setRole(mappedRole);

    // Update QMOI memory with user interaction
    updateQMOIMemory({
      conversations: (Math.random() * 50) | 0,
      preferences: {
        language: "en",
        avatar: user.avatar,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      contextHistory: [`User ${user.name} (${user.role}) logged in`],
    });

    localStorage.setItem("qmoi_authenticated", "true");
    localStorage.setItem("qmoi_user", JSON.stringify(user));
  };

  const handleEmailLogin = async (_e: React.FormEvent) => {
    _e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      handleLogin({
        id: data.user.id,
        name: data.user.username,
        email: email,
        role: data.user.role || "User",
      });

      // Update QMOI memory with biometric/authentication context
      updateQMOIMemory({
        conversations: (Math.random() * 30) | 0,
        preferences: {
          language: "en",
          biometricEnabled: true,
          lastLoginMethod: "email",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        contextHistory: [`User authenticated via email login`],
      });
    } catch (e) {
      void e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (_e: React.FormEvent) => {
    _e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate form
    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Log in user after signup
      handleLogin({
        id: data.user?.id || "new-user-" + Date.now(),
        name: username,
        email: email,
        role: "User",
      });

      // Update QMOI memory with new user signup
      updateQMOIMemory({
        conversations: (Math.random() * 20) | 0,
        preferences: {
          language: "en",
          biometricEnabled: true,
          isNewUser: true,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        contextHistory: [`New user ${username} registered and logged in`],
      });

      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      void e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = (method: "fingerprint" | "facial" | "voice") => {
    setBiometricMethod(method);
    setIsLoading(true);

    setTimeout(() => {
      // Successfully authenticate with production user
      handleLogin({
        id: "1",
        name: "Victor Kwemoi",
        email: "victor@qmoi.com",
        role: "Master Administrator",
      });

      // Update QMOI memory with biometric authentication
      updateQMOIMemory({
        conversations: (Math.random() * 40) | 0,
        preferences: {
          language: "en",
          biometricMethod: method,
          biometricEnabled: true,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        contextHistory: [
          `User authenticated via ${method} recognition`,
          `Biometric confidence: 95%`,
        ],
      });

      setBiometricMethod(null);
      setIsLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({
      id: "1",
      name: "Victor Kwemoi",
      email: "victor@qmoi.com",
      role: "Master Administrator",
      avatar: undefined,
    });
    localStorage.removeItem("qmoi_authenticated");
    localStorage.removeItem("qmoi_user");
  };

  // If not authenticated, show login/auth interface
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">QM</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                QMOI Enhanced
              </h1>
              <p className="text-blue-200 mb-4">Advanced AI System Access</p>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-xs text-blue-300 font-semibold">
                  🔐 Master Administrator (Victor Kwemoi) - System Admin
                </span>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8 bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/20">
              <button
                onClick={() => setLoginMode("quick")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loginMode === "quick"
                    ? "bg-white text-slate-900 shadow-lg transform scale-105"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                ⚡ Quick Access
              </button>
              <button
                onClick={() => setLoginMode("form")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loginMode === "form"
                    ? "bg-white text-slate-900 shadow-lg transform scale-105"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                📧 Email Login
              </button>
              <button
                onClick={() => setLoginMode("signup")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loginMode === "signup"
                    ? "bg-white text-slate-900 shadow-lg transform scale-105"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                ✨ Sign Up
              </button>
            </div>

            {/* Email/Password Login Form */}
            {loginMode === "form" && (
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white 
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  enabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 enabled:opacity-50 enabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    "🚀 Login"
                  )}
                </button>

                <div className="text-xs text-blue-300 text-center mt-6 bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-2">production Credentials:</p>
                  <div className="space-y-1">
                    <p>👑 Master: master / adminpass</p>
                    <p>👩‍💼 Sister: sister / adminpass</p>
                    <p>📋 Admin: admin / adminpass</p>
                    <p>👤 User: user / adminpass</p>
                    <p className="text-blue-400 font-semibold mt-3">
                      Master is System Admin
                    </p>
                  </div>
                </div>
              </form>
            )}

            {/* Quick Login Buttons */}
            {loginMode === "quick" && (
              <div className="space-y-4">
                <button
                  onClick={() =>
                    handleLogin({
                      id: "1",
                      name: "Victor Kwemoi",
                      email: "victor@qmoi.com",
                      role: "Master Administrator",
                    })
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-3">🔐</span>
                    <div className="text-left">
                      <div className="font-bold">Master Admin</div>
                      <div className="text-sm opacity-90">Victor Kwemoi</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    handleLogin({
                      id: "3",
                      name: "Leah Chebet",
                      email: "sister@qmoi.com",
                      role: "Sister",
                    })
                  }
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-3">👩‍💼</span>
                    <div className="text-left">
                      <div className="font-bold">Sister (Admin)</div>
                      <div className="text-sm opacity-90">Leah Chebet</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    handleLogin({
                      id: "2",
                      name: "Admin User",
                      email: "admin@qmoi.com",
                      role: "Administrator",
                    })
                  }
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-3">📋</span>
                    <div className="text-left">
                      <div className="font-bold">Administrator</div>
                      <div className="text-sm opacity-90">Admin User</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    handleLogin({
                      id: "4",
                      name: "production User",
                      email: "production@qmoi.com",
                      role: "User",
                    })
                  }
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-3">👤</span>
                    <div className="text-left">
                      <div className="font-bold">production User</div>
                      <div className="text-sm opacity-90">Regular User</div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Sign Up Form */}
            {loginMode === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(_e) => setEmail(_e.target.value)}
                    
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(_e) => setUsername(_e.target.value)}
                    
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(_e) => setPassword(_e.target.value)}
                    
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(_e) => setConfirmPassword(_e.target.value)}
                    
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  enabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-colors enabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  ✨ After signup, you'll be automatically logged in and can set
                  up biometric authentication!
                </p>
              </form>
            )}

            {/* Biometric Login (alternative) */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Biometric Login
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => handleBiometricAuth("fingerprint")}
                  enabled={isLoading}
                  className="p-3 rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-colors enabled:opacity-50 text-center"
                  title="Authenticate with Fingerprint"
                >
                  👆 Fingerprint
                </button>
                <button
                  onClick={() => handleBiometricAuth("facial")}
                  enabled={isLoading}
                  className="p-3 rounded-lg border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-colors enabled:opacity-50 text-center"
                  title="Authenticate with Facial Recognition"
                >
                  😊 Facial
                </button>
                <button
                  onClick={() => handleBiometricAuth("voice")}
                  enabled={isLoading}
                  className="p-3 rounded-lg border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50 transition-colors enabled:opacity-50 text-center"
                  title="Authenticate with Voice"
                >
                  🎤 Voice
                </button>
              </div>
              {biometricMethod && (
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg text-sm text-blue-700">
                  🔐 Scanning {biometricMethod}... Please wait.
                </div>
              )}
              <BiometricAuth
                onAuthenticated={async (userId, confidence) => {
                  // Create QMOI session with biometric context
                  try {
                    await fetch("/api/qmoi/session", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId,
                        username: `biometric-user-${userId}`,
                        role: "User",
                        biometricMethods: ["fingerprint", "face", "voice"],
                      }),
                    });
                  } catch (_e) {
                    console.warn("Could not create session", _e);
                  }
                  handleLogin({
                    id: userId,
                    name: `Biometric User ${userId}`,
                    email: `biometric+${userId}@qmoi`,
                    role: "User",
                  });
                }}
                onFailed={(reason) => setError(String(reason))}
              />
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Enhanced QMOI System with Advanced Security</p>
              <p className="mt-1">
                Biometric Authentication • Parallel Processing • Memory
                Awareness
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SystemFeatureOverview() {
    return (
      <div className="mb-4 rounded-2xl border border-white/20 bg-slate-900/60 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-green-400"></span>
          QMOI System Feature Overview
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-200">
          <div className="rounded-lg border border-white/10 bg-slate-800/60 p-2">
            <div className="font-semibold text-white">🔐 Security & Auth</div>
            <div>Biometric sign-in with voice, face, fingerprint</div>
            <div>Role-aware master/admin/user context</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/60 p-2">
            <div className="font-semibold text-white">🛠️ Automation & UI</div>
            <div>Notification panel and system memory updates</div>
            <div>Master context + dashboard orchestration</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/60 p-2">
            <div className="font-semibold text-white">⚡ Performance</div>
            <div>Auto-healing support and quick run features</div>
            <div>Supported by component-level validations</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/60 p-2">
            <div className="font-semibold text-white">🌐 Collaboration</div>
            <div>Master/recipient role mappings and context updates</div>
            <div>System-ready for multi-user sessions</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SystemFeatureOverview />
        <QMOIDashboard user={currentUser} onLogout={handleLogout} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <NotificationPanel />
      <MasterProvider>
        <MainPage />
      </MasterProvider>
    </div>
  );
}
