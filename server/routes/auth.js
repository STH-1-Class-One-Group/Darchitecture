const express = require("express");
const { db } = require("../db/firebase");

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "missing_fields" });
  }
  const userId = `user_${Date.now()}`;
  db.users.set(userId, { id: userId, email, pointBalance: 0 });
  return res.json({ token: "dev-token", userId });
});

router.post("/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "missing_email" });
  }
  const existing = Array.from(db.users.values()).find((u) => u.email === email);
  const userId = existing ? existing.id : `user_${Date.now()}`;
  if (!existing) {
    db.users.set(userId, { id: userId, email, pointBalance: 0 });
  }
  return res.json({ token: "dev-token", userId });
});

module.exports = router;
