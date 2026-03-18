const express = require("express");
const { logUsage } = require("../core/usage");

const router = express.Router();

router.post("/log", (req, res) => {
  const { userId, action } = req.body;
  if (!userId || !action) return res.status(400).json({ error: "missing_fields" });
  const log = logUsage({ userId, action });
  return res.json({ logged: log.id });
});

module.exports = router;
