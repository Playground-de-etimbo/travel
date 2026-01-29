import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const countriesPath = path.join(root, 'public', 'data', 'countries.json');
const geoPath = path.join(root, 'public', 'data', 'countries-110m.geo.json');

const [countriesRaw, geoRaw] = await Promise.all([
  fs.readFile(countriesPath, 'utf-8'),
  fs.readFile(geoPath, 'utf-8'),
]);

const countries = JSON.parse(countriesRaw);
const geo = JSON.parse(geoRaw);

const regionMap = new Map();

const manualRegionOverrides = {
  AS: 'East Asia & Pacific',
  AD: 'Europe & Central Asia',
  AI: 'Latin America & Caribbean',
  AG: 'Latin America & Caribbean',
  AW: 'Latin America & Caribbean',
  BH: 'Middle East & North Africa',
  BB: 'Latin America & Caribbean',
  BM: 'North America',
  BQ: 'Latin America & Caribbean',
  BV: 'Europe & Central Asia',
  IO: 'South Asia',
  VG: 'Latin America & Caribbean',
  KY: 'Latin America & Caribbean',
  CX: 'East Asia & Pacific',
  CC: 'East Asia & Pacific',
  KM: 'Sub-Saharan Africa',
  CK: 'East Asia & Pacific',
  CW: 'Latin America & Caribbean',
  DM: 'Latin America & Caribbean',
  FO: 'Europe & Central Asia',
  FM: 'East Asia & Pacific',
  GF: 'Latin America & Caribbean',
  PF: 'East Asia & Pacific',
  GI: 'Europe & Central Asia',
  GD: 'Latin America & Caribbean',
  GP: 'Latin America & Caribbean',
  GU: 'East Asia & Pacific',
  GG: 'Europe & Central Asia',
  HM: 'East Asia & Pacific',
  HK: 'East Asia & Pacific',
  IM: 'Europe & Central Asia',
  JE: 'Europe & Central Asia',
  KI: 'East Asia & Pacific',
  LI: 'Europe & Central Asia',
  MO: 'East Asia & Pacific',
  MV: 'South Asia',
  MT: 'Europe & Central Asia',
  MH: 'East Asia & Pacific',
  MQ: 'Latin America & Caribbean',
  MU: 'Sub-Saharan Africa',
  YT: 'Sub-Saharan Africa',
  MC: 'Europe & Central Asia',
  MS: 'Latin America & Caribbean',
  NR: 'East Asia & Pacific',
  NU: 'East Asia & Pacific',
  NF: 'East Asia & Pacific',
  MP: 'East Asia & Pacific',
  PW: 'East Asia & Pacific',
  PN: 'East Asia & Pacific',
  CV: 'Sub-Saharan Africa',
  RE: 'Sub-Saharan Africa',
  SH: 'Sub-Saharan Africa',
  KN: 'Latin America & Caribbean',
  LC: 'Latin America & Caribbean',
  PM: 'North America',
  VC: 'Latin America & Caribbean',
  BL: 'Latin America & Caribbean',
  MF: 'Latin America & Caribbean',
  WS: 'East Asia & Pacific',
  SM: 'Europe & Central Asia',
  SC: 'Sub-Saharan Africa',
  SG: 'East Asia & Pacific',
  SX: 'Latin America & Caribbean',
  GS: 'Latin America & Caribbean',
  SJ: 'Europe & Central Asia',
  ST: 'Sub-Saharan Africa',
  TW: 'East Asia & Pacific',
  TK: 'East Asia & Pacific',
  TO: 'East Asia & Pacific',
  TC: 'Latin America & Caribbean',
  TV: 'East Asia & Pacific',
  UM: 'East Asia & Pacific',
  VI: 'Latin America & Caribbean',
  VA: 'Europe & Central Asia',
  WF: 'East Asia & Pacific',
  AX: 'Europe & Central Asia',
};

const manualContinentOverrides = {
  AS: 'Oceania',
  AD: 'Europe',
  AI: 'North America',
  AG: 'North America',
  AW: 'North America',
  BH: 'Asia',
  BB: 'North America',
  BM: 'North America',
  BQ: 'North America',
  BV: 'Antarctica',
  IO: 'Asia',
  VG: 'North America',
  KY: 'North America',
  CX: 'Oceania',
  CC: 'Oceania',
  KM: 'Africa',
  CK: 'Oceania',
  CW: 'North America',
  DM: 'North America',
  FO: 'Europe',
  FM: 'Oceania',
  GF: 'South America',
  PF: 'Oceania',
  GI: 'Europe',
  GD: 'North America',
  GP: 'North America',
  GU: 'Oceania',
  GG: 'Europe',
  HM: 'Antarctica',
  HK: 'Asia',
  IM: 'Europe',
  JE: 'Europe',
  KI: 'Oceania',
  LI: 'Europe',
  MO: 'Asia',
  MV: 'Asia',
  MT: 'Europe',
  MH: 'Oceania',
  MQ: 'North America',
  MU: 'Africa',
  YT: 'Africa',
  MC: 'Europe',
  MS: 'North America',
  NR: 'Oceania',
  NU: 'Oceania',
  NF: 'Oceania',
  MP: 'Oceania',
  PW: 'Oceania',
  PN: 'Oceania',
  CV: 'Africa',
  RE: 'Africa',
  SH: 'Africa',
  KN: 'North America',
  LC: 'North America',
  PM: 'North America',
  VC: 'North America',
  BL: 'North America',
  MF: 'North America',
  WS: 'Oceania',
  SM: 'Europe',
  SC: 'Africa',
  SG: 'Asia',
  SX: 'North America',
  GS: 'Antarctica',
  SJ: 'Europe',
  ST: 'Africa',
  TW: 'Asia',
  TK: 'Oceania',
  TO: 'Oceania',
  TC: 'North America',
  TV: 'Oceania',
  UM: 'Oceania',
  VI: 'North America',
  VA: 'Europe',
  WF: 'Oceania',
  AX: 'Europe',
};

for (const feature of geo.features ?? []) {
  const props = feature?.properties ?? {};
  const iso2Candidates = [
    props.ISO_A2,
    props.ISO_A2_EH,
    props.WB_A2,
  ];
  const iso2 = iso2Candidates.find(value => value && value !== '-99');
  if (!iso2) continue;

  regionMap.set(iso2, {
    region: props.REGION_WB ?? null,
    continent: props.CONTINENT ?? null,
  });
}

const missing = [];
const updated = countries.map(country => {
  const mapping = regionMap.get(country.countryCode);
  if (!mapping?.region && !manualRegionOverrides[country.countryCode]) {
    missing.push(country.countryCode);
  }

  const region = mapping?.region ?? manualRegionOverrides[country.countryCode] ?? country.region;
  const continent = mapping?.continent ?? manualContinentOverrides[country.countryCode] ?? country.continent ?? country.region;

  return {
    countryCode: country.countryCode,
    countryName: country.countryName,
    continent,
    region,
    currencyCode: country.currencyCode,
    currencyName: country.currencyName,
    flagEmoji: country.flagEmoji,
    baselineCost: country.baselineCost,
    nightlyCost: country.nightlyCost,
  };
});

await fs.writeFile(countriesPath, `${JSON.stringify(updated, null, 2)}\n`);

if (missing.length > 0) {
  console.warn('Missing REGION_WB for ISO2 codes:', missing.join(', '));
}
