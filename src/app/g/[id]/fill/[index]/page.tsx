"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AREA_IDS, areaName } from "@/lib/areas";
import { FEATURES } from "@/lib/features";
import { rupees } from "@/lib/match";
import type { AreaId, FeatureKey, GroupStatus, Pref } from "@/lib/types";

const LABELS = ["Office", "College", "Gym", "Family", "Partner", "Other"];
const STEP_TITLES = ["Budget", "Places", "The flat", "Review"];

interface AnchorDraft {
  preset: string;
  custom: string;
  area: AreaId | "";
  maxMinutes: number;
}

const PREF_OPTIONS: { value: Pref; label: string; active: string }[] = [
  { value: "must", label: "Must have", active: "bg-clay text-white border-clay" },
  { value: "nice", label: "Nice to have", active: "bg-teal text-white border-teal" },
  { value: "skip", label: "Don't mind", active: "bg-sand text-ink border-sand-dark" },
];

export default function FillPage() {
  const { id, index } = useParams<{ id: string; index: string }>();
  const i = Number(index);
  const router = useRouter();

  const [status, setStatus] = useState<GroupStatus | null>(null);
  const [step, setStep] = useState(0);
  const [maxRent, setMaxRent] = useState(20000);
  const [noGo, setNoGo] = useState<AreaId[]>([]);
  const [noGoCustom, setNoGoCustom] = useState<string[]>([]);
  const [customDraft, setCustomDraft] = useState("");
  const [anchors, setAnchors] = useState<AnchorDraft[]>([{ preset: "Office", custom: "", area: "", maxMinutes: 30 }]);
  const [features, setFeatures] = useState<Record<FeatureKey, Pref>>(
    () => Object.fromEntries(FEATURES.map((f) => [f.key, "skip"])) as Record<FeatureKey, Pref>,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    fetch(`/api/groups/${id}`, { cache: "no-store" }).then(async (r) => r.ok && setStatus(await r.json()));
  }, [id]);

  if (!status) return <p className="mt-16 text-center text-muted">Loading…</p>;
  const name = status.group.members[i];
  if (!name) return <p className="mt-16 text-center text-muted">We couldn&apos;t find that person in this group.</p>;
  const alreadyDone = status.submitted[i];
  const groupSize = status.group.members.length;

  const anchorLabel = (a: AnchorDraft) => (a.preset === "Other" ? a.custom.trim() : a.preset);
  const updateAnchor = (k: number, patch: Partial<AnchorDraft>) =>
    setAnchors((prev) => prev.map((a, j) => (j === k ? { ...a, ...patch } : a)));

  function validate(s: number): string {
    if (s === 0 && !(maxRent >= 5000)) return "Enter a monthly budget of at least ₹5,000.";
    if (s === 1) {
      for (const a of anchors) {
        if (!anchorLabel(a)) return "Give each place a name.";
        if (!a.area) return `Pick which area your ${anchorLabel(a).toLowerCase()} is in.`;
      }
    }
    return "";
  }

  // A typed place that matches a listed area becomes that area's chip; anything else is kept as typed.
  function addCustomPlace() {
    const place = customDraft.trim().replace(/\s+/g, " ").slice(0, 40);
    setCustomDraft("");
    if (!place) return;
    const known = AREA_IDS.find((ar) => areaName(ar).toLowerCase() === place.toLowerCase());
    if (known) setNoGo((prev) => (prev.includes(known) ? prev : [...prev, known]));
    else setNoGoCustom((prev) => (prev.some((p) => p.toLowerCase() === place.toLowerCase()) || prev.length >= 10 ? prev : [...prev, place]));
  }

  function next() {
    if (step === 1 && customDraft.trim()) addCustomPlace();
    const e = validate(step);
    setError(e);
    if (!e) setStep(step + 1);
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/groups/${id}/members/${i}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxRent,
          noGoAreas: noGo,
          noGoCustom,
          anchors: anchors.map((a) => ({ label: anchorLabel(a), area: a.area, maxMinutes: a.maxMinutes })),
          features,
        }),
      });
      const data = await res.json().catch(() => ({ error: "The server had a problem saving. Please try again." }));
      if (!res.ok) throw new Error(data.error ?? "Couldn't save your answers.");
      router.push(`/g/${id}?done=${i}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  const musts = FEATURES.filter((f) => features[f.key] === "must");
  const nices = FEATURES.filter((f) => features[f.key] === "nice");

  return (
    <div className="rise mx-auto max-w-2xl pt-2 sm:pt-6">
      <Link href={`/g/${id}`} className="text-sm text-muted hover:text-ink">← {status.group.name}</Link>
      <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Hi {name}, what do you need?</h1>
      <p className="mt-2 text-muted">Be honest. Only you can see these answers. The others will see how each flat works for you, not what you wrote.</p>
      {alreadyDone && (
        <p className="mt-4 rounded-xl bg-warn/10 px-4 py-3 text-sm text-warn">You&apos;ve already submitted. Submitting again will replace your earlier answers.</p>
      )}

      {/* progress */}
      <ol className="mt-8 flex gap-2">
        {STEP_TITLES.map((t, s) => (
          <li key={t} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${s <= step ? "bg-clay" : "bg-sand"}`} />
            <span className={`mt-1.5 block text-xs ${s === step ? "font-semibold text-ink" : "text-muted"}`}>{t}</span>
          </li>
        ))}
      </ol>

      <div className="card mt-6 p-6 sm:p-8">
        {step === 0 && (
          <div className="rise space-y-5">
            <div>
              <h2 className="font-display text-2xl font-semibold">What&apos;s the most you can pay each month?</h2>
              <p className="mt-1 text-sm text-muted">Your share of the rent, not the total. If a flat needs more than this from you, it&apos;s a dealbreaker.</p>
            </div>
            <div className="text-center font-display text-5xl font-semibold text-teal">{rupees(maxRent)}</div>
            <input type="range" min={8000} max={50000} step={500} value={maxRent} onChange={(e) => setMaxRent(Number(e.target.value))} className="w-full accent-[#c65f3a]" aria-label="Maximum monthly rent" />
            <div className="flex justify-between text-xs text-muted"><span>₹8,000</span><span>₹50,000</span></div>
            <label className="block">
              <span className="text-sm text-muted">Or type an exact amount</span>
              <input type="number" className="input mt-1" value={maxRent} min={5000} step={500} onChange={(e) => setMaxRent(Number(e.target.value))} />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="rise space-y-8">
            <section>
              <h2 className="font-display text-2xl font-semibold">Places you need to get to</h2>
              <p className="mt-1 text-sm text-muted">Office, college, gym, family: anywhere you go often. Flats that are too far away will be ruled out.</p>
              <div className="mt-4 space-y-3">
                {anchors.map((a, k) => (
                  <div key={k} className="rounded-2xl border border-sand bg-cream/60 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-semibold text-muted">Place</span>
                        <select className="input mt-1" value={a.preset} onChange={(e) => updateAnchor(k, { preset: e.target.value })}>
                          {LABELS.map((l) => <option key={l}>{l}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-muted">Area</span>
                        <select className="input mt-1" value={a.area} onChange={(e) => updateAnchor(k, { area: e.target.value as AreaId })}>
                          <option value="">Choose an area…</option>
                          {AREA_IDS.map((ar) => <option key={ar} value={ar}>{areaName(ar)}</option>)}
                        </select>
                      </label>
                    </div>
                    {a.preset === "Other" && (
                      <input className="input mt-3" placeholder="What is it? e.g. Dance class" value={a.custom} maxLength={30} onChange={(e) => updateAnchor(k, { custom: e.target.value })} />
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm whitespace-nowrap">At most</span>
                      <input type="range" min={10} max={90} step={5} value={a.maxMinutes} onChange={(e) => updateAnchor(k, { maxMinutes: Number(e.target.value) })} className="flex-1 accent-[#1f5c58]" aria-label="Maximum commute minutes" />
                      <span className="w-16 text-right text-sm font-semibold">{a.maxMinutes} min</span>
                    </div>
                    {anchors.length > 1 && (
                      <button className="mt-2 text-xs text-muted hover:text-bad" onClick={() => setAnchors(anchors.filter((_, j) => j !== k))}>Remove</button>
                    )}
                  </div>
                ))}
                {anchors.length < 4 && (
                  <button className="btn btn-ghost w-full py-2.5 text-sm" onClick={() => setAnchors([...anchors, { preset: "Gym", custom: "", area: "", maxMinutes: 20 }])}>
                    + Add another place
                  </button>
                )}
                {anchors.length === 0 && <p className="text-sm text-muted">No places added, so commute won&apos;t count for you.</p>}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">Areas you won&apos;t live in</h2>
              <p className="mt-1 text-sm text-muted">Tap any that are a hard no. Leave them all off if you&apos;re open anywhere.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {AREA_IDS.map((ar) => {
                  const on = noGo.includes(ar);
                  return (
                    <button
                      key={ar}
                      onClick={() => setNoGo((prev) => (prev.includes(ar) ? prev.filter((x) => x !== ar) : [...prev, ar]))}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${on ? "border-bad bg-bad/10 text-bad line-through" : "border-sand-dark bg-white hover:border-ink"}`}
                      aria-pressed={on}
                    >
                      {areaName(ar)}
                    </button>
                  );
                })}
                {noGoCustom.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-bad bg-bad/10 py-1.5 pr-2 pl-3.5 text-sm text-bad">
                    <span className="line-through">{p}</span>
                    <button onClick={() => setNoGoCustom((prev) => prev.filter((x) => x !== p))} className="rounded-full px-1 font-semibold hover:bg-bad/15" aria-label={`Remove ${p}`}>×</button>
                  </span>
                ))}
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCustomPlace();
                }}
              >
                <input
                  className="input"
                  placeholder="Not in the list? Type a place, e.g. Pashan"
                  value={customDraft}
                  maxLength={40}
                  onChange={(e) => setCustomDraft(e.target.value)}
                  aria-label="Add a place you won't live in"
                />
                <button className="btn btn-ghost shrink-0 px-5" disabled={!customDraft.trim()}>Add</button>
              </form>
            </section>
          </div>
        )}

        {step === 2 && (
          <div className="rise">
            <h2 className="font-display text-2xl font-semibold">What does the flat need?</h2>
            <p className="mt-1 text-sm text-muted">
              <strong className="text-clay">Must have</strong> means you won&apos;t take a flat without it. <strong className="text-teal">Nice to have</strong> means you&apos;d prefer it but can live without.
            </p>
            <div className="mt-5 divide-y divide-sand">
              {FEATURES.map((f) => (
                <div key={f.key} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">{f.label}</div>
                    <div className="text-xs text-muted">
                      {f.key === "ownRoom" ? `The flat needs ${groupSize}+ bedrooms` : f.key === "ownBathroom" ? `The flat needs ${groupSize}+ bathrooms` : f.hint}
                    </div>
                  </div>
                  <div className="flex gap-1.5" role="radiogroup" aria-label={f.label}>
                    {PREF_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        role="radio"
                        aria-checked={features[f.key] === o.value}
                        onClick={() => setFeatures((prev) => ({ ...prev, [f.key]: o.value }))}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${features[f.key] === o.value ? o.active : "border-sand-dark bg-white text-muted hover:border-ink"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rise space-y-5">
            <h2 className="font-display text-2xl font-semibold">Check your answers</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-semibold">Most I can pay</dt>
                <dd className="text-muted">{rupees(maxRent)} a month</dd>
              </div>
              <div>
                <dt className="font-semibold">Places I need to reach</dt>
                <dd className="text-muted">{anchors.length ? anchors.map((a) => `${anchorLabel(a)} in ${a.area ? areaName(a.area) : "?"} (≤ ${a.maxMinutes} min)`).join(" · ") : "None"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Won&apos;t live in</dt>
                <dd className="text-muted">{noGo.length || noGoCustom.length ? [...noGo.map(areaName), ...noGoCustom].join(", ") : "Open to all areas"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-clay">Must haves</dt>
                <dd className="text-muted">{musts.length ? musts.map((f) => f.label).join(", ") : "None"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-teal">Nice to haves</dt>
                <dd className="text-muted">{nices.length ? nices.map((f) => f.label).join(", ") : "None"}</dd>
              </div>
            </dl>
          </div>
        )}

        {error && <p className="mt-5 rounded-lg bg-bad/10 px-3 py-2 text-sm text-bad">{error}</p>}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? <button className="btn btn-ghost" onClick={() => { setError(""); setStep(step - 1); }}>Back</button> : <span />}
          {step < 3 ? (
            <button className="btn btn-primary" onClick={next}>Next →</button>
          ) : (
            <button className="btn btn-primary" onClick={submit} disabled={busy}>{busy ? "Saving…" : "Submit my answers"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
