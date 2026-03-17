const ACTIVE_SESSIONS = new Map();

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

export function createRideSession(userId) {
  const id = `ride_${Date.now()}`;
  const ride = {
    id,
    userId,
    startTime: new Date().toISOString(),
    coordinates: [],
  };
  ACTIVE_SESSIONS.set(id, ride);
  return ride;
}

export function updateRideSession(rideId, coordinate) {
  const ride = ACTIVE_SESSIONS.get(rideId);
  if (!ride) return null;
  ride.coordinates.push(coordinate);
  return ride;
}

export function endRideSession(ride, rideMeta = {}) {
  const coords = rideMeta.coordinates && rideMeta.coordinates.length
    ? rideMeta.coordinates
    : ride.coordinates;
  const distanceKm = calculateDistanceKm(coords);
  const endTime = new Date().toISOString();
  const durationMin = Math.max(1, Math.round((Date.parse(endTime) - Date.parse(ride.startTime)) / 60000));

  const completedRide = {
    ...ride,
    endTime,
    coordinates: coords,
    distanceKm,
    durationMin,
  };

  ACTIVE_SESSIONS.delete(ride.id);
  return completedRide;
}
