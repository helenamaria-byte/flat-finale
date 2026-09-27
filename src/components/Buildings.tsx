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

/** A building with one window per person that lights up once they've submitted. */
export function HubBuilding({ names, submitted }: { names: string[]; submitted: boolean[] }) {
  const cols = names.length > 4 ? 2 : 1;
  const rows = Math.ceil(names.length / cols);
  const cellW = 116, cellH = 46;
  const bodyW = cols * cellW + 16;
  const bx = 36, top = 70;
  const bodyH = rows * cellH + 44;
  const W = bodyW + bx * 2, H = top + bodyH + 14;
  const ground = top + bodyH;
  const cx = bx + bodyW / 2;
  const maxLen = cols === 2 ? 8 : 10;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: cols === 2 ? 340 : 240 }} role="img" aria-label={`${submitted.filter(Boolean).length} of ${names.length} submitted`}>
      <ellipse cx={W / 2} cy={ground + 4} rx={W / 2 - 8} ry="8" fill="#eadfcd" />
      <path d={`M${bx - 10} ${top + 2} L${cx} ${top - 50} L${bx + bodyW + 10} ${top + 2} Z`} fill="#c65f3a" />
      <rect x={bx} y={top} width={bodyW} height={bodyH} rx="4" fill="#1f5c58" />
      {names.map((n, i) => {
        const x = bx + 8 + (i % cols) * cellW;
        const y = top + 12 + Math.floor(i / cols) * cellH;
        const lit = submitted[i];
        return (
          <g key={i}>
            <rect x={x + 6} y={y} width="36" height="32" rx="4" fill={lit ? "#f6c56b" : "#174744"} className={lit ? "" : "flicker"} />
            <line x1={x + 24} y1={y} x2={x + 24} y2={y + 32} stroke={lit ? "#e0a94a" : "#2f7470"} strokeWidth="2" />
            <text x={x + 50} y={y + 14} fill="#fbf6ee" fontSize="12" fontWeight="600">{n.length > maxLen ? n.slice(0, maxLen - 1) + "…" : n}</text>
            <text x={x + 50} y={y + 28} fill={lit ? "#f6c56b" : "#9fbcb9"} fontSize="10">{lit ? "done ✓" : "waiting…"}</text>
          </g>
        );
      })}
      <rect x={cx - 12} y={ground - 22} width="24" height="22" rx="2" fill="#f6c56b" opacity="0.85" />
      <circle cx={bx - 16} cy={ground - 18} r="14" fill="#8aa889" />
      <rect x={bx - 17} y={ground - 12} width="3" height="12" fill="#6f8b6e" />
      <circle cx={bx + bodyW + 16} cy={ground - 14} r="11" fill="#8aa889" />
      <rect x={bx + bodyW + 15} y={ground - 9} width="3" height="9" fill="#6f8b6e" />
    </svg>
  );
}
