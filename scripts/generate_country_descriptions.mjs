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

function buildDescription({ extract, seed }) {
  const flags = extractFlags(extract);

  const openers = {
    island: [
      'Island life and open horizons set the tone.',
      'Sun, sea air, and island pace make it instantly relaxing.',
      'Coast-first days and a slower rhythm define the getaway.',
    ],
    desert: [
      'Desert light and wide-open landscapes make it feel cinematic.',
      'Big skies and stark landscapes give it a powerful sense of space.',
      'Arid scenery and dramatic horizons define the journey.',
    ],
    mountains: [
      'Mountain scenery and a strong sense of place shape the trip.',
      'High-country landscapes and fresh air set the pace.',
      'Rugged terrain and sweeping views make it feel wild and rewarding.',
    ],
    rainforest: [
      'Lush landscapes and wild nature make it feel alive.',
      'Tropical green and big nature shape the adventure.',
      'Wild ecosystems and vivid scenery define the escape.',
    ],
    polar: [
      'Extreme landscapes and profound quiet make it unforgettable.',
      'Raw, remote scenery creates a once-in-a-lifetime feeling.',
      'Vast wilderness and stark beauty set the mood.',
    ],
    default: [
      'A strong sense of place makes it an easy yes.',
      'Culture, everyday life, and atmosphere give it real pull.',
      'Distinct character and local rhythm make it worth the journey.',
    ],
  };

  let openerKey = 'default';
  if (flags.polar) openerKey = 'polar';
  else if (flags.island) openerKey = 'island';
  else if (flags.desert) openerKey = 'desert';
  else if (flags.rainforest) openerKey = 'rainforest';
  else if (flags.mountains) openerKey = 'mountains';

  const second = [
    'Go for local food, easy days, and the feeling of discovering somewhere new.',
    'Travelers love the mix of culture and scenery, plus the everyday moments that become stories.',
    'Come for the atmosphere and landscapes, then stay for the food and local warmth.',
    'It is perfect for slowing down, exploring, and soaking up the local vibe.',
  ];

  // Add a light nudge toward nature if the extract suggests it, without inventing specifics.
  const natureNudge = [];
  if (flags.reef) natureNudge.push('clear water');
  if (flags.sea) natureNudge.push('coastal views');
  if (flags.lakes) natureNudge.push('lake country');
  if (flags.rivers) natureNudge.push('riverside scenes');
  if (flags.volcano) natureNudge.push('volcanic landscapes');

  const nudge = natureNudge.length
    ? `Go for ${pick(
        [
          `${natureNudge.slice(0, 2).join(' and ')},`,
          `${natureNudge[0]},`,
          `nature that feels close at hand,`,
        ],
        seed + 13
      )} great food, and a memorable sense of place.`
    : pick(second, seed + 7);

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

    const description = buildDescription({ extract: wiki.extract, seed });
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

