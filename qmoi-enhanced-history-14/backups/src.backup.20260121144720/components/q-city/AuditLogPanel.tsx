import React, { useEffect, useState } from "react";

export default function AuditLogPanel() {
  type AuditRow = Record<string, unknown> | string[];
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [filter, setFilter] = useState({
    action: "",
    user: "",
    deviceId: "",
    status: "",
  });
  const [format, setFormat] = useState("json");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchLogs();
  }, [filter]);
  function fetchLogs() {
    setLoading(true);
    const _params = new URLSearchParams({ ...filter, format });
    fetch(`/api/qcity/audit-log?${_params.toString()}`, {
      headers: {
        "x-qcity-admin-key": localStorage.getItem("qcity-admin-key") || "",
      },
    })
      .then((r) => (format === "csv" ? r.text() : r.json()))
      .then((data) => {
        setLogs(
          format === "csv"
            ? data.split("\n").map((l: string) => l.split(","))
            : (data.logs as Record<string, unknown>[]) || [],
        );
        setLoading(false);
      })
      .catch((_e: unknown) => {
        console.warn(String(e));
        setLoading(false);
      });
  }
  function exportLogs(fmt: string) {
    setFormat(fmt);
    fetchLogs();
  }
  return (
    <div className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h3 className="font-bold text-cyan-400 mb-2">Audit Log Panel</h3>
      <div className="flex gap-2 mb-2">
        <input
          placeholder="Action"
          value={filter.action}
          onChange={(_e) =>
            setFilter((f) => ({ ...f, action: _e.target.value }))
          }
          className="bg-gray-800 p-1 rounded"
        />
        <input
          placeholder="User"
          value={filter.user}
          onChange={(_e) => setFilter((f) => ({ ...f, user: _e.target.value }))}
          className="bg-gray-800 p-1 rounded"
        />
        <input
          placeholder="Device"
          value={filter.deviceId}
          onChange={(_e) =>
            setFilter((f) => ({ ...f, deviceId: _e.target.value }))
          }
          className="bg-gray-800 p-1 rounded"
        />
        <input
          placeholder="Status"
          value={filter.status}
          onChange={(_e) =>
            setFilter((f) => ({ ...f, status: _e.target.value }))
          }
          className="bg-gray-800 p-1 rounded"
        />
        <button
          onClick={() => exportLogs("json")}
          className="bg-cyan-700 px-2 py-1 rounded"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportLogs("csv")}
          className="bg-cyan-700 px-2 py-1 rounded"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto text-xs" aria-live="polite">
        {loading ? (
          "Loading..."
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>User</th>
                <th>Device</th>
                <th>Status</th>
                <th>Command</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l: AuditRow, i) => (
                <tr key={i}>
                  {Array.isArray(l) ? (
                    <>
                      <td>{l[0] ?? ""}</td>
                      <td>{l[1] ?? ""}</td>
                      <td>{l[2] ?? ""}</td>
                      <td>{l[3] ?? ""}</td>
                      <td>{l[4] ?? ""}</td>
                      <td>{l[5] ?? ""}</td>
                    </>
                  ) : (
                    <>
                      <td>
                        {String((l as Record<string, unknown>).timestamp ?? "")}
                      </td>
                      <td>
                        {String((l as Record<string, unknown>).action ?? "")}
                      </td>
                      <td>
                        {String((l as Record<string, unknown>).user ?? "")}
                      </td>
                      <td>
                        {String((l as Record<string, unknown>).deviceId ?? "")}
                      </td>
                      <td>
                        {String((l as Record<string, unknown>).status ?? "")}
                      </td>
                      <td>
                        {String((l as Record<string, unknown>).cmd ?? "")}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.051224Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.934998Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.080733Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.514939Z
