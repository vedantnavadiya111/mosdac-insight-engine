"use client";

import DownloadForm from "./components/DownloadForm";
import DownloadStatus from "./components/DownloadStatus";
import LogoMark from "@/components/LogoMark";
import { Download, Database } from "lucide-react";

export default function DownloadsPage() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
            <LogoMark className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Dataset Downloads
            </h1>
            <p className="text-zinc-600 mt-1">
              Queue MOSDAC downloads and track job status.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Download Form Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Request Dataset
            </h2>
          </div>
          <DownloadForm />
        </div>

        {/* Download Status Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-9 h-9 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center">
              <Download className="w-4 h-4 text-zinc-700" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Download Status
            </h2>
          </div>
          <DownloadStatus />
        </div>
      </div>
    </div>
  );
}
