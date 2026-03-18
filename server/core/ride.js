const { db, uid } = require("../db/firebase");
const { calculateCarbonReductionKg, calculateDistanceKm } = require("./utils");
const { createReportFromRide } = require("./report");

async function startRide({ userId }) {
  const rideId = uid("ride");
  const ride = {
    id: rideId,
    userId,
    startTime: Date.now(),
    endTime: null,
    coordinates: [],
    distanceKm: 0,
    carbonReductionKg: 0
  };
  await db.collection("rides").doc(rideId).set(ride);
  return ride;
}

async function endRide({ rideId, coordinates }) {
  const snap = await db.collection("rides").doc(rideId).get();
  if (!snap.exists) return null;

  const ride = snap.data();
  ride.endTime = Date.now();
  ride.coordinates = coordinates || [];
  ride.distanceKm = calculateDistanceKm(ride.coordinates);
  ride.carbonReductionKg = calculateCarbonReductionKg(ride.distanceKm);

  await db.collection("rides").doc(rideId).set(ride);
  const report = await createReportFromRide(ride);
  return { ride, report };
}

module.exports = {
  startRide,
  endRide
};
