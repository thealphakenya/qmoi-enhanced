import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.resolve(process.cwd(), "qmoi-enhanced/public/uploads");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "File upload failed", details: err.message });
    }
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
    const fileName = path.basename(filePath);
    return res.status(200).json({ url: `/uploads/${fileName}` });
  });
}
