type CountrySoundType = 'add' | 'remove';

let audioContext: AudioContext | null = null;

const getAudioContextClass = () => {
  return (
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
};

const ensureAudioContext = () => {
  if (audioContext && audioContext.state !== 'closed') return audioContext;

  const AudioContextClass = getAudioContextClass();
  if (!AudioContextClass) return null;

  audioContext = new AudioContextClass();
  return audioContext;
};

export const playCountrySound = async (type: CountrySoundType) => {
  const context = ensureAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  if (context.state === 'closed') return;

  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();

  if (type === 'add') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.2);
  } else {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  osc.connect(gain);
  gain.connect(context.destination);
};
