# LawPal Chat Backend

Node.js Express API for LawPal chat and document upload.

## Setup

1. **Run the chat schema** (in phpMyAdmin or MySQL):
   ```sql
   SOURCE path/to/lawpal-backend/chat_schema.sql
   ```
   Or run the contents of `../lawpal-backend/chat_schema.sql` in your MySQL client.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   API runs at http://localhost:3001

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/sendMessage | Send text message |
| POST | /api/uploadDocument | Upload document (PDF, DOC, DOCX, TXT) |
| GET | /api/getMessages/:userId?otherUserId=&appointmentId= | Get messages between users |
| GET | /api/getChatHistory/:userId | Get chat list for side panel |
| GET | /api/users | Get all users (for new chat) |

## Config

Edit `config.js` for database credentials, port, max file size.
