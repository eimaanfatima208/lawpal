import { workflow, node, trigger, sticky, newCredential, expr } from '@n8n/workflow-sdk';

const webhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Document Upload',
    parameters: {
      httpMethod: 'POST',
      path: 'document-analyzer',
      responseMode: 'responseNode',
      options: {
        binaryData: true,
        binaryPropertyName: 'data',
        allowedOrigins: '*',
      },
    },
  },
});

const ocrRequest = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'OCR Space',
    parameters: {
      method: 'POST',
      url: 'https://api.ocr.space/parse/image',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      contentType: 'multipart-form-data',
      bodyParameters: {
        parameters: [
          { name: 'language', value: 'eng' },
          { name: 'isOverlayRequired', value: 'false' },
          { name: 'OCREngine', value: '2' },
          { name: 'scale', value: 'true' },
          { name: 'file', value: '={{ $binary.data }}' },
        ],
      },
      options: {
        timeout: 120000,
      },
    },
    credentials: {
      httpHeaderAuth: newCredential('OCR Space API Key'),
    },
  },
});

const extractText = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Extract OCR Text',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const item = $input.first();\nconst data = item.json;\nif (data.IsErroredOnProcessing) {\n  const msg = Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(' ') : (data.ErrorMessage || 'OCR failed');\n  throw new Error(msg);\n}\nconst text = (data.ParsedResults || []).map(p => p.ParsedText || '').filter(Boolean).join('\\n\\n').trim();\nif (!text) throw new Error('No text extracted from document');\nreturn [{ json: { documentText: text.slice(0, 120000) } }];",
    },
  },
});

const geminiRequest = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Gemini Analyze',
    parameters: {
      method: 'POST',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpQueryAuth',
      sendQuery: true,
      queryParameters: {
        parameters: [],
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('={{ JSON.stringify({ contents: [{ role: "user", parts: [{ text: "You are a legal document analyst for LawPal (Pakistan / Punjab focus). Return ONLY JSON with keys explanation, urdu, sections, glossary. sections = only document sections/clauses with explanations ({title, content}). glossary = only legal terms ({term, definition}). Do not mix them. Document:\\n" + $json.documentText }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 4096, responseMimeType: "application/json" } }) }}'),
      options: {
        timeout: 120000,
      },
    },
    credentials: {
      httpQueryAuth: newCredential('Gemini API Key'),
    },
  },
});

const parseGemini = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse Analysis',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const data = $input.first().json;\nconst raw = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();\nif (!raw) throw new Error('Empty Gemini response');\nlet cleaned = raw.replace(/^```(?:json)?\\\\s*/i, '').replace(/\\\\s*```$/, '');\nconst parsed = JSON.parse(cleaned);\nconst sections = (Array.isArray(parsed.sections) ? parsed.sections : []).map((s) => ({ title: String(s?.title || '').trim(), content: String(s?.content || '').trim() })).filter((s) => s.title && s.content);\nconst glossary = (Array.isArray(parsed.glossary) ? parsed.glossary : []).map((g) => ({ term: String(g?.term || '').trim(), definition: String(g?.definition || '').trim() })).filter((g) => g.term && g.definition);\nreturn [{ json: { success: true, explanation: parsed.explanation || '', urdu: parsed.urdu || '', sections, glossary } }];",
    },
  },
});

const respond = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond',
    parameters: {
      respondWith: 'json',
      responseBody: expr('={{ $json }}'),
      options: {
        responseCode: 200,
        responseHeaders: {
          entries: [
            { name: 'Access-Control-Allow-Origin', value: '*' },
          ],
        },
      },
    },
  },
});

const note = sticky(
  'LawPal Document Analyzer\n\n1. Credential "OCR Space API Key": Header Name=apikey, Value=your OCR.space key\n2. Credential "Gemini API Key": Name=key, Value=your Gemini key\n3. Activate workflow\n4. POST /webhook/document-analyzer with multipart file\n\nLawPal backend can also analyze locally; set USE_N8N_ANALYZE=true to proxy here.'
);

export default workflow('lawpal-document-analyzer', 'LawPal Document Analyzer')
  .add(note)
  .add(webhook)
  .to(ocrRequest)
  .to(extractText)
  .to(geminiRequest)
  .to(parseGemini)
  .to(respond);
