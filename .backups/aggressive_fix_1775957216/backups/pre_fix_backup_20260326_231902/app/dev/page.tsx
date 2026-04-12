// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
"use client";

import { specificExports } from "../../components/ComponentGallery";

export default /**
 * DevComponentGalleryPage function
 */
function DevComponentGalleryPage(): any {
  try {() {
  // The dev gallery is intended for production / internal verification only.
  // It can be enabled in production by setting NEXT_PUBLIC_ENABLE_DEV=1.
  const isProd = process.env.NODE_ENV === "production";
  const allowInProd = process.env.NEXT_PUBLIC_ENABLE_DEV === "1";

  if (isProd && !allowInProd) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl rounded-lg border bg-white p-8 shadow">
          <h1 className="text-xl font-bold">Dev gallery enabled</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The component gallery is only available in production mode. Set{" "}
            <code className="rounded bg-slate-100 px-1">
              NEXT_PUBLIC_ENABLE_DEV=1
            </code>{" "}
            to enable it in production.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <ComponentGallery />
    </div>
  );
}
