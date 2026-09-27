import { getGroup, getResponses, storageKind } from "@/lib/store";
import type { GroupStatus } from "@/lib/types";

// Returns only who has submitted. Nobody's answers are visible until everyone is in.
export async function GET(_request: Request, { params }: RouteContext<"/api/groups/[id]">) {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });
  const responses = await getResponses(id, group.members.length);
  const status: GroupStatus = { group, submitted: responses.map(Boolean), storage: storageKind };
  return Response.json(status);
}
