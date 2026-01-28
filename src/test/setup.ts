import '@testing-library/jest-dom'
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

const originalFetch = globalThis.fetch

beforeAll(() => {
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url

    if (url === '/data/countries-natural-earth-50m.geo.json') {
      return new Response(
        JSON.stringify({ type: 'FeatureCollection', features: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    if (originalFetch) {
      return originalFetch(input, init)
    }

    throw new Error(`Unhandled fetch in tests: ${url}`)
  }) as typeof globalThis.fetch
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})

afterAll(() => {
  if (originalFetch) {
    globalThis.fetch = originalFetch
  }
})
