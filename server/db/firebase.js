const crypto = require("crypto");
const admin = require("firebase-admin");

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || "ta-cu-local";
  const serviceAccount = loadServiceAccount();

  const options = { projectId };
  if (serviceAccount) {
    options.credential = admin.credential.cert(serviceAccount);
  }

  admin.initializeApp(options);
}

const db = admin.firestore();
const auth = admin.auth();
const { FieldValue } = admin.firestore;

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

module.exports = {
  admin,
  db,
  auth,
  FieldValue,
  uid
};
