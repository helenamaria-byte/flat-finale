import { GoogleGenAI } from "@google/genai";
import { areaName } from "./areas";
import { rupees } from "./match";
import type { MatchOption } from "./types";

export interface Explanation {
  summaries: string[];
  overall: string;
}

// Override with GEMINI_MODEL in Vercel if your key has access to a different model.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const SYSTEM = `You help a group of friends who are choosing a flat to share. You'll get a few shortlisted flats and, for each person, what they get, what they give up, and any dealbreakers. These were worked out by fixed rules, so treat them as facts.

For each flat, write 1–2 short, warm, plain-English sentences on the tradeoff: who does well, who is compromising, and on what. Then write one overall sentence on how the options differ, for example "Option A is easiest on budget; Option B is best for commutes."

Rules:
- Never recommend, rank or pick a flat. The group decides together.
- Don't invent facts. Only use what's in the data.
- Refer to people by name. Don't use gendered pronouns.
- Don't use em dashes.

Reply with JSON only: {"summaries": [one string per flat, in the same order], "overall": "one sentence"}`;

export async function explainOptions(options: MatchOption[]): Promise<Explanation | null> {
  // Strip spaces and line breaks that sneak in when a key is pasted into the Vercel dashboard.
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").replace(/\s+/g, "");
  if (!apiKey || !options.length) return null;
  const ai = new GoogleGenAI({ apiKey });

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
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: JSON.stringify(data, null, 2),
      config: {
        systemInstruction: SYSTEM,
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "object",
          properties: {
            summaries: { type: "array", items: { type: "string" } },
            overall: { type: "string" },
          },
          required: ["summaries", "overall"],
        },
        temperature: 0.4,
      },
    });
    const parsed = JSON.parse(res.text ?? "") as Explanation;
    if (!Array.isArray(parsed.summaries) || parsed.summaries.length !== options.length) {
      console.error("Gemini returned the wrong number of summaries, using rule-based summaries");
      return null;
    }
    return parsed;
  } catch (err) {
    // Quota limits, a bad key or an unknown model all land here; the app falls back to its own summaries.
    // Never log the key itself: some errors echo it back.
    const raw = err instanceof Error ? err.message : String(err);
    const safe = raw.split(apiKey).join("[key]").replace(/[A-Za-z0-9._-]{30,}/g, "[redacted]");
    console.error("Gemini summary failed, using rule-based summaries:", safe);
    return null;
  }
}
