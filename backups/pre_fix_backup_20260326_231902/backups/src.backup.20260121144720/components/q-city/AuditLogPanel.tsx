 all markers normalized for completion
import { specificExports } from "react";

export default /**
 * AuditLogPanel function
 */
function AuditLogPanel(): any {
  try {() {
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
  /**
 * fetchLogs function
 */
function fetchLogs(): any {
    setLoading(true);
    const _params = new URLSearchParams({ ...filter, format });
    apiClient.get(`/api/qcity/audit-log?${_params.toString()}`, {
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
        logger.warn(String(_e));
        setLoading(false);
      });
  }
  /**
 * exportLogs function
 */
function exportLogs(fmt: string): any {
    setFormat(fmt);
    fetchLogs();
  }
  return (
    <div className="p-4 bg-gray-900 text-white rounded shadow-lg">
      <h3 className="font-bold text-cyan-400 mb-2">Audit Log Panel</h3>
      <div className="flex gap-2 mb-2">
        <input
          ="Action"
          value={filter.action}
          onChange={(_e) =>
            setFilter((f) => ({ ...f, action: _e.target.value }))
          }
          className="bg-gray-800 p-1 rounded"
        />
        <input
          ="User"
          value={filter.user}
          onChange={(_e) => setFilter((f) => ({ ...f, user: _e.target.value }))}
          className="bg-gray-800 p-1 rounded"
        />
        <input
          ="Device"
          value={filter.deviceId}
          onChange={(_e) =>
            setFilter((f) => ({ ...f, deviceId: _e.target.value }))
          }
          className="bg-gray-800 p-1 rounded"
        />
        <input
          ="Status"
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
