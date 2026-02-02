import type { TravelInterest } from '@/types/recommendation';

/**
 * Reason templates organized by travel interest
 */
const REASON_TEMPLATES: Record<TravelInterest, string[]> = {
  weather: [
    'Perfect climate for outdoor enthusiasts with year-round sunshine and pleasant temperatures.',
    'Ideal weather conditions with comfortable temperatures and low rainfall during peak season.',
    'Enjoy tropical paradise with warm beaches and consistent sunny skies.',
    'Mediterranean climate offers the perfect balance of warmth and coastal breezes.',
  ],
  relaxation: [
    'Unwind on pristine beaches with crystal-clear waters and peaceful atmospheres.',
    'Escape to serene landscapes perfect for meditation and rejuvenation.',
    'Experience ultimate tranquility with world-class spas and peaceful retreats.',
    'Discover secluded islands and quiet coastal towns for pure relaxation.',
  ],
  culture: [
    'Immerse yourself in rich history with ancient temples, museums, and historic sites.',
    'Explore vibrant traditions, local festivals, and authentic cultural experiences.',
    'Discover architectural marvels and UNESCO World Heritage sites.',
    'Experience diverse cuisine, art galleries, and living cultural heritage.',
  ],
  action: [
    'Adventure awaits with thrilling outdoor activities from hiking to water sports.',
    'Push your limits with extreme sports, mountain climbing, and adrenaline-pumping experiences.',
    'Explore rugged landscapes perfect for trekking, diving, and adventure tourism.',
    'Experience heart-racing activities in stunning natural settings.',
  ],
};

/**
 * Generate a personalized reason for recommending a country
 * @param countryName Name of the country
 * @param interests User's travel interests
 * @returns Personalized recommendation reason
 */
export function generateReason(
  countryName: string,
  interests: TravelInterest[]
): string {
  if (interests.length === 0) {
    return `${countryName} offers diverse experiences for all types of travelers.`;
  }

  // Pick the primary interest (first selected)
  const primaryInterest = interests[0];
  const templates = REASON_TEMPLATES[primaryInterest];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  return randomTemplate;
}
