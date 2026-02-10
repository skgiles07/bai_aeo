"use client";

import type { Recommendation } from "@/lib/scan-types";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

function ImpactBadge({ impact }: { impact: string }) {
  const colors: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-gray-100 text-gray-600",
    Maintaining: "bg-green-100 text-green-700",
    Optimizing: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        colors[impact] || "bg-gray-100 text-gray-600"
      }`}
    >
      {impact}
    </span>
  );
}

function EffortBadge({ effort }: { effort: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      {effort} effort
    </span>
  );
}

export default function RecommendationList({
  recommendations,
}: RecommendationListProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Recommendations</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {recommendations.map((rec) => (
          <li key={rec.priority} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-400">
                    #{rec.priority}
                  </span>
                  <p className="font-medium text-gray-900">{rec.title}</p>
                </div>
                <p className="text-sm text-gray-600">{rec.summary}</p>
                {rec.details && (
                  <p className="text-sm text-gray-500 mt-1">{rec.details}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <ImpactBadge impact={rec.impact} />
                {rec.effort && rec.effort !== "None" && (
                  <EffortBadge effort={rec.effort} />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
