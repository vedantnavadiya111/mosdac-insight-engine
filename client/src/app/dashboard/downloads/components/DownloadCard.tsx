"use client";

interface DownloadCardProps {
  job: {
    id: number;
    status: string;
    file_path?: string;
    error_message?: string;
  };
}

export default function DownloadCard({ job }: DownloadCardProps) {
  return (
    <div className="border p-4 rounded space-y-2 shadow">
      <p>
        <strong>Job ID:</strong> {job.id}
      </p>
      <p>
        <strong>Status:</strong> {job.status}
      </p>
      {job.error_message && <p className="text-red-500">{job.error_message}</p>}
      {job.status === "completed" && job.file_path && (
        <a
          href={`/download/file/${job.id}`}
          className="text-blue-500 underline"
          target="_blank"
        >
          Download ZIP
        </a>
      )}
    </div>
  );
}
