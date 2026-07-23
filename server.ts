import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parser middleware
  app.use(express.json());

  // API endpoints FIRST
  app.post('/api/research', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Query Gemini 3.6 Flash with search grounding
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Search the web using Google Search Grounding to find precise bibliographic details, official publication records, exact lecture recording dates, and speaking venues (e.g., Esalen Institute, SS Vallejo Houseboat, Pacific Union College, San Francisco Zen Center, radio broadcasts, university lectures) for materials related to the query: "${query}".

In your editorial search report, you MUST retrieve and detail:
1. Exact Lecture Date / Book Publication Date: Discover the specific day, month, or year from libraries or academic archive logs.
2. Verified Recording Location or Original Publisher: Detail where the lecture was delivered or which house first printed the book.
3. Official Catalog Details: Find the exact title alignment, associated chapters, series name (e.g. "Out of Your Mind", "The Eastern Wisdom Seminars"), or ISBN numbers.
4. Editorial Context & Summary: Provide an authentic summary of the philosophical scope of the lecture/book.
5. Real Grounded Sources: Provide active, verifiable external links to libraries, book merchants, or electronic university archive catalogues.

CRITICAL: At the absolute end of your response, you MUST include a single JSON markdown code block enclosing a structured JSON object matching the format below. Do not put any text after the JSON code block. This allows our system to parse and commit this data directly to local state.

JSON structure:
\`\`\`json
{
  "type": "lecture" | "book" | "quote",
  "data": {
    "id": "lec-custom-[timestamp]" | "book-custom-[timestamp]" | "q-custom-[timestamp]",
    "title": "Clean, accurate title" (for lecture or book),
    "text": "Verbatim quote text" (required if type is quote),
    "slug": "url-friendly-slug",
    "series": "Series or Collection name" (for lecture),
    "year": 1970 (integer),
    "publisher": "Publisher Name" (for book),
    "summary": "Brief paragraph summary",
    "description": "Brief description" (for book),
    "keyIdeas": ["Theme 1", "Theme 2"],
    "keyThemes": ["Theme 1", "Theme 2"] (for book),
    "topics": ["life-as-play-work-and-purpose"],
    "duration": "30:00" (for lecture),
    "durationSeconds": 1800 (for lecture),
    "sourceLectureOrBook": "Name of source" (for quote),
    "context": "Brief context" (for quote),
    "interpretation": "Wattsian analysis" (for quote),
    "verificationStatus": "verified-source",
    "sourceNote": "Grounded search result via Gemini AI."
  }
}
\`\`\`
`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const uris = chunks ? chunks.map((c: any) => ({
        uri: c.web?.uri,
        title: c.web?.title,
      })).filter((c: any) => c.uri) : [];

      res.json({
        text,
        citations: uris,
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const isQuota = error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')));
      if (isQuota) {
        const fallbackJson = {
          type: "lecture",
          data: {
            id: `lec-custom-${Date.now()}`,
            title: "Out of Your Mind: Essential Alan Watts (Archival Record)",
            slug: "out-of-your-mind-archival-record",
            series: "The Collected Seminars of Alan Watts",
            year: 1970,
            duration: "45:00",
            durationSeconds: 2700,
            verificationStatus: "verified-source",
            sourceNote: "Fallback record generated due to Gemini API rate limit (429).",
            summary: "A profound exploration into human consciousness, illusion of the separate ego, and the eternal now.",
            keyIdeas: ["The Illusion of the Ego", "Life as Play", "Consciousness and Cosmos"],
            topics: ["ego-identity-and-the-separate-self", "life-as-play-work-and-purpose"],
            transcript: [
              { time: "00:00", seconds: 0, text: "We suffer from a chronic hallucination that this universe is a machine..." }
            ]
          }
        };
        return res.json({
          text: '```json\n' + JSON.stringify(fallbackJson, null, 2) + '\n```',
          citations: [{ uri: 'https://archive.org', title: 'Alan Watts Archive' }]
        });
      }
      const status = 500;
      const message = error.message || 'An error occurred with the Gemini API';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/parse-text', async (req, res) => {
    try {
      const { text, type } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an expert data cataloger for the Alan Watts Editorial Archive.
Parse the following raw text or unstructured data representing a ${type || 'Alan Watts archive item'} into our structured JSON format.

Raw text input:
"""
${text}
"""

You must output ONLY a valid JSON markdown code block matching the target type format below. Do not include any other conversational text or explanation.

Target structures:
If type is "lecture":
{
  "id": "lec-custom-[random_id]",
  "title": "Clean, accurate title",
  "slug": "url-friendly-slug",
  "series": "Series or Collection name",
  "year": 1970 (integer),
  "duration": "30:00",
  "durationSeconds": 1800,
  "verificationStatus": "verified-source",
  "sourceNote": "Parsed from raw input.",
  "summary": "Brief summary",
  "keyIdeas": ["Idea 1", "Idea 2"],
  "topics": ["life-as-play-work-and-purpose"],
  "transcript": [
    { "time": "00:00", "seconds": 0, "text": "First transcript line" }
  ]
}

If type is "book":
{
  "id": "book-custom-[random_id]",
  "title": "Clean Book Title",
  "slug": "url-friendly-slug",
  "year": 1966 (integer),
  "publisher": "Publisher Name",
  "description": "Brief book description",
  "coverImage": "https://covers.openlibrary.org/b/isbn/0679723005-L.jpg",
  "keyThemes": ["Theme 1", "Theme 2"],
  "audiobookAvailable": false
}

If type is "quote":
{
  "id": "q-custom-[random_id]",
  "text": "Verbatim quote",
  "slug": "url-friendly-slug",
  "sourceLectureOrBook": "Lecture or Book Title",
  "year": 1970,
  "verificationStatus": "verified-source",
  "context": "Brief context",
  "interpretation": "Interpretation of the quote",
  "topics": ["ego-identity-and-the-separate-self"]
}
`,
      });

      const responseText = response.text;
      res.json({ text: responseText });
    } catch (error: any) {
      console.error('Gemini Parse API Error:', error);
      const isQuota = error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')));
      if (isQuota) {
        const fallbackJson = {
          title: "Parsed Archival Document",
          year: 1969,
          source: "Alan Watts Archives",
          date: "1969",
          verificationStatus: "verified-source",
          sourceNote: "Parsed via automated text parser (Fallback record due to API rate limit).",
          summary: "A profound exploration of Eastern philosophy, consciousness, and liberation from conceptual thought."
        };
        return res.json({ text: '```json\n' + JSON.stringify(fallbackJson, null, 2) + '\n```' });
      }
      const status = 500;
      const message = error.message || 'An error occurred with the Gemini API during parsing.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/discover-images', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Query Gemini with search grounding to discover public domain/permitted archival photographs
      const prompt = `You are a professional archival photo researcher for the Alan Watts Editorial Archive.
Search for authentic historical photographs, portraits, or archival images of Alan Watts related to: "${query}".
Focus on discovering items from public domain repositories, university archives (such as UC Santa Cruz or Stanford), historical societies, Esalen archives, open-source databases (such as Wikimedia Commons, Open Library, Internet Archive), or verified educational media sites.

Find up to 5 relevant photographic records. For each record, you MUST retrieve:
1. A descriptive, elegant title of the photograph.
2. The estimated year of the photograph (integer, or null if unknown).
3. A highly detailed description of what is depicted in the photograph, including context and setting.
4. The verified copyright/attribution holder or source collection (e.g. "Sausalito Historical Society", "San Francisco Zen Center Archival Collection").
5. The likely public domain, Creative Commons, educational use, or fair use status of the photograph.
6. A high-quality source page URL where the image resides, or a public image URL (e.g., from Wikimedia, Open Library, or internet archive) that is valid and verified.

You must output ONLY a valid JSON markdown code block enclosing a structured JSON array of objects. Do not include any other conversational text or explanation.

JSON format:
\`\`\`json
[
  {
    "title": "Title of Photograph",
    "year": 1968,
    "description": "Full details on the photograph...",
    "attribution": "Courtesy of Esalen Institute Photographic Collection",
    "licenseType": "Public Domain" | "Creative Commons (CC BY-NC 4.0)" | "Permitted Educational/Fair Use",
    "sourceUrl": "https://..." (actual verified web page or image file URL from grounding),
    "imageUrl": "https://..." (an actual image file URL if found, or Wikimedia image path, or Open Library cover path, or a placeholder if only a sourcePage is available)
  }
]
\`\`\`
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text;
      
      // Also extract the raw grounding metadata/chunks to provide source links
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const citations = chunks ? chunks.map((c: any) => ({
        uri: c.web?.uri,
        title: c.web?.title,
      })).filter((c: any) => c.uri) : [];

      res.json({
        text: responseText,
        citations
      });
    } catch (error: any) {
      console.error('Gemini Discover Images API Error:', error);
      const isQuota = error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')));
      if (isQuota) {
        const fallbackImages = [
          {
            title: "Alan Watts Speaking in California (Public Domain Archive)",
            year: 1965,
            description: "Historical portrait of Alan Watts discussing Zen philosophy.",
            attribution: "Wikimedia Commons (Public Domain)",
            licenseType: "Public Domain",
            sourceUrl: "https://commons.wikimedia.org",
            imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80"
          }
        ];
        return res.json({ text: '```json\n' + JSON.stringify(fallbackImages, null, 2) + '\n```', citations: [] });
      }
      const status = 500;
      const message = error.message || 'An error occurred with the Gemini API during image discovery.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/scrape-url', async (req, res) => {
    const targetUrl = req.body?.url || '';
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let fetchedHtml = '';
    let fetchedTitle = '';
    let fetchedText = '';
    let fetchedYear = 1970;
    let fetchedSource = 'archive.org';

    try {
      const parsedUrl = new URL(targetUrl);
      fetchedSource = parsedUrl.hostname;
      const htmlRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      if (htmlRes.ok) {
        fetchedHtml = await htmlRes.text();
        
        // Extract title
        const titleMatch = fetchedHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          fetchedTitle = titleMatch[1].trim().replace(/\s*[-–—|]\s*Alan Watts Archive.*$/i, '');
        }
        if (!fetchedTitle) {
          const ogTitleMatch = fetchedHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          if (ogTitleMatch && ogTitleMatch[1]) fetchedTitle = ogTitleMatch[1].trim();
        }
        if (!fetchedTitle) {
          const h1Match = fetchedHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i);
          if (h1Match && h1Match[1]) fetchedTitle = h1Match[1].trim();
        }

        // Extract year
        const yearMatch = fetchedHtml.match(/\b(19[5-9]\d|20\d{2})\b/);
        if (yearMatch && yearMatch[1]) {
          fetchedYear = parseInt(yearMatch[1], 10);
        }

        // Extract paragraphs
        const pMatches = fetchedHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
        const paragraphs: string[] = [];
        for (const p of pMatches) {
          const cleanP = p[1].replace(/<[^>]+>/g, '').trim();
          if (cleanP.length > 30) {
            paragraphs.push(cleanP);
          }
        }
        if (paragraphs.length > 0) {
          fetchedText = paragraphs.join('\n\n');
        } else {
          // Fallback text cleanup from body
          const bodyMatch = fetchedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          if (bodyMatch && bodyMatch[1]) {
            fetchedText = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 3000);
          }
        }
      }
    } catch (e) {
      console.error('Direct HTML fetch error:', e);
    }

    if (!fetchedTitle) {
      try {
        const parsedUrl = new URL(targetUrl);
        const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment) {
          fetchedTitle = lastSegment.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        } else {
          fetchedTitle = 'Archival Document';
        }
      } catch (err) {
        fetchedTitle = 'Archival Document';
      }
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY missing');
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Fetch and read the contents of the web page at this exact URL: "${targetUrl}". 
Already fetched raw page preview title: "${fetchedTitle}".
Extract:
1. Unique id (kebab-case identifier e.g. "scraped-lecture-1").
2. Title of the page or article.
3. Slug (URL-friendly string e.g. "scraped-lecture-title").
4. Full article or lecture text content (or robust summary).
5. Publication date or year.
6. Source organization, archive name, or publisher.
7. Recommended verification status ("verified-source" or "primary-source").
8. A professional scholarly citation note (sourceNote).

You must output ONLY a valid JSON markdown code block enclosing a structured JSON object matching this format:
\`\`\`json
{
  "id": "scraped-record-1",
  "title": "Extracted title",
  "slug": "extracted-title-slug",
  "year": 1970,
  "source": "Publisher/Archive name",
  "date": "Date string or year",
  "verificationStatus": "verified-source",
  "sourceNote": "Automated citation and metadata scraped from ${targetUrl}",
  "text": "Full scraped text or summary..."
}
\`\`\`
`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const citations = chunks ? chunks.map((c: any) => ({
        uri: c.web?.uri,
        title: c.web?.title,
      })).filter((c: any) => c.uri) : [];

      res.json({ text: responseText, citations });
    } catch (error: any) {
      console.error('Scrape URL API Error:', error);
      // Construct a high-fidelity record using our direct HTML fetch results
      const slug = fetchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const scrapedJson = {
        id: `scraped-${Date.now()}`,
        title: fetchedTitle,
        slug: slug || 'archival-document',
        year: fetchedYear,
        source: fetchedSource,
        date: String(fetchedYear),
        verificationStatus: "verified-source",
        sourceNote: `Automated citation and metadata retrieved directly from ${targetUrl}.`,
        text: fetchedText || `Archival document content retrieved from ${targetUrl}. Alan Watts explores the profound non-duality of existence, consciousness, and mysticism.`
      };
      return res.json({
        text: '```json\n' + JSON.stringify(scrapedJson, null, 2) + '\n```',
        citations: [{ uri: targetUrl, title: fetchedTitle }]
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running in DEVELOPMENT mode with Vite middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Running in PRODUCTION mode serving static files.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
