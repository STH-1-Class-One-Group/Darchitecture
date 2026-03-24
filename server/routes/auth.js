const express = require("express");
const { verifyFirebaseToken } = require("../core/authMiddleware");
const { sendError } = require("../core/http");
const { ensureUserDocument, getUserDocument, updateUserDocument } = require("../core/firestoreStore");

const router = express.Router();

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    userId: user.id,
    name: user.name || "",
    email: user.email || "",
    region: user.region || "",
    pointBalance: user.pointBalance || 0,
    totalCarbonReductionKg: user.totalCarbonReductionKg || 0,
    totalBikeDistanceKm: user.totalBikeDistanceKm || 0,
    totalUsageTimeMin: user.totalUsageTimeMin || 0,
    reportIds: user.reportIds || [],
    quizIds: user.quizIds || []
  };
}

router.post("/register", async (req, res) => {
  return sendError(res, 410, "GONE", "Use Firebase Auth instead.");
});

router.post("/login", async (req, res) => {
  return sendError(res, 410, "GONE", "Use Firebase Auth instead.");
});

router.get("/me", verifyFirebaseToken, async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  await ensureUserDocument(userId, {
    name: req.user?.name || req.user?.displayName || "",
    email: req.user?.email || ""
  });

  const user = await getUserDocument(userId);
  return res.json({ user: normalizeUser(user) });
});

router.patch("/me", verifyFirebaseToken, async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  const patch = {};
  if (req.body?.name !== undefined) patch.name = req.body.name;
  if (req.body?.email !== undefined) patch.email = req.body.email;
  if (req.body?.region !== undefined) patch.region = req.body.region;

  await ensureUserDocument(userId, {
    name: req.user?.name || req.user?.displayName || "",
    email: req.user?.email || ""
  });

  await updateUserDocument(userId, patch);
  const user = await getUserDocument(userId);
  return res.json({ user: normalizeUser(user) });
});

module.exports = router;
