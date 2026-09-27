"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { HubBuilding } from "@/components/Buildings";
import type { GroupStatus } from "@/lib/types";

function listNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}

function Hub() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const justDone = search.get("done");
  const [status, setStatus] = useState<GroupStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      const res = await fetch(`/api/groups/${id}`, { cache: "no-store" });
      if (!alive) return;
      if (res.status === 404) return setNotFound(true);
      if (res.ok) setStatus(await res.json());
    }
    load();
    // Check every few seconds so this page updates when the others submit.
    const t = setInterval(load, 4000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="card mx-auto mt-10 max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">We couldn&apos;t find that group</h1>
        <p className="mt-2 text-muted">The link might be wrong or the group may have expired.</p>
        <Link href="/" className="btn btn-primary mt-6">Start a new group</Link>
      </div>
    );
  }
  if (!status) return <p className="mt-16 text-center text-muted">Loading your group…</p>;

  const { group, submitted } = status;
  const doneCount = submitted.filter(Boolean).length;
  const waiting = group.members.filter((_, i) => !submitted[i]);
  const total = group.members.length;
  const allDone = doneCount === total;
  const doneName = justDone !== null ? group.members[Number(justDone)] : null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin + `/g/${id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard can be blocked; the link is visible anyway */
    }
  }

  return (
    <div className="rise pt-4 sm:pt-8">
      {doneName && !allDone && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-good/30 bg-good/10 px-5 py-4 text-good">
          <span className="text-xl">✓</span>
          <p><strong>Thanks, {doneName}!</strong> Your answers are saved. The others can&apos;t see them.</p>
        </div>
      )}

      <p className="text-sm font-semibold uppercase tracking-widest text-clay">{group.name}</p>

      <div className="mt-2 grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            {allDone ? "Everyone's in! 🎉" : `${doneCount}/${total} filled`}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {allDone
              ? `All ${total} forms are done. Your shortlist is ready.`
              : `Waiting for ${listNames(waiting)} to fill in ${waiting.length === 1 ? "their form" : "their forms"}. Results appear once everyone is done.`}
          </p>

          <div className="mt-5 h-3 w-full max-w-md overflow-hidden rounded-full bg-sand">
            <div className="h-full rounded-full bg-teal transition-all duration-700" style={{ width: `${(doneCount / total) * 100}%` }} />
          </div>

          {allDone ? (
            <Link href={`/g/${id}/results`} className="btn btn-primary mt-8 px-8 py-4 text-lg">See our options →</Link>
          ) : (
            <div className="mt-8 space-y-3">
              <p className="text-sm font-semibold">Who&apos;s filling in now?</p>
              {group.members.map((m, i) =>
                submitted[i] ? (
                  <div key={i} className="flex max-w-md items-center justify-between rounded-2xl border border-sand bg-white/70 px-5 py-3.5">
                    <span className="font-medium">{m}</span>
                    <span className="text-sm font-semibold text-good">Done ✓</span>
                  </div>
                ) : (
                  <Link key={i} href={`/g/${id}/fill/${i}`} className="card flex max-w-md items-center justify-between px-5 py-3.5 transition hover:-translate-y-0.5 hover:border-clay">
                    <span className="font-medium">I&apos;m {m}</span>
                    <span className="text-sm font-semibold text-clay">Fill in my form →</span>
                  </Link>
                ),
              )}
            </div>
          )}
        </div>

        <div className="card p-6">
          <HubBuilding names={group.members} submitted={submitted} />
          {!allDone && (
            <div className="mt-5 border-t border-sand pt-5">
              <p className="text-sm font-semibold">Share this link with the others</p>
              <div className="mt-2 flex gap-2">
                <code className="flex-1 truncate rounded-lg bg-cream px-3 py-2 text-sm text-muted">{typeof window !== "undefined" ? `${window.location.host}/g/${id}` : `/g/${id}`}</code>
                <button onClick={copyLink} className="btn btn-ghost px-4 py-2 text-sm">{copied ? "Copied!" : "Copy"}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {status.storage === "memory" && (
        <p className="mt-10 text-xs text-muted">Dev mode: answers are kept in memory and reset when the server restarts. Connect Upstash Redis to keep them.</p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="mt-16 text-center text-muted">Loading your group…</p>}>
      <Hub />
    </Suspense>
  );
}
