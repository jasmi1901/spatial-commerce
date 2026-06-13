import { useEffect } from 'react';
import { tourSheet } from '../../lib/theatre/project';
import { TOUR_LENGTH } from './tourStops';

interface TourControllerProps {
  /**
   * Hands-free auto-play of the tour sequence. Default false: the scroll journey
   * (useScrollJourney) is the sole writer of the playhead, so this stays inert to
   * avoid dual writers. Phase 4 enables it for an optional "play tour" affordance.
   */
  autoPlay?: boolean;
}

// Drives the Theatre.js sheet playhead when auto-play is requested. Lives outside
// the R3F Canvas — it controls the sheet; <TheatreCamera> in the scene reads the
// playhead and applies the resulting pose to the camera.
export function TourController({ autoPlay = false }: TourControllerProps) {
  useEffect(() => {
    if (!autoPlay) return;
    const sequence = tourSheet.sequence;
    sequence.position = 0;
    // Rate < 1 for slow, premium pacing (BRAIN.md camera philosophy).
    void sequence.play({ iterationCount: 1, range: [0, TOUR_LENGTH], rate: 0.6 });
    return () => {
      sequence.pause();
    };
  }, [autoPlay]);

  return null;
}
