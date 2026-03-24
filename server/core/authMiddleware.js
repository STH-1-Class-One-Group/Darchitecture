const { admin } = require("./firebaseAdmin");
const { sendError } = require("./http");

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return sendError(res, 401);
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = decoded;
    return next();
  } catch (error) {
    return sendError(res, 401);
  }
}

module.exports = { verifyFirebaseToken };
