---
name: bai-aeo-frontend
status: complete
created: 2026-02-10T01:52:46Z
completed: 2026-02-10
progress: 100%
prd: .claude/prds/bai-aeo-frontend.md
github: https://github.com/skgiles07/bai_aeo/issues/1
---

# Epic: bai-aeo-frontend

## Overview
Build a Next.js 15 frontend for the existing BAI AEO Scanner API. The app is a single-page scanner tool: URL input, real-time SSE progress for multi-page scans, and a scored results dashboard with actionable recommendations. Mobile-first for event use. Deployed on Vercel, calling the existing Railway API.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | Client-side scan UI + SSR layout/OG tags | Scan interaction is inherently client-side (SSE, user input). SSR only needed for the shell and OG metadata. |
| Routing | Single route with state-driven views | No need for multiple pages. One route (`/`) with 3 view states: input, scanning, results. Simpler than route-based navigation. |
| API proxy | Next.js rewrite to Railway | Avoid CORS issues and hide backend URL. `next.config.js` rewrites `/api/*` to Railway. |
| SSE handling | Native `EventSource` + `useReducer` | `useReducer` cleanly models the scan state machine (idle → discovering → scanning → complete → error). No libraries needed. |
| Styling | Tailwind CSS only | No component library. Utility-first CSS keeps bundle small and iteration fast. |
| OG images | Static OG image per grade | Pre-generate 5 OG images (A-F grades). Pass grade via query param for shareable URLs. |

## Technical Approach

### Frontend Components
- **`ScanForm`** — URL input, scan type toggle (single/site-wide), submit button with loading state
- **`ScanProgress`** — SSE-driven progress: discovery status, per-page progress bar, live URL + score feed
- **`ScoreGauge`** — Circular or arc gauge showing 0-100 score with letter grade and color
- **`CheckCard`** — Pass/fail card for each of the 5 AEO checks (icon, score, message, expandable details)
- **`RecommendationList`** — Prioritized action items with impact/effort badges
- **`SiteResults`** — Aggregate view for multi-page scans: site issues summary + per-page accordion
- **`Layout`** — BAI branding header, responsive container, footer with links

### State Management
Single `useReducer` with scan state machine:
```
idle → scanning (SSE connected) → complete (results rendered)
                                → error (display message + retry)
```
No global state library. Results held in local state — lost on refresh (acceptable for v1).

### API Integration
- **Single-page scan**: `POST /api/scan` → JSON response → render results
- **Site-wide scan**: `POST /api/scan-site` → SSE stream → progressive UI updates → final aggregate
- Next.js rewrites proxy both to Railway backend, keeping the API URL private

### Infrastructure
- **Vercel**: Free tier, auto-deploy from GitHub repo
- **No database**: Stateless — all results are ephemeral client-side state
- **Shareable URLs**: Encode score + grade + URL in query params (e.g., `/?url=example.com&score=85&grade=B`). Results page re-scans or shows summary.

## Implementation Strategy

**Single linear build — 7 tasks, each deployable:**
1. Scaffold Next.js project with Tailwind and Vercel config
2. Build scan form with API proxy to Railway
3. Build single-page results dashboard (score gauge + check cards + recommendations)
4. Add SSE integration for site-wide scans with progress UI
5. Add site-wide aggregate results view
6. Apply BAI branding, mobile responsive polish, OG tags
7. Deploy to Vercel and smoke test

Each task builds on the previous. The app is functional after task 3 (single-page scans work end-to-end).

## Task Breakdown Preview
- [x] Task 1: Scaffold Next.js 15 project with Tailwind, API proxy rewrite to Railway, Vercel config
- [x] Task 2: Build ScanForm component — URL input, scan type toggle, validation, submit handler
- [x] Task 3: Build single-page results — ScoreGauge, CheckCard (x5), RecommendationList
- [x] Task 4: Add SSE client for site-wide scans — fetch+ReadableStream (not EventSource — POST required)
- [x] Task 5: Build SiteResults aggregate view — site issues summary, per-page accordion drill-down
- [x] Task 6: BAI branding, mobile-first responsive polish, OG meta tags (dynamic @vercel/og), social sharing
- [x] Task 7: Deploy to Vercel, smoke test all scan paths, verify mobile experience

## Dependencies
- **Railway API** must remain live at `mellow-blessing-production-df7c.up.railway.app` (already deployed, health check passing)
- **Birmingham AI brand assets** (logo, colors) — if not available, use placeholder and swap later
- **Vercel account** — free tier, connected to GitHub

## Success Criteria (Technical)
- Single-page scan completes and renders results in < 5 seconds
- Site-wide scan SSE stream displays real-time progress without disconnects
- Lighthouse mobile score > 90 (performance)
- All 5 check cards render correctly for pass and fail states
- Responsive layout works on 375px (iPhone SE) through 1440px (desktop)
- API proxy successfully hides Railway URL from client

## Estimated Effort
- **Total**: 7 tasks, ~4-6 hours of Claude Code implementation time
- **Critical path**: Tasks 1-3 (functional single-page scanner)
- **Stretch**: Shareable URLs with OG images per grade
- **Risk**: SSE through Vercel's edge network — may need to test streaming behavior. Fallback: direct Railway URL with CORS.

## Tasks Created
- [x] #5 - Scaffold Next.js 15 project with Tailwind and API proxy
- [x] #6 - Build ScanForm component with URL input and scan type toggle
- [x] #7 - Build single-page results dashboard
- [x] #8 - Add SSE client for site-wide scans with progress UI (used fetch+ReadableStream, not EventSource)
- [x] #2 - Build site-wide aggregate results view
- [x] #3 - BAI branding, responsive polish, and OG tags (dynamic @vercel/og edge runtime)
- [x] #4 - Deploy to Vercel and smoke test — live at https://bai-aeo.vercel.app

Total tasks: 7
Parallel tasks: 1 (tasks #7 and #8 can run concurrently after #6)
Sequential tasks: 6
Estimated total effort: 10 hours
