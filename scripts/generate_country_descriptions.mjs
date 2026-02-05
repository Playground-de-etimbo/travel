import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COUNTRIES_PATH = path.join(ROOT, 'public/data/countries.json');
const CACHE_DIR = path.join(ROOT, 'scripts/.cache');
const WIKI_CACHE_PATH = path.join(CACHE_DIR, 'wiki-summaries.json');
const SOURCES_MD_PATH = path.join(ROOT, 'docs/COUNTRY_DESCRIPTION_SOURCES.md');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeSlug(value) {
  // Wikipedia REST summary expects the title URL-encoded.
  return encodeURIComponent(value.replace(/\s+/g, ' ').trim());
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      // Be polite: identify the app and keep requests cacheable.
      'user-agent': 'ai-tty-travel/1.0 (local generation script)',
      accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status} for ${url}${text ? `: ${text.slice(0, 120)}` : ''}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function wikiSummaryByTitle(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${safeSlug(title)}`;
  return fetchJson(url);
}

async function wikiSearchTitle(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(
    query
  )}`;
  const data = await fetchJson(url);
  const first = data?.query?.search?.[0];
  return first?.title ?? null;
}

const TITLE_ALIASES = {
  // A few common mismatches between local dataset names and Wikipedia titles.
  CI: 'Ivory Coast',
  KP: 'North Korea',
  KR: 'South Korea',
  CD: 'Democratic Republic of the Congo',
  CG: 'Republic of the Congo',
  CZ: 'Czech Republic',
  CV: 'Cape Verde',
  LA: 'Laos',
  MM: 'Myanmar',
  PS: 'State of Palestine',
  RU: 'Russia',
  SY: 'Syria',
  TW: 'Taiwan',
  TZ: 'Tanzania',
  VN: 'Vietnam',
  US: 'United States',
  GB: 'United Kingdom',
  IR: 'Iran',
  BO: 'Bolivia',
  VE: 'Venezuela',
  FM: 'Federated States of Micronesia',
  // Territories that sometimes differ.
  FO: 'Faroe Islands',
  FK: 'Falkland Islands',
};

const SPECIAL_DESCRIPTIONS = {
  // Keep Antarctica grounded and non-trivial.
  AQ: 'Icebound wilderness around the South Pole makes it feel truly otherworldly. Go for stark beauty and iconic polar wildlife in one of the planet’s most remote places.',
};

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function pick(list, seed) {
  return list[seed % list.length];
}

function extractFlags(extract) {
  const text = (extract ?? '').toLowerCase();
  const has = (re) => re.test(text);

  return {
    island: has(/\bisland\b/) || has(/\barchipelago\b/),
    desert: has(/\bdesert\b/) || has(/\bsahara\b/) || has(/\barid\b/),
    mountains: has(/\bmountain\b/) || has(/\bmountainous\b/) || has(/\balps\b/) || has(/\bandes\b/) || has(/\bhimalaya\b/),
    rainforest: has(/\brainforest\b/) || has(/\bamazon\b/) || has(/\btropical forest\b/) || has(/\bjungle\b/),
    reef: has(/\bcoral\b/) || has(/\breef\b/),
    polar: has(/\barctic\b/) || has(/\bantarctic\b/) || has(/\bpolar\b/),
    sea: has(/\bsea\b/) || has(/\bmediterranean\b/) || has(/\bcaribbean\b/) || has(/\badriatic\b/) || has(/\baegean\b/),
    lakes: has(/\blake\b/) || has(/\blakes\b/),
    rivers: has(/\briver\b/) || has(/\brivers\b/),
    volcano: has(/\bvolcano\b/) || has(/\bvolcanic\b/),
  };
}

function findKeywordHighlights(extract) {
  const text = (extract ?? '').toLowerCase();
  const has = (re) => re.test(text);

  const keywords = [];
  const push = (label, re) => {
    if (keywords.length >= 3) return;
    if (has(re)) keywords.push(label);
  };

  push('glaciers', /\bglacier(s)?\b/);
  push('waterfalls', /\bwaterfall(s)?\b/);
  push('volcanic landscapes', /\bvolcano(es)?\b|\bvolcanic\b/);
  push('rainforests', /\brainforest(s)?\b|\bjungle\b/);
  push('coral reefs', /\bcoral\b|\breef(s)?\b/);
  push('wildlife', /\bwildlife\b|\banimal(s)?\b|\bfauna\b/);
  push('penguins', /\bpenguin(s)?\b/);
  push('ruins and archaeology', /\barchaeolog(y|ical)\b|\bruins\b/);
  push('temples and heritage sites', /\btemple(s)?\b|\bheritage\b|\bworld heritage\b|\bunesco\b/);
  push('music and arts', /\bmusic\b|\barts?\b/);
  push('beaches', /\bbeach(es)?\b/);

  return keywords;
}

function findNamedHighlights(extract) {
  // Only use phrases we can literally find in the Wikipedia extract, to avoid inventing specifics.
  const source = extract ?? '';

  const candidates = [
    // Seas / oceans / regions (most helpful for travel copy).
    'Ionian Sea',
    'Adriatic Sea',
    'Aegean Sea',
    'Red Sea',
    'Black Sea',
    'Baltic Sea',
    'North Sea',
    'Arabian Sea',
    'South China Sea',
    'Caribbean Sea',
    'Mediterranean Sea',
    'Pacific Ocean',
    'Atlantic Ocean',
    'Indian Ocean',
    'Arctic Ocean',

    // Big landscapes / regions that are commonly referenced in intros.
    'Sahara',
    'Balkans',
    'Alps',
    'Andes',
    'Himalayas',
    'Amazon',
    'Sahel',
    'South Pole',
    'Arctic',
    'Antarctica',
  ];

  const found = [];
  for (const phrase of candidates) {
    // Use word boundaries to avoid substring mistakes (e.g., "Arctic" inside "Antarctic").
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'i');
    if (re.test(source)) found.push(phrase);
    if (found.length >= 2) break;
  }

  return found;
}

function buildDescription({ code, extract, seed }) {
  if (SPECIAL_DESCRIPTIONS[code]) return SPECIAL_DESCRIPTIONS[code];

  const flags = extractFlags(extract);
  let highlights = findNamedHighlights(extract);
  const keywordHighlights = findKeywordHighlights(extract);

  // Avoid contentious Antarctica references for non-Antarctica entries.
  if (code !== 'AQ') {
    highlights = highlights.filter((h) => h !== 'Antarctica' && h !== 'South Pole');
  }

  const openers = {
    named: [
      `${highlights[0]} and ${highlights[1]} give it a signature feel.`,
      `Set between ${highlights[0]} and ${highlights[1]}, it delivers big scenery and a strong sense of place.`,
      `${highlights[0]} edges and ${highlights[1]} influences make it feel distinctive.`,
    ],
    island: [
      'Island life and salt air set the tone.',
      'Sea views and island pace make it instantly relaxing.',
      'Coast-first days and a slower rhythm define the escape.',
    ],
    desert: [
      'Desert light and wide-open horizons make it feel cinematic.',
      'Big skies and stark landscapes give it a powerful sense of space.',
      'Arid scenery and dramatic distance define the journey.',
    ],
    mountains: [
      'Mountain backdrops and fresh air shape the trip.',
      'High-country scenery and a strong sense of place set the pace.',
      'Rugged terrain and sweeping views make it feel wild and rewarding.',
    ],
    rainforest: [
      'Lush landscapes and wild nature make it feel alive.',
      'Tropical green and big nature shape the adventure.',
      'Rainforest energy and vivid scenery define the escape.',
    ],
    polar: [
      'Extreme landscapes and profound quiet make it unforgettable.',
      'Raw, remote scenery creates a once-in-a-lifetime feeling.',
      'Vast wilderness and stark beauty set the mood.',
    ],
    default: [
      'A strong sense of place makes it hard to forget.',
      'Culture, everyday life, and atmosphere give it real pull.',
      'Distinct character and local rhythm make it worth the journey.',
    ],
  };

  let openerKey = 'default';
  if (highlights.length >= 2) openerKey = 'named';
  else if (flags.polar) openerKey = 'polar';
  else if (flags.island) openerKey = 'island';
  else if (flags.desert) openerKey = 'desert';
  else if (flags.rainforest) openerKey = 'rainforest';
  else if (flags.mountains) openerKey = 'mountains';

  const second = [
    'Go for local food, a change of pace, and days that feel like a genuine escape.',
    'Travelers love the culture, the scenery, and the small moments that turn into stories.',
    'Come for the atmosphere and landscapes, then stay for the food and local warmth.',
    'It is perfect for wandering, unwinding, and soaking up everyday life.',
    'Show up curious and leave with stories, flavors, and a real sense of place.',
    'Come for the scenery and culture, and let the slower moments be the highlight.',
  ];

  // Add a light nudge toward nature if the extract suggests it, without inventing specifics.
  const natureNudge = [];
  if (flags.reef) natureNudge.push('clear water');
  if (flags.sea) natureNudge.push('coastal views');
  if (flags.lakes) natureNudge.push('lake country');
  if (flags.rivers) natureNudge.push('riverside scenes');
  if (flags.volcano) natureNudge.push('volcanic landscapes');

  let nudge = '';
  if (keywordHighlights.length) {
    const list = keywordHighlights.slice(0, 2).join(' and ');
    nudge = `Go for ${list}, local food, and a trip that feels genuinely different.`;
  } else if (highlights.length >= 1) {
    const h = highlights[0];
    if (/Sea|Ocean/i.test(h)) nudge = 'Go for sea air, coastal days, and a culture you can taste in the food and daily life.';
    else if (/Sahara|desert/i.test(h)) nudge = 'Go for desert-scale landscapes, warm hospitality, and nights that feel far from everything.';
    else if (/Balkans/i.test(h)) nudge = 'Go for Balkan culture, memorable scenery, and an easy sense of discovery day to day.';
    else nudge = pick(second, seed + 19);
  } else if (natureNudge.length) {
    nudge = `Go for ${pick(
      [
        `${natureNudge.slice(0, 2).join(' and ')},`,
        `${natureNudge[0]},`,
        `nature that feels close at hand,`,
      ],
      seed + 13
    )} great food, and a memorable sense of place.`;
  } else {
    nudge = pick(second, seed + 7);
  }

  return `${pick(openers[openerKey], seed)} ${nudge}`;
}

function buildSourcesDoc(rows) {
  const lines = [];
  lines.push('# Country Description Sources');
  lines.push('');
  lines.push('This file records the primary Wikipedia page used to ground each country description in `public/data/countries.json`.');
  lines.push('Descriptions are still travel copy, but we avoid specific claims unless supported by the referenced page summary.');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Code | Country | Wikipedia Title | URL |');
  lines.push('|---|---|---|---|');
  for (const r of rows) {
    const titleEsc = (r.title ?? '').replace(/\|/g, '\\|');
    const nameEsc = (r.countryName ?? '').replace(/\|/g, '\\|');
    lines.push(`| ${r.code} | ${nameEsc} | ${titleEsc} | ${r.url} |`);
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  ensureDir(CACHE_DIR);

  const countries = readJson(COUNTRIES_PATH);
  const cache = fs.existsSync(WIKI_CACHE_PATH) ? readJson(WIKI_CACHE_PATH) : {};

  const sourcesRows = [];
  const failures = [];

  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const code = country.countryCode;
    const seed = hashCode(code);

    let wiki = cache[code];

    if (!wiki) {
      const preferredTitle = TITLE_ALIASES[code] ?? country.countryName;
      try {
        const summary = await wikiSummaryByTitle(preferredTitle);
        wiki = { title: summary.title, extract: summary.extract, page: summary.content_urls?.desktop?.page ?? null };
      } catch (err) {
        const status = err?.status ?? null;
        // If the title isn't found, fall back to Wikipedia search.
        if (status === 404) {
          try {
            const foundTitle = await wikiSearchTitle(country.countryName);
            if (!foundTitle) throw new Error('No search results');
            const summary = await wikiSummaryByTitle(foundTitle);
            wiki = { title: summary.title, extract: summary.extract, page: summary.content_urls?.desktop?.page ?? null };
          } catch (err2) {
            failures.push({ code, countryName: country.countryName, error: String(err2?.message ?? err2) });
          }
        } else {
          failures.push({ code, countryName: country.countryName, error: String(err?.message ?? err) });
        }
      }

      if (wiki) {
        cache[code] = wiki;
        // Keep within polite request rates.
        await sleep(150);
      } else {
        // Keep moving even if one country fails.
        continue;
      }
    }

    const description = buildDescription({ code, extract: wiki.extract, seed });
    countries[i] = { ...country, description };
    sourcesRows.push({
      code,
      countryName: country.countryName,
      title: wiki.title,
      url: wiki.page ?? '',
    });
  }

  writeJson(COUNTRIES_PATH, countries);
  writeJson(WIKI_CACHE_PATH, cache);
  fs.writeFileSync(SOURCES_MD_PATH, buildSourcesDoc(sourcesRows));

  if (failures.length) {
    const failurePath = path.join(ROOT, 'docs/COUNTRY_DESCRIPTION_FAILURES.json');
    writeJson(failurePath, failures);
    console.warn(`Completed with ${failures.length} failures. See ${failurePath}`);
  } else {
    console.log('Completed without failures.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
