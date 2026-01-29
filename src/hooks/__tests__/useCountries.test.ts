import { describe, it, expect, beforeAll } from 'vitest'
import type { Country } from '@/types'
import fs from 'fs/promises'
import path from 'path'

describe('useCountries Hook - Data Validation', () => {
  let countries: Country[]

  beforeAll(async () => {
    const filePath = path.resolve(process.cwd(), 'public/data/countries.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    countries = JSON.parse(fileContent)
  })

  it('should load countries.json successfully', () => {
    expect(countries).toBeDefined()
    expect(Array.isArray(countries)).toBe(true)
  })

  it('should return a full ISO-style list of countries/territories', () => {
    expect(countries.length).toBeGreaterThanOrEqual(240)
  })

  it('should have required properties on each country', () => {
    countries.forEach((country) => {
      expect(country).toHaveProperty('countryCode')
      expect(country).toHaveProperty('countryName')
      expect(country).toHaveProperty('continent')
      expect(country).toHaveProperty('region')
      expect(country).toHaveProperty('currencyCode')
      expect(country).toHaveProperty('flagEmoji')
      expect(country).toHaveProperty('baselineCost')
      expect(country).toHaveProperty('nightlyCost')

      // Validate types
      expect(typeof country.countryCode).toBe('string')
      expect(typeof country.countryName).toBe('string')
      expect(typeof country.continent).toBe('string')
      expect(typeof country.region).toBe('string')
      expect(typeof country.currencyCode).toBe('string')
      expect(typeof country.flagEmoji).toBe('string')
      expect(typeof country.baselineCost).toBe('number')
      expect(typeof country.nightlyCost).toBe('number')
    })
  })

  it('should have valid ISO country codes', () => {
    countries.forEach((country) => {
      // ISO country codes are 2 uppercase letters
      expect(country.countryCode).toMatch(/^[A-Z]{2}$/)
    })
  })

  it('should include a variety of countries and territories', () => {
    const byCode = new Map(countries.map((c) => [c.countryCode, c]))

    ;['US', 'JP', 'DE', 'BR', 'ZA', 'NZ', 'AQ', 'GF', 'PR', 'XK'].forEach((code) => {
      expect(byCode.has(code)).toBe(true)
    })

    expect(byCode.get('AQ')?.countryName).toBe('Antarctica')
  })
})
