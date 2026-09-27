import type { AreaId } from "./types";

// Approximate centre points of Pune neighbourhoods.
export const AREAS: Record<AreaId, { name: string; lat: number; lng: number }> = {
  baner: { name: "Baner", lat: 18.559, lng: 73.787 },
  balewadi: { name: "Balewadi", lat: 18.575, lng: 73.769 },
  aundh: { name: "Aundh", lat: 18.558, lng: 73.807 },
  hinjewadi: { name: "Hinjewadi", lat: 18.591, lng: 73.738 },
  wakad: { name: "Wakad", lat: 18.599, lng: 73.763 },
  "pimple-saudagar": { name: "Pimple Saudagar", lat: 18.598, lng: 73.797 },
  shivajinagar: { name: "Shivajinagar", lat: 18.531, lng: 73.847 },
  deccan: { name: "Deccan", lat: 18.516, lng: 73.841 },
  kothrud: { name: "Kothrud", lat: 18.507, lng: 73.807 },
  "karve-nagar": { name: "Karve Nagar", lat: 18.489, lng: 73.821 },
  camp: { name: "Camp", lat: 18.514, lng: 73.878 },
  "koregaon-park": { name: "Koregaon Park", lat: 18.536, lng: 73.894 },
  "kalyani-nagar": { name: "Kalyani Nagar", lat: 18.548, lng: 73.902 },
  "viman-nagar": { name: "Viman Nagar", lat: 18.567, lng: 73.914 },
  kharadi: { name: "Kharadi", lat: 18.551, lng: 73.935 },
  hadapsar: { name: "Hadapsar", lat: 18.508, lng: 73.926 },
  magarpatta: { name: "Magarpatta", lat: 18.514, lng: 73.93 },
};

export const AREA_IDS = Object.keys(AREAS) as AreaId[];

export const areaName = (id: AreaId) => AREAS[id]?.name ?? id;

function km(a: AreaId, b: AreaId) {
  const A = AREAS[a], B = AREAS[b];
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(B.lat - A.lat), dLng = toRad(B.lng - A.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(A.lat)) * Math.cos(toRad(B.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Rough peak-hour estimate: ~20 km/h city traffic plus a fixed start/end overhead. */
export function commuteMinutes(from: AreaId, to: AreaId) {
  if (from === to) return 10;
  return Math.round(8 + km(from, to) * 3);
}
