import { CARBON_REDUCTION_PER_KM_KG } from '../constants/carbonConstants';

export function calculateCarbonReductionKg(distanceKm) {
  const reduction = distanceKm * CARBON_REDUCTION_PER_KM_KG;
  return Math.round(reduction * 100) / 100;
}
