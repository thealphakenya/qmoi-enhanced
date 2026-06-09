"use client";

import { useState } from "react";

export default function ForgotEmailForm() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage(data.message || "If that account exists, recovery instructions were sent to the registered contact.");
        setUsername("");
      } else {
        setError(data.error || data.message || "Unable to recover email at this time.");
      }
    } catch (_err) {
      setError("Network error while requesting email recovery.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">Forgot Your Email?</h2>
      <p className="text-sm text-slate-400">
        Enter the username or recovery identifier for your account and QMOI will send account recovery instructions.
      </p>
      {error && <p className="rounded-2xl bg-red-950 px-4 py-3 text-sm text-red-300">{error}</p>}
      {message && <p className="rounded-2xl bg-emerald-950 px-4 py-3 text-sm text-emerald-300">{message}</p>}
      <label className="block text-slate-300">
        <span>Username or Recovery ID</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          placeholder="Enter username or recovery identifier"
          required
        />
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Sending recovery info..." : "Recover Email"}
      </button>
    </form>
  );
}
