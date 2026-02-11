import { useRef, useState, useCallback, useEffect } from 'react';
import { Download, Share2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostcardFront } from './PostcardFront';
import { PostcardBack } from './PostcardBack';
import { usePostcardStats } from '@/hooks/usePostcardStats';
import type { Country } from '@/types/country';

interface PostcardSectionProps {
  countries: Country[];
  beenTo: string[];
}

const EXPORT_SANITIZE_STYLE = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    backdrop-filter: none !important;
  }
  * {
    filter: none !important;
  }
`;

// Mobile device detection - includes iPad in desktop mode
const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;

  // Check user agent
  const userAgent = navigator.userAgent;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // iPadOS 13+ reports as Mac, so check for touch support + Mac
  const isIPadOS = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;

  const isMobile = isMobileUA || isIPadOS;

  console.log('[Postcard] Device detection:', {
    userAgent,
    isMobileUA,
    isIPadOS,
    maxTouchPoints: navigator.maxTouchPoints,
    finalResult: isMobile,
  });

  return isMobile;
};

// Check if Web Share API Level 2 (files) is supported
const canShareFiles = () => {
  if (typeof navigator === 'undefined' || !navigator.share) {
    console.log('[Postcard] Share not available: navigator.share missing');
    return false;
  }

  // If canShare doesn't exist, we can't verify - safer to try and see
  if (!navigator.canShare) {
    console.log('[Postcard] navigator.canShare not available, will attempt share');
    return true;
  }

  try {
    // Test with a dummy file
    const canShare = navigator.canShare({
      files: [new File([''], 'test.png', { type: 'image/png' })],
    });
    console.log('[Postcard] canShareFiles test result:', canShare);
    return canShare;
  } catch (error) {
    console.log('[Postcard] canShareFiles test failed:', error);
    return false;
  }
};

export const PostcardSection = ({ countries, beenTo }: PostcardSectionProps) => {
  type HtmlToImageToBlob = (typeof import('html-to-image'))['toBlob'];

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const toBlobRef = useRef<HtmlToImageToBlob | null>(null);
  const toBlobPromiseRef = useRef<Promise<HtmlToImageToBlob> | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('Wanderer');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [manualDownloads, setManualDownloads] = useState<{
    front: string | null;
    back: string | null;
  }>({ front: null, back: null });

  // Pre-cached images for iOS share (iOS requires share to be called synchronously with user gesture)
  const [cachedImages, setCachedImages] = useState<{
    front: Blob | null;
    back: Blob | null;
    isReady: boolean;
  }>({ front: null, back: null, isReady: false });

  const stats = usePostcardStats(countries, beenTo);
  const loadToBlob = useCallback(async (): Promise<HtmlToImageToBlob> => {
    if (toBlobRef.current) {
      return toBlobRef.current;
    }

    if (!toBlobPromiseRef.current) {
      toBlobPromiseRef.current = import('html-to-image')
        .then((mod) => {
          toBlobRef.current = mod.toBlob;
          return mod.toBlob;
        })
        .catch((error) => {
          toBlobPromiseRef.current = null;
          throw error;
        });
    }

    return toBlobPromiseRef.current;
  }, []);

  const waitForNextPaint = useCallback(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }),
    [],
  );

  useEffect(() => {
    return () => {
      if (manualDownloads.front) URL.revokeObjectURL(manualDownloads.front);
      if (manualDownloads.back) URL.revokeObjectURL(manualDownloads.back);
    };
  }, [manualDownloads]);

  useEffect(() => {
    const onFirstScroll = () => {
      void loadToBlob();
      window.removeEventListener('scroll', onFirstScroll);
    };

    window.addEventListener('scroll', onFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, [loadToBlob]);

  // Pre-generate images for mobile devices (iOS requires synchronous share call)
  useEffect(() => {
    const shouldPreGenerate = isMobileDevice() && canShareFiles();

    if (!shouldPreGenerate) return;

    // Clear cache and regenerate when data changes
    setCachedImages({ front: null, back: null, isReady: false });

    const generateImages = async () => {
      try {
        // Wait for initial render to complete
        await new Promise((r) => setTimeout(r, 1000));

        if (!frontRef.current || !backRef.current) return;

        console.log('[Postcard] Pre-generating images for iOS...');

        const frontBlob = await captureCard(frontRef.current, '#f5f0e8');
        await new Promise((r) => setTimeout(r, 300));
        const backBlob = await captureCard(backRef.current, '#ffffff');

        setCachedImages({
          front: frontBlob,
          back: backBlob,
          isReady: true,
        });

        console.log('[Postcard] Images pre-generated successfully');
      } catch (error) {
        console.error('[Postcard] Pre-generation failed:', error);
        // Not a critical error - we'll fall back to on-demand generation
      }
    };

    generateImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beenTo, userName]); // Regenerate when data changes, captureCard is stable

  const triggerDownload = useCallback((href: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = href;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const injectSanitizeStyle = () => {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-postcard-export', 'true');
    styleEl.textContent = EXPORT_SANITIZE_STYLE;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  };

  const assertBlobNotBlank = async (blob: Blob) => {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context for blank check.');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const sampleCols = 24;
    const sampleRows = 24;
    const stepX = Math.max(1, Math.floor(canvas.width / sampleCols));
    const stepY = Math.max(1, Math.floor(canvas.height / sampleRows));
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let firstR = -1, firstG = -1, firstB = -1, firstA = -1;
    let varied = false;
    for (let y = 0; y < canvas.height && !varied; y += stepY) {
      for (let x = 0; x < canvas.width && !varied; x += stepX) {
        const i = (y * canvas.width + x) * 4;
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        if (firstR === -1) {
          firstR = r; firstG = g; firstB = b; firstA = a;
        } else if (
          Math.abs(r - firstR) > 2 ||
          Math.abs(g - firstG) > 2 ||
          Math.abs(b - firstB) > 2 ||
          Math.abs(a - firstA) > 2
        ) {
          varied = true;
        }
      }
    }
    if (!varied) {
      throw new Error('Capture result appears blank (uniform pixels).');
    }
  };

  const flattenBlobWithBackground = async (blob: Blob, backgroundColor: string) => {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      throw new Error('Could not create PNG export context.');
    }
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (!result) {
          reject(new Error('Failed to create image blob for download.'));
          return;
        }
        resolve(result);
      }, 'image/png');
    });
  };

  const captureCard = useCallback(
    async (element: HTMLElement, backgroundColor: string) => {
      const removeSanitizeStyle = injectSanitizeStyle();
      try {
        const toBlob = await loadToBlob();
        const options = { pixelRatio: 3, backgroundColor, cacheBust: true };

        // First render warms font/image caches (documented html-to-image behavior)
        await toBlob(element, options);
        const rawBlob = await toBlob(element, options);

        if (!rawBlob) throw new Error('html-to-image returned null.');
        await assertBlobNotBlank(rawBlob);
        return flattenBlobWithBackground(rawBlob, backgroundColor);
      } finally {
        removeSanitizeStyle();
      }
    },
    [loadToBlob],
  );

  const shareImages = useCallback(
    async (blobs: { front?: Blob; back?: Blob }) => {
      if (!navigator.share) return false;

      try {
        const files: File[] = [];

        if (blobs.front) {
          files.push(
            new File([blobs.front], 'destino-postcard-front.png', {
              type: 'image/png',
            }),
          );
        }

        if (blobs.back) {
          files.push(
            new File([blobs.back], 'destino-postcard-back.png', {
              type: 'image/png',
            }),
          );
        }

        if (files.length === 0) return false;

        await navigator.share({
          files,
          title: 'My Destino Postcard',
          text: `I've explored ${stats.visitedCount} countries across ${stats.regionCount} regions!`,
        });

        // Success toast
        const cardLabel =
          files.length === 2
            ? 'both postcards'
            : files.length === 1 && blobs.front
              ? 'postcard front'
              : 'postcard back';

        toast.success('Postcard shared!', {
          description: `Saved ${cardLabel} to your photo library.`,
        });

        return true;
      } catch (error) {
        // AbortError means user cancelled, not a real error
        if (error instanceof Error && error.name === 'AbortError') {
          return false;
        }
        console.error('Share failed:', error);
        return false;
      }
    },
    [stats.visitedCount, stats.regionCount],
  );

  // Special handler for iOS that uses pre-cached images for immediate share
  const handleDownloadWithImmediateShare = useCallback(async () => {
    setIsDownloading(true);
    setShowNameModal(false);
    setDownloadError(null);

    try {
      let frontBlob = cachedImages.front;
      let backBlob = cachedImages.back;

      // If images aren't cached yet, capture them now
      if (!cachedImages.isReady) {
        toast.info('Preparing postcard...', { duration: 2000 });

        // Wait for name to render
        await waitForNextPaint();

        // Capture images
        frontBlob = frontRef.current
          ? await captureCard(frontRef.current, '#f5f0e8')
          : null;

        await new Promise((r) => setTimeout(r, 300));

        backBlob = backRef.current
          ? await captureCard(backRef.current, '#ffffff')
          : null;
      }

      // Try to share the images
      try {
        const files: File[] = [];

        if (frontBlob) {
          files.push(
            new File([frontBlob], 'destino-postcard-front.png', {
              type: 'image/png',
            }),
          );
        }

        if (backBlob) {
          files.push(
            new File([backBlob], 'destino-postcard-back.png', {
              type: 'image/png',
            }),
          );
        }

        if (files.length > 0 && navigator.share) {
          console.log('[Postcard] 📤 Calling navigator.share with', files.length, 'files');

          // This is the critical call - it should happen as quickly as possible after the user click
          await navigator.share({
            files,
            title: 'My Destino Postcard',
            text: `I've explored ${stats.visitedCount} countries across ${stats.regionCount} regions!`,
          });

          console.log('[Postcard] ✅ navigator.share succeeded');
          toast.success('Postcard shared!', {
            description: 'Select "Save Image" or "Add to Photos" from the share menu.',
          });
        } else {
          console.log('[Postcard] ⚠️ Skipping share:', {
            filesCount: files.length,
            hasNavigatorShare: !!navigator.share,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // User cancelled - that's fine
          toast.info('Share cancelled');
        } else {
          console.error('Share failed:', error);
          // Fall back to download
          const nextManualDownloads = {
            front: frontBlob ? URL.createObjectURL(frontBlob) : null,
            back: backBlob ? URL.createObjectURL(backBlob) : null,
          };

          setManualDownloads((previous) => {
            if (previous.front) URL.revokeObjectURL(previous.front);
            if (previous.back) URL.revokeObjectURL(previous.back);
            return nextManualDownloads;
          });

          if (nextManualDownloads.front) {
            triggerDownload(nextManualDownloads.front, 'destino-postcard-front.png');
          }
          if (nextManualDownloads.back) {
            triggerDownload(nextManualDownloads.back, 'destino-postcard-back.png');
          }

          toast.success('Downloading postcards', {
            description: 'Share failed, downloading images instead.',
          });
        }
      }
    } catch (error) {
      console.error('Postcard preparation failed:', error);
      setDownloadError(
        error instanceof Error
          ? error.message
          : 'Unknown error while creating postcard image.',
      );
      toast.error('Postcard preparation failed', {
        description: 'Please try again. If this keeps happening, reload the page.',
      });
    } finally {
      setIsDownloading(false);
    }
  }, [cachedImages, captureCard, triggerDownload, stats, waitForNextPaint]);

  const handleDownload = useCallback(
    async (side?: 'front' | 'back') => {
      setIsDownloading(true);
      setShowNameModal(false);
      setDownloadError(null);

      const isMobile = isMobileDevice();
      const canShare = canShareFiles();
      const shouldShare = isMobile && canShare;

      let downloadedCount = 0;
      const nextManualDownloads = {
        front: null as string | null,
        back: null as string | null,
      };

      try {
        let frontBlob: Blob | null = null;
        let backBlob: Blob | null = null;

        // Capture based on side parameter (for dropdown) or both (default)
        const captureFront = !side || side === 'front';
        const captureBack = !side || side === 'back';

        if (captureFront && frontRef.current) {
          frontBlob = await captureCard(frontRef.current, '#f5f0e8');
          nextManualDownloads.front = URL.createObjectURL(frontBlob);
          downloadedCount += 1;
        }

        // Small delay between captures
        if (captureFront && captureBack) {
          await new Promise((r) => setTimeout(r, 500));
        }

        if (captureBack && backRef.current) {
          backBlob = await captureCard(backRef.current, '#ffffff');
          nextManualDownloads.back = URL.createObjectURL(backBlob);
          downloadedCount += 1;
        }

        // Update manual download links
        setManualDownloads((previous) => {
          if (previous.front) URL.revokeObjectURL(previous.front);
          if (previous.back) URL.revokeObjectURL(previous.back);
          return nextManualDownloads;
        });

        // Mobile: Try native share first
        if (shouldShare) {
          const shared = await shareImages({
            front: frontBlob || undefined,
            back: backBlob || undefined,
          });

          // If share was successful, we're done
          if (shared) {
            setIsDownloading(false);
            return;
          }
          // If share failed/cancelled, fall through to download
        }

        // Desktop or share fallback: Trigger downloads
        if (nextManualDownloads.front) {
          triggerDownload(nextManualDownloads.front, 'destino-postcard-front.png');
        }
        if (nextManualDownloads.back) {
          triggerDownload(nextManualDownloads.back, 'destino-postcard-back.png');
        }

        // Success toast for download
        if (!shouldShare) {
          toast.success('Postcard download started', {
            description:
              downloadedCount === 2
                ? 'Downloading both postcard sides.'
                : downloadedCount === 1
                  ? `Downloading postcard ${side || 'image'}.`
                  : 'Downloading postcard.',
          });
        }
      } catch (error) {
        console.error('Postcard download failed:', error);
        setDownloadError(
          error instanceof Error
            ? error.message
            : 'Unknown error while creating postcard image.',
        );
        toast.error('Postcard download failed', {
          description: 'Please try again. If this keeps happening, reload the page.',
        });
      } finally {
        setIsDownloading(false);
      }
    },
    [captureCard, triggerDownload, shareImages, stats],
  );

  const handleDownloadClick = async () => {
    const isMobile = isMobileDevice();
    const canShare = canShareFiles();

    console.log('[Postcard] handleDownloadClick called:', {
      isMobile,
      canShare,
      hasNavigatorShare: !!navigator.share,
      isSecureContext: window.isSecureContext,
      userAgent: navigator.userAgent,
    });

    // Mobile with share support: Set name and trigger download WITH share immediately
    if (isMobile && canShare) {
      console.log('[Postcard] ✅ Taking mobile share path');
      setUserName('Wanderer');
      // Don't await here - start download in background and share immediately
      handleDownloadWithImmediateShare();
      return;
    }

    // Mobile without share or desktop: Use existing flow
    if (isMobile) {
      console.log('[Postcard] ⚠️ Mobile detected but canShare=false, using fallback');
      setUserName('Wanderer');
      await waitForNextPaint();
      await handleDownload();
      return;
    }

    // Desktop: Show name modal
    console.log('[Postcard] 💻 Using desktop path');
    setShowNameModal(true);
  };

  const handleNameSubmit = async () => {
    const name = nameInput.trim() || 'Wanderer';
    setUserName(name);
    await waitForNextPaint();
    await handleDownload();
  };

  const handleSkip = async () => {
    setUserName('Wanderer');
    await waitForNextPaint();
    await handleDownload();
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: 'My Destino Postcard',
        text: `I've explored ${stats.visitedCount} countries across ${stats.regionCount} regions!`,
        url: window.location.href,
      });
    } catch {
      // User cancelled share
    }
  };

  const canShareLink = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section id="passport" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        {/* CTA Header */}
        <div className="text-center mb-12 postcard-section-enter">
          <span
            className="eyebrow-postcard text-sm font-semibold uppercase tracking-wider block"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Your Journey in Print
          </span>
          <h2
            className="text-5xl font-extrabold mt-4 mb-2 tracking-tight leading-tight text-foreground"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Destino Postcard
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-4">
            A keepsake of everywhere you&apos;ve been. Download and share your
            postcard.
          </p>
          <ChevronDown className="w-5 h-5 mx-auto text-muted-foreground animate-bounce" />
        </div>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          <div className="postcard-card-enter">
            <PostcardFront
              cardRef={frontRef}
              visitedCount={stats.visitedCount}
              percentExplored={stats.percentExplored}
              regionCount={stats.regionCount}
              totalRegions={stats.totalRegions}
              flagEmojis={stats.flagEmojis}
              beenTo={beenTo}
              languageCount={stats.languageCount}
              currencyCount={stats.currencyCount}
            />
          </div>
          <div className="postcard-card-enter">
            <PostcardBack
              cardRef={backRef}
              visitedCount={stats.visitedCount}
              visitedCountries={stats.visitedCountries}
              userName={userName}
            />
          </div>
        </div>

        {/* Download controls */}
        <div className="mt-8">
          <div className="flex justify-center gap-3">
            {(() => {
              const isMobile = isMobileDevice();
              const canShare = canShareFiles();
              const shouldUseShareAPI = isMobile && canShare;

              // Mobile with multi-file share support: Save Postcards button
              if (shouldUseShareAPI) {
              const imagesReady = cachedImages.isReady;
              return (
                <>
                  <Button
                    onClick={handleDownloadClick}
                    disabled={isDownloading}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? 'Preparing...' : 'Save Postcards'}
                  </Button>
                  {!imagesReady && !isDownloading && (
                    <span className="text-xs text-muted-foreground block mt-2">
                      Preparing images...
                    </span>
                  )}
                  {canShareLink && (
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share this site
                    </Button>
                  )}
                </>
              );
              }

              // Mobile without multi-file share: Dropdown to choose side
              if (isMobile && typeof navigator.share !== 'undefined') {
              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button disabled={isDownloading} className="gap-2">
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Preparing...' : 'Save Postcards'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setUserName('Wanderer');
                          waitForNextPaint().then(() => handleDownload('front'));
                        }}
                      >
                        Save Front Side
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setUserName('Wanderer');
                          waitForNextPaint().then(() => handleDownload('back'));
                        }}
                      >
                        Save Back Side
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {canShareLink && (
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share this site
                    </Button>
                  )}
                </>
              );
              }

              // Mobile fallback (no Web Share API): Show download with manual links
              if (isMobile) {
              return (
                <>
                  <Button
                    onClick={handleDownloadClick}
                    disabled={isDownloading}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? 'Preparing...' : 'Download Images'}
                  </Button>
                  {!window.isSecureContext && (
                    <span className="text-xs text-muted-foreground mt-2 block">
                      Note: Web Share requires HTTPS
                    </span>
                  )}
                </>
              );
              }

              // Desktop: Download button (existing behavior)
              return (
              <>
                <Button
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'Preparing...' : 'Save Postcards'}
                </Button>
                {canShareLink && (
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share this site
                  </Button>
                )}
              </>
            );
            })()}
          </div>

          {/* Help text for iOS users */}
          {(() => {
            const isMobile = isMobileDevice();
            const canShare = canShareFiles();
            const shouldUseShareAPI = isMobile && canShare;

            if (shouldUseShareAPI && !isDownloading) {
              return (
                <p className="text-xs text-muted-foreground text-center mt-3 max-w-sm mx-auto">
                  Tip: After tapping "Save Postcards", select "Save Image" from the share menu to add to your Photos.
                </p>
              );
            }
            return null;
          })()}
        </div>

        {(manualDownloads.front || manualDownloads.back) && (
          <div className="flex flex-wrap justify-center gap-2 mt-3 text-sm">
            <span className="text-muted-foreground">
              If download did not start:
            </span>
            {manualDownloads.front && (
              <a
                href={manualDownloads.front}
                download="destino-postcard-front.png"
                className="underline text-accent"
              >
                Download front
              </a>
            )}
            {manualDownloads.back && (
              <a
                href={manualDownloads.back}
                download="destino-postcard-back.png"
                className="underline text-accent"
              >
                Download back
              </a>
            )}
          </div>
        )}
        {downloadError && (
          <p className="mt-2 text-sm text-destructive text-center">
            Download error: {downloadError}
          </p>
        )}

        {/* Name modal */}
        <Dialog open={showNameModal} onOpenChange={setShowNameModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Personalize Your Postcard</DialogTitle>
              <DialogDescription>
                Add your name to the postcard sign-off. You can skip to use
                &quot;Wanderer&quot;.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Wanderer"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleSkip}>
                Skip
              </Button>
              <Button onClick={handleNameSubmit}>Save & Download</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
