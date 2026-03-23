import { createId } from "../lib/id.js";
import { COLLECTIONS, ensureUserDocument, getUserDocument, incrementUserAggregates, listCollectionByUser, serverTimestamp, setDocument } from "./firestoreStore.js";

export async function addPointLog(env, { userId, amount }) {
  await ensureUserDocument(env, userId);

  const logId = createId("point");
  const log = {
    id: logId,
    pointID: logId,
    userId,
    amount,
    earnedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };

  await setDocument(env, COLLECTIONS.pointLogs, logId, log);
  await incrementUserAggregates(env, userId, { pointDelta: amount });

  return log;
}

export async function getBalance(env, userId) {
  await ensureUserDocument(env, userId);
  const user = await getUserDocument(env, userId);
  return user?.pointBalance || 0;
}

export async function getLogs(env, userId) {
  return listCollectionByUser(env, COLLECTIONS.pointLogs, userId, "earnedAt");
}
