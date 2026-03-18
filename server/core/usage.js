const { db, uid } = require("../db/firebase");

async function logUsage({ userId, action }) {
  const logId = uid("usage");
  const log = {
    id: logId,
    userId,
    action,
    loggedAt: Date.now()
  };
  await db.collection("usageLogs").doc(logId).set(log);
  return log;
}

module.exports = {
  logUsage
};
