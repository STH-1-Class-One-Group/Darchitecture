const { db, generateId } = require('../db/firebase');

function logUsage({ userId, action }) {
  const log = {
    id: generateId('usage'),
    userId,
    action,
    loggedAt: new Date().toISOString(),
  };
  db.usageLogs.push(log);
  return log;
}

module.exports = {
  logUsage,
};
