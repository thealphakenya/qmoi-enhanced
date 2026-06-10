"use client";

import QAlphaShell from "@/components/qalpha/QAlphaShell";
import UniversalRouteGuard from "@/app/components/auth/UniversalRouteGuard";

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QAlphaShell />
    </UniversalRouteGuard>
  );
}
