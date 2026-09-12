const path = require('path');
const fs = require('fs');

// Load optional .env from chat-backend or project root (no extra dependency)
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(__dirname, '..', '.env'));

module.exports = {
  port: Number(process.env.PORT) || 3001,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lawpal'
  },
  maxFileSize: 5 * 1024 * 1024, // 5MB
  uploadPath: path.join(__dirname, 'uploads'),
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  // Document Analyzer APIs — set via .env (see .env.example)
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  ocrSpaceApiKey: process.env.OCR_SPACE_API_KEY || '',
  // Forward Document Analyzer to n8n (optional)
  n8nAnalyzeWebhook:
    process.env.N8N_ANALYZE_WEBHOOK || 'http://localhost:5678/webhook/document-analyzer',
  useN8n: process.env.USE_N8N_ANALYZE !== 'false',
  // Legal Roadmap Generator → n8n workflow (optional)
  n8nRoadmapWebhook:
    process.env.N8N_ROADMAP_WEBHOOK || 'http://localhost:5678/webhook/legal-roadmap',
};
