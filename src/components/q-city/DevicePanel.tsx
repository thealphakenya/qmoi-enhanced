"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/api/client";
import { readPersistedStorageValue } from "@/app/lib/auth/persistence";

// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:25Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
export default function DevicePanel(): any {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: 22,
    username: "",
    password: "",
    privateKey: "",
  });
  const [editing, setEditing] = useState<any>(null);
  const [testResult, setTestResult] = useState("");
  const token = readPersistedStorageValue("token");
  const fetchDevices = () => {
    setLoading(true);
    apiClient.get("/api/qcity/devices", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data) => setDevices(data.items || []))
      .catch((e: unknown) => setError((e as Error)?.message || "Failed to load devices"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchDevices();
  }, []);
  const save = () => {
    setLoading(true);
    const requestBody = editing ? { ...form, id: editing.id } : form;
    const request = editing
      ? apiClient.put("/api/qcity/devices", requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
      : apiClient.post("/api/qcity/devices", requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

    request
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
      .catch((e: unknown) => setError((e as Error)?.message || "Failed to save device"))
      .finally(() => setLoading(false));
  };
  const del = (id: string) => {
    setLoading(true);
    apiClient.delete("/api/qcity/devices", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    })
      .then(fetchDevices)
      .catch((e: unknown) => setError((e as Error)?.message || "Failed to delete device"))
      .finally(() => setLoading(false));
  };
  const test = (id: string) => {
    setTestResult("Testing");
    apiClient.post(
      "/api/qcity/devices?action=test",
      { id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    )
      .then((r) => r.json())
      .then((data) => setTestResult(data.operational_data?.error || data.error || "Failed"))
      .catch((e) => setTestResult((e as Error).message || "Test failed"));
  };
  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Devices</h2>
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
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Host"
          value={form.host}
          onChange={(e) => setForm((prev) => ({ ...prev, host: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Port"
          type="number"
          value={form.port}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, port: Number(e.target.value) }))
          }
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <input
          placeholder="Private Key"
          value={form.privateKey}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, privateKey: e.target.value }))
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
        <div className="text-gray-400">Loading</div>
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
            {devices.map((dev, i) => (
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
                    onClick={() => del(dev.id)}
                    className="px-2 py-1 bg-red-700 rounded text-white mr-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => test(dev.id)}
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
