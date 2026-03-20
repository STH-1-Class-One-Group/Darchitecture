const { uid } = require("../db/firebase");
const {
  COLLECTIONS,
  ensureUserDocument,
  incrementUserAggregates,
  listCollectionByUser,
  reportRef,
  serverTimestamp
} = require("./firestoreStore");
const { calculatePoints } = require("./utils");
const { addPointLog } = require("./point");

async function createReportFromRide(ride) {
  const reportId = uid("report");
  const durationMin = Math.max(0, Math.floor((ride.endTime - ride.startTime) / 60000));
  const pointsEarned = calculatePoints(ride.distanceKm, ride.carbonReductionKg);

  const report = {
    id: reportId,
    reportID: reportId,
    rideId: ride.id,
    userId: ride.userId,
    distanceKm: ride.distanceKm,
    durationMin,
    carbonReductionKg: ride.carbonReductionKg,
    pointsEarned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await ensureUserDocument(ride.userId);
  await reportRef(reportId).set(report);
  await addPointLog({ userId: ride.userId, amount: pointsEarned });
  await incrementUserAggregates(ride.userId, {
    carbonDelta: ride.carbonReductionKg,
    distanceDelta: ride.distanceKm,
    durationDelta: durationMin,
    reportId
  });

  return report;
}

async function listReports(userId) {
  return listCollectionByUser(COLLECTIONS.reports, userId, "createdAt");
}

async function getReport(reportId) {
  const snap = await reportRef(reportId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

module.exports = {
  createReportFromRide,
  listReports,
  getReport
};
