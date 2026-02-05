# Travel Costs Generation

Generated: 2026-02-04

## Overview
This project stores country metadata in `public/data/countries.json` and AI-generated cost tiers in `public/data/country-travel-costs.json`.
The cost tiers are synthetic estimates (not sourced pricing) and should be treated as placeholders.

## Output Format
`public/data/country-travel-costs.json` structure:
- `meta.generatedAt` (YYYY-MM-DD)
- `meta.model` (string identifier)
- `meta.notes` (short disclaimer)
- `costs` object keyed by `countryCode`
- each country has `budget`, `modest`, `bougie` tiers with:
  - `hotelPerNight`
  - `dailyPerPerson`

All values are in destination currency. Currency codes live in `public/data/countries.json`.

## Generation Method (AI-Guided Heuristic)
We generate synthetic costs using a deterministic heuristic that mimics a “good prompt” outcome:

1) **Regional baselines (USD)**
   - Use World Bank region to pick a baseline set of USD hotel/daily values for budget/modest/bougie.

2) **Income/tier multipliers**
   - Apply a per-country tier multiplier using curated sets:
     - very_high, high, upper_mid, lower_mid, low, very_low

3) **Modifiers**
   - Apply additional multipliers for:
     - island, microstate, oil economies, conflict, tourism premium

4) **Deterministic variance**
   - Add a stable, country-code–based variance to avoid uniform pricing.

5) **FX conversion**
   - Convert USD estimates to destination currency using a rough FX lookup table.

6) **Anchors**
   - Override a small set of countries with known anchor values for stability.

7) **Audit vs previous heuristic**
   - Compare average tier cost vs the previous model and flag large deltas.
   - Output flagged countries to `docs/TRAVEL_COSTS_AI_AUDIT.md`.

## Regeneration Steps
1) Update baselines, tier sets, modifiers, or FX table in the generator script.
2) Run the generation script (see `docs/TRAVEL_COSTS_AI_AUDIT.md` for the latest model name).
3) Verify `public/data/country-travel-costs.json` and the audit file.

## Notes
- Synthetic costs are not suitable for real budgeting.
- For accurate data, replace with a licensed source (Numbeo, etc.).
