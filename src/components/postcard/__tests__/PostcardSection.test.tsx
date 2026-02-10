import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Ref } from 'react';
import { PostcardSection } from '../PostcardSection';
import type { Country } from '@/types/country';

const {
  toBlobMock,
  toastSuccessMock,
  toastErrorMock,
} = vi.hoisted(() => ({
  toBlobMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

const anchorClickMock = vi.fn();

vi.mock('html-to-image', () => ({
  toBlob: toBlobMock,
}));

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock('@/hooks/usePostcardStats', () => ({
  usePostcardStats: () => ({
    visitedCount: 1,
    percentExplored: 0.5,
    regionCount: 1,
    totalRegions: 7,
    flagEmojis: ['🇺🇸'],
    languageCount: 1,
    currencyCount: 1,
    visitedCountries: [],
  }),
}));

vi.mock('../PostcardFront', () => ({
  PostcardFront: ({ cardRef }: { cardRef: Ref<HTMLDivElement> }) => (
    <div ref={cardRef}>front-card</div>
  ),
}));

vi.mock('../PostcardBack', () => ({
  PostcardBack: ({ cardRef }: { cardRef: Ref<HTMLDivElement> }) => (
    <div ref={cardRef}>back-card</div>
  ),
}));

const sampleCountry: Country = {
  countryCode: 'US',
  countryName: 'United States',
  continent: 'North America',
  region: 'North America',
  currencyCode: 'USD',
  currencyName: 'US Dollar',
  flagEmoji: '🇺🇸',
  description: 'Sample',
  baselineCost: 1000,
  nightlyCost: 120,
  interests: ['culture'],
};

describe('PostcardSection downloads', () => {
  const originalCreateElement = document.createElement.bind(document);
  const originalRAF = globalThis.requestAnimationFrame;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(globalThis, 'setTimeout');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    }) as typeof requestAnimationFrame;

    // Mock createImageBitmap for the new blank detection.
    // Use 2x2 so the pixel data array aligns with canvas dimensions.
    globalThis.createImageBitmap = vi.fn(() =>
      Promise.resolve({
        width: 2,
        height: 2,
        close: vi.fn(),
      } as unknown as ImageBitmap),
    );

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName.toLowerCase() === 'a') {
        (element as HTMLAnchorElement).click = anchorClickMock;
      }
      if (tagName.toLowerCase() === 'canvas') {
        const canvas = element as HTMLCanvasElement;
        // Dimensions set dynamically by production code from bitmap.width/height
        canvas.getContext = vi.fn(() => ({
          fillStyle: '',
          fillRect: vi.fn(),
          drawImage: vi.fn(),
          getImageData: vi.fn(() => ({
            // 2x2 varied pixel data so blank detection passes
            data: new Uint8ClampedArray([
              245, 240, 232, 255,  // pixel (0,0) - cream
              100, 50, 20, 255,    // pixel (1,0) - brown (varied)
              245, 240, 232, 255,  // pixel (0,1)
              100, 50, 20, 255,    // pixel (1,1)
            ]),
          })),
        })) as unknown as typeof canvas.getContext;
        canvas.toBlob = vi.fn((cb: BlobCallback) =>
          cb(new Blob(['image'], { type: 'image/png' })),
        );
      }
      return element;
    });
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    globalThis.requestAnimationFrame = originalRAF;
    vi.restoreAllMocks();
  });

  it('starts download for both postcard sides after saving name', async () => {
    toBlobMock.mockResolvedValue(new Blob(['image'], { type: 'image/png' }));

    render(<PostcardSection countries={[sampleCountry]} beenTo={['US']} />);

    await userEvent.click(
      screen.getByRole('button', { name: /download both sides/i }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /save & download/i }),
    );

    await waitFor(() => {
      // 2 cards x 2 renders (font warming + actual) = 4 calls
      expect(toBlobMock).toHaveBeenCalledTimes(4);
    });
    expect(anchorClickMock).toHaveBeenCalledTimes(2);
    expect(toastSuccessMock).toHaveBeenCalled();
    expect(toastErrorMock).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: /download front/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /download back/i })).toBeInTheDocument();
  });

  it('shows an error toast when capture fails', async () => {
    toBlobMock.mockRejectedValue(new Error('capture failed'));

    render(<PostcardSection countries={[sampleCountry]} beenTo={['US']} />);

    await userEvent.click(
      screen.getByRole('button', { name: /download both sides/i }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /save & download/i }),
    );

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled();
    });
    expect(toastSuccessMock).not.toHaveBeenCalled();
  });
});
