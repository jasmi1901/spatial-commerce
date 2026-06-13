import { useEffect, useRef } from 'react';
import type Lenis from 'lenis';
import type { ExperienceState } from '../lib/experience';
import {
  currentStopIndex,
  sequencePositionForProgress,
  stateForProgress,
} from '../lib/experience/journeySegments';
import { tourSheet } from '../lib/theatre/project';

interface UseScrollJourneyOptions {
  /** Active only during the cinematic spine; suspended in Explore / ProductFocus / Cart. */
  enabled: boolean;
  /** Called when scroll crosses into a new state bucket. */
  onState: (next: ExperienceState) => void;
  /**
   * Called every scroll frame with normalized progress (0→1). Use for continuous,
   * motion-tied fades (landing overlay out, UI in) — keep it imperative (refs /
   * style) to avoid re-rendering React at 60fps.
   */
  onProgress?: (progress: number) => void;
  /** Called when scroll crosses into a new journey stop (gated — not per frame). */
  onStopIndex?: (index: number) => void;
}

// Bridges scroll → the cinematic journey, honoring the BRAIN.md responsibility
// split: Lenis owns scroll; this hook maps scroll progress to (1) the Theatre
// playhead (which drives the camera) and (2) the discrete ExperienceState bucket.
// It never touches the camera directly — the camera damps toward the playhead pose.
export function useScrollJourney(
  lenis: Lenis | null,
  { enabled, onState, onProgress, onStopIndex }: UseScrollJourneyOptions,
): void {
  // Avoids calling onState/onStopIndex every scroll frame — only on change (60fps guard).
  const lastState = useRef<ExperienceState | null>(null);
  const lastStopIndex = useRef<number>(-1);

  useEffect(() => {
    if (!lenis || !enabled) return;

    const apply = (progress: number) => {
      tourSheet.sequence.position = sequencePositionForProgress(progress);
      onProgress?.(progress);
      const next = stateForProgress(progress);
      if (next !== lastState.current) {
        lastState.current = next;
        onState(next);
      }
      const stopIndex = currentStopIndex(progress);
      if (stopIndex !== lastStopIndex.current) {
        lastStopIndex.current = stopIndex;
        onStopIndex?.(stopIndex);
      }
    };

    const handleScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      apply(limit > 0 ? scroll / limit : 0);
    };

    lenis.on('scroll', handleScroll);
    // Sync immediately so fades/camera reflect the current scroll on (re)enable.
    apply(lenis.progress ?? 0);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, enabled, onState, onProgress, onStopIndex]);
}
