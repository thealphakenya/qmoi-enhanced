import Link from "next/link";

export default function QMoiSpacePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI Space</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Spatial Collaboration Hub</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                This route now serves the active Next.js application page instead of the legacy static PWA launcher.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active UI</p>
              <p className="mt-2 text-3xl font-semibold text-violet-300">Next.js App</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Model & Dataset Access</h2>
            <p className="mt-3 text-slate-400">Access QMOI Space tools for AI model workflows, dataset collaboration, and next-generation analytics.</p>
          </div>

          <Link href="/qcity" className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white transition hover:border-cyan-500 hover:bg-slate-950">
            <h3 className="text-xl font-semibold">QCity Dashboard</h3>
            <p className="mt-3 text-slate-400">Switch to the city command center for system operations.</p>
          </Link>

          <Link href="/qvillage" className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white transition hover:border-emerald-500 hover:bg-slate-950">
            <h3 className="text-xl font-semibold">QVillage</h3>
            <p className="mt-3 text-slate-400">Open the collaborative dataset village and community workspace.</p>
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Interactive Links</h2>
            <p className="mt-3 text-slate-400">Follow the active route to access QMOI system pages and avoid the old static asset path.</p>
            <Link href="/qmoi-ai" className="mt-6 inline-flex rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
              Open QMOI AI
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Developer Tools</h2>
            <p className="mt-3 text-slate-400">Use the developer utilities for tracing, diagnostics, and internal tooling in this workspace.</p>
            <Link href="/dev" className="mt-6 inline-flex rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-600">
              Open Dev Tools
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
