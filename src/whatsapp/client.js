const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

let sock;
let qr;
let status = 'disconnected';

const logger = pino({ level: 'info' });

async function connectToWhatsApp(io) {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../../sessions'));
    const { version, isLatest } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        logger,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr: newQr } = update;

        if (newQr) {
            qr = newQr;
            if (io) io.emit('qr', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ?
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;

            status = 'disconnected';
            if (io) io.emit('status', status);

            if (shouldReconnect) {
                connectToWhatsApp(io);
            }
        } else if (connection === 'open') {
            status = 'connected';
            qr = null;
            if (io) io.emit('status', status);
            console.log('Opened connection');
        }
    });

    // Handle messages
    const { handleMessages } = require('./events');
    sock.ev.on('messages.upsert', async (m) => {
        await handleMessages(m, sock, io);
    });

    return sock;
}

function getStatus() {
    return status;
}

function getQR() {
    return qr;
}

async function logout() {
    if (sock) {
        await sock.logout();
        sock = null;
        status = 'disconnected';
        qr = null;
        // Clear session folder
        const sessionPath = path.join(__dirname, '../../sessions');
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
    }
}

async function sendMessage(to, message) {
    if (!sock || status !== 'connected') {
        throw new Error('WhatsApp not connected');
    }
    return await sock.sendMessage(to, { text: message });
}

module.exports = {
    connectToWhatsApp,
    getStatus,
    getQR,
    logout,
    sendMessage,
    getSocket: () => sock
};
