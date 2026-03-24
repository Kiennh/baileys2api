# 📦 WhatsApp API Server (Baileys) + Dashboard

A full-featured WhatsApp integration service using **Baileys** that provides:
- REST API to send messages
- Webhook for incoming messages
- Real-time dashboard (QR login, chat monitoring)
- WebSocket (Socket.IO) for live updates

---

# 🚀 Features

## Core
- Connect to WhatsApp via QR code (multi-device)
- Send messages via REST API
- Receive messages via webhook
- Session persistence (no need to re-scan QR)

## Dashboard
- QR code login UI
- Connection status (connected/disconnected)
- Send messages from UI
- Real-time incoming messages

## Developer Friendly
- Modular architecture
- Easy to extend (bots, CRM, AI)
- Clean REST + WebSocket design

---

# 🧱 Tech Stack

## Backend
- Node.js (>= 18)
- Express.js
- Baileys (@whiskeysockets/baileys)
- Socket.IO
- Axios

## Frontend
- HTML / React (optional)
- Socket.IO client
- QRCode.js

---

# 📁 Project Structure

project-root/
├── src/
│   ├── app.js
│   ├── websocket/
│   │   └── socket.js
│   ├── whatsapp/
│   │   ├── client.js
│   │   ├── events.js
│   │   └── session.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── webhook.routes.js
│   ├── controllers/
│   ├── services/
│   └── config/
│
├── dashboard/
│   └── index.html
│
├── sessions/
├── .env
├── package.json
└── README.md

---

# ⚙️ Installation

## 1. Clone project
git clone <your-repo>
cd project-root

## 2. Install dependencies
npm install

## 3. Environment variables

Create .env file:

PORT=3000
WEBHOOK_URL=http://localhost:3000/api/webhook

---

# ▶️ Running the App

node src/app.js

Server will start at:
http://localhost:3000

---

# 🔐 WhatsApp Login (QR Flow)

## Step 1
Open dashboard:
dashboard/index.html

## Step 2
Scan QR code using WhatsApp:
- WhatsApp → Linked Devices → Link a Device

## Step 3
After scanning:
- Status becomes connected
- Session is saved in /sessions

---

# 🌐 API Documentation

## Base URL
http://localhost:3000/api

---

## Send Message

POST /messages/send

Request:
{
  "to": "849xxxxxxxxx@s.whatsapp.net",
  "message": "Hello from API"
}

Response:
{
  "success": true
}

---

## Login (Generate QR)

POST /auth/login

Response:
{
  "status": "QR generated"
}

---

## Logout (Reset Session)

POST /auth/logout

Response:
{
  "status": "logged out"
}

---

## Webhook Receiver

POST /webhook

Payload example:
{
  "event": "message.received",
  "data": {
    "from": "849xxxx@s.whatsapp.net",
    "message": {
      "conversation": "Hello"
    }
  }
}

---

# 🔌 WebSocket Events (Real-time)

- qr → QR code string
- status → connected / disconnected
- message → incoming message

---

# 🖥️ Dashboard Usage

Open:
dashboard/index.html

Features:
- Scan QR to login
- See connection status
- Send messages
- View incoming messages in real-time

---

# 🔄 Webhook Integration

Set your webhook in .env:

WEBHOOK_URL=https://your-domain.com/webhook

Events sent:
- message.received

---

# 🧪 Testing

curl -X POST http://localhost:3000/api/messages/send \
-H "Content-Type: application/json" \
-d '{
  "to": "849xxxxxxxxx@s.whatsapp.net",
  "message": "Test message"
}'

---

# 🔒 Notes & Limitations

- Uses WhatsApp Web (not official API)
- May break if WhatsApp updates protocol
- Avoid spam (risk of account ban)

---

# 🧠 Future Improvements

- Multi-session support
- Redis / DB storage
- Queue system (BullMQ)
- Multi-tenant SaaS
- AI chatbot integration

---

# 🐳 Docker (Optional)

Dockerfile:

FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/app.js"]

Run:

docker build -t whatsapp-api .
docker run -p 3000:3000 whatsapp-api

---

# 🤝 Contributing

PRs welcome.

---

# 📄 License

MIT

