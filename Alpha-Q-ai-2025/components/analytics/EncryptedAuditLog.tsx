import React, { useState } from "react";
import CryptoJS from "crypto-js";

export const EncryptedAuditLog: React.FC<{ logs: string[] }> = ({ logs }) => {
  const [key, setKey] = useState("");
  const [decrypted, setDecrypted] = useState<string[]>([]);
  const encrypted = logs.map(l => CryptoJS.AES.encrypt(l, key || 'default').toString());
  return (
    <div>
      <h4>Encrypted Audit Log</h4>
      <input placeholder="Decryption Key" value={key} onChange={e => setKey(e.target.value)} style={{ marginBottom: 8 }} />
      <button onClick={() => {
        try {
          setDecrypted(encrypted.map(e => CryptoJS.AES.decrypt(e, key || 'default').toString(CryptoJS.enc.Utf8)));
        } catch {
          setDecrypted(["Decryption failed"]);
        }
      }}>Decrypt</button>
      <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f8f8f8', padding: 8 }}>{decrypted.join('\n')}</pre>
    </div>
  );
}; 