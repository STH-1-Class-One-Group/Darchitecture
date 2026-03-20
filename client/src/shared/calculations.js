const CO2_PER_KM_CAR_G = 192;
const G_TO_KG = 0.001;
const POINTS_PER_KM = 10;
const POINTS_PER_KG_CO2 = 50;

function toRad(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(coordinates) {
  if (!coordinates || coordinates.length < 2) return 0;
  const R = 6371;
  let distance = 0;

  for (let i = 1; i < coordinates.length; i += 1) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    const dLat = toRad(curr.lat - prev.lat);
    const dLon = toRad(curr.lng - prev.lng);
    const lat1 = toRad(prev.lat);
    const lat2 = toRad(curr.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c;
  }

  return distance;
}

function calculateCarbonReductionKg(distanceKm) {
  return distanceKm * CO2_PER_KM_CAR_G * G_TO_KG;
}

function calculatePoints(distanceKm, carbonReductionKg) {
  return Math.max(0, Math.round(distanceKm * POINTS_PER_KM + carbonReductionKg * POINTS_PER_KG_CO2));
}

module.exports = {
  CO2_PER_KM_CAR_G,
  G_TO_KG,
  POINTS_PER_KM,
  POINTS_PER_KG_CO2,
  calculateDistanceKm,
  calculateCarbonReductionKg,
  calculatePoints
};

module.exports.default = module.exports;
