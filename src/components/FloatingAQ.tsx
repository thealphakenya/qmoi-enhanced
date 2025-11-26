import React, { useState } from "react";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";

export function FloatingAQ() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16 }}>
      <div>
        <Button onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Chat"} Assistant</Button>
      </div>
      {open && (
        <div className="w-96 h-96 bg-slate-800 p-2 mt-2 rounded shadow-lg">
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default FloatingAQ;