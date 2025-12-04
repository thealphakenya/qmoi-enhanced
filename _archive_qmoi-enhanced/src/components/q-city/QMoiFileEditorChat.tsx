import React, { useState, ReactNode } from "react";

function highlightCode(code: string) {
  // Simple code block for now; can be replaced with PrismJS/highlight.js
  return (
    <pre
      style={{
        background: "#111",
        color: "#0ff",
        borderRadius: 4,
        padding: 8,
        overflowX: "auto",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

export default function QMoiFileEditorChat({
  isMaster = false,
}: {
  isMaster?: boolean;
}) {
  const [messages, setMessages] = useState<{ user: string; text: ReactNode }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastView, setLastView] = useState("");
  const [showBatch, setShowBatch] = useState(false);
  const [batchFiles, setBatchFiles] = useState("");
  const [batchOp, setBatchOp] = useState("");

  async function handleCommand(cmd: string) {
    setLoading(true);
    let response: string | React.ReactElement = "";
    try {
      if (cmd.startsWith("/view ")) {
        const filePath = cmd.replace("/view ", "").trim();
        const res = await fetch("/api/qmoi/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "read", filePath }),
        });
        const data = await res.json();
        if (data.success) {
          setLastView(data.data);
          response = highlightCode(data.data);
        } else {
          response = `Error: ${data.error}`;
        }
      } else if (cmd.startsWith("/edit ")) {
        const [_, filePath, ...contentArr] = cmd.split(" ");
        const content = contentArr.join(" ");
        // Show diff preview if lastView is available
        const before = lastView;
        const after = content;
        const res = await fetch("/api/qmoi/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "write", filePath, content }),
        });
        const data = await res.json();
        response = data.success ? (
          <div>
            <div>File {filePath} updated.</div>
            <div style={{ marginTop: 8 }}>
              <b>Before:</b>
              {highlightCode(before)}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>After:</b>
              {highlightCode(after)}
            </div>
          </div>
        ) : (
          `Error: ${data.error}`
        );
      } else if (cmd.startsWith("/append ")) {
        const [_, filePath, ...contentArr] = cmd.split(" ");
        const content = contentArr.join(" ");
        const res = await fetch("/api/qmoi/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "append", filePath, content }),
        });
        const data = await res.json();
        response = data.success
          ? `Appended to ${filePath}.`
          : `Error: ${data.error}`;
      } else if (cmd.startsWith("/replace ")) {
        const [_, filePath, search, ...replaceArr] = cmd.split(" ");
        const content = replaceArr.join(" ");
        // Show diff preview if lastView is available
        const before = lastView;
        const after = before.replace(search, content);
        const res = await fetch("/api/qmoi/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "replace",
            filePath,
            replace: search,
            content,
          }),
        });
        const data = await res.json();
        response = data.success ? (
          <div>
            <div>Replaced in {filePath}.</div>
            <div style={{ marginTop: 8 }}>
              <b>Before:</b>
              {highlightCode(before)}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>After:</b>
              {highlightCode(after)}
            </div>
          </div>
        ) : (
          `Error: ${data.error}`
        );
      } else {
        response = "Unknown command. Use /view, /edit, /append, /replace.";
      }
    } catch (e: any) {
      response = `Error: ${e.message}`;
    }
    setMessages((msgs) => [
      ...msgs,
      { user: "master", text: cmd },
      { user: "qmoi", text: response },
    ]);
    setLoading(false);
  }

  async function handleRollback() {
    setLoading(true);
    let response: string | React.ReactElement = "";
    try {
      const res = await fetch("/api/qmoi/autodev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback" }),
      });
      const data = await res.json();
      response = data.success ? "Rollback successful." : `Error: ${data.error}`;
    } catch (e: any) {
      response = `Error: ${e.message}`;
    }
    setMessages((msgs) => [
      ...msgs,
      { user: "master", text: "[Rollback]" },
      { user: "qmoi", text: response },
    ]);
    setLoading(false);
  }

  async function handleAISuggest() {
    setLoading(true);
    let response: string | React.ReactElement = "";
    try {
      const res = await fetch("/api/qmoi/autodev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_suggest",
          filePath: "",
          context: lastView,
        }),
      });
      const data = await res.json();
      response = data.success
        ? highlightCode(data.suggestion)
        : `Error: ${data.error}`;
    } catch (e: any) {
      response = `Error: ${e.message}`;
    }
    setMessages((msgs) => [
      ...msgs,
      { user: "master", text: "[AI Suggest]" },
      { user: "qmoi", text: response },
    ]);
    setLoading(false);
  }

  async function handleBatchEdit(files: string, op: string) {
    setLoading(true);
    let response: string | React.ReactElement = "";
    try {
      const res = await fetch("/api/qmoi/autodev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "batch_edit",
          files: files.split(","),
          operation: op,
        }),
      });
      const data = await res.json();
      response = data.success ? "Batch edit complete." : `Error: ${data.error}`;
    } catch (e: any) {
      response = `Error: ${e.message}`;
    }
    setMessages((msgs) => [
      ...msgs,
      { user: "master", text: `[Batch Edit: ${op}]` },
      { user: "qmoi", text: response },
    ]);
    setLoading(false);
    setShowBatch(false);
    setBatchFiles("");
    setBatchOp("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput("");
  }

  if (!isMaster) return null;

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: 16,
        borderRadius: 8,
        background: "#181818",
        color: "#e0ffe0",
        marginTop: 16,
        maxWidth: 700,
      }}
    >
      <h3>QMOI File Editor Chat (Master Only)</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          onClick={handleRollback}
          style={{
            background: "#f33",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: 600,
          }}
        >
          Rollback
        </button>
        <button
          onClick={handleAISuggest}
          style={{
            background: "#09f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: 600,
          }}
        >
          AI Suggest
        </button>
        <button
          onClick={() => setShowBatch(true)}
          style={{
            background: "#fa0",
            color: "#111",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: 600,
          }}
        >
          Batch Edit
        </button>
        <button
          disabled
          style={{
            background: "#888",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontWeight: 600,
          }}
        >
          Distributed Automation (soon)
        </button>
      </div>
      {showBatch && (
        <div
          style={{
            background: "#222",
            padding: 12,
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <div>
            <b>Batch Edit</b>
          </div>
          <input
            value={batchFiles}
            onChange={(e) => setBatchFiles(e.target.value)}
            placeholder="file1.py,file2.ts,..."
            style={{
              width: "60%",
              marginRight: 8,
              background: "#111",
              color: "#e0ffe0",
              border: "1px solid #333",
              borderRadius: 4,
              padding: 4,
            }}
          />
          <input
            value={batchOp}
            onChange={(e) => setBatchOp(e.target.value)}
            placeholder="operation (e.g. lint, format)"
            style={{
              width: "30%",
              background: "#111",
              color: "#e0ffe0",
              border: "1px solid #333",
              borderRadius: 4,
              padding: 4,
            }}
          />
          <button
            onClick={() => handleBatchEdit(batchFiles, batchOp)}
            style={{
              background: "#0f0",
              color: "#111",
              border: "none",
              borderRadius: 4,
              padding: "4px 12px",
              fontWeight: 600,
              marginLeft: 8,
            }}
          >
            Run
          </button>
          <button
            onClick={() => setShowBatch(false)}
            style={{
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 12px",
              fontWeight: 600,
              marginLeft: 8,
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <div
        style={{
          maxHeight: 240,
          overflowY: "auto",
          marginBottom: 12,
          background: "#222",
          padding: 8,
          borderRadius: 6,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <b style={{ color: m.user === "master" ? "#fff" : "#0f0" }}>
              {m.user}:
            </b>{" "}
            {m.text}
          </div>
        ))}
        {loading && <div style={{ color: "#ff0" }}>Processing...</div>}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="/view /edit /append /replace ..."
          style={{
            flex: 1,
            background: "#111",
            color: "#e0ffe0",
            border: "1px solid #333",
            borderRadius: 4,
            padding: 8,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#0f0",
            color: "#111",
            border: "none",
            borderRadius: 4,
            padding: "0 16px",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
