# How to Start the LawPal App

> Full setup, features, and architecture: see [README.md](./README.md)  
> Demo script for presentations: see [DEMO.md](./DEMO.md)

## Prerequisites

1. **XAMPP**: Start **Apache** and **MySQL** (for login, register, and database)
2. **Node.js**: Install from https://nodejs.org/ (LTS) – make sure "Add to PATH" is checked

## One-Command Start (Backend + Frontend)

1. Open PowerShell or Command Prompt
2. Go to the project folder (adjust path if needed):
   ```bash
   cd "C:\xampp\htdocs\lawpal - AI Automation"
   ```

3. First time only – install all dependencies:
   ```bash
   npm install
   npm run install:all
   ```

4. Copy environment template and add API keys if needed:
   ```bash
   copy .env.example .env
   ```

5. Start everything (chat backend + built React frontend):
   ```bash
   npm start
   ```

6. You should see:
   - `LawPal running at http://localhost:3001`

7. Open your browser: **http://localhost:3001**

This starts both the chat backend and React app together, so appointments and chat work correctly.

---

## Alternative: Start Separately

If you prefer to run them in separate terminals:

**Terminal 1 – Chat backend:**
```bash
cd lawpal-chat-backend
npm start
```

**Terminal 2 – React frontend (with hot reload):**
```bash
cd react-frontend
npm run dev
```
Then open **http://localhost:5173** (API is proxied to the backend on 3001 when configured).

---

## Troubleshooting

- **"node is not recognized"**: Install Node.js and restart your terminal
- **Port 3001 already in use**: Close other apps using that port, or stop any existing LawPal processes
- **"Could not connect to server"**: Make sure the chat backend is running (you should see "LawPal running at http://localhost:3001" in the terminal)
- **Chat messages not showing**:
  1. **Use the correct URL**: Open the app at **http://localhost:3001** (after `npm start` from the project root). If you open the app from XAMPP (e.g. http://localhost/...) instead, chat API calls go to Apache and fail. Either use http://localhost:3001, or create `react-frontend/.env` with `VITE_CHAT_API_URL=http://localhost:3001/api` and ensure the Node chat backend is running on port 3001.
  2. **Chat backend must be running**: Start with `npm start` from the project folder, or run `node lawpal-chat-backend/server.js` in a separate terminal.
  3. **Database**: Ensure the `chat` table exists (run `lawpal-backend/chat_schema.sql` in MySQL/phpMyAdmin if needed).
  4. **No messages yet**: If you just opened a conversation, the list will be empty until someone sends a message. As a client, you can send the first message.
