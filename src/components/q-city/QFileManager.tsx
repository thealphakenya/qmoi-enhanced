"use client";
import React, { useEffect, useState } from "react";
interface FileItem {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
}
export default function QFileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchFiles() {
      try {
        const res = await fetch('/api/qcity/files');
        if (!res.ok) throw new Error(`Failed to fetch files: ${res.status}`);
        const json = await res.json();
        if (mounted) setFiles(json.files || json || []);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchFiles();
    return () => { mounted = false };
  }, []);
  const filtered = files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">QFile Manager</h2>
          <p className="text-sm text-slate-500">Browse and manage files stored in the QCity system.</p>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          placeholder="Search files"
        />
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
        {loading && <div className="p-4 text-sm text-slate-500">Loading files...</div>}
        {error && <div className="p-4 text-sm text-red-600">{error}</div>}
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((file) => (
              <tr key={file.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{file.name}</td>
                <td className="px-4 py-3">{file.size}</td>
                <td className="px-4 py-3">{file.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
