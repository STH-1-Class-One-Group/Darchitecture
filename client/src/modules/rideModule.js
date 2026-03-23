let rideSession = null;

function getGeolocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new Error("location_unavailable");
  }

  return navigator.geolocation;
}

function readInitialPosition(options) {
  return new Promise((resolve, reject) => {
    const geolocation = getGeolocation();
    geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function watchPosition(options, onPosition, onError) {
  const geolocation = getGeolocation();
  return geolocation.watchPosition(onPosition, onError, options);
}

function createPositionPoint(position) {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    timestamp: position.timestamp
  };
}

export async function startRideSession() {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
  };

  try {
    const initialPosition = await readInitialPosition(options);

    rideSession = {
      startTime: Date.now(),
      coordinates: [createPositionPoint(initialPosition)],
      watcher: null
    };

    rideSession.watcher = watchPosition(
      options,
      (position) => {
        if (!rideSession) return;
        rideSession.coordinates.push(createPositionPoint(position));
      },
      (error) => {
        if (error?.code === error?.PERMISSION_DENIED || error?.code === 1) {
          endRideSession().catch(() => null);
        }
      }
    );

    return rideSession;
  } catch (error) {
    if (error?.code === error?.PERMISSION_DENIED || error?.code === 1) {
      throw new Error("location_permission_denied");
    }
    throw new Error("location_unavailable");
  }
}

export async function endRideSession() {
  if (!rideSession) return null;

  if (rideSession.watcher !== null) {
    getGeolocation().clearWatch(rideSession.watcher);
  }

  const finished = { ...rideSession, endTime: Date.now() };
  rideSession = null;
  return finished;
}

export function getCurrentSession() {
  return rideSession;
}
