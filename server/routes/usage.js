const express = require("express");
const { logUsage } = require("../core/usage");

const router = express.Router();

router.post("/log", (req, res) => {
  const userId = req.user?.uid || req.body.userId;
  const { action } = req.body;
  if (!userId || !action) return res.status(400).json({ error: "missing_fields" });
  Promise.resolve(logUsage({ userId, action }))
    .then((log) => res.json({ logged: log.id }))
    .catch(() => res.status(500).json({ error: "usage_log_failed" }));
});

module.exports = router;
