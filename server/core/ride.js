const { uid } = require("../db/firebase");
const { ensureUserDocument, rideRef, serverTimestamp } = require("./firestoreStore");
const { calculateCarbonReductionKg, calculateDistanceKm } = require("./utils");
const { createReportFromRide } = require("./report");

async function startRide({ userId }) {
  await ensureUserDocument(userId);

  const rideId = uid("ride");
  const ride = {
    id: rideId,
    rideID: rideId,
    userId,
    status: "active",
    startTime: serverTimestamp(),
    endTime: null,
    coordinates: [],
    distanceKm: 0,
    carbonReductionKg: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await rideRef(rideId).set(ride);
  return ride;
}

async function endRide({ rideId, userId = null, coordinates }) {
  const snap = await rideRef(rideId).get();
  if (!snap.exists) return null;

  const ride = { id: snap.id, ...snap.data() };
  if (userId && ride.userId !== userId) {
    return { error: "forbidden" };
  }

  const normalizedCoordinates = Array.isArray(coordinates) ? coordinates : [];
  const distanceKm = calculateDistanceKm(normalizedCoordinates);
  const carbonReductionKg = calculateCarbonReductionKg(distanceKm);
  const now = serverTimestamp();
  const completedRide = {
    ...ride,
    endTime: now,
    coordinates: normalizedCoordinates,
    distanceKm,
    carbonReductionKg,
    status: "completed",
    updatedAt: now
  };

  if (ride.reportId) {
    const report = await createReportFromRide(completedRide);
    if (report?.error) return report;
    return { ride: completedRide, report };
  }

  const report = await createReportFromRide(completedRide);
  if (report?.error) return report;
  return { ride: completedRide, report };
}

module.exports = {
  startRide,
  endRide
};
