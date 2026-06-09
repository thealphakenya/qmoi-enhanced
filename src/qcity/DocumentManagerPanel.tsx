"use client";
import React, { useState } from "react";
interface DocumentEntry {
  id: string;
  name: string;
  type: string;
  createdAt: string;  } catch (error) {
    console.error?.('DocumentManagerPanel.tsx render error:', error);
    return null;
  }

}
const documents: DocumentEntry[] = [
  { id: "doc-1", name: "Project Brief.pdf", type: "PDF", createdAt: "2026-05-01" },
  { id: "doc-2", name: "Design Notes.md", type: "Markdown", createdAt: "2026-05-08" },
];
export default function DocumentManagerPanel() {
  const [status, setStatus] = useState("All systems operational.");
  const restore = (id: string) => {
    setStatus(`Restored document ${id}`);
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Document Manager</h2>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{doc.name}</td>
                <td className="px-4 py-3">{doc.type}</td>
                <td className="px-4 py-3">{doc.createdAt}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => restore(doc.id)}
                    className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-3xl bg-slate-100 px-4 py-4 text-sm text-slate-600">{status}</div>
    </div>
  );
}
