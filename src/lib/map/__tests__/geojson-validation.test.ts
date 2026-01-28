import { describe, it, expect, beforeAll } from 'vitest'
import type { FeatureCollection, Geometry } from 'geojson'
import fs from 'fs/promises'
import path from 'path'

interface CountryFeature {
  type: 'Feature'
  properties: {
    ISO_A2: string
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
    const missingIsoA2 = data.features.filter(
      (feature) => !feature.properties?.ISO_A2
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
      const isoCode = feature.properties.ISO_A2
      expect(typeof isoCode).toBe('string')

      // Collect codes that are completely invalid (null, undefined, empty)
      if (!isoCode || isoCode.trim().length === 0) {
        invalidCodes.push(`Empty code for: ${feature.properties.NAME}`)
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
        console.error(`- ${feature.properties?.ISO_A2}: ${feature.properties?.NAME}`)
      })
    }

    expect(invalidFeatures).toHaveLength(0)
  })
})
