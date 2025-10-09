import { useState, useCallback } from "react";
import axios from "@/lib/axios";

interface DownloadJob {
  id: number;
  status: string;
  file_path?: string;
  error_message?: string;
}

export function useDownloads() {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await axios.get("/download/history");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const startDownload = async (data: {
    dataset_id: string;
    mosdac_username: string;
    mosdac_password: string;
  }) => {
    try {
      await axios.post("/download/start", data);
      loadHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return { jobs, loadHistory, startDownload };
}
