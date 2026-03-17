const { db, getOrCreateUser } = require('../db/firebase');

const CARBON_REDUCTION_PER_KM_KG = 0.192;
const POINTS_PER_KG = 12;
const POINTS_MINIMUM = 5;

function calculateCarbonReduction(distanceKm) {
  const reduction = distanceKm * CARBON_REDUCTION_PER_KM_KG;
  return Math.round(reduction * 100) / 100;
}

function calculatePoints(carbonReductionKg) {
  const points = Math.round(carbonReductionKg * POINTS_PER_KG);
  return Math.max(points, POINTS_MINIMUM);
}

function addPoints(userId, carbonReductionKg) {
  const user = getOrCreateUser(userId);
  const earned = calculatePoints(carbonReductionKg);
  user.pointBalance += earned;
  db.pointLogs.unshift({
    id: `point_${Date.now()}`,
    userId,
    amount: earned,
    earnedAt: new Date().toISOString(),
  });
  return earned;
}

function getBalance(userId) {
  const user = db.users.get(userId);
  return user ? user.pointBalance : 0;
}

function getLogs(userId) {
  return db.pointLogs.filter((log) => log.userId === userId);
}

module.exports = {
  calculateCarbonReduction,
  calculatePoints,
  addPoints,
  getBalance,
  getLogs,
};
