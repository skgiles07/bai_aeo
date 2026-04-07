# GoldLeaf Packaging — AEO Audit Report

**Prepared for:** GoldLeaf Marketing Agency Call
**Date:** February 10, 2026
**Scanned by:** Birmingham AI AEO Scanner (https://bai-aeo.vercel.app)
**Site:** goldleafpackaging.com

---

## Executive Summary

GoldLeaf Packaging's website scored **46 out of 100** on Answer Engine Optimization (AEO), scanning all 55 pages discovered via sitemap.xml. The majority of pages received a failing grade.

**What is AEO?** Answer Engine Optimization is how you make your website visible to AI search engines — ChatGPT, Google AI Overviews, Perplexity, Gemini, and Copilot. These platforms don't show 10 blue links. They read your site, understand it, and either cite you in their answers or they don't. AEO is the difference between appearing in an AI response vs. your business not existing in AI search at all.

**The good news:** GoldLeaf has strong fundamentals (good heading structure on 87% of pages, solid meta descriptions on 65% of pages, and a working sitemap). Three blog posts already score 80/100 and need only one fix (schema markup) to hit 100/100 — a 30-minute quick win. The remaining failures are all fixable with structured data, FAQ content, and content formatting — none require a site redesign.

**Projected impact:** Implementing the recommendations below could move the site from 46/100 to an estimated 80-88/100 within 4-6 weeks.

---

## Site-Wide Score Breakdown

| Metric | Value |
|--------|-------|
| Overall AEO Score | **46/100 (Grade F)** |
| Pages Scanned | 55 |
| Pages Passing (60+) | 14 (25%) |
| Pages Failing | 41 (75%) |
| Discovery Method | sitemap.xml |

### Score Distribution

| Score Range | Grade | Pages | Examples |
|-------------|-------|-------|----------|
| 80 | B | 3 | Best-in-class blog posts (need only schema) |
| 60 | D | 11 | Blog posts with FAQ or structured lists |
| 55 | F | 8 | Blog posts with partial content structure |
| 40 | F | 19 | Homepage, service pages, most blog posts |
| 35 | F | 9 | Service pages, older blog posts |
| 20 | F | 4 | /blog, /styles, /privacy-policy, /terms |
| 15 | F | 1 | /careers |

---

## AEO Check Results (5 Dimensions)

Each page is scored across 5 checks, each worth 20 points (100 total).

### 1. Schema Markup — 0/20 on ALL 55 pages

**Status:** Zero structured data (JSON-LD) detected anywhere on the site.

**Why it matters:** Structured data is the single most important signal for AI engines. It tells ChatGPT, Google, and Perplexity exactly what your business is, what you offer, and how to cite you. Pages with schema markup are cited 30-36% more often in AI-generated responses.

**What's missing:**
- No `Organization` schema (business name, address, phone, logo)
- No `LocalBusiness` schema (location, hours, service area)
- No `Product` or `Service` schema on service pages
- No `FAQPage` schema on the /faq page (despite having 13 questions)
- No `BlogPosting` or `Article` schema on blog posts
- No `BreadcrumbList` for site navigation

**Action items:**
1. Add global `Organization` schema to the site template (covers all pages)
2. Add `LocalBusiness` schema to the homepage
3. Add `FAQPage` schema to /faq
4. Add `BlogPosting` schema to all blog posts
5. Add `Service` schema to each service page

**Effort:** Medium (2-4 hours for a developer)
**Impact:** +20 points on every page (the single highest-leverage fix)

---

### 2. FAQ Sections — Failing on 44 of 55 pages (80%)

**Status:** Only 11 of 55 pages have detectable FAQ content — mostly newer blog posts:
- /faq — 13 questions (good, but missing FAQPage schema)
- /about — 6 question patterns detected
- /blog-posts/5-ways-print-partner — 4 question patterns

**Why it matters:** AI engines heavily prioritize question-and-answer formatted content. FAQ sections double the likelihood of AI citation because they directly match the question-answer format that users ask AI assistants.

**What's missing:**
- Service pages have zero Q&A content (these are the highest-value pages)
- Blog posts don't include summary FAQ sections
- No FAQPage schema markup even where FAQ content exists

**Action items for service pages:**
Each service page should include 5-7 common questions. Examples:

**/services/custom-boxes:**
- What types of custom boxes can you produce?
- What is the minimum order quantity for custom boxes?
- What materials are available for custom box printing?
- How long does production take for custom boxes?
- Can you provide samples before a full order?

**/services/labels-application:**
- What label materials and finishes do you offer?
- Do you provide label application services?
- What file formats do you accept for label artwork?
- What industries do you serve with custom labels?

**Effort:** Medium-High (content creation + implementation)
**Impact:** +20 points per page where FAQ is added

---

### 3. Content Structure — Failing on 38 of 55 pages (69%)

**Status:** 38 of 55 pages contain only paragraph text with no bullet lists, numbered lists, or comparison tables — despite having substantial word counts (many pages have 800-1500 words).

**Why it matters:** 78% of Google AI Overviews contain lists or tables. AI engines extract and display structured content (bullets, numbered steps, comparison tables) far more readily than wall-of-text paragraphs. The content is there — it just needs to be reformatted.

**Pages with good content structure (passing):**
- /blog-posts/digiflo-streamline — 7 lists, 887 words
- /blog-posts/memorable-branding — 1 list, 1,214 words
- /blog-posts/american-excellence — 3 lists, 1,060 words
- /blog-posts/best-practices-digital — 1 list, 862 words

**Pages that need restructuring (high priority):**
| Page | Words | Lists | Issue |
|------|-------|-------|-------|
| Homepage | 826 | 0 | Service offerings should be a bullet list |
| /about | 1,006 | 0 | Capabilities and team info need lists |
| /digiflo | 794 | 0 | Feature list should be formatted as bullets |
| /services | 284 | 0 | Service categories need structured lists |
| /services/custom-boxes | 273 | 0 | Box types and capabilities need lists |
| /services/labels-application | 268 | 0 | Label options need structured format |
| /services/business-essentials | 410 | 0 | Product categories need bullet lists |
| /blog-posts/10-things-labels | 1,296 | 0 | 10 items = perfect numbered list opportunity |

**Action items:**
1. Convert service descriptions to bullet lists (materials, sizes, capabilities)
2. Add comparison tables where relevant (e.g., print methods, turnaround times)
3. Format numbered blog posts as actual numbered lists
4. Add specifications lists to service pages (minimums, dimensions, finishes)

**Effort:** Low-Medium (reformatting existing content, not writing new content)
**Impact:** +20 points per page

---

### 4. Meta Descriptions — Failing on 19 of 55 pages (35%)

**Status:** 36 of 55 pages have well-optimized meta descriptions (120-160 chars). 19 pages need attention — the additional blog posts in the full scan revealed 10 more gaps beyond the original 9.

**Pages needing fixes:**
| Page | Issue | Current Length |
|------|-------|---------------|
| /styles | **Missing entirely** | 0 chars |
| /blog-posts/2021-design-trends | Too short | 56 chars |
| /careers | Too short | 90 chars |
| /blog-posts/memorable-branding | Too short | 101 chars |
| /blog-posts/5-ways-print-partner | Too short | 106 chars |
| /blog-posts/digiflo-streamline | Too short | 108 chars |
| /services/primary-packaging | Too short | 109 chars |
| /blog-posts/best-practices-digital | Too short | 113 chars |
| /services/promotional-items | Too short | 116 chars |

**Also noted:** The /blog page meta description contains a typo — "GoldLead" instead of "GoldLeaf":
> *"Take a look at our blog for insights and inside knowledge on printing, packaging, marketing, and more. Learn from our experts at GoldLead."*

**Action items:**
1. Fix the "GoldLead" typo on /blog
2. Add meta description to /styles
3. Expand all short descriptions to 120-160 characters
4. Include primary keywords and unique value proposition in each description

**Effort:** Low (30-60 minutes)
**Impact:** +5-20 points per affected page

---

### 5. Heading Structure — Failing on 7 of 55 pages (13%)

**Status:** 48 of 55 pages have perfect heading structure — the strongest area of the site. 7 pages need fixes.

**Pages needing fixes:**
| Page | Issue |
|------|-------|
| /careers | No H1 tag at all |
| /privacy-policy | No H1 tag at all |
| /terms-and-conditions | No H1 tag at all |
| /blog | H1 jumps directly to H3 (skips H2) |
| /blog-posts/american-excellence | 6 H1 tags (should be exactly 1) |

**Action items:**
1. Add H1 tags to /careers, /privacy-policy, /terms-and-conditions
2. Change blog post card headings from H3 to H2 on /blog
3. Fix /blog-posts/american-excellence to use only one H1 (demote others to H2)

**Effort:** Low (15-30 minutes)
**Impact:** +20 points per affected page

---

## Prioritized Action Plan

### Phase 1: Quick Wins (Week 1) — Estimated +15-20 points site-wide

| # | Action | Pages Affected | Effort | Score Impact |
|---|--------|----------------|--------|-------------|
| 0 | Add BlogPosting schema to 3 pages at 80/100 | 3 blog posts | 30 min | 80 → 100 guaranteed |
| 1 | Add Organization JSON-LD to site template | All 55 | 1 hour | +20 all pages |
| 2 | Fix "GoldLead" typo on /blog | 1 | 5 minutes | Brand fix |
| 3 | Fix missing/broken H1 tags | 5 | 30 minutes | +20 per page |
| 4 | Fix/add meta descriptions | 9 | 1 hour | +5-20 per page |
| 5 | Add FAQPage schema to /faq | 1 | 30 minutes | +20 |

### Phase 2: Content Restructuring (Week 2) — Estimated +15-20 points site-wide

| # | Action | Pages Affected | Effort | Score Impact |
|---|--------|----------------|--------|-------------|
| 6 | Convert service descriptions to bullet lists | 7 service pages | 2-3 hours | +20 per page |
| 7 | Format "10 Things About Labels" as numbered list | 1 | 15 minutes | +20 |
| 8 | Add bullet lists to homepage sections | 1 | 30 minutes | +20 |
| 9 | Add lists/tables to /about, /digiflo | 2 | 1 hour | +20 per page |

### Phase 3: FAQ Content + Advanced Schema (Weeks 3-4) — Estimated +10-15 points

| # | Action | Pages Affected | Effort | Score Impact |
|---|--------|----------------|--------|-------------|
| 10 | Write FAQ sections for all service pages | 6 | 4-6 hours | +20 per page |
| 11 | Add FAQ sections to high-traffic blog posts | ~20 | 6-8 hours | +20 per page |
| 12 | Add BlogPosting schema to all blog posts | ~38 | 2-3 hours | Improved citation |
| 13 | Add Service schema to service pages | 6 | 1-2 hours | Improved citation |
| 14 | Add LocalBusiness schema to homepage | 1 | 30 minutes | Improved citation |

---

## Projected Score After Implementation

| Phase | Site-Wide Score | Grade |
|-------|----------------|-------|
| Current | 46/100 | F |
| After Phase 1 (schema, headings, meta) | ~65/100 | D |
| After Phase 2 (content restructuring) | ~75/100 | C |
| After Phase 3 (FAQ + advanced schema) | ~85/100 | B |

---

## Competitive Context

For reference, here are typical AEO scores by industry:

| Score Range | What It Means |
|-------------|---------------|
| 80-100 (A-B) | AI search optimized — likely being cited in AI responses |
| 60-79 (C-D) | Partially optimized — visible to AI but missing opportunities |
| 40-59 (F) | Poorly optimized — AI engines struggle to parse your content |
| 0-39 (F) | Not optimized — effectively invisible to AI search |

GoldLeaf at 46/100 sits at the top of the "poorly optimized" range — close to the threshold where AI engines begin to consistently parse and cite content. The proposed fixes would move it to "AI search optimized" territory (80+), which is ahead of virtually all competitors in the print/packaging space who haven't addressed AEO at all.

---

## About This Report

This report was generated using the Birmingham AI AEO Scanner, which analyzes websites across 5 dimensions that determine AI search engine visibility:

1. **Heading Structure** (20 pts) — Proper H1 hierarchy for AI content parsing
2. **Meta Descriptions** (20 pts) — Page summaries that AI engines use for context
3. **Schema Markup** (20 pts) — Structured data that AI engines rely on for citation
4. **FAQ Sections** (20 pts) — Question-answer content that matches AI query patterns
5. **Content Structure** (20 pts) — Lists, tables, and formatted content that AI extracts

Scan your own site free at: **https://bai-aeo.vercel.app**

---

*Report prepared by Birmingham AI — helping businesses navigate the AI search era.*
*Contact: https://birminghamai.org*
