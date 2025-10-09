"use client";

import DownloadForm from "./components/DownloadForm";
import DownloadStatus from "./components/DownloadStatus";

export default function DownloadsPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-2xl font-bold">MOSDAC Dataset Downloads</h1>
      <DownloadForm />
      <hr />
      <DownloadStatus />
    </div>
  );
}
