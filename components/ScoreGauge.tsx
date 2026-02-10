"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";

interface ScoreGaugeProps {
  score: number;
  grade: string;
  url?: string;
}

function getGradeColor(grade: string) {
  switch (grade) {
    case "A":
      return { ring: "text-green-500", bg: "bg-green-50", border: "border-green-200", text: "text-green-800" };
    case "B":
      return { ring: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" };
    case "C":
      return { ring: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" };
    case "D":
      return { ring: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800" };
    default:
      return { ring: "text-red-500", bg: "bg-red-50", border: "border-red-200", text: "text-red-800" };
  }
}

export default function ScoreGauge({ score, grade, url }: ScoreGaugeProps) {
  const colors = getGradeColor(grade);
  const circumference = 2 * Math.PI * 54;
  const targetOffset = circumference - (score / 100) * circumference;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedOffset(targetOffset);
    });
    return () => cancelAnimationFrame(frame);
  }, [targetOffset]);

  return (
    <div
      className={`rounded-xl ${colors.bg} ${colors.border} border p-6 text-center`}
      role="img"
      aria-label={`AEO score: ${score} out of 100, Grade ${grade}`}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            className={`${colors.ring} transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <p className={`text-2xl font-bold mt-3 ${colors.text}`}>Grade: {grade}</p>
      {url && (
        <p className="text-sm text-gray-500 mt-1 truncate max-w-xs mx-auto">
          {url}
        </p>
      )}

      {/* Share buttons */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="text-xs text-gray-400">Share your score:</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My site scored ${score}/100 on the AEO Scanner by @BirminghamAI. How AI-ready is yours?`)}&url=${encodeURIComponent("https://bai-aeo.vercel.app")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("share_clicked", { platform: "twitter", score })}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://bai-aeo.vercel.app")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("share_clicked", { platform: "linkedin", score })}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      </div>

      {/* Scoring methodology */}
      <p className="text-xs text-gray-400 mt-3">
        Scored across 5 dimensions weighted by AI engine citation patterns: heading structure, meta descriptions, schema markup, FAQ content, and content structure.
      </p>
    </div>
  );
}
