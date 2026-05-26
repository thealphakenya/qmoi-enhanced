"use client";
import React, { useMemo, useState } from "react";
interface FileEntry {
  id: string;
  name: string;
  size: string;
  type: string;
  modified: string;
  tags: string[];
}
const defaultFiles: FileEntry[] = [
  {
    id: "1",
    name: "design-system.pdf",
    size: "2.4 MB",
    type: "PDF",
    modified: "2026-05-18",
    tags: ["design", "release"],
  },
  {
    id: "2",
    name: "deployment-plan.md",
    size: "57 KB",
    type: "Markdown",
    modified: "2026-05-22",
    tags: ["ops", "strategy"],
  },
  {
    id: "3",
    name: "user-feedback.csv",
    size: "126 KB",
    type: "CSV",
    modified: "2026-05-20",
    tags: ["data", "feedback"],
  },
];
export default function QFileManager(): JSX.Element {
  const [query, setQuery] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const filteredFiles = useMemo(
    () =>
      defaultFiles.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  const selectedFile = defaultFiles.find((file) => file.id === selectedFileId);
  return (
    <div className="space-y-6 p-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">File Manager</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse and preview repository files safely.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="search" className="text-sm font-medium text-slate-700">
              Search files
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by file name..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-medium text-slate-700">Files</div>
            <ul className="space-y-3">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <li
                    key={file.id}
                    className={`rounded-2xl border px-4 py-3 transition ${
                      selectedFileId === file.id
                        ? "border-slate-900 bg-slate-100"
                        : "border-transparent bg-white hover:border-slate-200"
                    }`}
                    onClick={() => setSelectedFileId(file.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.type}</p>
                      </div>
                      <span className="text-xs text-slate-500">{file.size}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                      {file.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-200 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </li>
                ))
              ) : (
                <li className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                  No files match your search.
                </li>
              )}
            </ul>
          </div>
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 text-sm font-medium text-slate-700">File details</div>
          {selectedFile ? (
            <div className="space-y-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">Updated {selectedFile.modified}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-slate-400">Type</span>
                  <span>{selectedFile.type}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-slate-400">Size</span>
                  <span>{selectedFile.size}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-900">Preview</p>
                <p className="mt-2 text-sm text-slate-500">
                  This preview panel shows file metadata and quick actions for selected files.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Select a file to view details.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
