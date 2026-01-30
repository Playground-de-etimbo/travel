type CountrySoundType = 'add' | 'remove' | 'pan';

let audioContext: AudioContext | null = null;
let muted = false;

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
  if (muted) return;
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
  } else if (type === 'remove') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.55);
  } else if (type === 'pan') {
    // Grinding ball roller sound: layered sawtooth + filtered noise
    // Duration: 800ms with fade-out

    // Primary oscillator: low sawtooth for grinding texture
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(65, now + 0.8); // Slow down

    // Gain envelope: fade out over duration
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.05); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.4); // Sustain
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8); // Fade out

    // Low-pass filter for muffled, mechanical character
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.Q.setValueAtTime(2, now);

    osc.connect(filter);
    filter.connect(gain);

    osc.start(now);
    osc.stop(now + 0.85);
  }

  if (type !== 'pan') {
    osc.connect(gain);
    gain.connect(context.destination);
  } else {
    gain.connect(context.destination);
  }
};

export const setSoundMuted = (nextMuted: boolean) => {
  muted = nextMuted;
};

export const getSoundMuted = () => muted;
