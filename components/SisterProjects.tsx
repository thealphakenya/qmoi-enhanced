import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMaster } from "./MasterContext";
import { useToast } from "@/hooks/use-toast";

// SisterProjects: Comprehensive project management for sister role with AI integration
export function SisterProjects() {
  const { currentRole, hasPermission } = useMaster();
  const { toast } = useToast();
  const [suggested, setSuggested] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Only show for sister role or higher
  if (!hasPermission("sister")) {
    return null;
  }

  useEffect(() => {
    // Load saved projects from localStorage
    const savedProjects = localStorage.getItem("sister-projects");
    if (savedProjects) {
      setSaved(JSON.parse(savedProjects));
    }

    function handleSuggestions(e: unknown) {
      const detail = (e as CustomEvent)?.detail ?? [];
      setSuggested(Array.isArray(detail) ? detail : [detail]);
    }

    // Listen for AI project suggestions
    window.addEventListener(
      "ai-suggested-projects",
      handleSuggestions as EventListener,
    );

    // Request AI suggestions on load
    requestAISuggestions();

    return () =>
      window.removeEventListener(
        "ai-suggested-projects",
        handleSuggestions as EventListener,
      );
  }, []);

  const requestAISuggestions = async () => {
    try {
      const response = await fetch("/api/ai/suggest-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "sister",
          context: "creative project development and management",
        }),
      });
      if (response.ok) {
        const suggestions = await response.json();
        setSuggested(suggestions);
      }
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
    }
  };

  function saveProject(p: unknown) {
    const project = {
      ...p,
      id: Date.now(),
      status: "planned",
      createdAt: new Date(),
    };
    const updated = [...saved, project];
    setSaved(updated);
    localStorage.setItem("sister-projects", JSON.stringify(updated));

    // Notify master about new project
    window.dispatchEvent(
      new CustomEvent("sister-project-saved", { detail: project }),
    );

    toast({
      title: "Project Saved",
      description: `${project.title} has been added to your projects.`,
    });
  }

  function createNewProject() {
    if (!newProject.title.trim()) return;

    const project = {
      ...newProject,
      id: Date.now(),
      status: "active",
      createdAt: new Date(),
    };

    const updated = [...saved, project];
    setSaved(updated);
    localStorage.setItem("sister-projects", JSON.stringify(updated));
    setNewProject({ title: "", description: "", priority: "medium" });
    setIsCreating(false);

    toast({
      title: "Project Created",
      description: `${project.title} has been created.`,
    });
  }

  function updateProjectStatus(id: number, status: string) {
    const updated = saved.map((p) => (p.id === id ? { ...p, status } : p));
    setSaved(updated);
    localStorage.setItem("sister-projects", JSON.stringify(updated));
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "active":
        return "default";
      case "planned":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sister Projects Dashboard
            <Button onClick={() => setIsCreating(!isCreating)} size="sm">
              {isCreating ? "Cancel" : "New Project"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-4 p-4 border rounded-lg space-y-3">
              <Input
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <Textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <div className="flex gap-2">
                <Button onClick={createNewProject} size="sm">
                  Create
                </Button>
                <Button
                  onClick={() => setIsCreating(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <h4 className="font-semibold mb-2">Your Projects ({saved.length})</h4>
          {saved.length === 0 && (
            <div className="text-gray-400 mb-4">No projects created yet.</div>
          )}
          <div className="space-y-2 mb-6">
            {saved.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{p.title}</span>
                    <Badge variant={getPriorityColor(p.priority)}>
                      {p.priority}
                    </Badge>
                    <Badge variant={getStatusColor(p.status)}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
                <div className="flex gap-1">
                  {p.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProjectStatus(p.id, "completed")}
                    >
                      Complete
                    </Button>
                  )}
                  {p.status === "planned" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProjectStatus(p.id, "active")}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold">AI Project Suggestions</h5>
              <Button
                onClick={requestAISuggestions}
                size="sm"
                variant="outline"
              >
                Refresh
              </Button>
            </div>
            <div className="space-y-2">
              {suggested.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex-1">
                    <span className="font-bold">{p.title}:</span>{" "}
                    {p.description}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => saveProject(p)}
                    disabled={saved.some((s) => s.title === p.title)}
                  >
                    {saved.some((s) => s.title === p.title) ? "Saved" : "Save"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
