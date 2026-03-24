const {
  COLLECTIONS,
  FieldValue,
  ensureUserDocument,
  firestore,
  listCollectionByUser,
  pointLogRef,
  reportRef,
  rideRef,
  serverTimestamp,
  userRef
} = require("./firestoreStore");
const { calculatePoints } = require("./utils");

function hydrateReport(snap) {
  if (!snap?.exists) return null;
  return { id: snap.id, ...snap.data() };
}

async function createReportFromRide(ride) {
  const reportId = ride.reportId || `report_${ride.id}`;
  const pointLogId = ride.pointLogId || `point_${ride.id}`;
  const durationMin = Math.max(0, Math.floor((ride.endTime - ride.startTime) / 60000));
  const pointsEarned = calculatePoints(ride.distanceKm, ride.carbonReductionKg);
  const now = serverTimestamp();
  const finalRidePatch = {
    endTime: ride.endTime,
    coordinates: Array.isArray(ride.coordinates) ? ride.coordinates : [],
    distanceKm: ride.distanceKm,
    carbonReductionKg: ride.carbonReductionKg,
    reportId,
    status: "completed",
    updatedAt: now
  };

  await ensureUserDocument(ride.userId);

  return firestore.runTransaction(async (transaction) => {
    const rideDocRef = rideRef(ride.id);
    const reportDocRef = reportRef(reportId);
    const pointLogDocRef = pointLogRef(pointLogId);
    const userDocRef = userRef(ride.userId);

    const rideSnap = await transaction.get(rideDocRef);
    if (!rideSnap.exists) return null;

    const storedRide = { id: rideSnap.id, ...rideSnap.data() };
    if (storedRide.userId !== ride.userId) {
      return { error: "forbidden" };
    }

    const existingReportId = storedRide.reportId || reportId;
    const existingReportSnap = await transaction.get(reportRef(existingReportId));
    if (existingReportSnap.exists) {
      const existingReport = hydrateReport(existingReportSnap);
      transaction.set(rideDocRef, finalRidePatch, { merge: true });
      return existingReport;
    }

    const report = {
      id: existingReportId,
      reportID: existingReportId,
      rideId: ride.id,
      userId: ride.userId,
      distanceKm: ride.distanceKm,
      durationMin,
      carbonReductionKg: ride.carbonReductionKg,
      pointsEarned,
      createdAt: now,
      updatedAt: now
    };

    transaction.set(reportDocRef, report);
    transaction.set(pointLogDocRef, {
      id: pointLogId,
      pointID: pointLogId,
      userId: ride.userId,
      amount: pointsEarned,
      earnedAt: now,
      createdAt: now
    });
    transaction.update(userDocRef, {
      pointBalance: FieldValue.increment(pointsEarned),
      totalCarbonReductionKg: FieldValue.increment(ride.carbonReductionKg),
      totalBikeDistanceKm: FieldValue.increment(ride.distanceKm),
      totalUsageTimeMin: FieldValue.increment(durationMin),
      reportIds: FieldValue.arrayUnion(existingReportId),
      updatedAt: now
    });
    transaction.set(rideDocRef, finalRidePatch, { merge: true });

    return report;
  });
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
