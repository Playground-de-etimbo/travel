import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="flex flex-col items-start text-left">
          <svg
            className="w-full max-w-[300px] h-9 text-gray-800"
            viewBox="0 0 300 36"
            role="img"
            aria-label="Destino"
          >
            <title>Destino</title>
            <text
              x="0"
              y="55%"
              textAnchor="start"
              dominantBaseline="middle"
              fill="currentColor"
              stroke="#ffffff"
              strokeWidth="6"
              paintOrder="stroke fill"
              strokeLinejoin="round"
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
            className="h-9 rounded-full pl-2 pr-2 pointer-events-auto"
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

        <div className="flex flex-col items-center text-center">
          <svg
            className="w-full max-w-[420px] h-12 text-gray-800 -mb-3"
            viewBox="0 0 420 60"
            role="img"
            aria-label="Destino"
          >
            <title>Destino</title>
            <text
              x="50%"
              y="40%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              stroke="#ffffff"
              strokeWidth="8"
              paintOrder="stroke fill"
              strokeLinejoin="round"
              style={{ fontFamily: 'Nunito, sans-serif', fontSize: 42, fontWeight: 800, letterSpacing: 2 }}
            >
              DESTINO
            </text>
          </svg>
          <p
            className="text-sm font-medium tracking-[0.12em] text-gray-800 -mt-1 tagline-entrance"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              textShadow: '0 1px 3px rgba(255, 255, 255, 0.8), 0 2px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            Where on earth have you been?
          </p>
        </div>

        <Button
          asChild
          variant="default"
          size="sm"
          className="h-9 rounded-full px-4 pointer-events-auto justify-self-end"
        >
          <a href="https://buymeacoffee.com/etimbo" target="_blank" rel="noreferrer">
            <span className="mr-1.5">☕</span>
            <span>Buy me a coffee</span>
          </a>
        </Button>
      </div>
    </header>
  );
};
