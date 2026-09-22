import React, { useEffect, useState } from "react";

export default function SchedulePanel() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    command: "",
    cron: "",
    deviceId: "",
    notify: "",
  });
  const [editing, setEditing] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSchedules = () => {
    setLoading(true);
    fetch("/api/qcity/schedule", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data) => setSchedules(data.items || []))
      .catch((e) => setError(e.message))
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
        setForm({ name: "", command: "", cron: "", deviceId: "", notify: "" });
        setEditing(null);
      })
      .catch((e) => setError(e.message))
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
      .catch((e) => setError(e.message))
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
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Schedules</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Command"
          value={form.command}
          onChange={(e) => setForm((f) => ({ ...f, command: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Cron"
          value={form.cron}
          onChange={(e) => setForm((f) => ({ ...f, cron: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Device ID"
          value={form.deviceId}
          onChange={(e) => setForm((f) => ({ ...f, deviceId: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Notify"
          value={form.notify}
          onChange={(e) => setForm((f) => ({ ...f, notify: e.target.value }))}
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
            {schedules.map((job, i) => (
              <tr key={i}>
                <td>{job.name}</td>
                <td>{job.command}</td>
                <td>{job.cron}</td>
                <td>{job.deviceId}</td>
                <td>{job.notify}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditing(job);
                      setForm(job);
                    }}
                    className="px-2 py-1 bg-gray-700 rounded text-white mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(job.id)}
                    className="px-2 py-1 bg-red-700 rounded text-white mr-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => runNow(job.id)}
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
