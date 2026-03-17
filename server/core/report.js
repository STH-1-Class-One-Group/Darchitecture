const { db, generateId } = require('../db/firebase');
const pointCore = require('./point');

function createReportFromRide(ride) {
  const id = generateId('report');
  const report = {
    id,
    rideId: ride.id,
    distanceKm: ride.distanceKm,
    durationMin: ride.durationMin,
    carbonReductionKg: pointCore.calculateCarbonReduction(ride.distanceKm),
    pointsEarned: 0,
    createdAt: new Date().toISOString(),
  };

  report.pointsEarned = pointCore.addPoints(ride.userId, report.carbonReductionKg);
  db.reports.set(id, report);
  return report;
}

function listReports(userId) {
  return Array.from(db.reports.values())
    .filter((report) => {
      if (!userId) return true;
      const ride = db.rides.get(report.rideId);
      return ride && ride.userId === userId;
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function getReport(reportId) {
  return db.reports.get(reportId);
}

module.exports = {
  createReportFromRide,
  listReports,
  getReport,
};
