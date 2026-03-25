const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/accounts', authController.listAccounts);
router.post('/accounts', authController.addAccount);
router.post('/logout', authController.doLogout);
router.get('/:accountId/status', authController.getStatusInfo);
router.get('/:accountId/qr', authController.getQRCode);
router.delete('/:accountId', authController.deleteAccount);

module.exports = router;
