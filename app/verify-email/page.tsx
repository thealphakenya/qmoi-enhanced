"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setError("No verification token found in the URL.");
      return;
    }

    const verify = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setMessage(data.message || "Your email has been verified successfully.");
          setError(null);
        } else {
          setError(data.error || data.message || "Email verification failed.");
        }
      } catch (_err) {
        setError("Network error while verifying email.");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Verify Email</h1>
          <p className="mt-2 text-sm text-slate-400">Completing this step ensures your QMOI account is fully activated.</p>
          <div className="mt-6 space-y-4">
            {isLoading && <p className="text-slate-300">Verifying your email...</p>}
            {message && <p className="rounded-2xl bg-emerald-950 px-4 py-3 text-emerald-300">{message}</p>}
            {error && <p className="rounded-2xl bg-red-950 px-4 py-3 text-red-300">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
