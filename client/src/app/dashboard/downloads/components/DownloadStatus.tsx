"use client";
import { useEffect } from "react";
import { useDownloads } from "@/hooks/useDownloads";
import DownloadCard from "./DownloadCard";
import { RefreshCw, Download, Database } from "lucide-react";

export default function DownloadStatus() {
  const { jobs, loadHistory } = useDownloads();

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, [loadHistory]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-zinc-700" />
          <h3 className="font-semibold text-zinc-900">Recent Downloads</h3>
        </div>
        <button
          onClick={loadHistory}
          className="flex items-center space-x-2 bg-white hover:bg-zinc-50 text-zinc-700 px-3 py-1.5 rounded-lg transition-colors duration-200 border border-zinc-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Download Jobs List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Download className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-600 text-sm">No download jobs yet</p>
            <p className="text-zinc-500 text-xs mt-1">
              Start a download to see your jobs here
            </p>
          </div>
        ) : (
          jobs.map((job) => <DownloadCard key={job.id} job={job} />)
        )}
      </div>

      {/* Stats */}
      {jobs.length > 0 && (
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-zinc-900">
                {jobs.length}
              </div>
              <div className="text-xs text-zinc-600">Total Jobs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-900">
                {jobs.filter((j) => j.status === "completed").length}
              </div>
              <div className="text-xs text-zinc-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-900">
                {jobs.filter((j) => j.status === "processing").length}
              </div>
              <div className="text-xs text-zinc-600">In Progress</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
