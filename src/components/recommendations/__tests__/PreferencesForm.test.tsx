import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreferencesForm } from '../PreferencesForm';

const mockCountries = [
  { countryCode: 'US', countryName: 'United States', flagEmoji: '🇺🇸', region: 'North America', continent: 'North America', currencyCode: 'USD', currencyName: 'US Dollar', baselineCost: 100, nightlyCost: 150 },
  { countryCode: 'JP', countryName: 'Japan', flagEmoji: '🇯🇵', region: 'Asia', continent: 'Asia', currencyCode: 'JPY', currencyName: 'Japanese Yen', baselineCost: 120, nightlyCost: 180 },
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
        loading={false}
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
        loading={false}
      />
    );

    // Interests and duration should not be disabled
    const sections = screen.getAllByRole('group', { hidden: true });
    sections.forEach(section => {
      expect(section).not.toHaveClass('opacity-50');
      expect(section).not.toHaveClass('pointer-events-none');
    });
  });
});
