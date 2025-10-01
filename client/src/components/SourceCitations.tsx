// components/SourceCitations.tsx
"use client";
import { useState } from "react";

interface Source {
  url: string;
  title: string;
  content: string;
  score: number;
}

interface SourceCitationsProps {
  sources: Source[];
}

export default function SourceCitations({ sources }: SourceCitationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  const topSource = sources[0];

  return (
    <div className="mt-4 border-t border-gray-200 pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Sources</h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? "Show Less" : `Show ${sources.length} Sources`}
        </button>
      </div>

      {/* Always show top source */}
      <div className="mb-2">
        <a
          href={topSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:text-blue-700 block truncate"
          title={topSource.title}
        >
          📄 {topSource.title || "MOSDAC Document"}
        </a>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {topSource.content}
        </p>
      </div>

      {/* Expandable additional sources */}
      {isExpanded &&
        sources.slice(1).map((source, index) => (
          <div key={index} className="mb-2 border-t border-gray-100 pt-2">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 block truncate"
              title={source.title}
            >
              📄 {source.title || "MOSDAC Document"}
              <span className="text-gray-400 ml-2">
                ({(source.score * 100).toFixed(1)}% match)
              </span>
            </a>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {source.content}
            </p>
          </div>
        ))}
    </div>
  );
}
