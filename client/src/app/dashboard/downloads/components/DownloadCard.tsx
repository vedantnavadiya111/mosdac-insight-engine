"use client";

import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileArchive,
} from "lucide-react";

interface DownloadCardProps {
  job: {
    id: number;
    status: string;
    file_path?: string;
    error_message?: string;
  };
}

export default function DownloadCard({ job }: DownloadCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-zinc-800",
          bgColor: "bg-white",
          borderColor: "border-zinc-200",
        };
      case "processing":
      case "downloading":
        return {
          icon: Clock,
          color: "text-zinc-800",
          bgColor: "bg-white",
          borderColor: "border-zinc-200",
        };
      case "failed":
      case "error":
        return {
          icon: AlertCircle,
          color: "text-zinc-800",
          bgColor: "bg-white",
          borderColor: "border-zinc-200",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const {
    icon: StatusIcon,
    color,
    bgColor,
    borderColor,
  } = getStatusConfig(job.status);

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center"
          >
            <StatusIcon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Job #{job.id}</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-zinc-700 border border-zinc-200 bg-zinc-50 px-2 py-1 rounded-full">
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              {job.status === "processing" && (
                <div className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {job.status === "completed" && job.file_path && (
          <a
            href={`/download/file/${job.id}`}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
            target="_blank"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download ZIP</span>
          </a>
        )}
      </div>

      {/* Error Message */}
      {job.error_message && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-zinc-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Error</span>
          </div>
          <p className="text-zinc-600 text-sm mt-1">{job.error_message}</p>
        </div>
      )}

      {/* File Info */}
      {job.status === "completed" && job.file_path && (
        <div className="flex items-center space-x-2 text-zinc-700">
          <FileArchive className="w-4 h-4" />
          <span className="text-sm">Ready for download</span>
        </div>
      )}
    </div>
  );
}
