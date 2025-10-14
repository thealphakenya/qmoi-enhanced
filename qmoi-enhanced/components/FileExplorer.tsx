"use client";

import React, { useState, useEffect } from "react";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modified?: string;
  children?: FileItem[];
}

export const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "QMOI System",
      type: "folder",
      children: [
        {
          id: "1-1",
          name: "alpha-q-ai-system.tsx",
          type: "file",
          size: "2.1KB",
          modified: "2024-01-15",
        },
        {
          id: "1-2",
          name: "Chatbot.tsx",
          type: "file",
          size: "1.8KB",
          modified: "2024-01-15",
        },
        {
          id: "1-3",
          name: "FileExplorer.tsx",
          type: "file",
          size: "1.5KB",
          modified: "2024-01-15",
        },
        {
          id: "1-4",
          name: "GitStatus.tsx",
          type: "file",
          size: "1.2KB",
          modified: "2024-01-15",
        },
        {
          id: "1-5",
          name: "PreviewWindow.tsx",
          type: "file",
          size: "1.7KB",
          modified: "2024-01-15",
        },
      ],
    },
    {
      id: "2",
      name: "Components",
      type: "folder",
      children: [
        { id: "2-1", name: "QCity", type: "folder", children: [] },
        { id: "2-2", name: "QMOI", type: "folder", children: [] },
        { id: "2-3", name: "UI", type: "folder", children: [] },
      ],
    },
    {
      id: "3",
      name: "Scripts",
      type: "folder",
      children: [
        { id: "3-1", name: "automation", type: "folder", children: [] },
        { id: "3-2", name: "services", type: "folder", children: [] },
        { id: "3-3", name: "utils", type: "folder", children: [] },
      ],
    },
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["1", "2", "3"]),
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileItem = (item: FileItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedFile === item.id;

    return (
      <div key={item.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-green-800/30 ${
            isSelected ? "bg-green-700/50" : ""
          }`}
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.id);
            } else {
              setSelectedFile(item.id);
            }
          }}
        >
          <span className="mr-2">
            {item.type === "folder" ? (isExpanded ? "📁" : "📂") : "📄"}
          </span>
          <span className="text-sm text-gray-300">{item.name}</span>
          {item.type === "file" && item.size && (
            <span className="ml-auto text-xs text-gray-500">{item.size}</span>
          )}
        </div>

        {item.type === "folder" && isExpanded && item.children && (
          <div>
            {item.children.map((child) => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] border border-green-600 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3">
        File Explorer
      </h3>

      <div className="space-y-1">
        {files.map((item) => renderFileItem(item))}
      </div>

      {selectedFile && (
        <div className="mt-4 pt-3 border-t border-green-700">
          <div className="text-xs text-gray-400">
            Selected:{" "}
            {files
              .flatMap((f) => f.children || [])
              .find((f) => f?.id === selectedFile)?.name || "Unknown"}
          </div>
        </div>
      )}
    </div>
  );
};
