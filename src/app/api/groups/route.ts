import { MAX_PEOPLE, MIN_PEOPLE } from "@/lib/limits";
import { deployedWithoutDb, saveGroup, STORAGE_WARNING } from "@/lib/store";
import type { Group } from "@/lib/types";

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (deployedWithoutDb) return Response.json({ error: STORAGE_WARNING }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const name = clean(body.name, 60);
  const members = Array.isArray(body.members) ? body.members.map((m: unknown) => clean(m, 30)) : [];

  if (!name) return Response.json({ error: "Give your group a name." }, { status: 400 });
  if (members.length < MIN_PEOPLE || members.length > MAX_PEOPLE) {
    return Response.json({ error: `A group needs ${MIN_PEOPLE} to ${MAX_PEOPLE} people.` }, { status: 400 });
  }
  if (members.some((m: string) => !m)) {
    return Response.json({ error: "Enter everyone's name." }, { status: 400 });
  }
  if (new Set(members.map((m: string) => m.toLowerCase())).size !== members.length) {
    return Response.json({ error: "Each person needs a different name." }, { status: 400 });
  }

  const group: Group = {
    id: crypto.randomUUID().replace(/-/g, "").slice(0, 10),
    name,
    members,
    createdAt: new Date().toISOString(),
  };
  await saveGroup(group);
  return Response.json({ id: group.id });
}
