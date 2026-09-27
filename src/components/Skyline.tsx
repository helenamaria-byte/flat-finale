// A soft row of apartment blocks along the bottom of every page. Purely decorative.

// Small deterministic pseudo-random so server and client render the same windows.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const BUILDINGS = Array.from({ length: 16 }, (_, i) => {
  const w = 70 + Math.round(rand(i) * 50);
  const h = 70 + Math.round(rand(i + 40) * 130);
  return { w, h, tone: i % 3 };
}).map((b, i, all) => ({ ...b, x: -10 + all.slice(0, i).reduce((sum, p) => sum + p.w + 8, 0) }));

export default function Skyline() {
  const tones = ["#eadfcd", "#e2d4bd", "#dccbb0"];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[220px] opacity-70">
      <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        <circle cx="1180" cy="70" r="34" fill="#f6c56b" opacity="0.35" />
        {BUILDINGS.map((b, i) => {
          const bx = b.x;
          const y = 220 - b.h;
          const cols = Math.floor((b.w - 16) / 16);
          const rows = Math.floor((b.h - 24) / 20);
          return (
            <g key={i}>
              <rect x={bx} y={y} width={b.w} height={b.h} rx="3" fill={tones[b.tone]} />
              {b.tone === 1 && <rect x={bx + b.w / 2 - 12} y={y - 10} width="24" height="10" fill={tones[b.tone]} />}
              {Array.from({ length: rows }).flatMap((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const lit = rand(i * 100 + r * 10 + c) > 0.82;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={bx + 10 + c * 16}
                      y={y + 14 + r * 20}
                      width="8"
                      height="10"
                      rx="1.5"
                      fill={lit ? "#f6c56b" : "#fbf6ee"}
                      opacity={lit ? 0.9 : 0.55}
                    />
                  );
                }),
              )}
            </g>
          );
        })}
        <rect x="0" y="214" width="1440" height="6" fill="#d9c9b0" />
      </svg>
    </div>
  );
}
