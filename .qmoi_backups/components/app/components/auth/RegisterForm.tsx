import React, { useState } from "react";
import { persistUserToStorage, persistAuthTokens } from "../../lib/auth/persistence";

interface RegisterFormProps {
  onRegister?: (user: any) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username: username || email,
          password,
          name: fullName || username || email,
          acceptTerms,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess("Account created successfully. You are now logged in.");
        setEmail("");
        setUsername("");
        setPassword("");
        setFullName("");
        persistUserToStorage({
          id: data.user?.id,
          role: data.user?.role,
          displayName: data.user?.fullName || data.user?.username || data.user?.email,
        });
        persistAuthTokens({
          accessToken: data?.tokens?.accessToken ?? null,
          refreshToken: data?.tokens?.refreshToken ?? null,
        });
        if (onRegister) {
          onRegister(data.user);
        }
      } else {
        setError(data.error || data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5 bg-slate-900 p-6 rounded-3xl border border-slate-700">
      <h2 className="text-2xl font-semibold text-white">Register for QMOI Universal Access</h2>
      <p className="text-slate-400 text-sm">Create an account for QMOI AI, QMOI Space, QCity, QVillage, and QAlpha.</p>
      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-emerald-400">{success}</p>}
      <label className="block">
        <span className="text-slate-300">Full Name</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="text-slate-300">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="your.email@${EXAMPLE_HOST}"
          required
        />
      </label>
      <label className="block">
        <span className="text-slate-300">Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="username"
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
            onClick={() => setShowPassword((value) => !value)}
            className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      <label className="flex items-center gap-3 text-slate-300">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-500"
        />
        <span>I accept the terms and conditions</span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Registering..." : "Create Universal Account"}
      </button>
    </form>
  );
}
