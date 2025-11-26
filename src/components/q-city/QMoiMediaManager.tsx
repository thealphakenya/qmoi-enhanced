import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface MediaItem {
  id: string | number;
  type: string; // image|video|audio|text
  url: string;
  name?: string;
  createdAt?: string;
  license?: string; // simple copyright descriptor
}

export const QMoiMediaManager: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [license, setLicense] = useState("cc-by");

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qmoi/media");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err: any) {
      setError(err.message || "Unable to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return media;
    const q = query.toLowerCase();
    return media.filter((m) => (m.name || "").toLowerCase().includes(q) || (m.type || "").toLowerCase().includes(q));
  }, [media, query]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("license", license);
      const res = await fetch("/api/qmoi/media", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed: ${txt}`);
      }
      setFile(null);
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this media item? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/qmoi/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>QMOI Media Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 items-center mb-2">
          <Input placeholder="Search media by name or type" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button size="sm" onClick={fetchMedia} className="ml-2" disabled={loading}>
            Refresh
          </Button>
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="border rounded p-3 bg-slate-800">
              <div className="font-semibold text-sm mb-1">{m.name || m.url}</div>
              <div className="text-xs text-gray-400">{m.type} • {m.createdAt || "-"}</div>
              <div className="mt-2">
                {m.type === "image" && (
                  <img src={m.url} alt={m.name || "media"} className="max-h-48 object-contain rounded" />
                )}
                {m.type === "video" && (
                  <video src={m.url} controls className="w-full max-h-48 rounded" />
                )}
                {m.type === "audio" && (
                  <audio src={m.url} controls className="w-full" />
                )}
                {m.type === "text" && (
                  <pre className="max-h-48 overflow-auto text-xs bg-black p-2 rounded">{m.url}</pre>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <a className="text-sm text-blue-400 underline" href={m.url} target="_blank" rel="noreferrer">Open</a>
                <a className="text-sm text-blue-400 underline" href={m.url} download>Download</a>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(m.id)}>Delete</Button>
              </div>
              <div className="mt-2 text-xs text-gray-500">License: {m.license || "n/a"}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Upload media</h4>
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="mt-2">
            <label className="mr-2">License:</label>
            <select value={license} onChange={(e) => setLicense(e.target.value)} className="px-2 py-1 rounded border">
              <option value="cc-by">Creative Commons - Attribution</option>
              <option value="cc0">CC0 - Public Domain</option>
              <option value="proprietary">Proprietary (internal)</option>
            </select>
          </div>
          <div className="mt-2">
            <Button size="sm" onClick={handleUpload} disabled={!file || uploading}>{uploading ? "Uploading..." : "Upload"}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QMoiMediaManager;
