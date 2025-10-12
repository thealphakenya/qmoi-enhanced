import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

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
        throw new Error("You do not have permission to download Q-city");
      }

      // Get download URL
      const response = await fetch("/api/qcity/download-url");
      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const { url } = await response.json();

      // Start download
      const downloadResponse = await fetch(url);
      if (!downloadResponse.ok) {
        throw new Error("Failed to download Q-city");
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
