import { useEffect, useState } from 'react';

export function useDatasetManager() {
  const [datasets, setDatasets] = useState([]);
  useEffect(() => {
    // Poll backend for available datasets
    const fetchDatasets = async () => {
      const res = await fetch('/api/qmoi-model?datasets=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      setDatasets(data.datasets || []);
    };
    fetchDatasets();
  }, []);
  return datasets;
}
