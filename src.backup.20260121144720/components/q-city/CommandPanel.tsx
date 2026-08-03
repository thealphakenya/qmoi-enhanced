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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.532588Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.576357Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/CommandPanel.tsx -->
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
  type HistoryItem = { cmd: string; deviceId: string; ts: number };
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-history") || "[]",
      ) as HistoryItem[];
    } catch (e) {
      return [];
    }
  });
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("qcity-cmd-pinned") || "[]",
      ) as string[];
    } catch (e) {
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
      es.onmessage = (ev: MessageEvent) => {
        if (ev.data === "[DONE]") {
          es.close();
          setLoading(false);
        } else setOutput((o) => o + String(ev.data));
      };
      es.onerror = (_err: Event) => {
        console.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      fetch("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          console.warn(String(_e));
          setLoading(false);
          setOutput((o) => o + "\n[Error]");
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
          onChange={(_e) => setCmd(_e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded"
          placeholder="Enter command..."
        />
        <select
          value={deviceId}
          onChange={(_e) => setDeviceId(_e.target.value)}
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
        {pinned.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item)}
            className="ml-2 px-2 py-1 bg-cyan-800 rounded text-xs"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-2">
        <span className="font-bold">History:</span>
        {history.map((item: HistoryItem, i: number) => (
          <button
            key={i}
            onClick={() => setCmd(item.cmd)}
            className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs"
          >
            {item.cmd}
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.054013Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.936283Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.082006Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.516285Z
