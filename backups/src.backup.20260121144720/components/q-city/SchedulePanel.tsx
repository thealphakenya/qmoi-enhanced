import React, { useEffect, useState } from "react";
/* eslint-env browser */

export interface Schedule {
  id?: string;
  name: string;
  command: string;
  cron: string;
  deviceId: string;
  notify: string;
}

export default function SchedulePanel() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const [form, setForm] = useState<Schedule>({
    name: "",
    command: "",
    cron: "",
    deviceId: "",
    notify: "",
  } as Schedule);
  const [editing, setEditing] = useState<Schedule | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSchedules = () => {
    setLoading(true);
    fetch("/api/qcity/schedule", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data) => setSchedules((data && data.items) || ([] as Schedule[])))
      .catch((_err: unknown) => {
        console.warn("fetchSchedules failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const save = () => {
    setLoading(true);
    fetch("/api/qcity/schedule", {
      method: editing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
    })
      .then(fetchSchedules)
      .then(() => {
        setForm({
          name: "",
          command: "",
          cron: "",
          deviceId: "",
          notify: "",
        } as Schedule);
        setEditing(null);
      })
      .catch((_err: unknown) => {
        console.warn("save schedule failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  const del = (id: string) => {
    setLoading(true);
    fetch("/api/qcity/schedule", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    })
      .then(fetchSchedules)
      .catch((_err: unknown) => {
        console.warn("delete schedule failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  const runNow = (id: string) => {
    setLoading(true);
    fetch(`/api/qcity/schedule?action=run`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    })
      .then(fetchSchedules)
      .catch((_err: unknown) => {
        console.warn("runNow failed", String(_err));
        setError(
          typeof _err === "object" && _err && "message" in _err
            ? String((_err as { message?: unknown }).message)
            : String(_err),
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Schedules</h2>
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
          placeholder="Command"
          value={form.command}
          onChange={(_e) =>
            setForm((f) => ({ ...f, command: _e.target.value }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Cron"
          value={form.cron}
          onChange={(_e) => setForm((f) => ({ ...f, cron: _e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Device ID"
          value={form.deviceId}
          onChange={(_e) =>
            setForm((f) => ({ ...f, deviceId: _e.target.value }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Notify"
          value={form.notify}
          onChange={(_e) => setForm((f) => ({ ...f, notify: _e.target.value }))}
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
                command: "",
                cron: "",
                deviceId: "",
                notify: "",
              });
            }}
            className="px-3 py-1 bg-gray-700 rounded text-white"
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-300">
          <thead>
            <tr>
              <th>Name</th>
              <th>Command</th>
              <th>Cron</th>
              <th>Device</th>
              <th>Notify</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((job: Schedule, i) => (
              <tr key={i}>
                <td>{job.name}</td>
                <td>{job.command}</td>
                <td>{job.cron}</td>
                <td>{job.deviceId}</td>
                <td>{job.notify}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditing(job as Schedule);
                      setForm(job as Schedule);
                    }}
                    className="px-2 py-1 bg-gray-700 rounded text-white mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => job.id && del(job.id)}
                    className="px-2 py-1 bg-red-700 rounded text-white mr-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => job.id && runNow(job.id)}
                    className="px-2 py-1 bg-cyan-700 rounded text-white"
                  >
                    Run Now
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

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.068514Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.945678Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.091713Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.526031Z
