import Anthropic from "@anthropic-ai/sdk";
import { areaName } from "./areas";
import { rupees } from "./match";
import type { MatchOption } from "./types";

export interface Explanation {
  summaries: string[];
  overall: string;
}

const SYSTEM = `You help a group of friends who are choosing a flat to share. You'll get a few shortlisted flats and, for each person, what they get, what they give up, and any dealbreakers. These were worked out by fixed rules, so treat them as facts.

For each flat, write 1–2 short, warm, plain-English sentences on the tradeoff: who does well, who is compromising, and on what. Then write one overall sentence on how the options differ, for example "Option A is easiest on budget; Option B is best for commutes."

Rules:
- Never recommend, rank or pick a flat. The group decides together.
- Don't invent facts. Only use what's in the data.
- Refer to people by name. Don't use gendered pronouns.
- Don't use em dashes.`;

export async function explainOptions(options: MatchOption[]): Promise<Explanation | null> {
  if (!process.env.ANTHROPIC_API_KEY || !options.length) return null;
  const client = new Anthropic();

  const data = options.map((o, i) => ({
    option: String.fromCharCode(65 + i),
    flat: `${o.listing.name}, ${o.listing.bhk}BHK in ${areaName(o.listing.area)}, ${rupees(o.listing.rent)}/month, floor ${o.listing.floor}`,
    nearMiss: o.nearMiss,
    people: o.people.map((p) => ({
      name: p.name,
      pays: rupees(p.share),
      gets: p.gets,
      givesUp: p.compromises,
      dealbreakers: p.dealbreakers,
    })),
  }));

  try {
    // Server-side fallbacks re-run a declined request on another model instead of returning a refusal.
    const params = {
      model: "claude-opus-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "low",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              summaries: { type: "array", items: { type: "string" } },
              overall: { type: "string" },
            },
            required: ["summaries", "overall"],
            additionalProperties: false,
          },
        },
      },
      system: SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(data, null, 2) }],
    };
    const res = await client.beta.messages.create(
      params as unknown as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming,
    );
    if (res.stop_reason === "refusal") return null;
    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = JSON.parse(text) as Explanation;
    if (!Array.isArray(parsed.summaries) || parsed.summaries.length !== options.length) return null;
    return parsed;
  } catch (err) {
    console.error("Claude explanation failed, using rule-based summaries", err);
    return null;
  }
}
