import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { ensureUserDocument, getUserDocument, updateUserDocument } from "../core/firestoreStore.js";

const auth = new Hono();

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

auth.post("/register", (c) => c.json({ error: "use_firebase_auth" }, 410));
auth.post("/login", (c) => c.json({ error: "use_firebase_auth" }, 410));

auth.use("/me", authRequired);

auth.get("/me", async (c) => {
  const user = c.get("user");
  if (!user?.uid) return c.json({ error: "missing_user" }, 401);

  await ensureUserDocument(c.env, user.uid, {
    name: user.name,
    email: user.email
  });

  const doc = await getUserDocument(c.env, user.uid);
  return c.json({ user: normalizeUser(doc) });
});

auth.patch("/me", async (c) => {
  const user = c.get("user");
  if (!user?.uid) return c.json({ error: "missing_user" }, 401);

  const body = await c.req.json().catch(() => ({}));
  const patch = {};
  if (body?.name !== undefined) patch.name = body.name;
  if (body?.email !== undefined) patch.email = body.email;
  if (body?.region !== undefined) patch.region = body.region;

  await ensureUserDocument(c.env, user.uid, {
    name: user.name,
    email: user.email
  });

  await updateUserDocument(c.env, user.uid, patch);
  const doc = await getUserDocument(c.env, user.uid);
  return c.json({ user: normalizeUser(doc) });
});

export default auth;
