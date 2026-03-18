const { db, uid } = require("../db/firebase");

function logUsage({ userId, action }) {
  const logId = uid("usage");
  const log = {
    id: logId,
    userId,
    action,
    loggedAt: Date.now()
  };
  db.usageLogs.set(logId, log);
  return log;
}

module.exports = {
  logUsage
};
