import type { Listing } from "@/lib/types";

/** Draws a listing's building with the flat's floor lit up, plus a lift shaft if it has one. */
export function FlatBuilding({ listing, className = "" }: { listing: Listing; className?: string }) {
  const levels = Math.min(listing.totalFloors + 1, 12); // +1 for the ground floor
  const litRow = Math.round((listing.floor * (levels - 1)) / Math.max(listing.totalFloors, 1));
  const rowH = 11;
  const bodyH = levels * rowH + 14;
  const top = 150 - bodyH;
  return (
    <svg viewBox="0 0 120 160" className={className} aria-label={`Floor ${listing.floor} of ${listing.totalFloors}`}>
      <ellipse cx="60" cy="152" rx="54" ry="6" fill="#eadfcd" />
      <rect x="26" y={top} width="68" height={bodyH} rx="4" fill="#1f5c58" />
      <rect x="22" y={top - 5} width="76" height="7" rx="2" fill="#174744" />
      {listing.lift && <rect x="83" y={top + 6} width="7" height={bodyH - 10} rx="1.5" fill="#174744" />}
      {Array.from({ length: levels }).map((_, r) => {
        const row = levels - 1 - r; // row 0 = ground floor
        const y = top + 8 + r * rowH;
        const isFlat = row === litRow;
        return (
          <g key={r}>
            {isFlat && <rect x="28" y={y - 2} width={listing.lift ? 54 : 64} height={rowH - 1} rx="2" fill="#c65f3a" opacity="0.35" />}
            {[0, 1, 2].map((c) => (
              <rect key={c} x={33 + c * 16} y={y} width="10" height="6" rx="1" fill={isFlat ? "#f6c56b" : "#2f7470"} className={isFlat ? "flicker" : ""} />
            ))}
          </g>
        );
      })}
      <rect x="54" y="140" width="12" height="10" rx="1.5" fill="#f6c56b" opacity="0.8" />
      <circle cx="12" cy="136" r="9" fill="#8aa889" />
      <rect x="11" y="140" width="2" height="10" fill="#6f8b6e" />
      <circle cx="108" cy="140" r="7" fill="#8aa889" />
      <rect x="107" y="143" width="2" height="7" fill="#6f8b6e" />
    </svg>
  );
}

/** Three-storey building where each person has a window that lights up once they've submitted. */
export function HubBuilding({ names, submitted }: { names: string[]; submitted: boolean[] }) {
  return (
    <svg viewBox="0 0 220 250" className="mx-auto w-full max-w-[240px]" role="img" aria-label={`${submitted.filter(Boolean).length} of 3 submitted`}>
      <ellipse cx="110" cy="240" rx="100" ry="8" fill="#eadfcd" />
      <path d="M30 70 L110 18 L190 70 Z" fill="#c65f3a" />
      <rect x="40" y="68" width="140" height="170" rx="4" fill="#1f5c58" />
      {names.map((n, i) => {
        const y = 82 + i * 50;
        const lit = submitted[i];
        return (
          <g key={i}>
            <rect x="56" y={y} width="44" height="34" rx="4" fill={lit ? "#f6c56b" : "#174744"} className={lit ? "" : "flicker"} />
            <line x1="78" y1={y} x2="78" y2={y + 34} stroke={lit ? "#e0a94a" : "#2f7470"} strokeWidth="2" />
            <text x="112" y={y + 15} fill="#fbf6ee" fontSize="12" fontWeight="600">{n.length > 9 ? n.slice(0, 8) + "…" : n}</text>
            <text x="112" y={y + 29} fill={lit ? "#f6c56b" : "#9fbcb9"} fontSize="10">{lit ? "done ✓" : "waiting…"}</text>
          </g>
        );
      })}
      <rect x="98" y="218" width="24" height="20" rx="2" fill="#f6c56b" opacity="0.85" />
      <circle cx="20" cy="222" r="14" fill="#8aa889" />
      <rect x="19" y="228" width="3" height="12" fill="#6f8b6e" />
      <circle cx="202" cy="226" r="11" fill="#8aa889" />
      <rect x="201" y="231" width="3" height="9" fill="#6f8b6e" />
    </svg>
  );
}
