"use client";

import { useState } from "react";
import { ChevronDown, Search, Database } from "lucide-react";

interface DatasetSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function DatasetSelector({
  value,
  onChange,
}: DatasetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const datasets = [
    {
      id: "E06OCM_L2C_LAC_AD",
      name: "E06OCM_L2C_LAC_AD",
      category: "Ocean Color",
    },
    {
      id: "E06OCM_L2C_LAC_GA",
      name: "E06OCM_L2C_LAC_GA",
      category: "Ocean Color",
    },
    {
      id: "E06OCM_L2C_LAC_OC",
      name: "E06OCM_L2C_LAC_OC",
      category: "Ocean Color",
    },
    {
      id: "E06OCM_L2C_LAC_PR",
      name: "E06OCM_L2C_LAC_PR",
      category: "Ocean Color",
    },
    {
      id: "E06OCM_L2C_LAC_PS",
      name: "E06OCM_L2C_LAC_PS",
      category: "Ocean Color",
    },
    {
      id: "E06OCM_L3_LAC_AD",
      name: "E06OCM_L3_LAC_AD",
      category: "Ocean Color",
    },
    { id: "E06OCM_L4_AC", name: "E06OCM_L4_AC", category: "Ocean Color" },
    { id: "3RIMG_L1B_STD", name: "3RIMG_L1B_STD", category: "Meteorological" },
    {
      id: "3RIMG_L1C_ASIA_MER",
      name: "3RIMG_L1C_ASIA_MER",
      category: "Meteorological",
    },
    { id: "3RIMG_L1C_SGP", name: "3RIMG_L1C_SGP", category: "Meteorological" },
    { id: "3RIMG_L2B_CMK", name: "3RIMG_L2B_CMK", category: "Meteorological" },
    { id: "3RIMG_L2B_CTP", name: "3RIMG_L2B_CTP", category: "Meteorological" },
    { id: "3RIMG_L2B_HEM", name: "3RIMG_L2B_HEM", category: "Meteorological" },
    { id: "3RIMG_L2B_IMC", name: "3RIMG_L2B_IMC", category: "Meteorological" },
    { id: "3RIMG_L2B_LST", name: "3RIMG_L2B_LST", category: "Meteorological" },
    { id: "3RIMG_L2B_OLR", name: "3RIMG_L2B_OLR", category: "Meteorological" },
    { id: "3RIMG_L2B_SST", name: "3RIMG_L2B_SST", category: "Meteorological" },
    { id: "O2-SCT-AWV50", name: "O2-SCT-AWV50", category: "Ocean Wind" },
    {
      id: "O2-SCT-DAILYAWV50",
      name: "O2-SCT-DAILYAWV50",
      category: "Ocean Wind",
    },
    { id: "O2-SCT-HWV", name: "O2-SCT-HWV", category: "Ocean Wind" },
  ];

  const filteredDatasets = datasets.filter(
    (ds) =>
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(datasets.map((ds) => ds.category))];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-800 flex items-center space-x-2">
        <Database className="w-4 h-4" />
        <span>Select Dataset</span>
      </label>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
        />
      </div>

      {/* Dataset Selector */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-zinc-200 rounded-xl px-4 py-2.5 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
        >
          <option value="">Choose a dataset...</option>
          {categories.map((category) => (
            <optgroup key={category} label={category}>
              {filteredDatasets
                .filter((ds) => ds.category === category)
                .map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* Selected Dataset Info */}
      {value && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-zinc-800">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">
              {datasets.find((ds) => ds.id === value)?.name}
            </span>
          </div>
          <p className="text-zinc-600 text-xs mt-1">
            Category: {datasets.find((ds) => ds.id === value)?.category}
          </p>
        </div>
      )}
    </div>
  );
}
