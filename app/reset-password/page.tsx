import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-400">Use the secure link sent to your email to reset your QMOI password.</p>
          <div className="mt-6">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
