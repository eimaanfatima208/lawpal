# LawPal

**AI-powered legal assistance platform** that connects clients with lawyers, streamlines appointments and chat, and provides smart tools for document analysis, legal roadmaps, search, and awareness.

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-MySQL-777BB4?logo=php&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Overview

LawPal is a full-stack web application designed for clients, lawyers, and admins. It combines traditional legal-service workflows (registration, booking, messaging) with AI-assisted features such as document analysis and step-by-step legal roadmaps.

| Role | Capabilities |
|------|----------------|
| **Client** | Book appointments, chat with lawyers, analyze documents, generate legal roadmaps, track cases, browse templates, take quizzes |
| **Lawyer** | Manage appointment requests, chat with clients, update profile |
| **Admin** | User management and platform oversight |

> **Demo walkthrough:** see [DEMO.md](./DEMO.md)

---

## Features

- **Authentication** — Register / login with role-based dashboards (client, lawyer, admin)
- **Book Appointment** — Schedule consultations with lawyers and manage availability
- **Chat with Lawyer** — Real-time-style messaging with document upload (PDF, DOC, DOCX, TXT)
- **Women’s Legal Support** — Dedicated resources and lawyer discovery
- **AI Legal Roadmap** — Turn a legal problem into a structured action plan
- **Smart Document Analyzer** — Upload documents for explanations and section breakdowns
- **Legal Templates** — Common document templates for download
- **Case Tracking** — Monitor progress of active matters
- **Smart Legal Search** — Search acts, sections, and related legal material
- **Legal Quiz** — Interactive awareness quizzes

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Lucide icons, Recharts |
| Chat / API server | Node.js, Express, Multer, MySQL2 |
| Auth / PHP API | PHP (PDO), MySQL via XAMPP |
| Database | MySQL (`lawpal`) |
| Optional automation | n8n workflows (document analyzer, legal roadmap) |
| Optional AI | Google Gemini API, OCR.space |

---

## Project Structure

```
lawpal/
├── react-frontend/          # React + Vite SPA
├── lawpal-chat-backend/     # Express API (chat, uploads, AI routes) + serves built frontend
├── lawpal-backend/          # PHP auth/profile APIs + SQL schemas
├── scripts/                 # n8n workflow helpers & utilities
├── DEMO.md                  # Feature demo guide
├── START_APP.md             # Quick start notes
├── .env.example             # Environment variable template
└── package.json             # Root scripts (build + start)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL) — or any MySQL server
- Git

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/eimaanfatima208/lawpal.git
cd lawpal
```

### 2. Configure the database

1. Start **Apache** and **MySQL** in XAMPP.
2. Create the database and tables (phpMyAdmin or MySQL CLI):

```bash
# From project root — run both schemas
mysql -u root < lawpal-backend/schema.sql
mysql -u root < lawpal-backend/chat_schema.sql
```

Or paste the contents of `lawpal-backend/schema.sql` and `lawpal-backend/chat_schema.sql` into phpMyAdmin.

### 3. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your keys if you want AI features:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Document analyzer / roadmap AI |
| `OCR_SPACE_API_KEY` | OCR for scanned documents |
| `DB_*` | MySQL connection (defaults match XAMPP) |

PHP DB settings live in `lawpal-backend/db.php` (default: `root` / empty password / database `lawpal`).

### 4. Install dependencies

```bash
npm install
npm run install:all
```

### 5. Run the application

**Production-style (recommended for demo):** builds the React app and serves it with the Node API:

```bash
npm start
```

Open **http://localhost:3001**

**Development (hot reload):**

```bash
# Terminal 1 — API
npm run start:api

# Terminal 2 — Vite
cd react-frontend
npm run dev
```

Then open the Vite URL (usually **http://localhost:5173**). Ensure the chat API is reachable at port `3001`.

---

## API (Chat Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sendMessage` | Send a text message |
| POST | `/api/uploadDocument` | Upload a document |
| GET | `/api/getMessages/:userId` | Fetch conversation messages |
| GET | `/api/getChatHistory/:userId` | Chat list for the side panel |
| GET | `/api/users` | List users (start new chat) |

PHP endpoints under `lawpal-backend/` handle login, register, profile, and related auth flows (served by Apache under your XAMPP document root).

---

## Optional: Seed sample lawyers

```bash
node lawpal-backend/seed_lawyers.js
```

Default seeded lawyer password (if used): see script output / `Lawyer@123`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `node` not recognized | Install Node.js LTS and restart the terminal |
| Port 3001 in use | Stop other processes using that port |
| Chat / API errors | Use **http://localhost:3001** after `npm start`, not only the Apache PHP URL |
| Database connection failed | Confirm MySQL is running and schemas are imported |
| AI features empty | Set `GEMINI_API_KEY` (and optionally `OCR_SPACE_API_KEY`) in `.env` |

More detail: [START_APP.md](./START_APP.md)

---

## Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature/your-feature`)  
3. Commit and push  
4. Open a Pull Request  

---

## License

This project is available under the [MIT License](./LICENSE).

---

## Disclaimer

LawPal is a software demonstration / academic project. It does **not** replace professional legal advice. Always consult a qualified lawyer for real legal matters.
