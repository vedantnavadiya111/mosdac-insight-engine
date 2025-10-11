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
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "processing":
      case "downloading":
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "failed":
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
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
      className={`${bgColor} ${borderColor} border rounded-2xl p-4 space-y-3 shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}
          >
            <StatusIcon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Job #{job.id}</p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${color}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              {job.status === "processing" && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                  <div
                    className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {job.status === "completed" && job.file_path && (
          <a
            href={`/download/file/${job.id}`}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-md"
            target="_blank"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download ZIP</span>
          </a>
        )}
      </div>

      {/* Error Message */}
      {job.error_message && (
        <div className="bg-red-100 border border-red-200 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{job.error_message}</p>
        </div>
      )}

      {/* File Info */}
      {job.status === "completed" && job.file_path && (
        <div className="flex items-center space-x-2 text-green-700">
          <FileArchive className="w-4 h-4" />
          <span className="text-sm">Ready for download</span>
        </div>
      )}
    </div>
  );
}
