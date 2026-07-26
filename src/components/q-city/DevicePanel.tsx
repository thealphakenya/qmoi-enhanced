import React, { useEffect, useState } from "react";

export default function DevicePanel() {
  type Device = {
    id?: string;
    name: string;
    host: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
  };
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string>("");
  const [form, setForm] = useState<Device>({
    name: "",
    host: "",
    port: 22,
    username: "",
    password: "",
    privateKey: "",
  });
  const [editing, setEditing] = useState<Device | null>(null);
  const [testResult, setTestResult] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchDevices = () => {
    setLoading(true);
    fetch("/api/qcity/devices", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data) => setDevices((data.items as Device[]) || []))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const save = () => {
    setLoading(true);
    fetch("/api/qcity/devices", {
      method: editing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
    })
      .then(fetchDevices)
      .then(() => {
        setForm({
          name: "",
          host: "",
          port: 22,
          username: "",
          password: "",
          privateKey: "",
        });
        setEditing(null);
      })
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  const del = (id: string) => {
    setLoading(true);
    fetch("/api/qcity/devices", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    })
      .then(fetchDevices)
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  const test = (id: string) => {
    setTestResult("Testing...");
    fetch("/api/qcity/devices?action=test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    })
      .then((r) => r.json())
      .then((_res: unknown) => {
        const data = res as Record<string, unknown>;
        setTestResult(
          data.success ? "Success" : String(data.error ?? "Failed"),
        );
      })
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setTestResult(msg);
      });
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Devices</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(_e) => {
          _e.preventDefault();
          save();
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(_e) => setForm((f) => ({ ...f, name: _e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Host"
          value={form.host}
          onChange={(_e) => setForm((f) => ({ ...f, host: _e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Port"
          type="number"
          value={form.port}
          onChange={(_e) =>
            setForm((f) => ({ ...f, port: Number(_e.target.value) }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Username"
          value={form.username}
          onChange={(_e) =>
            setForm((f) => ({ ...f, username: _e.target.value }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(_e) =>
            setForm((f) => ({ ...f, password: _e.target.value }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Private Key"
          value={form.privateKey}
          onChange={(_e) =>
            setForm((f) => ({ ...f, privateKey: _e.target.value }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-cyan-700 rounded text-white"
        >
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                name: "",
                host: "",
                port: 22,
                username: "",
                password: "",
                privateKey: "",
              });
            }}
            className="px-3 py-1 bg-gray-700 rounded text-white"
          >
            Cancel
          </button>
        )}
      </form>
      {testResult && (
        <div className="text-xs text-cyan-400 mb-2">{testResult}</div>
      )}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Name</th>
              <th>Host</th>
              <th>Port</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((dev: Device, i: number) => (
              <tr key={i}>
                <td>{dev.name}</td>
                <td>{dev.host}</td>
                <td>{dev.port}</td>
                <td>{dev.username}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditing(dev);
                      setForm(dev);
                    }}
                    className="px-2 py-1 bg-gray-700 rounded text-white mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(dev.id ?? "")}
                    className="px-2 py-1 bg-red-700 rounded text-white mr-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => test(dev.id ?? "")}
                    className="px-2 py-1 bg-cyan-700 rounded text-white"
                  >
                    Test
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// AUTOFIXED by Ollama at 2026-07-26T18:54:41.352861Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:34.388863Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:06.584354Z

// AUTOFIXED by Ollama at 2026-07-26T19:39:17.609918Z
