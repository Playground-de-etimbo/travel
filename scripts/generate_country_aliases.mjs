import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COUNTRIES_PATH = path.join(ROOT, 'public/data/countries.json');
const OUTPUT_PATH = path.join(ROOT, 'public/data/country-aliases.json');
const CACHE_DIR = path.join(ROOT, 'scripts/.cache');
const CACHE_PATH = path.join(CACHE_DIR, 'restcountries-aliases.json');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'ai-tty-travel/1.0 (local generation script)',
      accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} for ${url}${text ? `: ${text.slice(0, 120)}` : ''}`);
  }
  return res.json();
}

// Curated colloquial aliases the API typically misses.
const CURATED_ALIASES = {
  US: ['America', 'USA', 'The States'],
  GB: ['UK', 'England', 'Britain', 'Great Britain'],
  NL: ['Holland'],
  CZ: ['Czechia'],
  CI: ['Ivory Coast'],
  CD: ['Congo', 'DRC'],
  CG: ['Congo Republic'],
  KR: ['South Korea', 'Korea'],
  KP: ['North Korea'],
  AE: ['UAE', 'Emirates', 'Dubai'],
  SA: ['Saudi'],
  RU: ['Russia'],
  TW: ['Taiwan'],
  MM: ['Burma'],
  IR: ['Persia'],
  SY: ['Syria'],
  BO: ['Bolivia'],
  VE: ['Venezuela'],
  TZ: ['Tanzania'],
  LA: ['Laos'],
  VN: ['Vietnam', 'Viet Nam'],
  CV: ['Cape Verde'],
  SZ: ['Swaziland'],
  MK: ['Macedonia'],
  VA: ['Vatican', 'Holy See'],
  PS: ['Palestine'],
  BN: ['Brunei'],
  FK: ['Falklands'],
  FM: ['Micronesia'],
  CF: ['Central African Republic', 'CAR'],
  BA: ['Bosnia'],
  TT: ['Trinidad', 'Tobago'],
  KN: ['St Kitts', 'Saint Kitts'],
  VC: ['St Vincent', 'Saint Vincent'],
  LC: ['St Lucia', 'Saint Lucia'],
  AG: ['Antigua'],
  PG: ['Papua New Guinea', 'PNG'],
  HK: ['Hong Kong'],
  MO: ['Macau', 'Macao'],
  DO: ['Dominican Republic', 'DR'],
  GQ: ['Equatorial Guinea'],
  SB: ['Solomon Islands'],
  MH: ['Marshall Islands'],
  TL: ['East Timor', 'Timor Leste'],
  GW: ['Guinea-Bissau', 'Guinea Bissau'],
  ST: ['Sao Tome'],
  NZ: ['New Zealand', 'Aotearoa'],
  ZA: ['South Africa', 'RSA'],
  SS: ['South Sudan'],
  SL: ['Sierra Leone'],
  BF: ['Burkina'],
  LK: ['Sri Lanka', 'Ceylon'],
  CR: ['Costa Rica'],
  SV: ['El Salvador'],
};

// Returns true if the string contains non-Latin script characters.
function hasNonLatinChars(str) {
  // Allow Latin, digits, spaces, punctuation, diacritics.
  return /[^\u0000-\u024F\u1E00-\u1EFF\s\d.,;:!?'"\-()/&]/.test(str);
}

async function main() {
  ensureDir(CACHE_DIR);

  const countries = readJson(COUNTRIES_PATH);
  const countryNames = new Map(countries.map(c => [c.countryCode, c.countryName]));

  // Fetch or load cached REST Countries data.
  let apiData;
  if (fs.existsSync(CACHE_PATH)) {
    console.log('Using cached REST Countries data.');
    apiData = readJson(CACHE_PATH);
  } else {
    console.log('Fetching from REST Countries API...');
    apiData = await fetchJson('https://restcountries.com/v3.1/all?fields=cca2,name,altSpellings');
    writeJson(CACHE_PATH, apiData);
    console.log(`Cached ${apiData.length} entries.`);
  }

  // Build a lookup from the API data.
  const apiLookup = new Map();
  for (const entry of apiData) {
    apiLookup.set(entry.cca2, entry);
  }

  const aliases = {};

  for (const country of countries) {
    const code = country.countryCode;
    const localName = country.countryName;
    const entry = apiLookup.get(code);

    const aliasSet = new Set();

    if (entry) {
      // Add altSpellings.
      for (const alt of entry.altSpellings ?? []) {
        aliasSet.add(alt);
      }
      // Add official name if different from local name.
      if (entry.name?.official) {
        aliasSet.add(entry.name.official);
      }
      // Add common name if different.
      if (entry.name?.common) {
        aliasSet.add(entry.name.common);
      }
    }

    // Merge curated aliases.
    const curated = CURATED_ALIASES[code];
    if (curated) {
      for (const alias of curated) {
        aliasSet.add(alias);
      }
    }

    // Filter out: the country's own name, bare ISO codes (2-3 chars all uppercase),
    // and non-Latin script entries.
    const filtered = [...aliasSet].filter(alias => {
      // Remove exact match with local name (case-insensitive).
      if (alias.toLowerCase() === localName.toLowerCase()) return false;
      // Remove bare ISO codes (2 or 3 uppercase letters only).
      if (/^[A-Z]{2,3}$/.test(alias)) return false;
      // Remove non-Latin script entries.
      if (hasNonLatinChars(alias)) return false;
      // Remove very short entries (1 char).
      if (alias.length <= 1) return false;
      return true;
    });

    if (filtered.length > 0) {
      aliases[code] = filtered.sort();
    }
  }

  writeJson(OUTPUT_PATH, aliases);
  const totalAliases = Object.values(aliases).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`Written ${Object.keys(aliases).length} countries with ${totalAliases} total aliases to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
