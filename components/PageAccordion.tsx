"use client";

import { useState } from "react";
import CheckCard from "@/components/CheckCard";
import type { PageResult } from "@/lib/scan-types";

interface PageAccordionProps {
  pages: PageResult[];
}

export default function PageAccordion({ pages }: PageAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Per-Page Results</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {pages.map((page, i) => {
          const isOpen = openIndex === i;
          const displayUrl = page.url.replace(/^https?:\/\//, "");

          return (
            <div key={page.url}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700 truncate flex-1 mr-3">
                  {displayUrl}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  {page.error ? (
                    <span className="text-sm text-red-500">Error</span>
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        (page.overallScore ?? 0) >= 80
                          ? "text-green-600"
                          : (page.overallScore ?? 0) >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {page.overallScore}/100
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
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

              {isOpen && page.checks && (
                <div className="px-4 pb-4 space-y-2">
                  {Object.entries(page.checks).map(([key, check]) => (
                    <CheckCard key={key} checkKey={key} check={check} />
                  ))}
                </div>
              )}

              {isOpen && page.error && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-red-600">
                    Failed to scan: {page.error}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
