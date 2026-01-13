# Birmingham AI AEO Scanner API

Answer Engine Optimization (AEO) scanner API for the Birmingham AI 2026 Kickoff event.

## Overview

This API scans website homepages and provides actionable recommendations to improve visibility in AI search results (ChatGPT, Perplexity, Google AI Overviews).

## Endpoints

### GET /health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok"
}
```

### POST /api/scan
Scans a website URL and returns AEO score with recommendations.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "scannedAt": "2026-01-14T17:30:00Z",
  "overallScore": 80,
  "scoreGrade": "B",
  "checks": {
    "headingHierarchy": { ... },
    "metaDescription": { ... },
    "schemaMarkup": { ... },
    "faqSection": { ... },
    "contentStructure": { ... }
  },
  "recommendations": [...]
}
```

## The 5 AEO Checks

1. **Heading Hierarchy** (20 points) - Exactly 1 H1, no skipped levels
2. **Meta Description** (20 points) - Present, 120-160 characters ideal
3. **Schema Markup** (20 points) - JSON-LD structured data present
4. **FAQ Section** (20 points) - FAQ content or FAQPage schema
5. **Content Structure** (20 points) - Has lists/tables, 300+ words

## Local Development

```bash
# Install dependencies
npm install

# Run server
npm start

# Run with auto-reload
npm run dev
```

The API will run on port 3000 by default.

## Deployment

This API is configured for Railway auto-deployment. Push to the repository and Railway will automatically deploy.

## Environment Variables

- `PORT` - Server port (default: 3000)

## Tech Stack

- Node.js 20+
- Express.js
- Axios (HTTP client)
- Cheerio (HTML parsing)
- CORS enabled

## Event Details

- **Event:** Birmingham AI 2026 Kickoff
- **Date:** January 14, 2026
- **Time:** 4:30 PM - 8:00 PM
- **Expected Load:** 50+ scans during event

## License

MIT
