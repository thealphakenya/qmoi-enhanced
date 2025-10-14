import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

interface Document {
  id: number;
  name: string;
  type: string;
  content: string;
  createdAt: string;
}

const DocumentManagerPanel: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [form, setForm] = useState({ name: "", type: "", content: "" });
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Document[]>([]);
  const [status, setStatus] = useState("");

  const fetchDocuments = async () => {
    const res = await fetch("/api/document-backup/list");
    const data = await res.json();
    setDocuments(data.documents || []);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const upload = async () => {
    const res = await fetch("/api/document-backup/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setStatus(data.success ? "Uploaded!" : "Upload failed");
    fetchDocuments();
  };

  const searchDocs = async () => {
    const res = await fetch(
      `/api/document-backup/search?q=${encodeURIComponent(search)}`,
    );
    const data = await res.json();
    setResults(data.results || []);
  };

  const restore = async (id: number) => {
    const res = await fetch("/api/document-backup/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    setStatus(data.success ? "Restored!" : "Restore failed");
  };

  return (
    <Card className="space-y-4 mt-4">
      <CardHeader>
  <Typography variant="h6">Document Backup & Retrieval</Typography>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <TextField
            label="Document Name"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
            sx={{ mb: 2 }}
            fullWidth
            size="small"
          />
          <TextField
            label="Type (pdf, docx, etc.)"
            value={form.type}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, type: e.target.value }))}
            sx={{ mb: 2 }}
            fullWidth
            size="small"
          />
          <TextField
            label="Content (or file data)"
            value={form.content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, content: e.target.value }))}
            sx={{ mb: 2 }}
            fullWidth
            size="small"
          />
          <Button onClick={upload}>Upload</Button>
        </div>
        <div className="mb-4">
          <TextField
            label="Search documents..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
            size="small"
          />
          <Button onClick={searchDocs}>Search</Button>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Documents</h4>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(search ? results : documents).map((d) => (
                <tr key={d.id} className="border-t">
                  <td>{d.name}</td>
                  <td>{d.type}</td>
                  <td>{d.createdAt}</td>
                  <td>
                    <Button size="small" variant="outlined" color="primary" onClick={() => restore(d.id)}>
                      Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-green-700 font-semibold">{status}</div>
        {/* TODO: Advanced backup/restore, cloud integration */}
      </CardContent>
    </Card>
  );
};

export default DocumentManagerPanel;
