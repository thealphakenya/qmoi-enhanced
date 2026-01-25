"use client";

import React, { useEffect, useState } from "react";

interface AutoSetupState {
  configured: boolean;
  message: string;
  variables: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

interface AutoSetupResponse {
  success: boolean;
  message: string;
  variables: Record<string, boolean>;
  credentials?: {
    masterPassword: string;
    adminToken: string;
    apiUrl: string;
  };
}

/**
 * QMOIAutoSetup Component
 * Handles automatic environment configuration on app startup
 * Wraps app content and blocks rendering until setup is complete
 */
export default function QMOIAutoSetup({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<AutoSetupState>({
    configured: false,
    message: "Initializing QMOI environment...",
    variables: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const setupEnvironment = async () => {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          console.log("[QMOI] Starting environment auto-setup...");

          const response = await fetch("/api/qmoi/auto-setup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(
              `Setup API returned ${response.status}: ${response.statusText}`,
            );
          }

          const data: AutoSetupResponse = await response.json();

          if (data.success) {
            console.log("[QMOI] Auto-setup successful");
            console.log("[QMOI] Environment configured:");
            console.log(
              "  • MASTER_PASSWORD:",
              data.credentials?.masterPassword ? "✓" : "✗",
            );
            console.log(
              "  • ADMIN_TOKEN:",
              data.credentials?.adminToken ? "✓" : "✗",
            );
            console.log(
              "  • API_URL:",
              data.credentials?.apiUrl || "Not configured",
            );

            setStatus({
              configured: true,
              message: "QMOI environment ready!",
              variables: data.variables,
              loading: false,
              error: null,
            });
            return;
          } else {
            throw new Error(
              data.message || "Setup failed without error message",
            );
          }
        } catch (error) {
          attempts++;
          console.error(`[QMOI] Setup attempt ${attempts} failed:`, error);

          if (attempts < maxAttempts) {
            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * attempts),
            );
          } else {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            setStatus({
              configured: false,
              message: `Setup failed after ${maxAttempts} attempts`,
              variables: {},
              loading: false,
              error: errorMessage,
            });
          }
        }
      }
    };

    setupEnvironment();
  }, []);

  // If still loading, show loading screen
  if (status.loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center space-y-6">
          {/* Animated logo */}
          <div className="flex justify-center">
            <div className="animate-spin">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          </div>

          {/* Status text */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">QMOI</h1>
            <p className="text-lg text-blue-400">{status.message}</p>
          </div>

          {/* Progress indicator */}
          <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
          </div>

          {/* Environment variables being set up */}
          <div className="text-sm text-slate-400 space-y-1">
            <p>Setting up secure environment variables...</p>
            <p>This may take a few seconds.</p>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, show error screen
  if (status.error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 to-slate-950">
        <div className="text-center space-y-6 max-w-md">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>

          {/* Error text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Setup Failed</h1>
            <p className="text-red-400">{status.message}</p>
            <p className="text-sm text-slate-400 font-mono bg-slate-900 p-3 rounded border border-red-500/30">
              {status.error}
            </p>
          </div>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Retry Setup
          </button>

          {/* Help text */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>If this error persists:</p>
            <p>1. Check your internet connection</p>
            <p>2. Verify server is running: npm run dev</p>
            <p>3. Clear browser cache and try again</p>
          </div>
        </div>
      </div>
    );
  }

  // If configured, render children
  if (status.configured) {
    return <>{children}</>;
  }

  // Fallback (shouldn't reach here)
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p className="text-slate-400">Loading QMOI...</p>
    </div>
  );
}
