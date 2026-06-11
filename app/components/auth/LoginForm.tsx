import React, { useState } from "react";
import BiometricAuth from "@/components/auth/BiometricAuth";
import { persistUserToStorage, persistAuthTokens } from "../../lib/auth/persistence";
import { logAuthEvent } from "@/lib/auth/memory";

interface LoginFormProps {
  onLogin: (user: {
    id: string;
    displayName: string;
    role: string;
    permissions: string[];
    accessLevel: number;
  }) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBiometric, setShowBiometric] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const persistedUser = {
          id: data?.user?.id || `qmoi-user-${Date.now()}`,
          role: data?.user?.role || "user",
          displayName:
            data?.user?.displayName || data?.user?.fullName || data?.user?.username || data?.user?.email || email || "QMOI User",
          permissions: data?.user?.permissions || ["general_chat", "help_support", "wallet_view"],
          accessLevel: data?.user?.accessLevel ?? 30,
        };

        persistUserToStorage({
          id: persistedUser.id,
          role: persistedUser.role,
          displayName: persistedUser.displayName,
        });
        persistAuthTokens({
          accessToken: data?.tokens?.accessToken ?? null,
          refreshToken: data?.tokens?.refreshToken ?? null,
        });
        logAuthEvent({
          userId: persistedUser.id,
          role: persistedUser.role,
          displayName: persistedUser.displayName,
          event: "signin",
          details: { source: "LoginForm", identifier: data?.user?.username || email, rememberMe },
        });

        onLogin(persistedUser);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (_err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = async (userId: string, confidence: number) => {
    if (!email.trim()) {
      setError("Please enter your email or username before biometric sign-in.");
      setShowBiometric(false);
      return;
    }

    setShowBiometric(false);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.trim(),
          biometricMethod: "behavioral",
          biometricData: { confidence, verified: true },
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || data.error || "Biometric login failed.";
        setError(message);
        return;
      }

      const persistedUser = {
        id: data?.user?.id || userId,
        role: data?.user?.role || "user",
        displayName:
          data?.user?.displayName || data?.user?.fullName || data?.user?.username || email || "Biometric User",
        permissions: data?.user?.permissions || ["general_chat", "help_support", "wallet_view"],
        accessLevel: data?.user?.accessLevel ?? 30,
      };

      persistUserToStorage({
        id: persistedUser.id,
        role: persistedUser.role,
        displayName: persistedUser.displayName,
      });
      persistAuthTokens({
        accessToken: data?.tokens?.accessToken ?? null,
        refreshToken: data?.tokens?.refreshToken ?? null,
      });
      logAuthEvent({
        userId: persistedUser.id,
        role: persistedUser.role,
        displayName: persistedUser.displayName,
        event: "biometric_signin",
        details: { confidence },
      });
      onLogin(persistedUser);
    } catch (_err) {
      setError("Biometric authentication network error. Please try again.");
    }
  };

  const handleBiometricFailure = (reason: string) => {
    setError(reason);
  };

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    if (!forgotIdentifier.trim()) {
      setForgotError("Please enter your email or username.");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotIdentifier.trim(), username: forgotIdentifier.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setForgotMessage(data.message || "If that account exists, a password reset link has been sent.");
        setForgotIdentifier("");
      } else {
        setForgotError(data.error || data.message || "Unable to request password reset.");
      }
    } catch (_err) {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-5">
      {showBiometric ? (
        <BiometricAuth
          onAuthenticated={handleBiometricSuccess}
          onFailed={handleBiometricFailure}
          requiredConfidence={0.8}
        />
      ) : forgotMode ? (
        <form onSubmit={handleForgotSubmit} className="space-y-5 bg-slate-900 p-6 rounded-3xl border border-slate-700">
          <h2 className="text-2xl font-semibold text-white">Forgot Password</h2>
          <p className="text-slate-400 text-sm">
            Enter your email or username and we will send a password reset link.
          </p>
          {forgotError && (
            <p className="text-red-400" role="alert">
              {forgotError}
            </p>
          )}
          {forgotMessage && (
            <p className="text-emerald-400" role="status">
              {forgotMessage}
            </p>
          )}
          <label className="block">
            <span className="text-slate-300">Email or Username</span>
            <input
              type="text"
              value={forgotIdentifier}
              onChange={(e) => setForgotIdentifier(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              placeholder="email or username"
              required
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForgotMode(false);
                setForgotError("");
                setForgotMessage("");
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white font-semibold hover:bg-slate-700"
            >
              Back to Login
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Have a reset token? Visit <a href="/reset-password" className="text-blue-400 underline">Reset Password</a>.
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900 p-6 rounded-3xl border border-slate-700">
          <h2 className="text-2xl font-semibold text-white">Login to QMOI AI</h2>
          {error && <p className="text-red-400" role="alert">{error}</p>}
          <label className="block">
            <span className="text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              placeholder="your.email@example.com"
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-300">Password</span>
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
                placeholder="••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <label className="flex items-center gap-3 text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-500"
            />
            <span>Remember this device</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Universal Login"}
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setShowBiometric(true);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white font-semibold hover:bg-slate-700"
            >
              Use Biometric Sign-In
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setForgotError("");
                setForgotMessage("");
                setForgotMode(true);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white font-semibold hover:bg-slate-700"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
