const { db, uid } = require("../db/firebase");
const { calculateCarbonReductionKg, calculateDistanceKm } = require("./utils");
const { createReportFromRide } = require("./report");

function startRide({ userId }) {
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
  db.rides.set(rideId, ride);
  return ride;
}

function endRide({ rideId, coordinates }) {
  const ride = db.rides.get(rideId);
  if (!ride) return null;

  ride.endTime = Date.now();
  ride.coordinates = coordinates || [];
  ride.distanceKm = calculateDistanceKm(ride.coordinates);
  ride.carbonReductionKg = calculateCarbonReductionKg(ride.distanceKm);

  db.rides.set(rideId, ride);
  const report = createReportFromRide(ride);
  return { ride, report };
}

module.exports = {
  startRide,
  endRide
};
