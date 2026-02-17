import { memo } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EarthIcon } from './EarthIcon';

type HeaderProps = {
  soundMuted: boolean;
  onToggleSound: () => void;
  onClearSession: () => void;
};

const HeaderComponent = ({ soundMuted, onToggleSound, onClearSession }: HeaderProps) => {
  return (
    <header className="absolute top-6 left-0 right-0 z-10 px-4 md:px-8 pointer-events-none">
      {/* Mobile layout: text left, buttons right */}
      <div className="md:hidden flex justify-between items-center w-full">
        <div className="flex items-center gap-2.5">
          <EarthIcon size={32} className="text-foreground flex-shrink-0" />

          {/* Light mode text */}
          <span
            className="text-[28px] font-extrabold tracking-[1px] leading-none block dark:hidden"
            style={{
              fontFamily: "'Nunito', 'Nunito Fallback', sans-serif",
              color: 'hsl(230 15% 15%)',
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6)',
            }}
          >
            DESTINO
          </span>
          {/* Dark mode text */}
          <span
            className="text-[28px] font-extrabold tracking-[1px] leading-none hidden dark:block"
            style={{
              fontFamily: "'Nunito', 'Nunito Fallback', sans-serif",
              color: 'hsl(225 20% 90%)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 0, 0, 0.4)',
            }}
          >
            DESTINO
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onToggleSound}
            aria-pressed={soundMuted}
            aria-label={soundMuted ? 'Sound off' : 'Sound on'}
            className="h-9 rounded-full px-3 text-xs font-semibold"
          >
            {soundMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSession}
            className="h-9 rounded-full px-3 text-xs font-semibold"
            aria-label="Clear session and start over"
          >
            <RotateCcw />
          </Button>
          <Button
            asChild
            variant="default"
            size="sm"
            className="h-9 rounded-full px-3 pointer-events-auto"
          >
            <a href="https://buymeacoffee.com/etimbo" target="_blank" rel="noreferrer">
              <span>☕</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Desktop layout: buttons left, text center, coffee right */}
      <div className="hidden md:grid w-full grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-2 pointer-events-auto justify-self-start">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onToggleSound}
            aria-pressed={soundMuted}
            aria-label={soundMuted ? 'Sound off' : 'Sound on'}
            className="h-9 rounded-full px-3 text-xs font-semibold"
          >
            {soundMuted ? <VolumeX /> : <Volume2 />}
            <span>{soundMuted ? 'Sound off' : 'Sound on'}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSession}
            className="h-9 rounded-full px-3 text-xs font-semibold"
            aria-label="Clear session and start over"
          >
            <RotateCcw />
            <span>Start over</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <EarthIcon size={56} className="text-foreground flex-shrink-0" />
          <div className="flex flex-col items-start">
            {/* Light mode text */}
            <span
              className="text-[42px] font-extrabold tracking-[2px] leading-none block dark:hidden"
              style={{
                fontFamily: "'Nunito', 'Nunito Fallback', sans-serif",
                color: 'hsl(230 15% 15%)',
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6)',
              }}
            >
              DESTINO
            </span>
            {/* Dark mode text */}
            <span
              className="text-[42px] font-extrabold tracking-[2px] leading-none hidden dark:block"
              style={{
                fontFamily: "'Nunito', 'Nunito Fallback', sans-serif",
                color: 'hsl(225 20% 90%)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 0, 0, 0.4)',
              }}
            >
              DESTINO
            </span>
            <p className="hidden md:block text-sm font-medium text-foreground -mt-2">
              Where on earth have you been?
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="default"
          size="sm"
          className="h-9 rounded-full px-3 pointer-events-auto justify-self-end"
        >
          <a href="https://buymeacoffee.com/etimbo" target="_blank" rel="noreferrer">
            <span>☕</span>
            <span>Buy me a coffee</span>
          </a>
        </Button>
      </div>
    </header>
  );
};

// Prevent Header re-renders during logo animation
// Re-renders cause layout shifts that interrupt animations on iOS Safari
export const Header = memo(HeaderComponent);
