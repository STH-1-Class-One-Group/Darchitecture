import * as Location from "expo-location";

let rideSession = null;

export async function startRideSession() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted") {
    throw new Error("location_permission_denied");
  }

  rideSession = {
    startTime: Date.now(),
    coordinates: [],
    watcher: null
  };

  rideSession.watcher = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 2000,
      distanceInterval: 5
    },
    (loc) => {
      rideSession.coordinates.push({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        timestamp: loc.timestamp
      });
    }
  );

  return rideSession;
}

export async function endRideSession() {
  if (!rideSession) return null;
  if (rideSession.watcher) {
    rideSession.watcher.remove();
  }
  const finished = { ...rideSession, endTime: Date.now() };
  rideSession = null;
  return finished;
}

export function getCurrentSession() {
  return rideSession;
}
