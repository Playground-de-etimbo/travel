import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchableCountryList } from './SearchableCountryList';
import type { Country } from '@/types';

interface AddCountryModalProps {
  open: boolean;
  onClose: () => void;
  countries: Country[];
  beenTo: string[];
  onAddCountry: (code: string) => void;
  preSelectedCountry?: string;
}

export function AddCountryModal({
  open,
  onClose,
  countries,
  beenTo,
  onAddCountry,
  preSelectedCountry,
}: AddCountryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] sm:h-auto p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle>Add Country</DialogTitle>
            <DialogDescription>
              Search and select countries you've visited
            </DialogDescription>
          </DialogHeader>
        </div>
        <SearchableCountryList
          countries={countries}
          beenTo={beenTo}
          onAddCountry={onAddCountry}
          preSelectedCountry={preSelectedCountry}
        />
      </DialogContent>
    </Dialog>
  );
}
