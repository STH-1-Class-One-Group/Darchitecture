const { uid } = require("../db/firebase");
const {
  COLLECTIONS,
  ensureUserDocument,
  getUserDocument,
  incrementUserAggregates,
  listCollectionByUser,
  pointLogRef,
  serverTimestamp
} = require("./firestoreStore");

async function addPointLog({ userId, amount }) {
  await ensureUserDocument(userId);

  const logId = uid("point");
  const log = {
    id: logId,
    pointID: logId,
    userId,
    amount,
    earnedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };

  await pointLogRef(logId).set(log);
  await incrementUserAggregates(userId, { pointDelta: amount });

  return log;
}

async function getBalance(userId) {
  await ensureUserDocument(userId);
  const user = await getUserDocument(userId);
  return user?.pointBalance || 0;
}

async function getLogs(userId) {
  return listCollectionByUser(COLLECTIONS.pointLogs, userId, "earnedAt");
}

module.exports = {
  addPointLog,
  getBalance,
  getLogs
};
