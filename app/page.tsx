"use client";

import { useReducer } from "react";
import ScanForm from "@/components/ScanForm";
import ScoreGauge from "@/components/ScoreGauge";
import CheckCard from "@/components/CheckCard";
import RecommendationList from "@/components/RecommendationList";
import ScanProgressUI from "@/components/ScanProgress";
import SiteResults from "@/components/SiteResults";
import { useSiteScan } from "@/hooks/useSiteScan";
import { track } from "@vercel/analytics";
import { scanReducer, type ScanMode, type ScanState } from "@/lib/scan-types";

const initialState: ScanState = { status: "idle" };

export default function Home() {
  const [state, dispatch] = useReducer(scanReducer, initialState);
  const { startScan: startSiteScan, abort: abortSiteScan } =
    useSiteScan(dispatch);

  async function handleScan(url: string, mode: ScanMode) {
    track("scan_started", { mode, url });

    if (mode === "site") {
      startSiteScan(url);
      return;
    }

    dispatch({ type: "START_SCAN", url, mode });

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        track("scan_error", { mode, url, error: data.error || "unknown" });
        dispatch({
          type: "SCAN_ERROR",
          message: data.error || "Scan failed. Please try again.",
        });
        return;
      }

      track("scan_completed", { mode, url, score: data.overallScore, grade: data.scoreGrade });
      dispatch({ type: "SCAN_COMPLETE", result: data });
    } catch {
      track("scan_error", { mode, url, error: "network" });
      dispatch({
        type: "SCAN_ERROR",
        message: "Could not connect to the scanner. Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Page heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-bai-navy">
            AEO Scanner
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-600">
            Is your website visible to AI search engines?
          </p>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            ChatGPT, Perplexity, and Gemini are changing how customers find businesses.
            Traditional SEO gets you ranked &mdash; Answer Engine Optimization gets you cited.
          </p>
        </div>

        {/* Idle + single-page scanning: Show form */}
        {(state.status === "idle" ||
          (state.status === "scanning" && state.mode === "single")) && (
          <>
            <ScanForm
              onSubmit={handleScan}
              isScanning={state.status === "scanning"}
            />

            {/* What we check + credibility (idle only) */}
            {state.status === "idle" && (
              <div className="mt-8 space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    What we check
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-bai-blue mt-0.5">&#9679;</span>
                      <div>
                        <p className="font-medium text-gray-800">Heading Structure</p>
                        <p className="text-gray-500">AI-readable heading hierarchy</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-bai-blue mt-0.5">&#9679;</span>
                      <div>
                        <p className="font-medium text-gray-800">Meta Description</p>
                        <p className="text-gray-500">Answer-ready page summaries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-bai-blue mt-0.5">&#9679;</span>
                      <div>
                        <p className="font-medium text-gray-800">Schema Markup</p>
                        <p className="text-gray-500">Structured data for AI crawlers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-bai-blue mt-0.5">&#9679;</span>
                      <div>
                        <p className="font-medium text-gray-800">FAQ Section</p>
                        <p className="text-gray-500">Question-answer content for citation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <span className="text-bai-blue mt-0.5">&#9679;</span>
                      <div>
                        <p className="font-medium text-gray-800">Content Structure</p>
                        <p className="text-gray-500">Lists, depth, and word count for AI comprehension</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400">
                  Built by{" "}
                  <a
                    href="https://birminghamai.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 underline hover:text-bai-blue transition-colors"
                  >
                    Birmingham AI
                  </a>
                  {" "}&mdash; helping local businesses navigate the AI search era
                </p>
              </div>
            )}
          </>
        )}

        {/* Site-wide scanning: Show progress */}
        {state.status === "scanning" && state.mode === "site" && (
          <ScanProgressUI
            progress={state.progress}
            onAbort={() => {
              abortSiteScan();
              dispatch({ type: "RESET" });
            }}
          />
        )}

        {/* Error state */}
        {state.status === "error" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4" role="alert">
              <p className="text-red-800 font-medium">Scan failed</p>
              <p className="text-red-600 text-sm mt-1">{state.message}</p>
            </div>
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="w-full py-3 px-6 rounded-lg border-2 border-bai-blue text-bai-blue font-semibold hover:bg-bai-blue hover:text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Complete: Show results */}
        {state.status === "complete" && state.mode === "single" && (
          <div className="space-y-6 animate-fade-in-up">
            <ScoreGauge
              score={state.result.overallScore}
              grade={state.result.scoreGrade}
              url={state.url}
            />

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">
                AEO Check Results
              </h2>
              {Object.entries(state.result.checks).map(([key, check]) => (
                <CheckCard key={key} checkKey={key} check={check} />
              ))}
            </div>

            <RecommendationList
              recommendations={state.result.recommendations}
            />

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
                onClick={() => track("cta_clicked", { type: "join_bai", location: "single_results" })}
                className="inline-block mt-3 px-5 py-2 rounded-lg bg-bai-blue text-white text-sm font-semibold hover:bg-bai-blue-dark transition-colors"
              >
                Learn More
              </a>
            </div>

            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="w-full py-3 px-6 rounded-lg border-2 border-bai-blue text-bai-blue font-semibold hover:bg-bai-blue hover:text-white transition-colors"
            >
              Scan Another Site
            </button>
          </div>
        )}

        {/* Site-wide complete */}
        {state.status === "complete" && state.mode === "site" && (
          <SiteResults
            result={state.result}
            url={state.url}
            onReset={() => dispatch({ type: "RESET" })}
          />
        )}
      </div>
    </div>
  );
}
