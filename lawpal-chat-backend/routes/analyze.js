const express = require('express');
const multer = require('multer');
const config = require('../config');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === 'application/pdf' ||
      file.mimetype.startsWith('image/');
    cb(ok ? null : new Error('Only PDF, JPG, and PNG files are allowed'), ok);
  },
});

const ANALYSIS_PROMPT = `You are a legal document analyst for LawPal (Pakistan / Punjab focus).
Analyze the legal document and return ONLY one valid JSON object. No markdown. No commentary.

First detect whether the document is mainly English or mainly Urdu.

Required JSON shape:
{
  "document_language": "en",
  "explanation": "Summary in the SAME language as the document (2-4 short paragraphs)",
  "translation": "Full translation of the explanation into the OTHER language",
  "sections": [
    { "title": "Section/clause heading from the document", "content": "Plain-language explanation of what this section means" }
  ],
  "glossary": [
    { "term": "Legal term", "definition": "Simple definition of the term only" }
  ]
}

Language rules (very important):
- If the document is English: document_language="en". Write explanation, sections, and glossary in English. Write translation in Urdu (Nastaliq/Urdu script).
- If the document is Urdu: document_language="ur". Write explanation, sections, and glossary in Urdu. Write translation in English.
- Never put Urdu in explanation/sections/glossary when the document is English.
- Never put English in explanation/sections/glossary when the document is Urdu (except unavoidable proper names).

Field rules:
- explanation / translation: overall document summary only.
- sections: ONLY real sections/clauses/articles from the document. Each item must name the section and explain that section. Do NOT put glossary terms, word definitions, parties, dates, timelines, advice, or general summaries in sections.
- glossary: ONLY legal vocabulary / jargon terms from the document with short definitions. Do NOT put section numbers, clause explanations, summaries, parties, or advice in glossary.
- Never duplicate the same content across sections and glossary.
- Return 4 to 8 sections (or fewer if the document has fewer real sections) and 5 to 10 glossary terms.
- Keep all string values on single lines. Do not put raw line breaks inside JSON strings; use spaces instead.
- Escape any double quotes inside strings.
- If the document is unclear, still return best-effort JSON matching the shape above.
`;

function extractJsonObject(raw) {
  let cleaned = (raw || '').trim();
  if (!cleaned) throw new Error('Empty AI response');

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1) throw new Error('No JSON object found in AI response');

  if (end > start) {
    cleaned = cleaned.slice(start, end + 1);
  } else {
    // Truncated JSON — take from first brace and try to repair
    cleaned = cleaned.slice(start);
  }

  return cleaned;
}

function repairJson(text) {
  let s = text.trim();

  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, '$1');

  // Replace literal newlines inside strings with spaces (rough but helpful)
  let inString = false;
  let escaped = false;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        out += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
        out += ch;
        continue;
      }
      if (ch === '\n' || ch === '\r') {
        out += ' ';
        continue;
      }
      if (ch === '\t') {
        out += ' ';
        continue;
      }
      out += ch;
    } else {
      if (ch === '"') inString = true;
      out += ch;
    }
  }
  s = out;

  // If truncated mid-string / mid-object, close open structures
  let quoteCount = 0;
  escaped = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') quoteCount += 1;
  }
  if (quoteCount % 2 === 1) s += '"';

  const opens = { '{': 0, '[': 0 };
  inString = false;
  escaped = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') opens['{'] += 1;
    if (ch === '}') opens['{'] -= 1;
    if (ch === '[') opens['['] += 1;
    if (ch === ']') opens['['] -= 1;
  }
  while (opens['['] > 0) {
    s += ']';
    opens['['] -= 1;
  }
  while (opens['{'] > 0) {
    s += '}';
    opens['{'] -= 1;
  }

  s = s.replace(/,\s*([}\]])/g, '$1');
  return s;
}

function looksLikeUrdu(text) {
  const s = String(text || '');
  const arabic = (s.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (s.match(/[A-Za-z]/g) || []).length;
  return arabic > 20 && arabic >= latin;
}

function normalizeDocumentLanguage(parsed) {
  const raw = String(parsed?.document_language || parsed?.language || '')
    .trim()
    .toLowerCase();
  if (raw === 'ur' || raw === 'urdu' || raw.startsWith('ur')) return 'ur';
  if (raw === 'en' || raw === 'english' || raw.startsWith('en')) return 'en';
  // Infer from content if model omitted the field
  const sample = [parsed?.explanation, parsed?.translation, parsed?.urdu]
    .filter(Boolean)
    .join(' ');
  return looksLikeUrdu(parsed?.explanation || sample) ? 'ur' : 'en';
}

function normalizeTranslation(parsed, documentLanguage) {
  const translation =
    (typeof parsed.translation === 'string' && parsed.translation.trim()) ||
    (typeof parsed.other_language === 'string' && parsed.other_language.trim()) ||
    (typeof parsed.urdu === 'string' && parsed.urdu.trim()) ||
    (typeof parsed.english === 'string' && parsed.english.trim()) ||
    '';

  // Legacy: older responses put Urdu only in "urdu" even for EN docs
  if (translation) return translation;

  // If model still returned urdu/english split the old way
  if (documentLanguage === 'en' && typeof parsed.urdu === 'string') {
    return parsed.urdu;
  }
  if (documentLanguage === 'ur' && typeof parsed.english === 'string') {
    return parsed.english;
  }
  return '';
}

function normalizeSections(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((s) => ({
      title: String(s?.title || s?.name || s?.heading || '').trim(),
      content: String(s?.content || s?.explanation || s?.text || '').trim(),
    }))
    .filter((s) => s.title && s.content)
    // Drop items that look like glossary entries wrongly placed in sections
    .filter((s) => !/^(glossary|definition|term)\b/i.test(s.title));
}

function normalizeGlossary(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((g) => ({
      term: String(g?.term || g?.word || g?.title || '').trim(),
      definition: String(g?.definition || g?.meaning || g?.content || '').trim(),
    }))
    .filter((g) => g.term && g.definition)
    // Drop items that look like document sections wrongly placed in glossary
    .filter((g) => !/^(section|clause|article|chapter)\s*\d+/i.test(g.term));
}

function parseAnalysisJson(raw) {
  const extracted = extractJsonObject(raw);
  let parsed;

  try {
    parsed = JSON.parse(extracted);
  } catch (firstErr) {
    try {
      parsed = JSON.parse(repairJson(extracted));
    } catch (secondErr) {
      console.error('JSON parse failed. Raw preview:', String(raw).slice(0, 500));
      throw new Error(
        'AI returned invalid JSON. Please try Analyze again. Details: ' + firstErr.message
      );
    }
  }

  const document_language = normalizeDocumentLanguage(parsed);
  const translation = normalizeTranslation(parsed, document_language);

  return {
    success: true,
    document_language,
    explanation: typeof parsed.explanation === 'string' ? parsed.explanation : '',
    translation,
    // Keep "urdu" for older clients: secondary-language text
    urdu: translation,
    sections: normalizeSections(parsed.sections),
    glossary: normalizeGlossary(parsed.glossary),
  };
}

function geminiTextFromResponse(data) {
  const candidate = data?.candidates?.[0];
  const finish = candidate?.finishReason;
  if (finish && finish !== 'STOP' && finish !== 'MAX_TOKENS') {
    console.warn('Gemini finishReason:', finish);
  }
  const text =
    candidate?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!text) {
    const block = data?.promptFeedback?.blockReason;
    throw new Error(block ? `Gemini blocked: ${block}` : 'Empty Gemini response');
  }
  return text;
}

async function extractTextWithOcr(buffer, filename, mimetype) {
  const form = new FormData();
  form.append('apikey', config.ocrSpaceApiKey);
  form.append('language', 'eng,urd');
  form.append('isOverlayRequired', 'false');
  form.append('OCREngine', '2');
  form.append('scale', 'true');
  form.append('detectOrientation', 'true');
  form.append('file', new Blob([buffer], { type: mimetype }), filename || 'document.pdf');

  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.IsErroredOnProcessing) {
    const msg =
      (Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(' ') : data.ErrorMessage) ||
      'OCR failed';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const parts = (data.ParsedResults || [])
    .map((p) => p.ParsedText || '')
    .filter(Boolean);
  return parts.join('\n\n').trim();
}

async function analyzeWithGeminiText(documentText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${encodeURIComponent(config.geminiApiKey)}`;
  const truncated = documentText.slice(0, 120000);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                ANALYSIS_PROMPT +
                '\n\nDOCUMENT TEXT:\n' +
                truncated,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    throw new Error(`Gemini error: ${msg}`);
  }

  return parseAnalysisJson(geminiTextFromResponse(data));
}

async function analyzeWithGeminiFile(buffer, mimetype) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${encodeURIComponent(config.geminiApiKey)}`;
  const base64 = buffer.toString('base64');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                ANALYSIS_PROMPT +
                '\n\nAnalyze the attached legal document file.',
            },
            {
              inline_data: {
                mime_type: mimetype,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    throw new Error(`Gemini file error: ${msg}`);
  }

  return parseAnalysisJson(geminiTextFromResponse(data));
}

async function forwardToN8n(buffer, filename, mimetype) {
  const form = new FormData();
  // Field name must match n8n webhook binary property ("data")
  form.append('data', new Blob([buffer], { type: mimetype }), filename);

  const res = await fetch(config.n8nAnalyzeWebhook, {
    method: 'POST',
    body: form,
  });

  const rawBody = await res.text();
  let data;
  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    // n8n may return truncated/invalid JSON — try repair
    try {
      data = parseAnalysisJson(rawBody);
      return { ...data, source: 'n8n' };
    } catch {
      throw new Error(
        rawBody
          ? `n8n returned invalid JSON: ${rawBody.slice(0, 120)}`
          : 'n8n returned empty response'
      );
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || 'n8n analysis failed');
  }

  // If n8n already returned the analysis shape
  if (data.explanation || data.sections || data.glossary) {
    const document_language = normalizeDocumentLanguage(data);
    const translation = normalizeTranslation(data, document_language);
    return {
      success: true,
      document_language,
      explanation: data.explanation || '',
      translation,
      urdu: translation,
      sections: normalizeSections(data.sections),
      glossary: normalizeGlossary(data.glossary),
      source: 'n8n',
    };
  }

  // Sometimes n8n wraps Gemini output in a text field
  const nested =
    data.output || data.text || data.content || data.json || data.data;
  if (typeof nested === 'string') {
    return { ...parseAnalysisJson(nested), source: 'n8n' };
  }
  if (nested && typeof nested === 'object') {
    const document_language = normalizeDocumentLanguage(nested);
    const translation = normalizeTranslation(nested, document_language);
    return {
      success: true,
      document_language,
      explanation: nested.explanation || '',
      translation,
      urdu: translation,
      sections: normalizeSections(nested.sections),
      glossary: normalizeGlossary(nested.glossary),
      source: 'n8n',
    };
  }

  throw new Error('n8n response missing analysis fields');
}

router.post('/analyze-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype } = req.file;

    if (config.useN8n) {
      try {
        const result = await forwardToN8n(buffer, originalname, mimetype);
        return res.json({ ...result, filename: originalname });
      } catch (n8nErr) {
        console.warn('n8n analyze failed, falling back to local:', n8nErr.message);
      }
    }

    let analysis;
    let method = 'gemini-file';

    // Prefer OCR.space text extraction, then Gemini text analysis
    try {
      const text = await extractTextWithOcr(buffer, originalname, mimetype);
      if (text && text.length > 40) {
        analysis = await analyzeWithGeminiText(text);
        method = 'ocr+gemini';
      }
    } catch (ocrErr) {
      console.warn('OCR.space failed:', ocrErr.message);
    }

    // Fallback: send file directly to Gemini
    if (!analysis) {
      analysis = await analyzeWithGeminiFile(buffer, mimetype);
      method = 'gemini-file';
    }

    return res.json({
      ...analysis,
      filename: originalname,
      method,
    });
  } catch (err) {
    console.error('Document analyze error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to analyze document',
    });
  }
});

module.exports = router;
