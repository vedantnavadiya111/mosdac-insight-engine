"use client";
import { useEffect } from "react";
import { useDownloads } from "@/hooks/useDownloads";
import DownloadCard from "./DownloadCard";

export default function DownloadStatus() {
  const { jobs, loadHistory } = useDownloads();

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, [loadHistory]);

  return (
    <div className="space-y-3">
      {jobs.length === 0 ? (
        <p>No download jobs yet.</p>
      ) : (
        jobs.map((job) => <DownloadCard key={job.id} job={job} />)
      )}
    </div>
  );
}
