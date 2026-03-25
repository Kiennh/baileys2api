const { logout, getStatus, connectToWhatsApp } = require('../whatsapp/client');
const { updateAccountConfig, getAllConfig, deleteAccountConfig } = require('../utils/config');

async function login(req, res) {
    const { accountId } = req.body;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }

    try {
        // Initialize account if not already in config
        updateAccountConfig(accountId, {});
        const io = req.app.get('io');
        await connectToWhatsApp(io, accountId);
        res.json({ status: 'QR generated', accountId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function doLogout(req, res) {
    const { accountId } = req.body;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }

    try {
        await logout(accountId);
        res.json({ status: 'logged out', accountId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteAccount(req, res) {
    const { accountId } = req.params;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }

    try {
        await logout(accountId);
        deleteAccountConfig(accountId);
        res.json({ status: 'deleted', accountId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function getStatusInfo(req, res) {
    const { accountId } = req.query;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }
    res.json({ status: getStatus(accountId), accountId });
}

function listAccounts(req, res) {
    const config = getAllConfig();
    const accounts = Object.keys(config.accounts).map(id => ({
        id,
        status: getStatus(id)
    }));
    res.json({ accounts });
}

module.exports = {
    login,
    doLogout,
    deleteAccount,
    getStatusInfo,
    listAccounts
};
