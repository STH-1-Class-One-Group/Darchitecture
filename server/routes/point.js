const express = require("express");
const { getBalance, getLogs } = require("../core/point");
const { sendError } = require("../core/http");

const router = express.Router();

router.get("/balance", (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  Promise.resolve(getBalance(userId))
    .then((balance) => res.json({ balance }))
    .catch(() => sendError(res, 500));
});

router.get("/log", (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  Promise.resolve(getLogs(userId))
    .then((logs) => res.json({ logs }))
    .catch(() => sendError(res, 500));
});

module.exports = router;
