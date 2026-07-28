import React, { useState } from "react";
import { verifyProduct } from "@/adapters/clientAdapters";

export const PriceProductVerifier: React.FC = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyProduct(query);
      setResult(res);
    } catch (err) {
      (globalThis.console as any)?.error?.("verifyProduct failed", err);
      setResult("Verification error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Price & Product Verification</h3>
      <input
        type="text"
        placeholder="Enter product name or barcode"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <button onClick={handleCheck} disabled={!query || loading}>
        {loading ? "Checking..." : "Verify"}
      </button>
      <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>{result}</div>
    </div>
  );
};

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.130238Z: replaced placeholders or noted TODOs. Please review.

// AUTOFIXED by Ollama at 2026-07-26T18:54:39.972979Z

// AUTOFIXED by Ollama at 2026-07-26T18:57:33.119257Z

// AUTOFIXED by Ollama at 2026-07-26T19:31:03.555598Z
