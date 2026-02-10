// API response types matching the Railway backend

export interface CheckResult {
  pass: boolean;
  score: number;
  maxScore: number;
  details: Record<string, unknown>;
  message: string;
}

export interface ScanChecks {
  headingHierarchy: CheckResult;
  metaDescription: CheckResult;
  schemaMarkup: CheckResult;
  faqSection: CheckResult;
  contentStructure: CheckResult;
}

export interface Recommendation {
  priority: number;
  title: string;
  impact: string;
  effort: string;
  summary: string;
  details: string;
  learnMoreUrl: string;
  affectedUrls?: string[];
}

export interface SinglePageResult {
  success: boolean;
  url: string;
  scannedAt: string;
  overallScore: number;
  scoreGrade: string;
  checks: ScanChecks;
  recommendations: Recommendation[];
  error?: string;
}

export interface SiteIssue {
  checkType: string;
  affectedPages: number;
  totalPages: number;
  percentage: number;
  pages: { url: string; details: Record<string, unknown>; message: string }[];
}

export interface PageResult {
  url: string;
  overallScore?: number;
  scoreGrade?: string;
  checks?: ScanChecks;
  error?: string;
}

export interface SiteResult {
  overallScore: number;
  scoreGrade: string;
  totalPages: number;
  successfulScans: number;
  failedScans: number;
  siteIssues: SiteIssue[];
  pageResults: PageResult[];
  recommendations: Recommendation[];
  scannedAt: string;
  siteUrl: string;
}

// SSE progress tracking

export interface ScanProgress {
  discoveryMethod?: string;
  discoveredCount?: number;
  discoveredUrls?: string[];
  completed: number;
  total: number;
  currentUrl?: string;
  pageScores: { url: string; score: number | null; error: string | null }[];
}

// Scan state machine

export type ScanMode = "single" | "site";

export type ScanState =
  | { status: "idle" }
  | { status: "scanning"; url: string; mode: "single" }
  | {
      status: "scanning";
      url: string;
      mode: "site";
      progress: ScanProgress;
    }
  | {
      status: "complete";
      url: string;
      mode: "single";
      result: SinglePageResult;
    }
  | { status: "complete"; url: string; mode: "site"; result: SiteResult }
  | { status: "error"; url: string; message: string };

export type ScanAction =
  | { type: "START_SCAN"; url: string; mode: ScanMode }
  | { type: "SCAN_COMPLETE"; result: SinglePageResult | SiteResult }
  | { type: "SCAN_ERROR"; message: string }
  | {
      type: "SITE_DISCOVERED";
      method: string;
      count: number;
      urls: string[];
    }
  | {
      type: "SITE_PAGE_PROGRESS";
      completed: number;
      total: number;
      currentUrl: string;
      score: number | null;
      error: string | null;
    }
  | { type: "RESET" };

const emptyProgress: ScanProgress = {
  completed: 0,
  total: 0,
  pageScores: [],
};

export function scanReducer(state: ScanState, action: ScanAction): ScanState {
  switch (action.type) {
    case "START_SCAN":
      if (action.mode === "site") {
        return {
          status: "scanning",
          url: action.url,
          mode: "site",
          progress: { ...emptyProgress },
        };
      }
      return { status: "scanning", url: action.url, mode: "single" };

    case "SITE_DISCOVERED":
      if (state.status !== "scanning" || state.mode !== "site") return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          discoveryMethod: action.method,
          discoveredCount: action.count,
          discoveredUrls: action.urls,
          total: action.count,
        },
      };

    case "SITE_PAGE_PROGRESS":
      if (state.status !== "scanning" || state.mode !== "site") return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          completed: action.completed,
          total: action.total,
          currentUrl: action.currentUrl,
          pageScores: [
            ...state.progress.pageScores,
            {
              url: action.currentUrl,
              score: action.score,
              error: action.error,
            },
          ],
        },
      };

    case "SCAN_COMPLETE":
      if (state.status !== "scanning") return state;
      if (state.mode === "single") {
        return {
          status: "complete",
          url: state.url,
          mode: "single",
          result: action.result as SinglePageResult,
        };
      }
      return {
        status: "complete",
        url: state.url,
        mode: "site",
        result: action.result as SiteResult,
      };

    case "SCAN_ERROR":
      return {
        status: "error",
        url:
          state.status === "scanning"
            ? state.url
            : "",
        message: action.message,
      };

    case "RESET":
      return { status: "idle" };

    default:
      return state;
  }
}
