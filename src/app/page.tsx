"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_PEOPLE, MIN_PEOPLE } from "@/lib/limits";

const EXAMPLES = ["Riya", "Meera", "Kavita", "Ananya", "Sara", "Ishaan", "Kabir", "Zoya", "Arjun", "Tara"];

const STEPS = [
  {
    title: "Name your group",
    body: "Add a group name, how many of you there are, and everyone's name.",
    icon: (
      <path d="M8 20v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 20v-.5A3 3 0 0 1 6.5 16.6M20 20v-.5a3 3 0 0 0-2.5-2.9M6 11a2 2 0 1 0 0-4M18 11a2 2 0 1 0 0-4" />
    ),
  },
  {
    title: "Each person fills in a private form",
    body: "Budget, areas you won't live in, commute limits, must-haves and nice-to-haves. Nobody sees anyone else's answers.",
    icon: <path d="M9 4h6M8 4H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2M9 11l2 2 4-4M9 17h6" />,
  },
  {
    title: "See 2–3 flats you can actually discuss",
    body: "Each flat shows what everyone gets, who's compromising, and on what. Dealbreakers are checked before anyone gets attached to a place.",
    icon: <path d="M4 10 12 4l8 6v10a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1V10Z" />,
  },
];

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<"intro" | "setup">("intro");
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState(["", "", ""]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Keeps names already typed when the group size changes.
  function resize(count: number) {
    if (!Number.isFinite(count)) return;
    const n = Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, Math.round(count)));
    setMembers((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? ""));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName, members }),
      });
      const data = await res.json().catch(() => ({ error: "The server had a problem saving. Please try again." }));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      router.push(`/g/${data.id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (stage === "intro") {
    return (
      <div className="rise pt-6 sm:pt-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-clay">Hello 👋</p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight font-semibold sm:text-6xl">
          Find a flat your whole group can live with.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Checking listings one objection at a time in a group chat doesn&apos;t work. By the time everyone has weighed in, someone&apos;s upset and the flat is gone. We&apos;ll do it the other way round: everyone says what they need <em>first</em>, then we look at flats.
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card rise p-6" style={{ animationDelay: `${120 + i * 100}ms` }}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                </span>
                <span className="font-display text-2xl text-sand-dark">0{i + 1}</span>
              </div>
              <h2 className="font-semibold">{s.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <button className="btn btn-primary px-8 py-4 text-lg" onClick={() => setStage("setup")}>
            Let&apos;s begin →
          </button>
          <p className="text-sm text-muted">Takes about 3 minutes each. The app doesn&apos;t pick a flat. You decide together.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rise mx-auto max-w-xl pt-6 sm:pt-10">
      <button className="mb-6 text-sm text-muted hover:text-ink" onClick={() => setStage("intro")}>← Back</button>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Who&apos;s moving in?</h1>
      <p className="mt-2 text-muted">Any group size from {MIN_PEOPLE} to {MAX_PEOPLE}. You&apos;ll get a link to share with everyone.</p>

      <form onSubmit={create} className="card mt-8 space-y-6 p-6 sm:p-8">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Group name</span>
          <input className="input" placeholder="e.g. The Baner Dreamers" value={groupName} onChange={(e) => setGroupName(e.target.value)} maxLength={60} required />
        </label>
        <fieldset className="space-y-3">
          <div className="mb-3 flex items-center justify-between gap-4">
            <legend className="text-sm font-semibold">How many of you?</legend>
            <div className="flex items-center gap-2" role="group" aria-label="Number of flatmates">
              <button type="button" className="btn btn-ghost h-9 w-9 p-0 text-lg" onClick={() => resize(members.length - 1)} disabled={members.length <= MIN_PEOPLE} aria-label="One fewer person">−</button>
              <select
                className="input w-20 px-2 py-1.5 text-center font-semibold"
                value={members.length}
                onChange={(e) => resize(Number(e.target.value))}
                aria-label="Number of people"
              >
                {Array.from({ length: MAX_PEOPLE - MIN_PEOPLE + 1 }, (_, k) => MIN_PEOPLE + k).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button type="button" className="btn btn-ghost h-9 w-9 p-0 text-lg" onClick={() => resize(members.length + 1)} disabled={members.length >= MAX_PEOPLE} aria-label="One more person">+</button>
            </div>
          </div>
          {members.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-glow/40 text-sm font-semibold text-clay-dark">{i + 1}</span>
              <input
                className="input"
                placeholder={`e.g. ${EXAMPLES[i] ?? `Person ${i + 1}`}`}
                value={m}
                maxLength={30}
                required
                onChange={(e) => setMembers((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              />
            </div>
          ))}
        </fieldset>
        {error && <p className="rounded-lg bg-bad/10 px-3 py-2 text-sm text-bad">{error}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Creating…" : "Create our group"}</button>
      </form>
    </div>
  );
}
