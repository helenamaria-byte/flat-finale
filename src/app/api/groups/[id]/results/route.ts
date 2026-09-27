import { explainOptions, type Explanation } from "@/lib/explain";
import { computeMatches } from "@/lib/match";
import { getExplanation, getGroup, getResponses, saveExplanation } from "@/lib/store";
import type { MemberResponse, Results } from "@/lib/types";

export const maxDuration = 60;

export async function GET(_request: Request, { params }: RouteContext<"/api/groups/[id]/results">) {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });

  const responses = await getResponses(id, group.members.length);
  if (responses.some((r) => !r)) {
    return Response.json({ error: "Not everyone has filled in their form yet." }, { status: 409 });
  }

  const n = group.members.length;
  const { options, totalListings, qualifyingCount, blockers } = computeMatches(group, responses as MemberResponse[]);
  let overall =
    qualifyingCount > 0
      ? `${qualifyingCount} of ${totalListings} listings with enough bedrooms for ${n} people meet everyone's dealbreakers.`
      : `None of the ${totalListings} listings with enough bedrooms for ${n} people meet every dealbreaker.`;

  // Claude only writes the plain-language summaries. The matching above is rule-based.
  // The result is cached per shortlist so reloading the page doesn't call the API again.
  const ids = options.map((o) => o.listing.id).join(",");
  let explanation = await getExplanation<Explanation & { ids: string }>(id);
  if (!explanation || explanation.ids !== ids) {
    const fresh = await explainOptions(options);
    explanation = fresh ? { ...fresh, ids } : null;
    if (explanation) await saveExplanation(id, explanation);
  }
  if (explanation) {
    options.forEach((o, i) => (o.summary = explanation!.summaries[i]));
    overall = `${overall} ${explanation.overall}`;
  }

  const results: Results = { group, options, totalListings, qualifyingCount, blockers, overall, aiUsed: !!explanation };
  return Response.json(results);
}
