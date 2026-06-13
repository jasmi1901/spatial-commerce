import { Button3D } from '../../components/ui/ThreeDButton';

interface LandingOverlayProps {
  /** Advance from the pre-landing into the showroom (scrolls to UI reveal). */
  onEnter: () => void;
}

// Pre-landing — the cinematic first screen (BRAIN.md Pillar 1: Cinematic Landing).
// Minimal interface, strong restrained typography, atmospheric, a scroll indicator
// and an Enter action. No product grids or heavy navigation — landing is emotional,
// not transactional. Reuses the existing type/colour tokens and Button3D.
export function LandingOverlay({ onEnter }: LandingOverlayProps) {
  return (
    // pointer-events-none so drags/zoom pass straight through to the 3D; only the
    // Enter button opts back in (a tiny, intentional target).
    <div className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
      {/* Dark scrim — the showroom stays faintly visible behind the pre-landing. */}
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative flex flex-col items-center gap-7">
        <p className="text-[0.7rem] lg:text-xs tracking-[0.45em] uppercase opacity-60">
          Spatial Commerce
        </p>
        <h1 className="font-display max-w-3xl text-4xl font-light leading-tight tracking-tight text-shadow-sm lg:text-7xl">
          A showroom you move through
        </h1>
        <p className="max-w-md text-sm leading-relaxed opacity-60 lg:text-base">
          Not a page to browse — an atmosphere to enter. Discover objects, stories,
          and craft through movement and light.
        </p>
        <Button3D type="button" onClick={onEnter} className="mt-2 rounded-2xl px-10 pointer-events-auto">
          Enter
        </Button3D>
        <div className="mt-6 flex flex-col items-center gap-2 text-[0.7rem] tracking-[0.3em] uppercase opacity-50">
          <span>Scroll to begin</span>
          <span className="animate-floaty">&#8595;</span>
        </div>
      </div>
    </div>
  );
}
