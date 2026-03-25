const { getGroups, sendMessage } = require('../whatsapp/client');

async function list(req, res) {
    const { accountId } = req.query;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }

    try {
        const groups = await getGroups(accountId);
        res.json({ groups, accountId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function sendGroupMessage(req, res) {
    const { accountId, groupId, message } = req.body;

    if (!accountId || !groupId || !message) {
        return res.status(400).json({ error: 'accountId, groupId and message are required' });
    }

    if (!groupId.endsWith('@g.us')) {
        return res.status(400).json({ error: 'Invalid group ID' });
    }

    try {
        await sendMessage(accountId, groupId, message);
        res.json({ success: true, accountId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    list,
    sendGroupMessage
};
