# Travel Cost AI Audit

Generated: 2026-02-04

## Method
- AI-guided heuristic using regional baselines + income tier + modifiers (island/microstate/oil/tourism/conflict) + FX + deterministic variance.
- Anchored to 10 known country examples for stability.
- Compared against previous heuristic model (heuristic-anchored-v2).

## Suspicious Deltas (AI vs Heuristic)
Threshold: ratio >= 1.5 or <= 0.67

- KW (Kuwait): 2.05x
- OM (Oman): 1.73x
- PE (Peru): 1.64x
- GD (Grenada): 1.62x
- LC (Saint Lucia): 1.56x
- GE (Georgia): 1.55x
- PT (Portugal): 1.53x
- BN (Brunei Darussalam): 1.52x
- KZ (Kazakhstan): 1.51x
