"use client";
import { useState } from "react";
import DatasetSelector from "./DatasetSelector";
import { useDownloads } from "@/hooks/useDownloads";
import { User, Lock, Rocket, Shield } from "lucide-react";

export default function DownloadForm() {
  const { startDownload } = useDownloads();
  const [datasetId, setDatasetId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetId || !username || !password) return;

    setLoading(true);
    try {
      await startDownload({
        dataset_id: datasetId,
        mosdac_username: username,
        mosdac_password: password,
      });
      // Reset form on success
      setDatasetId("");
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DatasetSelector value={datasetId} onChange={setDatasetId} />

      {/* Username Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-800 flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>MOSDAC Username / Email</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Enter your MOSDAC credentials"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-800 flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>MOSDAC Password</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
            required
          />
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 text-zinc-800">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Secure Authentication</span>
        </div>
        <p className="text-zinc-600 text-xs mt-1">
          Your credentials are securely transmitted and encrypted. We do not
          store your MOSDAC password.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !datasetId || !username || !password}
        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Starting Download...</span>
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            <span>Start Dataset Download</span>
          </>
        )}
      </button>
    </form>
  );
}
