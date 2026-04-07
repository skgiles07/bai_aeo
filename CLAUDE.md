# BAI AEO Scanner

## Overview
AEO (Answer Engine Optimization) scanner for Birmingham AI. Scans websites for AI search readiness and provides actionable recommendations. Full-stack: Next.js frontend on Vercel + Express API on Railway.

## Status
- **Phase:** Live + Agent Review Improvements Deployed
- **Priority:** High
- **Live URL:** https://bai-aeo.vercel.app
- **Repo:** https://github.com/skgiles07/bai_aeo

## Tech Stack
- **Frontend:** Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript
- **Backend:** Node.js/Express + Cheerio (HTML analysis)
- **Hosting:** Vercel (frontend) + Railway (API)
- **Analytics:** @vercel/analytics with custom scan events
- **OG Images:** @vercel/og (edge runtime)

## Architecture
- Single-page app with useReducer state machine (idle → scanning → complete | error)
- API proxy via next.config.ts rewrites (hides Railway URL)
- SSE site scanning via fetch + ReadableStream (not EventSource — POST required)
- Brand colors: navy (#0f172a), blue (#2563eb)

## Key Files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Main page — state machine, scan flow, results rendering |
| `app/layout.tsx` | Root layout, header/footer, meta tags, JSON-LD, Analytics |
| `app/api/og/route.tsx` | Dynamic OG image (edge runtime) |
| `app/globals.css` | Tailwind theme + brand colors + animations |
| `lib/scan-types.ts` | TypeScript types + scanReducer state machine |
| `lib/constants.ts` | Shared CHECK_LABELS constant |
| `hooks/useSiteScan.ts` | SSE hook for site-wide scanning |
| `components/ScanForm.tsx` | URL input + mode toggle |
| `components/ScoreGauge.tsx` | SVG arc gauge + share buttons + methodology |
| `components/CheckCard.tsx` | Expandable pass/fail check cards |
| `components/RecommendationList.tsx` | Prioritized recommendations with impact badges |
| `components/ScanProgress.tsx` | Real-time progress bar + page feed |
| `components/SiteResults.tsx` | Aggregate site results + stats bar |
| `components/PageAccordion.tsx` | Per-page drill-down accordion |
| `next.config.ts` | API proxy rewrites to Railway |
| `bai_aeo-claude-build-aeo-scanner-api-P7UL1/` | API codebase (gitignored, deployed on Railway) |
| `agent-review-findings.md` | 4-agent review findings (Brand, UI, UX, Growth) |

## API Endpoints (proxied via /api/*)
- `GET /health` — Health check
- `POST /api/scan` — Single page scan (returns JSON)
- `POST /api/scan-site` — Multi-page SSE scan (returns SSE stream)

## Railway Backend
- **URL:** https://mellow-blessing-production-df7c.up.railway.app
- **Code:** `bai_aeo-claude-build-aeo-scanner-api-P7UL1/server.js` (~970 lines)
- **Checks:** headingHierarchy, metaDescription, schemaMarkup, faqSection, contentStructure

## Agent Review (Feb 9, 2026)
4 agents reviewed the live site: Brand Guardian (68/100), UI Designer, UX Researcher, Growth Hacker.

See `agent-review-findings.md` for full findings with completion status on each item.

**Future improvements (parked):**
- Email capture on results page (HubSpot integration)
- Shareable permalink URLs for scan results
- Scan counter as social proof
- Below-the-fold SEO content + FAQ section
- "AEO Certified" badge for high scorers
- Dynamic OG images per scan showing actual score
- Competitor comparison feature

## Planning Docs
- **PRD:** `.claude/prds/bai-aeo-frontend.md` — product requirements (status: complete)
- **Epic:** `.claude/epics/bai-aeo-frontend/epic.md` — 7-task build plan (status: complete, all tasks closed)
- **Scanner PRD:** `bai_aeo-claude-build-aeo-scanner-api-P7UL1/.claude/projects/bai-aeo-scanner/bai-aeo-scanner-prd.md` — original full PRD (archived, Lovable references are obsolete)

## GoldLeaf AEO Playbook (Feb 10, 2026)
Client deliverable: full AEO audit + playbook for goldleafpackaging.com.

**Reports directory:** `reports/`
| File | Purpose |
|------|---------|
| `goldleaf-packaging-full-aeo-playbook.html` | Source HTML (GoldLeaf branded, editable) |
| `goldleaf-packaging-full-aeo-playbook-v3.pdf` | Final PDF deliverable (15 pages, 1.1 MB) |
| `goldleaf-packaging-full-site-audit.md` | Full 55-page audit data (markdown) |
| `goldleaf-logo-black.png` | Logo from Reference Files (used in cover) |

**Scan results:**
- 55/55 sitemap pages scanned — 0 failures
- Average score: 46/100 (Grade F), 14/55 passing (25%)
- Schema markup: 0/55 (0%) — #1 fix
- FAQ sections: 11/55 (20%), Content structure: 17/55 (31%)
- 3 blog posts at 80/100 (best on site, need only schema to hit 100)
- Raw JSONL: `/tmp/goldleaf-scan-results.jsonl`

**Batch scanning pattern:**
- Single-page API: `POST /api/scan` with `{"url": "..."}` → returns `overallScore` (not `score`)
- Batch: loop through URLs with curl, 0.3s delay, parse with python3
- Site-scan SSE endpoint has 25-page limit; batch individual scans for full site

**PDF generation:**
- Chrome headless: `--headless --print-to-pdf --no-pdf-header-footer`
- Logo caveat: Webflow CDN logos (.avif) contain hidden white text (address, email, phone) that renders in PDF — use local PNG logos from `GoldLeaf-Landing-Page/Reference Files/GoldLeaf-Logos/` instead
- CSS print tips: avoid `min-height: 100vh` (use padding), remove `page-break-inside: avoid` on cards to prevent sparse pages, remove forced page breaks for tighter layout

**Playbook agent reviews:**
- Round 1 (v1): 78/100 avg — added exec summary, SCQA flow, tier rationale, roadmap intro
- Round 2 (v2): 83/100 avg — added risk section, date-anchored roadmap, decision options A/B, business impact, hours fix
- Key learning: footer contact info (address/phone/email) in plain HTML ≠ schema markup (JSON-LD). Scanner checks for `<script type="application/ld+json">` tags only.

**GoldLeaf brand (from website CSS + Reference Files):**
- Colors: #0c0c0c (black), #e8c345/#ffd400 (gold), #fbfbfb (off-white)
- Fonts: Montserrat (headings), Vollkorn (accent), Open Sans (body)
- Logo files: `~/Projects/GoldLeaf-Landing-Page/Reference Files/GoldLeaf-Logos/`
- HubSpot header logo: `https://24248957.fs1.hubspotusercontent-na1.net/hubfs/24248957/220908_GoldLeafBranding-13.png`

## Deployment
- Push to `main` → Vercel auto-deploys
- Vercel CLI auth doesn't work — use Dashboard import
- No env vars needed in Vercel (API proxy configured in next.config.ts)
- `.env.local` has NEXT_PUBLIC_API_URL but it's only used for local dev reference
