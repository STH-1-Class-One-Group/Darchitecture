const express = require("express");
const { logUsage } = require("../core/usage");
const { sendError } = require("../core/http");

const router = express.Router();

router.post("/log", (req, res) => {
  const userId = req.user?.uid;
  const { action } = req.body;

  if (!userId) return sendError(res, 401);
  if (!action) return sendError(res, 400, "BAD_REQUEST", "Missing action.");

  Promise.resolve(logUsage({ userId, action }))
    .then((log) => res.json({ logged: log.id }))
    .catch(() => sendError(res, 500));
});

module.exports = router;
