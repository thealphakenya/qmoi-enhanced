import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
}

const QMoiProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/qmoi/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      // ignore for now
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveProject = async () => {
    if (editingId) {
      await fetch(`/api/qmoi/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch("/api/qmoi/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", description: "" });
    fetchProjects();
  };

  const editProject = (p: Project) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description || "" });
  };

  const deleteProject = async (id: string | number) => {
    if (!confirm("Delete project?")) return;
    await fetch(`/api/qmoi/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>QMOI Project Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mb-2"
          />
          <Input
            placeholder="Project description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mb-2"
          />
          <Button onClick={saveProject}>{editingId ? "Save" : "Create Project"}</Button>
        </div>
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t">
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.createdAt}</td>
                  <td>
                    <Button size="sm" variant="secondary" onClick={() => editProject(p)} className="mr-2">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteProject(p.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QMoiProjectDashboard;

