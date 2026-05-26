"use client";
import React, { useState } from "react";
interface FileItem {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
}
const sampleFiles: FileItem[] = [
  { id: "file-1", name: "dashboard.json", size: "128 KB", updatedAt: "2026-05-22" },
  { id: "file-2", name: "strategy.yaml", size: "54 KB", updatedAt: "2026-05-18" },
];
export default function QFileManager() {
  const [files] = useState<FileItem[]>(sampleFiles);
  const [search, setSearch] = useState("");
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
