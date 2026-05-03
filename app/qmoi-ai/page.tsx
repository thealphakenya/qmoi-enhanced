import Link from "next/link";

export default function QMoiAIPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">QMOI AI</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">Interactive AI Assistant</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                This route now uses the active Next.js application tree. Use the buttons below to access QMOI AI companion features and the broader QMOI dashboard network.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active UI</p>
              <p className="mt-2 text-3xl font-semibold text-cyan-300">Next.js App</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Ask QMOI</h2>
            <p className="mt-3 text-slate-400">Launch QMOI AI conversations, explore assistant workflows, and connect to the live dashboard network.</p>
          </div>

          <Link href="/qcity" className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white transition hover:border-cyan-500 hover:bg-slate-950">
            <h3 className="text-xl font-semibold">QCity Dashboard</h3>
            <p className="mt-3 text-slate-400">Open the city operations dashboard and spatial command center.</p>
          </Link>

          <Link href="/qmoi-space" className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white transition hover:border-violet-500 hover:bg-slate-950">
            <h3 className="text-xl font-semibold">QMOI Space</h3>
            <p className="mt-3 text-slate-400">Open QMOI Space for collaboration, model access, and spatial tools.</p>
          </Link>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">QVillage Access</h2>
            <p className="mt-3 text-slate-400">Navigate to QVillage for community dataset coordination, model collaboration, and shared workflows.</p>
            <Link href="/qvillage" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              Open QVillage
            </Link>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Developer & Support</h2>
            <p className="mt-3 text-slate-400">If this page is reaching you from the Next.js app, the QMOI system is wired correctly and active routes are available.</p>
            <Link href="/dev" className="mt-6 inline-flex rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-600">
              Open Dev Tools
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
