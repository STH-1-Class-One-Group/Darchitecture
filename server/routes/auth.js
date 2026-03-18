const express = require("express");
const { auth, db } = require("../db/firebase");

const router = express.Router();

async function syncUserFromToken(idToken) {
  const decoded = await auth.verifyIdToken(idToken);
  const userId = decoded.uid;
  const ref = db.collection("users").doc(userId);
  const snap = await ref.get();
  const existing = snap.exists ? snap.data() : {};
  const profile = {
    id: userId,
    email: decoded.email || existing.email || "",
    name: decoded.name || decoded.email || existing.name || "사용자",
    photoURL: decoded.picture || existing.photoURL || "",
    provider: decoded.firebase?.sign_in_provider || existing.provider || "google.com",
    updatedAt: Date.now()
  };

  if (!snap.exists) {
    profile.region = null;
    profile.pointBalance = 0;
  }

  await ref.set(profile, { merge: true });
  const latest = await ref.get();
  return latest.data() || profile;
}

router.post("/login", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "missing_token" });
  }

  try {
    const profile = await syncUserFromToken(idToken);
    return res.json({ user: profile });
  } catch (error) {
    return res.status(401).json({ error: "invalid_token" });
  }
});

router.post("/register", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "missing_token" });
  }

  try {
    const profile = await syncUserFromToken(idToken);
    return res.json({ user: profile });
  } catch (error) {
    return res.status(401).json({ error: "invalid_token" });
  }
});

router.patch("/profile", async (req, res) => {
  const { userId, region } = req.body;
  if (!userId || !region) {
    return res.status(400).json({ error: "missing_fields" });
  }

  await db.collection("users").doc(userId).set(
    {
      region,
      updatedAt: Date.now()
    },
    { merge: true }
  );

  const snap = await db.collection("users").doc(userId).get();
  return res.json({ user: snap.data() || null });
});

module.exports = router;
