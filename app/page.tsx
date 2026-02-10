"use client";

import { useReducer } from "react";
import ScanForm from "@/components/ScanForm";
import ScoreGauge from "@/components/ScoreGauge";
import CheckCard from "@/components/CheckCard";
import RecommendationList from "@/components/RecommendationList";
import ScanProgressUI from "@/components/ScanProgress";
import SiteResults from "@/components/SiteResults";
import { useSiteScan } from "@/hooks/useSiteScan";
import { scanReducer, type ScanMode, type ScanState } from "@/lib/scan-types";

const initialState: ScanState = { status: "idle" };

export default function Home() {
  const [state, dispatch] = useReducer(scanReducer, initialState);
  const { startScan: startSiteScan, abort: abortSiteScan } =
    useSiteScan(dispatch);

  async function handleScan(url: string, mode: ScanMode) {
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
        dispatch({
          type: "SCAN_ERROR",
          message: data.error || "Scan failed. Please try again.",
        });
        return;
      }

      dispatch({ type: "SCAN_COMPLETE", result: data });
    } catch {
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
            Check how your website performs in AI search results
          </p>
        </div>

        {/* Idle + single-page scanning: Show form */}
        {(state.status === "idle" ||
          (state.status === "scanning" && state.mode === "single")) && (
          <ScanForm
            onSubmit={handleScan}
            isScanning={state.status === "scanning"}
          />
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
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-800 font-medium">Scan failed</p>
              <p className="text-red-600 text-sm mt-1">{state.message}</p>
            </div>
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="w-full py-3 px-6 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Complete: Show results */}
        {state.status === "complete" && state.mode === "single" && (
          <div className="space-y-6">
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

            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="w-full py-3 px-6 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
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
