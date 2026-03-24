const axios = require('axios');
require('dotenv').config();

async function handleMessages(m, sock, io) {
    if (m.type !== 'notify') return;

    for (const msg of m.messages) {
        if (!msg.key.fromMe && msg.message) {
            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const isGroup = from.endsWith('@g.us');

            if (text) {
                console.log(`Received ${isGroup ? 'group' : 'direct'} message from ${from}: ${text}`);

                // Emit to dashboard
                if (io) {
                    io.emit('message', {
                        from,
                        text,
                        isGroup,
                        participant: isGroup ? msg.key.participant : null
                    });
                }

                // Send to webhook
                const webhookUrl = process.env.WEBHOOK_URL;
                if (webhookUrl) {
                    try {
                        await axios.post(webhookUrl, {
                            event: 'message.received',
                            data: {
                                from,
                                isGroup,
                                participant: msg.key.participant,
                                message: msg.message
                            }
                        });
                    } catch (error) {
                        console.error('Webhook error:', error.message);
                    }
                }
            }
        }
    }
}

module.exports = {
    handleMessages
};
