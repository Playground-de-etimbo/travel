import type { Country } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RemoveCountryDialogProps {
  open: boolean;
  country: Country | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoveCountryDialog = ({
  open,
  country,
  onConfirm,
  onCancel,
}: RemoveCountryDialogProps) => {
  if (!country) return null;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove {country.flagEmoji} {country.countryName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {country.countryName} from your visited countries
            list. You can always add it back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
