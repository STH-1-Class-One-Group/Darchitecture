import { deleteDocument, getDocument, listDocumentsByField, setDocument } from "../lib/firestore.js";

const COLLECTIONS = {
  users: "users",
  rides: "rides",
  reports: "reports",
  pointLogs: "pointLogs",
  quizResults: "quizResults",
  usageLogs: "usageLogs"
};

function serverTimestamp() {
  return Date.now();
}

function defaultUserDocument(userId, patch = {}) {
  return {
    id: userId,
    name: patch.name || patch.displayName || "",
    email: patch.email || "",
    region: patch.region || "",
    pointBalance: 0,
    totalCarbonReductionKg: 0,
    totalBikeDistanceKm: 0,
    totalUsageTimeMin: 0,
    reportIds: [],
    quizIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

async function ensureUserDocument(env, userId, patch = {}) {
  const existing = await getUserDocument(env, userId);
  if (existing) {
    if (Object.keys(patch).length > 0) {
      await updateUserDocument(env, userId, patch);
    }
    return existing;
  }

  const doc = defaultUserDocument(userId, patch);
  await setDocument(env, COLLECTIONS.users, userId, doc);
  return doc;
}

async function getUserDocument(env, userId) {
  return getDocument(env, COLLECTIONS.users, userId);
}

async function updateUserDocument(env, userId, patch = {}) {
  const existing = (await getUserDocument(env, userId)) || defaultUserDocument(userId, patch);
  const next = {
    ...existing,
    ...patch,
    id: userId,
    updatedAt: serverTimestamp()
  };

  await setDocument(env, COLLECTIONS.users, userId, next);
  return getUserDocument(env, userId);
}

async function incrementUserAggregates(
  env,
  userId,
  { pointDelta = 0, carbonDelta = 0, distanceDelta = 0, durationDelta = 0, reportId = null, quizId = null } = {}
) {
  const existing = (await getUserDocument(env, userId)) || defaultUserDocument(userId);
  const next = {
    ...existing,
    id: userId,
    pointBalance: Number(existing.pointBalance || 0) + pointDelta,
    totalCarbonReductionKg: Number(existing.totalCarbonReductionKg || 0) + carbonDelta,
    totalBikeDistanceKm: Number(existing.totalBikeDistanceKm || 0) + distanceDelta,
    totalUsageTimeMin: Number(existing.totalUsageTimeMin || 0) + durationDelta,
    reportIds: Array.isArray(existing.reportIds) ? [...existing.reportIds] : [],
    quizIds: Array.isArray(existing.quizIds) ? [...existing.quizIds] : [],
    updatedAt: serverTimestamp()
  };

  if (reportId && !next.reportIds.includes(reportId)) {
    next.reportIds.push(reportId);
  }

  if (quizId && !next.quizIds.includes(quizId)) {
    next.quizIds.push(quizId);
  }

  await setDocument(env, COLLECTIONS.users, userId, next);
  return getUserDocument(env, userId);
}

async function listCollectionByUser(env, collectionName, userId, sortField = "createdAt") {
  return listDocumentsByField(env, collectionName, "userId", userId, sortField);
}

async function userRef(env, userId) {
  return getUserDocument(env, userId);
}

async function rideRef(env, rideId) {
  return getDocument(env, COLLECTIONS.rides, rideId);
}

async function reportRef(env, reportId) {
  return getDocument(env, COLLECTIONS.reports, reportId);
}

async function pointLogRef(env, logId) {
  return getDocument(env, COLLECTIONS.pointLogs, logId);
}

async function quizResultRef(env, resultId) {
  return getDocument(env, COLLECTIONS.quizResults, resultId);
}

async function usageLogRef(env, logId) {
  return getDocument(env, COLLECTIONS.usageLogs, logId);
}

async function deleteRideDocument(env, rideId) {
  return deleteDocument(env, COLLECTIONS.rides, rideId);
}

export {
  COLLECTIONS,
  deleteRideDocument,
  defaultUserDocument,
  ensureUserDocument,
  getDocument,
  getUserDocument,
  incrementUserAggregates,
  listCollectionByUser,
  pointLogRef,
  quizResultRef,
  reportRef,
  rideRef,
  serverTimestamp,
  setDocument,
  updateUserDocument,
  usageLogRef,
  userRef
};
