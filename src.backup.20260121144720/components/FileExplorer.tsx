"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/FileExplorer.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./FileExplorer.css";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified?: Date;
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documents", type: "folder" },
    { id: "2", name: "Images", type: "folder" },
    { id: "3", name: "config.json", type: "file", size: 2048 },
    { id: "4", name: "README.md", type: "file", size: 4096 },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const handleFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const handleFolderOpen = (name: string) => {
    setCurrentPath(`${currentPath}${name}/`);
    setFiles([
      { id: "10", name: "..", type: "folder" },
      { id: "11", name: "file1.txt", type: "file", size: 1024 },
      { id: "12", name: "file2.txt", type: "file", size: 2048 },
    ]);
  };

  const handleDownload = (file: FileItem) => {
    // Mock download - in production, fetch from backend
    console.log(`Downloading: ${file.name}`);
    alert(`Download initiated for: ${file.name}`);
  };

  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>File Explorer</h2>
        <div className="breadcrumb">{currentPath}</div>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${file.type} ${
              selectedFile === file.id ? "selected" : ""
            }`}
            onDoubleClick={() =>
              file.type === "folder" && handleFolderOpen(file.name)
            }
            onClick={() => handleFileSelect(file.id)}
          >
            <span className="file-icon">
              {file.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="file-name">{file.name}</span>
            {file.size && (
              <span className="file-size">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-actions">
          <button
            onClick={() =>
              handleDownload(files.find((f) => f.id === selectedFile)!)
            }
          >
            Download
          </button>
          <button onClick={() => console.log("View file")}>View</button>
        </div>
      )}
    </div>
  );
}
