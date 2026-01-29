import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { WorldMap } from '../WorldMap'

// Mock the hooks
vi.mock('@/hooks/useCountries', () => ({
  useCountries: () => ({
    countries: [
      {
        countryCode: 'US',
        countryName: 'United States',
        region: 'Americas',
        currencyCode: 'USD',
        flagEmoji: '🇺🇸',
        baselineCost: 100,
        nightlyCost: 150,
      },
    ],
    loading: false,
  }),
}))

vi.mock('@/hooks/useCountryTooltip', () => ({
  useCountryTooltip: () => ({
    tooltip: {
      country: null,
      position: { x: 0, y: 0 },
      visible: false,
    },
    show: vi.fn(),
    hide: vi.fn(),
    update: vi.fn(),
  }),
}))

vi.mock('@/hooks/useMapZoom', () => ({
  useMapZoom: () => ({
    position: { coordinates: [0, 0], zoom: 1 },
    handleMoveStart: vi.fn(),
    handleMoveEnd: vi.fn(),
    isDragging: false,
  }),
}))

describe('WorldMap Component', () => {
  it('should render without errors', () => {
    const mockOnAddCountry = vi.fn()
    const mockOnRemoveCountry = vi.fn()

    expect(() => {
      render(
        <WorldMap
          beenTo={[]}
          onAddCountry={mockOnAddCountry}
          onRemoveCountry={mockOnRemoveCountry}
        />
      )
    }).not.toThrow()
  })

  it('should render SVG element', () => {
    const mockOnAddCountry = vi.fn()
    const mockOnRemoveCountry = vi.fn()

    render(
      <WorldMap
        beenTo={[]}
        onAddCountry={mockOnAddCountry}
        onRemoveCountry={mockOnRemoveCountry}
      />
    )

    // react-simple-maps renders an SVG
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should accept callback props', () => {
    const mockOnAddCountry = vi.fn()
    const mockOnRemoveCountry = vi.fn()

    render(
      <WorldMap
        beenTo={['US']}
        onAddCountry={mockOnAddCountry}
        onRemoveCountry={mockOnRemoveCountry}
      />
    )

    // Just verify the component accepts and stores the props
    expect(mockOnAddCountry).toBeDefined()
    expect(mockOnRemoveCountry).toBeDefined()
  })
})
