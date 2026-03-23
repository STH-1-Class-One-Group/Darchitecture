import { fetchStations } from "../lib/stations.js";

export function listStations() {
  return fetchStations();
}
