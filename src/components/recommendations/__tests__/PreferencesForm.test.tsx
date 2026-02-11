import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreferencesForm } from '../PreferencesForm';
import type { Country } from '@/types/country';
import type { RecommendationPreferences } from '@/types/recommendation';

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
  {
    countryCode: 'JP',
    countryName: 'Japan',
    flagEmoji: '🇯🇵',
    region: 'Asia',
    continent: 'Asia',
    currencyCode: 'JPY',
    currencyName: 'Japanese Yen',
    description: 'Sample description. Second sentence.',
    baselineCost: 120,
    nightlyCost: 180,
    interests: ['culture', 'action'],
  },
];

describe('PreferencesForm', () => {
  it('renders all form fields without greying out', () => {
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
      />
    );

    // Check all fields are present
    expect(screen.getByText('Where do you live?')).toBeInTheDocument();
    expect(screen.getByText('What interests you?')).toBeInTheDocument();
    expect(screen.getByText('How far are you willing to travel?')).toBeInTheDocument();
  });

  it('does not disable fields initially', () => {
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
      />
    );

    // Interest and duration buttons should be interactive
    const optionButtons = screen.getAllByRole('button');
    optionButtons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('does not clobber user-selected interests when saved preferences refresh', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    const initialSaved: RecommendationPreferences = {
      homeLocation: 'US',
      interests: ['culture'],
      maxFlightDuration: '12-plus',
      lastGenerated: new Date('2026-02-10T00:00:00.000Z'),
    };

    const refreshedSaved: RecommendationPreferences = {
      homeLocation: 'US',
      interests: ['culture'],
      maxFlightDuration: '12-plus',
      lastGenerated: new Date('2026-02-10T00:00:05.000Z'),
    };

    const { rerender } = render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        savedPreferences={initialSaved}
      />
    );

    const actionButton = screen.getByRole('button', { name: /Action/i });
    await user.click(actionButton);
    expect(actionButton.className).toContain('bg-gradient-to-br');

    // Simulate async saved-preferences refresh from a completed generation.
    rerender(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        savedPreferences={refreshedSaved}
      />
    );

    // User selection should remain stable and not flicker back.
    expect(actionButton.className).toContain('bg-gradient-to-br');
  });

  it('submits updated preferences immediately after selection paint', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        savedPreferences={{
          homeLocation: 'US',
          interests: ['culture'],
          maxFlightDuration: '12-plus',
          lastGenerated: new Date('2026-02-10T00:00:00.000Z'),
        }}
      />
    );

    const weatherButton = screen.getByRole('button', { name: /Weather/i });
    await user.click(weatherButton);
    expect(weatherButton.className).toContain('bg-gradient-to-br');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('hydrates from saved preferences when they arrive after initial render', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    const { rerender } = render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        savedPreferences={{
          homeLocation: null,
          interests: [],
          maxFlightDuration: '6-12',
          lastGenerated: null,
        }}
      />
    );

    rerender(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        savedPreferences={{
          homeLocation: 'JP',
          interests: ['culture', 'action'],
          maxFlightDuration: '3-6',
          lastGenerated: new Date('2026-02-10T00:00:05.000Z'),
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Start typing your country...')).toHaveValue('Japan');
    });
    expect(screen.getByRole('button', { name: /Action/i }).className).toContain('bg-gradient-to-br');
  });

  it('uses default interest when saved preferences have no interests selected', () => {
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        savedPreferences={{
          homeLocation: null,
          interests: [],
          maxFlightDuration: '6-12',
          lastGenerated: null,
        }}
      />
    );

    expect(screen.getByRole('button', { name: /Culture/i }).className).toContain('bg-gradient-to-br');
  });

  it('applies detected country once and does not re-add on rerender', () => {
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    const { rerender } = render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        detectedCountry="US"
        showDetectionBadge
      />
    );

    expect(mockOnHomeSelected).toHaveBeenCalledWith('US');
    const callCount = mockOnHomeSelected.mock.calls.length;

    rerender(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        detectedCountry="US"
        showDetectionBadge
      />
    );

    expect(mockOnHomeSelected.mock.calls.length).toBe(callCount);
  });

  it('does not call onHomeSelected when detected country is dismissed', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        detectedCountry="US"
        showDetectionBadge
      />
    );

    await user.click(screen.getByRole('button', { name: 'Clear detected country' }));

    expect(mockOnHomeSelected).not.toHaveBeenCalledWith('');
  });

  it('auto-submits when detected country is available with default preferences', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnHomeSelected = vi.fn();

    render(
      <PreferencesForm
        countries={mockCountries}
        onSubmit={mockOnSubmit}
        onHomeSelected={mockOnHomeSelected}
        detectedCountry="US"
        showDetectionBadge
      />
    );

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
