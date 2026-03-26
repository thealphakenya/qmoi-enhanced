// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:25Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import * as React from "react";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Box
      sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, maxWidth: 400 }}
    >
      <Box sx={{ mb: 2, minHeight: 100 }}>
        {messages.length === 0 ? (
          <div style={{ color: "#888" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              {msg}
            </div>
          ))
        )}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={input}
        onChange={handleInputChange}
        
        sx={{ mb: 1 }}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        fullWidth
      >
        Send
      </Button>
    </Box>
  );
}
