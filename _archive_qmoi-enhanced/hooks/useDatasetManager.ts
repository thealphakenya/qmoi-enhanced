import { useState, useEffect } from "react";

interface Dataset {
  id: string;
  name: string;
  description: string;
  type: "text" | "image" | "audio" | "video" | "mixed";
  size: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  status: "ready" | "processing" | "error";
  metadata: {
    format: string;
    version: string;
    tags: string[];
    source?: string;
  };
  stats: {
    totalItems: number;
    processedItems: number;
    failedItems: number;
    averageProcessingTime: number;
  };
}

interface DatasetManager {
  datasets: Dataset[];
  stats: {
    totalDatasets: number;
    totalSize: number;
    totalItems: number;
    averageProcessingTime: number;
  };
  settings: {
    maxConcurrentProcessing: number;
    autoBackup: boolean;
    defaultFormat: string;
    storageLocation: string;
  };
}

export function useDatasetManager() {
  const [manager, setManager] = useState<DatasetManager>({
    datasets: [],
    stats: {
      totalDatasets: 0,
      totalSize: 0,
      totalItems: 0,
      averageProcessingTime: 0,
    },
    settings: {
      maxConcurrentProcessing: 2,
      autoBackup: true,
      defaultFormat: "json",
      storageLocation: "local",
    },
  });

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await fetch("/api/datasets");
        if (!res.ok) throw new Error("Failed to fetch datasets");
        const data = await res.json();
        setManager(data);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      }
    };

    fetchDatasets();
    const interval = setInterval(fetchDatasets, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const createDataset = async (
    dataset: Omit<Dataset, "id" | "createdAt" | "updatedAt" | "stats">,
  ) => {
    try {
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataset),
      });
      if (!res.ok) throw new Error("Failed to create dataset");
      const data = await res.json();
      setManager((prev) => ({
        ...prev,
        datasets: [...prev.datasets, data],
      }));
      return data;
    } catch (error) {
      console.error("Failed to create dataset:", error);
      throw error;
    }
  };

  const updateDataset = async (id: string, updates: Partial<Dataset>) => {
    try {
      const res = await fetch(`/api/datasets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update dataset");
      const data = await res.json();
      setManager((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) =>
          dataset.id === id ? { ...dataset, ...data } : dataset,
        ),
      }));
      return data;
    } catch (error) {
      console.error("Failed to update dataset:", error);
      throw error;
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      const res = await fetch(`/api/datasets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete dataset");
      setManager((prev) => ({
        ...prev,
        datasets: prev.datasets.filter((dataset) => dataset.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete dataset:", error);
      throw error;
    }
  };

  const updateSettings = async (
    newSettings: Partial<DatasetManager["settings"]>,
  ) => {
    try {
      const res = await fetch("/api/datasets/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      const data = await res.json();
      setManager((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...data },
      }));
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  };

  return {
    manager,
    createDataset,
    updateDataset,
    deleteDataset,
    updateSettings,
  };
}
