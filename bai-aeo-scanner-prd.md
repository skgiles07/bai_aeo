# Birmingham AI AEO Scanner — Product Requirements Document

**Version:** 1.1
**Date:** January 13, 2026
**Author:** Scott + Claude
**Event Date:** January 14, 2026 (~30 hours)
**Status:** Backend ✅ Complete | Frontend 🚧 In Progress

**Deployed API:** https://baiaeo-production.up.railway.app

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

### Backend API (✅ DEPLOYED)

**Live URL:** https://baiaeo-production.up.railway.app

**Tech Stack:**
- Runtime: Node.js 20
- Framework: Express.js
- HTML Fetching: Axios + Cheerio
- Hosting: Railway (auto-deploys from GitHub)

**Endpoints:**

```
GET /health
  Response: { "status": "ok" }
  Status: ✅ Live and tested

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
  Status: ✅ Live and tested

POST /api/email-results (STRETCH GOAL)
  Request:  { "email": "user@example.com", "scanId": "abc123" }
  Response: { "success": true, "message": "Results sent!" }
  Status: ⏸️ Not implemented yet
```

### Frontend (🚧 TO BUILD - Lovable)

**Platform:** Lovable.dev (AI-powered frontend builder)
**Deployment:** Auto-deploys to Vercel
**Build Time:** ~5-10 minutes
**URL:** https://lovable.dev

**Brand Identity:**
- Dark mode design with teal-to-purple gradient aesthetic
- Colors: Teal #00D9D9 → Cyan #14B8A6 → Purple #6B5CFF → Violet #8B5CF6
- Background: Dark slate #0F172A
- Fonts: Futura Medium (headings), Avenir LT Std 45 Book (body), Shapiro 75 Heavy Wide (logo)
- Style: Modern, tech-forward "AI energy" with aurora/gradient effects

**Pages:**
1. **Home/Scanner** — URL input, scan button, results display
2. **About** (optional) — What is AEO, Birmingham AI branding

**Components:**
- URL input with gradient focus ring
- Gradient scan button with loading state
- Circular progress indicator (teal-to-purple gradient stroke)
- Results card with glass-morphism effect
- 5 check cards with gradient borders
- 5 recommendation cards (expandable) with impact badges
- Loading spinner with gradient animation
- Error toast notifications

**Styling:**
- Dark background with vibrant gradient accents
- Glass-morphism cards with subtle shadows
- Mobile-responsive design
- Large touch targets for event use
- High contrast white text for projector visibility
- Smooth animations and transitions

**Complete Lovable Prompt:**
See Appendix C below for the full prompt to paste into Lovable.

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

### Scoring Algorithm (✅ IMPLEMENTED)

```javascript
// Each check worth 20 points (total = 100)
const weights = {
  headingHierarchy: 20,
  metaDescription: 20,
  schemaMarkup: 20,
  faqSection: 20,
  contentStructure: 20
};

// Score calculation - sum of all passing checks
let score = 0;
if (checks.headingHierarchy.pass) score += 20;
if (checks.metaDescription.pass) score += 20;
if (checks.schemaMarkup.pass) score += 20;
if (checks.faqSection.pass) score += 20;
if (checks.contentStructure.pass) score += 20;

// Grade mapping (0-100 scale)
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
- ❌ Multi-page crawling
- ❌ PDF report generation
- ❌ User accounts/authentication
- ❌ Historical scan comparison
- ❌ Competitor analysis
- ❌ Full robots.txt parsing
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

### Day 1: Sunday January 12 ✅ COMPLETE

| Time | Task | Deliverable |
|------|------|-------------|
| Now | ✅ PRD Complete | This document |
| +1 hr | ✅ Backend scaffold | Express app with /health endpoint |
| +2 hr | ✅ HTML fetching | Axios + Cheerio implementation |
| +3 hr | ✅ Core checks 1-3 | Heading, meta description, schema detection |
| +4 hr | ✅ Core checks 4-5 | FAQ detection, content structure analysis |
| +5 hr | ✅ API endpoint | POST /api/scan returns full results |
| EOD | ✅ **Milestone** | Backend API working locally |

### Day 2: Monday January 13 (Today - In Progress)

| Time | Task | Deliverable | Status |
|------|------|-------------|--------|
| Morning | ✅ Deploy backend | Live API on Railway | **DONE** |
| Afternoon | 🚧 Lovable frontend | Basic UI with URL input | **IN PROGRESS** |
| +2 hr | ⏸️ Connect frontend to API | Scan flow working end-to-end | Pending |
| +3 hr | ⏸️ Results display | Score + recommendations rendering | Pending |
| +4 hr | ⏸️ Polish & error handling | Loading states, error messages | Pending |
| +5 hr | ⏸️ Mobile testing | Works on phone browsers | Pending |
| Evening | ⏸️ **Milestone** | Full flow working on deployed URL | Target |

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

## 8. Deployment Information

### Backend Deployment (✅ Complete)

**URL:** https://baiaeo-production.up.railway.app
**Platform:** Railway
**Branch:** `claude/build-aeo-scanner-api-P7UL1`
**Auto-deploy:** Enabled (pushes trigger new deployments)

**Test Commands:**
```bash
# Health check
curl https://baiaeo-production.up.railway.app/health

# Full scan
curl -X POST https://baiaeo-production.up.railway.app/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Frontend Deployment (🚧 Next Step)

**Platform:** Lovable.dev → Vercel
**API Integration:** Connect to https://baiaeo-production.up.railway.app

**Lovable Build Prompt:**
See Section 9 below for the complete Lovable prompt.

---

## 9. Post-MVP Roadmap (After Event)

If the scanner is successful, future iterations could include:

1. **Multi-page analysis** — Crawl 5-10 pages for comprehensive audit
2. **PDF reports** — Branded downloadable reports
3. **Email sequences** — Nurture leads with AEO tips
4. **Competitive benchmarking** — Compare to industry averages
5. **Tracking improvements** — Re-scan and show progress
6. **White-label version** — For agencies to use with clients

---

## 9. Open Questions

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

## Appendix C: Complete Lovable Prompt

Copy and paste this entire prompt into Lovable.dev to build the frontend:

```
Build a single-page AEO (Answer Engine Optimization) Scanner web application for Birmingham AI's 2026 Kickoff event.

BRAND IDENTITY:
- Use Birmingham AI's signature teal-to-purple gradient aesthetic
- Dark mode design (dark slate/charcoal background #0F172A)
- Gradient colors: Teal #00D9D9 → Cyan #14B8A6 → Purple #6B5CFF → Violet #8B5CF6
- Typography:
  * Headlines: Futura Medium or Shapiro 75 Heavy Wide
  * Body: Avenir LT Std 45 Book (fallback: system sans-serif)
  * Logo text: Shapiro 75 Heavy Wide
- Style: Modern, tech-forward, "AI energy" aesthetic with aurora/gradient effects

DESIGN REQUIREMENTS:
- Dark background with vibrant gradient accents
- Mobile-responsive (event attendees on phones)
- Large, clear touch targets
- High contrast white text on dark bg for projector visibility
- Smooth gradient animations
- Glass-morphism cards with subtle shadows
- Glowing effects on interactive elements

PAGE STRUCTURE:

1. HERO SECTION
   - Background: Dark with animated teal-to-purple gradient overlay
   - Logo: "BIRMINGHAM AI" in Shapiro 75 Heavy Wide (top left)
   - Headline: "Is Your Website Visible to AI?" (large, Futura Medium, white)
   - Subheadline: "Get your free AEO score in 30 seconds" (Avenir, gray-300)
   - URL input field with gradient border on focus
   - Large gradient button "Scan My Site" (teal-to-purple gradient background)
   - Small text: "Powered by Birmingham AI" with subtle glow

2. RESULTS SECTION (shown after scan)
   - Large circular progress indicator with gradient stroke (teal-to-purple)
   - Overall score 0-100 in center (white, Futura Medium, 72px)
   - Letter grade badge (A-F) with gradient background
   - Scanned URL and timestamp (gray-400, Avenir)
   - 5 check result cards in grid layout:
     * Dark glass-morphism background
     * Gradient left border (green=pass, red=fail)
     * Pass/Fail icon with glow effect
     * Check name (Futura Medium)
     * Score and details (Avenir)
     * Cards: Heading Hierarchy, Meta Description, Schema Markup, FAQ Section, Content Structure

3. RECOMMENDATIONS SECTION
   - Section title: "Your Personalized Recommendations" (Futura Medium, gradient text)
   - 5 expandable recommendation cards
   - Each card:
     * Priority number in gradient circle
     * Title (Futura Medium)
     * Impact badge: High (red glow), Medium (orange glow), Maintaining (green glow)
     * Effort level tag
     * Summary text (Avenir, white)
     * Expandable details section
     * Gradient accent on hover

4. LOADING STATE
   - Animated gradient spinner (teal-to-purple rotation)
   - "Scanning your website..." (Futura Medium)
   - "This usually takes 15-30 seconds" (Avenir, gray-400)
   - Progress bar with gradient fill

5. ERROR HANDLING
   - Toast notifications with gradient left border
   - Clear error messages (Avenir)
   - "Try Again" button with gradient hover effect

API INTEGRATION:
- Base URL: https://baiaeo-production.up.railway.app
- GET /health endpoint
- POST /api/scan with body: {"url": "https://example.com"}

FUNCTIONALITY:
- Auto-add https:// to URLs if missing
- Disable scan button during loading
- Smooth fade-in for results section
- Scroll to results after scan
- "Scan Another Site" button to reset
- Gradient button hover effects

COMPONENTS:
- URLInput with gradient focus ring
- CircularScore with gradient stroke animation
- CheckCard with glass-morphism
- RecommendationCard (expandable) with gradient accents
- GradientButton component
- LoadingSpinner with gradient animation
- ErrorToast with gradient border

STYLING:
- Tailwind CSS + custom gradient utilities
- Dark theme (#0F172A background)
- Gradient text effects for headings
- Glass-morphism cards (backdrop-blur)
- Subtle glow effects on hover
- Smooth transitions (300ms ease)
- Mobile-first responsive

COLOR PALETTE:
- Background: #0F172A (slate-900)
- Text primary: #FFFFFF
- Text secondary: #94A3B8 (slate-400)
- Gradient start: #00D9D9 (teal)
- Gradient mid: #14B8A6 (cyan)
- Gradient end: #8B5CF6 (purple)
- Success: #10B981 (emerald-500)
- Warning: #F59E0B (amber-500)
- Error: #EF4444 (red-500)

MUST HAVE:
- Birmingham AI logo in header
- Gradient backgrounds throughout
- Dark mode aesthetic matching brand kit
- Professional, event-ready polish
- Fast performance for 300+ attendees

Make it stunning, on-brand, and production-ready for tomorrow night's event!
```

---

## Appendix D: Lovable Quick Start Guide

1. Go to https://lovable.dev
2. Sign in with GitHub
3. Click "New Project"
4. Paste the prompt from Appendix C above
5. Wait 2-3 minutes for Lovable to build
6. Test in the live preview
7. Type "Deploy this to production" in chat
8. Get your live URL from Vercel

Common commands while building:
- "Make the headline larger"
- "Add more spacing between cards"
- "Fix the mobile layout"
- "Make the gradient more vibrant"
- "Test the API connection"

---

*Document complete. Ready to build.*
