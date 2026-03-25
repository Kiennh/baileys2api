const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/logout', authController.doLogout);
router.get('/status', authController.getStatusInfo);
router.get('/accounts', authController.listAccounts);

module.exports = router;
