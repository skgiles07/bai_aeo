import { useRef, useCallback } from "react";
import type { ScanAction } from "@/lib/scan-types";

export function useSiteScan(dispatch: React.Dispatch<ScanAction>) {
  const abortRef = useRef<AbortController | null>(null);

  const startScan = useCallback(
    async (url: string) => {
      // Abort any in-flight scan
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch({ type: "START_SCAN", url, mode: "site" });

      try {
        const res = await fetch("/api/scan-site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });

        if (!res.ok) {
          dispatch({
            type: "SCAN_ERROR",
            message: "Failed to start site scan. Please try again.",
          });
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          dispatch({
            type: "SCAN_ERROR",
            message: "Streaming not supported in this browser.",
          });
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const jsonStr = trimmed.slice(6);
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);
              handleSSEEvent(event, dispatch);
            } catch {
              // Skip malformed JSON lines (heartbeats, etc.)
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim().startsWith("data: ")) {
          try {
            const event = JSON.parse(buffer.trim().slice(6));
            handleSSEEvent(event, dispatch);
          } catch {
            // Ignore
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        dispatch({
          type: "SCAN_ERROR",
          message: "Connection lost during scan. Please try again.",
        });
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [dispatch]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  return { startScan, abort };
}

function handleSSEEvent(
  event: Record<string, unknown>,
  dispatch: React.Dispatch<ScanAction>
) {
  switch (event.type) {
    case "discovered":
      dispatch({
        type: "SITE_DISCOVERED",
        method: (event.method as string) || "unknown",
        count: (event.count as number) || 0,
        urls: (event.urls as string[]) || [],
      });
      break;

    case "progress":
      dispatch({
        type: "SITE_PAGE_PROGRESS",
        completed: (event.completed as number) || 0,
        total: (event.total as number) || 0,
        currentUrl: (event.currentUrl as string) || "",
        score: (event.score as number) ?? null,
        error: (event.error as string) ?? null,
      });
      break;

    case "complete":
      if (event.results) {
        dispatch({
          type: "SCAN_COMPLETE",
          result: event.results as unknown as import("@/lib/scan-types").SiteResult,
        });
      }
      break;

    case "error":
      dispatch({
        type: "SCAN_ERROR",
        message: (event.message as string) || "Scan failed.",
      });
      break;

    // "started" event — no state change needed
  }
}
