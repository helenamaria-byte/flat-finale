import { Redis } from "@upstash/redis";
import type { Group, MemberResponse } from "./types";

// Vercel's Upstash integration sets KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

export const storageKind: "redis" | "memory" = redis ? "redis" : "memory";

// Local-dev fallback. It resets on restart and isn't shared between serverless instances.
const g = globalThis as unknown as { __flatmatchMem?: Map<string, unknown> };
const mem = (g.__flatmatchMem ??= new Map());

const TTL = 60 * 60 * 24 * 30; // 30 days

async function get<T>(key: string): Promise<T | null> {
  if (redis) return (await redis.get<T>(key)) ?? null;
  return (mem.get(key) as T) ?? null;
}
async function set(key: string, value: unknown) {
  if (redis) await redis.set(key, value, { ex: TTL });
  else mem.set(key, value);
}
async function del(key: string) {
  if (redis) await redis.del(key);
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
export const getResponses = (id: string) =>
  Promise.all([0, 1, 2].map((i) => get<MemberResponse>(memberKey(id, i))));

export const getExplanation = <T>(id: string) => get<T>(explainKey(id));
export const saveExplanation = (id: string, v: unknown) => set(explainKey(id), v);
