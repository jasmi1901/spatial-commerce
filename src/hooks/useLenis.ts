import { useEffect, useState, type RefObject } from 'react';
import Lenis from 'lenis';

// Premium smooth-scroll for the showroom's scroll surface.
// Lenis owns scroll inertia; GSAP/Theatre consume the resulting scroll position
// (see useScrollJourney). Returns the Lenis instance so other hooks can subscribe
// to its `scroll` events.
export function useLenis(
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  enabled = true,
): Lenis | null {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    // When disabled (e.g. mobile), the layer uses native scroll instead.
    if (!wrapper || !content || !enabled) return;

    const instance = new Lenis({
      wrapper,
      content,
      lerp: 0.08, // a touch smoother glide
      smoothWheel: true,
      syncTouch: true, // smooth, momentum-matched touch on mobile
    });
    setLenis(instance);

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, [wrapperRef, contentRef, enabled]);

  return lenis;
}
