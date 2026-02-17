import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecommendationsSection from '../RecommendationsSection';
import type { Country } from '@/types/country';

const mockUseRecommendations = vi.fn();

vi.mock('@/hooks/useRecommendations', () => ({
  useRecommendations: (...args: unknown[]) => mockUseRecommendations(...args),
}));

vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    detectedCountry: null,
    isDetecting: false,
    isDismissed: true,
    dismissDetection: vi.fn(),
  }),
}));

vi.mock('@/hooks/useCountryEnrichment', () => ({
  useCountryEnrichment: vi.fn(),
}));

vi.mock('../RecommendationsGrid', () => ({
  RecommendationsGrid: () => <div data-testid="recommendations-grid">Grid</div>,
}));

vi.mock('../LoadingState', () => ({
  LoadingState: () => <div data-testid="loading-state">Loading</div>,
}));

vi.mock('../SampleResults', () => ({
  SampleResults: () => <div data-testid="sample-results">Sample</div>,
}));

const mockCountries: Country[] = [
  {
    countryCode: 'US',
    countryName: 'United States',
    flagEmoji: '🇺🇸',
    region: 'North America',
    continent: 'North America',
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    description: 'Sample description. Second sentence.',
    baselineCost: 100,
    nightlyCost: 150,
    interests: ['culture', 'action'],
  },
];

describe('RecommendationsSection', () => {
  beforeEach(() => {
    mockUseRecommendations.mockReset();
  });

  it('keeps the recommendation grid visible while refreshing existing results', () => {
    mockUseRecommendations.mockReturnValue({
      preferences: {
        homeLocation: 'US',
        interests: ['culture'],
        maxFlightDuration: '12-plus',
        lastGenerated: new Date('2026-02-10T00:00:00.000Z'),
      },
      result: {
        recommendations: [
          {
            countryCode: 'JP',
            reason: 'Sample reason',
            imageUrl: null,
            matchScore: 92,
            costs: {
              budget: { flight: 500, hotel: 60, daily: 40, total: 1200 },
              modest: { flight: 700, hotel: 110, daily: 70, total: 1960 },
              bougie: { flight: 1200, hotel: 280, daily: 150, total: 4210 },
            },
            actionVerb: 'Explore',
          },
        ],
        preferences: {
          homeLocation: 'US',
          interests: ['culture'],
          maxFlightDuration: '12-plus',
          lastGenerated: new Date('2026-02-10T00:00:00.000Z'),
        },
        generatedAt: new Date('2026-02-10T00:00:00.000Z'),
        version: '1.0',
      },
      activeTier: 'modest',
      loading: true,
      error: null,
      generate: vi.fn(),
      setActiveTier: vi.fn(),
      updateEnrichedData: vi.fn(),
    });

    render(
      <RecommendationsSection
        countries={mockCountries}
        beenTo={[]}
        addCountry={vi.fn()}
      />
    );

    expect(screen.getByTestId('recommendations-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sample-results')).not.toBeInTheDocument();
    expect(screen.getByText('Updating recommendations...')).toBeInTheDocument();
  });
});
