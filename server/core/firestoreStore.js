const { admin } = require("./firebaseAdmin");

const firestore = admin.firestore();
const { FieldValue } = admin.firestore;

const COLLECTIONS = {
  users: "users",
  rides: "rides",
  reports: "reports",
  pointLogs: "pointLogs",
  quizResults: "quizResults",
  usageLogs: "usageLogs"
};

function userRef(userId) {
  return firestore.collection(COLLECTIONS.users).doc(userId);
}

function rideRef(rideId) {
  return firestore.collection(COLLECTIONS.rides).doc(rideId);
}

function reportRef(reportId) {
  return firestore.collection(COLLECTIONS.reports).doc(reportId);
}

function pointLogRef(logId) {
  return firestore.collection(COLLECTIONS.pointLogs).doc(logId);
}

function quizResultRef(resultId) {
  return firestore.collection(COLLECTIONS.quizResults).doc(resultId);
}

function usageLogRef(logId) {
  return firestore.collection(COLLECTIONS.usageLogs).doc(logId);
}

function serverTimestamp() {
  return Date.now();
}

function defaultUserDocument(userId, patch = {}) {
  const name = patch.name || patch.displayName || "";
  const email = patch.email || "";
  const region = patch.region || "";

  return {
    id: userId,
    name,
    email,
    region,
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

function pickUserPatch(patch = {}) {
  const next = {};

  if (patch.name !== undefined) next.name = patch.name;
  if (patch.displayName !== undefined && next.name === undefined) next.name = patch.displayName;
  if (patch.email !== undefined) next.email = patch.email;
  if (patch.region !== undefined) next.region = patch.region;

  if (patch.pointBalance !== undefined) next.pointBalance = patch.pointBalance;
  if (patch.totalCarbonReductionKg !== undefined) next.totalCarbonReductionKg = patch.totalCarbonReductionKg;
  if (patch.totalBikeDistanceKm !== undefined) next.totalBikeDistanceKm = patch.totalBikeDistanceKm;
  if (patch.totalUsageTimeMin !== undefined) next.totalUsageTimeMin = patch.totalUsageTimeMin;
  if (patch.reportIds !== undefined) next.reportIds = patch.reportIds;
  if (patch.quizIds !== undefined) next.quizIds = patch.quizIds;

  return next;
}

async function ensureUserDocument(userId, patch = {}) {
  const ref = userRef(userId);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      ...defaultUserDocument(userId, patch),
      ...pickUserPatch(patch)
    });
    return ref;
  }

  const nextPatch = pickUserPatch(patch);
  if (Object.keys(nextPatch).length > 0) {
    await ref.set(
      {
        ...nextPatch,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  return ref;
}

async function getUserDocument(userId) {
  const snap = await userRef(userId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function updateUserDocument(userId, patch = {}) {
  const ref = userRef(userId);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      ...defaultUserDocument(userId, patch),
      ...pickUserPatch(patch)
    });
    return getUserDocument(userId);
  }

  await ref.set(
    {
      ...pickUserPatch(patch),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return getUserDocument(userId);
}

async function incrementUserAggregates(
  userId,
  { pointDelta = 0, carbonDelta = 0, distanceDelta = 0, durationDelta = 0, reportId = null, quizId = null } = {}
) {
  const patch = {
    updatedAt: serverTimestamp()
  };

  if (pointDelta !== 0) {
    patch.pointBalance = FieldValue.increment(pointDelta);
  }

  if (carbonDelta !== 0) {
    patch.totalCarbonReductionKg = FieldValue.increment(carbonDelta);
  }

  if (distanceDelta !== 0) {
    patch.totalBikeDistanceKm = FieldValue.increment(distanceDelta);
  }

  if (durationDelta !== 0) {
    patch.totalUsageTimeMin = FieldValue.increment(durationDelta);
  }

  if (reportId) {
    patch.reportIds = FieldValue.arrayUnion(reportId);
  }

  if (quizId) {
    patch.quizIds = FieldValue.arrayUnion(quizId);
  }

  return updateUserDocument(userId, patch);
}

async function listCollectionByUser(collectionName, userId, sortField = "createdAt") {
  const snap = await firestore.collection(collectionName).where("userId", "==", userId).get();
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const left = a[sortField];
      const right = b[sortField];

      const leftValue = typeof left?.toMillis === "function" ? left.toMillis() : Number(left || 0);
      const rightValue = typeof right?.toMillis === "function" ? right.toMillis() : Number(right || 0);
      return rightValue - leftValue;
    });
}

module.exports = {
  COLLECTIONS,
  firestore,
  FieldValue,
  userRef,
  rideRef,
  reportRef,
  pointLogRef,
  quizResultRef,
  usageLogRef,
  serverTimestamp,
  defaultUserDocument,
  ensureUserDocument,
  getUserDocument,
  updateUserDocument,
  incrementUserAggregates,
  listCollectionByUser
};
