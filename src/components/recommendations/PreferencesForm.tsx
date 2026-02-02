import { useState, useEffect, useMemo, useRef } from 'react';
import { HomeLocationInput } from './HomeLocationInput';
import { InterestsSelector } from './InterestsSelector';
import { FlightDurationSelector } from './FlightDurationSelector';
import { cn } from '@/lib/utils';
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
}

export function PreferencesForm({
  countries,
  onSubmit,
  onHomeSelected,
  loading,
}: PreferencesFormProps) {
  const [home, setHome] = useState<string | null>(null);
  const [interests, setInterests] = useState<TravelInterest[]>([]);
  const [duration, setDuration] = useState<FlightDuration | null>(null);

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
    <div className="space-y-8 mb-8">
      {/* Question 1: Home Location (always enabled) */}
      <div className="space-y-3">
        <label className="text-lg font-semibold">Where do you live?</label>
        <p className="text-sm text-muted-foreground">
          {availableCountries.length} countries available for recommendations
        </p>
        <HomeLocationInput
          value={home}
          onChange={handleHomeChange}
          countries={availableCountries}
          placeholder="Start typing your country..."
        />
      </div>

      {/* Question 2: Interests (always enabled) */}
      <div className="space-y-3">
        <label className="text-lg font-semibold">What interests you?</label>
        <p className="text-sm text-muted-foreground">Select all that apply</p>
        <InterestsSelector
          selected={interests}
          onChange={setInterests}
          disabled={false}
        />
      </div>

      {/* Question 3: Travel Duration (always enabled) */}
      <div className="space-y-3">
        <label className="text-lg font-semibold">
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
