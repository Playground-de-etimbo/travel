export function getGeoCountryCode(geoProperties: any): string | null {
  const iso2 = geoProperties?.ISO_A2 ?? geoProperties?.iso_a2;
  if (iso2 && iso2 !== '-99') {
    return iso2;
  }

  const iso2Extended = geoProperties?.ISO_A2_EH ?? geoProperties?.iso_a2_eh;
  if (iso2Extended && iso2Extended !== '-99') {
    return iso2Extended;
  }

  return null;
}
