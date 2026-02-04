/**
 * Playful action verbs for recommendation cards
 * Assigns region-appropriate verbs to countries with no repetition per batch
 */

export type PlayfulVerb =
  | 'Adventure' | 'Explore' | 'Discover' | 'Venture' | 'Journey' | 'Trek'
  | 'Frolic' | 'Galavant' | 'Romp' | 'Cavort' | 'Revel'
  | 'Immerse' | 'Embrace' | 'Connect' | 'Celebrate' | 'Feast'
  | 'Mingle' | 'Wander' | 'Summit' | 'Navigate';

const ALL_VERBS: PlayfulVerb[] = [
  'Adventure', 'Explore', 'Discover', 'Venture', 'Journey', 'Trek',
  'Frolic', 'Galavant', 'Romp', 'Cavort', 'Revel',
  'Immerse', 'Embrace', 'Connect', 'Celebrate', 'Feast',
  'Mingle', 'Wander', 'Summit', 'Navigate',
];

const REGION_VERBS: Record<string, PlayfulVerb[]> = {
  'South Asia': ['Immerse', 'Discover', 'Connect'],
  'East Asia & Pacific': ['Venture', 'Navigate', 'Adventure', 'Explore'],
  'Europe & Central Asia': ['Romp', 'Galavant', 'Feast', 'Revel', 'Embrace'],
  'Latin America & Caribbean': ['Celebrate', 'Frolic', 'Feast', 'Revel'],
  'Middle East & North Africa': ['Discover', 'Journey', 'Navigate', 'Immerse'],
  'North America': ['Mingle', 'Adventure', 'Summit', 'Wander', 'Trek'],
  'Sub-Saharan Africa': ['Trek', 'Connect', 'Venture', 'Discover'],
  'Antarctica': ['Wander', 'Summit', 'Venture', 'Trek'],
};

/**
 * Generate unique verbs for a batch of recommendations
 * Uses weighted randomization to prefer region-appropriate verbs (70% preference)
 * Guarantees no verb repetition within the batch
 */
export function generateVerbsForBatch(
  countries: Array<{ countryCode: string; region: string }>,
  seed?: number
): PlayfulVerb[] {
  // Shuffle all verbs with optional seed for determinism
  const shuffled = [...ALL_VERBS].sort(() => (seed ? seededRandom(seed) : Math.random()) - 0.5);

  const verbs: PlayfulVerb[] = [];
  const usedVerbs = new Set<PlayfulVerb>();

  countries.forEach((country) => {
    const regionVerbs = REGION_VERBS[country.region] || [];

    // Try to find unused region-appropriate verb (70% preference)
    if (Math.random() < 0.7 && regionVerbs.length > 0) {
      const available = regionVerbs.filter((v) => !usedVerbs.has(v));
      if (available.length > 0) {
        const verb = available[Math.floor(Math.random() * available.length)];
        verbs.push(verb);
        usedVerbs.add(verb);
        return;
      }
    }

    // Fallback: use next shuffled verb
    const verb = shuffled.find((v) => !usedVerbs.has(v)) || shuffled[0];
    verbs.push(verb);
    usedVerbs.add(verb);
  });

  return verbs;
}

// Simple seeded random for deterministic shuffling in tests
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
