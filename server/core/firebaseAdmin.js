const admin = require("firebase-admin");
const fs = require("fs");

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const raw = fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8");
    return JSON.parse(raw);
  }
  return null;
}

if (!admin.apps.length) {
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Missing Firebase service account. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH."
    );
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = { admin };
