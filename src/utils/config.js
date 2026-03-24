const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config.json');

const defaultConfig = {
    webhookUrl: process.env.WEBHOOK_URL || ''
};

function getConfig() {
    if (!fs.existsSync(configPath)) {
        return defaultConfig;
    }
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading config file:', error);
        return defaultConfig;
    }
}

function updateConfig(newConfig) {
    try {
        const currentConfig = getConfig();
        const updatedConfig = { ...currentConfig, ...newConfig };
        fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
        return updatedConfig;
    } catch (error) {
        console.error('Error updating config file:', error);
        throw error;
    }
}

module.exports = {
    getConfig,
    updateConfig
};
