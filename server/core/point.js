const { db, uid } = require("../db/firebase");

function ensureUser(userId) {
  if (!db.users.has(userId)) {
    db.users.set(userId, { id: userId, pointBalance: 0 });
  }
}

function addPointLog({ userId, amount }) {
  ensureUser(userId);
  const logId = uid("point");
  const log = {
    id: logId,
    userId,
    amount,
    earnedAt: Date.now()
  };
  db.pointLogs.set(logId, log);

  const user = db.users.get(userId);
  user.pointBalance += amount;
  db.users.set(userId, user);

  return log;
}

function getBalance(userId) {
  ensureUser(userId);
  return db.users.get(userId).pointBalance;
}

function getLogs(userId) {
  return Array.from(db.pointLogs.values()).filter((log) => log.userId === userId);
}

module.exports = {
  addPointLog,
  getBalance,
  getLogs
};
