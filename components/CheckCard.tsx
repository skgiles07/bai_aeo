"use client";

import { useState } from "react";
import type { CheckResult } from "@/lib/scan-types";
import { CHECK_LABELS } from "@/lib/constants";

interface CheckCardProps {
  checkKey: string;
  check: CheckResult;
}

export default function CheckCard({ checkKey, check }: CheckCardProps) {
  const [expanded, setExpanded] = useState(false);
  const label = CHECK_LABELS[checkKey] || checkKey;

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        check.pass
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`check-detail-${checkKey}`}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{check.pass ? "\u2705" : "\u274C"}</span>
          <div>
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-600">{check.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-sm font-semibold text-gray-700">
            {check.score}/{check.maxScore}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {expanded && check.details && (
        <div id={`check-detail-${checkKey}`} role="region" className="mt-3 pt-3 border-t border-gray-200">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {Object.entries(check.details).map(([key, value]) => (
              <div key={key}>
                <dt className="text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </dt>
                <dd className="font-medium text-gray-800">
                  {Array.isArray(value)
                    ? value.join(", ") || "None"
                    : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
