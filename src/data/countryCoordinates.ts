/**
 * Geographic coordinates (latitude, longitude) for countries
 * Source: Capital city or geographic center
 */
export const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  // North America
  BM: { lat:   32.2800, lng:   -64.7800 },     // Bermuda
  CA: { lat: 45.4215, lng: -75.6972 },     // Canada
  GL: { lat:   64.1800, lng:   -51.7500 },     // Greenland
  MX: { lat: 19.4326, lng: -99.1332 },     // Mexico
  PM: { lat:   46.7700, lng:   -56.1800 },     // Saint Pierre and Miquelon
  US: { lat: 38.8951, lng: -77.0364 },     // United States

  // Central America
  BZ: { lat:   17.2500, lng:   -88.7700 },     // Belize
  CR: { lat: 9.9281, lng: -84.0907 },      // Costa Rica
  SV: { lat:   13.7000, lng:   -89.2000 },     // El Salvador
  GT: { lat:   14.6200, lng:   -90.5200 },     // Guatemala
  HN: { lat:   14.1000, lng:   -87.2200 },     // Honduras
  NI: { lat:   12.1300, lng:   -86.2500 },     // Nicaragua
  PA: { lat:    8.9700, lng:   -79.5300 },     // Panama

  // Caribbean
  AI: { lat:   18.2200, lng:   -63.0500 },     // Anguilla
  AG: { lat:   17.1200, lng:   -61.8500 },     // Antigua and Barbuda
  AW: { lat:   12.5200, lng:   -70.0300 },     // Aruba
  BS: { lat:   25.0800, lng:   -77.3500 },     // Bahamas
  BB: { lat:   13.1000, lng:   -59.6200 },     // Barbados
  BQ: { lat:   12.1400, lng:   -68.2700 },     // Caribbean Netherlands
  VG: { lat:   18.4200, lng:   -64.6200 },     // British Virgin Islands
  KY: { lat:   19.3000, lng:   -81.3800 },     // Cayman Islands
  CU: { lat:   23.1200, lng:   -82.3500 },     // Cuba
  CW: { lat:   12.1000, lng:   -68.9200 },     // Curaçao
  DM: { lat:   15.3000, lng:   -61.4000 },     // Dominica
  DO: { lat:   18.4700, lng:   -69.9000 },     // Dominican Republic
  GD: { lat:   32.3800, lng:   -64.6800 },     // Grenada
  GP: { lat:   16.0300, lng:   -61.7300 },     // Guadeloupe
  HT: { lat:   18.5300, lng:   -72.3300 },     // Haiti
  JM: { lat:   17.9970, lng:   -76.7936 },     // Jamaica
  MQ: { lat:   14.6000, lng:   -61.0800 },     // Martinique
  MS: { lat:   16.7000, lng:   -62.2200 },     // Montserrat
  PR: { lat:   18.4700, lng:   -66.1200 },     // Puerto Rico
  BL: { lat:   17.8800, lng:   -62.8500 },     // Saint Barthélemy
  KN: { lat:   17.3000, lng:   -62.7200 },     // Saint Kitts and Nevis
  LC: { lat:   14.0000, lng:   -61.0000 },     // Saint Lucia
  MF: { lat:   18.0700, lng:   -63.0800 },     // Saint Martin
  VC: { lat:   13.1300, lng:   -61.2200 },     // Saint Vincent and the Grenadines
  SX: { lat:   18.0200, lng:   -63.0300 },     // Sint Maarten
  TT: { lat:   10.6500, lng:   -61.5200 },     // Trinidad and Tobago
  TC: { lat:   21.4600, lng:   -71.1400 },     // Turks and Caicos Islands
  VI: { lat:   18.3500, lng:   -64.9300 },     // United States Virgin Islands

  // South America
  AR: { lat: -34.6037, lng: -58.3816 },    // Argentina
  BO: { lat:  -19.0200, lng:   -65.2600 },     // Bolivia
  BR: { lat: -15.7975, lng: -47.8919 },    // Brazil
  CL: { lat: -33.4489, lng: -70.6693 },    // Chile
  CO: { lat: 4.7110, lng: -74.0721 },      // Colombia
  EC: { lat:   -0.2200, lng:   -78.5000 },     // Ecuador
  FK: { lat:  -51.7000, lng:   -57.8500 },     // Falkland Islands
  GF: { lat:    4.9400, lng:   -52.3300 },     // French Guiana
  GY: { lat:    6.8000, lng:   -58.1500 },     // Guyana
  PY: { lat:  -25.2800, lng:   -57.5700 },     // Paraguay
  PE: { lat: -12.0464, lng: -77.0428 },    // Peru
  SR: { lat:    5.8300, lng:   -55.1700 },     // Suriname
  UY: { lat:  -34.8500, lng:   -56.1700 },     // Uruguay
  VE: { lat:   10.4800, lng:   -66.8700 },     // Venezuela

  // Europe
  AX: { lat:   60.1200, lng:    19.9000 },     // Åland Islands
  AL: { lat:   41.3200, lng:    19.8200 },     // Albania
  AD: { lat:   42.5000, lng:     1.5200 },     // Andorra
  AT: { lat: 48.2082, lng: 16.3738 },      // Austria
  BY: { lat:   53.9000, lng:    27.5700 },     // Belarus
  BE: { lat: 50.8503, lng: 4.3517 },       // Belgium
  BA: { lat:   43.8700, lng:    18.4200 },     // Bosnia and Herzegovina
  BG: { lat:   42.6800, lng:    23.3200 },     // Bulgaria
  HR: { lat:   45.8000, lng:    16.0000 },     // Croatia
  CY: { lat:   35.1700, lng:    33.3700 },     // Cyprus
  CZ: { lat: 50.0755, lng: 14.4378 },      // Czech Republic
  DK: { lat: 55.6761, lng: 12.5683 },      // Denmark
  EE: { lat:   59.4300, lng:    24.7200 },     // Estonia
  FO: { lat:   62.0100, lng:    -6.7700 },     // Faroe Islands
  FI: { lat: 60.1699, lng: 24.9384 },      // Finland
  FR: { lat: 48.8566, lng: 2.3522 },       // France
  DE: { lat: 52.5200, lng: 13.4050 },      // Germany
  GI: { lat:   36.1300, lng:    -5.3500 },     // Gibraltar
  GR: { lat: 37.9838, lng: 23.7275 },      // Greece
  GG: { lat:   49.4500, lng:    -2.5400 },     // Guernsey
  HU: { lat:   47.5000, lng:    19.0800 },     // Hungary
  IS: { lat: 64.1466, lng: -21.9426 },     // Iceland
  IE: { lat: 53.3498, lng: -6.2603 },      // Ireland
  IM: { lat:   54.1500, lng:    -4.4800 },     // Isle of Man
  IT: { lat: 41.9028, lng: 12.4964 },      // Italy
  JE: { lat:   49.1800, lng:    -2.1000 },     // Jersey
  XK: { lat:   42.6700, lng:    21.1700 },     // Kosovo
  LV: { lat:   56.9500, lng:    24.1000 },     // Latvia
  LI: { lat:   47.1300, lng:     9.5200 },     // Liechtenstein
  LT: { lat:   54.6800, lng:    25.3200 },     // Lithuania
  LU: { lat:   49.6000, lng:     6.1200 },     // Luxembourg
  MT: { lat:   35.8800, lng:    14.5000 },     // Malta
  MD: { lat:   47.0100, lng:    28.9000 },     // Moldova
  MC: { lat:   43.7300, lng:     7.4200 },     // Monaco
  ME: { lat:   42.4300, lng:    19.2700 },     // Montenegro
  NL: { lat: 52.3676, lng: 4.9041 },       // Netherlands
  MK: { lat:   42.0000, lng:    21.4300 },     // North Macedonia
  NO: { lat: 59.9139, lng: 10.7522 },      // Norway
  PL: { lat: 52.2297, lng: 21.0122 },      // Poland
  PT: { lat: 38.7223, lng: -9.1393 },      // Portugal
  RO: { lat:   44.4300, lng:    26.1000 },     // Romania
  RU: { lat:   55.7500, lng:    37.6000 },     // Russia
  SM: { lat:   43.9400, lng:    12.4500 },     // San Marino
  RS: { lat:   44.8300, lng:    20.5000 },     // Serbia
  SK: { lat:   48.1500, lng:    17.1200 },     // Slovakia
  SI: { lat:   46.0500, lng:    14.5200 },     // Slovenia
  ES: { lat: 40.4168, lng: -3.7038 },      // Spain
  SJ: { lat:   78.2200, lng:    15.6300 },     // Svalbard and Jan Mayen
  SE: { lat: 59.3293, lng: 18.0686 },      // Sweden
  CH: { lat: 46.9480, lng: 7.4474 },       // Switzerland
  UA: { lat:   50.4300, lng:    30.5200 },     // Ukraine
  GB: { lat: 51.5074, lng: -0.1278 },      // United Kingdom
  VA: { lat:   41.9000, lng:    12.4500 },     // Vatican City

  // Asia
  AF: { lat:   34.5200, lng:    69.1800 },     // Afghanistan
  AM: { lat:   40.1700, lng:    44.5000 },     // Armenia
  AZ: { lat:   40.3800, lng:    49.8700 },     // Azerbaijan
  BH: { lat:   26.2300, lng:    50.5700 },     // Bahrain
  BD: { lat:   23.7200, lng:    90.4000 },     // Bangladesh
  BT: { lat:   27.4700, lng:    89.6300 },     // Bhutan
  BN: { lat:    4.8800, lng:   114.9300 },     // Brunei
  KH: { lat:   11.5500, lng:   104.9200 },     // Cambodia
  CN: { lat: 39.9042, lng: 116.4074 },     // China
  GE: { lat:   41.6800, lng:    44.8300 },     // Georgia
  HK: { lat:   22.2670, lng:   114.1880 },     // Hong Kong
  IN: { lat: 28.6139, lng: 77.2090 },      // India
  ID: { lat: -6.2088, lng: 106.8456 },     // Indonesia
  IR: { lat:   35.7000, lng:    51.4200 },     // Iran
  IQ: { lat:   33.3300, lng:    44.4000 },     // Iraq
  IL: { lat: 31.7683, lng: 35.2137 },      // Israel
  JP: { lat: 35.6762, lng: 139.6503 },     // Japan
  JO: { lat:   31.9500, lng:    35.9300 },     // Jordan
  KZ: { lat:   51.1600, lng:    71.4500 },     // Kazakhstan
  KW: { lat:   29.3700, lng:    47.9700 },     // Kuwait
  KG: { lat:   42.8700, lng:    74.6000 },     // Kyrgyzstan
  LA: { lat:   17.9700, lng:   102.6000 },     // Laos
  LB: { lat:   33.8700, lng:    35.5000 },     // Lebanon
  MO: { lat:   22.1987, lng:  113.5439 },     // Macao
  MY: { lat: 3.1390, lng: 101.6869 },      // Malaysia
  MV: { lat:    4.1700, lng:    73.5100 },     // Maldives
  MN: { lat:   47.9200, lng:   106.9100 },     // Mongolia
  MM: { lat:   19.7600, lng:    96.0700 },     // Myanmar
  NP: { lat:   27.7200, lng:    85.3200 },     // Nepal
  KP: { lat:   39.0200, lng:   125.7500 },     // North Korea
  OM: { lat:   23.6200, lng:    58.5800 },     // Oman
  PK: { lat:   33.6800, lng:    73.0500 },     // Pakistan
  PS: { lat:   31.9000, lng:    35.2000 },     // Palestine
  PH: { lat: 14.5995, lng: 120.9842 },     // Philippines
  QA: { lat:   25.2800, lng:    51.5300 },     // Qatar
  SA: { lat:   24.6500, lng:    46.7000 },     // Saudi Arabia
  SG: { lat: 1.3521, lng: 103.8198 },      // Singapore
  KR: { lat: 37.5665, lng: 126.9780 },     // South Korea
  LK: { lat:    6.8900, lng:    79.9000 },     // Sri Lanka
  SY: { lat:   33.5000, lng:    36.3000 },     // Syria
  TW: { lat:   25.0300, lng:   121.5200 },     // Taiwan
  TJ: { lat:   38.5500, lng:    68.7700 },     // Tajikistan
  TH: { lat: 13.7563, lng: 100.5018 },     // Thailand
  TL: { lat:   -8.5800, lng:   125.6000 },     // Timor-Leste
  TR: { lat: 39.9334, lng: 32.8597 },      // Turkey
  TM: { lat:   37.9500, lng:    58.3800 },     // Turkmenistan
  AE: { lat: 25.2048, lng: 55.2708 },      // UAE
  UZ: { lat:   41.3200, lng:    69.2500 },     // Uzbekistan
  VN: { lat: 21.0285, lng: 105.8542 },     // Vietnam
  YE: { lat:   15.3700, lng:    44.1900 },     // Yemen

  // Africa
  DZ: { lat:   36.7500, lng:     3.0500 },     // Algeria
  AO: { lat:   -8.8300, lng:    13.2200 },     // Angola
  BJ: { lat:    6.4800, lng:     2.6200 },     // Benin
  BW: { lat:  -24.6300, lng:    25.9000 },     // Botswana
  IO: { lat:   -7.3000, lng:    72.4000 },     // British Indian Ocean Territory
  BF: { lat:   12.3700, lng:    -1.5200 },     // Burkina Faso
  BI: { lat:   -3.4300, lng:    29.9300 },     // Burundi
  CM: { lat:    3.8500, lng:    11.5000 },     // Cameroon
  CV: { lat:   14.9200, lng:   -23.5200 },     // Cape Verde
  CF: { lat:    4.3700, lng:    18.5800 },     // Central African Republic
  TD: { lat:   12.1000, lng:    15.0300 },     // Chad
  KM: { lat:  -11.7000, lng:    43.2300 },     // Comoros
  CG: { lat:   -4.2500, lng:    15.2800 },     // Republic of the Congo
  CD: { lat:   -4.3200, lng:    15.3000 },     // DR Congo
  DJ: { lat:   11.5800, lng:    43.1500 },     // Djibouti
  EG: { lat: 30.0444, lng: 31.2357 },      // Egypt
  GQ: { lat:    3.7500, lng:     8.7800 },     // Equatorial Guinea
  ER: { lat:   15.3300, lng:    38.9300 },     // Eritrea
  SZ: { lat:  -26.3200, lng:    31.1300 },     // Eswatini
  ET: { lat:    9.0300, lng:    38.7000 },     // Ethiopia
  GA: { lat:    0.3800, lng:     9.4500 },     // Gabon
  GM: { lat:   13.4500, lng:   -16.5700 },     // Gambia
  GH: { lat:    5.5500, lng:    -0.2200 },     // Ghana
  GN: { lat:    9.5000, lng:   -13.7000 },     // Guinea
  GW: { lat:   11.8500, lng:   -15.5800 },     // Guinea-Bissau
  CI: { lat:    6.8200, lng:    -5.2700 },     // Ivory Coast
  KE: { lat: -1.2864, lng: 36.8172 },      // Kenya
  LS: { lat:  -29.3200, lng:    27.4800 },     // Lesotho
  LR: { lat:    6.3000, lng:   -10.8000 },     // Liberia
  LY: { lat:   32.8800, lng:    13.1700 },     // Libya
  MG: { lat:  -18.9200, lng:    47.5200 },     // Madagascar
  MW: { lat:  -13.9700, lng:    33.7800 },     // Malawi
  ML: { lat:   12.6500, lng:    -8.0000 },     // Mali
  MR: { lat:   18.0700, lng:   -15.9700 },     // Mauritania
  MU: { lat:  -20.1500, lng:    57.4800 },     // Mauritius
  YT: { lat:  -12.7800, lng:    45.2200 },     // Mayotte
  MA: { lat: 33.9716, lng: -6.8498 },      // Morocco
  MZ: { lat:  -25.9500, lng:    32.5800 },     // Mozambique
  NA: { lat:  -22.5700, lng:    17.0800 },     // Namibia
  NE: { lat:   13.5200, lng:     2.1200 },     // Niger
  NG: { lat:    9.0800, lng:     7.5300 },     // Nigeria
  RE: { lat:  -20.8800, lng:    55.4500 },     // Réunion
  RW: { lat:   -1.9500, lng:    30.0500 },     // Rwanda
  SH: { lat:  -15.9300, lng:    -5.7200 },     // Saint Helena, Ascension and Tristan da Cunha
  ST: { lat:    0.3400, lng:     6.7300 },     // São Tomé and Príncipe
  SN: { lat:   14.7300, lng:   -17.6300 },     // Senegal
  SC: { lat:   -4.6200, lng:    55.4500 },     // Seychelles
  SL: { lat:    8.4800, lng:   -13.2300 },     // Sierra Leone
  SO: { lat:    2.0700, lng:    45.3300 },     // Somalia
  ZA: { lat: -25.7479, lng: 28.2293 },     // South Africa
  SS: { lat:    4.8500, lng:    31.6200 },     // South Sudan
  SD: { lat:   15.6000, lng:    32.5300 },     // Sudan
  TZ: { lat: -6.7924, lng: 39.2083 },      // Tanzania
  TG: { lat:    6.1400, lng:     1.2100 },     // Togo
  TN: { lat:   36.8000, lng:    10.1800 },     // Tunisia
  UG: { lat:    0.3200, lng:    32.5500 },     // Uganda
  EH: { lat:  -13.2800, lng:    27.1400 },     // Western Sahara
  ZM: { lat:  -15.4200, lng:    28.2800 },     // Zambia
  ZW: { lat:  -17.8200, lng:    31.0300 },     // Zimbabwe

  // Oceania
  AS: { lat:  -14.2700, lng:  -170.7000 },     // American Samoa
  AU: { lat: -35.2809, lng: 149.1300 },    // Australia
  CX: { lat:  -10.4200, lng:   105.6800 },     // Christmas Island
  CC: { lat:  -12.1700, lng:    96.8300 },     // Cocos (Keeling) Islands
  CK: { lat:  -21.2000, lng:  -159.7700 },     // Cook Islands
  FJ: { lat: -18.1248, lng: 178.4501 },    // Fiji
  PF: { lat:  -17.5300, lng:  -149.5600 },     // French Polynesia
  GU: { lat:   13.4800, lng:   144.7500 },     // Guam
  KI: { lat:    1.3300, lng:   172.9800 },     // Kiribati
  MH: { lat:    7.1000, lng:   171.3800 },     // Marshall Islands
  FM: { lat:    6.9200, lng:   158.1500 },     // Micronesia
  NR: { lat:   -0.5500, lng:   166.9200 },     // Nauru
  NC: { lat:  -22.2700, lng:   166.4500 },     // New Caledonia
  NZ: { lat: -41.2865, lng: 174.7762 },    // New Zealand
  NU: { lat:  -19.0200, lng:  -169.9200 },     // Niue
  NF: { lat:  -29.0500, lng:   167.9700 },     // Norfolk Island
  MP: { lat:   15.2000, lng:   145.7500 },     // Northern Mariana Islands
  PW: { lat:    7.5000, lng:   134.6200 },     // Palau
  PG: { lat:   -9.4500, lng:   147.1800 },     // Papua New Guinea
  PN: { lat:  -25.0700, lng:  -130.0800 },     // Pitcairn Islands
  WS: { lat:  -13.8200, lng:  -171.7700 },     // Samoa
  SB: { lat:   -9.4300, lng:   159.9500 },     // Solomon Islands
  TK: { lat:   -9.3800, lng:  -171.2200 },     // Tokelau
  TO: { lat:  -21.1300, lng:  -175.2000 },     // Tonga
  TV: { lat:   -8.5200, lng:   179.2200 },     // Tuvalu
  VU: { lat:  -17.7300, lng:   168.3200 },     // Vanuatu
  WF: { lat:  -13.9500, lng:  -171.9300 },     // Wallis and Futuna

  // Antarctic
  AQ: { lat:  -75.2500, lng:    0.0710 },     // Antarctica
  BV: { lat:  -54.4230, lng:    3.3880 },     // Bouvet Island
  TF: { lat:   48.8100, lng:    -1.4000 },     // French Southern and Antarctic Lands
  HM: { lat:  -53.1000, lng:   73.5100 },     // Heard I. and McDonald Islands
  GS: { lat:  -54.2800, lng:   -36.5000 },     // South Georgia

  // Pacific Ocean (Uninhabited territories)
  UM: { lat:   19.2800, lng:  166.6470 },     // United States Minor Outlying Islands
};

/**
 * Get coordinates for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Coordinates or null if not found
 */
export function getCountryCoordinates(
  countryCode: string
): { lat: number; lng: number } | null {
  return countryCoordinates[countryCode] || null;
}

/**
 * Check if a country has coordinate data available
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns True if coordinates are available
 */
export function hasCoordinates(countryCode: string): boolean {
  return countryCode in countryCoordinates;
}
