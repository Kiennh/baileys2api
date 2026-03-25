require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

const { connectToWhatsApp } = require('./whatsapp/client');
const { initWebSocket } = require('./websocket/socket');
const { getAllConfig } = require('./utils/config');

const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const groupRoutes = require('./routes/group.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Share io instance with controllers
app.set('io', io);

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

    // Initialize all configured accounts
    const config = getAllConfig();
    const accountIds = Object.keys(config.accounts);
    console.log(`Initializing ${accountIds.length} accounts...`);

    for (const accountId of accountIds) {
        try {
            await connectToWhatsApp(io, accountId);
            console.log(`Account ${accountId} initialized`);
        } catch (error) {
            console.error(`Failed to initialize account ${accountId}:`, error);
        }
    }
});
