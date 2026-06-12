"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

interface UniversalRouteGuardProps {
  children: ReactNode;
}

export default function UniversalRouteGuard({ children }: UniversalRouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirectPath = searchParams?.get("redirect") || pathname || "/";
  const goto = searchParams?.get("goto") || "";
  const redirectQueryString = new URLSearchParams({ redirect: redirectPath });
  if (goto) redirectQueryString.set("goto", goto);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/universal?${redirectQueryString.toString()}`);
    }
  }, [isAuthenticated, isLoading, redirectPath, goto, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 text-center shadow-xl">
            <p className="text-lg font-semibold text-white">Preparing universal access...</p>
            <p className="mt-3 text-sm text-slate-400">Redirecting you to the universal authentication portal for secure access.</p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
