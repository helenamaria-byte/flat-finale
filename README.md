# Flat-Finale

A group of friends (2 to 10 people) want to share a flat. Instead of arguing about listings one objection at a time, each person fills in a private form first. Flat-Finale then shows 2–3 flats with a clear breakdown of what each person gets and what they give up.

## How it works

1. **Setup:** name the group, choose how many people (2–10) and enter their names.
2. **Private forms:** each person enters their max rent, areas they won't live in (from the list or typed in), places they need to reach (with a time limit), and must-have or nice-to-have features such as their own bedroom.
3. **Status page:** shows who's done, e.g. "1/3 filled, waiting for Meera and Kavita". Answers stay hidden.
4. **Results:** once everyone is done, listings without enough bedrooms (at most 2 people per room) are skipped, flats that break any dealbreaker are ruled out and the rest are ranked by nice-to-haves. Each option shows ✓ gets / ⚠ compromises / ✗ dealbreakers per person, plus which dealbreakers ruled out the most flats.

The app never picks the flat. The matching is fixed rules (`src/lib/match.ts`). Claude only writes the plain-language summaries (`src/lib/explain.ts`), and the app works without it.

## Run locally

```bash
npm install
npm run dev
```

Without Redis it uses in-memory storage, which is fine for local testing.

## Deploy on Vercel

1. Push this folder to a GitHub repo and import it in Vercel.
2. In the Vercel project, go to **Storage → Upstash for Redis → Create** and connect it. This sets `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.
3. Optional: add `ANTHROPIC_API_KEY` to get Claude-written summaries.
4. Redeploy.

Listings in `src/lib/listings.ts` are sample data. Commute times are rough estimates based on distance between Pune areas (`src/lib/areas.ts`).
