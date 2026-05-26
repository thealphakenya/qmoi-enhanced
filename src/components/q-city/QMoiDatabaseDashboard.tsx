"use client";
import React from "react";
const tables = [
  { name: "users" },
  { name: "transactions" },
  { name: "events" },
];
const schema = [
  { sql: "CREATE TABLE users (id INT, name TEXT);" },
  { sql: "CREATE TABLE transactions (id INT, amount DECIMAL);" },
];
const status = "Database is healthy and ready.";
export default function QMoiDatabaseDashboard() {
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Database Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Tables</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
            {tables.map((table) => (
              <li key={table.name}>{table.name}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Status</h3>
          <pre className="mt-3 text-sm text-slate-600">{status}</pre>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-900">Schema Snippets</h3>
        <pre className="mt-3 text-sm text-slate-600">{schema.map((item) => item.sql).join("\n\n")}</pre>
      </div>
    </div>
  );
}
