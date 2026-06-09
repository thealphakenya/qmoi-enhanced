"use client";

import QMOISpaceShell from "@/components/qmoi/QMOISpaceShell";
import UniversalRouteGuard from "@/components/auth/UniversalRouteGuard";

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QMOISpaceShell />
    </UniversalRouteGuard>
  );
}
