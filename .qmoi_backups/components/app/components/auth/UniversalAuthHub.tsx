"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  persistPrivacyMask,
  persistParallelSessions,
  readPersistedPrivacyMask,
  readPersistedParallelSessions,
} from "../../lib/auth/persistence";
import AuthStatusCard from "./AuthStatusCard";
import ForgotEmailForm from "./ForgotEmailForm";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";

const authModes = [
  { key: "signin", label: "Universal Sign In" },
  { key: "register", label: "Universal Register" },
  { key: "forgotPassword", label: "Forgot Password" },
  { key: "forgotEmail", label: "Forgot Email" },
  { key: "resetPassword", label: "Reset Password" },
];

type AuthMode = (typeof authModes)[number]["key"];

export default function UniversalAuthHub() {
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [privacyMask, setPrivacyMask] = useState(false);
  const [parallelMode, setParallelMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryApp = searchParams ? searchParams.get("app")?.trim() || "" : "";
  const redirectPath = searchParams ? searchParams.get("redirect")?.trim() || "" : "";
  const queryGoto = searchParams ? searchParams.get("goto")?.trim() || "" : "";
  const appPath = queryApp ? `/${queryApp.replace(/^\/+/, "")}` : "/qcity";
  const targetPath = redirectPath || appPath;
  const effectiveRedirect = queryGoto === "styles" && !targetPath.endsWith("/styles")
    ? `${targetPath.replace(/\/+$/, "")}/styles`
    : targetPath;
  const queryMode = searchParams ? (searchParams.get("mode") as AuthMode | null) : null;

  useEffect(() => {
    if (queryMode && authModes.some((item) => item.key === queryMode)) {
      setMode(queryMode);
    }
  }, [queryMode]);

  useEffect(() => {
    if (isAuthenticated && effectiveRedirect) {
      router.replace(effectiveRedirect);
    }
  }, [isAuthenticated, effectiveRedirect, router]);

  useEffect(() => {
    setPrivacyMask(readPersistedPrivacyMask());
    setParallelMode(readPersistedParallelSessions());
  }, []);

  const activePanel = useMemo(() => {
    switch (mode) {
      case "signin":
        return (
          <LoginForm
            onLogin={(userData) => {
              setMessage(`Welcome back, ${userData.displayName}!`);
              setMode("signin");
            }}
          />
        );
      case "register":
        return <RegisterForm />;
      case "forgotPassword":
        return (
          <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
            <h2 className="text-2xl font-semibold text-white">Forgot Password</h2>
            <p className="text-slate-400">Reset your password securely with the universal QMOI password recovery flow.</p>
            <form className="space-y-4">
              <div className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                Use the email or username linked to your QMOI account. A reset link will be delivered to your registered inbox.
              </div>
            </form>
            <ForgotEmailForm />
          </div>
        );
      case "forgotEmail":
        return <ForgotEmailForm />;
      case "resetPassword":
        return <ResetPasswordForm />;
      default:
        return null;
    }
  }, [mode]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Universal Authentication</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">QMOI Universal Auth Portal</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Central access for QMOI AI, QMOI Space, QCity, QVillage, QAlpha and all federated apps. Manage login, registration, biometrics, password recovery, email recovery, session refresh, and privacy modes from one universal portal.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-950 px-5 py-4 text-sm text-slate-300 shadow-inner shadow-slate-950/40">
            <span className="rounded-full bg-slate-800 px-3 py-2 text-slate-200">Master / Sister / User</span>
            <span className="rounded-full bg-blue-600 px-3 py-2 text-white">Unified</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-4 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Universal Login & Access</h2>
                <p className="text-sm text-slate-400">Choose an action and complete the universal auth flow with biometrics, email, or password.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {authModes.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setMode(item.key);
                    setMessage(null);
                  }}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${mode === item.key ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {message ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/40 p-4 text-sm text-emerald-200">
              {message}
            </div>
          ) : null}

          <div>{activePanel}</div>
        </section>

        <aside className="space-y-6">
          <AuthStatusCard
            user={user}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            onLogout={logout}
            onRefresh={refreshUser}
          />

          <div className="rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-xl shadow-slate-950/20">
            <h3 className="text-lg font-semibold text-white">Universal System Controls</h3>
            <p className="mt-2 text-sm text-slate-400">These features are designed for universal privacy, session awareness, and auto-sync across all QMOI shells.</p>
            <div className="mt-5 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setPrivacyMask((current) => {
                    const next = !current;
                    persistPrivacyMask(next);
                    return next;
                  });
                }}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
              >
                {privacyMask ? "Disable Privacy Mask" : "Enable Privacy Mask"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setParallelMode((current) => {
                    const next = !current;
                    persistParallelSessions(next);
                    return next;
                  });
                }}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
              >
                {parallelMode ? "Disable Parallel Sessions" : "Enable Parallel Sessions"}
              </button>
            </div>
            <div className="mt-5 rounded-3xl bg-slate-900 p-4 text-sm text-slate-300">
              <p className="font-medium text-slate-100">Universal status</p>
              <p className="mt-2">Privacy mask is <span className="font-semibold text-white">{privacyMask ? "enabled" : "disabled"}</span>.</p>
              <p className="mt-1">Parallel session handling is <span className="font-semibold text-white">{parallelMode ? "enabled" : "disabled"}</span>.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
