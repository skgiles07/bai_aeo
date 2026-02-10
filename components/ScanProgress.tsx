"use client";

import type { ScanProgress } from "@/lib/scan-types";

interface ScanProgressProps {
  progress: ScanProgress;
  onAbort?: () => void;
}

export default function ScanProgress({ progress, onAbort }: ScanProgressProps) {
  const { discoveryMethod, discoveredCount, completed, total, currentUrl, pageScores } = progress;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Discovery phase */}
      {discoveryMethod && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-800">
            Found <span className="font-semibold">{discoveredCount}</span> pages
            via {discoveryMethod === "sitemap" ? "sitemap.xml" : "link crawling"}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>
            Scanning {completed} of {total} pages...
          </span>
          <span>{pct}%</span>
        </div>
        <div
          className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Scan progress: ${pct}%`}
        >
          <div
            className="bg-bai-blue h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Current URL being scanned */}
      {currentUrl && (
        <p className="text-sm text-gray-500 truncate">
          Scanning: {currentUrl}
        </p>
      )}

      {/* Live feed of scanned pages */}
      {pageScores.length > 0 && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
          {pageScores
            .slice()
            .reverse()
            .map((page) => (
              <div
                key={page.url}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="text-gray-700 truncate flex-1 mr-3">
                  {page.url.replace(/^https?:\/\//, "")}
                </span>
                {page.error ? (
                  <span className="text-red-500 shrink-0">Error</span>
                ) : page.score !== null ? (
                  <span
                    className={`font-medium shrink-0 ${
                      page.score >= 80
                        ? "text-green-600"
                        : page.score >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {page.score}/100
                  </span>
                ) : (
                  <span className="text-gray-400 shrink-0">---</span>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Abort button */}
      {onAbort && (
        <button
          type="button"
          onClick={onAbort}
          className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Cancel Scan
        </button>
      )}
    </div>
  );
}
