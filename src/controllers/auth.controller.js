const { logout, getStatus, connectToWhatsApp, getQR } = require('../whatsapp/client');
const { updateAccountConfig, getAllConfig, deleteAccountConfig } = require('../utils/config');

async function addAccount(req, res) {
    const { accountId } = req.body;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }

    try {
        // Initialize account if not already in config
        updateAccountConfig(accountId, {});
        const io = req.app.get('io');
        // This will trigger the connection and QR generation in background
        connectToWhatsApp(io, accountId);
        res.json({ status: 'account added', accountId });
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
    const { accountId } = req.params;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }
    res.json({ status: getStatus(accountId), accountId });
}

function getQRCode(req, res) {
    const { accountId } = req.params;
    if (!accountId) {
        return res.status(400).json({ error: 'accountId is required' });
    }
    const qr = getQR(accountId);
    if (!qr) {
        return res.json({ qr: null, status: getStatus(accountId) });
    }
    res.json({ qr, status: getStatus(accountId) });
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
    addAccount,
    doLogout,
    deleteAccount,
    getStatusInfo,
    getQRCode,
    listAccounts
};
