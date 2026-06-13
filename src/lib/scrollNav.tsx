import { createContext, useContext } from 'react';

// Button-driven tour navigation: Next/Back glide the controlled camera between
// tour stops (setLookAt). Provided by ShowroomExperience (which owns the
// CameraControls ref + stop index), consumed by ContentPanel / MobileBar.
export interface ScrollNav {
  /** Glide the camera to the next tour stop (camera + state + panel follow). */
  goToNextStop: () => void;
  /** Glide the camera to the previous tour stop. */
  goToPrevStop: () => void;
  /** End the tour: return to the pre-landing (landing framing + overlay). */
  endTour: () => void;
  /** Index of the current tour stop. */
  stopIndex: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ScrollNavContext = createContext<ScrollNav | null>(null);

export function useScrollNav(): ScrollNav {
  const ctx = useContext(ScrollNavContext);
  if (!ctx) throw new Error('useScrollNav must be used within ScrollNavContext.Provider');
  return ctx;
}
