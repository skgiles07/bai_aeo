import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Scan endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid website URL (e.g., example.com)'
      });
    }

    // Fetch HTML
    let html;
    try {
      const response = await axios.get(normalizedUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BirminghamAI-AEO-Scanner/1.0)'
        },
        maxRedirects: 5
      });
      html = response.data;
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return res.status(400).json({
          success: false,
          error: "We couldn't reach that website. Check the URL and try again."
        });
      }
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return res.status(408).json({
          success: false,
          error: 'The website took too long to respond. Please try again.'
        });
      }
      if (error.response && error.response.status === 403) {
        return res.status(403).json({
          success: false,
          error: 'This site blocks automated scanning. Try a different URL.'
        });
      }
      throw error;
    }

    // Parse HTML
    const $ = cheerio.load(html);

    // Run all checks
    const checks = {
      headingHierarchy: checkHeadingHierarchy($),
      metaDescription: checkMetaDescription($),
      schemaMarkup: checkSchemaMarkup($),
      faqSection: checkFaqSection($),
      contentStructure: checkContentStructure($)
    };

    // Calculate score
    const overallScore = Object.values(checks).reduce((sum, check) => sum + check.score, 0);
    const scoreGrade = calculateGrade(overallScore);

    // Generate recommendations
    const recommendations = generateRecommendations(checks);

    // Send response
    res.json({
      success: true,
      url: normalizedUrl,
      scannedAt: new Date().toISOString(),
      overallScore,
      scoreGrade,
      checks,
      recommendations
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong on our end. Please try again.'
    });
  }
});

// Check 1: Heading Hierarchy
function checkHeadingHierarchy($) {
  const h1s = $('h1');
  const h1Count = h1s.length;

  // Get all heading levels in order
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    headings.push(el.name.toUpperCase());
  });

  // Check for skipped levels
  let hasSkippedLevels = false;
  const levels = headings.map(h => parseInt(h[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      hasSkippedLevels = true;
      break;
    }
  }

  const pass = h1Count === 1 && !hasSkippedLevels;

  return {
    pass,
    score: pass ? 20 : 0,
    maxScore: 20,
    details: {
      h1Count,
      hasSkippedLevels,
      headings: headings.slice(0, 10) // First 10 headings
    },
    message: pass
      ? `Perfect heading structure with exactly 1 H1 and no skipped levels`
      : h1Count !== 1
        ? `Found ${h1Count} H1 tag${h1Count !== 1 ? 's' : ''} (should be exactly 1)${hasSkippedLevels ? ' and skipped heading levels' : ''}`
        : 'Skipped heading levels detected (e.g., H1 → H3)'
  };
}

// Check 2: Meta Description
function checkMetaDescription($) {
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const length = metaDesc.trim().length;
  const exists = length > 0;
  const idealLength = length >= 120 && length <= 160;

  const pass = exists && idealLength;

  return {
    pass,
    score: exists ? (idealLength ? 20 : 15) : 0,
    maxScore: 20,
    details: {
      exists,
      length,
      content: metaDesc.substring(0, 200)
    },
    message: !exists
      ? 'No meta description found'
      : idealLength
        ? `Meta description is well-optimized (${length} characters)`
        : length < 120
          ? `Meta description is too short (${length} chars, aim for 120-160)`
          : `Meta description is too long (${length} chars, aim for 120-160)`
  };
}

// Check 3: Schema Markup
function checkSchemaMarkup($) {
  const jsonLdScripts = $('script[type="application/ld+json"]');
  const hasJsonLd = jsonLdScripts.length > 0;

  const schemas = [];
  jsonLdScripts.each((_, el) => {
    try {
      const content = $(el).html();
      const parsed = JSON.parse(content);
      const type = parsed['@type'] || (Array.isArray(parsed) ? parsed.map(p => p['@type']).join(', ') : 'Unknown');
      schemas.push(type);
    } catch (e) {
      // Invalid JSON-LD, skip
    }
  });

  const pass = hasJsonLd && schemas.length > 0;

  return {
    pass,
    score: pass ? 20 : 0,
    maxScore: 20,
    details: {
      hasJsonLd,
      schemaCount: schemas.length,
      schemas: schemas.slice(0, 5)
    },
    message: pass
      ? `Found ${schemas.length} schema${schemas.length !== 1 ? 's' : ''}: ${schemas.slice(0, 3).join(', ')}`
      : 'No structured data (JSON-LD) detected'
  };
}

// Check 4: FAQ Section
function checkFaqSection($) {
  // Check for FAQPage schema
  const jsonLdScripts = $('script[type="application/ld+json"]');
  let hasFaqSchema = false;

  jsonLdScripts.each((_, el) => {
    try {
      const content = $(el).html();
      const parsed = JSON.parse(content);
      const types = Array.isArray(parsed)
        ? parsed.map(p => p['@type']).flat()
        : [parsed['@type']];

      if (types.some(t => t === 'FAQPage' || t === 'Question')) {
        hasFaqSchema = true;
      }
    } catch (e) {
      // Invalid JSON-LD, skip
    }
  });

  // Check for FAQ content patterns
  const bodyText = $('body').text().toLowerCase();
  const hasFaqHeading = /frequently\s+asked\s+questions?|faq/i.test($('h1, h2, h3, h4').text());

  // Look for question patterns
  const questionMarkers = bodyText.match(/\b(what|how|why|when|where|who|can|do|does|is|are)\b[^.?]*\?/gi) || [];
  const questionCount = questionMarkers.length;

  const hasFaqContent = hasFaqHeading || questionCount >= 3;
  const pass = hasFaqSchema || hasFaqContent;

  return {
    pass,
    score: pass ? 20 : 0,
    maxScore: 20,
    details: {
      hasFaqSchema,
      hasFaqContent,
      questionCount
    },
    message: pass
      ? hasFaqSchema
        ? 'FAQPage schema detected'
        : `FAQ content patterns found (${questionCount} questions detected)`
      : 'No FAQ section or FAQPage schema found'
  };
}

// Check 5: Content Structure
function checkContentStructure($) {
  // Count lists
  const lists = $('ul, ol');
  const listCount = lists.length;
  const hasLists = listCount > 0;

  // Count tables
  const tables = $('table');
  const tableCount = tables.length;
  const hasTables = tableCount > 0;

  // Count words (rough estimate)
  const bodyText = $('body').text();
  const words = bodyText.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const pass = (hasLists || hasTables) && wordCount >= 300;

  return {
    pass,
    score: pass ? 20 : 0,
    maxScore: 20,
    details: {
      hasLists,
      listCount,
      hasTables,
      tableCount,
      wordCount
    },
    message: pass
      ? `Good content structure with ${listCount} list${listCount !== 1 ? 's' : ''}, ${tableCount} table${tableCount !== 1 ? 's' : ''}, and ${wordCount} words`
      : !hasLists && !hasTables
        ? `No lists or tables found (has ${wordCount} words)`
        : `Insufficient content: only ${wordCount} words (need 300+)`
  };
}

// Calculate letter grade
function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Generate recommendations
function generateRecommendations(checks) {
  const recommendations = [];

  // Failed checks (highest priority)
  const failedChecks = [];
  if (!checks.headingHierarchy.pass) {
    failedChecks.push({
      check: 'headingHierarchy',
      priority: 1,
      title: 'Fix Your Heading Structure',
      impact: 'High',
      effort: 'Low'
    });
  }
  if (!checks.schemaMarkup.pass) {
    failedChecks.push({
      check: 'schemaMarkup',
      priority: 2,
      title: 'Add Structured Data (Schema Markup)',
      impact: 'High',
      effort: 'Medium'
    });
  }
  if (!checks.faqSection.pass) {
    failedChecks.push({
      check: 'faqSection',
      priority: 3,
      title: 'Add an FAQ Section',
      impact: 'High',
      effort: 'Medium'
    });
  }
  if (!checks.metaDescription.pass) {
    failedChecks.push({
      check: 'metaDescription',
      priority: 4,
      title: 'Add or Improve Your Meta Description',
      impact: 'Medium',
      effort: 'Low'
    });
  }
  if (!checks.contentStructure.pass) {
    failedChecks.push({
      check: 'contentStructure',
      priority: 5,
      title: 'Improve Content Structure',
      impact: 'Medium',
      effort: 'Medium'
    });
  }

  // Add details for failed checks
  failedChecks.forEach(rec => {
    const check = checks[rec.check];

    let summary = '';
    let details = '';

    switch (rec.check) {
      case 'headingHierarchy':
        summary = check.details.h1Count !== 1
          ? `You have ${check.details.h1Count} H1 tag${check.details.h1Count !== 1 ? 's' : ''} — AI systems expect exactly one.`
          : 'Your headings skip levels, which confuses AI systems.';
        details = 'Use a single H1 for your main topic, then H2s for major sections, H3s for subsections. Never skip levels (e.g., H1 → H3). This single change improves AI citation likelihood by 2.8x.';
        break;

      case 'schemaMarkup':
        summary = 'No JSON-LD schema detected on your page.';
        details = 'Add Organization or LocalBusiness schema with your name, address, phone, and services. This helps AI systems understand and cite your business accurately. Pages with schema are cited 30-36% more often.';
        break;

      case 'faqSection':
        summary = 'No FAQ content or FAQPage schema found.';
        details = 'Add a section answering 5-7 common questions about your business or services. Use FAQPage schema markup for maximum impact. This doubles your likelihood of AI citation.';
        break;

      case 'metaDescription':
        summary = check.details.exists
          ? `Your meta description is ${check.details.length} characters (aim for 120-160).`
          : 'Your page is missing a meta description.';
        details = 'Add a meta description that summarizes your page in 120-160 characters. AI systems use this for context when deciding whether to cite your content.';
        break;

      case 'contentStructure':
        summary = !check.details.hasLists && !check.details.hasTables
          ? `Your page lacks structured content like lists or tables.`
          : `Your page only has ${check.details.wordCount} words (need 300+).`;
        details = 'Add bullet lists, numbered lists, or comparison tables. Include at least 300 words of substantive content. 78% of AI Overviews contain lists or tables.';
        break;
    }

    recommendations.push({
      priority: rec.priority,
      title: rec.title,
      impact: rec.impact,
      effort: rec.effort,
      summary,
      details,
      learnMoreUrl: 'https://birminghamai.org/aeo-guide'
    });
  });

  // Passed checks (maintaining/optimizing)
  const passedChecks = [];
  if (checks.headingHierarchy.pass) {
    passedChecks.push({
      check: 'headingHierarchy',
      title: 'Maintain Strong Heading Structure',
      impact: 'Maintaining'
    });
  }
  if (checks.metaDescription.pass) {
    passedChecks.push({
      check: 'metaDescription',
      title: 'Keep Your Meta Description Strong',
      impact: 'Maintaining'
    });
  }
  if (checks.schemaMarkup.pass) {
    passedChecks.push({
      check: 'schemaMarkup',
      title: 'Expand Your Schema Markup',
      impact: 'Optimizing'
    });
  }
  if (checks.faqSection.pass) {
    passedChecks.push({
      check: 'faqSection',
      title: 'Enhance Your FAQ Section',
      impact: 'Optimizing'
    });
  }
  if (checks.contentStructure.pass) {
    passedChecks.push({
      check: 'contentStructure',
      title: 'Maintain Good Content Structure',
      impact: 'Maintaining'
    });
  }

  // Fill remaining slots with passed checks
  while (recommendations.length < 5 && passedChecks.length > 0) {
    const rec = passedChecks.shift();
    const check = checks[rec.check];

    let summary = '';
    let details = '';

    switch (rec.check) {
      case 'headingHierarchy':
        summary = 'Your heading structure is well-optimized.';
        details = 'You have exactly one H1 and proper heading hierarchy. Continue following this pattern on all pages for consistent AI recognition.';
        break;

      case 'metaDescription':
        summary = `Your meta description is well-optimized at ${check.details.length} characters.`;
        details = 'Your current meta description effectively summarizes your content. Consider A/B testing variations that include your unique value proposition.';
        break;

      case 'schemaMarkup':
        summary = `You have ${check.details.schemaCount} schema${check.details.schemaCount !== 1 ? 's' : ''} implemented.`;
        details = 'Consider adding more schema types like FAQPage, HowTo, or Review schema to increase AI citation opportunities.';
        break;

      case 'faqSection':
        summary = 'FAQ content detected on your page.';
        details = 'Consider adding FAQPage schema markup if not already present, and expand to 7-10 questions for maximum AI visibility.';
        break;

      case 'contentStructure':
        summary = `Your page has ${check.details.listCount} list${check.details.listCount !== 1 ? 's' : ''} and ${check.details.wordCount} words.`;
        details = 'Your content structure is solid. Consider adding comparison tables or step-by-step guides to further improve AI extractability.';
        break;
    }

    recommendations.push({
      priority: recommendations.length + 1,
      title: rec.title,
      impact: rec.impact,
      effort: 'None',
      summary,
      details,
      learnMoreUrl: 'https://birminghamai.org/aeo-guide'
    });
  }

  return recommendations;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AEO Scanner API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Scan endpoint: http://localhost:${PORT}/api/scan`);
});
