import { createId } from "../lib/id.js";
import { calculatePoints } from "../lib/calculations.js";
import { addPointLog } from "./point.js";
import { COLLECTIONS, ensureUserDocument, incrementUserAggregates, listCollectionByUser, serverTimestamp, setDocument, getDocument } from "./firestoreStore.js";

export async function createReportFromRide(env, ride) {
  const reportId = createId("report");
  const durationMin = Math.max(0, Math.floor((ride.endTime - ride.startTime) / 60000));
  const pointsEarned = calculatePoints(ride.distanceKm, ride.carbonReductionKg);

  const report = {
    id: reportId,
    reportID: reportId,
    rideId: ride.id,
    userId: ride.userId,
    distanceKm: ride.distanceKm,
    durationMin,
    carbonReductionKg: ride.carbonReductionKg,
    pointsEarned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await ensureUserDocument(env, ride.userId);
  await setDocument(env, COLLECTIONS.reports, reportId, report);
  await addPointLog(env, { userId: ride.userId, amount: pointsEarned });
  await incrementUserAggregates(env, ride.userId, {
    carbonDelta: ride.carbonReductionKg,
    distanceDelta: ride.distanceKm,
    durationDelta: durationMin,
    reportId
  });

  return report;
}

export async function listReports(env, userId) {
  return listCollectionByUser(env, COLLECTIONS.reports, userId, "createdAt");
}

export async function getReport(env, reportId) {
  return getDocument(env, COLLECTIONS.reports, reportId);
}
