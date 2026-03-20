const express = require("express");
const { getBalance, getLogs } = require("../core/point");

const router = express.Router();

router.get("/balance", (req, res) => {
  const userId = req.user?.uid || req.query.userId;
  if (!userId) return res.json({ balance: 0 });
  Promise.resolve(getBalance(userId))
    .then((balance) => res.json({ balance }))
    .catch(() => res.status(500).json({ error: "point_balance_failed" }));
});

router.get("/log", (req, res) => {
  const userId = req.user?.uid || req.query.userId;
  if (!userId) return res.json({ logs: [] });
  Promise.resolve(getLogs(userId))
    .then((logs) => res.json({ logs }))
    .catch(() => res.status(500).json({ error: "point_log_failed" }));
});

module.exports = router;
