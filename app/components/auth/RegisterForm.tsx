import React, { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
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
      <h2 className="text-2xl font-semibold text-white">Create Account</h2>
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="••••••••••"
          required
        />
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
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
