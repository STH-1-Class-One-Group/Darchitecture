const { db, generateId, getOrCreateUser } = require('../db/firebase');
const reportCore = require('./report');

function calculateDistanceKm(coords) {
  if (!coords || coords.length < 2) return 0;
  let distance = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const prev = coords[i - 1];
    const current = coords[i];
    const dx = current.lat - prev.lat;
    const dy = current.lng - prev.lng;
    distance += Math.sqrt(dx * dx + dy * dy) * 111;
  }
  return Math.round(distance * 100) / 100;
}

function startRide(userId) {
  getOrCreateUser(userId);
  const id = generateId('ride');
  const ride = {
    id,
    userId,
    startTime: new Date().toISOString(),
    coordinates: [],
  };
  db.rides.set(id, ride);
  return ride;
}

function endRide(rideId, coordinates = []) {
  const ride = db.rides.get(rideId);
  if (!ride) {
    return { error: 'Ride not found' };
  }

  ride.coordinates = coordinates.length ? coordinates : ride.coordinates;
  ride.endTime = new Date().toISOString();
  ride.distanceKm = calculateDistanceKm(ride.coordinates);
  ride.durationMin = Math.max(
    1,
    Math.round((Date.parse(ride.endTime) - Date.parse(ride.startTime)) / 60000)
  );

  const report = reportCore.createReportFromRide(ride);
  return { ride, report };
}

module.exports = {
  startRide,
  endRide,
};
