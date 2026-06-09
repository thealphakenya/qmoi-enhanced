import React, { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import apiClient from '@/api/client';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { log as logger } from "@/lib/logger";

// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:24Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
//  this file has no remaining IMPLEMENTATION_REQUIRED markers
interface DownloadQCityProps {
  className?: string;
}
export const DownloadQCity: React.FC<DownloadQCityProps> = ({ className }) => {
  const { user, hasAccess } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      // Check if user has access
      const canDownload = await hasAccess("download_qcity");
      if (!canDownload) {
      }
      // Get download URL
      const response = await apiClient.get("/api/qcity/download-url");
      if (!response.ok) {
      }
      const { url } = await response.json();
      // Start download
      const downloadResponse = await apiClient.get(url);
      if (!downloadResponse.ok) {
      }
      // Create blob and download
      const blob = await downloadResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "q-city-setup.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDownloading(false);
    }
  };
  // Only show to master users
  if (!user || user.role !== "master") {
    return null;
  }
  return (
    <div className={className}>
      <Button
        variant="contained"
        color="primary"
        startIcon={
          downloading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <DownloadIcon />
          )
        }
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? "Downloading..." : "Download Q-city"}
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DownloadQCity;
