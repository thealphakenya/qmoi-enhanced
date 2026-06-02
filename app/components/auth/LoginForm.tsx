import React, { useState } from "react";
import BiometricAuth from "@/components/auth/BiometricAuth";
import { persistUserToStorage } from "@/lib/auth/persistence";
import { logAuthEvent } from "@/lib/auth/memory";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBiometric, setShowBiometric] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = async (userId, confidence) => {
    if (typeof window !== "undefined") {
    }

    setShowBiometric(false);
    persistUserToStorage({ id: userId, role: "user", displayName: "Biometric User" });
    logAuthEvent({ userId, role: "user", displayName: "Biometric User", event: 'biometric_signin', details: { confidence } });
    onLogin({ id: userId, displayName: "Biometric User", role: "user", permissions: ["general_chat", "help_support", "wallet_view"], accessLevel: 30 });
  };

  const handleBiometricFailure = (reason) => {
    setError(reason);
  };

  return (
    <div className="max-w-md mx-auto space-y-5">
      {showBiometric ? (
        <BiometricAuth
          onAuthenticated={handleBiometricSuccess}
          onFailed={handleBiometricFailure}
          requiredConfidence={0.8}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900 p-6 rounded-3xl border border-slate-700">
          <h2 className="text-2xl font-semibold text-white">Login to QMOI AI</h2>
          {error && <p className="text-red-400">{error}</p>}
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              placeholder="••••••••••"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
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
        </form>
      )}
    </div>
  );
}
