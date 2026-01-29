import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  soundMuted: boolean;
  onToggleSound: () => void;
  onClearSession: () => void;
};

export const Header = ({ soundMuted, onToggleSound, onClearSession }: HeaderProps) => {
  return (
    <header className="absolute top-6 left-0 right-0 z-10 px-8 pointer-events-none">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-start">
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
            {soundMuted ? 'Sound off' : 'Sound on'}
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
            Start over
          </Button>
        </div>

        <div className="flex flex-col items-center text-center">
          <svg
            className="w-full max-w-[520px] h-16 text-gray-800 -mb-1"
            viewBox="0 0 520 80"
            role="img"
            aria-label="Country Crush"
          >
            <title>Country Crush</title>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              stroke="#ffffff"
              strokeWidth="10"
              paintOrder="stroke fill"
              strokeLinejoin="round"
              style={{ fontFamily: 'Nunito, sans-serif', fontSize: 56, fontWeight: 800, letterSpacing: 2 }}
            >
              COUNTRY CRUSH
            </text>
          </svg>
          <p
            className="text-sm font-medium tracking-[0.12em] text-gray-800 mt-0 tagline-entrance"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              textShadow: '0 1px 3px rgba(255, 255, 255, 0.8), 0 2px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            Where have you been? Where will you go?
          </p>
        </div>

        <Button
          asChild
          variant="default"
          size="lg"
          className="h-9 rounded-full px-5 pointer-events-auto justify-self-end"
        >
          <a href="https://buymeacoffee.com/" target="_blank" rel="noreferrer">
            <span className="mr-1.5">☕</span>
            <span>Buy me a coffee</span>
          </a>
        </Button>
      </div>
    </header>
  );
};
