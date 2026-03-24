require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

const { connectToWhatsApp } = require('./whatsapp/client');
const { initWebSocket } = require('./websocket/socket');

const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const groupRoutes = require('./routes/group.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static dashboard
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api', webhookRoutes);

// Root
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // Init WebSocket
    initWebSocket(io);

    // Start WhatsApp client
    try {
        await connectToWhatsApp(io);
    } catch (error) {
        console.error('Failed to connect to WhatsApp:', error);
    }
});
