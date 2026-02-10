---
name: bai-aeo-frontend
description: Next.js frontend for the Birmingham AI AEO Scanner with real-time scan progress, results dashboard, and Vercel deployment
status: draft
created: 2026-02-10T01:51:10Z
---

# PRD: BAI AEO Scanner Frontend

## Problem Statement
The AEO Scanner API is live on Railway but has no user-facing interface. Attendees of the Birmingham AI Marketing Breakout need a polished, branded web app where they can enter their URL, watch their site get scanned in real time, and receive actionable AEO recommendations — without touching an API client.

## Target Users
- Birmingham AI Marketing Breakout event attendees (primary)
- Local business owners checking their AI search readiness
- Marketing professionals evaluating client sites

## Solution
A Next.js web application deployed on Vercel that provides:
1. A clean scanner input form (enter URL, pick single-page or site-wide scan)
2. Real-time SSE progress UI for multi-page scans (page-by-page updates)
3. A scored results dashboard with pass/fail checks and prioritized recommendations
4. Birmingham AI branding throughout

## Functional Requirements

### FR1: URL Input & Scan Type Selection
- Single URL input field with validation and auto-prepend `https://`
- Toggle between single-page scan and site-wide scan (up to 25 pages)
- "Scan" CTA button with loading state
- Error handling for unreachable sites, timeouts, blocked scans

### FR2: Real-Time Scan Progress (Site-Wide)
- Connect to `/api/scan-site` SSE endpoint on Railway API
- Show discovery phase (sitemap vs link crawling, page count found)
- Per-page progress bar with URL being scanned and individual score
- Graceful handling of aborts, timeouts, and partial results

### FR3: Results Dashboard
- Overall score (0-100) with letter grade (A-F) and color-coded gauge
- 5 check cards: Heading Hierarchy, Meta Description, Schema Markup, FAQ Section, Content Structure
- Each card shows pass/fail, score, and details
- Prioritized recommendations list with impact/effort ratings
- For site-wide scans: aggregate view + per-page drill-down + site-wide issues summary

### FR4: Branding & Polish
- Birmingham AI logo and color scheme
- Responsive design (mobile-first — attendees will scan on phones at the event)
- Social sharing: "I scored X on the BAI AEO Scanner" with OG image
- Footer with Birmingham AI links

### FR5: Share & Export
- Shareable results URL (query param or short ID)
- "Download PDF Report" button (stretch goal)

## Non-Functional Requirements

### Performance
- First Contentful Paint < 1.5s
- SSE connection established within 500ms of scan start
- Results page renders within 200ms of scan completion

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (free tier)
- **API**: Existing Railway backend (`mellow-blessing-production-df7c.up.railway.app`)
- **No database needed** — stateless scans, results rendered client-side

### Browser Support
- Chrome, Safari, Firefox, Edge (latest 2 versions)
- Mobile Safari and Chrome (primary — event use case)

## Out of Scope (v1)
- User accounts or saved scan history
- PDF report generation (stretch)
- Moving the API from Railway to Vercel API routes
- Custom domain (use default Vercel URL for now)

## Success Criteria
- Attendee can scan their site in < 30 seconds (single page) at the event
- Real-time progress updates display without lag or disconnects
- Results are clear enough that a non-technical business owner understands what to fix
- Mobile experience is as good as desktop

## Key Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 | Vercel skills loaded, SSR for OG tags, App Router |
| API location | Keep on Railway | Already deployed and working, avoid migration risk |
| Styling | Tailwind CSS | Fast iteration, responsive-first, no component library overhead |
| State management | React useState/useReducer | Simple enough — no global state needed |
| Database | None | Stateless scans, no persistence needed for v1 |
