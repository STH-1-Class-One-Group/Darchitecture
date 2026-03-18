import { POINTS_PER_KM, POINTS_PER_KG_CO2 } from "../constants/pointConstants";

export function calculatePoints(distanceKm, carbonReductionKg) {
  const points = distanceKm * POINTS_PER_KM + carbonReductionKg * POINTS_PER_KG_CO2;
  return Math.max(0, Math.round(points));
}
