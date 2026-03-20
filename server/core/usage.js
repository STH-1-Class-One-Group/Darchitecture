const { uid } = require("../db/firebase");
const { COLLECTIONS, ensureUserDocument, listCollectionByUser, serverTimestamp, usageLogRef } = require("./firestoreStore");

async function logUsage({ userId, action }) {
  await ensureUserDocument(userId);

  const logId = uid("usage");
  const log = {
    id: logId,
    usageID: logId,
    userId,
    action,
    loggedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };

  await usageLogRef(logId).set(log);
  return log;
}

async function listUsageLogs(userId) {
  return listCollectionByUser(COLLECTIONS.usageLogs, userId, "loggedAt");
}

module.exports = {
  logUsage,
  listUsageLogs
};
