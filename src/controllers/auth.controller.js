const { logout, getStatus } = require('../whatsapp/client');

async function login(req, res) {
    // Baileys automatically handles QR generation on startup or when disconnected
    res.json({ status: 'QR generated' });
}

async function doLogout(req, res) {
    try {
        await logout();
        res.json({ status: 'logged out' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function getStatusInfo(req, res) {
    res.json({ status: getStatus() });
}

module.exports = {
    login,
    doLogout,
    getStatusInfo
};
