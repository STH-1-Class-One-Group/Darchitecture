const express = require('express');
const usageCore = require('../core/usage');

const router = express.Router();

router.post('/log', (req, res) => {
  const log = usageCore.logUsage(req.body || {});
  res.json({ log });
});

module.exports = router;
