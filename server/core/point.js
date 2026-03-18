const { db, uid, FieldValue } = require("../db/firebase");

async function ensureUser(userId) {
  const ref = db.collection("users").doc(userId);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      id: userId,
      pointBalance: 0
    });
  }
  return ref;
}

async function addPointLog({ userId, amount }) {
  await ensureUser(userId);
  const logId = uid("point");
  const log = {
    id: logId,
    userId,
    amount,
    earnedAt: Date.now()
  };

  await db.collection("pointLogs").doc(logId).set(log);
  await db.collection("users").doc(userId).set(
    {
      pointBalance: FieldValue.increment(amount)
    },
    { merge: true }
  );

  return log;
}

async function getBalance(userId) {
  await ensureUser(userId);
  const snap = await db.collection("users").doc(userId).get();
  const data = snap.data() || {};
  return data.pointBalance || 0;
}

async function getLogs(userId) {
  const snap = await db.collection("pointLogs").where("userId", "==", userId).get();
  const logs = snap.docs.map((doc) => doc.data());
  return logs.sort((a, b) => b.earnedAt - a.earnedAt);
}

module.exports = {
  addPointLog,
  getBalance,
  getLogs
};
