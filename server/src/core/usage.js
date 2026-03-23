import { createId } from "../lib/id.js";
import { COLLECTIONS, ensureUserDocument, listCollectionByUser, serverTimestamp, setDocument } from "./firestoreStore.js";

export async function logUsage(env, { userId, action }) {
  await ensureUserDocument(env, userId);

  const logId = createId("usage");
  const log = {
    id: logId,
    usageID: logId,
    userId,
    action,
    loggedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };

  await setDocument(env, COLLECTIONS.usageLogs, logId, log);
  return log;
}

export async function listUsageLogs(env, userId) {
  return listCollectionByUser(env, COLLECTIONS.usageLogs, userId, "loggedAt");
}
