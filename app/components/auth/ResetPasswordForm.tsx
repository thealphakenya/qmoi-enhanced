"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No reset token provided. Please use the link from your email.");
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/confirm-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage(data.message || "Your password has been reset successfully.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || data.message || "Unable to reset password.");
      }
    } catch (_err) {
      setError("Network error while resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">Reset QMOI Password</h2>
      <p className="text-sm text-slate-400">
        Enter a new password using the secure reset token from your email.
      </p>
      {error && <p className="rounded-2xl bg-red-950 px-4 py-3 text-sm text-red-300">{error}</p>}
      {message && <p className="rounded-2xl bg-emerald-950 px-4 py-3 text-sm text-emerald-300">{message}</p>}
      <label className="block text-slate-300">
        <span>New Password</span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          placeholder="••••••••"
          required
        />
      </label>
      <label className="block text-slate-300">
        <span>Confirm New Password</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          placeholder="••••••••"
          required
        />
      </label>
      <button
        type="submit"
        disabled={isLoading || !token}
        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Resetting password..." : "Reset Password"}
      </button>
    </form>
  );
}
