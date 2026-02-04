# Birmingham AI AEO Scanner — Product Requirements Document

**Version:** 1.0
**Date:** January 12, 2026
**Author:** Scott + Claude
**Event Date:** January 14, 2026 (48 hours)
**Status:** MVP Build Mode

---

## 1. Product Overview

### What We're Building
A web-based tool that scans any website's homepage and delivers 5 actionable AEO (Answer Engine Optimization) improvements. Attendees at Birmingham AI's 2026 Kickoff enter their URL, wait 15-30 seconds, and receive a personalized report showing how to make their site more likely to be cited by AI systems like ChatGPT, Perplexity, and Google AI Overviews.

### Who It's For
- **Primary:** Marketing professionals attending Birmingham AI Kickoff (300-500 people)
- **Secondary:** Business owners and general attendees curious about AI visibility
- **Tertiary:** Post-event traffic from social sharing

### Success Criteria
| Metric | Target |
|--------|--------|
| Scans completed at event | 50+ |
| Average scan time | <30 seconds |
| Uptime during event (4:30-8:00 PM) | 100% |
| Email capture rate | 20% of scans |
| Zero critical failures | Required |

### What This Is NOT
- A comprehensive SEO audit tool
- A multi-page crawler
- A competitor to Semrush/Ahrefs
- Production-grade enterprise software

---

## 2. User Flow

### Happy Path
```
1. User arrives at scanner URL (e.g., aeo.birminghamai.org)
2. Sees simple interface: headline, URL input, "Scan" button
3. Enters their website URL (e.g., "acmeplumbing.com")
4. Clicks "Scan My Site"
5. Sees loading state with progress indicators (15-30 sec)
6. Results appear: Overall score + 5 specific recommendations
7. Optional: Clicks "Email me these results" → enters email → receives PDF/email
8. Shares results or scans another site
```

### Error States
| Scenario | User Sees |
|----------|-----------|
| Invalid URL format | "Please enter a valid website URL (e.g., example.com)" |
| Site unreachable/timeout | "We couldn't reach that website. Check the URL and try again." |
| Site blocks crawling | "This site blocks automated scanning. Try a different URL." |
| Server error | "Something went wrong on our end. Please try again." |
| Rate limited | "High demand! Please wait 30 seconds and try again." |

---

## 3. Technical Architecture

### System Overview
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Lovable        │────▶│  Backend API    │────▶│  Target         │
│  Frontend       │     │  (Claude Code)  │     │  Website        │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Supabase       │
                        │  (Optional)     │
                        │  - Email logs   │
                        │  - Scan history │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Resend         │
                        │  (Email)        │
                        └─────────────────┘
```

### Backend API (Claude Code)

**Tech Stack:**
- Runtime: Node.js or Python (Claude Code default)
- Framework: Express.js or FastAPI
- HTML Fetching: Axios + Cheerio (Node) or Requests + BeautifulSoup (Python)
- Hosting: Railway, Render, or Vercel Functions

**Endpoints:**

```
POST /api/scan
  Request:  { "url": "https://example.com" }
  Response: {
    "success": true,
    "url": "https://example.com",
    "scannedAt": "2026-01-14T17:30:00Z",
    "overallScore": 62,
    "scoreGrade": "C+",
    "checks": [...],
    "recommendations": [...]
  }

POST /api/email-results
  Request:  { "email": "user@example.com", "scanId": "abc123" }
  Response: { "success": true, "message": "Results sent!" }
```

### Frontend (Lovable)

**Pages:**
1. **Home/Scanner** — URL input, scan button, results display
2. **About** (optional) — What is AEO, Birmingham AI branding

**Components:**
- URL input with validation
- Scan button with loading state
- Progress indicator (fake or real)
- Results card with score visualization
- 5 recommendation cards (expandable)
- Email capture modal
- Error toast notifications

**Styling:**
- Birmingham AI brand colors (if available)
- Clean, modern, mobile-responsive
- Large touch targets for event use
- High contrast for projector visibility

### Database (Supabase — Optional)

**Tables:**
```sql
-- Only needed for email feature
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id),
  email TEXT NOT NULL,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. AEO Scan Logic

### Checks to Implement (Priority Order)

#### P0 — Must Have (Core 5 Recommendations)

| # | Check | What We Scan | Pass Criteria | Recommendation If Fail |
|---|-------|--------------|---------------|----------------------|
| 1 | **Heading Hierarchy** | Count H1s, check sequence | Exactly 1 H1, no skipped levels | "Fix your heading structure: Use exactly one H1, then H2s for sections. This improves AI citation by 2.8x." |
| 2 | **Meta Description** | `<meta name="description">` | Present, 120-160 chars | "Add a meta description summarizing your page in 150 characters. AI systems use this for context." |
| 3 | **Schema Markup** | JSON-LD in page source | Any valid schema present | "Add structured data (JSON-LD) to help AI understand your content. Start with Organization or LocalBusiness schema." |
| 4 | **FAQ Section** | Look for FAQ patterns, FAQPage schema | FAQ content or schema detected | "Add an FAQ section with 5-7 common questions. Use FAQPage schema. This doubles AI citation rates." |
| 5 | **Content Structure** | Lists, tables, content length | Has lists OR tables, 300+ words | "Add structured content like bullet lists or comparison tables. 78% of AI Overviews contain lists." |

#### P1 — Should Have (Enhanced Scoring)

| # | Check | What We Scan | Pass Criteria |
|---|-------|--------------|---------------|
| 6 | **Page Title** | `<title>` tag | Present, 50-60 chars, descriptive |
| 7 | **HTTPS** | URL protocol | Uses HTTPS |
| 8 | **Mobile Viewport** | `<meta name="viewport">` | Present and properly configured |
| 9 | **Open Graph Tags** | og:title, og:description, og:image | At least og:title present |
| 10 | **Robots.txt AI Access** | Fetch /robots.txt | Doesn't block GPTBot/ClaudeBot |

#### P2 — Nice to Have (If Time Permits)

| # | Check | What We Scan |
|---|-------|--------------|
| 11 | **Author Attribution** | Byline patterns, Person schema |
| 12 | **Date Visibility** | datePublished, dateModified schema |
| 13 | **Internal Links** | Link count and structure |
| 14 | **Image Alt Text** | Alt attributes on images |
| 15 | **Page Speed** | Basic TTFB check |

### Scoring Algorithm

```javascript
// Each check contributes to overall score
const weights = {
  headingHierarchy: 25,    // Most impactful
  metaDescription: 15,
  schemaMarkup: 20,
  faqSection: 20,
  contentStructure: 20
};

// Score calculation
let score = 0;
if (checks.headingHierarchy.pass) score += weights.headingHierarchy;
if (checks.metaDescription.pass) score += weights.metaDescription;
// ... etc

// Grade mapping
const grade = 
  score >= 90 ? 'A' :
  score >= 80 ? 'B' :
  score >= 70 ? 'C' :
  score >= 60 ? 'D' : 'F';
```

### Recommendation Priority Logic

Always show exactly 5 recommendations, prioritized by:
1. **Failed checks first** (things they need to fix)
2. **Highest impact first** (heading hierarchy > meta description)
3. **If all pass**, show optimization tips for each

---

## 5. MVP Scope Definition

### IN Scope (Must ship by Tuesday 4 PM)
- [x] Single-page scanner UI
- [x] URL input with basic validation
- [x] Backend API that fetches and parses homepage HTML
- [x] 5 core checks (heading, meta, schema, FAQ, content structure)
- [x] Overall score with letter grade
- [x] 5 actionable recommendations with explanations
- [x] Mobile-responsive design
- [x] Error handling for common failures
- [x] Loading states

### OUT of Scope (Cut for MVP)
- ⏳ Multi-page crawling — **Planned for Phase 2**
- ❌ PDF report generation
- ❌ User accounts/authentication
- ❌ Historical scan comparison
- ❌ Competitor analysis
- ⏳ Full robots.txt parsing — **Planned for Phase 2**
- ❌ Page speed testing (requires external API)
- ❌ Backlink analysis

### STRETCH Goals (If time permits)
- [ ] Email results feature (Supabase + Resend)
- [ ] P1 checks (title, HTTPS, viewport, OG tags, robots.txt)
- [ ] "Share results" social buttons
- [ ] Birmingham AI branding/logo
- [ ] Scan history (local storage)

---

## 6. Risk Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sites block scraping | High | Medium | Graceful error message, suggest trying different URL |
| Slow scan times | Medium | High | Timeout at 30s, show partial results if possible |
| Backend crashes at event | Low | Critical | Test with 20+ concurrent scans, have restart procedure ready |
| Lovable build issues | Medium | High | Have fallback to basic HTML/CSS if needed |
| API rate limits | Low | Medium | Implement basic rate limiting (1 scan per IP per 10s) |

### Contingency Plan

**If scanner isn't stable by Tuesday 6 PM:**
1. Deploy the AEO Analysis GPT as primary experience
2. Create simple landing page linking to GPT
3. Print QR codes for GPT access
4. Scanner becomes "coming soon" follow-up

**GPT Fallback Setup:**
- URL: [Your existing AEO GPT link]
- Backup: Create "Marketing Advisor Council" multi-GPT experience
- Materials needed: QR code printouts, simple instructions poster

---

## 7. Build Timeline

### Day 1: Sunday January 12 (Today)

| Time | Task | Deliverable |
|------|------|-------------|
| Now | ✅ PRD Complete | This document |
| +1 hr | Backend scaffold | Express/FastAPI app with /health endpoint |
| +2 hr | HTML fetching | Function that gets page HTML given URL |
| +3 hr | Core checks 1-3 | Heading, meta description, schema detection |
| +4 hr | Core checks 4-5 | FAQ detection, content structure analysis |
| +5 hr | API endpoint | POST /api/scan returns full results |
| EOD | **Milestone** | Backend API working locally |

### Day 2: Monday January 13

| Time | Task | Deliverable |
|------|------|-------------|
| Morning | Deploy backend | Live API on Railway/Render |
| +2 hr | Lovable frontend | Basic UI with URL input |
| +3 hr | Connect frontend to API | Scan flow working end-to-end |
| +4 hr | Results display | Score + recommendations rendering |
| +5 hr | Polish & error handling | Loading states, error messages |
| +6 hr | Mobile testing | Works on phone browsers |
| Evening | **Milestone** | Full flow working on deployed URL |

### Day 3: Tuesday January 14 (Event Day)

| Time | Task | Deliverable |
|------|------|-------------|
| 9 AM | Stress testing | 20+ concurrent scan test |
| 10 AM | Bug fixes | Address any issues found |
| 12 PM | Stretch features | Email capture if stable |
| 2 PM | **CODE FREEZE** | No more changes |
| 3 PM | Final testing | Full walkthrough on event WiFi |
| 4 PM | Backup ready | GPT fallback QR codes printed |
| 4:30 PM | **EVENT STARTS** | Scanner live! |

---

## 8. Phase 2: Multi-Page Scanning

### Overview
Phase 2 expands the scanner from homepage-only analysis to full website scanning, crawling all accessible pages to provide a comprehensive AEO audit.

### Key Changes from Phase 1

| Aspect | Phase 1 (MVP) | Phase 2 |
|--------|---------------|---------|
| Pages scanned | Homepage only | All crawlable pages |
| Scan time | 15-30 seconds | 1-5 minutes (depending on site size) |
| Results | Single page score | Site-wide score + per-page breakdown |
| Recommendations | 5 recommendations | Prioritized list across all pages |

### Technical Requirements

#### Crawler Implementation
```
1. Start at homepage URL
2. Extract all internal links from page
3. Filter to same-domain links only
4. Queue unique URLs for scanning
5. Respect robots.txt directives
6. Implement crawl depth limit (default: 3 levels)
7. Implement page limit (default: 50 pages max)
8. Handle rate limiting (1 request per second)
```

#### New API Endpoints
```
POST /api/scan-site
  Request:  {
    "url": "https://example.com",
    "options": {
      "maxPages": 50,
      "maxDepth": 3,
      "respectRobotsTxt": true
    }
  }
  Response: {
    "success": true,
    "url": "https://example.com",
    "scannedAt": "2026-01-20T10:00:00Z",
    "pagesScanned": 23,
    "siteScore": 58,
    "siteGrade": "D+",
    "pageResults": [...],
    "aggregatedChecks": {...},
    "prioritizedRecommendations": [...]
  }

GET /api/scan-status/:scanId
  Response: {
    "status": "in_progress",
    "pagesScanned": 12,
    "pagesQueued": 35,
    "estimatedTimeRemaining": 45
  }
```

#### Aggregated Scoring
```javascript
// Site-wide score = weighted average of all page scores
const siteScore = pages.reduce((sum, page) => {
  const weight = page.isHomepage ? 2.0 : 1.0; // Homepage weighted 2x
  return sum + (page.score * weight);
}, 0) / totalWeight;

// Identify site-wide issues
const siteWideIssues = {
  pagesWithoutMeta: pages.filter(p => !p.checks.metaDescription.pass),
  pagesWithBadHeadings: pages.filter(p => !p.checks.headingHierarchy.pass),
  pagesWithoutSchema: pages.filter(p => !p.checks.schemaMarkup.pass),
  // ... etc
};
```

### New Features

#### 1. Site Map Discovery
- Parse sitemap.xml if available
- Use sitemap URLs to prioritize crawling
- Fall back to link-following if no sitemap

#### 2. Page Type Detection
- Identify page types: homepage, about, services, blog, contact, product, etc.
- Apply type-specific scoring weights
- Provide type-specific recommendations

#### 3. Progress Tracking
- Real-time scan progress via WebSocket or polling
- Show pages discovered vs. pages scanned
- Allow user to cancel long-running scans

#### 4. Results Dashboard
- Site-wide score overview
- Per-page breakdown table (sortable by score)
- Filter by issue type
- Export full report (CSV/PDF)

### UI Changes

#### Scan Options Panel
```
┌─────────────────────────────────────────┐
│ Scan Options                            │
├─────────────────────────────────────────┤
│ ○ Quick Scan (homepage only)            │
│ ● Full Site Scan                        │
│                                         │
│   Max pages: [50 ▼]                     │
│   Max depth: [3 ▼]                      │
│   □ Include blog posts                  │
│   ☑ Respect robots.txt                  │
└─────────────────────────────────────────┘
```

#### Progress Display
```
┌─────────────────────────────────────────┐
│ Scanning example.com...                 │
│                                         │
│ ████████████░░░░░░░░ 45%               │
│                                         │
│ Pages scanned: 23 / 50                  │
│ Current: /services/plumbing             │
│ Issues found: 12                        │
│                                         │
│ [Cancel Scan]                           │
└─────────────────────────────────────────┘
```

### Performance Considerations

| Constraint | Limit | Rationale |
|------------|-------|-----------|
| Max pages per scan | 50 | Keep scan time reasonable |
| Max crawl depth | 3 levels | Avoid deep archive pages |
| Request rate | 1/second | Be respectful to target servers |
| Scan timeout | 5 minutes | Prevent runaway scans |
| Concurrent scans per user | 1 | Prevent abuse |

### Database Updates

```sql
-- Updated scans table for multi-page
ALTER TABLE scans ADD COLUMN scan_type TEXT DEFAULT 'single'; -- 'single' or 'full'
ALTER TABLE scans ADD COLUMN pages_scanned INTEGER DEFAULT 1;
ALTER TABLE scans ADD COLUMN site_score INTEGER;

-- New table for per-page results
CREATE TABLE page_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_type TEXT,
  score INTEGER,
  checks JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_page_results_scan_id ON page_results(scan_id);
```

### Phase 2 Timeline (Estimated)

| Week | Task |
|------|------|
| 1 | Implement crawler with depth/page limits |
| 1 | Add sitemap.xml parsing |
| 2 | Build aggregated scoring logic |
| 2 | Create scan progress API |
| 3 | Update frontend with scan options |
| 3 | Build results dashboard |
| 4 | Testing and optimization |
| 4 | Deploy and monitor |

---

## 9. Future Roadmap (Post Phase 2)

Additional features for future phases:

1. **PDF reports** — Branded downloadable reports
2. **Email sequences** — Nurture leads with AEO tips
3. **Competitive benchmarking** — Compare to industry averages
4. **Tracking improvements** — Re-scan and show progress over time
5. **White-label version** — For agencies to use with clients
6. **Scheduled scans** — Automated weekly/monthly monitoring
7. **API access** — Allow developers to integrate scanning

---

## 10. Open Questions

1. **Domain:** What URL will this live at? (aeo.birminghamai.org? scanner.birminghamai.org?)
2. **Branding:** Do you have Birmingham AI logos/colors to use?
3. **Analytics:** Want to add Plausible/GA4 for scan tracking?
4. **WiFi:** What's the event WiFi situation? Need offline fallback?

---

## Appendix A: Sample API Response

```json
{
  "success": true,
  "url": "https://acmeplumbing.com",
  "scannedAt": "2026-01-14T17:32:15Z",
  "overallScore": 45,
  "scoreGrade": "D",
  "checks": {
    "headingHierarchy": {
      "pass": false,
      "score": 0,
      "maxScore": 25,
      "details": {
        "h1Count": 3,
        "hasSkippedLevels": true,
        "headings": ["H1", "H1", "H3", "H1", "H2"]
      },
      "message": "Found 3 H1 tags (should be 1) and skipped heading levels"
    },
    "metaDescription": {
      "pass": true,
      "score": 15,
      "maxScore": 15,
      "details": {
        "exists": true,
        "length": 142,
        "content": "Acme Plumbing provides 24/7 emergency plumbing services in Birmingham, AL. Licensed, insured, and trusted since 1985."
      },
      "message": "Meta description present and good length (142 chars)"
    },
    "schemaMarkup": {
      "pass": false,
      "score": 0,
      "maxScore": 20,
      "details": {
        "hasJsonLd": false,
        "hasMicrodata": false,
        "schemas": []
      },
      "message": "No structured data (JSON-LD or microdata) detected"
    },
    "faqSection": {
      "pass": false,
      "score": 0,
      "maxScore": 20,
      "details": {
        "hasFaqSchema": false,
        "hasFaqContent": false,
        "questionCount": 0
      },
      "message": "No FAQ section or FAQPage schema found"
    },
    "contentStructure": {
      "pass": true,
      "score": 20,
      "maxScore": 20,
      "details": {
        "hasLists": true,
        "listCount": 4,
        "hasTables": false,
        "wordCount": 487
      },
      "message": "Good content structure with 4 lists and 487 words"
    }
  },
  "recommendations": [
    {
      "priority": 1,
      "title": "Fix Your Heading Structure",
      "impact": "High",
      "effort": "Low",
      "summary": "You have 3 H1 tags — AI systems expect exactly one.",
      "details": "Use a single H1 for your main topic ('Birmingham's Trusted Plumbers'), then H2s for major sections like 'Our Services' and 'Service Areas'. This single change improves AI citation likelihood by 2.8x.",
      "learnMoreUrl": "https://birminghamai.org/aeo-guide#headings"
    },
    {
      "priority": 2,
      "title": "Add Structured Data (Schema Markup)",
      "impact": "High",
      "effort": "Medium",
      "summary": "No JSON-LD schema detected on your page.",
      "details": "Add LocalBusiness schema with your name, address, phone, hours, and services. This helps AI systems understand and cite your business information accurately. Pages with schema are cited 30-36% more often.",
      "learnMoreUrl": "https://birminghamai.org/aeo-guide#schema"
    },
    {
      "priority": 3,
      "title": "Add an FAQ Section",
      "impact": "High",
      "effort": "Medium",
      "summary": "No FAQ content or FAQPage schema found.",
      "details": "Add a section answering 5-7 common questions like 'What areas do you serve?' and 'Do you offer emergency service?' Use FAQPage schema markup. This doubles your likelihood of AI citation.",
      "learnMoreUrl": "https://birminghamai.org/aeo-guide#faq"
    },
    {
      "priority": 4,
      "title": "Keep Your Meta Description Strong",
      "impact": "Maintaining",
      "effort": "None",
      "summary": "Your meta description is well-optimized at 142 characters.",
      "details": "Your current meta description effectively summarizes your services and location. Consider A/B testing variations that include your unique value proposition or a call-to-action.",
      "learnMoreUrl": "https://birminghamai.org/aeo-guide#meta"
    },
    {
      "priority": 5,
      "title": "Maintain Good Content Structure",
      "impact": "Maintaining",
      "effort": "None",
      "summary": "Your page has 4 lists and 487 words of content.",
      "details": "Your content structure is solid. Consider adding a comparison table (e.g., 'Our Services vs. DIY') to further improve AI extractability — 78% of AI Overviews contain lists or tables.",
      "learnMoreUrl": "https://birminghamai.org/aeo-guide#content"
    }
  ]
}
```

---

## Appendix B: Tech Stack Quick Reference

| Component | Technology | Why |
|-----------|------------|-----|
| Backend Runtime | Node.js 20 | Claude Code default, fast startup |
| Backend Framework | Express.js | Simple, well-documented |
| HTML Parsing | Cheerio | jQuery-like, fast, no browser needed |
| HTTP Client | Axios | Reliable, timeout handling |
| Frontend | Lovable | Rapid UI development |
| Hosting (Backend) | Railway | Free tier, easy deploy |
| Hosting (Frontend) | Lovable/Vercel | Auto-deploy from Lovable |
| Database (Optional) | Supabase | Free tier, Postgres, easy auth |
| Email (Optional) | Resend | Free tier, simple API |

---

*Document complete. Ready to build.*
