import { areaName, commuteMinutes } from "./areas";
import { FEATURES, featureLabel, hasFeature, missingText } from "./features";
import { LISTINGS } from "./listings";
import type { Blocker, Group, Listing, MatchOption, MemberResponse, PersonVerdict } from "./types";

export const rupees = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/**
 * Splits rent so nobody pays more than their max. Tries an even split first; if someone
 * can't afford an even share, they pay their max and the others share the remainder.
 * Returns null when the rent is higher than everyone's budgets combined.
 */
export function splitRent(rent: number, maxes: number[]): number[] | null {
  if (maxes.reduce((a, b) => a + b, 0) < rent) return null;
  const shares = maxes.map(() => 0);
  let open = maxes.map((_, i) => i);
  let remaining = rent;
  while (open.length) {
    const even = remaining / open.length;
    const capped = open.filter((i) => maxes[i] < even);
    if (!capped.length) {
      open.forEach((i) => (shares[i] = even));
      break;
    }
    capped.forEach((i) => {
      shares[i] = maxes[i];
      remaining -= maxes[i];
    });
    open = open.filter((i) => !capped.includes(i));
  }
  return shares.map((s) => Math.round(s / 100) * 100);
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function matchesPlace(listing: Listing, place: string) {
  const p = norm(place);
  if (p.length < 3) return false;
  const area = norm(areaName(listing.area));
  return area.includes(p) || p.includes(area) || norm(listing.name).includes(p);
}

interface Evaluated {
  listing: Listing;
  people: PersonVerdict[];
  unevenSplit: boolean;
  blockerKeys: { person: string; key: string; reason: string }[];
  niceMet: number;
  compromiseCount: number;
  dealbreakerCount: number;
}

function evaluate(listing: Listing, names: string[], responses: MemberResponse[]): Evaluated {
  const maxes = responses.map((r) => r.maxRent);
  const shares = splitRent(listing.rent, maxes);
  const n = names.length;
  const even = listing.rent / n;
  const unevenSplit = !!shares && shares.some((s) => Math.abs(s - even) > 100);
  const blockerKeys: Evaluated["blockerKeys"] = [];
  let niceMet = 0;

  const people = responses.map((r, i): PersonVerdict => {
    const name = names[i];
    const v: PersonVerdict = { name, share: shares ? shares[i] : Math.round(even), gets: [], compromises: [], dealbreakers: [] };
    const block = (key: string, reason: string, text: string) => {
      v.dealbreakers.push(text);
      blockerKeys.push({ person: name, key, reason });
    };

    // Budget
    if (!shares) {
      if (even > r.maxRent) block("budget", "Over budget", `An even share (${rupees(even)}) is over their ${rupees(r.maxRent)} max`);
      else v.gets.push(`Even share ${rupees(even)} is within budget, but the total rent is over the group's combined budget`);
    } else if (shares[i] > even + 100) {
      v.compromises.push(`Pays ${rupees(shares[i])}, which is ${rupees(shares[i] - even)} more than an even split (still within their ${rupees(r.maxRent)} max)`);
    } else {
      v.gets.push(`Pays ${rupees(shares[i])} of their ${rupees(r.maxRent)} budget`);
    }

    // Areas this person won't consider
    if (r.noGoAreas.includes(listing.area)) {
      block(`nogo:${listing.area}`, `Won't live in ${areaName(listing.area)}`, `It's in ${areaName(listing.area)}, one of their no-go areas`);
    }
    // Places typed in by hand: rule out listings whose area or name matches.
    for (const place of r.noGoCustom ?? []) {
      if (matchesPlace(listing, place)) {
        block(`nogo-custom:${place.toLowerCase()}`, `Won't live in ${place}`, `It's in or near ${place}, one of their no-go places`);
      }
    }

    // Commute limits
    for (const a of r.anchors) {
      const mins = commuteMinutes(listing.area, a.area);
      if (mins > a.maxMinutes) {
        block(`commute:${a.label}:${a.area}`, `Too far from ${a.label.toLowerCase()} (${areaName(a.area)})`,
          `${a.label} in ${areaName(a.area)} is about ${mins} min away. The limit is ${a.maxMinutes}`);
      } else {
        v.gets.push(`${a.label} in ${areaName(a.area)} is about ${mins} min away (limit ${a.maxMinutes})`);
      }
    }

    // Flat features
    for (const f of FEATURES) {
      const pref = r.features[f.key];
      if (pref === "skip") continue;
      const has = hasFeature(listing, f.key, n);
      if (pref === "must") {
        if (has) v.gets.push(featureLabel(f.key));
        else block(`feature:${f.key}`, `Needs: ${featureLabel(f.key).toLowerCase()}`, missingText(listing, f.key, n));
      } else if (has) {
        v.gets.push(featureLabel(f.key));
        niceMet++;
      } else {
        v.compromises.push(missingText(listing, f.key, n));
      }
    }
    return v;
  });

  return {
    listing,
    people,
    unevenSplit,
    blockerKeys,
    niceMet,
    compromiseCount: people.reduce((n, p) => n + p.compromises.length, 0),
    dealbreakerCount: people.reduce((n, p) => n + p.dealbreakers.length, 0),
  };
}

export function fallbackSummary(o: Pick<MatchOption, "people" | "nearMiss">): string {
  const parts = o.people.map((p) =>
    p.dealbreakers.length
      ? `${p.name} has a dealbreaker (${p.dealbreakers[0].toLowerCase()})`
      : p.compromises.length
        ? `${p.name} gives up ${p.compromises.length} thing${p.compromises.length > 1 ? "s" : ""}`
        : `${p.name} gets everything they asked for`,
  );
  return parts.join("; ") + ".";
}

/** Minimum bedrooms so that nobody has to share a room with more than one other person. */
export const minBedrooms = (people: number) => Math.ceil(people / 2);

export function computeMatches(group: Group, responses: MemberResponse[]) {
  const names = group.members;
  const all = LISTINGS.filter((l) => l.bhk >= minBedrooms(names.length)).map((l) => evaluate(l, names, responses));

  const rankFit = (a: Evaluated, b: Evaluated) =>
    b.niceMet - a.niceMet || a.compromiseCount - b.compromiseCount || a.listing.rent - b.listing.rent;

  const qualifying = all.filter((e) => e.dealbreakerCount === 0).sort(rankFit);
  const picked: { e: Evaluated; nearMiss: boolean }[] = qualifying.slice(0, 3).map((e) => ({ e, nearMiss: false }));

  // If fewer than 2 flats clear every dealbreaker, add the closest near-misses so there's still something to discuss.
  if (picked.length < 2) {
    const near = all
      .filter((e) => e.dealbreakerCount > 0 && e.dealbreakerCount <= 2)
      .sort((a, b) => a.dealbreakerCount - b.dealbreakerCount || rankFit(a, b));
    for (const e of near) {
      if (picked.length >= 3) break;
      picked.push({ e, nearMiss: true });
    }
  }

  const options: MatchOption[] = picked.map(({ e, nearMiss }) => {
    const o = { listing: e.listing, people: e.people, nearMiss, unevenSplit: e.unevenSplit, summary: "" };
    o.summary = fallbackSummary(o);
    return o;
  });

  // Which constraints ruled out the most listings. Useful to see in the group conversation.
  const counts = new Map<string, Blocker>();
  for (const e of all) {
    const seen = new Set<string>();
    for (const b of e.blockerKeys) {
      const id = `${b.person}|${b.key}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const cur = counts.get(id) ?? { person: b.person, reason: b.reason, count: 0 };
      cur.count++;
      counts.set(id, cur);
    }
  }
  const blockers = [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 4);

  return { options, totalListings: all.length, qualifyingCount: qualifying.length, blockers };
}
