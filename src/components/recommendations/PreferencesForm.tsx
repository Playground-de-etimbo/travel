import { useState, useEffect, useMemo, useRef } from 'react';
import { HomeLocationInput } from './HomeLocationInput';
import { InterestsSelector } from './InterestsSelector';
import { FlightDurationSelector } from './FlightDurationSelector';
import { hasCoordinates } from '@/data/countryCoordinates';
import type { Country } from '@/types/country';
import type {
  RecommendationPreferences,
  TravelInterest,
  FlightDuration,
} from '@/types/recommendation';

interface PreferencesFormProps {
  countries: Country[];
  onSubmit: (preferences: RecommendationPreferences) => void;
  onHomeSelected: (countryCode: string) => void;
  loading: boolean;
  detectedCountry?: string | null;
  onDetectionDismiss?: () => void;
  showDetectionBadge?: boolean;
  savedPreferences?: RecommendationPreferences | null;
}

export function PreferencesForm({
  countries,
  onSubmit,
  onHomeSelected,
  loading,
  detectedCountry,
  onDetectionDismiss,
  showDetectionBadge = false,
  savedPreferences,
}: PreferencesFormProps) {
  const [home, setHome] = useState<string | null>(savedPreferences?.homeLocation ?? null);
  const [interests, setInterests] = useState<TravelInterest[]>(
    savedPreferences?.interests ?? ['culture']
  );
  const [duration, setDuration] = useState<FlightDuration | null>(
    savedPreferences?.maxFlightDuration ?? '12-plus'
  );

  // Track last generated values to prevent infinite loop
  const lastGeneratedRef = useRef<string>('');

  // Filter countries to only those with coordinate data
  const availableCountries = useMemo(
    () => countries.filter((country) => hasCoordinates(country.countryCode)),
    [countries]
  );

  const isValid = home && interests.length > 0 && duration;

  const handleHomeChange = (countryCode: string) => {
    setHome(countryCode);
    onHomeSelected(countryCode);
  };

  // Update form state when saved preferences load from storage
  useEffect(() => {
    if (savedPreferences) {
      if (savedPreferences.homeLocation) {
        setHome(savedPreferences.homeLocation);
        onHomeSelected(savedPreferences.homeLocation);
      }
      if (savedPreferences.interests) {
        setInterests(savedPreferences.interests);
      }
      if (savedPreferences.maxFlightDuration) {
        setDuration(savedPreferences.maxFlightDuration);
      }
    }
  }, [savedPreferences, onHomeSelected]);

  // Update home when detectedCountry changes (on mount)
  // Don't re-populate if user has dismissed the detection (showDetectionBadge=false)
  // Validate that detected country is in our available list before using it
  useEffect(() => {
    if (detectedCountry && !home && showDetectionBadge) {
      // Check if detected country is available (has coordinate data)
      const isAvailable = availableCountries.some(
        (c) => c.countryCode === detectedCountry
      );

      if (isAvailable) {
        setHome(detectedCountry);
        onHomeSelected(detectedCountry);
      }
    }
  }, [detectedCountry, home, showDetectionBadge, onHomeSelected, availableCountries]);

  // Auto-generate when all fields are filled or any field changes (if all are filled)
  useEffect(() => {
    if (isValid && !loading) {
      // Create a key from current values to detect actual changes
      const currentKey = `${home}|${interests.sort().join(',')}|${duration}`;

      // Only generate if values actually changed
      if (currentKey !== lastGeneratedRef.current) {
        lastGeneratedRef.current = currentKey;

        const preferences: RecommendationPreferences = {
          homeLocation: home,
          interests,
          maxFlightDuration: duration,
          lastGenerated: new Date(),
        };

        onSubmit(preferences);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home, interests, duration]);

  return (
    <div className="space-y-5 mb-6">
      {/* Question 1: Home Location (always enabled) */}
      <div className="space-y-2.5">
        <label className="text-base font-semibold text-foreground/90">Where do you live?</label>
        <p className="text-xs text-muted-foreground/80">
          {availableCountries.length} countries available for recommendations
        </p>
        <HomeLocationInput
          value={home}
          onChange={handleHomeChange}
          countries={availableCountries}
          placeholder="Start typing your country..."
          detectedCountry={detectedCountry}
          onDetectionDismiss={onDetectionDismiss}
          showDetectionBadge={showDetectionBadge}
        />
      </div>

      {/* Question 2: Interests (always enabled) */}
      <div className="space-y-2.5">
        <label className="text-base font-semibold text-foreground/90">What interests you?</label>
        <p className="text-xs text-muted-foreground/80">Select all that apply</p>
        <InterestsSelector
          selected={interests}
          onChange={setInterests}
          disabled={false}
        />
      </div>

      {/* Question 3: Travel Duration (always enabled) */}
      <div className="space-y-2.5">
        <label className="text-base font-semibold text-foreground/90">
          How far are you willing to travel?
        </label>
        <FlightDurationSelector
          value={duration}
          onChange={setDuration}
          disabled={false}
        />
      </div>
    </div>
  );
}
