import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";
import type { Group, MemberResponse } from "./types";

// Supabase: the Vercel integration sets SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
// The service role key stays on the server; the table has row-level security on with no public policies.
const sbUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = sbUrl && sbKey ? createClient(sbUrl, sbKey, { auth: { persistSession: false } }) : null;

// Upstash Redis: Vercel's integration sets <PREFIX>_KV_REST_API_* (FLATDB is the prefix this project's
// database was connected with) or KV_REST_API_* with no prefix; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.FLATDB_KV_REST_API_URL ?? process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.FLATDB_KV_REST_API_TOKEN ?? process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = !supabase && url && token ? new Redis({ url, token }) : null;

export const storageKind: "supabase" | "redis" | "memory" = supabase ? "supabase" : redis ? "redis" : "memory";

// On Vercel, in-memory storage isn't shared between server instances, so groups seem to vanish.
export const deployedWithoutDb = storageKind === "memory" && !!process.env.VERCEL;
export const STORAGE_WARNING =
  "No database is connected, so groups can't be saved on the live site. Connect Supabase in Vercel (see the README), redeploy, then start a new group.";

export function groupNotFound() {
  return Response.json(
    { error: deployedWithoutDb ? STORAGE_WARNING : "We couldn't find that group. The link may be wrong or the group may have expired." },
    { status: 404 },
  );
}

// Local-dev fallback. It resets on restart and isn't shared between serverless instances.
const g = globalThis as unknown as { __flatFinaleMem?: Map<string, unknown> };
const mem = (g.__flatFinaleMem ??= new Map());

const TTL = 60 * 60 * 24 * 30; // 30 days
const TABLE = "flat_finale_kv";

async function get<T>(key: string): Promise<T | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("value")
      .eq("key", key)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return (data?.value as T) ?? null;
  }
  if (redis) return (await redis.get<T>(key)) ?? null;
  return (mem.get(key) as T) ?? null;
}
async function set(key: string, value: unknown) {
  if (supabase) {
    const expires_at = new Date(Date.now() + TTL * 1000).toISOString();
    const { error } = await supabase.from(TABLE).upsert({ key, value, expires_at });
    if (error) throw new Error(`Supabase write failed: ${error.message}`);
  } else if (redis) await redis.set(key, value, { ex: TTL });
  else mem.set(key, value);
}
async function del(key: string) {
  if (supabase) {
    const { error } = await supabase.from(TABLE).delete().eq("key", key);
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  } else if (redis) await redis.del(key);
  else mem.delete(key);
}

const groupKey = (id: string) => `fm:group:${id}`;
const memberKey = (id: string, i: number) => `fm:group:${id}:m:${i}`;
const explainKey = (id: string) => `fm:group:${id}:explain`;

export const saveGroup = (g: Group) => set(groupKey(g.id), g);
export const getGroup = (id: string) => get<Group>(groupKey(id));

// One key per member so two people submitting at the same time can't overwrite each other.
export async function saveResponse(id: string, i: number, r: MemberResponse) {
  await set(memberKey(id, i), r);
  await del(explainKey(id));
}
export const getResponses = (id: string, count: number) =>
  Promise.all(Array.from({ length: count }, (_, i) => get<MemberResponse>(memberKey(id, i))));

export const getExplanation = <T>(id: string) => get<T>(explainKey(id));
export const saveExplanation = (id: string, v: unknown) => set(explainKey(id), v);
