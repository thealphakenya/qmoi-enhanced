"use client";

import { useCallback, useEffect, useState } from "react";

type Dataset = { id: string; name: string; [key: string]: unknown };
type DatasetAnalysis = { datasetId: string; score: number; summary: string; [key: string]: unknown };
type DatasetSelectionContext = {
  useCase?: string;
  filters?: Record<string, unknown>;
  maxDatasets?: number;
};

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

const DATASET_API_ENDPOINT = "/api/datasets";

async function datasetApiRequest<T>(payload: unknown): Promise<T> {
  const response = await fetch(DATASET_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Dataset API error: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export function useDatasetSelect(options: UseDatasetSelectOptions = {}) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectDatasets = useCallback(
    async (context?: DatasetSelectionContext) => {
      setLoading(true);
      setError(null);

      try {
        const data = await datasetApiRequest<{
          success: boolean;
          selectedDatasets?: Dataset[];
          error?: string;
        }>({
          action: "select",
          context: {
            useCase: context?.useCase || options.useCase || "general",
            filters: context?.filters || options.preferences,
            maxDatasets: context?.maxDatasets || options.maxDatasets || 3,
          },
        });

        if (data.success && data.selectedDatasets) {
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
    [options.autoSelect, options.maxDatasets, options.preferences, options.useCase],
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

export function useDatasetAnalysis(datasetIds?: string[]) {
  const [analyses, setAnalyses] = useState<DatasetAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDatasets = useCallback(
    async (ids?: string[]) => {
      if (!ids || ids.length === 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await datasetApiRequest<{
          success: boolean;
          analyses?: DatasetAnalysis[];
          error?: string;
        }>({
          action: "analyze",
          datasetIds: ids,
        });

        if (data.success && data.analyses) {
          setAnalyses(data.analyses);
        } else {
          setError(data.error || "Failed to analyze datasets");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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

export function useDatasetComparison() {
  const [comparison, setComparison] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compareDatasets = useCallback(async (datasetIds: string[], useCase: string) => {
    if (!datasetIds || datasetIds.length < 2) {
      setError("Need at least 2 datasets to compare");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await datasetApiRequest<{
        success: boolean;
        comparison?: Record<string, unknown>;
        error?: string;
      }>({
        action: "compare",
        datasetIds,
        useCase,
      });

      if (data.success && data.comparison) {
        setComparison(data.comparison);
      } else {
        setError(data.error || "Failed to compare datasets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comparison,
    loading,
    error,
    compareDatasets,
  };
}

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
        const data = await datasetApiRequest<{
          success: boolean;
          recommendations?: Dataset[];
          analyses?: DatasetAnalysis[];
          error?: string;
        }>({
          action: "recommend",
          context: {
            useCase: uc || useCase || "general",
          },
        });

        if (data.success) {
          setRecommendations(data.recommendations || []);
          setAnalyses(data.analyses || []);
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

export function useDatasetQuery(filter?: Record<string, unknown>) {
  const [results, setResults] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await datasetApiRequest<{
        success: boolean;
        results?: Dataset[];
        error?: string;
      }>({
        action: "query",
        filter: filter || {},
      });

      if (data.success && data.results) {
        setResults(data.results);
      } else {
        setError(data.error || "Failed to query datasets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    queryDatasets();
  }, [queryDatasets]);

  return {
    results,
    loading,
    error,
    queryDatasets,
  };
}
