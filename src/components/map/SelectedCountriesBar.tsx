import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Country } from '@/types';

interface SelectedCountriesBarProps {
  countries: Country[];
  onAddClick: () => void;
}

export function SelectedCountriesBar({ countries, onAddClick }: SelectedCountriesBarProps) {
  const isEmpty = countries.length === 0;
  const maxGhosts = 8; // Number of ghost placeholders to show

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white rounded-3xl shadow-lg px-6 py-4 flex items-center gap-6 min-w-[320px] max-w-2xl">
        {/* Selected countries or ghost placeholders */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-3">
            {isEmpty ? (
              // Ghost placeholders when empty
              <div className="flex items-center gap-2">
                {Array.from({ length: maxGhosts }).map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 opacity-50"
                    style={{
                      animation: `pulse 2s ease-in-out ${index * 0.1}s infinite`,
                    }}
                  />
                ))}
              </div>
            ) : (
              // Actual country flags
              <>
                <div className="flex items-center gap-2">
                  {countries.map((country, index) => (
                    <span
                      key={country.countryCode}
                      className="text-3xl transition-all duration-200 hover:scale-110 cursor-pointer"
                      title={country.countryName}
                      style={{
                        animation: `fadeIn 200ms ease-out ${index * 50}ms both`,
                      }}
                    >
                      {country.flagEmoji}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                  {countries.length} {countries.length === 1 ? 'country' : 'countries'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Integrated Add button */}
        <Button
          onClick={onAddClick}
          size="sm"
          className="flex-shrink-0 bg-gray-800 hover:bg-gray-900 text-white rounded-full px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Add</span>
        </Button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Custom scrollbar */
        .overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
