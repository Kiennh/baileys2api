const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Existing webhook receiver
router.post('/webhook', webhookController.handleWebhook);

// Webhook settings
router.get('/settings/webhook', webhookController.getSettings);
router.post('/settings/webhook', webhookController.updateSettings);

module.exports = router;
