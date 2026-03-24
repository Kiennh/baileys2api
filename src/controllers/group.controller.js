const { getGroups, sendMessage } = require('../whatsapp/client');

async function list(req, res) {
    try {
        const groups = await getGroups();
        res.json({ groups });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function sendGroupMessage(req, res) {
    const { groupId, message } = req.body;

    if (!groupId || !message) {
        return res.status(400).json({ error: 'groupId and message are required' });
    }

    if (!groupId.endsWith('@g.us')) {
        return res.status(400).json({ error: 'Invalid group ID' });
    }

    try {
        await sendMessage(groupId, message);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    list,
    sendGroupMessage
};
