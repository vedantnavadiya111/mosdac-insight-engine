"use client";
import { useState } from "react";
import DatasetSelector from "./DatasetSelector";
import { useDownloads } from "@/hooks/useDownloads";

export default function DownloadForm() {
  const { startDownload } = useDownloads();
  const [datasetId, setDatasetId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetId || !username || !password) return;
    startDownload({
      dataset_id: datasetId,
      mosdac_username: username,
      mosdac_password: password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DatasetSelector value={datasetId} onChange={setDatasetId} />
      <input
        type="text"
        placeholder="MOSDAC Username / Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="MOSDAC Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Start Download
      </button>
    </form>
  );
}
