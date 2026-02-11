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
  detectedCountry?: string | null;
  onDetectionDismiss?: () => void;
  showDetectionBadge?: boolean;
  savedPreferences?: RecommendationPreferences | null;
}

export function PreferencesForm({
  countries,
  onSubmit,
  onHomeSelected,
  detectedCountry,
  onDetectionDismiss,
  showDetectionBadge = false,
  savedPreferences,
}: PreferencesFormProps) {
  const getInitialInterests = (prefs?: RecommendationPreferences | null): TravelInterest[] =>
    prefs?.interests && prefs.interests.length > 0 ? prefs.interests : ['culture'];

  const getInitialDuration = (prefs?: RecommendationPreferences | null): FlightDuration =>
    prefs?.maxFlightDuration ?? '12-plus';

  const [home, setHome] = useState<string | null>(savedPreferences?.homeLocation ?? null);
  const [interests, setInterests] = useState<TravelInterest[]>(getInitialInterests(savedPreferences));
  const [duration, setDuration] = useState<FlightDuration | null>(getInitialDuration(savedPreferences));
  const hasUserInteractedRef = useRef(false);
  const lastAppliedSavedSignatureRef = useRef<string | null>(null);
  const lastAppliedDetectedCountryRef = useRef<string | null>(null);
  const onHomeSelectedRef = useRef(onHomeSelected);
  const homeRef = useRef(home);
  const interestsRef = useRef(interests);
  const durationRef = useRef(duration);

  // Track last generated values to prevent infinite loop
  const lastGeneratedRef = useRef<string>('');

  // Filter countries to only those with coordinate data
  const availableCountries = useMemo(
    () => countries.filter((country) => hasCoordinates(country.countryCode)),
    [countries]
  );

  const isValid = home && interests.length > 0 && duration;

  useEffect(() => {
    onHomeSelectedRef.current = onHomeSelected;
  }, [onHomeSelected]);

  useEffect(() => {
    homeRef.current = home;
  }, [home]);

  useEffect(() => {
    interestsRef.current = interests;
  }, [interests]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const handleHomeChange = (countryCode: string) => {
    hasUserInteractedRef.current = true;
    setHome(countryCode);
    if (countryCode) {
      onHomeSelectedRef.current(countryCode);
    }
  };

  const handleInterestsChange = (newInterests: TravelInterest[]) => {
    hasUserInteractedRef.current = true;
    setInterests(newInterests);
  };

  const handleDurationChange = (newDuration: FlightDuration) => {
    hasUserInteractedRef.current = true;
    setDuration(newDuration);
  };

  // Update form state when saved preferences load from storage
  useEffect(() => {
    if (!savedPreferences || hasUserInteractedRef.current) return;

    const savedSignature = JSON.stringify({
      homeLocation: savedPreferences.homeLocation ?? null,
      interests: savedPreferences.interests ?? [],
      maxFlightDuration: savedPreferences.maxFlightDuration ?? null,
    });

    if (savedSignature === lastAppliedSavedSignatureRef.current) return;
    lastAppliedSavedSignatureRef.current = savedSignature;

    const nextHome = savedPreferences.homeLocation ?? null;
    const nextInterests = getInitialInterests(savedPreferences);
    const nextDuration = getInitialDuration(savedPreferences);

    if (nextHome && nextHome !== homeRef.current) {
      setHome(nextHome);
      onHomeSelectedRef.current(nextHome);
    }

    const interestsChanged =
      nextInterests.length !== interestsRef.current.length ||
      nextInterests.some((interest, index) => interest !== interestsRef.current[index]);
    if (interestsChanged) {
      setInterests(nextInterests);
    }

    if (nextDuration !== durationRef.current) {
      setDuration(nextDuration);
    }
  }, [savedPreferences]);

  // Update home when detectedCountry changes (on mount)
  // Don't re-populate if user has dismissed the detection (showDetectionBadge=false)
  // Validate that detected country is in our available list before using it
  useEffect(() => {
    if (!detectedCountry || !showDetectionBadge) return;
    if (homeRef.current) return;
    if (lastAppliedDetectedCountryRef.current === detectedCountry) return;

    // Check if detected country is available (has coordinate data)
    const isAvailable = availableCountries.some(
      (c) => c.countryCode === detectedCountry
    );

    if (!isAvailable) return;

    lastAppliedDetectedCountryRef.current = detectedCountry;
    setHome(detectedCountry);
    onHomeSelectedRef.current(detectedCountry);
  }, [detectedCountry, showDetectionBadge, availableCountries]);

  // Auto-generate when all fields are filled or any field changes.
  // Defer submit to next task so selection visuals paint immediately first.
  useEffect(() => {
    if (!isValid) return;

    const currentKey = `${home}|${[...interests].sort().join(',')}|${duration}`;
    if (currentKey === lastGeneratedRef.current) return;

    lastGeneratedRef.current = currentKey;

    const preferences: RecommendationPreferences = {
      homeLocation: home,
      interests,
      maxFlightDuration: duration,
      lastGenerated: new Date(),
    };

    const timeoutId = window.setTimeout(() => {
      onSubmit(preferences);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [home, interests, duration, isValid, onSubmit]);

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
          onChange={handleInterestsChange}
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
          onChange={handleDurationChange}
          disabled={false}
        />
      </div>
    </div>
  );
}
