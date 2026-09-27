import { AREA_IDS } from "@/lib/areas";
import { FEATURES } from "@/lib/features";
import { getGroup, saveResponse, groupNotFound } from "@/lib/store";
import type { Anchor, AreaId, FeatureKey, MemberResponse, Pref } from "@/lib/types";

const isArea = (a: unknown): a is AreaId => AREA_IDS.includes(a as AreaId);

function parse(body: Record<string, unknown>): MemberResponse | string {
  const maxRent = Number(body.maxRent);
  if (!Number.isFinite(maxRent) || maxRent < 5000 || maxRent > 200000) return "Enter a monthly budget between ₹5,000 and ₹2,00,000.";

  const noGoAreas = (Array.isArray(body.noGoAreas) ? body.noGoAreas : []).filter(isArea);
  const noGoCustom = (Array.isArray(body.noGoCustom) ? body.noGoCustom : [])
    .filter((p): p is string => typeof p === "string")
    .map((p) => p.trim().slice(0, 40))
    .filter(Boolean)
    .slice(0, 10);

  const rawAnchors = Array.isArray(body.anchors) ? body.anchors.slice(0, 4) : [];
  const anchors: Anchor[] = [];
  for (const a of rawAnchors as Record<string, unknown>[]) {
    const label = typeof a.label === "string" ? a.label.trim().slice(0, 30) : "";
    const maxMinutes = Math.round(Number(a.maxMinutes));
    if (!label || !isArea(a.area) || !(maxMinutes >= 5 && maxMinutes <= 180)) return "Each place needs a name, an area and a time limit.";
    anchors.push({ label, area: a.area, maxMinutes });
  }

  const rawFeatures = (body.features ?? {}) as Record<string, unknown>;
  const features = {} as Record<FeatureKey, Pref>;
  for (const f of FEATURES) {
    const v = rawFeatures[f.key];
    features[f.key] = v === "must" || v === "nice" ? v : "skip";
  }

  return { maxRent, noGoAreas, noGoCustom, anchors, features, submittedAt: new Date().toISOString() };
}

export async function POST(request: Request, { params }: RouteContext<"/api/groups/[id]/members/[index]">) {
  const { id, index } = await params;
  const i = Number(index);
  const group = await getGroup(id);
  if (!group) return groupNotFound();
  if (!Number.isInteger(i) || i < 0 || i >= group.members.length) return Response.json({ error: "Unknown member" }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const parsed = parse(body);
  if (typeof parsed === "string") return Response.json({ error: parsed }, { status: 400 });

  await saveResponse(id, i, parsed);
  return Response.json({ ok: true });
}
