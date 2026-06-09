"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/api/client";
import { useToast } from "@/components/ui/use-toast";

const HelpLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="ml-2 text-cyan-600 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
    aria-label={`Help: ${label}`}
    tabIndex={0}
    title={`Help: ${label}`}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline", marginRight: 2 }}
    >
      <circle cx="10" cy="10" r="9" stroke="#0891b2" strokeWidth="2" fill="#fff" />
      <text x="10" y="15" textAnchor="middle" fontSize="12" fill="#0891b2" fontFamily="Arial" fontWeight="bold">
        ?
      </text>
    </svg>
  </a>
);

export default function PluginPanel(): any {
  const [plugins, setPlugins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [pluginFile, setPluginFile] = useState<File | null>(null);
  const [pluginConfig, setPluginConfig] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get("/api/qcity/plugins");
      const data = await response.json();
      setPlugins(data.plugins || []);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to load plugins");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pluginFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("plugin", pluginFile);
      await apiClient.post("/api/qcity/plugins/upload", formData, {
        headers: { "Accept": "application/json" },
      });
      toast({ title: "Plugin Uploaded", description: pluginFile.name });
      await fetchPlugins();
      setPluginFile(null);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Plugin upload failed");
      toast({ title: "Upload failed", description: "Could not upload plugin." });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (plugin: string) => {
    setRemoving(plugin);
    try {
      await apiClient.post(
        "/api/qcity/plugins/remove",
        { plugin },
        { headers: { "Content-Type": "application/json" } }
      );
      await fetchPlugins();
      toast({ title: "Plugin Removed", description: plugin });
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to remove plugin");
    } finally {
      setRemoving(null);
    }
  };

  const savePluginConfig = (plugin: string, value: string) => {
    setPluginConfig((prev) => ({ ...prev, [plugin]: value }));
  };

  const handleConfig = async (plugin: string) => {
    setConfiguring(plugin);
    try {
      await apiClient.post(
        "/api/qcity/plugins/configure",
        { plugin, config: pluginConfig[plugin] || "" },
        { headers: { "Content-Type": "application/json" } }
      );
      toast({ title: "Plugin Configured", description: plugin });
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to save plugin config");
    } finally {
      setConfiguring(null);
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg" aria-label="Plugin Management Panel">
      <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center">
        Plugins
        <HelpLink href="/docs/PLUGINS.md" label="Plugin System Documentation" />
      </h2>
      {error && (
        <div className="text-red-400 mb-2" role="alert">
          {error}
        </div>
      )}
      <form className="mb-4 flex flex-col gap-2" onSubmit={handleUpload} aria-label="Upload Plugin Form">
        <label className="text-xs text-gray-300" htmlFor="plugin-upload">
          Upload Plugin (.js/.ts):
        </label>
        <input
          id="plugin-upload"
          type="file"
          accept=".js,.ts"
          onChange={(e) => setPluginFile(e.target.files?.[0] || null)}
          aria-label="Select plugin file to upload"
          className="text-xs text-gray-200 bg-gray-800 border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-cyan-700 text-white rounded text-xs mt-1"
          disabled={uploading || !pluginFile}
          aria-label="Upload plugin"
        >
          {uploading ? "Uploading" : "Upload"}
        </button>
      </form>
      {loading ? (
        <div className="text-gray-400">Loading</div>
      ) : (
        <ul className="text-xs text-gray-300" aria-label="Plugin List">
          {plugins.map((p, i) => (
            <li key={i} className="mb-2 flex flex-col gap-1 bg-gray-800 rounded p-2">
              <div className="flex items-center gap-2">
                <span>{p}</span>
                <button
                  className="px-2 py-1 bg-red-700 rounded text-white text-xs"
                  onClick={() => handleRemove(p)}
                  disabled={removing === p}
                  aria-label={`Remove plugin ${p}`}
                >
                  {removing === p ? "Removing" : "Remove"}
                </button>
                <button
                  className="px-2 py-1 bg-gray-700 rounded text-white text-xs"
                  onClick={() => setConfiguring(configuring === p ? null : p)}
                  aria-label={`Configure plugin ${p}`}
                >
                  {configuring === p ? "Close Config" : "Configure"}
                </button>
                <span className="text-green-400">Loaded</span>
              </div>
              {configuring === p && (
                <form
                  className="flex flex-col gap-1 mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfig(p);
                  }}
                  aria-label={`Config form for ${p}`}
                >
                  <label className="text-xs text-gray-300" htmlFor={`config-key-${i}`}>
                    Config Key:
                  </label>
                  <input
                    id={`config-key-${i}`}
                    type="text"
                    className="border rounded px-2 py-1 text-xs bg-gray-900 text-gray-100"
                    value={pluginConfig[p] || ""}
                    onChange={(e) => savePluginConfig(p, e.target.value)}
                    aria-label={`Config value for ${p}`}
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-700 text-white rounded text-xs mt-1"
                    disabled={configuring !== p}
                    aria-label={`Save config for ${p}`}
                  >
                    Save
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
