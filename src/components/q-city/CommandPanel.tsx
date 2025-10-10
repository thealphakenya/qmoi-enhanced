import React, { useState, useRef } from "react";

const COMMON_COMMANDS = [
  { label: "Build", cmd: "npm run build" },
  { label: "Install", cmd: "npm install" },
  { label: "Test", cmd: "npm test" },
  { label: "Lint", cmd: "npm run lint" },
  { label: "Deploy", cmd: "npm run deploy" },
];

function mask(cmd: string) {
  return /pass|secret|token|key|rm|delete|reset/i.test(cmd) ? "[MASKED]" : cmd;
}

export default function CommandPanel() {
  const [cmd, setCmd] = useState("");
  const [deviceId, setDeviceId] = useState("qcity");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qcity-cmd-history") || "[]");
    } catch {
      return [];
    }
  });
  const [pinned, setPinned] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qcity-cmd-pinned") || "[]");
    } catch {
      return [];
    }
  });
  const [confirm, setConfirm] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  function runCommand(stream = true) {
    if (/rm|delete|reset/i.test(cmd) && !confirm) {
      setConfirm(true);
      return;
    }
    setLoading(true);
    setOutput("");
    const body = JSON.stringify({ cmd, deviceId, stream });
    const headers = {
      "Content-Type": "application/json",
      "x-qcity-admin-key": localStorage.getItem("qcity-admin-key") || "",
    };
    if (stream) {
      const es = new EventSource(
        `/api/qcity/remote-command?body=${encodeURIComponent(body)}`,
      );
      eventSourceRef.current = es;
      es.onmessage = (e) => {
        if (e.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + e.data);
      };
      es.onerror = () => {
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((res) => {
          setOutput(res.output || res.error);
          setLoading(false);
        });
    }
    const newHistory = [
      { cmd: mask(cmd), deviceId, ts: Date.now() },
      ...history,
    ].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("qcity-cmd-history", JSON.stringify(newHistory));
  }
  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("qcity-cmd-history");
    setPinned([]);
    localStorage.removeItem("qcity-cmd-pinned");
  }
  return (
    <div className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h3 className="font-bold text-cyan-400 mb-2">Remote Command Panel</h3>
      <div className="flex gap-2 mb-2">
        <input
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="qcity">QCity</option>
          {/* Add more devices as needed */}
        </select>
        <button
          onClick={() => runCommand(true)}
          disabled={loading}
          className="bg-cyan-700 px-3 py-1 rounded"
        >
          Run
        </button>
      </div>
      <div className="mb-2">
        {COMMON_COMMANDS.map((c) => (
          <button
            key={c.label}
            onClick={() => setCmd(c.cmd)}
            className="mr-2 px-2 py-1 bg-gray-700 rounded text-sm"
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">Pinned:</span>
  {pinned.map((c: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(c)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
  {history.map((h: any, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(h.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {h.cmd}
          </button>
        ))}
        <button
          onClick={clearHistory}
          className="ml-2 px-2 py-1 bg-red-700 rounded text-xs"
        >
          Clear
        </button>
      </div>
      {confirm && (
        <div className="bg-yellow-900 p-2 rounded mb-2">
          <span>Are you sure you want to run a destructive command?</span>
          <button
            onClick={() => {
              setConfirm(false);
              runCommand();
            }}
            className="ml-2 px-2 py-1 bg-red-700 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirm(false)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded"
          >
            No
          </button>
        </div>
      )}
      <div
        className="bg-black p-2 rounded h-40 overflow-y-auto text-xs whitespace-pre-wrap"
        aria-live="polite"
      >
        {output}
      </div>
    </div>
  );
}
