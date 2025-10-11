"use client";

import DownloadForm from "./components/DownloadForm";
import DownloadStatus from "./components/DownloadStatus";
import { Download, Database, Satellite } from "lucide-react";

export default function DownloadsPage() {
  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50/30 to-orange-50/20 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">MOSDAC Dataset Downloads</h1>
            <p className="text-blue-100 opacity-90">
              Access and download satellite datasets from ISRO archives
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Satellite className="w-4 h-4" />
            <span className="text-sm font-medium">ISRO SagarMegh</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Download Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Request Dataset
            </h2>
          </div>
          <DownloadForm />
        </div>

        {/* Download Status Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Download className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Download Status
            </h2>
          </div>
          <DownloadStatus />
        </div>
      </div>
    </div>
  );
}
