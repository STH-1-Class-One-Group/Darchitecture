const { db, uid } = require("../db/firebase");
const { calculatePoints } = require("./utils");
const { addPointLog } = require("./point");

function createReportFromRide(ride) {
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

  db.reports.set(reportId, report);
  addPointLog({ userId: ride.userId, amount: pointsEarned });

  return report;
}

function listReports(userId) {
  return Array.from(db.reports.values()).filter((r) => r.userId === userId);
}

function getReport(reportId) {
  return db.reports.get(reportId) || null;
}

module.exports = {
  createReportFromRide,
  listReports,
  getReport
};
