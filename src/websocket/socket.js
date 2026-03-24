const { getQR, getStatus } = require('../whatsapp/client');

function initWebSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected to dashboard');

        // Send current status and QR on connect
        socket.emit('status', getStatus());
        const qr = getQR();
        if (qr) {
            socket.emit('qr', qr);
        }

        socket.on('disconnect', () => {
            console.log('User disconnected from dashboard');
        });
    });
}

module.exports = { initWebSocket };
