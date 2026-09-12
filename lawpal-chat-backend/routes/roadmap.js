/**
 * AI Legal Roadmap Generator
 * Public: POST /api/roadmap/generate
 * Uses Gemini (same model as Document Analyzer) + optional n8n webhook
 */
const express = require('express');
const pool = require('../db');
const config = require('../config');

const router = express.Router();

const MOHTASIB_COMPLAINT_URL =
  'https://www.mohtasib.gov.pk/Detail/NWRkZDJmMTYtZmRiOC00MTAyLTk2ZDItZGVlNTkxMTdmNTEz';

const CONTACT_DIRECTORY = {
  police: { name: 'Police Emergency', phone: '15', url: null },
  rescue: { name: 'Rescue 1122', phone: '1122', url: null },
  ambulance: { name: 'Ambulance', phone: '115', url: null },
  women: { name: 'Punjab Women Helpline', phone: '1043', url: null },
  child: { name: 'Child Protection Helpline', phone: '1121', url: null },
  cyber: {
    name: 'FIA Cyber Crime',
    phone: '1991',
    url: 'https://complaint.fia.gov.pk',
  },
  fire: { name: 'Fire Brigade', phone: '16', url: null },
};

function geminiText(data) {
  return (data?.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || '')
    .join('')
    .trim();
}

const ROADMAP_SCHEMA = {
  type: 'OBJECT',
  properties: {
    case_title: { type: 'STRING' },
    category: { type: 'STRING' },
    urgency: { type: 'STRING' },
    summary: { type: 'STRING' },
    steps: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          order: { type: 'NUMBER' },
          title: { type: 'STRING' },
          detail: { type: 'STRING' },
        },
      },
    },
    applicable_sections: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          section: { type: 'STRING' },
          title: { type: 'STRING' },
          why: { type: 'STRING' },
        },
      },
    },
    where_to_file: { type: 'STRING' },
    how_to_file: { type: 'ARRAY', items: { type: 'STRING' } },
    complaint_draft_en: { type: 'STRING' },
    complaint_draft_ur: { type: 'STRING' },
    documents: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          why_needed: { type: 'STRING' },
          priority: { type: 'STRING' },
        },
      },
    },
    contact_keys: { type: 'ARRAY', items: { type: 'STRING' } },
    timeline_estimate: { type: 'STRING' },
    disclaimer: { type: 'STRING' },
  },
  required: [
    'case_title',
    'category',
    'urgency',
    'summary',
    'steps',
    'applicable_sections',
    'complaint_draft_en',
    'complaint_draft_ur',
    'documents',
    'contact_keys',
  ],
};

function repairJsonText(text) {
  let s = String(text || '').trim();
  s = s.replace(/,\s*([}\]])/g, '$1');
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
      if (ch === '\n' || ch === '\r' || ch === '\t') {
        out += ' ';
        continue;
      }
      out += ch;
    } else {
      if (ch === '"') inString = true;
      out += ch;
    }
  }
  return out;
}

function parseGeminiJson(raw) {
  const cleaned = String(raw || '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  const candidates = [cleaned, repairJsonText(cleaned)];
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (_) {}
    const start = candidate.indexOf('{');
    if (start === -1) continue;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < candidate.length; i++) {
      const ch = candidate[i];
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = !inString;
      } else if (!inString) {
        if (ch === '{') depth++;
        if (ch === '}') {
          depth--;
          if (depth === 0) {
            try {
              return JSON.parse(candidate.slice(start, i + 1));
            } catch (_) {
              break;
            }
          }
        }
      }
    }
  }
  throw new Error('Could not parse Gemini JSON');
}

async function generateLocalRoadmap(payload) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await callGemini([{ text: buildRoadmapPrompt(payload) }], {
        responseMimeType: 'application/json',
        responseSchema: ROADMAP_SCHEMA,
      });
      return parseGeminiJson(raw);
    } catch (err) {
      lastError = err;
      console.warn(`Roadmap Gemini attempt ${attempt} failed:`, err.message);
    }
  }
  throw lastError;
}

async function callGemini(parts, generationConfig = {}) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent` +
    `?key=${encodeURIComponent(config.geminiApiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        ...generationConfig,
      },
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini request failed');
  }
  const text = geminiText(data);
  if (!text) throw new Error('Gemini returned no text');
  return text;
}

function buildRoadmapPrompt({ problem, city, gender, userName }) {
  return `You are LawPal's Pakistan / Punjab legal roadmap assistant.
Analyze ONLY the user's problem. Never invent facts, dates, case numbers, or guarantees.
Return ONLY one valid JSON object with exactly these fields:
{
  "case_title": "short title",
  "category": "family|criminal|cybercrime|civil|labour|harassment|property|other",
  "urgency": "low|medium|high|critical",
  "summary": "2-3 sentence plain-language summary",
  "steps": [{"order":1,"title":"","detail":""}],
  "applicable_sections": [{"section":"law/section code","title":"short name","why":"why it may apply based only on stated facts"}],
  "where_to_file": "Family Court / Police Station / FIA Cybercrime / Union Council / Wafaqi Mohtasib / other — pick what fits",
  "how_to_file": ["short step 1","short step 2"],
  "complaint_draft_en": "first-person English complaint draft from the user's story",
  "complaint_draft_ur": "same complaint in Urdu",
  "documents": [{"name":"","why_needed":"","priority":"required|recommended"}],
  "contact_keys": ["police","rescue","women","cyber","child","ambulance","fire"],
  "timeline_estimate": "rough range only, not exact dates",
  "disclaimer": "This is guidance only and not a substitute for a licensed lawyer or official agency."
}

Rules for contact_keys (choose only those relevant to THIS situation):
- police: violence, crime, threats, FIR needed
- rescue / ambulance: injury or medical emergency
- women: women safety, domestic issues, harassment of women
- child: child involved
- cyber: online harassment, hacking, blackmail, fake profiles, PECA offences
- fire: fire / property damage by fire
Always include at least one relevant contact_key.

User name: ${userName || 'Not provided'}
User gender: ${gender || 'not_specified'}
City: ${city || 'Punjab'}
User problem:
${problem}`;
}

async function fetchFemaleLawyers() {
  try {
    const [rows] = await pool.query(
      `SELECT id,
        COALESCE(NULLIF(TRIM(full_name), ''), SUBSTRING_INDEX(email, '@', 1)) AS full_name,
        email, role, specialty, education, city, serial_no_hc, gender
       FROM users
       WHERE role = 'lawyer'
         AND (
           gender = 'female'
           OR full_name LIKE 'MS.%'
           OR full_name LIKE 'Ms.%'
           OR full_name LIKE '%Nadia%'
           OR full_name LIKE '%Hina%'
           OR full_name LIKE '%Mehwish%'
           OR full_name LIKE '%Sonia%'
           OR full_name LIKE '%Asma%'
           OR full_name LIKE '%Rameel%'
           OR full_name LIKE '%Noor%'
           OR full_name LIKE '%Fatima%'
           OR full_name LIKE '%Aisha%'
         )
       LIMIT 10`
    );
    return rows;
  } catch (_) {
    return [];
  }
}

async function fetchGeneralLawyers() {
  try {
    const [rows] = await pool.query(
      `SELECT id,
        COALESCE(NULLIF(TRIM(full_name), ''), SUBSTRING_INDEX(email, '@', 1)) AS full_name,
        email, role, specialty, education, city, serial_no_hc, gender
       FROM users WHERE role = 'lawyer' LIMIT 10`
    );
    return rows;
  } catch (_) {
    return [];
  }
}

function resolveContacts(keys = []) {
  const seen = new Set();
  const out = [];
  for (const key of keys) {
    const k = String(key || '').toLowerCase();
    if (!CONTACT_DIRECTORY[k] || seen.has(k)) continue;
    seen.add(k);
    out.push({ key: k, ...CONTACT_DIRECTORY[k] });
  }
  if (!out.length) {
    out.push({ key: 'police', ...CONTACT_DIRECTORY.police });
    out.push({ key: 'rescue', ...CONTACT_DIRECTORY.rescue });
  }
  return out;
}

async function enrichRoadmap(analysis, { gender, city }) {
  const isFemale = String(gender || '').toLowerCase() === 'female';
  const lawyers = isFemale ? await fetchFemaleLawyers() : await fetchGeneralLawyers();
  return {
    success: true,
    ...analysis,
    city: city || analysis.city || 'Punjab',
    gender: gender || 'not_specified',
    show_female_lawyers: isFemale,
    lawyers,
    relevant_contacts: resolveContacts(analysis.contact_keys || []),
    complaint_portal: {
      name: 'Wafaqi Mohtasib Online Complaint',
      url: MOHTASIB_COMPLAINT_URL,
      note:
        'Copy your draft first, then open the official form. A valid mobile number is required for SMS updates.',
    },
    generated_at: new Date().toISOString(),
  };
}

// Internal: called by n8n (no n8n recursion)
router.post('/roadmap/internal/analyze', async (req, res) => {
  try {
    const body = req.body || {};
    const problem = String(body.problem || body.description || '').trim();
    if (problem.length < 10) {
      return res.status(400).json({ success: false, message: 'problem required' });
    }
    const analysis = await generateLocalRoadmap({
      problem,
      city: body.city || 'Lahore',
      gender: body.gender || 'not_specified',
      userName: body.userName || body.user_name || 'User',
    });
    res.json({ success: true, ...analysis });
  } catch (err) {
    console.error('roadmap internal analyze:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/roadmap/generate', async (req, res) => {
  try {
    const body = req.body || {};
    const problem = String(body.problem || body.description || '').trim();
    const city = String(body.city || 'Lahore').trim();
    const gender = String(body.gender || 'not_specified').trim().toLowerCase();
    const userName = body.userName || body.user_name || 'User';
    const userId = body.userId || body.user_id || null;

    if (problem.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please describe your legal problem in more detail (at least a short paragraph).',
      });
    }

    const payload = { problem, city, gender, userName, userId };

    // Prefer n8n workflow when available
    let n8nResult = null;
    let n8nError = null;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 90000);
      const n8nRes = await fetch(config.n8nRoadmapWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const text = await n8nRes.text();
      try {
        n8nResult = text ? JSON.parse(text) : {};
      } catch {
        n8nResult = { raw: text };
      }
      if (!n8nRes.ok) {
        n8nError = n8nResult?.message || `n8n HTTP ${n8nRes.status}`;
      }
    } catch (err) {
      n8nError = err.name === 'AbortError' ? 'n8n timeout' : err.message;
      console.warn('n8n roadmap webhook failed:', n8nError);
    }

    if (!n8nError && n8nResult && (n8nResult.case_title || n8nResult.steps)) {
      const enriched = await enrichRoadmap(n8nResult, payload);
      return res.json({ ...enriched, mode: 'n8n' });
    }

    const analysis = await generateLocalRoadmap(payload);
    const enriched = await enrichRoadmap(analysis, payload);
    return res.json({
      ...enriched,
      mode: 'local',
      warning: n8nError ? `n8n unavailable (${n8nError}); generated by backend Gemini.` : undefined,
    });
  } catch (err) {
    console.error('roadmap generate error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
