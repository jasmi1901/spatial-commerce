import { useCallback, useEffect, useRef, useState } from 'react';
import type CameraControlsImpl from 'camera-controls';
import { ShowroomScene } from './scenes/ShowroomScene';
import { WebGLErrorBoundary } from './components/ui/WebGLErrorBoundary';
import { TopBar } from './components/ui/TopBar';
import { Sidebar } from './components/ui/Sidebar';
import { MobileBar } from './components/ui/MobileBar';
import { ContentPanel } from './components/ui/ContentPanel';
import { MusicControl } from './components/ui/MusicControl';
import { LandingOverlay } from './features/landing/LandingOverlay';
import { SceneLoader } from './features/landing/SceneLoader';
import { PRODUCTS } from './data/products';
import { useTheme } from './lib/theme/ThemeProvider';
import { useExperience } from './lib/experience';
import { ContentProvider } from './lib/ContentContext';
import { JOURNEY_STOPS } from './features/tour/tourStops';
import { ScrollNavContext, type ScrollNav } from './lib/scrollNav';
import { ProductSelectionContext, type ProductSelection } from './lib/productSelection';
import { usePointerParallax } from './hooks/usePointerParallax';
import { useLenis } from './hooks/useLenis';

// The stop the pre-landing "Enter" glides to (UI reveal).
const REVEAL_INDEX = Math.max(0, JOURNEY_STOPS.findIndex((s) => s.id === 'ui-reveal'));

interface ShowroomExperienceProps {
  onNavigate?: (page: string) => void;
  isInformationOpen?: boolean;
}

// Composition root: the showroom world (3D) with the spatial UI overlaid.
// The 3D is directly controlled (orbit/zoom/pan, bounded); the cinematic tour is
// driven by the UI buttons gliding the camera between stops. Scroll lives on the
// UI/panels — it never drives the 3D camera (Chartogne-Taillet reference).
// Commerce, information, music & team features layer in via <ContentProvider>.
export function ShowroomExperience({
  onNavigate,
  isInformationOpen = false,
}: ShowroomExperienceProps) {
  const { isDark } = useTheme();
  const { setState } = useExperience();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const parallax = usePointerParallax(!isMobile);
  const controlsRef = useRef<CameraControlsImpl | null>(null);

  // Scroll model (page scroll, never internal):
  //  - Desktop: the overlay is pointer-events-none (3D orbit stays live); Lenis
  //    drives smooth wheel-scroll (wheel over the panel bubbles to the wrapper →
  //    Lenis scrolls; wheel over the 3D → CameraControls zooms).
  //  - Mobile: the overlay is pointer-events-auto and scrolls NATIVELY (reliable
  //    swipe-to-scroll); the 3D is view-only there (navigated by buttons). Lenis
  //    is disabled so it doesn't fight native touch scroll.
  const contentRef = useRef<HTMLDivElement>(null);
  useLenis(parallax.targetRef, contentRef, !isMobile);

  const [stopIndex, setStopIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) ?? null;

  // Glide the controlled camera to a stop (smooth setLookAt) and sync state + panel.
  const goToStop = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(JOURNEY_STOPS.length - 1, index));
      const stop = JOURNEY_STOPS[i];
      const controls = controlsRef.current;
      if (controls) {
        void controls.setLookAt(
          stop.camera[0], stop.camera[1], stop.camera[2],
          stop.lookAt[0], stop.lookAt[1], stop.lookAt[2],
          true,
        );
      }
      setStopIndex(i);
      setState(stop.state);
    },
    [setState],
  );

  const goToNextStop = useCallback(() => goToStop(stopIndex + 1), [stopIndex, goToStop]);
  const goToPrevStop = useCallback(() => goToStop(stopIndex - 1), [stopIndex, goToStop]);

  // "Enter" from the pre-landing: reveal the UI and glide into the showroom.
  const handleEnter = useCallback(() => {
    setRevealed(true);
    goToStop(REVEAL_INDEX);
  }, [goToStop]);

  // "End tour": glide back to the Welcome / "Step inside" stop (UI stays revealed).
  const endTour = useCallback(() => {
    goToStop(REVEAL_INDEX);
  }, [goToStop]);

  const nav: ScrollNav = { goToNextStop, goToPrevStop, endTour, stopIndex };
  const productSelection: ProductSelection = {
    selectedProduct,
    clearProduct: () => setSelectedProductId(null),
  };

  // Smooth fade in/out (visibility flip delayed until the opacity fade finishes).
  const revealClass = (visible: boolean) => `fade-layer ${visible ? 'is-shown' : ''}`;

  // Information modal dims the panel without unmounting it.
  const dimClass = `transition-opacity duration-300 ${
    isInformationOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
  }`;

  return (
    <ScrollNavContext.Provider value={nav}>
    <ProductSelectionContext.Provider value={productSelection}>
    <ContentProvider>
      <div
        ref={parallax.boundsRef}
        className={`w-full h-[100dvh] overflow-hidden relative transition-colors duration-700 ${
          isDark
            ? 'dark text-white bg-gradient-to-br from-neutral-900 to-black'
            : 'text-gray-900 bg-gradient-to-br from-white to-gray-200'
        }`}
        style={{ perspective: '2000px' }}
        onPointerMove={parallax.onPointerMove}
        onPointerLeave={parallax.onPointerLeave}
      >
        {/* The world — receives controlled orbit/zoom/pan; fills the viewport. */}
        <div className="absolute inset-0 z-0">
          <WebGLErrorBoundary>
            <ShowroomScene
              isDark={isDark}
              controlsRef={controlsRef}
              onSelectProduct={setSelectedProductId}
            />
          </WebGLErrorBoundary>
        </div>

        <div className={revealClass(revealed)}>
          <MobileBar onNavigate={onNavigate} />
        </div>

        {/* Ambient music — fixed control, independent of the journey state. */}
        <MusicControl />

        {/* Spatial UI overlay — pointer-events-none so the 3D stays interactive.
            Split-by-area on mobile: orbit/tap in the upper region; the panel lives
            in a lower native-scroll zone. Desktop: Lenis drives wheel-scroll.
            id="scroll-container" is the target for scrollShowroomToTop(). */}
        <div
          ref={parallax.targetRef}
          id="scroll-container"
          className={`absolute inset-0 z-10 overflow-hidden lg:overflow-y-auto no-scrollbar pointer-events-none ${revealClass(revealed)}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <TopBar />
          {isMobile ? (
            // Mobile: lower native-scroll zone (3D orbits/taps in the upper area).
            // pt pushes the panel low (its lower part tucked behind the MobileBar);
            // pb gives room to swipe it up until the bottom buttons clear the bar.
            <div
              className="pointer-events-auto absolute inset-x-0 bottom-0 top-[40dvh] overflow-y-auto no-scrollbar px-4 pt-[34dvh] pb-44 flex items-start [touch-action:pan-y] [mask-image:linear-gradient(to_bottom,transparent_0,#000_22%,#000_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,#000_22%,#000_90%,transparent_100%)]"
            >
              <div className={`w-full ${dimClass}`}>
                <ContentPanel />
              </div>
            </div>
          ) : (
            <div ref={contentRef} className="min-h-full w-full flex flex-col">
              <div className="flex-1 w-full max-w-7xl mx-auto p-12 flex flex-row justify-between items-center pointer-events-none">
                <Sidebar onNavigate={onNavigate} />
                <div className={dimClass}>
                  <ContentPanel />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pre-landing — cinematic first screen (Pillar 1). Fades out on Enter.
            pointer-events-none so it never blocks the 3D; only Enter opts in. */}
        <div className={`absolute inset-0 z-30 pointer-events-none ${revealClass(!revealed)}`}>
          <LandingOverlay onEnter={handleEnter} />
        </div>

        {/* Cinematic loader — holds until the model is ready, then reveals. */}
        <SceneLoader />
      </div>
    </ContentProvider>
    </ProductSelectionContext.Provider>
    </ScrollNavContext.Provider>
  );
}
