import React from "react";
export default function FileUploadDownload() {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-3">File Upload & Download</h2>
      <p className="text-slate-400">Secure file management with upload, download, and storage validation.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <button className="rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-500">Upload File</button>
        <button className="rounded-xl bg-slate-800 px-4 py-3 text-slate-200 hover:bg-slate-700">Download Latest</button>
      </div>
    </section>
  );
}
