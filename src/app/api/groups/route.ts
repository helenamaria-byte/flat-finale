import { saveGroup } from "@/lib/store";
import type { Group } from "@/lib/types";

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = clean(body.name, 60);
  const members = Array.isArray(body.members) ? body.members.map((m: unknown) => clean(m, 30)) : [];

  if (!name) return Response.json({ error: "Give your group a name." }, { status: 400 });
  if (members.length !== 3 || members.some((m: string) => !m)) {
    return Response.json({ error: "Enter all three names." }, { status: 400 });
  }
  if (new Set(members.map((m: string) => m.toLowerCase())).size !== 3) {
    return Response.json({ error: "Each person needs a different name." }, { status: 400 });
  }

  const group: Group = {
    id: crypto.randomUUID().replace(/-/g, "").slice(0, 10),
    name,
    members: members as Group["members"],
    createdAt: new Date().toISOString(),
  };
  await saveGroup(group);
  return Response.json({ id: group.id });
}
