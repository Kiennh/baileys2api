const express = require('express');
const router = express.Router();

router.post('/webhook', (req, res) => {
    console.log('--- Webhook received ---');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('------------------------');
    res.status(200).send('Webhook received');
});

module.exports = router;
