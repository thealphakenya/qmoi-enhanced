"use client";

import QMOIAIShell from "@/components/qmoi/QMOIAIShell";
import UniversalRouteGuard from "@/components/auth/UniversalRouteGuard";

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QMOIAIShell />
    </UniversalRouteGuard>
  );
}
