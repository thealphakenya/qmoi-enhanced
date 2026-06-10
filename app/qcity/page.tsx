"use client";

import QCityShell from "@/src/qcity/QCityShell";
import UniversalRouteGuard from "@/app/components/auth/UniversalRouteGuard";

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QCityShell />
    </UniversalRouteGuard>
  );
}
