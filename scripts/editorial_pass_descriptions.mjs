import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COUNTRIES_PATH = path.join(ROOT, 'public/data/countries.json');
const WIKI_CACHE_PATH = path.join(ROOT, 'scripts/.cache/wiki-summaries.json');
const REPORT_PATH = path.join(ROOT, 'docs/DESCRIPTION_EDITORIAL_CHANGES.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function normalizeWhitespace(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function factsFromExtract(extract) {
  const t = (extract || '').toLowerCase();
  const has = (re) => re.test(t);
  const landlocked = has(/\blandlocked\b/);
  return {
    landlocked,
    island: has(/\bisland\b|\barchipelago\b/),
    coastal: !landlocked && has(/\bsea\b|\bocean\b|\bcoast\b|\bcoastline\b/),
    mountains: has(/\bmountain\b|\bmountainous\b|\balps\b|\bandes\b|\bhimalaya\b|\bhighlands\b|\bpyrenees\b/),
    desert: has(/\bdesert\b|\bsahara\b|\barid\b/),
    rainforest: has(/\brainforest\b|\bjungle\b|\bamazon\b|\btropical forest\b/),
    polar: has(/\barctic\b|\bantarctic\b|\bsouth pole\b|\bnorth pole\b/),
    volcano: has(/\bvolcano\b|\bvolcanic\b/),
    uninhabited: has(/\buninhabited\b|\bunpopulated\b|\bno permanent\b/),
    // Strong-ish signal that the page emphasizes urban life.
    city: has(/\bcapital\b|\bmetropolitan\b|\burban\b/) || (has(/\bcity\b/) && !has(/\bstate\b/)),
  };
}

function splitTwoSentences(desc) {
  const s = normalizeWhitespace(desc);
  // Simple split on period + space.
  const parts = s.split(/\. +/).filter(Boolean);
  if (parts.length <= 1) return { s1: s, s2: '' };
  const s1 = parts[0].endsWith('.') ? parts[0] : parts[0] + '.';
  const s2 = parts.slice(1).join('. ');
  const s2Final = s2.endsWith('.') ? s2 : s2 + '.';
  return { s1, s2: s2Final };
}

function hasAny(desc, needles) {
  const d = desc.toLowerCase();
  return needles.some((n) => d.includes(n));
}

function makePayoffTheme(f) {
  if (f.uninhabited) return 'pure remoteness and wild scenery';
  if (f.polar) return 'stark scenery and true remoteness';
  if (f.city) return 'city energy, food culture, and easy wandering';
  if (f.coastal && f.mountains) return 'coast-and-mountains contrast and easy exploring';
  if (f.island || f.coastal) return 'sea air, bright days, and laid-back exploring';
  if (f.desert) return 'big horizons and adventure energy';
  if (f.rainforest) return 'wild nature and warm-weather adventure';
  if (f.mountains) return 'fresh-air scenery and slow wandering';
  if (f.landlocked) return 'culture-forward travel and a slower pace';
  return 'local flavor and a satisfying change of pace';
}

function rewritePayoff(theme, seed) {
  const templates = [
    (t) => `Think ${t}, plus small moments that turn into stories.`,
    (t) => `Best when you want ${t} without the usual rush.`,
    (t) => `Ideal for ${t}, and the pace is half the point.`,
    (t) => `Plan on ${t}, then let the day unfold.`,
    (t) => `Made for ${t} and a clean break from routine.`,
    (t) => `Expect ${t} in a refreshingly unforced way.`,
    (t) => `If you like ${t}, it delivers with real personality.`,
    (t) => `You will leave with ${t} and a renewed sense of curiosity.`,
    (t) => `A great pick for ${t} when you want something different.`,
  ];
  return pick(templates, seed)(theme);
}

function editorialFixes(desc) {
  let out = normalizeWhitespace(desc);

  // Grammar/flow fixes
  out = out.replace(/\bMade for ([^.;]+) and a clean break from routine\./i, 'Made for $1, plus a clean break from routine.');
  out = out.replace(/\bMade for ([^.;]+) and a clean break from routine\b/i, 'Made for $1, plus a clean break from routine');
  out = out.replace(/\bBest when you want ([^.;]+) and a clean break from routine\./i, 'Best when you want $1, plus a clean break from routine.');

  // Avoid awkward double "and".
  out = out.replace(/\band and\b/gi, 'and');
  out = out.replace(/\bwith room to slow down\b/gi, 'with room to slow down');

  // Remove curly apostrophes (keep file ASCII-ish).
  out = out.replace(/[’]/g, "'");

  return out;
}

function main() {
  const countries = readJson(COUNTRIES_PATH);
  const cache = fs.existsSync(WIKI_CACHE_PATH) ? readJson(WIKI_CACHE_PATH) : {};

  // Find common hook lines to reduce repetition slightly.
  const hookCounts = new Map();
  for (const c of countries) {
    const { s1 } = splitTwoSentences(c.description);
    hookCounts.set(s1, (hookCounts.get(s1) || 0) + 1);
  }
  const commonHooks = [...hookCounts.entries()]
    .filter(([, n]) => n >= 12)
    .sort((a, b) => b[1] - a[1])
    .map(([hook]) => hook);

  const hookAlternates = [
    'It has a distinctive character that shows up fast.',
    'It feels like a genuine change of scene from the start.',
    'The vibe is immediate: local, specific, and memorable.',
    'It rewards travelers who like to wander and look closer.',
    'It is the kind of place that sticks with you.',
  ];

  const changes = [];
  const used = new Set();

  for (const c of countries) {
    const code = c.countryCode;
    const before = c.description;
    const seed = hashCode(code + c.countryName);
    const wiki = cache[code];
    const f = factsFromExtract(wiki?.extract || '');

    let after = editorialFixes(before);
    const { s1, s2 } = splitTwoSentences(after);
    let newS1 = s1;
    let newS2 = s2;
    const reasons = [];

    // Contradiction fixes (keep factual + safe)
    if (f.landlocked && hasAny(after, ['sea air', 'coastal', 'ocean', 'beach'])) {
      newS2 = rewritePayoff(makePayoffTheme(f), seed + 7);
      reasons.push('removed_coastal_for_landlocked');
    }

    if (f.city && hasAny(after, ['full reset', 'island rhythm', 'built for a reset'])) {
      newS2 = rewritePayoff(makePayoffTheme(f), seed + 11);
      reasons.push('shifted_theme_to_city');
    }

    if (f.uninhabited && hasAny(after, ['food', 'culture', 'wandering'])) {
      newS2 = rewritePayoff(makePayoffTheme(f), seed + 13);
      reasons.push('shifted_theme_to_uninhabited');
    }

    // Reduce hook repetition: swap only if hook is one of the most common AND we didn't already custom-write it.
    if (commonHooks.includes(s1) && !/^In [A-Z]/.test(s1)) {
      // Keep hook replacements subtle; do not introduce facts.
      newS1 = pick(hookAlternates, seed + 3);
      if (!newS1.endsWith('.')) newS1 += '.';
      reasons.push('varied_repetitive_hook');
    }

    after = normalizeWhitespace(`${newS1} ${newS2}`).trim();
    if (!after.endsWith('.')) after += '.';

    // Ensure uniqueness: if collision, tweak payoff variant.
    let bump = 0;
    while (used.has(after) && bump < 10) {
      const theme = makePayoffTheme(f);
      const altPayoff = rewritePayoff(theme, seed + 31 + bump);
      after = normalizeWhitespace(`${newS1} ${altPayoff}`).trim();
      if (!after.endsWith('.')) after += '.';
      reasons.push('de_duped');
      bump++;
    }

    used.add(after);

    if (after !== before) {
      changes.push({ code, countryName: c.countryName, before, after, reasons });
      c.description = after;
    }
  }

  // Final sanity: all descriptions unique
  const uniq = new Set(countries.map((c) => c.description));
  if (uniq.size !== countries.length) {
    console.warn(`Warning: ${countries.length - uniq.size} duplicate descriptions remain.`);
  }

  writeJson(COUNTRIES_PATH, countries);

  // Write report (avoid dumping all 250 if only small changes; but include all changed entries).
  const lines = [];
  lines.push('# Country Description Editorial Changes');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`Changed entries: ${changes.length}`);
  lines.push('');
  for (const ch of changes) {
    lines.push(`## ${ch.code} - ${ch.countryName}`);
    lines.push(`Reasons: ${ch.reasons.join(', ') || 'n/a'}`);
    lines.push('');
    lines.push('Before:');
    lines.push('');
    lines.push(`> ${ch.before}`);
    lines.push('');
    lines.push('After:');
    lines.push('');
    lines.push(`> ${ch.after}`);
    lines.push('');
  }
  fs.writeFileSync(REPORT_PATH, lines.join('\n'));

  console.log(`Editorial pass complete. Updated ${changes.length} countries. Report: ${path.relative(ROOT, REPORT_PATH)}`);
}

main();

