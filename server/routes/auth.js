const express = require('express');
const { db, generateId, getOrCreateUser } = require('../db/firebase');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, region } = req.body || {};
  const id = generateId('user');
  const user = getOrCreateUser(id, { name, email, region });
  db.users.set(id, user);
  res.json({ user });
});

router.post('/login', (req, res) => {
  const { email } = req.body || {};
  const user = Array.from(db.users.values()).find((item) => item.profile.email === email);
  if (!user) {
    return res.status(404).json({ error: 'user_not_found' });
  }
  return res.json({ user });
});

module.exports = router;
