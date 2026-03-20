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

async function endRide({ rideId, coordinates }) {
  const snap = await rideRef(rideId).get();
  if (!snap.exists) return null;

  const ride = { id: snap.id, ...snap.data() };
  ride.endTime = serverTimestamp();
  ride.coordinates = Array.isArray(coordinates) ? coordinates : [];
  ride.distanceKm = calculateDistanceKm(ride.coordinates);
  ride.carbonReductionKg = calculateCarbonReductionKg(ride.distanceKm);
  ride.updatedAt = serverTimestamp();

  await rideRef(rideId).set(ride, { merge: true });
  const report = await createReportFromRide(ride);
  return { ride, report };
}

module.exports = {
  startRide,
  endRide
};
