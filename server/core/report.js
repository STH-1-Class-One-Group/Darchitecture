const { db, uid } = require("../db/firebase");
const { calculatePoints } = require("./utils");
const { addPointLog } = require("./point");

async function createReportFromRide(ride) {
  const reportId = uid("report");
  const durationMin = Math.max(1, Math.round((ride.endTime - ride.startTime) / 60000));
  const pointsEarned = calculatePoints(ride.distanceKm, ride.carbonReductionKg);

  const report = {
    id: reportId,
    rideId: ride.id,
    userId: ride.userId,
    distanceKm: ride.distanceKm,
    durationMin,
    carbonReductionKg: ride.carbonReductionKg,
    pointsEarned
  };

  await db.collection("reports").doc(reportId).set(report);
  await addPointLog({ userId: ride.userId, amount: pointsEarned });

  return report;
}

async function listReports(userId) {
  const snap = await db.collection("reports").where("userId", "==", userId).get();
  const reports = snap.docs.map((doc) => doc.data());
  return reports.sort((a, b) => b.durationMin - a.durationMin);
}

async function getReport(reportId) {
  const snap = await db.collection("reports").doc(reportId).get();
  return snap.exists ? snap.data() : null;
}

module.exports = {
  createReportFromRide,
  listReports,
  getReport
};
