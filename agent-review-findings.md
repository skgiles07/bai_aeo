# AEO Scanner — Agent Review Findings

**Date:** February 9, 2026
**URL:** https://bai-aeo.vercel.app
**Agents:** Brand Guardian, UI Designer, UX Researcher, Growth Hacker

## Cross-Agent Consensus (Prioritized)

### Critical — Implement Now
1. ✅ **Add AEO explainer copy** (Brand, UX, Growth) — define AEO, explain why it matters, differentiate from SEO
2. ✅ **Add post-scan CTAs** (All 4) — share buttons (X + LinkedIn) + "Join Birmingham AI" CTA implemented
3. ✅ **Accessibility sweep** (UI, UX) — ARIA roles, focus rings, contrast fixes, progressbar, alerts
4. ✅ **Add Vercel Analytics** (Growth) — scan_started/completed/error/share/cta custom events
5. ✅ **Create OG image** (Brand, Growth) — dynamic @vercel/og edge route at /api/og
6. ⚠️ **Replace placeholder logo** (Brand) — status unclear; verify in current deployed build
7. ✅ **Add scoring methodology** (Brand, UX) — scoring methodology text added to ScoreGauge

### Should-Do — Next Session
8. ✅ Render `learnMoreUrl` on recommendations (UX) — filtered for placeholder URLs
9. Rename check labels with AI-specific framing (Brand) — **pending**
10. ✅ Animate ScoreGauge arc on mount (UI) — arc animation on mount
11. ✅ Add results fade-in transition (UI)
12. Add below-the-fold SEO content + FAQ (Growth) — **parked**
13. ✅ Add JSON-LD structured data (Growth) — SoftwareApplication schema in layout
14. Add scan counter as social proof (Growth) — **parked**
15. Shareable result permalink URLs (Growth) — **parked**
16. Filter/sort per-page accordion in site results (UX) — **pending**

### Nice-to-Have — Future
17. "AEO Certified" badge for high scorers (Growth) — **parked**
18. Competitor comparison feature (Growth) — **parked**
19. Monthly re-scan email drip via HubSpot (Growth) — **parked**
20. ✅ Dynamic OG images per scan via @vercel/og (Growth) — implemented (grade-based dynamic OG)
21. Skeleton loading states (UI) — **parked**
22. prefers-reduced-motion support (UI) — **parked**

## Agent Scores
- Brand Guardian: 68/100 (C+)
- Growth Hacker: F across lead capture, viral, conversion, retention, social proof, upsell, analytics
- UI Designer: 5 critical, 8 should-do, 7 nice-to-have
- UX Researcher: 3 critical, 10 should-do, 3 nice-to-have

## Key Quotes
- Brand: "The tool works well. The brand gap is not in execution — it is in storytelling."
- Growth: "Like opening a store with great products but removing the cash register, the front door sign, and the phone number."
- UX: "The user is at peak engagement after seeing their score. The tool diagnoses but does not guide toward resolution."
