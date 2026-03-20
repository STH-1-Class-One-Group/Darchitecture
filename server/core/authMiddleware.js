const { admin } = require("./firebaseAdmin");

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "invalid_token" });
  }
}

module.exports = { verifyFirebaseToken };
