"use client";

interface DatasetSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function DatasetSelector({
  value,
  onChange,
}: DatasetSelectorProps) {
  const datasets = [
    { id: "E06OCM_L2C_LAC_AD", name: "E06OCM_L2C_LAC_AD" },
    { id: "E06OCM_L2C_LAC_GA", name: "E06OCM_L2C_LAC_GA" },
    { id: "E06OCM_L2C_LAC_OC", name: "E06OCM_L2C_LAC_OC" },
    { id: "E06OCM_L2C_LAC_PR", name: "E06OCM_L2C_LAC_PR" },
    { id: "E06OCM_L2C_LAC_PS", name: "E06OCM_L2C_LAC_PS" },
    { id: "E06OCM_L3_LAC_AD", name: "E06OCM_L3_LAC_AD" },
    { id: "E06OCM_L4_AC", name: "E06OCM_L4_AC" },
    { id: "3RIMG_L1B_STD", name: "3RIMG_L1B_STD" },
    { id: "3RIMG_L1C_ASIA_MER", name: "3RIMG_L1C_ASIA_MER" },
    { id: "3RIMG_L1C_SGP", name: "3RIMG_L1C_SGP" },
    { id: "3RIMG_L2B_CMK", name: "3RIMG_L2B_CMK" },
    { id: "3RIMG_L2B_CTP", name: "3RIMG_L2B_CTP" },
    { id: "3RIMG_L2B_HEM", name: "3RIMG_L2B_HEM" },
    { id: "3RIMG_L2B_IMC", name: "3RIMG_L2B_IMC" },
    { id: "3RIMG_L2B_LST", name: "3RIMG_L2B_LST" },
    { id: "3RIMG_L2B_OLR", name: "3RIMG_L2B_OLR" },
    { id: "3RIMG_L2B_SST", name: "3RIMG_L2B_SST" },
    { id: "O2-SCT-AWV50", name: "O2-SCT-AWV50" },
    { id: "O2-SCT-DAILYAWV50", name: "O2-SCT-DAILYAWV50" },
    { id: "O2-SCT-HWV", name: "O2-SCT-HWV" },
    // there are many --> add afterwards
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    >
      <option value="">Select Dataset</option>
      {datasets.map((ds) => (
        <option key={ds.id} value={ds.id}>
          {ds.name}
        </option>
      ))}
    </select>
  );
}
