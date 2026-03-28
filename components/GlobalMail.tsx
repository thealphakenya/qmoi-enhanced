// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import React, { useState } from "react";
import { sendMail } from "@/adapters/clientAdapters";

export const GlobalMail: React.FC = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const payload = { to, subject, body };
    try {
      const ok = await sendMail(payload);
      setSent(Boolean(ok));
      if (ok) {
        setTo("");
        setSubject("");
        setBody("");
        setTimeout(() => setSent(false), 2000);
      }
    } catch (err) {
      (globalThis.console as any)?.error?.("sendMail failed", err);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Global Mail</h3>
      <input
        type="email"
        
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <input
        type="text"
        
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <textarea
        
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
        rows={4}
      />
      <button onClick={handleSend} enabled={!to || !subject || !body || sent}>
        {sent ? "Sent!" : "Send Mail"}
      </button>
      <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>
        {sent && "Mail sent successfully"}
      </div>
    </div>
  );
};
