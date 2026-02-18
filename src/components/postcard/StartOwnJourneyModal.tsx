import { MapPin, Compass, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface StartOwnJourneyModalProps {
  open: boolean;
  sharerName: string;
  onConfirm: () => void;
  onClaimMap: () => void;
  onCancel: () => void;
}

export const StartOwnJourneyModal = ({
  open,
  sharerName,
  onConfirm,
  onClaimMap,
  onCancel,
}: StartOwnJourneyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <MapPin className="h-6 w-6 text-accent-foreground" />
          </div>
          <DialogTitle className="text-center">
            You&apos;re viewing {sharerName}&apos;s map
          </DialogTitle>
          <DialogDescription className="text-center">
            Ready to make your move? Start with a blank map, or take {sharerName}&apos;s map with you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onConfirm} className="w-full gap-2">
            <Compass className="h-4 w-4" />
            Start My Own Journey
          </Button>
          <Button variant="secondary" onClick={onClaimMap} className="w-full gap-2">
            <Copy className="h-4 w-4" />
            Claim This Map as My Own
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Keep Exploring {sharerName}&apos;s Map
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
