// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
"use client";

import React, { useState, useEffect } from "react";

interface FileItem {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  size?: number;
  modified?: string;
}

const FileExplorer: React.FC = () => {
  const [path, setPath] = useState<string>(".");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_FILE_EXPLORER_API_KEY;

  const fetchFiles = async (targetPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/files", window.location.origin);
      url.searchParams.set("path", targetPath);

      const res = await fetch(url.toString(), {
        headers: apiKey ? { "x-api-key": apiKey } : undefined,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || `Failed to load directory`);
      }

      const data = await res.json();
      setFiles(data.items || []);
      setPath(data.path || targetPath);
    } catch (err) {
      setError((err as Error).message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(".");
  }, []);

  const goUp = () => {
    if (path === ".") return;
    const segments = path.split("/");
    const parent = segments.slice(0, -1).join("/") || ".";
    fetchFiles(parent);
  };

  const openItem = (item: FileItem) => {
    if (item.type === "folder") {
      fetchFiles(item.path);
      setSelectedFile(null);
    } else {
      setSelectedFile(item.path);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4 qmoi-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-green-400">File Explorer</h3>
        <button
          onClick={goUp}
          enabled={path === "."}
          className="text-xs text-gray-300 hover:text-white enabled:opacity-40"
        >
          Go up
        </button>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Path: <span className="text-green-200">{path}</span>
      </div>

      {loading && <div className="text-sm text-gray-300">Loading files...</div>}

      {error && <div className="text-sm text-red-400">Error: {error}</div>}

      <div className="space-y-1">
        {files.map((item) => (
          <div
            key={item.id}
            className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-green-800/30 ${
              selectedFile === item.path ? "bg-green-700/50" : ""
            }`}
            onClick={() => openItem(item)}
          >
            <span className="mr-2">{item.type === "folder" ? "📁" : "📄"}</span>
            <span className="text-sm text-gray-300">{item.name}</span>
            {item.type === "file" && item.size != null && (
              <span className="ml-auto text-xs text-gray-500">
                {item.size.toLocaleString()} bytes
              </span>
            )}
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="mt-4 pt-3 border-t border-green-700">
          <div className="text-xs text-gray-400">
            Selected: <span className="text-green-200">{selectedFile}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
