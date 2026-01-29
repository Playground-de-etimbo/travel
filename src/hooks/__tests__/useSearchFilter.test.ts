import { describe, it, expect, beforeAll } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { Country } from '@/types'
import { useSearchFilter } from '@/hooks/useSearchFilter'
import fs from 'fs/promises'
import path from 'path'

describe('useSearchFilter Hook - Ranking', () => {
  let countries: Country[]

  beforeAll(async () => {
    const filePath = path.resolve(process.cwd(), 'public/data/countries.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    countries = JSON.parse(fileContent)
  })

  const runSearch = (searchTerm: string) =>
    renderHook(() => useSearchFilter({ countries, searchTerm })).result.current

  it('should prioritize country-name matches over region matches', () => {
    const { flatResults } = runSearch('north')
    expect(flatResults.length).toBeGreaterThan(0)

    const topMatches = flatResults.slice(0, 3)
    topMatches.forEach((country) => {
      expect(country.countryName.toLowerCase()).toContain('north')
    })

    const bermudaIndex = flatResults.findIndex(
      (country) => country.countryName.toLowerCase() === 'bermuda'
    )
    if (bermudaIndex !== -1) {
      expect(bermudaIndex).toBeGreaterThan(0)
    }
  })

  it('should handle short queries and return expected matches', () => {
    const { flatResults } = runSearch('bra')
    expect(flatResults.length).toBeGreaterThan(0)
    expect(flatResults.some((country) => country.countryName === 'Brazil')).toBe(true)
  })

  it('should include Republic of Korea for korea queries', () => {
    const { flatResults } = runSearch('korea')
    expect(flatResults.length).toBeGreaterThan(0)
    expect(
      flatResults.some((country) => country.countryName === 'Republic of Korea')
    ).toBe(true)
  })

  it('should match North Macedonia for mace queries', () => {
    const { flatResults } = runSearch('mace')
    expect(flatResults.length).toBeGreaterThan(0)
    expect(
      flatResults.some((country) => country.countryName === 'North Macedonia')
    ).toBe(true)
  })
})
