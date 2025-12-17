import type { NextApiRequest, NextApiResponse } from "next";
// import fs from 'fs';
import path from "path";

const AUDIT_LOG = path.join(process.cwd(), "qmoi_file_audit.log");

function logAudit(
  action: string,
  filePath: string,
  content?: string,
  replace?: string,
) {
  const entry = {
    timestamp: new Date().toISOString(),
    user: "master",
    action,
    filePath,
    content: content
      ? content.length > 200
        ? content.slice(0, 200) + "..."
        : content
      : undefined,
    replace,
  };
  // fs.appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Add real master/admin authentication
  if (req.method === "POST") {
    const { action, filePath, content, replace } = req.body;
    const absPath = path.join(process.cwd(), filePath);
    try {
      if (action === "read") {
        const data = fs.readFileSync(absPath, "utf-8");
        res.status(200).json({ success: true, data });
        return;
      }
      if (action === "write") {
        fs.writeFileSync(absPath, content, "utf-8");
        logAudit("write", filePath, content);
        res.status(200).json({ success: true });
        return;
      }
      if (action === "append") {
        fs.appendFileSync(absPath, content, "utf-8");
        logAudit("append", filePath, content);
        res.status(200).json({ success: true });
        return;
      }
      if (action === "replace") {
        const data = fs.readFileSync(absPath, "utf-8");
        const newData = data.replace(replace, content);
        fs.writeFileSync(absPath, newData, "utf-8");
        logAudit("replace", filePath, content, replace);
        res.status(200).json({ success: true });
        return;
      }
      res.status(400).json({ success: false, error: "Unknown action" });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
