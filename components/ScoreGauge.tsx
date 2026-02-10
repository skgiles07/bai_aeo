"use client";

interface ScoreGaugeProps {
  score: number;
  grade: string;
  url?: string;
}

function getGradeColor(grade: string) {
  switch (grade) {
    case "A":
      return { ring: "text-green-500", bg: "bg-green-50", text: "text-green-700" };
    case "B":
      return { ring: "text-blue-500", bg: "bg-blue-50", text: "text-blue-700" };
    case "C":
      return { ring: "text-yellow-500", bg: "bg-yellow-50", text: "text-yellow-700" };
    case "D":
      return { ring: "text-orange-500", bg: "bg-orange-50", text: "text-orange-700" };
    default:
      return { ring: "text-red-500", bg: "bg-red-50", text: "text-red-700" };
  }
}

export default function ScoreGauge({ score, grade, url }: ScoreGaugeProps) {
  const colors = getGradeColor(grade);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`rounded-xl ${colors.bg} border p-6 text-center`}>
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
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
            strokeDashoffset={offset}
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
    </div>
  );
}
