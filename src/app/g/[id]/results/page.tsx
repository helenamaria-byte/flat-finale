"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FlatBuilding } from "@/components/Buildings";
import { areaName } from "@/lib/areas";
import { FEATURES, hasFeature } from "@/lib/features";
import { rupees } from "@/lib/match";
import type { MatchOption, PersonVerdict, Results } from "@/lib/types";

function PersonColumn({ p }: { p: PersonVerdict }) {
  const mood = p.dealbreakers.length ? "bad" : p.compromises.length ? "warn" : "good";
  const moodText = { good: "Gets everything", warn: `Gives up ${p.compromises.length}`, bad: "Dealbreaker" }[mood];
  const moodCls = { good: "bg-good/10 text-good", warn: "bg-warn/10 text-warn", bad: "bg-bad/10 text-bad" }[mood];
  return (
    <div className="rounded-2xl border border-sand bg-cream/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{p.name}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${moodCls}`}>{moodText}</span>
      </div>
      <div className="mt-1 text-sm text-muted">Pays <strong className="text-ink">{rupees(p.share)}</strong>/month</div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {p.dealbreakers.map((t) => <li key={t} className="flex gap-2 text-bad"><span aria-hidden>✗</span><span>{t}</span></li>)}
        {p.compromises.map((t) => <li key={t} className="flex gap-2 text-warn"><span aria-hidden>⚠</span><span>{t}</span></li>)}
        {p.gets.map((t) => <li key={t} className="flex gap-2 text-ink/80"><span aria-hidden className="text-good">✓</span><span>{t}</span></li>)}
      </ul>
    </div>
  );
}

function OptionCard({ o, letter, delay }: { o: MatchOption; letter: string; delay: number }) {
  const groupSize = o.people.length;
  const l = o.listing;
  const perks = FEATURES.filter((f) => hasFeature(l, f.key, groupSize));
  return (
    <article className="card rise overflow-hidden" style={{ animationDelay: `${delay}ms` }}>
      <div className="grid gap-6 p-6 sm:grid-cols-[140px_1fr] sm:p-8">
        <FlatBuilding listing={l} className="mx-auto h-40 w-32 sm:h-44 sm:w-36" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold tracking-wider text-cream">OPTION {letter}</span>
            {o.nearMiss && <span className="rounded-full bg-bad/10 px-3 py-1 text-xs font-semibold text-bad">Near miss: someone would have to bend a dealbreaker</span>}
            {o.unevenSplit && <span className="rounded-full bg-warn/10 px-3 py-1 text-xs font-semibold text-warn">Works with an uneven rent split</span>}
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{l.name}</h2>
          <p className="text-muted">
            {areaName(l.area)} · {l.bhk}BHK · {l.sqft.toLocaleString("en-IN")} sq ft · {l.floor === 0 ? "Ground floor" : `Floor ${l.floor} of ${l.totalFloors}`}
          </p>
          <p className="mt-2 font-display text-2xl text-teal">{rupees(l.rent)}<span className="font-sans text-sm text-muted"> /month total</span></p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {perks.map((f) => <span key={f.key} className="rounded-full bg-sand/70 px-2.5 py-0.5 text-xs">{f.label}</span>)}
          </div>
          <p className="mt-4 rounded-xl border-l-4 border-glow bg-glow/10 px-4 py-3 text-sm leading-relaxed">{o.summary}</p>
        </div>
      </div>
      <div className="grid gap-3 border-t border-sand bg-white/60 p-4 sm:p-6 sm:grid-cols-2 lg:grid-cols-3">
        {o.people.map((p) => <PersonColumn key={p.name} p={p} />)}
      </div>
    </article>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Results | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/groups/${id}/results`, { cache: "no-store" }).then(async (r) => {
      const body = await r.json();
      if (!r.ok) setError(body.error ?? "Something went wrong.");
      else setData(body);
    });
  }, [id]);

  if (error) {
    return (
      <div className="card mx-auto mt-10 max-w-md p-8 text-center">
        <p className="text-lg">{error}</p>
        <Link href={`/g/${id}`} className="btn btn-primary mt-6">Back to the group</Link>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mt-20 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sand border-t-clay" />
        <p className="mt-4 text-muted">Checking every listing against everyone&apos;s answers…</p>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-8">
      <Link href={`/g/${id}`} className="text-sm text-muted hover:text-ink">← {data.group.name}</Link>
      <h1 className="rise mt-3 font-display text-4xl font-semibold sm:text-5xl">
        {data.options.length ? `${data.options.length} flat${data.options.length > 1 ? "s" : ""} to talk about` : "Nothing fits yet"}
      </h1>
      <p className="rise mt-3 max-w-3xl text-lg text-muted">{data.overall}</p>
      <p className="mt-2 text-sm text-muted">
        Options are ordered by how many nice-to-haves they meet. This isn&apos;t a recommendation. The choice is yours.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted">
        <span><span className="text-good">✓</span> gets what they asked for</span>
        <span><span className="text-warn">⚠</span> compromise (a nice-to-have they&apos;d give up)</span>
        <span><span className="text-bad">✗</span> dealbreaker</span>
      </div>

      <div className="mt-6 space-y-8">
        {data.options.map((o, i) => <OptionCard key={o.listing.id} o={o} letter={String.fromCharCode(65 + i)} delay={i * 120} />)}
      </div>

      {data.options.length === 0 && (
        <div className="card mt-8 p-8">
          <p>No listing comes close to everyone&apos;s dealbreakers. The list below shows what&apos;s ruling out the most flats. That&apos;s a good place to start the conversation.</p>
        </div>
      )}

      {data.blockers.length > 0 && (
        <section className="card mt-10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">What ruled out the most flats</h2>
          <p className="mt-1 text-sm text-muted">
            Of {data.totalListings} listings, {data.qualifyingCount} met everyone&apos;s dealbreakers. If you want more options, these are the dealbreakers to talk about.
          </p>
          <ul className="mt-5 space-y-3">
            {data.blockers.map((b) => (
              <li key={b.person + b.reason}>
                <div className="flex justify-between text-sm">
                  <span><strong>{b.person}</strong>: {b.reason}</span>
                  <span className="text-muted">{b.count} of {data.totalListings} listings</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-sand">
                  <div className="h-full rounded-full bg-clay/70" style={{ width: `${(b.count / data.totalListings) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs text-muted">
        Listings are sample data for this demo, and commute times are rough peak-hour estimates.
        {data.aiUsed ? " Summaries are written by Gemini from the rule-based results." : " Summaries are generated from the rule-based results."}
      </p>
    </div>
  );
}
