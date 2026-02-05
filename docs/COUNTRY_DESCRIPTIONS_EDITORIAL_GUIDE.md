# Country Descriptions: Editorial Guide

This project stores short, travel-editor style descriptions for each country/territory in:

- `public/data/countries.json` (`description`)

## Editorial brief

Every description must be:

- Exactly 2 sentences.
- Punchy and compelling (written like a travel editor, not an encyclopedia).
- Factual at a country level (avoid unverifiable specifics like named roads, niche festivals, or claims that could easily be wrong).
- Not starting with the country name (the UI already renders the name as a heading).
- Distinct in voice (avoid repeating the same openers across many countries).

### Structure (recommended)

- Sentence 1: the hook (what makes the place feel distinctive at a glance: geography, scale, cultural position).
- Sentence 2: the payoff (who it is best for / what kind of holiday it suits, in a human tone).

## What to avoid

- Cookie-cutter phrasing repeated across many entries (e.g., "Come for...", "city energy, food culture...").
- Over-precise claims unless you are confident they are broadly and consistently true.
- Making up attractions, wildlife, infrastructure, or activities.
- Safety claims or advisories (keep copy neutral; leave safety messaging to product UX if needed).

## Current editorial set

As of 2026-02-05, descriptions were rewritten in a single editorial pass and stored in:

- `scripts/editorial/country-descriptions-2026-02-05.json`

`public/data/countries.json` was updated from that mapping so future edits can be reviewed as a focused diff.

