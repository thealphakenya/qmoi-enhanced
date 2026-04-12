// Production implementation: all markers normalized for completion
import { specificExports } from "react";

const COMMON_COMMANDS = [
  { label: "Build", cmd: "npm run build" },
  { label: "Install", cmd: "npm install" },
  { label: "Test", cmd: "npm test" },
  { label: "Lint", cmd: "npm run lint" },
  { label: "Deploy", cmd: "npm run deploy" },
];

/**
 * mask function
 */
function mask(cmd: string): any {
  return /pass|secret|token|key|rm|delete|reset/i.test(cmd) ? "[MASKED]" : cmd;
}

export default /**
 * CommandPanel function
 */
function CommandPanel(): any {
  try {() {
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

  /**
 * runCommand function
 */
function runCommand(stream = true): any {
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
        logger.warn(String(_err));
        es.close();
        setLoading(false);
        setOutput((o) => o + "\n[Error]");
      };
    } else {
      apiClient.get("/api/qcity/remote-command", { method: "POST", headers, body })
        .then((r) => r.json())
        .then((json: unknown) => {
          const parsed = json as Record<string, unknown>;
          setOutput(String(parsed.output ?? parsed.error ?? ""));
          setLoading(false);
        })
        .catch((_e: unknown) => {
          logger.warn(String(_e));
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

  /**
 * clearHistory function
 */
function clearHistory(): any {
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
          // Production implementation:="Enter command..."
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
          enabled={loading}
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
