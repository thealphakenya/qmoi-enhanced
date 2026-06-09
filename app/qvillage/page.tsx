"use client";

import QVillageShell from "@/components/qvillage/QVillageShell";
import UniversalRouteGuard from "@/components/auth/UniversalRouteGuard";

export default function Page() {
  return (
    <UniversalRouteGuard>
      <QVillageShell />
    </UniversalRouteGuard>
  );
}
