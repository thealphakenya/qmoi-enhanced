"use client";
import React, { memo, useCallback, useState } from "react";
interface Download {
  url: string;
  status: string;
  time: string;
}
const DownloadList = memo(({ downloads }: { downloads: Download[] }) => (
  <ul className="mt-4 space-y-2 text-sm text-slate-700">
    {downloads.map((download, index) => (
      <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <span className="font-medium">{download.url}</span>
        <div className="text-xs text-slate-500">
          {download.status} • {download.time}
        </div>
      </li>
    ))}
  </ul>
));
DownloadList.displayName = "DownloadList";
const DownloadManager: React.FC = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const addDownload = useCallback((download: Download) => {
    setDownloads((existing) => [...existing, download]);
  }, []);
  const handleDownload = useCallback(() => {
    if (!url) {
      setStatus("Please enter a file URL.");
      return;
    }
    setStatus("Starting download...");
    setTimeout(() => {
      addDownload({
        url,
        status: "Completed",
        time: new Date().toLocaleTimeString(),
      });
      setStatus("Download complete.");
      setUrl("");
    }, 1500);
  }, [url, addDownload]);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Download Manager</h3>
      <p className="mt-2 text-sm text-slate-500">Queue downloads and monitor completion status.</p>
      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Enter file URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleDownload}
          disabled={!url}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download
        </button>
        <div className="text-sm text-slate-500">{status}</div>
      </div>
      <DownloadList downloads={downloads} />
    </div>
  );
};
DownloadManager.displayName = "DownloadManager";
export default DownloadManager;
