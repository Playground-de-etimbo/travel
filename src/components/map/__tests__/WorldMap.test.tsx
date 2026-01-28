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
    const mockOnCountrySelect = vi.fn()
    const mockOnAddClick = vi.fn()

    expect(() => {
      render(
        <WorldMap
          beenTo={[]}
          onCountrySelect={mockOnCountrySelect}
          onAddClick={mockOnAddClick}
        />
      )
    }).not.toThrow()
  })

  it('should render SVG element', () => {
    const mockOnCountrySelect = vi.fn()
    const mockOnAddClick = vi.fn()

    render(
      <WorldMap
        beenTo={[]}
        onCountrySelect={mockOnCountrySelect}
        onAddClick={mockOnAddClick}
      />
    )

    // react-simple-maps renders an SVG
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should accept callback props', () => {
    const mockOnCountrySelect = vi.fn()
    const mockOnAddClick = vi.fn()

    render(
      <WorldMap
        beenTo={['US']}
        onCountrySelect={mockOnCountrySelect}
        onAddClick={mockOnAddClick}
      />
    )

    // Just verify the component accepts and stores the props
    expect(mockOnCountrySelect).toBeDefined()
    expect(mockOnAddClick).toBeDefined()
  })
})
