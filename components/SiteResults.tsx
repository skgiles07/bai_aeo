"use client";

import { track } from "@vercel/analytics";
import ScoreGauge from "@/components/ScoreGauge";
import RecommendationList from "@/components/RecommendationList";
import PageAccordion from "@/components/PageAccordion";
import type { SiteResult } from "@/lib/scan-types";
import { CHECK_LABELS } from "@/lib/constants";

interface SiteResultsProps {
  result: SiteResult;
  url: string;
  onReset: () => void;
}

export default function SiteResults({
  result,
  url,
  onReset,
}: SiteResultsProps) {
  return (
    <div className="space-y-6">
      {/* Score gauge */}
      <ScoreGauge
        score={result.overallScore}
        grade={result.scoreGrade}
        url={url}
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-white border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {result.totalPages}
          </p>
          <p className="text-xs text-gray-500">Pages Scanned</p>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            {result.successfulScans}
          </p>
          <p className="text-xs text-gray-500">Successful</p>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-red-600">
            {result.failedScans}
          </p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
      </div>

      {/* Site-wide issues summary */}
      {result.siteIssues.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Site-Wide Issues
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {result.siteIssues.map((issue) => (
              <div
                key={issue.checkType}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {CHECK_LABELS[issue.checkType] || issue.checkType}
                  </p>
                  <p className="text-sm text-gray-500">
                    {issue.affectedPages} of {issue.totalPages} pages affected
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${issue.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-red-600 w-10 text-right">
                    {issue.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-page accordion */}
      <PageAccordion pages={result.pageResults} />

      {/* Recommendations */}
      <RecommendationList recommendations={result.recommendations} />

      {/* Join BAI CTA */}
      <div className="rounded-xl border border-bai-blue/20 bg-bai-blue/5 p-5 text-center">
        <p className="font-medium text-bai-navy">Want help improving your score?</p>
        <p className="text-sm text-gray-600 mt-1">
          Join Birmingham AI to learn AEO strategies at our next meetup.
        </p>
        <a
          href="https://birminghamai.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("cta_clicked", { type: "join_bai", location: "site_results" })}
          className="inline-block mt-3 px-5 py-2 rounded-lg bg-bai-blue text-white text-sm font-semibold hover:bg-bai-blue-dark transition-colors"
        >
          Learn More
        </a>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full py-3 px-6 rounded-lg border-2 border-bai-blue text-bai-blue font-semibold hover:bg-bai-blue hover:text-white transition-colors"
      >
        Scan Another Site
      </button>
    </div>
  );
}
