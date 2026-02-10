"use client";

import { useState } from "react";
import type { ScanMode } from "@/lib/scan-types";

interface ScanFormProps {
  onSubmit: (url: string, mode: ScanMode) => void;
  isScanning: boolean;
}

export default function ScanForm({ onSubmit, isScanning }: ScanFormProps) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<ScanMode>("single");
  const [error, setError] = useState("");

  function validateUrl(input: string): string | null {
    let normalized = input.trim();
    if (!normalized) return "Please enter a URL";

    if (
      !normalized.startsWith("http://") &&
      !normalized.startsWith("https://")
    ) {
      normalized = "https://" + normalized;
    }

    try {
      const parsed = new URL(normalized);
      if (!parsed.hostname.includes(".")) {
        return "Please enter a valid domain (e.g., example.com)";
      }
      return null;
    } catch {
      return "Please enter a valid URL (e.g., example.com)";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    let normalized = url.trim();
    if (
      !normalized.startsWith("http://") &&
      !normalized.startsWith("https://")
    ) {
      normalized = "https://" + normalized;
    }
    onSubmit(normalized, mode);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="space-y-4">
        {/* URL Input */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Website URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="example.com"
            disabled={isScanning}
            className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bai-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              error ? "border-red-400" : "border-gray-300"
            }`}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {/* Scan Mode Toggle */}
        <div
          className="flex rounded-lg border border-gray-300 overflow-hidden"
          role="radiogroup"
          aria-label="Scan mode"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === "single"}
            onClick={() => setMode("single")}
            disabled={isScanning}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-bai-blue focus-visible:ring-offset-2 ${
              mode === "single"
                ? "bg-bai-blue text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Single Page
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={mode === "site"}
            onClick={() => setMode("site")}
            disabled={isScanning}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-bai-blue focus-visible:ring-offset-2 ${
              mode === "site"
                ? "bg-bai-blue text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Full Site (up to 25 pages)
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isScanning}
          className="w-full py-3 px-6 rounded-lg bg-bai-blue text-white font-semibold text-lg transition-colors hover:bg-bai-blue-dark disabled:bg-bai-blue-light/60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isScanning ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Scanning...
            </>
          ) : (
            "Scan Now"
          )}
        </button>
      </div>
    </form>
  );
}
