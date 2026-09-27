import type { Listing } from "./types";

// Sample 3BHK listings for the demo. They're made up, not real properties.
type Row = Omit<Listing, "id">;
const f = false, t = true;

const rows: Row[] = [
  { name: "Sunshine Residency", area: "baner", rent: 62000, sqft: 1450, floor: 7, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Green Arches", area: "baner", rent: 54000, sqft: 1320, floor: 3, totalFloors: 7, bathrooms: 2, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Balewadi Heights", area: "balewadi", rent: 58000, sqft: 1500, floor: 9, totalFloors: 14, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Aundh Courtyard", area: "aundh", rent: 66000, sqft: 1400, floor: 2, totalFloors: 5, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Parihar Chowk Flats", area: "aundh", rent: 48000, sqft: 1200, floor: 1, totalFloors: 3, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: f, balcony: f, gated: f, societyGym: f, nearMetro: t, powerBackup: f },
  { name: "Blue Ridge Towers", area: "hinjewadi", rent: 45000, sqft: 1380, floor: 11, totalFloors: 22, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Phase 1 Greens", area: "hinjewadi", rent: 39000, sqft: 1250, floor: 4, totalFloors: 8, bathrooms: 2, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Wakad Palms", area: "wakad", rent: 42000, sqft: 1300, floor: 6, totalFloors: 10, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Kaspate Vasti Homes", area: "wakad", rent: 36000, sqft: 1150, floor: 5, totalFloors: 5, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: f, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: f },
  { name: "Rose Valley", area: "pimple-saudagar", rent: 40000, sqft: 1350, floor: 2, totalFloors: 9, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Model Colony Terrace", area: "shivajinagar", rent: 72000, sqft: 1500, floor: 4, totalFloors: 6, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Prabhat Road House", area: "deccan", rent: 60000, sqft: 1250, floor: 0, totalFloors: 2, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: t, balcony: f, gated: f, societyGym: f, nearMetro: t, powerBackup: f },
  { name: "Mayur Colony Apartments", area: "kothrud", rent: 45000, sqft: 1300, floor: 3, totalFloors: 7, bathrooms: 2, lift: t, parking: t, petFriendly: f, furnished: f, balcony: t, gated: t, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Paud Road Heights", area: "kothrud", rent: 51000, sqft: 1420, floor: 8, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: t, powerBackup: t },
  { name: "Karve Nagar Walk-up", area: "karve-nagar", rent: 38000, sqft: 1200, floor: 5, totalFloors: 5, bathrooms: 3, lift: f, parking: t, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "East Street Residences", area: "camp", rent: 55000, sqft: 1250, floor: 2, totalFloors: 4, bathrooms: 2, lift: f, parking: f, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Lane 6 Garden Flat", area: "koregaon-park", rent: 85000, sqft: 1600, floor: 1, totalFloors: 4, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Riverview Kalyani", area: "kalyani-nagar", rent: 70000, sqft: 1480, floor: 10, totalFloors: 15, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: t, powerBackup: t },
  { name: "Airport Road Nest", area: "viman-nagar", rent: 58000, sqft: 1350, floor: 5, totalFloors: 11, bathrooms: 2, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "EON Crest", area: "kharadi", rent: 52000, sqft: 1400, floor: 12, totalFloors: 20, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Magarpatta Cosmos", area: "magarpatta", rent: 56000, sqft: 1380, floor: 6, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Hadapsar Gaon Flats", area: "hadapsar", rent: 34000, sqft: 1250, floor: 4, totalFloors: 4, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: f, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: f },
  { name: "Baner Hill View", area: "baner", rent: 49000, sqft: 1280, floor: 5, totalFloors: 5, bathrooms: 3, lift: f, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Aundh Metro Square", area: "aundh", rent: 57000, sqft: 1330, floor: 6, totalFloors: 10, bathrooms: 3, lift: t, parking: f, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: t, powerBackup: t },
];

export const LISTINGS: Listing[] = rows.map((r, i) => ({ id: `L${String(i + 1).padStart(2, "0")}`, ...r }));
