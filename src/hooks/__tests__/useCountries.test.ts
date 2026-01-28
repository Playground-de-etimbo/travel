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

  it('should return array of 20 countries', () => {
    expect(countries).toHaveLength(20)
  })

  it('should have required properties on each country', () => {
    countries.forEach((country) => {
      expect(country).toHaveProperty('countryCode')
      expect(country).toHaveProperty('countryName')
      expect(country).toHaveProperty('region')
      expect(country).toHaveProperty('currencyCode')
      expect(country).toHaveProperty('flagEmoji')
      expect(country).toHaveProperty('baselineCost')
      expect(country).toHaveProperty('nightlyCost')

      // Validate types
      expect(typeof country.countryCode).toBe('string')
      expect(typeof country.countryName).toBe('string')
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
})
