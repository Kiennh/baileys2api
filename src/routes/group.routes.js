const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

router.get('/list', groupController.list);
router.post('/send', groupController.sendGroupMessage);

module.exports = router;
