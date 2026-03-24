const { sendMessage } = require('../whatsapp/client');

async function send(req, res) {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'to and message are required' });
    }

    try {
        await sendMessage(to, message);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    send
};
