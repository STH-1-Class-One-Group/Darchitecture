import { POINTS_PER_KG, POINTS_MINIMUM } from '../constants/pointConstants';

export function calculatePoints(carbonReductionKg) {
  const rawPoints = Math.round(carbonReductionKg * POINTS_PER_KG);
  return Math.max(rawPoints, POINTS_MINIMUM);
}
