import { useState, useCallback } from "react";
import api from "@/lib/axios";
import axios from "axios";

interface DownloadJob {
  id: number;
  status: string;
  file_path?: string;
  error_message?: string;
}

export function useDownloads() {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/download/history");
      setJobs(res.data);
    } catch (err: unknown) {
      console.error("Failed to load download history:", err);

      const isNetworkError =
        axios.isAxiosError(err) &&
        (err.code === "ECONNREFUSED" || err.message === "Network Error");
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;

      // Better error messages
      if (isNetworkError) {
        setError(
          "Cannot connect to server. Please make sure the backend is running on port 8000."
        );
      } else if (status === 401) {
        setError("Authentication required. Please log in again.");
      } else if (status === 404) {
        setError("Download history endpoint not found.");
      } else {
        setError("Failed to load download history. Please try again.");
      }

      setJobs([]); // Clear jobs on error
    } finally {
      setLoading(false);
    }
  }, []);

  const startDownload = async (data: {
    dataset_id: string;
    mosdac_username: string;
    mosdac_password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/download/start", data);
      await loadHistory(); // Reload history after starting download
      return { success: true };
    } catch (err: unknown) {
      console.error("Failed to start download:", err);

      let errorMessage = "Failed to start download.";
      const isNetworkError =
        axios.isAxiosError(err) &&
        (err.code === "ECONNREFUSED" || err.message === "Network Error");

      if (isNetworkError) {
        errorMessage =
          "Cannot connect to server. Please make sure the backend is running.";
      } else if (axios.isAxiosError(err)) {
        const data = err.response?.data as { detail?: string } | undefined;
        if (data?.detail) {
          errorMessage = data.detail;
        } else if (err.response?.status === 401) {
          errorMessage = "Authentication failed. Please check your credentials.";
        }
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loadHistory,
    startDownload,
    loading,
    error,
    clearError: () => setError(null),
  };
}
