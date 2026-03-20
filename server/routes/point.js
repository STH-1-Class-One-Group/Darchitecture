const express = require("express");
const { getBalance, getLogs } = require("../core/point");

const router = express.Router();

router.get("/balance", (req, res) => {
  const userId = req.user?.uid || req.query.userId;
  if (!userId) return res.json({ balance: 0 });
  return res.json({ balance: getBalance(userId) });
});

router.get("/log", (req, res) => {
  const userId = req.user?.uid || req.query.userId;
  if (!userId) return res.json({ logs: [] });
  return res.json({ logs: getLogs(userId) });
});

module.exports = router;
