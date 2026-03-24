const { getConfig, updateConfig } = require('../utils/config');

function getSettings(req, res) {
    try {
        const config = getConfig();
        res.json({ webhookUrl: config.webhookUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function updateSettings(req, res) {
    try {
        const { webhookUrl } = req.body;
        if (typeof webhookUrl !== 'string') {
            return res.status(400).json({ error: 'webhookUrl must be a string' });
        }
        const updatedConfig = updateConfig({ webhookUrl });
        res.json({ success: true, webhookUrl: updatedConfig.webhookUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function handleWebhook(req, res) {
    console.log('--- Webhook received ---');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('------------------------');
    res.status(200).send('Webhook received');
}

module.exports = {
    getSettings,
    updateSettings,
    handleWebhook
};
