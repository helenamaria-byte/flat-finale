export type AreaId =
  | "baner" | "balewadi" | "aundh" | "hinjewadi" | "wakad" | "pimple-saudagar"
  | "shivajinagar" | "deccan" | "kothrud" | "karve-nagar" | "camp"
  | "koregaon-park" | "kalyani-nagar" | "viman-nagar" | "kharadi"
  | "hadapsar" | "magarpatta";

export type FeatureKey =
  | "ownRoom" | "lift" | "parking" | "ownBathroom" | "petFriendly" | "furnished"
  | "balcony" | "gated" | "societyGym" | "nearMetro" | "powerBackup";

/** must = dealbreaker if missing, nice = preferred, skip = don't care */
export type Pref = "must" | "nice" | "skip";

export interface Anchor {
  label: string;
  area: AreaId;
  maxMinutes: number;
}

export interface MemberResponse {
  maxRent: number;
  noGoAreas: AreaId[];
  /** Places typed in by hand that aren't in the area list */
  noGoCustom: string[];
  anchors: Anchor[];
  features: Record<FeatureKey, Pref>;
  submittedAt: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
}

export interface GroupStatus {
  group: Group;
  submitted: boolean[];
  storage: "redis" | "memory";
}

export interface Listing {
  id: string;
  name: string;
  area: AreaId;
  bhk: number;
  rent: number;
  sqft: number;
  floor: number;
  totalFloors: number;
  bathrooms: number;
  lift: boolean;
  parking: boolean;
  petFriendly: boolean;
  furnished: boolean;
  balcony: boolean;
  gated: boolean;
  societyGym: boolean;
  nearMetro: boolean;
  powerBackup: boolean;
}

export interface PersonVerdict {
  name: string;
  share: number;
  gets: string[];
  compromises: string[];
  dealbreakers: string[];
}

export interface MatchOption {
  listing: Listing;
  people: PersonVerdict[];
  nearMiss: boolean;
  unevenSplit: boolean;
  summary: string;
}

export interface Blocker {
  person: string;
  reason: string;
  count: number;
}

export interface Results {
  group: Group;
  options: MatchOption[];
  totalListings: number;
  qualifyingCount: number;
  blockers: Blocker[];
  overall: string;
  aiUsed: boolean;
}
