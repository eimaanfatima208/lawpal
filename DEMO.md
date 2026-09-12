# LawPal — Demo Guide

This guide walks through a professional demo of LawPal for stakeholders, instructors, or portfolio reviewers.

**App URL (after `npm start`):** http://localhost:3001

---

## Demo setup (5 minutes)

1. Start **XAMPP** → Apache + MySQL  
2. Ensure database `lawpal` exists (run `lawpal-backend/schema.sql` and `lawpal-backend/chat_schema.sql`)  
3. From the project root:

```bash
npm install
npm run install:all
cp .env.example .env   # add GEMINI_API_KEY for AI demos
npm start
```

4. Open http://localhost:3001  

Optional: `node lawpal-backend/seed_lawyers.js` to populate sample lawyers.

---

## Suggested demo script (10–12 minutes)

### 1. Landing & registration (1 min)

- Open the login page and highlight the **LawPal** brand.
- Register a **client** account (or log in with an existing one).
- Mention role-based access: **client**, **lawyer**, **admin**.

### 2. Client dashboard (1 min)

- Show the feature grid: appointments, chat, women’s support, roadmap, document analyzer, templates, case tracking, search, quiz.
- Emphasize one hub for legal workflows + AI tools.

### 3. Book an appointment (2 min)

- Open **Book Appointment**.
- Select a lawyer, pick a date/time, submit a request.
- Point out availability checks and status (pending / approved / cancelled).

### 4. Chat with a lawyer (2 min)

- Open **Chat with Lawyer**.
- Send a message and (optional) upload a small PDF/TXT.
- Switch to a **lawyer** account (or second browser/session) to show the reply flow.

### 5. Women’s Legal Support (1 min)

- Open **Women’s Legal Support**.
- Show dedicated messaging, lawyer discovery, and helpline-style resources.

### 6. AI Legal Roadmap (2 min) — *needs API key*

- Open **Legal Roadmap**.
- Enter a sample problem (e.g. workplace harassment complaint, tenancy dispute).
- Generate a step-by-step plan: sections, documents, contacts, complaint draft.
- Note: requires `GEMINI_API_KEY` in `.env` (and n8n if you enable webhook mode).

### 7. Document Analyzer (2 min) — *needs API key*

- Open **Document Analyzer**.
- Upload a short legal PDF or text file.
- Show explanation / section breakdown output.

### 8. Supporting tools (1–2 min)

Quickly click through:

| Feature | What to say |
|---------|-------------|
| **Legal Templates** | Ready-to-use drafts for common needs |
| **Case Tracking** | Status visibility for ongoing matters |
| **Legal Search** | Faster research across acts / sections |
| **Legal Quiz** | Public awareness and learning |

### 9. Lawyer / admin views (optional, 1 min)

- Log in as **lawyer** → appointments + chat.
- Log in as **admin** → user management overview.

---

## Sample talking points

- **Problem:** Legal help is fragmented — booking, messaging, documents, and research live in different places.  
- **Solution:** LawPal unifies client–lawyer workflows and adds AI for first-pass understanding and planning.  
- **Stack:** React (Vite) frontend, Express chat/AI API, PHP + MySQL for auth, optional n8n automation.  
- **Safety:** AI output is assistive only; users should still consult licensed professionals.

---

## Demo checklist

- [ ] MySQL schemas imported  
- [ ] `npm start` shows `LawPal running at http://localhost:3001`  
- [ ] At least one client and one lawyer account  
- [ ] (Optional) Seeded lawyers  
- [ ] (Optional) `GEMINI_API_KEY` set for AI features  
- [ ] Browser open at http://localhost:3001  

---

## Recording a video demo

Recommended length: **3–5 minutes**.

1. Screen-record the flow above (skip admin if short on time).  
2. Keep narration focused on user value, not every UI control.  
3. Upload the video to YouTube/Drive (unlisted is fine) and add the link here:

```text
Demo video: <paste link>
```

Screenshots (optional): place images under `docs/screenshots/` and reference them in the root [README.md](./README.md).
