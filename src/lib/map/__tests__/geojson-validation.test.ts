import { describe, it, expect, beforeAll } from 'vitest'
import type { FeatureCollection, Geometry } from 'geojson'
import fs from 'fs/promises'
import path from 'path'

interface CountryFeature {
  type: 'Feature'
  properties: {
    ISO_A2?: string
    iso_a2?: string
    NAME?: string
    name?: string
    [key: string]: unknown
  }
  geometry: Geometry
}

describe('GeoJSON Validation', () => {
  // Test the Natural Earth 50m file (smoother borders)
  const geoJsonPath = 'public/data/countries-natural-earth-50m.geo.json'
  let data: FeatureCollection

  beforeAll(async () => {
    const filePath = path.resolve(process.cwd(), geoJsonPath)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    data = JSON.parse(fileContent)
  })

  it('should load GeoJSON file successfully', () => {
    expect(data).toBeDefined()
    expect(data.type).toBe('FeatureCollection')
  })

  it('should have all features with valid geometry', () => {
    expect(data.features).toBeDefined()
    expect(data.features.length).toBeGreaterThan(0)

    // Check that no features have null geometry
    const nullGeometries = data.features.filter(
      (feature) => feature.geometry === null || feature.geometry === undefined
    )
    expect(nullGeometries).toHaveLength(0)
  })

  it('should have ISO_A2 property on all features', () => {
    const getIsoCode = (feature: CountryFeature) =>
      feature.properties?.ISO_A2 ?? feature.properties?.iso_a2

    const missingIsoA2 = data.features.filter(
      (feature) => !getIsoCode(feature as CountryFeature)
    )

    expect(missingIsoA2).toHaveLength(0)
  })

  it('should have ISO_A2 codes that are strings', () => {
    // Natural Earth data includes some non-standard codes:
    // - "-99" for disputed/unrecognized territories (Kosovo, N. Cyprus, Somaliland)
    // - "CN-TW" for Taiwan
    // - Norway and France sometimes have "-99" for overseas territories
    // These are acceptable as long as they're strings and the geometry is valid

    const invalidCodes: string[] = []
    data.features.forEach((feature) => {
      const isoCode =
        (feature as CountryFeature).properties?.ISO_A2 ??
        (feature as CountryFeature).properties?.iso_a2
      expect(typeof isoCode).toBe('string')

      // Collect codes that are completely invalid (null, undefined, empty)
      if (!isoCode || isoCode.trim().length === 0) {
        const name =
          (feature as CountryFeature).properties?.NAME ??
          (feature as CountryFeature).properties?.name ??
          'Unknown'
        invalidCodes.push(`Empty code for: ${name}`)
      }
    })

    // Report any truly invalid codes
    if (invalidCodes.length > 0) {
      console.error(`Found ${invalidCodes.length} invalid ISO_A2 codes:`)
      invalidCodes.forEach(code => console.error(`  - ${code}`))
    }

    expect(invalidCodes).toHaveLength(0)
  })

  it('should have valid geometry types (Polygon or MultiPolygon)', () => {
    data.features.forEach((feature) => {
      expect(feature.geometry).toBeDefined()
      expect(['Polygon', 'MultiPolygon']).toContain(feature.geometry.type)
    })
  })

  it('should not have any features with null or undefined geometries', () => {
    const invalidFeatures = data.features.filter(
      (feature) =>
        !feature.geometry ||
        feature.geometry === null ||
        feature.geometry === undefined
    )

    // If there are invalid features, log them for debugging
    if (invalidFeatures.length > 0) {
      console.error('Features with invalid geometry:')
      invalidFeatures.forEach((feature) => {
        const isoCode =
          (feature as CountryFeature).properties?.ISO_A2 ??
          (feature as CountryFeature).properties?.iso_a2
        const name =
          (feature as CountryFeature).properties?.NAME ??
          (feature as CountryFeature).properties?.name
        console.error(`- ${isoCode}: ${name}`)
      })
    }

    expect(invalidFeatures).toHaveLength(0)
  })

  it('should include French Guiana as a separate feature', () => {
    const frenchGuiana = data.features.find(
      (feature) =>
        feature.properties?.ISO_A2 === 'GF' ||
        feature.properties?.iso_a2 === 'GF' ||
        feature.properties?.NAME === 'French Guiana' ||
        feature.properties?.name === 'French Guiana'
    )
    expect(frenchGuiana).toBeDefined()

    const france = data.features.find(
      (feature) =>
        feature.properties?.NAME === 'France' ||
        feature.properties?.name === 'France'
    )
    expect(france).toBeDefined()

    const geometry = france?.geometry
    if (!geometry) {
      throw new Error('France feature is missing geometry')
    }

    const polygons =
      geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates]

    const hasFrenchGuiana = polygons.some((poly) => {
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity

      poly.forEach((ring) => {
        ring.forEach(([x, y]) => {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        })
      })

      return minX < -50 && maxX < -50 && minY > 0 && maxY < 8
    })

    expect(hasFrenchGuiana).toBe(false)
  })
})
