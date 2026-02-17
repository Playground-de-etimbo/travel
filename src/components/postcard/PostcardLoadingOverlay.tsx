import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const STEPS = [
  { emoji: '💌', phrase: 'Licking the stamp...' },
  { emoji: '🔏', phrase: 'Pressing the seal...' },
  { emoji: '📮', phrase: 'Dropping in the mailbox...' },
  { emoji: '🏤', phrase: 'Sorting at the post office...' },
  { emoji: '📦', phrase: 'Loading the mail plane...' },
  { emoji: '✈️', phrase: 'Flying it across the world...' },
  { emoji: '📬', phrase: 'Special delivery incoming...' },
];

type ModalPhase = 'loading' | 'success' | 'error';

interface PostcardLoadingOverlayProps {
  open: boolean;
  phase: ModalPhase;
  errorMessage?: string | null;
  downloadUrls?: { front: string | null; back: string | null };
  onClose: () => void;
  onRetry: () => void;
}

export const PostcardLoadingOverlay = ({
  open,
  phase,
  errorMessage,
  downloadUrls,
  onClose,
  onRetry,
}: PostcardLoadingOverlayProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setStepIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || phase !== 'loading') return;
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [open, phase]);

  // All emojis revealed so far (accumulating row)
  const revealedEmojis = STEPS.slice(0, stepIndex + 1);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && phase !== 'loading') onClose(); }}>
      <DialogContent
        className={`max-w-sm text-center ${phase === 'loading' ? '[&>button]:hidden' : ''}`}
        onPointerDownOutside={(e) => {
          if (phase === 'loading') e.preventDefault();
          else onClose();
        }}
        onEscapeKeyDown={(e) => {
          if (phase === 'loading') e.preventDefault();
          else onClose();
        }}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {phase === 'loading' && (
          <>
            <DialogHeader className="items-center">
              <DialogTitle
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "Fredoka, 'Fredoka Fallback', sans-serif" }}
              >
                Creating your postcard
              </DialogTitle>
              <DialogDescription className="sr-only">
                Please wait while your postcard images are being generated.
              </DialogDescription>
            </DialogHeader>

            {/* Accumulating emoji row */}
            <div className="flex justify-center items-end gap-1 min-h-16 py-2 flex-wrap">
              {revealedEmojis.map((step, i) => {
                const isLatest = i === revealedEmojis.length - 1;
                return (
                  <span
                    key={i}
                    className={isLatest ? 'postcard-emoji-pop' : ''}
                    style={{
                      fontSize: isLatest ? '3rem' : '1.75rem',
                      lineHeight: 1,
                      transition: 'font-size 0.3s ease',
                    }}
                  >
                    {step.emoji}
                  </span>
                );
              })}
            </div>

            {/* Current phrase */}
            <p
              key={stepIndex}
              className="postcard-phrase-fade"
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: '22px',
                color: '#1a2744',
              }}
            >
              {STEPS[stepIndex].phrase}
            </p>
          </>
        )}

        {phase === 'success' && (
          <>
            <DialogHeader className="items-center">
              <DialogTitle
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "Fredoka, 'Fredoka Fallback', sans-serif" }}
              >
                Delivered!
              </DialogTitle>
              <DialogDescription className="sr-only">
                Your postcard has been downloaded successfully.
              </DialogDescription>
            </DialogHeader>

            {/* All emojis at equal size — completed journey */}
            <div className="flex justify-center items-center gap-1 py-2 flex-wrap">
              {STEPS.map((step, i) => (
                <span
                  key={i}
                  style={{ fontSize: '2rem', lineHeight: 1 }}
                >
                  {step.emoji}
                </span>
              ))}
            </div>

            <p
              className="text-base text-foreground"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              Your postcard made it through customs!
            </p>

            <DialogFooter className="sm:justify-center">
              <Button onClick={onClose} className="w-full sm:w-auto">
                Got it
              </Button>
            </DialogFooter>

            {/* Re-download fallback */}
            {(downloadUrls?.front || downloadUrls?.back) && (
              <div className="flex flex-col items-center gap-2 pt-2 border-t border-border">
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Download did not work? Manually download again:
                </p>
                <div className="flex justify-center gap-3">
                  {downloadUrls?.front && (
                    <Button variant="outline" size="sm" asChild className="gap-1.5">
                      <a href={downloadUrls.front} download="destino-postcard-front.png">
                        <Download className="w-3.5 h-3.5" />
                        Front
                      </a>
                    </Button>
                  )}
                  {downloadUrls?.back && (
                    <Button variant="outline" size="sm" asChild className="gap-1.5">
                      <a href={downloadUrls.back} download="destino-postcard-back.png">
                        <Download className="w-3.5 h-3.5" />
                        Back
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {phase === 'error' && (
          <>
            <DialogHeader className="items-center">
              <DialogTitle
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "Fredoka, 'Fredoka Fallback', sans-serif" }}
              >
                Lost in transit!
              </DialogTitle>
              <DialogDescription className="sr-only">
                Your postcard download failed. You can try again.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <span style={{ fontSize: '4rem', lineHeight: 1 }}>📪</span>
            </div>

            <p
              className="text-base text-foreground"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              Your postcard got lost somewhere over the Pacific.
            </p>

            {errorMessage && (
              <p className="text-xs text-muted-foreground">{errorMessage}</p>
            )}

            <DialogFooter className="sm:justify-center gap-2">
              <Button onClick={onRetry} className="w-full sm:w-auto">
                Try Again
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
