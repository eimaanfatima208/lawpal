import { workflow, node, trigger, expr } from '@n8n/workflow-sdk';

/**
 * LawPal Legal Roadmap Generator — n8n workflow source
 * Webhook: POST /webhook/legal-roadmap
 * Import companion JSON: scripts/lawpal-legal-roadmap.workflow.json
 */

const webhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Roadmap Webhook',
    parameters: {
      httpMethod: 'POST',
      path: 'legal-roadmap',
      responseMode: 'responseNode',
      options: {},
    },
  },
});

const buildPrompt = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Prompt',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const body = $input.first().json;
const problem = String(body.problem || body.description || '').trim();
if (problem.length < 10) {
  throw new Error('Please describe your legal problem in more detail (at least a short paragraph).');
}
const city = String(body.city || 'Lahore').trim();
const gender = String(body.gender || 'not_specified').trim().toLowerCase();
const userName = String(body.userName || body.user_name || 'User').trim();

const prompt = \`You are LawPal's Pakistan / Punjab legal roadmap assistant.
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

User name: \${userName}
User gender: \${gender}
City: \${city}
User problem:
\${problem}\`;

return [{
  json: {
    problem,
    city,
    gender,
    userName,
    geminiBody: {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    },
  },
}];`,
    },
  },
});

const geminiGenerate = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'Gemini Generate',
    parameters: {
      method: 'POST',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      sendQuery: true,
      queryParameters: {
        parameters: [
          {
            name: 'key',
            // Set your Gemini API key in n8n credentials / env (do not commit real keys)
            value: 'YOUR_GEMINI_API_KEY',
          },
        ],
      },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: expr('{{ $json.geminiBody }}'),
      options: { timeout: 120000 },
    },
  },
});

const parseRoadmap = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Roadmap',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const data = $input.first().json;
const raw = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
if (!raw) throw new Error('Empty Gemini response');

function repairJsonText(text) {
  let s = String(text || '').trim();
  s = s.replace(/,\\s*([}\\]])/g, '$1');
  let inString = false, escaped = false, out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped) { out += ch; escaped = false; continue; }
      if (ch === '\\\\') { out += ch; escaped = true; continue; }
      if (ch === '"') { inString = false; out += ch; continue; }
      if (ch === '\\n' || ch === '\\r' || ch === '\\t') { out += ' '; continue; }
      out += ch;
    } else {
      if (ch === '"') inString = true;
      out += ch;
    }
  }
  return out;
}

function parseGeminiJson(text) {
  const cleaned = String(text || '').replace(/^\`\`\`(?:json)?\\s*/i, '').replace(/\\s*\`\`\`$/, '').trim();
  const candidates = [cleaned, repairJsonText(cleaned)];
  for (const candidate of candidates) {
    try { return JSON.parse(candidate); } catch (_) {}
    const start = candidate.indexOf('{');
    if (start === -1) continue;
    let depth = 0, inString = false, escaped = false;
    for (let i = start; i < candidate.length; i++) {
      const ch = candidate[i];
      if (escaped) escaped = false;
      else if (ch === '\\\\') escaped = true;
      else if (ch === '"') inString = !inString;
      else if (!inString) {
        if (ch === '{') depth++;
        if (ch === '}') {
          depth--;
          if (depth === 0) {
            try { return JSON.parse(candidate.slice(start, i + 1)); } catch (_) { break; }
          }
        }
      }
    }
  }
  throw new Error('Could not parse Gemini JSON');
}

const parsed = parseGeminiJson(raw);
if (!parsed.case_title && !parsed.steps) {
  throw new Error('Gemini returned incomplete roadmap');
}
return [{ json: parsed }];`,
    },
  },
});

const respond = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.1,
  config: {
    name: 'Respond',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ $json }}'),
      options: {
        responseCode: 200,
        responseHeaders: {
          entries: [{ name: 'Access-Control-Allow-Origin', value: '*' }],
        },
      },
    },
  },
});

export default workflow('LawPal Legal Roadmap Generator', {
  version: 1,
})
  .add(webhook)
  .to(buildPrompt)
  .to(geminiGenerate)
  .to(parseRoadmap)
  .to(respond);
