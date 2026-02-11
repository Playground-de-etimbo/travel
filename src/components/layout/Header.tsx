import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EarthIcon } from './EarthIcon';

type HeaderProps = {
  soundMuted: boolean;
  onToggleSound: () => void;
  onClearSession: () => void;
};

export const Header = ({ soundMuted, onToggleSound, onClearSession }: HeaderProps) => {
  return (
    <header className="absolute top-6 left-0 right-0 z-10 px-4 md:px-8 pointer-events-none">
      {/* Mobile layout: text left, buttons right */}
      <div className="md:hidden flex justify-between items-center w-full">
        <div className="flex items-center gap-2.5">
          <EarthIcon size={32} className="text-foreground flex-shrink-0" />
          <svg
            className="h-8 text-foreground"
            viewBox="0 0 180 32"
            role="img"
            aria-label="Destino"
            style={{ filter: 'var(--header-text-shadow)' }}
          >
            <title>Destino</title>
            <text
              x="0"
              y="50%"
              textAnchor="start"
              dominantBaseline="middle"
              fill="currentColor"
              style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, fontWeight: 800, letterSpacing: 1 }}
            >
              DESTINO
            </text>
          </svg>
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
            <svg
              className="h-12 text-foreground"
              viewBox="0 0 280 60"
              role="img"
              aria-label="Destino"
              style={{ filter: 'var(--header-text-shadow)' }}
            >
              <title>Destino</title>
              <text
                x="0"
                y="50%"
                textAnchor="start"
                dominantBaseline="middle"
                fill="currentColor"
                style={{ fontFamily: 'Nunito, sans-serif', fontSize: 42, fontWeight: 800, letterSpacing: 2 }}
              >
                DESTINO
              </text>
            </svg>
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
