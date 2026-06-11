import UniversalAuthHub from "../components/auth/UniversalAuthHub";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900 px-6 py-8 shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Universal Gateway</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">QMOI Universal Auth & App Access</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                Use one unified portal for login, registration, password recovery, and privacy controls. After successful validation, your session will redirect to the selected app shell and apply its intended styling.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "QCity", path: "qcity" },
                { label: "QMOI AI", path: "qmoi-ai" },
                { label: "QVillage", path: "qvillage" },
                { label: "QAlpha", path: "qalpha" },
                { label: "QMOI Space", path: "qmoi-space" },
              ].map((app) => (
                <a
                  key={app.path}
                  href={`/universal?app=${app.path}&mode=signin`}
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-slate-800"
                >
                  {app.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
      <UniversalAuthHub />
    </main>
  );
}
