import type { Listing } from "./types";

// Sample 2–5BHK listings for the demo. They're made up, not real properties.
type Row = Omit<Listing, "id">;
const f = false, t = true;

const rows: Row[] = [
  { name: "Sunshine Residency", area: "baner", bhk: 3, rent: 62000, sqft: 1450, floor: 7, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Green Arches", area: "baner", bhk: 3, rent: 54000, sqft: 1320, floor: 3, totalFloors: 7, bathrooms: 2, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Balewadi Heights", area: "balewadi", bhk: 3, rent: 58000, sqft: 1500, floor: 9, totalFloors: 14, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Aundh Courtyard", area: "aundh", bhk: 3, rent: 66000, sqft: 1400, floor: 2, totalFloors: 5, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Parihar Chowk Flats", area: "aundh", bhk: 2, rent: 32000, sqft: 1200, floor: 1, totalFloors: 3, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: f, balcony: f, gated: f, societyGym: f, nearMetro: t, powerBackup: f },
  { name: "Blue Ridge Towers", area: "hinjewadi", bhk: 3, rent: 45000, sqft: 1380, floor: 11, totalFloors: 22, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Phase 1 Greens", area: "hinjewadi", bhk: 3, rent: 39000, sqft: 1250, floor: 4, totalFloors: 8, bathrooms: 2, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Wakad Palms", area: "wakad", bhk: 3, rent: 42000, sqft: 1300, floor: 6, totalFloors: 10, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Kaspate Vasti Homes", area: "wakad", bhk: 2, rent: 26000, sqft: 1150, floor: 5, totalFloors: 5, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: f, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: f },
  { name: "Rose Valley", area: "pimple-saudagar", bhk: 3, rent: 40000, sqft: 1350, floor: 2, totalFloors: 9, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Model Colony Terrace", area: "shivajinagar", bhk: 3, rent: 72000, sqft: 1500, floor: 4, totalFloors: 6, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Prabhat Road House", area: "deccan", bhk: 2, rent: 42000, sqft: 1250, floor: 0, totalFloors: 2, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: t, balcony: f, gated: f, societyGym: f, nearMetro: t, powerBackup: f },
  { name: "Mayur Colony Apartments", area: "kothrud", bhk: 3, rent: 45000, sqft: 1300, floor: 3, totalFloors: 7, bathrooms: 2, lift: t, parking: t, petFriendly: f, furnished: f, balcony: t, gated: t, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Paud Road Heights", area: "kothrud", bhk: 3, rent: 51000, sqft: 1420, floor: 8, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: t, powerBackup: t },
  { name: "Karve Nagar Walk-up", area: "karve-nagar", bhk: 3, rent: 38000, sqft: 1200, floor: 5, totalFloors: 5, bathrooms: 3, lift: f, parking: t, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "East Street Residences", area: "camp", bhk: 3, rent: 55000, sqft: 1250, floor: 2, totalFloors: 4, bathrooms: 2, lift: f, parking: f, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Lane 6 Garden Flat", area: "koregaon-park", bhk: 3, rent: 85000, sqft: 1600, floor: 1, totalFloors: 4, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Riverview Kalyani", area: "kalyani-nagar", bhk: 3, rent: 70000, sqft: 1480, floor: 10, totalFloors: 15, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: t, powerBackup: t },
  { name: "Airport Road Nest", area: "viman-nagar", bhk: 3, rent: 58000, sqft: 1350, floor: 5, totalFloors: 11, bathrooms: 2, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "EON Crest", area: "kharadi", bhk: 3, rent: 52000, sqft: 1400, floor: 12, totalFloors: 20, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Magarpatta Cosmos", area: "magarpatta", bhk: 3, rent: 56000, sqft: 1380, floor: 6, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Hadapsar Gaon Flats", area: "hadapsar", bhk: 2, rent: 24000, sqft: 1250, floor: 4, totalFloors: 4, bathrooms: 2, lift: f, parking: t, petFriendly: t, furnished: f, balcony: t, gated: f, societyGym: f, nearMetro: f, powerBackup: f },
  { name: "Baner Hill View", area: "baner", bhk: 3, rent: 49000, sqft: 1280, floor: 5, totalFloors: 5, bathrooms: 3, lift: f, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Aundh Metro Square", area: "aundh", bhk: 3, rent: 57000, sqft: 1330, floor: 6, totalFloors: 10, bathrooms: 3, lift: t, parking: f, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: t, powerBackup: t },
  { name: "Baner Grand Residences", area: "baner", bhk: 4, rent: 88000, sqft: 2100, floor: 8, totalFloors: 14, bathrooms: 4, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Wakad Skyline", area: "wakad", bhk: 4, rent: 68000, sqft: 1950, floor: 10, totalFloors: 18, bathrooms: 4, lift: t, parking: t, petFriendly: f, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Kharadi Riverside", area: "kharadi", bhk: 4, rent: 80000, sqft: 2000, floor: 5, totalFloors: 12, bathrooms: 3, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: f, powerBackup: t },
  { name: "Kothrud Garden Bungalow", area: "kothrud", bhk: 5, rent: 110000, sqft: 2800, floor: 0, totalFloors: 2, bathrooms: 4, lift: f, parking: t, petFriendly: t, furnished: t, balcony: t, gated: f, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Pimple Saudagar Villa", area: "pimple-saudagar", bhk: 5, rent: 95000, sqft: 2600, floor: 0, totalFloors: 3, bathrooms: 5, lift: f, parking: t, petFriendly: t, furnished: f, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Aundh Twin Flat", area: "aundh", bhk: 2, rent: 36000, sqft: 950, floor: 4, totalFloors: 9, bathrooms: 2, lift: t, parking: t, petFriendly: f, furnished: t, balcony: t, gated: t, societyGym: f, nearMetro: t, powerBackup: t },
  { name: "Viman Nagar Duo", area: "viman-nagar", bhk: 2, rent: 38000, sqft: 1000, floor: 7, totalFloors: 12, bathrooms: 2, lift: t, parking: t, petFriendly: t, furnished: t, balcony: t, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
  { name: "Hinjewadi Tech Nest", area: "hinjewadi", bhk: 2, rent: 28000, sqft: 900, floor: 3, totalFloors: 10, bathrooms: 2, lift: t, parking: t, petFriendly: t, furnished: f, balcony: f, gated: t, societyGym: t, nearMetro: f, powerBackup: t },
];

export const LISTINGS: Listing[] = rows.map((r, i) => ({ id: `L${String(i + 1).padStart(2, "0")}`, ...r }));
