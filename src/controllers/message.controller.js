const { sendMessage } = require('../whatsapp/client');

async function send(req, res) {
    const { accountId, to, message } = req.body;

    if (!accountId || !to || !message) {
        return res.status(400).json({ error: 'accountId, to and message are required' });
    }

    try {
        await sendMessage(accountId, to, message);
        res.json({ success: true, accountId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    send
};
