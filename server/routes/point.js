const express = require('express');
const pointCore = require('../core/point');

const router = express.Router();

router.get('/balance', (req, res) => {
  const { userId } = req.query || {};
  const balance = pointCore.getBalance(userId);
  res.json({ balance });
});

router.get('/log', (req, res) => {
  const { userId } = req.query || {};
  const logs = pointCore.getLogs(userId);
  res.json({ logs });
});

module.exports = router;
