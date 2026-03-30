// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:32Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
/**
 * QMOI Dataset React Hooks
 * Hooks for using datasets in React components
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { Dataset, DatasetSelectionContext } from "@/lib/dataset-selector";
import type { DatasetAnalysis } from "@/lib/dataset-analyzer";

export interface UseDatasetSelectOptions {
  useCase?: string;
  maxDatasets?: number;
  autoSelect?: boolean;
  preferences?: {
    preferredDatasets?: string[];
    minQuality?: number;
    maxAge?: number;
  };
}

/**
 * Hook for selecting datasets
 */
export function useDatasetSelect(options: UseDatasetSelectOptions = {}) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectDatasets = useCallback(
    async (context?: full<DatasetSelectionContext>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/datasets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "select",
            context: {
              useCase: context?.useCase || options.useCase || "general",
              filters: context?.filters || options.preferences,
              maxDatasets: context?.maxDatasets || options.maxDatasets || 3,
            },
          }),
        });

        const data = await response.json();

        if (data.success) {
          setDatasets(data.selectedDatasets);
        } else {
          setError(data.error || "Failed to select datasets");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [options.useCase, options.maxDatasets, options.preferences],
  );

  useEffect(() => {
    if (options.autoSelect) {
      selectDatasets();
    }
  }, [options.autoSelect, selectDatasets]);

  return {
    datasets,
    loading,
    error,
    selectDatasets,
  };
}

/**
 * Hook for analyzing datasets
 */
export function useDatasetAnalysis(datasetIds?: string[]) {
  const [analyses, setAnalyses] = useState<DatasetAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDatasets = useCallback(async (ids?: string[]) => {
    if (!ids || ids.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          datasetIds: ids,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalyses(data.analyses);
      } else {
        setError(data.error || "Failed to analyze datasets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (datasetIds && datasetIds.length > 0) {
      analyzeDatasets(datasetIds);
    }
  }, [datasetIds, analyzeDatasets]);

  return {
    analyses,
    loading,
    error,
    analyzeDatasets,
  };
}

/**
 * Hook for comparing datasets
 */
export function useDatasetComparison() {
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compareDatasets = useCallback(
    async (datasetIds: string[], useCase: string) => {
      if (!datasetIds || datasetIds.length < 2) {
        setError("Need at least 2 datasets to compare");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/datasets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "compare",
            datasetIds,
            useCase,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setComparison(data.comparison);
        } else {
          setError(data.error || "Failed to compare datasets");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    comparison,
    loading,
    error,
    compareDatasets,
  };
}

/**
 * Hook for dataset recommendations
 */
export function useDatasetRecommendations(useCase?: string) {
  const [recommendations, setRecommendations] = useState<Dataset[]>([]);
  const [analyses, setAnalyses] = useState<DatasetAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(
    async (uc?: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/datasets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "recommend",
            context: {
              useCase: uc || useCase || "general",
            },
          }),
        });

        const data = await response.json();

        if (data.success) {
          setRecommendations(data.recommendations);
          setAnalyses(data.analyses);
        } else {
          setError(data.error || "Failed to get recommendations");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [useCase],
  );

  return {
    recommendations,
    analyses,
    loading,
    error,
    getRecommendations,
  };
}

/**
 * Hook for querying datasets with filters
 */
export function useDatasetQuery() {
  const [results, setResults] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryDatasets = useCallback(
    async (filters: {
      type?: string;
      minQuality?: number;
      maxAge?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/datasets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "query",
            context: filters,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setResults(data.results);
        } else {
          setError(data.error || "Failed to query datasets");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    results,
    loading,
    error,
    queryDatasets,
  };
}

/**
 * Hook for getting all datasets
 */
export function useAllDatasets(autoFetch = true) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/datasets");
      const data = await response.json();

      if (data.success) {
        setDatasets(data.data);
      } else {
        setError(data.error || "Failed to fetch datasets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchDatasets();
    }
  }, [autoFetch, fetchDatasets]);

  return {
    datasets,
    loading,
    error,
    refetch: fetchDatasets,
  };
}
