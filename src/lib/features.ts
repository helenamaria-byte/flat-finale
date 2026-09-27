import type { FeatureKey, Listing } from "./types";

export const FEATURES: { key: FeatureKey; label: string; hint: string; missing: string }[] = [
  { key: "lift", label: "Lift", hint: "Ground or 1st floor also counts", missing: "No lift" },
  { key: "parking", label: "Parking", hint: "A covered spot for a car or bike", missing: "No parking" },
  { key: "ownBathroom", label: "My own bathroom", hint: "The flat has 3 bathrooms", missing: "Shared bathroom" },
  { key: "petFriendly", label: "Pet-friendly", hint: "The owner allows pets", missing: "No pets allowed" },
  { key: "furnished", label: "Furnished", hint: "Beds, sofa, fridge, etc.", missing: "Unfurnished" },
  { key: "balcony", label: "Balcony", hint: "Somewhere to sit outside", missing: "No balcony" },
  { key: "gated", label: "Gated society", hint: "Security at the gate", missing: "Not a gated society" },
  { key: "societyGym", label: "Gym in the society", hint: "On-site gym or clubhouse", missing: "No society gym" },
  { key: "nearMetro", label: "Near a metro station", hint: "Walkable to a metro stop", missing: "Not near the metro" },
  { key: "powerBackup", label: "Power backup", hint: "Inverter or generator", missing: "No power backup" },
];

export const featureLabel = (k: FeatureKey) => FEATURES.find((f) => f.key === k)!.label;

export function hasFeature(l: Listing, k: FeatureKey): boolean {
  switch (k) {
    case "lift":
      return l.lift || l.floor <= 1;
    case "ownBathroom":
      return l.bathrooms >= 3;
    default:
      return l[k];
  }
}

export function missingText(l: Listing, k: FeatureKey): string {
  const f = FEATURES.find((x) => x.key === k)!;
  if (k === "lift") return `No lift, and it's on floor ${l.floor}`;
  if (k === "ownBathroom") return `Only ${l.bathrooms} bathrooms for 3 people`;
  return f.missing;
}
