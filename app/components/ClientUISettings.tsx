"use client";

import dynamic from "next/dynamic";

// Load UISettings only on the client to avoid SSR issues
const DynamicUISettings = dynamic(
  () => import("../../src/components/UISettings"),
  { ssr: false }
);

export function ClientUISettings() {
  return (
    <div id="qmoi-ui-settings-placeholder">
      <DynamicUISettings />
    </div>
  );
}
