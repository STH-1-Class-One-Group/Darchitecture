import { createId } from "../lib/id.js";
import { calculateCarbonReductionKg, calculateDistanceKm } from "../lib/calculations.js";
import { createReportFromRide } from "./report.js";
import { COLLECTIONS, ensureUserDocument, getDocument, serverTimestamp, setDocument } from "./firestoreStore.js";

export async function startRide(env, { userId }) {
  await ensureUserDocument(env, userId);

  const rideId = createId("ride");
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

  await setDocument(env, COLLECTIONS.rides, rideId, ride);
  return ride;
}

export async function endRide(env, { rideId, coordinates }) {
  const ride = await getDocument(env, COLLECTIONS.rides, rideId);
  if (!ride) return null;

  const nextRide = {
    ...ride,
    endTime: serverTimestamp(),
    coordinates: Array.isArray(coordinates) ? coordinates : [],
    distanceKm: calculateDistanceKm(Array.isArray(coordinates) ? coordinates : []),
    carbonReductionKg: 0,
    updatedAt: serverTimestamp()
  };

  nextRide.carbonReductionKg = calculateCarbonReductionKg(nextRide.distanceKm);

  await setDocument(env, COLLECTIONS.rides, rideId, nextRide);
  const report = await createReportFromRide(env, nextRide);
  return { ride: nextRide, report };
}
